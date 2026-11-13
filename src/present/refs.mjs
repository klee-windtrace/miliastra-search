// The refs report as a document (see doc.mjs). Each block carries two views of the same data:
//  * `text`  – the console lines (kind/key columns padded, one line per group), used by text/color/md/htm;
//  * the structured fields (headings, tables with real columns) – used by markdown/html.
// Input: the `refs` object of a refs report (JSON.md): `entries` (the overview) or `references` (one by one, for --name).
import { S, graph, graphLabelOf, key as keySpan, join, plain, gap, pad, sep, fromRich } from './doc.mjs';

const G = (ref) => graph(graphLabelOf(ref)); // a graph reference of the report as a graph span
// Canonical left-to-right order of role columns in md/html tables; unknown roles follow in first-seen order.
const ROLE_ORDER = ['get', 'set', 'trigger', 'call', 'start', 'stop', 'pause', 'resume', 'modify', 'get-time', 'listen', 'send'];
const KIND_COL = 16, KEY_COL = 34;

/** What an overview entry says about its key besides the name: the type of a variable, a timer's looping, what a literal id resolves to. */
const metaOf = (row) => [row.type ? S('typeName', row.type) : null, row.loop ? S('flag', row.loop) : null, row.resolved ? fromRich(row.resolved) : null].filter(Boolean);
const entryKey = (row) => (row.key_graph ? G(row.key_graph) : keySpan(row.key)); // a mounted graph is a graph name (with its <tag>), everything else a key
const graphListSpans = (names) => ['[', join(names.map(G), '; '), ']'];
const partSpans = (p) => [S('count', p.count), ' ', S('role', p.role), p.graphs ? [': ', graphListSpans(p.graphs)] : p.note != null ? [': ', fromRich(p.note)] : ''];
const entryKeySpans = (row) => { const meta = metaOf(row); return [entryKey(row), meta.length ? [' (', join(meta, ', '), ')'] : '']; };

/** The console lines (spans) of one overview entry: kind column, key column (padded), then the details. */
export function entryLines(row) {
  const keySpans = entryKeySpans(row);
  const head = [S('kind', row.kind), pad(KIND_COL - row.kind.length), sep(), keySpans, pad(KEY_COL - plain(keySpans).length), sep()];
  if (row.kind === 'struct') { // a struct has its definition and then one line per way it is used
    const indent = gap(KIND_COL + 1 + KEY_COL + 1, 2); // empty kind and key columns
    return [[head, row.definition != null ? ['defined ', row.definition] : '(no definition found in the scanned files)'], ...row.parts.map((p) => [indent, partSpans(p)])];
  }
  return [[head, row.graph != null ? ['[', G(row.graph), ']: '] : '', join(row.parts.map(partSpans), ', ')]];
}

/** One table per reference kind, with columns that fit the kind (variables get get/set columns, timers start/stop, ...). */
function overviewBlocks(rows) {
  const blocks = [];
  const kinds = [...new Set(rows.map((r) => r.kind))];
  for (const kind of kinds) {
    const rs = rows.filter((r) => r.kind === kind);
    const hasMeta = rs.some((r) => metaOf(r).length), hasScope = rs.some((r) => r.graph != null), hasDefined = rs.some((r) => r.kind === 'struct');
    const roles = [];
    for (const r of rs) for (const p of r.parts) if (!roles.includes(p.role)) roles.push(p.role);
    roles.sort((a, b) => { const ia = ROLE_ORDER.indexOf(a), ib = ROLE_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    const cols = [{ title: kind }];
    if (hasMeta) cols.push({ title: kind === 'literal_id' ? 'Resolved' : 'Type' });
    if (hasScope) cols.push({ title: 'Graph' });
    if (hasDefined) cols.push({ title: 'Definition' });
    for (const role of roles) cols.push({ title: role, align: 'left' });
    const tableRows = rs.map((r) => {
      const cells = [entryKey(r)];
      if (hasMeta) cells.push(join(metaOf(r), ', '));
      if (hasScope) cells.push(r.graph != null ? G(r.graph) : '');
      if (hasDefined) cells.push(r.kind === 'struct' ? (r.definition != null ? r.definition : '(no definition found in the scanned files)') : '');
      for (const role of roles) {
        const parts = r.parts.filter((p) => p.role === role);
        if (!parts.length) { cells.push(''); continue; }
        // count first (bold), then one graph per line, or the free-form note for usages that have no graph
        const lines = [];
        for (const p of parts) {
          lines.push(S('count', p.count));
          if (p.graphs) lines.push(...p.graphs.map(G));
          else if (p.note != null) lines.push(fromRich(p.note));
        }
        cells.push({ lines });
      }
      return cells;
    });
    blocks.push({ t: 'heading', level: 3, spans: [S('kind', kind), ` (${rs.length})`], text: null });
    blocks.push({ t: 'table', cols, rows: tableRows, text: rs.flatMap(entryLines) });
  }
  return blocks;
}

/** The files a report scanned, as the blocks the document formats show under the title. */
export const scannedBlocks = (files) => [
  { t: 'para', spans: `Scanned ${files.length} file${files.length === 1 ? '' : 's'}:`, text: null },
  { t: 'list', items: files.map((f) => S('fileName', f)), text: null },
];

/** The default `refs` report (no --name): one table per reference kind. */
export function refsReport(entries, { files }) {
  const blocks = [];
  blocks.push({ t: 'title', spans: 'Reference index', text: null });
  blocks.push(...scannedBlocks(files));
  blocks.push({ t: 'heading', level: 2, spans: 'References', text: null });
  if (entries.length) blocks.push(...overviewBlocks(entries));
  else blocks.push({ t: 'para', spans: '(no references found)', text: null });
  return blocks;
}

/** Where a reference is: the host of a mount, `graph/[node] Name (id)`, or a definition. Also its `via` (the composites it was inlined from) and its note. */
function refParts(r) {
  const n = r.node;
  const loc = r.host ? [S('className', r.host.class_name), ' ', keySpan(r.host.name)] : r.graph
    ? [G(r.graph), '/', n ? S('nodeIndex', `[${n.index}]`) : (r.mode === 'declaration' ? S('keyword', 'VAR') : '-'), n?.name ? [' ', S('nodeName', n.name)] : '', n?.id != null ? [' ', S('nodeId', `(${n.id})`)] : '']
    : '(definition)';
  const via = r.via_composite.length ? [S('flag', '[inlined via'), ' ', join(r.via_composite.map(G), ' -> '), S('flag', ']')] : '';
  return { loc, via, note: r.note ? fromRich(r.note) : '' };
}

/** The one-line form of a reference, as spans. */
export function referenceLine(r, { showFile = true } = {}) {
  const { loc, via, note } = refParts(r);
  return [showFile ? [S('fileName', r.file), ':', sep()] : '', S('kind', r.kind), sep(), entryKey(r), sep(), S('mode', r.mode), r.role ? [sep(), S('role', r.display_role)] : '', ' @', sep(), loc, r.pin ? [sep(), fromRich(r.pin)] : '', via ? [sep(), via] : '', r.note ? [' –', sep(), note] : ''];
}

/** `refs --name`: every matching reference individually. */
export function refsDetailReport(references, { multi, files, what }) {
  const blocks = [];
  blocks.push({ t: 'title', spans: `References matching ${what}`, text: null });
  blocks.push({ t: 'para', spans: `Scanned ${files.length} file${files.length === 1 ? '' : 's'}: ${files.join(', ')}`, text: null });
  const cols = [...(multi ? [{ title: 'File' }] : []), { title: 'Kind' }, { title: 'Key' }, { title: 'Mode' }, { title: 'Role' }, { title: 'Location' }, { title: 'Pin' }, { title: 'Details' }];
  blocks.push({
    t: 'table', cols,
    rows: references.map((r) => {
      const { loc, via, note } = refParts(r);
      const details = { lines: [...(via ? [via] : []), ...(r.note ? [note] : [])] };
      return [...(multi ? [S('fileName', r.file)] : []), S('kind', r.kind), entryKey(r), S('mode', r.mode), r.role ? S('role', r.display_role) : '', loc, r.pin ? fromRich(r.pin) : '', details];
    }),
    text: references.map((r) => referenceLine(r, { showFile: multi })),
  });
  return blocks;
}

/** The refs report as the blocks of one document, and the message a detail view without references asks to print. */
export function refsDocument(report) {
  const { files, options } = report.header;
  const { view, entries, references } = report.refs;
  if (view === 'detail') return { blocks: refsDetailReport(references, { multi: files.length > 1, files, what: `name ${JSON.stringify(options.name)}` }), empty: !references.length };
  return { blocks: refsReport(entries, { files }), empty: false };
}

/** Print the refs report: the overview, or with --name every reference; whole or only the lines matching --search / --match. */
export function printRefs(report, printer) {
  const { blocks, empty } = refsDocument(report);
  if (empty) { printer.note('no references found'); printer.fail(); }
  return printer.present(blocks, `refs ${report.header.files.join(', ')}`);
}
