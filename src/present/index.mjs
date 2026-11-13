// The renderers: a report (src/report.mjs, JSON.md) in, text out. Nothing in this folder reads a .gia / .gil or touches the outside world,
// so a report saved as JSON renders exactly like the one the engine had in memory (scripts/render-json.mjs does just that).
import { createPrinter, makeGrep, GrepError } from './emit.mjs';
import { resolveFormat, FORMAT_NAMES } from './output/index.mjs';
import { printInfo } from './info.mjs';
import { printDump } from './dump.mjs';
import { printCode } from './code.mjs';
import { printAll } from './all.mjs';
import { partOf } from './parts.mjs';
import { printRefs } from './refs.mjs';
import { printWarns } from './warns.mjs';
import { printCheck, checkFailed } from './check.mjs';
import { printRaw } from './raw.mjs';

export { createPrinter, makeGrep, GrepError, resolveFormat, FORMAT_NAMES, checkFailed, partOf };


const PRINTERS = { info: printInfo, dump: printDump, code: printCode, refs: printRefs, warns: printWarns, check: printCheck, raw: printRaw, all: printAll };

/** The modes a report can be of. */
export const RENDERABLE_MODES = Object.keys(PRINTERS);

/**
 * Render a report in `format` (text, color, md, htm, markdown, html or json). Returns { text, err, code }: what to print to stdout, the lines for
 * stderr, and the exit code the content asks for (1 when --search / --match found nothing or when something asked for is not there).
 * opts: { format, search, match, context, noFilePrefix, key, details, allPins } – the presentation options of the command line; `key` is
 * info's --key, `details` (dump) adds the numeric values, `allPins` (code) the pins without value or wire,
 * `pseudocode` (code) prints each graph as a function; --search / --match then choose graphs by name and --context does nothing; `optimize` (with `pseudocode`)
 * writes the code shorter, `lazy` (with `pseudocode`) writes what crosses a composite's boundary as lazy values, `dedup` (dump) lists resources that differ in
 * their guid only once, `short` (info) leaves out the level sections and class ids, `tab` (text and color) separates the columns of a line with tabs.
 * An `all` report always shows the details.
 * Throws GrepError for an unusable --match, and Error for something that is not a report.
 */
export function renderReport(report, { format = 'text', search = null, match = null, context = 0, noFilePrefix = false, key = null, details = false, allPins = false, pseudocode = false, optimize = false, lazy = false, dedup = false, short = false, tab = false, noDetails = false } = {}) {
  const mode = report?.header?.mode;
  if (report?.header?.software !== 'miliastra-search' || !PRINTERS[mode] || !report[mode]) {
    throw new Error('not a miliastra-search report (expected an object with a header naming the software and one of the modes ' + RENDERABLE_MODES.join(', ') + ')');
  }
  if (format === 'json') return { text: JSON.stringify(report, null, 2) + '\n', err: [], code: 0 };
  const printer = createPrinter({ format, grep: makeGrep({ search, match, context }), tab });
  const text = PRINTERS[mode](report, printer, { key, noFilePrefix, details, allPins, pseudocode, optimize, lazy, dedup, short, noDetails });
  return { text, err: printer.err, code: printer.code };
}
