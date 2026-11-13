// From blocks (or lines) to the text a run prints: the format, the byte order mark of Markdown, and --search / --match.
// Shared by every mode, whether its document comes from a report (the renderers in this folder) or straight from the decoder (dump, code).
// Nothing here prints: a printer returns the text and collects the messages and the exit code the caller should use.
import { filterBlocks } from './filter.mjs';
import { plain, textLines } from './doc.mjs';
import { makeFormatter, isDocumentFormat, hasBom, BOM } from './output/index.mjs';

export class GrepError extends Error {}

/**
 * The grep options of a run: { active, isMatch(plain line), context, what() }. `search` is a case-insensitive substring, `match` a case-insensitive
 * regular expression; a line must satisfy both. Two single quotes stand for a double quote in either, to ease quoting on Windows.
 */
export function makeGrep({ search = null, match = null, context = 0 } = {}) {
  let re = null;
  if (match != null) { try { re = new RegExp(match.replace(/''/g, '"'), 'i'); } catch (e) { throw new GrepError(`bad --match regexp: ${e.message}`); } }
  const needle = search != null ? search.toLowerCase().replace(/''/g, '"') : null;
  return {
    active: re != null || needle != null,
    context: Number(context || 0),
    isMatch: (l) => (needle == null || l.toLowerCase().includes(needle)) && (re == null || re.test(l)),
    what: () => [needle != null ? `search ${JSON.stringify(search)}` : null, re != null ? `match ${JSON.stringify(match)}` : null].filter(Boolean).join(' and '),
  };
}

/**
 * A printer for the format `format` (text, color, md, htm, markdown or html) and the grep options of makeGrep().
 *   doc(blocks, title)          the whole document
 *   lines(lines, title)         plain lines (what check, raw and info --key print), preformatted in the document formats
 *   grep(groups, title, sep)    only the matching lines of groups = [{ prefix, lines, blocks }] (one per file); `sep` puts a rule between the groups
 *   present(blocks, title)      doc() or, when grepping, grep() of the one document
 *   groups(groups, title, sep)  the same for several documents ([{ prefix, blocks }], one per file); a group with `keep` has been chosen by a search of its
 *                               own (the pseudocode of `all`): it is shown whole, and its `hits` count as matches
 * Each returns the text. `err` collects what the run prints to stderr, `code` is the exit code the matches and errors ask for.
 */
export function createPrinter({ format, grep = makeGrep(), tab = false }) {
  const formatter = makeFormatter(format, { tab });
  const err = [];
  let code = 0;
  // Markdown is written with a UTF-8 BOM: graph names may not be ASCII, and editors/viewers guess the encoding of a bare .md
  const withBom = (text) => ((format === 'md' || format === 'markdown') && text && !hasBom(text) ? BOM + text : text);
  const doc = (blocks, title) => withBom(formatter.render(blocks, { title }));
  const lines = (ls, title) => doc(isDocumentFormat(format) ? [{ t: 'pre', lines: ls.map(plain) }] : [{ t: 'lines', lines: ls }], title);
  const count = (hits) => { if (!hits) code = code || 1; err.push(`${hits} matching line(s)`); };

  // Document formats: the report keeps its tables and headings; a row, item or line stays when its text line matches (filter.mjs).
  // A group is { blocks } (a report) or { lines } (check, raw: shown as preformatted text).
  const grepDocument = (groups, title, sep) => {
    let hits = 0; const out = [];
    for (const g of groups) {
      if (g.keep) { hits += g.hits; out.push(...(sep && out.length ? [{ t: 'hr' }] : []), ...g.blocks); continue; } // already chosen by a search of its own
      const r = filterBlocks(g.blocks ?? [{ t: 'pre', lines: g.lines.map(plain) }], { isMatch: grep.isMatch, context: grep.context });
      hits += r.hits;
      if (r.blocks.length) out.push(...(sep && out.length ? [{ t: 'hr' }] : []), ...r.blocks);
    }
    const note = { t: 'para', spans: hits ? ['Only lines with ', grep.what()] : ['No line with ', grep.what()], text: null };
    const at = out[0]?.t === 'title' ? 1 : 0;
    out.splice(at, 0, ...(at ? [] : [{ t: 'title', spans: 'Search', text: null }]), note);
    const text = doc(out, title);
    count(hits);
    return text;
  };
  const grepLines = (groups, title, sep = false) => {
    if (isDocumentFormat(format)) return grepDocument(groups, title, sep);
    let hits = 0; const out = [];
    for (const { prefix, lines: ls, keep, hits: kept } of groups) {
      if (keep) { for (const l of ls) out.push(prefix ? [prefix, l] : l); hits += kept; continue; } // already chosen by a search of its own
      const idx = [];
      ls.forEach((l, i) => { if (grep.isMatch(plain(l))) idx.push(i); });
      const show = new Set();
      for (const i of idx) for (let k = Math.max(0, i - grep.context); k <= Math.min(ls.length - 1, i + grep.context); k++) show.add(k);
      let last = -2;
      for (const i of [...show].sort((x, y) => x - y)) {
        if (grep.context && last >= 0 && i > last + 1) out.push('--');
        out.push(prefix ? [prefix, ls[i]] : ls[i]); last = i;
      }
      hits += idx.length;
    }
    const text = doc([{ t: 'title', spans: ['Lines with ', grep.what()], text: null }, { t: 'lines', lines: out }], title);
    count(hits);
    return text;
  };
  return {
    format, grepping: grep.active, isMatch: grep.isMatch, err,
    get code() { return code; },
    /** A failed request (a missing key, ...): printed as "error: MESSAGE", exit code 1. */
    error(message) { err.push(`error: ${message}`); code = 1; },
    /** A message for stderr that is no error. */
    note(message) { err.push(message); },
    /** Ask for exit code 1 (nothing was found). */
    fail() { code = code || 1; },
    doc, lines, grep: grepLines,
    present(blocks, title) { return grep.active ? grepLines([{ prefix: '', lines: textLines(blocks), blocks }], title) : doc(blocks, title); },
    /** The document made of `groups` ([{ prefix, blocks }]; `sep`: a rule between them), or only its matching lines. */
    groups(groups, title, sep = false) {
      if (grep.active) return grepLines(groups.map((g) => ({ prefix: g.prefix ?? '', blocks: g.blocks, lines: textLines(g.blocks), keep: g.keep, hits: g.hits })), title, sep);
      return doc(groups.flatMap((g, i) => (sep && i ? [{ t: 'hr' }, ...g.blocks] : g.blocks)), title);
    },
  };
}
