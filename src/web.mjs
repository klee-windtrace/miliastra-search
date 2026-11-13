// Entry point of the browser bundle (web/miliastra-search.bundle.js, see scripts/build-web.mjs). It is the web twin of
// miliastra-search.mjs: install a host, then hand an ordinary command line to the very same engine. The page builds
// the command line from its form fields and shows whatever the engine printed; nothing else lives here.
import { setFiles } from './host-web.mjs';
import { safeMain } from './cli.mjs';
import { identifyFile as identifyContainer } from './container.mjs';
import { identifyReport } from './present/saved.mjs';

/**
 * What kind of file is this, from its content alone: { format: 'gia'|'gil', how, warnings } for a game file, { format: 'report', how: 'json', mode, files,
 * warnings } for a saved report (the header's mode and files), { format: null, reason } for anything else. Never throws.
 */
export function identifyFile(bytes) {
  const game = identifyContainer(bytes);
  if (game.format) return game;
  const report = identifyReport(bytes);
  return report ? { format: 'report', how: 'json', ...report, warnings: [] } : game;
}

/**
 * Run the CLI in memory. `files` is Map<path, Uint8Array> (the paths are what `argv` refers to).
 * Returns { code, out, err } = exit code, everything printed to stdout, everything printed to stderr.
 */
export function run(argv, files) {
  setFiles(files);
  let out = '', err = '';
  const code = safeMain(argv, { out: (t) => { out += t; }, err: (t) => { err += t; }, isTTY: false, env: {} });
  return { code, out, err };
}
