import { host } from './host.mjs';
import { basename, join as joinPath, toPosix } from './paths.mjs';
import { parseBundle } from './model.mjs';
import { NodeDb, normLang } from './nodedb.mjs';
import { KINDS } from './refs.mjs';
import { buildReport, buildRawReport, reportOptions } from './report.mjs';
import { renderReport, makeGrep, GrepError, resolveFormat, checkFailed } from './present/index.mjs';
import { loadReport, selectPart, optionDifferences, SavedError } from './present/saved.mjs';
import { unwrapContainer, ContainerError, looksLikeContainer } from './container.mjs';

const HELP = `miliastra-search - read Miliastra Wonderland .gil/.gia node graphs as searchable text

modes:
  miliastra-search info  <files|dirs...> [options]   the file itself: format, version, mode, names, how many resources of which class, level sections
  miliastra-search dump  <files|dirs...> [options]   overview: one line per graph, declaration and resource (with the graphs mounted on it)
  miliastra-search refs  <files|dirs...> [options]   reference index: what uses which variable, timer, signal, composite, struct, mounted graph, ...
  miliastra-search warns <files|dirs...> [options]   findings (lint), resource/graph-size limits, the biggest graphs
  miliastra-search code  <files|dirs...> [options]   the code: every graph node by node, declarations, structs; no resource list
  miliastra-search check <files|dirs...> [options]   unknown-field census, unresolved nodes, findings
  miliastra-search raw   <file>          [options]   schema-less protobuf dump (works even if the schema is outdated)
  miliastra-search all   <files|dirs...> [options]   info, dump (always with --details), refs and warns one after the other (code too with --with-code)
  miliastra-search llm   <files|dirs...>             everything for a language model to read: the all report without warns, in plain text, as short
                       pseudocode. It takes only --lang and --output (it sets --lenient --format text --short --dedup --tab --pseudocode
                       --optimize --lazy --with-code itself) and no saved report

Files are shown by their name only (no directory). A file that cannot be read or decoded stops the run: nothing is printed or written, and
the exit code is 1. Files with the same name (case-sensitive) are refused even from different directories.

a saved report as input:
  miliastra-search <mode> <report.json> [options]    renders a report saved with --format json, without the game files. Only one report at a time (a
                       .json file in a directory is not picked up). The mode must be the report's own, or any part of an all report (info, dump,
                       code, refs, warns, all); check and raw cannot be rendered from a report. A warning line names the options that differ from
                       the ones the report was made with. --lenient reads a report that does not fit the format as far as possible.
                       The options that only change how something is shown (--details, --all-pins) work on a saved report too.

grep over the output (info, dump, code, refs, warns, check, raw, all):
  --search <text>    only print the output lines containing this text (case-insensitive; accepts two single quotes
                       as a double quote '' to simplify using on Windows; also for --match)
  --match <regexp>   only print the output lines matching this regular expression (case-insensitive, JavaScript syntax)
                       With both, a line must satisfy both. Exit code 1 when no line matches; the number of
                       matching lines is printed to stderr.
  --context N        with --search/--match: also print N lines around every match, groups separated by "--"
                       The search runs over the lines of the line formats (text, color, md, htm). In the document formats
                       (markdown, html) it keeps the matching table rows, list items and lines, with the headings above them
                       There is nothing to search in --format json: it cannot be combined with --search/--match
  --no-file-prefix   with --search/--match, --key, info, dump, code and all: with several files, do not prefix lines with "file:"

refs, warns, all:
  --kind <k>         only this kind of reference (warns: of finding): ${KINDS.join(', ')}
                       refs: without --kind the overview lists every kind but node_type; \`--kind node_type\` is a mode of its own, the
                       list of the node types each graph uses
  --name <n>         only references (warns: findings) with exactly this key; refs lists them one by one (mounted graphs are keyed by their plain name, without the <tag>)

refs, all:
  --sort-desc        overview: sort entries by number of references (descending) instead of by key

warns, all:
  --top-graphs <n>   how many graphs to list by effective node count in the limits section (default 20)

info, all:
  --short            leave out the level sections and the class= terms of the resource classes
  --show-tag         also print the export tag incl. UID (and its parts); the tag is then part of the JSON report
  --key <key>        (info only) print only the value of one property of the File or Contents table (format, mode, level_name, resources, graphs, ...) or
                       the count of one resource class (a Class name of "Resources by class"), as plain text whatever the --format;
                       for scripts, e.g. to sort stage files by mode or to name them after their level_name. Case-insensitive.
                       Exit code 1 when a file has no such key. With several files each value gets a "file:" prefix (see --no-file-prefix)
                       The export tag parts (export_tag, uid, time, file_id) are only there with --show-tag

dump, all:
  --dedup            list resources that have no folder and the same name, class (and section with --details), parent and mounted graphs once:
                       the line shows the smallest guid of them and a "+N more" label (N = the others left out)

dump:
  --details          also show the numeric values the editor does not show (class=, section=; for graphs kind=, service=, decl=, ...; for signal
                       declarations category=). They are always in the JSON report; the all mode always shows them

code, all:
  --all-pins         also show pins without value/wire, and with --pseudocode the outputs nothing reads (they are always in the JSON report)

code:
  --pseudocode       print every graph as one JavaScript-like function instead of the wire-by-line text: a case per node that has flow pins, the data
                       nodes it needs written out before it, a composite call as a call of the composite's function (see --expand). --all-pins
                       still applies; --search / --match then choose nodes: they look at the lines of the plain code listing, and only the cases of
                       the nodes that matched (and of the nodes that read a matched data node) are written, in the graphs that have one; --context
                       does nothing. The pseudocode is always in the JSON report; this only chooses how it is shown
  --expand           with --pseudocode: write a composite call as the nodes of the composite's body, as if they stood where the call is (the
                       default is a call of the composite's own function, \`Composite['Name']($, { ... })\`). It decides what the pseudocode in the
                       JSON report holds, so it is recorded in the report's options
  --optimize         with --pseudocode: a node with one output is read directly (const x = Node().Pin;) instead of destructured, and a value that is
                       read once is not declared: the call stands where the value is read, in a typecast: Ety(Get_Self_Entity().Self_Entity)
  --lazy             with --pseudocode: the values that cross a composite's boundary are lazy: lazy(()=> Node()) for a data node whose value goes into a
                       composite, unlz(value) where a native node reads a lazy value, and the helpers written once as a comment. Native code is not touched
                       (a comment block that explains the conventions of the code opens the document)

all only:
  --with-code        also the code view (heavy, rarely needed): after the other parts. --pseudocode, --expand, --optimize and --lazy apply to it as in code

check only:
  --strict           exit 1 if anything is reported

info, dump, code, refs, warns, check, all (modes that decode a file):
  --lang CODE        names language: CHS (or ZH), CHT, DE, EN, ES, FR, ID, IT, JP, KR, PT, RU, TH, TR, VI;
                     any case, those in the database (default EN)
  --db <nodes.json>  alternate node database
  --input gia|gil    force the input format (default: detected from the file content, not the extension)
  --lenient          tolerate container header/tail problems (best-effort decode); for a saved report: tolerate a structure that does not fit the format

all modes:
  --tab              text and color formats: separate the columns of a line with a single tab instead of spaces (indent of the pseudocode: tabs).
                       A separator character (: -> = ...) stays with the column on its left. --search / --match still see the spaces
  --format FORMAT    output format (default: auto):
                       auto      by the extension of --output (.md .markdown .htm .html .json), else color when
                                 writing to a terminal (unless NO_COLOR is set) and text otherwise
                       text      plain lines, one greppable fact per line
                       color     the same lines with ANSI colors
                       md        the same lines as Markdown: bold/italic/underline instead of colors, plus headings
                       htm       the same lines as an HTML page: CSS classes instead of colors, plus headings
                       markdown  a real document: headings, tables, facts (bold/italic instead of colors)
                     md and markdown files start with a UTF-8 byte order mark (BOM), so editors and browsers detect the encoding
                       html      the same document as a standalone dark-theme HTML page
                       json      the parsed result itself, for other programs (the format is described in JSON.md)
  --output, -o FILE  write the report to FILE instead of stdout; FILE is only written when the run succeeded (exit code 0)
  --help             this page (forced)
`;

class UsageError extends Error {}

// Modes are listed in this order; `all` is the mode made of the others.
const MODES = ['info', 'dump', 'code', 'refs', 'warns', 'check', 'raw'];
const COMMANDS = [...MODES, 'all', 'llm'];
// `llm` is `all` with these options and without the warns part; the language and the output file are its only options of its own
const LLM_OPTIONS = { lenient: true, format: 'text', short: true, dedup: true, tab: true, pseudocode: true, optimize: true, lazy: true, 'with-code': true };

const FLAG_OPTIONS = new Set(['strict', 'all-pins', 'show-tag', 'lenient', 'help', 'no-file-prefix', 'sort-desc', 'details', 'with-code', 'pseudocode', 'optimize', 'lazy', 'expand', 'dedup', 'short', 'tab']);
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

// A saved report: by the extension, or (extension-independent like the game files) by a first character of `{` in a file that is no container.
function isReportFile(p) {
  if (/\.json$/i.test(p)) return true;
  try {
    const h = host.fs.head(p, 8);
    const at = h[0] === 0xEF && h[1] === 0xBB && h[2] === 0xBF ? 3 : 0;
    return !looksLikeContainer(h) && h[at] === 0x7B;
  } catch { return false; }
}

/** The game files and saved reports named by `paths` (directories are searched for game files only), as paths with "/" separators. */
function collect(paths) {
  const files = [], reports = [];
  const walk = (p) => {
    if (host.fs.stat(p).dir) for (const n of host.fs.list(p).sort()) walk(joinPath(p, n));
    else if (/\.(gia|gil)$/i.test(p) || sniffsAsContainer(p)) files.push(p); // by name, or by content (extension-independent)
  };
  for (const p of paths) {
    const st = host.fs.stat(p);
    if (!st) throw new Error(`no such file or directory: ${p}`);
    if (st.dir) walk(p); else if (isReportFile(p)) reports.push(p); else files.push(p);
  }
  return { files: files.map(toPosix), reports: reports.map(toPosix) };
}

/** The names of the files that occur more than once: [[name, [path, ...]]]. Reports show files by name only, so a name has to say which file it is. */
function sameNames(files) {
  const byName = new Map();
  for (const f of files) { const n = basename(f); byName.set(n, [...(byName.get(n) ?? []), f]); }
  return [...byName].filter(([, paths]) => paths.length > 1);
}

/** What a file that could not be read or decoded is reported as on stderr (after "error: "). */
const errorMessage = (e) => `${e.file}: ${e.message}${e.kind === 'container' ? '\n       (try --lenient for best-effort decoding, or "raw" for a schema-less dump)' : ''}`;

/** Decode every file; the files are known by their name only from here on. Returns { bundles, errors: [{ file (the path), kind, message }] }. */
function load(files, o) {
  const bundles = [], errors = [];
  for (const f of files) {
    let bytes;
    try { bytes = host.fs.readFile(f); } catch (e) { errors.push({ file: f, kind: 'read', message: `cannot read the file: ${e.message}` }); continue; }
    try { bundles.push(parseBundle(bytes, { file: basename(f), lenient: !!o.lenient, format: o.input || null })); }
    catch (e) {
      if (e instanceof ContainerError || e instanceof RangeError) errors.push({ file: f, kind: e instanceof ContainerError ? 'container' : 'decode', message: e.message });
      else throw e;
    }
  }
  return { bundles, errors };
}

/**
 * Run the CLI. `io` = { out(text), err(text), isTTY, env } so tests can drive it in-process. Returns the exit code.
 * Output goes to io.out (or to --output FILE, only when the run succeeded); messages and diagnostics go to io.err.
 *
 * A mode first builds its report (src/report.mjs: the parsed, filtered result as a plain object), then the report is rendered in the chosen
 * format (src/present/); `json` is the report itself. A saved report (.json) takes the place of the files: it is rendered as it is, without the decoder.
 * A file that cannot be read or decoded ends the run before anything is printed or written.
 */
export function main(argv, io) {
  const err = (m) => io.err(m + '\n');
  let o;
  try { o = parseArgs(argv); } catch (e) { if (e instanceof UsageError) { err(`error: ${e.message}`); return 2; } throw e; }
  let cmd = o._.shift();
  if (cmd == 'warn') cmd = 'warns'; else if (cmd == 'ref') cmd = 'refs';
  if (!cmd || o.help || cmd === 'help') { io.out(HELP); return 0; }
  if (!COMMANDS.includes(cmd)) { err(`unknown command "${cmd}"\n`); io.err(HELP); return 2; }
  const llm = cmd === 'llm';
  if (llm) {
    const other = Object.keys(o).filter((k) => k !== '_' && k !== 'lang' && k !== 'output');
    if (other.length) { err(`error: llm takes no options but --lang and --output, got ${other.map((k) => '--' + k).join(', ')}`); return 2; }
    o = { _: o._, ...(o.lang != null ? { lang: o.lang } : {}), ...(o.output != null ? { output: o.output } : {}), ...LLM_OPTIONS };
    cmd = 'all';
  }
  if (o.input != null && !/^(gia|gil)$/.test(o.input)) { err(`error: --input must be gia or gil, got "${o.input}"`); return 2; }
  let fmt;
  try { fmt = resolveFormat({ format: o.format, output: o.output, toTerminal: io.isTTY, env: io.env }); }
  catch (e) { err(`error: ${e.message}`); return 2; }

  // --search / --match: the printers parse them (makeGrep); trying them here reports a bad expression before any file is read
  const grepOpts = { search: o.search ?? null, match: o.match ?? null, context: Number(o.context || 0) };
  let grepping;
  try { grepping = makeGrep(grepOpts).active; } catch (e) { if (e instanceof GrepError) { err(e.message); return 2; } throw e; }
  if (fmt === 'json' && grepping) { err('--search/--match cannot be combined with --format json'); return 2; }
  if (o.key != null && cmd === 'all') { err('error: --key replaces the info document by plain values, so it cannot be part of all; use info --key'); return 2; }
  if (cmd === 'info' && o.key != null && (grepping || fmt === 'json')) { err('--key cannot be combined with --search/--match or --format json'); return 2; }
  if (o.kind && !KINDS.includes(o.kind) && ['refs', 'warns', 'all'].includes(cmd)) { err(`unknown --kind ${o.kind}`); return 2; }
  if (o['top-graphs'] != null && !/^\d+$/.test(o['top-graphs'])) { err(`error: --top-graphs needs a whole number, got "${o['top-graphs']}"`); return 2; }

  // Print what a render produced: the text to stdout (or --output, only for a run that went well), the messages to stderr; returns the exit code it asks for.
  const finish = ({ text, err: messages, code }) => {
    if (text != null) {
      if (!o.output) io.out(text);
      else if (code === 0) host.fs.writeFile(o.output, text);
      else messages = [...messages, `${o.output} was not written (the run did not succeed)`];
    }
    for (const m of messages) err(m);
    return code;
  };
  const render = (report) => {
    const r = renderReport(report, { format: fmt, ...grepOpts, noFilePrefix: !!o['no-file-prefix'], key: o.key ?? null, details: !!o.details, allPins: !!o['all-pins'], pseudocode: !!o.pseudocode, optimize: !!o.optimize, lazy: !!o.lazy, dedup: !!o.dedup, short: !!o.short, tab: !!o.tab, noDetails: llm });
    if (llm) r.text += '\n# END\n';
    return finish(r);
  };

  // The one input of a run is either a saved report or game files (raw takes its first argument only).
  if (cmd === 'raw' && !o._.length) { err('raw needs a file'); return 2; }
  const rawStat = cmd === 'raw' ? host.fs.stat(o._[0]) : null;
  let found;
  try { found = cmd === 'raw' ? (rawStat && !rawStat.dir && isReportFile(o._[0]) ? { files: [], reports: [toPosix(o._[0])] } : { files: [toPosix(o._[0])], reports: [] }) : collect(o._); } catch (e) { err(`error: ${e.message}`); return 2; }
  const { files: collected, reports } = found;
  if (reports.length) {
    if (llm) { err('error: llm needs game files, not a saved report'); return 2; }
    if (o._.length > 1) { err(`error: a saved report is processed on its own, not together with other inputs (${o._.join(', ')})`); return 2; }
    return runSaved(reports[0]);
  }
  if (!collected.length) { err('no .gia/.gil files given'); return 2; }
  const twins = sameNames(collected);
  if (twins.length) {
    err(`error: files are shown by their name, so the names have to differ (case-sensitive), also across directories:\n${twins.map(([n, ps]) => `  ${n}: ${ps.join(', ')}`).join('\n')}`);
    return 2;
  }

  if (cmd === 'raw') {
    const f = collected[0];
    let container;
    try { container = unwrapContainer(host.fs.readFile(f), { lenient: true }); } catch (e) { err(errorMessage({ file: f, kind: e instanceof ContainerError ? 'raw' : 'read', message: e instanceof ContainerError ? e.message : `cannot read the file: ${e.message}` })); return 1; }
    return render(buildRawReport(basename(f), container));
  }

  const db = new NodeDb({ ...(o.db ? { dbPath: o.db } : {}), lang: o.lang || 'EN' });
  if (db.languages.length && !db.languages.includes(db.lang)) { err(`error: unknown language "${o.lang}" (the database has: ${db.languages.join(', ')})`); return 2; }
  const { bundles, errors } = load(collected, o);
  if (errors.length) { for (const e of errors) err(`error: ${errorMessage(e)}`); return 1; } // one bad file and nothing is reported

  const report = buildReport(cmd, { bundles, db, options: reportOptions(cmd, o, db.lang) });
  if (llm) Object.assign(report, { all: report.all.filter((p) => p !== 'warns'), warns: null }); // the language model gets no lint
  const code = render(report);
  return o.strict && cmd === 'check' && checkFailed(report.check) ? 1 : code;

  // A saved report instead of game files: read, check that it can answer `cmd`, warn about options that differ, render without the decoder.
  function runSaved(path) {
    try {
      let text; try { text = host.readText(path); } catch (e) { throw new SavedError(`${path}: cannot read the file: ${e.message}`, 1); }
      const schemaText = o.lenient ? null : host.data('schema/report.schema.json');
      const report = loadReport(text, { schema: schemaText ? JSON.parse(schemaText) : null, lenient: !!o.lenient });
      const selected = selectPart(report, cmd);
      const diff = optionDifferences(selected, cmd, reportOptions('all', o, normLang(o.lang)));
      if (diff) err(diff);
      return render(selected);
    } catch (e) {
      if (!(e instanceof SavedError || e instanceof Error)) throw e;
      err(`error: ${e.message}`);
      return e instanceof SavedError ? e.exitCode : 1;
    }
  }
}

/**
 * main() plus the last-resort handler for unexpected errors (message on io.err, details with GIA_DEBUG, exit code 2).
 * Every entry point (the Node CLI, the web page) runs the engine through this.
 */
export function safeMain(argv, io) {
  try { return main(argv, io); }
  catch (e) { io.err(`error: ${e.message}\n`); if (io.env?.GIA_DEBUG) io.err(e.stack + '\n'); return 2; }
}
