// The pseudocode style of the code report: one JavaScript-looking function per graph, from the `pseudocode` key of each graph item (JSON.md).
// Everything is decided in the report (the cases, their data nodes, the names and numbers of the variables, where the flow goes); this file only
// writes it down. Input: the `code` list of a code report, one item per file.
// In the line formats (text, color, md, htm) the document is the code; in the document formats (markdown, html) it is a heading and a preformatted
// block per graph, without colors.
// Rendering options: `allPins` shows the outputs nothing reads (and an input whose value is unknown, as `undefined`), `optimize` writes a node's only output
// as a read of the call and a value that is read once where it is read (a typecast around the call), `lazy` writes the values a composite takes and hands out
// as lazy ones. Every input a node has is written: a value nobody edited (the game's default) is marked `(default)`.
// Values are plain: a data node is computed where its case needs it, a composite is given the values of its inputs (`In`) and hands out the values of its outputs.
// With `lazy` the values that cross a composite's boundary are lazy: a composite looks at a data pin only when one of its executed nodes reads it, and the caller
// computes an output only when it is read. That is `lazy(() => Node(...))` for a data node whose value goes into a composite (or into such a data node), and
// `unlz(value)` where a native node reads a lazy value; a case with no composite in it stays plain. The two helpers are written once, as a comment.
// A case that no event reaches starts with `throw 'unreachable';`, and so does a composite body that no reachable code makes use of.
// A composite body is a function of its own (`function`, not `async function`): without a node it returns the data pins it hands out, with one it runs
// from that node. How it leaves depends on its execution type (`flow` of the graph, JSON.md): a generic body is an async generator that yields the name of each
// flow output it leaves through, any number of times; a body that leaves once (single, choice) is an async function that returns `{ Next: "pin" }`, and nothing
// at all when it drops the flow. A caller is written after that type: a single composite is just called (`// .Next=="0"` says where the flow goes), one that
// chooses is an `if` / `switch` on `.Next` like Double Branch and Multiple Branches, and only a generic one is a `for await` over what it yields.
// Every call is an instance of the composite, which
// the caller names (`Comp`, `Comp_0012` in a graph: the id of the call node); what the instance keeps (the outputs of its execution nodes, `$$.Ety_001`, and its local variables)
// is filed under that name, so the callers that read an instance see what its own execution nodes gave out. `next` / `input` are variables of the function.
// An input the game hides (`is_bp_var` of the custom variable nodes) is written only when it holds more than its default, or with `allPins`.
// A flow that runs into an output nothing is wired to ends the case with `return Exit();`; `return;` is the end of a flow that has no output to leave through.
// With `--search` / `--match` (`found`, from `searchedNodes` of code.mjs) only the cases of the nodes the search found are written, and only the graphs that have one.
import { S, anchor, graph, graphLabelOf, join, plain, gap } from './doc.mjs';
import { f32, flt, qi, qd } from './values.mjs';
import { openingBlocks } from './notes.mjs';
import { PSEUDOCODE_INTRO } from './pseudocode-intro.mjs';

const kw = (t) => S('jsKeyword', t);
const sw = (t) => S('jsSwitch', t);
const err = (t) => S('jsError', t);
const comment = (t) => S('jsComment', `// ${t}`);
const str = (t) => S('jsString', qd(t));
const num = (x) => S('number', x);
const cast = (type) => S('typeName', type);
const ind = (level) => gap(2 * level, level); // two spaces per level, one tab per level with the option `tab`
/** The id a case has for the node of that index (`node_0012`). */
const nodeIdOf = (index) => `node_${String(index).padStart(4, '0')}`;
/** A node's comment as the rest of a `//` line. */
const oneLine = (t) => String(t).replace(/\r?\n/g, '\\n');

// ---- values ---------------------------------------------------------------------------------------------------------------------------------------
/** The arguments of an `Enum(...)`: the family and the value by their titles (the runtime maps them to the number), else the number and the title. */
const enumArgs = (num_, e) => {
  if (e?.family != null) return [str(e.family), ', ', e.name != null ? str(e.name) : num(num_)];
  return e?.name != null ? [num(num_), ', ', str(e.name)] : [num(num_)];
};
/** A value without the cast of its type (what stands inside a list or a cast). */
function bare(v) {
  if (!v) return 'undefined';
  switch (v.kind) {
    case 'int': case 'id': return num(v.value);
    case 'float': return num(flt(v.value));
    case 'bool': return num(v.value ? 'true' : 'false');
    case 'str': return str(v.value);
    case 'vec': return [cast('Vec'), '(', join(v.value.map((x) => num(f32(x))), ', '), ')'];
    case 'enum': return [cast('Enum'), '(', enumArgs(v.value, { family: null, name: v.names.join(' | ') || null }), ')'];
    case 'list': return ['[', join(v.items.map(bare), ', '), ']'];
    case 'struct': return [cast('Struct'), '([', join(v.items.map(bare), ', '), '])'];
    case 'pair': return ['[', bare(v.key), ', ', bare(v.value), ']'];
    case 'map': return ['[', join(v.pairs.map(bare), ', '), ']'];
    default: return 'undefined';
  }
}
const DEFAULT_CAST = { int: 'Int', float: 'Flt', bool: 'Bol', id: 'Id', list: 'List', struct: 'Struct', map: 'Dict' };
/** A literal of the report as `Type(value)`; a string is just a quoted string, a vector is its own cast, an enum names itself. */
function literal({ type, dict, value: v, enum: e }) {
  if (v.kind === 'enum') return [cast('Enum'), '(', enumArgs(v.value, e), ')'];
  if (v.kind === 'str' || v.kind === 'vec') return bare(v);
  // the only value an entity constant can have is no entity
  if (v.kind === 'id' && type === 'Ety' && v.value === 0) return [cast('Ety'), '(', num('null'), ')'];
  const inner = v.kind === 'struct' ? ['[', join(v.items.map(bare), ', '), ']'] : bare(v);
  return [castOpen(type ?? DEFAULT_CAST[v.kind] ?? 'Any', dict), inner, ')'];
}
/** `Type(` of a typecast; a dictionary says what it maps: `Dict(Ety,Int,`. */
const castOpen = (type, dict) => [cast(type), '(', dict ? [cast(dict.key), ',', cast(dict.value), ','] : ''];
/** A datatype as a declaration: `Ety`, `Dict(Ety,Int)`. */
const typeDecl = (type, dict) => (dict ? [cast(type), '(', cast(dict.key), ',', cast(dict.value), ')'] : cast(type));

// ---- anchors (the html formats: a variable's use links to where it is declared, a jump to its case) ----------------------------------------------
const san = (t) => String(t).replace(/[^A-Za-z0-9_]/g, '_');
/** The ids of one graph's anchors; `pfx` is unique in the document (file and graph position). */
const anchors = (pfx) => ({
  pfx,
  caseId: (id) => `${pfx}-c-${san(id)}`,
  localId: (caseId, name) => `${pfx}-l-${san(caseId)}-${name}`,
  globalId: (name) => `${pfx}-g-${name}`,
});

// ---- statements -----------------------------------------------------------------------------------------------------------------------------------
// A piece of code that may take several lines is a list of lines (spans): the first one is written after whatever the caller has in front of it (`key: `,
// `const x = `), the others carry their own indentation.
/** `pre` in front of the first line and `post` after the last one. */
function wrap(lines, pre, post) {
  const out = [...lines];
  out[0] = [pre, out[0]];
  out[out.length - 1] = [out[out.length - 1], post];
  return out;
}
/** Lines written at `level`: `pre` and `post` around a piece of code; its first line gets the indentation. */
const place = (level, pre, lines, post) => {
  const out = wrap(lines, pre, post);
  out[0] = [ind(level), out[0]];
  return out;
};
/** What the expressions of one case can look up: the call that declares each intermediate. */
const definitions = (c) => new Map(c.data.flatMap((call) => call.outputs.filter((o) => o.name != null).map((o) => [o.name, { call, out: o }])));
/**
 * With `lazy`: the data nodes of a scope whose results are lazy values: the ones a composite call takes as inputs (or that stand for a composite's output), and the
 * data nodes those are computed from. What a composite hands out is lazy as it is. `seeds`: the expressions that leave the scope lazily.
 */
function lazyCallsOf(calls, seeds, defs, opts) {
  const set = new Set();
  if (!opts.lazy) return set;
  const queue = [];
  const take = (e) => {
    const d = e?.kind === 'var' ? defs.get(e.name) : null;
    if (d && !d.call.composite && !set.has(d.call)) { set.add(d.call); queue.push(d.call); }
  };
  for (const call of calls) if (call.composite) for (const x of call.args) take(x.expr);
  for (const e of seeds) take(e);
  while (queue.length) for (const x of queue.pop().args) take(x.expr);
  return set;
}
/** The outputs of a call that are written down: the ones something reads, or all of them with `--all-pins`. */
const shownOutputs = (call, { allPins }) => call.outputs.filter((o) => allPins || o.uses > 0);
/**
 * With `--optimize` a data node whose only written output is read exactly once is not declared: its call stands where the value is read. A variable
 * of the whole graph (`$.`) is assigned by an execution node and read by other cases, so it is never one of these.
 */
const inlinable = (def, opts) => opts.optimize && def != null && def.out.uses === 1 && shownOutputs(def.call, opts).length === 1;

// ---- where variables live -------------------------------------------------------------------------------------------------------------------------
// A graph keeps what its execution nodes give out, and `next` / `input`, in `$`. A composite body is shared by all its callers: what its execution nodes
// give out is kept per instance (`$$` is the bucket of the instance `Comp`), `next` / `input` in variables of its function (`def`).
/** A variable of the graph or of the instance (the span is its name, a link to where it is declared in the html formats). */
const store = (opts, name) => [opts.def ? '$$.' : '$.', name];
const nextVar = (opts) => { opts.used.next = true; return opts.def ? 'next' : '$.next'; };
const inputVar = (opts) => (opts.def ? 'input' : '$.input');
/** The name of an instance as the argument of a call: a composite's own instances are named behind its own (`Comp`). */
const instanceRef = (opts, name) => (opts.def ? ['Comp + ', str(`_${name}`)] : str(name));
/** `Composite['Name']`: where the function of a composite is filed (a second file is addressed through `File[...]`). */
const registry = (namespace, name, { file, multi }) => [multi ? ['File[', S('string', qi(file)), '].'] : '', namespace, '[', S('string', qi(name)), ']'];

/**
 * What stands after `Key:` for an expression: its lines, the notes that go after the comma (null when nothing is shown), and the lines in front of it (the
 * comment of the node an intermediate is inlined from).
 */
function exprParts(e, level, opts, { ctx = 'native' } = {}) {
  const { a, caseId, defs } = opts;
  // a lazy value (with --lazy) that a native node reads is forced
  const real = (lines) => { if (!opts.lazy || ctx !== 'native') return lines; opts.used.unlz = true; return wrap(lines, 'unlz(', ')'); };
  switch (e.kind) {
    case 'var': {
      const def = defs.get(e.name);
      const lazyValue = opts.lazy && def != null && (def.call.composite != null || opts.lazyCalls.has(def.call));
      if (inlinable(def, opts)) {
        const lines = callBody(def.call, level, opts, { select: shownOutputs(def.call, opts)[0].key });
        const before = def.call.comment != null ? [comment(oneLine(def.call.comment))] : [];
        // a composite's output is lazy already; a native node is called where the value is wanted, or inside the lazy value that is handed on
        if (def.call.composite) return { lines: real(lines), notes: [], before };
        const typed = wrap(lines, castOpen(def.out.type, def.out.dict), ')');
        if (lazyValue && ctx === 'lazy') { opts.used.lazy = true; return { lines: wrap(typed, 'lazy(()=> ', ')'), notes: [], before }; }
        return { lines: typed, notes: [], before };
      }
      const name = anchor('jsVar', e.name, { to: a.localId(caseId, e.name) });
      return { lines: lazyValue ? real([name]) : [name], notes: [S('jsComment', e.from)] };
    }
    case 'global': return { lines: [store(opts, anchor('jsOut', e.name, { to: a.globalId(e.name) }))], notes: [S('jsComment', e.from)] };
    case 'port': return { lines: real([['In.', S('jsOut', e.name)]]) };
    case 'event': return { lines: ['$.event'] };
    case 'missing': return { lines: ['undefined'], notes: [`wired to a node the graph does not have: [${e.node.index}]`] };
    case 'unset': return { lines: ['undefined'], notes: ['(default)'] };
    case 'literal': {
      const notes = [];
      if (!e.value.set) notes.push('(default)');
      if (e.resource) notes.push([S('className', e.resource.class_name), ':', S('key', e.resource.name)]);
      return { lines: [literal(e)], notes };
    }
    default: return null;
  }
}
const noteSpans = (notes) => (notes?.length ? [' ', S('jsComment', '//'), ...notes.flatMap((n) => [' ', typeof n === 'string' ? S('jsComment', n) : n])] : '');
function argLines(args, level, opts, how = {}) {
  const lines = [];
  for (const a of args) {
    if (a.hidden && !opts.allPins) continue;
    const r = a.expr ? exprParts(a.expr, level, opts, how) : null;
    if (!r && !opts.allPins) continue;
    const { lines: value, notes, before = [] } = r ?? { lines: ['undefined'], notes: ['(no value, no wire)'] };
    for (const b of before) lines.push([ind(level), b]);
    lines.push(...place(level, [S('jsKey', a.key), ': '], value, [',', noteSpans(notes)]));
  }
  return lines;
}

/**
 * The call of a node as lines, from `Function(` to the closing parenthesis. `event`: the call is awaited. `select`: the key of the output the call is read
 * through (`Function(...).Key`), for a call that has one output to give. A composite is called with the graph's `$`, the name of the instance, an object
 * of its inputs and, for its flow, the name of the entry point (`entry`: what stands there when the call is entered by the events inside the composite).
 */
function callBody(call, level, opts, { event = false, select = null, entry = null } = {}) {
  const comp = call.composite;
  const args = argLines(call.args, level + 1, opts, comp ? { ctx: 'lazy' } : {});
  // what follows the pins: the flow input the node was entered through, and the constant a few nodes are given (`extra`)
  const extra = !call.extra ? [] : [literal(call.extra)];
  const tail = [...(entry ?? (call.input ? [inputVar(opts)] : [])), ...extra].map((t) => [', ', t]);
  const head = comp ? registry('Composite', comp.name, opts) : S('jsCall', call.function);
  // what stands in front of the pins: a composite's `$` and instance, the id of a data node, the variable of a Get Local Variable (in a composite body that
  // name is behind the name of the instance)
  const id = call.id ? [call.id.kind === 'var' && opts.def ? ['Comp + ', str(`_${call.id.name}`)] : str(call.id.name), ', '] : '';
  const front = comp ? ['$, ', instanceRef(opts, comp.instance), ', '] : id;
  let lines;
  if (comp || id) lines = args.length ? [[head, '(', front, '{'], ...args, [ind(level), '}', ...tail, ')']] : [[head, '(', front, '{}', ...tail, ')']];
  else if (!args.length) lines = [[head, tail.length ? ['({}', ...tail, ')'] : '()']];
  else lines = [[head, '({'], ...args, [ind(level), '}', ...tail, ')']];
  if (event) lines = wrap(lines, [select != null ? '(' : '', kw('await'), ' '], select != null ? ')' : '');
  return select != null ? wrap(lines, '', ['.', S('jsKey', select)]) : lines;
}

/**
 * One call as a statement. `form`: `const` (the outputs are intermediates), `assign` (they are variables of the graph), `for` (a generator). The outputs
 * that are shown are destructured, or with `--optimize` read from the call when there is only one. `after`: what follows the `;` of a call that has no output to
 * write down.
 */
function callLines(call, level, opts, { form, event = false, next = false, after = '' }) {
  const { a, caseId } = opts;
  const lines = [];
  // `bare`: a data node nothing reads, written as a statement that assigns nothing
  if (form === 'bare') {
    if (call.comment != null) lines.push([ind(level), comment(oneLine(call.comment))]);
    lines.push(...place(level, '', callBody(call, level, opts), ';'));
    return lines;
  }
  const outs = shownOutputs(call, opts);
  const target = (o) => (o.global ? store(opts, anchor('jsOut', o.name, { id: a.globalId(o.name) })) : anchor('jsVar', o.name, { id: a.localId(caseId, o.name) }));
  const note = call.comment != null ? comment(oneLine(call.comment)) : null;
  const direct = opts.optimize && !next && outs.length === 1;
  // with --lazy a data node whose value goes into a composite is computed when somebody reads it
  const lazily = form === 'const' && opts.lazy && opts.lazyCalls.has(call);
  const body = (select) => {
    if (!lazily) return callBody(call, level, opts, { event, select });
    opts.used.lazy = true;
    const inner = wrap(callBody(call, level, opts, { event }), 'lazy(()=> ', ')');
    return select != null ? wrap(inner, '', ['.', S('jsKey', select)]) : inner;
  };
  if (direct) {
    if (note) lines.push([ind(level), note]);
    const [o] = outs;
    lines.push(...place(level, form === 'const' ? [kw('const'), ' ', target(o), ' = '] : [target(o), ' = '], body(o.key), ';'));
    return lines;
  }
  const entries = next ? [['Next', nextVar(opts)], ...outs.map((o) => [o.key, target(o)])] : outs.map((o) => [o.key, target(o)]);
  if (!entries.length) {
    if (note) lines.push([ind(level), note]);
    lines.push(...place(level, '', callBody(call, level, opts, { event }), [';', after]));
    return lines;
  }
  const open = form === 'const' ? [kw('const'), ' {'] : form === 'for' ? [sw('for'), ' ({'] : '({';
  lines.push([ind(level), open, note ? [' ', note] : '']);
  for (const [key, t] of entries) lines.push([ind(level + 1), S('jsKey', key), ': ', t, ',']);
  const close = form === 'for' ? [sw('of'), ' '] : '= ';
  lines.push(...place(level, ['} ', close], body(null), { const: ';', assign: ');', for: ') {' }[form]));
  return lines;
}
/** The id of a case as the string of a jump: a link to the case. */
const caseRef = (t, a) => anchor('jsString', qd(t.id), { to: a.caseId(t.id) });
/**
 * The statements that send the flow to a target: the flow input it arrives through (if the node has several) is set first, and the jump says in a comment
 * which node it goes to. `ret`: the jump is the last thing the case does, so it returns what the other case returns; `fall`: the target is the very next
 * case, so the flow just runs on into it (`void "id";`). A graph awaits the other case; a composite body is a generator, which passes on what the other
 * case yields (`yield*`), and leaves through a flow output of the composite by yielding its name; a body that leaves once awaits the other case like a
 * graph does and returns the output it leaves through (`return { Next: "0" }`).
 */
const jump = (t, level, ret, opts, fall = false) => {
  const { a, def, plain: once } = opts;
  const back = ret ? [kw('return'), ' '] : '';
  // a body that leaves once returns where the flow goes; a generic one yields it, and goes on
  if (t.exit) return [[ind(level), once ? [kw('return'), ' { Next: ', str(t.label), ' };'] : [back, kw('yield'), ' ', str(t.label), ';']]];
  const go = fall ? [kw('void'), ' ', caseRef(t, a), ';'] : def && !once ? [back, kw('yield*'), ' GoTo(', caseRef(t, a), ');'] : [ret ? back : [kw('await'), ' '], 'GoTo(', caseRef(t, a), ');'];
  return [
    ...(t.input != null ? [[ind(level), inputVar(opts), ' = ', str(t.input), ';']] : []),
    [ind(level), go, t.function != null ? [' ', comment(t.function)] : ''],
  ];
};

/** The data nodes of a case (or of the outputs of a composite) as statements; a blank line sets the block off from what follows it. */
function dataLines(data, level, opts) {
  const written = data.filter((d) => !(shownOutputs(d, opts).length === 1 && inlinable({ call: d, out: shownOutputs(d, opts)[0] }, opts)));
  const lines = written.flatMap((d) => callLines(d, level, opts, { form: 'const' }));
  return written.length ? [...lines, ''] : lines;
}
/** Who sends the flow to a case, as the comment after its `case`: the callers are links to their cases. */
function callersComment(callers, a) {
  if (callers == null) return '';
  const link = (k) => [S('jsComment', "'"), anchor('jsComment', k.id, { to: a.caseId(k.id) }), S('jsComment', `: ${k.function}'`)];
  if (!callers.length) return [' ', comment('no callers')];
  if (callers.length === 1) return [' ', S('jsComment', '// called from '), link(callers[0])];
  return [' ', S('jsComment', `// ${callers.length} callers: [`), join(callers.map(link), S('jsComment', ', ')), S('jsComment', ']')];
}

/**
 * The switch over what a generator (or a generic composite) yields: a branch per flow output, which runs the cases that output is wired to. A composite
 * also has a `default`, for whatever else it yields. In a body that leaves once, the output that runs last of a node returns where the flow goes.
 */
function yieldedLines(c, L, opts) {
  const lines = [[ind(L), sw('switch'), '(', nextVar(opts), '){']];
  c.next.forEach((b, bi) => {
    lines.push([ind(L + 1), sw('case'), ' ', str(b.label), ':']);
    const last = opts.plain && c.kind !== 'composite' && bi === c.next.length - 1;
    b.targets.forEach((t, i) => lines.push(...jump(t, L + 2, last && i === b.targets.length - 1, opts)));
    const returned = b.targets.length && opts.plain && (last || b.targets[b.targets.length - 1].exit);
    if (!returned) lines.push([ind(L + 2), sw('break'), ';']);
  });
  if (c.kind === 'composite') lines.push([ind(L + 1), sw('default'), ':'], [ind(L + 2), kw('return'), ';']);
  lines.push([ind(L), '}']);
  return lines;
}

/**
 * One case: the data nodes the node needs, the node, and where the flow goes. `flat`: the graph is that one case and nothing else (a filter graph), so its
 * statements stand in the function itself. A composite body's cases stand one level deeper (inside the generator), and are entered by the names of the
 * composite's flow inputs as well as by their own ids. How the node is written follows its execution type (`flow.form`):
 *   call    the flow always goes through its one output: the call, then the jumps (a composite says which output in a comment),
 *   if      one of two ways (Double Branch, a composite with two ways out): `if` on `Next`, the second way in the `else`,
 *   switch  one of several: `switch` on `Next`; Multiple Branches has its first output as the `default`, a composite ends with the `default` of its dropped
 *           flow (`terminal`) or `throw null`,
 *   loop    anything else: a `for` over what the node yields, each output with its own branch.
 */
function caseLines(c, o, nextId, flat = false) {
  const D = o.def ? 1 : 0, L = flat ? 1 : 3 + D; // inside `function`, `switch`, `case` (and the generator of a composite)
  const lines = [];
  const defs = definitions(c);
  const opts = { ...o, caseId: c.id, defs, lazyCalls: lazyCallsOf([...c.data, c.call], [], defs, o) }, a = o.a;
  if (!flat) {
    for (const p of c.ports) lines.push([ind(2 + D), kw('case'), ' ', S('string', qi(`input: ${p.label}`)), ':']);
    // a composite that has no flow input is only entered by its events: nothing jumps to the id of the call itself
    const byEvents = c.kind === 'composite' && !c.call.input && c.events.length > 0;
    c.events.forEach((e, i) => lines.push([ind(2 + D), kw('case'), ' ', byEvents ? anchor('string', e, { id: i === 0 ? a.caseId(c.id) : undefined }) : S('string', qi(e)), byEvents && i === c.events.length - 1 ? [':{', callersComment(c.callers, a)] : ':']));
    if (!byEvents) lines.push([ind(2 + D), kw('case'), ' ', anchor('string', c.id, { id: a.caseId(c.id) }), ':{', callersComment(c.callers, a)]);
  }
  if (c.unreachable) lines.push([ind(L), err('throw'), ' ', S('string', qi('unreachable')), ';']);
  // where an expanded body's node comes from: the calls it is inside of
  if (c.via.length) lines.push([ind(L), comment(`in composite ${c.via.map((v) => `${v.name ?? '?'} (${nodeIdOf(v.index)})`).join(' > ')}`)]);
  lines.push(...dataLines(c.data, L, opts));
  const { flow } = c, composite = c.kind === 'composite';
  const jumps = (targets, level) => targets.flatMap((t, i) => jump(t, level, i === targets.length - 1, opts));
  const exit = (level) => [ind(level), kw('return'), ' ', S('jsCall', 'Exit'), '();'];
  /** What the flow does when it leaves through an output: its jumps, or the end of the flow when nothing is wired to it. */
  const branch = (b, level) => (b.targets.length ? jumps(b.targets, level) : [exit(level)]);
  const noTargets = !c.next.some((b) => b.targets.length);
  if (flow.form === 'if' || flow.form === 'switch') {
    // a node that has no output but `Next` is read where it is tested
    const bare = opts.optimize && shownOutputs(c.call, opts).length === 0;
    if (bare) { if (c.call.comment != null) lines.push([ind(L), comment(oneLine(c.call.comment))]); }
    else lines.push(...callLines(c.call, L, opts, { form: 'assign', next: true, event: composite }));
    const test = (pre, post) => (bare ? place(L, pre, callBody(c.call, L, opts, { select: 'Next', event: composite }), post) : [[ind(L), pre, nextVar(opts), post]]);
    if (flow.form === 'if') {
      const [first, second] = c.next;
      lines.push(...test([sw('if'), '('], ['==', str(first.label), '){']), ...branch(first, L + 1));
      lines.push([ind(L), '}', sw('else'), '{ ', comment(second ? `==${JSON.stringify(second.label)}` : 'terminal')]);
      lines.push(...(second ? branch(second, L + 1) : [[ind(L + 1), kw('return'), ';']]), [ind(L), '}']);
    } else {
      lines.push(...test([sw('switch'), '('], '){'));
      const first = flow.default === 'pin' ? c.next[0] : null;
      if (first) lines.push([ind(L + 1), sw('default'), ': ', comment(JSON.stringify(first.label))], ...branch(first, L + 2));
      for (const b of c.next) if (b !== first) lines.push([ind(L + 1), sw('case'), ' ', str(b.label), ':'], ...branch(b, L + 2));
      if (!first) {
        const dropped = flow.default === 'terminal';
        lines.push([ind(L + 1), sw('default'), ':', dropped ? [' ', comment('terminal')] : ''], [ind(L + 2), dropped ? [kw('return'), ';'] : [err('throw'), ' null;']]);
      }
      lines.push([ind(L), '}']);
    }
  } else if (flow.form === 'loop') {
    // an event inside the composite enters through the id of the call followed by the event's own id, which is what the composite's cases are named by
    let entry = null;
    if (composite) {
      if (c.call.comment != null) lines.push([ind(L), comment(oneLine(c.call.comment))]);
      opts.used.next = true;
      if (c.events.length) {
        const own = c.id.includes('.') ? `node.slice(${c.id.length + 1})` : "node.slice(node.indexOf('.')+1)";
        entry = [c.call.input ? [`node === `, str(c.id), ` ? `, inputVar(opts), ` : ${own}`] : own];
      }
      lines.push(...place(L, [sw('for'), ' ', kw('await'), ' (', nextVar(opts), ' ', sw('of'), ' '], callBody(c.call, L, opts, { entry }), ') {'));
    } else lines.push(...callLines(c.call, L, opts, { form: 'for', event: c.event, next: true }));
    // after the loop the flow ends; with nothing wired anywhere (or in a body that returns where the flow goes) it ends in an output nothing is wired to
    lines.push(...yieldedLines(c, L + 1, opts), [ind(L), '}'], c.next.length && (noTargets || opts.plain) ? exit(L) : [ind(L), kw('return'), ';']);
  } else {
    // the flow always goes through the one output; a composite says which one, as the call of a node that has an output to read would
    const way = c.next.length ? `.Next==${JSON.stringify(c.next[0].label)}` : 'terminal';
    lines.push(...callLines(c.call, L, opts, { form: 'assign', event: c.event || composite, after: composite ? [' ', comment(way)] : '' }));
    if (!flat) {
      const targets = c.next.flatMap((b) => b.targets);
      if (!targets.length) lines.push(c.next.length ? exit(L) : [ind(L), kw('return'), ';']);
      targets.forEach((t, i) => {
        const last = i === targets.length - 1;
        lines.push(...jump(t, L, last, opts, last && t.id === nextId));
      });
    }
  }
  if (!flat) lines.push([ind(2 + D), '}']);
  return lines;
}

/**
 * What a composite hands out when a caller reads its data pins (no node given): an object of one value per data output, each the expression inside
 * that stands for the pin, with the data nodes it needs written out before.
 */
function outputLines(face, opts) {
  const defs = definitions({ data: face.data });
  const o = { ...opts, caseId: 'outputs', defs, lazyCalls: lazyCallsOf(face.data, face.outputs.map((p) => p.expr), defs, opts) };
  const lines = [[ind(1), kw('if'), ' (!node){'], ...dataLines(face.data, 2, o), [ind(2), kw('return'), ' {']];
  for (const p of face.outputs) {
    const r = p.expr ? exprParts(p.expr, 3, o, { ctx: 'lazy' }) : null;
    const { lines: value, notes, before = [] } = r ?? { lines: ['undefined'], notes: ['(nothing is wired to it)'] };
    for (const b of before) lines.push([ind(3), b]);
    lines.push(...place(3, [S('jsKey', p.key), ': '], value, [',', noteSpans(notes)]));
  }
  lines.push([ind(2), '};'], [ind(1), '}']);
  return lines;
}

/**
 * The case of the data nodes nothing reads (`orphans` of the graph): never entered, so it starts with `throw`. Each chain is the data nodes its last node needs,
 * then that node written by itself.
 */
function orphanLines(chains, o) {
  const D = o.def ? 1 : 0, L = 3 + D;
  const all = chains.flatMap((c) => [...c.data, c.call]), defs = definitions({ data: all });
  const opts = { ...o, caseId: 'orphaned', defs, lazyCalls: lazyCallsOf(all, [], defs, o) };
  const lines = [[ind(2 + D), kw('case'), ' ', anchor('string', 'orphaned', { id: o.a.caseId('orphaned') }), ':{'], [ind(L), err('throw'), ' ', S('string', qi('unreachable')), ';'], ''];
  chains.forEach((c, i) => {
    if (i) lines.push('');
    lines.push(...dataLines(c.data, L, opts), ...callLines(c.call, L, opts, { form: 'bare' }));
  });
  lines.push([ind(2 + D), '}']);
  return lines;
}

/**
 * The helpers of the lazy values, as one block comment. They are top-level functions, so they are available in the whole file whatever their place; they
 * stand in front of the first composite, which is where the lazy values cross a boundary.
 */
const HELPERS = `function lazy(x) {
  const EVAL = lazy.EVAL || (lazy.EVAL = Symbol("lazy.EVAL"));
  let result = EVAL;
  const force = () => result===EVAL ? (result = x()) : result;
  return new Proxy({ [EVAL]: force, }, {
    get(target, prop) {
      return (prop === EVAL) ? force : lazy(() => force()?.[prop]);
    },
  });
}
function unlz(x) {
  return x?.[lazy.EVAL] ? x[lazy.EVAL]() : x;
}`.split('\n');
const helperLines = () => ['/*', 'A composite looks at its inputs (In) only when one of its executed nodes needs a value, and its callers calculate its outputs only when they read them;', 'a data node is calculated once per turn of an execution node and forgotten after it.', 'lazy(() => value) postpones the evaluation of a data node until a value is read; unlz(value) forces it', ...HELPERS, '*/'].map((l) => S('jsComment', l));

/** The key a graph is known by in a search (`graph` of a call, `searchedNodes` of code.mjs): its GUID and service domain. */
export const graphKeyOf = (g) => `${g.guid}|${g.service}`;
/**
 * The cases of a graph that are written when a search is on: the ones of a node the search found, or of a composite call the node was expanded from.
 * `found`: the nodes the search found, by graph key (null when nothing is searched).
 */
function shownCases(ps, found) {
  if (!found) return ps.cases;
  const has = (g, index) => found.get(graphKeyOf(g))?.has(index) ?? false;
  return ps.cases.filter((c) => has(c.call.graph, c.node.index) || c.via.some((v) => has(v.graph, v.index)));
}
/** The chains of data nodes nothing reads that are written when a search is on: the ones that have a found node. */
function shownOrphans(ps, found) {
  const chains = ps.orphans ?? [];
  if (!found) return chains;
  const has = (call) => found.get(graphKeyOf(call.graph))?.has(call.node.index) ?? false;
  return chains.filter((c) => [...c.data, c.call].some(has));
}
/** Whether what a composite hands out is written: the search found a data node of the expressions of its outputs, or a node one of them reads. */
function shownFace(x, found) {
  if (!found) return true;
  const mine = found.get(graphKeyOf(x)), has = (call) => found.get(graphKeyOf(call.graph))?.has(call.node.index) ?? false;
  const { data, outputs } = x.pseudocode.interface;
  return data.some(has) || outputs.some((p) => p.expr?.node && mine?.has(p.expr.node.index));
}

/** The function of one graph item as lines of spans; `used` of `opts` tells which helpers it needs. `found`: the nodes a search found, by graph key, or null. */
function functionLines(x, file, multi, opts, found) {
  const label = S('string', qi(x.name.name)); // the tag is in the namespace (the kind of graph)
  const ps = x.pseudocode, { flat, interface: face } = ps;
  const cases = shownCases(ps, found), orphans = shownOrphans(ps, found);
  const def = x.composite_body;
  // a composite body that leaves once is a function, one that leaves any number of times a generator
  const o = { ...opts, def, file, multi, plain: def && ps.flow.type !== 'generic' };
  const target = [multi ? ['File[', S('string', qi(file)), '].'] : '', ps.namespace, '[', label, ']'];
  const lines = [];
  const comments = x.comments.filter((c) => c.text !== '').map((c) => [ind(1), comment(oneLine(c.text))]); // the comments on the canvas, in the order of the report
  if (!def) {
    lines.push([target, ' = ', kw('async'), ' ', kw('function'), ' ', S('jsCall', ps.function), '($,node){']);
    if (!flat) lines.push([ind(1), kw('const'), ' GoTo = this.bind(this,$);']);
    lines.push(...comments);
    if (flat && cases.length) lines.push(...caseLines(cases[0], o, null, true));
    else {
      lines.push([ind(1), kw('switch'), '(node){']);
      cases.forEach((c, i) => lines.push(...caseLines(c, o, cases[i + 1]?.id)));
      if (orphans.length) lines.push(...orphanLines(orphans, o));
      lines.push([ind(1), '}']);
    }
    lines.push('};');
    return lines;
  }
  // `In` says what the callers give (the pins and their types; callers fill every one on each call)
  const inputs = face?.inputs ?? [];
  const head = [target, ' = ', kw('function'), ' ', S('jsCall', ps.function), '($,Comp,In = {'];
  if (inputs.length) lines.push([head], ...inputs.map((p) => [ind(1), S('jsKey', p.key), ': ', typeDecl(p.type, p.dict), ',']), ['},node){']);
  else lines.push([head, '},node){']);
  if (ps.unreachable) lines.push([ind(1), err('throw'), ' ', S('string', qi('unreachable')), ';']);
  lines.push(...comments);
  const body = [];
  if (face?.outputs.length && shownFace(x, found)) body.push(...outputLines(face, o));
  if (cases.length || orphans.length) {
    body.push([ind(1), kw('return'), ' (', kw('async'), ' ', kw('function'), o.plain ? ' ' : '* ', 'GoTo(node){'], [ind(2), kw('switch'), '(node){']);
    cases.forEach((c, i) => body.push(...caseLines(c, o, cases[i + 1]?.id)));
    if (orphans.length) body.push(...orphanLines(orphans, o));
    body.push([ind(2), '}'], [ind(1), '})(node);']);
  }
  // the instance's bucket holds what its execution nodes give out; which way the flow goes is a variable of one run
  const globals = cases.some((c) => c.call.outputs.some((q) => q.global && (q.uses > 0 || opts.allPins)));
  const vars = [...(o.used.next ? ['next'] : []), ...(cases.some((c) => c.call.input || c.next.some((b) => b.targets.some((t) => t.input != null))) ? ['input'] : [])];
  if (globals) lines.push([ind(1), kw('const'), ' $$ = $[Comp] ??= {};']);
  if (vars.length) lines.push([ind(1), kw('let'), ' ', join(vars, ', '), ';']);
  lines.push(...body, '};');
  return lines;
}

/**
 * The pseudocode document of the whole run (one function per graph, the graphs of every file one after the other) and how many graphs it holds.
 * `found` = what --search / --match found, one map per file ({ graph key -> the indexes of the nodes found }, see `searchedNodes` of code.mjs), or null:
 * then only the graphs that have a found node are written, each with the cases of its found nodes. The search is made on the lines of the `code` listing,
 * not on the pseudocode.
 * The html formats show the code in colors, with the use of a variable and every jump linked to where it is declared.
 */
export function pseudocodeDocument(report, { allPins = false, optimize = false, lazy = false, found = null } = {}) {
  const multi = report.header.files.length > 1;
  const parts = []; // what the document is made of, in order: the openings of a file, and the graphs
  report.code.forEach((code, fi) => {
    const hits = found?.[fi] ?? null;
    const shown = code.items.map((x, gi) => [x, gi]).filter(([x]) => x.type === 'graph' && (!hits || hits.get(graphKeyOf(x))?.size));
    if (!shown.length) return;
    parts.push({ blocks: openingBlocks(code, { asComment: true }) });
    for (const [x, gi] of shown) {
      const used = { lazy: false, unlz: false, next: false };
      parts.push({ x, used, lines: functionLines(x, code.file, multi, { allPins, optimize, lazy, used, a: anchors(`p${fi}_${gi}`) }, hits) });
    }
  });
  // the helpers of the lazy values stand between the graphs and the composites; with no composite, after the last graph (they are available in the whole file)
  const needed = parts.some((p) => p.used && (p.used.lazy || p.used.unlz));
  const at = parts.findIndex((p) => p.x?.composite_body);
  if (needed) parts.splice(at >= 0 ? at : parts.length, 0, { helpers: true });
  // the explanation of the format stands in front of the first graph; a search shows pieces of the code, which it would only get in the way of
  if (parts.length && !found && lazy) parts.splice(1, 0, { intro: true });
  const blocks = [];
  let count = 0;
  const pre = (lines) => blocks.push({ t: 'pre', lines: lines.map(plain), rich: lines, text: blocks.some((b) => b.t === 'pre') ? ['', ...lines] : lines });
  for (const p of parts) {
    if (p.blocks) blocks.push(...p.blocks);
    else if (p.intro) pre(['/*', ...PSEUDOCODE_INTRO, '*/'].map((l) => S('jsComment', l)));
    else if (p.helpers) { blocks.push({ t: 'heading', level: 2, spans: ['Lazy values'], text: null }); pre(helperLines()); }
    else { blocks.push({ t: 'heading', level: 2, spans: ['Graph ', graph(graphLabelOf(p.x.name))], text: null }); pre(p.lines); count++; }
  }
  return { blocks, count };
}

/** Print the code report as pseudocode. `found`: what the search found (see pseudocodeDocument), null without one. */
export function printPseudocode(report, printer, { allPins = false, optimize = false, lazy = false, found = null } = {}) {
  const { blocks, count } = pseudocodeDocument(report, { allPins, optimize, lazy, found });
  if (printer.grepping) { printer.note(`${count} matching graph(s)`); if (!count) printer.fail(); }
  return printer.doc(blocks, `code ${report.header.files.join(', ')}`);
}
