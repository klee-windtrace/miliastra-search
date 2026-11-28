// L4: reference index. Answers "where is X used?" across one or more bundles.
import { Resolver } from './resolve.mjs';
import { StaticResolver } from './staticres.mjs';
import { baseGraphName, graphLabel, taggedGraphLabel, pinTypeLabel } from './analyze.mjs';
import { S, graph, key as keySpan, T, Tjoin, toRich, graphRef, countEqual } from './present/doc.mjs';
import { typeName, pinKindName, variableTypeKey } from './model.mjs';
import { mountsOf } from './mounts.mjs';
import { host } from './host.mjs';

/** The bundled data/ref-rules.json; `extra` (the parsed data/overlay.json) may add `refRules.namedPins`. */
export function loadRules(extra) {
  const r = JSON.parse(host.data('data/ref-rules.json'));
  if (extra?.refRules?.namedPins) r.namedPins.push(...extra.refRules.namedPins);
  return r;
}

export const KINDS = ['graph_variable', 'custom_variable', 'timer', 'global_timer', 'signal', 'composite', 'struct', 'mount', 'node_type', 'literal_id'];

// Miliastra editor limits (as of game 7.1.0): at most this many signals / composite declarations per stage,
// this many nodes per graph (own + expanded composite calls) before the editor itself refuses to add more,
// and this many of each of these other resource classes.
export const LIMITS = { signals: 99, composites: 1000, nodesPerGraph: 3000 };
export const RESOURCE_LIMITS = {
  OBJECT: 1000, OBJECT_ENTITY: 3000, ENTITY_DEPLOYMENT_GROUP: 500, PRESET_POINT: 2000,
  ENVIRONMENT_CONFIGURATION: 50, CLASS: 100, UNIT_STATUS: 1000, SKILL: 100,
  TERRAIN_ENTITY: 1200, GLOBAL_TIMER: 50,
};
const RESOURCE_LIMIT_LABELS = { OBJECT: 'prefabs (OBJECT)', OBJECT_ENTITY: 'dynamic entities (OBJECT_ENTITY)' };
/**
 * Which kind of identifier refers to which resource classes. The game has four id spaces; the same number can be the id of a resource in
 * each of them, so a literal id is only ever matched against the classes of ITS OWN space. The pin / variable type says which one it is
 * (`pinType`: the type name as shown in the dump). A class that is in no list is never matched by its guid: the game cannot refer to it
 * by id (a global timer or a camera is accessed by its name). Add new classes here.
 */
export const ID_SPACES = {
  // the stage and the players are entities too: a Gid can name any of them
  GUID: { pinType: 'Gid', classes: ['OBJECT_ENTITY', 'CREATION_ENTITY', 'GIL_LEVEL_ENTITY', 'GIL_PLAYER_ENTITY'] },
  PrefabID: { pinType: 'Pfb', classes: ['PROJECTILE', 'OBJECT', 'CREATION'] },
  // a plain integer (type Int) is only taken for an id when it is big, see the heuristic in buildRefs
  IntegerID: { pinType: 'Int', classes: ['SHOP_TEMPLATE', 'UNIT_TAG', 'SCAN_TAG', 'ENTITY_DEPLOYMENT_GROUP', 'INTERFACE_LAYOUT', 'UI_CONTROL_GROUP', 'ENVIRONMENT_CONFIGURATION', 'PATH', 'PRESET_POINT'] },
  ConfigurationID: { pinType: 'Cfg', classes: ['CLASS', 'SKILL', 'CONTROL_SKILL', 'CUSTOM_CREATION_SKILL', 'SKILL_VARIABLE', 'SKILL_RESOURCE', 'UNIT_STATUS', 'ITEM', 'VFX_TOOL', 'SHIELD'] },
};
const ID_SPACE_BY_PIN_TYPE = new Map(Object.values(ID_SPACES).map((sp) => [sp.pinType, new Set(sp.classes)]));
const COMPOSITE_BODY_KIND = 21002;
// whether `struct-never-used` is raised (see the check in buildRefs)
const STRUCT_NEVER_USED_REPORTED = false;
/** Key of the entry that stands for a "When … Changes/Triggered" listener reacting to every name. */
export const ANY_NAME_KEY = '* (listener for any name)';

const pinLbl = (k, i) => `${({ 1: 'in.flow', 2: 'out.flow', 3: 'in', 4: 'out', 5: 'meta.rpc', 6: 'meta.topic' })[k] || pinKindName(k)}#${i}`;
const PIN_KIND_BY_PREFIX = { in_flow: 1, out_flow: 2, in_param: 3, out_param: 4 };

/** Find a pin on node n given a rule-style "kind:index" descriptor (e.g. "in_param:2"). */
function findPin(n, descriptor) {
  if (!descriptor) return null;
  const [pfx, idx] = descriptor.split(':');
  const kindNum = PIN_KIND_BY_PREFIX[pfx];
  return n.pins.find((p) => p.kind === kindNum && p.index === Number(idx)) || null;
}

/**
 * The resources that literal ids might point at, by id space and guid: key `${pin type}:${guid}` -> { className, name } (see ID_SPACES). Graphs
 * are not in it. Every style of code that names what an id points at asks this index (`literalResource`).
 */
export function resourceGuidIndexOf(bundle) {
  const index = new Map();
  for (const rr of bundle.resources) {
    if (rr.guid == null || rr.kind === 'graph') continue;
    for (const [ty, classes] of ID_SPACE_BY_PIN_TYPE) {
      const key = `${ty}:${rr.guid}`;
      if (classes.has(rr.className) && !index.has(key)) index.set(key, { className: rr.className, name: rr.iface?.name || rr.struct?.name || rr.name || '' });
    }
  }
  return index;
}

/**
 * The resource a literal (a model value of a pin) points at, or null: a typed id (not an entity's), or a plain Int big enough to be taken for an id.
 * A list or struct is not looked into.
 */
export function literalResource(index, val) {
  const v = val?.k === 'poly' ? val.inner : val;
  if (!v || !v.set) return null;
  if (v.k === 'id' && v.v !== 0 && v.ty !== 'Ety') return index.get(`${v.ty}:${v.v}`) ?? null;
  if (v.k === 'int' && v.ty === 'Int' && Math.abs(v.v) > 1000000000) return index.get(`Int:${v.v}`) ?? null;
  return null;
}

/** The resource a literal id of pin type `ty` points at: only resources of a class of that id space count (see ID_SPACES). */
function resolveResourceName(resourceIndex, ty, guid) {
  const hit = resourceIndex.get(`${ty}:${guid}`);
  if (!hit) return null;
  return T`${S('className', hit.className)}:${S('key', JSON.stringify(hit.name).slice(1, -1))}`;
}

/**
 * Build the reference index and the lint findings of the given bundles. Returns { refs, findings, limits }.
 * refs: [{ file, kind, key, scope, graph, graphGuid, graphKindNum, node, nodeName, nodeId, pin, mode, role, note, ... }]
 * mode: literal | dynamic | unset | declaration | definition | usage
 * A name check found inside a composite body gets one copy per real calling graph (marked viaComposite), since an
 * exposed name is the caller's. The physical copy (rawCopy) is kept (--name and the JSON references) but left out of buildOverviewRows and
 * of the declared/used findings. Custom variables, timers and global timers whose name is fixed inside the body
 * (OWN_NAME_KINDS) are owned by the composite instead: one copy, attributed to the body.
 */
export function buildRefs(bundles, db, { rules = loadRules() } = {}) {
  const refs = [];
  const findings = [];
  const graphSizes = []; // { file, graph, nodes } effective node count (own + expanded composite calls) per real graph
  const ruleByNode = new Map();
  for (const r of rules.namedPins) { if (!ruleByNode.has(r.node)) ruleByNode.set(r.node, []); ruleByNode.get(r.node).push(r); }
  // Comment-based lint suppression (see ADVANCED.md, "Silencing a finding you accept"): a node whose comment contains the finding's `type` silences it.
  const suppressed = (comment, type) => !!comment && comment.includes(type);

  for (const b of bundles) {
    const R = new Resolver(b, db);
    const graphs = b.resources.filter((r) => r.kind === 'graph' && r.graph);
    const seen = new Map(), dup = new Set();
    for (const r of graphs) { const n = baseGraphName(r, R); if (seen.has(n)) dup.add(n); seen.set(n, 1); }
    const graphGuids = new Map(graphs.filter((r) => r.graph.kind !== COMPOSITE_BODY_KIND).map((r) => [r.guid, r]));
    const resourceGuidIndex = resourceGuidIndexOf(b);

    const SR = new StaticResolver(b, R, graphs);
    const add = (o) => refs.push({ file: b.file, node: null, nodeName: null, nodeId: null, pin: null, role: null, note: null, ...o });

    // ---- composite call graph (built before any pin is resolved) ----
    // A composite body behaves as if it were expanded into each graph that calls it, so a named-pin or listener check
    // made inside a body only has a meaning from one caller's point of view: callSitesOf lets attributionsFor() below
    // re-resolve each such check once per real call site, as if the composite were expanded there.
    // callersOf/calleesOf are the same graph without node indices, for effectiveNodeCount.
    let circularComposite = false;
    const bodyResByDeclGuid = new Map();
    for (const gr of graphs) if (gr.graph.kind === COMPOSITE_BODY_KIND) { const decl = R.declForBody(gr); if (decl) bodyResByDeclGuid.set(decl.guid, gr); }
    const callSitesOf = new Map();  // body graph guid -> [{ caller: GraphRes, nodeIdx }] (one entry per call site)
    const callersOf = new Map();    // body graph guid -> caller GraphRes[] (same data, for effectiveNodeCount)
    const calleesOf = new Map();    // caller graph guid -> body GraphRes[] (same data, for effectiveNodeCount)
    for (const gr of graphs) {
      for (const n of gr.graph.nodes) {
        const info = R.node(gr.graph, n);
        if (info.user?.iface?.category !== 1000) continue;
        const body = bodyResByDeclGuid.get(info.user.res.guid);
        if (!body) continue;
        if (!callSitesOf.has(body.guid)) callSitesOf.set(body.guid, []);
        callSitesOf.get(body.guid).push({ caller: gr, nodeIdx: n.index });
        if (!callersOf.has(body.guid)) callersOf.set(body.guid, []);
        callersOf.get(body.guid).push(gr);
        if (!calleesOf.has(gr.guid)) calleesOf.set(gr.guid, []);
        calleesOf.get(gr.guid).push(body);
      }
    }
    // Every real-graph call-frame-stack that reaches a given composite body, one array per call site (outermost
    // caller first), suitable for StaticResolver's `frames` option. A body with several call sites (including via
    // other composites, arbitrarily nested) yields several stacks; a body that is never called yields none.
    function callFrames(bodyGuid, stack) {
      if (stack.has(bodyGuid)) { circularComposite = true; return []; }
      const nextStack = new Set(stack); nextStack.add(bodyGuid);
      const out = [];
      for (const { caller, nodeIdx } of callSitesOf.get(bodyGuid) || []) {
        if (caller.graph.kind === COMPOSITE_BODY_KIND) for (const parent of callFrames(caller.guid, nextStack)) out.push([...parent, { gr: caller, nodeIdx }]);
        else out.push([{ gr: caller, nodeIdx }]);
      }
      return out;
    }
    // Every "perspective" from which to evaluate a check physically located in graph `r`: for a real graph, just
    // itself; for a composite body, one entry per real caller (frames set, for re-resolving pins/listeners as
    // that caller would see them) plus a `raw` entry (frames: [], owner: the body itself) kept only so the
    // physical node still has a ref for --name and JSON introspection; it is not used for findings or the overview (see
    // the graphKindNum === COMPOSITE_BODY_KIND checks below and in buildOverviewRows).
    function attributionsFor(r) {
      if (r.graph.kind !== COMPOSITE_BODY_KIND) return [{ frames: [], owner: r, raw: false }];
      const atts = callFrames(r.guid, new Set()).map((frames) => ({ frames, owner: frames[0].gr, raw: false }));
      atts.push({ frames: [], owner: r, raw: true });
      return atts;
    }
    // Raises stale-suppression-comment when `comment` mentions `type` but the finding's condition does not hold
    // (isViolation false): the annotation is stale. Callers skip the `raw` composite-body perspective.
    const staleSuppression = (comment, type, isViolation, node, nodeName, graphLabel, kind, key, messageWhenNot) => {
      if (isViolation || !suppressed(comment, type)) return;
      findings.push({ level: 'warn', type: 'stale-suppression-comment', kind, key, file: b.file, graph: graphLabel, message: T`${S('nodeIndex', `[${node}]`)} ${S('nodeName', nodeName)} in graph ${G(graphLabel)} has a comment mentioning ${S('findingType', type)}, but ${messageWhenNot} – the comment may be stale` });
    };

    // --- declarations / definitions ---
    for (const r of b.resources) {
      if (r.kind === 'struct' && r.struct) add({ kind: 'struct', key: r.struct.name, scope: b.file, graph: null, mode: 'definition', role: 'definition', note: `guid=${r.guid} fields=${r.struct.vars.map((v) => v.name).join('|')}` });
      if (r.kind === 'interface' && r.iface) {
        const f = r.iface;
        if (f.sendSignal) add({ kind: 'signal', key: f.sendSignal.name, scope: b.file, graph: null, mode: 'definition', role: `decl:send (guid ${r.guid})`, note: `params=${f.inputs.map((p) => p.name).join('|')}` });
        if (f.listenSignal) add({ kind: 'signal', key: f.listenSignal.name, scope: b.file, graph: null, mode: 'definition', role: `decl:listen (guid ${r.guid})`, note: `params=${f.outputs.map((p) => p.name).join('|')}` });
        if (f.category === 1000) add({ kind: 'composite', key: f.name || r.name, scope: `${b.file}#${r.guid}`, graph: null, mode: 'definition', role: 'definition', note: `guid=${r.guid}` });
        if (f.category === 1000) for (const p of [...f.inputs, ...f.outputs]) if (p.type?.structId) add({ kind: 'struct', key: R.structName(p.type.structId) ?? `<struct#${p.type.structId}>`, scope: b.file, graph: null, mode: 'usage', role: 'declared-pin-type', note: `${f.name || r.name} pin "${p.name}"` });
      }
      if (r.kind === 'struct' && r.struct) for (const v of r.struct.vars) if (v.refStructId) add({ kind: 'struct', key: R.structName(v.refStructId) ?? `<struct#${v.refStructId}>`, scope: b.file, graph: null, mode: 'usage', role: 'field-type', note: `${r.struct.name}.${v.name}` });
    }

    // --- graph mounts: which graph is attached to which prefab / entity / template / class / status ---
    // key = the graph's plain name (so --name works), graphTagged = the label with its <class>/<status>/... tag for display.
    for (const m of mountsOf(b)) {
      const key = m.graph ? graphLabel(m.graph, dup, R) : `graph#${m.guid}`;
      // order = where the graph stands in the (editor-ordered) resource list; a mount of a missing graph goes last
      const order = bundles.indexOf(b) * 1e6 + (m.graph ? b.resources.indexOf(m.graph) : 1e6 - 1);
      add({ kind: 'mount', key, order, graphTagged: m.graph ? taggedGraphLabel(m.graph, dup, R) : key, scope: b.file, graph: null, mode: 'usage', role: m.slot,
        hostClass: m.host.className, hostName: m.host.name, hostGuid: m.host.guid, note: m.graph ? null : `no graph with guid ${m.guid} (service ${m.service}) in this file` });
    }

    for (const r of graphs) {
      const g = r.graph, gl = taggedGraphLabel(r, dup, R);
      const gctx = { graph: gl, graphGuid: r.guid, graphKindNum: g.kind, graphClass: r.className };
      // graph variable declarations
      for (const v of g.variables) {
        add({ ...gctx, kind: 'graph_variable', key: v.name, scope: `${b.file}#${r.gkey}`, mode: 'declaration', role: 'declaration', varType: typeName(1, v.typeId), note: `type=${typeName(1, v.typeId)} public=${v.isPublic}` });
        if (v.structId) add({ ...gctx, kind: 'struct', key: R.structName(v.structId) ?? `<struct#${v.structId}>`, scope: b.file, mode: 'usage', role: 'graph-variable-type', note: `variable ${v.name}` });
      }
      for (const a of g.affiliations) if (a.structId) add({ ...gctx, kind: 'struct', key: R.structName(a.structId) ?? `<struct#${a.structId}>`, scope: b.file, mode: 'usage', role: 'graph-affiliation' });

      const nodeInfo = new Map(g.nodes.map((n) => [n.index, R.node(g, n)]));
      for (const n of g.nodes) {
        const info = nodeInfo.get(n.index);
        const nctx = { ...gctx, node: n.index, nodeName: info.name, nodeId: info.shellId, nodeComment: n.comment || null };
        // node type
        if (!info.user) add({ ...nctx, kind: 'node_type', key: `${info.name} (${info.shellId})`, scope: 'global', mode: 'usage', role: 'instance', note: info.unresolved ? 'unresolved-name' : null });
        // Multiple Branches with the same value twice in its case list: the game then always takes the Default
        // branch and never compares (breaks at runtime). Reported once, on the graph that physically holds the node
        // (for a composite that is the composite, not every caller).
        if (info.branchValues) {
          const seenVals = new Set(), dups = [];
          for (const v of info.branchValues) { if (seenVals.has(v) && !dups.includes(v)) dups.push(v); seenVals.add(v); }
          const key = `${info.name} (${info.shellId})`;
          if (dups.length && !suppressed(n.comment, 'duplicate-branch-value')) {
            findings.push({ level: 'warn', type: 'duplicate-branch-value', kind: 'node_type', key, file: b.file, graph: gl,
              message: T`${S('nodeIndex', `[${n.index}]`)} ${S('nodeName', info.name)} in graph ${G(gl)} lists the same case value more than once (${Tjoin(dups.map((v) => T`${S('string', v === null ? '?' : v)}`), ', ')}): the node then always takes the Default branch and never compares` });
          }
          staleSuppression(n.comment, 'duplicate-branch-value', dups.length > 0, n.index, info.name, gl, 'node_type', key, 'the case list has no duplicate values');
        }
        // user-defined nodes
        if (info.user) {
          const f = info.user.iface;
          if (f.sendSignal || f.listenSignal) {
            const role = f.sendSignal ? 'send' : 'listen';
            const key = (f.sendSignal || f.listenSignal).name;
            // Attributed per real caller too (see attributionsFor above) – wrapping a send/listen node in a
            // composite does not make it look like it belongs to the composite instead of the real graph.
            for (const att of attributionsFor(r)) {
              const aGl = att.raw ? gl : taggedGraphLabel(att.owner, dup, R);
              add({ ...nctx, graph: aGl, graphGuid: att.owner.guid, graphKindNum: att.owner.graph.kind, graphClass: att.owner.className, ...(att.raw ? { rawCopy: true } : { viaComposite: [gl] }), kind: 'signal', key, scope: b.file, mode: 'literal', role });
            }
          }
          else if (f.category === 1000) add({ ...nctx, kind: 'composite', key: f.name || info.user.res.name, scope: `${b.file}#${info.user.res.guid}`, mode: 'usage', role: 'call', declGuid: info.user.res.guid, note: `guid=${info.user.res.guid}` });
          const sid = f.assembleStruct ?? f.splitStruct ?? f.modifyStruct;
          if (sid != null) add({ ...nctx, kind: 'struct', key: R.structName(sid) ?? `<struct#${sid}>`, scope: b.file, mode: 'usage', role: f.assembleStruct != null ? 'assemble' : f.splitStruct != null ? 'split' : 'modify' });
        }
        for (const u of n.usingStructs) if (u) add({ ...nctx, kind: 'struct', key: R.structName(u.guid ?? u.id) ?? `<struct#${u.guid ?? u.id}>`, scope: b.file, mode: 'usage', role: 'using-declaration' });
        // event nodes ("When … Changes/Triggered"): the name only exists as an output pin, so follow the execution
        // chain to see whether the listener is a pure name switch (strict) or also has a catch-all path. When the
        // node sits inside a composite body, this is evaluated once per real caller (see attributionsFor above),
        // since a value fed through a composite input port can be a different literal at each call site.
        const ev = rules.eventNodesWithNameOutput?.[String(info.shellId)];
        if (ev) {
          const namePin = rules.eventNamePins?.[String(info.shellId)];
          if (namePin == null) add({ ...nctx, kind: ev, key: ANY_NAME_KEY, scope: ev === 'graph_variable' ? `${b.file}#${r.gkey}` : 'global', mode: 'dynamic', role: 'listen' });
          else for (const att of attributionsFor(r)) {
            // A handler whose name is fixed inside the composite body (not the caller's choice) is the composite's own, like a variable or
            // timer name there: it is listed once, under the body, and left out of the per-caller copies. Catch-alls and names that come
            // through an exposed port stay with the callers.
            const ownKinds = r.graph.kind === COMPOSITE_BODY_KIND && OWN_NAME_KINDS.has(ev);
            const ownKey = (h) => `${h.detail}\u0000${h.name}`;
            const own = ownKinds ? new Set(SR.analyzeListener(r, n.index, namePin, []).handlers.filter((h) => h.name != null).map(ownKey)) : new Set();
            const aGl = att.raw ? gl : taggedGraphLabel(att.owner, dup, R);
            const lscope = ev === 'graph_variable' ? `${b.file}#${att.owner.gkey}` : 'global';
            const actx = { ...nctx, graph: aGl, graphGuid: att.owner.guid, graphKindNum: att.owner.graph.kind, graphClass: att.owner.className, ...(att.raw ? { rawCopy: true } : { viaComposite: [gl] }) };
            const an = SR.analyzeListener(r, n.index, namePin, att.frames);
            for (const h of an.handlers) {
              if (!att.raw && own.has(ownKey(h))) continue; // listed under the composite itself
              const via = h.via.length ? T`; resolved via ${Tjoin(h.via, ' <- ')}` : '';
              const hctx = att.raw && own.has(ownKey(h)) ? { ...actx, rawCopy: false } : actx;
              if (h.name != null) add({ ...hctx, kind: ev, key: h.name, scope: lscope, mode: 'literal', role: 'listen', varType: ev === 'graph_variable' ? (att.owner.graph.variables.find((v) => v.name === h.name) ? typeName(1, att.owner.graph.variables.find((v) => v.name === h.name).typeId) : null) : null, pin: 'name switch', note: T`${h.detail}${via}`, ...(h.via.length ? { resolvedVia: h.via } : {}) });
              else {
                add({ ...actx, kind: ev, key: '<dynamic>', scope: lscope, mode: 'dynamic', role: 'listen', pin: 'name switch', note: h.detail });
                if (!att.raw && !suppressed(n.comment, 'dynamic-reference')) findings.push({ level: 'info', type: 'dynamic-reference', kind: ev, key: '<dynamic>', file: b.file, graph: aGl, message: T`${S('nodeIndex', `[${n.index}]`)} ${S('nodeName', info.name)} name switch in graph ${G(aGl)}: name is computed at runtime (${h.detail}); cannot be resolved statically` });
              }
            }
            if (!att.raw) staleSuppression(n.comment, 'dynamic-reference', !an.handlers.some((h) => h.name == null), n.index, info.name, aGl, ev, '<dynamic>', 'every handler now resolves statically');
            if (an.catchAll) {
              add({ ...actx, kind: ev, key: ANY_NAME_KEY, scope: lscope, mode: 'dynamic', role: 'listen', note: an.catchAll.reason });
              if (!att.raw && !suppressed(n.comment, 'catch-all-listener')) findings.push({ level: 'info', type: 'catch-all-listener', kind: ev, key: ANY_NAME_KEY, file: b.file, graph: aGl, message: T`${S('nodeIndex', `[${n.index}]`)} ${S('nodeName', info.name)} in graph ${G(aGl)} also runs code for every name: ${an.catchAll.reason}` });
            } else if (!an.handlers.length) {
              if (!att.raw && !suppressed(n.comment, 'listener-no-handlers')) findings.push({ level: 'info', type: 'listener-no-handlers', kind: ev, key: ANY_NAME_KEY, file: b.file, graph: aGl, message: T`${S('nodeIndex', `[${n.index}]`)} ${S('nodeName', info.name)} in graph ${G(aGl)} has no name switch and no code after it: it reacts to nothing` });
            }
            if (!att.raw) {
              staleSuppression(n.comment, 'catch-all-listener', !!an.catchAll, n.index, info.name, aGl, ev, ANY_NAME_KEY, 'no catch-all codepath was found');
              staleSuppression(n.comment, 'listener-no-handlers', !an.handlers.length && !an.catchAll, n.index, info.name, aGl, ev, ANY_NAME_KEY, an.catchAll ? 'it has a catch-all codepath' : `it has ${an.handlers.length} handler(s)`);
            }
          }
        }
        // named pins: re-resolved once per real caller when the node sits inside a composite body (see above).
        for (const rule of ruleByNode.get(info.shellId) || []) {
          const [pk, pi] = rule.pin.split(':'); const kindNum = { in_param: 3 }[pk]; const pinIdx = Number(pi);
          // A pin fully delegated to a composite port (no local wire *or* default left on the physical node once
          // it's exposed externally) has no entry in `n.pins` at all – resolvePin runs on its index regardless.
          const pin = n.pins.find((p) => p.kind === kindNum && p.index === pinIdx);
          const pl = pinLbl(kindNum, pinIdx);
          const nm = R.pinName(info, pin || { kind: kindNum, index: pinIdx, uid: null }).name;
          // Extra metadata: the variable's datatype (from valuePin), and the Trigger Event (triggerPin) and Start Timer
          // Loop (loopPin) booleans, which are evaluated per caller below because either pin may be a composite input port.
          const valuePin = rule.valuePin ? findPin(n, rule.valuePin) : null;
          // A pin missing from the file is a default one, but the node's variant (kernel id) states the datatype too: "C<T:Int>".
          const variantType = /^C<T:(.+)>$/.exec(info.variant ?? '')?.[1] ?? null;
          const extra = { varType: rule.valuePin ? ((valuePin ? pinTypeLabel(valuePin, g) : null) ?? variantType) : null };
          const boolPinIdx = (d) => Number(d.split(':')[1]);
          const pinTxt = T`${S('pinLabel', pl)}${nm ? T` ${S('pinName', nm)}` : ''}`;
          let atts = attributionsFor(r);
          // A name fixed inside the composite body itself (not an exposed port, so not the caller's choice) belongs to the composite:
          // such a body may keep its own variables / timers on entities, which must not show up as the callers' (see OWN_NAME_KINDS).
          if (r.graph.kind === COMPOSITE_BODY_KIND && OWN_NAME_KINDS.has(rule.kind) && SR.resolvePin(r, n.index, pinIdx, { frames: [] })?.kind === 'value') {
            atts = [{ frames: [], owner: r, raw: false, own: true, callerFrames: atts.filter((a) => !a.raw).map((a) => a.frames) }];
          }
          // Boolean pins of such a body may still be exposed: look at every caller and keep the answer only if they all agree.
          const boolAcross = (att, idx) => {
            if (!att.own || !att.callerFrames.length) return SR.resolveBool(r, n.index, idx, { frames: att.frames });
            const all = att.callerFrames.map((frames) => SR.resolveBool(r, n.index, idx, { frames }));
            return all.every((x) => x === all[0]) ? all[0] : all.includes('true') ? 'true' : 'dynamic';
          };
          for (const att of atts) {
            const aGl = att.raw ? gl : taggedGraphLabel(att.owner, dup, R);
            const scope = rule.kind === 'graph_variable' ? `${b.file}#${att.owner.gkey}` : 'global';
            // No stored pin (on the node, or on the call site of an exposed port) means the pin's default (see ref-rules.json).
            const trigger = rule.triggerPin
              ? boolAcross(att, boolPinIdx(rule.triggerPin)) ?? (rule.triggerDefault != null ? String(rule.triggerDefault) : null)
              : null;
            const loop = rule.loopPin ? boolAcross(att, boolPinIdx(rule.loopPin)) : null;
            const actx = { ...nctx, ...extra, trigger, loop, graph: aGl, graphGuid: att.owner.guid, graphKindNum: att.owner.graph.kind, graphClass: att.owner.className, ...(att.raw ? { rawCopy: true } : att.own ? {} : { viaComposite: [gl] }) };
            // Statically follow wires through proxy nodes (local vars, graph vars, composites) – see staticres.mjs.
            const res = SR.resolvePin(r, n.index, pinIdx, { frames: att.frames });
            if (res && res.kind === 'value') {
              // sparse pins: an unwired-out Get node carries no type, so fall back to the graph variable's declared type
              const dv = rule.kind === 'graph_variable' && !extra.varType ? att.owner.graph.variables.find((v) => v.name === res.v) : null;
              const varType = dv ? typeName(1, dv.typeId) : extra.varType;
              add({ ...actx, varType, kind: rule.kind, key: res.v, scope, pin: pinTxt, mode: 'literal', role: rule.role, ...(res.via.length ? { resolvedVia: res.via, note: T`resolved statically via ${Tjoin(res.via, ' <- ')}` } : {}) });
              if (!att.raw) staleSuppression(n.comment, 'dynamic-reference', false, n.index, info.name, aGl, rule.kind, '<dynamic>', 'the name is now resolved statically');
            } else if (res && res.kind === 'dynamic') {
              const c = pin?.conns[0];
              const wiredNote = c ? T`wired from ${S('nodeIndex', `[${c.node}]`)} ${S('nodeName', nodeInfo.get(c.node)?.name ?? '?')}; ${res.reason}` : res.reason;
              add({ ...actx, kind: rule.kind, key: '<dynamic>', scope, pin: pinTxt, mode: 'dynamic', role: rule.role, note: wiredNote });
              if (!att.raw && !suppressed(n.comment, 'dynamic-reference')) findings.push({ level: 'info', type: 'dynamic-reference', kind: rule.kind, key: '<dynamic>', file: b.file, graph: aGl, message: T`${S('nodeIndex', `[${n.index}]`)} ${S('nodeName', info.name)}${pinTxt ? T` ${pinTxt}` : ''} in graph ${G(aGl)}: name is computed at runtime (${wiredNote}); cannot be resolved statically` });
            } else {
              add({ ...actx, kind: rule.kind, key: '<unset>', scope, pin: pin?.conns.length ? pinTxt : `${pl}`, mode: 'unset', role: rule.role, ...(res?.reason ? { note: res.reason } : {}) });
              if (!att.raw) staleSuppression(n.comment, 'dynamic-reference', false, n.index, info.name, aGl, rule.kind, '<dynamic>', 'the pin is unset rather than dynamic');
            }
          }
        }
        // literal IDs (typed id: Cfg/Pfb/Gid/Fct/…) and big plain-Int literals that happen to be a resource guid
        const walkVal = (val, pl) => {
          if (!val) return;
          if (val.k === 'poly') return walkVal(val.inner, pl);
          if (val.k === 'list') return val.items.forEach((i) => walkVal(i, pl));
          if (val.k === 'struct') return val.items.forEach((i) => walkVal(i, pl));
          if (val.k === 'map') return val.pairs.forEach((i) => walkVal(i, pl));
          if (val.k === 'pair') { walkVal(val.key, pl); walkVal(val.value, pl); return; }
          if (val.k === 'id' && val.set && val.v !== 0 && val.ty !== 'Ety') {
            const tgt = graphGuids.get(val.v);
            // only the id spaces of ID_SPACES are matched against resources (a "Fct" faction id is a small ordinal, for one)
            const resolvedName = resolveResourceName(resourceGuidIndex, val.ty, val.v);
            add({ ...nctx, kind: 'literal_id', key: `${val.ty || 'id'}:${val.v}`, scope: 'global', pin: pl, mode: 'literal', role: 'Ref', resolvedName, note: tgt ? T`matches guid of graph ${G(taggedGraphLabel(tgt, dup, R))} in this file` : null });
          }
          if (val.k === 'int' && val.set && val.ty === 'Int' && Math.abs(val.v) > 1000000000) {
            const resolvedName = resolveResourceName(resourceGuidIndex, 'Int', val.v);
            if (resolvedName) add({ ...nctx, kind: 'literal_id', key: `Int: ${val.v}`, scope: 'global', pin: pl, mode: 'literal', role: 'Ref', resolvedName });
          }
        };
        for (const p of n.pins) {
          const nm = R.pinName(info, p).name;
          walkVal(p.value, T`${S('pinLabel', pinLbl(p.kind, p.index))}${nm ? T` ${S('pinName', nm)}` : ''}`);
          if (p.value) { const struct = p.value.k === 'struct' ? p.value.structId : (p.value.k === 'poly' ? p.value.inner?.structId : p.value.structId); if (struct) add({ ...nctx, kind: 'struct', key: R.structName(struct) ?? `<struct#${struct}>`, scope: b.file, mode: 'usage', role: 'pin-value', pin: pinLbl(p.kind, p.index) }); }
        }
      }
    }

    // Effective (own + expanded composite calls) node count, real graphs only, using the call graph built up
    // front – composite bodies are capped separately (see "composites: N/1000" in the limits section) and
    // not listed here on their own. Calling a composite twice (directly, or via an outer composite called
    // twice) counts its contents twice.
    function effectiveNodeCount(gr, stack) {
      if (stack.has(gr.guid)) { circularComposite = true; return 0; }
      const nextStack = new Set(stack); nextStack.add(gr.guid);
      let total = gr.graph.nodes.length;
      for (const callee of calleesOf.get(gr.guid) || []) total += effectiveNodeCount(callee, nextStack);
      return total;
    }
    for (const gr of graphs) if (gr.graph.kind !== COMPOSITE_BODY_KIND) graphSizes.push({ file: b.file, graph: taggedGraphLabel(gr, dup, R), nodes: effectiveNodeCount(gr, new Set()) });
    if (circularComposite) findings.push({ level: 'warn', type: 'composite-circular-call', kind: 'composite', key: '?', file: b.file, message: 'a circular composite call chain was detected in this file; graph-variable attribution and effective node counts for the graphs involved may be incomplete (composites are not expected to call themselves, directly or indirectly)' });
  }

  // ---- findings ----
  // graph variables: per graph. Composite-body scopes are skipped entirely – composites cannot declare graph
  // variables (the copies attributed to the calling graphs already carry the real owning graph's scope).
  const gvScopes = new Set(refs.filter((r) => r.kind === 'graph_variable' && r.graphKindNum !== COMPOSITE_BODY_KIND).map((r) => r.scope));
  for (const sc of gvScopes) {
    const rs = refs.filter((r) => r.kind === 'graph_variable' && r.scope === sc);
    const declared = new Set(rs.filter((r) => r.mode === 'declaration').map((r) => r.key));
    const used = new Set(rs.filter((r) => r.mode === 'literal').map((r) => r.key));
    const hasDyn = rs.some((r) => r.mode === 'dynamic' && r.key === '<dynamic>');
    const hasListener = rs.some((r) => r.key === ANY_NAME_KEY);
    const g = rs.find((r) => r.mode === 'declaration') || rs[0];
    for (const d of declared) if (!used.has(d)) findings.push({ level: 'info', type: 'declared-but-unused', kind: 'graph_variable', key: d, file: g.file, graph: g.graph, message: T`graph variable ${S('key', d)} in graph ${G(g.graph)} is declared but no node references it by literal name${hasDyn ? ' (graph also has dynamic-name accesses, so it may still be used)' : ''}${hasListener && !hasDyn ? T` (a ${S('nodeName', 'When Node Graph Variable Changes')} listener exists)` : ''}` });
    // used-but-undeclared: comment-suppressible on whichever node(s) referenced the undeclared name.
    for (const u of used) {
      const litRefs = rs.filter((r) => r.mode === 'literal' && r.key === u);
      const anySuppressed = litRefs.some((r) => suppressed(r.nodeComment, 'used-but-undeclared'));
      if (!declared.has(u)) { if (!anySuppressed) findings.push({ level: 'warn', type: 'used-but-undeclared', kind: 'graph_variable', key: u, file: g.file, graph: g.graph, message: T`graph variable ${S('key', u)} is referenced in graph ${G(g.graph)} but not declared there` }); }
      else if (anySuppressed) findings.push({ level: 'warn', type: 'stale-suppression-comment', kind: 'graph_variable', key: u, file: g.file, graph: g.graph, message: T`graph variable ${S('key', u)} in graph ${G(g.graph)} has a comment mentioning ${S('findingType', 'used-but-undeclared')}, but it is declared there – the comment may be stale` });
    }
  }
  // signals: cross-graph within scanned set, per file. Comment-suppressible on the sending node(s) (for
  // signal-sent-never-listened) / listening node(s) (for signal-listened-never-sent).
  // Raw physical copies (rawCopy) are for --name and the JSON references only and must not double-count here alongside their per-caller attributed copies.
  const notRawComposite = (r) => !r.rawCopy;
  const sigKeys = new Set(refs.filter((r) => r.kind === 'signal' && notRawComposite(r)).map((r) => r.scope + '\u0000' + r.key));
  for (const sk of sigKeys) {
    const [sc, key] = sk.split('\u0000');
    const rs = refs.filter((r) => r.kind === 'signal' && r.scope === sc && r.key === key && notRawComposite(r));
    const sendRefs = rs.filter((r) => r.role === 'send'), listenRefs = rs.filter((r) => r.role === 'listen');
    const sentSuppressed = sendRefs.some((r) => suppressed(r.nodeComment, 'signal-sent-never-listened'));
    const listenedSuppressed = listenRefs.some((r) => suppressed(r.nodeComment, 'signal-listened-never-sent'));
    if (sendRefs.length && !listenRefs.length) { if (!sentSuppressed) findings.push({ level: 'warn', type: 'signal-sent-never-listened', kind: 'signal', key, file: sc, message: T`signal ${S('key', key)} is sent ${S('count', sendRefs.length)}x (from ${fmtGraphList(sendRefs)}) but no listener exists in the scanned graphs` }); }
    else if (sentSuppressed) findings.push({ level: 'warn', type: 'stale-suppression-comment', kind: 'signal', key, file: sc, message: T`signal ${S('key', key)} has a comment mentioning ${S('findingType', 'signal-sent-never-listened')}, but it is now listened to – the comment may be stale` });
    if (listenRefs.length && !sendRefs.length) { if (!listenedSuppressed) findings.push({ level: 'info', type: 'signal-listened-never-sent', kind: 'signal', key, file: sc, message: T`signal ${S('key', key)} has ${S('count', listenRefs.length)} listener(s) (in ${fmtGraphList(listenRefs)}) but is never sent in the scanned graphs` }); }
    else if (listenedSuppressed) findings.push({ level: 'warn', type: 'stale-suppression-comment', kind: 'signal', key, file: sc, message: T`signal ${S('key', key)} has a comment mentioning ${S('findingType', 'signal-listened-never-sent')}, but it is now sent – the comment may be stale` });
    if (!sendRefs.length && !listenRefs.length) findings.push({ level: 'info', type: 'signal-never-used', kind: 'signal', key, file: sc, message: T`signal ${S('key', key)} is declared but never sent or listened to in the scanned graphs` });
  }
  // composites: identity is the *name* (see buildOverviewRows) – any count of definitions other than exactly 1 is
  // a structural bug in the GIL/GIA (or in how this tool parsed it), reported here rather than in the main listing.
  const compNames = new Set(refs.filter((r) => r.kind === 'composite' && r.mode === 'definition').map((r) => r.key));
  for (const name of compNames) {
    const defs = refs.filter((r) => r.kind === 'composite' && r.mode === 'definition' && r.key === name);
    if (defs.length !== 1) findings.push({ level: 'warn', type: 'composite-definition-count-anomaly', kind: 'composite', key: name, file: defs[0].file, message: T`composite ${S('key', name)} has ${S('count', defs.length)} definition(s) in the scanned files (expected exactly 1) – ${defs.map((d) => d.note).join('; ')}; this points to a structural bug in the GIL/GIA or in how this tool parsed it` });
    if (!refs.some((r) => r.kind === 'composite' && r.key === name && r.mode === 'usage')) findings.push({ level: 'info', type: 'composite-never-called', kind: 'composite', key: name, file: defs[0].file, message: T`composite ${S('key', name)} is defined but never called in the scanned graphs` });
  }
  // `struct-never-used` is not reported (STRUCT_NEVER_USED_REPORTED): a struct can be used in places the graphs do not show, which this analysis does not
  // follow, so "no use found" is no evidence. The check stays for a more complete use analysis.
  for (const r of STRUCT_NEVER_USED_REPORTED ? refs.filter((x) => x.kind === 'struct' && x.mode === 'definition') : []) {
    if (!refs.some((x) => x.kind === 'struct' && x.file === r.file && x.key === r.key && x.mode === 'usage')) findings.push({ level: 'info', type: 'struct-never-used', kind: 'struct', key: r.key, file: r.file, message: T`struct ${S('key', r.key)} (${r.note}) is defined but never used in the scanned graphs` });
  }
  // dynamic-reference, catch-all-listener and listener-no-handlers are raised inline where they are discovered (the
  // event-node and named-pin blocks above), once per real caller and with comment-based suppression.
  // custom variables: the declarations of the entities and templates of a file against the names and datatypes the graphs use. A file without any entity or
  // template (a .gia of graphs only) declares nothing the graphs could be checked against, so it is left out.
  for (const b of bundles) {
    const owners = b.resources.filter((r) => r.variables);
    if (!owners.length) continue;
    const R = new Resolver(b, db);
    const declared = new Map(); // name -> [{ v, owner }]
    for (const owner of owners) for (const v of owner.variables) { if (!declared.has(v.name)) declared.set(v.name, []); declared.get(v.name).push({ v, owner }); }
    const typeMsg = (v) => T`${S('typeName', v.label)}${v.structId != null ? T` struct=${S('structName', R.structName(v.structId) ?? String(v.structId))}` : ''}`;
    const ownersMsg = (list) => { const names = [...new Set(list.map((d) => d.owner.name))]; return Tjoin([...names.slice(0, 3).map((n) => T`${S('declName', n)}`), ...(names.length > 3 ? [`+${names.length - 3} more`] : [])], ', '); };
    // the same name declared with different types: once per name
    for (const [name, list] of declared) {
      const byType = new Map();
      for (const d of list) { const k = variableTypeKey(d.v); if (!byType.has(k)) byType.set(k, []); byType.get(k).push(d); }
      if (byType.size < 2) continue;
      const parts = [...byType.values()].map((ds) => T`${typeMsg(ds[0].v)} on ${ownersMsg(ds)}`);
      findings.push({ level: 'info', type: 'custom-variable-type-conflict', kind: 'custom_variable', key: name, file: b.file, message: T`custom variable ${keySpan(name)} is declared with ${S('count', byType.size)} different types: ${Tjoin(parts, '; ')}` });
    }
    // the names the graphs use: no declaration at all, or no declaration of the datatype the node selects (the entity is only known at run time, so any declaration of that type will do)
    const used = new Map(); // name -> refs
    for (const r of refs) if (r.kind === 'custom_variable' && r.file === b.file && r.mode === 'literal' && r.key !== ANY_NAME_KEY && !r.rawCopy) { if (!used.has(r.key)) used.set(r.key, []); used.get(r.key).push(r); }
    for (const [name, rs] of used) {
      const decls = declared.get(name) || [], first = rs[0];
      const flag = (type, group, bad, message, stale) => {
        const suppressedHere = group.some((r) => suppressed(r.nodeComment, type));
        if (bad && !suppressedHere) findings.push({ level: 'info', type, kind: 'custom_variable', key: name, file: b.file, graph: first.graph, message });
        else if (!bad && suppressedHere) findings.push({ level: 'warn', type: 'stale-suppression-comment', kind: 'custom_variable', key: name, file: b.file, graph: first.graph, message: stale });
      };
      flag('custom-variable-undeclared', rs, !decls.length,
        T`custom variable ${keySpan(name)} is used in ${fmtGraphList(rs)} but no entity, prefab or template declares it`,
        T`custom variable ${keySpan(name)} has a comment mentioning ${S('findingType', 'custom-variable-undeclared')}, but it is declared – the comment may be stale`);
      const declTypes = new Set(decls.map((d) => d.v.type));
      for (const t of new Set(rs.map((r) => r.varType).filter(Boolean))) {
        const group = rs.filter((r) => r.varType === t);
        const bad = decls.length > 0 && !declTypes.has(t);
        const as = [...new Map(decls.map((d) => [variableTypeKey(d.v), d])).values()];
        flag('custom-variable-type-mismatch', group, bad,
          T`custom variable ${keySpan(name)} is accessed as ${S('typeName', t)} in ${fmtGraphList(group)}, but declared as ${Tjoin(as.map((d) => T`${typeMsg(d.v)} on ${ownersMsg(decls.filter((x) => variableTypeKey(x.v) === variableTypeKey(d.v)))}`), '; ')}`,
          T`custom variable ${keySpan(name)} accessed as ${S('typeName', t)} has a comment mentioning ${S('findingType', 'custom-variable-type-mismatch')}, but a declaration of that type exists – the comment may be stale`);
      }
    }
  }
  for (const gs of graphSizes) if (gs.nodes > LIMITS.nodesPerGraph) findings.push({ level: 'warn', type: 'graph-node-count-exceeded', kind: 'graph', key: gs.graph, file: gs.file, graph: gs.graph, message: T`graph ${G(gs.graph)} is at ${S('count', gs.nodes)}/${LIMITS.nodesPerGraph} effective nodes (own nodes + every expanded composite call), over the editor's hard limit` });

  // ---- limits (Miliastra editor caps) ----
  const compositeSlots = refs.filter((r) => r.kind === 'composite' && r.mode === 'definition').length;
  const signalNames = new Set(refs.filter((r) => r.kind === 'signal' && r.mode === 'definition').map((r) => r.key)).size;
  const resourceCounts = {};
  for (const b of bundles) for (const r of b.resources) if (RESOURCE_LIMITS[r.className] != null) resourceCounts[r.className] = (resourceCounts[r.className] || 0) + 1;
  const resourceLimits = Object.entries(RESOURCE_LIMITS).map(([className, max]) => ({ className, label: RESOURCE_LIMIT_LABELS[className] || className, used: resourceCounts[className] || 0, max }));
  // Static entities (STATIC_ENTITY, see gil.mjs) have no stage limit: they are only counted, not compared to a maximum.
  let staticEntities = 0;
  for (const b of bundles) for (const r of b.resources) if (r.className === 'STATIC_ENTITY') staticEntities++;
  const limits = {
    staticEntities,
    composites: { used: compositeSlots, max: LIMITS.composites },
    signals: { used: signalNames, max: LIMITS.signals },
    resources: resourceLimits,
    graphSizes: [...graphSizes].sort((a, b) => b.nodes - a.nodes),
  };

  return { refs, findings, limits };
}

/** Unique graph names referenced by a list of refs, in first-seen order. */
export function uniqGraphs(rs) {
  const seen = new Set(); const out = [];
  for (const r of rs) if (r.graph && !seen.has(r.graph)) { seen.add(r.graph); out.push(r.graph); }
  return out;
}
const fmtGraphList = (rs) => T`[${Tjoin(uniqGraphs(rs).map((n) => T`${G(n)}`), '; ')}]`;

/** A Set whose Trigger Event pin is not statically false (true, wired, or unreadable) fires the variable's change event. */
export const isTriggerRef = (r) => r.role === 'set' && r.trigger != null && r.trigger !== 'false';
/** The role as shown to the user: such a Set is a `trigger`, not a plain `set`. */
export const displayRole = (r) => (isTriggerRef(r) ? 'trigger' : r.role);

const G = (label) => graph(label); // a graph name inside a message
const GLOBAL_TIMER_ROLES = ['start', 'stop', 'pause', 'resume', 'modify', 'get-time', 'listen'];

// Kinds whose name can also be fixed inside a composite body itself (then the composite owns the reference; see buildRefs).
const OWN_NAME_KINDS = new Set(['custom_variable', 'timer', 'global_timer']);

// ---- the JSON form (see JSON.md): everything a renderer shows is in these objects, already resolved ----

/**
 * One reference of the index as a report item. Graph names are { tag, name } (see graphRef), texts that carry structure are rich texts
 * (see toRich), and every optional piece is present with null, so a reader never has to test for a missing key.
 */
export function referenceJson(r) {
  return {
    file: r.file,
    kind: r.kind,
    key: String(r.key),
    key_graph: r.kind === 'mount' ? graphRef(r.graphTagged) : null, // a mounted graph is keyed by its plain name; this is the same graph with its <tag>
    scope: r.scope ?? null,
    mode: r.mode,
    role: r.role ?? null,
    display_role: r.role ? displayRole(r) : null,
    var_type: r.varType ?? null,
    trigger: r.trigger ?? null,
    loop: r.loop ?? null,
    graph: r.graph ? graphRef(r.graph) : null,
    graph_guid: r.graphGuid ?? null,
    graph_class: r.graphClass ?? null,
    composite_body: r.graphKindNum === COMPOSITE_BODY_KIND,
    node: r.node != null ? { index: r.node, name: r.nodeName ?? null, id: r.nodeId ?? null, comment: r.nodeComment ?? null } : null,
    host: r.hostName != null ? { class_name: r.hostClass, name: r.hostName, guid: r.hostGuid ?? null } : null,
    pin: r.pin ? toRich(r.pin) : null,
    resolved: r.resolvedName ? toRich(r.resolvedName) : null,
    resolved_via: (r.resolvedVia ?? []).map(toRich),
    via_composite: (r.viaComposite ?? []).map(graphRef),
    raw_copy: !!r.rawCopy,
    note: r.note ? toRich(r.note) : null,
  };
}

/** One finding as a report item. */
export const findingJson = (f) => ({ level: f.level, type: f.type, kind: f.kind, key: String(f.key), file: f.file, graph: f.graph ? graphRef(f.graph) : null, message: toRich(f.message) });

/** The limits section; `topGraphs` = how many of the biggest graphs to keep. */
export function limitsJson(limits, topGraphs) {
  return {
    composites: { ...limits.composites },
    signals: { ...limits.signals },
    resources: limits.resources.map((x) => ({ class_name: x.className, label: x.label, used: x.used, max: x.max })),
    static_entities: limits.staticEntities,
    graph_node_max: LIMITS.nodesPerGraph,
    graph_sizes: limits.graphSizes.slice(0, topGraphs).map((g) => ({ file: g.file, graph: graphRef(g.graph), nodes: g.nodes })),
  };
}

/**
 * The overview of `sel` (refs): one entry per group of references that share a key (and, for variables, their type and graph), in the
 * order they are listed. An entry is { kind, key, key_graph, type, loop, resolved, graph, definition, parts }, where `parts` are
 * { role, count, graphs, note }: "N role" followed by the graphs the references are in (an array, possibly empty), or by a note (a rich
 * text), or by nothing (both null).
 */
export function buildOverviewRows(sel, { sortDesc = false } = {}) {
  const groups = new Map();
  const groupKey = (r) => {
    if (r.kind === 'graph_variable') return `graph_variable\u0000${r.scope}\u0000${r.key}\u0000${r.varType || ''}`;
    if (r.kind === 'custom_variable') return `custom_variable\u0000${r.key}\u0000${r.varType || ''}`;
    if (r.kind === 'struct') return `struct\u0000${r.file}\u0000${r.key}`;
    return `${r.kind}\u0000${r.key}`;
  };
  for (const r of sel) {
    // A composite cannot own these – its raw (physical) accesses are shown only one by one (--name), with their
    // "inlined via" provenance; the summary only shows the hoisted copies attributed to real caller graphs.
    if (r.rawCopy) continue;
    const gk = groupKey(r);
    if (!groups.has(gk)) groups.set(gk, { kind: r.kind, key: r.key, varType: r.varType || null, rs: [] });
    groups.get(gk).rs.push(r);
  }
  // A listener knows no datatype for custom variables (its pin types are defaults), so it must not open a separate
  // line next to the typed get/set line of the same name: fold untyped listeners into every same-name group.
  for (const [gk, grp] of [...groups]) {
    if (grp.varType || !grp.rs.every((r) => r.role === 'listen') || (grp.kind !== 'custom_variable' && grp.kind !== 'graph_variable')) continue;
    const sibs = [...groups].filter(([k, o]) => k !== gk && o.kind === grp.kind && o.key === grp.key && o.varType && (grp.kind === 'custom_variable' || o.rs[0].scope === grp.rs[0].scope));
    if (!sibs.length) continue;
    for (const [, o] of sibs) o.rs.push(...grp.rs);
    groups.delete(gk);
  }
  const entries = [...groups];
  // One kind's entries stay together (graph_variable with graph_variable, timer with timer, …);
  // sortDesc changes only the order *within* a kind, from the base order to refcount-descending.
  // The base order is alphabetical by key, except for mounted graphs: those follow the order of the graphs themselves.
  // The group key is compared part by part (kind, scope, key, type): as one string, a key that is a prefix of another would sort by the type that follows it.
  const byParts = (x, y) => { const p = x.split('\u0000'), q = y.split('\u0000'); for (let i = 0; i < p.length; i++) { const c = p[i].localeCompare(q[i] ?? ''); if (c) return c; } return 0; };
  const byBase = (a, b) => (a[1].kind === 'mount' ? Math.min(...a[1].rs.map((r) => r.order)) - Math.min(...b[1].rs.map((r) => r.order)) : 0) || byParts(a[0], b[0]);
  entries.sort((a, b) => a[1].kind.localeCompare(b[1].kind) || (sortDesc ? (b[1].rs.length - a[1].rs.length || byBase(a, b)) : byBase(a, b)));
  return entries.map(([, grp]) => groupEntry(grp));
}

function groupEntry({ kind, key, varType, rs }) {
  const row = { kind, key: String(key), key_graph: kind === 'mount' ? graphRef(rs[0].graphTagged) : null, type: null, loop: null, resolved: null, graph: null, definition: null, parts: [] };
  // part: "N role: [graphs]" (graphs = unique graph names) or "N role" (graphs null) or "N role: note text"
  const P = (list, role, withGraphs = true) => ({ role, count: list.length, graphs: withGraphs ? uniqGraphs(list).map(graphRef) : null, note: null });
  const by = (role) => rs.filter((r) => r.role === role);
  // A "When ... Changes/Triggered" node listens for ANY name; it gets its own line, since a
  // kind-specific format would print zeros for every real role.
  if (key === ANY_NAME_KEY) { row.parts = [P(rs, 'listen')]; return row; }
  switch (kind) {
    case 'composite': row.parts = [P(by('call'), 'call')]; break;
    case 'custom_variable': case 'graph_variable': {
      const gets = by('get'), listens = by('listen');
      const triggers = by('set').filter(isTriggerRef), sets = by('set').filter((r) => !isTriggerRef(r));
      row.type = varType;
      const withGraphs = kind !== 'graph_variable'; // a graph variable has exactly one owning graph, shown as row.graph
      if (!withGraphs) row.graph = graphRef(rs[0]?.graph || '?');
      row.parts = [P(gets, 'get', withGraphs), P(sets, 'set', withGraphs),
        ...(triggers.length ? [P(triggers, 'trigger', withGraphs)] : []),
        ...(listens.length ? [P(listens, 'listen', withGraphs)] : [])];
      break;
    }
    case 'global_timer': row.parts = GLOBAL_TIMER_ROLES.map((role) => [role, by(role)]).filter(([, l]) => l.length).map(([role, l]) => P(l, role)); break;
    case 'timer': {
      const starts = by('start');
      const loops = starts.map((r) => r.loop).filter(Boolean);
      row.loop = loops.length && loops.every((l) => l === 'false') ? 'onetime' : loops.length && loops.every((l) => l === 'true') ? 'looped' : null;
      row.parts = [P(starts, 'start'), P(by('stop'), 'stop'), ...['pause', 'resume', 'listen'].filter((role) => by(role).length).map((role) => P(by(role), role))];
      break;
    }
    case 'signal': row.parts = [P(by('listen'), 'listen'), P(by('send'), 'send')]; break;
    case 'literal_id': {
      const resolvedName = rs.find((r) => r.resolvedName)?.resolvedName;
      if (resolvedName) row.resolved = toRich(resolvedName);
      row.parts = [P(rs, 'Ref')]; // one role for every id type (the type is in the key): the document formats get a single column
      break;
    }
    case 'node_type': row.parts = [P(rs, 'uses')]; break;
    case 'mount': {
      // one part per slot (entity / player / character / status), listing the hosts: CLASS:"name"
      for (const slot of [...new Set(rs.map((r) => r.role))]) {
        const hosts = rs.filter((r) => r.role === slot);
        // identical hosts (same class and name) are listed once with a count: CLASS:"name" (x3)
        const grouped = countEqual(hosts, (h) => `${h.hostClass}\0${h.hostName}`).map(({ item: h, n }) => T`${S('className', h.hostClass)}:${keySpan(h.hostName)}${n > 1 ? ` (x${n})` : ''}`);
        row.parts.push({ role: slot, count: hosts.length, graphs: null, note: toRich(Tjoin(grouped, '; ')) });
      }
      break;
    }
    case 'struct': {
      const defs = rs.filter((r) => r.mode === 'definition');
      row.definition = defs.length ? defs.map((d) => d.note).join('; ') : null;
      for (const role of [...new Set(rs.filter((r) => r.mode === 'usage').map((r) => r.role))]) {
        const rs2 = rs.filter((r) => r.mode === 'usage' && r.role === role);
        const withGraph = rs2.filter((r) => r.graph), withoutGraph = rs2.filter((r) => !r.graph);
        if (withGraph.length) row.parts.push(P(withGraph, role));
        if (withoutGraph.length) row.parts.push({ role, count: withoutGraph.length, graphs: null, note: toRich(withoutGraph.map((r) => r.note).filter(Boolean).join('; ') || '(no further context)') });
      }
      break;
    }
    default: row.parts = [{ role: 'ref(s)', count: rs.length, graphs: null, note: null }];
  }
  return row;
}
