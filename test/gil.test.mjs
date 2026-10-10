// .gil (whole-stage) support. Everything here is independent of which node database is installed:
// GIL dumps are compared with the dumps of the GIA samples they were imported from (same DB on both sides).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { unwrapContainer, detectFormat, ContainerError } from '../src/container.mjs';
import { fileInfo, infoBlocks } from '../src/info.mjs';
import { textLines, plain } from '../src/doc.mjs';
import { here, readSample, payloadOf, renderText } from './helpers.mjs';

const db = new NodeDb();
const gilDir = path.join(here, 'cases', 'gil');
const gil = (n) => fs.readFileSync(path.join(gilDir, `stage_${n}.gil`));
const gilFiles = fs.readdirSync(gilDir).filter((f) => f.endsWith('.gil')).sort();
const lines = (buf, file) => renderText(parseBundle(buf, { file }), db).lines;

// GUIDs are renumbered by the game when a sample is imported into a stage; everything else must be identical.
const normalize = (l) => l
  .replace(/guid='?\d+'?/g, 'guid=N').replace(/\(guid \d+\)/g, '(guid N)').replace(/#\d{9,}/g, '#N')
  .replace(/\((\d{9,})\)/g, '(N)').replace(/id:\d{9,}/g, 'id:N').replace(/_node=\d+/g, '_node=N');
// (the "GRAPH ..." summary lines are left out: their GUIDs, `role=dependency` and the .gil-only `folder=` differ by design)
const graphLines = (ls) => ls.filter((l) => !l.startsWith('#') && !l.startsWith('GRAPH ') && !l.startsWith('RESOURCE ') && !l.startsWith('MOUNT ')).map(normalize).sort();

test('every stage file: container is GIL, decodes, and the schema census is empty', () => {
  assert.ok(gilFiles.length >= 8);
  for (const f of gilFiles) {
    const buf = fs.readFileSync(path.join(gilDir, f));
    assert.equal(unwrapContainer(buf).header.fileType, 2, f);
    const b = parseBundle(buf, { file: f });
    assert.equal(b.format, 'gil', f);
    assert.equal(b.formatDetectedBy, 'header', f);
    assert.deepEqual(b.census.entries(), [], `${f}: unknown fields ${JSON.stringify(b.census.entries())}`);
    assert.deepEqual(b.warnings, [], f);
    assert.equal(b.engineVersion, '7.0.0');
  }
});

const PAIRS = { 0: 'sample_0_main.gia', 1: 'sample_1.gia', 2: 'sample_2.gia', 3: 'sample_3.gia', 6: 'sample_6.gia', 7: 'sample_7.gia', 9: 'sample_9.gia' };
for (const [n, gia] of Object.entries(PAIRS)) {
  test(`stage_${n}.gil dumps like ${gia} (graphs, declarations, structs, up to GUID renumbering)`, () => {
    const a = graphLines(lines(readSample(gia), gia));
    const b = graphLines(lines(gil(n), `stage_${n}.gil`));
    assert.ok(a.length > 5);
    assert.deepEqual(b, a);
  });
}

test('classic mode is read from the level (stage_6) and absent otherwise', () => {
  assert.equal(parseBundle(gil(6)).modeFlag, 1);
  assert.equal(parseBundle(gil(1)).modeFlag, null);
  assert.match(textLines(infoBlocks(fileInfo(parseBundle(gil(6), { file: 'x' }), db))).map(plain).join('\n'), /^mode +classic$/m);
});

test('combined stage holds exactly the graphs of the samples imported into it', () => {
  const count = (buf) => parseBundle(buf).resources.filter((r) => r.kind === 'graph' && r.graph && r.graph.kind !== 21002).length;
  const expected = [0, 1, 2, 3, 7, 9].reduce((s, n) => s + count(readSample(PAIRS[n])), 0);
  assert.equal(count(gil('012379')), expected);
  const b = parseBundle(gil('012379'));
  assert.equal(b.resources.filter((r) => r.kind === 'struct').length, 3);
  assert.equal(b.resources.filter((r) => r.kind === 'graph' && r.graph.kind === 21002).length, 2); // composite bodies
});

test('GIL GUIDs are unique per kind only: composite bodies resolve through the declaration, not through equal GUIDs', () => {
  const out = lines(gil('012379'), 'x').join('\n');
  assert.match(out, /^GRAPH '<composite>[^']+' \w+ \(guid \d+, decl \d+\)$/m); // the title names the declaration's guid
  assert.doesNotMatch(out, /UNRESOLVED user-node/);
});

test('non-graph resources are listed with GIA class names', () => {
  const b = parseBundle(gil(9));
  const opaque = b.resources.filter((r) => r.kind === 'opaque');
  const has = (cls, name) => opaque.some((r) => r.className === cls && (name === undefined || r.name === name));
  for (const [cls, name] of [['PLAYER_TEMPLATE'], ['CHARACTER_TEMPLATE'],
    ['OBJECT', 'Wooden Bridge'], ['CREATION', 'Cryo Abyss Mage'], ['PROJECTILE', 'New Projectile'], ['OBJECT_ENTITY'], ['CREATION_ENTITY'],
    ['TERRAIN_ENTITY'], ['INTERFACE_LAYOUT'], ['UI_CONTROL'], ['GLOBAL_TIMER'], ['PRESET_POINT'], ['UNIT_TAG'], ['PATH'],
    ['ENTITY_DEPLOYMENT_GROUP'], ['CAMERA'], ['SCENE_GENERATION_TEMPLATE_A'], ['SCENE_GENERATION_TEMPLATE_B'],
    ['SKILL'], ['UNIT_STATUS'], ['ITEM'], ['CLASS'], ['SHIELD'], ['VFX_TOOL'], ['ENVIRONMENT_CONFIGURATION']]) {
    assert.ok(has(cls, name), `missing ${cls}${name ? ' ' + name : ''}`);
  }
  // classes GIA has no number for are named GIL_* and print as class=-
  const l = renderText(parseBundle(gil(9), { file: 'x' }), db, { details: true }).lines.filter((x) => x.startsWith('RESOURCE '));
  assert.ok(l.some((x) => / GIL_PLAYER_ENTITY class=- /.test(x) && / section=root\.5$/.test(x)));
  assert.ok(l.every((x) => / section=root\.[\d.]+$/.test(x)));
});

// ---------- format detection ----------
const setType = (buf, t) => { const b = Buffer.from(buf); b.writeUInt32BE(t, 12); return b; };

test('detection: header type decides; a clearly contradicting payload wins with a warning', () => {
  const gia = readSample('sample_1.gia'), g = gil(1);
  assert.equal(parseBundle(gia).format, 'gia');
  const lied = parseBundle(setType(g, 3));   // GIL payload, header claims GIA
  assert.equal(lied.format, 'gil'); assert.equal(lied.formatDetectedBy, 'payload');
  assert.match(lied.warnings.join(), /looks like \.gil/);
  const lied2 = parseBundle(setType(gia, 2)); // GIA payload, header claims GIL
  assert.equal(lied2.format, 'gia'); assert.match(lied2.warnings.join(), /looks like \.gia/);
  assert.equal(lied2.resources.length, parseBundle(gia).resources.length);
});

test('detection: unknown file type in lenient mode falls back to payload; GIP/GIR are rejected with a clear message', () => {
  assert.equal(parseBundle(setType(gil(1), 99), { lenient: true }).format, 'gil');
  assert.equal(parseBundle(setType(readSample('sample_1.gia'), 99), { lenient: true }).format, 'gia');
  assert.throws(() => parseBundle(setType(gil(1), 4)), (e) => e instanceof ContainerError && /\.gir/.test(e.message));
  assert.throws(() => parseBundle(setType(gil(1), 99)), ContainerError);
});

test('detection: --format forces the decoder (wrong choice fails instead of guessing)', () => {
  const p = payloadOf(gil(1));
  assert.equal(detectFormat(p, { fileType: 2 }, 'gia').format, 'gia');
  assert.throws(() => parseBundle(gil(1), { format: 'gia' }));
});

test('CLI: file names do not matter; directories pick up .gia/.gil and extensionless containers', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'miliastra-search-'));
  fs.copyFileSync(path.join(gilDir, 'stage_3.gil'), path.join(d, 'noext'));
  fs.copyFileSync(sampleFile('sample_3.gia'), path.join(d, 'renamed.bin'));
  fs.writeFileSync(path.join(d, 'notes.txt'), 'not a container');
  const bin = path.join(here, '..', 'miliastra-search.mjs');
  const out = execFileSync('node', [bin, 'info', d], { encoding: 'utf8' });
  assert.match(out, /# FILE .*noext\nformat +gil\ndetected_by +header\nfile_size +\d+\ncontainer_file_type +gil\nengine_version +7\.0\.0\nmode +beyond\nlevel_name +.*\nnode_db_version +\S+\nresources +60\n/);
  assert.match(out, /# FILE .*renamed\.bin\nformat +gia\ndetected_by +header\nfile_size +\d+\ncontainer_file_type +gia\nengine_version +7\.0\.0\nmode +beyond\nexport_name +/);
  assert.doesNotMatch(out, /notes\.txt/);
  // several files in one dump/code run: each file's lines are introduced by a `# FILE` line (a single file prints none)
  assert.match(execFileSync('node', [bin, 'dump', d], { encoding: 'utf8' }), /^# FILE .*noext$/m);
  const chk = JSON.parse(execFileSync('node', [bin, 'check', d, '--json'], { encoding: 'utf8' }));
  assert.deepEqual(chk.map((r) => r.format).sort(), ['gia', 'gil']);
  const s = execFileSync('node', [bin, 'code', '--search', 'Structure_1', path.join(d, 'noext')], { encoding: 'utf8' });
  assert.match(s, /STRUCT_ASSEMBLY/);
});
function sampleFile(n) { return path.join(here, 'cases', 'gia', n); }
