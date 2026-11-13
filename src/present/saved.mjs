// A report that was saved as JSON and is used as the input of a run (miliastra-search <mode> report.json, scripts/render-json.mjs): reading it,
// checking that it can answer the mode that was asked for, and telling the person where the command line and the report disagree.
// Like the rest of this folder it never reads a .gia / .gil.
import { validate } from './validate.mjs';
import { partOf } from './parts.mjs';
import { OPTIONS, MODE_OPTIONS, ALL_PARTS } from './options.mjs';

/** A saved report cannot be used: `exitCode` 1 = the file is no good, 2 = it cannot answer what was asked. */
export class SavedError extends Error {
  constructor(message, exitCode = 2) { super(message); this.exitCode = exitCode; }
}

/** Modes whose reports are not rendered from a saved file: check and raw describe the decoder's view of the game file. */
const NEEDS_FILES = ['check', 'raw'];

/** What `lenient` makes of a report that does not fit the format: the parts every renderer reads are filled in, the rest is taken as it is. */
function loosely(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report) || !report.header || typeof report.header !== 'object') return report;
  const header = { ...report.header, files: Array.isArray(report.header.files) ? report.header.files : [], options: report.header.options && typeof report.header.options === 'object' ? report.header.options : {} };
  const out = { ...report, header };
  if (header.mode === 'all' && !Array.isArray(report.all)) out.all = ALL_PARTS.filter((p) => report[p] != null);
  return out;
}

/**
 * The report in `text` (JSON, a leading byte order mark is fine). Without `lenient` it has to fit the schema (`schema` = the parsed
 * schema/report.schema.json); with it, whatever can still be read is taken (the structure is not checked).
 */
export function loadReport(text, { schema = null, lenient = false } = {}) {
  let report;
  try { report = JSON.parse(text.replace(/^﻿/, '')); } catch (e) { throw new SavedError(`cannot read the report: ${e.message}`, 1); }
  if (lenient) return loosely(report);
  if (schema) {
    const problems = validate(report, schema);
    if (problems.length) throw new SavedError(`the report does not fit schema/report.schema.json (--lenient reads it anyway):\n  ${problems.slice(0, 10).join('\n  ')}`, 1);
  }
  return report;
}

/**
 * Is this a saved report? A quick look at the bytes (a leading byte order mark is fine): they must parse as JSON whose header names the software, a
 * mode and the files. Returns { mode, files } (the header's), or null. Never throws; the report is not checked against the schema.
 */
export function identifyReport(bytes) {
  try {
    const h = new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, '').trimStart();
    if (h[0] !== '{') return null;
    const header = JSON.parse(h)?.header;
    if (header?.software !== 'miliastra-search' || typeof header.mode !== 'string' || !Array.isArray(header.files) || !header.files.every((f) => typeof f === 'string')) return null;
    return { mode: header.mode, files: header.files };
  } catch { return null; }
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const given = (key, v) => v !== undefined && !same(v, OPTIONS[key].fallback);
const shown = (key, v) => (v === undefined ? 'not in the report' : given(key, v) ? JSON.stringify(v) : 'not given');

/**
 * One line (or null) naming the options that differ between the command line and the header of the report: given on one side only, or with
 * another value. `cli` = the effective options of the command line (as src/report.mjs reportOptions gives them for `all`); `mode` = the mode
 * the report is used as. --lenient is left out: for a saved report it only decides how strictly the file is read.
 */
export function optionDifferences(report, mode, cli) {
  const options = partOf(report, mode).header.options;
  const keys = [...new Set([...MODE_OPTIONS[mode], ...Object.keys(cli).filter((k) => given(k, cli[k]))])].filter((k) => k !== 'lenient');
  const diff = keys.filter((k) => given(k, options[k]) !== given(k, cli[k]) || (given(k, options[k]) && !same(options[k], cli[k])));
  if (!diff.length) return null;
  return `warning: the options differ from those the report was made with: ${diff.map((k) => `${OPTIONS[k].flag} (report: ${shown(k, options[k])}, command line: ${shown(k, cli[k])})`).join(', ')}`;
}

/**
 * The report to render for the mode `mode` that was asked for: the report itself, or the part of an `all` report. Throws SavedError when the
 * report cannot answer: a mode that needs the game files, another mode than the report's (unless it is an `all` report that holds it), or
 * `code` out of an `all` report made without --with-code.
 */
export function selectPart(report, mode) {
  const have = report?.header?.mode;
  if (report?.header?.software !== 'miliastra-search' || !have) throw new SavedError('not a miliastra-search report (no header naming the software and the mode)', 1);
  if (NEEDS_FILES.includes(mode) || NEEDS_FILES.includes(have)) {
    throw new SavedError(`${NEEDS_FILES.includes(mode) ? mode : have} cannot be rendered from a saved report: it describes how the game file was decoded; run it on the .gia / .gil itself`);
  }
  if (have !== 'all') {
    if (mode === have) return report;
    throw new SavedError(`the report is a ${have} report, not a ${mode} report; ${mode} needs the game files or an all report`);
  }
  if (mode === 'all') return report;
  if (mode === 'code' && report.code == null) throw new SavedError('the report has no code part: it was made without --with-code (code is opt-in)');
  if (!ALL_PARTS.includes(mode) || report[mode] == null) throw new SavedError(`the all report has no ${mode} part`);
  return partOf(report, mode);
}
