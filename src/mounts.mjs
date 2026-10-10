// L1c: what the node-graph *mounts* and the static/dynamic flag of a .gil look like in the raw level.
//
// Both live inside "component" lists that the GilFile schema keeps opaque (only the name component is decoded), so this
// module walks the raw protobuf of root sections 4 (templates), 5 (entities) and 15 (configs) once and returns facts
// keyed by section + guid. It also reads the folder index (root 6) and the composite palette (root 10.3), which the schema
// leaves opaque as well. Derived from test_mount.gil and test_folders.gil (game 7.1.0), see FORMAT.md.
//
// A component is `{1: kind, <payload field>: payload}`; the payload field depends on the kind (kind 1 -> 11, kind 3 -> 13,
// kind 6 -> 21).
//   * Graph mount (entities, prefabs, templates, stage entity, classes): component kind 3, payload
//       13: { 1: { 1: { 1: 1, 2: <graph guid>, 501: <graph service domain> } [, 501: "PlayerBP"|"AvatarBP"] } ... }
//     The wrapper's 501 label exists only on classes: PlayerBP = graph runs on the Player, AvatarBP = on the Character.
//     A player / character *template* is two separate root-4 entries (band 3 / band 4 of the GUID), so there the host
//     itself says which one it is.
//   * Status graph (config type 1): component kind 6 -> field 21 -> 1 -> 1 -> 2 = { 1: 1, 2: <guid>, 501: 20003 };
//     a status without a graph has the same message with only `501: 20003`.
//   * Dynamic entity: the entry carries an extra list of "dynamic" components (entity field 7, template field 8:
//     hit effects, unit status, ...). A static entity has none, or only a kind-1 component. Base config ids do not tell them apart (a static
//     entity converted to dynamic keeps its static config id), the extra list does.
import { walkRaw } from './decode.mjs';

const safe = (b) => { try { return walkRaw(b); } catch { return []; } };
const first = (items, f) => items.find((x) => x.field === f);

/**
 * Static or dynamic? `f` = the decoded fields of an entity definition, `dynField` = its dynamic component list field.
 * Dynamic = the list holds a component other than kind 1. Kind 1 alone (`{1: 1, 11: {}}`) is on static entities too
 * (test_folders: the Pavilion, a native static object, has exactly that); every real dynamic list has more kinds.
 */
export function isDynamic(f, dynField) {
  return f.filter((x) => x.field === dynField && x.wire === 2).some((c) => first(safe(c.value), 1)?.value !== 1);
}

/** The id an entity was created from: `{ 1: id, 2: 1 }` in field 2 of its definition. A prefab's GUID, or the id of a native object. */
const parentOf = (f) => { const p = first(f, 2); return p?.wire === 2 ? first(safe(p.value), 1)?.value ?? null : null; };

/**
 * The same facts for a .gia: an entity resource (class 3) carries the entity definition in its field 12 (opaque in the
 * schema), `12 -> 1 = { 1: guid, 2: { 1: parent id, 2: 1 }, 5: [components], 6: [components], 7: [dynamic components], 8: base config }`,
 * i.e. the very layout of a root-5 entry of a .gil. Returns one value per resource in the order the decoder lists them
 * (all `resources`, then all `dependencies`): `{ dynamic, parent }` for an entity, null for everything else.
 */
export function scanGiaEntities(payload) {
  const root = walkRaw(payload);
  const entries = [...root.filter((x) => x.field === 1 && x.wire === 2), ...root.filter((x) => x.field === 2 && x.wire === 2)];
  return entries.map((e) => {
    const f = safe(e.value);
    if (first(f, 5)?.value !== 3) return null; // ResourceClass OBJECT_ENTITY
    const def = first(safe(first(f, 12)?.value ?? new Uint8Array()), 1);
    if (def?.wire !== 2) return null;
    const d = safe(def.value);
    return { dynamic: isDynamic(d, 7), parent: parentOf(d) };
  });
}

/** [{ guid, service }] graph references inside the payload of a kind-3 component (field 13); `label` = class slot label. */
function graphRefs(payload) {
  const out = [];
  for (const slot of safe(payload)) {          // repeated 1
    if (slot.field !== 1 || slot.wire !== 2) continue;
    const inner = safe(slot.value);
    const ref = first(inner, 1);
    const label = first(inner, 501);
    if (!ref || ref.wire !== 2) continue;
    const r = safe(ref.value);
    const guid = first(r, 2)?.value;
    if (guid == null) continue;
    out.push({ guid, service: first(r, 501)?.value ?? null, label: label?.wire === 2 ? new TextDecoder().decode(label.value) : null });
  }
  return out;
}

/**
 * Raw facts per entry of one root section.
 * @param compFields  which fields of an entry are component lists (graph mounts are searched in all of them)
 * @param dynField    the field holding the dynamic component list (null if the section has none)
 * Returns Map(guid -> { graphs: [{guid, service, label}], dynamic: boolean|null, parent: id|null, statusGraph: {guid,service}|null|undefined }).
 */
export function scanSection(rootItems, section, { compFields, dynField = null, status = false }) {
  const out = new Map();
  for (const sec of rootItems.filter((x) => x.field === section && x.wire === 2)) {
    for (const e of safe(sec.value)) {
      const f = safe(e.value);
      const guid = first(f, 1)?.value;
      if (guid == null) continue;
      const graphs = [];
      let statusGraph;
      for (const c of f.filter((x) => compFields.includes(x.field) && x.wire === 2)) {
        const comp = safe(c.value);
        const kind = first(comp, 1)?.value;
        if (kind === 3) { const p = first(comp, 13); if (p?.wire === 2) graphs.push(...graphRefs(p.value)); }
        if (status && kind === 6) {
          const p = first(comp, 21);
          const ref = p?.wire === 2 ? first(safe(first(safe(first(safe(p.value), 1)?.value ?? new Uint8Array()), 1)?.value ?? new Uint8Array()), 2) : null;
          if (ref?.wire === 2) { const r = safe(ref.value); const g = first(r, 2)?.value; statusGraph = g != null ? { guid: g, service: first(r, 501)?.value ?? null } : null; }
        }
      }
      const dynamic = dynField == null ? null : isDynamic(f, dynField);
      const seen = new Set();
      out.set(guid, { parent: parentOf(f), graphs: graphs.filter((g) => { const k = `${g.guid}/${g.label}`; return seen.has(k) ? false : (seen.add(k), true); }), dynamic, statusGraph });
    }
  }
  return out;
}

// The folder index (root 6): one entry per resource family, `{1: family, 2: root{1:"root", 4: [custom folder]}, 3: default tab}`;
// a folder / tab is `{1: name, 5: [{1: type, 2: guid}]}`. GUIDs repeat across kinds, so an item is keyed by "family/type/guid".
// The family is needed besides the type: family 3 (every entity and prefab instance) lists prefabs with the same type code as the
// prefab family 6. The order of the custom folders and of the items inside a folder is the order the editor lists them in.
const decode = (b) => new TextDecoder().decode(b);
// Folder-index family of the entity node graphs; composites (also entity-domain graphs) share its default tab.
export const COMPOSITE_FAMILY = 4;
// Where each graph domain (service_domain) is filed: its family and item type code.
export const FOLDER_BY_SERVICE = {
  20000: { family: 4, type: 800 }, 20001: { family: 13, type: 2100 }, 20002: { family: 14, type: 2200 }, 20003: { family: 15, type: 2300 },
  20004: { family: 16, type: 2400 }, 20005: { family: 20, type: 4300 }, 20006: { family: 57, type: 6300 }, 20007: { family: 58, type: 6600 },
  20008: { family: 59, type: 6700 }, 20009: { family: 60, type: 6800 }, 20010: { family: 67, type: 7400 },
};
// The same for the non-graph resources whose folders are decoded, by resource class (see gil.mjs): prefab, status config,
// skill, custom creation skill, character control skill.
export const FOLDER_BY_CLASS = {
  1: { family: 6, type: 100 }, 7: { family: 11, type: 1900 }, 8: { family: 12, type: 2800 }, 54: { family: 61, type: 6900 }, 65: { family: 68, type: 7500 },
};
/** Key of an item of the folder index (see scanFolderIndex). */
export const folderKey = (place, guid) => `${place.family}/${place.type}/${guid}`;
/** `folderRank` of the default tab (every custom folder has a rank of 0 or more). */
export const DEFAULT_TAB_RANK = -1;

/**
 * { byKey: Map(folderKey -> folder or tab name),
 *   placeByKey: Map(folderKey -> { rank, pos }), rank = position of the folder among the custom folders of its family
 *     (DEFAULT_TAB_RANK for the default tab), pos = position of the item inside its folder,
 *   defaultTab: Map(family -> name of that family's default tab) }.
 * The default tab is the entry's field 3 ("Uncategorized Tab", localized with the game language); custom folders are
 * field 2.4 (a user folder lives under the "root" node, which is field 2).
 */
export function scanFolderIndex(rootItems) {
  const byKey = new Map(), placeByKey = new Map(), defaultTab = new Map();
  const visit = (buf, rank, famId) => {
    const m = safe(buf), nm = first(m, 1);
    const name = nm?.wire === 2 ? decode(nm.value) : null;
    let pos = 0;
    for (const it of m) {
      if (it.wire !== 2) continue;
      if (it.field === 5) {
        const e = safe(it.value); const t = first(e, 1)?.value, g = first(e, 2)?.value;
        if (name != null && t != null && g != null) { const key = `${famId}/${t}/${g}`; byKey.set(key, name); placeByKey.set(key, { rank, pos: pos++ }); }
      }
    }
  };
  for (const s of rootItems.filter((x) => x.field === 6 && x.wire === 2)) for (const e of safe(s.value)) {
    if (e.field !== 1 || e.wire !== 2) continue;
    const fam = safe(e.value), famId = first(fam, 1)?.value;
    let customRank = 0;
    const tab = fam.find((c) => c.field === 3 && c.wire === 2);
    if (tab) {
      visit(tab.value, DEFAULT_TAB_RANK, famId);
      const nm = first(safe(tab.value), 1);
      if (nm?.wire === 2 && famId != null) defaultTab.set(famId, decode(nm.value));
    }
    // folders sit under the "root" node (field 2); its own items, if any, are not filed in a folder
    for (const root of fam.filter((c) => c.field === 2 && c.wire === 2)) {
      for (const f of safe(root.value).filter((x) => x.field === 4 && x.wire === 2)) visit(f.value, customRank++, famId);
    }
  }
  return { byKey, placeByKey, defaultTab };
}

/**
 * The composite palette (root 10 field 3): `{2: {1: "Composite Node", 2: [{1: folder name, 3: [{1: {5: declaration id}}]}]}}`.
 * The id is the one nodes call the composite by (its declaration's), which can differ from the body's GUID.
 * Returns Map(declaration id -> folder name). A composite that sits in no custom folder is not listed at all: it is in
 * the default tab (see COMPOSITE_FAMILY). `ranks` (optional Map) receives the position of each folder in the palette.
 */
export function scanCompositeFolders(rootItems, ranks = new Map()) {
  const out = new Map();
  for (const s of rootItems.filter((x) => x.field === 10 && x.wire === 2)) for (const it of safe(s.value)) {
    if (it.field !== 3 || it.wire !== 2) continue;
    const pal = first(safe(it.value), 2);
    if (!pal || pal.wire !== 2) continue;
    const pm = safe(pal.value);
    let rank = 0;
    for (const folder of pm.filter((x) => x.field === 2 && x.wire === 2)) {
      const fm = safe(folder.value), fname = first(fm, 1);
      if (fname?.wire !== 2) continue;
      const thisRank = rank++;
      for (const ref of fm.filter((x) => x.field === 3 && x.wire === 2)) {
        const loc = first(safe(ref.value), 1);
        const g = loc?.wire === 2 ? first(safe(loc.value), 5)?.value : null;
        if (g != null) { out.set(g, decode(fname.value)); ranks.set(g, thisRank); }
      }
    }
  }
  return out;
}

/** All raw facts of a level payload: { templates, entities, configs } maps (see scanSection), plus the folder indexes. */
export function scanLevel(payload) {
  const root = walkRaw(payload);
  const compositeRanks = new Map();
  return {
    templates: scanSection(root, 4, { compFields: [6, 7, 8], dynField: 8 }),
    entities: scanSection(root, 5, { compFields: [5, 6, 7], dynField: 7 }),
    configs: scanSection(root, 15, { compFields: [4, 5], status: true }),
    folders: scanFolderIndex(root),
    compositeFolders: scanCompositeFolders(root, compositeRanks),
    compositeRanks,
  };
}

/**
 * Every graph mount of a bundle, joined to the graph resource: [{ host, slot, guid, service, graph|null }].
 * GIL GUIDs are unique per kind only, so the graph is looked up by GUID *and* service domain (the mount carries it);
 * composite bodies can never be mounted. `graph` is null when the file has no such graph (mount left dangling).
 */
export function mountsOf(bundle) {
  const graphs = bundle.resources.filter((r) => r.kind === 'graph' && r.graph && r.graph.kind !== 21002);
  const out = [];
  for (const host of bundle.resources) for (const m of host.mounts || []) {
    const graph = graphs.find((g) => g.guid === m.graph && (m.service == null || g.graph.service === m.service)) ?? null;
    out.push({ host, slot: m.slot, guid: m.graph, service: m.service, graph });
  }
  return out;
}
