// Host for Node.js (the CLI, the tests, the scripts): the real file system. Importing this module installs it.
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import { setHost } from './host.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

setHost({
  fs: {
    readFile: (p) => nodeFs.readFileSync(p),
    head(p, n) {
      const fd = nodeFs.openSync(p, 'r');
      try { const b = Buffer.alloc(n); return b.subarray(0, nodeFs.readSync(fd, b, 0, n, 0)); } finally { nodeFs.closeSync(fd); }
    },
    stat(p) { try { return { dir: nodeFs.statSync(p).isDirectory() }; } catch (e) { if (e.code === 'ENOENT') return null; throw e; } },
    list: (p) => nodeFs.readdirSync(p),
    writeFile: (p, text) => nodeFs.writeFileSync(p, text),
  },
  data(rel) {
    try { return nodeFs.readFileSync(nodePath.join(root, rel), 'utf8'); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
  },
});
