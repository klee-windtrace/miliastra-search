// --search / --match for the document formats (markdown, html): the structure stays, only what matches is kept.
//
// The search itself is the one of the line formats: every block has a text form (`textLines`, see doc.mjs) and a line "matches" when
// its plain text does. A document formatter would print a *table*, not those lines, so each line is tied to the unit that prints it:
//   * a table row  (`rowLines` = the lines of each row; else `text` when it has one line per row),
//   * a list item  (`text` with one line per item), a line of a `lines` / `pre` block,
//   * any other block as a whole (heading, paragraph, note, facts, ...).
// A unit is kept when one of its lines is shown (a match, or within --context lines of one). Headings that only structure the document
// (their `text` is null, or they have no match of their own) stay while something below them stays; so do the paragraphs and facts
// that follow them. A node's head line is kept with its pin table.
import { plain } from './doc.mjs';

/** The lines of a block split into independently keepable parts: [[line, ...], ...], or null when the block only structures the document. */
function partsOf(b) {
  if (b.t === 'hr') return null;
  if (b.t === 'lines' || b.t === 'pre') return b.lines.map((l) => [l]);
  if (b.text === null) return null;
  if (b.t === 'table') {
    if (b.rowLines) return b.rowLines;
    return b.text && b.text.length === b.rows.length ? b.text.map((l) => [l]) : b.text ? [b.text] : null;
  }
  if (b.t === 'list') {
    const t = b.text ?? b.items;
    return t.length === b.items.length ? t.map((l) => [l]) : [t];
  }
  if (b.text !== undefined) return [b.text];
  switch (b.t) {
    case 'title': case 'heading': case 'para': case 'note': return [[b.spans]];
    case 'facts': return [b.items.map(([k, v]) => [k, ': ', v])];
    default: return null;
  }
}

/** The block with only the parts `keep` says (a Set of part indices); non-splittable blocks come back unchanged. */
function narrowed(b, keep) {
  const pick = (arr) => arr.filter((_, i) => keep.has(i));
  if (b.t === 'table' && (b.rowLines || (b.text && b.text.length === b.rows.length))) {
    const rowLines = b.rowLines ? pick(b.rowLines) : undefined;
    return { ...b, rows: pick(b.rows), text: rowLines ? rowLines.flat() : pick(b.text), ...(rowLines ? { rowLines } : {}) };
  }
  if (b.t === 'list' && (b.text ?? b.items).length === b.items.length) return { ...b, items: pick(b.items), ...(b.text ? { text: pick(b.text) } : {}) };
  if (b.t === 'lines' || b.t === 'pre') return { ...b, lines: pick(b.lines) };
  return b;
}

/**
 * Keep what matches in one document (the blocks of one file, or of a whole report).
 * `isMatch(plainLine)` decides a line; `context` = lines shown around every match.
 * Returns { blocks, hits } with hits = number of matching lines; no blocks at all when nothing matches.
 */
export function filterBlocks(blocks, { isMatch, context = 0 }) {
  const parts = blocks.map(partsOf);
  // every line of the document in order, with the unit it belongs to
  const lines = [];
  parts.forEach((ps, bi) => ps?.forEach((p, pi) => { for (const l of p) lines.push({ bi, pi, text: plain(l) }); }));
  const hit = lines.map((l) => isMatch(l.text));
  const hits = hit.filter(Boolean).length;
  if (!hits) return { blocks: [], hits: 0 };
  const shown = new Set();
  hit.forEach((h, i) => { if (h) for (let k = Math.max(0, i - context); k <= Math.min(lines.length - 1, i + context); k++) shown.add(k); });
  const keptParts = blocks.map(() => new Set());
  for (const i of shown) keptParts[lines[i].bi].add(lines[i].pi);

  const kept = blocks.map((_, bi) => keptParts[bi].size > 0); // content blocks: something of them is shown
  // a node's head line goes with the pin table right below it
  blocks.forEach((b, bi) => { if (b.t === 'para' && b.cls === 'node' && blocks[bi + 1]?.t === 'table' && kept[bi + 1]) kept[bi] = true; });

  // headings stay while something below them stays; blocks that only structure a section stay with their heading
  const governing = blocks.map(() => null);
  let stack = [];
  blocks.forEach((b, bi) => {
    if (b.t === 'heading') {
      while (stack.length && blocks[stack[stack.length - 1]].level >= b.level) stack.pop();
      stack.push(bi);
      if (kept[bi]) for (const h of stack) kept[h] = true;
    } else {
      governing[bi] = stack.length ? stack[stack.length - 1] : null;
      if (parts[bi] && kept[bi]) for (const h of stack) kept[h] = true;
    }
  });
  const keep = blocks.map((b, bi) => {
    if (b.t === 'title') return true;
    if (b.t === 'heading' || parts[bi]) return kept[bi];
    if (b.t === 'hr') return true; // tidied below
    return governing[bi] == null || kept[governing[bi]];
  });

  const out = [];
  blocks.forEach((b, bi) => {
    if (!keep[bi]) return;
    let nb = parts[bi] && b.t !== 'heading' && b.t !== 'para' && b.t !== 'note' && b.t !== 'facts' ? narrowed(b, keptParts[bi]) : b;
    if (b.t === 'heading' && b.recount) {
      const next = blocks.slice(bi + 1).findIndex((x) => x.t === 'table');
      const tb = next < 0 ? null : bi + 1 + next;
      if (tb != null && keep[tb]) nb = { ...b, spans: b.recount(narrowed(blocks[tb], keptParts[tb]).rows.length) };
    }
    out.push(nb);
  });
  // no separator first, last or twice in a row
  const tidy = [];
  for (const b of out) {
    if (b.t === 'hr' && (!tidy.length || tidy[tidy.length - 1].t === 'hr')) continue;
    tidy.push(b);
  }
  while (tidy.length && tidy[tidy.length - 1].t === 'hr') tidy.pop();
  return { blocks: tidy, hits };
}

