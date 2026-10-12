// Output conventions: dump --details, folder prefixes, code-mode graph titles, info sections / folders, mount order,
// client variable types, names owned by composites.
import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from './expected.mjs';

const c = (...p) => ['test', 'cases', ...p].join('/');
const text = (cmd, file, ...more) => run([cmd, file, ...more, '--format', 'text']);

test('client custom variables show their type in refs, wired or not', () => {
  const out = text('refs', c('client', 'client_var_types.gia'));
  assert.match(out, /^custom_variable\s+"var_bool" \(Bol\)\s/m);
  assert.match(out, /^custom_variable\s+"var_bool_list" \(L<Bol>\)\s/m);
  assert.match(out, /^custom_variable\s+"var_dict_generic" \(Dict\)\s/m);
  assert.doesNotMatch(out, /^custom_variable\s+"[^"]+"\s+\d+ get/m); // every variable has a "(type)" before the counts
});

test('dump leaves out the numeric details unless --details is on', () => {
  const file = c('mounts', 'test_folders.gil');
  const plain = text('dump', file);
  assert.doesNotMatch(plain, /\b(class|section|kind|service|composite_body|category|folder|mounted_on)=/);
  const det = text('dump', file, '--details');
  const det9 = text('dump', c('gil', 'stage_9.gil'), '--details');
  assert.match(det, /^GRAPH \/New Folder\/'<composite>Composite in custom' ENTITY_NODE_GRAPH class=9 guid='\d+' kind=21002 service=20000 nodes=0 composite_body=true$/m);
  assert.match(det9, /^RESOURCE \/[^/]+\/"[^"]+" \w+ class=\S+ guid='\d+' section=root\.\d/m);
  assert.doesNotMatch(text('dump', c('gil', 'stage_9.gil')), /^RESOURCE .*(class|section)=/m);
  assert.match(det, /^DECL "Signal_Name" SIGNAL_NODE_DECL class=14 guid='\d+' category=SEND_SIGNAL$/m);
  assert.doesNotMatch(det, /folder=|mounted_on/);
});

test('resources are prefixed with their folder; the default tab is "(default)"', () => {
  const out = text('dump', c('mounts', 'test_folders.gil'));
  assert.match(out, /^GRAPH \/\(default\)\/'Saved to default \(Uncategorized Tab\)' /m);
  assert.match(text('dump', c('gil', 'stage_9.gil')), /^RESOURCE \/[^/\n]+\/"/m);
});

test('code view: graph titles are short, composites state their declaration guid', () => {
  const out = text('code', c('composites', 'test_composite.gil'));
  assert.match(out, /^GRAPH '<composite>Create Composite Node' ENTITY_NODE_GRAPH \(guid \d+, decl \d+\)$/m);
  assert.match(out, /^GRAPH 'New Node Graph' ENTITY_NODE_GRAPH \(guid \d+\)$/m);
  assert.doesNotMatch(out, /\/COMPOSITE decl=|class=\d|folder=|kind=\d/);
});

test('info: sections carry a description, folders count their graphs and other resources', () => {
  const out = text('info', c('mounts', 'test_folders.gil'));
  assert.match(out, /^SECTION root\.10\.1 resources=\d+ description='node graphs/m);
  assert.match(out, /^FOLDER \/\(default\)\/ graphs=\d+( resources=\d+)?$/m);
  assert.match(out, /^FOLDER \/My\/ graphs=1$/m, 'graphs first; a zero is left out');
  assert.doesNotMatch(out, /resources=0|graphs=0/);
});

test('refs: mounted graphs follow the order of the graphs, not the alphabet', () => {
  const file = c('mounts', 'test_mount.gil');
  const mounts = [...text('refs', file).matchAll(/^mount\s+'([^']+)'/gm)].map((m) => m[1]);
  const graphs = [...text('dump', file).matchAll(/^GRAPH (?:\/[^/]*\/)?'([^']+)'/gm)].map((m) => m[1]);
  assert.ok(mounts.length > 1);
  assert.deepEqual(mounts, graphs.filter((g) => mounts.includes(g)));
});

test('refs: a name fixed inside a composite belongs to the composite, listeners included', () => {
  const out = text('refs', c('composites', 'var_change.gia'));
  assert.match(out, /^custom_variable\s+"Var2" \(Str\)\s.*1 trigger: \['<composite>VAR_TEST_2'\], 1 listen: \['<composite>VAR_TEST_3'\]$/m);
  // an exposed name stays with the caller
  assert.match(out, /^custom_variable\s+"Var1" \(Int\)\s.*1 trigger: \['VAR_TEST'\], 1 listen: \['VAR_TEST'\]$/m);
});

test('refs: the catch-all listener is a plain "listen" with a descriptive key', () => {
  const out = text('refs', c('gia', 'sample_2.gia'));
  assert.match(out, /"\* \(listener for any name\)"\s+1 listen:/);
  assert.doesNotMatch(out, /listener\(any name\)/);
});
