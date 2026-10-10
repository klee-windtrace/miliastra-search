// Name languages: codes are the game's TextMap folder names, accepted in any case; ZH is CHS; missing names fall back to EN, then CHS.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { NodeDb, normLang } from '../src/nodedb.mjs';
import { sample, here } from './helpers.mjs';

const cli = (...args) => spawnSync(process.execPath, [path.join(here, '..', 'miliastra-search.mjs'), ...args], { encoding: 'utf8' });

test('normLang: any case, ZH is CHS, EN by default', () => {
  assert.deepEqual(['de', 'DE', 'Zh', 'ZH', 'chs', 'jp'].map(normLang), ['DE', 'DE', 'CHS', 'CHS', 'CHS', 'JP']);
  assert.equal(normLang(undefined), 'EN');
  assert.equal(new NodeDb({ lang: 'zh' }).lang, 'CHS');
});

test('pick: the chosen language, else EN, else CHS', () => {
  const o = { names: { CHS: '甲', EN: 'A', DE: 'Ä' } };
  assert.deepEqual(['de', 'en', 'zh', 'fr'].map((l) => new NodeDb({ lang: l }).pick(o)), ['Ä', 'A', '甲', 'A']);
  assert.equal(new NodeDb().pick({ names: { CHS: '甲' } }), '甲');
  assert.equal(new NodeDb().pick({}), undefined);
});

test('cli: --lang takes any case and ZH for CHS; an unknown language is a usage error', () => {
  const zh = cli('code', sample('sample_1.gia'), '--lang', 'zh'), chs = cli('code', sample('sample_1.gia'), '--lang', 'chs'), en = cli('code', sample('sample_1.gia'));
  assert.equal(zh.status, 0); assert.equal(zh.stdout, chs.stdout); assert.notEqual(zh.stdout, en.stdout);
  assert.equal(cli('code', sample('sample_1.gia'), '--lang', 'en').stdout, en.stdout);
  const bad = cli('code', sample('sample_1.gia'), '--lang', 'xx');
  assert.equal(bad.status, 2); assert.match(bad.stderr, /unknown language "xx" \(the database has:/);
});

test('cli: --db with more languages; overlay names merge into the built ones', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-'));
  const db = path.join(dir, 'db.json');
  fs.writeFileSync(db, JSON.stringify({ languages: ['DE', 'EN'], nodes: { 1: { id: 1, names: { EN: 'One', DE: 'Eins' }, pins: {} } }, enums: {}, kernels: {} }));
  const ov = path.join(dir, 'ov.json');
  fs.writeFileSync(ov, JSON.stringify({ nodes: { 1: { names: { FR: 'Un' } } } }));
  const d = new NodeDb({ dbPath: db, overlayPath: ov, lang: 'fr' });
  assert.equal(d.nodeName(1), 'Un'); assert.equal(new NodeDb({ dbPath: db, overlayPath: ov, lang: 'de' }).nodeName(1), 'Eins');
  fs.rmSync(dir, { recursive: true, force: true });
});
