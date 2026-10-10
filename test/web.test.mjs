// The browser bundle (web/miliastra-search.bundle.js) must be (1) fresh, (2) free of Node, and (3) produce exactly
// what the CLI prints. The page itself (miliastra-search.htm) only builds a command line and shows the result, so
// "same output as the CLI for the same argv" is the whole contract.
import './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildBundle } from '../scripts/build-web.mjs';
import { main } from '../src/cli.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundlePath = path.join(root, 'web', 'miliastra-search.bundle.js');

test('bundle is up to date (run: npm run build-web)', () => {
  assert.ok(fs.existsSync(bundlePath), 'web/miliastra-search.bundle.js is missing: npm run build-web');
  assert.equal(fs.readFileSync(bundlePath, 'utf8'), buildBundle(), 'bundle is stale: npm run build-web');
});

// A context that has what every browser has and nothing from Node: no require, process, Buffer, fs.
const ctx = vm.createContext({ TextDecoder, TextEncoder });
vm.runInContext(fs.readFileSync(bundlePath, 'utf8'), ctx);
const web = ctx.MiliastraSearch;

const caseFiles = ['gia/sample_1.gia', 'gil/stage_1.gil', 'composites/test_composite.gia', 'mounts/test_folders.gil'];
const vfs = new Map(caseFiles.map((f) => [path.basename(f), new Uint8Array(fs.readFileSync(path.join(root, 'test', 'cases', f)))]));
vfs.set('notes.txt', new TextEncoder().encode('hello'));

function cli(argv) {
  const prev = process.cwd(); process.chdir(path.join(root, 'test', 'cases'));
  try {
    let out = '', err = '';
    const code = main(argv, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} });
    return { code, out, err };
  } finally { process.chdir(prev); }
}

test('identifyFile tells gia from gil from garbage by content', () => {
  assert.equal(web.identifyFile(vfs.get('sample_1.gia')).format, 'gia');
  assert.equal(web.identifyFile(vfs.get('stage_1.gil')).format, 'gil');
  const bad = web.identifyFile(vfs.get('notes.txt'));
  assert.equal(bad.format, null);
  assert.ok(bad.reason);
});

const runs = [
  ['dump', 'sample_1.gia'], ['code', 'stage_1.gil', '--all-pins'], ['refs', 'sample_1.gia', 'test_composite.gia'],
  ['refs', 'sample_1.gia', '--sort-desc'], ['warns', 'sample_1.gia', 'test_composite.gia', '--top-graphs', '2'], ['info', 'sample_1.gia', 'stage_1.gil', '--show-tag', '--lang', 'zh'], ['dump', 'sample_1.gia', 'stage_1.gil', '--search', 'GRAPH'],
  ['code', 'sample_1.gia', '--match', 'set|get', '--context', '1'], ['dump', 'test_folders.gil'], ['refs', 'test_folders.gil'],
];
for (const fmt of ['text', 'htm', 'html']) for (const args of runs) {
  test(`web run == cli: ${args.join(' ')} --format ${fmt}`, () => {
    const argv = [...args, '--format', fmt];
    const w = web.run(argv, vfs);
    const dirOf = (f) => caseFiles.find((c) => path.basename(c) === f) ?? f;
    const c = cli(argv.map((a) => (/\.(gia|gil)$/.test(a) ? dirOf(a) : a)));
    // The CLI prints the paths it was given; the web run was given bare names. Compare modulo that prefix.
    const strip = (s) => s.replace(/(gia|gil|composites|mounts)\//g, '');
    assert.equal(w.code, c.code);
    assert.equal(w.out, strip(c.out));
    assert.equal(w.err, strip(c.err));
  });
}

test('web run reports errors like the CLI does', () => {
  const r = web.run(['dump', 'notes.txt'], vfs);
  assert.equal(r.code, 1);
  assert.match(r.err, /notes\.txt/);
  assert.equal(web.run(['dump', 'missing.gia'], vfs).code, 2);
});
