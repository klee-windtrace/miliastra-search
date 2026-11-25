// How plain values are written in the text a run prints.
import { S, join } from './doc.mjs';

/** A float32 as the shortest decimal that reads back as the same float32. */
export function f32(v) {
  if (!Number.isFinite(v)) return String(v);
  for (let p = 1; p <= 9; p++) { const s = Number(v.toPrecision(p)); if (Math.fround(s) === v) return String(s); }
  return String(v);
}
/** A float with at least two decimals (`0` is `0.00`); more of them are kept as they are. */
export function flt(x) {
  const s = f32(x);
  if (/[eE]|^-?(Infinity|NaN)$/.test(s)) return s;
  const [whole, frac = ''] = s.split('.');
  return frac.length >= 2 ? s : `${whole}.${frac.padEnd(2, '0')}`;
}
/** Inner text of a quoted string literal (escapes \\, ' and newline); the theme adds the quotes. */
export const qi = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
export const qs = (s) => S('string', qi(s));
/** Inner text of a double-quoted string literal (escapes \\, " and newline); the theme adds the quotes. */
export const qd = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n');

/** Whether a `value` object of a code report is shown: any value that is there (an unedited one is the game's default, an empty list or map is a value). */
export const shownValue = (val) => !!val;

/**
 * A `value` object of a code report (JSON.md) as spans, each kind of value in its own theme style, or null when there is no value.
 * A hole inside a list or struct is `_`.
 */
export function valueSpans(val) {
  if (!shownValue(val)) return null;
  const spans = plainSpans(val);
  // what an id points at in the file (custom variable values carry it), written like the resource of a pin
  return val.resource ? [spans, ' {', S('className', val.resource.class_name), ':', S('key', val.resource.name), '}'] : spans;
}
function plainSpans(val) {
  const sub = (v) => valueSpans(v) ?? '_';
  const list = (items) => join(items.map(sub), ', ');
  switch (val.kind) {
    case 'int': return S('number', val.value);
    case 'float': return S('number', flt(val.value));
    case 'str': return qs(val.value);
    // an id of 0 points at nothing: it reads like the other keywords of a value
    case 'id': return val.value === 0 ? S('bool', 'null') : S('idValue', `id:${val.value}`);
    case 'vec': return S('vector', `(${val.value.map(f32).join(', ')})`);
    case 'bool': return S('bool', val.value ? 'true' : 'false');
    case 'enum': {
      const { names } = val;
      if (names.length === 1) return S('enumValue', `enum:${val.value}«${names[0]}»`);
      if (names.length > 1) return S('enumValue', `enum:${val.value}«${names.slice(0, 3).join(' | ')}${names.length > 3 ? ' |…' : ''}»`);
      return S('enumValue', `<unknown-enum:${val.value}>`);
    }
    case 'list': return ['[', list(val.items), ']'];
    case 'struct': return ['struct{', list(val.items), '}'];
    case 'pair': return [sub(val.key), ': ', sub(val.value)];
    case 'map': return ['{', list(val.pairs), '}'];
    default: return `<value:${val.kind}>`;
  }
}
