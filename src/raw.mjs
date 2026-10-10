// Schema-less dump (the `raw` mode): the fallback when the container or schema no longer matches the game.
import { walkRaw, toHex } from './decode.mjs';
const td = new TextDecoder('utf-8', { fatal: true });

export function rawDump(buf, indent = 0, depth = 12) {
  const pad = '  '.repeat(indent);
  let out = '';
  let items;
  try { items = walkRaw(buf); } catch (e) { return `${pad}<unparseable: ${e.message}>\n`; }
  for (const { field, wire, value } of items) {
    if (wire === 0) out += `${pad}${field}: ${value}\n`;
    else if (wire === 5) out += `${pad}${field}: f32 ${new DataView(value.buffer, value.byteOffset, 4).getFloat32(0, true)}\n`;
    else if (wire === 1) out += `${pad}${field}: f64 ${new DataView(value.buffer, value.byteOffset, 8).getFloat64(0, true)}\n`;
    else {
      let text = null;
      try { const s = td.decode(value); if (s.length && /^[^\x00-\x08\x0e-\x1f]*$/.test(s)) text = s; } catch { /* not utf8 */ }
      let nested = null;
      if (value.length && depth > 0) { try { walkRaw(value); nested = true; } catch { nested = false; } }
      // Prefer text when it looks like real text; otherwise a cleanly parsing sub-message.
      if (text !== null && /^[\x20-\x7e\u00a0-\uffff]{2,}$/.test(text) && !(nested && value.length < 4)) out += `${pad}${field}: ${JSON.stringify(text)}\n`;
      else if (nested) out += `${pad}${field}: {\n${rawDump(value, indent + 1, depth - 1)}${pad}}\n`;
      else out += `${pad}${field}: bytes(${value.length}) ${toHex(value.subarray(0, 32))}${value.length > 32 ? '…' : ''}\n`;
    }
  }
  return out;
}
