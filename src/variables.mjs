// The variables of a file, as the `variables` part of a dump item (see JSON.md): what every node graph declares, what every prefab declares (custom
// variables) and how entities differ from the prefab they were created from. Input: `resource.variables` and `resource.mounts` of the bundle
// (model.mjs, read by varscan.mjs / mounts.mjs).
//   fileVariables(bundle, db, { R, dup }) -> { graphs: [row], prefabs: [row], entities: [row] }
// The stage, the player and the character templates are listed among the prefabs, first and in that order: they hold variables the same way and
// have no prefab of their own.
// A host that mounts a graph can change the value of the graph's published variables (mounts.mjs). Such a change is a row of the host's table with
// `graph` set to the graph; it is listed when the value differs from what the host would have without it: the graph's own value for a prefab, the
// prefab's value for an entity whose prefab mounts the same graph (the graph's own value when it does not, or when the entity has no prefab).
import { variableTypeKey, buildVariable } from './model.mjs';
import { valueJson } from './code.mjs';
import { resourceGuidIndexOf, literalResource } from './refs.mjs';
import { mountsOf } from './mounts.mjs';
import { graphRef } from './present/doc.mjs';
import { taggedGraphLabel } from './analyze.mjs';

const STAGE = 'GIL_LEVEL_ENTITY';
const DICT = 27; // server type id of a dictionary
/** Classes that declare variables for themselves, in the order of the first rows: kind of owner -> class names. Prefab-like classes follow in file order. */
const OWNER_KIND = { GIL_LEVEL_ENTITY: 'stage', PLAYER_TEMPLATE: 'player', CHARACTER_TEMPLATE: 'character', OBJECT: 'prefab', CREATION: 'prefab', PROJECTILE: 'prefab' };
const OWNER_ORDER = ['stage', 'player', 'character', 'prefab'];
/** Classes of the entities that are compared with their prefab: object / creation entities (static ones too), and the entities of the players and characters. */
const ENTITY_CLASSES = new Set(['OBJECT_ENTITY', 'STATIC_ENTITY', 'CREATION_ENTITY', 'GIL_PLAYER_ENTITY', 'GIL_CHARACTER_ENTITY']);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** A graph variable's default carries what the editor knows about the value (`set`, widget), an edit does not: values are compared without it. */
const sameValue = (a, b) => JSON.stringify(a, (k, v) => (k === 'set' ? undefined : v)) === JSON.stringify(b, (k, v) => (k === 'set' ? undefined : v));
const COMPOSITE_BODY_KIND = 21002;

export function fileVariables(bundle, db, { R, dup }) {
  const structRef = (id) => (id != null ? { id, name: R.structName(id) ?? null } : null);
  const ownerRef = (r) => ({ guid: r.guid, name: r.name, class_name: r.className });
  const resources = resourceGuidIndexOf(bundle);
  // what an id (or an Int big enough to be taken for one) points at in the file, as `refs` matches literal ids; shown next to the value like a pin's `resource`
  const annotate = (ast, json) => {
    if (!ast || !json) return json;
    const hit = literalResource(resources, ast.k === 'int' ? { ...ast, ty: 'Int', set: true } : { ...ast, set: true });
    if (hit) json.resource = { class_name: hit.className, name: hit.name };
    for (const key of ['items', 'pairs']) if (ast[key]) ast[key].forEach((a, i) => annotate(a, json[key][i]));
    if (ast.k === 'pair') { annotate(ast.key, json.key); annotate(ast.value, json.value); }
    return json;
  };
  const valueOf = (v) => annotate(v.value, valueJson(v.value, db));
  const typed = (v) => ({ type: v.label, struct: structRef(v.structId) });

  // graph variables: a dictionary's key / value type is stored on every variable, but means something for a dictionary only
  const graphVar = (v) => buildVariable({ ...v, keyType: v.typeId === DICT ? v.keyType : null, valueType: v.typeId === DICT ? v.valueType : null });
  const graphs = [];
  for (const r of bundle.resources) {
    if (r.kind !== 'graph' || !r.graph || r.graph.kind === COMPOSITE_BODY_KIND) continue;
    const ref = graphRef(taggedGraphLabel(r, dup, R));
    for (const v of r.graph.variables.map(graphVar)) graphs.push({ graph: ref, name: v.name, ...typed(v), public: v.isPublic, value: valueOf(v) });
  }

  // the published variables a host sets itself: per host and graph, [{ graph (ref), variable (the graph's), value (the host's, a value AST) }] for every public variable of a graph it mounts
  const mounted = new Map();
  for (const m of mountsOf(bundle)) {
    if (!m.graph) continue;
    const list = mounted.get(m.host) ?? mounted.set(m.host, []).get(m.host);
    const ref = graphRef(taggedGraphLabel(m.graph, dup, R));
    for (const v of m.graph.graph.variables.filter((x) => x.isPublic)) {
      const edit = m.edits.find((x) => x.name === v.name);
      list.push({ graph: ref, key: `${m.graph.guid}/${m.graph.graph.service}`, variable: graphVar(v), value: edit?.value ?? v.value, own: v.value });
    }
  }
  const json = (ast) => valueJson(ast, db);
  /** The rows of a host's mounted graph variables whose value differs from `baseline(entry)` (an AST). */
  const graphRows = (host, baseline) => (mounted.get(host) ?? []).filter((x) => !sameValue(json(x.value), json(baseline(x)))).map((x) => ({ graph: x.graph, name: x.variable.name, ...typed(x.variable), value: valueOf(x) }));

  const owners = bundle.resources.filter((r) => r.variables && OWNER_KIND[r.className]);
  const prefabs = [];
  for (const kind of OWNER_ORDER) {
    for (const r of owners.filter((x) => OWNER_KIND[x.className] === kind)) {
      const owner = { kind, ...ownerRef(r) };
      for (const v of r.variables) prefabs.push({ owner, graph: null, name: v.name, ...typed(v), value: valueOf(v) });
      for (const x of graphRows(r, (m) => m.own)) prefabs.push({ owner, ...x });
    }
  }

  // an entity names its prefab by id; a native object's id is that of no resource of the file, which is a prefab without variables
  const templates = new Map(owners.filter((r) => r.className !== STAGE).map((r) => [r.guid, r]));
  const entities = [];
  for (const e of bundle.resources.filter((r) => r.variables && ENTITY_CLASSES.has(r.className))) {
    const parent = e.parentId != null ? templates.get(e.parentId) ?? null : null;
    const parentVars = parent?.variables ?? [];
    const own = new Map(e.variables.map((v) => [v.name, v]));
    const kept = new Set(parentVars.map((v) => v.name));
    const rows = [];
    const row = (change, v) => rows.push({ graph: null, name: v.name, change, ...typed(v), value: change === 'delete' ? null : valueOf(v) });
    for (const p of parentVars) {
      const v = own.get(p.name);
      if (!v) row('delete', p);
      else if (variableTypeKey(v) !== variableTypeKey(p)) row('newtype', v);
      else if (!same(v.value, p.value)) row('edit', v);
    }
    for (const v of e.variables) if (!kept.has(v.name)) row('add', v);
    // a graph the prefab mounts too is compared with the prefab's value of it
    const parentOwn = new Map((mounted.get(parent) ?? []).map((x) => [`${x.key}/${x.variable.name}`, x.value]));
    for (const x of graphRows(e, (m) => parentOwn.get(`${m.key}/${m.variable.name}`) ?? m.own)) rows.push({ name: x.name, change: 'edit', graph: x.graph, type: x.type, struct: x.struct, value: x.value });
    if (!rows.length) continue;
    const prefab = e.parentId == null ? null : { guid: e.parentId, name: parent?.name ?? null };
    for (const x of rows) entities.push({ entity: ownerRef(e), prefab, ...x });
  }
  return { graphs, prefabs, entities };
}
