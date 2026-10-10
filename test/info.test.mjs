// The `info` mode: facts about the file itself (moved out of dump), class counts, level sections, --show-tag, --json.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { fileInfo } from '../src/info.mjs';
import { here, readSample } from './helpers.mjs';
import { run } from './expected.mjs';

const db = new NodeDb();
const gilPath = path.join('test', 'cases', 'gil', 'stage_1.gil').replace(/\\/g,'/');
const giaPath = path.join('test', 'cases', 'gia', 'sample_3.gia').replace(/\\/g,'/');
const lines = (out) => out.split('\n').filter(Boolean);

test('info: gia facts line, content counts and one CLASS line per resource class', () => {
  const b = parseBundle(readSample('sample_3.gia'), { file: 'sample_3.gia' });
  const i = fileInfo(b, db);
  assert.equal(i.format, 'gia'); assert.equal(i.detected_by, 'header'); assert.equal(i.engine_version, '7.0.0'); assert.equal(i.mode, 'beyond');
  assert.equal(i.file_size, readSample('sample_3.gia').length);
  assert.equal(i.export_name, 'sample_3.gia'); assert.equal(i.level_name, undefined);
  assert.equal(i.resources, b.resources.length);
  assert.equal(i.primary + i.dependencies, i.resources, 'a gia splits into primary and dependency resources');
  assert.equal(i.classes.reduce((n, c) => n + c.count, 0), i.resources, 'the class table covers every resource');
  assert.equal(i.sections, undefined, 'sections/folders are a .gil thing');
  const out = run(['info', giaPath, '--format', 'text']);
  assert.match(out, /^# FILE test\/cases\/gia\/sample_3\.gia$/m);
  assert.match(out, /^format +gia\ndetected_by +header\nfile_size +\d+\ncontainer_file_type +gia\n/m, 'File and Contents are two-column key/value lines');
  assert.match(out, /^engine_version +7\.0\.0\nmode +beyond\nexport_name +sample_3\.gia\nnode_db_version +\S+\nresources +\d+\n/m);
  assert.match(out, /^CLASS ENTITY_NODE_GRAPH class=9 count=1$/m);
  assert.match(out, /^CLASS STRUCTURE class=29 count=2$/m);
});

test('info: a .gil also lists its sections (and folders), which add up to the resource count', () => {
  const b = parseBundle(fs.readFileSync(path.join(here, '..', gilPath)), { file: gilPath });
  const i = fileInfo(b, db);
  assert.equal(i.format, 'gil'); assert.equal(typeof i.level_name, 'string'); assert.equal(i.export_name, undefined);
  assert.equal(i.sections.reduce((n, s) => n + s.count, 0), i.resources);
  assert.ok(i.sections.some((s) => s.section === 'root.10.1'), 'graphs live in root.10.1');
  const out = run(['info', gilPath, '--format', 'text']);
  assert.match(out, /^SECTION root\.10\.1 resources=\d+ description='node graphs[^']*'$/m);
  assert.match(out, /^format +gil$/m);
});

test('info --show-tag is the only place that prints the export tag (parts included); without it nothing of the tag shows', () => {
  const plainOut = run(['info', giaPath, '--format', 'text']);
  assert.doesNotMatch(plainOut, /export_tag|658181221/);
  const tagged = run(['info', giaPath, '--show-tag', '--format', 'text']);
  for (const re of [/^export_tag +\S+$/m, /^uid +\d+$/m, /^time +\d+$/m, /^file_id +\d+$/m]) assert.match(tagged, re);
  assert.match(run(['info', gilPath, '--show-tag', '--format', 'text']), /^export_tag +null$/m);
  for (const mode of ['dump', 'code']) assert.doesNotMatch(run([mode, giaPath, '--show-tag', '--format', 'text']), /export_tag|\buid=/, `${mode} ignores --show-tag`);
});

test('dump/code start with the content, not the file facts; with several files each file is introduced by a # FILE line', () => {
  for (const mode of ['dump', 'code']) {
    const one = run([mode, giaPath, '--format', 'text']);
    assert.doesNotMatch(one, /^# |engine_version/m, `${mode}: single file`);
    const two = run([mode, giaPath, path.join('test', 'cases', 'gia', 'sample_1.gia'), '--format', 'text']);
    assert.deepEqual(lines(two).filter((l) => l.startsWith('# ')), ['# FILE test/cases/gia/sample_3.gia', '# FILE test/cases/gia/sample_1.gia'], `${mode}: two files`);
  }
});

test('info works in every format, with several files, and greps like the other modes', () => {
  for (const fmt of ['text', 'color', 'md', 'htm', 'markdown', 'html']) assert.ok(run(['info', giaPath, gilPath, '--format', fmt]).length > 100, fmt);
  assert.match(run(['info', giaPath, '--format', 'markdown']), /^\| Class \| Class id \| Count \|$/m);
  assert.match(run(['info', giaPath, '--format', 'markdown']), /^\| Property \| Value \|$/m, 'File and Contents are tables in the document formats'); 
  assert.match(run(['info', giaPath, '--format', 'html']), /<h1>File <span class="fileName">/);
  const grep = run(['info', giaPath, gilPath, '--match', '^CLASS ENTITY_NODE_GRAPH', '--format', 'text']);
  const counts = (p) => fileInfo(parseBundle(fs.readFileSync(path.join(here, '..', p)), { file: p }), db).classes.find((c) => c.className === 'ENTITY_NODE_GRAPH').count;
  assert.deepEqual(lines(grep), [`${giaPath}:CLASS ENTITY_NODE_GRAPH class=9 count=${counts(giaPath)}`, `${gilPath}:CLASS ENTITY_NODE_GRAPH class=9 count=${counts(gilPath)}`]);
});

test('info --json: one object per file; cannot be combined with grep', () => {
  const r = spawnSync(process.execPath, [path.join(here, '..', 'miliastra-search.mjs'), 'info', giaPath, gilPath, '--json'], { encoding: 'utf8', cwd: path.join(here, '..') });
  assert.equal(r.status, 0);
  const j = JSON.parse(r.stdout);
  assert.deepEqual(j.map((x) => x.format), ['gia', 'gil']);
  assert.ok(!('export_tag' in j[0]), 'tag only with --show-tag');
  assert.ok(Array.isArray(j[1].sections) && Array.isArray(j[0].classes));
  assert.equal(spawnSync(process.execPath, [path.join(here, '..', 'miliastra-search.mjs'), 'info', giaPath, '--json', '--search', 'x'], { encoding: 'utf8', cwd: path.join(here, '..') }).status, 2);
});

test('info reports container warnings of a --lenient decode', () => {
  const buf = Buffer.from(readSample('sample_3.gia'));
  buf.writeUInt32BE(buf.readUInt32BE(4) + 1, 4); // wrong container schema version: an error, unless --lenient
  const f = path.join(here, 'tmp_info_warn.gia');
  fs.writeFileSync(f, buf);
  try {
    const bin = path.join(here, '..', 'miliastra-search.mjs');
    assert.equal(spawnSync(process.execPath, [bin, 'info', f], { encoding: 'utf8' }).status, 1);
    const r = spawnSync(process.execPath, [bin, 'info', f, '--lenient', '--format', 'text'], { encoding: 'utf8' });
    assert.equal(r.status, 0);
    assert.match(r.stdout, /^# CONTAINER WARNING: unexpected container schema version/m);
  } finally { fs.rmSync(f, { force: true }); }
});

test('info: File and Contents are two-column tables (key, value) in every format', () => {
  const md = run(['info', giaPath, '--format', 'markdown']);
  assert.match(md, /^\| Property \| Value \|\n\| --- \| --- \|\n\| format \| gia \|$/m);
  assert.match(md, /^\| resources \| \d+ \|$/m);
  const html = run(['info', giaPath, '--format', 'html']);
  assert.match(html, /<th>Property<\/th><th>Value<\/th>/);
  assert.match(html, /<h2 id="file">File<\/h2>/); assert.match(html, /<h2 id="contents">Contents<\/h2>/);
  const text = lines(run(['info', giaPath, '--format', 'text']));
  const keyed = text.filter((l) => /^[a-z_]+ {2,}\S/.test(l));
  assert.ok(keyed.length >= 15 && new Set(keyed.map((l) => l.search(/ \S/) + l.slice(l.search(/ \S/)).search(/\S/))).size === 1, 'values start in one column');
});

test('info --key prints only the value: properties, class counts, plain text in any format', () => {
  const b = parseBundle(fs.readFileSync(path.join(here, '..', gilPath)), { file: gilPath });
  const i = fileInfo(b, db);
  assert.equal(run(['info', gilPath, '--key', 'level_name']), i.level_name + '\n');
  assert.equal(run(['info', gilPath, '--key', 'mode']), 'beyond\n');
  assert.equal(run(['info', giaPath, '--key', 'export_name']), 'sample_3.gia\n');
  assert.equal(run(['info', giaPath, '--key', 'STRUCTURE']), '2\n', 'the count of a resource class');
  assert.equal(run(['info', giaPath, '--key', 'Resources']), `${fileInfo(parseBundle(readSample('sample_3.gia'), { file: giaPath }), db).resources}\n`, 'case does not matter');
  assert.match(run(['info', giaPath, '--key', 'uid']), /^\d+\n$/, 'the export tag needs no --show-tag');
  for (const fmt of ['color', 'html', 'markdown']) assert.match(run(['info', giaPath, '--key', 'format', '--format', fmt]), /gia/, fmt);
  assert.equal(run(['info', giaPath, '--key', 'format', '--format', 'color']), 'gia\n');
});

test('info --key: several files get a file: prefix unless --no-file-prefix; a missing key is exit 1; no combining with grep/json', () => {
  assert.equal(run(['info', giaPath, gilPath, '--key', 'format']), `${giaPath}:gia\n${gilPath}:gil\n`);
  assert.equal(run(['info', giaPath, gilPath, '--key', 'format', '--no-file-prefix']), 'gia\ngil\n');
  const bin = path.join(here, '..', 'miliastra-search.mjs'), opts = { encoding: 'utf8', cwd: path.join(here, '..') };
  const missing = spawnSync(process.execPath, [bin, 'info', giaPath, '--key', 'level_name'], opts);
  assert.equal(missing.status, 1); assert.equal(missing.stdout, ''); assert.match(missing.stderr, /level_name/);
  assert.equal(spawnSync(process.execPath, [bin, 'info', giaPath, '--key', 'mode', '--json'], opts).status, 2);
  assert.equal(spawnSync(process.execPath, [bin, 'info', giaPath, '--key', 'mode', '--search', 'x'], opts).status, 2);
  assert.equal(spawnSync(process.execPath, [bin, 'info', giaPath, '--key'], opts).status, 2);
});

test('info: a folder lists its graphs, then its other resources; zeros are left out', () => {
  const file = path.join('test', 'cases', 'mounts', 'test_folders.gil').replace(/\\/g, '/');
  const i = fileInfo(parseBundle(fs.readFileSync(path.join(here, '..', file)), { file }), db);
  for (const f of i.folders) assert.ok(f.graphs > 0 || f.resources > 0);
  const text = run(['info', file, '--format', 'text']);
  for (const f of i.folders) assert.ok(text.includes(`FOLDER /${f.name}/${f.graphs ? ` graphs=${f.graphs}` : ''}${f.resources ? ` resources=${f.resources}` : ''}\n`), f.name);
  assert.match(run(['info', file, '--format', 'html']), /<th>Folder<\/th><th class="right">Graphs<\/th><th class="right">Resources<\/th>/);
});
