// The warns report as a document (see doc.mjs): findings, limits, top graphs by effective node count (blocks separated by <hr>).
// Input: the `warns` object of a warns report (JSON.md). Like the refs report, each block carries the console lines (`text`) and the structure.
import { S, marker, graph, graphLabelOf, level, frac, fromRich, sep, pad } from './doc.mjs';
import { scannedBlocks } from './refs.mjs';

const G = (ref) => graph(graphLabelOf(ref));

/** The findings table of the `warns` report (its text lines are the `# findings` section). */
function findingsBlocks(findings, multi) {
  const blocks = [];
  blocks.push({ t: 'heading', level: 2, spans: 'Findings', text: [[marker('# '), S('section', 'findings')]] });
  if (!findings.length) { blocks.push({ t: 'para', spans: '(no findings)', text: [['(no findings)']] }); return blocks; }
  const fr = findings.map((f) => ({ f, lvl: level(f.level === 'warn' ? 'warn' : 'info', f.level.toUpperCase()), pad: [pad(5 - f.level.length), sep()] })); // the level column is 5 wide
  blocks.push({
    t: 'table',
    cols: [{ title: 'Level' }, { title: 'Type' }, { title: 'Message' }, ...(multi ? [{ title: 'File' }] : [])],
    rows: fr.map(({ f, lvl }) => [lvl, S('findingType', f.type), fromRich(f.message), ...(multi ? [S('fileName', f.file)] : [])]),
    text: fr.map(({ f, lvl, pad }) => [lvl, pad, S('findingType', f.type), ':', sep(), fromRich(f.message), multi ? [sep(), '[', S('fileName', f.file), ']'] : '']),
  });
  return blocks;
}

/** The default `warns` report: findings, limits, top graphs by effective node count. */
export function warnsReport({ findings, limits, files, multi }) {
  const blocks = [];
  blocks.push({ t: 'title', spans: 'Warnings and limits', text: null });
  blocks.push(...scannedBlocks(files));
  blocks.push(...findingsBlocks(findings, multi));

  blocks.push({ t: 'hr' });
  blocks.push({ t: 'heading', level: 2, spans: 'Limits', text: [[marker('# '), S('section', 'limits')]] });
  const limitRows = []; // [label spans, fraction span, text-mode line]
  if (limits.composites.used) limitRows.push(['composites (declared)', frac(limits.composites.used, limits.composites.max), (f) => ['composites:', sep(), f, ' declared']]);
  if (limits.signals.used) limitRows.push(['signals (declared)', frac(limits.signals.used, limits.signals.max), (f) => ['signals:', sep(), f, ' declared']]);
  for (const rl of limits.resources) if (rl.used) limitRows.push([rl.label, frac(rl.used, rl.max), (f) => [`${rl.label}:`, sep(), f]]);
  // static entities have no limit ("Unlimited"): just the count, last
  if (limits.static_entities) limitRows.push(['static entities (unlimited)', S('count', limits.static_entities), (f) => ['static entities:', sep(), f]]);
  if (limitRows.length) blocks.push({ t: 'table', cols: [{ title: 'Resource' }, { title: 'Used / max', align: 'right' }], rows: limitRows.map(([l, f]) => [l, f]), text: limitRows.map(([, f, line]) => line(f)) });
  else blocks.push({ t: 'para', spans: '(nothing counted against a limit)', text: [] });

  blocks.push({ t: 'hr' });
  const top = limits.graph_sizes;
  blocks.push({ t: 'heading', level: 2, spans: 'Top graphs by node count', text: [[S('section', 'top graphs by node count'), ':']] });
  if (!top.length) blocks.push({ t: 'para', spans: '(no graphs in the scanned files)' });
  else {
    blocks.push({
      t: 'table',
      cols: [{ title: 'Graph' }, { title: 'Effective nodes', align: 'right' }, ...(multi ? [{ title: 'File' }] : [])],
      rows: top.map((gs) => [G(gs.graph), frac(gs.nodes, limits.graph_node_max), ...(multi ? [S('fileName', gs.file)] : [])]),
      text: top.map((gs) => [G(gs.graph), ':', sep(), frac(gs.nodes, limits.graph_node_max), ' nodes', multi ? [sep(), '[', S('fileName', gs.file), ']'] : '']),
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

/** The warns report as the blocks of one document: the full report, or with --kind / --name only the matching findings. */
export function warnsDocument(report) {
  const { files, options } = report.header;
  const { view, findings, limits } = report.warns;
  const multi = files.length > 1;
  if (view === 'findings') {
    const what = [options.kind ? `kind ${options.kind}` : null, options.name != null ? `name ${JSON.stringify(options.name)}` : null].filter(Boolean).join(' and ');
    return warnsDetailReport(findings, { multi, files, what });
  }
  return warnsReport({ findings, limits, files, multi });
}

/** Print the warns report; whole or only the lines matching --search / --match. */
export const printWarns = (report, printer) => printer.present(warnsDocument(report), `warns ${report.header.files.join(', ')}`);
