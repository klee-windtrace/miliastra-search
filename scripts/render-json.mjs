// Renders a report saved as JSON (miliastra-search <mode> --format json) in any other format, without a .gia / .gil and without the decoder:
// it imports only src/present/, so what comes out is exactly what the same run would have printed directly. It renders the report as it is
// (an `all` report as a whole, check and raw reports too); `miliastra-search <mode> report.json` also picks one part of an `all` report.
//
// usage: node scripts/render-json.mjs <report.json | -> [options]
import fs from 'node:fs';
import { parseArgs, UsageError } from './cli-args.mjs';
import { renderReport, resolveFormat, GrepError, checkFailed } from '../src/present/index.mjs';
import { validate } from '../src/present/validate.mjs';

const USAGE = `usage: node scripts/render-json.mjs <report.json | -> [options]
Renders a report that miliastra-search printed with --format json ("-" reads it from stdin) in another format, without the game files.
  --format FORMAT    text, color, md, htm, markdown, html or json (default: by the extension of --output, else text)
  --output, -o FILE  write to FILE instead of stdout
  --search TEXT, --match REGEXP, --context N, --no-file-prefix   as in miliastra-search (not with json)
  --details          dump reports: also the numeric values (always shown for an all report)
  --optimize         with --pseudocode: a node's only output is read from the call, a value read once is written where it is read
  --all-pins         code reports (and the code part of an all report): also pins without value or wire
  --lazy             with --pseudocode: the values that cross a composite's boundary are lazy (lazy / unlz)
  --pseudocode       code reports: one function per graph; --optimize writes it shorter
  --key KEY          info reports: print only this property (as in miliastra-search info --key)
  --strict           check reports: exit 1 if anything is reported
  --validate         first check the report against schema/report.schema.json; exit 2 when it does not fit
  --help
`;
let parsed;
try {
  parsed = parseArgs(process.argv.slice(2), { flags: ['no-file-prefix', 'strict', 'validate', 'details', 'all-pins', 'pseudocode', 'optimize', 'lazy'], values: ['format', 'output', 'search', 'match', 'context', 'key'], short: { '-o': 'output' }, min: 1, max: 1 });
} catch (e) {
  if (!(e instanceof UsageError)) throw e;
  console.error(`error: ${e.message}\n\n${USAGE}`);
  process.exit(2);
}
if (parsed.help) { process.stdout.write(USAGE); process.exit(0); }
const o = parsed.opts;
const fail = (m, code = 2) => { console.error(`error: ${m}`); process.exit(code); };

let report;
try { report = JSON.parse(fs.readFileSync(parsed.positional[0] === '-' ? 0 : parsed.positional[0], 'utf8').replace(/^﻿/, '')); } catch (e) { fail(`cannot read the report: ${e.message}`); }
if (o.validate) {
  const schema = JSON.parse(fs.readFileSync(new URL('../schema/report.schema.json', import.meta.url), 'utf8'));
  const problems = validate(report, schema);
  if (problems.length) fail(`the report does not fit schema/report.schema.json:\n  ${problems.slice(0, 10).join('\n  ')}`);
}
let format;
try { format = resolveFormat({ format: o.format, output: o.output, toTerminal: false, env: {} }); } catch (e) { fail(e.message); }
if (format === 'json' && (o.search != null || o.match != null || o.key != null)) fail('--search, --match and --key cannot be combined with json');
if (o.key != null && (o.search != null || o.match != null)) fail('--key cannot be combined with --search/--match');

let res;
try {
  res = renderReport(report, { format, search: o.search ?? null, match: o.match ?? null, context: Number(o.context || 0), noFilePrefix: !!o['no-file-prefix'], key: o.key ?? null, details: !!o.details, allPins: !!o['all-pins'], pseudocode: !!o.pseudocode, optimize: !!o.optimize, lazy: !!o.lazy });
} catch (e) {
  if (e instanceof GrepError || e instanceof Error) fail(e.message);
  throw e;
}
if (res.text != null) { if (o.output) fs.writeFileSync(o.output, res.text); else process.stdout.write(res.text); }
for (const m of res.err) console.error(m);
process.exitCode = o.strict && report.check && checkFailed(report.check) ? 1 : res.code;
