// L3a: node database (data/nodes.json, built by scripts/build-db.mjs) + overlay (data/overlay.json: hand-written
// additions that win over the built database). Every lookup can miss; callers must degrade gracefully
// (see TECHNICAL.md, "Behaviour on newer game versions").
import { host } from './host.mjs';

// A bundled data file, or (when the caller names a path, e.g. --db) a file read through the host's file system.
function readJsonIf(rel, isUserPath) {
  let text;
  try { text = isUserPath ? host.readText(rel) : host.data(rel); } catch (e) { throw new Error(`cannot read ${rel}: ${e.message}`); }
  return text == null ? null : JSON.parse(text);
}

/** Language code of a name table: the game's folder names (CHS, CHT, DE, EN, ...), case-insensitive; ZH is CHS. */
export function normLang(s) {
  const u = String(s ?? 'EN').toUpperCase();
  return u === 'ZH' ? 'CHS' : u;
}

export class NodeDb {
  constructor({ dbPath = null, overlayPath = null, lang = 'EN' } = {}) {
    this.lang = normLang(lang);
    const db = (dbPath ? readJsonIf(dbPath, true) : readJsonIf('data/nodes.json')) || { nodes: {}, enums: {}, kernels: {}, sources: [] };
    this.sources = db.sources || [];
    this.languages = db.languages || [];
    this.nodes = db.nodes; this.enums = db.enums || {}; this.kernels = db.kernels || {};
    const ov = overlayPath ? readJsonIf(overlayPath, true) : readJsonIf('data/overlay.json');
    this.overlayApplied = 0;
    if (ov) {
      for (const [id, n] of Object.entries(ov.nodes || {})) {
        const cur = this.nodes[id] = this.nodes[id] || { id: Number(id), pins: {} };
        Object.assign(cur, { ...n, names: { ...cur.names, ...n.names }, pins: { ...cur.pins, ...(n.pins || {}) } }); this.overlayApplied++;
      }
      for (const [fam, e] of Object.entries(ov.enums || {})) { this.enums[fam] = { ...(this.enums[fam] || {}), ...e, names: { ...this.enums[fam]?.names, ...e.names }, values: { ...(this.enums[fam]?.values || {}), ...(e.values || {}) } }; }
      for (const [k, v] of Object.entries(ov.kernels || {})) this.kernels[k] = v;
    }
    this._enumIndex = null;
  }
  /** The name in the chosen language, else English, else Chinese. */
  pick(o) { const n = o?.names; return n ? n[this.lang] || n.EN || n.CHS : undefined; }
  node(id) { return this.nodes[id] || null; }
  nodeName(id) { const n = this.node(id); return n ? (this.pick(n) || null) : null; }
  pinDef(id, kindName, index) { return this.node(id)?.pins?.[`${kindName}:${index}`] || null; }
  pinName(id, kindName, index) { const p = this.pinDef(id, kindName, index); return p ? (this.pick(p) || null) : null; }
  kernelConstraint(kernelId) { return this.kernels[kernelId]?.constraint || null; }
  /** value -> [{family, name}] across all enum families */
  enumCandidates(v) {
    if (!this._enumIndex) {
      this._enumIndex = new Map();
      for (const [fam, e] of Object.entries(this.enums)) for (const [val, o] of Object.entries(e.values || {})) {
        const k = Number(val); if (!this._enumIndex.has(k)) this._enumIndex.set(k, []);
        this._enumIndex.get(k).push({ family: Number(fam), familyName: this.pick(e), name: this.pick(o) });
      }
    }
    return this._enumIndex.get(v) || [];
  }
  /** Game version the database was built from (`sources[].gameVersion`); null when it records none, as the bundled nodes.json does. */
  get version() { return this.sources.map((s) => s.gameVersion).filter(Boolean)[0] || null; }
}
