// The `code` mode: one item per file with everything the file says about its graphs, declarations and structs, as plain data: every node with
// its resolved name, every pin with its name, type, value and wires, the variables, comments and port mappings of a graph. An item of the code
// report (see JSON.md); src/present/code.mjs prints it.
//   fileCode(bundle, db, { analysis }) -> plain data object
// The data is the graph model, complete and resolved, and says nothing about how it is shown: a pin without value or wire and a value nobody
// edited are in it too (the renderer leaves them out unless asked: `--all-pins`, `--defaults`). Whatever a style of code needs that is not a
// plain fact of the graph (a statement view derived by analysis) goes next to the model and refers to it by node index, see JSON.md.
import { pinKindName, typeName } from './model.mjs';
import { graphRef } from './present/doc.mjs';
import { pseudocodeBuilder } from './pseudocode.mjs';
import { resourceGuidIndexOf, literalResource } from './refs.mjs';
import { analyzeBundle, graphLabel, pinTypeLabel, hiddenDeclarations, fileFacts, unresolvedNodes, GRAPH_SERVICE_TAG } from './analyze.mjs';

const COMPOSITE_BODY_KIND = 21002;
const SERVER_SERVICES = [20000, 20003, 20004, 20005];
/** JSON has no NaN / Infinity: a float that is neither finite nor a number is its name. */
const num = (v) => (typeof v === 'number' && !Number.isFinite(v) ? String(v) : v);

/**
 * A value as the `value` object of the report: `{ kind, set, ... }`. `set` is false for a value the person has not edited (the game's default).
 * A polymorphic wrapper is replaced by the value inside it; a value that holds nothing is null.
 */
export function valueJson(val, db) {
  if (!val) return null;
  const set = !!val.set;
  const sub = (v) => valueJson(v, db);
  switch (val.k) {
    case 'int': return { kind: 'int', set, value: val.v };
    case 'float': return { kind: 'float', set, value: num(val.v) };
    case 'str': return { kind: 'str', set, value: val.v };
    case 'id': return { kind: 'id', set, value: val.v };
    case 'bool': return { kind: 'bool', set, value: !!val.v }; // a custom variable's value (varscan.mjs); a pin's Bol is an enum below
    case 'vec': return { kind: 'vec', set, value: val.v.map(num) };
    case 'enum': {
      if (val.ty === 'Bol' && (val.v === 0 || val.v === 1)) return { kind: 'bool', set, value: val.v === 1 };
      const names = [...new Set((val.ty === 'Bol' ? [] : db.enumCandidates(val.v) || []).map((x) => x.name))]; // one number can belong to several enum families
      return { kind: 'enum', set, value: val.v, names };
    }
    case 'list': return { kind: 'list', set, items: val.items.map(sub) };
    case 'struct': return { kind: 'struct', set, items: val.items.map(sub) };
    case 'pair': return { kind: 'pair', set, key: sub(val.key), value: sub(val.value) };
    case 'map': return { kind: 'map', set, pairs: val.pairs.map(sub) };
    case 'poly': return val.inner ? sub(val.inner) : null;
    default: return null; // 'unset'
  }
}

/** `expand`: the pseudocode writes a composite call as the nodes of the body (the report holds one or the other, see JSON.md). */
export function fileCode(bundle, db, { analysis = null, expand = false } = {}) {
  const an = analysis ?? analyzeBundle(bundle, db);
  const { R, dup, nodeLabel } = an;
  const resources = resourceGuidIndexOf(bundle);
  const resourceOf = (val) => { const hit = literalResource(resources, val); return hit ? { class_name: hit.className, name: hit.name } : null; };
  const pseudocodeOf = pseudocodeBuilder(bundle, db, an, { valueJson, resourceOf, expandComposites: expand });
  const hiddenDecl = hiddenDeclarations(bundle);
  const structRef = (id) => (id ? { id, name: R.structName(id) ?? null } : null);

  const items = [];
  for (const r of bundle.resources) {
    const dependency = r.role === 'dependency';
    if (r.kind === 'graph' && r.graph) items.push(graphItem(r, dependency));
    else if (r.kind === 'interface' && r.iface) {
      if (r.className === 'COMPOSITE_NODE_DECL' || hiddenDecl(r)) continue; // every composite is also a graph; the second half of a send-signal pair adds nothing
      items.push(declarationItem(r, dependency));
    } else if (r.kind === 'struct' && r.struct) items.push(structItem(r, dependency));
  }
  return { ...fileFacts(bundle, db), items, unresolved_nodes: unresolvedNodes(R) };

  function graphItem(r, dependency) {
    const g = r.graph, tag = GRAPH_SERVICE_TAG[g.service], labels = nodeLabel.get(g);
    const decl = g.kind === COMPOSITE_BODY_KIND ? R.declForBody(r) : null;
    const nodeRef = (index) => {
      const info = labels.get(index);
      return info ? { index, name: info.name, shell_id: info.shellId, kernel_id: info.kernelId } : { index, name: null, shell_id: null, kernel_id: null }; // null name: the graph has no such node
    };
    const pinRef = (kind, index, name) => ({ kind: pinKindName(kind), index, name: name ?? null });
    const pinNameOf = (index, kind, pinIndex) => { const info = labels.get(index); return info ? R.pinName(info, { kind, index: pinIndex, uid: null }).name : null; };

    const portMappings = g.portMappings.map((pm) => {
      const list = decl ? (pm.ext.kind === 1 ? decl.iface.inflows : pm.ext.kind === 2 ? decl.iface.outflows : pm.ext.kind === 3 ? decl.iface.inputs : decl.iface.outputs) : [];
      const ext = list.find((p) => p.kind === pm.ext.kind && p.index === pm.ext.index)?.name;
      return { external: pinRef(pm.ext.kind, pm.ext.index, ext || null), internal: { node: nodeRef(pm.node), pin: pinRef(pm.int.kind, pm.int.index, pinNameOf(pm.node, pm.int.kind, pm.int.index)) } };
    });

    const nodes = [...g.nodes].sort((a, b) => a.index - b.index).map((n) => {
      const info = labels.get(n.index);
      const pins = n.pins.filter((p) => !R.isPlaceholderPin(n, info, p)).sort((a, b) => a.kind - b.kind || a.index - b.index).map((p) => ({
        kind: pinKindName(p.kind), index: p.index, name: R.pinName(info, p).name ?? null, type: pinTypeLabel(p, g),
        hidden: R.isHiddenPin(info, p), // Multiple Branches: its case list is shown as the names of its branches
        value: valueJson(p.value, db),
        resource: resourceOf(p.value), // what a literal id points at in this file's resources, else null
        default: !!(p.value && !p.value.set && p.value.k !== 'poly'), // the file holds the value, but nobody edited it
        wires: p.conns.map((c) => ({ node: nodeRef(c.node), pin: pinRef(c.kind, c.index, pinNameOf(c.node, c.kind, c.index)) })),
        binding: p.bindingMeta ? { kind: pinKindName(p.bindingMeta.kind), index: p.bindingMeta.index, source_ref: p.bindingMeta.sourceRef ?? null } : null,
      }));
      return {
        index: n.index, name: info.name, shell_id: info.shellId, kernel_id: info.kernelId, unresolved: info.unresolved,
        variant: info.variant ?? null, user: info.extra.userKind ?? null, signal: info.extra.signal ?? null, struct: info.extra.struct ?? null,
        x: num(n.x), y: num(n.y), signal_version: n.signalVersion ?? null, status_ext: n.statusExt ? { type: n.statusExt.type, inner: n.statusExt.inner ?? null } : null,
        comment: n.comment ?? null, pins,
      };
    });

    return {
      type: 'graph', name: graphRef(`${tag ? `<${tag}>` : ''}${graphLabel(r, dup, R)}`), class_name: r.className, guid: r.guid, decl_guid: decl?.guid ?? null,
      composite_body: g.kind === COMPOSITE_BODY_KIND, service: g.service, evaluation_interval: g.evaluationInterval == null ? null : num(g.evaluationInterval), description: decl?.iface.description || null, dependency,
      variables: g.variables.map((v) => ({ name: v.name, type: typeName(1, v.typeId), public: v.isPublic, struct: structRef(v.structId), value: valueJson(v.value, db) })),
      comments: g.comments.map((c) => ({ text: c.text, x: c.x == null ? null : num(c.x), y: c.y == null ? null : num(c.y) })),
      port_mappings: portMappings,
      affiliations: g.affiliations.map((a) => ({ struct_id: a.structId ?? null, source_guid: a.source?.guid ?? a.source?.id ?? null })),
      anomalies: g.anomalies,
      nodes,
      pseudocode: pseudocodeOf(r),
    };
  }

  function declarationItem(r, dependency) {
    const f = r.iface;
    const backend = f.id?.shell && SERVER_SERVICES.includes(f.id.shell.service) ? 1 : 2;
    const signal = (s) => (s ? { name: s.name, server_node: s.server?.id ?? null, client_node: s.client?.id ?? null } : null);
    const pins = [['in_flow', f.inflows], ['out_flow', f.outflows], ['in_param', f.inputs], ['out_param', f.outputs], ['meta', f.metaPins]].flatMap(([group, list]) => list.map((p) => ({
      group, index: p.index, name: p.name || null, type: p.type?.shell != null ? typeName(backend, p.type.shell) : null,
      enum_family: p.type?.enumId ?? null, struct: structRef(p.type?.structId), uid: p.uid ?? null,
    })));
    return {
      type: 'declaration', name: f.sendSignal?.name || f.listenSignal?.name || f.name || r.name, class_name: r.className, guid: r.guid, category: f.categoryName ?? null,
      description: f.description || null, dependency,
      send_signal: signal(f.sendSignal), listen_signal: signal(f.listenSignal),
      assemble_struct: f.assembleStruct != null ? { id: f.assembleStruct, name: R.structName(f.assembleStruct) ?? null } : null,
      split_struct: f.splitStruct != null ? { id: f.splitStruct, name: R.structName(f.splitStruct) ?? null } : null,
      modify_struct: f.modifyStruct != null ? { id: f.modifyStruct, name: R.structName(f.modifyStruct) ?? null } : null,
      pins,
    };
  }

  function structItem(r, dependency) {
    const s = r.struct;
    return {
      type: 'struct', name: s.name, guid: r.guid, id: s.id, version: s.version, dependency,
      fields: s.vars.map((v) => ({ index: v.index, name: v.name, type: typeName(1, v.typeId), struct: structRef(v.refStructId) })),
    };
  }
}
