// The statement view of a graph (the `pseudocode` key of a code report's graph item, see JSON.md): what a reader of the graph would write as a
// function. Everything a renderer needs is decided here, from the resolved graph, so a style only prints:
//   * one `case` per node that has flow pins (an execution node); every node without flow pins is a data node and is written out again, before the
//     execution node that needs it, once per execution node (the game does not cache a data node between two execution nodes, but every
//     execution node computes each data node of its chain only once),
//   * a composite call is a call of the composite's own function (`Composite['Name']($, { inputs }, $.input)`): an execution node when the composite has
//     flow pins, a data node otherwise; with `expandComposites` the call is replaced by the body as if it was written where the call is (a call node is
//     transparent: its pins are the pins of the body),
//   * a composite body shown on its own is a function of its own: the data pins it hands out, and the cases a flow can enter at,
//   * names (functions, keys, variables) are plain identifiers, numbered per case (intermediates) and per graph (outputs of execution nodes); the names
//     of flow pins are strings, so an unnamed one is just its index,
//   * every call of a data node says which node it is (`id`): the id of the node as the editor shows it, `data_0007`, `Var_0005` for a Get Local Variable
//     (one variable per node), and the instance of a composite call is `Comp_0012`; an execution node is known by the id of its case,
//   * every output says how many times it is read (`uses`), and every read of a variable names the node and pin it comes from (`from`), so a style can
//     leave out what nobody reads or write a value where it is used.
//   * the cases are ordered by the flow: from each event (a composite that has events inside is one) the cases its flow reaches, depth first, in pin and
//     wire order, so that a case is as often as possible followed by the case it jumps to; whatever no event reaches comes last and is marked `unreachable`,
//     and so is a composite body that no reachable code enters or reads,
//   * every input pin a node has is given: a pin the file does not store has the game's default (or the zero value of its type), a stored value nobody edited
//     is the default as well (`set` false); only the slots a node does not have (Assembly List beyond its count, the branches Multiple Branches does not use) are left out.
// Nothing here is shown or hidden because of an option of the command line: unset pins and unedited values are in the data.
//   pseudocodeBuilder(bundle, db, analysis, { valueJson, resourceOf, expandComposites }) -> (graph resource) -> { tag, function, cases }
import { pinKindName, typeName } from './model.mjs';
import { pinTypeLabel, graphLabel } from './analyze.mjs';
import { host } from './host.mjs';
import { graphRef } from './present/doc.mjs';
import { analyzeFlow } from './flow.mjs';

const COMPOSITE_BODY_KIND = 21002;
const COMPOSITE_CATEGORY = 1000; // `category` of a composite's declaration
const SERVER_SERVICES = [20000, 20003, 20004, 20005];
// the word in front of a graph's GUID in its function name: one per service domain that has its own kind of graph (the item domain is a server graph
// like the entity one, but its own kind)
const SERVICE_WORD = { 20000: 'Entity', 20003: 'Status', 20004: 'Class', 20005: 'Item', 20001: 'Filter', 20006: 'Filter', 20002: 'Skill', 20010: 'Skill', 20007: 'Creation', 20008: 'Creation', 20009: 'Creation' };
// pin kinds of the file format
const IN_FLOW = 1, OUT_FLOW = 2, IN_PARAM = 3, OUT_PARAM = 4, META_RPC = 5, META_TOPIC = 6;

/** The bundled data/codegen-rules.json as lookups by node id. */
function codegenRules() {
  const r = JSON.parse(host.data('data/codegen-rules.json'));
  const choice = new Map(r.choice.flatMap((c) => c.nodes.map((id) => [id, { form: c.form, defaultFirst: c.default === 'first' }])));
  const hidden = new Map(r.hiddenInputs.flatMap((h) => h.nodes.map((id) => [id, new Set(h.pins)])));
  const redundant = new Map(r.redundantInputs.flatMap((h) => h.nodes.map((id) => [id, new Set(h.pins)])));
  return { choice, hidden, redundant, redundantEnums: new Set(r.redundantEnums), graphEnd: new Set(r.graphEnd), localVariable: new Set(r.localVariable) };
}
// the interval of a filter graph when the file does not store one (seconds)
const DEFAULT_EVALUATION_INTERVAL = 0.3;

const RESERVED = new Set(['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'async', 'of']);

/**
 * A name as a JavaScript identifier: runs of characters an identifier cannot hold become one underscore, a leading digit gets an underscore in front,
 * and the name of a reserved word does too. '' when nothing is left.
 */
export function ident(text) {
  let t = String(text ?? '').replace(/[^\p{ID_Continue}$]+/gu, '_').replace(/^_+|_+$/g, '');
  if (!t) return '';
  if (!/^[\p{ID_Start}$_]/u.test(t) || RESERVED.has(t)) t = '_' + t;
  return t;
}
/**
 * A flow pin's name as the string that stands for it (a branch label, a flow input): the pin is only ever named by this string, so a number stays a number
 * and nothing is put in front of it. '' when nothing is left.
 */
export function flowLabel(text) {
  return String(text ?? '').replace(/[^\p{ID_Continue}$.\-]+/gu, '_').replace(/^_+|_+$/g, '');
}
/** A datatype label as the word that names a value in the code: `L<Vec>` is `LVec`. */
export const typeWord = (label) => (label == null ? null : String(label).replace(/[<>:,\s]/g, ''));

/**
 * Gives every item of a list of pins (`{ index, name }`) the key it is written with: a data pin is a key of an object, so it is an identifier (an unnamed
 * one is its index behind an underscore); a flow pin is only ever a string. Equal keys get a number behind them; `taken` are keys that are in use already.
 */
function keyed(list, taken = [], flow = false) {
  const seen = new Set(taken);
  for (const it of list) {
    const base = flow ? flowLabel(it.name) || String(it.index) : ident(it.name) || `_${it.index}`;
    let k = base, i = 2;
    while (seen.has(k)) k = `${base}_${i++}`;
    seen.add(k); it.key = k;
  }
  return list;
}
/**
 * The keys of the pins of a composite's declaration, by pin index. The call and the body of a composite are written apart from each other and have to agree
 * on them: `In = { key: Type }` and the inputs of a call, the keys of the object the body returns and the outputs a call reads, the flow outputs a body
 * yields and the ones a call switches on.
 */
function interfaceKeys(f) {
  const of = (list, flow) => new Map(keyed([...list].sort((a, b) => a.index - b.index).map((p) => ({ index: p.index, name: p.name || null })), [], flow).map((it) => [it.index, it.key]));
  return { inputs: of(f.inputs, false), outputs: of(f.outputs, false), outflows: of(f.outflows, true) };
}

// ---- datatypes of the pins the file does not store ----------------------------------------------------------------------------------------------------
// The node database writes a generic pin as `R<T>` (the type of the generic parameter T), a list of it as `L<R<T>>`, an enum as `E<family>` and a
// dictionary as `D<..>`; a node variant binds the parameters (`C<T:L<Int>>`, `C<K:Ety,V:Int>`).
function splitTop(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '<') depth++; else if (ch === '>') depth--;
    if (ch === ',' && !depth) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}
function constraintParams(c) {
  const m = /^C<(.*)>$/.exec(c ?? '');
  const out = {};
  if (m) for (const part of splitTop(m[1])) { const i = part.indexOf(':'); if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim(); }
  return out;
}
function dbType(t, params) {
  if (t == null) return null;
  let m;
  if ((m = /^R<(\w+)>$/.exec(t))) return params[m[1]] != null ? dbType(params[m[1]], params) : 'Any';
  if ((m = /^L<(.*)>$/.exec(t))) { const inner = dbType(m[1], params); return inner == null ? null : `L${inner}`; }
  if (/^E<.*>$/.test(t)) return 'Enum';
  if (/^D<.*>$/.test(t)) return 'Dict';
  return t;
}

/**
 * What a dictionary maps, `{ key, value }` as datatype words, from the database's type of a pin (`D<R<K>,R<V>>`) and the node's bound parameters; a parameter
 * nobody bound is `Any`. null when the pin is not a dictionary of the database.
 */
function dictOfDb(t, params) {
  const bound = /^R<(\w+)>$/.exec(t ?? '');
  if (bound) return params.$dict?.[bound[1]] ?? null; // a generic pin that carries a dictionary
  const m = /^D<(.*)>$/.exec(t ?? '');
  if (!m) return null;
  const [k, v] = splitTop(m[1]).map((x) => typeWord(dbType(x.trim(), params)) ?? 'Any');
  return k && v ? { key: k, value: v } : null;
}
/** What a value or a declared pin says it maps (datatype words), or null. */
const dictOfNames = (key, value) => (key && value && key !== 'Unk' && value !== 'Unk' ? { key: typeWord(key), value: typeWord(value) } : null);

const ID_TYPES = new Set(['Ety', 'Gid', 'Cfg', 'Fct', 'Pfb']);
/**
 * The model value (`{ k, ... }`, as the file would store it) of a pin nobody edited: the game's default when the database has one, else the zero value of
 * the type (0, an empty string, No, the zero vector, no id, an empty list or dictionary). null when the type is not known (an unbound generic pin).
 */
function defaultValueOf(type, dflt) {
  const int = Number.isInteger(dflt) ? dflt : 0;
  if (type === 'Int') return { k: 'int', v: int };
  if (type === 'Flt') return { k: 'float', v: typeof dflt === 'number' ? dflt : 0 };
  if (type === 'Str') return { k: 'str', v: typeof dflt === 'string' ? dflt : '' };
  if (type === 'Bol') return { k: 'enum', ty: 'Bol', v: dflt === true ? 1 : 0 };
  if (type === 'Vec') return { k: 'vec', v: Array.isArray(dflt) ? dflt : [0, 0, 0] };
  if (ID_TYPES.has(type)) return { k: 'id', v: int };
  if (type === 'Enum' || /^E<\d+>$/.test(type ?? '')) return { k: 'enum', ty: 'Enum', v: int };
  if (/^L</.test(type ?? '')) return { k: 'list', items: [] };
  if (type === 'Dict' || /^D</.test(type ?? '')) return { k: 'map', pairs: [] };
  if (type === 'Struct') return { k: 'struct', items: [] };
  return null;
}

export function pseudocodeBuilder(bundle, db, analysis, { valueJson, resourceOf, expandComposites = false }) {
  const { R, nodeLabel, dup } = analysis;
  const rules = codegenRules();
  const bodyByDecl = new Map();
  for (const r of bundle.resources) if (r.kind === 'graph' && r.graph?.kind === COMPOSITE_BODY_KIND) { const d = R.declForBody(r); if (d) bodyByDecl.set(d.guid, r); }

  const infoCache = new Map();
  const pinRef = (kind, index, name) => ({ kind: pinKindName(kind), index, name: name ?? null });
  const pad = (n, w) => String(n).padStart(w, '0');
  const nodeId = (index) => `node_${pad(index, 4)}`;

  // ---- what a graph says about itself, looked up by node and pin ------------------------------------------------------------------------------------
  function graphInfo(res) {
    let gi = infoCache.get(res);
    if (gi) return gi;
    const g = res.graph;
    gi = { res, g, labels: nodeLabel.get(g), byIdx: new Map(g.nodes.map((n) => [n.index, n])), descs: new Map(), decl: g.kind === COMPOSITE_BODY_KIND ? R.declForBody(res) : null, keys: null,
      flowOut: new Map(), flowIn: new Map(), dataIn: new Map(), outRefs: new Map(), inFlowPorts: new Map(), outFlowPorts: new Map(), inDataPorts: new Map(), outDataPorts: new Map() };
    infoCache.set(res, gi);
    if (gi.decl) gi.keys = interfaceKeys(gi.decl.iface);
    const add = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v); };
    for (const e of g.edges) {
      if (e.from.kind === OUT_FLOW && e.to.kind === IN_FLOW) { add(gi.flowOut, `${e.from.node}:${e.from.index}`, e.to); add(gi.flowIn, e.to.node, e.to.index); }
      else if (e.from.kind === OUT_PARAM && e.to.kind === IN_PARAM) { add(gi.dataIn, `${e.to.node}:${e.to.index}`, e.from); add(gi.outRefs, e.from.node, e.from.index); }
    }
    for (const pm of g.portMappings) { // the pins of a composite's declaration (ext) and the pins inside that stand for them
      const at = { node: pm.node, pin: pm.int.index };
      if (pm.ext.kind === IN_FLOW) add(gi.inFlowPorts, pm.ext.index, at);
      else if (pm.ext.kind === OUT_FLOW) add(gi.outFlowPorts, `${pm.node}:${pm.int.index}`, pm.ext.index);
      else if (pm.ext.kind === IN_PARAM) gi.inDataPorts.set(`${pm.node}:${pm.int.index}`, pm.ext.index);
      else if (pm.ext.kind === OUT_PARAM && !gi.outDataPorts.has(pm.ext.index)) gi.outDataPorts.set(pm.ext.index, at);
    }
    return gi;
  }
  /** The declaration's name for a pin of the composite this body belongs to. */
  function externalPin(gi, kind, index) {
    const f = gi.decl?.iface;
    const list = !f ? [] : kind === IN_FLOW ? f.inflows : kind === OUT_FLOW ? f.outflows : kind === IN_PARAM ? f.inputs : f.outputs;
    return pinRef(kind, index, list.find((p) => p.kind === kind && p.index === index)?.name || null);
  }
  const nodeRef = (gi, index) => {
    const info = gi.labels.get(index);
    return info ? { index, name: info.name, shell_id: info.shellId, kernel_id: info.kernelId } : { index, name: null, shell_id: null, kernel_id: null };
  };

  // ---- what a node is: its pins (also the ones the file does not store), and whether it runs ------------------------------------------------------
  /**
   * Binds the generic parameters (and what a dictionary maps) nobody stored from the pins this node is wired to: the type of what feeds an input, and what the
   * inputs of the nodes an output feeds make of their own parameters. A node that is being described (a loop of wires) says nothing.
   */
  function inferFromWires(gi, n, d, params) {
    const def = db.node(d.info.shellId)?.pins ?? {};
    const bind = (name, word, dict) => {
      if (word == null || word === 'Any' || word === 'Unk') return;
      params[name] ??= word;
      if (word === 'Dict' && dict) { params.$dict ??= {}; params.$dict[name] ??= dict; }
    };
    const unify = (t, word, dict) => { // the database's type of a pin met a type that is known
      let m;
      if ((m = /^R<(\w+)>$/.exec(t))) bind(m[1], word, dict);
      else if ((m = /^L<R<(\w+)>>$/.exec(t)) && /^L.+/.test(word ?? '')) bind(m[1], word.slice(1));
      else if ((m = /^D<R<(\w+)>,R<(\w+)>>$/.exec(t)) && dict) { if (dict.key !== 'Any') bind(m[1], dict.key); if (dict.value !== 'Any') bind(m[2], dict.value); }
    };
    for (const [key, pin] of Object.entries(def)) {
      const [kind, idx] = key.split(':'), index = Number(idx), t = pin.type;
      if (!/R<|D</.test(t ?? '')) continue;
      if (kind === 'in_param') {
        for (const from of gi.dataIn.get(`${n.index}:${index}`) ?? []) {
          const src = gi.byIdx.get(from.node);
          const o = src ? describe(gi, src).outData.find((x) => x.index === from.index) : null;
          if (o) unify(t, o.type, o.dict);
        }
      } else if (kind === 'out_param') {
        for (const e of gi.g.edges) {
          if (e.from.node !== n.index || e.from.kind !== OUT_PARAM || e.from.index !== index || e.to.kind !== IN_PARAM) continue;
          const c = gi.byIdx.get(e.to.node), cd = c ? describe(gi, c) : null;
          const ct = cd?.params && !cd.info.user ? db.pinDef(cd.info.shellId, 'in_param', e.to.index)?.type : null;
          let m;
          if (!ct) continue;
          if ((m = /^R<(\w+)>$/.exec(ct))) unify(t, cd.params[m[1]] == null ? null : typeWord(dbType(ct, cd.params)), cd.params.$dict?.[m[1]]);
          else if (/^D<.*>$/.test(ct)) unify(t, 'Dict', dictOfDb(ct, cd.params));
        }
      }
    }
  }
  function describe(gi, n) {
    let d = gi.descs.get(n);
    if (d) return d;
    const info = gi.labels.get(n.index);
    d = { n, info, fn: ident(info.name) || `Node_${info.shellId ?? 'unknown'}`, composite: null, callee: null, inFlow: [], outFlow: [], outData: [], inData: [], exec: false, event: false };
    gi.descs.set(n, d);
    if (info.user?.iface?.category === COMPOSITE_CATEGORY) {
      const body = bodyByDecl.get(info.user.res.guid) ?? null; // `name` is what the body is filed under
      d.callee = { name: body ? graphRef(graphLabel(body, dup, R)).name : info.name, keys: interfaceKeys(info.user.iface), body };
      if (expandComposites) d.composite = body;
    }

    const stored = (kind) => n.pins.filter((p) => p.kind === kind);
    const pinName = (kind, index) => R.pinName(info, n.pins.find((p) => p.kind === kind && p.index === index) ?? { kind, index, uid: null }).name ?? null; // a stored pin's uid names a user node's pin
    const indexes = (kind, extra) => {
      const set = new Set(extra);
      for (const p of stored(kind)) set.add(p.index);
      if (info.user) { const f = info.user.iface; for (const p of kind === IN_FLOW ? f.inflows : kind === OUT_FLOW ? f.outflows : kind === IN_PARAM ? f.inputs : f.outputs) set.add(p.index); }
      else if (info.shellId != null) {
        const prefix = `${pinKindName(kind)}:`;
        for (const k of Object.keys(db.node(info.shellId)?.pins ?? {})) if (k.startsWith(prefix)) set.add(Number(k.slice(prefix.length)));
      }
      return [...set].sort((a, b) => a - b);
    };
    // Multiple Branches has as many branches as its case list says, not the ten its definition allows
    const branchIdx = info.branchValues ? [0, ...info.branchValues.map((_, i) => i + 1)] : null;
    const outFlowIdx = branchIdx ? [...new Set([...branchIdx, ...stored(OUT_FLOW).map((p) => p.index)])].sort((a, b) => a - b) : indexes(OUT_FLOW, []);
    d.inFlow = indexes(IN_FLOW, gi.flowIn.get(n.index) ?? []).map((index) => ({ index, name: pinName(IN_FLOW, index), key: null }));
    d.outFlow = keyed(outFlowIdx.map((index) => ({ index, name: pinName(OUT_FLOW, index), key: null })), [], true);
    // the node is told which flow input the flow came through; a composite always is, as the entry points of its body are named by them
    d.input = d.callee ? d.inFlow.length > 0 : d.inFlow.length > 1;
    const rule = info.user ? null : info.shellId;
    d.choice = rules.choice.get(rule) ?? null;
    d.hidden = rules.hidden.get(rule) ?? null;
    d.redundant = rules.redundant.get(rule) ?? null;
    d.end = rules.graphEnd.has(rule);
    d.localVar = rules.localVariable.has(rule);
    d.exec = d.inFlow.length > 0 || d.outFlow.length > 0 || d.end; // a graph's end node has no flow pins, it is what the graph runs
    d.event = !d.callee && d.inFlow.length === 0 && d.outFlow.length > 0;

    // generic pins take their type from the node's variant, or from what the file says about the pins it stores
    const variant = info.shellId != null ? db.node(info.shellId)?.variants?.find((v) => v.kernel === info.kernelId)?.c : null;
    const params = {};
    if (info.shellId != null) {
      const def = db.node(info.shellId)?.pins ?? {};
      for (const p of n.pins) {
        const t = def[`${pinKindName(p.kind)}:${p.index}`]?.type, label = p.typeId == null ? null : pinTypeLabel(p, gi.g);
        let m;
        if (!t || !label) continue;
        if ((m = /^D<R<(\w+)>,R<(\w+)>>$/.exec(t)) && p.value?.keyType && p.value.keyType !== 'Unk') { params[m[1]] ??= p.value.keyType; params[m[2]] ??= p.value.valueType; }
        if ((m = /^R<(\w+)>$/.exec(t))) params[m[1]] ??= label;
        else if ((m = /^L<R<(\w+)>>$/.exec(t)) && /^L<(.*)>$/.test(label)) params[m[1]] ??= /^L<(.*)>$/.exec(label)[1];
      }
      // a node whose kernel is its shell is the generic node itself or its first variant, which the file does not tell apart: only the types its stored pins
      // state count then, so a generic pin nobody typed stays `Any`
      if (info.kernelId !== info.shellId) Object.assign(params, constraintParams(variant));
    }
    d.params = params;
    if (info.shellId != null) inferFromWires(gi, n, d, params);
    const backend = info.user?.iface.id?.shell && SERVER_SERVICES.includes(info.user.iface.id.shell.service) ? 1 : 2;
    const outType = (index) => {
      const p = stored(OUT_PARAM).find((q) => q.index === index);
      if (p && p.typeId != null) return pinTypeLabel(p, gi.g);
      if (info.user) { const t = info.user.iface.outputs.find((q) => q.index === index)?.type; return t?.shell != null ? typeName(backend, t.shell) : 'Unk'; }
      return dbType(db.pinDef(info.shellId, 'out_param', index)?.type, params) ?? 'Unk';
    };
    // what a dictionary output maps: what the pin's own value or the declaration says, else what the database's type of the pin makes of the bound parameters
    const outDict = (index) => {
      const type = typeWord(outType(index));
      if (type !== 'Dict') return null;
      const p = stored(OUT_PARAM).find((q) => q.index === index);
      if (p?.value?.keyType) return dictOfNames(p.value.keyType, p.value.valueType);
      if (info.user) { const t = info.user.iface.outputs.find((q) => q.index === index)?.type; return t?.mapKey != null ? dictOfNames(typeName(backend, t.mapKey), typeName(backend, t.mapValue)) : null; }
      return dictOfDb(db.pinDef(info.shellId, 'out_param', index)?.type, params);
    };
    d.outData = keyed(indexes(OUT_PARAM, gi.outRefs.get(n.index) ?? []).map((index) => ({ index, name: pinName(OUT_PARAM, index), key: null, type: typeWord(outType(index)), dict: outDict(index) })));
    // what the node is given: every input it has (the file stores a pin only for the ones that were wired or edited), and the meta pins (a signal node's
    // "Signal Name" is one). The slots a node does not have are no inputs: Assembly List beyond its count, the case list of a Multiple Branches that is named
    // by its branches.
    const given = (index) => n.pins.some((p) => p.kind === IN_PARAM && p.index === index);
    const virtual = (index) => R.isPlaceholderPin(n, info, { kind: IN_PARAM, index }) || R.isHiddenPin(info, { kind: IN_PARAM, index });
    const present = n.pins.filter((p) => (p.kind === IN_PARAM || p.kind === META_RPC || p.kind === META_TOPIC) && !R.isPlaceholderPin(n, info, p) && !R.isHiddenPin(info, p))
      .map((pin) => ({ kind: pin.kind, index: pin.index, name: pinName(pin.kind, pin.index), key: null, pin }));
    const absent = indexes(IN_PARAM, []).filter((index) => !given(index) && !virtual(index)).map((index) => ({ kind: IN_PARAM, index, name: pinName(IN_PARAM, index), key: null, pin: null }));
    d.inData = keyed([...present, ...absent].sort((a, b) => a.kind - b.kind || a.index - b.index), d.event ? ['Event'] : []);
    if (d.callee) {
      const keys = d.callee.keys;
      for (const a of d.inData) if (a.kind === IN_PARAM && keys.inputs.has(a.index)) a.key = keys.inputs.get(a.index);
      for (const o of d.outData) if (keys.outputs.has(o.index)) o.key = keys.outputs.get(o.index);
      for (const o of d.outFlow) if (keys.outflows.has(o.index)) o.key = keys.outflows.get(o.index);
    }
    return d;
  }

  // ---- how the flow leaves a node: its execution type ---------------------------------------------------------------------------------------------------
  /**
   * The entry points a composite body has for events: the ids (relative to the call) of the events inside it and, behind the id of the call node, of the
   * events inside the composites it calls. An expanded call has them as event cases of its own, under the same ids.
   */
  function eventsOf(body, stack) {
    const gi = graphInfo(body), inner = new Set([...stack, body.gkey]), out = [];
    for (const n of [...gi.g.nodes].sort((a, b) => a.index - b.index)) {
      const d = describe(gi, n);
      if (d.callee) { if (d.callee.body && !inner.has(d.callee.body.gkey)) out.push(...eventsOf(d.callee.body, inner).map((e) => `${nodeId(n.index)}.${e}`)); }
      else if (d.event) out.push(`event_${pad(n.index, 4)}`);
    }
    return out;
  }

  const behaviors = new Map(), compositeFlows = new Map(); // node -> its behavior, composite body -> its flow (flow.mjs)
  /** Whether a body calls itself, through any number of composites: its flow is not followed (the type of a recursive composite is generic). */
  function callsItself(res) {
    const seen = new Set(), stack = [res];
    while (stack.length) {
      const gi = graphInfo(stack.pop());
      for (const n of gi.g.nodes) {
        const body = describe(gi, n).callee?.body;
        if (!body) continue;
        if (body === res) return true;
        if (!seen.has(body.gkey)) { seen.add(body.gkey); stack.push(body); }
      }
    }
    return false;
  }
  /** How the flow leaves a composite body (flow.mjs): every path of its body is followed, knowing the type of every node on it. */
  function compositeFlow(res) {
    let f = compositeFlows.get(res.gkey);
    if (f) return f;
    const gi = graphInfo(res), exec = (idx) => { const n = gi.byIdx.get(idx); return n != null && describe(gi, n).exec; };
    const wired = (list) => list.filter((to) => exec(to.node)).map((to) => ({ node: to.node, input: to.index ?? to.pin }));
    f = !gi.decl || callsItself(res) ? { type: 'generic', pins: [], terminal: false } : analyzeFlow({
      nodes: gi.g.nodes.filter((n) => describe(gi, n).exec).map((n) => n.index),
      behavior: (idx) => behaviorOf(gi, gi.byIdx.get(idx)),
      targets: (idx, pin) => [...wired(gi.flowOut.get(`${idx}:${pin}`) ?? []), ...(gi.outFlowPorts.get(`${idx}:${pin}`) ?? []).map((exit) => ({ exit }))],
      entries: [...gi.inFlowPorts.values()].map(wired),
      events: eventsOf(res, new Set()).length > 0,
    });
    compositeFlows.set(res.gkey, f);
    return f;
  }
  /** The type of a node (flow.mjs): its flow outputs the flow may leave through, and whether it may leave through none. */
  function behaviorOf(gi, n) {
    let b = behaviors.get(n);
    if (b) return b;
    const d = describe(gi, n), pins = d.outFlow.map((p) => p.index);
    const generic = { type: 'generic', pins, terminal: false, sequence: !d.callee, start: null };
    if (d.callee) {
      const f = d.callee.body ? compositeFlow(d.callee.body) : null;
      b = f && f.type !== 'generic' ? { type: f.type, pins: f.pins.filter((p) => pins.includes(p)), terminal: f.terminal, sequence: false, start: null } : generic;
    } else if (d.choice) b = { type: 'choice', pins, terminal: false, sequence: false, start: null };
    else if (pins.length <= 1) b = { type: 'single', pins, terminal: pins.length === 0, sequence: false, start: null };
    else b = generic;
    // a flow into any input but the first of a node with several (a loop's "Break Loop") ends it; it does not start it
    if (!d.callee && d.inFlow.length > 1) b = { ...b, start: d.inFlow[0].index };
    behaviors.set(n, b);
    return b;
  }
  /** How a case is written: the node's type, and the form that stands for it (`call`, `if`, `switch`, `loop`, see JSON.md). */
  function flowOf(d, b) {
    if (b.type === 'single') return { type: 'single', form: 'call', terminal: b.terminal, default: null };
    if (b.type === 'generic') return { type: 'generic', form: 'loop', terminal: false, default: null };
    const count = b.pins.length + (b.terminal ? 1 : 0);
    const form = d.choice ? (d.choice.form === 'if' && count === 2 ? 'if' : 'switch') : count === 2 ? 'if' : 'switch';
    return { type: 'choice', form, terminal: b.terminal, default: form === 'if' ? null : d.choice?.defaultFirst ? 'pin' : b.terminal ? 'terminal' : 'none' };
  }
  const graphKey = (res) => ({ guid: res.guid, service: res.graph.service });

  // ---- the graph of one root: instances of composite bodies, the execution nodes, the cases -------------------------------------------------------
  /** The pseudocode of one graph, before it is known which composite bodies the rest of the file makes use of. */
  function build(res) {
    const g = res.graph;
    const caseBodies = new Map(); // execution node -> the bodies its case makes use of
    let faceBodies = new Set(); // the bodies the outputs of a composite make use of
    const canExpand = (inst, d) => d.composite && !inst.stack.has(d.composite.gkey);
    function instance(r, parent, callNode) {
      const gi = graphInfo(r);
      // A call node is an instance of its composite, and the instance owns what the composite keeps (the outputs of its execution nodes, its local
      // variables): the callers name it by the id of the call node, `Comp_0012`, behind the names of the instances it is expanded from (`tag`)
      const comp = new Map([...gi.g.nodes].filter((n) => describe(gi, n).callee).map((n) => [n.index, `Comp_${pad(n.index, 4)}`]));
      return {
        gi, parent, callNode, children: new Map(), comp,
        tag: parent ? `${parent.tag}${parent.comp.get(callNode.index)}_` : '',
        key: parent ? `${parent.key}${callNode.index}.` : '',
        prefix: parent ? `${parent.prefix}${nodeId(callNode.index)}.` : '',
        via: parent ? [...parent.via, { ...nodeRef(parent.gi, callNode.index), graph: graphKey(parent.gi.res) }] : [],
        stack: new Set([...(parent ? parent.stack : []), r.gkey]),
      };
    }
    const childOf = (inst, n, d) => {
      let c = inst.children.get(n.index);
      if (!c) inst.children.set(n.index, c = instance(d.composite, inst, n));
      return c;
    };
    const root = instance(res, null, null);

    // 1. the execution nodes, in node order with a composite call replaced by its body
    const execs = [], exByKey = new Map(), datas = [], printed = new Set(); // every data node there is, and the ones a case or an output writes
    (function walk(inst) {
      for (const n of [...inst.gi.g.nodes].sort((a, b) => a.index - b.index)) {
        const d = describe(inst.gi, n);
        if (canExpand(inst, d)) walk(childOf(inst, n, d));
        else if (!d.exec) datas.push({ inst, n, d, key: `${inst.key}/${n.index}` });
        else {
          const ex = { inst, n, d, id: `${inst.prefix}${d.event ? 'event' : 'node'}_${pad(n.index, 4)}`, globals: new Map(), recs: [], reads: new Map() };
          execs.push(ex); exByKey.set(`${inst.key}/${n.index}`, ex);
        }
      }
    })(root);
    // their outputs are `$.` variables, numbered over the whole graph (a node may use the output of one further down the list)
    let gcount = 0;
    for (const ex of execs) if (!ex.d.callee) for (const o of ex.d.outData) ex.recs.push({ index: o.index, type: o.type, num: ++gcount });
    const gwidth = Math.max(3, String(gcount).length);
    for (const ex of execs) for (const r of ex.recs) ex.globals.set(r.index, `${r.type}_${pad(r.num, gwidth)}`);

    // 2. where the flow goes
    const missingNode = (gi, index) => nodeRef(gi, index);
    function enter(inst, nodeIdx, inIdx) { // the flow arrives at flow input `inIdx` of a node
      const tn = inst.gi.byIdx.get(nodeIdx);
      if (!tn) return [];
      const d = describe(inst.gi, tn);
      if (canExpand(inst, d)) {
        const ci = childOf(inst, tn, d);
        return (ci.gi.inFlowPorts.get(inIdx) ?? []).flatMap((m) => enter(ci, m.node, m.pin));
      }
      if (!d.exec) return [];
      const ex = exByKey.get(`${inst.key}/${tn.index}`);
      if (!ex) return [];
      // a node with several flow inputs (a loop's "Break Loop") is told which one the flow came through
      const pin = d.inFlow.find((p) => p.index === inIdx), label = flowLabel(pin?.name) || String(inIdx);
      return [{ id: ex.id, exit: null, label: null, input: d.callee ? `input: ${label}` : d.inFlow.length > 1 ? label : null, function: d.fn }];
    }
    function flowTargets(inst, nodeIdx, outIdx) {
      const out = [];
      for (const to of inst.gi.flowOut.get(`${nodeIdx}:${outIdx}`) ?? []) out.push(...enter(inst, to.node, to.index));
      for (const ext of inst.gi.outFlowPorts.get(`${nodeIdx}:${outIdx}`) ?? []) { // the pin is an output of the composite
        if (inst.parent) out.push(...flowTargets(inst.parent, inst.callNode.index, ext));
        else {
          const pin = externalPin(inst.gi, OUT_FLOW, ext), label = inst.gi.keys?.outflows.get(ext) ?? (flowLabel(pin.name) || String(ext));
          out.push({ id: `exit_${label}`, exit: pin, label, input: null, function: null });
        }
      }
      return out.filter((t, i) => out.findIndex((u) => u.id === t.id && u.input === t.input) === i);
    }

    // 3. what the pins of a node are fed with, while one case collects the data nodes it needs
    const blank = { name: null, type: null, dict: null, value: null, node: null, pin: null, enum: null, resource: null, from: null };
    // the enum family a pin takes its values from: the pin's own, else the only family that has the value
    function enumFamily(d, pin, value) {
      let fam = null;
      if (d.info.user) { const f = d.info.user.iface, list = pin.kind === IN_PARAM ? f.inputs : pin.kind === OUT_PARAM ? f.outputs : f.metaPins; fam = list.find((p) => p.index === pin.index)?.type?.enumId ?? null; }
      else {
        let t = db.pinDef(d.info.shellId, pinKindName(pin.kind), pin.index)?.type;
        const m = /^R<(\w+)>$/.exec(t ?? '');
        if (m) t = d.params[m[1]];
        const e = /^E<(\d+)>$/.exec(t ?? '');
        fam = e ? Number(e[1]) : null;
      }
      if (fam == null) { const fams = [...new Set(db.enumCandidates(value.value).map((x) => x.family))]; if (fams.length === 1) fam = fams[0]; }
      return fam;
    }
    function enumOf(d, pin, value) {
      if (value.kind !== 'enum') return null;
      const fam = enumFamily(d, pin, value);
      const entry = fam != null ? db.enums[fam] : null;
      const family = entry ? db.pick(entry) ?? null : null, name = entry ? db.pick(entry.values?.[value.value]) ?? null : value.names.join(' | ') || null;
      return family == null && name == null ? null : { family, name };
    }
    /** What a dictionary input maps (datatype words): the value's own binding, else the declaration of the pin; null for any other value. */
    function inputDict(d, index, raw) {
      if (raw?.keyType) return dictOfNames(raw.keyType, raw.valueType);
      if (d.info.user) { const t = d.info.user.iface.inputs.find((q) => q.index === index)?.type; const backend = d.info.user.iface.id?.shell && SERVER_SERVICES.includes(d.info.user.iface.id.shell.service) ? 1 : 2; return t?.mapKey != null ? dictOfNames(typeName(backend, t.mapKey), typeName(backend, t.mapValue)) : null; }
      return dictOfDb(db.pinDef(d.info.shellId, 'in_param', index)?.type, d.params);
    }
    const literalOf = (inst, n, pin) => {
      const value = valueJson(pin?.value, db);
      if (!value) return null;
      const d = describe(inst.gi, n);
      return { kind: 'literal', ...blank, type: pin.typeId == null ? null : typeWord(pinTypeLabel(pin, inst.gi.g)), dict: value.kind === 'map' ? inputDict(d, pin.index, pin.value) : null, value, enum: enumOf(d, pin, value), resource: resourceOf(pin.value) };
    };
    /** What an input pin holds that nobody edited and nothing is wired to: the default of the pin (the node's own declaration for a composite), else the zero of its type. */
    function defaultOf(inst, n, index) {
      const d = describe(inst.gi, n), info = d.info, pin = { kind: IN_PARAM, index };
      let type = null, raw = null;
      if (info.user) {
        const ty = info.user.iface.inputs.find((q) => q.index === index)?.type;
        const backend = info.user.iface.id?.shell && SERVER_SERVICES.includes(info.user.iface.id.shell.service) ? 1 : 2;
        type = ty?.enumId != null ? `E<${ty.enumId}>` : ty?.shell != null ? typeName(backend, ty.shell) : null;
        raw = ty?.defaultValue ?? null;
      } else {
        const def = info.shellId != null ? db.pinDef(info.shellId, 'in_param', index) : null;
        type = dbType(def?.type, d.params);
        raw = defaultValueOf(type, def?.default);
      }
      let value = raw ? valueJson({ ...raw, set: false }, db) : null;
      if (!value) { raw = defaultValueOf(type, undefined); value = raw ? valueJson(raw, db) : null; }
      if (!value) return { kind: 'unset', ...blank, type: typeWord(type) };
      value.set = false;
      return { kind: 'literal', ...blank, type: typeWord(type), dict: value.kind === 'map' ? inputDict(d, index, null) : null, value, enum: enumOf(d, pin, value), resource: null };
    }
    function inputExpr(inst, n, index, st, kind = IN_PARAM) {
      if (kind !== IN_PARAM) return literalOf(inst, n, n.pins.find((p) => p.kind === kind && p.index === index));
      const src = inst.gi.dataIn.get(`${n.index}:${index}`)?.[0];
      if (src) return outputExpr(inst, src.node, src.index, st);
      const own = n.pins.find((p) => p.kind === IN_PARAM && p.index === index);
      const ext = inst.gi.inDataPorts.get(`${n.index}:${index}`);
      if (ext != null) {
        if (!inst.parent) { const pin = externalPin(inst.gi, IN_PARAM, ext); return { kind: 'port', ...blank, name: inst.gi.keys?.inputs.get(ext) ?? (ident(pin.name) || `_${ext}`), pin }; }
        const outer = inputExpr(inst.parent, inst.callNode, ext, st);
        if (outer) return outer;
      }
      return literalOf(inst, n, own) ?? defaultOf(inst, n, index);
    }
    function outputExpr(inst, srcIdx, outIdx, st) {
      const sn = inst.gi.byIdx.get(srcIdx);
      if (!sn) return { kind: 'missing', ...blank, node: missingNode(inst.gi, srcIdx) };
      const d = describe(inst.gi, sn);
      if (canExpand(inst, d)) { // a composite's output is the pin inside that stands for it
        const ci = childOf(inst, sn, d), at = ci.gi.outDataPorts.get(outIdx);
        return at ? outputExpr(ci, at.node, at.pin, st) : { kind: 'missing', ...blank, node: nodeRef(inst.gi, srcIdx) };
      }
      if (d.exec && !d.callee) { // a composite keeps no output: reading one runs the data chain behind it
        const ex = exByKey.get(`${inst.key}/${sn.index}`), name = ex?.globals.get(outIdx);
        for (let i = inst; i.parent; i = i.parent) st.bodies.add(i.gi.res.gkey); // reading what an expanded body's node gives out makes use of the body
        if (!name) return { kind: 'missing', ...blank, node: nodeRef(inst.gi, srcIdx) };
        ex.reads.set(outIdx, (ex.reads.get(outIdx) ?? 0) + 1);
        return { kind: 'global', ...blank, name, node: nodeRef(inst.gi, srcIdx), pin: pinRef(OUT_PARAM, outIdx, d.outData.find((o) => o.index === outIdx)?.name), from: `${d.fn}.${d.outData.find((o) => o.index === outIdx)?.key}` };
      }
      const key = `${inst.key}/${sn.index}`;
      let recs = st.memo.get(key);
      if (!recs) {
        if (st.visiting.has(key)) return { kind: 'missing', ...blank, node: nodeRef(inst.gi, srcIdx) }; // a data loop
        st.visiting.add(key);
        const call = callOf(inst, sn, d, st, { data: true });
        recs = new Map();
        for (const o of call.outputs) { const rec = { type: o.type, num: ++st.count, objs: [o] }; st.recs.push(rec); recs.set(o.pin.index, rec); }
        st.data.push(call);
        printed.add(key);
        st.visiting.delete(key);
        st.memo.set(key, recs);
      }
      const rec = recs.get(outIdx);
      if (!rec) return { kind: 'missing', ...blank, node: nodeRef(inst.gi, srcIdx) };
      const e = { kind: 'var', ...blank, node: nodeRef(inst.gi, srcIdx), pin: rec.objs[0].pin, from: `${d.fn}.${rec.objs[0].key}` };
      rec.objs.push(e);
      return e;
    }
    /**
     * Which node a call of a data node is (the execution nodes are known by the id of their case): `data_0007`, behind the ids of the calls an expanded
     * body is inside of. A Get Local Variable makes a variable of its own wherever it is placed (the variable is what its output pin points at), so it is
     * `Var_0005`, behind the names of the instances it is in. A composite call is named by its instance instead.
     */
    function idOf(inst, n, d, data) {
      if (d.localVar) return { kind: 'var', name: `${inst.tag}Var_${pad(n.index, 4)}` };
      if (data && !d.callee) return { kind: 'data', name: `${inst.prefix}data_${pad(n.index, 4)}` };
      return null;
    }
    /** The constant a filter graph's end node takes as an argument after its pins, the graph's evaluation interval, or null. */
    function extraOf(inst, n, d) {
      const lit = (type, value) => ({ kind: 'literal', ...blank, type, value, resource: null });
      if (d.end) {
        const interval = inst.gi.g.evaluationInterval;
        return lit('Flt', { kind: 'float', set: interval != null, value: interval ?? DEFAULT_EVALUATION_INTERVAL });
      }
      return null;
    }
    /** The calls and reads of a list of data nodes are named once all of them are known: intermediates are numbered in the order they were written. */
    function nameLocals(st) {
      const width = Math.max(2, String(st.count).length);
      for (const rec of st.recs) {
        rec.objs[0].uses = rec.objs.length - 1; // the first is the output, the others are the reads of it
        for (const o of rec.objs) o.name = `${rec.type}_${pad(rec.num, width)}`;
      }
    }
    /** The call of a node (a data node: its outputs are the case's intermediates; an execution node: they are filled in by the caller). */
    function callOf(inst, n, d, st, { event = false, data = false } = {}) {
      // the composites this call makes use of: the one it calls, and the bodies an expanded call is inside of
      if (d.callee?.body) st.bodies.add(d.callee.body.gkey);
      for (let i = inst; i.parent; i = i.parent) st.bodies.add(i.gi.res.gkey);
      const args = [];
      if (event) args.push({ pin: null, key: 'Event', expr: { kind: 'event', ...blank }, hidden: false });
      // the data nodes the inputs need are collected first (in pin order), so that they come out before the call
      const pins = [...d.inData];
      // an input that stands for a pin of the composite this graph is the body of (or a body is expanded into) has no pin of its own in the file
      const taken = new Set(pins.map((a) => a.key));
      for (const k of inst.gi.inDataPorts.keys()) {
        const [node, index] = k.split(':').map(Number);
        if (node !== n.index || pins.some((a) => a.kind === IN_PARAM && a.index === index)) continue;
        const name = R.pinName(d.info, { kind: IN_PARAM, index, uid: null }).name ?? null;
        let key = ident(name) || `_${index}`;
        if (taken.has(key)) key = `${key}_${index}`;
        taken.add(key);
        pins.push({ kind: IN_PARAM, index, name, key });
      }
      pins.sort((x, y) => x.kind - y.kind || x.index - y.index);
      for (const a of pins) {
        const expr = inputExpr(inst, n, a.index, st, a.kind);
        // an input the game hides in its editor is only worth a line when it holds something other than its default; one that says what the node's title or
        // its other pins already say (the operator of a math node, the Count of an assembly) is not
        const hidden = a.kind === IN_PARAM && expr?.kind === 'literal' && !!(
          (d.hidden?.has(a.index) && !expr.value.set) || d.redundant?.has(a.index)
          || (!d.info.user && expr.value.kind === 'enum' && rules.redundantEnums.has(enumFamily(d, { kind: IN_PARAM, index: a.index }, expr.value))));
        args.push({ pin: pinRef(a.kind, a.index, a.name), key: a.key, expr, hidden });
      }
      return {
        node: nodeRef(inst.gi, n.index), graph: graphKey(inst.gi.res), via: inst.via, comment: n.comment ?? null, function: d.fn, composite: d.callee ? { name: d.callee.name, instance: `${inst.tag}${inst.comp.get(n.index)}` } : null, id: idOf(inst, n, d, data), input: d.input && !data, args, extra: extraOf(inst, n, d),
        outputs: d.outData.map((o) => ({ pin: pinRef(OUT_PARAM, o.index, o.name), key: o.key, type: o.type, dict: o.dict, name: null, global: false, uses: 0 })),
      };
    }

    // 4. the cases
    function buildCase(ex) {
      const { inst, n, d } = ex;
      const st = { data: [], memo: new Map(), visiting: new Set(), recs: [], count: 0, bodies: new Set() };
      const call = callOf(inst, n, d, st, { event: d.event });
      if (d.callee) call.outputs = []; // its data pins are read through the composite's own data chain
      for (const o of call.outputs) { o.name = ex.globals.get(o.pin.index) ?? null; o.global = true; }
      nameLocals(st);

      const behavior = behaviorOf(inst.gi, n);
      // a flow output the node does not leave through (a composite's output its body never reaches) is wired to nothing that runs
      const next = d.outFlow.filter((p) => behavior.pins.includes(p.index)).map((p) => ({ pin: pinRef(OUT_FLOW, p.index, p.name), label: p.key, targets: flowTargets(inst, n.index, p.index) }));
      const terminal = !next.some((b) => b.targets.length);
      const ports = inst.parent ? [] : [...inst.gi.inFlowPorts].filter(([, list]) => list.some((m) => m.node === n.index)).map(([ext]) => {
        const pin = externalPin(inst.gi, IN_FLOW, ext);
        return { pin, label: flowLabel(pin.name) || String(ext) };
      });
      // the calling case is entered by the events inside the composite too, each under the id of the call followed by the id of the event
      const events = d.callee?.body ? eventsOf(d.callee.body, inst.stack).map((e) => `${ex.id}.${e}`) : [];
      caseBodies.set(ex, st.bodies);
      return {
        id: ex.id, kind: d.callee ? 'composite' : d.event ? 'event' : d.end ? 'end' : terminal ? 'terminal' : 'execution', event: d.event,
        flow: flowOf(d, behavior), callers: null, node: call.node, via: inst.via,
        ports, events, unreachable: false, data: st.data, call, next,
      };
    }
    /**
     * The pins of a composite whose body is shown on its own: its data inputs (read in the body as `$.in.Name`) and its data outputs, each the expression
     * inside that stands for it, with the data nodes the expressions need.
     */
    function interfaceOf() {
      const f = root.gi.decl?.iface;
      if (!f) return null;
      const backend = f.id?.shell && SERVER_SERVICES.includes(f.id.shell.service) ? 1 : 2;
      const typeOf = (p) => typeWord(p.type?.shell != null ? typeName(backend, p.type.shell) : 'Unk');
      const dictOf = (p) => (p.type?.mapKey != null ? dictOfNames(typeName(backend, p.type.mapKey), typeName(backend, p.type.mapValue)) : null);
      const st = { data: [], memo: new Map(), visiting: new Set(), recs: [], count: 0, bodies: new Set() };
      const keys = root.gi.keys;
      const inputs = f.inputs.map((p) => ({ pin: pinRef(IN_PARAM, p.index, p.name || null), key: keys.inputs.get(p.index), type: typeOf(p), dict: dictOf(p) }));
      const outputs = f.outputs.map((p) => {
        const at = root.gi.outDataPorts.get(p.index);
        return { pin: pinRef(OUT_PARAM, p.index, p.name || null), key: keys.outputs.get(p.index), type: typeOf(p), dict: dictOf(p), expr: at ? outputExpr(root, at.node, at.pin, st) : null };
      });
      nameLocals(st);
      faceBodies = st.bodies;
      return { inputs, data: st.data, outputs };
    }
    /**
     * The data nodes no case writes and no output of a composite is made of, as chains: the node that comes last of the longest chain of data wires among the
     * nodes left is written by itself (nothing reads it, so it assigns nothing), behind the data nodes it needs that are not written yet; then the search is
     * made again, until every node is written. A composite call needs all of its inputs, whatever its body does with them. Null when nothing is left.
     */
    function orphanChains() {
      let left = datas.filter((x) => !printed.has(x.key));
      if (!left.length) return null;
      const providers = new Map(); // key -> the keys of the data nodes of the same instance that its inputs are wired to
      for (const x of datas) {
        if (providers.has(x.key)) continue;
        for (const e of x.inst.gi.g.edges) if (e.from.kind === OUT_PARAM && e.to.kind === IN_PARAM) {
          const to = `${x.inst.key}/${e.to.node}`, from = `${x.inst.key}/${e.from.node}`;
          if (!providers.has(to)) providers.set(to, new Set());
          if (to !== from) providers.get(to).add(from);
        }
        if (!providers.has(x.key)) providers.set(x.key, new Set());
      }
      const st = { data: [], memo: new Map(), visiting: new Set(), recs: [], count: 0, bodies: new Set() };
      const chains = [];
      while (left.length) {
        const inLeft = new Set(left.map((x) => x.key)), depth = new Map(), open = new Set(), read = new Set();
        const deep = (key) => {
          if (depth.has(key)) return depth.get(key);
          if (open.has(key)) return 0; // a data loop
          open.add(key);
          let longest = 0;
          for (const p of providers.get(key) ?? []) if (inLeft.has(p)) { read.add(p); longest = Math.max(longest, deep(p)); }
          open.delete(key);
          depth.set(key, longest + 1);
          return longest + 1;
        };
        for (const x of left) deep(x.key);
        const ends = left.filter((x) => !read.has(x.key));
        let best = null;
        for (const x of ends.length ? ends : left) if (!best || depth.get(x.key) > depth.get(best.key)) best = x;
        const before = st.data.length;
        st.visiting.add(best.key);
        const call = callOf(best.inst, best.n, best.d, st, { data: true });
        st.visiting.delete(best.key);
        st.memo.set(best.key, new Map());
        printed.add(best.key);
        chains.push({ data: st.data.slice(before), call });
        st.data.push(call);
        left = left.filter((x) => !printed.has(x.key));
      }
      nameLocals(st);
      return chains;
    }
    const cases = execs.map(buildCase);
    // what a composite hands out reads the outputs of its execution nodes too, so it is built before the reads are counted
    const face = g.kind === COMPOSITE_BODY_KIND ? interfaceOf() : null;
    const orphans = orphanChains();
    // the output of an execution node is read by cases anywhere in the graph, so it is counted once all of them are built
    cases.forEach((c, i) => { for (const o of c.call.outputs) o.uses = execs[i].reads.get(o.pin.index) ?? 0; });

    // who sends the flow to a case: the nodes whose flow outputs are wired to it (a case that is entered by an event has none to name)
    const callersOf = new Map();
    for (const c of cases) for (const b of c.next) for (const t of b.targets) {
      if (t.exit) continue;
      const list = callersOf.get(t.id) ?? callersOf.set(t.id, []).get(t.id);
      if (!list.some((x) => x.id === c.id)) list.push({ id: c.id, function: c.call.function });
    }
    // a composite that has events inside is entered by them, as an event is: without callers it has none to list
    cases.forEach((c) => { c.callers = c.event || (c.events.length && !callersOf.get(c.id)?.length) ? null : callersOf.get(c.id) ?? []; });

    // the order of the cases: what the flow reaches from each entry point (an event, or a composite with events inside; a composite body's flow inputs
    // after them), depth first in the order of the pins and wires, so that a case is mostly followed by the one it jumps to. What no entry point reaches
    // follows: first what nothing is wired to, then, if cycles are left, whatever comes first.
    const byId = new Map(cases.map((c) => [c.id, c]));
    const ordered = [], seen = new Set();
    const run = (start, unreachable) => {
      const stack = [start];
      while (stack.length) {
        const c = stack.pop();
        if (seen.has(c.id)) continue;
        seen.add(c.id); c.unreachable = unreachable; ordered.push(c);
        const next = c.next.flatMap((b) => b.targets).filter((t) => !t.exit).map((t) => byId.get(t.id)).filter(Boolean);
        for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]);
      }
    };
    for (const c of cases) if (c.event || c.kind === 'end' || c.events.length) run(c, false);
    for (const c of cases) if (c.ports.length) run(c, false);
    for (const c of cases) if (!seen.has(c.id) && !callersOf.has(c.id)) run(c, true);
    for (const c of cases) if (!seen.has(c.id)) run(c, true);
    const bodiesOf = new Map(cases.map((c, i) => [c, caseBodies.get(execs[i])]));

    const composite = g.kind === COMPOSITE_BODY_KIND;
    /** How the flow leaves this composite: what its callers are written after (the labels are the strings the body returns or yields). */
    function bodyFlow() {
      const f = compositeFlow(res), keys = root.gi.keys?.outflows;
      return { type: f.type, pins: f.pins.map((p) => keys?.get(p) ?? String(p)), terminal: f.terminal };
    }
    const word = composite ? 'Composite' : SERVICE_WORD[g.service] ?? 'Graph';
    // a graph that is one expression ending in the graph's end node (a filter graph) needs no switch between cases
    const flat = cases.length === 1 && cases[0].kind === 'end' && !orphans;
    const ps = {
      tag: word, namespace: composite ? 'Composite' : SERVER_SERVICES.includes(g.service) ? 'ServerGraphs' : 'ClientGraphs', function: `${word}_${res.guid}`,
      flat, unreachable: false, flow: composite ? bodyFlow() : null, interface: face, cases: ordered, orphans,
    };
    uses.set(ps, { bodiesOf, faceBodies });
    return ps;
  }

  // ---- what the file makes use of -------------------------------------------------------------------------------------------------------------------
  // A graph that is not a composite body is run by its events. A composite body is run when reachable code enters one of its instances (flow, events inside)
  // or reads its data; what a body's own reachable cases use is in turn used, and so is what its outputs use.
  const built = new Map(), uses = new Map(); // graph resource -> pseudocode, pseudocode -> { bodiesOf, faceBodies }
  const buildOnce = (res) => { let ps = built.get(res); if (!ps) built.set(res, ps = build(res)); return ps; };
  let live = null;
  function liveBodies() {
    if (live) return live;
    live = new Set();
    const graphs = bundle.resources.filter((r) => r.kind === 'graph' && r.graph), byKey = new Map(graphs.map((r) => [r.gkey, r]));
    const scan = (ps, withFace) => {
      const u = uses.get(ps);
      for (const c of ps.cases) if (!c.unreachable) for (const b of u.bodiesOf.get(c)) add(b);
      if (withFace) for (const b of u.faceBodies) add(b);
    };
    const add = (gkey) => {
      if (live.has(gkey) || !byKey.has(gkey)) return;
      live.add(gkey);
      scan(buildOnce(byKey.get(gkey)), true);
    };
    for (const r of graphs) if (r.graph.kind !== COMPOSITE_BODY_KIND) scan(buildOnce(r), false);
    return live;
  }
  return function pseudocodeOf(res) {
    const ps = buildOnce(res);
    ps.unreachable = res.graph.kind === COMPOSITE_BODY_KIND && !liveBodies().has(res.gkey);
    return ps;
  };
}
