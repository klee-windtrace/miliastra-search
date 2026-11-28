// How the flow leaves a node, and how it leaves a composite: the execution type every node of a graph belongs to.
//   single   the flow always goes on through its one and only flow output (almost every native node),
//   choice   the flow goes on through exactly one of several flow outputs, once (Double Branch, Multiple Branches), or through none: the composite
//            drops the flow (`terminal`),
//   generic  anything else: outputs that run in turn or repeatedly (the loops), or a composite that does something after it gave the flow back.
// A native node says which it is (`data/codegen-rules.json` and its number of flow outputs); the type of a composite is found here, by following every
// path of its body, and is what its callers are written after.
//   analyzeFlow(model) -> { type, pins, terminal }
// The model is plain data, so the analysis does not know a graph from a test:
//   nodes               the indexes of the nodes of the body that have flow pins,
//   behavior(node)      { type, pins, terminal, sequence, start }: the node's own type; `pins` are its flow outputs it may leave through; `sequence`: a
//                       generic node runs its outputs in the order of their indexes and the last one once (a loop runs its body many times, then its
//                       completion); `start`: the only flow input that starts the node, a flow into any other (a loop's "Break Loop") ends the path,
//   targets(node, pin)  what a flow output is wired to, in order: `{ node, input }` or `{ exit }` (an output of the composite itself),
//   entries             one list of `{ node, input }` per flow input of the composite: where the flow starts,
//   events              the body has events of its own: they start a flow at any time, whatever the flow inputs say.
//
// A flow ends in one of these outcomes. `E`: nothing ran (an output nothing is wired to). `T`: something ran and the flow ended inside the body without
// leaving it. A number: the body gave the flow back through that output of the composite and did nothing after it. `X`: anything else (the flow left
// twice, or the body went on after it left), which makes the body generic. The outcomes of a node are the fixed point of the outcomes of the nodes it
// reaches, so a flow that goes round in a cycle is an outcome of whatever leaves the cycle.
export const E = 'E', T = 'T', X = 'X';

const GENERIC = { type: 'generic', pins: [], terminal: false };

/** What happens when `a` ran and `b` runs after it: whatever ran after the flow was given back makes the outcome `X`. */
function seq(a, b) {
  const out = new Set();
  for (const x of a) {
    if (x === E) for (const y of b) out.add(y);
    else if (x === T) for (const y of b) out.add(y === E ? T : y);
    else if (x === X) out.add(X);
    else for (const y of b) out.add(y === E ? x : X); // the flow was given back, and something ran afterwards
  }
  return out;
}
/** A part that may run any number of times: it can only be repeated when it never gives the flow back. */
const repeated = (a) => ([...a].every((x) => x === E || x === T) ? new Set(a) : new Set([X])); // (nothing yet, while the fixed point is not there: nothing)
/** The node itself ran, even when nothing it leads to did. */
const ran = (a) => new Set([...a].map((x) => (x === E ? T : x)));
const union = (sets) => new Set(sets.flatMap((s) => [...s]));

/**
 * The execution type of a composite body: how the flow leaves it. `pins` are the flow outputs of the composite it may leave through (sorted),
 * `terminal` whether it may end without leaving through any. `generic` when the body has events of its own or no flow input.
 */
export function analyzeFlow(model) {
  if (model.events || !model.entries.length) return { ...GENERIC };
  const out = new Map(model.nodes.map((n) => [n, new Set()]));
  const itemOut = (t) => {
    if (t.exit != null) return new Set([t.exit]);
    const b = model.behavior(t.node);
    if (b?.start != null && t.input !== b.start) return new Set([T]); // a flow into "Break Loop" ends the path
    return out.get(t.node) ?? new Set([T]);
  };
  const pinOut = (node, pin) => {
    const items = model.targets(node, pin);
    if (!items.length) return new Set([E]);
    if (items.length > 1 && items.some((t) => t.exit != null)) return new Set([X]); // the flow is given back and something else is run from the same output
    return items.reduce((acc, t) => seq(acc, itemOut(t)), new Set([E]));
  };
  function nodeOut(node) {
    const b = model.behavior(node);
    if (!b || !b.pins.length && b.type !== 'choice') return new Set([T]);
    const pins = [...b.pins].sort((p, q) => p - q);
    if (b.type === 'single') return ran(pinOut(node, pins[0]));
    if (b.type === 'choice') return union([...pins.map((p) => ran(pinOut(node, p))), ...(b.terminal ? [new Set([T])] : [])]);
    const parts = pins.map((p, i) => (b.sequence && i === pins.length - 1 ? pinOut(node, p) : repeated(pinOut(node, p))));
    return ran(parts.reduce((acc, p) => seq(acc, p), new Set([E])));
  }
  for (let changed = true; changed;) {
    changed = false;
    for (const n of model.nodes) {
      const cur = out.get(n), next = nodeOut(n);
      for (const x of next) if (!cur.has(x)) { cur.add(x); changed = true; }
    }
  }
  const total = union(model.entries.map((list) => list.reduce((acc, t) => seq(acc, itemOut(t)), new Set([E]))));
  if (!total.size || total.has(X)) return { ...GENERIC };
  const pins = [...total].filter((x) => typeof x === 'number').sort((p, q) => p - q);
  const terminal = total.has(T) || total.has(E);
  return { type: pins.length + (terminal ? 1 : 0) === 1 ? 'single' : 'choice', pins, terminal };
}
