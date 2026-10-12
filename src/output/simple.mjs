// The two line-oriented document formats:
//   md   Markdown:  the same lines as "text"/"color", one fact per line, with **bold** / *italic* / <u>underline</u> / `code`
//                   from the theme instead of ANSI colors, plus real headings and --- separators.
//   htm  HTML:      the same lines inside <pre> blocks (alignment kept), <span class="STYLE"> instead of colors, plus
//                   <h1>/<h2> headings and <hr> separators; the same static dark CSS as "html".
// They print what the text format prints (each block's `text` lines); only headings/separators are added.
import { flat, textLines } from '../doc.mjs';
import { makeMarkdownInline, guardLineStart } from './markdown.mjs';
import { htmlInline, htmlPage, htmlEsc } from './html.mjs';

// Reduce blocks to a flat sequence of { h: level, spans } | { hr } | { lines: [spans] } for the line formats.
export function simpleSequence(blocks) {
  const seq = [];
  const pushLines = (lines) => {
    for (const l of lines) {
      const isBlank = flat(l).length === 0 || (flat(l).length === 1 && flat(l)[0] === '');
      if (isBlank) { seq.push({ gap: true }); continue; }
      const last = seq[seq.length - 1];
      if (last?.lines) last.lines.push(l); else seq.push({ lines: [l] });
    }
  };
  const withoutMarker = (l) => flat(l).filter((x) => typeof x === 'string' || x.s !== 'marker');
  for (const b of blocks) {
    if (b.t === 'hr') { seq.push({ hr: true }); continue; }
    if (b.t === 'title') { const t = b.text?.[0]; seq.push({ h: 1, spans: t ? withoutMarker(t) : b.spans }); if (b.text) pushLines(b.text.slice(1)); continue; }
    if (b.t === 'heading') {
      if (b.level <= 2 && b.text?.length) {
        if (b.plain) pushLines(b.text); // the "KIND ..." line is a regular line in the line formats
        else { seq.push({ h: 2, spans: withoutMarker(b.text[0]) }); pushLines(b.text.slice(1)); }
      }
      continue; // deeper/untexted headings only structure the table formats
    }
    pushLines(textLines([b]));
  }
  // drop leading/duplicate/trailing rules and stray gaps next to them
  const out = [];
  for (const it of seq) {
    if (it.gap) { const last = out[out.length - 1]; if (last && !last.gap && !last.hr && !last.h) out.push(it); continue; }
    if (it.hr) { while (out.length && out[out.length - 1].gap) out.pop(); const last = out[out.length - 1]; if (!last || last.hr) continue; }
    out.push(it);
  }
  while (out.length && (out[out.length - 1].gap || out[out.length - 1].hr)) out.pop();
  return out;
}

export function makeMdFormatter() {
  const { inline } = makeMarkdownInline({ nbsp: true });
  const headingInline = makeMarkdownInline({ plainStyles: new Set(['title', 'section', 'heading']) }).inline; // a heading is already emphasized
  return {
    name: 'md',
    inline,
    render(blocks) {
      const parts = [];
      for (const it of simpleSequence(blocks)) {
        if (it.h) parts.push(`${'#'.repeat(it.h)} ${headingInline(it.spans)}`);
        else if (it.hr) parts.push('---');
        else if (it.lines) parts.push(it.lines.map((l) => guardLineStart(inline(l)).replace(/^ /, '&nbsp;')).join('<br>\n'));
        // gaps only separate paragraphs, which the join below already does
      }
      return parts.length ? parts.join('\n\n') + '\n' : '';
    },
  };
}

export function makeHtmFormatter() {
  return {
    name: 'htm',
    inline: htmlInline,
    render(blocks, { title = 'miliastra-search' } = {}) {
      const body = [];
      for (const it of simpleSequence(blocks)) {
        if (it.h) body.push(`<h${it.h}>${htmlInline(it.spans)}</h${it.h}>`);
        else if (it.hr) body.push('<hr>');
        else if (it.lines) body.push(`<pre class="lines">${it.lines.map((l) => htmlInline(l)).join('\n')}</pre>`);
      }
      return htmlPage(body.join('\n'), title);
    },
  };
}
