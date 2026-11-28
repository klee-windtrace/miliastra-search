// The `dump` mode: one item per file with the overview of what it holds, in the order the editor lists it: a line per graph, declaration and
// other resource (with the graphs mounted on it). An item of `dump` in the dump report (see JSON.md); src/present/dump.mjs prints it.
//   fileDump(bundle, db, { analysis }) -> plain data object
// The data holds the numeric values the editor does not show (class ids, sections, graph kind / service / entry slot / evaluation interval) as
// well; the renderer shows them only on request (`--details`). What the dump leaves out (composite declarations, the second half of a
// send-signal pair, structs) is not in the data. `variables` holds the graph variables, the custom variables of the prefabs and what entities change (variables.mjs).
import { folderLabel } from './model.mjs';
import { graphRef } from './present/doc.mjs';
import { fileVariables } from './variables.mjs';
import { analyzeBundle, graphLabel, taggedGraphLabel, hiddenDeclarations, fileFacts, unresolvedNodes, GRAPH_SERVICE_TAG } from './analyze.mjs';

const ENTITY_CLASSES = new Set([3, 4]), TEMPLATE_CLASSES = new Set([1, 2, 25]);
const COMPOSITE_BODY_KIND = 21002;

export function fileDump(bundle, db, { analysis = null } = {}) {
  const { R, dup, mountsOfHost } = analysis ?? analyzeBundle(bundle, db);

  const hiddenDecl = hiddenDeclarations(bundle);

  // Entities and the prefabs they were created from. An entity names its parent by id: the GUID of a prefab / creation / projectile
  // template, or (for a native object) an id that is no resource of the file. A prefab shows how many entities use it.
  const templateByGuid = new Map(), entityCount = new Map();
  for (const x of bundle.resources) {
    if (x.kind !== 'opaque' || x.guid == null) continue;
    if (TEMPLATE_CLASSES.has(x.classId)) templateByGuid.set(x.guid, x);
    else if (ENTITY_CLASSES.has(x.classId) && x.parentId != null) entityCount.set(x.parentId, (entityCount.get(x.parentId) || 0) + 1);
  }
  const parentOf = (r) => {
    if (!ENTITY_CLASSES.has(r.classId) || r.parentId == null) return null;
    return { id: r.parentId, name: templateByGuid.get(r.parentId)?.name ?? null };
  };
  const entitiesOf = (r) => {
    if (!TEMPLATE_CLASSES.has(r.classId)) return null;
    const n = entityCount.get(r.guid) || 0;
    return r.classId === 1 || n ? n : null; // a prefab says how many entities it has, the other templates only when some do
  };

  const items = [];
  for (const r of bundle.resources) {
    const dependency = r.role === 'dependency';
    if (r.kind === 'graph' && r.graph) {
      const g = r.graph, tag = GRAPH_SERVICE_TAG[g.service];
      const decl = g.kind === COMPOSITE_BODY_KIND ? R.declForBody(r) : null;
      items.push({
        type: 'graph', name: graphRef(`${tag ? `<${tag}>` : ''}${graphLabel(r, dup, R)}`), folder: folderLabel(r), class_name: r.className, class_id: r.classId, guid: r.guid,
        kind: g.kind, service: g.service, nodes: g.nodes.length, entry_slot: g.entrySlotIndex ?? null, evaluation_interval: g.evaluationInterval ?? null,
        composite_body: g.kind === COMPOSITE_BODY_KIND, decl_guid: decl?.guid ?? null, description: decl?.iface.description || null, dependency,
      });
    } else if (r.kind === 'interface' && r.iface) {
      if (r.className === 'COMPOSITE_NODE_DECL' || hiddenDecl(r)) continue; // every composite is also a graph; the second half of a send-signal pair adds nothing
      const f = r.iface;
      items.push({
        type: 'declaration', name: f.sendSignal?.name || f.listenSignal?.name || f.name || r.name, class_name: r.className, class_id: r.classId, guid: r.guid,
        category: f.categoryName ?? null, description: f.description || null, dependency,
      });
    } else if (r.kind === 'struct' && r.struct) {
      continue; // the dump does not list structs (code and refs do)
    } else {
      items.push({
        type: 'resource', name: r.name, folder: folderLabel(r), class_name: r.className, class_id: r.classId, guid: r.guid, section: r.section ? String(r.section) : null,
        parent: parentOf(r), entities: entitiesOf(r),
        mounts: (mountsOfHost.get(r) || []).map((m) => ({
          slot: m.slot, graph: m.graph ? graphRef(taggedGraphLabel(m.graph, dup, R)) : null, graph_guid: m.guid ?? null,
          host: { class_name: m.host.className, name: m.host.name, slot: m.slot },
        })),
      });
    }
  }
  return { ...fileFacts(bundle, db), items, variables: fileVariables(bundle, db, { R, dup }), unresolved_nodes: unresolvedNodes(R) };
}
