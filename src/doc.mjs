// Structured output model. Commands don't print strings; they build a *document* (a list of blocks made of
// inline spans) and hand it to a formatter from src/output/ (text, color, markdown, md, html, htm).
//
// WHY: the same report has to come out as aligned console text, colored console text and several
// Markdown/HTML flavours. Formatting decisions (quotes, padding, colors, escaping) live in the formatters and in
// src/theme.mjs; the builders only say *what* each piece is.
//
// ---- inline spans ----------------------------------------------------------------------------------------
// A "spans" value is a string, a span object, or a (nested) array of those. Plain strings are literal text.
//   S(style, text)   text in the theme style `style` (see src/theme.mjs for the full list); the style decides quotes
//   graph(label)     'single-quoted' graph name; a leading <tag> is split off and styled as graphTag
//   frac(used, max)  a used/max fraction, styled by how close it is to the cap
//   marker(text)     the "# " / "### " prefix of a heading line: printed in text/color, replaced by real headings in md/htm
// There is no pattern matching on text anywhere: if something needs a style, the builder marks it. Free-form
// messages/notes that are assembled as strings (findings, notes, static-resolution reasons) are written with the
// tagged template `T`, which returns the plain string and remembers its structure for `spansOf`.
//
// ---- blocks -----------------------------------------------------------------------------------------------
// Every block may carry `text`: the span-lines it contributes to the line-oriented formats (text, color, md, htm);
// the table-oriented formats (markdown, html) ignore it and use the structure instead. `text: null` = nothing in the
// line formats; a missing `text` falls back to a per-type default.
//   { t:'title', spans, text? }               document title (H1)
//   { t:'heading', level, spans, text?, plain?, recount? }  section heading; in md/htm its first text line becomes the heading,
//                                            unless `plain` (then the text lines stay ordinary lines there; html/markdown still get the heading).
//                                            `recount(n)` gives the heading for a filtered table that kept n rows (a heading that shows a count)
//   { t:'para', spans, text?, cls? }          paragraph
//   { t:'facts', items:[[label, spans]], text? } key/value facts
//   { t:'list', items:[spans], text? }        bullet list
//   { t:'table', cols:[{title, align?}], rows:[[spans...]], text?, rowLines? }   cells may be spans or {lines:[spans]}; `rowLines` = the text
//                                            lines of each row, when a row prints more than one (else `text` has one line per row); --search/--match
//                                            in the document formats keep or drop whole rows by them (src/filter.mjs)
//   { t:'lines', lines:[spans] }              plain lines, same in every format
//   { t:'note', spans, level?, text? }        callout (warnings)
//   { t:'pre', lines:[string] }               verbatim preformatted text
//   { t:'hr' }                                separator; a blank line in text/color, a rule in md/htm
import { STYLES } from './theme.mjs';

export const S = (style, text) => ({ s: style, text: String(text) });
export const graph = (text) => ({ s: 'graph', text: String(text) });
export const marker = (text) => ({ s: 'marker', text });
export const frac = (used, max, text) => ({ s: 'frac', used, max, text: text ?? `${used}/${max}` });
/** A refs item key as printed in tables: JSON-escaped (so it stays on one line) inside "double quotes". */
export const key = (raw) => S('key', JSON.stringify(String(raw)).slice(1, -1));
export const level = (lvl, text) => S(lvl === 'warn' ? 'warn' : 'info', text ?? String(lvl).toUpperCase());

/** Flatten nested spans to a flat array of strings/span objects (null/undefined/'' dropped). */
export function flat(spans, out = []) {
  if (spans == null || spans === false || spans === '') return out;
  if (Array.isArray(spans)) { for (const s of spans) flat(s, out); return out; }
  out.push(typeof spans === 'object' ? spans : String(spans)); // numbers etc. are literal text
  return out;
}

/** Join several spans values with a separator (a string or spans). */
export function join(list, sep = ', ') {
  const out = [];
  list.forEach((x, i) => { if (i) out.push(sep); out.push(x); });
  return out;
}

// ---- messages assembled as strings ----------------------------------------------------------------------
// `T` is a tagged template: T`graph ${graph(g)} has ${S('count', 2)} things` returns the plain string (what JSON
// output and tests see) and remembers the structured version under that exact text. Formatters call
// spansOf(text) to get the structure back; unknown text is simply plain. Two different structures producing the
// identical text would share an entry, which cannot matter for prose that carries its own quotes.
const messages = new Map();
export function T(strings, ...vals) {
  const spans = [];
  strings.forEach((str, i) => { spans.push(str); if (i < vals.length) spans.push(spansOf(vals[i])); }); // nested T strings keep their structure
  const text = plain(spans);
  if (flat(spans).some((x) => typeof x !== 'string')) messages.set(text, spans);
  return text;
}
/** Collapse equal items: [{ item (first of its kind), n }] in first-seen order. `keyOf` says what "equal" means. */
export function countEqual(list, keyOf) {
  const groups = new Map();
  for (const item of list) { const k = keyOf(item); if (groups.has(k)) groups.get(k).n++; else groups.set(k, { item, n: 1 }); }
  return [...groups.values()];
}
/** Join strings/messages with a separator, keeping the structure of each part (a T message itself). */
export function Tjoin(list, sep = ', ') {
  const spans = join(list.map((x) => spansOf(x)), sep);
  const text = plain(spans);
  if (flat(spans).some((x) => typeof x !== 'string')) messages.set(text, spans);
  return text;
}
export const spansOf = (text) => (typeof text === 'string' && messages.has(text) ? messages.get(text) : text ?? '');

/** Split a graph label into { tag, name } (tag without brackets, or null). */
export function splitGraphTag(text) {
  const m = /^<(\w+)>/.exec(text);
  return m ? { tag: m[1], rest: text.slice(m[0].length) } : { tag: null, rest: text };
}

/** Plain-text rendering (no styling), used for widths, filtering and search. */
export function plain(spans) {
  let out = '';
  for (const s of flat(spans)) {
    if (typeof s === 'string') out += s;
    else if (s.s === 'graph') out += `'${s.text}'`;
    else { const q = STYLES[s.s]?.quote ?? ''; out += q + s.text + q; }
  }
  return out;
}

/** Left-align spans to `width` columns (plain-text width), padding with spaces. */
export const padSpans = (spans, width) => { const n = plain(spans).length; return n >= width ? spans : [spans, ' '.repeat(width - n)]; };

/** Lines of text-mode content of a block list (blocks with text: null contribute nothing). */
export function textLines(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.text === null) continue;
    if (b.text !== undefined) { out.push(...b.text); continue; }
    switch (b.t) {
      case 'hr': out.push(''); break;
      case 'lines': out.push(...b.lines); break;
      case 'pre': out.push(...b.lines); break;
      case 'title': case 'heading': case 'para': case 'note': out.push(b.spans); break;
      case 'list': out.push(...b.items); break;
      case 'facts': out.push(...b.items.map(([k, v]) => [k, ': ', v])); break;
      default: break; // table without text: nothing sensible
    }
  }
  return out;
}
