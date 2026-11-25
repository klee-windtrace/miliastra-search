// The dump report as a document (see doc.mjs). Input: the `dump` list of a dump report (JSON.md), one item per file.
// `dedup` (a rendering option) lists resources that only differ in their guid once (see `dedupResources`).
// `details` (a rendering option) adds the numeric values the report always holds: class ids, sections, a graph's kind / service / entry slot /
// evaluation interval / declaration, a signal's category.
// Line formats: one `GRAPH` / `DECL` / `RESOURCE` line per item (and a `MOUNT` line below a resource that has graphs mounted on it); the
// document formats show consecutive items of one kind as one table. The `Variables` section follows the items: a `GRAPH_VARIABLE` line per variable a graph
// declares, a `VARIABLE` line per variable a prefab declares (and per published graph variable it sets itself, the graph in braces after the name) and a
// `VARIABLE_CHANGE` line per way an entity differs from its prefab (three tables under one heading); variable names are 'single-quoted'.
import { S, graph, graphLabelOf, flat, plain, sep } from './doc.mjs';
import { f32, qs, valueSpans } from './values.mjs';
import { printFileDocs } from './files.mjs';
import { openingBlocks, unresolvedBlocks } from './notes.mjs';

const kw = (t) => S('keyword', t);
const field = (k, v) => [sep(), S('metaKey', k), '=', typeof v === 'object' ? v : S('metaValue', v)]; // " key=value" (value: text, number or spans)
const roleDep = (x) => (x.dependency ? field('role', 'dependency') : '');
const G = (ref) => graph(graphLabelOf(ref));
// The category of a signal declaration is already said by its class name, so it is shown for those only with `details`.
const SIGNAL_CATEGORIES = new Set(['SEND_SIGNAL', 'LISTEN_SIGNAL']);
const folderSpan = (f) => (f == null ? '' : S('folderName', f)); // printed as /name/ right before the quoted name
const hostSpans = (h) => [S('className', h.class_name), ' ', S('key', h.name), sep(), S('metaValue', h.slot)];
const mountedSpans = (m) => (m.graph ? G(m.graph) : S('flag', `<missing graph ${m.graph_guid}>`));
const parentSpans = (x) => (x.parent ? ['(', S('metaValue', x.parent.id), x.parent.name != null ? [':', S('key', x.parent.name)] : '', ')'] : x.entities != null ? ['(entities: ', S('count', x.entities), ')'] : '');

/** A table (and its heading) for a run of graphs. `details` = the numeric columns. */
function graphsBlocks(rows, details) {
  const some = (f) => rows.some(f);
  const withFolders = some((x) => x.folder != null), withRole = some((x) => x.dependency), withDesc = some((x) => x.description);
  const withSlot = details && some((x) => x.entry_slot != null), withEval = details && some((x) => x.evaluation_interval != null), withDecl = details && some((x) => x.decl_guid != null);
  const line = (x) => [S('heading', 'GRAPH'), sep(), folderSpan(x.folder), G(x.name), sep(), S('className', x.class_name), details ? field('class', x.class_id) : '', field('guid', S('guid', x.guid)),
    details ? [field('kind', x.kind), field('service', x.service)] : '', field('nodes', x.nodes), roleDep(x), details && x.decl_guid != null ? field('decl', S('guid', x.decl_guid)) : '',
    details && x.entry_slot != null ? field('entry_slot', S('metaValue', x.entry_slot)) : '', details && x.evaluation_interval != null ? field('evaluation_interval', S('metaValue', f32(x.evaluation_interval))) : '',
    x.description ? field('description', qs(x.description)) : ''];
  return [
    { t: 'heading', level: 2, spans: `Graphs (${rows.length})`, recount: (n) => `Graphs (${n})`, text: null },
    { t: 'table',
      cols: [{ title: 'Name' }, { title: 'Class' }, ...(details ? [{ title: 'Class id', align: 'right' }] : []), { title: 'Guid' }, ...(details ? [{ title: 'Kind', align: 'right' }, { title: 'Service', align: 'right' }] : []), { title: 'Nodes', align: 'right' },
        ...(withSlot ? [{ title: 'Entry slot', align: 'right' }] : []), ...(withEval ? [{ title: 'Evaluation interval', align: 'right' }] : []), ...(withDecl ? [{ title: 'Declaration' }] : []),
        ...(withFolders ? [{ title: 'Folder' }] : []), ...(withRole ? [{ title: 'Role' }] : []), ...(withDesc ? [{ title: 'Description' }] : [])],
      rows: rows.map((x) => [G(x.name), S('className', x.class_name), ...(details ? [String(x.class_id ?? '-')] : []), S('guid', x.guid), ...(details ? [S('metaValue', x.kind), S('metaValue', x.service)] : []), S('count', x.nodes),
        ...(withSlot ? [x.entry_slot != null ? S('metaValue', x.entry_slot) : ''] : []), ...(withEval ? [x.evaluation_interval != null ? S('metaValue', f32(x.evaluation_interval)) : ''] : []), ...(withDecl ? [x.decl_guid != null ? S('guid', x.decl_guid) : ''] : []),
        ...(withFolders ? [folderSpan(x.folder)] : []), ...(withRole ? [x.dependency ? 'dependency' : ''] : []), ...(withDesc ? [x.description ? qs(x.description) : ''] : [])]),
      text: rows.map(line) },
  ];
}

function declarationsBlocks(rows, details) {
  const shown = (x) => x.category != null && (details || !SIGNAL_CATEGORIES.has(x.category)); // the category column / field
  const withCat = rows.some(shown), withRole = rows.some((x) => x.dependency), withDesc = rows.some((x) => x.description);
  const line = (x) => [S('heading', 'DECL'), sep(), [S('declName', x.name), sep(), S('className', x.class_name), details ? field('class', x.class_id) : '', field('guid', S('guid', x.guid)), shown(x) ? field('category', x.category) : '',
    x.description ? field('description', qs(x.description)) : '', roleDep(x)]];
  return [
    { t: 'heading', level: 2, spans: `Declarations (${rows.length})`, recount: (n) => `Declarations (${n})`, text: null },
    { t: 'table',
      cols: [{ title: 'Name' }, { title: 'Class' }, ...(details ? [{ title: 'Class id', align: 'right' }] : []), { title: 'Guid' }, ...(withCat ? [{ title: 'Category' }] : []), ...(withRole ? [{ title: 'Role' }] : []), ...(withDesc ? [{ title: 'Description' }] : [])],
      rows: rows.map((x) => [S('declName', x.name), S('className', x.class_name), ...(details ? [String(x.class_id ?? '-')] : []), S('guid', x.guid), ...(withCat ? [shown(x) ? S('metaValue', x.category) : ''] : []),
        ...(withRole ? [x.dependency ? 'dependency' : ''] : []), ...(withDesc ? [x.description ? qs(x.description) : ''] : [])]),
      text: rows.map(line) },
  ];
}

/**
 * With `dedup`: the resources of a run that have no folder and equal name, class (and section with `details`), parent and mounted graphs, as one entry
 * that stands where the first of them stands, with the smallest guid of them and the number of the others: [{ x, more }].
 */
function dedupResources(rows, details) {
  const out = [], groups = new Map();
  const smaller = (a, b) => { a = String(a); b = String(b); return /^\d+$/.test(a) && /^\d+$/.test(b) ? BigInt(a) < BigInt(b) : a < b; };
  for (const x of rows) {
    if (x.folder != null) { out.push({ x, more: 0 }); continue; }
    const mounts = x.mounts.map((m) => [m.slot, m.graph ? graphLabelOf(m.graph) : `<missing graph ${m.graph_guid}>`]).sort((p, q) => (p.join() < q.join() ? -1 : p.join() > q.join() ? 1 : 0));
    const k = JSON.stringify([x.name, x.class_name, details ? x.section ?? '' : '', plain(parentSpans(x)), mounts]);
    const g = groups.get(k);
    if (!g) { const entry = { x: { ...x }, more: 0 }; groups.set(k, entry); out.push(entry); continue; }
    g.more++;
    if (smaller(x.guid, g.x.guid)) g.x.guid = x.guid;
  }
  return out;
}

function resourcesBlocks(rows, details, { dedup = false } = {}) {
  const entries = dedup ? dedupResources(rows, details) : rows.map((x) => ({ x, more: 0 }));
  const list = entries.map((e) => e.x);
  const withMounts = list.some((x) => x.mounts.length), withFolders = entries.some((e) => e.x.folder != null || e.more), withParent = list.some((x) => flat(parentSpans(x)).length);
  const moreSpan = (n) => S('more', `+${n} more`); // the number of the resources left out
  // a deduplicated resource's mounts stand for the mounts of the others too, so they carry the count as well
  const mountLine = (m, more) => [kw('MOUNT'), sep(), mountedSpans(m), ' ', S('arrow', '->'), sep(), hostSpans(m.host), more ? [sep(), moreSpan(more)] : ''];
  const line = ({ x, more }) => [S('heading', 'RESOURCE'), sep(), folderSpan(x.folder), S('declName', x.name), sep(), S('className', x.class_name), details ? field('class', x.class_id ?? '-') : '', field('guid', S('guid', x.guid)),
    flat(parentSpans(x)).length ? field('parent', parentSpans(x)) : '', details && x.section ? field('section', x.section) : '', more ? [sep(), moreSpan(more)] : ''];
  const lines = entries.map((e) => [line(e), ...e.x.mounts.map((m) => mountLine(m, e.more))]);
  return [
    { t: 'heading', level: 2, spans: `Resources (${rows.length})`, recount: (n) => `Resources (${n})`, text: null },
    { t: 'table', cols: [{ title: 'Name' }, { title: 'Class' }, ...(details ? [{ title: 'Class id', align: 'right' }] : []), { title: 'Guid' }, ...(details ? [{ title: 'Section' }] : []), ...(withParent ? [{ title: 'Parent' }] : []), ...(withFolders ? [{ title: 'Folder' }] : []), ...(withMounts ? [{ title: 'Mounted graphs' }] : [])],
      rows: entries.map(({ x, more }) => [S('declName', x.name), S('className', x.class_name), ...(details ? [x.class_id != null ? String(x.class_id) : '-'] : []), S('guid', x.guid), ...(details ? [x.section ? String(x.section) : ''] : []),
        ...(withParent ? [parentSpans(x)] : []), ...(withFolders ? [[folderSpan(x.folder), more ? moreSpan(more) : '']] : []), ...(withMounts ? [{ lines: x.mounts.map((m) => [S('metaValue', m.slot), ': ', mountedSpans(m)]) }] : [])]),
      text: lines.flat(), rowLines: lines },
  ];
}


// ---- variables ----
const OWNER_WORDS = { stage: 'Stage', player: 'Player', character: 'Character' }; // a prefab is told by its id alone
const idName = (id, name) => [S('metaValue', id), name != null ? [':', S('key', name)] : ''];                 // 1077936129:"Empty Model"
const ownerSpans = (o) => [OWNER_WORDS[o.kind] ? [S('className', OWNER_WORDS[o.kind]), ' '] : '', idName(o.guid, o.name)];
const prefabSpans = (p) => (p ? ['(', idName(p.guid, p.name), ')'] : '');                                      // (1077936129:"Empty Model")
const structLabel = (s) => (s.name ?? String(s.id));
const typeSpans = (x) => [S('typeName', x.type), x.struct ? field('struct', S('structName', structLabel(x.struct))) : ''];
const publicSpans = (x) => (x.public ? ' (public)' : '');                                                     // after the type of a published graph variable
const variableSpans = (x) => [S('variableName', x.name), x.graph ? [' {', G(x.graph), '}'] : ''];                  // 'Faction' {'Graph'}: a graph variable the host sets itself
const changeSpans = (x) => [S('role', x.change), ':', sep(), S('typeName', x.type), x.struct ? field('struct', S('structName', structLabel(x.struct))) : ''];

/** The `Variables` section: the tables of what the graphs declare, what the prefabs declare and what entities change, under one heading (nothing when there are none). */
function variablesBlocks({ graphs, prefabs, entities }) {
  if (!graphs.length && !prefabs.length && !entities.length) return [];
  const blocks = [{ t: 'heading', level: 2, spans: 'Variables', text: null }];
  if (graphs.length) {
    blocks.push({ t: 'table', cols: [{ title: 'Graph' }, { title: 'Variable' }, { title: 'Type' }, { title: 'Value' }],
      rows: graphs.map((x) => [G(x.graph), S('variableName', x.name), [typeSpans(x), publicSpans(x)], valueSpans(x.value) ?? '']),
      text: graphs.map((x) => [S('heading', 'GRAPH_VARIABLE'), sep(), G(x.graph), sep(), S('variableName', x.name), ' :', sep(), typeSpans(x), publicSpans(x), x.value ? [' ', S('arrow', '='), sep(), valueSpans(x.value)] : '']) });
  }
  if (prefabs.length) {
    blocks.push({ t: 'table', cols: [{ title: 'Prefab' }, { title: 'Variable' }, { title: 'Type' }, { title: 'Value' }],
      rows: prefabs.map((x) => [ownerSpans(x.owner), variableSpans(x), typeSpans(x), valueSpans(x.value) ?? '']),
      text: prefabs.map((x) => [S('heading', 'VARIABLE'), sep(), ownerSpans(x.owner), sep(), variableSpans(x), ' :', sep(), typeSpans(x), x.value ? [' ', S('arrow', '='), sep(), valueSpans(x.value)] : '']) });
  }
  if (entities.length) {
    blocks.push({ t: 'table', cols: [{ title: 'Entity' }, { title: 'Prefab' }, { title: 'Variable' }, { title: 'Change' }, { title: 'Value' }],
      rows: entities.map((x) => [idName(x.entity.guid, x.entity.name), prefabSpans(x.prefab), variableSpans(x), changeSpans(x), valueSpans(x.value) ?? '']),
      text: entities.map((x) => [S('heading', 'VARIABLE_CHANGE'), sep(), idName(x.entity.guid, x.entity.name), x.prefab ? [sep(), prefabSpans(x.prefab)] : '', sep(), variableSpans(x), sep(), changeSpans(x), x.value ? [' ', S('arrow', '='), sep(), valueSpans(x.value)] : '']) });
  }
  return blocks;
}

const RUNS = { graph: graphsBlocks, declaration: declarationsBlocks, resource: resourcesBlocks };

/** The dump document of one file (title and warnings first, the node types without a name last). */
export function dumpBlocks(dump, { details = false, fileLine = false, dedup = false } = {}) {
  const blocks = openingBlocks(dump, { fileLine });
  // consecutive items of one kind are one table
  for (let i = 0; i < dump.items.length;) {
    let j = i;
    while (j < dump.items.length && dump.items[j].type === dump.items[i].type) j++;
    blocks.push(...RUNS[dump.items[i].type](dump.items.slice(i, j), details, { dedup }));
    i = j;
  }
  blocks.push(...variablesBlocks(dump.variables));
  blocks.push(...unresolvedBlocks(dump.unresolved_nodes));
  return blocks;
}

/** The dump report as documents, one per file: [{ file, blocks }]. `details` = the rendering option of that name. */
export function dumpDocs(report, { details = false, dedup = false } = {}) {
  const fileLine = report.header.files.length > 1;
  return report.dump.map((d) => ({ file: d.file, blocks: dumpBlocks(d, { details, fileLine, dedup }) }));
}

/** Print the dump report: the whole document, or only the lines matching --search / --match. */
export function printDump(report, printer, { noFilePrefix = false, details = false, dedup = false } = {}) {
  return printFileDocs(dumpDocs(report, { details, dedup }), printer, { multi: report.header.files.length > 1, noFilePrefix, title: `dump ${report.header.files.join(', ')}` });
}
