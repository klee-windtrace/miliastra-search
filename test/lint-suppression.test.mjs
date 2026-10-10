import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs } from '../src/refs.mjs';
import { here } from './helpers.mjs';

// Fixture: test_resolution.gia has no comments of its own, so these tests mutate the parsed in-memory graph
// (setting Node.comment) before calling buildRefs, using nodes whose current behaviour is already established
// by test/resolution.test.mjs: node [1]/[2]/[4] in 'Dynamic' have a catch-all path, [3] in 'Dynamic' has an
// unresolvable comparison, [4] in 'Static' has no handlers at all, and [2] in 'Static' is a fully strict switch.
const db = new NodeDb();
const file = path.join(here, 'cases', 'resolution', 'test_resolution.gia');
function build(mutate) {
  const bundle = parseBundle(fs.readFileSync(file), { file: 'test_resolution.gia' });
  mutate(bundle);
  return buildRefs([bundle], db);
}
function setComment(bundle, graphName, nodeIndex, comment) {
  const gr = bundle.resources.find((r) => r.graph?.name === graphName);
  gr.graph.nodes.find((n) => n.index === nodeIndex).comment = comment;
}

test('catch-all-listener: suppressed by a matching comment, and flagged stale when the comment no longer applies', () => {
  const { findings: base } = build(() => {});
  assert.ok(base.some((f) => f.type === 'catch-all-listener' && f.graph === 'Dynamic' && f.message.includes('[1]')));

  const { findings: suppressedOut } = build((b) => setComment(b, 'Dynamic', 1, 'known issue, see TODO-123 (catch-all-listener)'));
  assert.ok(!suppressedOut.some((f) => f.type === 'catch-all-listener' && f.message.includes('[1]')));
  assert.ok(!suppressedOut.some((f) => f.type === 'stale-suppression-comment' && f.message.includes('[1]')));

  // node [2] in 'Static' is a fully strict switch (no catch-all) – the same comment there is now wrong.
  const { findings: staleOut } = build((b) => setComment(b, 'Static', 2, 'catch-all-listener'));
  assert.ok(!staleOut.some((f) => f.type === 'catch-all-listener' && f.graph === 'Static'));
  const stale = staleOut.find((f) => f.type === 'stale-suppression-comment' && f.message.includes('[2]') && f.graph === 'Static');
  assert.ok(stale, 'expected a stale-suppression-comment finding');
  assert.equal(stale.level, 'warn');
});

test('listener-no-handlers: suppressed by a matching comment, and flagged stale once handlers exist', () => {
  const { findings: base } = build(() => {});
  assert.ok(base.some((f) => f.type === 'listener-no-handlers' && f.graph === 'Static'));

  const { findings: suppressedOut } = build((b) => setComment(b, 'Static', 4, 'listener-no-handlers: intentional, timer unused for now'));
  assert.ok(!suppressedOut.some((f) => f.type === 'listener-no-handlers'));

  // node [4] in 'Dynamic' has a catch-all path (not "no handlers at all") – the comment doesn't apply there.
  const { findings: staleOut } = build((b) => setComment(b, 'Dynamic', 4, 'listener-no-handlers'));
  assert.ok(staleOut.some((f) => f.type === 'stale-suppression-comment' && f.graph === 'Dynamic' && f.message.includes('[4]') && f.message.includes('catch-all')));
});

test('dynamic-reference: suppressed by a matching comment, and flagged stale once it resolves statically', () => {
  const { findings: base } = build(() => {});
  assert.ok(base.some((f) => f.type === 'dynamic-reference' && f.graph === 'Dynamic' && f.message.includes('[3]')));

  const { findings: suppressedOut } = build((b) => setComment(b, 'Dynamic', 3, 'dynamic-reference on purpose'));
  assert.ok(!suppressedOut.some((f) => f.type === 'dynamic-reference'));

  // node [1] in 'Indirect' (When Custom Variable Changes) resolves "test1" statically – comment doesn't apply.
  const { findings: staleOut } = build((b) => setComment(b, 'Indirect', 1, 'dynamic-reference'));
  assert.ok(staleOut.some((f) => f.type === 'stale-suppression-comment' && f.graph === 'Indirect' && f.message.includes('[1]')));
});

test('used-but-undeclared: suppressed by a comment on the referencing node, stays quiet for names that get declared', () => {
  const { findings: base } = build(() => {});
  assert.equal(base.filter((f) => f.type === 'used-but-undeclared' && f.graph === 'Static').length, 3);

  // node [2] in 'Static' is the physical source of the gvar1/gvar3/gvar4 handler refs.
  const { findings: suppressedOut } = build((b) => setComment(b, 'Static', 2, 'used-but-undeclared, these are declared in a shared base graph'));
  assert.equal(suppressedOut.filter((f) => f.type === 'used-but-undeclared' && f.graph === 'Static').length, 0);
  assert.equal(suppressedOut.filter((f) => f.type === 'stale-suppression-comment' && f.graph === 'Static').length, 0);

  // now actually declare gvar1 in 'Static' – the comment covering it is now stale, but gvar3/gvar4 stay quiet.
  const { findings: mixedOut } = build((b) => {
    setComment(b, 'Static', 2, 'used-but-undeclared');
    const gr = b.resources.find((r) => r.graph?.name === 'Static');
    gr.graph.variables.push({ name: 'gvar1', typeId: 6, isPublic: false, structId: null, value: null });
  });
  assert.equal(mixedOut.filter((f) => f.type === 'used-but-undeclared' && f.graph === 'Static').length, 0);
  const stale = mixedOut.find((f) => f.type === 'stale-suppression-comment' && f.graph === 'Static' && f.key === 'gvar1');
  assert.ok(stale, 'expected gvar1 specifically to be flagged as a stale suppression');
  assert.ok(!mixedOut.some((f) => f.type === 'stale-suppression-comment' && f.key === 'gvar3'));
});
