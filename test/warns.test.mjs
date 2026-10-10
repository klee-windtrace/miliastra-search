// The `warns` mode: findings, limits and the biggest graphs (split off `refs`, which prints only its reference tables).
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { here } from './helpers.mjs';
import { run } from './expected.mjs';

const bin = path.join(here, '..', 'miliastra-search.mjs');
const cli = (...a) => spawnSync(process.execPath, [bin, ...a, '--format', 'text'], { encoding: 'utf8', cwd: path.join(here, '..') });
const s2 = 'test/cases/gia/sample_2.gia';
const clean = 'test/cases/composites/test_All_Composite.gia';

test('refs prints only its reference tables: no findings, limits or top-graphs section in any format', () => {
  for (const fmt of ['text', 'md', 'htm', 'markdown', 'html']) {
    const out = run(['refs', s2, '--format', fmt]);
    assert.match(out, /Signal\\?_1/, fmt); // md escapes the underscore
    assert.doesNotMatch(out, /# findings|# limits|Limits|Findings|by effective node count|catch-all-listener/i, fmt);
  }
  assert.doesNotMatch(cli('refs', '--name', 'Signal_1', s2).stdout, /FINDING/);
});

test('warns prints findings, limits and top graphs, and no reference tables', () => {
  const out = cli('warns', s2).stdout;
  assert.match(out, /^# findings$/m);
  assert.match(out, /^INFO {2}catch-all-listener: /m);
  assert.match(out, /^# limits$/m);
  assert.match(out, /^signals: 2\/100 declared$/m);
  assert.match(out, /^top graphs by node count/m);
  assert.doesNotMatch(out, /^signal +"Signal_1"/m);
  assert.match(run(['warns', s2, '--format', 'markdown']), /^## Findings$/m);
  assert.match(run(['warns', s2, '--format', 'html']), /<h2 id="limits">Limits<\/h2>/);
});

test('warns: a file without findings says so; the limits stay', () => {
  const out = cli('warns', clean).stdout;
  assert.match(out, /^# findings\n\(no findings\)$/m);
  assert.match(out, /^# limits$/m);
});

test('warns --top-graphs N; the option means nothing for refs', () => {
  assert.equal((cli('warns', '--top-graphs', '1', s2).stdout.match(/ nodes$/gm) || []).length, 1);
  assert.match(cli('warns', '--top-graphs', '2', s2).stdout, /top graphs/);
  const a = cli('refs', s2), b = cli('refs', '--top-graphs', '1', s2);
  assert.equal(a.status, 0); assert.equal(b.stdout, a.stdout);
});

test('warns --kind/--name keep only the matching findings (and print no limits); refs --sort-desc does not apply to warns', () => {
  const sig = cli('warns', '--kind', 'signal', s2).stdout;
  assert.doesNotMatch(sig, /# limits/);
  assert.doesNotMatch(sig, /catch-all-listener/, 'that finding is about a timer, not a signal');
  const timer = cli('warns', '--kind', 'timer', s2).stdout;
  assert.match(timer, /catch-all-listener/);
  assert.equal(cli('warns', '--kind', 'nope', s2).status, 2);
  assert.equal(cli('warns', '--sort-desc', s2).stdout, cli('warns', s2).stdout);
});

test('--json: refs has only references, warns has findings and limits', () => {
  const r = JSON.parse(spawnSync(process.execPath, [bin, 'refs', s2, '--json'], { encoding: 'utf8', cwd: path.join(here, '..') }).stdout);
  assert.deepEqual(Object.keys(r), ['refs']);
  const w = JSON.parse(spawnSync(process.execPath, [bin, 'warns', s2, '--json'], { encoding: 'utf8', cwd: path.join(here, '..') }).stdout);
  assert.deepEqual(Object.keys(w), ['findings', 'limits']);
  assert.ok(w.findings.length && w.limits.graphSizes.length);
  assert.equal(cli('warns', s2, '--json', '--search', 'x').status, 2);
});

test('warns shows file names per finding when several files are scanned; grep works', () => {
  const out = cli('warns', s2, 'test/cases/gia/sample_1.gia').stdout;
  assert.match(out, /^INFO {2}catch-all-listener: .* \[sample_2\.gia\]$/m);
  const g = cli('warns', s2, '--match', '^INFO');
  assert.equal(g.status, 0); assert.ok(g.stdout.split('\n').filter(Boolean).every((l) => /^INFO/.test(l)));
});

test('--help documents info and warns first-class and scopes the options', () => {
  const h = cli('--help').stdout;
  const modes = [...h.matchAll(/^  miliastra-search (\w+) /gm)].map((m) => m[1]);
  assert.deepEqual(modes, ['info', 'dump', 'refs', 'warns', 'code', 'check', 'raw']);
  assert.match(h, /^warns only:\n  --top-graphs/m);
  assert.match(h, /^info only:\n  --show-tag/m);
  assert.match(h, /^refs only:\n  --sort-desc/m);
  assert.doesNotMatch(h, /limits section \(default 5\)\n\ncode only/);
});
