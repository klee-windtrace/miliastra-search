// The check report as lines (the `check` mode has no layout of its own: the document formats print the lines preformatted).
// Input: the `check` list of a check report (JSON.md), one item per file.
import { S, sep, gap } from './doc.mjs';

/** The lines (spans) of one file. */
export function checkLines(r) {
  const cl = [], ind = gap(3), two = sep('  ');
  cl.push(['== ', r.file, two, r.format, two, `engine ${r.engine_version}`, two, `mode ${r.mode}`, two, `resources ${r.resources} (${r.opaque_resources} not interpreted)`]);
  for (const w of r.container_warnings) cl.push([ind, 'container:', sep(), w]);
  if (!r.unknown_fields.length) cl.push([ind, 'schema census:', sep(), 'OK (every field in the file is known to the schema)']);
  for (const u of r.unknown_fields) cl.push([ind, 'UNKNOWN FIELD', sep(), u.path, sep(), `#${u.field}`, sep(), `wire ${u.wire}`, sep(), `×${u.count}`, u.note ? [sep(), u.note] : '', u.sample ? [sep(), `e.g. ${u.sample}`] : '']);
  for (const u of r.unresolved_nodes) cl.push([ind, S('keyword', 'UNRESOLVED'), sep(), `${u.what} ×`, S('count', u.count), sep(), `e.g. ${u.where.join(', ')}`]);
  const sect = r.opaque_sections, rest = r.opaque_fields;
  if (r.format === 'gil' && (sect.length || rest.length)) {
    cl.push([ind, 'uninterpreted level sections:', sep(), sect.map((x) => x.section).join(', ') || '-']);
    if (rest.length) cl.push([ind, 'uninterpreted fields inside listed resources:', sep(), `${rest.length} kinds (${rest.reduce((n, x) => n + x.count, 0)} occurrences; see --format json)`]);
  } else if (rest.length) cl.push([ind, 'opaque (known but uninterpreted) fields:', sep(), rest.map((x) => `${x.path}×${x.count}`).join(', ')]);
  return cl;
}

/** True when a check report finds something to complain about (what `check --strict` exits 1 for). */
export const checkFailed = (files) => files.some((f) => f.unknown_fields.length || f.unresolved_nodes.length || f.container_warnings.length);

/** Print the check report: the lines of every file, or only those matching --search / --match. */
export function printCheck(report, printer) {
  const cl = report.check.flatMap(checkLines);
  const title = `check ${report.header.files.join(', ')}`;
  return printer.grepping ? printer.grep([{ prefix: '', lines: cl }], title) : printer.lines(cl, title);
}
