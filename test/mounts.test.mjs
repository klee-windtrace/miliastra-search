// Static/dynamic entities and graph mounts, on test/cases/mounts/test_mount.gil (game 7.1.0, see FORMAT.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle, CLASS_ORDER } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs } from '../src/refs.mjs';
import { mountsOf } from '../src/mounts.mjs';
import { casesDir } from './helpers.mjs';
import { run } from './expected.mjs';

const file = path.join(casesDir, 'mounts', 'test_mount.gil');
const b = parseBundle(fs.readFileSync(file), { file });
const db = new NodeDb();
const cls = (name, className) => b.resources.find((r) => r.name === name && (!className || r.className === className))?.className;
// "host -> graph names mounted there", e.g. "CLASS:Class_Both_On_Both" -> ['player:Mounted_Class_Player', ...]
const mountedOn = (host, className) => mountsOf(b).filter((m) => m.host.name === host && (!className || m.host.className === className)).map((m) => `${m.slot}:${m.graph.graph.name}`).sort();

test('static vs dynamic entities: no dynamic component list = STATIC_ENTITY', () => {
  assert.equal(cls('Native_Static'), 'STATIC_ENTITY');
  assert.equal(cls('Prefab_Static', 'STATIC_ENTITY'), 'STATIC_ENTITY');
  assert.equal(cls('Converted_Static2Dynamic'), 'OBJECT_ENTITY');
  assert.equal(cls('Native_Dymanic'), 'OBJECT_ENTITY');
  assert.equal(cls('Prefab_Dynamic', 'OBJECT_ENTITY'), 'OBJECT_ENTITY');
  assert.equal(cls('Converted_Dynamic2Static'), 'STATIC_ENTITY');
  assert.equal(b.resources.find((r) => r.name === 'Pyro Slime').className, 'CREATION_ENTITY');
});

test('limits: static entities are counted apart and not against the OBJECT_ENTITY cap', () => {
  const { limits } = buildRefs([b], db);
  assert.equal(limits.staticEntities, 3);
  assert.equal(limits.resources.find((r) => r.className === 'OBJECT_ENTITY').used, 5);
  const out = run(['warns', path.relative(path.join(casesDir, '..', '..'), file), '--format', 'text']);
  assert.match(out, /^static entities: 3$/m);
});

test('graphs mounted on prefabs, entities and creations', () => {
  assert.deepEqual(mountedOn('Prefab_Graphs'), ['entity:Mounted_Everywhere', 'entity:Mounted_Prefab']);
  assert.deepEqual(mountedOn('Entity_Graphs'), ['entity:Mounted_Entity', 'entity:Mounted_Everywhere']);
  assert.deepEqual(mountedOn('Pyro Slime'), ['entity:Mounted_Creation', 'entity:Mounted_Everywhere']);
  assert.deepEqual(mountedOn('Stage Entity'), ['entity:Mounted_Everywhere']);
});

test('graphs mounted on player / character templates (and none on empty ones)', () => {
  assert.deepEqual(mountedOn('With_PlayerGraph', 'PLAYER_TEMPLATE'), ['player:Mounted_Player']);
  assert.deepEqual(mountedOn('With_CharacterGraph(Edit Character)', 'CHARACTER_TEMPLATE'), ['character:Mounted_Character']);
  assert.deepEqual(mountedOn('With_Both_And_Common', 'PLAYER_TEMPLATE'), ['player:Mounted_Everywhere', 'player:Mounted_Player']);
  assert.deepEqual(mountedOn('With_Both_And_Common(Edit Character)', 'CHARACTER_TEMPLATE'), ['character:Mounted_Character', 'character:Mounted_Everywhere']);
  assert.deepEqual(mountedOn('No_Graphs'), []);
});

test('class graphs carry <class> and are mounted per Player / Character slot', () => {
  assert.deepEqual(mountedOn('Class_Character'), ['character:Mounted_Class_Character']);
  assert.deepEqual(mountedOn('Class_Player'), ['player:Mounted_Class_Player']);
  assert.deepEqual(mountedOn('Class_Both_On_Both'), ['character:Mounted_Class_Character', 'character:Mounted_Class_Player', 'player:Mounted_Class_Character', 'player:Mounted_Class_Player']);
  assert.deepEqual(mountedOn('Class_Empty'), []);
  assert.match(run(['code', path.relative(path.join(casesDir, '..', '..'), file), '--format', 'text']), /^GRAPH '<class>Mounted_Class_Player'/m);
});

test('status graph mount (a status has at most one)', () => {
  assert.deepEqual(mountedOn('Status_Mounted'), ['status:Mounted_Status']);
  assert.deepEqual(mountedOn('Status_Empty'), []);
});

test('refs: mount kind, --name works on the plain graph name', () => {
  const { refs } = buildRefs([b], db);
  const m = refs.filter((r) => r.kind === 'mount' && r.key === 'Mounted_Everywhere');
  assert.equal(m.length, 6);
  assert.deepEqual([...new Set(m.map((r) => r.role))].sort(), ['character', 'entity', 'player']);
});

test('stripped dynamic entity (fewer dynamic components, but still some) stays dynamic', () => {
  assert.equal(cls('Native_Dymanic_Stripped'), 'OBJECT_ENTITY');
  assert.equal(cls('Converted_Dynamic2Static'), 'STATIC_ENTITY');
  assert.equal(buildRefs([b], db).limits.staticEntities, 3);
});

test('prefab editing area (root 8: unsaved drafts and their copies) is never listed', () => {
  // Prefab_Copied exists only as a draft instance in the editing area; Prefab_Placed/Prefab_NotPlaced are saved prefabs.
  assert.equal(b.resources.filter((r) => r.name === 'Prefab_Copied').length, 0);
  assert.equal(b.resources.filter((r) => r.name === 'Prefab_Placed').length, 1);
  assert.equal(b.resources.filter((r) => r.name === 'Prefab_NotPlaced').length, 1);
  const rel = path.relative(path.join(casesDir, '..', '..'), file);
  for (const cmd of ['dump', 'code', 'refs']) assert.doesNotMatch(run([cmd, rel, '--format', 'text']), /Prefab_Copied/, cmd);
  assert.equal(b.resources.filter((r) => r.section === 'root.8').length, 0);
});

test('dump and code are two views of one analysis: graph mounts and refs survive in both', () => {
  const rel = path.relative(path.join(casesDir, '..', '..'), file);
  for (const cmd of ['dump', 'code']) assert.doesNotMatch(run([cmd, rel, '--format', 'text']), /mounted_on/, cmd); // the MOUNT lines say it
  assert.match(run(['dump', rel, '--format', 'text']), /^MOUNT 'Mounted_Player' -> PLAYER_TEMPLATE "With_PlayerGraph" player$/m);
  assert.doesNotMatch(run(['code', rel, '--format', 'text']), /^MOUNT /m);
});

test('dump: a prefab shows how many entities use it, an entity the prefab it was created from, a native object only its id', () => {
  const text = run(['dump', file, '--format', 'text']);
  assert.match(text, /^RESOURCE \/\(default\)\/"Prefab_Static" OBJECT guid='\d+' parent=\(entities: 1\)$/m);
  assert.match(text, /^RESOURCE \/\(default\)\/"Prefab_NotPlaced" OBJECT guid='\d+' parent=\(entities: 0\)$/m);
  assert.match(text, /^RESOURCE "Prefab_Static" STATIC_ENTITY guid='\d+' parent=\(\d+:"Prefab_Static"\)$/m);
  assert.match(text, /^RESOURCE "Native_Static" STATIC_ENTITY guid='\d+' parent=\(20001430\)$/m);
  assert.match(text, /^RESOURCE "Native_Dymanic" OBJECT_ENTITY guid='\d+' parent=\(20001856\)$/m);
  assert.doesNotMatch(text, /GIL_PLAYER_ENTITY[^\n]*parent=/, 'only prefab entities have a parent column');
  const html = run(['dump', file, '--format', 'html']);
  assert.match(html, /<th>Guid<\/th><th>Parent<\/th>/);
  assert.match(html, /\(entities: <span class="count">1<\/span>\)/);
});

test('the prefab of an entity is found in a .gia too, by the entity definition', () => {
  const gia = path.join(casesDir, 'mounts', 'test_folders.gia');
  const bg = parseBundle(fs.readFileSync(gia), { file: gia });
  const ents = bg.resources.filter((r) => r.classId === 3);
  assert.ok(ents.length && ents.every((r) => r.parentId != null), 'every object entity names its parent id');
  assert.ok(run(['dump', gia, '--format', 'text']).split('\n').filter((l) => / OBJECT_ENTITY | STATIC_ENTITY /.test(l)).every((l) => /parent=\(\d+[:)]/.test(l)));
});

test('dump lists graphs as a table (no STRUCT entries); code still lists structs', () => {
  const s3 = path.join(casesDir, 'gia', 'sample_3.gia');
  const dumpText = run(['dump', s3, '--format', 'text']);
  assert.doesNotMatch(dumpText, /^STRUCT /m);
  assert.match(run(['code', s3, '--format', 'text']), /^STRUCT /m);
  const html = run(['dump', s3, '--format', 'html']);
  assert.doesNotMatch(html, /<h2 id="struct-/);
  assert.match(html, /<h2 id="graphs-1">Graphs \(1\)<\/h2>/);
});

test('dump order: declarations, graphs, then resources by class (CLASS_ORDER, the rest alphabetically); no declaration splits the graphs', () => {
  const s9 = path.join(casesDir, 'gia', 'sample_9.gia');
  const kinds = run(['dump', s9, '--format', 'text']).split('\n').filter(Boolean).map((l) => l.split(' ')[0]);
  assert.deepEqual([...new Set(kinds)], ['DECL', 'GRAPH', 'RESOURCE']);
  const classes = run(['dump', s9, '--format', 'text']).split('\n').filter((l) => l.startsWith('RESOURCE ')).map((l) => (l.match(/ ([A-Z][A-Z_]+) guid=/) || [, 'class#'])[1]); // an unnamed class sorts after the named ones
  const rank = (c) => { const i = CLASS_ORDER.indexOf(c); return i < 0 ? CLASS_ORDER.length : i; };
  for (let i = 1; i < classes.length; i++) assert.ok(rank(classes[i - 1]) <= rank(classes[i]), `${classes[i - 1]} before ${classes[i]}`);
  const html = run(['dump', s9, '--format', 'html']);
  assert.doesNotMatch(html, /<hr>/); assert.match(html, /<h2 id="declarations-1">Declarations \(1\)<\/h2>/);
  const code = run(['code', s9, '--format', 'text']).split('\n').filter((l) => /^(GRAPH|DECL |STRUCT)/.test(l)).map((l) => l.split(' ')[0]);
  assert.ok(code.lastIndexOf('DECL') < code.indexOf('GRAPH') && code.lastIndexOf('STRUCT') < code.indexOf('GRAPH'));
});
