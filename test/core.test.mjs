import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { unwrapContainer, ContainerError } from '../src/container.mjs';
import { parseProto } from '../src/protoparse.mjs';
import { fileInfo, infoBlocks } from '../src/info.mjs';
import { textLines, plain } from '../src/doc.mjs';
import { renderText, readSample, sample, samples, here, appendToFirstEntry, varField, wrap, payloadOf } from './helpers.mjs';

const db = new NodeDb();
const dump = (name, opts = {}) => renderText(parseBundle(readSample(name), { file: name }), db, opts).lines.join('\n') + '\n';

// ---------- the schema must know every field of every sample (the census is empty) ----------
for (const f of fs.readdirSync(samples).filter((n) => n.endsWith('.gia')).sort()) {
  test(`census is empty: ${f}`, () => {
    const b = parseBundle(readSample(f), { file: f });
    assert.deepEqual(b.census.entries(), [], 'schema is missing fields present in this file');
  });
}

// ---------- ground truth for the main sample ----------
test('main sample: ground truth', () => {
  const b = parseBundle(readSample('sample_0_main.gia'));
  assert.equal(b.resources.length, 2, 'two graphs (multi-resource bundle)');
  assert.equal(b.engineVersion, '7.0.0');
  assert.equal(b.modeFlag, null);
  const [g1, g2] = b.resources.map((r) => r.graph);
  assert.equal(g1.name, 'Graph'); assert.equal(g1.nodes.length, 7); assert.equal(g2.name, 'Empty'); assert.equal(g2.nodes.length, 0);
  const t = dump('sample_0_main.gia');
  for (const needle of [
    "'Graph'/VAR Graph_Var : Ety public=false",
    "'Graph'/[3] Equal (14/16) variant=C<T:Ety>",
    "'Graph'/[4] Double Branch (2) out.flow#0 \"Yes\" -> [5] Print String (1)",
    "'Graph'/[4] Double Branch (2) out.flow#1 \"No\" -> [6] Destroy Entity (69)",
    "'Graph'/[3] Equal (14/16) in#0 \"Input 1\" <- [2] Get Self Entity (73)",
    "'Graph'/[3] Equal (14/16) in#1 \"Input 2\" <- [1] When Entity Is Created (71)",
    "'Graph'/[4] Double Branch (2) in#0 \"Condition\" <- [3] Equal (14/16)",
    "'Graph'/[5] Print String (1) in#0 \"String\" = 'Created'",
    "'Graph'/[6] Destroy Entity (69) in#0 \"Target Entity\" <- [8] Get Node Graph Variable (337)",
    "'Graph'/[8] Get Node Graph Variable (337) in#0 \"Variable Name\" = 'Graph_Var'",
    "'Graph'/COMMENT 'Comment'",
  ]) assert.ok(t.includes(needle), `missing: ${needle}`);
  assert.ok(!/^'Graph'\/\[7\]/m.test(t), 'node index 7 was deleted in the editor');
});

// The `info` mode as plain text (what `info` prints in the text format).
const info = (name, opts = {}) => textLines(infoBlocks(fileInfo(parseBundle(readSample(name), { file: name }), db, opts), opts)).map(plain).join('\n') + '\n';

test('UID is masked by default and shown only with info --show-tag; dump/code never print the export tag', () => {
  const t = info('sample_0_main.gia');
  assert.ok(!t.includes('658181221'));
  assert.ok(!/1789907354/.test(t), 'export timestamps must not appear (non-deterministic between exports)');
  const tagged = info('sample_0_main.gia', { showTag: true });
  assert.ok(tagged.includes('658181221'));
  assert.match(tagged, /^export_tag +\S+$/m); assert.match(tagged, /^uid +658181221$/m); assert.match(tagged, /^time +\d+$/m); assert.match(tagged, /^file_id +\d+$/m);
  assert.doesNotMatch(dump('sample_0_main.gia', { showTag: true }), /658181221|export_tag/);
});

test('dump starts with the content; the file facts (format/version/mode/names) are in info', () => {
  assert.doesNotMatch(dump('sample_8.gia'), /engine_version|^# FILE|^# /m);
  assert.match(info('sample_8.gia'), /^# FILE sample_8\.gia\nformat +gia\ndetected_by +header\nfile_size +\d+\ncontainer_file_type +gia\nengine_version +7\.0\.0\nmode +beyond\nexport_name +/);
});

test('classic mode flag is reported', () => {
  assert.match(info('sample_6.gia'), /^mode +classic$/m);
  assert.match(info('sample_8.gia'), /^mode +beyond$/m);
});

test('dump is deterministic', () => { assert.equal(dump('sample_3.gia'), dump('sample_3.gia')); });

test('same graph in sample_8 and main sample dumps identically (modulo graph guid)', () => {
  const norm = (s) => s.split('\n').filter((l) => !l.startsWith('#') && !l.startsWith('GRAPH ')).join('\n');
  assert.equal(norm(dump('sample_8.gia')), norm(dump('sample_0_main.gia')).split('\n').filter((l) => !l.startsWith('Empty')).join('\n'));
});

// ---------- container ----------
test('container: truncated file', () => {
  const b = readSample('sample_8.gia');
  assert.throws(() => unwrapContainer(b.subarray(0, 40)), (e) => e instanceof ContainerError && /truncated|payload length|size/i.test(e.message));
  assert.throws(() => unwrapContainer(b.subarray(0, 10)), ContainerError);
});
test('container: wrong head tag / tail tag / length', () => {
  const b = Buffer.from(readSample('sample_8.gia'));
  const h = Buffer.from(b); h.writeUInt32BE(0x1234, 8); assert.throws(() => unwrapContainer(h), /head tag/);
  const t = Buffer.from(b); t.writeUInt32BE(0x1234, t.length - 4); assert.throws(() => unwrapContainer(t), /tail tag/);
  const l = Buffer.from(b); l.writeUInt32BE(5, 16); assert.throws(() => unwrapContainer(l), /payload length/);
  const v = Buffer.from(b); v.writeUInt32BE(2, 4); assert.throws(() => unwrapContainer(v), /schema version/);
});
test('container: lenient mode returns problems instead of throwing', () => {
  const t = Buffer.from(readSample('sample_8.gia')); t.writeUInt32BE(0x1234, t.length - 4);
  const r = unwrapContainer(t, { lenient: true });
  assert.equal(r.problems.length, 1);
  const bundle = parseBundle(t, { lenient: true });
  assert.equal(bundle.resources.length, 1);
  assert.match(renderText(bundle, db).lines.join('\n'), /CONTAINER WARNING/);
});

// ---------- census ----------
test('census: unknown field at top level and inside a nested message', () => {
  let buf = wrap(Buffer.concat([payloadOf(readSample('sample_8.gia')), varField(77, 5)]));
  let b = parseBundle(buf);
  assert.ok(b.census.entries().some((e) => e.path === 'AssetBundle' && e.field === 77));
  buf = appendToFirstEntry(readSample('sample_8.gia'), varField(999, 123));
  b = parseBundle(buf);
  const e = b.census.entries().find((x) => x.field === 999);
  assert.ok(e, 'nested unknown field must be reported'); assert.equal(e.path, 'AssetBundle.resources'); assert.equal(e.sample, '123');
});

// ---------- degradation ----------
test('unknown node id: prints <node#ID>, keeps pins/values/wires, reports it', () => {
  const db2 = new NodeDb();
  delete db2.nodes[71]; delete db2.nodes[337];
  const { lines, summary } = renderText(parseBundle(readSample('sample_0_main.gia')), db2);
  const t = lines.join('\n');
  assert.match(t, /'Graph'\/\[1\] <node#71> \(71\) @/);
  assert.match(t, /\[4\] Double Branch \(2\) in#0 "Condition"|\[1\] <node#71> \(71\) out\.flow#0 -> \[4\] Double Branch/);
  assert.match(t, /'Graph'\/\[8\] <node#337> \(337\) in#0 = 'Graph_Var'/, 'literal must survive without names');
  assert.match(t, /<- \[8\] <node#337> \(337\) out#0/);
  assert.match(t, /UNRESOLVED node#71 x1/);
  assert.equal(summary.unresolved.length, 2);
});
test('unknown pin name / unknown enum degrade to indices and integers', () => {
  const db2 = new NodeDb(); db2.nodes[1].pins = {};
  assert.match(renderText(parseBundle(readSample('sample_0_main.gia')), db2).lines.join('\n'), /Print String \(1\) in#0 = 'Created'/);
  const t = dump('sample_7.gia', { defaults: true });
  assert.match(t, /enum:101«Less Than»|enum:101«/, 'known enum value gets its name');
  assert.match(t, /enum:\d+|<unknown-enum:\d+>/);
});

// ---------- proto parser ----------
test('proto parser: merged schema loads; nested enum + oneof resolve', () => {
  const root = parseProto(fs.readFileSync(path.join(here, '..', 'schema', 'gia.merged.proto'), 'utf8'));
  const ab = root.messages.get('AssetBundle');
  assert.equal(ab.fields.get(1).repeated, true, 'resources must be repeated');
  assert.equal(ab.fields.get(4).name, 'mode_flag');
  assert.equal(root.messages.get('ResourceEntry').enums.get('ResourceClass').byNum.get(9), 'ENTITY_NODE_GRAPH');
  assert.equal(root.messages.get('TypedValue').oneofs.get('storage').length, 11);
});
