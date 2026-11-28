// L3b: bind a parsed Bundle to the node DB and to the user-defined definitions (composites, signals, structs) that
// travel inside the same file (.gia, or .gil once src/gil.mjs re-wraps it into GIA-shaped resources).
import { pinKindName } from './model.mjs';

const KIND_SYSCALL = 22000, KIND_STUB = 22001;
export const MULTI_BRANCH = 3; // shell node id of "Multiple Branches": in.flow#0, in#0 = Control Expression, in#1 = valid_pin_list, out.flow#0 = Default, out.flow#k = branch k
// Assembly List / Assembly Dictionary (every variant): the editor stores 100 slots (in#1..in#100) whatever the node holds, and the hidden
// in#0 "Count" says how many of them the person added with the "+" button (a dictionary counts its keys and values, one each); it is stored only when it differs from the default the database holds.
const ASSEMBLY_NODES = new Set([169, 200049, 200191, 1788, 200152, 200228]);
const VALID_PIN_LIST = { kind: 3, index: 1 };
const isValidPinList = (p) => p.kind === VALID_PIN_LIST.kind && p.index === VALID_PIN_LIST.index;

/** Label of one valid_pin_list entry: the string / number itself (null when it is neither). */
function branchLabel(item) {
  const v = item?.k === 'poly' ? item.inner : item;
  return v?.k === 'str' ? v.v : v?.k === 'int' ? String(v.v) : null;
}

export class Resolver {
  constructor(bundle, db) {
    this.bundle = bundle; this.db = db;
    this.ifaceByGuid = new Map(); this.ifaceByBody = new Map(); this.structByGuid = new Map(); this.graphByGuid = new Map();
    this.unresolved = new Map(); // key -> {label, count, where[]}
    for (const r of bundle.resources) {
      if (r.kind === 'interface' && r.iface) {
        this.ifaceByGuid.set(r.guid ?? r.iface.id?.shell?.id, r);
        if (r.iface.id?.graph?.id != null) this.ifaceByBody.set(r.iface.id.graph.id, r); // the body's GUID can differ from its declaration's
      }
      if (r.kind === 'struct' && r.struct) this.structByGuid.set(r.guid ?? r.struct.id, r);
      if (r.kind === 'graph' && r.graph && r.graph.kind !== 21002) this.graphByGuid.set(r.guid, r); // GUIDs are unique per kind only
    }
    // structs are looked up by struct id (== guid); also index by struct.id
    for (const r of bundle.resources) if (r.kind === 'struct' && r.struct?.id != null) this.structByGuid.set(r.struct.id, r);
  }
  noteUnresolved(label, where) {
    const e = this.unresolved.get(label) || { label, count: 0, where: [] };
    e.count++; if (e.where.length < 5) e.where.push(where); this.unresolved.set(label, e);
  }
  /** Declaration of a composite body graph (locator kind 21002), or null. Linked through the declaration's graph_ref; an export without a usable graph_ref uses the same GUID for both. */
  declForBody(res) {
    if (res.graph?.kind !== 21002) return null;
    return this.ifaceByBody.get(res.guid) ?? this.ifaceByGuid.get(res.guid) ?? null;
  }
  structName(id) { const s = this.structByGuid.get(id); return s ? s.struct.name : null; }

  /** Resolve a node instance. Never throws. */
  node(graph, node, where = '') {
    const sh = node.shell, kn = node.kernel;
    const info = { shellId: sh?.id ?? null, kernelId: kn?.id ?? sh?.id ?? null, user: null, name: null, unresolved: false, variant: null, sys: null, extra: {} };
    if (!sh) { info.name = '<node#?>'; info.unresolved = true; return info; }
    info.sys = [20000, 20003, 20004, 20005].includes(sh.service) ? 'server' : 'client';
    if (sh.kind === KIND_STUB || (sh.kind !== KIND_SYSCALL && this.ifaceByGuid.has(sh.id))) {
      const r = this.ifaceByGuid.get(sh.id);
      if (r) {
        const f = r.iface; info.user = { res: r, iface: f }; info.name = f.name || r.name || `<user-node#${sh.id}>`;
        if (f.sendSignal) info.extra.signal = f.sendSignal.name;
        if (f.listenSignal) info.extra.signal = f.listenSignal.name;
        if (f.assembleStruct != null) info.extra.struct = this.structName(f.assembleStruct) ?? `<struct#${f.assembleStruct}>`;
        if (f.splitStruct != null) info.extra.struct = this.structName(f.splitStruct) ?? `<struct#${f.splitStruct}>`;
        if (f.modifyStruct != null) info.extra.struct = this.structName(f.modifyStruct) ?? `<struct#${f.modifyStruct}>`;
        info.extra.userKind = f.categoryName;
        return info;
      }
      info.name = `<user-node#${sh.id}>`; info.unresolved = true; this.noteUnresolved(`user-node#${sh.id} (definition not in this file)`, where); return info;
    }
    const nm = this.db.nodeName(sh.id);
    if (nm) info.name = nm; else { info.name = `<node#${sh.id}>`; info.unresolved = true; this.noteUnresolved(`node#${sh.id}`, where); }
    // Variant label: only trust a kernel id that belongs to THIS node's own variant table
    // (kernel ids are not unique across server/client, so a global kernel->constraint table is unsafe).
    if (kn && kn.id !== sh.id) {
      const v = this.db.node(sh.id)?.variants?.find((x) => x.kernel === kn.id);
      if (v) info.variant = v.c;
    }
    if (sh.id === MULTI_BRANCH) {
      // Its branches are named "1", "2", ... by the game; the values they compare with live in the static
      // valid_pin_list input. Expose them as info.branchValues so every printer names branch k after list[k-1], and
      // so the list pin itself can be hidden (a wired, i.e. dynamic, list has no static values: nothing changes then).
      const listPin = node.pins.find(isValidPinList);
      const v = listPin?.value?.k === 'poly' ? listPin.value.inner : listPin?.value;
      if (listPin && !listPin.conns.length && v?.k === 'list') info.branchValues = v.items.map(branchLabel);
    }
    return info;
  }

  /**
   * How many slots an Assembly List / Dictionary holds: the stored Count, else the database's default (the editor stores Count only when it differs from the default),
   * and never fewer than the highest slot that is wired.
   */
  assemblyCount(node, info) {
    const c = node.pins.find((q) => q.kind === 3 && q.index === 0)?.value;
    const v = c?.k === 'poly' ? c.inner : c;
    let n = v?.k === 'int' ? v.v : this.db.pinDef(info.shellId, 'in_param', 0)?.default ?? 0;
    for (const q of node.pins) if (q.kind === 3 && q.index > n && q.conns.length) n = q.index;
    return n;
  }

  /** True for a slot of an Assembly List / Dictionary beyond its count: a placeholder the editor stores (or a slot the node does not have), not something the person added. */
  isPlaceholderPin(node, info, pin) {
    if (!ASSEMBLY_NODES.has(info?.shellId) || pin.kind !== 3 || pin.index < 1) return false;
    return pin.index > this.assemblyCount(node, info);
  }

  /** True for the pin that carries a Multiple Branches node's (static) case list, which is redundant once the branches are named after it. */
  isHiddenPin(info, pin) { return !!info.branchValues && isValidPinList(pin); }

  /** Name for a pin instance on a resolved node. Returns {name, known}. */
  pinName(info, pin) {
    const kn = pinKindName(pin.kind);
    if (info.user) {
      const f = info.user.iface;
      const list = pin.kind === 1 ? f.inflows : pin.kind === 2 ? f.outflows : pin.kind === 3 ? f.inputs : pin.kind === 4 ? f.outputs : f.metaPins;
      let m = list.find((p) => p.kind === pin.kind && p.index === pin.index) || (pin.uid != null ? list.find((p) => p.uid === pin.uid) : null);
      if (!m && (pin.kind === 5 || pin.kind === 6)) m = f.metaPins.find((p) => p.metaSig && p.metaSig.kind === pin.kind && p.metaSig.index === pin.index);
      return m && m.name ? { name: m.name, known: true } : { name: null, known: false };
    }
    if (info.shellId == null) return { name: null, known: false };
    if (info.branchValues && pin.kind === 2 && pin.index >= 1 && info.branchValues[pin.index - 1] !== undefined) {
      const v = info.branchValues[pin.index - 1];
      return { name: v === null ? `<${pin.index}>` : v === '' ? '(empty)' : v, known: true };
    }
    const nm = this.db.pinName(info.shellId, kn, pin.index);
    return { name: nm, known: !!nm };
  }
}
