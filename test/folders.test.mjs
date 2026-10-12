// test/cases/mounts/test_folders.gil (+ the same content exported as .gia): graph folders, merged mounts, static vs
// dynamic entities with a kind-1-only component list, signal declaration titles, composite descriptions, and the
// "GRAPH ..." summary being an ordinary line (not a heading) in the line-oriented formats.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { casesDir } from './helpers.mjs';
import { run } from './expected.mjs';

const dir = path.join(casesDir, 'mounts');
const load = (n) => { const file = path.join(dir, n); return parseBundle(fs.readFileSync(file), { file }); };
const gil = load('test_folders.gil'), gia = load('test_folders.gia');
const rel = (n) => `test/cases/mounts/${n}`;
const folderOf = (b, name) => b.resources.find((r) => r.kind === 'graph' && r.graph.name === name)?.folder;

test('every graph of a level knows its folder; "default" ones sit in the default tab, "custom" ones in New Folder', () => {
  assert.equal(folderOf(gil, 'Saved to folder (My)'), 'My');
  assert.equal(folderOf(gil, 'Saved to default (Uncategorized Tab)'), 'Uncategorized Tab');
  assert.equal(folderOf(gil, 'Saved to custom (New Folder)'), 'New Folder');
  const graphs = gil.resources.filter((r) => r.kind === 'graph' && r.graph.kind !== 21002);
  assert.equal(graphs.length, 23);
  for (const r of graphs) {
    const n = r.graph.name;
    if (n === 'Saved to folder (My)') continue;
    assert.equal(r.folder, /custom/i.test(n) ? 'New Folder' : 'Uncategorized Tab', n); // every service domain: status, class, item, skills, filters, creation*
  }
});

test('composites: a custom palette folder is read from the palette; one in no folder is in the default tab', () => {
  // (a composite body has no name of its own: it is named by its declaration, so find it by GUID)
  const folderOfBody = (guid) => gil.resources.find((r) => r.kind === 'graph' && r.graph.kind === 21002 && r.guid === guid)?.folder;
  assert.equal(folderOfBody(1610612738), 'New Folder'); // "Composite in custom"
  assert.equal(folderOfBody(1610612737), 'Uncategorized Tab'); // "Composite in default"
  // the folder is a /name/ prefix of the quoted name; the default tab is told by its place in the index, not by its (localized) name
  const dump = run(['dump', rel('test_folders.gil'), '--format', 'text']);
  assert.match(dump, /^GRAPH \/New Folder\/'<composite>Composite in custom' ENTITY_NODE_GRAPH guid='\d+' nodes=0$/m);
  assert.match(dump, /^GRAPH \/\(default\)\/'<composite>Composite in default' /m);
  assert.doesNotMatch(dump, /Uncategorized Tab\//);
  assert.doesNotMatch(dump, /folder=/);
});

test('a .gia has no folder index: no folder is printed', () => {
  assert.ok(gia.resources.every((r) => r.folder == null));
  assert.doesNotMatch(run(['dump', rel('test_folders.gia'), '--format', 'text']), /^GRAPH \//m);
  assert.match(run(['dump', rel('test_folders.gil'), '--format', 'text']), /^GRAPH \/My\/'Saved to folder \(My\)' ENTITY_NODE_GRAPH guid='\d+' nodes=0$/m);
});

test('the same graph on several identical hosts is listed once with a count (refs); a dump graph line does not list its mounts', () => {
  const dump = run(['dump', rel('test_folders.gil'), '--format', 'text']);
  assert.doesNotMatch(dump, /mounted_on/);
  const refs = run(['refs', rel('test_folders.gil'), '--format', 'text']);
  assert.match(refs, /^mount +'Saved to folder \(My\)' +4 entity: OBJECT_ENTITY:"Wireframe Cuboid" \(x3\); OBJECT_ENTITY:"Wireframe Cube"$/m);
});

test('static vs dynamic: a kind-1-only component list is still static (the Pavilion), real dynamic lists are not', () => {
  const cls = (b, name) => b.resources.find((r) => r.name === name && r.section === 'root.5')?.className;
  assert.equal(cls(gil, 'Pavilion 20001488'), 'STATIC_ENTITY');
  assert.equal(cls(gil, 'Wireframe Cuboid'), 'OBJECT_ENTITY');
  assert.equal(cls(gil, 'Wireframe Cube'), 'OBJECT_ENTITY');
});

test('static vs dynamic works the same in a .gia (the entity definition is in resource field 12)', () => {
  const cls = (b, name) => b.resources.find((r) => r.name === name && r.classId === 3)?.className;
  assert.equal(cls(gia, 'Pavilion 20001488'), 'STATIC_ENTITY');
  assert.equal(cls(gia, 'Wireframe Cuboid'), 'OBJECT_ENTITY');
  assert.equal(cls(gia, 'Wireframe Cube'), 'OBJECT_ENTITY');
  // sample_9 has a native static entity with no dynamic list at all, and dynamic ones; creations are never static
  const s9 = load('../gia/sample_9.gia');
  assert.equal(cls(s9, 'Fabric-Roof Hut'), 'STATIC_ENTITY');
  assert.equal(cls(s9, 'Stone Functional Platform'), 'OBJECT_ENTITY');
  assert.equal(s9.resources.find((r) => r.name === 'Pyro Slime').className, 'CREATION_ENTITY');
  // and a .gil agrees with the .gia it was made from
  const kinds = (b) => b.resources.filter((r) => r.classId === 3 && r.section !== 'root.4').map((r) => `${r.name}:${r.className}`).sort();
  assert.deepEqual(kinds(gil), kinds(gia));
});

test('a send signal is declared once, titled by its signal name (the "Send Signal to Server Node Graph" twin is dropped)', () => {
  for (const n of ['test_folders.gia', 'test_folders.gil']) {
    const out = run(['code', rel(n), '--format', 'text']);
    const decls = out.split('\n').filter((l) => l.startsWith('DECL '));
    assert.equal(decls.length, 1, n);
    assert.match(decls[0], /^DECL "Signal_Name" SIGNAL_NODE_DECL guid='\d+'$/);
    assert.match(run(['dump', rel(n), '--details', '--format', 'text']), /^DECL "Signal_Name" SIGNAL_NODE_DECL class=14 guid='\d+' category=SEND_SIGNAL$/m);
    assert.match(out, /^DECL\/Signal_Name SEND_SIGNAL name='Signal_Name'/m);
    assert.doesNotMatch(out, /Send Signal to Server Node Graph/);
  }
});

test('a composite prints the description of its declaration', () => {
  for (const n of ['test_folders.gia', 'test_folders.gil']) {
    const out = run(['dump', rel(n), '--format', 'text']);
    assert.match(out, /^GRAPH (\/[^/]*\/)?'<composite>Composite in default' .* description='Composite Description'/m, n);
    assert.doesNotMatch(out, /^GRAPH (\/[^/]*\/)?'<composite>Composite in custom' .*description=/m, n);
  }
});

test('.gia and .gil of the same content print the same graphs, nodes and declarations (modulo GUIDs, folders, mounts)', () => {
  const norm = (s) => s.split('\n').filter((l) => l && !/^(#|GRAPH |RESOURCE |MOUNT )/.test(l)).map((l) => l.replace(/'\d{9,}'|\b\d{9,}\b/g, 'N')).sort();
  for (const cmd of ['code']) assert.deepEqual(norm(run([cmd, rel('test_folders.gil'), '--format', 'text'])), norm(run([cmd, rel('test_folders.gia'), '--format', 'text'])));
});

test('"GRAPH ..." is an ordinary line in text, color, md and htm; html keeps its heading (anchor target)', () => {
  const f = rel('test_folders.gil');
  const text = run(['dump', f, '--format', 'text']);
  assert.match(text, /^GRAPH \/My\/'Saved to folder \(My\)'/m);
  assert.doesNotMatch(text, /^#+ GRAPH/m);
  const md = run(['dump', f, '--format', 'md']);
  assert.doesNotMatch(md, /^#+ .*GRAPH/m);
  assert.match(md, /^\*\*GRAPH\*\* \/My\/'/m);
  const htm = run(['dump', f, '--format', 'htm']);
  assert.doesNotMatch(htm, /<h2>.*GRAPH/);
  assert.match(htm, /<pre class="lines">.*GRAPH/s);
  const html = run(['dump', f, '--format', 'html']);
  assert.match(html, /<h2 id="graphs-\d+">Graphs \(\d+\)<\/h2>/, 'the graphs of a dump are one table');
  assert.match(html, /<td>'<span class="graphName">Saved to folder \(My\)<\/span>'<\/td>/);
  const code = run(['code', f, '--format', 'html']);
  assert.match(code, /<h2 id="graph-saved-to-folder-my">/);
  assert.match(code, /<a href="#graph-saved-to-folder-my">/);
});
