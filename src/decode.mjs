// Schema-driven protobuf decoder with a built-in unknown-field census.
// It never throws on unknown fields or wire-type mismatches: it records them and keeps going.
// (It does throw RangeError on structurally broken bytes: truncated data, bad varints.)

const td = new TextDecoder('utf-8', { fatal: false });

/** Lowercase hex of a byte array (a Uint8Array, not a Node Buffer, so this runs anywhere). */
export const toHex = (u8) => Array.from(u8, (b) => b.toString(16).padStart(2, '0')).join('');

export function readVarint(buf, pos) {
  let lo = 0, hi = 0, shift = 0;
  for (let n = 0; n < 10; n++) {
    if (pos >= buf.length) throw new RangeError('truncated varint');
    const b = buf[pos++];
    const v = b & 0x7f;
    if (shift < 28) lo |= v << shift;
    else if (shift === 28) { lo |= (v & 0x0f) << 28; hi |= v >>> 4; }
    else hi |= v << (shift - 32);
    if (!(b & 0x80)) return [lo >>> 0, hi >>> 0, pos];
    shift += 7;
  }
  throw new RangeError('varint too long');
}

const toBig = (lo, hi) => (BigInt(hi) << 32n) | BigInt(lo);
function signed64(lo, hi) { let v = toBig(lo, hi); if (v >= (1n << 63n)) v -= (1n << 64n); return v; }
// 64-bit ints become Number when exactly representable, else a decimal string (never silently lossy).
function normBig(v) { return (v >= -9007199254740991n && v <= 9007199254740991n) ? Number(v) : v.toString(); }

export const SCALAR_WIRE = {
  int32: 0, int64: 0, uint32: 0, uint64: 0, sint32: 0, sint64: 0, bool: 0, enum: 0,
  float: 5, fixed32: 5, sfixed32: 5, double: 1, fixed64: 1, sfixed64: 1, string: 2, bytes: 2,
};

function scalarFromVarint(type, lo, hi) {
  switch (type) {
    case 'int32': case 'enum': return lo | 0;
    case 'uint32': return lo;
    case 'bool': return (lo | hi) !== 0;
    case 'int64': return normBig(signed64(lo, hi));
    case 'uint64': return normBig(toBig(lo, hi));
    case 'sint32': return (lo >>> 1) ^ -(lo & 1);
    case 'sint64': { const v = toBig(lo, hi); return normBig((v >> 1n) ^ -(v & 1n)); }
    default: return lo;
  }
}

// map: fields the schema does not know (or whose wire type disagrees with it). opaque: fields the schema declares as
// `opaque_*` (or inside an `opaque_rest` message): known but not interpreted, only counted.
export class Census {
  constructor() { this.map = new Map(); this.opaque = new Map(); }
  add(path, field, wire, note) {
    const key = `${path}#${field}/w${wire}${note ? ' ' + note : ''}`;
    let e = this.map.get(key);
    if (!e) { e = { path, field, wire, note: note || null, count: 0, sample: null }; this.map.set(key, e); }
    e.count++;
    return e;
  }
  entries() {
    return [...this.map.values()].sort((a, b) => (a.path + '#' + String(a.field).padStart(6)).localeCompare(b.path + '#' + String(b.field).padStart(6)));
  }
  get size() { return this.map.size; }
}

function previewRaw(wire, raw, v) {
  if (wire === 0) return String(toBig(v[0], v[1]));
  if (wire === 5) return `f32=${new DataView(raw.buffer, raw.byteOffset, 4).getFloat32(0, true)}`;
  if (wire === 1) return `f64=${new DataView(raw.buffer, raw.byteOffset, 8).getFloat64(0, true)}`;
  const s = td.decode(raw);
  return /^[\x20-\x7e]{1,60}$/.test(s)
    ? JSON.stringify(s)
    : `${raw.length} bytes 0x${toHex(raw.subarray(0, 24))}${raw.length > 24 ? '…' : ''}`;
}

/** Decode `buf` as message type `msg` (from parseProto). Returns a plain object; absent fields are absent. */
export function decodeMessage(buf, msg, census, path = msg.full) {
  const obj = {};
  let pos = 0;
  while (pos < buf.length) {
    let lo, hi;
    [lo, hi, pos] = readVarint(buf, pos);
    const field = (lo >>> 3) | (hi << 29);
    const wire = lo & 7;
    let raw, rawVar;
    if (wire === 0) { let l, h; [l, h, pos] = readVarint(buf, pos); rawVar = [l, h]; }
    else if (wire === 1) { if (pos + 8 > buf.length) throw new RangeError('truncated fixed64'); raw = buf.subarray(pos, pos + 8); pos += 8; }
    else if (wire === 2) {
      let l, h; [l, h, pos] = readVarint(buf, pos);
      if (pos + l > buf.length) throw new RangeError('truncated length-delimited field');
      raw = buf.subarray(pos, pos + l); pos += l;
    } else if (wire === 5) { if (pos + 4 > buf.length) throw new RangeError('truncated fixed32'); raw = buf.subarray(pos, pos + 4); pos += 4; }
    else throw new RangeError(`unsupported wire type ${wire}`);

    const f = msg.fields.get(field);
    if (!f && msg.opaqueRest) { // known-but-uninterpreted content of an identified message (e.g. a level-file entry)
      const k = `${path}.opaque_${field}`; census.opaque.set(k, (census.opaque.get(k) || 0) + 1);
      continue;
    }
    if (!f) {
      const e = census.add(path, field, wire);
      if (!e.sample) e.sample = previewRaw(wire, raw, rawVar);
      continue;
    }
    let value;
    if (f.msg) {
      if (wire !== 2) { census.add(`${path}.${f.name}`, field, wire, 'wire-type-mismatch(expected message)'); continue; }
      value = decodeMessage(raw, f.msg, census, `${path}.${f.name}`);
    } else {
      const want = SCALAR_WIRE[f.scalar];
      if (f.repeated && wire === 2 && want !== 2) { // packed repeated scalars
        const arr = obj[f.name] || (obj[f.name] = []);
        let p2 = 0;
        while (p2 < raw.length) {
          if (want === 0) { let l, h; [l, h, p2] = readVarint(raw, p2); arr.push(scalarFromVarint(f.scalar, l, h)); }
          else if (want === 5) { arr.push(new DataView(raw.buffer, raw.byteOffset + p2, 4).getFloat32(0, true)); p2 += 4; }
          else { arr.push(new DataView(raw.buffer, raw.byteOffset + p2, 8).getFloat64(0, true)); p2 += 8; }
        }
        continue;
      }
      if (wire !== want) { census.add(`${path}.${f.name}`, field, wire, `wire-type-mismatch(expected w${want})`); continue; }
      if (wire === 0) value = scalarFromVarint(f.scalar, rawVar[0], rawVar[1]);
      else if (wire === 5) {
        const d = new DataView(raw.buffer, raw.byteOffset, 4);
        value = f.scalar === 'float' ? d.getFloat32(0, true) : (f.scalar === 'fixed32' ? d.getUint32(0, true) : d.getInt32(0, true));
      } else if (wire === 1) {
        const d = new DataView(raw.buffer, raw.byteOffset, 8);
        value = f.scalar === 'double' ? d.getFloat64(0, true) : normBig(f.scalar === 'sfixed64' ? d.getBigInt64(0, true) : d.getBigUint64(0, true));
      } else value = f.scalar === 'string' ? td.decode(raw) : toHex(raw);
    }
    if (f.name.startsWith('opaque_')) { const k = `${path}.${f.name}`; census.opaque.set(k, (census.opaque.get(k) || 0) + 1); }
    if (f.repeated) (obj[f.name] || (obj[f.name] = [])).push(value);
    else obj[f.name] = value;
  }
  return obj;
}

/**
 * Schema-less walk over the top-level fields of one message: [{ field, wire, value }] (value: a number, or a decimal string
 * beyond 2^53, for varints; a Uint8Array otherwise). Used by `raw` mode, format sniffing and the raw scans in mounts.mjs.
 */
export function walkRaw(buf) {
  const out = [];
  let pos = 0;
  while (pos < buf.length) {
    let lo, hi;
    [lo, hi, pos] = readVarint(buf, pos);
    const field = (lo >>> 3) | (hi << 29), wire = lo & 7;
    if (wire === 0) { let l, h; [l, h, pos] = readVarint(buf, pos); out.push({ field, wire, value: normBig(toBig(l, h)) }); }
    else if (wire === 1) { out.push({ field, wire, value: buf.subarray(pos, pos + 8) }); pos += 8; }
    else if (wire === 2) { let l, h; [l, h, pos] = readVarint(buf, pos); out.push({ field, wire, value: buf.subarray(pos, pos + l) }); pos += l; }
    else if (wire === 5) { out.push({ field, wire, value: buf.subarray(pos, pos + 4) }); pos += 4; }
    else throw new RangeError(`unsupported wire type ${wire}`);
  }
  return out;
}
