// Host for the browser page: the "file system" is a Map of name -> bytes that the page fills with the files the person
// added, and the data files shipped with the tool are embedded in the bundle ('miliastra:resources' is a virtual module
// that scripts/build-web.mjs generates from data/ and schema/). Importing this module installs the host.
import { setHost } from './host.mjs';
import { RESOURCES } from 'miliastra:resources';

let files = new Map();
/** Replace the files the engine can see: Map<path, Uint8Array>. */
export const setFiles = (m) => { files = m; };

const enc = new TextEncoder();
const norm = (p) => p.replace(/\/+$/, '');

setHost({
  fs: {
    readFile(p) {
      const b = files.get(p);
      if (!b) throw Object.assign(new Error(`no such file: ${p}`), { code: 'ENOENT' });
      return b;
    },
    head: (p, n) => files.get(p)?.subarray(0, n) ?? new Uint8Array(0),
    stat(p) {
      if (files.has(p)) return { dir: false };
      const d = norm(p) + '/';
      for (const k of files.keys()) if (k.startsWith(d)) return { dir: true };
      return null;
    },
    list(p) {
      const d = norm(p) + '/', names = new Set();
      for (const k of files.keys()) if (k.startsWith(d)) names.add(k.slice(d.length).split('/')[0]);
      return [...names];
    },
    writeFile(p, text) { files.set(p, enc.encode(text)); },
  },
  data: (rel) => RESOURCES[rel] ?? null,
});
