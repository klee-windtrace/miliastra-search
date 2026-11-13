// The `check` mode: is everything in the file known to the decoder? One plain object per file (an item of `check` in the check report, see JSON.md; src/present/check.mjs prints it).
import { analyzeBundle } from './analyze.mjs';
import { modeName } from './info.mjs';

// opaque fields are counted per full path; the report lists them by their last two segments ("GilFile.opaque_3", "Message.opaque_7")
const shortPath = (p) => p.split('.').slice(-2).join('.');

export function fileCheck(bundle, db, { analysis = null } = {}) {
  const { R } = analysis ?? analyzeBundle(bundle, db); // the analysis fills the unresolved node types
  const opaque = new Map();
  for (const [path, n] of bundle.census.opaque.entries()) opaque.set(shortPath(path), (opaque.get(shortPath(path)) || 0) + n);
  const entries = [...opaque].map(([path, count]) => ({ path, count }));
  return {
    file: bundle.file,
    format: bundle.format,
    engine_version: bundle.engineVersion,
    mode: modeName(bundle),
    resources: bundle.resources.length,
    opaque_resources: bundle.resources.filter((r) => r.kind === 'opaque').length,
    container_warnings: bundle.warnings,
    unknown_fields: bundle.census.entries().map((u) => ({ path: u.path, field: u.field, wire: u.wire, count: u.count, note: u.note ?? null, sample: u.sample ?? null })),
    // level sections of a .gil that the decoder lists but does not interpret ("root.3"), and the opaque fields inside everything else
    opaque_sections: entries.filter((x) => x.path.startsWith('GilFile.')).map((x) => ({ section: x.path.replace('GilFile.opaque_', 'root.'), count: x.count })),
    opaque_fields: entries.filter((x) => !x.path.startsWith('GilFile.')),
    unresolved_nodes: [...R.unresolved.values()].map((u) => ({ what: String(u.label), count: u.count, where: u.where })),
  };
}
