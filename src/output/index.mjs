// Output formats:
//   text      plain lines, one greppable fact per line
//   color     the same lines with ANSI colors
//   md        the same lines as Markdown (theme emphasis instead of colors, plus headings and separators)
//   htm       the same lines as a standalone HTML page (<pre> blocks, CSS classes instead of colors)
//   markdown  a real document: headings, tables, facts lists
//   html      the same document as a standalone dark-theme HTML page
//   auto      (default) by the extension of --output (.md .markdown .htm .html), else color on a terminal, else text
import { extname } from '../paths.mjs';
import { makeTextFormatter } from './text.mjs';
import { makeMarkdownFormatter } from './markdown.mjs';
import { makeHtmlFormatter } from './html.mjs';
import { makeMdFormatter, makeHtmFormatter } from './simple.mjs';

/** UTF-8 byte order mark: written at the start of every md/markdown output. */
export const BOM = '\uFEFF';
export const hasBom = (text) => text.charCodeAt(0) === 0xFEFF;

export const FORMAT_NAMES = ['auto', 'text', 'color', 'md', 'htm', 'markdown', 'html'];
const EXTENSIONS = { '.md': 'md', '.markdown': 'markdown', '.htm': 'htm', '.html': 'html' };

/**
 * Decide the output format. Explicit `format` wins. 'auto' (the default) looks at the extension of the output file
 * (.md, .markdown, .htm, .html); without a file it is color when writing to a terminal (unless NO_COLOR is set) and
 * text otherwise. A file never gets color from auto.
 */
export function resolveFormat({ format = 'auto', output = null, toTerminal = false, env = {} }) {
  const f = String(format).toLowerCase();
  if (!FORMAT_NAMES.includes(f)) throw new Error(`unknown output format "${format}" (use one of: ${FORMAT_NAMES.join(', ')})`);
  if (f !== 'auto') return f;
  if (output) return EXTENSIONS[extname(output).toLowerCase()] ?? 'text';
  return toTerminal && !env.NO_COLOR ? 'color' : 'text';
}

export function makeFormatter(fmt) {
  switch (fmt) {
    case 'text': return makeTextFormatter({ color: false });
    case 'color': return makeTextFormatter({ color: true });
    case 'md': return makeMdFormatter();
    case 'htm': return makeHtmFormatter();
    case 'markdown': return makeMarkdownFormatter();
    case 'html': return makeHtmlFormatter();
    default: throw new Error(`no formatter for ${fmt}`);
  }
}

/** True for the two document formats that use block structure (tables) instead of the text lines. */
export const isDocumentFormat = (fmt) => fmt === 'markdown' || fmt === 'html';
