import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs } from '../src/refs.mjs';
import { casesDir, renderText } from './helpers.mjs';

// "Multiple Branches" (shell node 3): its branches are named "1", "2", ... by the game while the values they compare
// with sit in the static input list "valid_pin_list" (in#1). Every printer shows the values instead, and the list pin
// itself is hidden. Duplicate values in that list break the node at runtime (it always takes Default) -> warning.
const db = new NodeDb();
const load = (cat, f) => parseBundle(fs.readFileSync(path.join(casesDir, cat, f)), { file: f });
const dump = (b, opts = {}) => renderText(b, db, opts).lines;
const multiBranchNodes = (b) => b.resources.flatMap((r) => (r.graph ? r.graph.nodes.filter((n) => n.shell?.id === 3).map((n) => ({ r, g: r.graph, n })) : []));
const listOf = (n) => { const v = n.pins.find((p) => p.kind === 3 && p.index === 1).value; return (v.k === 'poly' ? v.inner : v); };

test('branches are named after valid_pin_list values, and the list pin is not printed', () => {
  const b = load('resolution', 'test_All_Static.gia');
  const lines = dump(b);
  const nodes = multiBranchNodes(b);
  assert.ok(nodes.length >= 4);
  for (const { g, n } of nodes) {
    const values = listOf(n).items.map((i) => i.v);
    const mine = lines.filter((l) => l.includes(`/[${n.index}] Multiple Branches`) && /'[^']*'\/\[\d+\]/.test(l));
    for (const [i, v] of values.entries()) assert.ok(mine.some((l) => l.includes(`out.flow#${i + 1} "${v}"`)), `node ${n.index}: branch ${i + 1} should be named ${v}`);
    assert.ok(!mine.some((l) => /out\.flow#\d+ "\d+"/.test(l)), 'no index-named branch is left');
    assert.ok(!mine.some((l) => l.includes('valid_pin_list')), 'the list pin is hidden');
  }
});

test('all-pins mode hides the list too; other nodes keep their own pins', () => {
  const b = load('resolution', 'test_All_Static.gia');
  const lines = dump(b, { allPins: true, defaults: true });
  assert.ok(!lines.some((l) => l.includes('valid_pin_list')));
  assert.ok(lines.some((l) => /Control Expression/.test(l)), 'the control expression pin is still shown');
});

test('composite: the port map names the inner branch by its value too', () => {
  const b = load('composites', 'test_All_Composite.gia');
  const pm = dump(b).filter((l) => l.includes('PORTMAP') && l.includes('Multiple Branches'));
  assert.ok(pm.length);
  assert.ok(pm.some((l) => /out\.flow#1 "(Static_\w+)"$/.test(l)), pm.join('\n'));
  assert.ok(!pm.some((l) => /out\.flow#\d+ "\d+"$/.test(l)), 'the internal side must not fall back to index names');
});

test('a wired (dynamic) list has no static values: nothing is renamed and the pin stays visible', () => {
  const b = load('resolution', 'test_All_Static.gia');
  const { g, n } = multiBranchNodes(b)[0];
  n.pins.find((p) => p.kind === 3 && p.index === 1).conns.push({ node: 1, kind: 4, index: 0 });
  const lines = dump(b).filter((l) => l.includes(`/[${n.index}] Multiple Branches`));
  assert.ok(lines.some((l) => l.includes('valid_pin_list')));
  assert.ok(lines.some((l) => /out\.flow#1 "1"/.test(l)));
});

test('integer lists are supported; empty text is shown as (empty); a branch beyond the list keeps its index name', () => {
  const b = load('resolution', 'test_All_Static.gia');
  const { n } = multiBranchNodes(b)[0];
  const list = listOf(n), first = list.items[0];
  const shown = () => dump(b).filter((l) => l.includes(`/[${n.index}] Multiple Branches`)).join('\n');
  list.items = [{ ...first, k: 'int', v: 42 }];
  assert.match(shown(), /out\.flow#1 "42"/);
  list.items = [{ ...first, v: '' }];
  assert.match(shown(), /out\.flow#1 "\(empty\)"/);
  list.items = [];
  assert.match(shown(), /out\.flow#1 "1"/);
});

// ---- the duplicate warning ----
const dupFindings = (b) => buildRefs([b], db).findings.filter((f) => f.type === 'duplicate-branch-value');

test('no duplicates in any shipped fixture -> no warning', () => {
  for (const [cat, f] of [['resolution', 'test_All_Static.gia'], ['resolution', 'test_resolution.gia'], ['composites', 'test_All_Composite.gia'], ['gia', 'sample_2.gia']]) assert.deepEqual(dupFindings(load(cat, f)), [], f);
});

test('duplicate value in a plain graph: WARN on that graph, naming the value', () => {
  const b = load('resolution', 'test_All_Static.gia');
  const { g, n } = multiBranchNodes(b).find((x) => x.g.kind !== 21002);
  const list = listOf(n); list.items.push(structuredClone(list.items[0]));
  const f = dupFindings(b);
  assert.equal(f.length, 1);
  assert.equal(f[0].level, 'warn');
  assert.equal(f[0].graph, g.name);
  assert.ok(f[0].message.includes(`[${n.index}] Multiple Branches`) && f[0].message.includes(`'${list.items[0].v}'`) && /Default/.test(f[0].message));
});

test('duplicate inside a composite: reported once, at the composite level (not once per calling graph)', () => {
  const b = load('composites', 'test_All_Composite.gia');
  const { r, n } = multiBranchNodes(b).find((x) => x.g.kind === 21002);
  const list = listOf(n); list.items.push(structuredClone(list.items[0]));
  const f = dupFindings(b);
  assert.equal(f.length, 1);
  assert.match(f[0].graph, /^<composite>/);
  assert.equal(f[0].graph, buildRefs([b], db).refs.find((x) => x.graphGuid === r.guid).graph);
});

test('the warning can be silenced with a comment, and a stale comment is itself flagged', () => {
  const b = load('resolution', 'test_All_Static.gia');
  const { n } = multiBranchNodes(b).find((x) => x.g.kind !== 21002);
  const list = listOf(n); list.items.push(structuredClone(list.items[0]));
  n.comment = 'known, duplicate-branch-value';
  assert.deepEqual(dupFindings(b), []);
  list.items.pop();
  const f = buildRefs([b], db).findings.filter((x) => x.type === 'stale-suppression-comment');
  assert.equal(f.length, 1); assert.match(f[0].message, /duplicate-branch-value/);
});
