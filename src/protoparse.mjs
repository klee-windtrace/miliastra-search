// Minimal proto3 schema parser (zero dependencies).
// Supports: message (nested), enum, oneof, repeated, optional, reserved, // and /* */ comments.
// Not supported: map<>, services, imports, extensions (the GIA schema does not use them).
// Custom message option (this project): `option opaque_rest = true;` inside a message marks it as "identified, but
// only some fields are interpreted": unknown fields in it are counted as opaque instead of entering the unknown-field census.

const SCALARS = new Set([
  'int32', 'int64', 'uint32', 'uint64', 'sint32', 'sint64', 'bool', 'float', 'double',
  'fixed32', 'fixed64', 'sfixed32', 'sfixed64', 'string', 'bytes',
]);

function tokenize(src) {
  const toks = [];
  const re = /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|[A-Za-z_][\w.]*|-?\d+|[{}=;<>,\[\]()]/y;
  let pos = 0;
  while (pos < src.length) {
    re.lastIndex = pos;
    const m = re.exec(src);
    if (!m) throw new Error(`proto tokenize error near: ${JSON.stringify(src.slice(pos, pos + 30))}`);
    pos = re.lastIndex;
    const t = m[0];
    if (/^\s/.test(t) || t.startsWith('//') || t.startsWith('/*')) continue;
    toks.push(t);
  }
  return toks;
}

export function parseProto(src) {
  const toks = tokenize(src);
  let i = 0;
  const peek = () => toks[i];
  const next = () => toks[i++];
  const expect = (t) => {
    const x = next();
    if (x !== t) throw new Error(`proto parse: expected '${t}' got '${x}' (token #${i})`);
  };

  const root = { kind: 'root', name: '', full: '', parent: null, messages: new Map(), enums: new Map() };

  function skipStatement() { while (peek() !== ';') next(); next(); }

  function parseEnum(scope) {
    const name = next();
    expect('{');
    const e = { kind: 'enum', name, full: scope.full ? `${scope.full}.${name}` : name, byNum: new Map(), byName: new Map() };
    while (peek() !== '}') {
      if (peek() === 'reserved' || peek() === 'option') { skipStatement(); continue; }
      const n = next();
      expect('=');
      const v = Number(next());
      if (peek() === '[') { while (next() !== ']'); }
      expect(';');
      if (!e.byNum.has(v)) e.byNum.set(v, n); // first name wins for aliases
      e.byName.set(n, v);
    }
    expect('}');
    scope.enums.set(name, e);
    return e;
  }

  function parseMessage(scope) {
    const name = next();
    expect('{');
    const m = {
      kind: 'message', name, full: scope.full ? `${scope.full}.${name}` : name,
      parent: scope, messages: new Map(), enums: new Map(),
      fields: new Map(), byName: new Map(), oneofs: new Map(), opaqueRest: false,
    };
    scope.messages.set(name, m);
    parseBody(m);
    expect('}');
    return m;
  }

  function parseField(m, oneof) {
    let repeated = false, optional = false;
    if (peek() === 'repeated') { next(); repeated = true; }
    else if (peek() === 'optional') { next(); optional = true; }
    const type = next();
    const fname = next();
    expect('=');
    const num = Number(next());
    if (peek() === '[') { while (next() !== ']'); }
    expect(';');
    const f = { name: fname, num, type, repeated, optional, oneof: oneof || null, owner: m };
    m.fields.set(num, f);
    m.byName.set(fname, f);
    return f;
  }

  function parseBody(m) {
    while (peek() !== '}' && peek() !== undefined) {
      const t = peek();
      if (t === 'message') { next(); parseMessage(m); }
      else if (t === 'enum') { next(); parseEnum(m); }
      else if (t === 'option') {
        next();
        if (peek() === 'opaque_rest') { next(); expect('='); m.opaqueRest = next() === 'true'; expect(';'); }
        else { while (peek() !== ';') next(); next(); }
      }
      else if (t === 'reserved') { skipStatement(); }
      else if (t === 'oneof') {
        next();
        const oname = next();
        expect('{');
        m.oneofs.set(oname, []);
        while (peek() !== '}') { const f = parseField(m, oname); m.oneofs.get(oname).push(f.name); }
        expect('}');
      } else if (t === ';') { next(); }
      else parseField(m, null);
    }
  }

  while (i < toks.length) {
    const t = next();
    if (t === 'syntax' || t === 'package' || t === 'import' || t === 'option') skipStatement();
    else if (t === 'message') parseMessage(root);
    else if (t === 'enum') parseEnum(root);
    else if (t === ';') continue;
    else throw new Error(`proto parse: unexpected top-level token '${t}'`);
  }

  function lookup(scope, name) {
    const parts = name.split('.');
    for (let s = scope; s; s = s.parent) {
      let cur = s, ok = true;
      for (let k = 0; k < parts.length; k++) {
        const p = parts[k];
        const last = k === parts.length - 1;
        const nxt = (cur.messages && cur.messages.get(p)) || (last && cur.enums && cur.enums.get(p));
        if (!nxt) { ok = false; break; }
        cur = nxt;
      }
      if (ok) return cur;
    }
    return null;
  }
  (function resolveAll(m) {
    for (const f of m.fields ? m.fields.values() : []) {
      if (SCALARS.has(f.type)) { f.scalar = f.type; continue; }
      const r = lookup(m, f.type);
      if (!r) throw new Error(`proto: cannot resolve type '${f.type}' in ${m.full}.${f.name}`);
      if (r.kind === 'enum') { f.scalar = 'enum'; f.enum = r; } else f.msg = r;
    }
    for (const c of m.messages.values()) resolveAll(c);
  })(root);
  return root;
}
