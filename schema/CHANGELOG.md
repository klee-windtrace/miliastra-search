# gia.merged.proto – notes

Fields and messages that need explaining beyond the comments in the file. Additions are marked `[MERGED]` in the file. Wire numbers are the game's.

## Fields worth knowing
| Field | Notes |
|---|---|
| `AssetBundle.resources = 1` (repeated) | The game writes one field-1 entry per exported graph/asset; a singular declaration would keep only the **last** one. |
| `AssetBundle.mode_flag = 4` (optional uint32) | `1` = classic mode, absent = Beyond mode. |
| `StructureDefinition.field_5 = 5` (int32, value 1) | Present in every struct definition of 7.0 samples; unknown meaning. |
| `TypeDef3.SubType.Any` | `{f1=1, f2=2}`: 7.0 writes varints there (struct-typed variables). |
| `NodeGraph.affiliations = 7` (`GraphAffiliation`), `NodeInstance.status_node_extension = 11` (`StatusNodeExtension`) | Graph affiliations and the status-node extension. |
| `TypedValue.client_inline = 3` (`ClientInlineVarBinding`), `MapKeyValueBinding.client_key_type/client_value_type = 4/5` | Client-graph values and dictionaries. |
| `ResourceEntry.ResourceClass` 51–56, 58, 60, 64, 65; `ResourceLocator.Category` 20007–20010 | Newer resource classes and categories. |
| `PinInterface.TypeInfo.default_value = 2` (TypedValue) | Default literal of a meta pin, e.g. the signal-name text. |
| `PinInterface.TypeInfo.flag_6 = 6` (varint 1) | Unknown. |
| `TypeDef3.opaque_21/35/36` | Default values of struct variables (int/list/dict…). Kept as raw bytes, **not interpreted**. |
| `ResourceEntry.opaque_11…29` | Payloads of non-node-graph resources (prefabs, terrain, skills, UI…). Raw bytes, **not interpreted**. |

`opaque_*` fields are deliberately declared so they do not flood the unknown-field census; `miliastra-search check` lists them
separately so they are never invisible.

## Verification
`node --test` decodes all sample files with an **empty census** (no field in any file is unknown to this schema).

## `.gil` level file (section 9 of the proto)
| Item | Notes |
|---|---|
| `GilFile` and ~30 `Gil*` messages | Payload of `.gil` (container file type 2). The node-graph section reuses `NodeGraph`, `NodeInterface`, `StructureDefinition` unchanged; other sections model only GUID/class-discriminator/name. |
| `option opaque_rest = true;` (message option, parsed by `protoparse.mjs`) | "Identified message, only the declared fields are interpreted": its other fields count as opaque instead of entering the unknown-field census. |
| `opaque_N` fields on `GilFile` | Known level sections that are not interpreted; undeclared root fields still show up in the census. |
