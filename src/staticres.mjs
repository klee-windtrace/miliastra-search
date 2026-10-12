// L4a: tiny static analyzer for node-graph code, used by refs.mjs. Deliberately not a general interpreter:
// it only answers two questions.
//
//  1. resolvePin():  "what string does this input pin hold?" – following wires through proxy nodes that merely
//     hold a name (Get Local Variable, Get Node Graph Variable, composites), so a wired name is
//     still reported as a *static* reference instead of `dynamic`.
//  2. analyzeListener(): "which names does this When-…-Changes/Triggered event really handle?" – walks the
//     execution chain after the event while it is a pure compare-and-branch name switch (Multiple Branches /
//     Double Branch+Equal) and reports the handled names; anything else in the chain is a catch-all path.
//
// Everything here is by shell node id (see data/nodes.json); pin indices are the *shell* indices.

import { S, T } from './doc.mjs';

const BODY_KIND = 21002; // composite body graph (see refs.mjs COMPOSITE_BODY_KIND)
const N = { DOUBLE_BRANCH: 2, MULTI_BRANCH: 3, EQUAL: 14, GET_LOCAL: 18, GET_GRAPH_VAR: 337 };
const MAX_DEPTH = 64; // wires cannot loop in a valid graph, but a file may be malformed: bound the recursion

const plain = (v) => (v && v.k === 'poly' ? v.inner : v);
const dyn = (reason, via = []) => ({ kind: 'dynamic', reason, via });

/**
 * Result of resolving a pin:
 *   { kind: 'value',   v: string, via: string[] }   statically known string (via = the proxy nodes crossed, consumer -> producer)
 *   { kind: 'unset',   reason?, via }               ends in an empty / never-set value
 *   { kind: 'symbol',  id, via }                    the caller-supplied symbol (listener analysis: "the event's name pin")
 *   { kind: 'dynamic', reason, via }                computed at runtime, or not something we understand
 */
export class StaticResolver {
  /** @param bundle parsed Bundle  @param R its Resolver  @param graphs the bundle's graph resources */
  constructor(bundle, R, graphs) {
    this.R = R;
    this.graphs = graphs;
    this._nodes = new Map(); // graph res -> Map(index -> { n, info })
    // composite declaration guid -> body graph resource (same lookup refs.mjs uses for its call graph)
    this.bodyByDecl = new Map();
    for (const gr of graphs) if (gr.graph.kind === BODY_KIND) { const d = R.declForBody(gr); if (d) this.bodyByDecl.set(d.guid, gr); }
  }

  _node(gr, idx) {
    let m = this._nodes.get(gr);
    if (!m) { m = new Map(gr.graph.nodes.map((n) => [n.index, { n, info: this.R.node(gr.graph, n) }])); this._nodes.set(gr, m); }
    return m.get(idx) || null;
  }
  _outName(info, idx) { return this.R.pinName(info, { kind: 4, index: idx, uid: null }).name; }
  _declName(bodyGr, kind, idx) {
    const f = this.R.declForBody(bodyGr)?.iface;
    return (kind === 3 ? f?.inputs : f?.outputs)?.find((p) => p.index === idx)?.name || null;
  }
  _lbl(gr, idx, info, extra = '') { return T`${S('nodeIndex', `[${idx}]`)} ${S('nodeName', info.name)}${extra}`; }

  /**
   * Resolve input pin `pinIdx` of node `nodeIdx` of graph resource `gr`.
   * opts.symbol = { gr, nodeIdx, pinIdx, id }: an output pin that resolves to { kind:'symbol', id } (used for event name pins).
   * opts.frames = composite call stack [{ gr, nodeIdx }] (outermost first) when `gr` is a body we descended into;
   *   leave empty when starting at a physical node (then a composite *input port* is unresolvable: it depends on the caller).
   */
  resolvePin(gr, nodeIdx, pinIdx, opts = {}) { return this._in(gr, nodeIdx, pinIdx, opts.frames || [], opts.symbol || null, 0); }

  /**
   * Like resolvePin, for a Boolean input pin: 'true' | 'false' | 'dynamic' (wired, or no usable literal), or null when
   * the pin has no entry at all (the engine default applies). A pin exposed as a composite input port is read from
   * the call site found on `opts.frames`; without frames the answer is 'dynamic' (it differs per caller).
   */
  resolveBool(gr, nodeIdx, pinIdx, opts = {}) { return this._bool(gr, nodeIdx, pinIdx, opts.frames || [], 0); }

  // The mapping that exposes in-param pin `pinIdx` of node `nodeIdx` as an input port of the composite body `gr`, if any.
  _inPortMap(gr, nodeIdx, pinIdx) {
    if (gr.graph.kind !== BODY_KIND) return null;
    return gr.graph.portMappings.find((x) => x.ext.kind === 3 && x.node === nodeIdx && x.int.kind === 3 && x.int.index === pinIdx) || null;
  }

  _bool(gr, nodeIdx, pinIdx, frames, depth) {
    if (depth > MAX_DEPTH) return 'dynamic';
    const rec = this._node(gr, nodeIdx);
    if (!rec) return 'dynamic';
    const m = this._inPortMap(gr, nodeIdx, pinIdx);
    if (m) {
      if (!frames.length) return 'dynamic';
      const fr = frames[frames.length - 1];
      return this._bool(fr.gr, fr.nodeIdx, m.ext.index, frames.slice(0, -1), depth + 1);
    }
    const pin = rec.n.pins.find((p) => p.kind === 3 && p.index === pinIdx);
    if (!pin) return null;
    if (pin.conns.length) return 'dynamic';
    const v = plain(pin.value);
    if (v && v.k === 'enum' && (v.v === 0 || v.v === 1)) return v.v === 1 ? 'true' : 'false';
    return 'dynamic';
  }

  _in(gr, nodeIdx, pinIdx, frames, sym, depth) {
    if (depth > MAX_DEPTH) return dyn('wire chain too deep (cyclic?)');
    const rec = this._node(gr, nodeIdx);
    if (!rec) return dyn(`node [${nodeIdx}] not found`);
    // A pin exposed as a composite input port takes its value from the call site, wired or not.
    {
      const m = this._inPortMap(gr, nodeIdx, pinIdx);
      if (m) {
        const port = this._declName(gr, 3, m.ext.index);
        const step = T`composite input${port ? T` ${S('pinName', port)}` : ` #${m.ext.index}`}`;
        if (!frames.length) return dyn(`${step} is supplied by the caller (differs per call site)`, [step]);
        const fr = frames[frames.length - 1];
        const r = this._in(fr.gr, fr.nodeIdx, m.ext.index, frames.slice(0, -1), sym, depth + 1);
        return { ...r, via: [step, ...r.via] };
      }
    }
    const pin = rec.n.pins.find((p) => p.kind === 3 && p.index === pinIdx);
    if (!pin) return { kind: 'unset', via: [] };
    if (pin.conns.length > 1) return dyn('pin has several incoming wires');
    if (pin.conns.length === 1) return this._out(gr, pin.conns[0].node, pin.conns[0].index, frames, sym, depth + 1);
    const v = plain(pin.value);
    if (v && v.k === 'str' && v.v !== '') return { kind: 'value', v: v.v, via: [] };
    return { kind: 'unset', via: [] };
  }

  _out(gr, nodeIdx, pinIdx, frames, sym, depth) {
    if (depth > MAX_DEPTH) return dyn('wire chain too deep (cyclic?)');
    if (sym && sym.gr === gr && sym.nodeIdx === nodeIdx && sym.pinIdx === pinIdx) return { kind: 'symbol', id: sym.id, via: [] };
    const rec = this._node(gr, nodeIdx);
    if (!rec) return dyn(`node [${nodeIdx}] not found`);
    const { info } = rec;
    const step = (extra) => this._lbl(gr, nodeIdx, info, extra);
    const tail = (r, s) => ({ ...r, via: [s, ...r.via] });

    if (!info.user && info.shellId === N.GET_LOCAL && pinIdx === 1) {
      // Get Local Variable's "Value" output is just its Initial Value input; it serves as a constant holder.
      return tail(this._in(gr, nodeIdx, 0, frames, sym, depth + 1), step());
    }
    if (!info.user && info.shellId === N.GET_GRAPH_VAR && pinIdx === 0) {
      const name = this._in(gr, nodeIdx, 0, frames, sym, depth + 1);
      if (name.kind !== 'value') return tail(dyn(`graph variable name is not static (${name.kind === 'dynamic' ? name.reason : name.kind === 'symbol' ? 'it is the event name' : 'empty'})`, name.via), step());
      // Composite bodies cannot own graph variables: the variable belongs to the outermost real graph on the call stack.
      const owner = frames.length ? frames[0].gr : gr;
      if (owner.graph.kind === BODY_KIND) return tail(dyn(T`graph variable ${S('key', name.v)} read inside a composite body with unknown caller`, name.via), step(T` ${S('key', name.v)}`));
      const decl = owner.graph.variables.find((x) => x.name === name.v);
      const s = step(T` graph variable ${S('key', name.v)}`);
      if (!decl) return tail(dyn(T`graph variable ${S('key', name.v)} is not declared in the graph`, name.via), s);
      const val = plain(decl.value);
      if (!val || val.k !== 'str') return tail(dyn(T`graph variable ${S('key', name.v)} is not a String variable`, name.via), s);
      if (val.v === '') return tail({ kind: 'unset', reason: T`graph variable ${S('key', name.v)} has an empty initial value`, via: name.via }, s);
      return { kind: 'value', v: val.v, via: [`${s} = ${JSON.stringify(val.v)}`, ...name.via] };
    }
    if (info.user?.iface?.category === 1000) {
      const body = this.bodyByDecl.get(info.user.res.guid);
      if (!body) return dyn(T`composite ${S('key', info.name)} has no body in the scanned files`);
      const m = body.graph.portMappings.find((x) => x.ext.kind === 4 && x.ext.index === pinIdx);
      const port = this._declName(body, 4, pinIdx);
      const s = step(T` (composite) output${port ? T` ${S('pinName', port)}` : ` #${pinIdx}`}`);
      if (!m) return tail(dyn(T`composite ${S('key', info.name)} output is not mapped to an inner node`), s);
      return tail(this._out(body, m.node, m.int.index, [...frames, { gr, nodeIdx }], sym, depth + 1), s);
    }
    const on = this._outName(info, pinIdx);
    return dyn(T`${info.name}${on ? T` output ${S('pinName', on)}` : ''} is computed at runtime`);
  }

  // ---------------------------------------------------------------------------------------------------------------
  // Listener analysis
  // ---------------------------------------------------------------------------------------------------------------
  // Execution-flow successors of node `nodeIdx`'s out-flow pin `outFlowIdx`, crossing composite boundaries in
  // *either* direction so a listener whose nodes were each individually wrapped in their own composite (Miliastra's
  // "wrap in composite" applied node-by-node) still analyses exactly as if none of them had been: entering a
  // composite call mid-chain (its body has exactly one relevant entry node, found via its in-flow PORTMAP) is the
  // mirror of resolvePin's composite-output handling; leaving a body via its own out-flow PORTMAP (only possible
  // with a caller on `frames`) is the mirror of resolvePin's composite-input handling. Returns continuation points
  // `{ gr, idx, frames }` – `frames` is what's valid for resolving *data* pins (_in) on `idx` from here on.
  _flowNext(gr, nodeIdx, outFlowIdx, frames) {
    const rec = this._node(gr, nodeIdx);
    const pin = rec?.n.pins.find((p) => p.kind === 2 && p.index === outFlowIdx);
    if (pin && pin.conns.length) {
      const out = [];
      for (const c of pin.conns) {
        const trec = this._node(gr, c.node);
        const body = trec && trec.info.user?.iface?.category === 1000 ? this.bodyByDecl.get(trec.info.user.res.guid) : null;
        const m = body?.graph.portMappings.find((x) => x.ext.kind === 1 && x.ext.index === c.index && x.int.kind === 1);
        if (body && m) out.push({ gr: body, idx: m.node, frames: [...frames, { gr, nodeIdx: c.node }] });
        else out.push({ gr, idx: c.node, frames }); // plain node, or a composite whose entry point we can't map (falls through to "other node" below)
      }
      return out;
    }
    if (gr.graph.kind === BODY_KIND) {
      const m = gr.graph.portMappings.find((x) => x.ext.kind === 2 && x.node === nodeIdx && x.int.kind === 2 && x.int.index === outFlowIdx);
      if (m && frames.length) { const fr = frames[frames.length - 1]; return this._flowNext(fr.gr, fr.nodeIdx, m.ext.index, frames.slice(0, -1)); }
    }
    return []; // a genuine dead end (or a boundary we have no caller context to cross, e.g. the `raw` perspective)
  }

  /**
   * Which names does the event node `nodeIdx` (a "When … Changes/Triggered" whose output pin #namePin is the name)
   * actually handle? Follows the first out-flow, as long as it is a compare-and-branch name switch:
   *   - Multiple Branches whose Control Expression is the name -> every entry of its valid_pin_list is a handler, then continue via "Default";
   *   - Double Branch whose condition is Equal(name, X)         -> X is a handler, then continue via "No" (out-flow #1).
   * Any other node (or a switch we can't confirm is on the name) means the listener also has a catch-all path that runs for every name.
   * @returns {{ handlers: {name: string|null, node: number, nodeName: string, detail: string, via: string[]}[], catchAll: null|{node:number, reason:string} }}
   *   handler.name === null: a compare against a value that could not be resolved statically (reason in detail).
   */
  analyzeListener(gr, nodeIdx, namePin, frames = []) {
    const sym = { gr, nodeIdx, pinIdx: namePin, id: 'event-name' };
    const handlers = []; let catchAll = null;
    const seen = new Set();
    const queue = this._flowNext(gr, nodeIdx, 0, frames);
    const stop = (node, reason) => { catchAll = catchAll || { node, reason }; };
    while (queue.length) {
      const { gr: cg, idx, frames: cf } = queue.shift();
      const seenKey = cg.guid + ':' + idx;
      if (seen.has(seenKey)) continue; seen.add(seenKey);
      const rec = this._node(cg, idx);
      if (!rec) { stop(idx, `execution reaches missing node [${idx}]`); continue; }
      const { info } = rec;
      const where = this._lbl(cg, idx, info);
      if (info.user || (info.shellId !== N.MULTI_BRANCH && info.shellId !== N.DOUBLE_BRANCH)) { stop(idx, T`${where} runs for every name (not a name switch)`); continue; }

      if (info.shellId === N.MULTI_BRANCH) {
        const ctrl = this._in(cg, idx, 0, cf, sym, 0);
        if (ctrl.kind !== 'symbol') { stop(idx, T`${where}: Control Expression is not the event's name`); continue; }
        const listPin = rec.n.pins.find((p) => p.kind === 3 && p.index === 1);
        if (listPin?.conns.length) { handlers.push({ name: null, node: idx, nodeName: info.name, detail: T`${where} case list is wired (not a static list)`, via: [] }); }
        else {
          const items = plain(listPin?.value)?.items || [];
          items.forEach((it, i) => {
            const s = plain(it);
            if (s?.k === 'str' && s.v !== '') handlers.push({ name: s.v, node: idx, nodeName: info.name, detail: T`${where} case ${i + 1}`, via: [] });
            else handlers.push({ name: null, node: idx, nodeName: info.name, detail: T`${where} case ${i + 1} is empty`, via: [] });
          });
        }
        queue.push(...this._flowNext(cg, idx, 0, cf)); // "Default"
        continue;
      }

      // Double Branch: condition must be Equal(name, X). Note: only the branch node itself is followed through a
      // composite wrapper here (via _flowNext, above) – if the Equal node was *separately* wrapped in its own
      // composite, it shows up here as a plain composite call and is (conservatively) treated as catch-all.
      const cond = rec.n.pins.find((p) => p.kind === 3 && p.index === 0);
      const src = cond?.conns.length === 1 ? cond.conns[0] : null;
      const eq = src && this._node(cg, src.node);
      if (!eq || eq.info.user || eq.info.shellId !== N.EQUAL || src.index !== 0) { stop(idx, T`${where}: condition is not an Equal comparison`); continue; }
      const a = this._in(cg, src.node, 0, cf, sym, 0), b = this._in(cg, src.node, 1, cf, sym, 0);
      const aIs = a.kind === 'symbol', bIs = b.kind === 'symbol';
      if (aIs === bIs) { stop(idx, T`${where}: ${aIs ? 'compares the name with itself' : "Equal does not compare the event's name"} (${this._lbl(cg, src.node, eq.info)})`); continue; }
      const other = aIs ? b : a;
      const eqLbl = this._lbl(cg, src.node, eq.info);
      if (other.kind === 'value') handlers.push({ name: other.v, node: idx, nodeName: info.name, detail: T`${where} compares via ${eqLbl}`, via: other.via });
      else handlers.push({ name: null, node: idx, nodeName: info.name, detail: T`${where} compares via ${eqLbl} with a value that is ${other.kind === 'dynamic' ? T`not static: ${other.reason}` : 'empty'}`, via: other.via });
      queue.push(...this._flowNext(cg, idx, 1, cf)); // "No"
    }
    return { handlers, catchAll };
  }
}
