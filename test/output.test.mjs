import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { S, graph, key, frac, level, marker, T, spansOf, textLines, plain, flat } from '../src/doc.mjs';
import { STYLES, styleCss } from '../src/theme.mjs';
import { makeFormatter, resolveFormat, FORMAT_NAMES } from '../src/output/index.mjs';
import { mdEsc } from '../src/output/markdown.mjs';
import { htmlEsc, css } from '../src/output/html.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { parseBundle } from '../src/model.mjs';
import { renderDoc } from '../src/render.mjs';
import { buildRefs } from '../src/refs.mjs';
import { refsReport, refsDetailReport, warnsReport, warnsDetailReport } from '../src/report-refs.mjs';
import { fileInfo, infoBlocks } from '../src/info.mjs';
import { main } from '../src/cli.mjs';
import { casesDir } from './helpers.mjs';
import { categories, fixtures, run } from './expected.mjs';

const ESC = '\x1b';
const sample = 'test/cases/gia/sample_2.gia';
const cli = (...args) => run(args);
const noBom = (s) => s.replace(/^\uFEFF/, ''); // md/markdown output starts with a UTF-8 BOM
const cliFull = (args) => { let out = '', err = ''; const code = main(args, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} }); return { out, err, code }; };

// ---------- choosing the format ----------
test('formats: text color md htm markdown html auto – md/htm are their own formats, not aliases', () => {
  assert.deepEqual(FORMAT_NAMES, ['auto', 'text', 'color', 'md', 'htm', 'markdown', 'html']);
  for (const f of FORMAT_NAMES.filter((x) => x !== 'auto')) assert.equal(resolveFormat({ format: f }), f);
  assert.throws(() => resolveFormat({ format: 'pdf' }), /unknown output format/);
});

test('auto: by the extension of --output; otherwise color on a terminal (no NO_COLOR), else text; a file never gets color', () => {
  const r = (output) => resolveFormat({ output, toTerminal: true, env: {} });
  assert.equal(r('a.md'), 'md'); assert.equal(r('a.MARKDOWN'), 'markdown'); assert.equal(r('a.htm'), 'htm'); assert.equal(r('dir/a.html'), 'html');
  assert.equal(r('a.txt'), 'text'); assert.equal(r('noext'), 'text');
  assert.equal(resolveFormat({ toTerminal: true, env: {} }), 'color');
  assert.equal(resolveFormat({ toTerminal: true, env: { NO_COLOR: '1' } }), 'text');
  assert.equal(resolveFormat({ toTerminal: false, env: {} }), 'text');
  assert.equal(resolveFormat({ format: 'auto', output: 'a.html', toTerminal: true, env: {} }), 'html');
  assert.equal(resolveFormat({ format: 'text', output: 'a.html' }), 'text', 'an explicit format beats the extension');
});

// ---------- the theme: every styled thing is defined there, and nothing else decides ----------
test('theme: every style used anywhere in dump/refs output is defined in theme.mjs', () => {
  const used = new Set();
  const collect = (v) => { // any object with a string `s` and a `text` is a span; look everywhere else recursively
    if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object') { if (typeof v.s === 'string' && 'text' in v) used.add(v.s); else Object.values(v).forEach(collect); }
  };
  const walk = (blocks) => collect(blocks);
  const db = new NodeDb();
  for (const cat of categories()) for (const f of fixtures(cat)) {
    const bundle = parseBundle(fs.readFileSync(path.join(casesDir, cat, f)), { file: f });
    walk(renderDoc(bundle, db, { defaults: true, allPins: true }).blocks);
    const { refs, findings, limits } = buildRefs([bundle], db);
    walk(refsReport(refs, { files: [f], sortDesc: false }));
    walk(refsDetailReport(refs, { multi: false, files: [f], what: 'x' }));
    walk(warnsReport({ findings, limits, files: [f], multi: false, topN: 3 }));
    walk(warnsDetailReport(findings, { multi: false, files: [f], what: 'x' }));
    walk(infoBlocks(fileInfo(bundle, db, { showTag: true }), { showTag: true }));
    for (const x of findings) collect(spansOf(x.message));
    for (const r of refs) { collect(spansOf(r.note)); collect(spansOf(r.pin)); }
  }
  const builtin = new Set(['graph', 'frac', 'marker']); // graph is drawn with the graphName + graphTag styles
  for (const u of used) assert.ok(STYLES[u] || builtin.has(u), `style "${u}" is used but not defined in src/theme.mjs`);
  for (const must of ['graph', 'key', 'pinName', 'pinLabel', 'string', 'number', 'typeName', 'nodeName', 'kind', 'role', 'count', 'mode']) assert.ok(used.has(must), `style ${must} never used (dead or broken)`);
});

test('theme: recoloring is a one-place change – console and html both follow STYLES', () => {
  const saved = STYLES.graphName.ansi;
  try {
    STYLES.graphName.ansi = ['brightCyan'];
    assert.equal(makeFormatter('color').inline(graph('G')), `'${ESC}[96mG${ESC}[0m'`);
    assert.match(css(), /\.graphName\{color:#61D6D6\}/);
    STYLES.graphName.ansi = [];
    assert.equal(makeFormatter('color').inline(graph('G')), "'G'");
  } finally { STYLES.graphName.ansi = saved; }
});

// ---------- inline formatting ----------
test('text/color: same characters (quotes come from the style), color only adds escape codes', () => {
  const spans = [graph('<skill>Boom'), '/', key('a"b'), ' ', S('count', 2), ' ', S('pinName', 'X'), ' ', frac(90, 100), level('warn', 'WARN '), S('string', 'x'), S('guid', 5)];
  const t = makeFormatter('text').inline(spans);
  assert.equal(t, `'<skill>Boom'/"a\\"b" 2 "X" 90/100WARN 'x''5'`);
  const c = makeFormatter('color').inline(spans);
  assert.ok(c.includes(ESC) && c.replace(/\x1b\[[0-9;]*m/g, '') === t);
  assert.equal(makeFormatter('text').inline([marker('### '), 'x']), '### x');
});

test('T: messages keep their plain text and remember their structure; numbers and nesting work', () => {
  const inner = T`in ${graph('G')}`;
  const msg = T`${S('count', 0)} things ${inner} and ${S('key', 'k')}`;
  assert.equal(msg, `0 things in 'G' and "k"`);
  assert.deepEqual(flat(spansOf(msg)).filter((s) => typeof s === 'object').map((s) => s.s), ['count', 'graph', 'key']);
  assert.equal(plain(spansOf('plain text never registered')), 'plain text never registered');
});

test('markdown: hostile names are escaped, emphasis stays intact, tables survive pipes and newlines', () => {
  const md = makeFormatter('markdown');
  assert.equal(mdEsc('a|b*c_d[e]<f>&g\\h`i'), 'a\\|b\\*c\\_d\\[e\\]\\<f\\>\\&g\\\\h\\`i');
  assert.equal(md.inline(key('x*y')), '"**x\\*y**"');
  assert.equal(md.inline(graph('<skill>Name')), "'<u>\\<skill\\></u>*Name*'");
  const out = md.render([{ t: 'table', cols: [{ title: 'K' }, { title: 'V' }], rows: [[key('a|b'), { lines: [S('count', 1), 'x\ny'] }], [S('string', "it's `code`"), '']] }]);
  const rows = out.trim().split('\n');
  assert.equal(rows.length, 4);
  for (const r of rows) assert.equal(r.replace(/\\\|/g, '').split('|').length, 4, r);
  assert.ok(rows[2].includes('<br>'));
  assert.match(md.render([{ t: 'para', spans: '# not a heading' }]), /^\\# not a heading/);
  assert.match(md.render([{ t: 'para', spans: '1. not a list' }]), /^1\\\. not a list/);
});

test('html: everything is escaped, css lives in one <style> in <head>, classes carry the styles', () => {
  assert.equal(htmlEsc(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
  const page = makeFormatter('html').render([
    { t: 'title', spans: '<script>alert(1)</script>' },
    { t: 'table', cols: [{ title: 'K' }], rows: [[[graph('<skill>G</b>'), key('k"<'), frac(100, 100)]]] },
  ], { title: 'T <x>' });
  assert.ok(!page.includes('<script>alert'));
  assert.ok(page.includes('<title>T &lt;x&gt;</title>'));
  assert.equal((page.match(/<style>/g) || []).length, 1);
  assert.ok(page.indexOf('<style>') < page.indexOf('<body>'));
  assert.ok(!page.slice(page.indexOf('<body>')).includes('style='), 'no inline styles in the body');
  for (const cls of ['graphTag', 'graphName', 'key', 'limitOver']) assert.ok(page.includes(`class="${cls}"`), cls);
  assert.ok(!page.includes(ESC));
  for (const name of Object.keys(STYLES)) if (styleCss(name)) assert.ok(page.includes(`.${name}{`), `css for ${name}`);
});

test('block model: text lines come from `text`, null hides a block, hr is a blank line', () => {
  const lines = textLines([{ t: 'title', spans: 'T', text: null }, { t: 'hr' }, { t: 'heading', level: 2, spans: 'H', text: ['# h'] }, { t: 'table', cols: [], rows: [], text: ['a', 'b'] }]);
  assert.deepEqual(lines, ['', '# h', 'a', 'b']);
});

// ---------- the line-oriented document formats ----------
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const untag = (h) => h.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

test('htm: prints the same lines as text, in <pre> blocks, plus headings and separators', () => {
  for (const [cmd, file] of [['dump', sample], ['refs', 'test/cases/composites/test_All_Composite.gia'], ['refs', sample]]) {
    const text = cli(cmd, file, '--format', 'text').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
    const htm = cli(cmd, file, '--format', 'htm');
    assert.match(htm, /^<!DOCTYPE html>/); assert.match(htm, /<h1>/);
    const pre = [...htm.matchAll(/<pre class="lines">([\s\S]*?)<\/pre>/g)].flatMap((m) => untag(m[1]).split('\n'));
    for (const l of text) assert.ok(pre.includes(l) || untag(htm).includes(l.replace(/^### /, '')), `${cmd}: missing line ${l}`);
    assert.ok(!htm.includes(ESC));
  }
});

test('md: same lines as text with markdown emphasis, real headings and --- separators, alignment kept', () => {
  const md = noBom(cli('refs', 'test/cases/composites/test_All_Composite.gia', '--format', 'md'));
  assert.match(md, /^# /m); assert.match(md, /&nbsp;/); assert.match(md, /\*\*\d+\*\* \w+/); assert.ok(!md.includes(ESC));
  assert.ok(!/^\| /m.test(md), 'no tables in the line format');
  const dump = noBom(cli('dump', sample, '--format', 'md'));
  assert.match(dump, /^# File `test\/cases\/gia\/sample_2\.gia`$/m);
  assert.match(dump, /^\*\*GRAPH\*\* '\*Receive\*'/m);
  assert.ok(!/^\\#/m.test(dump), 'header-ish lines are not escaped headings');
});

test('markdown/html: real documents with tables and headings per graph', () => {
  const md = noBom(cli('refs', sample, '--format', 'markdown'));
  assert.match(md, /^# Reference index/m); assert.match(md, /^\| signal \| listen \| send \|$/m);
  const dump = noBom(cli('code', sample, '--format', 'markdown'));
  assert.match(dump, /^## Graph '\*Receive\*'$/m); assert.match(dump, /^\| Pin \| Name \| Dir \|/m);
  assert.match(cli('code', sample, '--format', 'html'), /<h2 id="graph-receive">/);
  assert.match(cli('dump', sample, '--format', 'html'), /<h2 id="graphs-\d+">Graphs \(\d+\)<\/h2>[\s\S]*<th>Name<\/th><th>Class<\/th><th>Guid<\/th><th class="right">Nodes<\/th>/);
});

// ---------- the CLI ----------
test('CLI: text output is stable and free of escape codes; color has them; auto (piped) is text', () => {
  const text = cli('refs', sample, '--format', 'text');
  assert.match(text, /^signal\s+"Signal_1"/m); assert.ok(!text.includes(ESC));
  assert.equal(cli('refs', sample), text);
  assert.equal(strip(cli('refs', sample, '--format', 'color')), text);
});

test('CLI: --output writes the file, picks the format from its extension under auto, and never colors', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-out-'));
  const root = process.cwd();
  const at = (name, ...args) => { const f = path.join(dir, name); const r = cliFull([...args, '--output', f]); return { r, text: fs.readFileSync(f, 'utf8') }; };
  for (const [name, re] of [['a.html', /^<!DOCTYPE html>[\s\S]*<table>/], ['a.htm', /<pre class="lines">/], ['a.md', /^\uFEFF# File `/], ['a.markdown', /^\uFEFF# File `[\s\S]*^\| Pin /m], ['a.txt', /^GRAPH /m]]) {
    const { r, text } = at(name, 'code', sample);
    assert.equal(r.out, ''); assert.equal(r.code, 0); assert.match(text, re, name); assert.ok(!text.includes(ESC), name);
  }
  assert.equal(at('b.txt', 'dump', sample, '--format', 'html').text.slice(0, 15), '<!DOCTYPE html>');
  assert.equal(cliFull(['refs', sample, '-o', path.join(dir, 'c.md')]).code, 0);
  assert.equal(cliFull(['refs', sample, '--output']).code, 2);
  assert.ok(root);
});

test('CLI: --input forces gia/gil; --format takes only output formats; old spellings are gone', () => {
  const ok = cliFull(['dump', sample, '--input', 'gia']);
  assert.equal(ok.code, 0); assert.equal(ok.out, cli('dump', sample));
  assert.equal(cliFull(['dump', sample, '--input', 'xml']).code, 2);
  const gilAsGia = cliFull(['dump', 'test/cases/gil/stage_1.gil', '--input', 'gia']);
  assert.equal(gilAsGia.code, 1, 'forcing the wrong container format is an error, not a guess');
  for (const args of [['--format', 'gia'], ['--format', 'pdf'], ['--input-format', 'gia'], ['--color'], ['--no-color']]) {
    const r = cliFull(['dump', sample, ...args]);
    assert.equal(r.code, 2, args.join(' ')); assert.match(r.err, /unknown output format|unknown option/);
  }
});

test('CLI: code --search/check/raw work in every format', () => {
  for (const fmt of ['text', 'color', 'md', 'htm', 'markdown', 'html']) {
    assert.equal(cliFull(['code', '--search', 'Signal_1', sample, '--format', fmt]).code, 0, `search ${fmt}`);
    assert.equal(cliFull(['check', sample, '--format', fmt]).code, 0, `check ${fmt}`);
    assert.equal(cliFull(['raw', sample, '--format', fmt]).code, 0, `raw ${fmt}`);
  }
  assert.match(noBom(cli('check', sample, '--format', 'markdown')), /^```text\n== /);
  assert.match(cli('raw', sample, '--format', 'html'), /<pre>/);
});

// ---------- UTF-8 BOM for Markdown ----------
test('md and markdown output start with a UTF-8 BOM (stdout and --output file), other formats and --json never do', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-bom-'));
  for (const fmt of ['md', 'markdown']) for (const mode of ['info', 'dump', 'code', 'refs', 'warns']) {
    const out = cliFull([mode, sample, '--format', fmt]).out;
    assert.ok(out.startsWith('\uFEFF#'), `${mode} ${fmt}: stdout`);
    assert.equal(out.indexOf('\uFEFF', 1), -1, 'exactly one BOM');
    const f = path.join(dir, `${mode}.${fmt === 'md' ? 'md' : 'markdown'}`);
    assert.equal(cliFull([mode, sample, '-o', f]).code, 0);
    const bytes = fs.readFileSync(f);
    assert.deepEqual([...bytes.subarray(0, 3)], [0xEF, 0xBB, 0xBF], `${mode} ${fmt}: file bytes`);
    assert.notDeepEqual([...bytes.subarray(3, 6)], [0xEF, 0xBB, 0xBF]);
  }
  // grep output is a document too
  assert.ok(cliFull(['code', sample, '--search', 'Signal_1', '--format', 'md']).out.startsWith('\uFEFF'));
  for (const fmt of ['text', 'color', 'htm', 'html']) assert.ok(!cliFull(['info', sample, '--format', fmt]).out.includes('\uFEFF'), fmt);
  assert.ok(!cliFull(['info', sample, '--json', '--format', 'md']).out.includes('\uFEFF'), '--json is JSON, not Markdown');
});
