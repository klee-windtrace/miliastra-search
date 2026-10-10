// Rewrites every file under test/expected from the current CLI output (and removes files no longer produced).
// Run it after an intended output change, then review the diff:   npm run update-expected
import fs from 'node:fs';
import path from 'node:path';
import { generate, onDisk, expectedDir } from './expected.mjs';
import { parseArgs, UsageError } from '../scripts/cli-args.mjs';

const USAGE = 'usage: npm run update-expected\nRewrites every file under test/expected from the current CLI output. Takes no arguments.\n';
try {
  if (parseArgs(process.argv.slice(2)).help) { process.stdout.write(USAGE); process.exit(0); }
} catch (e) {
  if (!(e instanceof UsageError)) throw e;
  console.error(`error: ${e.message}\n\n${USAGE}`);
  process.exit(2);
}

const want = generate();
let written = 0, unchanged = 0;
for (const [rel, text] of want) {
  const p = path.join(expectedDir, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (fs.existsSync(p) && fs.readFileSync(p, 'utf8') === text) { unchanged++; continue; }
  fs.writeFileSync(p, text); written++;
}
let removed = 0;
for (const rel of onDisk()) if (!want.has(rel)) { fs.rmSync(path.join(expectedDir, rel)); removed++; }
console.log(`expected outputs: ${written} written, ${unchanged} unchanged, ${removed} removed (${want.size} total)`);
