// --search / --match: grep over whatever a mode prints (dump, code, refs, check, raw). There is no separate search mode.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { here, sample } from './helpers.mjs';

const cli = (...a) => spawnSync(process.execPath, [path.join(here, '..', 'miliastra-search.mjs'), ...a, '--format', 'text'], { encoding: 'utf8' });
const f = path.join(here, 'cases', 'mounts', 'test_mount.gil');
const lines = (r) => r.stdout.split('\n').filter(Boolean);

test('--search is a case-insensitive substring over the printed lines', () => {
  const r = cli('dump', '--search', 'class_both_on_both', f);
  assert.equal(r.status, 0);
  assert.ok(lines(r).every((l) => /class_both_on_both/i.test(l)));
  assert.match(r.stdout, /^RESOURCE "Class_Both_On_Both" CLASS /m);
  assert.match(r.stderr, /\d+ matching line/);
});
test('--match is a case-insensitive regexp over the printed lines', () => {
  const r = cli('dump', '--match', '^MOUNT .*(Player|Character)\\b.*CLASS', f);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^MOUNT '<class>Mounted_Class_Player' -> CLASS "Class_Player" player$/m);
  assert.doesNotMatch(r.stdout, /Mounted_Prefab/);
});
test('--search and --match together are an AND on the same line', () => {
  const both = cli('dump', '--search', 'everywhere', '--match', '^MOUNT', f);
  assert.ok(lines(both).length > 0 && lines(both).every((l) => /^MOUNT/.test(l) && /everywhere/i.test(l)));
  assert.equal(cli('dump', '--search', 'everywhere', '--match', '^NOPE', f).status, 1);
});
test('--context adds surrounding lines', () => {
  const plain = lines(cli('dump', '--search', 'Class_Both_On_Both', f)).length;
  const ctx = lines(cli('dump', '--search', 'Class_Both_On_Both', '--context', '1', f)).length;
  assert.ok(ctx > plain);
});
test('grep works in every mode: code, refs (overview and --name), check, raw', () => {
  assert.match(cli('code', '--search', 'Graph_Var', sample('sample_8.gia')).stdout, /Graph_Var/);
  let r = cli('refs', '--search', 'Mounted_Prefab', f);
  assert.equal(r.status, 0); assert.match(r.stdout, /Mounted_Prefab/); assert.doesNotMatch(r.stdout, /Mounted_Player/);
  r = cli('refs', '--kind', 'mount', '--name', 'Mounted_Everywhere', '--match', 'PLAYER_TEMPLATE', f);
  assert.equal(r.status, 0); assert.equal(lines(r).length, 1);
  assert.equal(cli('check', '--match', 'engine', f).status, 0);
  assert.equal(cli('raw', '--search', 'No_Graphs', f).status, 0);
});
test('--match on warns greps the printed lines (the limits section here)', () => {
  const r = cli('warns', '--match', '^limits$|^# limits', f);
  assert.equal(r.status, 0); assert.match(r.stdout, /# limits/);
});
test('usage errors: bad regexp, --json with grep, removed search mode and --regex', () => {
  assert.match(cli('refs', '--match', '(', f).stderr, /bad --match regexp/);
  assert.equal(cli('refs', '--search', 'x', '--json', f).status, 2);
  assert.equal(cli('search', 'x', f).status, 2);
  assert.match(cli('dump', '--regex', f).stderr, /unknown option/);
});
test('no matching line: exit 1', () => {
  assert.equal(cli('code', '--search', 'zzz-nothing', sample('sample_8.gia')).status, 1);
});
test('--help names the modes of every option', () => {
  const h = cli('--help').stdout;
  for (const opt of ['--search', '--match', '--context', '--kind', '--name', '--sort-desc', '--top-graphs', '--all-pins', '--defaults', '--show-tag', '--strict', '--json', '--lang', '--db', '--input', '--lenient', '--format', '--output']) assert.ok(h.includes(opt), opt);
  for (const mode of ['info', 'dump', 'code', 'refs', 'warns', 'check', 'raw']) assert.match(h, new RegExp(`miliastra-search ${mode} `));
  assert.doesNotMatch(h, /--regex|--no-code|--no-resource|\bsearch +<files/);
});

// ---------- the document formats keep their structure ----------
const rich = (fmt, ...a) => spawnSync(process.execPath, [path.join(here, '..', 'miliastra-search.mjs'), ...a, '--format', fmt], { encoding: 'utf8' });

test('--search in html/markdown keeps the tables: only the matching rows, under their headings, with a recounted heading', () => {
  const r = rich('html', 'dump', '--search', 'Mounted_Prefab', f);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /<table>/); assert.doesNotMatch(r.stdout, /class="lines"/, 'not the plain-lines page');
  assert.match(r.stdout, /Only lines with search/);
  assert.match(r.stdout, /Mounted_Prefab/); assert.doesNotMatch(r.stdout, /Mounted_Player/);
  assert.equal((r.stdout.match(/<tr><td>/g) || []).length, 2, 'one graph, one resource');
  assert.match(r.stdout, /<h2 id="graphs-1">Graphs \(1\)<\/h2>/, 'the count in the heading follows the rows');
  assert.match(r.stdout, /<h2 id="resources-1">Resources \(1\)<\/h2>/);
  const md = rich('markdown', 'dump', '--search', 'Mounted_Prefab', f);
  assert.match(md.stdout, /^\| Name \| Class \| Guid \|/m);
  assert.match(md.stderr, /\d+ matching line/);
});

test('--search in html: a node keeps its head line and its pin table, under its graph; --context pulls in neighbours', () => {
  const g = sample('sample_8.gia');
  const r = rich('html', 'code', '--search', 'Graph_Var', g);
  assert.match(r.stdout, /<h2 id="graph-[^"]*">/); assert.match(r.stdout, /<p><span class="nodeIndex">/); assert.match(r.stdout, /Graph_Var/);
  // compare the <main> content only: the stylesheet is the same size in every page and dominates a small fixture
  const body = (h) => h.slice(h.indexOf('<main>'));
  const all = rich('html', 'code', g).stdout;
  assert.ok(body(r.stdout).length < body(all).length / 2, 'most of the content is gone');
  const ctx = rich('html', 'code', '--search', 'Graph_Var', '--context', '2', g).stdout;
  assert.ok(body(ctx).length > body(r.stdout).length);
});

test('--search in html finds nothing: exit 1, still a page that says so', () => {
  const r = rich('html', 'refs', '--search', 'no such thing anywhere', f);
  assert.equal(r.status, 1); assert.match(r.stdout, /No line with search/); assert.doesNotMatch(r.stdout, /<table>/);
});

test('--search/--match in html also work for check and raw (preformatted lines)', () => {
  const c = rich('html', 'check', '--search', 'census', sample('sample_8.gia'));
  assert.equal(c.status, 0); assert.match(c.stdout, /<pre>/); assert.match(c.stdout, /schema census/i);
  const raw = rich('markdown', 'raw', '--match', '^1:', sample('sample_8.gia'));
  assert.equal(raw.status, 0); assert.match(raw.stdout, /^```text/m);
});
