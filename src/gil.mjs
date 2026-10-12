// L1b: .gil (whole-stage save) -> the same "entry" objects a .gia AssetBundle contains.
//
// A .gil has the same container as a .gia, but its payload is the entire stage (level). Everything this tool
// already understands lives in the node-graph section (root field 10) as *bare* messages instead of ResourceEntry
// wrappers, so this module only has to (1) decode the level with the GilFile schema, (2) re-wrap those messages as
// ResourceEntry-shaped objects (graph_data / interface_data / struct_data) and (3) list every other resource the level
// holds as an "opaque" entry (name / class / GUID, plus the graph mounts and static/dynamic flag read by mounts.mjs).
// model.mjs then treats both formats identically.
//
// GIL carries no resource_class field (GIA does), so the class is *derived*:
//   * graphs         from the service domain of the graph identity (verified against all GIA samples)
//   * declarations   send-signal -> 14, everything else (composite, listen signal, struct nodes) -> 12
//   * configs (15)   from the entry's own `config_type` field
//   * templates/entities from the GUID band (see `band`) and, for projectiles, the base config id
// Classes that GIA has no number for get a `GIL_*` name and classId null (printed as `class=-`).

import { decodeMessage } from './decode.mjs';
import { scanLevel, FOLDER_BY_SERVICE, FOLDER_BY_CLASS, folderKey, COMPOSITE_FAMILY, DEFAULT_TAB_RANK } from './mounts.mjs';

const GRAPH_CLASS_BY_SERVICE = { 20000: 9, 20001: 10, 20002: 11, 20003: 22, 20004: 23, 20005: 46, 20006: 47, 20007: 51, 20008: 52, 20009: 53, 20010: 64 };

// root.15 entry `config_type` -> ResourceClass (numbers from GIA sample_9, matched entry by entry against stage_9)
const CONFIG_CLASS = { 1: 7, 4: 17, 6: 8, 7: 16, 9: 26, 17: 30, 18: 45, 22: 39, 26: 49, 27: 48, 28: 54, 30: 60, 32: 58, 36: 65 };
const CONFIG_EXTRA = { 5: 'GIL_GROWTH_CURVE', 12: 'GIL_INVENTORY_TEMPLATE' };

const PROJECTILE_BASE_CONFIG = 10003001;

// GUID bands: the game allocates GUIDs in blocks of 2^22 starting at 0x40000000; the block index tells the family.
const band = (guid) => (guid >= 0x40000000 ? (guid - 0x40000000) >>> 22 : -1);
const TEMPLATE_CLASS_BY_BAND = { 1: 1, 2: 2, 3: 18, 4: 19 };          // object, creation, player template, character template
const ENTITY_CLASS_BY_BAND = { 1: 3, 2: 4 };                          // object entity, creation entity
const ENTITY_EXTRA_BY_BAND = { 3: 'GIL_PLAYER_ENTITY', 4: 'GIL_CHARACTER_ENTITY', 5: 'GIL_LEVEL_ENTITY' };

const componentName = (comps) => (comps || []).find((c) => c.kind === 1)?.name?.text ?? '';

// The `slot` of a mount says which kind of host a graph is mounted on: 'entity' (entities, prefabs, stage entity),
// 'player' / 'character' (the two template halves; a class says it per mounted graph, by its PlayerBP / AvatarBP label),
// 'status' (a status config). The two tables below give the slot of a template and of a class graph.
const TEMPLATE_SLOT_BY_BAND = { 3: 'player', 4: 'character' };
const CLASS_SLOT_BY_LABEL = { PlayerBP: 'player', AvatarBP: 'character' };
const CONFIG_TYPE_STATUS = 1, CONFIG_TYPE_CLASS = 4;

// Folder facts of the folder-index entry `key` (see folderKey): { folder, folderRank, folderPos }, or {} when it is not listed.
function folderOf(raw, key) {
  const place = raw.folders.placeByKey.get(key);
  return place ? { folder: raw.folders.byKey.get(key), folderRank: place.rank, folderPos: place.pos } : {};
}

/** Every non-graph resource in root order. Each: { section, classId|null, className|null, guid, name, mounts?, dynamic? }. */
function listOpaque(g, raw) {
  const out = [];
  const add = (section, classId, className, guid, name, extra) => out.push({ section, classId, className, guid: guid ?? null, name: name ?? '', ...extra });
  const graphMounts = (info, slotOf) => (info?.graphs || []).map((r) => ({ slot: slotOf(r), graph: r.guid, service: r.service }));
  for (const t of g.templates?.entries || []) {
    const cls = t.config_id === PROJECTILE_BASE_CONFIG && band(t.guid) === 1 ? 25 : TEMPLATE_CLASS_BY_BAND[band(t.guid)];
    const slot = TEMPLATE_SLOT_BY_BAND[band(t.guid)] || 'entity';
    add('root.4', cls ?? 0, cls == null ? 'UNKNOWN_TYPE' : null, t.guid, componentName(t.components), { mounts: graphMounts(raw.templates.get(t.guid), () => slot) });
  }
  for (const e of g.entities?.entries || []) {
    const b = band(e.guid);
    const info = raw.entities.get(e.guid);
    // Player / character entities mirror their template (same name, same graphs): the mounts are reported on the template only.
    const mounts = ENTITY_EXTRA_BY_BAND[b] === 'GIL_PLAYER_ENTITY' || ENTITY_EXTRA_BY_BAND[b] === 'GIL_CHARACTER_ENTITY' ? [] : graphMounts(info, () => 'entity');
    // An object entity is STATIC unless it carries the dynamic component list (see mounts.mjs). Creation entities are always dynamic.
    if (b === 1) add('root.5', 3, info?.dynamic === false ? 'STATIC_ENTITY' : null, e.guid, componentName(e.components), { mounts, dynamic: info?.dynamic !== false, parent: info?.parent ?? null });
    else if (ENTITY_CLASS_BY_BAND[b]) add('root.5', ENTITY_CLASS_BY_BAND[b], null, e.guid, componentName(e.components), { mounts, parent: info?.parent ?? null });
    else add('root.5', null, ENTITY_EXTRA_BY_BAND[b] || 'UNKNOWN_TYPE', e.guid, componentName(e.components), { mounts });
  }
  for (const t of g.terrains?.entries || []) add('root.7', 5, null, t.guid, t.info?.name);
  for (const u of g.ui?.entries || []) {
    const name = (u.info || []).find((i) => i.name)?.name?.text ?? '';
    if (u.parent) add('root.9', 15, null, u.guid, name);          // control: has a parent layout
    else if (name) add('root.9', 20, null, u.guid, name);         // layout
    else add('root.9', null, 'GIL_UI_UNNAMED', u.guid, '');
  }
  for (const p of g.level_settings?.respawn_points?.entries || []) add('root.11.3', null, 'GIL_RESPAWN_POINT', p.guid, p.name);
  for (const p of g.level_settings?.preset_points?.entries || []) add('root.11.5', 6, null, p.guid, p.name);
  for (const t of g.global_timers?.entries || []) add('root.12', 24, null, null, t.name);   // timers have no GUID in a level
  for (const c of g.configs?.entries || []) {
    const name = componentName(c.components);
    const info = raw.configs.get(c.guid);
    let mounts = [];
    if (c.config_type === CONFIG_TYPE_STATUS && info?.statusGraph) mounts = [{ slot: 'status', graph: info.statusGraph.guid, service: info.statusGraph.service }];
    if (c.config_type === CONFIG_TYPE_CLASS) mounts = graphMounts(info, (r) => CLASS_SLOT_BY_LABEL[r.label] || 'entity');
    if (CONFIG_CLASS[c.config_type]) add('root.15', CONFIG_CLASS[c.config_type], null, c.guid, name, { mounts });
    else add('root.15', null, CONFIG_EXTRA[c.config_type] || `GIL_CONFIG_${c.config_type}`, c.guid, name, { mounts });
  }
  for (const c of g.cameras?.entries || []) add('root.18', 13, null, c.guid, c.info?.name);
  for (const u of g.unit_tags?.entries || []) add('root.30', 44, null, u.guid, u.name);
  for (const s of g.save_data?.entries || []) add('root.31', 41, null, s.guid, s.info?.name?.text);
  for (const p of g.paths?.entries || []) add('root.32', 38, null, p.guid, componentName(p.components));
  for (const d of g.deployment_groups?.entries || []) add('root.33', 43, null, d.guid, d.name);
  for (const s of g.scene_templates?.kind_a || []) add('root.44.1', 55, null, s.guid, s.name);
  for (const s of g.scene_templates?.kind_b || []) add('root.44.2', 56, null, s.guid, s.name);
  return out;
}

/**
 * Decode a .gil payload. Returns an AssetBundle-shaped object (`resources` only, no `dependencies`: a level has no
 * primary/dependency split) plus `level` metadata. Every entry carries `_gil` = { section, folder?, folderRank?, folderPos?, mounts?, dynamic? }, and
 * { classId, className } when the class is not the plain numeric `resource_class`.
 */
export function decodeGil(payload, root, census) {
  const g = decodeMessage(payload, root.messages.get('GilFile'), census);
  const ng = g.node_graphs || {};
  const raw = scanLevel(payload);
  const resources = [];
  const push = (e, section) => resources.push({ ...e, _gil: { section, ...(e._gil || {}) } });

  for (const w of ng.graphs || []) {
    const gr = w.graph;
    const where = FOLDER_BY_SERVICE[gr?.identity?.service_domain];
    const key = where && folderKey(where, gr?.identity?.runtime_id);
    push({ identity: { asset_guid: gr?.identity?.runtime_id }, internal_name: gr?.display_name || '',
      resource_class: GRAPH_CLASS_BY_SERVICE[gr?.identity?.service_domain] ?? 0, graph_data: { inner: w }, _gil: folderOf(raw, key) }, 'root.10.1');
  }
  for (const w of ng.interfaces || []) {
    const f = w.interface;
    push({ identity: { asset_guid: f?.id?.shell_ref?.runtime_id }, internal_name: f?.name || '',
      resource_class: f?.impl?.send_signal ? 14 : 12, interface_data: { inner: w } }, 'root.10.2');
  }
  // The palette lists a composite by its declaration's id (the id nodes call it by), not by the body's GUID, which can differ.
  const declOfBody = new Map();
  for (const w of ng.interfaces || []) {
    const body = w.interface?.id?.graph_ref?.runtime_id, decl = w.interface?.id?.shell_ref?.runtime_id;
    if (body != null && decl != null) declOfBody.set(body, decl);
  }
  for (const w of ng.composite_bodies || []) {
    const gr = w.graph;
    // a composite in no custom palette folder is not listed anywhere: it is in the default tab
    const guid = declOfBody.get(gr?.identity?.runtime_id) ?? gr?.identity?.runtime_id;
    const inFolder = raw.compositeFolders.has(guid);
    const place = inFolder ? { folder: raw.compositeFolders.get(guid), folderRank: raw.compositeRanks.get(guid) }
      : { folder: raw.folders.defaultTab.get(COMPOSITE_FAMILY), folderRank: DEFAULT_TAB_RANK };
    push({ identity: { asset_guid: gr?.identity?.runtime_id }, internal_name: gr?.display_name || '',
      resource_class: GRAPH_CLASS_BY_SERVICE[gr?.identity?.service_domain] ?? 0, graph_data: { inner: w }, _gil: place }, 'root.10.4');
  }
  for (const sd of ng.structs || []) {
    push({ identity: { asset_guid: sd.concreteField?.id ?? sd.genericField?.id }, internal_name: '',
      resource_class: 29, struct_data: { def: sd } }, 'root.10.6');
  }
  for (const o of listOpaque(g, raw)) {
    const where = FOLDER_BY_CLASS[o.classId];
    resources.push({ identity: { asset_guid: o.guid ?? undefined }, internal_name: o.name, resource_class: o.classId ?? 0,
      _gil: { section: o.section, className: o.className, classId: o.classId, mounts: o.mounts || [], dynamic: o.dynamic, parent: o.parent ?? null,
        ...(where && o.guid != null ? folderOf(raw, folderKey(where, o.guid)) : {}) } });
  }
  return {
    ab: { resources, dependencies: [], mode_flag: g.mode_flag, engine_version: g.engine_version },
    level: { name: g.level_name ?? '' },
  };
}
