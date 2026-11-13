// The info report as a document (see doc.mjs). Input: the `info` list of an info report (JSON.md), one item per file.
import { S, marker, sep, gap } from './doc.mjs';

/**
 * The File and Contents tables as rows: { file: [[key, value]], contents: [[key, value]] } (`--key` reads from the same rows).
 * The export tag rows belong to File and are only there with `showTag`; a .gil has no tag (`export_tag` is null).
 */
export function infoRows(info, { showTag = false } = {}) {
  const nameKey = info.format === 'gil' ? 'level_name' : 'export_name';
  const file = [['format', info.format], ['detected_by', info.detected_by], ['file_size', info.file_size], ['container_file_type', info.container_file_type ?? '-'],
    ['engine_version', info.engine_version], ['mode', info.mode], [nameKey, info[nameKey]], ['node_db_version', info.node_db_version ?? '-']];
  if (showTag) {
    const t = info.export_tag;
    file.push(...(t ? [['export_tag', t.raw ?? 'null'], ['uid', t.uid ?? '-'], ['time', t.time ?? '-'], ['file_id', t.file_id ?? '-']] : [['export_tag', 'null']]));
  }
  const contents = [['resources', info.resources], ...(info.primary != null ? [['primary', info.primary], ['dependencies', info.dependencies]] : []),
    ['graphs', info.graphs], ['nodes', info.nodes], ['composite_bodies', info.composite_bodies], ['declarations', info.declarations], ['structs', info.structs], ['mounts', info.mounts], ['unresolved_node_types', info.unresolved_node_types]];
  return { file, contents };
}

/** The value `--key KEY` prints: a property of the File or Contents table (the tag parts only when the report has the tag rows), or the count of a resource class (by class name). Case-insensitive; undefined when there is none. */
export function infoValue(info, key, { showTag = false } = {}) {
  const k = String(key).toLowerCase();
  const { file, contents } = infoRows(info, { showTag });
  const row = [...file, ...contents].find(([name]) => name.toLowerCase() === k);
  if (row) return String(row[1]);
  const cls = info.classes.find((c) => c.class_name.toLowerCase() === k);
  return cls ? String(cls.count) : undefined;
}

/**
 * The info document of one file. Line formats: `# FILE`, the File and Contents tables as `key  value` lines (one column of keys, padded, one of values),
 * then CLASS / SECTION (with a description) / FOLDER lines. The document formats show the same tables as real tables.
 * `short` (a rendering option) leaves out the level sections and the class ids.
 */
export function infoBlocks(info, { showTag = false, short = false } = {}) {
  const blocks = [];
  const kw = (t) => S('keyword', t);
  const kv = (k, v) => [S('metaKey', k), '=', S('metaValue', v)];
  blocks.push({ t: 'title', spans: ['File ', S('fileName', info.file)], text: [[marker('# '), S('heading', 'FILE'), sep(), S('fileName', info.file)]] });
  const { file, contents } = infoRows(info, { showTag });
  const width = Math.max(...[...file, ...contents].map(([k]) => k.length)); // both tables share the key column, so they read as one
  const table = (rows) => ({ t: 'table', cols: [{ title: 'Property' }, { title: 'Value' }], rows: rows.map(([k, v]) => [S('metaKey', k), S('metaValue', v)]),
    text: rows.map(([k, v]) => [S('metaKey', k), gap(width - k.length + 2), S('metaValue', v)]) });
  blocks.push({ t: 'heading', level: 2, spans: 'File', text: null });
  blocks.push(table(file));
  for (const w of info.container_warnings) blocks.push({ t: 'note', level: 'warn', spans: ['Container warning: ', w], text: [[marker('# '), S('warn', 'CONTAINER WARNING:'), sep(), w]] });
  blocks.push({ t: 'heading', level: 2, spans: 'Contents', text: null });
  blocks.push(table(contents));
  blocks.push({ t: 'heading', level: 3, spans: 'Resources by class', text: null });
  blocks.push({ t: 'table', cols: [{ title: 'Class' }, ...(short ? [] : [{ title: 'Class id', align: 'right' }]), { title: 'Count', align: 'right' }],
    rows: info.classes.map((c) => [S('className', c.class_name), ...(short ? [] : [c.class_id != null ? String(c.class_id) : '-']), S('count', c.count)]),
    text: info.classes.map((c) => [kw('CLASS'), sep(), S('className', c.class_name), short ? '' : [sep(), ...kv('class', c.class_id ?? '-')], sep(), ...kv('count', c.count)]) });
  if (info.sections && !short) {
    blocks.push({ t: 'heading', level: 3, spans: 'Level sections', text: null });
    blocks.push({ t: 'table', cols: [{ title: 'Section' }, { title: 'Resources', align: 'right' }, { title: 'Description' }], rows: info.sections.map((s) => [S('metaValue', s.section), S('count', s.count), s.description ?? '']),
      text: info.sections.map((s) => [kw('SECTION'), sep(), S('metaValue', s.section), sep(), ...kv('resources', s.count), s.description ? [sep(), S('metaKey', 'description'), '=', S('string', s.description)] : '']) });
  }
  if (info.folders?.length) {
    // graphs first, then the other resources; a zero is left out
    blocks.push({ t: 'heading', level: 3, spans: 'Resource folders', text: null });
    blocks.push({ t: 'table', cols: [{ title: 'Folder' }, { title: 'Graphs', align: 'right' }, { title: 'Resources', align: 'right' }],
      rows: info.folders.map((f) => [S('folderName', f.name), f.graphs ? S('count', f.graphs) : '', f.resources ? S('count', f.resources) : '']),
      text: info.folders.map((f) => [kw('FOLDER'), sep(), S('folderName', f.name), f.graphs ? [sep(), ...kv('graphs', f.graphs)] : '', f.resources ? [sep(), ...kv('resources', f.resources)] : '']) });
  }
  return blocks;
}

const TAG_KEYS = new Set(['export_tag', 'uid', 'time', 'file_id']);

/** The info report as the groups a printer takes (one document per file; see emit.mjs). */
export function infoGroups(report, { noFilePrefix = false, short = false } = {}) {
  const multi = report.header.files.length > 1;
  const { show_tag: showTag } = report.header.options;
  return report.info.map((info) => ({ prefix: multi && !noFilePrefix ? info.file + ':' : '', blocks: infoBlocks(info, { showTag, short }) }));
}

/** Print the info report: the whole document, the lines matching --search / --match, or with `key` only that value of each file. */
export function printInfo(report, printer, { key = null, noFilePrefix = false, short = false } = {}) {
  const { files, options } = report.header;
  const prefixed = files.length > 1 && !noFilePrefix;
  const title = `info ${files.join(', ')}`;
  if (key != null) { // only the values, for scripts; the same plain lines in every format
    const values = [];
    for (const info of report.info) {
      const v = infoValue(info, key, { showTag: options.show_tag });
      if (v === undefined) { printer.error(`${info.file}: no property or resource class "${key}" (see info for the File and Contents tables and the class names)${TAG_KEYS.has(String(key).toLowerCase()) && !options.show_tag ? '; the export tag needs --show-tag' : ''}`); continue; }
      values.push(prefixed ? `${info.file}:${v}` : v);
    }
    return values.length ? printer.lines(values, title) : null; // nothing to print: not even an empty file
  }
  return printer.groups(infoGroups(report, { noFilePrefix, short }), title, true);
}
