// L0: container shared by .gia and .gil (and, by the same framing, .gip/.gir). All integers big-endian.
//   0  u32 file size - 4
//   4  u32 schema version          (1)
//   8  u32 head tag                (0x0326)
//   12 u32 file type               (1 GIP, 2 GIL, 3 GIA, 4 GIR)
//   16 u32 protobuf payload length (file size - 24)
//   20 ...payload...
//   -4 u32 tail tag                (0x0679)
//
// The format (GIA vs GIL) is decided from the *content*, never from the file name:
//   1. the file-type field of the header, cross-checked against
//   2. a shallow scan of the payload's top-level protobuf fields (GIA uses fields 1..5 only; a GIL level file
//      uses fields up to 49). When the two disagree clearly, the payload wins and a warning is recorded.

import { walkRaw } from './decode.mjs';

export class ContainerError extends Error {
  constructor(msg) { super(msg); this.name = 'ContainerError'; }
}

export const FILE_TYPES = { 1: 'gip', 2: 'gil', 3: 'gia', 4: 'gir' };
export const SUPPORTED_FORMATS = ['gia', 'gil'];
export const EXPECTED = { schemaVersion: 1, headTag: 0x0326, tailTag: 0x0679 };

/** Returns { payload, header, problems }. With {lenient:true} problems are returned instead of thrown. */
export function unwrapContainer(buf, { lenient = false } = {}) {
  const problems = [];
  const fail = (m) => { if (lenient) problems.push(m); else throw new ContainerError(m); };
  if (buf.length < 24 + 4) throw new ContainerError(`file too small to be a GIA/GIL container (${buf.length} bytes; need at least 28)`);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const hdr = {
    sizeMinus4: dv.getUint32(0), schemaVersion: dv.getUint32(4), headTag: dv.getUint32(8),
    fileType: dv.getUint32(12), payloadLen: dv.getUint32(16), tailTag: dv.getUint32(buf.length - 4),
  };
  const hex = (n) => '0x' + n.toString(16).padStart(4, '0');
  if (hdr.sizeMinus4 !== buf.length - 4) fail(`header size field says ${hdr.sizeMinus4}, but file is ${buf.length} bytes (expected ${buf.length - 4}) – truncated or corrupted file?`);
  if (hdr.schemaVersion !== EXPECTED.schemaVersion) fail(`unexpected container schema version ${hdr.schemaVersion} (expected ${EXPECTED.schemaVersion}) – the container format may have changed in a game update`);
  if (hdr.headTag !== EXPECTED.headTag) fail(`unexpected head tag ${hex(hdr.headTag)} (expected ${hex(EXPECTED.headTag)}) – not a GIA/GIL file, or the format changed`);
  if (!SUPPORTED_FORMATS.includes(FILE_TYPES[hdr.fileType])) {
    const known = FILE_TYPES[hdr.fileType];
    fail(known
      ? `file type ${hdr.fileType} is a .${known} file; only .gia (3) and .gil (2) are supported`
      : `unexpected file type ${hdr.fileType} (expected 2 = GIL or 3 = GIA)`);
  }
  if (hdr.payloadLen !== buf.length - 24) fail(`payload length field says ${hdr.payloadLen}, but ${buf.length - 24} bytes are present`);
  if (hdr.tailTag !== EXPECTED.tailTag) fail(`unexpected tail tag ${hex(hdr.tailTag)} (expected ${hex(EXPECTED.tailTag)})`);
  const end = Math.max(20, Math.min(buf.length - 4, 20 + hdr.payloadLen));
  const payload = buf.subarray(20, lenient && problems.length ? buf.length - 4 : end);
  return { payload, header: hdr, problems };
}

/** Cheap check used when collecting files from directories: does this look like a GIA/GIL container? */
export function looksLikeContainer(head) {
  if (head.length < 16) return false;
  const dv = new DataView(head.buffer, head.byteOffset, head.byteLength);
  return dv.getUint32(8) === EXPECTED.headTag && SUPPORTED_FORMATS.includes(FILE_TYPES[dv.getUint32(12)]);
}

/** Top-level protobuf field numbers of a payload (shallow; never throws). */
function topLevelFields(payload) {
  try { return walkRaw(payload).map((i) => ({ field: i.field, wire: i.wire })); } catch { return null; }
}

/**
 * Decide GIA vs GIL. `header.fileType` is authoritative unless the payload clearly says otherwise.
 * Returns { format: 'gia'|'gil', how: 'header'|'payload', warnings: [] }.
 * `forced` ('gia'|'gil') overrides everything (CLI --format).
 */
export function detectFormat(payload, header, forced = null) {
  const warnings = [];
  if (forced === 'gia' || forced === 'gil') return { format: forced, how: 'forced', warnings };
  const fromHeader = FILE_TYPES[header?.fileType];
  const fields = topLevelFields(payload);
  let sniff = null;
  if (fields && fields.length) {
    const nums = new Set(fields.map((f) => f.field));
    const high = [...nums].filter((n) => n >= 6).length;
    // A GIL level file always carries the node-graph section (10) and several other sections; a GIA payload
    // (AssetBundle) only knows fields 1..5.
    if (nums.has(10) || high >= 3) sniff = 'gil';
    else if (nums.has(1) && high === 0) sniff = 'gia';
  }
  if (fromHeader === 'gia' || fromHeader === 'gil') {
    if (sniff && sniff !== fromHeader) {
      warnings.push(`header says .${fromHeader} (file type ${header.fileType}) but the payload structure looks like .${sniff}; decoding as .${sniff}`);
      return { format: sniff, how: 'payload', warnings };
    }
    return { format: fromHeader, how: 'header', warnings };
  }
  if (sniff) return { format: sniff, how: 'payload', warnings };
  return { format: 'gia', how: 'default', warnings: ['could not tell .gia from .gil (unknown file type and ambiguous payload); assuming .gia'] };
}

/**
 * What kind of file is this? The one question a front-end asks about raw bytes, answered from the content alone
 * (never the name): { format: 'gia'|'gil', how: 'header'|'payload'|'default', warnings: string[] }, or
 * { format: null, reason } when it is not a GIA/GIL container. Never throws.
 */
export function identifyFile(buf) {
  let u;
  try { u = unwrapContainer(buf, { lenient: true }); } catch (e) { return { format: null, reason: e.message }; }
  if (!looksLikeContainer(buf)) return { format: null, reason: 'the header is not that of a .gia/.gil container' };
  const det = detectFormat(u.payload, u.header);
  return { format: det.format, how: det.how, warnings: [...u.problems, ...det.warnings] };
}
