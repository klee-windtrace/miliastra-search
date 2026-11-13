import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle, buildVariable } from '../src/model.mjs';
import { scanVariables } from '../src/varscan.mjs';
import { walkRaw } from '../src/decode.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs } from '../src/refs.mjs';
import { analyzeBundle } from '../src/analyze.mjs';
import { fileDump } from '../src/dump.mjs';
import { dumpBlocks } from '../src/present/dump.mjs';
import { textLines, plain } from '../src/present/doc.mjs';
import { here, lenField, varField, varint } from './helpers.mjs';

// variables_beyond.gia (a .gia: templates, prefab, entities that add / remove / retype / edit a variable) and variables_classic.gil (a .gil: the
// player and character templates hold the same 40 variables, the character's edited). Both are 7.2.0 files.
const db = new NodeDb();
const dir = path.join(here, 'cases', 'variables72');
const load = (name) => parseBundle(fs.readFileSync(path.join(dir, name)), { file: name });
const beyond = load('variables_beyond.gia'), classic = load('variables_classic.gil'), refs = load('variables_ref.gil');
const resource = (b, className, name) => b.resources.find((r) => r.className === className && (name == null || r.name === name));
const summary = (r) => Object.fromEntries(r.variables.map((v) => [v.name, v.value.v ?? null]));
const dump = (b) => fileDump(b, db, { analysis: analyzeBundle(b, db) });

test('.gia: templates, prefab and entities carry their variables', () => {
  assert.deepEqual(summary(resource(beyond, 'PLAYER_TEMPLATE', 'Default Template')), { On_Player: '1' });
  assert.deepEqual(summary(resource(beyond, 'PLAYER_TEMPLATE', 'Custom Player Template')), { Custom_Player: '3' });
  assert.deepEqual(summary(resource(beyond, 'CHARACTER_TEMPLATE', 'Default Template(Edit Character)')), { On_Character: '2' });
  assert.deepEqual(summary(resource(beyond, 'CHARACTER_TEMPLATE', 'Custom Player Template(Edit Character)')), { Custom_Character: '4' });
  assert.deepEqual(summary(resource(beyond, 'OBJECT', 'Empty Model')), { On_Prefab: '10' });
  assert.deepEqual(summary(resource(beyond, 'CREATION', 'Basic')), { On_Basic: '7' });
  assert.deepEqual(summary(resource(beyond, 'CREATION', 'Complex')), { On_Complex: '8' });
  assert.deepEqual(summary(resource(beyond, 'OBJECT_ENTITY', 'Removed')), {});
  assert.deepEqual(summary(resource(beyond, 'OBJECT_ENTITY', 'Added')), { On_Prefab: '10', Extra: '12' });
  assert.equal(resource(beyond, 'PLAYER_TEMPLATE').variables[0].label, 'Str');
  // a .gia without a stage: no stage variables
  assert.ok(!beyond.resources.some((r) => r.className === 'GIL_LEVEL_ENTITY'));
});

test('.gia: a creation entity names its creation prefab (the parent of every entity is read, not only an object entity\'s)', () => {
  const basic = resource(beyond, 'CREATION_ENTITY', 'Basic');
  assert.equal(basic.parentId, resource(beyond, 'CREATION', 'Basic').guid);
  assert.equal(resource(beyond, 'OBJECT_ENTITY', 'Empty Model').parentId, 10005018); // a native object: no resource of the file
});

test('dump: the prefab table lists the stage, player and character templates first; the entity table only what an entity changes', () => {
  const v = dump(beyond).variables;
  assert.deepEqual(v.prefabs.map((x) => [x.owner.kind, x.owner.name, x.name, x.type, x.value.value]), [
    ['player', 'Default Template', 'On_Player', 'Str', '1'],
    ['player', 'Custom Player Template', 'Custom_Player', 'Str', '3'],
    ['character', 'Default Template(Edit Character)', 'On_Character', 'Str', '2'],
    ['character', 'Custom Player Template(Edit Character)', 'Custom_Character', 'Str', '4'],
    ['prefab', 'Empty Model', 'On_Prefab', 'Str', '10'],
    ['prefab', 'Basic', 'On_Basic', 'Str', '7'],
    ['prefab', 'Complex', 'On_Complex', 'Str', '8'],
  ]);
  // "Same" changes nothing, so it has no row; "Removed" keeps the type of the prefab's variable and has no value; a native object has no prefab to compare with
  assert.deepEqual(v.entities.map((x) => [x.entity.name, x.prefab?.guid ?? null, x.name, x.change, x.type, x.value?.value ?? null]), [
    ['Value', 1077936129, 'On_Prefab', 'edit', 'Str', '11'],
    ['Type', 1077936129, 'On_Prefab', 'newtype', 'Int', 0],
    ['Added', 1077936129, 'Extra', 'add', 'Str', '12'],
    ['Removed', 1077936129, 'On_Prefab', 'delete', 'Str', null],
    ['Empty Model', 10005018, 'On_Entity', 'add', 'Str', '9'],
    ['Basic', 1082130433, 'add', 'add', 'Str', ''],
    ['Complex', 1082130434, 'add', 'add', 'Str', ''],
  ]);
  assert.equal(v.entities.find((x) => x.entity.name === 'Value').prefab.name, 'Empty Model');
  assert.equal(v.entities.find((x) => x.entity.guid === 1077936136).prefab.name, null);
});

test('dump text: one VARIABLE line per variable, one VARIABLE_CHANGE line per change', () => {
  const lines = textLines(dumpBlocks(dump(beyond))).map(plain);
  assert.ok(lines.includes('VARIABLE Player 1086324737:"Default Template" \'On_Player\' : Str = \'1\''));
  assert.ok(lines.includes('VARIABLE 1077936129:"Empty Model" \'On_Prefab\' : Str = \'10\''));
  assert.ok(lines.includes('VARIABLE_CHANGE 1077936132:"Type" (1077936129:"Empty Model") \'On_Prefab\' newtype: Int = 0'));
  assert.ok(lines.includes('VARIABLE_CHANGE 1077936135:"Removed" (1077936129:"Empty Model") \'On_Prefab\' delete: Str'));
  assert.ok(lines.includes('VARIABLE_CHANGE 1077936136:"Empty Model" (10005018) \'On_Entity\' add: Str = \'9\''));
  assert.equal(lines.filter((l) => l.startsWith('VARIABLE ')).length, 7);
  assert.equal(lines.filter((l) => l.startsWith('VARIABLE_CHANGE ')).length, 7);
});

test('.gil: every type of variable on the player and character templates', () => {
  const player = resource(classic, 'PLAYER_TEMPLATE'), character = resource(classic, 'CHARACTER_TEMPLATE');
  assert.equal(player.variables.length, 40);
  assert.deepEqual(player.variables.map((v) => v.name), character.variables.map((v) => v.name));
  const by = (r, n) => r.variables.find((v) => v.name === n);
  const labels = Object.fromEntries(player.variables.map((v) => [v.name, v.label]));
  const SCALARS = { String: 'Str', Integer: 'Int', Float: 'Flt', Boolean: 'Bol', Vector: 'Vec', Entity: 'Ety', GUID: 'Gid', Config: 'Cfg', Prefab: 'Pfb', Faction: 'Fct' };
  for (const [name, t] of Object.entries(SCALARS)) {
    assert.equal(labels[name], t); assert.equal(labels[`${name}_0`], `L<${t}>`); assert.equal(labels[`${name}_2`], `L<${t}>`);
    assert.deepEqual(by(player, `${name}_0`).value, { k: 'list', items: [] });
    assert.equal(by(player, `${name}_2`).value.items.length, 2);
  }
  assert.equal(labels.Struct, 'Struct'); assert.equal(labels.Struct_2, 'L<Struct>');
  assert.equal(labels.String_Dict, 'Dict<Str,Str>'); assert.equal(labels.Integer_Dict, 'Dict<Int,Str>'); assert.equal(labels.Entity_Dict, 'Dict<Ety,Str>');
  // the player's values are the defaults; the character's are edited (a few stay at their zero: the file stores them as such)
  assert.deepEqual(by(player, 'String').value, { k: 'str', v: '' });
  assert.deepEqual(by(character, 'String').value, { k: 'str', v: '1' });
  assert.deepEqual(by(character, 'Float').value, { k: 'float', v: 1 });
  assert.deepEqual(by(character, 'Boolean').value, { k: 'bool', v: true });
  assert.deepEqual(by(player, 'Boolean_2').value.items, [{ k: 'bool', v: false }, { k: 'bool', v: false }]);
  assert.deepEqual(by(character, 'Vector').value, { k: 'vec', v: [1, 1, 1] });
  assert.deepEqual(by(character, 'Integer_2').value.items, [{ k: 'int', v: 1 }, { k: 'int', v: 1 }]);
  assert.deepEqual(by(character, 'Float_2').value.items, [{ k: 'float', v: 1 }, { k: 'float', v: 1 }]);
  assert.deepEqual(by(character, 'GUID_2').value.items, [{ k: 'id', ty: 'Gid', v: 1 }, { k: 'id', ty: 'Gid', v: 1 }]);
  assert.deepEqual(by(character, 'Config').value, { k: 'id', ty: 'Cfg', v: 1 });
  assert.deepEqual(by(character, 'Prefab_2').value.items, [{ k: 'id', ty: 'Pfb', v: 1 }, { k: 'id', ty: 'Pfb', v: 1 }]);
  assert.deepEqual(by(character, 'Faction_2').value.items, [{ k: 'id', ty: 'Fct', v: 1 }, { k: 'id', ty: 'Fct', v: 1 }]);
  assert.deepEqual(by(character, 'Vector_2').value.items, [{ k: 'vec', v: [1, 1, 1] }, { k: 'vec', v: [1, 1, 1] }]);
  // a struct: its id, and its four fields in order; a list of structs holds whole structs
  const struct = by(character, 'Struct');
  assert.equal(struct.structId, classic.resources.find((r) => r.kind === 'struct').struct.id);
  assert.deepEqual(struct.value, { k: 'struct', items: [{ k: 'str', v: '1' }, { k: 'int', v: 1 }, { k: 'float', v: 1 }, { k: 'bool', v: true }] });
  assert.equal(by(character, 'Struct_2').value.items.length, 2);
  assert.deepEqual(by(character, 'Struct_0').value, { k: 'list', items: [] });
  // dictionaries: one pair, its key and value typed; the key types come from the variable
  assert.deepEqual(by(character, 'String_Dict').value.pairs, [{ k: 'pair', key: { k: 'str', v: '1' }, value: { k: 'str', v: '1' } }]);
  assert.deepEqual(by(character, 'Integer_Dict').value.pairs, [{ k: 'pair', key: { k: 'int', v: 1 }, value: { k: 'str', v: '1' } }]);
  assert.deepEqual(by(character, 'Prefab_Dict').value.pairs[0].key, { k: 'id', ty: 'Pfb', v: 1 });
  assert.deepEqual(by(character, 'Entity_Dict').value.pairs, []);
  assert.deepEqual(by(character, 'Faction_Dict').value.pairs, [{ k: 'pair', key: { k: 'id', ty: 'Fct', v: 1 }, value: { k: 'str', v: '1' } }]);
});

test('.gil: the stage declares dictionaries with several pairs, with lists and structs as values', () => {
  const stage = resource(classic, 'GIL_LEVEL_ENTITY');
  const by = (n) => stage.variables.find((v) => v.name === n);
  assert.deepEqual(stage.variables.map((v) => v.name), ['On_Stage', 'String', 'String_List', 'Struct', 'Struct_List']);
  assert.deepEqual(by('On_Stage').value, { k: 'str', v: '0' });
  assert.equal(by('String').label, 'Dict<Str,Str>');
  const str = (v) => ({ k: 'str', v });
  assert.deepEqual(by('String').value.pairs.map((p) => [p.key.v, p.value.v]), [['1', '1'], ['2', '2'], ['3', '3']]);
  assert.deepEqual(by('String_List').value.pairs.map((p) => [p.key.v, p.value.items]), [
    ['1', [str('1.1'), str('1.2'), str('1.3')]], ['2', [str('2.1'), str('2.2'), str('2.3')]], ['3', [str('3.1'), str('3.2'), str('3.3')]]]);
  assert.equal(by('Struct').label, 'Dict<Str,Struct>');
  assert.deepEqual(by('Struct').value.pairs.map((p) => p.key.v), ['1']);
  assert.deepEqual(by('Struct_List').value.pairs.map((p) => [p.key.v, p.value.items.length]), [['1', 1], ['2', 2]]);
  const second = by('Struct_List').value.pairs[1].value.items;
  assert.deepEqual(second[0].items, [str('1'), { k: 'int', v: 1 }, { k: 'float', v: 1 }, { k: 'bool', v: true }]);
  assert.deepEqual(second[1].items, [str(''), { k: 'int', v: 0 }, { k: 'float', v: 0 }, { k: 'bool', v: false }]);
});

test('.gil: the players mirror their template, so only the prefab table has rows', () => {
  assert.equal(classic.resources.filter((r) => r.className === 'GIL_PLAYER_ENTITY').length, 9);
  const v = dump(classic).variables;
  assert.equal(v.prefabs.length, 85);
  assert.deepEqual([...new Set(v.prefabs.map((x) => x.owner.kind))], ['stage', 'player', 'character']);
  assert.equal(v.entities.length, 0);
  assert.equal(v.prefabs.find((x) => x.name === 'Struct' && x.owner.kind === 'player').struct.name, 'Struct');
});

test('varscan: negative integers, packed lists and a struct list, read from hand-made bytes', () => {
  const variable = (name, type, payload) => lenField(1, Buffer.concat([lenField(2, Buffer.from(name)), varField(3, type), lenField(4, Buffer.concat([varField(1, type), lenField(10 + type, payload)]))]));
  const neg = (n) => varint(BigInt.asUintN(64, BigInt(n)));
  const comp = Buffer.concat([varField(1, 1), lenField(11, Buffer.concat([
    variable('i', 3, Buffer.concat([Buffer.from([0x08]), neg(-5)])),
    variable('l', 8, lenField(1, Buffer.concat([neg(-1), varint(7)]))),
    variable('f', 10, lenField(1, Buffer.from(new Uint8Array(new Float32Array([1.5, -2]).buffer)))),
    variable('s', 11, Buffer.concat([lenField(1, Buffer.from('a')), lenField(1, Buffer.from('b'))])),
  ]))]);
  const def = walkRaw(lenField(7, comp));
  const [i, l, f, s] = scanVariables(def, 7);
  assert.deepEqual(i.value, { k: 'int', v: -5 });
  assert.deepEqual(l.value.items, [{ k: 'int', v: -1 }, { k: 'int', v: 7 }]);
  assert.deepEqual(f.value.items, [{ k: 'float', v: 1.5 }, { k: 'float', v: -2 }]);
  assert.deepEqual(s.value.items, [{ k: 'str', v: 'a' }, { k: 'str', v: 'b' }]);
  assert.deepEqual(scanVariables(walkRaw(lenField(7, Buffer.concat([varField(1, 3)]))), 7), [], 'a list without the variable component holds none');
  assert.deepEqual(scanVariables([], 7), []);
});

// ---- findings ----
// test_resolution.gia uses the custom variable "test" (read as Str in 'Dynamic'), "test1" (read in 'Indirect') and "var1".."var3" (listened to in 'Dynamic' and 'Static').
const resolutionFile = path.join(here, 'cases', 'resolution', 'test_resolution.gia');
const owner = (name, ...vars) => ({ kind: 'opaque', className: 'OBJECT', name, guid: 1, variables: vars.map(([n, typeId, value = null]) => buildVariable({ name: n, typeId, structId: null, keyType: null, valueType: null, value })) });
function build(declare, mutate = () => {}) {
  const bundle = parseBundle(fs.readFileSync(resolutionFile), { file: 'test_resolution.gia' });
  bundle.resources.push(...declare);
  mutate(bundle);
  return buildRefs([bundle], db);
}
const of = (findings, type) => findings.filter((f) => f.type === type);

test('custom variables: a file without any entity or template is not checked', () => {
  const { findings } = build([]);
  assert.equal(findings.filter((f) => f.type.startsWith('custom-variable-')).length, 0);
});

test('custom-variable-undeclared: every used name nobody declares, once per name', () => {
  const { findings } = build([owner('P', ['test', 6])]);
  assert.deepEqual(of(findings, 'custom-variable-undeclared').map((f) => f.key).sort(), ['test1', 'var1', 'var2', 'var3']);
  assert.equal(of(findings, 'custom-variable-undeclared')[0].level, 'info');
  assert.equal(of(findings, 'custom-variable-type-mismatch').length, 0, '"test" is read as Str and declared as Str');
});

test('custom-variable-type-mismatch: the type selected in the code is declared nowhere', () => {
  const { findings } = build([owner('P', ['test', 3]), owner('Q', ['test', 11])]);
  const f = of(findings, 'custom-variable-type-mismatch');
  assert.equal(f.length, 1);
  assert.equal(f[0].key, 'test');
  assert.equal(f[0].level, 'info');
  assert.ok(f[0].message.includes('accessed as Str') && f[0].message.includes('declared as Int on "P"; L<Str> on "Q"'), f[0].message);
  // one declaration of the type used is enough: the entity is only known at run time
  assert.equal(of(build([owner('P', ['test', 3]), owner('Q', ['test', 6])]).findings, 'custom-variable-type-mismatch').length, 0);
});

test('custom-variable-type-conflict: one finding per name declared with different types', () => {
  const { findings } = build([owner('P', ['test', 3], ['other', 6]), owner('Q', ['test', 6], ['other', 6]), owner('R', ['test', 6])]);
  const f = of(findings, 'custom-variable-type-conflict');
  assert.deepEqual(f.map((x) => x.key), ['test']);
  assert.equal(f[0].level, 'info');
  assert.ok(f[0].message.includes('2 different types: Int on "P"; Str on "Q", "R"'), f[0].message);
  // a dictionary is told by its key and value types, a struct by its id
  const dict = (k, v) => ({ ...owner('D', ['d', 27]), variables: [buildVariable({ name: 'd', typeId: 27, structId: null, keyType: k, valueType: v, value: null })] });
  assert.equal(of(build([dict(3, 6), dict(6, 6)]).findings, 'custom-variable-type-conflict').length, 1);
  const st = (id) => ({ ...owner('S'), variables: [buildVariable({ name: 's', typeId: 25, structId: id, keyType: null, valueType: null, value: null })] });
  assert.equal(of(build([st(7), st(8)]).findings, 'custom-variable-type-conflict').length, 1);
  assert.equal(of(build([st(7), st(7)]).findings, 'custom-variable-type-conflict').length, 0);
});

test('suppression: a comment on a node that uses the name silences custom-variable-undeclared and -type-mismatch, and goes stale with the problem', () => {
  const probe = build([owner('P', ['test', 3])]);
  const node = (graph, key) => probe.refs.find((r) => r.kind === 'custom_variable' && r.graph === graph && r.key === key && r.mode === 'literal').node;
  const setComment = (b, graph, index, text) => { b.resources.find((r) => r.graph?.name === graph).graph.nodes.find((n) => n.index === index).comment = text; };

  const quiet = build([owner('P', ['test', 3])], (b) => setComment(b, 'Dynamic', node('Dynamic', 'test'), 'custom-variable-type-mismatch: converted before use'));
  assert.equal(of(quiet.findings, 'custom-variable-type-mismatch').length, 0);
  assert.equal(of(quiet.findings, 'stale-suppression-comment').length, 0);

  const undeclared = build([owner('P', ['test', 3])], (b) => setComment(b, 'Indirect', node('Indirect', 'test1'), 'custom-variable-undeclared'));
  assert.ok(!of(undeclared.findings, 'custom-variable-undeclared').some((f) => f.key === 'test1'));
  assert.ok(of(undeclared.findings, 'custom-variable-undeclared').some((f) => f.key === 'var1'), 'other names still show');

  // "test" is declared as Str: the mismatch comment has nothing to silence any more
  const stale = build([owner('P', ['test', 6])], (b) => setComment(b, 'Dynamic', node('Dynamic', 'test'), 'custom-variable-type-mismatch'));
  const s = of(stale.findings, 'stale-suppression-comment');
  assert.equal(s.length, 1);
  assert.equal(s[0].key, 'test');
  assert.equal(s[0].level, 'warn');
});

test('.gil: ids and big integers in a value name the resource of the file they point at', () => {
  const rows = dump(refs).variables.prefabs.filter((x) => x.owner.kind === 'stage');
  const by = (n) => rows.find((x) => x.name === n).value;
  const res = (class_name, name) => ({ class_name, name });
  assert.deepEqual(by('Sky').resource, res('ENVIRONMENT_CONFIGURATION', 'Environment Configuration'));
  assert.deepEqual(by('UI').resource, res('INTERFACE_LAYOUT', 'Default Layout'));
  assert.deepEqual(by('List').items.map((x) => x.resource), [res('ENVIRONMENT_CONFIGURATION', 'Environment Configuration'), res('INTERFACE_LAYOUT', 'Default Layout')]);
  assert.deepEqual(by('GUID').resource, res('GIL_LEVEL_ENTITY', 'Stage Entity'));
  assert.deepEqual(by('Config').resource, res('CLASS', 'Custom Class'));
  assert.deepEqual(by('Prefab').resource, res('OBJECT', 'Empty Model'));
  assert.deepEqual([by('Dict').pairs[0].key.resource, by('Dict').pairs[0].value.resource], [res('GIL_LEVEL_ENTITY', 'Stage Entity'), res('OBJECT', 'Empty Model')]);
  assert.equal(by('Entity').resource, undefined); // an entity id is no resource id
  const text = textLines(dumpBlocks(dump(refs))).map(plain).filter((l) => l.startsWith('VARIABLE '));
  assert.ok(text.some((l) => l.endsWith('\'Prefab\' : Pfb = id:1077936129 {OBJECT:"Empty Model"}')));
});

// variables_graph.gia (7.2.0): "New Node Graph" publishes String / Integer / Faction / Float / Entity and keeps Private to itself; "Test5" publishes
// a Faction; "Status" is a status graph with a dictionary. Prefabs, templates and entities mount the first graph and edit its values; the two
// entities called "Prefab_no_graph" and "Prefab_edited" (the editor named them after their prefab) are an entity of a prefab without the graph that
// mounts it itself and an entity of "Prefab_edited" that set the values back to the graph's.
const graphFile = load('variables_graph.gia');
const graphDump = dump(graphFile).variables;
const value = (x) => (x.value?.kind === 'map' ? null : x.value?.value ?? null);

test('graph variables: one row per variable of every graph, with the published ones told apart', () => {
  assert.deepEqual(graphDump.graphs.map((x) => [x.graph.tag ?? null, x.graph.name, x.name, x.type, x.public, value(x)]), [
    [null, 'New Node Graph', 'String', 'Str', true, 'graph'],
    [null, 'New Node Graph', 'Integer', 'Int', true, 0],
    [null, 'New Node Graph', 'Faction', 'Fct', true, 1],
    [null, 'New Node Graph', 'Float', 'Flt', true, 2],
    [null, 'New Node Graph', 'Entity', 'Ety', true, 0],
    [null, 'New Node Graph', 'Private', 'Bol', false, true],
    [null, 'Test5', 'Faction', 'Fct', true, 0],
    ['status', 'Status', 'Status', 'Dict<Str,Str>', false, null],
  ]);
});

test('mounts of a .gia carry the values the host sets for the published variables of the graph', () => {
  const edits = (name, cls) => resource(graphFile, cls ?? 'OBJECT', name).mounts.map((m) => m.edits.map((e) => [e.name, e.label, e.value.v]));
  assert.deepEqual(edits('Prefab_no_edits'), [[]]);                                  // nothing differs from the graph: nothing stored
  assert.deepEqual(edits('Prefab_no_graph'), []);
  assert.deepEqual(edits('Prefab_edited'), [[['String', 'Str', 'prefab'], ['Integer', 'Int', 10], ['Faction', 'Fct', 0], ['Float', 'Flt', 20]]]);
  assert.deepEqual(edits('Entity_no_edits', 'OBJECT_ENTITY'), edits('Prefab_edited'));   // an entity stores what it ends up with, not only what it changed
  assert.equal(resource(graphFile, 'OBJECT_ENTITY', 'Entity_no_graph').mounts.length, 0);
  assert.deepEqual(resource(graphFile, 'PLAYER_TEMPLATE').mounts.map((m) => m.slot), ['player']);
  assert.deepEqual(resource(graphFile, 'CHARACTER_TEMPLATE').mounts.map((m) => [m.slot, m.edits.map((e) => e.value.v)]), [['character', [5]], ['character', [5]]]);
});

test('dump: a prefab lists the published graph variables it edits, after its own custom variables', () => {
  assert.deepEqual(graphDump.prefabs.map((x) => [x.owner.kind, x.owner.name, x.graph.name, x.name, x.type, value(x)]), [
    ['player', 'Default Template', 'New Node Graph', 'String', 'Str', 'player'],
    ['character', 'Default Template(Edit Character)', 'New Node Graph', 'Faction', 'Fct', 5],
    ['character', 'Default Template(Edit Character)', 'Test5', 'Faction', 'Fct', 5],
    ['prefab', 'Prefab_edited', 'New Node Graph', 'String', 'Str', 'prefab'],
    ['prefab', 'Prefab_edited', 'New Node Graph', 'Integer', 'Int', 10],
    ['prefab', 'Prefab_edited', 'New Node Graph', 'Faction', 'Fct', 0],
    ['prefab', 'Prefab_edited', 'New Node Graph', 'Float', 'Flt', 20],
  ]);
});

test('dump: an entity is compared with the graph values of its prefab; a graph its prefab does not mount is compared with the graph', () => {
  const rows = graphDump.entities.map((x) => [x.entity.guid, x.prefab.name, x.graph.name, x.name, x.change, value(x)]);
  assert.deepEqual(rows, [
    // restored: the entity's values are the graph's, the prefab's are edited
    [1077936138, 'Prefab_edited', 'New Node Graph', 'String', 'edit', 'graph'],
    [1077936138, 'Prefab_edited', 'New Node Graph', 'Integer', 'edit', 0],
    [1077936138, 'Prefab_edited', 'New Node Graph', 'Faction', 'edit', 1],
    [1077936138, 'Prefab_edited', 'New Node Graph', 'Float', 'edit', 2],
    [1077936139, 'Prefab_edited', 'New Node Graph', 'String', 'edit', 'entity'],
    [1077936139, 'Prefab_edited', 'New Node Graph', 'Integer', 'edit', 100],
    [1077936139, 'Prefab_edited', 'New Node Graph', 'Faction', 'edit', 200],
    [1077936139, 'Prefab_edited', 'New Node Graph', 'Float', 'edit', 0],
  ]);
  // no row: an entity without the graph, one that copies its prefab's values, one whose prefab has no graph and which keeps the graph's values
  for (const guid of [1077936132, 1077936134, 1077936137]) assert.ok(!rows.some((r) => r[0] === guid));
  assert.ok(graphDump.entities.every((x) => x.name !== 'Entity' && x.name !== 'Private'));
});

test('dump text: GRAPH_VARIABLE lines with (public), the graph in braces on the rows of a host', () => {
  const lines = textLines(dumpBlocks(dump(graphFile))).map(plain);
  assert.ok(lines.includes('GRAPH_VARIABLE \'New Node Graph\' \'String\' : Str (public) = \'graph\''));
  assert.ok(lines.includes('GRAPH_VARIABLE \'New Node Graph\' \'Private\' : Bol = Yes'));
  assert.ok(lines.includes('GRAPH_VARIABLE \'<status>Status\' \'Status\' : Dict<Str,Str> = {\'Status\': \'Status\'}'));
  assert.ok(lines.includes('VARIABLE Player 1086324737:"Default Template" \'String\' {\'New Node Graph\'} : Str = \'player\''));
  assert.ok(lines.includes('VARIABLE_CHANGE 1077936139:"Entity_edited" (1077936131:"Prefab_edited") \'Faction\' {\'New Node Graph\'} edit: Fct = id:200'));
  assert.ok(lines.findIndex((l) => l.startsWith('GRAPH_VARIABLE ')) < lines.findIndex((l) => l.startsWith('VARIABLE ')));
});
