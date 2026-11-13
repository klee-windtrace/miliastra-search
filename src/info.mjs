// The `info` mode: what the file itself says about itself, independent of the node graphs' contents.
//   fileInfo(bundle, db)  -> plain data object: one item of `info` in the info report (see JSON.md)
// Covered here and nowhere else: container facts (format and how it was detected, size), engine version / mode / names,
// the export tag, how many resources of which class there are, how a .gil is laid out in sections and folders.
// The graph contents themselves are `dump`/`code`, the cross-references `refs`, the lint results `warns`.
import { analyzeBundle } from './analyze.mjs';
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

/**
 * What `info` reports about one decoded file. Every key is always there: a fact that does not apply to this kind of file (the level name of a
 * .gia, the sections of a .gil, ...) is null. The export tag is in the data only with `showTag`; otherwise `export_tag` is null, as for a .gil.
 */
export function fileInfo(bundle, db, { showTag = false, analysis = null } = {}) {
  const { graphs, mounts, R } = analysis ?? analyzeBundle(bundle, db);
  const isGil = bundle.format === 'gil';
  const res = bundle.resources;
  const kinds = countBy(res, (r) => r.kind);
  // one row per resource class, in class-id order (unknown classes last)
  const classes = [...countBy(res, (r) => `${r.classId ?? ''}\0${r.className}`)].map(([k, count]) => {
    const [id, name] = k.split('\0'); return { class_name: name, class_id: id === '' ? null : Number(id), count };
  }).sort((a, b) => (a.class_id ?? 1e9) - (b.class_id ?? 1e9) || a.class_name.localeCompare(b.class_name));
  // the editor's resource folders (graphs, composites, prefabs, statuses, skills, ... are filed in them), with the number of graphs and of
  // other resources in each, in the order the resources are listed. Folders of different resource types that share a name are counted together.
  const filed = res.filter((r) => folderLabel(r) != null);
  return {
    file: bundle.file,
    format: bundle.format,
    detected_by: bundle.formatDetectedBy,
    file_size: bundle.fileSize,
    container_file_type: FILE_TYPES[bundle.header?.fileType] ?? null,
    engine_version: bundle.engineVersion,
    mode: modeName(bundle),
    level_name: isGil ? bundle.level.name ?? null : null,
    export_name: isGil ? null : bundle.exportTag.name ?? null,
    node_db_version: db.version ?? null,
    resources: res.length,
    primary: isGil ? null : res.filter((r) => r.role === 'primary').length,
    dependencies: isGil ? null : res.filter((r) => r.role === 'dependency').length,
    graphs: graphs.length,
    nodes: graphs.reduce((n, r) => n + r.graph.nodes.length, 0),
    composite_bodies: graphs.filter((r) => r.graph.kind === 21002).length,
    declarations: kinds.get('interface') || 0,
    structs: kinds.get('struct') || 0,
    mounts: mounts.length,
    unresolved_node_types: R.unresolved.size,
    container_warnings: bundle.warnings,
    export_tag: isGil || !showTag ? null : { raw: bundle.exportTag.raw ?? null, uid: bundle.exportTag.uid ?? null, time: bundle.exportTag.time ?? null, file_id: bundle.exportTag.fileId ?? null },
    classes,
    sections: isGil ? [...countBy(res, (r) => r.section ?? '?')].map(([section, count]) => ({ section, count, description: SECTION_DESCRIPTIONS[section] ?? null }))
      .sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true })) : null,
    folders: isGil ? [...countBy(filed, folderLabel)].map(([name, total]) => { const graphs = filed.filter((r) => r.kind === 'graph' && folderLabel(r) === name).length; return { name, graphs, resources: total - graphs }; }) : null,
  };
}
