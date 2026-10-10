// Tiny pure path helpers (the engine only ever prints and joins paths, it never touches the disk by itself).
// Both kinds of separator are accepted on input; everything the engine builds uses "/".
const SEP = /[\\/]/;

export const toPosix = (p) => p.replace(/\\/g, '/');

export function basename(p) {
  const parts = p.split(SEP).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}

/** Like node's path.extname: '' for no dot or a leading-dot-only name (".bashrc"). */
export function extname(p) {
  const b = basename(p), i = b.lastIndexOf('.');
  return i > 0 ? b.slice(i) : '';
}

export const join = (dir, name) => (dir === '' || /[\\/]$/.test(dir) ? dir + name : dir + '/' + name);
