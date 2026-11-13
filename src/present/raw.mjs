// The raw report as lines: the payload tree printed one field per line, nested messages indented in braces.
// Input: the `raw` object of a raw report (JSON.md).
import { sep, gap } from './doc.mjs';

/** The lines (spans) of a message (`{ error, fields }`) at `indent` levels of nesting. */
export function treeLines(message, indent = 0) {
  const pad = gap(2 * indent, indent);
  if (message.error != null) return [[pad, `<unparseable: ${message.error}>`]];
  const out = [];
  for (const f of message.fields) {
    const name = `${f.field}:`;
    switch (f.type) {
      case 'varint': out.push([pad, name, sep(), String(f.value)]); break;
      case 'f32': case 'f64': out.push([pad, name, sep(), f.type, sep(), String(f.value)]); break;
      case 'string': out.push([pad, name, sep(), JSON.stringify(f.value)]); break;
      case 'message': out.push([pad, name, sep(), '{'], ...treeLines(f.message, indent + 1), [pad, '}']); break;
      default: out.push([pad, name, sep(), `bytes(${f.length})`, sep(), `${f.hex}${f.truncated ? '…' : ''}`]);
    }
  }
  return out;
}

/** Print the raw report: the container warnings, then the tree; or only the lines matching --search / --match. */
export function printRaw(report, printer) {
  const lines = [...report.raw.container_warnings.map((p) => ['# CONTAINER WARNING:', sep(), p]), ...treeLines(report.raw.payload)];
  const title = `raw ${report.header.files[0]}`;
  return printer.grepping ? printer.grep([{ prefix: '', lines }], title) : printer.lines(lines, title);
}
