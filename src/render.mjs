// L4: the `dump` / `code` report, built as a document (see doc.mjs) whose text form is one fact per line, every line
// self-contained and greppable.
import { pinKindName, typeName, SERVER_TYPES, folderLabel } from './model.mjs';
import { Resolver } from './resolve.mjs';
import { S, graph as graphSpan, marker, plain, join, countEqual, flat } from './doc.mjs';
import { mountsOf } from './mounts.mjs';

export function f32(v) {
  if (!Number.isFinite(v)) return String(v);
  for (let p = 1; p <= 9; p++) { const s = Number(v.toPrecision(p)); if (Math.fround(s) === v) return String(s); }
  return String(v);
}
// Inner text of a quoted string literal (escapes \\, ' and newline); q() adds the quotes, strSpan() lets the formatter add them.
const qi = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
const q = (s) => `'${qi(s)}'`;
const qs = (s) => S('string', qi(s));

/** Formatted pin/variable value as spans (each kind of value has its own theme style), or null when there is nothing to show. */
export function fmtValueSpans(val, ctx) {
  if (!val) return null;
  if (!val.set && !ctx?.defaults && val.k !== 'poly' && val.k !== 'list' && val.k !== 'map' && val.k !== 'struct') return null;
  if (!val.set && !ctx?.defaults && ((val.k === 'list' && !val.items.length) || (val.k === 'map' && !val.pairs.length))) return null;
  const sub = (v) => fmtValueSpans(v, ctx) ?? '_';
  const list = (items) => join(items.map(sub), ', ');
  switch (val.k) {
    case 'unset': return null;
    case 'int': return S('number', val.v);
    case 'float': return S('number', f32(val.v));
    case 'str': return qs(val.v);
    case 'id': return S('idValue', `id:${val.v}`);
    case 'vec': return S('vector', `(${val.v.map(f32).join(', ')})`);
    case 'enum': {
      if (val.ty === 'Bol') return val.v === 1 ? S('bool', 'Yes') : val.v === 0 ? S('bool', 'No') : S('enumValue', `enum:${val.v}`);
      const c = ctx?.db?.enumCandidates(val.v) || [];
      const uniq = [...new Set(c.map((x) => x.name))];
      if (uniq.length === 1) return S('enumValue', `enum:${val.v}«${uniq[0]}»`);
      if (uniq.length > 1) return S('enumValue', `enum:${val.v}«${uniq.slice(0, 3).join(' | ')}${uniq.length > 3 ? ' |…' : ''}»`);
      return S('enumValue', `<unknown-enum:${val.v}>`);
    }
    case 'list': return ['[', list(val.items), ']'];
    case 'struct': return ['struct{', list(val.items), '}'];
    case 'pair': return [sub(val.key), ': ', sub(val.value)];
    case 'map': return ['{', list(val.pairs), '}'];
    case 'poly': return val.inner ? fmtValueSpans(val.inner, ctx) : null;
    default: return `<value:${val.k}>`;
  }
}

/** Effective type label of a value (looks through poly). */
export function valType(val) {
  if (!val) return null;
  if (val.k === 'poly') return val.inner?.ty || null;
  return val.ty || null;
}

export function pinTypeLabel(pin, graph) {
  const backend = graph.service === 20000 || [20003, 20004, 20005].includes(graph.service) ? 1 : 2;
  if (pin.typeId == null) return null;
  return typeName(backend, pin.typeId);
}

const PIN_LABEL = { 1: 'in.flow', 2: 'out.flow', 3: 'in', 4: 'out', 5: 'meta.rpc', 6: 'meta.topic' };
const pinLabel = (k) => PIN_LABEL[k] || pinKindName(k);

export function baseGraphName(res, R) {
  const g = res.graph;
  if (g.name) return g.name;
  if (res.name) return res.name;
  if (g.kind === 21002 && R) { const decl = R.declForBody(res); if (decl) return `<composite>${decl.iface.name || decl.name}`; }
  return `graph#${res.guid}`;
}
export function graphLabel(res, dupNames, R) {
  const base = baseGraphName(res, R);
  return dupNames.has(base) ? `${base}#${res.guid}` : base;
}

/**
 * service_domain -> graph-name tag. Only the domains that need one are listed; the other server domains
 * (basic 20000, item 20005) are ordinary graphs and get none.
 *   SERVER_STATUS(20003) -> status
 *   SERVER_CLASS(20004) -> class   (a class graph is mounted on a class, never on an entity)
 *   CLIENT_FILTER(20001, bool) / CLIENT_INT_FILTER(20006) -> filter
 *   CLIENT_SKILL(20002, character) / CLIENT_CHARACTER_CONTROL_SKILL(20010, control) -> skill
 *   CLIENT_CREATION_STATUS_DECISION(20007) / CLIENT_CREATION_SKILL(20008) / CLIENT_CREATION_STATUS(20009) -> creation
 */
export const GRAPH_SERVICE_TAG = {
  20003: 'status',
  20004: 'class',
  20001: 'filter', 20006: 'filter',
  20002: 'skill', 20010: 'skill',
  20007: 'creation', 20008: 'creation', 20009: 'creation',
};

/**
 * Like graphLabel, but prefixed with "<composite>" for a composite body (locator kind 21002, which is not a node graph
 * the user enters) or with the GRAPH_SERVICE_TAG tag of the graph's service domain. Used wherever a graph name is
 * shown outside its own section heading (refs, mounts), so the name carries enough context to find the graph in the editor.
 */
export function taggedGraphLabel(res, dupNames, R) {
  const g = res.graph;
  if (g.kind === 21002) {
    const decl = R.declForBody(res);
    const base = baseGraphName(res, R); // "<composite>Name" or a plain name; the prefix is normalised below
    const label = dupNames.has(base) ? `${base}#${res.guid}` : base;
    return `<composite>${label.replace(/^(?:composite:|<composite>)/, "")}`;
  }
  const label = graphLabel(res, dupNames, R);
  const tag = GRAPH_SERVICE_TAG[g.service];
  return tag ? `<${tag}>${label}` : label;
}

/**
 * Phase 1 of the dump: everything that needs the whole file before anything is printed. Resolves every node name
 * (which also collects the unresolved node types), numbers duplicate graph names, and joins graph mounts with their hosts.
 * The printing views (`dump`, `code`) all read this and never change it.
 */
export function analyzeBundle(bundle, db) {
  const R = new Resolver(bundle, db);
  const graphs = bundle.resources.filter((r) => r.kind === 'graph' && r.graph);
  const seen = new Map(), dup = new Set();
  for (const r of graphs) { const b = baseGraphName(r, R); if (seen.has(b)) dup.add(b); seen.set(b, 1); }
  const mounts = mountsOf(bundle);
  const mountsOfHost = new Map();  // host resource -> its mounts
  for (const m of mounts) { if (!mountsOfHost.has(m.host)) mountsOfHost.set(m.host, []); mountsOfHost.get(m.host).push(m); }
  const nodeLabel = new Map(); // graph -> Map(index -> info)
  // First pass: resolve names so edges can refer to targets by name.
  for (const r of graphs) {
    const g = r.graph; const m = new Map();
    for (const n of g.nodes) m.set(n.index, R.node(g, n, `${graphLabel(r, dup, R)}/[${n.index}]`));
    nodeLabel.set(g, m);
  }
  return { R, graphs, dup, mounts, mountsOfHost, nodeLabel };
}

/**
 * Produce the dump as a document (see src/doc.mjs). Each block carries `text` (the greppable lines: one fact per
 * line, every line self-contained) plus the structure the document formats need (headings per graph,
 * tables for variables/port maps/pins). Returns { blocks, summary }.
 */
export function renderDoc(bundle, db, opts = {}) {
  // Phase 1: analyse the whole file (names, node labels, mounts). Phase 2 below only decides what to print:
  // opts.code (default true) = per-node code, opts.resources (default true) = the resource list. Neither changes the analysis.
  // opts.details (default false) = also the numeric class / section / kind / service values and the like (see `dump --details`).
  const { R, graphs, dup, mounts, mountsOfHost, nodeLabel } = opts.analysis ?? analyzeBundle(bundle, db);
  const showCode = opts.code !== false, showResources = opts.resources !== false, details = !!opts.details;
  const blocks = [];

  const kw = (t) => S('keyword', t);
  // " key=value" (value: text, number or spans)
  const field = (k, v) => [' ', S('metaKey', k), '=', typeof v === 'object' ? v : S('metaValue', v)];
  const pinL = (kind, index) => S('pinLabel', `${pinLabel(kind)}#${index}`);
  const roleDep = (r) => (r.role === 'dependency' ? field('role', 'dependency') : '');

  // The file facts (format, version, mode, names) are the `info` mode's business (src/info.mjs), not part of dump/code.
  // The title only gives the document formats (md/htm/markdown/html) their H1; in the line formats it prints nothing for a
  // single file, and a `# FILE name` line when several files are printed in one run (opts.fileLine), else lines of different files would run together.
  const fileLabel = opts.fileLabel ?? bundle.file;
  blocks.push({ t: 'title', spans: ['File ', S('fileName', fileLabel)], text: opts.fileLine ? [[marker('# '), S('heading', 'FILE'), ' ', S('fileName', fileLabel)]] : null });
  const versionBlockAt = blocks.length; // the unresolved-node-types warning is inserted here, before the container warnings
  for (const w of bundle.warnings) blocks.push({ t: 'note', level: 'warn', spans: ['Container warning: ', w], text: [[marker('# '), S('warn', 'CONTAINER WARNING:'), ' ', w]] });

  // The folder a resource is filed in, printed as /name/ right before its quoted name (nothing when the file does not say).
  const folderSpan = (r) => { const f = folderLabel(r); return f == null ? '' : S('folderName', f); };
  const hostSpans = (m) => [S('className', m.host.className), ' ', S('key', m.host.name), ' ', S('metaValue', m.slot)];
  // the same graph on several identical hosts (same class, name and slot) is listed once with a count: "... entity (x3)"
  const hostsGrouped = (ms) => join(countEqual(ms, (m) => `${m.host.className}\0${m.host.name}\0${m.slot}`).map(({ item, n }) => [hostSpans(item), n > 1 ? ` (x${n})` : '']), '; ');
  const mountedGraphSpans = (m) => (m.graph ? graphSpan(taggedGraphLabel(m.graph, dup, R)) : S('flag', `<missing graph ${m.guid}>`));

  // A send signal is declared twice: the node used in the server graphs and its twin for the other service domain
  // ("... to Server Node Graph"); each names the other as its client node. Only the server-side one is printed.
  const sendDecls = bundle.resources.filter((x) => x.kind === 'interface' && x.iface?.sendSignal);
  const hiddenDecl = (r) => {
    const s = r.iface?.sendSignal;
    if (!s) return false;
    const twin = sendDecls.find((p) => p !== r && p.iface.sendSignal.name === s.name && String(p.guid) === String(s.client?.id) && String(r.guid) === String(p.iface.sendSignal.client?.id));
    if (!twin) return false;
    const own = (x) => x.iface.id?.shell?.service, server = (x) => x.iface.sendSignal.server?.service;
    const mine = own(r) === server(r), theirs = own(twin) === server(twin);
    return mine === theirs ? twin.idx < r.idx : !mine; // the half living in its server node's domain stays
  };
  // Entities and the prefabs they were created from. An entity names its parent by id: the GUID of a prefab / creation / projectile
  // template, or (for a native object) an id that is no resource of the file. A prefab shows how many entities use it.
  const ENTITY_CLASSES = new Set([3, 4]), TEMPLATE_CLASSES = new Set([1, 2, 25]);
  const templateByGuid = new Map(), entityCount = new Map();
  for (const x of bundle.resources) {
    if (x.kind !== 'opaque' || x.guid == null) continue;
    if (TEMPLATE_CLASSES.has(x.classId)) templateByGuid.set(x.guid, x);
    else if (ENTITY_CLASSES.has(x.classId) && x.parentId != null) entityCount.set(x.parentId, (entityCount.get(x.parentId) || 0) + 1);
  }
  const parentSpans = (r) => {
    if (ENTITY_CLASSES.has(r.classId)) {
      if (r.parentId == null) return '';
      const p = templateByGuid.get(r.parentId);
      return ['(', S('metaValue', r.parentId), p ? [':', S('key', p.name)] : '', ')']; // a native / unknown parent: just its id
    }
    const n = entityCount.get(r.guid) || 0;
    return TEMPLATE_CLASSES.has(r.classId) && (r.classId === 1 || n) ? ['(entities: ', S('count', n), ')'] : '';
  };
  const ctx = { db, defaults: !!opts.defaults };
  const idStr = (info) => (info.shellId == null ? '' : info.kernelId !== info.shellId ? `${info.shellId}/${info.kernelId}` : `${info.shellId}`);
  const nodeHead = (idx, info) => [S('nodeIndex', `[${idx}]`), ' ', S('nodeName', info.name), ' ', S('nodeId', `(${idStr(info)})`)];
  const nodeShort = (g, idx) => { const info = nodeLabel.get(g).get(idx); return info ? nodeHead(idx, info) : S('flag', `[${idx}] <missing node>`); };
  // one section: an H2 with its facts (md/html) whose text form is the "KIND ..." line
  const sec = (word, spans, textSpans, facts) => {
    blocks.push({ t: 'heading', level: 2, plain: true, spans: [word, ' ', spans], text: [[S('heading', word.toUpperCase()), ' ', ...textSpans]] });
    if (facts) blocks.push({ t: 'facts', items: facts, text: null });
  };
  let declRows = null; // consecutive declarations of the dump view are collected into one table
  const flushDecls = () => {
    if (!declRows) return;
    const rows = declRows; declRows = null;
    const withCat = rows.some((x) => x.showCategory), withRole = rows.some((x) => x.r.role === 'dependency'), withDesc = rows.some((x) => x.f.description);
    blocks.push({ t: 'heading', level: 2, spans: `Declarations (${rows.length})`, recount: (n) => `Declarations (${n})`, text: null });
    blocks.push({ t: 'table',
      cols: [{ title: 'Name' }, { title: 'Class' }, ...(details ? [{ title: 'Class id', align: 'right' }] : []), { title: 'Guid' }, ...(withCat ? [{ title: 'Category' }] : []), ...(withRole ? [{ title: 'Role' }] : []), ...(withDesc ? [{ title: 'Description' }] : [])],
      rows: rows.map((x) => [S('declName', x.dname), S('className', x.r.className), ...(details ? [String(x.r.classId)] : []), S('guid', x.r.guid), ...(withCat ? [x.showCategory ? S('metaValue', x.f.categoryName) : ''] : []),
        ...(withRole ? [x.r.role === 'dependency' ? 'dependency' : ''] : []), ...(withDesc ? [x.f.description ? qs(x.f.description) : ''] : [])]),
      text: rows.map((x) => x.text) });
  };
  let graphRows = null; // consecutive graphs of the dump view are collected into one table
  const flushGraphs = () => {
    if (!graphRows) return;
    const rows = graphRows; graphRows = null;
    const some = (f) => rows.some(f);
    const withFolders = some((x) => x.folder != null), withRole = some((x) => x.r.role === 'dependency'), withDesc = some((x) => x.cdesc);
    const withSlot = details && some((x) => x.g.entrySlotIndex != null), withEval = details && some((x) => x.g.evaluationInterval != null), withBody = details && some((x) => x.g.kind === 21002);
    blocks.push({ t: 'heading', level: 2, spans: `Graphs (${rows.length})`, recount: (n) => `Graphs (${n})`, text: null });
    blocks.push({ t: 'table',
      cols: [{ title: 'Name' }, { title: 'Class' }, ...(details ? [{ title: 'Class id', align: 'right' }] : []), { title: 'Guid' }, ...(details ? [{ title: 'Kind', align: 'right' }, { title: 'Service', align: 'right' }] : []), { title: 'Nodes', align: 'right' },
        ...(withSlot ? [{ title: 'Entry slot', align: 'right' }] : []), ...(withEval ? [{ title: 'Evaluation interval', align: 'right' }] : []), ...(withBody ? [{ title: 'Composite body' }] : []),
        ...(withFolders ? [{ title: 'Folder' }] : []), ...(withRole ? [{ title: 'Role' }] : []), ...(withDesc ? [{ title: 'Description' }] : [])],
      rows: rows.map((x) => [x.gl, S('className', x.r.className), ...(details ? [String(x.r.classId)] : []), S('guid', x.r.guid), ...(details ? [S('metaValue', x.g.kind), S('metaValue', x.g.service)] : []), S('count', x.g.nodes.length),
        ...(withSlot ? [x.g.entrySlotIndex != null ? S('metaValue', x.g.entrySlotIndex) : ''] : []), ...(withEval ? [x.g.evaluationInterval != null ? S('metaValue', f32(x.g.evaluationInterval)) : ''] : []), ...(withBody ? [x.g.kind === 21002 ? 'yes' : ''] : []),
        ...(withFolders ? [x.folder != null ? S('folderName', x.folder) : ''] : []), ...(withRole ? [x.r.role === 'dependency' ? 'dependency' : ''] : []), ...(withDesc ? [x.cdesc ? qs(x.cdesc) : ''] : [])]),
      text: rows.map((x) => x.text) });
  };
  let resourceRows = null; // consecutive non-interpreted resources are collected into one table
  const flushResources = () => {
    if (!resourceRows) return;
    blocks.push({ t: 'heading', level: 2, spans: `Resources (${resourceRows.length})`, recount: (n) => `Resources (${n})`, text: null });
    const withMounts = resourceRows.some((x) => x.mountLines.length), withFolders = resourceRows.some((x) => x.folder != null), withParent = resourceRows.some((x) => flat(x.parent).length);
    const lines = resourceRows.map((x) => [x.text, ...x.mountLines.map((l) => l.text)]);
    blocks.push({ t: 'table', cols: [{ title: 'Name' }, { title: 'Class' }, ...(details ? [{ title: 'Class id', align: 'right' }] : []), { title: 'Guid' }, ...(details ? [{ title: 'Section' }] : []), ...(withParent ? [{ title: 'Parent' }] : []), ...(withFolders ? [{ title: 'Folder' }] : []), ...(withMounts ? [{ title: 'Mounted graphs' }] : [])],
      rows: resourceRows.map((x) => [...x.cells, ...(withParent ? [x.parent] : []), ...(withFolders ? [x.folder != null ? S('folderName', x.folder) : ''] : []), ...(withMounts ? [{ lines: x.mountLines.map((l) => l.cell) }] : [])]),
      text: lines.flat(), rowLines: lines });
    resourceRows = null;
  };

  for (const r of bundle.resources) {
    // a run of consecutive non-interpreted resources becomes one table; anything that prints something else ends the run
    // a run of consecutive graphs (dump view) becomes one table as well
    const isResource = !((r.kind === 'graph' && r.graph) || (r.kind === 'interface' && r.iface) || (r.kind === 'struct' && r.struct));
    const isGraphRow = r.kind === 'graph' && r.graph && !showCode;
    const silent = (r.kind === 'interface' && r.iface && (r.className === 'COMPOSITE_NODE_DECL' || hiddenDecl(r))) || (r.kind === 'struct' && r.struct && !showCode); // prints nothing in this view
    const isDeclRow = r.kind === 'interface' && r.iface && !showCode;
    if (!silent) { if (!isResource) flushResources(); if (!isGraphRow) flushGraphs(); if (!isDeclRow) flushDecls(); }
    if (r.kind === 'graph' && r.graph) {
      const g = r.graph;
      const tag = GRAPH_SERVICE_TAG[g.service];
      const gl = graphSpan(`${tag ? `<${tag}>` : ''}${graphLabel(r, dup, R)}`); // the <tag> is picked out by the formatters
      const decl = g.kind === 21002 ? R.declForBody(r) : null;
      const cdesc = decl?.iface.description; // a composite's description lives on its declaration
      const folder = folderSpan(r);
      const detail = [...(g.entrySlotIndex != null ? [['entry slot', S('metaValue', g.entrySlotIndex)]] : []), ...(g.evaluationInterval != null ? [['evaluation interval', S('metaValue', f32(g.evaluationInterval))]] : [])];
      const gfacts = [['type', S('className', r.className)], ['guid', S('guid', r.guid)], ...(decl ? [['declaration guid', S('guid', decl.guid)]] : []), ...(r.role === 'dependency' ? [['role', 'dependency']] : []), ...(cdesc ? [['description', qs(cdesc)]] : [])];
      // code view: the title only identifies the graph; the dump line is the overview of it
      const title = showCode
        ? [gl, ' ', S('className', r.className), ' (guid ', S('metaValue', r.guid), decl ? [', decl ', S('metaValue', decl.guid)] : '', ')', roleDep(r), cdesc ? field('description', qs(cdesc)) : '']
        : [folder, gl, ' ', S('className', r.className), details ? field('class', r.classId) : '', field('guid', S('guid', r.guid)), details ? [field('kind', g.kind), field('service', g.service)] : '', field('nodes', g.nodes.length), roleDep(r),
          details && g.kind === 21002 ? field('composite_body', 'true') : '', details ? detail.map(([k, v]) => field(k.replace(' ', '_'), v)) : '', cdesc ? field('description', qs(cdesc)) : ''];
      if (!showCode) { // overview view: one table row (in the line formats: the one-line summary) per graph
        graphRows ??= [];
        graphRows.push({ r, g, gl, decl, cdesc, folder: folderLabel(r), detail, text: [S('heading', 'GRAPH'), ' ', title] });
        continue;
      }
      sec('Graph', gl, title, gfacts);
      // node lines are "<graph>/<node head> <body>"
      const gline = (body) => [gl, '/', body];
      if (g.variables.length) {
        const rows = [], text = [];
        for (const v of g.variables) {
          const val = fmtValueSpans(v.value, ctx);
          const sname = v.structId ? (R.structName(v.structId) ?? v.structId) : null;
          text.push(gline([kw('VAR'), ' ', S('varName', v.name), ' : ', S('typeName', typeName(1, v.typeId)), field('public', String(v.isPublic)), v.structId ? field('struct', S('structName', sname)) : '', val !== null ? [' ', S('arrow', '='), ' ', val] : '']));
          rows.push([S('varName', v.name), S('typeName', typeName(1, v.typeId)), String(v.isPublic), v.structId ? S('structName', sname) : '', val !== null ? val : '']);
        }
        blocks.push({ t: 'heading', level: 3, spans: 'Variables', text: null });
        blocks.push({ t: 'table', cols: [{ title: 'Name' }, { title: 'Type' }, { title: 'Public' }, { title: 'Struct' }, { title: 'Value' }], rows, text });
      }
      if (g.comments.length) {
        const items = g.comments.map((c) => [qs(c.text), c.x != null ? [' ', S('coord', `@(${f32(c.x)},${f32(c.y)})`)] : '']);
        blocks.push({ t: 'heading', level: 3, spans: 'Comments', text: null });
        blocks.push({ t: 'list', items, text: items.map((it) => gline([kw('COMMENT'), ' ', ...it])) });
      }
      if (g.portMappings.length) {
        const rows = [], text = [];
        for (const pm of g.portMappings) {
          const decl = R.declForBody(r);
          const list = decl ? (pm.ext.kind === 1 ? decl.iface.inflows : pm.ext.kind === 2 ? decl.iface.outflows : pm.ext.kind === 3 ? decl.iface.inputs : decl.iface.outputs) : [];
          const en = list.find((p) => p.kind === pm.ext.kind && p.index === pm.ext.index)?.name;
          const ii = nodeLabel.get(g).get(pm.node); const inm = ii ? R.pinName(ii, { kind: pm.int.kind, index: pm.int.index }).name : null;
          const ext = S('pinLabel', `ext.${pinLabel(pm.ext.kind)}#${pm.ext.index}`), int = pinL(pm.int.kind, pm.int.index);
          text.push(gline([kw('PORTMAP'), ' ', ext, en ? [' ', S('pinName', en)] : '', ' ', S('arrow', '->'), ' ', nodeShort(g, pm.node), ' ', int, inm ? [' ', S('pinName', inm)] : '']));
          rows.push([ext, en ? S('pinName', en) : '', nodeShort(g, pm.node), int, inm ? S('pinName', inm) : '']);
        }
        blocks.push({ t: 'heading', level: 3, spans: 'Port mappings', text: null });
        blocks.push({ t: 'table', cols: [{ title: 'External pin' }, { title: 'Name' }, { title: 'Internal node' }, { title: 'Internal pin' }, { title: 'Name' }], rows, text });
      }
      const misc = [...g.affiliations.map((a) => [kw('AFFIL'), field('struct', a.structId ?? '-'), field('source_guid', a.source?.guid ?? a.source?.id ?? '-')]), ...g.anomalies.map((a) => [kw('ANOMALY'), ' ', a])];
      if (misc.length) blocks.push({ t: 'list', items: misc, text: misc.map((m) => gline(m)) });
      const sorted = [...g.nodes].sort((a, b) => a.index - b.index);
      if (sorted.length) blocks.push({ t: 'heading', level: 3, spans: 'Nodes', text: null });
      for (const n of sorted) {
        const info = nodeLabel.get(g).get(n.index);
        const nhead = nodeHead(n.index, info);
        const nrest = [];
        if (info.variant) nrest.push(field('variant', info.variant));
        if (info.extra.userKind) nrest.push(field('user', info.extra.userKind));
        if (info.extra.signal !== undefined) nrest.push(field('signal', S('signalName', qi(info.extra.signal))));
        if (info.extra.struct) nrest.push(field('struct', qs(info.extra.struct)));
        nrest.push([' ', S('coord', `@(${f32(n.x)},${f32(n.y)})`)]);
        if (n.signalVersion != null) nrest.push(field('sigver', n.signalVersion));
        if (n.statusExt) nrest.push(field('status_ext', `${n.statusExt.type}${n.statusExt.inner != null ? '/' + n.statusExt.inner : ''}`));
        const nline = (body) => [gl, '/', nhead, ' ', body];
        const headText = [[gl, '/', nhead, nrest]];
        if (n.comment != null) headText.push(nline([kw('COMMENT'), ' ', qs(n.comment)]));
        blocks.push({ t: 'para', cls: 'node', spans: [nhead, nrest, n.comment != null ? [' – ', kw('COMMENT'), ' ', qs(n.comment)] : ''], text: headText });
        const pins = [...n.pins].sort((a, b) => a.kind - b.kind || a.index - b.index);
        const rows = [], text = [];
        for (const p of pins) {
          if (R.isHiddenPin(info, p)) continue; // Multiple Branches: the case list is shown as the branch names instead
          const pn = R.pinName(info, p);
          const nameS = pn.name ? [' ', S('pinName', pn.name)] : '';
          const tl = pinTypeLabel(p, g);
          const tlS = tl ? S('typeName', tl) : '';
          const val = fmtValueSpans(p.value, ctx);
          const pinCell = pinL(p.kind, p.index), nameCell = pn.name ? S('pinName', pn.name) : '';
          const put = (body, op, target, type, notes) => { text.push(nline([pinCell, nameS, ' ', body])); rows.push([pinCell, nameCell, op, target, type || '', notes || '']); };
          let any = false;
          const tgt = (c, withName) => [nodeShort(g, c.node), ' ', pinL(c.kind, c.index), withName ? targetPinName(R, nodeLabel.get(g).get(c.node), c) : ''];
          const A = (a) => S('arrow', a);
          if (p.kind === 2) for (const c of p.conns) { put([A('->'), ' ', tgt(c, true)], A('->'), tgt(c, true)); any = true; }
          else if (p.kind === 3) for (const c of p.conns) { put([A('<-'), ' ', tgt(c, true), tl ? [' : ', tlS] : ''], A('<-'), tgt(c, true), tlS); any = true; }
          else for (const c of p.conns) { put([A('~>'), ' ', tgt(c, false)], A('~>'), tgt(c, false)); any = true; }
          if (val !== null) {
            const isDef = p.value && !p.value.set && p.value.k !== 'poly', wired = p.conns.length > 0;
            put([A('='), ' ', val, tl ? [' : ', tlS] : '', isDef ? [' ', S('flag', '(default)')] : '', wired ? [' ', S('flag', '(also wired)')] : ''], A('='), val, tlS, [isDef ? 'default' : '', wired ? 'also wired' : ''].filter(Boolean).join(', '));
            any = true;
          }
          if (p.bindingMeta && opts.allPins) { const b = [pinL(p.bindingMeta.kind, p.bindingMeta.index), p.bindingMeta.sourceRef != null ? field('ref', p.bindingMeta.sourceRef) : '']; put([kw('bound_to'), ' ', b], kw('bound to'), b); any = true; }
          if (!any && opts.allPins) put([tl ? [': ', tlS, ' '] : '', S('flag', '(no value, no wire)')], '', S('flag', '(no value, no wire)'), tlS);
        }
        if (rows.length) blocks.push({ t: 'table', cols: [{ title: 'Pin' }, { title: 'Name' }, { title: 'Dir' }, { title: 'Target / value' }, { title: 'Type' }, { title: 'Notes' }], rows, text });
      }
    } else if (r.kind === 'interface' && r.iface) {
      const f = r.iface;
      if (r.className === 'COMPOSITE_NODE_DECL') continue; // every composite is also reported as GRAPH, no need to show extra DECL
      if (hiddenDecl(r)) continue; // second half of a send-signal pair
      const dname = f.sendSignal?.name || f.listenSignal?.name || f.name || r.name; // a signal declaration is titled by its signal
      // a signal's category (send / listen) is already said by its class name and its SEND_SIGNAL / LISTEN_SIGNAL line
      const showCategory = details || !(f.sendSignal || f.listenSignal);
      if (!showCode) { // overview view: one table row (in the line formats: the one-line summary) per declaration
        declRows ??= [];
        declRows.push({ r, f, dname, showCategory, text: [S('heading', 'DECL'), ' ', [S('declName', dname), ' ', S('className', r.className), details ? field('class', r.classId) : '', field('guid', S('guid', r.guid)), showCategory ? field('category', f.categoryName) : '', f.description ? field('description', qs(f.description)) : '', roleDep(r)]] });
        continue;
      }
      sec('Decl', S('declName', dname), [S('declName', dname), ' ', S('className', r.className), details ? field('class', r.classId) : '', field('guid', S('guid', r.guid)), showCategory ? field('category', f.categoryName) : '', f.description ? field('description', qs(f.description)) : '', roleDep(r)],
        [['type', S('className', r.className)], ...(details ? [['class id', S('metaValue', r.classId)]] : []), ['guid', S('guid', r.guid)], ...(showCategory ? [['category', S('metaValue', f.categoryName)]] : []), ...(f.description ? [['description', qs(f.description)]] : []), ...(r.role === 'dependency' ? [['role', 'dependency']] : [])]);
      const dline = (body) => [kw('DECL'), '/', S('varName', dname), ' ', body];
      const infoLines = [];
      if (f.sendSignal) infoLines.push([kw('SEND_SIGNAL'), field('name', S('signalName', qi(f.sendSignal.name))), field('server_node', f.sendSignal.server?.id), field('client_node', f.sendSignal.client?.id)]);
      if (f.listenSignal) infoLines.push([kw('LISTEN_SIGNAL'), field('name', S('signalName', qi(f.listenSignal.name))), field('server_node', f.listenSignal.server?.id), field('client_node', f.listenSignal.client?.id)]);
      for (const [k, v] of [['assemble_struct', f.assembleStruct], ['split_struct', f.splitStruct], ['modify_struct', f.modifyStruct]]) if (v != null) infoLines.push([kw(k.toUpperCase()), field('struct', qs(R.structName(v) ?? '<struct#' + v + '>')), ` (${v})`]);
      if (infoLines.length) blocks.push({ t: 'list', items: infoLines, text: infoLines.map(dline) });
      const backend = f.id?.shell && [20000, 20003, 20004, 20005].includes(f.id.shell.service) ? 1 : 2;
      const rows = [], text = [];
      const showPins = (arr, label) => {
        for (const p of arr) {
          const hasType = p.type?.shell != null, type = hasType ? typeName(backend, p.type.shell) : '';
          const structTxt = p.type?.structId ? (R.structName(p.type.structId) ?? p.type.structId) : null;
          const extra = [p.type?.enumId != null ? field('enum_family', p.type.enumId) : '', structTxt != null ? field('struct', S('structName', structTxt)) : '', p.uid != null ? field('uid', p.uid) : ''];
          const pl = S('pinLabel', `${label}#${p.index}`);
          text.push(dline([pl, p.name ? [' ', S('pinName', p.name)] : '', hasType ? [' : ', S('typeName', type)] : '', extra]));
          rows.push([pl, p.name ? S('pinName', p.name) : '', hasType ? S('typeName', type) : '', extra]);
        }
      };
      showPins(f.inflows, 'in.flow'); showPins(f.outflows, 'out.flow'); showPins(f.inputs, 'in'); showPins(f.outputs, 'out'); showPins(f.metaPins, 'meta');
      if (rows.length) blocks.push({ t: 'table', cols: [{ title: 'Pin' }, { title: 'Name' }, { title: 'Type' }, { title: 'Details' }], rows, text });
    } else if (r.kind === 'struct' && r.struct) {
      const s = r.struct;
      if (!showCode) continue; // the dump view does not list structs (the code view and refs do)
      sec('Struct', S('declName', s.name), [S('declName', s.name), field('guid', S('guid', r.guid)), field('id', s.id), field('version', s.version), roleDep(r)],
        [['guid', S('guid', r.guid)], ['id', S('metaValue', s.id)], ['version', S('metaValue', s.version)], ...(r.role === 'dependency' ? [['role', 'dependency']] : [])]);
      if (s.vars.length) {
        const rows = [], text = [];
        for (const v of s.vars) {
          const st = v.refStructId ? (R.structName(v.refStructId) ?? v.refStructId) : null;
          text.push([kw('STRUCT'), '/', S('varName', s.name), ' ', kw(`FIELD#${v.index}`), ' ', S('declName', v.name), ' : ', S('typeName', typeName(1, v.typeId)), st != null ? field('struct', S('structName', st)) : '']);
          rows.push([String(v.index), S('declName', v.name), S('typeName', typeName(1, v.typeId)), st != null ? S('structName', st) : '']);
        }
        blocks.push({ t: 'table', cols: [{ title: '#', align: 'right' }, { title: 'Field' }, { title: 'Type' }, { title: 'Struct' }], rows, text });
      }
    } else {
      if (!showResources) continue; // still analysed (names, mounts, refs); just not printed in this view
      resourceRows ??= [];
      // one extra greppable line per mounted graph, right below the resource line
      const mountLines = (mountsOfHost.get(r) || []).map((m) => ({
        cell: [S('metaValue', m.slot), ': ', mountedGraphSpans(m)],
        text: [kw('MOUNT'), ' ', mountedGraphSpans(m), ' ', S('arrow', '->'), ' ', hostSpans(m)],
      }));
      resourceRows.push({
        mountLines, folder: folderLabel(r), parent: parentSpans(r),
        cells: [S('declName', r.name), S('className', r.className), ...(details ? [r.classId != null ? String(r.classId) : '-'] : []), S('guid', r.guid), ...(details ? [r.section ? String(r.section) : ''] : [])],
        text: [S('heading', 'RESOURCE'), ' ', folderSpan(r), S('declName', r.name), ' ', S('className', r.className), details ? field('class', r.classId ?? '-') : '', field('guid', S('guid', r.guid)), flat(parentSpans(r)).length ? field('parent', parentSpans(r)) : '', details && r.section ? field('section', r.section) : ''],
      });
    }
  }
  flushResources(); flushGraphs(); flushDecls();
  const summary = { unresolved: [...R.unresolved.values()], resolver: R };
  if (summary.unresolved.length && db.version) {
    const msg = `${summary.unresolved.length} unresolved node type(s); node DB is based on game ${db.version}, file is ${bundle.engineVersion}. Names are cosmetic: search on IDs still works. See TECHNICAL.md "When the game updates".`;
    blocks.splice(versionBlockAt, 0, { t: 'note', level: 'warn', spans: ['Warning: ', msg], text: [[marker('# '), S('warn', 'WARNING:'), ' ', msg]] });
  }
  if (summary.unresolved.length) {
    blocks.push({ t: 'hr', text: null });
    blocks.push({ t: 'heading', level: 2, spans: 'Unresolved nodes', text: [[S('heading', 'UNRESOLVED')]] });
    blocks.push({
      t: 'table', cols: [{ title: 'Node' }, { title: 'Count', align: 'right' }, { title: 'Where' }],
      rows: summary.unresolved.map((u) => [String(u.label), S('count', u.count), u.where.join(', ')]),
      text: summary.unresolved.map((u) => [kw('UNRESOLVED'), ' ', u.label, ' x', S('count', u.count), ' e.g. ', u.where.join(', ')]),
    });
  }
  return { blocks, summary };
}

function targetPinName(R, info, c) {
  if (!info) return '';
  const nm = R.pinName(info, { kind: c.kind, index: c.index, uid: null });
  return nm.name ? [' ', S('pinName', nm.name)] : '';
}
