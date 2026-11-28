// Execution types (src/flow.mjs and what the pseudocode makes of them), the written forms of a choice, and --search / --match over pseudocode.
import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFlow } from '../src/flow.mjs';
import { renderReport } from '../src/present/index.mjs';
import { run } from './expected.mjs';

const TWO = 'test/cases/codegen/codetest_2.gia';
const SINGLE = (pin) => ({ type: 'single', pins: [pin], terminal: false });
const NATIVE = { type: 'single', pins: [0], terminal: false };
const BRANCH = { type: 'choice', pins: [0, 1], terminal: false };
const LOOP = { type: 'generic', pins: [0, 1], terminal: false, sequence: true, start: 0 };
/** A body from `{ node: [behavior, { pin: [targets] }] }`; a target is `n` (a node) or `'e0'` (the composite's output 0). */
function body(nodes, entries, extra = {}) {
  const t = (x) => (typeof x === 'string' ? { exit: +x.slice(1) } : typeof x === 'number' ? { node: x, input: 0 } : x);
  return analyzeFlow({
    nodes: Object.keys(nodes).map(Number),
    behavior: (n) => nodes[n][0],
    targets: (n, pin) => (nodes[n][1][pin] ?? []).map(t),
    entries: entries.map((l) => l.map(t)),
    events: false,
    ...extra,
  });
}
const flow = (r) => `${r.type}:${r.pins.join(',')}${r.terminal ? ':terminal' : ''}`;

// ---- the analysis ---------------------------------------------------------------------------------------------------------------------------------------
test('a chain of nodes that ends in one output is single, whatever the nodes before it do', () => {
  assert.equal(flow(body({ 1: [NATIVE, { 0: [2] }], 2: [NATIVE, { 0: ['e0'] }] }, [[1]])), 'single:0');
  // an output the body never reaches does not count
  assert.equal(flow(body({ 1: [NATIVE, { 0: ['e1'] }] }, [[1]])), 'single:1');
});
test('a branch is a choice, and a path that ends inside is the dropped flow', () => {
  assert.equal(flow(body({ 1: [BRANCH, { 0: ['e0'], 1: ['e1'] }] }, [[1]])), 'choice:0,1');
  assert.equal(flow(body({ 1: [BRANCH, { 0: ['e0'], 1: [] }] }, [[1]])), 'choice:0:terminal');
  assert.equal(flow(body({ 1: [BRANCH, { 0: [], 1: [] }] }, [[1]])), 'single::terminal');
});
test('the flow given back twice, or followed by something, makes the body generic', () => {
  // the same output wired to the composite and to a node
  assert.equal(body({ 1: [NATIVE, { 0: ['e0', 2] }], 2: [NATIVE, { 0: [] }] }, [[1]]).type, 'generic');
  assert.equal(body({ 1: [NATIVE, { 0: [2, 'e0'] }], 2: [NATIVE, { 0: [] }] }, [[1]]).type, 'generic');
  // two outputs of the composite on one output
  assert.equal(body({ 1: [NATIVE, { 0: ['e0', 'e1'] }] }, [[1]]).type, 'generic');
  // a node that leaves, then a second one that runs after it
  assert.equal(body({ 1: [NATIVE, { 0: [2, 3] }], 2: [BRANCH, { 0: ['e0'], 1: [] }], 3: [NATIVE, { 0: ['e0'] }] }, [[1]]).type, 'generic');
  // what runs before the flow is given back is fine: the branch ends inside, the second node leaves
  assert.equal(flow(body({ 1: [NATIVE, { 0: [2, 3] }], 2: [BRANCH, { 0: [], 1: [] }], 3: [NATIVE, { 0: ['e0'] }] }, [[1]])), 'single:0');
});
test('the two ways of a branch that meet again, and a flow that goes round, leave once', () => {
  const meet = { 1: [BRANCH, { 0: [2], 1: [3] }], 2: [NATIVE, { 0: [4] }], 3: [NATIVE, { 0: [4] }], 4: [NATIVE, { 0: ['e0'] }] };
  assert.equal(flow(body(meet, [[1]])), 'single:0');
  // while (condition) {} then leave: the branch leads back to itself
  assert.equal(flow(body({ 1: [BRANCH, { 0: ['e0'], 1: [1] }] }, [[1]])), 'single:0');
});
test('a loop that only runs its body inside leaves once through its completion; one that leaves from its body is generic', () => {
  assert.equal(flow(body({ 1: [LOOP, { 0: [2], 1: ['e0'] }], 2: [NATIVE, { 0: [] }] }, [[1]])), 'single:0');
  assert.equal(body({ 1: [LOOP, { 0: ['e0'], 1: [] }] }, [[1]]).type, 'generic');
  // a flow into the second input of a loop (Break Loop) ends that path
  assert.equal(flow(body({ 1: [LOOP, { 0: [2], 1: ['e0'] }], 2: [NATIVE, { 0: [{ node: 1, input: 1 }] }] }, [[1]])), 'single:0');
});
test('a composite inside is as good as its type: generic ones make the body generic, single and choice ones are followed', () => {
  assert.equal(flow(body({ 1: [SINGLE(3), { 3: ['e0'] }] }, [[1]])), 'single:0');
  assert.equal(flow(body({ 1: [{ type: 'choice', pins: [0, 1], terminal: true }, { 0: ['e0'], 1: ['e1'] }] }, [[1]])), 'choice:0,1:terminal');
  assert.equal(body({ 1: [{ type: 'generic', pins: [0], terminal: false, sequence: false }, { 0: ['e0'] }] }, [[1]]).type, 'generic');
  // the outputs of a generic one may run any number of times, so nothing that gives the flow back can follow them
  assert.equal(body({ 1: [{ type: 'generic', pins: [0], terminal: false, sequence: false }, { 0: [2] }], 2: [NATIVE, { 0: ['e0'] }] }, [[1]]).type, 'generic');
  assert.equal(flow(body({ 1: [{ type: 'generic', pins: [0], terminal: false, sequence: false }, { 0: [2] }], 2: [NATIVE, { 0: [] }], 3: [NATIVE, { 0: ['e0'] }] }, [[1]])), 'single::terminal');
});
test('several flow inputs have the union of what they lead to; events, or no entry at all, are generic', () => {
  assert.equal(flow(body({ 1: [NATIVE, { 0: ['e0'] }], 2: [NATIVE, { 0: ['e0'] }] }, [[1], [2]])), 'single:0');
  assert.equal(flow(body({ 1: [NATIVE, { 0: ['e0'] }], 2: [NATIVE, { 0: ['e1'] }] }, [[1], [2]])), 'choice:0,1');
  assert.equal(body({ 1: [NATIVE, { 0: ['e0'] }] }, [[1]], { events: true }).type, 'generic');
  assert.equal(body({ 1: [NATIVE, { 0: ['e0'] }] }, []).type, 'generic');
});

// ---- the fixtures ---------------------------------------------------------------------------------------------------------------------------------------
const report = JSON.parse(run(['code', TWO, '--format', 'json']));
const graphs = report.code[0].items.filter((x) => x.type === 'graph');
const bodyFlow = (name) => graphs.find((g) => g.name.name === name).pseudocode.flow;

test('the composites of the fixture have the type their wires give', () => {
  assert.deepEqual(bodyFlow('Linear Flow'), { type: 'single', pins: ['0'], terminal: false });
  assert.deepEqual(bodyFlow('Two In One Out'), { type: 'single', pins: ['0'], terminal: false });
  assert.deepEqual(bodyFlow('Two Exclusive Outs'), { type: 'choice', pins: ['Yes', 'No'], terminal: false });
  assert.deepEqual(bodyFlow('Terminal'), { type: 'single', pins: [], terminal: true });
  assert.equal(bodyFlow('Calling Twice').type, 'generic', 'one of its outputs is reached by two ways');
  assert.equal(bodyFlow('With Event').type, 'generic', 'an event inside');
  assert.equal(graphs.find((g) => !g.composite_body).pseudocode.flow, null);
  const status = graphs.find((g) => !g.composite_body).pseudocode.cases;
  assert.deepEqual(status.find((c) => c.id === 'node_0012').flow, { type: 'single', form: 'call', terminal: false, default: null });
  assert.equal(status.find((c) => c.id === 'node_0029').flow.form, 'loop');
  assert.equal(status.find((c) => c.id === 'node_0025').flow.form, 'if');
});

// ---- the written forms ---------------------------------------------------------------------------------------------------------------------------------
/** The pseudocode of the fixture's report after `change` has edited the case `node_0025` (a call of the choice composite Two Exclusive Outs). */
function written(change, opts = {}) {
  const r = JSON.parse(JSON.stringify(report));
  const c = r.code[0].items.find((x) => x.type === 'graph' && !x.composite_body).pseudocode.cases.find((x) => x.id === 'node_0025');
  change(c);
  return renderReport(r, { format: 'text', pseudocode: true, ...opts }).text;
}
test('a choice of three ways out is a switch whose `default` is last: the dropped flow, or `throw null`', () => {
  const third = { pin: null, label: 'Maybe', targets: [] };
  const three = written((c) => { c.flow = { type: 'choice', form: 'switch', terminal: false, default: 'none' }; c.next.push(third); });
  assert.match(three, /switch\(\$\.next\)\{\n\s+case "Yes":[^]*?case "No":[^]*?case "Maybe":\n\s+return Exit\(\);\n\s+default:\n\s+throw null;\n\s+\}/);
  const dropped = written((c) => { c.flow = { type: 'choice', form: 'switch', terminal: true, default: 'terminal' }; c.next.push(third); });
  assert.match(dropped, /case "Maybe":\n\s+return Exit\(\);\n\s+default: \/\/ terminal\n\s+return;\n\s+\}/);
});
test('one way out and a dropped flow is an if / else', () => {
  const text = written((c) => { c.flow = { type: 'choice', form: 'if', terminal: true, default: null }; c.next.pop(); }, { optimize: true });
  assert.match(text, /if\(\(await Composite\['Two Exclusive Outs'\]\(\$, "Comp_0025", \{\n\s+Condition: Bol\(false\),\n\s+\}, \$\.input\)\)\.Next=="Yes"\)\{\n[^]*?\}else\{ \/\/ terminal\n\s+return;\n\s+\}/);
});
test('Multiple Branches: the first output is the `default`, listed first with its name; Double Branch has no throw', () => {
  const text = run(['code', TWO, '--pseudocode', '--format', 'text']);
  assert.match(text, /switch\(\$\.next\)\{\n\s+default: \/\/ "Default"\n\s+return Exit\(\);\n\s+case "0":/);
  assert.doesNotMatch(text, /throw null|case "Default"/);
  assert.match(run(['code', TWO, '--pseudocode', '--optimize', '--format', 'text']), /switch\(Multiple_Branches\(\{/);
});

// ---- --search / --match over pseudocode ------------------------------------------------------------------------------------------------------------------
const search = (...a) => run(['code', TWO, '--pseudocode', '--format', 'text', ...a]);
const cases = (text) => [...text.matchAll(/case '([^']+)':/g)].map((m) => m[1]);
/** The cases of the status graph, which stands before the composites. */
const statusCases = (text) => cases(text.split('\nComposite[')[0]);
test('a search writes the cases of the nodes the matching lines are about, and only the graphs that have one', () => {
  const text = search('--search', 'Remove Unit Status');
  assert.deepEqual(cases(text), ['node_0002', 'node_0003'], 'the node itself, and the node whose wire line names it');
  assert.doesNotMatch(text, /Composite\[/);
  // the jump to a case that is not written stays
  assert.match(text, /return GoTo\("node_0005"\); \/\/ Set_Node_Graph_Variable/);
  // a graph's name finds every node of it: the whole graph
  assert.deepEqual(cases(search('--search', '<status>Status')), cases(run(['code', TWO, '--pseudocode', '--format', 'text'])).slice(0, cases(search('--search', '<status>Status')).length));
  assert.equal(cases(search('--search', 'no such thing')).length, 0);
});
test('a found data node finds the nodes that read it, up to the execution node', () => {
  // the position of the call node of Simple Data is on no other line, and the node has no flow pins
  const text = search('--search', '1474.7142');
  assert.deepEqual(cases(text), ['node_0005']);
  assert.match(text, /Composite\['Simple Data'\]\(\$, "Comp_0007", \{\}\);/);
});
test('the search is made on the listing, not on the pseudocode', () => {
  // `Exit` and `GoTo` are words of the pseudocode only
  assert.equal(cases(search('--search', 'GoTo')).length, 0);
  assert.equal(cases(search('--search', 'Exit')).length, 0);
  // --match is a regular expression over the same lines, and both words are an AND on one line
  assert.deepEqual(statusCases(search('--match', '"Variable Name".*gvar')), ['node_0005']);
  assert.deepEqual(cases(search('--match', '"Variable Name".*gvar')), ['node_0005', 'input: 0', 'node_0008'], 'the composite Linear Flow sets the same variable');
  assert.deepEqual(statusCases(search('--search', 'gvar', '--match', 'Simple')), [], 'no line has both words');
});
test('a composite body is found by its own nodes, and the data outputs by the nodes they read', () => {
  const text = search('--search', 'Greater Than');
  assert.match(text, /^Composite\['Exposed Computed'\] = function/m);
  assert.match(text, /return \{\n\s+Result: Bol_01, \/\/ Greater_Than\.Result/);
  const other = search('--search', 'Print String');
  assert.doesNotMatch(other, /if \(!node\)/, 'no data output of the body was found');
  assert.match(other, /Composite\['Two In One Out'\]/);
});
test('--all with --pseudocode searches the same way and is not filtered a second time', () => {
  const text = run(['all', TWO, '--with-code', '--pseudocode', '--search', '1474.7142', '--format', 'text']);
  assert.deepEqual(cases(text), ['node_0005']);
  assert.match(text, /# CODE\nServerGraphs\['Status'\]/);
});
test('a search with --expand finds the nodes of an expanded body', () => {
  const text = search('--expand', '--search', 'Print String');
  assert.match(text, /Print_String\(\{\n\s+String: "First",/);
  assert.doesNotMatch(text, /Linear_Flow|Set_Node_Graph_Variable\(/);
});
