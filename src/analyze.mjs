// L4: the analysis of one file that the reports of `dump` and `code` (and refs) share: resolved node names, graph labels, mounts, and the
// declarations a listing leaves out.
import { typeName } from './model.mjs';
import { Resolver } from './resolve.mjs';
import { mountsOf } from './mounts.mjs';

export function pinTypeLabel(pin, graph) {
  const backend = graph.service === 20000 || [20003, 20004, 20005].includes(graph.service) ? 1 : 2;
  if (pin.typeId == null) return null;
  return typeName(backend, pin.typeId);
}

export function baseGraphName(res, R) {
  const g = res.graph;
  if (g.name) return g.name;
  if (res.name) return res.name;
  if (g.kind === 21002 && R) { const decl = R.declForBody(res); if (decl) return `<composite>${decl.iface.name || decl.name}`; }
  return `graph#${res.guid}`;
}
export function graphLabel(res, dupNames, R) {
  const base = baseGraphName(res, R);
  return dupNames.has(base) ? `${base}#${res.guid}` : base;
}

/**
 * service_domain -> graph-name tag. Only the domains that need one are listed; the other server domains
 * (basic 20000, item 20005) are ordinary graphs and get none.
 *   SERVER_STATUS(20003) -> status
 *   SERVER_CLASS(20004) -> class   (a class graph is mounted on a class, never on an entity)
 *   CLIENT_FILTER(20001, bool) / CLIENT_INT_FILTER(20006) -> filter
 *   CLIENT_SKILL(20002, character) / CLIENT_CHARACTER_CONTROL_SKILL(20010, control) -> skill
 *   CLIENT_CREATION_STATUS_DECISION(20007) / CLIENT_CREATION_SKILL(20008) / CLIENT_CREATION_STATUS(20009) -> creation
 */
export const GRAPH_SERVICE_TAG = {
  20003: 'status',
  20004: 'class',
  20001: 'filter', 20006: 'filter',
  20002: 'skill', 20010: 'skill',
  20007: 'creation', 20008: 'creation', 20009: 'creation',
};

/**
 * Like graphLabel, but prefixed with "<composite>" for a composite body (locator kind 21002, which is not a node graph
 * the user enters) or with the GRAPH_SERVICE_TAG tag of the graph's service domain. Used wherever a graph name is
 * shown outside its own section heading (refs, mounts), so the name carries enough context to find the graph in the editor.
 */
export function taggedGraphLabel(res, dupNames, R) {
  const g = res.graph;
  if (g.kind === 21002) {
    const decl = R.declForBody(res);
    const base = baseGraphName(res, R); // "<composite>Name" or a plain name; the prefix is normalised below
    const label = dupNames.has(base) ? `${base}#${res.guid}` : base;
    return `<composite>${label.replace(/^(?:composite:|<composite>)/, "")}`;
  }
  const label = graphLabel(res, dupNames, R);
  const tag = GRAPH_SERVICE_TAG[g.service];
  return tag ? `<${tag}>${label}` : label;
}

/**
 * Phase 1 of the dump: everything that needs the whole file before anything is printed. Resolves every node name
 * (which also collects the unresolved node types), numbers duplicate graph names, and joins graph mounts with their hosts.
 * The reports (`dump`, `code`, `info`, `check`) all read this and never change it.
 */
export function analyzeBundle(bundle, db) {
  const R = new Resolver(bundle, db);
  const graphs = bundle.resources.filter((r) => r.kind === 'graph' && r.graph);
  const seen = new Map(), dup = new Set();
  for (const r of graphs) { const b = baseGraphName(r, R); if (seen.has(b)) dup.add(b); seen.set(b, 1); }
  const mounts = mountsOf(bundle);
  const mountsOfHost = new Map();  // host resource -> its mounts
  for (const m of mounts) { if (!mountsOfHost.has(m.host)) mountsOfHost.set(m.host, []); mountsOfHost.get(m.host).push(m); }
  const nodeLabel = new Map(); // graph -> Map(index -> info)
  // First pass: resolve names so edges can refer to targets by name.
  for (const r of graphs) {
    const g = r.graph; const m = new Map();
    for (const n of g.nodes) m.set(n.index, R.node(g, n, `${graphLabel(r, dup, R)}/[${n.index}]`));
    nodeLabel.set(g, m);
  }
  return { R, graphs, dup, mounts, mountsOfHost, nodeLabel };
}

/**
 * The declarations a listing leaves out of the second half of a send-signal pair: a send signal is declared twice, the node used in the server
 * graphs and its twin for the other service domain ("... to Server Node Graph"); each names the other as its client node. Only the half living in
 * its server node's domain is listed. Returns a predicate over resources.
 */
export function hiddenDeclarations(bundle) {
  const sendDecls = bundle.resources.filter((x) => x.kind === 'interface' && x.iface?.sendSignal);
  return (r) => {
    const s = r.iface?.sendSignal;
    if (!s) return false;
    const twin = sendDecls.find((p) => p !== r && p.iface.sendSignal.name === s.name && String(p.guid) === String(s.client?.id) && String(r.guid) === String(p.iface.sendSignal.client?.id));
    if (!twin) return false;
    const own = (x) => x.iface.id?.shell?.service, server = (x) => x.iface.sendSignal.server?.service;
    const mine = own(r) === server(r), theirs = own(twin) === server(twin);
    return mine === theirs ? twin.idx < r.idx : !mine; // the half living in its server node's domain stays
  };
}

/** What every per-file listing starts with and ends with: the file, its warnings and versions, and the node types without a name. */
export function fileFacts(bundle, db) {
  return {
    file: bundle.file,
    container_warnings: bundle.warnings,
    engine_version: bundle.engineVersion,
    node_db_version: db.version ?? null,
  };
}
export const unresolvedNodes = (R) => [...R.unresolved.values()].map((u) => ({ what: String(u.label), count: u.count, where: u.where }));
