import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate, onDisk, expectedDir, categories, fixtures, run, FILE_VARIANTS } from './expected.mjs';

// Every fixture must print exactly what test/expected says. When the output format changes on purpose these fail:
// look at the diff, then `npm run update-expected`.
const want = generate();

for (const [rel, text] of want) {
  test(`expected output: ${rel}`, () => {
    const p = path.join(expectedDir, rel);
    assert.ok(fs.existsSync(p), `missing ${rel} – run: npm run update-expected`);
    assert.equal(text, fs.readFileSync(p, 'utf8'), `${rel} differs – if the change is intended, run: npm run update-expected`);
  });
}

test('no stale expected files (fixtures removed or run definitions changed)', () => {
  assert.deepEqual(onDisk().filter((r) => !want.has(r)), [], 'run: npm run update-expected');
});

test('every category folder has fixtures, and every fixture is covered by all option sets', () => {
  for (const cat of categories()) {
    assert.ok(fixtures(cat).length, `category ${cat} is empty`);
    for (const f of fixtures(cat)) for (const v of Object.keys(FILE_VARIANTS)) assert.ok(want.has(`${cat}/${f}.${v}.txt`));
  }
});

// The "color" format is the text format plus escape codes, and the two line-oriented document formats print the same
// lines as text: stripping the styling must give the text output back, for every fixture and command.
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
test('color == text without escape codes (all fixtures, dump and refs)', () => {
  for (const cat of categories()) for (const f of fixtures(cat)) for (const cmd of ['dump', 'refs']) {
    const file = `test/cases/${cat}/${f}`;
    assert.equal(strip(run([cmd, file, '--format', 'color'])), run([cmd, file, '--format', 'text']), `${cmd} ${file}`);
  }
});
