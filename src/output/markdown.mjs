// Markdown inline rendering shared by the "markdown" (tables, rich) and "md" (line-by-line) formats, and the
// rich "markdown" formatter itself. Styles come from src/theme.mjs (`md`): bold / italic / underline / code / none.
// Everything user-controlled goes through mdEsc so names with * _ | < [ etc. cannot break the document.
import { flat, splitGraphTag } from '../doc.mjs';
import { STYLES, fractionStyle } from '../theme.mjs';

const ESC_RE = /[\\`*_\[\]<>|~&$]/g;
export const mdEsc = (s) => String(s).replace(ESC_RE, '\\$&');
const oneLine = (s) => s.replace(/\r?\n/g, '<br>');
// Emphasis markers must hug the text: move edge whitespace outside, drop empty content.
function emph(mark, text) {
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
  return m[2] ? `${m[1]}${mark}${m[2]}${mark}${m[3]}` : text;
}
function codeSpan(text, inTable) {
  const t = inTable ? text.replace(/\|/g, '\\|') : text;
  const run = Math.max(0, ...[...t.matchAll(/`+/g)].map((x) => x[0].length));
  const fence = '`'.repeat(run + 1);
  return `${fence}${t.startsWith('`') || t.endsWith('`') ? ` ${t} ` : t}${fence}`;
}
// A rendered line must not start like block syntax (# heading, - list, 1. list).
export const guardLineStart = (s) => s.replace(/^(\s*)([#+\-=])/, '$1\\$2').replace(/^(\s*\d+)([.)])/, '$1\\$2');

/** Inline renderer. `nbsp`: keep runs of spaces (column alignment) by turning them into &nbsp;. */
export function makeMarkdownInline({ nbsp = false, plainStyles = new Set() } = {}) {
  let inTable = false;
  const esc = (t) => { const e = mdEsc(t); return nbsp ? e.replace(/ {2,}/g, (m) => '&nbsp;'.repeat(m.length)) : e; };
  const styled = (name, raw) => {
    const mark = plainStyles.has(name) ? 'none' : (STYLES[name]?.md ?? 'none');
    switch (mark) {
      case 'bold': return emph('**', esc(raw));
      case 'italic': return emph('*', esc(raw));
      case 'bolditalic': return emph('***', esc(raw));
      case 'underline': return raw.trim() ? `<u>${esc(raw)}</u>` : esc(raw);
      case 'code': return raw ? codeSpan(raw, inTable) : '';
      default: return esc(raw);
    }
  };
  const one = (s) => {
    if (typeof s === 'string') return esc(s);
    switch (s.s) {
      case 'graph': { const { tag, rest } = splitGraphTag(s.text); return `'${tag ? styled('graphTag', `<${tag}>`) : ''}${styled('graphName', rest)}'`; }
      case 'frac': return styled(fractionStyle(s.used, s.max), s.text);
      case 'marker': return '';
      default: { const q = STYLES[s.s]?.quote ?? ''; return q + styled(s.s, s.text) + q; }
    }
  };
  const inline = (spans) => flat(spans).map(one).join('');
  return { inline, withTable(fn) { inTable = true; try { return fn(); } finally { inTable = false; } } };
}

export function makeMarkdownFormatter() {
  const { inline, withTable } = makeMarkdownInline();
  const cell = (c) => {
    if (c && !Array.isArray(c) && c.lines) return oneLine(c.lines.map(inline).join('<br>')) || ' ';
    return oneLine(inline(c)) || ' ';
  };
  const block = (b) => {
    switch (b.t) {
      case 'title': return `# ${inline(b.spans)}`;
      case 'heading': return `${'#'.repeat(Math.min(6, b.level))} ${inline(b.spans)}`;
      case 'para': return guardLineStart(inline(b.spans));
      case 'note': return `> ${inline(b.spans)}`;
      case 'list': return b.items.map((i) => `- ${inline(i)}`).join('\n');
      case 'facts': return b.items.map(([k, v]) => `- ${emph('**', mdEsc(k))}: ${inline(v)}`).join('\n');
      case 'lines': return b.lines.map((l) => guardLineStart(inline(l))).join('<br>\n');
      case 'pre': {
        const run = Math.max(2, ...b.lines.map((l) => (l.match(/`+/g) || []).reduce((m, x) => Math.max(m, x.length), 0)));
        const fence = '`'.repeat(run + 1);
        return `${fence}text\n${b.lines.join('\n')}\n${fence}`;
      }
      case 'hr': return '---';
      case 'table': return withTable(() => {
        const head = `| ${b.cols.map((c) => cell(c.title)).join(' | ')} |`;
        const sep = `| ${b.cols.map((c) => (c.align === 'right' ? '---:' : c.align === 'center' ? ':---:' : '---')).join(' | ')} |`;
        const rows = b.rows.map((r) => `| ${b.cols.map((_, i) => cell(r[i])).join(' | ')} |`);
        return [head, sep, ...rows].join('\n');
      });
      default: return '';
    }
  };
  return {
    name: 'markdown',
    inline,
    render(blocks) {
      const parts = blocks.map(block).filter((x) => x !== '');
      return parts.length ? parts.join('\n\n') + '\n' : '';
    },
  };
}
