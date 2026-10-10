import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs, ANY_NAME_KEY } from '../src/refs.mjs';
import { readSample, sample, here, appendToFirstEntry, varField, overviewLines } from './helpers.mjs';

const db = new NodeDb();
const bundle = (n) => parseBundle(readSample(n), { file: n });
const cli = (...args) => spawnSync(process.execPath, [path.join(here, '..', 'miliastra-search.mjs'), ...args], { encoding: 'utf8' });

test('graph variable: declaration + literal get, no findings', () => {
  const { refs, findings } = buildRefs([bundle('sample_8.gia')], db);
  const gv = refs.filter((r) => r.kind === 'graph_variable' && r.key === 'Graph_Var');
  assert.deepEqual(gv.map((r) => `${r.mode}:${r.role}`).sort(), ['declaration:declaration', 'literal:get']);
  assert.equal(gv.find((r) => r.role === 'get').node, 8);
  assert.equal(findings.filter((f) => f.kind === 'graph_variable').length, 0);
});

test('graph variable: declared-but-unused and used-but-undeclared are flagged', () => {
  let b = bundle('sample_8.gia');
  const g = b.resources[0].graph;
  g.nodes = g.nodes.filter((n) => n.index !== 8);
  let f = buildRefs([b], db).findings.filter((x) => x.kind === 'graph_variable');
  assert.equal(f.length, 1); assert.equal(f[0].type, 'declared-but-unused'); assert.equal(f[0].level, 'info');
  b = bundle('sample_8.gia'); b.resources[0].graph.variables = [];
  f = buildRefs([b], db).findings.filter((x) => x.kind === 'graph_variable');
  assert.equal(f.length, 1); assert.equal(f[0].type, 'used-but-undeclared');
});

test('graph variable: wired (dynamic) name is reported as dynamic, not dropped', () => {
  const b = bundle('sample_8.gia');
  const g = b.resources[0].graph;
  const n = g.nodes.find((x) => x.index === 8);
  const pin = n.pins.find((p) => p.kind === 3 && p.index === 0);
  pin.conns.push({ node: 1, kind: 4, index: 0 }); pin.value = null;
  const { refs, findings } = buildRefs([b], db);
  const dyn = refs.find((r) => r.kind === 'graph_variable' && r.mode === 'dynamic');
  assert.ok(dyn); assert.match(dyn.note, /wired from \[1\]/);
  assert.ok(findings.some((f) => f.type === 'dynamic-reference'));
  assert.equal(findings.find((f) => f.type === 'declared-but-unused').level, 'info', 'downgraded because a dynamic access exists');
});

test('custom variable names (Get/Set) are indexed by literal', () => {
  const { refs } = buildRefs([bundle('sample_5.gia')], db);
  const t = refs.filter((r) => r.kind === 'custom_variable' && r.key === 'Test');
  assert.deepEqual(t.map((r) => r.role).sort(), ['get', 'set']);
  assert.ok(refs.some((r) => r.kind === 'graph_variable' && r.key === 'Variable_1' && r.role === 'set'));
});

test('signals: declarations, send and listen call sites', () => {
  const { refs, findings } = buildRefs([bundle('sample_2.gia')], db);
  const s = refs.filter((r) => r.kind === 'signal' && r.key === 'Signal_2');
  assert.equal(s.filter((r) => r.role === 'send').length, 2);
  assert.equal(s.filter((r) => r.role === 'listen').length, 2);
  assert.ok(s.some((r) => r.role.startsWith('decl:send')));
  assert.equal(findings.filter((f) => f.kind === 'signal').length, 0);
});

test('signals: sent-never-listened is reported', () => {
  const b = bundle('sample_2.gia');
  for (const r of b.resources) if (r.kind === 'graph') r.graph.nodes = r.graph.nodes.filter((n) => !(n.shell.id === 1610612740));
  const f = buildRefs([b], db).findings.filter((x) => x.type === 'signal-sent-never-listened');
  assert.ok(f.some((x) => x.key === 'Signal_1'));
});

test('composite calls and definitions; never-called composite is flagged', () => {
  const { refs } = buildRefs([bundle('sample_1.gia')], db);
  const c = refs.filter((r) => r.kind === 'composite' && r.key === 'Create Composite Node');
  assert.equal(c.filter((r) => r.mode === 'definition').length, 1);
  assert.equal(c.filter((r) => r.role === 'call').length, 2);
  const b = bundle('sample_1.gia');
  b.resources[0].graph.nodes = b.resources[0].graph.nodes.filter((n) => n.shell.id !== 1610612737);
  const f = buildRefs([b], db).findings.filter((x) => x.type === 'composite-never-called');
  assert.deepEqual(f.map((x) => x.key), ['Create Composite Node']);
});

test('structs: definition, assemble/split/modify, field-type usage', () => {
  const { refs } = buildRefs([bundle('sample_3.gia')], db);
  const s = refs.filter((r) => r.kind === 'struct' && r.key === 'Structure');
  const roles = new Set(s.map((r) => r.role));
  for (const r of ['definition', 'assemble', 'split', 'modify', 'field-type']) assert.ok(roles.has(r), r);
});

test('literal ids: resolved against graph guids present in the same file', () => {
  const { refs } = buildRefs([bundle('sample_7.gia')], db);
  const r = refs.find((x) => x.kind === 'literal_id' && x.key === 'Cfg:1082130435');
  assert.ok(r); assert.match(r.note, /New Creation Status Node Graph/);
});

test('node_type refs key on numeric id', () => {
  const { refs } = buildRefs([bundle('sample_8.gia')], db);
  assert.ok(refs.some((r) => r.kind === 'node_type' && r.key === 'Print String (1)'));
});

// ---------- refs overview: graph tags, rows, sorting ----------

test('graph names carry a <status>/<skill>/<filter>/<creation> tag per service domain', () => {
  const { refs } = buildRefs([bundle('sample_7.gia')], db);
  const cfg1 = refs.find((r) => r.kind === 'literal_id' && r.key === 'Cfg:1082130435');
  assert.match(cfg1.graph, /^<creation>/);
  const cfg2 = refs.find((r) => r.kind === 'literal_id' && r.key === 'Cfg:2');
  assert.match(cfg2.graph, /^<skill>/);
  const tv = refs.find((r) => r.kind === 'custom_variable' && r.key === 'test' && r.role === 'get');
  assert.match(tv.graph, /^<filter>/);
});

test('composite is grouped by name, not guid: exactly 3 unique calling graphs collapse to a call count with unique graphs', () => {
  const { refs } = buildRefs([bundle('sample_1.gia')], db);
  const lines = overviewLines(refs.filter((r) => r.kind === 'composite'));
  assert.match(lines.find((l) => l.includes('Create Composite Node"')), /composite\s+"Create Composite Node"\s+2 call: \['New Node Graph'\]/);
});

test('composite-definition-count-anomaly: a duplicated declaration name is flagged, and the call listing still shows only the call count', () => {
  const b = bundle('sample_1.gia');
  const decl = b.resources.find((r) => r.kind === 'interface' && r.iface?.category === 1000);
  const dup = { ...decl, guid: decl.guid + 1000, iface: { ...decl.iface } }; // same name, different guid: a structural bug
  b.resources.push(dup);
  const { refs, findings } = buildRefs([b], db);
  const anomaly = findings.find((f) => f.type === 'composite-definition-count-anomaly' && f.key === decl.iface.name);
  assert.ok(anomaly, 'expected a composite-definition-count-anomaly finding');
  assert.match(anomaly.message, /has 2 definition\(s\)/);
  const line = overviewLines(refs.filter((r) => r.kind === 'composite' && r.key === decl.iface.name))[0];
  assert.match(line, /2 call: \['New Node Graph'\]/, 'call count/listing is unaffected by the duplicate definition');
});

test('custom_variable overview: datatype; get/set always shown even at zero; a Set without a stored Trigger Event pin triggers (engine default)', () => {
  const b = bundle('sample_5.gia');
  const { refs } = buildRefs([b], db);
  const rs = refs.filter((r) => r.kind === 'custom_variable' && r.key === 'Test');
  const line = overviewLines(rs)[0];
  assert.match(line, /"Test" \(Int\)/);
  assert.match(line, /1 get: \['Variables'\], 0 set: \[\], 1 trigger: \['Variables'\]/);
});

test('custom_variable overview: a Set with Trigger Event not statically false is counted as trigger, not as set', () => {
  const b = bundle('sample_5.gia');
  const g = b.resources.find((r) => r.kind === 'graph').graph;
  const setNode = g.nodes.find((n) => n.shell.id === 22);
  assert.ok(setNode, 'fixture has a Set Custom Variable node');
  let p = setNode.pins.find((pp) => pp.kind === 3 && pp.index === 4);
  if (!p) { p = { kind: 3, index: 4, conns: [] }; setNode.pins.push(p); }
  const overview = () => overviewLines(buildRefs([b], db).refs.filter((r) => r.kind === 'custom_variable' && r.key === 'Test'))[0];
  p.value = { k: 'enum', v: 0 };
  assert.match(overview(), /1 set: \['Variables'\]/);
  assert.doesNotMatch(overview(), /trigger/);
  setNode.pins = setNode.pins.filter((pp) => pp !== p); // no stored pin: the default (true) applies
  assert.match(overview(), /0 set: \[\], 1 trigger: \['Variables'\]/);
  setNode.pins.push(p);
  p.value = { k: 'enum', v: 0 };
  assert.match(overview(), /1 set: \['Variables'\]/);
  assert.doesNotMatch(overview(), /trigger/);
  p.value = { k: 'enum', v: 1 };
  assert.match(overview(), /0 set: \[\], 1 trigger: \['Variables'\]/);
});

test('timer overview: (onetime) suffix when every Start Timer caller has a static Loop=false, always shows start & stop', () => {
  const { refs } = buildRefs([bundle('sample_2.gia')], db);
  // sample_2 has no plain timer usage; build a synthetic one directly against overviewLines instead.
  const synthetic = [
    { kind: 'timer', key: 'MyTimer', role: 'start', graph: 'Graph A', loop: 'false' },
    { kind: 'timer', key: 'MyTimer', role: 'start', graph: 'Graph B', loop: 'false' },
  ];
  const line = overviewLines(synthetic)[0];
  assert.match(line, /"MyTimer" \(onetime\)/);
  assert.match(line, /2 start: \['Graph A'; 'Graph B'\], 0 stop: \[\]/);
});

test('timer overview: contradicting Loop values across callers omit the (onetime)/(looped) suffix', () => {
  const synthetic = [
    { kind: 'timer', key: 'MyTimer', role: 'start', graph: 'Graph A', loop: 'false' },
    { kind: 'timer', key: 'MyTimer', role: 'start', graph: 'Graph B', loop: 'true' },
  ];
  const line = overviewLines(synthetic)[0];
  assert.doesNotMatch(line, /\(onetime\)|\(looped\)/);
});

test('signal overview: listen/send always shown (even 0), decl: roles excluded', () => {
  const { refs } = buildRefs([bundle('sample_2.gia')], db);
  const line = overviewLines(refs.filter((r) => r.kind === 'signal' && r.key === 'Signal_1'))[0];
  assert.doesNotMatch(line, /decl:/);
  assert.match(line, /2 listen: \[.*\], 2 send: \[.*\]/);
});

test('a "When ... Changes/Triggered" any-name listener stays visible as its own line instead of falling into the kind-specific zero-filled format', () => {
  const { refs } = buildRefs([bundle('sample_5.gia')], db);
  const line = overviewLines(refs.filter((r) => r.kind === 'custom_variable' && r.key === ANY_NAME_KEY))[0];
  assert.match(line, /custom_variable\s+"\* \(listener for any name\)"\s+1 listen: \['Variables'\]/);
});

test('graph_variable overview: single-graph bracket-then-counts format, tagged with the owning graph\'s kind', () => {
  const { refs } = buildRefs([bundle('sample_5.gia')], db);
  const line = overviewLines(refs.filter((r) => r.kind === 'graph_variable' && r.key === 'Variable_1'))[0];
  assert.match(line, /graph_variable\s+"Variable_1" \(Bol\)\s+\['Variables'\]: 1 get, 1 set/);
});

test('struct overview: multi-line block with graph context per usage role', () => {
  const { refs } = buildRefs([bundle('sample_3.gia')], db);
  const lines = overviewLines(refs.filter((r) => r.kind === 'struct' && r.key === 'Structure'));
  const block = lines[0];
  assert.match(block, /defined guid=1077936129/);
  assert.match(block, /1 assemble: \['Structs'\]/);
  assert.match(block, /1 split: \['Structs'\]/);
  assert.match(block, /1 modify: \['Structs'\]/);
  assert.match(block, /field-type: /);
});

test('literal_id overview: role label + unique tagged graph list, count includes repeats', () => {
  const { refs } = buildRefs([bundle('sample_7.gia')], db);
  const line = overviewLines(refs.filter((r) => r.kind === 'literal_id' && r.key === 'Cfg:2'))[0];
  assert.match(line, /1 Ref: \['<skill>New Character Skill Node Graph'\]/);
});

test('limits: composite slot count and signal name count vs Miliastra maximums; graph sizes sorted descending', () => {
  const b1 = bundle('sample_1.gia');
  const { limits: l1 } = buildRefs([b1], db);
  assert.equal(l1.composites.used, 2); assert.equal(l1.composites.max, 1000);
  const b2 = bundle('sample_2.gia');
  const { limits: l2 } = buildRefs([b2], db);
  assert.equal(l2.signals.used, 2); assert.equal(l2.signals.max, 100);
  assert.ok(l2.graphSizes.every((g) => g.nodes < 100));
  const b3 = bundle('sample_8.gia');
  const g3 = b3.resources.find((r) => r.kind === 'graph').graph;
  const template = g3.nodes[0];
  for (let i = g3.nodes.length; i < 2001; i++) g3.nodes.push({ ...template, index: i });
  const { limits: l3 } = buildRefs([b3], db);
  assert.equal(l3.graphSizes[0].nodes, 2001);
  assert.ok(l3.graphSizes[0].nodes >= l3.graphSizes[l3.graphSizes.length - 1].nodes, 'sorted descending');
});

// ---------- CLI ----------
test('cli: code --search finds literal and exits 0; no match exits 1', () => {
  let r = cli('code', '--search', 'Graph_Var', sample('sample_8.gia'));
  assert.equal(r.status, 0); assert.match(r.stdout, /Get Node Graph Variable \(337\).*'Graph_Var'/);
  r = cli('code', '--search', 'nothing-like-this', sample('sample_8.gia'));
  assert.equal(r.status, 1);
});
test('cli: refs --kind --name', () => {
  const r = cli('refs', '--kind', 'graph_variable', '--name', 'Graph_Var', sample('sample_8.gia'));
  assert.equal(r.status, 0); assert.match(r.stdout, /literal get @ 'Graph'\/\[8\]/);
});
test('cli: refs --sort-desc keeps each kind\'s lines contiguous (only the within-kind order changes)', () => {
  const r = cli('refs', '--sort-desc', sample('sample_2.gia'));
  assert.equal(r.status, 0);
  const overview = r.stdout.split('\n\n')[0];
  const kinds = overview.split('\n').filter((l) => /^\w/.test(l)).map((l) => l.match(/^(\w+)/)[1]);
  // collapsing consecutive duplicates must yield each kind exactly once, i.e. no kind reappears after a gap
  const collapsed = kinds.filter((k, i) => k !== kinds[i - 1]);
  assert.deepEqual(collapsed, [...new Set(collapsed)], `same kind appeared in two separate blocks: ${kinds.join(', ')}`);
});
test('overviewLines sortDesc: groups ordered by total ref count, descending, ties broken alphabetically', () => {
  const synthetic = [
    { kind: 'timer', key: 'A', role: 'start', graph: 'G' },
    { kind: 'timer', key: 'B', role: 'start', graph: 'G' }, { kind: 'timer', key: 'B', role: 'stop', graph: 'G' }, { kind: 'timer', key: 'B', role: 'stop', graph: 'H' },
    { kind: 'timer', key: 'C', role: 'start', graph: 'G' }, { kind: 'timer', key: 'C', role: 'stop', graph: 'G' },
  ];
  const lines = overviewLines(synthetic, { sortDesc: true });
  assert.deepEqual(lines.map((l) => l.match(/"(\w)"/)[1]), ['B', 'C', 'A']);
});
test('overviewLines sortDesc never interleaves two kinds: each kind\'s lines stay together, only their internal order changes', () => {
  const synthetic = [
    { kind: 'composite', key: 'Z', role: 'call', graph: 'G' }, // 1 ref
    { kind: 'graph_variable', key: 'A', role: 'get', graph: 'G', scope: 's1' }, // 1 ref
    { kind: 'graph_variable', key: 'B', role: 'get', graph: 'G', scope: 's2' }, { kind: 'graph_variable', key: 'B', role: 'set', graph: 'G', scope: 's2' }, // 2 refs
    { kind: 'composite', key: 'Y', role: 'call', graph: 'G' }, { kind: 'composite', key: 'Y', role: 'call', graph: 'H' }, // 2 refs
  ];
  const lines = overviewLines(synthetic, { sortDesc: true });
  const kinds = lines.map((l) => l.match(/^(\w+)/)[1]);
  assert.deepEqual(kinds, ['composite', 'composite', 'graph_variable', 'graph_variable'], 'composite lines and graph_variable lines must not interleave');
  // within "composite", Y (2 refs) sorts before Z (1 ref); within "graph_variable", B (2 refs) before A (1 ref)
  assert.deepEqual(lines.map((l) => l.match(/"(\w)"/)[1]), ['Y', 'Z', 'B', 'A']);
});
test('cli: warns --top-graphs limits the graph-size ranking and defaults to 20', () => {
  const r1 = cli('warns', '--top-graphs', '1', sample('sample_2.gia'));
  assert.equal((r1.stdout.match(/nodes$/gm) || []).length, 1);
  const r2 = cli('warns', sample('sample_2.gia'));
  assert.match(r2.stdout, /top graphs by node count/);
});
test('cli: warns limits section reports resource-class counts and is quoted consistently', () => {
  const r = cli('warns', sample('sample_9.gia'));
  assert.equal(r.status, 0);
  assert.match(r.stdout, /prefabs \(OBJECT\): \d+\/100/);
  assert.match(r.stdout, /GLOBAL_TIMER: \d+\/50/);
});
test('cli: warns limits section omits lines whose used count is 0', () => {
  const r = cli('warns', sample('sample_1.gia'));
  assert.equal(r.status, 0);
  const section = r.stdout.slice(r.stdout.indexOf('# limits'));
  assert.doesNotMatch(section, /: 0\//); // e.g. no "SKILL: 0/100" or "signals: 0/100"
  assert.match(section, /composites: \d+\/1000 declared/); // sample_1 does declare composites, kept
});
test('cli: code omits the resource list but keeps graphs and their nodes', () => {
  const r = cli('code', sample('sample_1.gia'));
  assert.equal(r.status, 0);
  assert.doesNotMatch(r.stdout, /^RESOURCE /m);
  assert.match(r.stdout, /^GRAPH /m);
  assert.match(r.stdout, /\/\[\d+\]/);
});
test('cli: dump lists graphs as a one-line summary (no per-node code) plus the resources', () => {
  const r = cli('dump', path.join(here, 'cases', 'gil', 'stage_1.gil'));
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^GRAPH /m);
  assert.match(r.stdout, /^RESOURCE /m);
  assert.doesNotMatch(r.stdout, /\/\[\d+\]/); // no "[N] NodeName" lines
});
test('cli: the removed --no-code / --no-resource options are errors', () => {
  for (const o of ['--no-code', '--no-resource']) assert.equal(cli('dump', o, sample('sample_1.gia')).status, 2);
});
test('cli: check --strict fails on an unknown field, passes on clean files', async () => {
  const fsm = await import('node:fs');
  const tmp = path.join(here, 'tmp_unknown.gia');
  fsm.writeFileSync(tmp, appendToFirstEntry(readSample('sample_8.gia'), varField(999, 1)));
  try {
    let r = cli('check', '--strict', tmp);
    assert.equal(r.status, 1); assert.match(r.stdout, /UNKNOWN FIELD AssetBundle\.resources #999/);
    r = cli('check', '--strict', sample('sample_8.gia'));
    assert.equal(r.status, 0);
    fsm.writeFileSync(tmp, readSample('sample_8.gia').subarray(0, 100));
    r = cli('dump', tmp);
    assert.equal(r.status, 1); assert.match(r.stderr, /error: .*tmp_unknown\.gia: /); assert.ok(!/at .*\.mjs:\d+/.test(r.stderr), 'no stack trace');
    r = cli('raw', tmp);
    assert.equal(r.status, 0, '--raw must still produce output for a damaged container');
  } finally { fsm.rmSync(tmp, { force: true }); }
});

test('literal_id: one role "Ref" whatever the id type, so the document formats get one column', async () => {
  const { refs } = buildRefs([bundle('sample_7.gia')], db);
  const lits = refs.filter((r) => r.kind === 'literal_id');
  assert.ok(lits.length > 0 && lits.every((r) => r.role === 'Ref'));
  assert.ok(new Set(lits.map((r) => r.key.split(':')[0])).size >= 1);
  const { run } = await import('./expected.mjs');
  const html = run(['refs', '--kind', 'literal_id', path.join('test', 'cases', 'gia', 'sample_7.gia'), '--format', 'html']);
  assert.match(html, /<th>literal_id<\/th>(<th>Resolved<\/th>)?<th[^>]*>Ref<\/th><\/tr>/);
  assert.doesNotMatch(html, /<th>(Cfg|Pfb|Gid|Int)<\/th>/);
});

test('literal ids are matched inside their own id space only (ID_SPACES), never by the guid alone', async () => {
  const { ID_SPACES } = await import('../src/refs.mjs');
  const all = Object.values(ID_SPACES).flatMap((sp) => sp.classes);
  assert.equal(new Set(all).size, all.length, 'a class belongs to one id space');
  assert.deepEqual(Object.values(ID_SPACES).map((sp) => sp.pinType).sort(), ['Cfg', 'Gid', 'Int', 'Pfb']);
  for (const c of ['GLOBAL_TIMER', 'CAMERA', 'GIL_RESPAWN_POINT', 'STATIC_ENTITY']) assert.ok(!all.includes(c), `${c} is only referred to by name`);
  const { run } = await import('./expected.mjs');
  const out = run(['refs', '--kind', 'literal_id', path.join('test', 'cases', 'composites', 'test_composite.gil'), '--format', 'text']);
  assert.match(out, /"Int: 1073741825" \(INTERFACE_LAYOUT:/, 'the same number is also the guid of a respawn point, which an integer id cannot refer to');
  assert.doesNotMatch(out, /GIL_RESPAWN_POINT|CAMERA/);
});
