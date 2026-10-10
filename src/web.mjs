// Entry point of the browser bundle (web/miliastra-search.bundle.js, see scripts/build-web.mjs). It is the web twin of
// miliastra-search.mjs: install a host, then hand an ordinary command line to the very same engine. The page builds
// the command line from its form fields and shows whatever the engine printed; nothing else lives here.
import { setFiles } from './host-web.mjs';
import { safeMain } from './cli.mjs';
import { identifyFile } from './container.mjs';

export { identifyFile };

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
