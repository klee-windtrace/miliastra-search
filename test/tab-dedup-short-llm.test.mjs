// The options --tab (columns separated by tabs), --dedup (dump), --short (info) and the `llm` mode.
import './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { main } from '../src/cli.mjs';
import { root } from './helpers.mjs';

const stage = 'test/cases/gil/stage_012379.gil';
const variables = 'test/cases/variables72/variables_graph.gia';
const codegen = 'test/cases/codegen/codetest_2.gia';

function cli(args) {
  const prev = process.cwd(); process.chdir(root);
  let out = '', err = '';
  try { const code = main(args, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} }); return { code, out, err }; }
  finally { process.chdir(prev); }
}
const lines = (r) => r.out.split('\n');

test('--tab info: one tab between the columns, no padding', () => {
  const l = lines(cli(['info', stage, '--format', 'text', '--tab']));
  assert.ok(l.includes('format\tgil'));
  assert.ok(l.some((x) => /^CLASS\tSKILL\tclass=8\tcount=\d+$/.test(x)));
  assert.ok(l.some((x) => /^FOLDER\t\/Import Assets\/\tgraphs=\d+/.test(x)));
  assert.ok(l.some((x) => /^SECTION\troot\.\d+\tresources=\d+/.test(x)));
  assert.ok(l.includes(`# FILE\tstage_012379.gil`));
  assert.ok(!l.some((x) => / {2}/.test(x)), 'no padding left');
});

test('--tab dump: a separator character stays with the column on its left', () => {
  const l = lines(cli(['dump', stage, '--format', 'text', '--tab', '--details']));
  assert.ok(l.some((x) => /^RESOURCE\t\/Import Assets\/"New Status"\tUNIT_STATUS\tclass=7\tguid='\d+'\tsection=root\.15$/.test(x)));
  const v = lines(cli(['dump', variables, '--format', 'text', '--tab']));
  assert.ok(v.includes("GRAPH_VARIABLE\t'New Node Graph'\t'String' :\tStr (public) =\t'graph'"));
  assert.ok(v.includes("VARIABLE\tPlayer 1086324737:\"Default Template\"\t'String' {'New Node Graph'} :\tStr =\t'player'"));
  assert.ok(v.some((x) => /^VARIABLE_CHANGE\t\d+:"Entity_edited"\t\(\d+:"Prefab_edited"\)\t'Faction' \{'New Node Graph'\}\tedit:\tFct =\tid:200$/.test(x)));
  const m = cli(['dump', 'test/cases/mounts/test_folders.gil', '--format', 'text', '--tab']);
  assert.ok(lines(m).some((x) => /^MOUNT\t'[^'\t]+' ->\t[A-Z_]+ "[^"]*"\t\S+$/.test(x)), m.out.split('\n').filter((x) => x.startsWith('MOUNT')).slice(0, 2).join('|'));
});

test('--tab refs, warns, check, raw, code', () => {
  assert.ok(lines(cli(['refs', stage, '--format', 'text', '--tab'])).some((x) => /^[a-z_]+\t"[^"\t]*"[^\t]*\t[^\t]/.test(x)));
  const w = lines(cli(['warns', stage, '--format', 'text', '--tab']));
  assert.ok(w.some((x) => /^(INFO|WARN)\t[a-z-]+:\t\S/.test(x)));
  assert.ok(w.some((x) => /^composites:\t|^signals:\t|^\S[^\t]*:\t\d+\/\d+/.test(x)));
  assert.ok(lines(cli(['check', stage, '--format', 'text', '--tab'])).some((x) => /^\tschema census:\tOK/.test(x)));
  assert.ok(lines(cli(['raw', stage, '--format', 'text', '--tab'])).some((x) => /^\t+\d+:\t/.test(x)));
  const c = lines(cli(['code', codegen, '--format', 'text', '--tab']));
  assert.ok(c.includes("'<status>Status'/[2]\tMultiple Branches\t(3)\tout.flow#1\t\"0\" ->\t[3]\tRemove Unit Status\t(301)\tin.flow#0"), 'a flow wire: the arrow stays with the pin on its left');
  assert.ok(c.includes("'<status>Status'/[2]\tMultiple Branches\t(3)\tin#0\t\"Control Expression\" =\t0 :\tInt\t(also wired)"), 'a value');
  assert.ok(c.includes("'<status>Status'/VAR\tgvar :\tInt\tpublic=false =\t1"), 'a variable');
  assert.ok(!c.some((x) => /[^\t] {2,}/.test(x)));
});

test('--tab pseudocode: indented with tabs', () => {
  const r = cli(['code', codegen, '--pseudocode', '--format', 'text', '--tab']).out;
  assert.match(r, /\n\tconst GoTo = /);
  assert.match(r, /\n\t\tcase '/);
  assert.doesNotMatch(r, /\n {2}\S/);
  const plain = cli(['code', codegen, '--pseudocode', '--format', 'text']).out;
  assert.equal(r.replace(/\t/g, '  '), plain, 'only the indentation differs');
});

test('--tab does nothing in md, htm, markdown, html and json', () => {
  for (const f of ['md', 'htm', 'markdown', 'html', 'json']) assert.equal(cli(['all', stage, '--format', f, '--tab']).out, cli(['all', stage, '--format', f]).out, f);
});

test('--short info: no sections, no class= terms', () => {
  const t = cli(['info', stage, '--format', 'text', '--short']).out;
  assert.doesNotMatch(t, /^SECTION/m);
  assert.doesNotMatch(t, /class=/);
  assert.match(t, /^CLASS SKILL count=\d+$/m);
  assert.match(t, /^FOLDER /m);
  const md = cli(['info', stage, '--format', 'markdown', '--short']).out;
  assert.doesNotMatch(md, /Level sections|Class id/);
  assert.match(cli(['info', stage, '--format', 'text']).out, /^SECTION /m);
});

test('--dedup dump: equal resources without a folder are one line with the smallest guid and "+N more"', () => {
  const all = lines(cli(['dump', stage, '--format', 'text'])).filter((x) => x.startsWith('RESOURCE '));
  const d = cli(['dump', stage, '--format', 'text', '--dedup']);
  const dd = lines(d).filter((x) => x.startsWith('RESOURCE '));
  assert.ok(dd.length < all.length);
  const more = dd.filter((x) => / \+\d+ more$/.test(x));
  assert.ok(more.length > 0);
  const hidden = more.reduce((n, x) => n + Number(/\+(\d+) more$/.exec(x)[1]), 0);
  assert.equal(dd.length + hidden, all.length, 'every resource is a line or counted');
  const t = dd.find((x) => x.startsWith('RESOURCE "Default Template" GIL_PLAYER_ENTITY'));
  const guids = all.filter((x) => x.startsWith('RESOURCE "Default Template" GIL_PLAYER_ENTITY')).map((x) => BigInt(/guid='(\d+)'/.exec(x)[1]));
  assert.ok(t.includes(`guid='${guids.reduce((a, b) => (a < b ? a : b))}'`), t);
  assert.ok(all.filter((x) => x.includes('/Import Assets/')).every((x) => dd.includes(x)), 'resources in a folder stay');
  assert.match(cli(['dump', stage, '--format', 'color', '--dedup']).out, /\x1b\[95m\+\d+ more\x1b\[0m/, 'bright purple');
  assert.match(cli(['dump', stage, '--format', 'markdown', '--dedup']).out, /\*\*\+\d+ more\*\*/, 'in the Folder column');
  assert.doesNotMatch(cli(['dump', stage, '--format', 'text']).out, / \+\d+ more/);
  assert.match(cli(['all', stage, '--format', 'text', '--dedup']).out, / \+\d+ more$/m, 'all takes it too');
});

test('llm: the all report without warns, as short deduplicated tab-separated pseudocode; it takes no options', () => {
  const r = cli(['llm', stage]);
  assert.equal(r.code, 0);
  assert.match(r.out, /^# INFO$/m); assert.match(r.out, /^# DUMP$/m); assert.match(r.out, /^# REFS$/m); assert.match(r.out, /^# CODE$/m); assert.match(r.out, /^# END$/m);
  assert.doesNotMatch(r.out, /^# WARNS$/m); assert.doesNotMatch(r.out, /^# limits$/m); assert.doesNotMatch(r.out, /\x1b\[/);
  assert.doesNotMatch(r.out, /^SECTION/m);
  assert.match(r.out, /async function/);
  assert.match(r.out, /^format\tgil$/m, 'tab');
  assert.match(r.out, /\t\+\d+ more$/m, 'dedup');
  const manual = cli(['all', stage, '--lenient', '--lang', 'EN', '--format', 'text', '--short', '--dedup', '--tab', '--pseudocode', '--optimize', '--lazy', '--with-code']).out;
  assert.equal(r.out, manual.slice(0, manual.indexOf('# REFS')).replace(/(\tclass=(\d+|-))|(\tcategory=\w+)|(\tkind=\d+\tservice=\d+)|(\tentry_slot=\d+)|(\tevaluation_interval=[0-9.]+)|(\tsection=\w+(\.\d+)+)|(\tdecl='\d+')/g,'') + manual.slice(manual.indexOf('# REFS'), manual.indexOf('# WARNS')) + manual.slice(manual.indexOf('# CODE')) + '\n# END\n', 'the all output minus the warns, stripped details');
  for (const bad of [['--tab'], ['--dedup'], ['--format', 'json'], ['--lang', 'DE'], ['--short'], ['--search', 'x'], ['-o', 'x.txt']]) {
    const e = cli(['llm', stage, ...bad]);
    assert.equal(e.code, 2, bad.join(' ')); assert.match(e.err, /llm takes no options/);
  }
  assert.equal(cli(['llm', 'test/cases/gil']).code, 0);
  assert.match(cli(['--help']).out, /miliastra-search llm /);
});
