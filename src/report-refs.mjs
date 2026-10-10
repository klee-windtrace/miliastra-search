// Builds the `refs` report as a document (see src/doc.mjs). Each block carries two views of the same data:
//  * `text`  – the console lines (kind/key columns padded, one line per group), used by text/color/md/htm;
//  * the structured fields (headings, tables with real columns) – used by markdown/html.
// `refs` prints the reference tables only; `warns` prints the lint side: findings, limits, top graphs (blocks separated by <hr>).
import { basename } from './paths.mjs';
import { S, marker, graph, key as keySpan, join, level, frac, spansOf } from './doc.mjs';
import { buildOverviewRows, overviewRowLines, refParts, refLineSpans, displayRole, refKeySpan, rowKeySpans, LIMITS } from './refs.mjs';

const base = (f) => basename(f);
// Canonical left-to-right order of role columns in md/html tables; unknown roles follow in first-seen order.
const ROLE_ORDER = ['get', 'set', 'trigger', 'call', 'start', 'stop', 'pause', 'resume', 'modify', 'get-time', 'listen', 'send'];

const graphCell = (names) => ({ lines: names.map((n) => graph(n)) });

/** One table per reference kind, with columns that fit the kind (variables get get/set columns, timers start/stop, ...). */
function overviewBlocks(rows) {
  const blocks = [];
  const kinds = [...new Set(rows.map((r) => r.kind))];
  for (const kind of kinds) {
    const rs = rows.filter((r) => r.kind === kind);
    const hasMeta = rs.some((r) => r.meta.length), hasScope = rs.some((r) => r.scope != null), hasDefined = rs.some((r) => r.stacked);
    const roles = [];
    for (const r of rs) for (const p of r.parts) if (!roles.includes(p.role)) roles.push(p.role);
    roles.sort((a, b) => { const ia = ROLE_ORDER.indexOf(a), ib = ROLE_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    const cols = [{ title: kind }];
    if (hasMeta) cols.push({ title: kind === 'literal_id' ? 'Resolved' : 'Type' });
    if (hasScope) cols.push({ title: 'Graph' });
    if (hasDefined) cols.push({ title: 'Definition' });
    for (const role of roles) cols.push({ title: role, align: 'left' });
    const tableRows = rs.map((r) => {
      const cells = [r.keyLabel != null ? graph(r.keyLabel) : keySpan(r.key)];
      if (hasMeta) cells.push(join(r.meta, ', '));
      if (hasScope) cells.push(r.scope != null ? graph(r.scope) : '');
      if (hasDefined) cells.push(r.stacked ? (r.defined != null ? spansOf(r.defined) : '(no definition found in the scanned files)') : '');
      for (const role of roles) {
        const parts = r.parts.filter((p) => p.role === role);
        if (!parts.length) { cells.push(''); continue; }
        // count first (bold), then one graph per line, or the free-form note for usages that have no graph
        const lines = [];
        for (const p of parts) {
          lines.push(S('count', p.n));
          if (p.graphs) lines.push(...p.graphs.map((g) => graph(g)));
          else if (p.note != null) lines.push(spansOf(p.note));
        }
        cells.push({ lines });
      }
      return cells;
    });
    blocks.push({ t: 'heading', level: 3, spans: [S('kind', kind), ` (${rs.length})`], text: null });
    blocks.push({ t: 'table', cols, rows: tableRows, text: rs.flatMap(overviewRowLines) });
  }
  return blocks;
}

function findingRows(fsel) {
  return fsel.map((f) => ({ f, lvl: level(f.level === 'warn' ? 'warn' : 'info', f.level.toUpperCase().padEnd(5)) }));
}

const scannedBlocks = (files) => [
  { t: 'para', spans: `Scanned ${files.length} file${files.length === 1 ? '' : 's'}:`, text: null },
  { t: 'list', items: files.map((f) => S('fileName', f)), text: null },
];

/** The default `refs` report (no --name): one table per reference kind. */
export function refsReport(sel, { files, sortDesc }) {
  const blocks = [];
  const rows = buildOverviewRows(sel, { sortDesc });
  blocks.push({ t: 'title', spans: 'Reference index', text: null });
  blocks.push(...scannedBlocks(files));
  blocks.push({ t: 'heading', level: 2, spans: 'References', text: null });
  if (rows.length) blocks.push(...overviewBlocks(rows));
  else blocks.push({ t: 'para', spans: '(no references found)', text: null });
  return blocks;
}

/** The findings table of the `warns` report (its text lines are the `# findings` section). */
function findingsBlocks(findings, multi) {
  const blocks = [];
  blocks.push({ t: 'heading', level: 2, spans: 'Findings', text: [[marker('# '), S('section', 'findings')]] });
  if (!findings.length) { blocks.push({ t: 'para', spans: '(no findings)', text: [['(no findings)']] }); return blocks; }
  const fr = findingRows(findings);
  blocks.push({
    t: 'table',
    cols: [{ title: 'Level' }, { title: 'Type' }, { title: 'Message' }, ...(multi ? [{ title: 'File' }] : [])],
    rows: fr.map(({ f, lvl }) => [lvl, S('findingType', f.type), spansOf(f.message), ...(multi ? [S('fileName', base(f.file))] : [])]),
    text: fr.map(({ f, lvl }) => [lvl, ' ', S('findingType', f.type), ': ', spansOf(f.message), multi ? [' [', S('fileName', base(f.file)), ']'] : '']),
  });
  return blocks;
}

/** The default `warns` report: findings, limits, top graphs by effective node count. */
export function warnsReport({ findings, limits, files, multi, topN }) {
  const blocks = [];
  blocks.push({ t: 'title', spans: 'Warnings and limits', text: null });
  blocks.push(...scannedBlocks(files));
  blocks.push(...findingsBlocks(findings, multi));

  blocks.push({ t: 'hr' });
  blocks.push({ t: 'heading', level: 2, spans: 'Limits', text: [[marker('# '), S('section', 'limits')]] });
  const limitRows = []; // [label spans, fraction span, text-mode line]
  if (limits.composites.used) limitRows.push(['composites (declared)', frac(limits.composites.used, limits.composites.max), (f) => ['composites: ', f, ' declared']]);
  if (limits.signals.used) limitRows.push(['signals (declared)', frac(limits.signals.used, limits.signals.max), (f) => ['signals: ', f, ' declared']]);
  for (const rl of limits.resources) if (rl.used) limitRows.push([rl.label, frac(rl.used, rl.max), (f) => [`${rl.label}: `, f]]);
  // static entities have no limit ("Unlimited"): just the count, last
  if (limits.staticEntities) limitRows.push(['static entities (unlimited)', S('count', limits.staticEntities), (f) => ['static entities: ', f]]);
  if (limitRows.length) blocks.push({ t: 'table', cols: [{ title: 'Resource' }, { title: 'Used / max', align: 'right' }], rows: limitRows.map(([l, f]) => [l, f]), text: limitRows.map(([, f, line]) => line(f)) });
  else blocks.push({ t: 'para', spans: '(nothing counted against a limit)', text: [] });

  blocks.push({ t: 'hr' });
  const top = limits.graphSizes.slice(0, topN);
  const topTitle = `top graphs by node count`;
  blocks.push({ t: 'heading', level: 2, spans: `Top graphs by node count`, text: [[S('section', topTitle), ':']] });
  if (!top.length) blocks.push({ t: 'para', spans: '(no graphs in the scanned files)' });
  else {
    blocks.push({
      t: 'table',
      cols: [{ title: 'Graph' }, { title: 'Effective nodes', align: 'right' }, ...(multi ? [{ title: 'File' }] : [])],
      rows: top.map((gs) => [graph(gs.graph), frac(gs.nodes, LIMITS.nodesPerGraph), ...(multi ? [S('fileName', base(gs.file))] : [])]),
      text: top.map((gs) => [graph(gs.graph), ': ', frac(gs.nodes, LIMITS.nodesPerGraph), ' nodes', multi ? [' [', S('fileName', base(gs.file)), ']'] : '']),
    });
  }
  return blocks;
}

/** `warns --kind/--name`: only the findings for that selection (limits are not about a key). */
export function warnsDetailReport(findings, { multi, files, what }) {
  return [
    { t: 'title', spans: `Findings matching ${what}`, text: null },
    ...scannedBlocks(files),
    ...findingsBlocks(findings, multi),
  ];
}

/** `refs --name`: every matching reference individually. */
export function refsDetailReport(sel, { multi, files, what }) {
  const blocks = [];
  blocks.push({ t: 'title', spans: `References matching ${what}`, text: null });
  blocks.push({ t: 'para', spans: `Scanned ${files.length} file${files.length === 1 ? '' : 's'}: ${files.join(', ')}`, text: null });
  const cols = [...(multi ? [{ title: 'File' }] : []), { title: 'Kind' }, { title: 'Key' }, { title: 'Mode' }, { title: 'Role' }, { title: 'Location' }, { title: 'Pin' }, { title: 'Details' }];
  blocks.push({
    t: 'table', cols,
    rows: sel.map((r) => {
      const { loc, via, note } = refParts(r);
      const details = { lines: [...(via ? [via] : []), ...(r.note ? [note] : [])] };
      return [...(multi ? [S('fileName', r.file)] : []), S('kind', r.kind), refKeySpan(r), S('mode', r.mode), r.role ? S('role', displayRole(r)) : '', loc, r.pin ? spansOf(r.pin) : '', details];
    }),
    text: sel.map((r) => refLineSpans(r, { showFile: multi })),
  });
  return blocks;
}
