#!/usr/bin/env node
// Builds data/nodes.json, the node database the engine loads, from the editor resources of a local Genshin Impact install.
//
//   npm run build-db [-- options]          (or: node scripts/build-db.mjs [options])
//
//   --genshin <folder>  where to look for the game (default: %PROGRAMFILES%). Anything from the drive root down to the editor's
//                       `Beyond/Node` folder works: the script walks down the usual install path, and up the given path, until it finds
//                       the folder (see findNodeDir). Example: --genshin "D:\Games"
//   --version <V>       game version to record in the database (default: `game_version` of the install's config.ini, section [General])
//   --compare <file>    database to compare the result with; the comparison is always printed (default: data/nodes.json)
//   --out <file>        where the result is written, always (default: data/nodes.json)
//   --limit <N>         examples shown per difference in the comparison (default 5)
//   --help              this text
//
// The comparison reads the old file before the new one is written, so the defaults show what a game update changed.
// Run `npm run build-web` afterwards (the web bundle embeds the database).
//
// Inputs, all below `Resource/Json` (XOR 0xe5 protobuf; the layout is described in TECHNICAL.md, "Editor resource files"):
//   Beyond/Node/*.mihoyobin       one node each: ids, pins (names, types, defaults, roles), concrete variants
//   Beyond/BeyondGlobal/*.mihoyobin   enum families and their values
//   TextMap/<LANG>/*.mihoyobin    the strings the name hashes point to, one folder per language; every folder found is read
// Not in the files, hence not in the database: node descriptions and enum identifiers.
// Variant constraints are rebuilt from the type lists (`C<T:Int>`, `C<K:Int,V:Str>`, `C<T:D<Ety,Gid>>`); an enum is written `E<family id>`.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadBin, parseStrict, textMapEntries } from './mihoyobin.mjs';
import { parseArgs, toInt, UsageError } from './cli-args.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB = path.join(here, '..', 'data', 'nodes.json');

// Same tables as src/model.mjs (a test keeps them equal; importing model.mjs here would pull in the whole engine).
export const SERVER_TYPES = {
  0: 'Unk', 1: 'Ety', 2: 'Gid', 3: 'Int', 4: 'Bol', 5: 'Flt', 6: 'Str', 7: 'L<Gid>', 8: 'L<Int>', 9: 'L<Bol>', 10: 'L<Flt>',
  11: 'L<Str>', 12: 'Vec', 13: 'L<Ety>', 14: 'Enum', 15: 'L<Vec>', 16: 'Loc', 17: 'Fct', 18: 'L<Enum>', 20: 'Cfg', 21: 'Pfb',
  22: 'L<Cfg>', 23: 'L<Pfb>', 24: 'L<Fct>', 25: 'Struct', 26: 'L<Struct>', 27: 'Dict', 28: 'Snapshot',
};
export const CLIENT_TYPES = {
  0: 'Unk', 1: 'Ety', 2: 'L<Ety>', 3: 'Int', 4: 'L<Int>', 5: 'Bol', 6: 'L<Bol>', 7: 'Flt', 8: 'L<Flt>', 9: 'Str', 10: 'L<Str>',
  11: 'Vec', 12: 'L<Vec>', 13: 'Enum', 14: 'Gid', 15: 'L<Gid>', 16: 'Fct', 17: 'L<Enum>', 18: 'Cfg', 19: 'Pfb', 20: 'L<Cfg>',
  21: 'L<Pfb>', 22: 'Struct', 23: 'L<Struct>', 24: 'Dict', 25: 'L<Fct>',
};
// Service (graph type) of a node's id block that makes it a server node: the set src/resolve.mjs uses; every other service is client.
export const SERVER_SERVICES = [20000, 20003, 20004, 20005];
const DOMAINS = { 1: 'Execution', 2: 'Trigger', 3: 'Control', 4: 'Query', 5: 'Arithmetic' };
// Pin lists of a node file. The two client groups keep their own names.
const PIN_GROUPS = [
  { field: 100, kind: 'in_flow' }, { field: 101, kind: 'out_flow' }, { field: 102, kind: 'in_param' }, { field: 103, kind: 'out_param' },
  { field: 106, kind: 'client_exec' }, { field: 107, kind: 'client_signal' },
];
const ROLE_HIDDEN = 2;
// Type-parameter roles of a pin (pin field 5.1): 8 key, 9 value, 10 dictionary, 11 key list, 12 value list; 3 marks the pins of the data-type
// conversion nodes (source type on the input, result type on the output).
const ROLE_KEY = [8, 11], ROLE_VALUE = [9, 12], ROLE_DICT = 10, ROLE_LIST = [11, 12], ROLE_CONVERT = 3;
const roleParam = (roles, outgoing) => (roles.includes(ROLE_CONVERT) ? (outgoing ? 'V' : 'K') : roles.some((r) => ROLE_KEY.includes(r)) ? 'K' : roles.some((r) => ROLE_VALUE.includes(r)) ? 'V' : 'T');
const WIDGET_GENERIC = 10000;
const BINDING_KIND = { 3: 'in_param', 4: 'out_param' };

// ------------------------------------------------------------------------------------------------------------------------ wire access
const num = (fields, n) => {
  const x = fields.find((i) => i.field === n && i.wire === 0);
  if (!x) return undefined;
  if (x.value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`field ${n} exceeds the safe integer range`);
  return Number(x.value);
};
const sub = (fields, n) => { const x = fields.find((i) => i.field === n && i.wire === 2); return x ? parseStrict(x.value) : null; };
const subs = (fields, n) => fields.filter((i) => i.field === n && i.wire === 2).map((i) => parseStrict(i.value));
const f32 = (fields, n) => { const x = fields.find((i) => i.field === n && i.wire === 5); return x ? new DataView(x.value.buffer, x.value.byteOffset, 4).getFloat32(0, true) : undefined; };
const rounded = (x) => Number(x.toPrecision(7));
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');
const XOR = { xor: 0xe5 };
const readBin = (file) => { const { bytes } = loadBin(file, XOR); return { bytes, fields: parseStrict(bytes) }; };

// ------------------------------------------------------------------------------------------------------------------------ text maps
export function readTextMap(file) {
  const { bytes, fields } = readBin(file);
  const texts = new Map();
  for (const { hash, text } of textMapEntries(fields)) {
    if (hash === undefined || text === null) continue; // keys without text exist (descriptions, flow pins); they have nothing to resolve to
    if (texts.has(Number(hash))) throw new Error(`duplicate TextMap hash ${hash}: ${file}`);
    texts.set(Number(hash), text);
  }
  return { texts, sha256: sha256(bytes) };
}

/** `{ names: { EN: ..., CHS: ... } }` for a text hash: every language that has a text for it; `{}` when none has. */
const nm = (hash, maps) => {
  const names = {};
  if (hash !== undefined) for (const [lang, texts] of Object.entries(maps)) { const t = texts.get(hash); if (t !== undefined) names[lang] = t; }
  return Object.keys(names).length ? { names } : {};
};

// ------------------------------------------------------------------------------------------------------------------------------ types
/**
 * Short type name of a pin or variant entry. `cvt` (field 4.4) indexes the backend's type table; an enum (14 server, 13 client) carries its
 * family in the connection type (10000 + family id) or, in variant lists, in `enumId`.
 */
export function typeStr(backend, cvt, conn, enumId) {
  const table = backend === 1 ? SERVER_TYPES : CLIENT_TYPES;
  const code = cvt ?? conn;
  const base = table[code];
  if (base === 'Enum' || base === 'L<Enum>') {
    const id = enumId ?? (conn >= 10000 ? conn - 10000 : undefined);
    if (id === undefined || id === 0 || id === 200000) return base; // family 0 / 200000 is the placeholder for "any"
    return base === 'Enum' ? `E<${id}>` : `L<E<${id}>>`;
  }
  return base ?? `type#${code}`;
}

// Generic pins have no concrete type; their role says which type parameter they are tied to.
const genericType = (roles, outgoing) => {
  if (roles.includes(ROLE_DICT)) return 'D<R<K>,R<V>>';
  if (roles.includes(11)) return 'L<R<K>>';
  if (roles.includes(12)) return 'L<R<V>>';
  return `R<${roleParam(roles, outgoing)}>`;
};

/** An explicit default is a whole TypedValue (widget, is-set, value in 102 int / 103 dropdown / 104 float / 106 enum / 107 vector). */
export function readDefault(tv, type) {
  const one = (n, read) => { const m = sub(tv, n); return m === null ? undefined : { v: read(m) }; };
  const hit = one(102, (m) => num(m, 1) ?? 0) ?? one(103, (m) => num(m, 1) ?? 0) ?? one(106, (m) => num(m, 1) ?? 0)
    ?? one(104, (m) => rounded(f32(m, 1) ?? 0))
    ?? one(107, (m) => { const vec = sub(m, 1) ?? []; return [1, 2, 3].map((n) => rounded(f32(vec, n) ?? 0)); });
  if (!hit) return undefined;
  return type === 'Bol' && typeof hit.v === 'number' ? hit.v !== 0 : hit.v;
}

// ----------------------------------------------------------------------------------------------------------------------------- pins
function readPin(d, kind, index, backend, maps) {
  const pin = { ...nm(num(d, 7), maps) };
  const loc = sub(d, 3);
  // client nodes number their pins in a second way (the slot, 0 when omitted); the list position is what the database is keyed by
  const slot = loc === null ? undefined : num(loc, 2) ?? 0;
  if (slot !== undefined && slot !== index) pin.slot = slot;
  if (kind !== 'in_param' && kind !== 'out_param') return { pin, roles: [], variantTypes: [] };
  const tb = sub(d, 4) ?? [];
  const roles = subs(d, 5).map((r) => num(r, 1)).filter((x) => x !== undefined);
  const widget = num(tb, 1), conn = num(tb, 3), cvt = num(tb, 4), family = num(sub(tb, 101) ?? [], 1);
  const variantTypes = subs(sub(tb, 103) ?? [], 1).map((e) => ({ sel: num(e, 8), conn: num(e, 3), cvt: num(e, 4), enumId: num(sub(e, 101) ?? [], 1) }));
  const generic = widget === WIDGET_GENERIC && conn === undefined && cvt === undefined;
  const plain = !roles.some((r) => ROLE_KEY.includes(r) || ROLE_VALUE.includes(r) || r === ROLE_DICT || r === ROLE_CONVERT);
  const families = new Set(variantTypes.map((e) => e.enumId));
  const oneFamily = variantTypes.length > 0 && families.size === 1 && [...families][0] !== undefined; // every allowed type is the same enum
  // a generic pin with no role whose every allowed type is a list is a list of the type parameter, not the parameter itself
  const listOfT = generic && plain && family === undefined && variantTypes.length > 0 && variantTypes.every((e) => typeStr(backend, e.cvt, e.conn, e.enumId).startsWith('L<'));
  if (generic) pin.type = family !== undefined ? `E<${family}>` : oneFamily ? `E<${[...families][0]}>` : listOfT ? 'L<R<T>>' : genericType(roles, kind === 'out_param');
  else pin.type = typeStr(backend, cvt, conn, family);
  if (roles.includes(ROLE_HIDDEN)) pin.hidden = true;
  const def = sub(tb, 2);
  if (def !== null) { const v = readDefault(def, pin.type); if (v !== undefined) pin.default = v; else pin.defaultUnreadable = true; }
  return { pin, roles, variantTypes, listOfT };
}

// -------------------------------------------------------------------------------------------------------------------------- variants
/**
 * `C<T:Int>` / `C<K:Int,V:Str>` for one concrete variant, or null when the files do not say. A binding ties a generic pin (kind and index) to a
 * type-selector index: the entry of that pin's variant list with that `.8` (or, when the list has no `.8`, at that position). Special cases:
 * a dictionary entry carries no types, its binding has the key and value codes (`100`); a dictionary pin yields both K and V from them; pins that
 * are lists of the parameter (key/value lists, list-of-T) give the element type. Bindings on hidden pins are ignored.
 */
export function constraintOf(bindings, pins, backend, why = []) {
  const table = backend === 1 ? SERVER_TYPES : CLIENT_TYPES;
  const parts = new Map();
  const fail = (reason) => { why.push(reason); return null; }; // `why` collects the reason, for the build's diagnostics
  const set = (param, type) => {
    if (parts.has(param) && parts.get(param) !== type) { why.push(`${param} is bound to both ${parts.get(param)} and ${type}`); return false; }
    parts.set(param, type); return true;
  };
  for (const b of bindings) {
    const loc = sub(b, 1) ?? [];
    const pin = pins[BINDING_KIND[num(loc, 1)]]?.[num(loc, 2) ?? 0];
    if (!pin) return fail(`binding names pin ${BINDING_KIND[num(loc, 1)] ?? `kind ${num(loc, 1)}`}:${num(loc, 2) ?? 0}, which does not exist`);
    if (pin.roles.includes(ROLE_HIDDEN)) continue; // hidden pins select a mode (the conversion kind, an operator), they are not type parameters
    const dict = sub(b, 100);
    const pair = dict ? [table[num(dict, 1)], table[num(dict, 2)]] : null;
    if (pair && (!pair[0] || !pair[1])) return fail(`dictionary type codes ${num(dict, 1)},${num(dict, 2)} are unknown`);
    if (pin.roles.includes(ROLE_DICT)) {
      if (pair && !(set('K', pair[0]) && set('V', pair[1]))) return null;
      continue;
    }
    const param = roleParam(pin.roles, num(loc, 1) === 4);
    let t;
    if (pair) t = `D<${pair[0]},${pair[1]}>`;
    else {
      const withSel = pin.variantTypes.some((e) => e.sel !== undefined);
      const e = withSel ? pin.variantTypes.find((x) => (x.sel ?? 0) === (num(b, 2) ?? 0)) : pin.variantTypes[num(b, 2) ?? 0];
      if (!e) {
        return fail(`no variant entry ${num(b, 2) ?? 0} on ${BINDING_KIND[num(loc, 1)]}:${num(loc, 2) ?? 0} (its list has ${pin.variantTypes.length})`);
      }
      t = typeStr(backend, e.cvt, e.conn, e.enumId);
      if ((pin.listOfT || pin.roles.some((r) => ROLE_LIST.includes(r))) && t.startsWith('L<')) t = t.slice(2, -1);
    }
    if (!set(param, t)) return null;
  }
  if (!parts.size) return fail('no binding gives a type');
  return `C<${['T', 'K', 'V'].filter((p) => parts.has(p)).map((p) => `${p}:${parts.get(p)}`).join(',')}>`;
}

// ------------------------------------------------------------------------------------------------------------------------------ nodes
export function readNode(fields, maps, label = 'node') {
  const blocks = subs(fields, 4);
  const ids = blocks.map((b) => num(sub(b, 1) ?? [], 5));
  const id = ids[0];
  if (id === undefined) throw new Error(`${label}: no generic id`);
  if (ids.some((x) => x !== id)) throw new Error(`${label}: id blocks disagree (${ids.join(', ')})`);
  const services = blocks.map((b) => num(sub(b, 1) ?? [], 2));
  const backend = SERVER_SERVICES.includes(services[0]) ? 1 : 2;
  const kernelBlock = sub(blocks[0], 2); // an omitted id is 0 (the client node 200000 has kernel id 0)
  const kernel = kernelBlock === null ? undefined : num(kernelBlock, 5) ?? 0;

  const pins = {}, lists = { in_param: [], out_param: [] };
  for (const g of PIN_GROUPS) {
    subs(fields, g.field).forEach((d, i) => {
      const { pin, roles, variantTypes, listOfT } = readPin(d, g.kind, i, backend, maps);
      pins[`${g.kind}:${i}`] = pin;
      if (lists[g.kind]) lists[g.kind].push({ roles, variantTypes, listOfT });
    });
  }

  const variants = [], noConstraintWhy = [], sharedIds = [];
  for (const [bi, b] of blocks.entries()) {
    const bBackend = SERVER_SERVICES.includes(services[bi]) ? 1 : 2;
    for (const v of subs(b, 3)) {
      const idBlock = sub(v, 1);
      if (idBlock === null) continue; // a combination the game does not offer
      const concrete = num(idBlock, 5) ?? 0;
      const same = variants.find((x) => x.kernel === concrete);
      if (same) {
        // several type combinations behind one concrete id (the client dictionary nodes): the id cannot tell them apart, so no constraint
        if (!same.shared && (same.c ?? null) !== (constraintOf(subs(v, 2), lists, bBackend) ?? null)) { same.shared = true; delete same.c; sharedIds.push(concrete); }
        continue;
      }
      const why = [];
      const c = constraintOf(subs(v, 2), lists, bBackend, why);
      if (!c) noConstraintWhy.push(why[0] ?? 'unknown');
      variants.push({ ...(c ? { c } : {}), kernel: concrete });
    }
  }
  const generic = Object.values(pins).some((p) => p.type && /^(R|L<R|D<R)/.test(p.type));
  const node = {
    id, ...nm(num(fields, 206), maps), sys: backend === 1 ? 'Server' : 'Client', dom: DOMAINS[num(fields, 203)],
    variant: variants.length > 0 || generic || undefined, services: services.every((s) => s === services[0]) && services.length === 1 ? undefined : services,
    kernel: kernel !== undefined && kernel !== id ? kernel : undefined, variants: variants.length ? variants : undefined, pins,
  };
  for (const v of variants) delete v.shared;
  if (noConstraintWhy.length) Object.defineProperty(node, 'noConstraintWhy', { value: noConstraintWhy, enumerable: false }); // diagnostics only, never serialized
  if (sharedIds.length) Object.defineProperty(node, 'sharedIds', { value: sharedIds, enumerable: false });
  return node;
}

// ------------------------------------------------------------------------------------------------------------------------------ locating
// The editor's resource folder inside an install, from the folder that holds `Program Files`: the steps are tried in turn and a missing one is skipped.
const INSTALL_PATH = 'Program Files/Genshin Impact/Genshin Impact game/BeyondAssets/BeyondAssistEditor/Resource/Json/Beyond/Node'.split('/');
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

/**
 * The `Beyond/Node` folder of an install, found loosely from any folder on the way: descend by INSTALL_PATH (skipping the steps that do not
 * exist) and accept the result when its siblings `../BeyondGlobal` and `../../TextMap` exist; otherwise go one folder up and try again.
 * Returns null when the drive root or "Temp" folder is reached without a match.
 */
export function findNodeDir(start) {
  let base = path.resolve(start);
  for (;;) {
    let cur = base;
    for (const step of INSTALL_PATH) { const next = path.join(cur, step); if (isDir(next)) cur = next; }
    if (isDir(path.join(cur, '..', 'BeyondGlobal')) && isDir(path.join(cur, '..', '..', 'TextMap'))) return cur;
    const parent = path.dirname(base);
    if (parent === base) return null;
    if (path.basename(base) === 'Temp') return null;
    base = parent;
  }
}

/** `game_version` from section [General] of the install's config.ini (six folders above the Node folder); null when it is not there. */
export function readGameVersion(nodeDir) {
  let text;
  try { text = fs.readFileSync(path.resolve(nodeDir, '..', '..', '..', '..', '..', '..', 'config.ini'), 'utf8'); } catch { return null; }
  let section = '';
  for (const raw of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = raw.trim();
    const head = /^\[(.*)\]$/.exec(line);
    if (head) { section = head[1].trim().toLowerCase(); continue; }
    const kv = /^([^=;#]+?)\s*=\s*(.*)$/.exec(line);
    if (section === 'general' && kv && kv[1].toLowerCase() === 'game_version' && kv[2]) return kv[2];
  }
  return null;
}

// ------------------------------------------------------------------------------------------------------------------------------ build
function uniqueBin(dir, label) {
  if (!fs.existsSync(dir)) throw new Error(`${label} directory not found: ${dir}`);
  const files = fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith('.mihoyobin')).sort();
  if (files.length !== 1) throw new Error(`expected exactly one ${label} .mihoyobin in ${dir}, found ${files.length}`);
  return path.join(dir, files[0]);
}

/** Every language folder of a TextMap directory that holds a text file: [{ lang, file }] by language code (the folder name, upper case). */
export function textMapFiles(dir) {
  if (!fs.existsSync(dir)) throw new Error(`TextMap directory not found: ${dir}`);
  const out = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const sub = path.join(dir, d.name);
    if (fs.readdirSync(sub).some((n) => n.toLowerCase().endsWith('.mihoyobin'))) out.push({ lang: d.name.toUpperCase(), file: uniqueBin(sub, `${d.name} TextMap`) });
  }
  if (!out.length) throw new Error(`no language folder with a .mihoyobin file in ${dir}`);
  return out;
}

export function buildDb(nodeDir, { gameVersion = null } = {}) {
  if (!fs.existsSync(nodeDir)) throw new Error(`Node directory not found: ${nodeDir}`);
  const jsonRoot = path.resolve(nodeDir, '..', '..');
  const globP = uniqueBin(path.join(nodeDir, '..', 'BeyondGlobal'), 'BeyondGlobal');
  const maps = {}, mapHashes = {};
  for (const { lang, file } of textMapFiles(path.join(jsonRoot, 'TextMap'))) { const r = readTextMap(file); maps[lang] = r.texts; mapHashes[lang] = r.sha256; }

  const files = fs.readdirSync(nodeDir).filter((n) => n.toLowerCase().endsWith('.mihoyobin')).sort();
  const nodes = {}, kernels = {}, hashes = [], notes = { collisions: [], noConstraint: [], noConstraintWhy: {}, sharedKernel: [], unreadableDefaults: [], slotDiffers: [], twoServices: [] };
  for (const file of files) {
    const { bytes, fields } = readBin(path.join(nodeDir, file));
    hashes.push(`${file}:${sha256(bytes)}`);
    const node = readNode(fields, maps, file);
    if (nodes[node.id]) throw new Error(`duplicate node id ${node.id} (${file})`);
    nodes[node.id] = node;
    if (node.services) notes.twoServices.push(node.id);
    if (node.sharedIds) notes.sharedKernel.push(node.id);
    if ((node.variants || []).some((v) => !v.c) && !node.sharedIds) {
      notes.noConstraint.push(node.id);
      for (const w of new Set(node.noConstraintWhy)) { const k = w.replace(/\d+/g, '#'); (notes.noConstraintWhy[k] ??= []).push(node.id); }
    }
    for (const [k, p] of Object.entries(node.pins)) {
      if (p.defaultUnreadable) { notes.unreadableDefaults.push(`${node.id} ${k}`); }
      if (p.slot !== undefined && !notes.slotDiffers.includes(node.id)) notes.slotDiffers.push(node.id);
    }
    for (const v of node.variants || []) {
      if (kernels[v.kernel]) { notes.collisions.push(v.kernel); continue; }
      kernels[v.kernel] = { node: node.id, ...(v.c ? { constraint: v.c } : {}) };
    }
    if (node.kernel !== undefined && !kernels[node.kernel]) kernels[node.kernel] = { node: node.id };
  }
  for (const n of Object.values(nodes)) for (const p of Object.values(n.pins)) delete p.defaultUnreadable;

  const g = readBin(globP);
  const enums = {};
  for (const rec of subs(sub(g.fields, 1) ?? [], 1)) {
    const id = num(rec, 1);
    if (id === undefined) throw new Error('BeyondGlobal enum record has no id');
    if (enums[id]) throw new Error(`duplicate BeyondGlobal enum id ${id}`);
    enums[id] = { ...nm(num(rec, 4), maps), values: Object.fromEntries(subs(rec, 2).map((v) => [num(v, 1) ?? 0, nm(num(v, 3), maps)])) };
  }

  const missingEnums = new Set();
  for (const n of Object.values(nodes)) for (const p of Object.values(n.pins)) for (const m of String(p.type ?? '').matchAll(/E<(\d+)>/g)) if (!enums[m[1]]) missingEnums.add(Number(m[1]));
  notes.unknownEnums = [...missingEnums].sort((a, b) => a - b);

  const doc = {
    formatVersion: 2,
    languages: Object.keys(maps),
    counts: { nodes: Object.keys(nodes).length, enums: Object.keys(enums).length, kernels: Object.keys(kernels).length },
    sources: [{
      kind: 'game', ...(gameVersion ? { gameVersion } : {}), nodeFiles: files.length, nodeAggregateSha256: sha256(hashes.join('\n')),
      textMapSha256: mapHashes, beyondGlobalSha256: sha256(g.bytes),
    }],
    nodes, enums, kernels,
  };
  return { doc, notes };
}

// -------------------------------------------------------------------------------------------------------------------------- compare
const normType = (t) => (t === undefined ? '' : String(t).replace(/E<[^>]*>/g, 'E').replace(/^D<(?!R<).*>$/, 'Dict').replace(/^Vss$/, 'Snapshot'));
const normConstraint = (c) => (c === undefined || c === null ? '' : String(c).replace(/E<[^>]*>/g, 'E'));

/** The languages a database has names in: its `languages` list, or the codes found in its names. */
function languagesOf(db) {
  if (db.languages) return db.languages;
  const found = new Set();
  const take = (o) => { for (const l of Object.keys(o?.names ?? {})) found.add(l); };
  for (const n of Object.values(db.nodes ?? {})) { take(n); for (const p of Object.values(n.pins ?? {})) take(p); }
  for (const e of Object.values(db.enums ?? {})) { take(e); for (const v of Object.values(e.values ?? {})) take(v); }
  return [...found].sort();
}

/** Lines describing how `built` differs from `ref` (an earlier database). Type and constraint comparisons ignore the enum code. */
export function compareDb(built, ref, { limit = 5 } = {}) {
  const lines = [];
  const section = (title) => lines.push('', `== ${title}`);
  const tally = (label, total, bad) => lines.push(`${bad.length ? 'DIFF' : 'ok  '}  ${label}: ${total - bad.length}/${total} agree${bad.length ? `; e.g. ${bad.slice(0, limit).join(' | ')}` : ''}`);
  const bn = built.nodes, rn = ref.nodes;
  const bl = languagesOf(built), rl = languagesOf(ref), common = bl.filter((l) => rl.includes(l));
  const shared = Object.keys(bn).filter((id) => rn[id]).map(Number);
  const nameTally = (label, items) => { // items: [{ at, b, r }] (the two entries); every common language is compared
    const bad = []; let total = 0;
    for (const { at, b, r } of items) for (const l of common) {
      total++;
      const was = r?.names?.[l] ?? '', now = b?.names?.[l] ?? '';
      if (was !== now) bad.push(`${at} ${l}: ${JSON.stringify(was)} -> ${JSON.stringify(now)}`);
    }
    tally(label, total, bad);
  };

  section('languages');
  lines.push(`built ${bl.join(', ') || '-'}; reference ${rl.join(', ') || '-'}; compared ${common.join(', ') || '-'}`);

  section('nodes');
  const onlyBuilt = Object.keys(bn).filter((id) => !rn[id]).map(Number), onlyRef = Object.keys(rn).filter((id) => !bn[id]).map(Number);
  lines.push(`built ${Object.keys(bn).length}, reference ${Object.keys(rn).length}, shared ${shared.length}`);
  lines.push(`only in built: ${onlyBuilt.length}${onlyBuilt.length ? ` (e.g. ${onlyBuilt.slice(0, limit).join(', ')})` : ''}; only in reference: ${onlyRef.length}${onlyRef.length ? ` (e.g. ${onlyRef.slice(0, limit).join(', ')})` : ''}`);
  nameTally('node names', shared.map((id) => ({ at: String(id), b: bn[id], r: rn[id] })));
  const eq = (label, get, norm = (x) => x ?? '') => {
    const bad = shared.filter((id) => norm(get(bn[id])) !== norm(get(rn[id]))).map((id) => `${id}: ${JSON.stringify(norm(get(rn[id])))} -> ${JSON.stringify(norm(get(bn[id])))}`);
    tally(label, shared.length, bad);
  };
  eq('system', (n) => n.sys);
  eq('domain', (n) => n.dom);
  eq('variant flag', (n) => !!n.variant);

  section('pins');
  const keyBad = [], typeBad = [], pairs = [];
  let pinTotal = 0, typePairs = 0;
  for (const id of shared) {
    const bp = bn[id].pins, rp = rn[id].pins;
    for (const k of new Set([...Object.keys(bp), ...Object.keys(rp)])) {
      if (!bp[k] || !rp[k]) { keyBad.push(`${id} ${k} (${bp[k] ? 'built only' : 'reference only'})`); continue; }
      pinTotal++;
      pairs.push({ at: `${id} ${k}`, b: bp[k], r: rp[k] });
      if (rp[k].type !== undefined || bp[k].type !== undefined) { typePairs++; if (normType(bp[k].type) !== normType(rp[k].type)) typeBad.push(`${id} ${k}: ${rp[k].type} -> ${bp[k].type}`); }
    }
  }
  tally('pin keys present in both', pinTotal + keyBad.length, keyBad);
  nameTally('pin names', pairs);
  tally('pin types', typePairs, typeBad);

  section('variants and kernels');
  const setBad = [], conBad = []; let conTotal = 0;
  for (const id of shared) {
    const bv = new Map((bn[id].variants || []).map((v) => [v.kernel, v.c])), rv = new Map((rn[id].variants || []).map((v) => [v.kernel, v.c]));
    const missing = [...rv.keys()].filter((k) => !bv.has(k)), extra = [...bv.keys()].filter((k) => !rv.has(k));
    if (missing.length || extra.length) setBad.push(`${id}: -${missing.length} +${extra.length}`);
    for (const [k, c] of rv) if (bv.has(k)) { conTotal++; if (normConstraint(bv.get(k)) !== normConstraint(c)) conBad.push(`${id}/${k}: ${c} -> ${bv.get(k) ?? 'none'}`); }
  }
  tally('variant kernel-id sets', shared.length, setBad);
  tally('variant constraints (enum codes ignored)', conTotal, conBad);
  const bk = Object.keys(built.kernels), rk = Object.keys(ref.kernels);
  lines.push(`kernels: built ${bk.length}, reference ${rk.length}; only in built ${bk.filter((k) => !ref.kernels[k]).length}, only in reference ${rk.filter((k) => !built.kernels[k]).length}`);

  section('enums');
  const be = built.enums, re = ref.enums;
  const eShared = Object.keys(be).filter((id) => re[id]);
  lines.push(`built ${Object.keys(be).length}, reference ${Object.keys(re).length}; only in built ${Object.keys(be).filter((id) => !re[id]).length}, only in reference ${Object.keys(re).filter((id) => !be[id]).length}`);
  const vBad = [], valuePairs = [];
  for (const id of eShared) {
    const bvk = Object.keys(be[id].values || {}), rvk = Object.keys(re[id].values || {});
    const missing = rvk.filter((k) => !(k in be[id].values)), extra = bvk.filter((k) => !(k in (re[id].values || {})));
    if (missing.length || extra.length) vBad.push(`${id}: -${missing.length} +${extra.length}`);
    for (const k of rvk) if (k in be[id].values) valuePairs.push({ at: `${id}/${k}`, b: be[id].values[k], r: re[id].values[k] });
  }
  tally('enum value sets', eShared.length, vBad);
  nameTally('enum names', eShared.map((id) => ({ at: id, b: be[id], r: re[id] })));
  nameTally('enum value names', valuePairs);
  return lines;
}

// ----------------------------------------------------------------------------------------------------------------------------- CLI
const USAGE = `usage: npm run build-db [-- options]      (node scripts/build-db.mjs [options])

Builds the node database from the editor resources of a local game install and compares it with the previous one.

  --genshin <folder>  where to look for the game; any folder from the drive root down to the install works
                      (default: %PROGRAMFILES%, e.g. "C:\\Program Files"; give "D:\\Games" for an install elsewhere)
  --version <V>       game version to record (default: game_version of the install's config.ini)
  --compare <file>    database to compare the result with, always printed (default: data/nodes.json)
  --out <file>        where to write the result, always (default: data/nodes.json)
  --limit <N>         examples per difference in the comparison (default 5)
  --help              this text

The old database is read before the new one is written. Run "npm run build-web" afterwards.
`;

export function run(argv, write = (s) => process.stdout.write(s), warn = (s) => process.stderr.write(s), env = process.env) {
  let a;
  try {
    a = parseArgs(argv, { values: ['genshin', 'version', 'compare', 'out', 'limit'] });
    if (!a.help && a.opts.limit !== undefined) toInt('limit', a.opts.limit, 1);
  } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    warn(`error: ${e.message}\n\n${USAGE}`);
    return 2;
  }
  if (a.help) { write(USAGE); return 0; }
  const { opts } = a;
  const start = opts.genshin ?? env.PROGRAMFILES;
  if (!start) { warn('error: no folder to search: pass --genshin <folder> (the default, %PROGRAMFILES%, is not set)\n'); return 2; }
  const out = opts.out ?? DEFAULT_DB, compare = opts.compare ?? DEFAULT_DB, limit = Number(opts.limit ?? 5);
  try {
    const nodeDir = findNodeDir(start);
    if (!nodeDir) throw new Error(`no game resources found from ${start} (looked for Resource/Json/Beyond/Node with BeyondGlobal and TextMap beside it); pass --genshin <folder>`);
    write(`resources: ${nodeDir}\n`);
    let gameVersion = opts.version ?? readGameVersion(nodeDir);
    if (!gameVersion) warn('warning: game version unknown (no config.ini with game_version found; use --version)\n');
    write(`game version: ${gameVersion ?? 'unknown'}\n`);

    const { doc, notes } = buildDb(nodeDir, { gameVersion });
    let ref = null;
    if (fs.existsSync(compare)) {
      try { ref = JSON.parse(fs.readFileSync(compare, 'utf8').replace(/^\uFEFF/, '')); } catch (e) { warn(`warning: cannot read ${compare} (${e.message}): no comparison\n`); }
    } else write(`no database at ${compare}: nothing to compare with\n`);
    const comparison = ref ? compareDb(doc, ref, { limit }) : [];

    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(doc));
    write(`wrote ${out}: ${doc.counts.nodes} nodes, ${doc.counts.enums} enum families, ${doc.counts.kernels} kernels, ${doc.languages.length} languages (${doc.languages.join(', ')})\n`);
    const note = (label, list) => list.length && write(`note: ${label}: ${list.length} (e.g. ${list.slice(0, 6).join(', ')})\n`);
    note('nodes with a variant that has no derivable constraint', notes.noConstraint);
    for (const [reason, ids] of Object.entries(notes.noConstraintWhy).sort((x, y) => y[1].length - x[1].length)) write(`        ${ids.length} node(s): ${reason} (e.g. ${ids.slice(0, 8).join(', ')})\n`);
    note('explicit defaults in a layout this script cannot read', notes.unreadableDefaults);
    note('nodes whose variants share one concrete id between several type combinations (no constraint written)', notes.sharedKernel);
    note('nodes listed under several services', notes.twoServices);
    note('kernel ids already taken by another node (first one kept)', notes.collisions);
    note('pin types naming an enum family that BeyondGlobal does not define', notes.unknownEnums);
    if (comparison.length) write(`\ncomparison with ${compare}:${comparison.join('\n')}\n`.replace(':\n\n', ':\n'));
    return 0;
  } catch (e) {
    warn(`error: ${e.message}\n`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = run(process.argv.slice(2));
