// L1c: the custom variables of an entity or a template, read from the raw component list.
//
// The variables live in a component that the GilFile / AssetBundle schema keeps opaque (see mounts.mjs for the other components). It is the
// component of kind 1 in the *dynamic* component list (entity field 7, template field 8); its payload (field 11) is `{ 1: variable }*`. A variable is
//   { 2: name, 3: type id, 4: value, 5: 1, 6: declared type }
// where `type id` is a server type id (SERVER_TYPES in model.mjs) and `value` ("typed value") is
//   { 1: type id, 2: type info, <10 + type id>: payload }
// The payload sits in the field numbered 10 + the type id, so a reader does not need the type id to find it, only to know what the payload means:
//   scalar   { 1: element }                      Str string, Int / Bol / Ety / Gid / Fct varint, Flt fixed32, Vec { 1: x, 2: y, 3: z } (fixed32),
//                                                Cfg / Pfb { 2: id }; an absent element is the zero value
//   list     { 1: element }*                     the same elements; Int / Bol / Ety / Gid / Fct / Flt lists are packed (one length-delimited field)
//   struct   { 1: typed value }*, 501: struct id  a field is a typed value of its own, named by its 501
//   list of structs { 1: typed value (a struct) }*, 501: struct id
//   dict     { 501: key, 502: value, 503: key type id, 504: value type id }   key and value are typed values
// Field 6 repeats the declared type; 5 is 1 in every file seen. The edit of a published graph variable on a host (mounts.mjs) is the same message without field 3. The meaning of a type's `2` (type info) is not fully known: for a struct it is
// `{ 1: 1, 2: struct id }`, for a dictionary a selector that is not read. Derived from variables_classic.gil and variables_beyond.gia (game 7.2.0), see FORMAT.md.
import { walkRaw } from './decode.mjs';

const safe = (b) => { try { return walkRaw(b); } catch { return []; } };
const first = (items, f) => items.find((x) => x.field === f);
const all = (items, f) => items.filter((x) => x.field === f);
const utf8 = new TextDecoder();

/** The kind of a scalar by type id (server ids: 1 Ety, 2 Gid, 3 Int, 4 Bol, 5 Flt, 6 Str, 12 Vec, 17 Fct, 20 Cfg, 21 Pfb, 25 Struct). */
const SCALAR_KIND = { 1: 'ety', 2: 'gid', 3: 'int', 4: 'bool', 5: 'float', 6: 'str', 12: 'vec', 17: 'fct', 20: 'cfg', 21: 'pfb', 25: 'struct' };
/** The element type of a list type id (7 L<Gid>, 8 L<Int>, 9 L<Bol>, 10 L<Flt>, 11 L<Str>, 13 L<Ety>, 15 L<Vec>, 22 L<Cfg>, 23 L<Pfb>, 24 L<Fct>, 26 L<Struct>). */
const LIST_ELEMENT = { 7: 2, 8: 3, 9: 4, 10: 5, 11: 6, 13: 1, 15: 12, 22: 20, 23: 21, 24: 17, 26: 25 };
const DICT_TYPE = 27;
/** The payload of a value of type `t` is in this field. */
const payloadField = (t) => 10 + t;

const f32At = (b) => new DataView(b.buffer, b.byteOffset, 4).getFloat32(0, true);
/** A varint as the number it stands for: int32 values are sign-extended to 64 bits by the game, so a negative one arrives as a huge unsigned number. */
const int32 = (v) => Number(BigInt.asIntN(32, BigInt(v)));

/** The scalars packed in a length-delimited field: varints, or fixed32 floats. */
function unpack(bytes, kind) {
  if (kind === 'float') return Array.from({ length: Math.floor(bytes.length / 4) }, (_, i) => f32At(bytes.subarray(i * 4, i * 4 + 4)));
  return readVarints(bytes);
}
function readVarints(bytes) {
  const out = [];
  let lo = 0n, shift = 0n;
  for (const b of bytes) {
    lo |= BigInt(b & 0x7f) << shift;
    if (b & 0x80) shift += 7n; else { out.push(lo <= 9007199254740991n ? Number(lo) : lo.toString()); lo = 0n; shift = 0n; }
  }
  return out;
}

/** One scalar element as a value AST (the shape normValue gives, see model.mjs; an id carries its type `ty` so that the resource it points at can be looked up), from the raw field occurrence `item` or null (the zero value). */
function element(kind, item) {
  const num = item?.wire === 0 ? item.value : 0;
  switch (kind) {
    case 'str': return { k: 'str', v: item?.wire === 2 ? utf8.decode(item.value) : '' };
    case 'int': return { k: 'int', v: int32(num) };
    case 'bool': return { k: 'bool', v: Number(num) !== 0 };
    case 'float': return { k: 'float', v: item?.wire === 5 ? f32At(item.value) : 0 };
    case 'ety': return { k: 'id', ty: 'Ety', v: num };
    case 'gid': return { k: 'id', ty: 'Gid', v: num };
    case 'fct': return { k: 'id', ty: 'Fct', v: num };
    case 'vec': {
      const v = item?.wire === 2 ? safe(item.value) : [];
      const c = (f) => { const x = first(v, f); return x?.wire === 5 ? f32At(x.value) : 0; };
      return { k: 'vec', v: [c(1), c(2), c(3)] };
    }
    case 'cfg': case 'pfb': { const id = item?.wire === 2 ? first(safe(item.value), 2)?.value : 0; return { k: 'id', ty: kind === 'cfg' ? 'Cfg' : 'Pfb', v: id ?? 0 }; }
    default: return null;
  }
}
const PACKED = new Set(['int', 'bool', 'float', 'ety', 'gid', 'fct']);

/** The typed value in `bytes` (`{ 1: type, 2: info, <10 + type>: payload }`), `typeId` being the type the context says it has. Null for a type this reader does not know. */
function typed(bytes, typeId = null) {
  const m = safe(bytes);
  const t = first(m, 1)?.value ?? typeId;
  if (t == null) return null;
  const pb = first(m, payloadField(t));
  const payload = pb?.wire === 2 ? safe(pb.value) : [];
  if (SCALAR_KIND[t] === 'struct') return { k: 'struct', items: all(payload, 1).map((x) => typed(x.value)) };
  if (SCALAR_KIND[t]) return element(SCALAR_KIND[t], first(payload, 1));
  const elem = LIST_ELEMENT[t];
  if (elem != null) {
    const kind = SCALAR_KIND[elem];
    const items = [];
    for (const x of all(payload, 1)) {
      if (kind === 'struct') items.push(typed(x.value, elem));
      else if (PACKED.has(kind) && x.wire === 2) for (const v of unpack(x.value, kind)) items.push(kind === 'float' ? { k: 'float', v } : element(kind, { wire: 0, value: v }));
      else items.push(element(kind, x));
    }
    return { k: 'list', items };
  }
  if (t === DICT_TYPE) {
    const keys = all(payload, 501), values = all(payload, 502);
    return { k: 'map', pairs: keys.map((key, i) => ({ k: 'pair', key: typed(key.value), value: values[i] ? typed(values[i].value) : null })) };
  }
  return null;
}

/** The struct id a typed value refers to (type info `2: { 1: 1, 2: id }`, else the payload's 501), or null. */
function structIdOf(valueMsg, t) {
  const info = first(safe(first(valueMsg, 2)?.value ?? new Uint8Array()), 2);
  const fromInfo = info?.wire === 2 ? first(safe(info.value), 2)?.value : null;
  if (fromInfo != null) return fromInfo;
  const pb = first(valueMsg, payloadField(t));
  return pb?.wire === 2 ? first(safe(pb.value), 501)?.value ?? null : null;
}

/** A variable message -> { name, typeId, structId, keyType, valueType, value }. The same message is the edit of a graph variable inside a graph mount (see mounts.mjs). */
export function readVariable(bytes) {
  const v = safe(bytes);
  const valueBytes = first(v, 4)?.wire === 2 ? first(v, 4).value : new Uint8Array();
  const vm = safe(valueBytes);
  // a graph variable's edit has no field 3: the type is the value's own
  const typeId = first(v, 3)?.value ?? first(vm, 1)?.value ?? 0;
  const dict = typeId === DICT_TYPE ? safe(first(vm, payloadField(typeId))?.value ?? new Uint8Array()) : [];
  const isStruct = SCALAR_KIND[typeId] === 'struct' || LIST_ELEMENT[typeId] === 25;
  return {
    name: first(v, 2)?.wire === 2 ? utf8.decode(first(v, 2).value) : '',
    typeId,
    structId: isStruct ? structIdOf(vm, typeId) : null,
    keyType: typeId === DICT_TYPE ? first(dict, 503)?.value ?? 6 : null,   // a type that is left out is the default, String
    valueType: typeId === DICT_TYPE ? first(dict, 504)?.value ?? 6 : null,
    value: first(v, 4) ? typed(valueBytes, typeId) : null,
  };
}

/**
 * The custom variables of an entity or template definition `f` (its decoded top-level fields), `dynField` = its dynamic component list.
 * An empty array when the component holds none; the definition always carries the component, so a definition without it is also `[]`.
 */
export function scanVariables(f, dynField) {
  for (const c of f.filter((x) => x.field === dynField && x.wire === 2)) {
    const comp = safe(c.value);
    if (first(comp, 1)?.value !== 1) continue;
    const payload = first(comp, 11);
    return payload?.wire === 2 ? all(safe(payload.value), 1).filter((x) => x.wire === 2).map((x) => readVariable(x.value)) : [];
  }
  return [];
}
