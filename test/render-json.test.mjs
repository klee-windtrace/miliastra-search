// The JSON report is the whole story: whatever a mode prints directly must equal what is rendered from its JSON, in every format, and
// every report must fit schema/report.schema.json. Nothing here needs the decoder for the second half: it runs src/present/ only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { main } from '../src/cli.mjs';
import { renderReport } from '../src/present/index.mjs';
import { validate } from '../src/present/validate.mjs';
import { root } from './helpers.mjs';

const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema', 'report.schema.json'), 'utf8'));
const FORMATS = ['text', 'color', 'md', 'htm', 'markdown', 'html'];
const CG = 'test/cases/codegen/', G = 'test/cases/gia/', L = 'test/cases/gil/', M = 'test/cases/mounts/', C = 'test/cases/composites/';

/** The CLI in-process from the project root: { out, err, code }. */
function cli(args) {
  const prev = process.cwd(); process.chdir(root);
  let out = '', err = '';
  try {
    const code = main(args, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} });
    return { out, err, code };
  } finally { process.chdir(prev); }
}
const reportOf = (args) => { const r = cli([...args, '--format', 'json']); return { text: r.out, report: JSON.parse(r.out) }; };

// [mode, files, options of the report, presentation options (CLI words) + the same as renderReport options]
const CASES = [
  ['info', [G + 'sample_3.gia'], [], [], {}],
  ['info', [G + 'sample_3.gia', L + 'stage_3.gil'], ['--show-tag'], [], {}],
  ['info', [L + 'stage_0.gil'], [], ['--key', 'level_name'], { key: 'level_name' }],
  ['info', [G + 'sample_3.gia', L + 'stage_3.gil'], [], ['--key', 'format'], { key: 'format' }],
  ['info', [G + 'sample_3.gia', L + 'stage_3.gil'], [], ['--search', 'class=', '--match', '^CLASS'], { search: 'class=', match: '^CLASS' }],
  ['info', [G + 'sample_1.gia', G + 'sample_2.gia'], [], ['--search', 'count=1', '--no-file-prefix'], { search: 'count=1', noFilePrefix: true }],
  ['refs', [G + 'sample_2.gia'], [], [], {}],
  ['refs', [G + 'sample_0_main.gia'], ['--sort-desc'], [], {}],
  ['refs', [C + 'test_composite.gil', C + 'var_change.gia'], [], ['--search', 'get', '--context', '1'], { search: 'get', context: 1 }],
  ['refs', [M + 'test_mount.gil'], [], [], {}],
  ['refs', [G + 'sample_2.gia', G + 'sample_1.gia'], ['--kind', 'signal'], [], {}],
  ['refs', [G + 'sample_2.gia'], ['--name', 'Signal_1'], [], {}],
  ['refs', [C + 'var_change.gia'], ['--kind', 'node_type'], [], {}],
  ['refs', [C + 'test_All_Composite.gia', 'test/cases/resolution/test_All_Static.gia'], [], ['--match', '^(signal|timer)'], { match: '^(signal|timer)' }],
  ['warns', [G + 'sample_2.gia'], [], [], {}],
  ['warns', [C + 'test_All_Composite.gia', C + 'var_change.gia'], ['--top-graphs', '2'], [], {}],
  ['warns', [L + 'stage_012379.gil'], [], ['--match', '^(INFO|WARN)'], { match: '^(INFO|WARN)' }],
  ['warns', [G + 'sample_2.gia'], ['--kind', 'timer'], [], {}],
  ['warns', [C + 'test_composite.gia', C + 'var_change.gia'], ['--name', 'Var1'], [], {}],
  ['dump', [G + 'sample_2.gia'], [], [], {}],
  ['dump', [G + 'sample_0_main.gia', L + 'stage_3.gil'], [], ['--details'], { details: true }],
  ['code', [G + 'sample_2.gia'], [], [], {}],
  ['code', [G + 'sample_0_main.gia', C + 'test_composite.gil'], [], ['--all-pins'], { allPins: true }],
  ['code', [CG + 'codetest_1.gia', CG + 'codetest_2.gia'], [], ['--pseudocode'], { pseudocode: true }],
  ['code', [CG + 'codetest_2.gia'], ['--expand'], ['--pseudocode'], { pseudocode: true }],
  ['code', [CG + 'codetest_1.gia'], [], ['--pseudocode', '--optimize', '--all-pins'], { pseudocode: true, optimize: true, allPins: true }],
  ['code', [CG + 'codetest_2.gia'], [], ['--pseudocode', '--optimize', '--search', 'Calling'], { pseudocode: true, optimize: true, search: 'Calling' }],
  ['code', [C + 'var_change.gia', L + 'stage_3.gil'], [], ['--match', 'Set Node', '--context', '1', '--no-file-prefix'], { match: 'Set Node', context: 1, noFilePrefix: true }],
  ['code', [M + 'test_folders.gil', 'test/cases/client/client_var_types.gia'], [], [], {}],
  ['dump', [M + 'test_mount.gil', M + 'test_folders.gil'], [], ['--search', 'MOUNT', '--context', '1'], { search: 'MOUNT', context: 1 }],
  ['dump', [C + 'test_composite.gil', C + 'var_change.gia'], [], ['--match', '^GRAPH', '--no-file-prefix'], { match: '^GRAPH', noFilePrefix: true }],
  ['all', [G + 'sample_2.gia'], [], [], {}],
  ['all', [G + 'sample_3.gia', L + 'stage_3.gil', M + 'test_mount.gil'], ['--show-tag', '--details', '--sort-desc', '--top-graphs', '3'], [], {}],
  ['all', [C + 'test_composite.gil', C + 'var_change.gia'], ['--kind', 'signal'], ['--search', 'signal', '--context', '1'], { search: 'signal', context: 1 }],
  ['all', [C + 'var_change.gia'], ['--name', 'Var1'], ['--match', '^(refs|dump|#)'], { match: '^(refs|dump|#)' }],
  ['check', [G + 'sample_2.gia', L + 'stage_3.gil'], [], [], {}],
  ['check', [M + 'test_folders.gil'], [], ['--search', 'uninterpreted'], { search: 'uninterpreted' }],
  ['raw', [G + 'sample_2.gia'], [], [], {}],
  ['raw', [L + 'stage_1.gil'], [], ['--search', 'bytes'], { search: 'bytes' }],
];

for (const [mode, files, reportOpts, presentOpts, renderOpts] of CASES) {
  const label = `${mode} ${files.map((f) => path.posix.basename(f)).join(' ')} ${[...reportOpts, ...presentOpts].join(' ')}`.trim();
  test(`rendering the JSON equals the direct output: ${label}`, () => {
    const { report } = reportOf([mode, ...files, ...reportOpts]);
    assert.deepEqual(validate(report, schema), [], 'the report fits the schema');
    const saved = JSON.parse(JSON.stringify(report)); // what a file on disk gives back
    for (const format of FORMATS) {
      const direct = cli([mode, ...files, ...reportOpts, ...presentOpts, '--format', format]);
      const rendered = renderReport(saved, { format, ...renderOpts });
      assert.equal(rendered.text ?? '', direct.out, `${format}: stdout`);
      assert.equal(rendered.err.map((m) => m + '\n').join(''), direct.err, `${format}: stderr`);
      assert.equal(rendered.code, direct.code, `${format}: exit code`);
    }
  });
}

test('the json format is the report, pretty-printed, and a .json output file implies it', () => {
  const { text, report } = reportOf(['info', G + 'sample_3.gia']);
  assert.equal(text, JSON.stringify(report, null, 2) + '\n');
  assert.equal(renderReport(report, { format: 'json' }).text, text);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-json-'));
  const f = path.join(dir, 'out.json');
  assert.equal(cli(['info', G + 'sample_3.gia', '-o', f]).code, 0);
  assert.equal(fs.readFileSync(f, 'utf8'), text);
});

test('the header names the software, its version, the files, the mode and the options that shaped the data', () => {
  const { report } = reportOf(['warns', G + 'sample_2.gia', G + 'sample_1.gia', '--kind', 'signal', '--top-graphs', '3', '--lang', 'DE']);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.deepEqual(report.header, { software: 'miliastra-search', version: pkg.version, mode: 'warns', files: ['sample_2.gia', 'sample_1.gia'],
    options: { lang: 'DE', node_db: null, input: null, lenient: false, kind: 'signal', name: null, top_graphs: 3 } });
  assert.equal(reportOf(['refs', G + 'sample_2.gia', '--sort-desc']).report.header.options.sort_desc, true);
});

test('a file that cannot be read or decoded stops the run: no output, no output file, no JSON', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-bad-'));
  const buf = Buffer.from(fs.readFileSync(path.join(root, G + 'sample_3.gia')));
  buf.writeUInt32BE(buf.readUInt32BE(4) + 1, 4);
  const bad = path.join(dir, 'bad.gia').replace(/\\/g, '/');
  fs.writeFileSync(bad, buf);
  const out = path.join(dir, 'out.json');
  for (const mode of ['info', 'dump', 'refs', 'warns', 'check', 'all']) {
    for (const format of ['text', 'html', 'json']) {
      const r = cli([mode, G + 'sample_2.gia', bad, '--format', format]);
      assert.equal(r.code, 1, `${mode} ${format}`);
      assert.equal(r.out, '', `${mode} ${format}: nothing on stdout, however many files are fine`);
      assert.match(r.err, /^error: .*bad\.gia: .*--lenient/s, `${mode} ${format}`);
    }
    assert.equal(cli([mode, G + 'sample_2.gia', bad, '-o', out]).code, 1);
    assert.ok(!fs.existsSync(out), `${mode}: the output file is not created`);
  }
  assert.equal(cli(['code', G + 'sample_2.gia', bad]).code, 1);
  assert.equal(cli(['info', bad, '--lenient', '--format', 'json']).code, 0, 'with --lenient the file is read, its problems are container warnings');
  const missing = cli(['info', G + 'sample_2.gia', path.join(dir, 'nothing.gia')]);
  assert.notEqual(missing.code, 0); assert.equal(missing.out, '');
});

test('a run that does not succeed does not write the output file (nothing matched, a key is missing)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-out-'));
  const out = path.join(dir, 'out.md');
  assert.equal(cli(['info', G + 'sample_3.gia', '--search', 'zzz-nothing-like-this', '-o', out]).code, 1);
  assert.ok(!fs.existsSync(out));
  assert.equal(cli(['info', G + 'sample_3.gia', '--key', 'level_name', '-o', out]).code, 1);
  assert.ok(!fs.existsSync(out));
  assert.equal(cli(['info', G + 'sample_3.gia', '-o', out]).code, 0);
  assert.ok(fs.existsSync(out));
});

test('files are shown by name only, in every mode and format; files with the same name are refused', () => {
  const files = [G + 'sample_2.gia', L + 'stage_3.gil', C + 'var_change.gia'];
  for (const mode of ['info', 'dump', 'refs', 'warns', 'check', 'all']) {
    for (const format of ['text', 'markdown', 'html', 'json']) {
      const r = cli([mode, ...files, '--format', format]);
      assert.equal(r.code, 0, `${mode} ${format}`);
      assert.doesNotMatch(r.out, /test\/cases|cases\//, `${mode} ${format}: no directory in the output`);
      if (format !== 'text' || !['refs', 'warns'].includes(mode)) assert.match(r.out, /var_change\.gia/, `${mode} ${format}`); // the line formats of refs and warns name no file
    }
  }
  assert.equal(cli(['raw', G + 'sample_2.gia', '--format', 'json']).out.includes('test/cases'), false);
  // the same name twice: from two directories, or the same file twice; a different case is a different name
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-twin-'));
  fs.mkdirSync(path.join(dir, 'a')); fs.mkdirSync(path.join(dir, 'b'));
  for (const sub of ['a', 'b']) fs.copyFileSync(path.join(root, G + 'sample_2.gia'), path.join(dir, sub, 'same.gia'));
  fs.copyFileSync(path.join(root, G + 'sample_2.gia'), path.join(dir, 'b', 'SAME.gia'));
  const twin = cli(['info', path.join(dir, 'a', 'same.gia'), path.join(dir, 'b', 'same.gia')]);
  assert.equal(twin.code, 2); assert.equal(twin.out, '');
  assert.match(twin.err, /same\.gia: .*a\/same\.gia, .*b\/same\.gia/);
  assert.equal(cli(['info', G + 'sample_2.gia', G + 'sample_2.gia']).code, 2);
  assert.equal(cli(['dump', dir]).code, 2, 'a folder expands to its files, which then clash');
  assert.equal(cli(['info', path.join(dir, 'a', 'same.gia'), path.join(dir, 'b', 'SAME.gia')]).code, 0, 'the comparison is case-sensitive');
});

test('something that is not a report is refused', () => {
  assert.throws(() => renderReport({ hello: 1 }, { format: 'text' }), /not a miliastra-search report/);
  assert.throws(() => renderReport({ todo: 'x' }, { format: 'text' }), /not a miliastra-search report/);
});

test('code report: the complete graph model, with every pin and every value, whatever the rendering options', () => {
  const { report } = reportOf(['code', C + 'var_change.gia']);
  assert.deepEqual(validate(report, schema), []);
  assert.deepEqual(report.header.options, { lang: 'EN', node_db: null, input: null, lenient: false, expand: false });
  const graphs = report.code[0].items.filter((x) => x.type === 'graph');
  const comp = graphs.find((g) => g.composite_body);
  assert.ok(comp.decl_guid != null && comp.port_mappings.length, 'a composite body: its declaration and port mappings');
  const pins = graphs.flatMap((g) => g.nodes.flatMap((n) => n.pins));
  assert.ok(pins.some((p) => p.kind === 'out_flow' && p.wires.length && p.wires[0].node.name), 'a wire names its target node');
  assert.ok(pins.some((p) => p.value?.kind === 'int') && pins.some((p) => p.value?.kind === 'str'), 'typed values');
  // the options of the rendering only decide what is shown: pins without value or wire and unedited values are in the data
  assert.ok(pins.some((p) => !p.wires.length && !p.value?.set), 'a pin without a wire or an edited value');
  assert.ok(pins.some((p) => p.value && !p.value.set), 'a value nobody edited');
  const plain = cli(['code', C + 'var_change.gia']).out, full = cli(['code', C + 'var_change.gia', '--all-pins']).out;
  assert.notEqual(cli(['code', CG + 'codetest_1.gia']).out, cli(['code', CG + 'codetest_1.gia', '--all-pins']).out, '--all-pins shows the pins that have neither a value nor a wire');
  assert.equal(renderReport(report, { format: 'text', allPins: true }).text, full);
  assert.equal(renderReport(report, { format: 'text' }).text, plain);
});

test('dump report: the numeric values are always in it; --details only shows them', () => {
  const { report } = reportOf(['dump', C + 'test_composite.gil']);
  assert.deepEqual(report.header.options, { lang: 'EN', node_db: null, input: null, lenient: false });
  const g = report.dump[0].items.find((x) => x.type === 'graph' && x.composite_body);
  assert.equal(g.kind, 21002); assert.equal(g.service, 20000); assert.ok(g.decl_guid != null && g.class_id != null);
  assert.doesNotMatch(renderReport(report, { format: 'text' }).text, /class=|decl=/);
  assert.match(renderReport(report, { format: 'text', details: true }).text, /class=9 .*kind=21002 .*decl='\d+'/);
  assert.equal(renderReport(report, { format: 'text', details: true }).text, cli(['dump', C + 'test_composite.gil', '--details']).out);
});

test('the all report always shows the details of its dump part and ignores --details; its code part honours the rendering options', () => {
  const a = cli(['all', G + 'sample_2.gia']).out;
  assert.match(a, / class=\d+ /);
  assert.equal(cli(['all', G + 'sample_2.gia', '--details']).out, a);
  const withCode = cli(['all', G + 'sample_2.gia', '--with-code']).out, pins = cli(['all', G + 'sample_2.gia', '--with-code', '--all-pins']).out;
  assert.notEqual(withCode, pins);
  assert.ok(withCode.includes(cli(['code', G + 'sample_2.gia']).out));
});

test('json cannot be combined with grep or --key', () => {
  for (const extra of [['--search', 'x'], ['--match', 'x'], ['--key', 'mode']]) assert.equal(cli(['info', G + 'sample_3.gia', '--format', 'json', ...extra]).code, 2, extra.join(' '));
});

test('every kind of reference, finding and part shows up in some report and fits the schema', () => {
  // a wide net: all fixture categories through refs and warns, so the schema is checked against real values of every optional field
  const files = ['gia', 'gil', 'composites', 'resolution', 'mounts'].flatMap((cat) => fs.readdirSync(path.join(root, 'test', 'cases', cat)).filter((n) => /\.(gia|gil)$/.test(n)).map((n) => `test/cases/${cat}/${n}`));
  for (const mode of ['refs', 'warns', 'check', 'info']) {
    const { report } = reportOf([mode, ...files]);
    assert.deepEqual(validate(report, schema), [], mode);
  }
  const { report } = reportOf(['refs', ...files, '--name', 'Signal_1']);
  assert.deepEqual(validate(report, schema), []);
  const all = reportOf(['refs', ...files]).report.refs;
  assert.ok(new Set(all.references.map((r) => r.kind)).size >= 6, 'several reference kinds');
  assert.ok(all.references.some((r) => r.via_composite.length), 'a composite attribution');
  assert.ok(all.references.some((r) => r.host), 'a mount');
  assert.ok(all.entries.some((e) => e.key_graph) && all.entries.some((e) => e.definition != null) && all.entries.some((e) => e.resolved));
});

test('the validator rejects reports that do not fit', () => {
  const { report } = reportOf(['refs', G + 'sample_2.gia']);
  const bad = (f) => { const c = JSON.parse(JSON.stringify(report)); f(c); return validate(c, schema); };
  assert.notDeepEqual(bad((c) => { c.header.software = 'x'; }), []);
  assert.notDeepEqual(bad((c) => { delete c.refs.entries[0].parts; }), []);
  assert.notDeepEqual(bad((c) => { c.refs.entries[0].extra = 1; }), []);
  assert.notDeepEqual(bad((c) => { c.header.mode = 'warns'; }), []);
  assert.notDeepEqual(bad((c) => { c.refs.references[0].note = 'plain string'; }), []);
});

test('raw: NaN and infinite floats survive JSON, and the tree prints them as text', () => {
  const { report } = reportOf(['raw', G + 'sample_2.gia']);
  assert.deepEqual(validate(report, schema), []);
  assert.equal(report.header.mode, 'raw');
  const f32 = (bits) => Buffer.from([0x0d, ...Buffer.from(new Uint32Array([bits]).buffer)]); // field 1, wire type 5
  const payload = Buffer.concat([f32(0x7fc00000), f32(0x7f800000), f32(0x3fc00000)]);
  const tree = { error: null, fields: [] };
  // build the tree through the engine's own reader
  return import('../src/raw.mjs').then(({ rawTree }) => {
    Object.assign(tree, rawTree(new Uint8Array(payload)));
    assert.deepEqual(tree.fields.map((x) => x.value), ['NaN', 'Infinity', 1.5]);
    const r = { header: report.header, raw: { container_warnings: [], payload: JSON.parse(JSON.stringify(tree)) } };
    assert.equal(renderReport(r, { format: 'text' }).text, '1: f32 NaN\n1: f32 Infinity\n1: f32 1.5\n');
  });
});

test('scripts/render-json.mjs renders a saved report without game files; --validate checks it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-script-'));
  const f = path.join(dir, 'refs.json');
  fs.writeFileSync(f, reportOf(['refs', G + 'sample_2.gia']).text);
  const script = path.join(root, 'scripts', 'render-json.mjs');
  const run = (...a) => spawnSync(process.execPath, [script, ...a], { encoding: 'utf8', cwd: dir });
  for (const format of ['text', 'markdown', 'html']) {
    const r = run(f, '--format', format, '--validate');
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, cli(['refs', G + 'sample_2.gia', '--format', format]).out, format);
  }
  const g = run(f, '--search', 'signal', '--format', 'text');
  assert.equal(g.status, 0); assert.match(g.stdout, /^signal /m);
  assert.equal(run(f, '--search', 'nothing-like-this').status, 1);
  const out = path.join(dir, 'refs.md');
  assert.equal(run(f, '-o', out).status, 0);
  assert.ok(fs.readFileSync(out, 'utf8').startsWith('﻿#'), 'a .md output file is Markdown with a BOM');
  fs.writeFileSync(path.join(dir, 'bad.json'), JSON.stringify({ header: { software: 'miliastra-search' } }));
  assert.equal(run(path.join(dir, 'bad.json'), '--validate').status, 2);
  assert.equal(run(path.join(dir, 'bad.json')).status, 2);
  assert.equal(run(f, '--nope').status, 2);
  // a check report with --strict exits like the direct run
  const c = path.join(dir, 'check.json');
  fs.writeFileSync(c, reportOf(['check', M + 'test_folders.gil']).text);
  assert.equal(run(c, '--strict').status, cli(['check', M + 'test_folders.gil', '--strict']).code);
});
