// The `all` mode, and a saved JSON report used as the input of miliastra-search (the same rendering as scripts/render-json.mjs, without the decoder).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { main } from '../src/cli.mjs';
import { validate } from '../src/present/validate.mjs';
import { root } from './helpers.mjs';

const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema', 'report.schema.json'), 'utf8'));
const G = 'test/cases/gia/', C = 'test/cases/composites/', M = 'test/cases/mounts/', L = 'test/cases/gil/';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ms-saved-'));

function cli(args) {
  const prev = process.cwd(); process.chdir(root);
  let out = '', err = '';
  try { const code = main(args, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} }); return { out, err, code }; } finally { process.chdir(prev); }
}
const save = (dir, name, args) => { const f = path.join(dir, name); const r = cli([...args, '--format', 'json']); assert.equal(r.code, 0, r.err); fs.writeFileSync(f, r.out); return f; };

// ---------- all ----------

test('all prints info, dump, refs and warns under headings of their own; code only with --with-code', () => {
  const files = [G + 'sample_2.gia', L + 'stage_3.gil'];
  const t = cli(['all', ...files, '--format', 'text']);
  assert.equal(t.code, 0, t.err);
  const heads = t.out.split('\n').filter((l) => /^# (INFO|DUMP|CODE|REFS|WARNS)$/.test(l));
  assert.deepEqual(heads, ['# INFO', '# DUMP', '# REFS', '# WARNS']);
  assert.match(t.out, /^# FILE sample_2\.gia$/m); assert.match(t.out, /^GRAPH /m); assert.match(t.out, /^# findings$/m);
  const withCode = cli(['all', ...files, '--with-code', '--format', 'text']);
  assert.deepEqual(withCode.out.split('\n').filter((l) => /^# (INFO|DUMP|CODE|REFS|WARNS)$/.test(l)), ['# INFO', '# DUMP', '# REFS', '# WARNS', '# CODE']);
  assert.match(withCode.out, /^'Both'\/\[\d+\] /m, 'the code lines are there');
  assert.doesNotMatch(t.out, /^'Both'\/\[\d+\] /m);
  for (const format of ['md', 'htm', 'markdown', 'html', 'color']) {
    const r = cli(['all', G + 'sample_2.gia', '--format', format]);
    assert.equal(r.code, 0, format); assert.match(r.out, /INFO/); assert.match(r.out, /WARNS|Warns/);
  }
});

test('all takes the options of every mode, and grep runs over the whole text', () => {
  const r = cli(['all', G + 'sample_2.gia', C + 'var_change.gia', '--kind', 'signal', '--sort-desc', '--top-graphs', '1', '--details', '--show-tag', '--all-pins', '--format', 'text']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, / class=\d+ /, '--details'); assert.match(r.out, /^signal /m); assert.doesNotMatch(r.out, /^custom_variable /m, '--kind');
  const g = cli(['all', G + 'sample_2.gia', '--search', 'signal_1', '--format', 'text']);
  assert.equal(g.code, 0);
  assert.ok(g.out.split('\n').filter(Boolean).every((l) => /signal_1/i.test(l)), 'only matching lines');
  assert.equal(cli(['all', G + 'sample_2.gia', '--search', 'zzz-nothing']).code, 1);
  assert.equal(cli(['all', G + 'sample_2.gia', '--key', 'mode']).code, 2, '--key belongs to info');
});

test('the all report: header.mode all, the list of its parts, and each part as in the single-mode report; it fits the schema', () => {
  const files = [G + 'sample_2.gia', M + 'test_mount.gil'];
  const all = JSON.parse(cli(['all', ...files, '--format', 'json']).out);
  assert.equal(all.header.mode, 'all');
  assert.deepEqual(all.all, ['info', 'dump', 'refs', 'warns']);
  assert.equal(all.code, null);
  assert.deepEqual(validate(all, schema), []);
  for (const mode of all.all) assert.deepEqual(all[mode], JSON.parse(cli([mode, ...files, '--format', 'json']).out)[mode], mode);
  const withCode = JSON.parse(cli(['all', ...files, '--with-code', '--format', 'json']).out);
  assert.deepEqual(withCode.all, ['info', 'dump', 'refs', 'warns', 'code']);
  assert.equal(withCode.header.options.with_code, true);
  assert.deepEqual(withCode.code, JSON.parse(cli(['code', ...files, '--format', 'json']).out).code, 'the code part is the payload of the code report');
  assert.deepEqual(validate(withCode, schema), []);
  assert.equal('details' in all.header.options, false, 'details is a rendering option, not in the report');
});

// ---------- a saved report as input ----------

test('a saved report of the same mode renders like the direct run, in every format, without the game files', () => {
  const dir = tmp();
  for (const [mode, extra] of [['info', ['--show-tag']], ['dump', ['--details']], ['refs', ['--sort-desc']], ['warns', ['--top-graphs', '2']], ['all', ['--show-tag', '--kind', 'signal']]]) {
    const args = [mode, G + 'sample_2.gia', C + 'var_change.gia', ...extra];
    const f = save(dir, `${mode}.json`, args);
    for (const format of ['text', 'markdown', 'html']) {
      const direct = cli([...args, '--format', format]);
      const saved = cli([mode, f, ...extra, '--format', format]);
      assert.equal(saved.code, direct.code, `${mode} ${format}`);
      assert.equal(saved.out, direct.out, `${mode} ${format}`);
      assert.equal(saved.err, direct.err, `${mode} ${format}: no warning when the options agree`);
    }
  }
});

test('any part of an all report can be asked for, as well as all itself; the others are refused', () => {
  const dir = tmp();
  const files = [G + 'sample_2.gia', C + 'var_change.gia'];
  const f = save(dir, 'all.json', ['all', ...files]);
  for (const mode of ['info', 'dump', 'refs', 'warns', 'all']) {
    assert.equal(cli([mode, f, '--format', 'text']).out, cli([mode, ...files, '--format', 'text']).out, mode);
  }
  assert.deepEqual(JSON.parse(cli(['refs', f, '--format', 'json']).out), JSON.parse(cli(['refs', ...files, '--format', 'json']).out), 'a part as JSON is the report of that mode');
  for (const mode of ['check', 'raw']) { const r = cli([mode, f]); assert.equal(r.code, 2); assert.equal(r.out, ''); assert.match(r.err, new RegExp(`${mode} cannot be rendered`)); }
  const code = cli(['code', f]); assert.equal(code.code, 2); assert.match(code.err, /without --with-code/);
});

test('a report of one mode cannot answer another mode; check and raw reports are not rendered', () => {
  const dir = tmp();
  const f = save(dir, 'info.json', ['info', G + 'sample_2.gia']);
  const r = cli(['refs', f]);
  assert.equal(r.code, 2); assert.equal(r.out, ''); assert.match(r.err, /info report, not a refs report/);
  assert.equal(cli(['all', f]).code, 2);
  for (const mode of ['check', 'raw']) {
    const g = save(dir, `${mode}.json`, [mode, G + 'sample_2.gia']);
    assert.equal(cli([mode, g]).code, 2, `${mode} from its own report`);
    assert.equal(cli(['info', g]).code, 2);
  }
});

test('code: a saved code report, or the code part of an all report, renders like the direct run; the rendering options apply to it', () => {
  const dir = tmp();
  const direct = (...extra) => cli(['code', G + 'sample_2.gia', ...extra, '--format', 'text']);
  const f = save(dir, 'code.json', ['code', G + 'sample_2.gia']);
  const all = save(dir, 'all.json', ['all', G + 'sample_2.gia', '--with-code']);
  for (const src of [f, all]) {
    assert.equal(cli(['code', src, '--format', 'text']).out, direct().out, src);
    for (const extra of [['--all-pins'], ['--all-pins', '--search', 'in#0']]) {
      const r = cli(['code', src, ...extra, '--format', 'text']), d = direct(...extra);
      assert.equal(r.out, d.out, `${src} ${extra}`); assert.equal(r.code, d.code); assert.equal(r.err, d.err, 'rendering options are not data options: no warning');
    }
  }
  const withCode = cli(['all', all, '--with-code', '--format', 'text']);
  assert.equal(withCode.code, 0); assert.equal(withCode.err, ''); assert.match(withCode.out, /^# CODE/m);
  const plain = cli(['all', all]);
  assert.equal(plain.code, 0);
  assert.match(plain.err, /warning: .*--with-code \(report: true, command line: not given\)/);
  assert.equal(cli(['dump', all]).code, 0);
  assert.equal(cli(['dump', all, '--details']).out, cli(['dump', G + 'sample_2.gia', '--details']).out, 'a part cut out of an all report renders with or without details');
  assert.doesNotMatch(cli(['dump', all]).out, / class=\d/);
});

test('options that differ from the report are named in one warning line, in both directions', () => {
  const dir = tmp();
  const f = save(dir, 'refs.json', ['refs', G + 'sample_2.gia', '--kind', 'signal', '--sort-desc']);
  const same = cli(['refs', f, '--kind', 'signal', '--sort-desc', '--lenient', '--lang', 'en']);
  assert.equal(same.err, '', '--lenient is not compared, the language by its code');
  const r = cli(['refs', f, '--top-graphs', '3', '--lang', 'DE']);
  const warnings = r.err.split('\n').filter(Boolean);
  assert.equal(warnings.length, 1, 'one line');
  assert.match(warnings[0], /^warning: /);
  for (const flag of ['--kind (report: "signal", command line: not given)', '--sort-desc (report: true, command line: not given)', '--top-graphs (report: not in the report, command line: 3)', '--lang (report: not given, command line: "DE")']) assert.ok(warnings[0].includes(flag), flag);
  assert.equal(r.code, 0, 'a warning does not stop the run');
  assert.match(cli(['refs', f, '--kind', 'timer']).err, /--kind \(report: "signal", command line: "timer"\)/);
  assert.match(cli(['refs', f, '--kind', 'signal', '--sort-desc', '--db', 'x.json']).err, /--db \(report: not given, command line: "x\.json"\)/);
  const tag = save(dir, 'info.json', ['info', G + 'sample_3.gia', '--show-tag']);
  assert.match(cli(['info', tag]).err, /--show-tag \(report: true, command line: not given\)/);
  assert.match(cli(['info', tag, '--show-tag']).out, /^uid +\d+$/m);
});

test('only one saved report at a time, and not together with game files; a folder gives its game files and ignores its reports', () => {
  const dir = tmp();
  const a = save(dir, 'a.json', ['info', G + 'sample_2.gia']), b = save(dir, 'b.json', ['info', G + 'sample_3.gia']);
  for (const args of [['info', a, b], ['info', a, G + 'sample_3.gia'], ['info', G + 'sample_3.gia', a]]) {
    const r = cli(args); assert.equal(r.code, 2, args.join(' ')); assert.equal(r.out, ''); assert.match(r.err, /on its own/);
  }
  fs.copyFileSync(path.join(root, G + 'sample_3.gia'), path.join(dir, 'real.gia'));
  const folder = cli(['info', dir, '--key', 'format']);
  assert.equal(folder.code, 0, folder.err); assert.equal(folder.out, 'gia\n', 'a.json and b.json were not picked up');
  fs.writeFileSync(path.join(dir, 'report.dat'), fs.readFileSync(a));
  assert.equal(cli(['info', path.join(dir, 'report.dat'), '--key', 'format']).out, 'gia\n', 'a report is recognized by its content, not its extension');
});

test('a report that does not fit the format is refused; --lenient reads what it can', () => {
  const dir = tmp();
  const f = save(dir, 'info.json', ['info', G + 'sample_3.gia']);
  const report = JSON.parse(fs.readFileSync(f, 'utf8'));
  delete report.info[0].classes; report.extra = 1;
  const bad = path.join(dir, 'bad.json'); fs.writeFileSync(bad, JSON.stringify(report));
  const strict = cli(['info', bad, '--key', 'format']);
  assert.equal(strict.code, 1); assert.equal(strict.out, ''); assert.match(strict.err, /does not fit schema\/report\.schema\.json/);
  const lenient = cli(['info', bad, '--key', 'format', '--lenient']);
  assert.equal(lenient.code, 0); assert.equal(lenient.out, 'gia\n');
  const noHeaderParts = path.join(dir, 'thin.json');
  fs.writeFileSync(noHeaderParts, JSON.stringify({ header: { software: 'miliastra-search', mode: 'info', files: ['x'] }, info: report.info }));
  assert.equal(cli(['info', noHeaderParts, '--key', 'format']).code, 1);
  assert.equal(cli(['info', noHeaderParts, '--key', 'format', '--lenient']).code, 0, 'missing options are taken as none');
  fs.writeFileSync(path.join(dir, 'broken.json'), '{ nope');
  assert.equal(cli(['info', path.join(dir, 'broken.json'), '--lenient']).code, 1);
  fs.writeFileSync(path.join(dir, 'other.json'), '{"hello":1}');
  assert.equal(cli(['info', path.join(dir, 'other.json'), '--lenient']).code, 1, 'not a report, however lenient');
});

test('presentation options work on a saved report: grep, --key, --output, --no-file-prefix', () => {
  const dir = tmp();
  const f = save(dir, 'info.json', ['info', G + 'sample_3.gia', L + 'stage_3.gil']);
  assert.equal(cli(['info', f, '--key', 'format']).out, 'sample_3.gia:gia\nstage_3.gil:gil\n');
  assert.equal(cli(['info', f, '--key', 'format', '--no-file-prefix']).out, 'gia\ngil\n');
  assert.equal(cli(['info', f, '--search', 'zzz-nothing']).code, 1);
  const out = path.join(dir, 'out.md');
  assert.equal(cli(['info', f, '-o', out]).code, 0);
  assert.ok(fs.readFileSync(out, 'utf8').startsWith('﻿'));
  assert.equal(cli(['info', f, '--format', 'json']).out, fs.readFileSync(f, 'utf8'));
});
