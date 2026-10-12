// Expected outputs: what the CLI prints for every fixture. This module only *generates* them (so the test and the
// update script cannot disagree); test/expected.test.mjs compares, `npm run update-expected` rewrites the files.
//
// Layout: test/cases/<category>/<fixture files>     (a category is a folder, so the CLI can process it at once)
//         test/expected/<category>/<fixture>.<variant>.txt        text output of one fixture with one option set
//         test/expected/<category>/_folder.<run>.txt              text output of a whole category folder in one run
//         test/expected/<category>/_folder.<command>.<format>     the four document formats (md markdown htm html)
//
// The output formats are expected to change over time. When they do, these files are *supposed* to fail: review
// the diff, then run `npm run update-expected`.
import fs from 'node:fs';
import path from 'node:path';
import { main } from '../src/cli.mjs';
import { root, casesDir } from './helpers.mjs';

export const expectedDir = path.join(root, 'test', 'expected');

// One entry per option set exercised on every single fixture file. (Together they cover --show-tag, --defaults, --all-pins,
// --sort-desc and --top-graphs; dump and code are the two views of the same analysis.)
export const FILE_VARIANTS = {
  info: ['info'],
  'info-tag': ['info', '--show-tag'],
  dump: ['dump'],
  code: ['code'],
  'code-all': ['code', '--defaults', '--all-pins'],
  refs: ['refs'],
  'refs-sorted': ['refs', '--sort-desc'],
  warns: ['warns'],
  'warns-top': ['warns', '--top-graphs', '2'],
  check: ['check'],
};
// Runs over a whole category folder at once (multi-file layout: file prefixes, several files in one report).
export const FOLDER_RUNS = {
  info: ['info'],
  'info-grep': ['info', '--search', 'class=', '--match', '^CLASS'],
  refs: ['refs'],
  warns: ['warns'],
  'warns-grep': ['warns', '--match', '^(INFO|WARN)'],
  'warns-kind': ['warns', '--kind', 'signal'],
  'refs-grep': ['refs', '--search', 'listen', '--match', '^(signal|timer)'],
  'refs-signals': ['refs', '--kind', 'signal'],
  'dump-details': ['dump', '--details'], // the only runs with --details on; every other dump leaves it off
  'dump-grep': ['dump', '--search', 'Print', '--context', '1'],
  'code-grep': ['code', '--search', 'Print', '--match', '\\[\\d+\\]', '--context', '1'],
  'refs-search': ['refs', '--match', 'a.*(get|set)', '--context', '1'],
};
// Unified document outputs, one per format for each category folder.
export const DOC_FORMATS = ['md', 'markdown', 'htm', 'html'];
export const DOC_COMMANDS = { info: ['info'], dump: ['dump'], code: ['code'], refs: ['refs'], warns: ['warns'] };

/** Run the CLI in-process (cwd = project root, so file labels are stable relative paths). Returns stdout. */
export function run(args) {
  const prev = process.cwd(); process.chdir(root);
  let out = '', err = '';
  try { main(args, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} }); }
  finally { process.chdir(prev); }
  return out;
}

export const categories = () => fs.readdirSync(casesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
export const fixtures = (cat) => fs.readdirSync(path.join(casesDir, cat)).filter((n) => /\.(gia|gil)$/.test(n)).sort();
const rel = (...p) => path.posix.join('test', 'cases', ...p);

/** Map of expected-file path (relative to test/expected) -> expected content, for the whole test set. */
export function generate() {
  const out = new Map();
  for (const cat of categories()) {
    for (const f of fixtures(cat)) {
      for (const [name, args] of Object.entries(FILE_VARIANTS)) out.set(`${cat}/${f}.${name}.txt`, run([...args, rel(cat, f), '--format', 'text']));
    }
    const folder = rel(cat);
    for (const [name, args] of Object.entries(FOLDER_RUNS)) out.set(`${cat}/_folder.${name}.txt`, run([...args, folder, '--format', 'text']));
    for (const [cmd, args] of Object.entries(DOC_COMMANDS)) for (const fmt of DOC_FORMATS) out.set(`${cat}/_folder.${cmd}.${fmt}`, run([...args, folder, '--format', fmt]));
  }
  return out;
}

/** Every expected file currently on disk (relative paths). */
export function onDisk() {
  const out = [];
  if (!fs.existsSync(expectedDir)) return out;
  for (const cat of fs.readdirSync(expectedDir)) for (const f of fs.readdirSync(path.join(expectedDir, cat))) out.push(`${cat}/${f}`);
  return out.sort();
}
