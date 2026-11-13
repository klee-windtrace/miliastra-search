// The report: what a mode has found out about the files, as one plain JSON-serializable object, and nothing about how it looks.
// Everything that reads a .gil / .gia ends here. src/present/ turns a report into text, Markdown, HTML (or prints it as JSON) without ever
// seeing a .gil / .gia, so a report saved as a file renders exactly like the one the engine had in memory (scripts/render-json.mjs).
// The format is documented in JSON.md and described by schema/report.schema.json.
//
//   { header: { software, version, mode, files, options }, <mode>: ... }
//   { header: { ..., mode: 'all' }, all: [modes], info: ..., dump: ..., code: null, refs: ..., warns: ... }
//
// `code` is part of an `all` report only with the option `with_code` (it is by far the biggest part).
import { host } from './host.mjs';
import { fileInfo } from './info.mjs';
import { fileCheck } from './check.mjs';
import { fileDump } from './dump.mjs';
import { fileCode } from './code.mjs';
import { rawTree } from './raw.mjs';
import { analyzeBundle } from './analyze.mjs';
import { buildRefs, buildOverviewRows, loadRules, referenceJson, findingJson, limitsJson } from './refs.mjs';
import { MODE_OPTIONS, DEFAULT_TOP_GRAPHS, ALL_PARTS } from './present/options.mjs';

export const SOFTWARE = 'miliastra-search';
/** Modes that have a report. */
export const REPORT_MODES = ['info', 'dump', 'code', 'refs', 'warns', 'check', 'raw', 'all'];

const softwareVersion = () => JSON.parse(host.data('package.json')).version;

/**
 * The options of the command line that decide what the report contains, with their effective values (null / false when not given), those
 * that belong to `mode` (src/present/options.mjs). `o` = the parsed command line, `lang` = the names language in use. Options that only change
 * how a report is shown (--search, --format, --key, ...) are not part of it.
 */
export function reportOptions(mode, o, lang) {
  const all = {
    lang, node_db: o.db ?? null, input: o.input ?? null, lenient: !!o.lenient, show_tag: !!o['show-tag'],
    kind: o.kind ?? null, name: o.name ?? null, sort_desc: !!o['sort-desc'], top_graphs: o['top-graphs'] != null ? Number(o['top-graphs']) : DEFAULT_TOP_GRAPHS,
    with_code: !!o['with-code'], expand: !!o.expand,
  };
  return Object.fromEntries(MODE_OPTIONS[mode].map((k) => [k, all[k]]));
}

const headerOf = (mode, files, options) => ({ software: SOFTWARE, version: softwareVersion(), mode, files, options });

function refsPayload({ refs }, options) {
  let sel = refs.filter((r) => r.kind !== 'node_type' || options.kind === 'node_type' || options.name); // node types are a listing of their own
  if (options.kind) sel = refs.filter((r) => r.kind === options.kind);
  if (options.name != null) sel = sel.filter((r) => String(r.key) === options.name);
  const view = options.name != null ? 'detail' : 'overview';
  return { view, entries: view === 'overview' ? buildOverviewRows(sel, { sortDesc: options.sort_desc }) : null, references: sel.map(referenceJson) };
}

function warnsPayload({ findings, limits }, options) {
  const view = options.kind || options.name != null ? 'findings' : 'report'; // a selection lists its findings only: the limits are not about a key
  const sel = findings.filter((f) => (!options.kind || f.kind === options.kind) && (options.name == null || f.key === options.name));
  return { view, findings: sel.map(findingJson), limits: view === 'report' ? limitsJson(limits, options.top_graphs) : null };
}

/**
 * The report of `mode` (info, dump, code, refs, warns, check or all) over the decoded bundles. `options` as from reportOptions(). Whatever several
 * modes share (the analysis of each file, the reference index) is computed once, so `all` costs little more than its slowest part.
 */
export function buildReport(mode, { bundles, db, options }) {
  const header = headerOf(mode, bundles.map((b) => b.file), options);
  let analyses = null, index = null;
  const analysis = () => (analyses ??= bundles.map((b) => analyzeBundle(b, db)));
  const refsIndex = () => (index ??= buildRefs(bundles, db, { rules: loadRules(JSON.parse(host.data('data/overlay.json') ?? '{}')) }));
  const payload = {
    info: () => bundles.map((b, i) => fileInfo(b, db, { showTag: options.show_tag, analysis: analysis()[i] })),
    dump: () => bundles.map((b, i) => fileDump(b, db, { analysis: analysis()[i] })),
    code: () => bundles.map((b, i) => fileCode(b, db, { analysis: analysis()[i], expand: options.expand })),
    check: () => bundles.map((b, i) => fileCheck(b, db, { analysis: analysis()[i] })),
    refs: () => refsPayload(refsIndex(), options),
    warns: () => warnsPayload(refsIndex(), options),
  };
  if (mode === 'all') {
    const parts = ALL_PARTS.filter((p) => p !== 'code' || options.with_code);
    return { header, all: parts, ...Object.fromEntries(ALL_PARTS.map((p) => [p, parts.includes(p) ? payload[p]() : null])) };
  }
  if (!payload[mode]) throw new Error(`no report for mode ${mode}`);
  return { header, [mode]: payload[mode]() };
}

/** The `raw` report of one file: its container problems and the payload as a tree. `container` = { problems, payload } from unwrapContainer. */
export function buildRawReport(file, container) {
  return { header: headerOf('raw', [file], {}), raw: { container_warnings: container.problems, payload: rawTree(container.payload) } };
}
