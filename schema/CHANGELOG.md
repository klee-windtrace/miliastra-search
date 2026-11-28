# gia.merged.proto – schema notes

Fields and messages that need explaining beyond the comments in the file. Wire numbers are the game's.

## Fields worth knowing
| Field | Notes |
|---|---|
| `AssetBundle.resources = 1` (repeated) | The game writes one field-1 entry per exported graph/asset; a singular declaration would keep only the last one. |
| `AssetBundle.mode_flag = 4` (optional uint32) | `1` = classic mode, absent = Beyond mode. |
| `StructureDefinition.field_5 = 5` (int32, value 1) | Present in every struct definition of 7.0 samples; unknown meaning. |
| `TypeDef3.SubType.Any` | `{f1=1, f2=2}`: 7.0 writes varints there (struct-typed variables). |
| `NodeGraph.affiliations = 7` (`GraphAffiliation`), `NodeInstance.status_node_extension = 11` (`StatusNodeExtension`) | Graph affiliations and the status-node extension. |
| `TypedValue.client_inline = 3` (`ClientInlineVarBinding`), `MapKeyValueBinding.client_key_type/client_value_type = 4/5` | Client-graph values and dictionaries. |
| `ResourceEntry.ResourceClass` 51–56, 58, 60, 64, 65; `ResourceLocator.Category` 20007–20010 | Resource classes and categories of 7.0 and later. |
| `PinInterface.TypeInfo.default_value = 2` (TypedValue) | Default literal of a meta pin, e.g. the signal-name text. |
| `PinInterface.TypeInfo.flag_6 = 6` (varint 1) | Unknown. |
| `TypeDef3.opaque_21/35/36` | Default values of struct variables (int/list/dict…). Raw bytes, **not interpreted**. |
| `ResourceEntry.opaque_11…29` | Payloads of non-node-graph resources (prefabs, terrain, skills, UI…). Raw bytes, **not interpreted**. |

`opaque_*` fields are declared so they stay out of the unknown-field census; `miliastra-search check` lists them separately.

## Custom variables (7.2.0)
`GilVariableComponent` and its dependants (`GilCustomVariable`, `GilVariableValue`, `GilVar*`) document the custom-variable component of the dynamic component list; the lists are opaque in
`GilEntity` / `GilTemplate`, so `src/varscan.mjs` reads them and the messages are reference only. Layout: FORMAT.md, "Custom variables".

## In-game saves (7.2.0)
`GilSaveData.sets` (root 31, field 1) holds the in-game saves with their slots (the save variables, `GilSaveSlot`); `entries` (field 3) is the temporary in-game save data of the older layout. Slot field 3 is not interpreted. Layout: FORMAT.md, "In-game saves".

## Graph mounts (7.2.0)
The mount component (kind 3, payload 13) of the opaque component lists holds, per mounted graph, the values the host sets for the graph's published variables as repeated `2: GilCustomVariable`-shaped messages (no field 3, the type is the value's `1`); read by `src/mounts.mjs`. Layout: FORMAT.md, "Graph mounts".

## Verification
`node --test` decodes all sample files with an **empty census** (no field in any file is unknown to this schema).

## `.gil` level file (section 9 of the proto)
| Item | Notes |
|---|---|
| `GilFile` and ~30 `Gil*` messages | Payload of `.gil` (container file type 2). The node-graph section reuses `NodeGraph`, `NodeInterface`, `StructureDefinition`; other sections model only GUID/class-discriminator/name. |
| `option opaque_rest = true;` (message option, parsed by `protoparse.mjs`) | "Identified message, only the declared fields are interpreted": its other fields count as opaque instead of entering the unknown-field census. |
| `opaque_N` fields on `GilFile` | Known level sections that are not interpreted; undeclared root fields still show up in the census. |
