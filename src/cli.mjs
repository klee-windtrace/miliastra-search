import { host } from './host.mjs';
import { basename, join as joinPath, toPosix } from './paths.mjs';
import { parseBundle } from './model.mjs';
import { NodeDb } from './nodedb.mjs';
import { renderDoc } from './render.mjs';
import { buildRefs, KINDS, loadRules } from './refs.mjs';
import { refsReport, refsDetailReport, warnsReport, warnsDetailReport } from './report-refs.mjs';
import { fileInfo, infoBlocks, infoValue } from './info.mjs';
import { filterBlocks } from './filter.mjs';
import { textLines, plain, S } from './doc.mjs';
import { resolveFormat, makeFormatter, isDocumentFormat, hasBom, BOM } from './output/index.mjs';
import { unwrapContainer, ContainerError, looksLikeContainer } from './container.mjs';
import { rawDump } from './raw.mjs';

const HELP = `miliastra-search - read Miliastra Wonderland .gil/.gia node graphs as searchable text

modes:
  miliastra-search info  <files|dirs...> [options]   the file itself: format, version, mode, names, how many resources of which class, level sections
  miliastra-search dump  <files|dirs...> [options]   overview: one line per graph, declaration, struct and resource (with the graphs mounted on it)
  miliastra-search refs  <files|dirs...> [options]   reference index: what uses which variable, timer, signal, composite, struct, mounted graph, ...
  miliastra-search warns <files|dirs...> [options]   findings (lint), resource/graph-size limits, the biggest graphs
  miliastra-search code  <files|dirs...> [options]   the code: every graph node by node, declarations, structs; no resource list
  miliastra-search check <files|dirs...> [options]   unknown-field census, unresolved nodes, findings
  miliastra-search raw   <file>          [options]   schema-less protobuf dump (works even if the schema is outdated)

grep over the output (info, dump, code, refs, warns, check, raw):
  --search <text>    only print the output lines containing this text (case-insensitive; accepts two single quotes
                       as a double quote '' to simplify using on Windows; also for --match)
  --match <regexp>   only print the output lines matching this regular expression (case-insensitive, JavaScript syntax)
                       With both, a line must satisfy both. Exit code 1 when no line matches; the number of
                       matching lines is printed to stderr.
  --context N        with --search/--match: also print N lines around every match, groups separated by "--"
                       The search runs over the lines of the line formats (text, color, md, htm). In the document formats
                       (markdown, html) it keeps the matching table rows, list items and lines, with the headings above them
  --no-file-prefix   with --search/--match, --key, info, dump and code: with several files, do not prefix lines with "file:"

refs, warns:
  --kind <k>         only this kind of reference (warns: of finding): ${KINDS.join(', ')}
                       refs: without --kind the overview lists every kind but node_type; \`--kind node_type\` is a mode of its own, the
                       list of the node types each graph uses
  --name <n>         only references (warns: findings) with exactly this key; refs lists them one by one (mounted graphs are keyed by their plain name, without the <tag>)

refs only:
  --sort-desc        overview: sort entries by number of references (descending) instead of by key

warns only:
  --top-graphs <n>   how many graphs to list by effective node count in the limits section (default 20)

info only:
  --show-tag         also print the export tag incl. UID (and its parts)
  --key <key>        print only the value of one property of the File or Contents table (format, mode, level_name, resources, graphs, ...) or
                       the count of one resource class (a Class name of "Resources by class"), as plain text whatever the --format;
                       for scripts, e.g. to sort stage files by mode or to name them after their level_name. Case-insensitive.
                       Exit code 1 when a file has no such key. With several files each value gets a "file:" prefix (see --no-file-prefix)

dump only:
  --details          also print the numeric values the editor does not show (class=, section=; for graphs kind=, service=, composite_body=, ...; for declarations category=)

code only:
  --all-pins         also print pins without value/wire
  --defaults         also print values the user never edited (is_value_set=0), marked '(default)'

info, refs, warns, check:
  --json             machine-readable output (cannot be combined with --search/--match)

check only:
  --strict           exit 1 if anything is reported

info, dump, code, refs, warns, check (modes that decode a file):
  --lang CODE        names language: CHS (or ZH), CHT, DE, EN, ES, FR, ID, IT, JP, KR, PT, RU, TH, TR, VI;
                     any case, those in the database (default EN)
  --db <nodes.json>  alternate node database
  --input gia|gil    force the input format (default: detected from the file content, not the extension)
  --lenient          tolerate container header/tail problems (best-effort decode)

all modes:
  --format FORMAT    output format (default: auto):
                       auto      by the extension of --output (.md .markdown .htm .html), else color when
                                 writing to a terminal (unless NO_COLOR is set) and text otherwise
                       text      plain lines, one greppable fact per line
                       color     the same lines with ANSI colors
                       md        the same lines as Markdown: bold/italic/underline instead of colors, plus headings
                       htm       the same lines as an HTML page: CSS classes instead of colors, plus headings
                       markdown  a real document: headings, tables, facts (bold/italic instead of colors)
                     md and markdown files start with a UTF-8 byte order mark (BOM), so editors and browsers detect the encoding
                       html      the same document as a standalone dark-theme HTML page
  --output, -o FILE  write the report to FILE instead of stdout
  --help             this page (forced)
`;

class UsageError extends Error {}

const FLAG_OPTIONS = new Set(['json', 'strict', 'all-pins', 'defaults', 'show-tag', 'lenient', 'help', 'no-file-prefix', 'sort-desc', 'details']);
const VALUE_OPTIONS = new Set(['name', 'key', 'kind', 'search', 'match', 'input', 'output', 'format', 'db', 'lang', 'context', 'top-graphs']);

function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--') || a === '-o') {
      const k = a === '-o' ? 'output' : a.slice(2);
      if (FLAG_OPTIONS.has(k)) o[k] = true;
      else if (VALUE_OPTIONS.has(k)) {
        o[k] = argv[++i];
        if (o[k] == null || (o[k].startsWith('--') && k !== 'match' && k !== 'name' && k !== 'search')) throw new UsageError(`--${k} needs a value`);
      } else throw new UsageError(`unknown option ${a} (see --help)`);
    }
    else o._.push(a);
  }
  return o;
}

function sniffsAsContainer(p) {
  try { return looksLikeContainer(host.fs.head(p, 16)); } catch { return false; }
}

function collect(paths) {
  const out = [];
  const walk = (p) => {
    if (host.fs.stat(p).dir) for (const n of host.fs.list(p).sort()) walk(joinPath(p, n));
    else if (/\.(gia|gil)$/i.test(p) || sniffsAsContainer(p)) out.push(p); // by name, or by content (extension-independent)
  };
  for (const p of paths) { const st = host.fs.stat(p); if (!st) throw new Error(`no such file or directory: ${p}`); if (st.dir) walk(p); else out.push(p); }
  return out.map(toPosix); // always "/" in printed paths
}

function load(files, o) {
  const bundles = [], errors = [];
  for (const f of files) {
    try { bundles.push(parseBundle(host.fs.readFile(f), { file: f, lenient: !!o.lenient, format: o.input || null })); }
    catch (e) {
      if (e instanceof ContainerError || e instanceof RangeError) errors.push({ file: f, message: e.message, container: e instanceof ContainerError });
      else throw e;
    }
  }
  return { bundles, errors };
}

/**
 * Run the CLI. `io` = { out(text), err(text), isTTY, env } so tests can drive it in-process. Returns the exit code.
 * Output goes to io.out (or to --output FILE); messages and diagnostics go to io.err.
 */
export function main(argv, io) {
  const err = (m) => io.err(m + '\n');
  let o;
  try { o = parseArgs(argv); } catch (e) { if (e instanceof UsageError) { err(`error: ${e.message}`); return 2; } throw e; }
  let cmd = o._.shift();
  if (cmd == 'warn') cmd = 'warns'; else if (cmd == 'ref') cmd = 'refs';
  if (!cmd || o.help || cmd === 'help') { io.out(HELP); return 0; }
  if (o.input != null && !/^(gia|gil)$/.test(o.input)) { err(`error: --input must be gia or gil, got "${o.input}"`); return 2; }
  let fmt;
  try { fmt = resolveFormat({ format: o.format, output: o.output, toTerminal: io.isTTY, env: io.env }); }
  catch (e) { err(`error: ${e.message}`); return 2; }
  const formatter = makeFormatter(fmt);
  const emit = (text) => { if (o.output) host.fs.writeFile(o.output, text); else io.out(text); };
  // Markdown (md, markdown) is written with a UTF-8 BOM: graph names may not be ASCII, and editors/viewers guess the encoding of a bare .md
  const withBom = (text) => ((fmt === 'md' || fmt === 'markdown') && text && !hasBom(text) ? BOM + text : text);
  const emitDoc = (blocks, title) => emit(withBom(formatter.render(blocks, { title })));
  // Commands with no md/html layout of their own (check, raw) print their lines as preformatted text there.
  const emitLines = (lines, title) => emitDoc(isDocumentFormat(fmt) ? [{ t: 'pre', lines: lines.map(plain) }] : [{ t: 'lines', lines }], title);
  const db = new NodeDb({ ...(o.db ? { dbPath: o.db } : {}), lang: o.lang || 'EN' });
  if (db.languages.length && !db.languages.includes(db.lang)) { err(`error: unknown language "${o.lang}" (the database has: ${db.languages.join(', ')})`); return 2; }

  let rc = 0;
  let re = null; // --match: a case-insensitive RegExp
  if (o.match != null) { try { re = new RegExp(o.match.replace(/''/g,'"'), 'i'); } catch (e) { err(`bad --match regexp: ${e.message}`); return 2; } }
  const needle = o.search != null ? o.search.toLowerCase().replace(/''/g,'"') : null;
  const grepping = re != null || needle != null;
  if (grepping && o.json) { err('--search/--match cannot be combined with --json'); return 2; }
  if (cmd === 'info' && o.key != null && (grepping || o.json)) { err('--key cannot be combined with --search/--match or --json'); return 2; }
  // grep: keep the output lines (spans) that satisfy --search AND --match, plus --context lines around them.
  // groups = [{ prefix, lines }] (one group per file for dump/code), lines are whatever the mode prints in the line formats.
  const ctxN = Number(o.context || 0);
  const lineMatches = (l) => (needle == null || l.toLowerCase().includes(needle)) && (re == null || re.test(l));
  const grepWhat = () => [needle != null ? `search ${JSON.stringify(o.search)}` : null, re != null ? `match ${JSON.stringify(o.match)}` : null].filter(Boolean).join(' and ');
  // Document formats: the report keeps its tables and headings; a row, item or line stays when its text line matches (src/filter.mjs).
  // A group is { blocks } (a report) or { lines } (check, raw: shown as preformatted text); `sep` puts a rule between the groups.
  const emitGrepDocument = (groups, title, sep) => {
    let hits = 0; const out = [];
    for (const g of groups) {
      const r = filterBlocks(g.blocks ?? [{ t: 'pre', lines: g.lines.map(plain) }], { isMatch: lineMatches, context: ctxN });
      hits += r.hits;
      if (r.blocks.length) out.push(...(sep && out.length ? [{ t: 'hr' }] : []), ...r.blocks);
    }
    const note = { t: 'para', spans: hits ? ['Only lines with ', grepWhat()] : ['No line with ', grepWhat()], text: null };
    const at = out[0]?.t === 'title' ? 1 : 0;
    out.splice(at, 0, ...(at ? [] : [{ t: 'title', spans: 'Search', text: null }]), note);
    emitDoc(out, title);
    if (!hits) rc = rc || 1;
    err(`${hits} matching line(s)`);
  };
  const emitGrep = (groups, title, sep = false) => {
    if (isDocumentFormat(fmt)) return emitGrepDocument(groups, title, sep);
    let hits = 0; const out = [];
    for (const { prefix, lines } of groups) {
      const idx = [];
      lines.forEach((l, i) => { if (lineMatches(plain(l))) idx.push(i); });
      const show = new Set();
      for (const i of idx) for (let k = Math.max(0, i - ctxN); k <= Math.min(lines.length - 1, i + ctxN); k++) show.add(k);
      let last = -2;
      for (const i of [...show].sort((x, y) => x - y)) {
        if (ctxN && last >= 0 && i > last + 1) out.push('--');
        out.push(prefix ? [prefix, lines[i]] : lines[i]); last = i;
      }
      hits += idx.length;
    }
    emitDoc([{ t: 'title', spans: ['Lines with ', grepWhat()], text: null }, { t: 'lines', lines: out }], title);
    if (!hits) rc = rc || 1;
    err(`${hits} matching line(s)`);
  };
  // Print a finished report (blocks) either whole or, with --search/--match, only its matching lines.
  const present = (blocks, title) => { if (grepping) emitGrep([{ prefix: '', lines: textLines(blocks), blocks }], title); else emitDoc(blocks, title); };

  if (cmd === 'raw') {
    const f = o._[0]; if (!f) { err('raw needs a file'); return 2; }
    const buf = host.fs.readFile(f);
    let payload; try { payload = unwrapContainer(buf, { lenient: true }); } catch (e) { err(`container: ${e.message}`); return 1; }
    const lines = [...payload.problems.map((p) => `# CONTAINER WARNING: ${p}`), ...rawDump(payload.payload).replace(/\n$/, '').split('\n')];
    const title = `raw ${basename(f)}`;
    if (grepping) emitGrep([{ prefix: '', lines }], title);
    else if (fmt === 'text' || fmt === 'color') emit(payload.problems.map((p) => `# CONTAINER WARNING: ${p}\n`).join('') + rawDump(payload.payload)); // byte-exact
    else emitLines(lines, title);
    return rc;
  }

  const files = collect(o._);
  if (!files.length) { err('no .gia/.gil files given'); return 2; }
  const { bundles, errors } = load(files, o);
  for (const e of errors) { err(`error: ${e.file}: ${e.message}${e.container ? '\n       (try --lenient for best-effort decoding, or "raw" for a schema-less dump)' : ''}`); rc = 1; }
  const multi = files.length > 1;

  if (cmd === 'info') {
    const infos = bundles.map((bd) => fileInfo(bd, db, { showTag: !!o['show-tag'] || o.key != null })); // --key can ask for a tag part
    if (o.json) { emit(JSON.stringify(infos, null, 2) + '\n'); return rc; }
    const title = `info ${files.map((f) => basename(f)).join(', ')}`;
    if (o.key != null) { // only the values, for scripts; the same plain lines in every format
      const values = [];
      for (const info of infos) {
        const v = infoValue(info, o.key);
        if (v === undefined) { err(`error: ${info.file}: no property or resource class \"${o.key}\" (see info for the File and Contents tables and the class names)`); rc = 1; continue; }
        values.push(multi && !o['no-file-prefix'] ? `${info.file}:${v}` : v);
      }
      if (values.length) emitLines(values, title);
      return rc;
    }
    const all = infos.map((info) => { const blocks = infoBlocks(info, { showTag: !!o['show-tag'] }); return { file: info.file, blocks, lines: textLines(blocks) }; });
    if (!grepping) emitDoc(all.flatMap((a, i) => (i ? [{ t: 'hr' }, ...a.blocks] : a.blocks)), title);
    else emitGrep(all.map((a) => ({ prefix: multi && !o['no-file-prefix'] ? a.file + ':' : '', lines: a.lines, blocks: a.blocks })), title, true);
    return rc;
  }

  if (cmd === 'dump' || cmd === 'code') {
    // Everything is analysed per file (renderDoc: names, nodes, mounts) before anything is printed; the mode only picks the view.
    const view = cmd === 'code' ? { code: true, resources: false } : { code: false, resources: true };
    const all = [];
    for (const bd of bundles) {
      const { blocks } = renderDoc(bd, db, { ...view, allPins: !!o['all-pins'], defaults: !!o.defaults, details: cmd === 'dump' && !!o.details, fileLabel: bd.file, fileLine: multi });
      all.push({ file: bd.file, blocks, lines: textLines(blocks) }); // lines: the greppable lines, as spans
    }
    const title = `${cmd} ${files.map((f) => basename(f)).join(', ')}`;
    if (!grepping) emitDoc(all.flatMap((a) => a.blocks), title);
    else emitGrep(all.map((a) => ({ prefix: multi && !o['no-file-prefix'] ? a.file + ':' : '', lines: a.lines, blocks: a.blocks })), title);
    return rc;
  }

  if (cmd === 'refs' || cmd === 'warns') {
    const { refs, findings, limits } = buildRefs(bundles, db, { rules: loadRules(JSON.parse(host.data('data/overlay.json') ?? '{}')) });
    if (o.kind && !KINDS.includes(o.kind)) { err(`unknown --kind ${o.kind}`); return 2; }
    const scanned = bundles.map((bd) => bd.file);
    const title = `${cmd} ${files.map((f) => basename(f)).join(', ')}`;
    const fsel = findings.filter((f) => (!o.kind || f.kind === o.kind) && (o.name == null || f.key === o.name));
    if (cmd === 'warns') {
      if (o.json) { emit(JSON.stringify({ findings: fsel, limits }, null, 2) + '\n'); return rc; }
      if (o.kind || o.name != null) {
        const what = [o.kind ? `kind ${o.kind}` : null, o.name != null ? `name ${JSON.stringify(o.name)}` : null].filter(Boolean).join(' and ');
        present(warnsDetailReport(fsel, { multi, files: scanned, what }), title);
      } else present(warnsReport({ findings: fsel, limits, files: scanned, multi, topN: o['top-graphs'] != null ? Number(o['top-graphs']) : 20 }), title);
      return rc;
    }
    let sel = refs.filter((r) => r.kind !== 'node_type' || o.kind === 'node_type' || o.name);
    if (o.kind) sel = refs.filter((r) => r.kind === o.kind);
    if (o.name != null) sel = sel.filter((r) => String(r.key) === o.name);
    if (o.json) { emit(JSON.stringify({ refs: sel }, null, 2) + '\n'); return rc; }
    if (o.name != null) {
      if (!sel.length) { err('no references found'); rc = rc || 1; }
      present(refsDetailReport(sel, { multi, files: scanned, what: `name ${JSON.stringify(o.name)}` }), title);
      return rc;
    }
    // overview: one entry per kind+key (a line in the text formats, a table row in markdown/html)
    present(refsReport(sel, { files: scanned, sortDesc: !!o['sort-desc'] }), title);
    return rc;
  }

  if (cmd === 'check') {
    const report = [];
    let bad = false;
    for (const b of bundles) {
      const { summary } = renderDoc(b, db, { code: false, resources: false });
      const census = b.census.entries();
      const opaque = [...b.census.opaque.entries()];
      const unresolved = summary.unresolved;
      if (census.length || unresolved.length || b.warnings.length) bad = true;
      report.push({ file: b.file, engine_version: b.engineVersion, format: b.format, mode: b.modeFlag == null ? 'beyond' : b.modeFlag === 1 ? 'classic' : `mode#${b.modeFlag}`, resources: b.resources.length,
        unknown_fields: census, opaque_resources: b.resources.filter((r) => r.kind === 'opaque').length, opaque_fields: [...opaque.reduce((m, [k, n]) => m.set(k.split('.').slice(-2).join('.'), (m.get(k.split('.').slice(-2).join('.')) || 0) + n), new Map())].map(([k, n]) => ({ path: k, count: n })), unresolved_nodes: unresolved.map((u) => ({ what: u.label, count: u.count, where: u.where })), container_warnings: b.warnings });
    }
    const cl = []; // output lines (spans)
    if (o.json) emit(JSON.stringify(report, null, 2) + '\n');
    else for (const r of report) {
      cl.push(`== ${r.file}  ${r.format}  engine ${r.engine_version}  mode ${r.mode}  resources ${r.resources} (${r.opaque_resources} not interpreted)`);
      for (const w of r.container_warnings) cl.push(`   container: ${w}`);
      if (!r.unknown_fields.length) cl.push('   schema census: OK (every field in the file is known to the schema)');
      for (const u of r.unknown_fields) cl.push(`   UNKNOWN FIELD ${u.path} #${u.field} wire ${u.wire} ×${u.count}${u.note ? ' ' + u.note : ''}${u.sample ? ' e.g. ' + u.sample : ''}`);
      for (const u of r.unresolved_nodes) cl.push(['   ', S('keyword', 'UNRESOLVED'), ` ${u.what} ×`, S('count', u.count), ` e.g. ${u.where.join(', ')}`]);
      const sect = r.opaque_fields.filter((x) => x.path.startsWith('GilFile.')), rest = r.opaque_fields.filter((x) => !x.path.startsWith('GilFile.'));
      if (r.format === 'gil' && (sect.length || rest.length)) {
        cl.push(`   uninterpreted level sections: ${sect.map((x) => x.path.replace('GilFile.opaque_', 'root.')).join(', ') || '-'}`);
        if (rest.length) cl.push(`   uninterpreted fields inside listed resources: ${rest.length} kinds (${rest.reduce((n, x) => n + x.count, 0)} occurrences; see --json)`);
      } else if (r.opaque_fields.length) cl.push(`   opaque (known but uninterpreted) fields: ${r.opaque_fields.map((x) => `${x.path}×${x.count}`).join(', ')}`);
    }
    if (!o.json) { const t = `check ${files.map((f) => basename(f)).join(', ')}`; if (grepping) emitGrep([{ prefix: '', lines: cl }], t); else emitLines(cl, t); }
    if (o.strict && bad) return 1;
    return rc;
  }
  err(`unknown command "${cmd}"\n`); io.err(HELP); return 2;
}

/**
 * main() plus the last-resort handler for unexpected errors (message on io.err, details with GIA_DEBUG, exit code 2).
 * Every entry point (the Node CLI, the web page) runs the engine through this.
 */
export function safeMain(argv, io) {
  try { return main(argv, io); }
  catch (e) { io.err(`error: ${e.message}\n`); if (io.env?.GIA_DEBUG) io.err(e.stack + '\n'); return 2; }
}
