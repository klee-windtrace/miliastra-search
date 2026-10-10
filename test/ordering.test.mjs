// Order of the resources (see orderResources in model.mjs). test/cases/mounts/graph_folders.gil was built in the editor with
// every resource named "... - NN", NN being its position in the editor's lists, so a correct order reads 01, 02, 03, ...
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { casesDir, readSample } from './helpers.mjs';
import { parseBundle, GRAPH_ORDER } from '../src/model.mjs';

const load = (...p) => parseBundle(fs.readFileSync(path.join(casesDir, ...p)), { file: p.at(-1) });
const num = (r) => Number(r.name.match(/ - (\d\d)$/)?.[1]);
const folders = load('mounts', 'graph_folders.gil');

test('graphs: domain order, then folder (default tab first, custom folders as stored), then name', () => {
  const graphs = folders.resources.filter((r) => r.kind === 'graph' && r.graph && r.graph.kind !== 21002);
  const numbered = graphs.filter((r) => /- \d\d$/.test(r.name));
  assert.deepEqual(numbered.map(num), Array.from({ length: 21 }, (_, i) => i + 1));
  // entity graphs: default tab (alphabetical), then folders B, C, A in the order they were created
  assert.deepEqual(graphs.filter((r) => r.graph.service === 20000).map((r) => `${r.folder}:${r.name}`), [
    'Uncategorized Tab:A - 01', 'Uncategorized Tab:B - 02', 'Uncategorized Tab:C - 03', 'B:In B - 04', 'C:In C - 05', 'C:In C - 06', 'A:In A - 07']);
});

test('domains: entity, status, class, item, composites, character skill, creation skill / status / decision, boolean / integer filter, control skill', () => {
  const dom = (r) => (r.graph.kind === 21002 ? 'composite' : r.graph.service);
  const runs = [];
  for (const r of folders.resources.filter((x) => x.kind === 'graph' && x.graph)) if (runs.at(-1) !== dom(r)) runs.push(dom(r));
  assert.deepEqual(runs, GRAPH_ORDER);
  assert.deepEqual(GRAPH_ORDER, [20000, 20003, 20004, 20005, 'composite', 20002, 20008, 20009, 20007, 20010, 20001, 20006]);
});

test('composites are ordered by palette folder (default tab first), then name, in the graph list and in the declaration list', () => {
  const bodies = folders.resources.filter((r) => r.graph?.kind === 21002);
  const decls = folders.resources.filter((r) => r.className === 'COMPOSITE_NODE_DECL');
  assert.deepEqual(decls.map(num), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(bodies.map((r) => r.folder), ['Uncategorized Tab', 'Uncategorized Tab', 'Uncategorized Tab', 'Composite Tab A', 'Composite Tab C', 'Composite Tab B']);
});

test('composite palette folders are found through the declaration id, not the body GUID', () => {
  // composite_folders.gil: folders A..I hold A1..A3 .. I1..I3 (their body GUIDs differ from the ids the palette lists), 01..03 are in the default tab
  const b = load('mounts', 'composite_folders.gil');
  const bodies = b.resources.filter((r) => r.graph?.kind === 21002);
  const decls = b.resources.filter((r) => r.className === 'COMPOSITE_NODE_DECL');
  const expected = ['01', '02', '03', ...[...'ABCDEFGHI'].flatMap((c) => [1, 2, 3].map((n) => c + n))];
  assert.deepEqual(decls.map((r) => r.name), expected);
  assert.equal(bodies.length, 30);
  bodies.forEach((r, i) => assert.equal(r.folder, i < 3 ? 'Uncategorized Tab' : expected[i][0], `${expected[i]}`));
});

test('prefabs, statuses and skills: custom folders first, the default tab last, items in the order of their folder', () => {
  for (const cls of ['OBJECT', 'UNIT_STATUS', 'SKILL']) {
    const rs = folders.resources.filter((r) => r.className === cls && /- \d\d$/.test(r.name));
    assert.deepEqual(rs.map(num), [1, 2, 3, 4, 5, 6], cls);
    assert.equal(rs.at(-1).folder, 'Uncategorized Tab', cls);
    assert.equal(rs.at(-1).folderRank, -1, cls);
  }
  // the prefab family and the all-entities family list prefabs with the same type code: the prefab family decides
  for (const cls of ['CUSTOM_CREATION_SKILL', 'CONTROL_SKILL']) { // one item in each of the two folders and in the default tab
    const rs = folders.resources.filter((r) => r.className === cls);
    assert.deepEqual(rs.map((r) => r.folderRank), [0, 1, -1], cls);
  }
  assert.equal(folders.resources.find((r) => r.name === 'B in 1st - 01' && r.className === 'OBJECT').folder, 'First prefab tab');
});

test('only the sorted groups move: the other resources keep their order, and idx still numbers the file', () => {
  const moved = (r) => (r.kind === 'graph' && r.graph) || r.className === 'COMPOSITE_NODE_DECL' || ['OBJECT', 'UNIT_STATUS', 'SKILL', 'CUSTOM_CREATION_SKILL', 'CONTROL_SKILL'].includes(r.className);
  const groups = new Map();
  for (const r of folders.resources.filter((x) => !moved(x))) { const k = `${r.role}:${r.className}`; groups.set(k, [...(groups.get(k) || []), r.idx]); }
  for (const [k, idxs] of groups) assert.deepEqual(idxs, [...idxs].sort((a, b) => a - b), k);
  assert.equal(new Set(folders.resources.map((r) => `${r.role}:${r.idx}`)).size, folders.resources.length);
});

test('a file without folder information is ordered by domain, then name (composites after the normal graphs)', () => {
  const b = load('composites', 'var_change.gia');
  assert.deepEqual(b.resources.filter((r) => r.kind === 'graph').map((r) => r.graph.name || r.name), ['VAR_TEST', '', '', '']);
  assert.deepEqual(b.resources.filter((r) => r.className === 'COMPOSITE_NODE_DECL').map((r) => r.name), ['VAR_TEST_1', 'VAR_TEST_2', 'VAR_TEST_3']);
});

test('names are compared case-insensitively with numbers by value, whatever the machine locale', () => {
  const b = parseBundle(readSample('sample_0_main.gia'), { file: 'x' });
  const collate = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare;
  const graphs = b.resources.filter((r) => r.kind === 'graph' && r.graph.kind !== 21002);
  for (const service of new Set(graphs.map((r) => r.graph.service))) {
    const names = graphs.filter((r) => r.graph.service === service).map((r) => r.name || r.graph.name);
    assert.deepEqual(names, [...names].sort(collate), `service ${service}`);
  }
});
