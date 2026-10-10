// HTML formatter: a standalone dark-theme page. All CSS is static and sits in one <style> at the top; identifier
// colors are generated from the `ansi` entries of src/theme.mjs (same palette as the console) and applied through one class per style:
//   .graphName/.graphTag, .key, .pinName, .string, .count, ... (every name in STYLES).
import { flat, splitGraphTag, plain } from '../doc.mjs';
import { STYLES, styleCss, fractionStyle, BROWSER_BLACK } from '../theme.mjs';

export const htmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const sp = (cls, text) => (text === '' ? '' : `<span class="${cls}">${htmlEsc(text)}</span>`);

export function css() {
  const themed = Object.keys(STYLES).map((name) => [name, styleCss(name)]).filter(([, d]) => d).map(([name, d]) => `.${name}{${d}}`).join('\n');
  return `
:root{color-scheme:dark;--bg:${BROWSER_BLACK};--panel:#161616;--line:#2e2e2e;--fg:#CCCCCC;--muted:#767676;--accent:#61D6D6}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1500px;margin:0 auto;padding:1.5rem 1.25rem 4rem}
h1,h2,h3,h4{line-height:1.25;color:#F2F2F2}
h1{font-size:1.7rem;margin:.2rem 0 1rem;border-bottom:1px solid var(--line);padding-bottom:.4rem;word-break:break-all}
h2{font-size:1.25rem;margin:1.6rem 0 .6rem}
h3{font-size:1.05rem;margin:1.2rem 0 .5rem}
hr{border:0;border-top:1px solid var(--line);margin:1.8rem 0}
code,pre,table,.lines{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;font-size:.88em}
.guid{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.88em}
code{background:#1c1c1c;border-radius:3px;padding:.05em .3em}
pre{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:.8rem 1rem;overflow:auto}
.tablewrap{margin:.5rem 0 1rem}
table{border-collapse:collapse;min-width:50%}
th,td{border:1px solid var(--line);padding:.3rem .6rem;text-align:left;vertical-align:top}
th{background:var(--panel);color:#F2F2F2;white-space:nowrap;position:sticky;top:-2px}
tbody tr:nth-child(even){background:#111}
tbody tr:hover{background:#1c1c1c}
td.right,th.right{text-align:right}td.center,th.center{text-align:center}
.lines>div{white-space:pre-wrap;word-break:break-word}
.facts{display:grid;grid-template-columns:max-content 1fr;gap:.15rem 1rem;margin:.4rem 0 1rem}.facts dt{color:var(--muted)}.facts dd{margin:0}
.note{border-left:3px solid var(--accent);background:var(--panel);padding:.5rem .9rem;margin:.6rem 0}.note.warn{border-color:#E74856}
.toc{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:.6rem 1rem;margin:0 0 1.2rem;columns:3 20rem}
.toc a{color:var(--accent);text-decoration:none;display:block;padding:.05rem 0;break-inside:avoid}.toc a:hover{text-decoration:underline}
ul{padding-left:1.4rem}
.q{color:var(--muted)}.muted{color:var(--muted)}
pre.lines{background:none;border:0;padding:0;margin:.3rem 0 .8rem;white-space:pre-wrap;word-break:break-word}
${themed}
`.trim();
}

/** Inline renderer shared by the "html" and "htm" formats: `<span class="STYLE">` for every styled piece. */
export function htmlInline(spans) {
  const one = (s) => {
    if (typeof s === 'string') return htmlEsc(s);
    switch (s.s) {
      case 'graph': { const { tag, rest } = splitGraphTag(s.text); return `'${tag ? sp('graphTag', `<${tag}>`) : ''}${sp('graphName', rest)}'`; }
      case 'frac': return sp(fractionStyle(s.used, s.max), s.text);
      case 'marker': return '';
      default: { const q = STYLES[s.s]?.quote ?? ''; return q + sp(s.s, s.text) + q; }
    }
  };
  return flat(spans).map(one).join('');
}

/** The standalone page around already-rendered body html (all CSS static, in one <style> at the top). */
export function htmlPage(body, title) {
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${htmlEsc(title)}</title>\n<style>\n${css()}\n</style>\n</head>\n<body>\n<main>\n${body}\n</main>\n</body>\n</html>\n`;
}

export function makeHtmlFormatter() {
  const inline = htmlInline;
  const cell = (c) => (c && !Array.isArray(c) && c.lines ? c.lines.map(inline).join('<br>') : inline(c));
  const slugs = new Map();
  const slug = (spans) => {
    const base = plain(spans).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section';
    const n = (slugs.get(base) || 0) + 1; slugs.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
  return {
    name: 'html',
    inline,
    render(blocks, { title = 'miliastra-search' } = {}) {
      slugs.clear();
      const toc = [];
      const body = [];
      for (const b of blocks) {
        switch (b.t) {
          case 'title': body.push(`<h1>${inline(b.spans)}</h1>`); break;
          case 'heading': {
            const id = b.level <= 2 ? slug(b.spans) : null;
            if (b.level === 2) toc.push({ id, spans: b.spans });
            body.push(`<h${b.level}${id ? ` id="${id}"` : ''}>${inline(b.spans)}</h${b.level}>`); break;
          }
          case 'para': body.push(`<p>${inline(b.spans)}</p>`); break;
          case 'note': body.push(`<div class="note${b.level === 'warn' ? ' warn' : ''}">${inline(b.spans)}</div>`); break;
          case 'list': body.push(`<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`); break;
          case 'facts': body.push(`<dl class="facts">${b.items.map(([k, v]) => `<dt>${htmlEsc(k)}</dt><dd>${inline(v)}</dd>`).join('')}</dl>`); break;
          case 'lines': body.push(`<div class="lines">${b.lines.map((l) => `<div>${inline(l)}</div>`).join('')}</div>`); break;
          case 'pre': body.push(`<pre>${htmlEsc(b.lines.join('\n'))}</pre>`); break;
          case 'hr': body.push('<hr>'); break;
          case 'table': {
            const al = (c) => (c.align ? ` class="${c.align}"` : '');
            body.push(`<div class="tablewrap"><table><thead><tr>${b.cols.map((c) => `<th${al(c)}>${cell(c.title)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${b.cols.map((c, i) => `<td${al(c)}>${cell(r[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
            break;
          }
          default: break;
        }
      }
      // Table of contents after the H1 when there are enough sections to need one.
      if (toc.length >= 3) {
        const nav = `<nav class="toc">${toc.map((t) => `<a href="#${t.id}">${inline(t.spans)}</a>`).join('')}</nav>`;
        const at = body.findIndex((x) => !x.startsWith('<h1'));
        body.splice(at < 0 ? body.length : at, 0, nav);
      }
      return htmlPage(body.join('\n'), title);
    },
  };
}
