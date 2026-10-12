// Console formatters: "text" (no styling) and "color" (ANSI). Both print each block's `text` lines
// (see src/doc.mjs); tables and headings meant for the document formats are ignored here.
import { sgrWrap, fractionStyle, STYLES } from '../theme.mjs';
import { flat, splitGraphTag, textLines } from '../doc.mjs';

export function makeTextFormatter({ color = false } = {}) {
  const P = (style, text) => (color ? sgrWrap(style, text) : text);
  const one = (s) => {
    if (typeof s === 'string') return s;
    switch (s.s) {
      case 'graph': { const { tag, rest } = splitGraphTag(s.text); return `'${tag ? P('graphTag', `<${tag}>`) : ''}${P('graphName', rest)}'`; }
      case 'frac': return P(fractionStyle(s.used, s.max), s.text);
      case 'marker': return s.text;
      default: { const q = STYLES[s.s]?.quote ?? ''; return q + P(s.s, s.text) + q; }
    }
  };
  const inline = (spans) => flat(spans).map(one).join('');
  return {
    name: color ? 'color' : 'text',
    inline,
    render(blocks) {
      const lines = textLines(blocks).map(inline);
      return lines.length ? lines.join('\n') + '\n' : '';
    },
  };
}
