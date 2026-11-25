// The explanation that stands in front of the first graph of a pseudocode document written with --lazy (the form meant for a language model), as one gray block comment. It says what the code is and what its
// conventions mean, for a reader who has not seen the format; what is plain JavaScript (`Exit()`, `GoTo()`, `await`) is left out. It is plain text, one line per
// array item: edit it here, then `npm run update-expected` (the tests do not compare it).
export const PSEUDOCODE_INTRO = [
  'JS-alike pseudocode dump from a Blueprint-alike game engine.',
  'Type definitions: Int (integer), Flt (float), Str (string), Bol (boolean), Vec (3D vector), Ety (entity), Gid (GUID), Cfg (configuration ID), Pfb (prefab ID),',
  'Fct (faction), Enum (enumeration), Struct (structure), Loc (local variable), Any (generic/unset), Lxxx (list of [xxx], e.g. LInt), Dict(k,v,expr) - treat expr as a dictionary of {k:v}.',
  'Each top-level node_xxxx case is an execution node, a chain starts on event_xxxx nodes; global state $ also holds cached output values of execution/event nodes.',
  'Data nodes that provide pin values are re-evaluated per execution node call, expressed here as full copies (node id is kept in data_xxxx arg only for convenience to refer nodes in the editor);',
  'however, for composite nodes (Comp_xxxx) and local variables (Var_xxxx) the node id matters for the logic: each one is an instance with a state of its own.',
  "A case with `throw 'unreachable'` does not come from any event and can't execute; `case 'orphaned'` holds unused data nodes.",
];
