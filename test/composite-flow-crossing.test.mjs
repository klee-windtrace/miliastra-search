import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs, ANY_NAME_KEY } from '../src/refs.mjs';
import { here, overviewLines } from './helpers.mjs';

// Fixtures: test_All_Static.gia has one graph with a get/set/listen of every attributable kind
// (custom_variable, graph_variable, timer, global_timer, signal) reached indirectly (proxy nodes/composites,
// as in test_resolution.gia); test_All_Composite.gia is the *same* graph after using the editor's
// "wrap in composite" on every single node individually – including the four event nodes themselves. Regardless
// of that wrapping, the reported references must come out identical (bar the graph's own name and composite
// bookkeeping): this is what "as if the composite was expanded" means, applied node-by-node rather than as one
// wrap around a whole chain.
const db = new NodeDb();
function refsAndOverview(fileName) {
  const bundle = parseBundle(fs.readFileSync(path.join(here, 'cases', fileName === 'test_All_Static.gia' ? 'resolution' : 'composites', fileName)), { file: fileName });
  const { refs, findings } = buildRefs([bundle], db);
  return { refs, findings, overview: overviewLines(refs) };
}
// Overview line, normalised: graph names differ between the two fixtures ('All_Static' vs 'All_Composite') and are
// replaced by a placeholder. `composite`/`node_type` lines aren't part of what should match – wrapping in a
// composite is *expected* to change which node types exist and how many composites are declared/called; only the
// attributed kinds (custom_variable, graph_variable, timer, global_timer, signal) are asserted identical here.
// A name fixed *inside* a wrapping composite belongs to that composite (custom variables, timers, global timers), so those
// references name the composite where the unwrapped graph names itself: both read as <G> here.
const normalize = (lines, graphName) => lines.filter((l) => !l.startsWith('composite ') && !l.startsWith('node_type ')).map((l) => l.split(graphName).join('<G>').replace(/<composite>Create Composite Node(\(\d+\))?/g, '<G>'));

test('wrapping every node in its own composite does not change the resolved references', () => {
  const staticOut = refsAndOverview('test_All_Static.gia');
  const compositeOut = refsAndOverview('test_All_Composite.gia');
  assert.deepEqual(normalize(staticOut.overview, 'All_Static'), normalize(compositeOut.overview, 'All_Composite'));
});

test('wrapping every node in its own composite raises no findings (no false listener-no-handlers/dynamic-reference)', () => {
  const { findings } = refsAndOverview('test_All_Composite.gia');
  assert.deepEqual(findings, []);
});

test('every listener is resolved as a strict handler, not a catch-all, once wrapped', () => {
  const { refs } = refsAndOverview('test_All_Composite.gia');
  const listens = refs.filter((r) => r.role === 'listen' && r.graphKindNum !== 21002);
  assert.ok(listens.length >= 4, 'expected at least one listen ref per attributable kind');
  assert.ok(!listens.some((r) => r.key === ANY_NAME_KEY), 'no listener should show up as a catch-all');
  assert.ok(!listens.some((r) => r.mode === 'dynamic'), 'no listener should be unresolved');
});

test('signal send/listen nodes wrapped in their own composite are attributed to the real graph, not the composite', () => {
  const { refs } = refsAndOverview('test_All_Composite.gia');
  const real = refs.filter((r) => r.kind === 'signal' && r.role !== undefined && (r.role === 'send' || r.role === 'listen') && r.graphKindNum !== 21002);
  assert.ok(real.length >= 2);
  for (const r of real) assert.equal(r.graph, 'All_Composite');
});

test('a get/set/start/stop pin fed by a wire with no local pin entry (fully delegated to a composite port) still resolves', () => {
  // A named pin that has NO entry at all in the physical node's own `pins` array (because it is exposed purely as a
  // composite input port) must still be looked up by the rule's pin index, not treated as absent.
  const { refs } = refsAndOverview('test_All_Composite.gia');
  // graphKindNum !== 21002 (COMPOSITE_BODY_KIND): the `raw` physical/introspection copy inside the composite body
  // is *expected* to stay dynamic (its input port really does depend on the caller) – only the real-graph-attributed
  // copy, which resolves it using the caller's actual wiring, needs to be checked here.
  const unresolved = refs.filter((r) => ['custom_variable', 'graph_variable', 'timer', 'global_timer'].includes(r.kind) && (r.mode === 'unset' || r.mode === 'dynamic') && r.role !== 'listen' && r.graphKindNum !== 21002);
  assert.deepEqual(unresolved, []);
});

test('Trigger Event of a Set exposed as a composite input port is read from each call site', () => {
  const bundle = parseBundle(fs.readFileSync(path.join(here, 'cases', 'composites', 'test_All_Composite.gia')), { file: 'test_All_Composite.gia' });
  // The Set Custom Variable (shell 22) inside a composite body, with Trigger Event (in-param 4) as a literal.
  const body = bundle.resources.find((r) => r.graph && r.graph.kind === 21002 && r.graph.nodes.some((n) => n.shell.id === 22 && n.pins.some((p) => p.kind === 3 && p.index === 4)));
  const setNode = body.graph.nodes.find((n) => n.shell.id === 22 && n.pins.some((p) => p.kind === 3 && p.index === 4));
  // Expose that pin as a new input port (external index 9) of the composite, and drop the local literal.
  setNode.pins = setNode.pins.filter((p) => !(p.kind === 3 && p.index === 4));
  body.graph.portMappings.push({ ext: { kind: 3, index: 9 }, node: setNode.index, int: { kind: 3, index: 4 } });
  // Find the call node(s) of that composite in the real graph and supply the port.
  const decl = bundle.resources.find((r) => r.kind === 'interface' && r.iface.id?.graph?.id === body.guid);
  const calls = bundle.resources.filter((r) => r.graph && r.graph.kind !== 21002).flatMap((r) => r.graph.nodes.filter((n) => n.shell.id === decl.guid));
  assert.ok(calls.length >= 1, 'composite is called');
  const triggerOf = (value) => {
    for (const c of calls) {
      c.pins = c.pins.filter((p) => !(p.kind === 3 && p.index === 9));
      if (value) c.pins.push({ kind: 3, index: 9, conns: [], value });
    }
    const { refs } = buildRefs([bundle], db);
    return refs.filter((r) => r.kind === 'custom_variable' && r.role === 'set' && r.graphKindNum !== 21002 && r.viaComposite?.some((l) => l.endsWith(decl.name))).map((r) => r.trigger);
  };
  assert.deepEqual([...new Set(triggerOf(null))], ['true'], 'no pin at the call site: the default (true)');
  assert.deepEqual([...new Set(triggerOf({ k: 'enum', v: 0 }))], ['false']);
  assert.deepEqual([...new Set(triggerOf({ k: 'enum', v: 1 }))], ['true']);
});
