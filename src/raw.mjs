// The `raw` mode: the protobuf payload without a schema, the fallback for when the container or the schema does not match the game.
// rawTree builds the `payload` of the raw report (see JSON.md); src/present/raw.mjs prints it.
import { walkRaw, toHex } from './decode.mjs';
const td = new TextDecoder('utf-8', { fatal: true });

// 32-bit and 64-bit floats can be NaN or infinite, which JSON cannot hold: those are written as their name ("NaN", "Infinity")
const jsonNumber = (x) => (Number.isFinite(x) ? x : String(x));

/**
 * The fields of `buf` read as protobuf without a schema: { error, fields }, where `error` is the reason the bytes are no protobuf (then
 * `fields` is empty) or null. A field is { field, type, ... } with `type` one of
 *   varint   value (a number, or a decimal string when it does not fit)
 *   f32, f64 value
 *   string   value
 *   message  message ({ error, fields } again, `depth` levels deep at most)
 *   bytes    length, hex (the first 32 bytes), truncated
 */
export function rawTree(buf, depth = 12) {
  let items;
  try { items = walkRaw(buf); } catch (e) { return { error: e.message, fields: [] }; }
  const fields = [];
  for (const { field, wire, value } of items) {
    if (wire === 0) fields.push({ field, type: 'varint', value });
    else if (wire === 5) fields.push({ field, type: 'f32', value: jsonNumber(new DataView(value.buffer, value.byteOffset, 4).getFloat32(0, true)) });
    else if (wire === 1) fields.push({ field, type: 'f64', value: jsonNumber(new DataView(value.buffer, value.byteOffset, 8).getFloat64(0, true)) });
    else {
      let text = null;
      try { const s = td.decode(value); if (s.length && /^[^\x00-\x08\x0e-\x1f]*$/.test(s)) text = s; } catch { /* not utf8 */ }
      let nested = null;
      if (value.length && depth > 0) { try { walkRaw(value); nested = true; } catch { nested = false; } }
      // Prefer text when it looks like real text; otherwise a cleanly parsing sub-message.
      if (text !== null && /^[\x20-\x7e\u00a0-\uffff]{2,}$/.test(text) && !(nested && value.length < 4)) fields.push({ field, type: 'string', value: text });
      else if (nested) fields.push({ field, type: 'message', message: rawTree(value, depth - 1) });
      else fields.push({ field, type: 'bytes', length: value.length, hex: toHex(value.subarray(0, 32)), truncated: value.length > 32 });
    }
  }
  return { error: null, fields };
}
