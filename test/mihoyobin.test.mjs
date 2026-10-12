// scripts/mihoyobin.mjs is a developer aid for exploring editor resources, which the repository does not contain. The tests build SYNTHETIC
// files in the editor's encoding (XOR 0xe5 over protobuf) and check the explorer's guesses on them; one real fixture
// (a .gil, via --container) covers protobuf the game actually wrote.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseStrict, decodeEntries, renderDump, newCensus, addToCensus, renderCensus, protoSketch, loadBin, loadTextMaps, textMapKeyPatterns, run } from '../scripts/mihoyobin.mjs';
import { lenField, varField, varint, casesDir } from './helpers.mjs';

const f32 = (f, v) => { const b = Buffer.alloc(4); b.writeFloatLE(v); return Buffer.concat([varint((f << 3) | 5), b]); };
const xor = (b) => Buffer.from(b.map((x) => x ^ 0xe5));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'mbin-'));
const tree = (buf, o) => decodeEntries(parseStrict(new Uint8Array(buf)), o);
const dump = (buf, o) => renderDump(tree(buf), o);

test('parseStrict: rejects what a lenient reader would accept', () => {
  assert.throws(() => parseStrict(new Uint8Array([0x0a, 0x05, 0x41])), /exceeds/);          // length beyond the data
  assert.throws(() => parseStrict(new Uint8Array([0x0b])), /unsupported wire type 3/);        // group
  assert.throws(() => parseStrict(new Uint8Array([0x00, 0x01])), /field number 0/);
  assert.throws(() => parseStrict(new Uint8Array([0x08])), /truncated varint/);
  assert.throws(() => parseStrict(new Uint8Array([0x0d, 0x01, 0x02])), /truncated fixed/);
  assert.deepEqual(parseStrict(new Uint8Array([0x08, 0x96, 0x01]))[0].value, 150n);
});

test('dump: text, nested messages, repeated indices, empties, floats, 64-bit values', () => {
  const buf = Buffer.concat([
    lenField(1, Buffer.from('Print String')),
    lenField(4, lenField(1, varField(5, 7))),
    lenField(100, Buffer.alloc(0)), lenField(102, varField(7, 12)), lenField(102, varField(7, 13)),
    f32(5, 0.5), varField(6, 0xffffffffffffffffn),
  ]);
  assert.deepEqual(dump(buf), [
    '1: "Print String"', '4: {', '  1: {', '    5: 7', '  }', '}', '100: {}  (empty string or message)',
    '102[0]: {', '  7: 12', '}', '102[1]: {', '  7: 13', '}', '5: f32 0.5', '6: 18446744073709551615 (int64 -1)',
  ]);
  assert.deepEqual(dump(buf, { flat: true }).slice(0, 3), ['1 = "Print String"', '4.1.5 = 7', '100 = {}  (empty string or message)']);
});

test('classification: a message whose first tag is 0x0a is not mistaken for text; plain words stay text', () => {
  // {1: <40 letters>} is bytes 0a 28 <letters>: 0x28 is printable, so the whole value is valid UTF-8 (with a newline in it) and a well-formed message
  const asMessage = tree(lenField(2, lenField(1, Buffer.from('x'.repeat(40)))))[0];
  assert.equal(asMessage.kind, 'msg'); assert.equal(asMessage.alsoText, true); assert.equal(asMessage.children[0].text, 'x'.repeat(40));
  // a nine-letter word also parses as a message (tag 'a' = field 12 fixed64); without a control character it stays text and says so
  const word = tree(lenField(2, Buffer.from('abcdefghi')))[0];
  assert.equal(word.kind, 'text'); assert.equal(word.alsoMsg, true);
  assert.equal(tree(lenField(2, Buffer.from('abcdefghi')), { preferMsg: true })[0].kind, 'msg');
  assert.equal(tree(lenField(2, Buffer.from('打印字符串')))[0].kind, 'text');
});

test('classification: binary blobs, packed varints, and the depth limit', () => {
  const packed = tree(lenField(3, Buffer.from([1, 2, 3, 0x81, 0x01])))[0];
  assert.equal(packed.kind, 'bytes'); assert.deepEqual(packed.packed, [1n, 2n, 3n, 129n]);
  const deep = tree(lenField(1, lenField(1, lenField(1, varField(1, 5)))), { maxDepth: 1 })[0];
  assert.equal(deep.kind, 'msg'); assert.equal(deep.children[0].kind, 'bytes'); assert.equal(deep.children[0].collapsed, true);
  assert.match(renderDump([deep], {})[1], /sub-message below the depth limit/);
});

test('loadBin: auto-detects XOR 0xe5, plain protobuf and the .gia/.gil container; clear error otherwise', () => {
  const dir = tmp();
  const msg = Buffer.concat([lenField(1, Buffer.from('Hello world')), varField(2, 9)]);
  fs.writeFileSync(path.join(dir, 'a.mihoyobin'), xor(msg));
  fs.writeFileSync(path.join(dir, 'b.bin'), msg);
  assert.equal(loadBin(path.join(dir, 'a.mihoyobin')).mode, 'xor 0xe5');
  assert.equal(loadBin(path.join(dir, 'b.bin')).mode, 'plain');
  const gil = path.join(casesDir, 'gil', 'stage_0.gil');
  assert.equal(loadBin(gil).mode, 'container');
  assert.ok(parseStrict(loadBin(gil).bytes).some((f) => f.field === 10));   // a real .gil's node-graph section
  fs.writeFileSync(path.join(dir, 'junk.mihoyobin'), Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff]));
  assert.throws(() => loadBin(path.join(dir, 'junk.mihoyobin')), /not a protobuf message/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('census: counts files, repeated fields, value sets, text; proto sketch', () => {
  const node = (id, name, pins) => Buffer.concat([lenField(4, lenField(1, varField(5, id))), lenField(206, Buffer.from(name)), ...pins.map((p) => lenField(102, varField(7, p)))]);
  const c = newCensus();
  addToCensus(c, tree(node(1, 'Print String', [11])), 'a');
  addToCensus(c, tree(node(2, 'Add', [12, 13, 14])), 'b');
  const rows = renderCensus(c).map((r) => r.trim());
  assert.ok(rows.includes('4.1.5  files 2/2  n=2  varint  {1×1, 2×1}'));
  assert.ok(rows.some((r) => /^102  files 2\/2  n=4  repeated \(max 3 per parent\)  msg$/.test(r)));
  assert.ok(rows.some((r) => /^206  files 2\/2  n=2  text  2 distinct text, e\.g\. "Print String" "Add"$/.test(r)));
  const proto = protoSketch(c);
  assert.match(proto, /repeated M_102 f102 = 102;/);
  assert.match(proto, /optional string f206 = 206;/);
  assert.match(proto, /optional int64 f5 = 5; \/\/ values 1,2/);
  assert.match(proto, /message M_4_1 \{/);
});

test('text maps: hashes resolve per language, small values are left alone; find --text follows a hash', () => {
  const dir = tmp();
  const tm = (entries) => Buffer.concat(entries.map(([h, t]) => lenField(2, Buffer.concat([varField(2, h), lenField(3, Buffer.from(t))]))));
  fs.mkdirSync(path.join(dir, 'TextMap', 'CHS'), { recursive: true }); fs.mkdirSync(path.join(dir, 'TextMap', 'EN'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'TextMap', 'CHS', 'a.mihoyobin'), xor(tm([[3000000000, '打印字符串'], [7, 'seven']])));
  fs.writeFileSync(path.join(dir, 'TextMap', 'EN', 'b.mihoyobin'), xor(tm([[3000000000, 'Print String']])));
  const maps = loadTextMaps([path.join(dir, 'TextMap')]);
  assert.deepEqual(maps.lookup(3000000000n).map((h) => `${h.lang}:${h.text}`).sort(), ['CHS:打印字符串', 'EN:Print String']);
  assert.equal(maps.lookup(7n), undefined);

  const node = Buffer.concat([lenField(4, lenField(1, varField(5, 1))), varField(206, 3000000000), varField(207, 7)]);
  fs.mkdirSync(path.join(dir, 'Node'));
  fs.writeFileSync(path.join(dir, 'Node', 'n.mihoyobin'), xor(node));
  let out = '';
  assert.equal(run(['dump', path.join(dir, 'Node'), '--text-map', path.join(dir, 'TextMap')], (s) => { out += s; }, () => {}), 0);
  assert.match(out, /206: 3000000000 {2}→ CHS "打印字符串" \| EN "Print String"/);
  assert.match(out, /207: 7\n/);

  out = '';
  run(['find', path.join(dir, 'Node'), '--text', 'print', '--text-map', path.join(dir, 'TextMap')], (s) => { out += s; }, () => {});
  assert.match(out, /n\.mihoyobin {2}206 = 3000000000/); assert.match(out, /1 match\n$/);
  out = '';
  run(['find', path.join(dir, 'Node'), '--path', '4.1.5', '--value', '1'], (s) => { out += s; }, () => {});
  assert.match(out, /4\.1\.5 = 1/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('cli: skips unreadable files but reports them, rejects bad usage, unxor round-trips', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'good.mihoyobin'), xor(varField(1, 5)));
  fs.writeFileSync(path.join(dir, 'bad.mihoyobin'), Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff]));
  let out = '', err = '';
  assert.equal(run(['census', dir], (s) => { out += s; }, (s) => { err += s; }), 0);
  assert.match(out, /^# 1 files/); assert.match(err, /1 file\(s\) skipped[\s\S]*bad\.mihoyobin/);
  assert.equal(run(['find', dir], () => {}, () => {}), 2);
  assert.equal(run(['bogus'], () => {}, () => {}), 2);
  assert.equal(run(['dump'], () => {}, () => {}), 2);
  const out2 = path.join(dir, 'decoded.pb');
  assert.equal(run(['unxor', path.join(dir, 'good.mihoyobin'), '-o', out2], () => {}, () => {}), 0);
  assert.deepEqual([...fs.readFileSync(out2)], [0x08, 0x05]);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('keys: TextMap keys grouped by pattern with numbers masked', () => {
  const dir = tmp();
  const entry = (key, hash, text) => lenField(2, Buffer.concat([lenField(1, Buffer.from(key)), varField(2, hash), ...(text ? [lenField(3, Buffer.from(text))] : [])]));
  const tm = Buffer.concat([
    entry('NodeConfig_name_22', 1, 'Set Custom Variable'), entry('NodeConfig_name_36', 2, 'When Changes'), entry('NodeConfig_desc_22', 3, null),
    entry('EnumConfig_3_value_1', 4, 'Equal'),
  ]);
  fs.mkdirSync(path.join(dir, 'EN'));
  fs.writeFileSync(path.join(dir, 'EN', 't.mihoyobin'), xor(tm));
  const rows = textMapKeyPatterns([parseStrict(new Uint8Array(tm))]);
  assert.deepEqual(rows.map((r) => [r.pattern, r.count, r.withText]), [['NodeConfig_name_#', 2, 2], ['EnumConfig_#_value_#', 1, 1], ['NodeConfig_desc_#', 1, 0]]);
  assert.equal(rows[0].example, 'NodeConfig_name_22');
  let out = '';
  assert.equal(run(['keys', dir], (s) => { out += s; }, () => {}), 0);
  assert.match(out, /^# 4 entries, 3 key patterns\n/); assert.match(out, / 2 {2}NodeConfig_name_# {2}\(2 with text; e\.g\. NodeConfig_name_22\)/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('table: one row per file, or per entry of a repeated root field; hashes become text; bad usage is rejected', () => {
  const dir = tmp();
  const pin = (idx, widget, extra = Buffer.alloc(0)) => lenField(102, Buffer.concat([lenField(3, varField(2, idx)), lenField(4, varField(1, widget)), extra]));
  const node = (id, hash, pins) => Buffer.concat([lenField(4, lenField(1, varField(5, id))), varField(203, 1), varField(206, hash), ...pins]);
  fs.writeFileSync(path.join(dir, 'a.mihoyobin'), xor(node(7, 3000000000, [pin(0, 6, lenField(5, varField(1, 2))), pin(1, 2)])));
  fs.writeFileSync(path.join(dir, 'b.mihoyobin'), xor(node(8, 5, [])));
  fs.mkdirSync(path.join(dir, 'TextMap', 'EN'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'TextMap', 'EN', 'x.mihoyobin'), xor(lenField(2, Buffer.concat([lenField(1, Buffer.from('k')), varField(2, 3000000000), lenField(3, Buffer.from('Print\tString'))]))));
  const files = [path.join(dir, 'a.mihoyobin'), path.join(dir, 'b.mihoyobin')];
  let out = '', err = '';
  assert.equal(run(['table', ...files, '--cols', '4.1.5,203,206', '--text-map', path.join(dir, 'TextMap')], (s) => { out += s; }, () => {}), 0);
  assert.equal(out, 'file\t4.1.5\t203\t206\na.mihoyobin\t7\t1\tPrint String\nb.mihoyobin\t8\t1\t5\n');   // the hash resolves (tab inside the text is flattened), 5 is too small to be one
  out = '';
  assert.equal(run(['table', ...files, '--cols', '4.1.5', '--rows', '102', '--row-cols', '3.2,4.1,5.1'], (s) => { out += s; }, () => {}), 0);
  assert.equal(out, 'file\tindex\t4.1.5\t102.3.2\t102.4.1\t102.5.1\na.mihoyobin\t0\t7\t0\t6\t2\na.mihoyobin\t1\t7\t1\t2\t\n');   // b has no 102, so no rows
  assert.equal(run(['table', ...files], () => {}, (s) => { err += s; }), 2);
  assert.match(err, /needs --cols/);
  assert.equal(run(['table', ...files, '--cols', '203', '--row-cols', '3.2'], () => {}, () => {}), 2);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('keys --grep: lists the matching TextMap entries with their hashes', () => {
  const dir = tmp();
  const entry = (key, hash, text) => lenField(2, Buffer.concat([lenField(1, Buffer.from(key)), varField(2, hash), ...(text ? [lenField(3, Buffer.from(text))] : [])]));
  fs.writeFileSync(path.join(dir, 't.mihoyobin'), xor(Buffer.concat([entry('Cfg_enum_0_title', 11, 'Comparison'), entry('Cfg_enum_1_title', 12, null), entry('Other_x', 13, 'x')])));
  let out = '';
  assert.equal(run(['keys', dir, '--grep', 'enum_'], (s) => { out += s; }, () => {}), 0);
  assert.equal(out, '11\tCfg_enum_0_title\t"Comparison"\n12\tCfg_enum_1_title\t\n2 entries\n');
  fs.rmSync(dir, { recursive: true, force: true });
});
