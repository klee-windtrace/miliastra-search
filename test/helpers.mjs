import '../src/host-node.mjs'; // tests run on Node: install the real file system
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkRaw } from '../src/decode.mjs';
import { renderDoc } from '../src/render.mjs';
import { buildOverviewRows, overviewRowLines } from '../src/refs.mjs';
import { textLines, plain } from '../src/doc.mjs';
export const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.join(here, '..');
export const casesDir = path.join(here, 'cases'); // fixture categories: one folder each (gia, gil, composites, resolution)
export const samples = path.join(casesDir, 'gia');
export const sample = (n) => path.join(samples, n);
export const readSample = (n) => fs.readFileSync(sample(n));

/** The dump as plain text lines (what the text format prints), plus the summary. */
export function renderText(bundle, db, opts = {}) {
  const { blocks, summary } = renderDoc(bundle, db, opts);
  return { lines: textLines(blocks).map(plain), summary };
}
/** The refs overview as plain text (one entry per group; a struct entry is one multi-line block). */
export const overviewLines = (sel, opts) => buildOverviewRows(sel, opts).map((row) => overviewRowLines(row).map(plain).join('\n'));

export const varint = (n) => { n = BigInt(n); const out = []; while (n > 127n) { out.push(Number(n & 127n) | 128); n >>= 7n; } out.push(Number(n)); return Buffer.from(out); };
export const lenField = (f, buf) => Buffer.concat([varint((f << 3) | 2), varint(buf.length), buf]);
export const varField = (f, v) => Buffer.concat([varint(f << 3), varint(v)]);

export function wrap(payload) {
  const b = Buffer.alloc(24 + payload.length);
  b.writeUInt32BE(b.length - 4, 0); b.writeUInt32BE(1, 4); b.writeUInt32BE(0x326, 8); b.writeUInt32BE(3, 12); b.writeUInt32BE(payload.length, 16);
  payload.copy(b, 20); b.writeUInt32BE(0x679, b.length - 4);
  return b;
}
export const payloadOf = (buf) => buf.subarray(20, buf.length - 4);

/** Re-serialise a payload, appending `extra` bytes to the first top-level field `field` (default 1). */
export function appendToFirstEntry(buf, extra, field = 1) {
  const items = walkRaw(payloadOf(buf));
  let done = false;
  const parts = items.map((it) => {
    if (it.wire === 2) {
      let v = Buffer.from(it.value);
      if (!done && it.field === field) { v = Buffer.concat([v, extra]); done = true; }
      return lenField(it.field, v);
    }
    if (it.wire === 0) return varField(it.field, it.value);
    throw new Error('unexpected wire in helper');
  });
  return wrap(Buffer.concat(parts));
}
