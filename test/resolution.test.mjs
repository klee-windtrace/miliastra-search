import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs, loadRules, ANY_NAME_KEY } from '../src/refs.mjs';
import { here } from './helpers.mjs';

// Fixture: test/cases/resolution/test_resolution.gia – graphs "Static" (everything resolvable), "Dynamic" (same,
// slightly broken so catch-all/dynamic paths remain) and "Indirect" (names read via proxy nodes).
const db = new NodeDb();
const file = path.join(here, 'cases', 'resolution', 'test_resolution.gia');
const { refs, findings } = buildRefs([parseBundle(fs.readFileSync(file), { file: 'test_resolution.gia' })], db);
const inGraph = (g) => refs.filter((r) => r.graph === g);
const keys = (rs) => rs.map((r) => `${r.kind}:${r.key}`).sort();

test('event name pins in ref-rules.json really are the name outputs', () => {
  const rules = loadRules();
  for (const [id, idx] of Object.entries(rules.eventNamePins).filter(([k]) => k !== '_doc')) {
    assert.match(db.pinName(Number(id), 'out_param', idx), /^(Variable|Timer) Name$/, `node ${id}`);
    assert.ok(rules.eventNodesWithNameOutput[id]);
  }
});

test('Static: every listener is strict – only concrete names, no catch-all, no dynamic', () => {
  const s = inGraph('Static');
  assert.equal(s.filter((r) => r.mode === 'dynamic').length, 0);
  const listens = s.filter((r) => r.role === 'listen');
  assert.deepEqual(keys(listens), [
    'custom_variable:var1', 'custom_variable:var2', 'custom_variable:var3',
    'graph_variable:gvar1', 'graph_variable:gvar1', 'graph_variable:gvar3', 'graph_variable:gvar4',
    'timer:tm',
  ]);
  assert.ok(!s.some((r) => r.key === ANY_NAME_KEY));
});

test('Static: handler names resolve through Get Local Variable, Get Node Graph Variable and (nested) composites', () => {
  const s = inGraph('Static');
  const via = (k) => s.find((r) => r.role === 'listen' && r.key === k && r.resolvedVia)?.resolvedVia.join(' | ');
  assert.match(via('gvar3'), /graph variable "name" = "gvar3"/);
  assert.match(via('tm'), /composite input "x"/);
  assert.match(via('gvar4'), /Create Composite Node\(1\)/); // composite inside composite
});

test('Static: a global timer listener with nothing after it is reported as reacting to nothing', () => {
  assert.ok(findings.some((f) => f.type === 'listener-no-handlers' && f.graph === 'Static' && f.kind === 'global_timer'));
});

test('Dynamic: catch-all paths and unresolvable comparisons are kept as dynamic', () => {
  const d = inGraph('Dynamic');
  const catchAll = d.filter((r) => r.key === ANY_NAME_KEY).map((r) => r.kind).sort();
  assert.deepEqual(catchAll, ['custom_variable', 'global_timer', 'graph_variable']);
  // custom variable / graph variable listeners still keep the names found before the catch-all node
  assert.deepEqual(keys(d.filter((r) => r.role === 'listen' && r.mode === 'literal')), ['custom_variable:var1', 'custom_variable:var2', 'custom_variable:var3', 'graph_variable:gvar1']);
  // timer: compared against a Get Custom Variable value -> handler with unknown name, but no catch-all
  const t = d.filter((r) => r.kind === 'timer' && r.role === 'listen');
  assert.equal(t.length, 1); assert.equal(t[0].key, '<dynamic>'); assert.equal(t[0].mode, 'dynamic');
  assert.equal(findings.filter((f) => f.type === 'catch-all-listener' && f.graph === 'Dynamic').length, 3);
});

test('Indirect: names read through proxy nodes are all static', () => {
  const i = inGraph('Indirect');
  assert.equal(i.filter((r) => r.mode === 'dynamic' || r.mode === 'unset').length, 0);
  const named = i.filter((r) => ['custom_variable', 'graph_variable', 'timer', 'global_timer'].includes(r.kind) && r.mode === 'literal');
  assert.deepEqual(keys(named), ['custom_variable:test1', 'global_timer:test3', 'graph_variable:test2', 'graph_variable:test2', 'timer:test4']);
  const stop = named.find((r) => r.kind === 'timer');
  assert.match(stop.note, /graph variable "test2" = "test4"/);
  assert.ok(!findings.some((f) => f.graph === 'Indirect' && f.level === 'warn'));
});
