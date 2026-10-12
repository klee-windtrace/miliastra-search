// scripts/build-db.mjs reads resource files that the repository does not contain, so the tests build SYNTHETIC node, TextMap and
// BeyondGlobal files (XOR 0xe5 over protobuf). Field numbers follow TECHNICAL.md "Editor resource files".
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseStrict } from '../scripts/mihoyobin.mjs';
import { SERVER_TYPES, CLIENT_TYPES, readNode, readDefault, constraintOf, buildDb, compareDb, findNodeDir, readGameVersion, textMapFiles, run, typeStr } from '../scripts/build-db.mjs';
import * as model from '../src/model.mjs';
import { lenField as ld, varField as vf } from './helpers.mjs';

const cat = (...p) => Buffer.concat(p.filter(Boolean));
const xor = (b) => Buffer.from(b.map((x) => x ^ 0xe5));
const f32 = (f, v) => { const b = Buffer.alloc(4); b.writeFloatLE(v); return cat(Buffer.from([(f << 3) | 5]), b); };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'bng-'));
const maps = { EN: new Map([[100, 'Target'], [101, 'Value'], [200, 'Node']]), CHS: new Map([[100, '目标'], [200, '节点']]) };

// ---- builders
const idBlock = (service, id) => cat(vf(1, 10001), vf(2, service), vf(3, 22000), vf(5, id));
const entry = ({ sel, conn, cvt, enumId } = {}) => cat(sel !== undefined && vf(8, sel), conn !== undefined && vf(3, conn), cvt !== undefined && vf(4, cvt), enumId !== undefined && ld(101, vf(1, enumId)));
const pinMsg = ({ name, slot, emptySlot, widget, conn, cvt, family, def, roles = [], list = [] } = {}) => cat(
  name !== undefined && vf(7, name), slot !== undefined && ld(3, vf(2, slot)), emptySlot && ld(3, Buffer.alloc(0)),
  (widget !== undefined || conn !== undefined || cvt !== undefined || family !== undefined || def || list.length) && ld(4, cat(
    widget !== undefined && vf(1, widget), def && ld(2, def), conn !== undefined && vf(3, conn), cvt !== undefined && vf(4, cvt), family !== undefined && ld(101, vf(1, family)),
    list.length && ld(103, cat(...list.map((e) => ld(1, entry(e))))))),
  ...roles.map((r) => ld(5, vf(1, r))),
);
const binding = (kind, idx, sel, dict) => cat(ld(1, cat(vf(1, kind), idx && vf(2, idx))), sel && vf(2, sel), dict && ld(100, cat(vf(1, dict[0]), vf(2, dict[1]))));
const variant = (concrete, ...bindings) => cat(concrete !== undefined && ld(1, idBlock(20000, concrete)), ...bindings.map((b) => ld(2, b)));
const variantIdZero = (...bindings) => cat(ld(1, cat(vf(1, 10001), vf(2, 20000), vf(3, 22000))), ...bindings.map((b) => ld(2, b))); // id 0 is omitted on the wire
const nodeFile = ({ id, service = 20000, kernel, emptyKernel, domain, name, pins = {}, variants = [], extraBlocks = [] }) => cat(
  ld(4, cat(ld(1, idBlock(service, id)), kernel !== undefined && ld(2, vf(5, kernel)), emptyKernel && ld(2, Buffer.alloc(0)), ...variants.map((v) => ld(3, v)))), ...extraBlocks,
  domain !== undefined && vf(203, domain), name !== undefined && vf(206, name),
  ...[100, 101, 102, 103].flatMap((g) => (pins[g] || []).map((p) => ld(g, p))),
);
const typed = (widget, valueField, valueMsg) => cat(vf(1, widget), vf(2, 1), ld(valueField, valueMsg));

test('type tables equal the engine\'s', () => {
  assert.deepEqual(SERVER_TYPES, model.SERVER_TYPES); assert.deepEqual(CLIENT_TYPES, model.CLIENT_TYPES);
  assert.equal(typeStr(1, 14, 10002), 'E<2>'); assert.equal(typeStr(2, 13, 210045), 'E<200045>'); assert.equal(typeStr(1, 14, undefined, 7), 'E<7>');
  assert.equal(typeStr(2, 5, 5), 'Bol'); assert.equal(typeStr(1, 5, 5), 'Flt'); assert.equal(typeStr(1, 99), 'type#99');
});

test('defaults: absent is unset; true, explicit false (enum and dropdown), ints, floats, vectors and enum values', () => {
  const d = (tv, type) => readDefault(parseStrict(new Uint8Array(tv)), type);
  assert.equal(d(typed(6, 106, vf(1, 1)), 'Bol'), true);
  assert.equal(d(typed(6, 106, Buffer.alloc(0)), 'Bol'), false);
  assert.equal(d(typed(3, 103, Buffer.alloc(0)), 'Bol'), false);          // node 835 in the real files
  assert.equal(d(typed(2, 102, vf(1, 7)), 'Int'), 7);
  assert.equal(d(typed(6, 106, vf(1, 6700)), 'E<48>'), 6700);
  assert.equal(d(typed(4, 104, f32(1, 0.25)), 'Flt'), 0.25);
  assert.deepEqual(d(typed(7, 107, ld(1, cat(f32(1, 1), f32(2, 2.5), f32(3, -3)))), 'Vec'), [1, 2.5, -3]);
  assert.equal(d(vf(1, 5), 'Str'), undefined);                              // no recognised value field
});

test('readNode: ids, domain, names, pin types, roles, hidden, defaults, slots, kernel id', () => {
  const bytes = nodeFile({
    id: 22, kernel: 1005, domain: 1, name: 200,
    pins: {
      100: [pinMsg({ name: 100 })],
      102: [
        pinMsg({ name: 100, widget: 1, conn: 1, cvt: 1 }),
        pinMsg({ widget: 10000, roles: [8] }), pinMsg({ widget: 10000, roles: [9] }), pinMsg({ widget: 10000, roles: [10] }), pinMsg({ widget: 10000 }),
        pinMsg({ widget: 6, conn: 4, cvt: 4, roles: [2] }),
        pinMsg({ widget: 6, conn: 4, cvt: 4, def: typed(6, 106, vf(1, 1)), slot: 9 }),
        pinMsg({ widget: 6, conn: 10002, cvt: 14 }),
      ],
      103: [pinMsg({ conn: 3, cvt: 3 })],
    },
  });
  const n = readNode(parseStrict(new Uint8Array(bytes)), maps);
  assert.equal(n.id, 22); assert.deepEqual(n.names, { EN: 'Node', CHS: '节点' }); assert.equal(n.dom, 'Execution'); assert.equal(n.sys, 'Server');
  assert.equal(n.kernel, 1005); assert.equal(n.variant, true); // generic pins make it a variant node
  assert.deepEqual(n.pins['in_flow:0'], { names: { EN: 'Target', CHS: '目标' } });
  assert.deepEqual(n.pins['in_param:0'], { names: { EN: 'Target', CHS: '目标' }, type: 'Ety' });
  assert.deepEqual(['R<K>', 'R<V>', 'D<R<K>,R<V>>', 'R<T>'], [1, 2, 3, 4].map((i) => n.pins[`in_param:${i}`].type));
  assert.deepEqual(n.pins['in_param:5'], { type: 'Bol', hidden: true });
  assert.deepEqual(n.pins['in_param:6'], { type: 'Bol', default: true, slot: 9 });   // slot kept only when it differs from the list position
  assert.equal(n.pins['in_param:7'].type, 'E<2>'); assert.equal(n.pins['out_param:0'].type, 'Int');
  assert.equal(readNode(parseStrict(new Uint8Array(nodeFile({ id: 5, kernel: 5, pins: { 102: [pinMsg({ widget: 2, conn: 3, cvt: 3 })] } }))), maps).kernel, undefined);
  assert.equal(readNode(parseStrict(new Uint8Array(nodeFile({ id: 5, pins: { 102: [pinMsg({ widget: 2, conn: 3, cvt: 3 })] } }))), maps).variant, undefined);
});

test('readNode: client nodes use the client type table; two id blocks are listed; disagreeing ids are an error', () => {
  const client = readNode(parseStrict(new Uint8Array(nodeFile({ id: 200016, service: 20001, pins: { 102: [pinMsg({ widget: 6, conn: 5, cvt: 5 }), pinMsg({ widget: 2, conn: 14, cvt: 14 })] } }))), maps);
  assert.equal(client.sys, 'Client'); assert.deepEqual([client.pins['in_param:0'].type, client.pins['in_param:1'].type], ['Bol', 'Gid']);
  const two = readNode(parseStrict(new Uint8Array(nodeFile({ id: 7, extraBlocks: [ld(4, ld(1, idBlock(20002, 7)))] }))), maps);
  assert.deepEqual(two.services, [20000, 20002]);
  assert.throws(() => readNode(parseStrict(new Uint8Array(nodeFile({ id: 7, extraBlocks: [ld(4, ld(1, idBlock(20002, 8)))] }))), maps), /id blocks disagree/);
  assert.throws(() => readNode(parseStrict(new Uint8Array(Buffer.alloc(0))), maps), /no generic id/);
});

test('variants: selector by position, selector by .8, dictionary, key/value roles, enums; unusable entries are skipped or left without a constraint', () => {
  const types = [{ conn: 3, cvt: 3 }, { conn: 6, cvt: 6 }, { conn: 8, cvt: 8 }];
  const single = readNode(parseStrict(new Uint8Array(nodeFile({
    id: 22, pins: { 102: [pinMsg({ widget: 1, conn: 1, cvt: 1 }), pinMsg({ widget: 10000, list: types })] },
    variants: [variant(22, binding(3, 1, 0)), variant(23, binding(3, 1, 1)), variant(24, binding(3, 1, 2)), variant(30, binding(3, 1, 20, [1, 13])), variant(31, binding(3, 1, 20, [1, 99])), variant(undefined, binding(3, 1, 20, [1, 25])), variant(32, binding(3, 1, 50))],
  }))), maps);
  assert.deepEqual(single.variants.map((v) => [v.kernel, v.c]), [[22, 'C<T:Int>'], [23, 'C<T:Str>'], [24, 'C<T:L<Int>>'], [30, 'C<T:D<Ety,L<Ety>>>'], [31, undefined], [32, undefined]]);

  const enums = readNode(parseStrict(new Uint8Array(nodeFile({
    id: 475, pins: { 102: [pinMsg({ widget: 10000, list: [{ sel: 1, conn: 10002, cvt: 14, enumId: 2 }, { sel: 2, conn: 10003, cvt: 14, enumId: 3 }] }), pinMsg({ widget: 10000, list: [{ sel: 1, conn: 10002, cvt: 14, enumId: 2 }, { sel: 2, conn: 10003, cvt: 14, enumId: 3 }] })] },
    variants: [variant(476, binding(3, 0, 1), binding(3, 1, 1)), variant(477, binding(3, 0, 2), binding(3, 1, 2)), variant(478, binding(3, 0, 1), binding(3, 1, 2))],
  }))), maps);
  assert.deepEqual(enums.variants.map((v) => [v.kernel, v.c]), [[476, 'C<T:E<2>>'], [477, 'C<T:E<3>>'], [478, undefined]]);   // T bound to two different types: no constraint

  const why = [];
  assert.equal(constraintOf(parseStrict(new Uint8Array(variant(1, binding(3, 1, 50)))).filter((f) => f.field === 2).map((f) => parseStrict(f.value)), { in_param: [{ roles: [], variantTypes: [] }, { roles: [], variantTypes: types.map((x) => ({ conn: x.conn, cvt: x.cvt })) }] }, 1, why), null);
  assert.deepEqual(why, ['no variant entry 50 on in_param:1 (its list has 3)']);
  assert.equal(single.noConstraintWhy.length, 2);   // the two variants above that stay without a constraint; only diagnostics, never in the output
  assert.ok(!('noConstraintWhy' in JSON.parse(JSON.stringify(single))));

  const kv = readNode(parseStrict(new Uint8Array(nodeFile({
    id: 60, pins: { 102: [pinMsg({ widget: 10000, roles: [10] }), pinMsg({ widget: 10000, roles: [8], list: [{ conn: 3, cvt: 3 }, { conn: 6, cvt: 6 }] }), pinMsg({ widget: 10000, roles: [9], list: [{ conn: 6, cvt: 6 }, { conn: 3, cvt: 3 }] }), pinMsg({ widget: 10000, roles: [11], list: [{ conn: 8, cvt: 8 }, { conn: 11, cvt: 11 }] })] },
    variants: [variant(61, binding(3, 1, 0), binding(3, 2, 0), binding(3, 3, 0)), variant(62, binding(3, 1, 1), binding(3, 2, 1))],
  }))), maps);
  assert.deepEqual(kv.variants.map((v) => [v.kernel, v.c]), [[61, 'C<K:Int,V:Str>'], [62, 'C<K:Str,V:Int>']]);   // a key-list pin gives the element type, which must agree with K

  assert.equal(constraintOf([], {}, 1), null);
});

test('variants: list-of-T pins give the element type, dictionary pins give K and V, conversion nodes use role 3, hidden pins may be unresolved', () => {
  const read = (spec) => readNode(parseStrict(new Uint8Array(nodeFile(spec))), maps);
  const scalars = [{ conn: 3, cvt: 3 }, { conn: 6, cvt: 6 }], lists = [{ conn: 8, cvt: 8 }, { conn: 11, cvt: 11 }];
  const listNode = read({ id: 3, pins: { 102: [pinMsg({ widget: 10000, list: scalars }), pinMsg({ widget: 10000, list: lists })] }, variants: [variant(30, binding(3, 0, 0), binding(3, 1, 0)), variant(31, binding(3, 0, 1), binding(3, 1, 1))] });
  assert.deepEqual([listNode.pins['in_param:0'].type, listNode.pins['in_param:1'].type], ['R<T>', 'L<R<T>>']);
  assert.deepEqual(listNode.variants.map((v) => v.c), ['C<T:Int>', 'C<T:Str>']);
  const onlyList = read({ id: 4, pins: { 102: [pinMsg({ widget: 10000, list: lists })] }, variants: [variant(40, binding(3, 0, 0))] });
  assert.equal(onlyList.variants[0].c, 'C<T:Int>');
  const mixed = read({ id: 5, pins: { 102: [pinMsg({ widget: 10000, list: [...scalars, ...lists] })] }, variants: [variant(50, binding(3, 0, 2))] });
  assert.equal(mixed.pins['in_param:0'].type, 'R<T>'); assert.equal(mixed.variants[0].c, 'C<T:L<Int>>');   // a pin that also allows scalars is the parameter itself

  const dictNode = read({ id: 6, pins: { 102: [pinMsg({ widget: 10000, roles: [10], list: [{ conn: 27, cvt: 27 }] })], 103: [pinMsg({ conn: 3, cvt: 3 })] }, variants: [variant(60, binding(3, 0, 0, [1, 8])), variant(61, binding(3, 0, 0))] });
  assert.deepEqual(dictNode.variants.map((v) => v.c), ['C<K:Ety,V:L<Int>>', undefined]);   // a dictionary binding without its pair says nothing

  const conv = read({ id: 180, pins: { 102: [pinMsg({ widget: 10000, roles: [3], list: scalars }), pinMsg({ widget: 10000, roles: [2, 3] })], 103: [pinMsg({ widget: 10000, roles: [9], list: [{ conn: 4, cvt: 4 }, { conn: 5, cvt: 5 }] })] },
    variants: [variant(70, binding(3, 0, 0), binding(3, 1, 0), binding(4, 0, 1))] });
  assert.deepEqual([conv.pins['in_param:0'].type, conv.pins['out_param:0'].type], ['R<K>', 'R<V>']);
  assert.equal(conv.variants[0].c, 'C<K:Int,V:Flt>');            // the hidden pin has no list and is ignored
});

test('conversion nodes: role 3 is K on inputs and V on outputs; hidden pins never contribute; one enum family makes the pin that enum', () => {
  const read = (spec) => readNode(parseStrict(new Uint8Array(nodeFile(spec))), maps);
  const op = pinMsg({ widget: 10000, roles: [2, 3], list: [{ conn: 10009, cvt: 14, enumId: 9 }, { conn: 10009, cvt: 14, enumId: 9 }] });
  const conv = read({ id: 180, pins: {
    102: [pinMsg({ widget: 10000, roles: [3], list: [{ conn: 3, cvt: 3 }, { conn: 1, cvt: 1 }] }), op],
    103: [pinMsg({ widget: 10000, roles: [3], list: [{ conn: 4, cvt: 4 }, { conn: 6, cvt: 6 }] })],
  }, variants: [variant(180, binding(3, 0, 0), binding(3, 1, 0), binding(4, 0, 0)), variant(181, binding(3, 0, 1), binding(3, 1, 1), binding(4, 0, 1))] });
  assert.deepEqual([conv.pins['in_param:0'].type, conv.pins['in_param:1'].type, conv.pins['out_param:0'].type], ['R<K>', 'E<9>', 'R<V>']);
  assert.deepEqual(conv.variants.map((v) => v.c), ['C<K:Int,V:Bol>', 'C<K:Ety,V:Str>']);   // the op pin (an enum) would otherwise clash with K
  const mixed = read({ id: 475, pins: { 102: [pinMsg({ widget: 10000, list: [{ sel: 1, conn: 10002, cvt: 14, enumId: 2 }, { sel: 2, conn: 10003, cvt: 14, enumId: 3 }] })] } });
  assert.equal(mixed.pins['in_param:0'].type, 'R<T>');
  assert.equal(typeStr(1, 18, 10000), 'L<Enum>'); assert.equal(typeStr(1, 14, undefined, 0), 'Enum');   // family 0 means "any"
});

test('shared concrete ids: several type combinations behind one id leave no constraint; the same combination listed twice keeps it', () => {
  const read = (spec) => readNode(parseStrict(new Uint8Array(nodeFile(spec))), maps);
  const pins = { 102: [pinMsg({ widget: 10000, list: [{ conn: 3, cvt: 3 }, { conn: 6, cvt: 6 }] })] };
  const shared = read({ id: 22, pins, variants: [variant(130, binding(3, 0, 0)), variant(130, binding(3, 0, 1)), variant(131, binding(3, 0, 1))] });
  assert.deepEqual(shared.variants, [{ kernel: 130 }, { c: 'C<T:Str>', kernel: 131 }]);
  assert.deepEqual(shared.sharedIds, [130]); assert.ok(!('sharedIds' in JSON.parse(JSON.stringify(shared))));
  const twice = read({ id: 22, pins, variants: [variant(130, binding(3, 0, 0)), variant(130, binding(3, 0, 0))] });
  assert.deepEqual(twice.variants, [{ c: 'C<T:Int>', kernel: 130 }]); assert.equal(twice.sharedIds, undefined);
});

test('enum families: from the type block (client pins), also for lists and generic pins; ids absent on the wire are 0 (kernel, variant, slot)', () => {
  const read = (spec) => readNode(parseStrict(new Uint8Array(nodeFile(spec))), maps);
  const n = read({ id: 200051, service: 20001, pins: { 102: [pinMsg({ widget: 6, cvt: 13, family: 200015 }), pinMsg({ widget: 6, cvt: 17, family: 200050 }), pinMsg({ widget: 10000, family: 200022 }), pinMsg({ widget: 6, cvt: 13 })] } });
  assert.deepEqual([0, 1, 2, 3].map((i) => n.pins[`in_param:${i}`].type), ['E<200015>', 'L<E<200050>>', 'E<200022>', 'Enum']);

  const k = read({ id: 200000, service: 20001, emptyKernel: true });
  assert.equal(k.kernel, 0); assert.equal(read({ id: 200001, service: 20001 }).kernel, undefined);
  const z = readNode(parseStrict(new Uint8Array(cat(ld(4, cat(ld(1, idBlock(20000, 9)), ld(3, variantIdZero()), ld(3, variantIdZero()))), ))), maps);
  assert.deepEqual(z.variants, [{ kernel: 0 }]);                  // id 0 is a variant; a missing id block is not; the same id twice counts once

  const s = read({ id: 200114, service: 20001, pins: { 102: [pinMsg({ emptySlot: true, widget: 2, cvt: 3 }), pinMsg({ slot: 1, widget: 2, cvt: 3 }), pinMsg({ emptySlot: true, widget: 2, cvt: 3 }), pinMsg({ widget: 2, cvt: 3 })] } });
  assert.deepEqual([0, 1, 2, 3].map((i) => s.pins[`in_param:${i}`].slot), [undefined, undefined, 0, undefined]);   // slot 0 at position 2 differs; no slot block says nothing
});

// ---- a complete fake install
function fakeInstall(root, { nodes, enums = [], texts = {} }) {
  const entries = (list) => cat(...list.map(([h, s]) => ld(2, cat(ld(1, Buffer.from(`k${h}`)), vf(2, h), ld(3, Buffer.from(s))))));
  const put = (rel, data) => { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, xor(data)); };
  for (const [lang, list] of Object.entries(texts)) put(`TextMap/${lang}/${lang.toLowerCase()}.mihoyobin`, entries(list));
  put('Beyond/BeyondGlobal/g.mihoyobin', ld(1, cat(...enums.map((e) => ld(1, cat(vf(1, e.id), e.title !== undefined && vf(4, e.title), ...(e.values || []).map(([v, h]) => ld(2, cat(v ? vf(1, v) : null, vf(3, h))))))))));
  nodes.forEach((n, i) => put(`Beyond/Node/n${i}.mihoyobin`, n));
  return path.join(root, 'Beyond', 'Node');
}
const TEXTS = { EN: [[100, 'Target'], [200, 'Set It'], [300, 'Compare'], [301, 'Equal'], [302, 'Less']], CHS: [[200, '设置'], [300, '比较']], DE: [[200, 'Setze']] };

test('buildDb: nodes, enums, kernels, names in every language found, source hashes; errors for duplicates and missing folders', () => {
  const dir = tmp();
  const nodeRoot = fakeInstall(dir, {
    texts: TEXTS,
    enums: [{ id: 2, title: 300, values: [[100, 301], [101, 302]] }, { id: 1, values: [[0, 301]] }],
    nodes: [
      nodeFile({ id: 22, kernel: 1005, domain: 1, name: 200, pins: { 102: [pinMsg({ name: 100, widget: 10000, list: [{ conn: 3, cvt: 3 }] })] }, variants: [variant(22, binding(3, 0, 0))] }),
      nodeFile({ id: 5, domain: 4, name: 200, pins: { 103: [pinMsg({ conn: 3, cvt: 3 })] } }),
    ],
  });
  const { doc, notes } = buildDb(nodeRoot, { gameVersion: '9.9' });
  assert.deepEqual(doc.languages, ['CHS', 'DE', 'EN']);
  assert.deepEqual(doc.counts, { nodes: 2, enums: 2, kernels: 2 });
  assert.equal(doc.sources[0].gameVersion, '9.9'); assert.match(doc.sources[0].beyondGlobalSha256, /^[0-9a-f]{64}$/);
  assert.deepEqual(Object.keys(doc.sources[0].textMapSha256), ['CHS', 'DE', 'EN']);
  assert.deepEqual(doc.nodes[22].names, { CHS: '设置', DE: 'Setze', EN: 'Set It' });   // a language without the text is left out
  assert.equal(doc.nodes[22].variants[0].c, 'C<T:Int>');
  assert.deepEqual(doc.kernels, { 22: { node: 22, constraint: 'C<T:Int>' }, 1005: { node: 22 } });
  assert.deepEqual(doc.enums[2], { names: { CHS: '比较', EN: 'Compare' }, values: { 100: { names: { EN: 'Equal' } }, 101: { names: { EN: 'Less' } } } });
  assert.deepEqual(doc.enums[1].values, { 0: { names: { EN: 'Equal' } } });          // value 0 is omitted on the wire and still read
  assert.deepEqual(notes.noConstraint, []); assert.deepEqual(notes.noConstraintWhy, {});
  assert.equal(buildDb(nodeRoot).doc.sources[0].gameVersion, undefined);

  fs.writeFileSync(path.join(nodeRoot, 'dup.mihoyobin'), xor(nodeFile({ id: 5 })));
  assert.throws(() => buildDb(nodeRoot), /duplicate node id 5/);
  fs.rmSync(path.join(nodeRoot, 'dup.mihoyobin'));
  assert.throws(() => buildDb(path.join(dir, 'nowhere')), /not found/);
  fs.mkdirSync(path.join(dir, 'TextMap', 'XX'));                                       // a language folder without a text file is skipped
  assert.deepEqual(textMapFiles(path.join(dir, 'TextMap')).map((x) => x.lang), ['CHS', 'DE', 'EN']);
  fs.writeFileSync(path.join(dir, 'TextMap', 'EN', 'second.mihoyobin'), '');
  assert.throws(() => buildDb(nodeRoot), /expected exactly one EN TextMap/);
  fs.rmSync(path.join(dir, 'TextMap'), { recursive: true });
  assert.throws(() => buildDb(nodeRoot), /TextMap directory not found/);
  fs.rmSync(dir, { recursive: true, force: true });
});

// The editor folder inside a fake install: <drive>/Program Files/Genshin Impact/Genshin Impact game/BeyondAssets/BeyondAssistEditor/Resource/Json
const GAME = ['Program Files', 'Genshin Impact', 'Genshin Impact game'];
const JSON_ROOT = [...GAME, 'BeyondAssets', 'BeyondAssistEditor', 'Resource', 'Json'];

test('findNodeDir: from the drive, from Program Files, from inside the install; missing steps are skipped; no install is null', () => {
  const drive = tmp();
  const jsonRoot = path.join(drive, ...JSON_ROOT);
  const nodeDir = fakeInstall(jsonRoot, { texts: { EN: [] }, nodes: [nodeFile({ id: 5 })] });
  const real = (p) => fs.realpathSync(p);
  assert.equal(real(findNodeDir(drive)), real(nodeDir));
  assert.equal(real(findNodeDir(path.join(drive, 'Program Files'))), real(nodeDir));
  assert.equal(real(findNodeDir(path.join(drive, ...GAME))), real(nodeDir));
  assert.equal(real(findNodeDir(nodeDir)), real(nodeDir));
  assert.equal(real(findNodeDir(path.join(jsonRoot, 'TextMap', 'EN'))), real(nodeDir));   // climbs up, then descends again
  const other = tmp();
  fs.mkdirSync(path.join(other, 'Temp', 'Games', 'nothing'), { recursive: true });
  assert.equal(findNodeDir(path.join(other, 'Temp', 'Games')), null);
  fs.rmSync(path.join(jsonRoot, 'TextMap'), { recursive: true });                          // BeyondGlobal alone is not enough
  assert.equal(findNodeDir(drive), null);
  fs.rmSync(drive, { recursive: true, force: true }); fs.rmSync(other, { recursive: true, force: true });
});

test('readGameVersion: game_version of [General] in the install\'s config.ini; null when absent', () => {
  const drive = tmp();
  const nodeDir = fakeInstall(path.join(drive, ...JSON_ROOT), { texts: { EN: [] }, nodes: [] });
  assert.equal(readGameVersion(nodeDir), null);
  const ini = path.join(drive, ...GAME, 'config.ini');
  fs.writeFileSync(ini, '\uFEFF[Other]\r\ngame_version=1.0.0\r\n[General]\r\nchannel=1\r\ngame_version=7.1.0\r\n');
  assert.equal(readGameVersion(nodeDir), '7.1.0');
  fs.writeFileSync(ini, '[General]\nchannel=1\n');
  assert.equal(readGameVersion(nodeDir), null);
  fs.rmSync(drive, { recursive: true, force: true });
});

test('compareDb: agreement and differences in every shared language, ignoring the enum code', () => {
  const mk = (over = {}) => ({
    languages: ['CHS', 'EN'],
    nodes: { 1: { id: 1, names: { EN: 'A', CHS: 'a' }, sys: 'Server', dom: 'Execution', variant: true, pins: { 'in_param:0': { names: { EN: 'X' }, type: 'E<OCMP>' }, 'in_param:1': { names: { EN: 'Y' }, type: 'D<Cfg,Int>' } }, variants: [{ c: 'C<T:E<OCMP>>', kernel: 5 }, { c: 'C<T:Int>', kernel: 6 }] }, ...over.nodes },
    kernels: { 5: {}, 6: {}, ...over.kernels }, enums: { 2: { values: { 1: { names: { EN: 'one' } } } }, ...over.enums },
  });
  const built = mk();
  built.nodes[1].pins['in_param:0'].type = 'E<2>'; built.nodes[1].pins['in_param:1'].type = 'Dict'; built.nodes[1].variants[0].c = 'C<T:E<2>>';
  const same = compareDb(built, mk()).join('\n');
  assert.ok(!/^DIFF/m.test(same), same);
  const other = mk(); other.nodes[1].names.CHS = 'b'; other.nodes[1].variants[1].c = 'C<T:Str>'; other.nodes[2] = { id: 2, pins: {} }; other.enums[2].values[2] = { names: { EN: 'two' } };
  const diff = compareDb(built, other).join('\n');
  assert.match(diff, /DIFF {2}node names: 1\/2 agree; e\.g\. 1 CHS: "b" -> "a"/);
  assert.match(diff, /DIFF {2}variant constraints \(enum codes ignored\): 1\/2 agree; e\.g\. 1\/6: C<T:Str> -> C<T:Int>/);
  assert.match(diff, /only in built: 0; only in reference: 1/);
  assert.match(diff, /DIFF {2}enum value sets: 0\/1 agree; e\.g\. 2: -1 \+0/);
  const wider = mk(); wider.languages = ['CHS', 'DE', 'EN'];                              // only common languages are compared
  assert.match(compareDb(built, wider).join('\n'), /built CHS, EN; reference CHS, DE, EN; compared CHS, EN/);
});

test('cli: the comparison is always printed and --out always written; defaults; --help; bad usage and bad paths fail cleanly', () => {
  const drive = tmp();
  const nodeDir = fakeInstall(path.join(drive, ...JSON_ROOT), { texts: { EN: [[200, 'N']], CHS: [[200, 'n']] }, nodes: [nodeFile({ id: 5, name: 200, pins: { 103: [pinMsg({ conn: 3, cvt: 3 })] } })] });
  fs.writeFileSync(path.join(drive, ...GAME, 'config.ini'), '[General]\ngame_version=7.1.0\n');
  const ref = path.join(drive, 'ref.json'); fs.writeFileSync(ref, JSON.stringify({ nodes: {}, kernels: {}, enums: {} }));
  const target = path.join(drive, 'out', 'nodes.json');
  let out = '', err = '';
  const w = (s) => { out += s; }, e = (s) => { err += s; };
  assert.equal(run(['--genshin', drive, '--compare', ref, '--out', target], w, e), 0);
  assert.match(out, /^resources: .*Node\ngame version: 7\.1\.0\n/); assert.match(out, /^wrote .*: 1 nodes, 0 enum families, 0 kernels, 2 languages \(CHS, EN\)/m);
  assert.match(out, /only in built: 1 \(e\.g\. 5\); only in reference: 0/);
  const written = JSON.parse(fs.readFileSync(target, 'utf8'));
  assert.deepEqual(written.nodes[5].names, { CHS: 'n', EN: 'N' }); assert.equal(written.sources[0].gameVersion, '7.1.0');

  out = '';   // second run: the reference is the output of the first, and the start folder comes from PROGRAMFILES
  assert.equal(run(['--compare', target, '--out', target, '--version', '1.2.3'], w, e, { PROGRAMFILES: path.join(drive, 'Program Files') }), 0);
  assert.match(out, /game version: 1\.2\.3/); assert.doesNotMatch(out, /^DIFF/m);
  assert.equal(JSON.parse(fs.readFileSync(target, 'utf8')).sources[0].gameVersion, '1.2.3');
  out = '';   // no reference at all: noted, still written
  const fresh = path.join(drive, 'fresh.json');
  assert.equal(run(['--genshin', drive, '--compare', path.join(drive, 'none.json'), '--out', fresh], w, e), 0);
  assert.match(out, /nothing to compare with/); assert.ok(fs.existsSync(fresh));

  out = ''; err = '';
  assert.equal(run(['--help', '--bogus'], w, e), 0); assert.match(out, /^usage: npm run build-db/); assert.equal(err, '');
  assert.equal(run(['--bogus'], w, e), 2); assert.match(err, /error: unknown option --bogus[\s\S]*usage:/);
  assert.equal(run(['stray'], w, e), 2); assert.equal(run(['--limit', 'x'], w, e), 2); assert.equal(run(['--out'], w, e), 2);
  assert.equal(run([], w, e, {}), 2); assert.match(err, /no folder to search/);
  const empty = tmp();
  assert.equal(run(['--genshin', empty], w, e), 1); assert.match(err, /no game resources found/);
  fs.rmSync(drive, { recursive: true, force: true }); fs.rmSync(empty, { recursive: true, force: true });
});
