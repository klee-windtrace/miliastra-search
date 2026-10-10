// The `info` mode: what the file itself says about itself, independent of the node graphs' contents.
//   fileInfo(bundle, db, { showTag })  -> plain data object (this is also the --json output)
//   infoBlocks(info)                   -> the same as a document (see src/doc.mjs)
// Covered here and nowhere else: container facts (format and how it was detected, size), engine version / mode / names,
// the export tag, how many resources of which class there are, how a .gil is laid out in sections and folders.
// The graph contents themselves are `dump`/`code`, the cross-references `refs`, the lint results `warns`.
import { S, marker } from './doc.mjs';
import { analyzeBundle } from './render.mjs';
import { FILE_TYPES } from './container.mjs';
import { folderLabel } from './model.mjs';

export const modeName = (bundle) => (bundle.modeFlag == null ? 'beyond' : bundle.modeFlag === 1 ? 'classic' : `mode#${bundle.modeFlag}`);

// What each level section of a .gil holds (see gil.mjs / FORMAT.md; the numbers are the root fields of the file).
export const SECTION_DESCRIPTIONS = {
  'root.4': 'templates: prefabs, player and character templates, creation templates',
  'root.5': 'entities placed in the level, plus the stage, player and character entities',
  'root.7': 'terrains',
  'root.9': 'UI: layouts and their controls',
  'root.10.1': 'node graphs (entity, status, class, item, skill, filter, creation graphs)',
  'root.10.2': 'node declarations: signals and composite declarations',
  'root.10.4': 'composite bodies: the graphs inside composite nodes',
  'root.10.6': 'struct definitions',
  'root.11.3': 'respawn points',
  'root.11.5': 'preset points',
  'root.12': 'global timers',
  'root.15': 'configs: unit statuses, classes, skills, items and the like',
  'root.18': 'cameras',
  'root.30': 'unit tags',
  'root.31': 'save data',
  'root.32': 'paths',
  'root.33': 'deployment groups',
  'root.44.1': 'scene templates, first list',
  'root.44.2': 'scene templates, second list',
};

const countBy = (items, keyOf) => { const m = new Map(); for (const x of items) { const k = keyOf(x); m.set(k, (m.get(k) || 0) + 1); } return m; };

export function fileInfo(bundle, db, { showTag = false } = {}) {
  const { graphs, mounts, R } = analyzeBundle(bundle, db);
  const isGil = bundle.format === 'gil';
  const res = bundle.resources;
  const kinds = countBy(res, (r) => r.kind);
  // one row per resource class, in class-id order (unknown classes last)
  const classes = [...countBy(res, (r) => `${r.classId ?? ''}\0${r.className}`)].map(([k, count]) => {
    const [id, name] = k.split('\0'); return { className: name, classId: id === '' ? null : Number(id), count };
  }).sort((a, b) => (a.classId ?? 1e9) - (b.classId ?? 1e9) || a.className.localeCompare(b.className));
  const info = {
    file: bundle.file,
    format: bundle.format,
    detected_by: bundle.formatDetectedBy,
    file_size: bundle.fileSize,
    container_file_type: FILE_TYPES[bundle.header?.fileType] ?? null,
    engine_version: bundle.engineVersion,
    mode: modeName(bundle),
    [isGil ? 'level_name' : 'export_name']: isGil ? bundle.level.name : bundle.exportTag.name,
    node_db_version: db.version ?? null,
    resources: res.length,
    ...(isGil ? {} : { primary: res.filter((r) => r.role === 'primary').length, dependencies: res.filter((r) => r.role === 'dependency').length }),
    graphs: graphs.length,
    nodes: graphs.reduce((n, r) => n + r.graph.nodes.length, 0),
    composite_bodies: graphs.filter((r) => r.graph.kind === 21002).length,
    declarations: kinds.get('interface') || 0,
    structs: kinds.get('struct') || 0,
    mounts: mounts.length,
    unresolved_node_types: R.unresolved.size,
    classes,
    container_warnings: bundle.warnings,
  };
  if (showTag) info.export_tag = isGil ? null : { raw: bundle.exportTag.raw, uid: bundle.exportTag.uid, time: bundle.exportTag.time, file_id: bundle.exportTag.fileId };
  if (isGil) {
    info.sections = [...countBy(res, (r) => r.section ?? '?')].map(([section, count]) => ({ section, count, description: SECTION_DESCRIPTIONS[section] ?? null }))
      .sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true }));
    // the editor's resource folders (graphs, composites, prefabs, statuses, skills, ... are filed in them), with the number of graphs and of
    // other resources in each, in the order the resources are listed. Folders of different resource types that share a name are counted together.
    const filed = res.filter((r) => folderLabel(r) != null);
    info.folders = [...countBy(filed, folderLabel)].map(([name, total]) => { const graphs = filed.filter((r) => r.kind === 'graph' && folderLabel(r) === name).length; return { name, graphs, resources: total - graphs }; });
  }
  return info;
}

/**
 * The File and Contents tables as rows: { file: [[key, value]], contents: [[key, value]] } (`--key` reads from the same rows).
 * The export tag rows belong to File and are only there with `showTag`.
 */
export function infoRows(info, { showTag = false } = {}) {
  const nameKey = info.level_name !== undefined ? 'level_name' : 'export_name';
  const file = [['format', info.format], ['detected_by', info.detected_by], ['file_size', info.file_size], ['container_file_type', info.container_file_type ?? '-'],
    ['engine_version', info.engine_version], ['mode', info.mode], [nameKey, info[nameKey]], ['node_db_version', info.node_db_version ?? '-']];
  if (showTag) {
    const t = info.export_tag;
    file.push(...(t ? [['export_tag', t.raw ?? 'null'], ['uid', t.uid ?? '-'], ['time', t.time ?? '-'], ['file_id', t.file_id ?? '-']] : [['export_tag', 'null']]));
  }
  const contents = [['resources', info.resources], ...(info.primary !== undefined ? [['primary', info.primary], ['dependencies', info.dependencies]] : []),
    ['graphs', info.graphs], ['nodes', info.nodes], ['composite_bodies', info.composite_bodies], ['declarations', info.declarations], ['structs', info.structs], ['mounts', info.mounts], ['unresolved_node_types', info.unresolved_node_types]];
  return { file, contents };
}

/** The value `--key KEY` prints: a property of the File or Contents table, or the count of a resource class (by class name). Case-insensitive; undefined when there is none. */
export function infoValue(info, key) {
  const k = String(key).toLowerCase();
  const { file, contents } = infoRows(info, { showTag: true });
  const row = [...file, ...contents].find(([name]) => name.toLowerCase() === k);
  if (row) return String(row[1]);
  const cls = info.classes.find((c) => c.className.toLowerCase() === k);
  return cls ? String(cls.count) : undefined;
}

/**
 * The info document of one file. Line formats: `# FILE`, the File and Contents tables as `key  value` lines (one column of keys, padded, one of values),
 * then CLASS / SECTION (with a description) / FOLDER lines. The document formats show the same tables as real tables.
 */
export function infoBlocks(info, { showTag = false } = {}) {
  const blocks = [];
  const kw = (t) => S('keyword', t);
  const kv = (k, v) => [S('metaKey', k), '=', S('metaValue', v)];
  blocks.push({ t: 'title', spans: ['File ', S('fileName', info.file)], text: [[marker('# '), S('heading', 'FILE'), ' ', S('fileName', info.file)]] });
  const { file, contents } = infoRows(info, { showTag });
  const width = Math.max(...[...file, ...contents].map(([k]) => k.length)); // both tables share the key column, so they read as one
  const table = (rows) => ({ t: 'table', cols: [{ title: 'Property' }, { title: 'Value' }], rows: rows.map(([k, v]) => [S('metaKey', k), S('metaValue', v)]),
    text: rows.map(([k, v]) => [S('metaKey', k), ' '.repeat(width - k.length + 2), S('metaValue', v)]) });
  blocks.push({ t: 'heading', level: 2, spans: 'File', text: null });
  blocks.push(table(file));
  for (const w of info.container_warnings) blocks.push({ t: 'note', level: 'warn', spans: ['Container warning: ', w], text: [[marker('# '), S('warn', 'CONTAINER WARNING:'), ' ', w]] });
  blocks.push({ t: 'heading', level: 2, spans: 'Contents', text: null });
  blocks.push(table(contents));
  blocks.push({ t: 'heading', level: 3, spans: 'Resources by class', text: null });
  blocks.push({ t: 'table', cols: [{ title: 'Class' }, { title: 'Class id', align: 'right' }, { title: 'Count', align: 'right' }],
    rows: info.classes.map((c) => [S('className', c.className), c.classId != null ? String(c.classId) : '-', S('count', c.count)]),
    text: info.classes.map((c) => [kw('CLASS'), ' ', S('className', c.className), ' ', ...kv('class', c.classId ?? '-'), ' ', ...kv('count', c.count)]) });
  if (info.sections) {
    blocks.push({ t: 'heading', level: 3, spans: 'Level sections', text: null });
    blocks.push({ t: 'table', cols: [{ title: 'Section' }, { title: 'Resources', align: 'right' }, { title: 'Description' }], rows: info.sections.map((s) => [S('metaValue', s.section), S('count', s.count), s.description ?? '']),
      text: info.sections.map((s) => [kw('SECTION'), ' ', S('metaValue', s.section), ' ', ...kv('resources', s.count), s.description ? [' ', S('metaKey', 'description'), '=', S('string', s.description)] : '']) });
  }
  if (info.folders?.length) {
    // graphs first, then the other resources; a zero is left out
    blocks.push({ t: 'heading', level: 3, spans: 'Resource folders', text: null });
    blocks.push({ t: 'table', cols: [{ title: 'Folder' }, { title: 'Graphs', align: 'right' }, { title: 'Resources', align: 'right' }],
      rows: info.folders.map((f) => [S('folderName', f.name), f.graphs ? S('count', f.graphs) : '', f.resources ? S('count', f.resources) : '']),
      text: info.folders.map((f) => [kw('FOLDER'), ' ', S('folderName', f.name), f.graphs ? [' ', ...kv('graphs', f.graphs)] : '', f.resources ? [' ', ...kv('resources', f.resources)] : '']) });
  }
  return blocks;
}
