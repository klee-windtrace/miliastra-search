// The code report as a document (see doc.mjs). Input: the `code` list of a code report (JSON.md), one item per file.
// This is the wire-by-line style: every node, every pin and every wire is a line of its own, and each line names its graph and node, so it
// can be found with a search. The document formats group the same facts into tables.
// Rendering options: `allPins` shows the pins that have neither a value nor a wire.
import { S, graph, graphLabelOf, plain, textLines, sep } from './doc.mjs';
import { f32, qi, qs, valueSpans } from './values.mjs';
import { printFileDocs } from './files.mjs';
import { openingBlocks, unresolvedBlocks } from './notes.mjs';
import { printPseudocode, graphKeyOf } from './pseudocode.mjs';

const kw = (t) => S('keyword', t);
const arrow = (a) => S('arrow', a);
// " key=value" (value: text, number or spans)
const field = (k, v) => [sep(), S('metaKey', k), '=', typeof v === 'object' ? v : S('metaValue', v)];
const roleDep = (x) => (x.dependency ? field('role', 'dependency') : '');

// How the kinds of pins are written; a kind that is not listed is written as it is in the report.
const PIN_LABEL = { in_flow: 'in.flow', out_flow: 'out.flow', in_param: 'in', out_param: 'out', meta_rpc: 'meta.rpc', meta_topic: 'meta.topic' };
const pinLabel = (kind) => PIN_LABEL[kind] ?? kind;
const pinL = (kind, index) => S('pinLabel', `${pinLabel(kind)}#${index}`);
const structName = (s) => s.name ?? s.id; // a struct the file does not define is known by its id

const idText = (n) => (n.shell_id == null ? '' : n.kernel_id !== n.shell_id ? `${n.shell_id}/${n.kernel_id}` : `${n.shell_id}`);
const nodeHead = (n) => [S('nodeIndex', `[${n.index}]`), sep(), S('nodeName', n.name), sep(), S('nodeId', `(${idText(n)})`)];
/** A node as another node's wire or a port mapping names it (`name` is null when the graph has no such node). */
const nodeShort = (n) => (n.name == null ? S('flag', `[${n.index}] <missing node>`) : nodeHead(n));

// one section: an H2 with its facts (md/html) whose text form is the "KIND ..." line
function section(blocks, word, spans, textSpans, facts) {
  blocks.push({ t: 'heading', level: 2, plain: true, spans: [word, ' ', spans], text: [[S('heading', word.toUpperCase()), sep(), ...textSpans]] });
  if (facts) blocks.push({ t: 'facts', items: facts, text: null });
}

function graphBlocks(blocks, x, { allPins }) {
  const gl = graph(graphLabelOf(x.name));
  const gfacts = [['type', S('className', x.class_name)], ['guid', S('guid', x.guid)], ...(x.decl_guid != null ? [['declaration guid', S('guid', x.decl_guid)]] : []), ...(x.dependency ? [['role', 'dependency']] : []), ...(x.description ? [['description', qs(x.description)]] : [])];
  // the title only identifies the graph (the overview of the graphs is the `dump` mode)
  const title = [gl, sep(), S('className', x.class_name), sep(), '(guid ', S('metaValue', x.guid), x.decl_guid != null ? [', decl ', S('metaValue', x.decl_guid)] : '', ')', roleDep(x), x.description ? field('description', qs(x.description)) : ''];
  section(blocks, 'Graph', gl, title, gfacts);
  // node lines are "<graph>/<node head> <body>"
  const gline = (body) => [gl, '/', body];

  if (x.variables.length) {
    const rows = [], text = [];
    for (const v of x.variables) {
      const val = valueSpans(v.value);
      text.push(gline([kw('VAR'), sep(), S('varName', v.name), ' :', sep(), S('typeName', v.type), field('public', String(v.public)), v.struct ? field('struct', S('structName', structName(v.struct))) : '', val !== null ? [' ', arrow('='), sep(), val] : '']));
      rows.push([S('varName', v.name), S('typeName', v.type), String(v.public), v.struct ? S('structName', structName(v.struct)) : '', val !== null ? val : '']);
    }
    blocks.push({ t: 'heading', level: 3, spans: 'Variables', text: null });
    blocks.push({ t: 'table', cols: [{ title: 'Name' }, { title: 'Type' }, { title: 'Public' }, { title: 'Struct' }, { title: 'Value' }], rows, text });
  }
  if (x.comments.length) {
    const items = x.comments.map((c) => [qs(c.text), c.x != null ? [sep(), S('coord', `@(${f32(c.x)},${f32(c.y)})`)] : '']);
    blocks.push({ t: 'heading', level: 3, spans: 'Comments', text: null });
    blocks.push({ t: 'list', items, text: items.map((it) => gline([kw('COMMENT'), sep(), ...it])) });
  }
  if (x.port_mappings.length) {
    const rows = [], text = [];
    for (const pm of x.port_mappings) {
      const { external: e, internal: i } = pm;
      const ext = S('pinLabel', `ext.${pinLabel(e.kind)}#${e.index}`), int = pinL(i.pin.kind, i.pin.index);
      text.push(gline([kw('PORTMAP'), sep(), ext, e.name ? [sep(), S('pinName', e.name)] : '', ' ', arrow('->'), sep(), nodeShort(i.node), sep(), int, i.pin.name ? [sep(), S('pinName', i.pin.name)] : '']));
      rows.push([ext, e.name ? S('pinName', e.name) : '', nodeShort(i.node), int, i.pin.name ? S('pinName', i.pin.name) : '']);
    }
    blocks.push({ t: 'heading', level: 3, spans: 'Port mappings', text: null });
    // `nodes`: the node each line is about (searchNodes)
    blocks.push({ t: 'table', cols: [{ title: 'External pin' }, { title: 'Name' }, { title: 'Internal node' }, { title: 'Internal pin' }, { title: 'Name' }], rows, text, nodes: x.port_mappings.map((pm) => pm.internal.node.index) });
  }
  const misc = [...x.affiliations.map((a) => [kw('AFFIL'), field('struct', a.struct_id ?? '-'), field('source_guid', a.source_guid ?? '-')]), ...x.anomalies.map((a) => [kw('ANOMALY'), sep(), a])];
  if (misc.length) blocks.push({ t: 'list', items: misc, text: misc.map((m) => gline(m)) });

  if (x.nodes.length) blocks.push({ t: 'heading', level: 3, spans: 'Nodes', text: null });
  for (const n of x.nodes) {
    const nhead = nodeHead(n);
    const nrest = [];
    if (n.variant) nrest.push(field('variant', n.variant));
    if (n.user) nrest.push(field('user', n.user));
    if (n.signal != null) nrest.push(field('signal', S('signalName', qi(n.signal))));
    if (n.struct) nrest.push(field('struct', qs(n.struct)));
    nrest.push([sep(), S('coord', `@(${f32(n.x)},${f32(n.y)})`)]);
    if (n.signal_version != null) nrest.push(field('sigver', n.signal_version));
    if (n.status_ext) nrest.push(field('status_ext', `${n.status_ext.type}${n.status_ext.inner != null ? '/' + n.status_ext.inner : ''}`));
    const nline = (body) => [gl, '/', nhead, sep(), body];
    const headText = [[gl, '/', nhead, nrest]];
    if (n.comment != null) headText.push(nline([kw('COMMENT'), sep(), qs(n.comment)]));
    blocks.push({ t: 'para', cls: 'node', spans: [nhead, nrest, n.comment != null ? [' – ', kw('COMMENT'), ' ', qs(n.comment)] : ''], text: headText, node: n.index });

    const rows = [], text = [];
    for (const p of n.pins) {
      if (p.hidden) continue;
      const nameS = p.name ? [sep(), S('pinName', p.name)] : '';
      const tlS = p.type ? S('typeName', p.type) : '';
      const val = valueSpans(p.value);
      const pinCell = pinL(p.kind, p.index), nameCell = p.name ? S('pinName', p.name) : '';
      const put = (body, op, target, type, notes) => { text.push(nline([pinCell, nameS, body])); rows.push([pinCell, nameCell, op, target, type || '', notes || '']); };
      let any = false;
      const tgt = (c, withName) => [nodeShort(c.node), sep(), pinL(c.pin.kind, c.pin.index), withName && c.pin.name ? [sep(), S('pinName', c.pin.name)] : ''];
      // A wire is stored on one end only: on the output pin of a flow, on the input pin of a data connection
      if (p.kind === 'out_flow') for (const c of p.wires) { put([' ', arrow('->'), sep(), tgt(c, true)], arrow('->'), tgt(c, true)); any = true; }
      else if (p.kind === 'in_param') for (const c of p.wires) { put([' ', arrow('<-'), sep(), tgt(c, true), p.type ? [' :', sep(), tlS] : ''], arrow('<-'), tgt(c, true), tlS); any = true; }
      else for (const c of p.wires) { put([' ', arrow('~>'), sep(), tgt(c, false)], arrow('~>'), tgt(c, false)); any = true; }
      if (val !== null) {
        const wired = p.wires.length > 0;
        // what a literal id points at in the file's resources, as in `refs`
        const res = p.resource ? ['{', S('className', p.resource.class_name), ':', S('key', p.resource.name), '}'] : '';
        put([' ', arrow('='), sep(), val, p.type ? [' :', sep(), tlS] : '', res ? [sep(), res] : '', p.default ? [sep(), S('flag', '(default)')] : '', wired ? [sep(), S('flag', '(also wired)')] : ''], arrow('='), [val, res ? [' ', res] : ''], tlS, [p.default ? 'default' : '', wired ? 'also wired' : ''].filter(Boolean).join(', '));
        any = true;
      }
      if (p.binding && allPins) { const b = [pinL(p.binding.kind, p.binding.index), p.binding.source_ref != null ? field('ref', p.binding.source_ref) : '']; put([sep(), kw('bound_to'), sep(), b], kw('bound to'), b); any = true; }
      if (!any && allPins) put([p.type ? [' :', sep(), tlS, sep()] : sep(), S('flag', '(no value, no wire)')], '', S('flag', '(no value, no wire)'), tlS);
    }
    if (rows.length) blocks.push({ t: 'table', cols: [{ title: 'Pin' }, { title: 'Name' }, { title: 'Dir' }, { title: 'Target / value' }, { title: 'Type' }, { title: 'Notes' }], rows, text, node: n.index });
  }
}

function declarationBlocks(blocks, x) {
  // a signal's category (send / listen) is already said by its class name and its SEND_SIGNAL / LISTEN_SIGNAL line
  const showCategory = !(x.send_signal || x.listen_signal);
  section(blocks, 'Decl', S('declName', x.name),
    [S('declName', x.name), sep(), S('className', x.class_name), field('guid', S('guid', x.guid)), showCategory ? field('category', x.category) : '', x.description ? field('description', qs(x.description)) : '', roleDep(x)],
    [['type', S('className', x.class_name)], ['guid', S('guid', x.guid)], ...(showCategory ? [['category', S('metaValue', x.category)]] : []), ...(x.description ? [['description', qs(x.description)]] : []), ...(x.dependency ? [['role', 'dependency']] : [])]);
  const dline = (body) => [kw('DECL'), '/', S('varName', x.name), sep(), body];
  const info = [];
  for (const [word, s] of [['SEND_SIGNAL', x.send_signal], ['LISTEN_SIGNAL', x.listen_signal]]) {
    if (s) info.push([kw(word), field('name', S('signalName', qi(s.name))), field('server_node', s.server_node ?? '-'), field('client_node', s.client_node ?? '-')]);
  }
  for (const [word, s] of [['ASSEMBLE_STRUCT', x.assemble_struct], ['SPLIT_STRUCT', x.split_struct], ['MODIFY_STRUCT', x.modify_struct]]) {
    if (s) info.push([kw(word), field('struct', qs(s.name ?? `<struct#${s.id}>`)), sep(), `(${s.id})`]);
  }
  if (info.length) blocks.push({ t: 'list', items: info, text: info.map(dline) });
  const rows = [], text = [];
  for (const p of x.pins) {
    const extra = [p.enum_family != null ? field('enum_family', p.enum_family) : '', p.struct ? field('struct', S('structName', structName(p.struct))) : '', p.uid != null ? field('uid', p.uid) : ''];
    const pl = S('pinLabel', `${pinLabel(p.group)}#${p.index}`);
    text.push(dline([pl, p.name ? [sep(), S('pinName', p.name)] : '', p.type ? [' :', sep(), S('typeName', p.type)] : '', extra]));
    rows.push([pl, p.name ? S('pinName', p.name) : '', p.type ? S('typeName', p.type) : '', extra]);
  }
  if (rows.length) blocks.push({ t: 'table', cols: [{ title: 'Pin' }, { title: 'Name' }, { title: 'Type' }, { title: 'Details' }], rows, text });
}

function structBlocks(blocks, x) {
  section(blocks, 'Struct', S('declName', x.name), [S('declName', x.name), field('guid', S('guid', x.guid)), field('id', x.id), field('version', x.version), roleDep(x)],
    [['guid', S('guid', x.guid)], ['id', S('metaValue', x.id)], ['version', S('metaValue', x.version)], ...(x.dependency ? [['role', 'dependency']] : [])]);
  if (!x.fields.length) return;
  const rows = [], text = [];
  for (const v of x.fields) {
    const st = v.struct ? structName(v.struct) : null;
    text.push([kw('STRUCT'), '/', S('varName', x.name), sep(), kw(`FIELD#${v.index}`), sep(), S('declName', v.name), ' :', sep(), S('typeName', v.type), st != null ? field('struct', S('structName', st)) : '']);
    rows.push([String(v.index), S('declName', v.name), S('typeName', v.type), st != null ? S('structName', st) : '']);
  }
  blocks.push({ t: 'table', cols: [{ title: '#', align: 'right' }, { title: 'Field' }, { title: 'Type' }, { title: 'Struct' }], rows, text });
}

const SECTIONS = { graph: graphBlocks, declaration: declarationBlocks, struct: structBlocks };

/** The code document of one file (title and warnings first, the node types without a name last). */
export function codeBlocks(code, { allPins = false, fileLine = false } = {}) {
  const blocks = openingBlocks(code, { fileLine });
  for (const item of code.items) SECTIONS[item.type](blocks, item, { allPins });
  blocks.push(...unresolvedBlocks(code.unresolved_nodes));
  return blocks;
}

/** The code report as documents, one per file: [{ file, blocks }]. `allPins` = the rendering option of that name. */
export function codeDocs(report, { allPins = false } = {}) {
  const fileLine = report.header.files.length > 1;
  return report.code.map((c) => ({ file: c.file, blocks: codeBlocks(c, { allPins, fileLine }) }));
}

/** The lines of the listing of one graph, by the node they are about: its own lines, and the port mappings that end at it (the graph's own lines are about no node). */
function linesByNode(x, allPins) {
  const blocks = [], byNode = new Map();
  graphBlocks(blocks, x, { allPins });
  const add = (node, lines) => byNode.set(node, [...(byNode.get(node) ?? []), ...lines.map(plain)]);
  for (const b of blocks) {
    if (b.node != null) add(b.node, textLines([b]));
    else if (b.nodes) b.text.forEach((line, i) => add(b.nodes[i], [line]));
  }
  return byNode;
}

/**
 * What --search / --match find in the pseudocode: the nodes of every graph, per file ({ graph key -> Set of node indexes }, as many maps as files). The test
 * is made on the lines of the listing (the same lines `code` without `--pseudocode` prints, a node's own pin and wire lines), never on the pseudocode. A line that
 * matches finds the node it is about. When that node has no flow pins (it is not an execution node of the graph) its result is used by other nodes, so they are
 * found as well, and so on up to the execution nodes that run them: a case writes the data nodes it needs, so an execution node has to be there for the
 * search to show what it found. A graph without any found node has no entry.
 */
export function searchedNodes(report, isMatch, { allPins = false } = {}) {
  return report.code.map((code) => {
    const out = new Map();
    for (const x of code.items) {
      if (x.type !== 'graph') continue;
      const hit = new Set();
      for (const [node, lines] of linesByNode(x, allPins)) if (lines.some(isMatch)) hit.add(node);
      // the nodes that run: the cases of this graph, and every node that has a flow pin of its own (a composite call that is expanded is no case)
      const runs = new Set(x.nodes.filter((n) => n.pins.some((p) => p.kind === 'in_flow' || p.kind === 'out_flow')).map((n) => n.index));
      for (const c of x.pseudocode.cases) if (graphKeyOf(c.call.graph) === graphKeyOf(x)) runs.add(c.node.index);
      const readers = new Map(); // node -> the nodes that read one of its outputs
      for (const n of x.nodes) for (const p of n.pins) if (p.kind === 'in_param') for (const w of p.wires) readers.set(w.node.index, [...(readers.get(w.node.index) ?? []), n.index]);
      const queue = [...hit].filter((i) => !runs.has(i));
      while (queue.length) {
        for (const reader of readers.get(queue.pop()) ?? []) {
          if (hit.has(reader)) continue;
          hit.add(reader);
          if (!runs.has(reader)) queue.push(reader);
        }
      }
      if (hit.size) out.set(graphKeyOf(x), hit);
    }
    return out;
  });
}

/**
 * Print the code report: the whole document, or only the lines matching --search / --match. With `pseudocode` the document is one function per graph
 * (pseudocode.mjs); --search / --match then choose the nodes (`searchedNodes`): only the cases of the nodes they found are written, in the graphs that have any.
 */
export function printCode(report, printer, { noFilePrefix = false, allPins = false, pseudocode = false, optimize = false, lazy = false } = {}) {
  if (pseudocode) return printPseudocode(report, printer, { allPins, optimize, lazy, found: printer.grepping ? searchedNodes(report, printer.isMatch, { allPins }) : null });
  return printFileDocs(codeDocs(report, { allPins }), printer, { multi: report.header.files.length > 1, noFilePrefix, title: `code ${report.header.files.join(', ')}` });
}
