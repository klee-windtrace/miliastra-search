// The only door from the engine to the outside world. Everything that is not pure computation (reading files,
// writing a report, loading the bundled data files) goes through here, and the *entry point* decides what is behind it:
//   miliastra-search.mjs -> imports ./host-node.mjs   (real file system)
//   web/ bundle          -> imports ./host-web.mjs    (files held in memory, data files embedded in the bundle)
// The engine itself never asks "where am I running": it calls these functions and whoever started the process has
// installed the implementation first. A new need for the outside world = a new function here + one line in each host.
//
// A host is { fs, data }:
//   fs.readFile(path) -> Uint8Array        fs.head(path, n) -> Uint8Array (first n bytes)
//   fs.stat(path) -> null | { dir: boolean }   fs.list(dir) -> string[] (names, any order)   fs.writeFile(path, text)
//   data(relPath) -> string | null          a file shipped with the tool, relative to the project root ('data/nodes.json')

let current = null;

export function setHost(h) { current = h; }

function need() {
  if (!current) throw new Error('no host installed: the entry point must import src/host-node.mjs or src/host-web.mjs before using the engine');
  return current;
}

export const host = {
  fs: {
    readFile: (p) => need().fs.readFile(p),
    head: (p, n) => need().fs.head(p, n),
    stat: (p) => need().fs.stat(p),
    list: (p) => need().fs.list(p),
    writeFile: (p, text) => need().fs.writeFile(p, text),
  },
  data: (rel) => need().data(rel),
  /** Text of a file: bytes decoded as UTF-8 (a leading BOM is dropped). */
  readText(p) { return new TextDecoder('utf-8').decode(need().fs.readFile(p)); },
};
