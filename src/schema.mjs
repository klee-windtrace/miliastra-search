import { host } from './host.mjs';
import { parseProto } from './protoparse.mjs';

let cached;
export function loadSchema(file = null) {
  if (cached && cached.file === file) return cached.root;
  const text = file ? host.readText(file) : host.data('schema/gia.merged.proto');
  if (text == null) throw new Error('schema/gia.merged.proto is missing');
  const root = parseProto(text);
  cached = { file, root };
  return root;
}
