// THE place to restyle the output. One entry per *kind of thing* the tool prints; every output format looks its
// style up here, and nothing anywhere decides colors by pattern-matching text (the builders in render.mjs /
// refs.mjs / report-refs.mjs say what each piece is; see src/doc.mjs).
//
//   ansi   console style (formats "color"): a list of names from ANSI below; [] = leave uncolored
//   md     Markdown look (formats "markdown" and "md"): bold | italic | bolditalic | underline | code | none
//   quote  characters printed around the text in EVERY format, because they are part of the greppable text
//          format (graph names in 'single quotes', keys/pin names in "double quotes", ...)
//   css    optional extra CSS declarations for the html formats (colors are generated from `ansi`)
//
// HTML (formats "html" and "htm") gets `<span class="NAME">` for every style below plus the CSS derived from
// `ansi`, so recoloring the console recolors the pages too. `graph` is composed of graphTag + graphName.
export const STYLES = {
  // ---- document structure ----
  title:      { ansi: ['bold', 'brightWhite'], md: 'bold' },
  section:    { ansi: ['brightCyan'],          md: 'bold' },      // "# findings", "# limits", "top graphs by node count:"
  heading:    { ansi: ['bold', 'cyan'],        md: 'bold' },      // the GRAPH / DECL / STRUCT / RESOURCE keyword of a ### header
  fileName:   { ansi: ['cyan'],                md: 'code' },
  metaKey:    { ansi: ['gray'],                md: 'none' },      // field names in `class=9 guid='..'` and `engine_version=..`
  metaValue:  { ansi: [],                      md: 'none' },      // their values
  className:  { ansi: ['blue'],                md: 'none' },      // ENTITY_NODE_GRAPH, SIGNAL_NODE_DECL, ...
  warn:       { ansi: ['brightRed'],           md: 'bold' },      // WARN finding level / warnings
  info:       { ansi: ['brightBlue'],          md: 'italic' },    // INFO finding level
  findingType:{ ansi: ['gray'],                md: 'none' },      // "used-but-undeclared", ...
  limitOk:    { ansi: ['brightGreen'],         md: 'none' },      // used/max fraction under 80% of its cap
  limitNear:  { ansi: ['brightYellow'],        md: 'bold' },      // at or above 80%
  limitOver:  { ansi: ['brightRed'],           md: 'bolditalic' },// at or above the cap
  // ---- names ----
  graphName:  { ansi: ['yellow'],              md: 'italic' },    // inside 'single quotes'
  graphTag:   { ansi: ['brightYellow'],        md: 'underline' }, // the <composite>/<status>/<skill>/<filter>/<creation> prefix of a graph name
  key:        { ansi: ['brightGreen'],         md: 'bold',   quote: '"' },  // refs item keys: variables, signals, composites, structs, ...
  folderName: { ansi: ['red'],                 md: 'none',   quote: '/' },  // /Folder name/ before the name of a resource or graph ("(default)" for the default tab)
  declName:   { ansi: ['brightGreen'],         md: 'bold',   quote: '"' },  // names in ### DECL / STRUCT / RESOURCE headers, FIELD names, port names
  varName:    { ansi: ['brightGreen'],         md: 'bold' },      // variable name in `VAR name : Type`
  pinName:    { ansi: ['green'],               md: 'none',   quote: '"' },  // "Target Entity"
  pinLabel:   { ansi: ['cyan'],                md: 'code' },      // in#0, out.flow#1, ext.in#2, meta.rpc#0
  guid:       { ansi: ['yellow'],              md: 'code',   quote: "'" },  // guid='123'
  signalName: { ansi: ['yellow'],              md: 'code',   quote: "'" },  // signal='Signal_1' (send/listen signal nodes)
  structName: { ansi: ['brightGreen'],         md: 'none' },      // struct=Name
  // ---- nodes and pins (dump) ----
  keyword:    { ansi: ['brightMagenta'],             md: 'none' },      // VAR, COMMENT, PORTMAP, SEND_SIGNAL, FIELD, AFFIL, ...
  nodeIndex:  { ansi: ['gray'],                md: 'none' },      // [3]
  nodeName:   { ansi: ['bold'],                md: 'bold' },
  nodeId:     { ansi: ['gray'],                md: 'none' },      // (14/16)
  coord:      { ansi: ['gray'],                md: 'none' },      // @(x,y)
  arrow:      { ansi: ['brightMagenta'],             md: 'none' },      // ->  <-  ~>  =
  typeName:   { ansi: ['brightMagenta'],       md: 'italic' },    // Int, Str, L<Str>, ...
  flag:       { ansi: ['gray'],                md: 'italic' },    // (default) (also wired) (no value, no wire)
  // ---- values (dump) ----
  string:     { ansi: ['yellow'],              md: 'code',   quote: "'" },  // 'Created'
  number:     { ansi: ['cyan'],                md: 'none' },      // 5, 2.5
  bool:       { ansi: ['cyan'],                md: 'none' },      // Yes / No
  enumValue:  { ansi: ['brightCyan'],          md: 'none' },      // enum:5«Name»
  idValue:    { ansi: ['green'],               md: 'none' },      // id:123
  vector:     { ansi: ['cyan'],                md: 'none' },      // (1, 2, 3)
  // ---- references (refs) ----
  kind:       { ansi: ['magenta'],                md: 'code' },      // graph_variable, custom_variable, signal, ...
  role:       { ansi: ['brightBlue'],          md: 'none' },      // get, set, listen, send, call, ...
  count:      { ansi: ['brightWhite'],         md: 'bold' },      // the 2 in "2 get"
  mode:       { ansi: ['gray'],                md: 'italic' },    // literal, dynamic, declaration, ...
};

// Console color names (SGR codes). Combine several in one `ansi` list, e.g. ['bold', 'cyan'].
export const ANSI = {
  bold: 1, dim: 2, underline: 4,
  red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, gray: 90,
  brightRed: 91, brightGreen: 92, brightYellow: 93, brightBlue: 94, brightMagenta: 95, brightCyan: 96, brightWhite: 97,
};

export const style = (name) => STYLES[name] ?? {};

/** Wrap text in the console style of `name` (no-op for an uncolored style or empty text). */
export function sgrWrap(name, text) {
  const codes = style(name).ansi ?? [];
  if (!codes.length || text === '' || text == null) return text;
  return `${codes.map((c) => `\x1b[${ANSI[c]}m`).join('')}${text}\x1b[0m`;
}

/** Style name for a used/max fraction: ok < 80% <= near < 100% <= over. */
export function fractionStyle(used, max) {
  const ratio = max > 0 ? used / max : 0;
  return ratio >= 1 ? 'limitOver' : ratio >= 0.8 ? 'limitNear' : 'limitOk';
}

// Console -> browser colors: the standard Windows console palette (Campbell), used only to generate the CSS of the html
// formats. Names are the ANSI ones above (white = ANSI 37 "light gray", gray = ANSI 90 "dark gray", brightWhite = ANSI 97);
// the pages use BLACK as their background (see output/html.mjs).
export const BROWSER_BLACK = '#0C0C0C';
const CSS_COLORS = {
  red: '#C50F1F', green: '#13A10E', yellow: '#C19C00', blue: '#0037DA', magenta: '#881798', cyan: '#3A96DD', white: '#CCCCCC', gray: '#767676',
  brightRed: '#E74856', brightGreen: '#16C60C', brightYellow: '#F9F1A5', brightBlue: '#3B78FF', brightMagenta: '#B4009E', brightCyan: '#61D6D6', brightWhite: '#F2F2F2',
};
/** CSS declarations equivalent to the console style of `name`, plus its own `css` extras. */
export function styleCss(name) {
  const s = style(name), decl = [];
  for (const c of s.ansi ?? []) {
    if (c === 'bold') decl.push('font-weight:700'); else if (c === 'dim') decl.push('opacity:.7'); else if (c === 'underline') decl.push('text-decoration:underline');
    else if (CSS_COLORS[c]) decl.push(`color:${CSS_COLORS[c]}`);
  }
  if (s.css) decl.push(s.css);
  return decl.join(';');
}
