#!/usr/bin/env node
// Schema-less explorer for the editor's `.mihoyobin` resources (and, with --xor none / --container, any protobuf file): shows the structure
// of a file, aggregates the structure of many files, searches them and exports tables. Run with --help for the usage.
//
// Protobuf does not say whether a length-delimited value is a string, a sub-message or raw bytes, so the output guesses: a value is shown as a
// sub-message only if it parses strictly (lengths in bounds, nothing left over, sane field numbers) and as text only if it is valid UTF-8 without
// control characters. When both hold, text wins and the line says so (--prefer-msg flips that).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseArgs as parseStrictArgs, toInt, UsageError } from './cli-args.mjs';

/** Editor resource files are protobuf with every byte XOR-ed with this key. */
export const XOR_KEY = 0xe5;
const DEFAULT_MAX_FIELD = 1 << 16;
const HASH_FLOOR = 1n << 20n; // smaller varints are ids and enums, not text hashes; annotating them would only add noise
const U64 = (1n << 64n) - 1n;
const decoder = new TextDecoder('utf-8', { fatal: true });

export function unxor(raw, key = XOR_KEY) {
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw[i] ^ key;
  return out;
}

/**
 * Strict one-level parse: [{ field, wire, value }] (value: BigInt for wire 0, a Uint8Array view otherwise). Throws RangeError unless the bytes are a
 * complete, well-formed message: groups, field 0, out-of-range field numbers, truncation and trailing bytes all fail. The src/ decoder is lenient on
 * purpose; a probe for "is this a sub-message?" must not be.
 */
export function parseStrict(buf, maxField = DEFAULT_MAX_FIELD) {
  const out = [];
  let pos = 0;
  const varint = () => {
    let v = 0n, shift = 0n;
    for (let n = 0; n < 10; n++) {
      if (pos >= buf.length) throw new RangeError('truncated varint');
      const b = buf[pos++];
      v |= BigInt(b & 0x7f) << shift;
      if (!(b & 0x80)) return v & U64;
      shift += 7n;
    }
    throw new RangeError('varint too long');
  };
  while (pos < buf.length) {
    const key = varint();
    const field = Number(key >> 3n), wire = Number(key & 7n);
    if (field < 1 || field > maxField) throw new RangeError(`field number ${field} out of range`);
    if (wire === 0) out.push({ field, wire, value: varint() });
    else if (wire === 1 || wire === 5) {
      const n = wire === 1 ? 8 : 4;
      if (pos + n > buf.length) throw new RangeError('truncated fixed-width value');
      out.push({ field, wire, value: buf.subarray(pos, pos + n) }); pos += n;
    } else if (wire === 2) {
      const len = Number(varint());
      if (pos + len > buf.length) throw new RangeError('length exceeds message');
      out.push({ field, wire, value: buf.subarray(pos, pos + len) }); pos += len;
    } else throw new RangeError(`unsupported wire type ${wire}`);
  }
  return out;
}

const asText = (bytes) => {
  let s;
  try { s = decoder.decode(bytes); } catch { return null; }
  return /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ufffd]/.test(s) ? null : s;
};
const asFields = (bytes, maxField) => { try { return parseStrict(bytes, maxField); } catch { return null; } };

// A run of varints that fills the value exactly: how `repeated int32/int64/enum` is stored when packed.
function packedVarints(bytes) {
  if (bytes.length < 2 || bytes.length > 256) return null;
  const vals = [];
  let pos = 0;
  while (pos < bytes.length) {
    let v = 0n, shift = 0n, ok = false;
    for (let n = 0; n < 10 && pos < bytes.length; n++) {
      const b = bytes[pos++];
      v |= BigInt(b & 0x7f) << shift; shift += 7n;
      if (!(b & 0x80)) { ok = true; break; }
    }
    if (!ok) return null;
    vals.push(v);
  }
  return vals.length >= 2 ? vals : null;
}

const f32Of = (b) => new DataView(b.buffer, b.byteOffset, 4).getFloat32(0, true);
const u32Of = (b) => new DataView(b.buffer, b.byteOffset, 4).getUint32(0, true);
const f64Of = (b) => new DataView(b.buffer, b.byteOffset, 8).getFloat64(0, true);
const u64Of = (b) => new DataView(b.buffer, b.byteOffset, 8).getBigUint64(0, true);
// Most fixed32 fields in these files are either floats of ordinary magnitude or small ids; anything else reads better as an integer.
const plausible = (x) => Number.isFinite(x) && (x === 0 || (Math.abs(x) >= 1e-6 && Math.abs(x) < 1e9));

/** Decode one parsed message level into annotated entries (recursing into what looks like a sub-message). */
export function decodeEntries(fields, o = {}, depth = 0) {
  const maxDepth = o.maxDepth ?? 32;
  return fields.map(({ field, wire, value }) => {
    if (wire === 0) return { field, wire, kind: 'varint', value };
    if (wire === 5) return { field, wire, kind: 'f32', bytes: value };
    if (wire === 1) return { field, wire, kind: 'f64', bytes: value };
    if (!value.length) return { field, wire, kind: 'empty' };
    const text = asText(value);
    const sub = asFields(value, o.maxField ?? DEFAULT_MAX_FIELD);
    // Tag byte 0x0a (field 1, length-delimited: the commonest first field) is also a newline, so `{1: "abc"}` is valid text. A text that has
    // a tab / newline / CR *and* parses as a message is far more likely the message than prose that happens to parse.
    const preferMsg = sub && (o.preferMsg || (text !== null && /[\t\n\r]/.test(text)));
    if (text !== null && !preferMsg) return { field, wire, kind: 'text', text, alsoMsg: sub !== null };
    if (sub !== null && depth < maxDepth) return { field, wire, kind: 'msg', children: decodeEntries(sub, o, depth + 1), alsoText: text !== null && text.length >= 4 }; // shorter coincidences are noise
    if (sub !== null) return { field, wire, kind: 'bytes', bytes: value, collapsed: true };
    return { field, wire, kind: 'bytes', bytes: value, packed: packedVarints(value) };
  });
}

/** Reads a file and returns { bytes, mode } with the first decoding that yields a well-formed top-level message (or the one forced by `xor`). */
export function loadBin(file, { xor = 'auto', container = false, maxField } = {}) {
  const raw = new Uint8Array(fs.readFileSync(file));
  const strip = (b) => {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    return b.length >= 28 && dv.getUint32(8) === 0x0326 ? b.subarray(20, b.length - 4) : null;
  };
  const candidates = [];
  const key = (k) => ({ mode: `xor 0x${k.toString(16)}`, make: () => unxor(raw, k) });
  if (container) candidates.push({ mode: 'container', make: () => strip(raw) });
  else if (xor === 'none') candidates.push({ mode: 'plain', make: () => raw });
  else if (xor !== 'auto') candidates.push(key(Number(xor)));
  else candidates.push(key(XOR_KEY), { mode: 'plain', make: () => raw }, { mode: 'container', make: () => strip(raw) });
  let lastError = 'empty file';
  for (const c of candidates) {
    const bytes = c.make();
    if (!bytes || !bytes.length) { lastError = bytes ? 'empty file' : 'no .gia/.gil container header'; continue; }
    try { parseStrict(bytes, maxField); return { bytes, mode: c.mode }; } catch (e) { lastError = e.message; }
  }
  const err = new Error(`${file}: not a protobuf message in any tried encoding (${lastError})`);
  err.file = file;
  throw err;
}

export function listFiles(args) {
  const out = [];
  const walk = (p) => {
    const st = fs.statSync(p);
    if (st.isDirectory()) for (const n of fs.readdirSync(p).sort()) walk(path.join(p, n));
    else if (/\.mihoyobin$/i.test(p)) out.push(p);
  };
  for (const a of args) {
    if (fs.statSync(a).isDirectory()) walk(a); // inside folders only the editor's own extension is taken; a named file is always taken
    else out.push(a);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- text maps
/** TextMap files hold repeated `2 { 2: hash, 3: text }`. Hashes are looked up per language (the folder the file sits in: CHS, EN, ...). */
export function loadTextMaps(paths, o = {}) {
  const byHash = new Map(); // decimal string -> [{ lang, text }]
  let entries = 0;
  for (const file of listFiles(paths)) {
    const lang = path.basename(path.dirname(path.resolve(file)));
    let bytes;
    try { ({ bytes } = loadBin(file, o)); } catch { continue; }
    for (const f of parseStrict(bytes, o.maxField)) {
      if (f.field !== 2 || f.wire !== 2) continue;
      const inner = asFields(f.value, o.maxField);
      const hash = inner?.find((x) => x.field === 2 && x.wire === 0)?.value;
      const text = inner?.find((x) => x.field === 3 && x.wire === 2);
      if (hash === undefined || !text) continue;
      const k = hash.toString();
      if (!byHash.has(k)) byHash.set(k, []);
      byHash.get(k).push({ lang, text: new TextDecoder().decode(text.value) });
      entries++;
    }
  }
  return { byHash, entries, lookup: (v) => (v >= HASH_FLOOR ? byHash.get(v.toString()) : undefined) };
}

// ---------------------------------------------------------------------------------------------------------------------- dump
const clip = (s, n) => (s.length > n ? `${s.slice(0, n)}…(+${s.length - n})` : s);
const hex = (b, n = 32) => Array.from(b.subarray(0, n), (x) => x.toString(16).padStart(2, '0')).join('') + (b.length > n ? '…' : '');
const fmtVarint = (v) => (v >= 1n << 63n ? `${v} (int64 ${v - (1n << 64n)})` : String(v));
const fmtF32 = (b) => { const f = f32Of(b); return plausible(f) ? `f32 ${Number(f.toPrecision(7))}` : `u32 ${u32Of(b)}`; };
const fmtF64 = (b) => { const f = f64Of(b); return plausible(f) ? `f64 ${Number(f.toPrecision(15))}` : `u64 ${u64Of(b)}`; };

function annotate(v, textMap) {
  const hits = textMap?.lookup(v);
  return hits ? `  → ${hits.map((h) => `${h.lang} ${JSON.stringify(clip(h.text, 80))}`).join(' | ')}` : '';
}

/** One leaf as text, or null for a sub-message (which the caller expands). */
function leaf(e, o) {
  switch (e.kind) {
    case 'varint': return fmtVarint(e.value) + annotate(e.value, o.textMap);
    case 'f32': return fmtF32(e.bytes);
    case 'f64': return fmtF64(e.bytes);
    case 'empty': return '{}  (empty string or message)';
    case 'text': return JSON.stringify(clip(e.text, o.maxText ?? 200)) + (e.alsoMsg ? '  # also parses as a message (--prefer-msg)' : '');
    case 'bytes': if (e.collapsed) return `{…}  (${e.bytes.length}-byte sub-message below the depth limit)`;
      return `bytes(${e.bytes.length}) ${hex(e.bytes)}${e.packed ? `  # packed varints? [${e.packed.slice(0, 12).join(', ')}${e.packed.length > 12 ? ', …' : ''}]` : ''}`;
    default: return null;
  }
}

const indexed = (entries) => {
  const total = new Map(), seen = new Map();
  for (const e of entries) total.set(e.field, (total.get(e.field) ?? 0) + 1);
  return entries.map((e) => {
    const i = seen.get(e.field) ?? 0; seen.set(e.field, i + 1);
    return { e, label: total.get(e.field) > 1 ? `${e.field}[${i}]` : String(e.field) };
  });
};

/** Indented tree, or (flat) one `path = value` line per leaf, which diffs and greps well. */
export function renderDump(entries, o = {}, prefix = '', indent = 0, out = []) {
  const pad = '  '.repeat(indent);
  for (const { e, label } of indexed(entries)) {
    const p = prefix ? `${prefix}.${label}` : label;
    if (e.kind === 'msg') {
      if (o.flat) renderDump(e.children, o, p, indent + 1, out);
      else {
        out.push(`${pad}${label}: {${e.alsoText ? '  # also valid UTF-8 text' : ''}`);
        renderDump(e.children, o, p, indent + 1, out);
        out.push(`${pad}}`);
      }
    } else out.push(o.flat ? `${p} = ${leaf(e, o)}` : `${pad}${label}: ${leaf(e, o)}`);
  }
  return out;
}

// -------------------------------------------------------------------------------------------------------------------- census
const CAP_VALUES = 5000, CAP_TEXTS = 500;

export function newCensus() { return { files: 0, paths: new Map() }; }

/** Aggregates the structure of one decoded file: per field path (numbers only, no indices) how often, in how many files and with what values. */
export function addToCensus(c, entries, fileId) {
  c.files++;
  const walk = (list, prefix) => {
    const perParent = new Map();
    for (const e of list) perParent.set(e.field, (perParent.get(e.field) ?? 0) + 1);
    for (const e of list) {
      const p = prefix ? `${prefix}.${e.field}` : String(e.field);
      let s = c.paths.get(p);
      if (!s) c.paths.set(p, s = { count: 0, files: 0, lastFile: null, maxPerParent: 0, kinds: {}, values: new Map(), valuesFull: false, min: null, max: null, texts: new Map(), lens: null, fmin: null, fmax: null });
      s.count++;
      if (s.lastFile !== fileId) { s.lastFile = fileId; s.files++; }
      s.maxPerParent = Math.max(s.maxPerParent, perParent.get(e.field));
      s.kinds[e.kind] = (s.kinds[e.kind] ?? 0) + 1;
      if (e.kind === 'varint') {
        if (s.min === null || e.value < s.min) s.min = e.value;
        if (s.max === null || e.value > s.max) s.max = e.value;
        const k = e.value.toString();
        if (s.values.has(k) || s.values.size < CAP_VALUES) s.values.set(k, (s.values.get(k) ?? 0) + 1); else s.valuesFull = true;
      } else if (e.kind === 'text') {
        if (s.texts.has(e.text) || s.texts.size < CAP_TEXTS) s.texts.set(e.text, (s.texts.get(e.text) ?? 0) + 1);
      } else if (e.kind === 'bytes') {
        s.lens = s.lens ? [Math.min(s.lens[0], e.bytes.length), Math.max(s.lens[1], e.bytes.length)] : [e.bytes.length, e.bytes.length];
      } else if (e.kind === 'f32' || e.kind === 'f64') {
        const x = e.kind === 'f32' ? f32Of(e.bytes) : f64Of(e.bytes);
        if (Number.isFinite(x)) { s.fmin = s.fmin === null ? x : Math.min(s.fmin, x); s.fmax = s.fmax === null ? x : Math.max(s.fmax, x); }
      }
      if (e.kind === 'msg') walk(e.children, p);
    }
  };
  walk(entries, '');
}

const pathCompare = (a, b) => {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] - y[i];
  return x.length - y.length;
};

const topValues = (s, n) => [...s.values].sort((a, b) => b[1] - a[1] || (BigInt(a[0]) < BigInt(b[0]) ? -1 : 1)).slice(0, n);

function describe(s, o) {
  const parts = [];
  const kinds = Object.entries(s.kinds).sort((a, b) => b[1] - a[1]).map(([k, n]) => (Object.keys(s.kinds).length > 1 ? `${k}×${n}` : k)).join(' ');
  if (s.kinds.varint) {
    if (s.values.size <= (o.enumMax ?? 16) && !s.valuesFull) parts.push(`{${topValues(s, 16).map(([v, n]) => `${v}×${n}`).join(', ')}}`);
    else {
      parts.push(`${s.valuesFull ? '>' : ''}${s.values.size} distinct, ${s.min}..${s.max}`);
      if (o.textMap) {
        let hit = 0;
        for (const k of s.values.keys()) if (o.textMap.lookup(BigInt(k))) hit++;
        if (hit) parts.push(`text hash: ${hit}/${s.values.size} resolved`);
      }
    }
  }
  if (s.kinds.text) {
    const sample = [...s.texts].slice(0, 3).map(([t]) => JSON.stringify(clip(t, 30)));
    parts.push(`${s.texts.size}${s.texts.size >= CAP_TEXTS ? '+' : ''} distinct text, e.g. ${sample.join(' ')}`);
  }
  if (s.lens) parts.push(`len ${s.lens[0]}..${s.lens[1]}`);
  if (s.fmin !== null) parts.push(`range ${Number(s.fmin.toPrecision(6))}..${Number(s.fmax.toPrecision(6))}`);
  return { kinds, detail: parts.join('; ') };
}

export function renderCensus(c, o = {}) {
  const rows = [];
  for (const p of [...c.paths.keys()].sort(pathCompare)) {
    const s = c.paths.get(p);
    const depth = p.split('.').length;
    if (s.files < (o.minFiles ?? 1) || depth > (o.maxDepth ?? 99)) continue;
    const { kinds, detail } = describe(s, o);
    // One line per path, with the full path first, so `grep '^ *100\.7 '` works.
    rows.push(`${'  '.repeat(depth - 1)}${p}  files ${s.files}/${c.files}  n=${s.count}${s.maxPerParent > 1 ? `  repeated (max ${s.maxPerParent} per parent)` : ''}  ${kinds}${detail ? `  ${detail}` : ''}`);
  }
  return rows;
}

export function censusJson(c, o = {}) {
  const out = { files: c.files, paths: {} };
  for (const p of [...c.paths.keys()].sort(pathCompare)) {
    const s = c.paths.get(p);
    out.paths[p] = {
      files: s.files, count: s.count, maxPerParent: s.maxPerParent, kinds: s.kinds,
      ...(s.kinds.varint ? { distinct: s.values.size, distinctTruncated: s.valuesFull, min: String(s.min), max: String(s.max), top: topValues(s, 16).map(([v, n]) => [v, n]) } : {}),
      ...(s.kinds.text ? { distinctText: s.texts.size, sampleText: [...s.texts.keys()].slice(0, 5) } : {}),
      ...(s.lens ? { lens: s.lens } : {}),
      ...(s.fmin !== null ? { floatRange: [s.fmin, s.fmax] } : {}),
    };
  }
  return out;
}

/** A draft `.proto` from the census: types are guesses and every field is named `f<number>`. */
export function protoSketch(c) {
  const children = new Map(); // parent path ('' = root) -> [path]
  for (const p of c.paths.keys()) {
    const parent = p.includes('.') ? p.slice(0, p.lastIndexOf('.')) : '';
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(p);
  }
  const msgName = (p) => (p ? `M_${p.replaceAll('.', '_')}` : 'Root');
  const out = ['// Draft: field types are guesses from the census; names are placeholders.', 'syntax = "proto2";', ''];
  const emit = (p) => {
    const lines = [`message ${msgName(p)} {`];
    for (const q of (children.get(p) ?? []).sort(pathCompare)) {
      const s = c.paths.get(q), n = Number(q.split('.').pop());
      const k = Object.keys(s.kinds);
      const dominant = k.sort((a, b) => s.kinds[b] - s.kinds[a])[0];
      const type = { varint: 'int64', text: 'string', bytes: 'bytes', empty: 'bytes', f32: s.fmin !== null && plausible(s.fmin) && plausible(s.fmax) ? 'float' : 'fixed32', f64: 'double', msg: msgName(q) }[dominant];
      const notes = [];
      if (k.length > 1) notes.push(`also ${k.filter((x) => x !== dominant).map((x) => `${x}×${s.kinds[x]}`).join(' ')}`);
      if (dominant === 'varint' && s.values.size <= 16 && !s.valuesFull) notes.push(`values ${[...s.values.keys()].join(',')}`);
      if (dominant === 'empty') notes.push('always empty');
      if (s.files < c.files) notes.push(`in ${s.files}/${c.files} files`);
      lines.push(`  ${s.maxPerParent > 1 ? 'repeated' : 'optional'} ${type} f${n} = ${n};${notes.length ? ` // ${notes.join('; ')}` : ''}`);
    }
    lines.push('}', '');
    out.push(lines.join('\n'));
    for (const q of (children.get(p) ?? []).sort(pathCompare)) if (c.paths.get(q).kinds.msg) emit(q);
  };
  emit('');
  return out.join('\n');
}

// ---------------------------------------------------------------------------------------------------------------------- find
/** Walks decoded entries and yields { path, entry } for every leaf, with indices in the path (as `dump --flat` prints them). */
export function* walkLeaves(entries, prefix = '') {
  for (const { e, label } of indexed(entries)) {
    const p = prefix ? `${prefix}.${label}` : label;
    if (e.kind === 'msg') yield* walkLeaves(e.children, p);
    else yield { path: p, entry: e };
  }
}
const stripIndices = (p) => p.replace(/\[\d+\]/g, '');

// ------------------------------------------------------------------------------------------------------------------------ keys
/** TextMap entries `2 { 1: key, 2: hash, 3: text }`; the key names the resource table a string belongs to. Yielded as { key, hash, text|null }. */
export function* textMapEntries(fields) {
  for (const f of fields) {
    if (f.field !== 2 || f.wire !== 2) continue;
    const inner = asFields(f.value);
    const key = inner?.find((x) => x.field === 1 && x.wire === 2);
    if (!key) continue;
    const hash = inner.find((x) => x.field === 2 && x.wire === 0)?.value;
    const text = inner.find((x) => x.field === 3 && x.wire === 2);
    yield { key: new TextDecoder().decode(key.value), hash, text: text ? new TextDecoder().decode(text.value) : null };
  }
}

/** Groups entries by key with numbers masked: [{ pattern, count, withText, example }] by descending count. */
export function textMapKeyPatterns(entriesLists) {
  const groups = new Map();
  for (const fields of entriesLists) {
    for (const { key: k, text } of textMapEntries(fields)) {
      const pattern = k.replace(/\d+/g, '#');
      let g = groups.get(pattern);
      if (!g) groups.set(pattern, g = { pattern, count: 0, withText: 0, example: k });
      g.count++;
      if (text !== null) g.withText++;
    }
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.pattern.localeCompare(b.pattern));
}

// ----------------------------------------------------------------------------------------------------------------------- table
const valuesAt = (entries, segs) => {
  const [head, ...rest] = segs, out = [];
  for (const e of entries) {
    if (e.field !== head) continue;
    if (!rest.length) out.push(e);
    else if (e.kind === 'msg') out.push(...valuesAt(e.children, rest));
  }
  return out;
};
const cleanCell = (s) => String(s).replace(/[\t\r\n]+/g, ' ');

function cell(e, textMap) {
  switch (e.kind) {
    case 'varint': {
      const hits = textMap?.lookup(e.value);
      return hits ? cleanCell(hits.map((h) => h.text).join(' / ')) : String(e.value);
    }
    case 'text': return cleanCell(e.text);
    case 'f32': return String(Number(f32Of(e.bytes).toPrecision(7)));
    case 'f64': return String(Number(f64Of(e.bytes).toPrecision(15)));
    case 'bytes': return hex(e.bytes);
    case 'msg': return '{…}';
    default: return '';
  }
}

/**
 * Tab-separated rows for spreadsheets and joins against other data. One row per file, or (rows = a root field number) one row per entry of that
 * repeated field, e.g. per input pin. `cols` are paths from the root and are repeated on every row; `rowCols` are paths inside the entry.
 * Several values at one path are joined with `|`; a hash that the text map knows is replaced by its text.
 */
export function tableRows(files, { cols, rows = null, rowCols = [], textMap = null }) {
  const split = (p) => p.split('.').map(Number);
  const header = ['file', ...(rows ? ['index'] : []), ...cols, ...rowCols.map((c) => `${rows}.${c}`)];
  const out = [header.join('\t')];
  for (const { file, entries } of files) {
    const base = cols.map((c) => valuesAt(entries, split(c)).map((e) => cell(e, textMap)).join('|'));
    if (!rows) { out.push([path.basename(file), ...base].join('\t')); continue; }
    entries.filter((e) => e.field === rows && e.kind === 'msg').forEach((e, i) => {
      const own = rowCols.map((c) => valuesAt(e.children, split(c)).map((x) => cell(x, textMap)).join('|'));
      out.push([path.basename(file), i, ...base, ...own].join('\t'));
    });
  }
  return out;
}

// ------------------------------------------------------------------------------------------------------------------------ CLI
const USAGE = `usage:
  mihoyobin.mjs dump   <file|dir>...  [--flat] [--depth N] [--max-text N]
  mihoyobin.mjs census <file|dir>...  [--proto | --json] [--min-files N] [--max-depth N]
  mihoyobin.mjs find   <file|dir>...  [--path P] [--value N] [--text S] [--limit N]
  mihoyobin.mjs keys   <textmap file|dir>...  [--grep S] [--limit N] [--max-text N]
  mihoyobin.mjs table  <file|dir>...  --cols P,P [--rows FIELD --row-cols P,P]
  mihoyobin.mjs unxor  <file> [-o OUT]
  mihoyobin.mjs --help

Inputs are files, or folders (searched for *.mihoyobin). Paths P are field numbers joined by dots (e.g. 100.7).
  dump    the decoded tree of each file (--flat: one "path = value" line per leaf; --depth: nesting limit)
  census  how each field path is used across the files; --proto prints a draft .proto, --json the raw statistics
  find    leaves at a path (--path), with a number (--value) or containing text (--text, also through --text-map hashes)
  keys    key patterns of TextMap files; with --grep, the entries whose key contains S
  table   tab-separated rows: one per file, or per entry of the repeated root field --rows
  unxor   writes the decoded protobuf bytes (default OUT: <file>.pb)
Options for all commands:
  --xor auto|none|<key>   byte transform (default auto: XOR 0xe5, then plain, then a .gia/.gil container)
  --container             a .gia/.gil container: strip its 20-byte header and 4-byte tail
  --text-map FILE|DIR     TextMap file(s) to annotate text hashes with (repeatable; language = parent folder name)
  --prefer-msg            show a value that parses both ways as a sub-message
  --max-field N           largest field number accepted as a message (default 65536)
`;

const COMMON = { flags: ['container', 'prefer-msg'], values: ['xor', 'text-map', 'max-field'], multi: ['text-map'] };
const COMMANDS = {
  dump: { flags: ['flat'], values: ['depth', 'max-text'] },
  census: { flags: ['proto', 'json'], values: ['min-files', 'max-depth'] },
  find: { values: ['path', 'value', 'text', 'limit'] },
  keys: { values: ['grep', 'limit', 'max-text'] },
  table: { values: ['cols', 'rows', 'row-cols'] },
  unxor: { values: ['out'] },
};

/** The options of one command as the camelCase object the code below reads; numbers are checked here. */
function parseCommand(cmd, rest) {
  const spec = COMMANDS[cmd];
  const a = parseStrictArgs(rest, {
    flags: [...COMMON.flags, ...(spec.flags ?? [])], values: [...COMMON.values, ...(spec.values ?? [])], multi: COMMON.multi,
    short: cmd === 'unxor' ? { '-o': 'out' } : {}, min: 1, max: cmd === 'unxor' ? 1 : Infinity,
  });
  if (a.help) return a;
  const camel = (n) => n.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const o = { positional: a.positional, textMaps: a.opts['text-map'] ?? [] };
  for (const [k, v] of Object.entries(a.opts)) if (k !== 'text-map') o[camel(k)] = v;
  for (const k of ['depth', 'max-depth', 'min-files', 'limit', 'max-text', 'max-field', 'rows']) if (a.opts[k] !== undefined) o[camel(k)] = toInt(k, a.opts[k], k === 'rows' ? 1 : 0);
  if (o.depth !== undefined) o.maxDepth = o.depth; // dump calls it --depth, census --max-depth; the decoder has one limit
  if (o.value !== undefined && !/^\d+$/.test(o.value)) throw new UsageError(`option --value needs a non-negative integer, got "${o.value}"`);
  if (o.proto && o.json) throw new UsageError('--proto and --json exclude each other');
  if (cmd === 'table' && o.cols === undefined && o.rowCols === undefined) throw new UsageError('table needs --cols (and, with --rows, optionally --row-cols)');
  if (o.rowCols !== undefined && !o.rows) throw new UsageError('--row-cols needs --rows FIELD');
  return { help: false, o };
}

/** Runs the CLI against `write` (so tests can capture output); returns the exit code. */
export function run(argv, write = (s) => process.stdout.write(s), warn = (s) => process.stderr.write(s)) {
  if (argv.includes('--help')) { write(USAGE); return 0; }
  const [cmd, ...rest] = argv;
  if (!Object.hasOwn(COMMANDS, cmd)) { warn(`error: ${cmd ? `unknown command ${cmd}` : 'no command'}\n\n${USAGE}`); return 2; }
  let o;
  try { ({ o } = parseCommand(cmd, rest)); } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    warn(`error: ${e.message}\n\n${USAGE}`); return 2;
  }
  const load = { xor: o.xor ?? 'auto', container: !!o.container, maxField: o.maxField };
  const dec = { maxDepth: o.maxDepth, preferMsg: !!o.preferMsg, maxField: o.maxField };
  try {
    if (cmd === 'unxor') {
      const file = o.positional[0];
      const out = o.out ?? `${path.basename(file)}.pb`;
      const { bytes, mode } = loadBin(file, load);
      fs.writeFileSync(out, bytes);
      write(`wrote ${out} (${bytes.length} bytes, decoded: ${mode})\n`);
      return 0;
    }
    const textMap = o.textMaps.length ? loadTextMaps(o.textMaps, load) : null;
    if (textMap) warn(`text map: ${textMap.entries} entries\n`);
    const files = listFiles(o.positional);
    if (!files.length) { warn('error: no .mihoyobin files found\n'); return 1; }
    const failures = [];
    const read = (file) => {
      try {
        const { bytes, mode } = loadBin(file, load);
        return { mode, entries: decodeEntries(parseStrict(bytes, o.maxField), dec) };
      } catch (e) { failures.push(e.message); return null; }
    };
    if (cmd === 'dump') {
      const ctx = { flat: !!o.flat, textMap, maxText: o.maxText };
      files.forEach((file, i) => {
        const r = read(file);
        if (!r) return;
        if (i) write('\n');
        write(`# ${file}  (decoded: ${r.mode})\n${renderDump(r.entries, ctx).join('\n')}\n`);
      });
    } else if (cmd === 'keys') {
      const lists = [];
      for (const file of files) { const r = read(file); if (r) lists.push(parseStrict(loadBin(file, load).bytes, o.maxField)); }
      if (o.grep !== undefined) {
        let n = 0;
        for (const fields of lists) for (const e of textMapEntries(fields)) if (e.key.includes(o.grep)) { n++; if (n <= (o.limit ?? 200)) write(`${e.hash}\t${e.key}\t${e.text === null ? '' : JSON.stringify(clip(e.text, o.maxText ?? 200))}\n`); }
        write(`${n} entr${n === 1 ? 'y' : 'ies'}${n > (o.limit ?? 200) ? ` (first ${o.limit ?? 200} shown; --limit N for more)` : ''}\n`);
        if (failures.length) warn(`${failures.length} file(s) skipped\n`);
        return 0;
      }
      const rows = textMapKeyPatterns(lists);
      write(`# ${rows.reduce((n, r) => n + r.count, 0)} entries, ${rows.length} key patterns\n`);
      for (const r of rows) write(`${String(r.count).padStart(7)}  ${r.pattern}  (${r.withText} with text; e.g. ${r.example})\n`);
    } else if (cmd === 'table') {
      const list = (s) => (typeof s === 'string' ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
      const decoded = [];
      for (const file of files) { const r = read(file); if (r) decoded.push({ file, entries: r.entries }); }
      write(`${tableRows(decoded, { cols: list(o.cols), rows: o.rows ?? null, rowCols: list(o.rowCols), textMap }).join('\n')}\n`);
    } else if (cmd === 'census') {
      const c = newCensus();
      files.forEach((file) => { const r = read(file); if (r) addToCensus(c, r.entries, file); });
      if (o.proto) write(`${protoSketch(c)}\n`);
      else if (o.json) write(`${JSON.stringify(censusJson(c), null, 2)}\n`);
      else write(`# ${c.files} files\n${renderCensus(c, { minFiles: o.minFiles, maxDepth: o.maxDepth, textMap }).join('\n')}\n`);
    } else {
      const wantValue = o.value !== undefined ? BigInt(o.value) : null;
      const wantText = o.text !== undefined ? o.text.toLowerCase() : null;
      if (wantValue === null && wantText === null && !o.path) { warn('error: find needs --path, --value or --text\n'); return 2; }
      const hashes = new Set(); // varints that stand for a text containing --text (needs --text-map)
      if (wantText && textMap) for (const [k, hits] of textMap.byHash) if (hits.some((h) => h.text.toLowerCase().includes(wantText))) hashes.add(k);
      const limit = o.limit ?? 50;
      let shown = 0, total = 0;
      for (const file of files) {
        const r = read(file);
        if (!r) continue;
        for (const { path: p, entry: e } of walkLeaves(r.entries)) {
          if (o.path && stripIndices(p) !== o.path) continue;
          if (wantValue !== null && !(e.kind === 'varint' && e.value === wantValue)) continue;
          if (wantText && !((e.kind === 'text' && e.text.toLowerCase().includes(wantText)) || (e.kind === 'varint' && hashes.has(e.value.toString())))) continue;
          total++;
          if (shown < limit) { shown++; write(`${file}  ${p} = ${leaf(e, { textMap })}\n`); }
        }
      }
      write(`${total} match${total === 1 ? '' : 'es'}${total > shown ? ` (first ${shown} shown; --limit N for more)` : ''}\n`);
    }
    if (failures.length) warn(`${failures.length} file(s) skipped:\n${failures.slice(0, 10).map((m) => `  ${m}\n`).join('')}${failures.length > 10 ? '  …\n' : ''}`);
    return 0;
  } catch (e) {
    warn(`error: ${e.message}\n`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); throw e; }); // `| head` closes the pipe early
  process.exitCode = run(process.argv.slice(2));
}
