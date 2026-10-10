// Adds a UTF-8 byte order mark to every file with the given extensions under a folder (files that already have one are skipped).
// usage: node scripts/add-bom.mjs <folder> "<ext1;ext2;...>"      e.g.  node scripts/add-bom.mjs . "md;mjs"   (--help prints the usage)
// Extensions may be written as `md`, `.md` or `*.md`. `node_modules` and `.git` are not entered.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, UsageError } from './cli-args.mjs';

const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
const SKIP_DIRS = new Set(['node_modules', '.git']);

function addBom(file) {
  try {
    const content = fs.readFileSync(file);
    if (content.subarray(0, 3).equals(BOM)) { console.log(`[SKIPPED] ${file} (already has BOM)`); return true; }
    fs.writeFileSync(file, Buffer.concat([BOM, content]));
    console.log(`[ADDED] ${file}`);
    return true;
  } catch (e) {
    console.log(`[ERROR] could not process ${file}: ${e.message}`);
    return false;
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (!SKIP_DIRS.has(entry.name)) yield* walk(full); }
    else if (entry.isFile()) yield full;
  }
}

const USAGE = `usage: node scripts/add-bom.mjs <folder> "<ext1;ext2;...>"
Adds a UTF-8 byte order mark to every file with the given extensions under <folder>; files that already have one are skipped.
Extensions may be written as md, .md or *.md. node_modules and .git are not entered.
example: node scripts/add-bom.mjs . "md;mjs"
`;
let parsed;
try { parsed = parseArgs(process.argv.slice(2), { min: 2, max: 2 }); } catch (e) {
  if (!(e instanceof UsageError)) throw e;
  console.error(`error: ${e.message}\n\n${USAGE}`);
  process.exit(2);
}
if (parsed.help) { process.stdout.write(USAGE); process.exit(0); }
const [folder, exts] = parsed.positional;
const extensions = new Set(exts.split(';').map((e) => e.trim().replace(/[.*]/g, '').toLowerCase()).filter(Boolean).map((e) => `.${e}`));
if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
  console.error(`error: '${folder}' is not a valid directory.`);
  process.exit(1);
}

console.log(`Scanning: ${folder}`);
console.log(`Target extensions: ${[...extensions].join(', ')}\n`);
let failed = false;
for (const file of walk(folder)) {
  if (extensions.has(path.extname(file).toLowerCase())) failed = !addBom(file) || failed;
}
if (failed) process.exitCode = 1;
