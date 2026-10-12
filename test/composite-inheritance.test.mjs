// Composites cannot own graph variables – using one inside a composite body really refers to the variable of
// whichever graph the composite gets inlined into at runtime (see refs.mjs "composite -> real-graph attribution").
// The fixtures live in test/cases/composites, apart from test/cases/gia (core.test.mjs) and test/cases/gil (gil.test.mjs):
// they come from engine 7.1.0 and decode with a few unknown fields (see `check`), which would break the "census is empty" /
// "engineVersion === 7.0.0" assumptions those suites make for every file in their folders.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs } from '../src/refs.mjs';
import { overviewLines } from './helpers.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, 'cases', 'composites');
const db = new NodeDb();
const read = (n) => fs.readFileSync(path.join(dir, n));
const bundleGia = () => parseBundle(read('test_composite.gia'), { file: 'test_composite.gia' });
const bundleGil = () => parseBundle(read('test_composite.gil'), { file: 'test_composite.gil' });

test('newer-engine (7.1.0) sample decodes without throwing, for both .gia and .gil', () => {
  const a = bundleGia(); assert.equal(a.engineVersion, '7.1.0');
  const b = bundleGil(); assert.equal(b.engineVersion, '7.1.0'); assert.equal(b.format, 'gil');
});

test('composite chain: New Node Graph calls "Create Composite Node" (x2), which calls "Create Composite Node(1)" (x1)', () => {
  const { refs } = buildRefs([bundleGia()], db);
  const calls = refs.filter((r) => r.kind === 'composite' && r.mode === 'usage' && r.role === 'call');
  assert.equal(calls.filter((r) => r.key === 'Create Composite Node' && r.graph === 'New Node Graph').length, 2);
  assert.equal(calls.filter((r) => r.key === 'Create Composite Node(1)' && r.graph === "<composite>Create Composite Node").length, 1);
});

test('graph-variable get/set inside a composite is hoisted to the real calling graph, multiplied by every call path', () => {
  const { refs } = buildRefs([bundleGia()], db);
  // Physical refs stay put, inside the composite bodies, with no owner of their own.
  const physical = refs.filter((r) => r.kind === 'graph_variable' && r.mode === 'literal');
  assert.equal(physical.filter((r) => r.graph === '<composite>Create Composite Node' && r.role === 'get').length, 1);
  assert.equal(physical.filter((r) => r.graph === '<composite>Create Composite Node(1)' && r.role === 'set').length, 1);
  // Hoisted copies: the composite is called twice (directly once, and once more via the doubly-called outer
  // composite), so each of the one physical get/set becomes two hoisted refs against "New Node Graph".
  const hoisted = refs.filter((r) => r.kind === 'graph_variable' && r.viaComposite?.length);
  assert.equal(hoisted.filter((r) => r.role === 'get' && r.graph === 'New Node Graph').length, 2);
  assert.equal(hoisted.filter((r) => r.role === 'set' && r.graph === 'New Node Graph').length, 2);
  // No bogus "used-but-undeclared" for the composite's own (nonexistent) scope, and the declared variable is
  // considered used (via the hoisted copies), so no "declared-but-unused" either.
  const { findings } = buildRefs([bundleGia()], db);
  assert.equal(findings.filter((f) => f.kind === 'graph_variable').length, 0);
});

test('refs overview: composite-attributed graph_variable accesses merge into one line for the real graph, not the composite', () => {
  const { refs } = buildRefs([bundleGia()], db);
  const lines = overviewLines(refs.filter((r) => r.kind === 'graph_variable'));
  assert.equal(lines.length, 1);
  assert.match(lines[0], /graph_variable\s+"Var_1" \(Int\)\s+\['New Node Graph'\]: 2 get, 2 set/);
});

test('literal ids resolve against known resources: Pfb->OBJECT, Gid->OBJECT_ENTITY, Cfg->SKILL, big Int->INTERFACE_LAYOUT', () => {
  const { refs } = buildRefs([bundleGia()], db);
  const byKey = (k) => refs.find((r) => r.kind === 'literal_id' && r.key === k);
  assert.equal(byKey('Cfg:1098907649').resolvedName, 'SKILL:"test_skill"');
  assert.equal(byKey('Gid:1077936131').resolvedName, 'OBJECT_ENTITY:"entity_test"');
  assert.equal(byKey('Int: 1073741825').resolvedName, 'INTERFACE_LAYOUT:"Default Layout"');
  // This Pfb id doesn't match any resource guid present in the file, so it gets no annotation.
  assert.equal(byKey('Pfb:10005018').resolvedName, null);
});

test('a Cfg id that matches a UI_CONTROL/INTERFACE_LAYOUT/etc. resource is NOT annotated (Cfg excludes those classes)', () => {
  const { refs } = buildRefs([bundleGia()], db);
  // The "Default Layout" resource has the guid of the Int literal 1073741825 above; a Cfg-typed id pointing at an
  // INTERFACE_LAYOUT resource must not get a resolvedName.
  for (const r of refs.filter((x) => x.kind === 'literal_id' && x.key.startsWith('Cfg:'))) assert.doesNotMatch(r.resolvedName || '', /INTERFACE_LAYOUT|UI_CONTROL|ENVIRONMENT_CONFIGURATION|ENTITY_DEPLOYMENT_GROUP/);
});

test('effective node count expands composite calls: New Node Graph = 7 own + 2x(4 + 1) from the composite chain = 17', () => {
  const { limits } = buildRefs([bundleGia()], db);
  const gs = limits.graphSizes.find((g) => g.graph === 'New Node Graph');
  assert.ok(gs, 'New Node Graph should be in graphSizes');
  assert.equal(gs.nodes, 17);
});

test('resource-class limits count OBJECT/OBJECT_ENTITY/SKILL resources actually present', () => {
  const { limits } = buildRefs([bundleGia()], db);
  const byClass = Object.fromEntries(limits.resources.map((r) => [r.className, r]));
  assert.equal(byClass.OBJECT.used, 1); assert.equal(byClass.OBJECT.max, 1000);
  assert.equal(byClass.OBJECT_ENTITY.used, 1); assert.equal(byClass.OBJECT_ENTITY.max, 3000);
  assert.equal(byClass.SKILL.used, 1); assert.equal(byClass.SKILL.max, 100);
});

test('.gil version of the same stage produces the same composite/graph_variable/literal_id story', () => {
  const { refs: refsGia } = buildRefs([bundleGia()], db);
  const { refs: refsGil } = buildRefs([bundleGil()], db);
  const summarize = (refs) => overviewLines(refs.filter((r) => r.kind === 'graph_variable' || (r.kind === 'composite' && r.mode === 'usage'))).sort();
  assert.deepEqual(summarize(refsGil), summarize(refsGia));
});
