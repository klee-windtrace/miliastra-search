// L2: semantic model, independent of protobuf field names.
//
//   Bundle   { file, header, fileSize, format, formatDetectedBy, level, engineVersion, modeFlag, exportTag, resources[], census, warnings[] }
//   Resource { role:'primary'|'dependency', idx, classId, className, section, folder, folderRank, folderPos, mounts[], name, guid, identity, refs[],
//              kind:'graph'|'interface'|'struct'|'opaque', graph?, iface?, struct?, gkey? }
//   Graph    { name, guid, identity, kind, service, nodes[], edges[], anomalies[], variables[], comments[], portMappings[], affiliations[] }
//   Node     { index, shell:Loc, kernel:Loc|null, x, y, pins[], comment, signalVersion, statusExt, ctxDecl, usingStructs[] }
//   Pin      { kind, index, kkind, kindex, typeId, value, conns[], bindingMeta, uid, hasValueMsg }
//   Edge     { from:{node,kind,index}, to:{node,kind,index} }        (always source -> target)
//   Value    { k, v, ty, ... }                                         (see normValue)

import { unwrapContainer, detectFormat } from './container.mjs';
import { decodeGil } from './gil.mjs';
import { scanGiaEntities, DEFAULT_TAB_RANK } from './mounts.mjs';
import { loadSchema } from './schema.mjs';
import { decodeMessage, Census } from './decode.mjs';

export const PIN_KIND = { 1: 'in_flow', 2: 'out_flow', 3: 'in_param', 4: 'out_param', 5: 'meta_rpc', 6: 'meta_topic', 13: 'struct_ref', 14: 'struct_key_mod', 15: 'struct_key_set', 16: 'struct_key_select' };
export const pinKindName = (k) => PIN_KIND[k] || `kind${k}`;

const enumName = (root, msgPath, field, v) => {
  // resolve an enum number to its schema name using the merged proto (open enums -> undefined if unknown)
  const m = msgPath.split('.').reduce((cur, p) => cur.messages.get(p), root);
  const f = m.byName.get(field);
  return f?.enum?.byNum.get(v);
};

export function className(root, id) {
  return root.messages.get('ResourceEntry').enums.get('ResourceClass').byNum.get(id) || `class#${id}`;
}

// ResourceLocator -> { origin, service, kind, guid (asset_guid), id (runtime_id) }
function loc(l) {
  if (!l) return null;
  return {
    origin: l.source_domain || 0, service: l.service_domain || 0, kind: l.kind || 0,
    guid: l.asset_guid ?? null, id: l.runtime_id ?? null,
  };
}

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
export const typeName = (backend, id) => (backend === 2 ? CLIENT_TYPES : SERVER_TYPES)[id] ?? `type#${id}`;

/** Normalise a TypedValue into a small AST. Returns null when there is no value payload at all. */
export function normValue(tv) {
  if (!tv) return null;
  const td = tv.type_def;
  const backend = td?.backend;
  const tag = td?.server_side?.type_tag ?? td?.client_side?.type_tag;
  const out = { k: 'unset', set: !!tv.is_value_set, widget: tv.widget || 0 };
  if (tag !== undefined) { out.ty = typeName(backend, tag); out.tyId = tag; out.backend = backend; }
  if (td?.server_side?.struct_ref) out.structId = td.server_side.struct_ref.schema_id ?? null;
  if (tv.tracker?.identity) out.trackerIndex = tv.tracker.identity.local_index;
  if (tv.client_inline) out.clientInline = tv.client_inline;
  if ('val_id' in tv) { out.k = 'id'; out.v = tv.val_id.id ?? 0; }
  else if ('val_int' in tv) { out.k = 'int'; out.v = tv.val_int.int ?? 0; }
  else if ('val_float' in tv) { out.k = 'float'; out.v = tv.val_float.float ?? 0; }
  else if ('val_string' in tv) { out.k = 'str'; out.v = tv.val_string.str ?? ''; }
  else if ('val_enum' in tv) { out.k = 'enum'; out.v = tv.val_enum.enum ?? 0; }
  else if ('val_vector' in tv) { const v = tv.val_vector.vec || {}; out.k = 'vec'; out.v = [v.x ?? 0, v.y ?? 0, v.z ?? 0]; }
  else if ('val_struct' in tv) { out.k = 'struct'; out.items = (tv.val_struct.fields || []).map(normValue); }
  else if ('val_list' in tv) { out.k = 'list'; out.items = (tv.val_list.elements || []).map(normValue); }
  else if ('val_pair' in tv) { out.k = 'pair'; out.key = normValue(tv.val_pair.key); out.value = normValue(tv.val_pair.value); }
  else if ('val_map' in tv) { out.k = 'map'; out.pairs = (tv.val_map.pairs || []).map(normValue); }
  else if ('val_poly' in tv) {
    const p = tv.val_poly;
    out.k = 'poly'; out.chosen = p.chosen_type_index ?? 0;
    out.inner = p.actual_value ? normValue(p.actual_value) : null;
    if (p.extra_meta) out.extraMeta = true;
  }
  return out;
}

function buildPin(p) {
  const ss = p.shell_sig || {}, ks = p.kernel_sig || null;
  return {
    kind: ss.kind || 0, index: ss.index || 0,
    kkind: ks ? (ks.kind || 0) : null, kindex: ks ? (ks.index || 0) : null,
    typeId: p.type ?? null,
    value: normValue(p.value),
    conns: (p.connections || []).map((c) => ({
      node: c.target_node_index ?? 0,
      kind: c.target_pin_shell?.kind || 0, index: c.target_pin_shell?.index || 0,
      kkind: c.target_pin_kernel ? (c.target_pin_kernel.kind || 0) : null,
      kindex: c.target_pin_kernel ? (c.target_pin_kernel.index || 0) : null,
    })),
    bindingMeta: p.binding_meta ? { kind: p.binding_meta.kind || 0, index: p.binding_meta.index || 0, sourceRef: p.binding_meta.source_ref?.id ?? null } : null,
    uid: p.persistent_pin_uid ?? null,
    hasValueMsg: !!p.value,
  };
}

function buildNode(n) {
  return {
    index: n.index ?? 0,
    shell: loc(n.shell_ref), kernel: loc(n.kernel_ref),
    x: n.x_pos ?? 0, y: n.y_pos ?? 0,
    pins: (n.pins || []).map(buildPin),
    comment: n.attached_comment ? n.attached_comment.text ?? '' : null,
    signalVersion: n.signal_version ?? null,
    ctxDecl: n.context_declaration ? { kind: n.context_declaration.kind || 0, index: n.context_declaration.index || 0 } : null,
    statusExt: n.status_node_extension ? { type: n.status_node_extension.type ?? 0, inner: n.status_node_extension.inner?.value ?? null } : null,
    usingStructs: (n.using_structs || []).map((u) => loc(u.identity)),
  };
}

function buildGraph(g, res) {
  const nodes = (g.nodes || []).map(buildNode);
  const graph = {
    name: g.display_name || res.name || '',
    guid: g.identity?.runtime_id ?? res.guid,
    identity: loc(g.identity),
    kind: g.identity?.kind || 0,
    service: g.identity?.service_domain || 0,
    nodes,
    variables: (g.blackboard || []).map((v) => ({
      name: v.var_name ?? '', typeId: v.base_type ?? 0, value: normValue(v.storage_value), isPublic: !!v.is_public,
      structId: v.schema_ref_id ?? null, keyType: v.container_key_type ?? null, valueType: v.container_value_type ?? null,
    })),
    comments: (g.comments || []).map((c) => ({ text: c.text ?? '', x: c.x_pos ?? null, y: c.y_pos ?? null })),
    portMappings: (g.port_mappings || []).map((m) => ({
      ext: { kind: m.external_port?.kind || 0, index: m.external_port?.index || 0 },
      node: m.internal_target_node_handle ?? 0,
      int: { kind: m.internal_port_shell?.kind || 0, index: m.internal_port_shell?.index || 0 },
    })),
    affiliations: (g.affiliations || []).map((a) => ({ source: loc(a.info?.source), structId: a.info?.struct_id?.struct_id ?? null, type: a.type?.type ?? null })),
    entrySlotIndex: g.entry_slot_index ?? null,
    evaluationInterval: g.evaluation_interval ?? null,
  };
  graph.edges = buildEdges(graph);
  return graph;
}

/** Normalise connections to source -> target, deduplicated. Anomalies are kept in graph.anomalies. */
function buildEdges(graph) {
  const edges = new Map();
  graph.anomalies = [];
  const byIdx = new Map(graph.nodes.map((n) => [n.index, n]));
  for (const n of graph.nodes) {
    for (const p of n.pins) {
      for (const c of p.conns) {
        let from, to;
        const owner = { node: n.index, kind: p.kind, index: p.index };
        const other = { node: c.node, kind: c.kind, index: c.index };
        if (p.kind === 2 || p.kind === 4) { from = owner; to = other; }          // out_flow / out_param own -> targets
        else if (p.kind === 3 || p.kind === 1) { from = other; to = owner; }      // in_param / in_flow own <- sources
        else { from = owner; to = other; graph.anomalies.push(`connection on unusual pin kind ${p.kind} at [${n.index}]`); }
        if (!byIdx.has(c.node)) graph.anomalies.push(`connection from [${n.index}] points at missing node [${c.node}]`);
        const key = `${from.node}:${from.kind}:${from.index}>${to.node}:${to.kind}:${to.index}`;
        if (!edges.has(key)) edges.set(key, { from, to });
      }
    }
  }
  return [...edges.values()].sort((a, b) => a.from.node - b.from.node || a.from.kind - b.from.kind || a.from.index - b.from.index || a.to.node - b.to.node || a.to.index - b.to.index);
}

function buildPinIface(pi) {
  return {
    name: pi.name ?? '', mask: pi.visibility_mask ?? 0,
    kind: pi.sig?.kind || 0, index: pi.sig?.index || 0,
    uid: pi.persistent_pin_uid ?? null,
    metaSig: pi.meta_sig_type ? { kind: pi.meta_sig_type.kind || 0, index: pi.meta_sig_type.index || 0 } : null,
    type: pi.type ? {
      shell: pi.type.var_type_shell ?? null, kernel: pi.type.var_type_kernel ?? null,
      uiClass: pi.type.ui_class ?? null,
      enumId: pi.type.enum_id?.val ?? null, structId: pi.type.struct_id?.val ?? null,
      hasList: !!pi.type.list_item_type, hasMap: !!pi.type.map_type,
      placeholder: pi.type.placeholder?.text ?? null,
      defaultValue: normValue(pi.type.default_value),
    } : null,
  };
}

function buildIface(iface, root) {
  const impl = iface.impl || {};
  const catName = impl.category !== undefined ? enumName(root, 'NodeInterface.Implementation', 'category', impl.category) : null;
  const sig = (s) => (s ? { name: s.signal_name ?? '', server: loc(s.server_node_id), client: loc(s.client_node_id) } : null);
  return {
    name: iface.name ?? '', description: iface.description ?? '',
    id: iface.id ? { shell: loc(iface.id.shell_ref), kernel: loc(iface.id.kernel_ref), graph: loc(iface.id.graph_ref), signalVersion: iface.id.signal_version ?? null } : null,
    category: impl.category ?? 0, categoryName: catName || (impl.category ? `category#${impl.category}` : 'UNKNOWN'),
    sendSignal: sig(impl.send_signal), listenSignal: sig(impl.listen_signal),
    assembleStruct: impl.assemble_struct?.id ?? null, splitStruct: impl.split_struct?.id ?? null, modifyStruct: impl.modify_struct?.id ?? null,
    templateRoot: iface.template_root ?? 0, templateSub: iface.template_sub ?? 0,
    inflows: (iface.inflows || []).map(buildPinIface), outflows: (iface.outflows || []).map(buildPinIface),
    inputs: (iface.inputs || []).map(buildPinIface), outputs: (iface.outputs || []).map(buildPinIface),
    metaPins: (iface.meta_pins || []).map(buildPinIface),
  };
}

function buildStruct(sd) {
  const f = sd.def?.concreteField || sd.def?.genericField || {};
  return {
    id: f.id ?? null, name: f.structName ?? '', version: sd.def?.structVersion ?? null,
    vars: (f.vars || []).map((v) => ({
      name: v.varName ?? v.name ?? '', typeId: v.varType ?? 0, index: v.varIndex ?? 0,
      refStructId: v.typedef1?.subType?.xxxx_id ?? null,
      keyType: v.typedef1?.subType?.key ?? null, valueType: v.typedef1?.subType?.value ?? null,
    })),
  };
}

const maskTag = (tag) => {
  const m = /^(\d+)-(\d+)-(\d+)-(.*)$/s.exec(tag || '');
  return m ? { uid: m[1], time: m[2], fileId: m[3], name: m[4].replace(/^\\/, '') } : { uid: null, time: null, fileId: null, name: tag || '' };
};

/**
 * Decode a whole .gia or .gil buffer into a Bundle. The format is detected from the content (header file type,
 * cross-checked against the payload structure), never from the file name; `format` ('gia'|'gil') forces it.
 */
// ---- order of the resources ----
// The resources are listed the way the editor lists them. Each group below is re-sorted *within its own positions* in the
// list, so other resources stay where they are. `idx` (the position within the primary or dependency list of the file) is unchanged.
//   graphs        by domain (GRAPH_ORDER), then folder (the default tab first, then the custom folders as stored), then name
//   composite declarations   like their bodies (folder, then name)
//   prefabs, statuses, skills ...   by folder (custom folders as stored, the default tab last), then position in the folder
// Without folder information (a .gia, or a resource the folder index does not list) the folder step is neutral.
const COMPOSITE_BODY_KIND = 21002;
/** Order of the graph domains (service_domain); 'composite' stands for all composite bodies. */
export const GRAPH_ORDER = [20000, 20003, 20004, 20005, 'composite', 20002, 20008, 20009, 20007, 20010, 20001, 20006];
const nameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }); // fixed locale: the same order on every machine
const byName = (a, b) => nameCollator.compare(a, b);

/** The order of the resource classes in the dump (the classes that are not listed follow, alphabetically). */
export const CLASS_ORDER = ['GIL_LEVEL_ENTITY', 'PLAYER_TEMPLATE', 'CHARACTER_TEMPLATE', 'CLASS', 'SKILL', 'CONTROL_SKILL', 'CUSTOM_CREATION_SKILL', 'SKILL_VARIABLE', 'SKILL_RESOURCE', 'UNIT_STATUS', 'GLOBAL_TIMER',
  'PROJECTILE', 'GIL_INVENTORY_TEMPLATE', 'SHOP_TEMPLATE', 'ITEM', 'UNIT_TAG', 'SCAN_TAG', 'ENTITY_DEPLOYMENT_GROUP', 'LIGHT_SOURCE', 'VFX_TOOL', 'CAMERA', 'OBJECT', 'CREATION', 'OBJECT_ENTITY', 'CREATION_ENTITY',
  'STATIC_ENTITY', 'TERRAIN_ENTITY', 'INTERFACE_LAYOUT', 'UI_CONTROL_GROUP', 'ENVIRONMENT_CONFIGURATION', 'PATH', 'SHIELD', 'PRESET_POINT', 'GIL_RESPAWN_POINT', 'GIL_PLAYER_ENTITY', 'GIL_CHARACTER_ENTITY',
  'GIL_GROWTH_CURVE', 'UNKNOWN_TYPE'];

function orderResources(resources) {
  const fileOrder = new Map(resources.map((r, i) => [r, i])); // tie-break: the order in the file
  const reorder = (pick, compare) => {
    const slots = [];
    resources.forEach((r, i) => { if (pick(r)) slots.push(i); });
    const sorted = slots.map((i) => resources[i]).sort(compare);
    slots.forEach((slot, k) => { resources[slot] = sorted[k]; });
  };
  const isGraph = (r) => r.kind === 'graph' && r.graph;
  // a composite is named by its declaration (the body has no name); the declaration points at its body
  const declName = new Map(), bodyOfDecl = new Map();
  for (const r of resources) if (r.kind === 'interface' && r.iface && r.className === 'COMPOSITE_NODE_DECL') declName.set(r.iface.id?.graph?.id ?? r.guid, r);
  for (const r of resources) if (isGraph(r) && r.graph.kind === COMPOSITE_BODY_KIND) { const d = declName.get(r.guid); if (d) bodyOfDecl.set(d, r); }
  const graphName = (r) => (r.graph.kind === COMPOSITE_BODY_KIND ? declName.get(r.guid)?.name : null) || r.name || r.graph.name || '';
  const domain = (r) => { const i = GRAPH_ORDER.indexOf(r.graph.kind === COMPOSITE_BODY_KIND ? 'composite' : r.graph.service); return i < 0 ? GRAPH_ORDER.length : i; };
  const rank = (r) => r.folderRank ?? DEFAULT_TAB_RANK;
  reorder(isGraph, (a, b) => domain(a) - domain(b) || rank(a) - rank(b) || byName(graphName(a), graphName(b)) || fileOrder.get(a) - fileOrder.get(b));
  const declOrder = (d) => bodyOfDecl.get(d);
  reorder((r) => r.kind === 'interface' && r.iface && r.className === 'COMPOSITE_NODE_DECL' && declOrder(r),
    (a, b) => rank(declOrder(a)) - rank(declOrder(b)) || byName(a.name, b.name) || fileOrder.get(a) - fileOrder.get(b));
  // everything else that has a place in a folder: custom folders first, the default tab last
  const place = (r) => (r.folderPos == null ? [Infinity, fileOrder.get(r)] : [r.folderRank === DEFAULT_TAB_RANK ? Infinity : r.folderRank, r.folderPos]);
  for (const cls of new Set(resources.filter((r) => r.kind === 'opaque' && r.folderPos != null).map((r) => r.className))) {
    reorder((r) => r.kind === 'opaque' && r.className === cls, (a, b) => { const [fa, pa] = place(a), [fb, pb] = place(b); return (fa === fb ? 0 : fa < fb ? -1 : 1) || pa - pb || fileOrder.get(a) - fileOrder.get(b); });
  }
  // the other resources by class: CLASS_ORDER first, then the remaining classes alphabetically; inside a class the order found above stays
  const inClass = new Map(resources.map((r, i) => [r, i]));
  const classRank = (r) => { const i = CLASS_ORDER.indexOf(r.className); return i < 0 ? CLASS_ORDER.length : i; };
  reorder((r) => r.kind === 'opaque', (a, b) => classRank(a) - classRank(b) || (classRank(a) === CLASS_ORDER.length ? byName(a.className, b.className) : 0) || inClass.get(a) - inClass.get(b));
  // declarations (signals ...) and structs come before the graphs, the graphs before the other resources: no declaration between two graphs
  const group = (r) => (r.kind === 'interface' && r.iface && r.className !== 'COMPOSITE_NODE_DECL' ? 0 : r.kind === 'struct' && r.struct ? 1 : r.kind === 'opaque' ? 3 : 2);
  const now = new Map(resources.map((r, i) => [r, i]));
  resources.sort((a, b) => group(a) - group(b) || now.get(a) - now.get(b));
}

/**
 * The folder a resource is filed in, as shown to the user, or null when the file does not say (a .gia, or a resource the folder
 * index does not list). The default tab is told by its place in the index (DEFAULT_TAB_RANK), not by its name, which follows the
 * game's language ("Uncategorized Tab"); it is shown as "(default)".
 */
export function folderLabel(r) {
  if (r.folderRank === DEFAULT_TAB_RANK) return '(default)';
  return r.folder ?? null;
}

export function parseBundle(buf, { file = '<memory>', lenient = false, format = null } = {}) {
  const root = loadSchema();
  const { payload, header, problems } = unwrapContainer(buf, { lenient });
  const det = detectFormat(payload, header, format);
  const census = new Census();
  let ab, level = null;
  if (det.format === 'gil') ({ ab, level } = decodeGil(payload, root, census));
  else ab = decodeMessage(payload, root.messages.get('AssetBundle'), census);
  const giaEntities = det.format === 'gia' ? scanGiaEntities(payload) : []; // per resource: { dynamic, parent } for an entity, null otherwise
  const tag = level ? { name: level.name, uid: null, time: null, fileId: null } : maskTag(ab.export_tag);
  const bundle = {
    file, header, fileSize: buf.length, warnings: [...problems, ...det.warnings], census,
    format: det.format, formatDetectedBy: det.how, level,
    engineVersion: ab.engine_version ?? null,
    modeFlag: ab.mode_flag ?? null,
    exportTag: { name: tag.name, uidMasked: tag.uid ? '#'.repeat(String(tag.uid).length) : null, uid: tag.uid, time: tag.time, fileId: tag.fileId, raw: ab.export_tag ?? null },
    resources: [],
  };
  const entries = [...(ab.resources || []).map((r) => ['primary', r]), ...(ab.dependencies || []).map((r) => ['dependency', r])];
  entries.forEach(([role, r], i) => {
    const res = {
      role, idx: i, classId: r.resource_class ?? 0, className: className(root, r.resource_class ?? 0),
      section: r._gil?.section ?? null,
      // .gil only: the editor folder / tab the resource is filed in, that folder's position among its siblings (DEFAULT_TAB_RANK
      // for the default tab) and the resource's position inside it (root 6, composite palette). Only graphs, composites and
      // the classes of FOLDER_TYPE_BY_CLASS have them; they drive the order of the resources (see orderResources).
      folder: r._gil?.folder ?? null, folderRank: r._gil?.folderRank ?? null, folderPos: r._gil?.folderPos ?? null,
      // entities only: the id they were created from, a prefab's GUID or the id of a native object (see mounts.mjs)
      parentId: r._gil?.parent ?? giaEntities[i]?.parent ?? null,
      mounts: r._gil?.mounts ?? [], // graphs mounted on this resource: [{ slot, graph (guid), service }] (see mounts.mjs)
      name: r.internal_name ?? '', identity: loc(r.identity),
      guid: r.identity?.asset_guid ?? null,
      refs: (r.reference_list || []).map(loc),
      kind: 'opaque',
    };
    if (giaEntities[i]?.dynamic === false) res.className = 'STATIC_ENTITY'; // same rule as in a .gil (gil.mjs)
    if (r._gil && 'classId' in r._gil) { res.classId = r._gil.classId; if (r._gil.className) res.className = r._gil.className; }
    if (r.graph_data) { res.kind = 'graph'; const g = r.graph_data.inner?.graph; res.graph = g ? buildGraph(g, res) : null; }
    else if (r.interface_data) { res.kind = 'interface'; const f = r.interface_data.inner?.interface; res.iface = f ? buildIface(f, root) : null; }
    else if (r.struct_data) { res.kind = 'struct'; res.struct = buildStruct(r.struct_data); }
    // GIL GUIDs are unique per *kind* only, so give every graph a bundle-unique key (used for reference scopes).
    if (res.kind === 'graph' && res.graph) res.gkey = res.graph.kind === 21002 ? `body:${res.guid}` : String(res.guid);
    bundle.resources.push(res);
  });
  orderResources(bundle.resources);
  return bundle;
}
