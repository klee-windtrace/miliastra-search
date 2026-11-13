import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { fileCode } from '../src/code.mjs';
import { casesDir } from './helpers.mjs';

// Assembly List / Dictionary: the editor stores 100 input slots (in#1..in#100) whatever the node holds; in#0 "Count" says how many the person added, and
// is only stored once it was changed: without it the database's default (1 slot for a list, 2 for a dictionary) holds. The slots beyond the count are
// placeholders and are not in the code report.
const db = new NodeDb();
const bundle = parseBundle(fs.readFileSync(path.join(casesDir, 'pins', 'assembly_pins.gil')), { file: 'assembly_pins.gil' });
const nodes = fileCode(bundle, db).items.filter((i) => i.type === 'graph').flatMap((g) => g.nodes).filter((n) => /^Assembly (List|Dictionary)$/.test(n.name));
const stored = (n) => n.pins.find((p) => p.kind === 'in_param' && p.index === 0)?.value?.value;
const count = (n) => stored(n) ?? (n.name === 'Assembly List' ? 1 : 2);
const slots = (n) => n.pins.filter((p) => p.kind === 'in_param' && p.index > 0);

test('Assembly nodes keep the slots up to the count only', () => {
  assert.equal(nodes.length, 10);
  for (const n of nodes) {
    assert.ok(slots(n).every((p) => p.index <= count(n)), `${n.name} [${n.index}]`);
    if (slots(n).length) assert.equal(slots(n).length, count(n), `${n.name} [${n.index}]`);
    assert.equal(n.pins.filter((p) => p.kind === 'out_param').length, n.pins.length ? 1 : 0); // the output stays
  }
  assert.ok(nodes.some((n) => stored(n) === undefined && n.pins.length === 0), 'a node that stores no pin has none in the report');
  assert.ok(nodes.some((n) => stored(n) === undefined && slots(n).length === 1 && n.name === 'Assembly List'), 'no Count: the default of one slot');
  assert.ok(nodes.some((n) => stored(n) === undefined && slots(n).length === 2 && n.name === 'Assembly Dictionary'), 'no Count: the default of two slots');
  assert.ok(nodes.some((n) => count(n) === 12 && n.name === 'Assembly Dictionary'));
});

test('wired slots are kept', () => {
  const wired = nodes.filter((n) => n.pins.some((p) => p.wires.length));
  assert.ok(wired.length >= 2);
  for (const n of wired) assert.equal(n.pins.filter((p) => p.wires.length).length, count(n) === 12 ? 12 : 6);
});

test('a wired slot is kept whatever the count says, and is an input of the call in the pseudocode', () => {
  // codetest_1: an Assembly Dictionary that stores no Count, with a key and a value wired
  const g = fileCode(parseBundle(fs.readFileSync(path.join(casesDir, 'codegen', 'codetest_1.gia')), { file: 'codetest_1.gia' }), db).items.find((i) => i.type === 'graph' && i.name.name === 'New Node Graph');
  const dict = g.nodes.find((n) => n.name === 'Assembly Dictionary');
  assert.equal(stored(dict), undefined);
  assert.deepEqual(slots(dict).map((p) => [p.index, p.wires.length]), [[1, 1], [2, 1]]);
  const call = g.pseudocode.cases.flatMap((c) => c.data).find((d) => d.function === 'Assembly_Dictionary');
  assert.deepEqual(call.args.map((a) => [a.key, a.expr.kind, a.expr.kind === 'literal' ? a.expr.value.set : null]), [['Count', 'literal', false], ['Key_0', 'global', null], ['Value_0', 'var', null]]);
  const list = g.pseudocode.cases.flatMap((c) => c.data).find((d) => d.function === 'Assembly_List');
  assert.deepEqual(list.args.map((a) => [a.key, a.expr.value.value, a.expr.value.set]), [['Count', 1, false], ['_0', 0, false]], 'the default count and the one slot it gives');
});
