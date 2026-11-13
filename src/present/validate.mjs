// A small JSON Schema validator for schema/report.schema.json: no dependencies, only the keywords that schema uses
// ($ref to #/$defs/..., type, enum, const, properties, required, additionalProperties: false, items, oneOf).
// validate(value, schema) -> list of "path: problem" strings, empty when the value fits.

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const isType = (v, t) => (t === 'integer' ? Number.isInteger(v) : t === 'number' ? typeof v === 'number' && Number.isFinite(v) : typeOf(v) === t);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function lookup(root, ref) {
  if (!ref.startsWith('#/')) throw new Error(`unsupported $ref ${ref}`);
  let node = root;
  for (const part of ref.slice(2).split('/')) node = node?.[part];
  if (node === undefined) throw new Error(`unresolved $ref ${ref}`);
  return node;
}

export function validate(value, schema, root = schema, path = '$') {
  if (schema.$ref) return validate(value, lookup(root, schema.$ref), root, path);
  const errs = [];
  if ('const' in schema && !same(value, schema.const)) errs.push(`${path}: must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some((x) => same(x, value))) errs.push(`${path}: must be one of ${schema.enum.map((x) => JSON.stringify(x)).join(', ')}, got ${JSON.stringify(value)}`);
  if (schema.type) {
    const types = [].concat(schema.type);
    if (!types.some((t) => isType(value, t))) return [...errs, `${path}: expected ${types.join(' or ')}, got ${typeOf(value)}`];
  }
  if (typeOf(value) === 'object') {
    for (const k of schema.required ?? []) if (!(k in value)) errs.push(`${path}: missing "${k}"`);
    for (const [k, v] of Object.entries(value)) {
      if (schema.properties?.[k]) errs.push(...validate(v, schema.properties[k], root, `${path}.${k}`));
      else if (schema.additionalProperties === false) errs.push(`${path}: unexpected "${k}"`);
    }
  }
  if (typeOf(value) === 'array' && schema.items) value.forEach((v, i) => errs.push(...validate(v, schema.items, root, `${path}[${i}]`)));
  if (schema.oneOf) {
    const results = schema.oneOf.map((s) => validate(value, s, root, path));
    const hits = results.filter((r) => !r.length).length;
    if (hits === 0) {
      const best = results.reduce((a, b) => (b.length < a.length ? b : a)); // the alternative that came closest
      errs.push(`${path}: matches none of ${results.length} alternatives; closest: ${best.join('; ')}`);
    } else if (hits > 1) errs.push(`${path}: matches ${hits} alternatives, expected one`);
  }
  return errs;
}
