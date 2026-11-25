// The order of the wires that leave one output pin is the order the file stores them in (the order the game runs the targets in), not the order of the
// ids of the nodes they lead to. It decides which branch of a node is written first in the pseudocode.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { casesDir } from './helpers.mjs';
import { run } from './expected.mjs';

const ORDER = 'test/cases/composites/composite_order.gia';
const OUT_FLOW = 2, OUT_PARAM = 4;

test('composite_order.gia: C4 runs C5 before C6, as the file lists the wires, though C6 has the smaller node id', () => {
  const code = run(['code', ORDER, '--format', 'text']).split('\n');
  const wires = code.filter((l) => l.startsWith("'Flows'/[14] C4 ") && l.includes('out.flow#0 ->'));
  assert.deepEqual(wires.map((l) => /-> \[(\d+)\]/.exec(l)[1]), ['26', '25']);
  const text = run(['code', ORDER, '--pseudocode', '--format', 'text']);
  const c4 = text.slice(text.indexOf("case 'node_0014':{"), text.indexOf("case 'node_0025':{"));
  assert.match(c4, /await GoTo\("node_0026"\); \/\/ C5\n\s+\$\.input = "input: 0";\n\s+return GoTo\("node_0025"\); \/\/ C6/);
  // C1 -> C2, C3 and C4 -> C5, C6 are the two fan-outs of the graph; the cases follow the flow depth first, so C5 comes right after C4
  const ids = [...text.matchAll(/^    case '(node_\d+)':\{/gm)].map((m) => m[1]);
  assert.ok(ids.indexOf('node_0026') < ids.indexOf('node_0025'), 'C5 is written before C6');
  const g = JSON.parse(run(['code', ORDER, '--format', 'json'])).code[0].items.find((x) => x.type === 'graph' && x.pseudocode.cases.length);
  const c = g.pseudocode.cases.find((x) => x.id === 'node_0014');
  assert.deepEqual(c.next[0].targets.map((t) => t.id), ['node_0026', 'node_0025']);
});

test('every fixture: the edges of one output pin are in the order its own connection list stores them in', () => {
  let checked = 0, fanOut = 0;
  for (const cat of fs.readdirSync(casesDir)) for (const f of fs.readdirSync(path.join(casesDir, cat)).filter((n) => /\.(gia|gil)$/.test(n))) {
    const b = parseBundle(fs.readFileSync(path.join(casesDir, cat, f)), { file: f });
    for (const r of b.resources) if (r.graph) for (const n of r.graph.nodes) for (const p of n.pins) {
      if (p.kind !== OUT_FLOW && p.kind !== OUT_PARAM) continue;
      const stored = p.conns.map((c) => `${c.node}:${c.kind}:${c.index}`);
      const edges = r.graph.edges.filter((e) => e.from.node === n.index && e.from.kind === p.kind && e.from.index === p.index).map((e) => `${e.to.node}:${e.to.kind}:${e.to.index}`);
      assert.deepEqual(edges.filter((e) => stored.includes(e)), [...new Set(stored)], `${f} node ${n.index} pin ${p.kind}#${p.index}`);
      checked++; if (stored.length > 1) fanOut++;
    }
  }
  assert.ok(checked > 0 && fanOut > 0, 'there are fan-outs to check');
});

test('a native node with several wires on one flow output, and a node with several flow outputs, keep the file order', () => {
  // "Calling Twice" (codetest_2.gia) is wired from a Double Branch's "No" output to node 22 and then to node 1: not the order of the ids
  const two = run(['code', 'test/cases/codegen/codetest_2.gia', '--pseudocode', '--format', 'text']);
  assert.match(two, /yield\* GoTo\("node_0022"\); \/\/ Double_Branch\n\s+return yield\* GoTo\("node_0001"\); \/\/ Double_Branch/);
  // the outputs of a node are written in the order of their pins whatever the wires say: the branches of Double Branch stay Yes, No
  assert.match(two, /if\(next=="Yes"\)\{/);
});
