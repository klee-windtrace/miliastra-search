
# The Miliastra Wonderland file formats (`.gia`, `.gil`)

A guide for anyone who wants to parse these files, written from what this project's decoder relies on. Everything was observed by decoding real
files (games 7.0.0 and 7.1.0, the fixtures in `test/cases/`); where something is a guess, it says so. Field numbers refer to
[`schema/gia.merged.proto`](schema/gia.merged.proto), which is the machine-readable companion of this document. Conventions: "root N" = top-level
protobuf field N of a payload; `a.b.c` = nested field numbers; all container integers are big-endian, protobuf is standard (little-endian fixed-width).

Not decoded anywhere in this project (listed at the end): the interior of most non-graph resources, struct default values, skill tracks, factions.

## 1. Two files, one container

| File | What it is |
|---|---|
| `.gia` | An *export*: one or more resources (node graphs, usually with the declarations they depend on). Payload message `AssetBundle`. |
| `.gil` | A whole *stage save*. Payload message `GilFile`; its node-graph section reuses the `.gia` messages. |
| `.gip`, `.gir` | Same container framing (file types 1 and 4); not supported by this project. |

### Container

```
offset  size
0       u32   file size − 4
4       u32   container schema version  = 1
8       u32   head tag                  = 0x0326
12      u32   file type                 1 GIP, 2 GIL, 3 GIA, 4 GIR
16      u32   payload length            = file size − 24
20      ...   protobuf payload
−4      u32   tail tag                  = 0x0679
```

A `.gia` starts `0000033b 00000001 00000326 00000003 00000327 …` (a 831-byte file with a 807-byte payload). There is no compression and no
encryption: the payload is plain protobuf.

**Telling `.gia` from `.gil` by content.** The file-type field is trustworthy in every file seen, but the payload can confirm it: an `AssetBundle`
only has root fields 1–5, while a level has dozens (up to 49) and always root 10 (node graphs). The decoder uses the header, and lets a clearly
contradicting payload win with a warning. Do not use the file name: exports may be renamed.

## 2. `.gia`: the `AssetBundle`

| Field | Meaning |
|---|---|
| 1 `resources` (repeated) | The resources that were asked for when exporting. **Repeated**: one entry per exported graph or asset. |
| 2 `dependencies` (repeated) | Definitions the exported graphs need: composite declarations and bodies, signal declarations, struct definitions. |
| 3 `export_tag` | `{UID}-{TIME}-{FILE_ID}-\{export file name}`. Contains the exporting account's UID; this project masks it by default. |
| 4 `mode_flag` | Present with value 1 in *classic* mode; absent in the default ("Beyond") mode. |
| 5 `engine_version` | e.g. `"7.0.0"`. |

A `ResourceEntry` has `identity` (1, a locator), `reference_list` (2, locators of the definitions it needs), `internal_name` (3),
`resource_class` (5) and one payload field: 13 node graph, 14 declaration (`NodeInterface`), 22 struct definition. Other resources (prefabs,
entities, configs, UI, …) use payload fields 11–29, whose content is not interpreted here. Wrapping: a graph payload is
`13 → 1 → 1 → NodeGraph`, a declaration is `14 → 1 → 1 → NodeInterface`, a struct is `22 → 1 → StructureDefinition`.

* A definition can be *primary* or *dependency*: do not rely on the slot. (A composite or struct exported on its own is primary.)
* **GUIDs are file-local.** The game renumbers them on every export and import: `1610612737` is a composite in one file, a "Send Signal" declaration
  in another, an "Assemble Structure" in a third. Never join across files by GUID; join on names (signals, structs, composites).
* **Resource classes** (`ResourceClass` in the proto) say what a resource is: 9 entity node graph, 10 boolean filter graph, 11 skill graph,
  12 composite declaration (also listen-signal and struct nodes), 14 signal declaration (send), 22 status graph, 23 class graph, 29 structure,
  46 item graph, 47 integer filter graph, 51–53 creation graphs, 64 character-control skill graph; 1 prefab (`OBJECT`), 3 `OBJECT_ENTITY`,
  4 `CREATION_ENTITY`, … Unknown numbers occur after game updates; keep them as numbers.
* A `.gia` entity resource (class 3) carries the entity definition in payload field 12, with the same layout as a root-5 entry of a `.gil`
  (see section 8).

## 3. Locators: how things are identified

`ResourceLocator` appears everywhere: `{1 source_domain, 2 service_domain, 3 kind, 4 asset_guid, 5 runtime_id}`.

* `source_domain` (origin): 10000 user-defined, 10001 system (built in).
* `service_domain` (category) says which engine module owns the thing. For node graphs and nodes:

| service domain | graph kind | `.gia` class |
|---|---|---|
| 20000 | server, basic (entity graph) | 9 |
| 20003 | server, status | 22 |
| 20004 | server, class | 23 |
| 20005 | server, item | 46 |
| 20001 | client, boolean filter | 10 |
| 20002 | client, character skill | 11 |
| 20006 | client, integer filter | 47 |
| 20007 | client, creation status decision | 51 |
| 20008 | client, creation skill | 52 |
| 20009 | client, creation status | 53 |
| 20010 | client, character control skill | 64 |

Server domains are 20000, 20003, 20004, 20005; every other graph domain is client. This decides how type ids are read (section 5).
* `kind`: 21001 ordinary node graph, 21002 composite body, 22000 *syscall* (a built-in node), 22001 *generated stub* (a node generated from a
  declaration), 15 struct, and values such as 1 / 2 / 8 / 9 for prefab / entity / UI / preset point.
* `asset_guid` (4) points at a savable asset; `runtime_id` (5) is a logic-level id. For user assets they are equal; for built-in nodes only
  `runtime_id` exists and is the node's id. Rule of thumb: if the thing can be spawned in a scene it has a guid; if it is logic or a definition it has an id.

## 4. Node graphs

`NodeGraph`: `identity` (1), `display_name` (2), `nodes` (3), `port_mappings` (4, composites only), `comments` (5), `blackboard` (6),
`affiliations` (7), and two rarely seen optionals (100 entry slot index, 101 evaluation interval).

### Nodes

`NodeInstance`: `index` (1), `shell_ref` (2), `kernel_ref` (3, optional), `pins` (4), `x_pos` / `y_pos` (5, 6), `attached_comment` (7),
`context_declaration` (8), `signal_version` (9), `using_structs` (10), `status_node_extension` (11).

* **`index` is the handle** wires refer to. Indices have holes (deleted nodes) and are not positions in the list.
* **Shell and kernel.** The *shell* is the node as the editor shows it; the *kernel* is the implementation it runs as. For ordinary nodes they
  are the same id and `kernel_ref` may be absent. For *generic* ("variant") nodes such as `Equal`, the shell id is the generic node and the kernel id
  selects the concrete variant (`Equal` shell 14 → kernel 16 for entities). Kernel ids are **not unique across server and client**, so a variant must
  be looked up in *that node's own* variant table, never in a global kernel table.
* **What `shell_ref.runtime_id` means** depends on `shell_ref.kind`: for 22000 it is a built-in node id (server ids start at 1, client ids at
  200000); for 22001 it is the **GUID of a declaration in the same file** (a composite call, signal send/listen, struct assemble/split/modify).
* Client graphs: execution nodes were seen with kernel 2000 (execution), 2001 (graph start), 4000+ in status graphs.
* `comments` with no coordinates are not free-floating: the comment is attached to a node (`attached_comment`). Free comments have `x_pos` / `y_pos`.
  This project treats a node's attached comment as user-writable metadata (see lint suppression in `TECHNICAL.md`).

### Pins

`PinInstance`: `shell_sig` (1) and `kernel_sig` (2) are `{kind, index}`, `value` (3), `type` (4), `connections` (5), `binding_meta` (6),
`persistent_pin_uid` (7).

Pin kinds: 1 in-flow, 2 out-flow, 3 in-param (data input), 4 out-param (data output), 5 meta "RPC opcode" (carries the signal name on signal
nodes), 6 meta "topic name", 13–16 struct operations.

* **Pins are sparse.** A node lists only pins that carry a value or a wire, and a value is stored only once the user has edited it: an unedited pin has no
  entry at all and means the node's default. For a Boolean pin whose default is true, such as *Trigger Event* on the two Set Variable nodes, the file
  stores only the edited `false` (in the fixtures that is the only value ever stored for it; a stored `true` was never seen). The defaults themselves are not in the file:
  this project keeps them as data in `data/ref-rules.json` (`triggerDefault`). Never assume a pin object exists, and identify pins by
  `(kind, index)`, never by list position. Indices have holes, and some nodes use indices well beyond what the editor shows (7.0 *Modify Structure*
  nodes reach 9+).
* Index meaning: `shell_sig.index` is the slot in the node as drawn; `kernel_sig.index` is the slot in the kernel's parameter list. Names for
  built-in nodes come from the node database by *shell* index.
* **Wires are stored once**, never on both ends, and never on every pin kind: a flow wire is stored on the source's **out-flow** pin
  (`connections` lists target nodes with the target pin's `shell` / `kernel` signature); a data wire is stored on the consumer's **in-param** pin
  (listing the source). In-flow and out-param pins carry no connections. In the four files checked for this (`sample_0_main`, `sample_4`, `sample_9`, `stage_9`: 22 wires)
  no wire has a counterpart on the other end. A parser that wants a full edge list normalises both into source → target and deduplicates.
* Connection anomalies exist in principle (wires to missing nodes); keep and report them instead of failing.
* `type` (4) is a type id whose numbering depends on the graph's domain (section 5). On *event* nodes (`When … Changes`) pin types are unreliable
  defaults. For graph variables the type comes from the declaration, not from the pins.
* `persistent_pin_uid` exists only on dynamic nodes (composite, signal, struct). When a declaration is edited and its pins reordered, the uid is
  how the editor finds the old wires again, so for user-defined nodes match pins by `(kind, index)` first and by uid second.
* **Placeholder pins:** a 100-input `Assembly List` node is stored with about 100 type-only pins with no value and no wire. They carry no information.
* **Name pins.** The name of a variable, timer or signal is a plain string literal on an input pin: `Get/Set Node Graph Variable` pin 0,
  `Get/Set Custom Variable` pin 1, timers pin 1, and for signals the meta pin (kind 5) of every call site. `When … Variable Changes` and
  `When Timer Is Triggered` carry the name only as an **output**, so they listen to *any* name; to know which names they handle you have to follow
  their execution flow (this project does, see `TECHNICAL.md`).
* **Local variables have no name at all**: identity is the wire between `Get Local Variable` and `Set Local Variable` (pin type `Loc`).

### Graph variables, comments, affiliations

`blackboard` entries are the graph variables: `var_name` (2), `base_type` (3, server type id), `storage_value` (4, a value), `is_public` (5),
`schema_ref_id` (6, the struct id for struct variables), and `container_key_type` / `container_value_type` (7 / 8, only meaningful for maps).
`affiliations` list struct declarations a graph depends on (`info.struct_id.struct_id`).

## 5. Types and values

### Two numbering schemes

`PinInstance.type`, `TypeDefinition` and graph variables use **server** type ids in a server-domain graph and **client** ids in a client one;
`TypeDefinition.backend` (1 server, 2 client) says which. Server ids grew historically (scattered: `Int 3`, `IntList 8`); client ids pair each
type with its list (`Int 3`, `IntList 4`). A parser must pick the table from the graph's service domain.

| Server | | | | Client | | |
|---|---|---|---|---|---|---|
| 1 Entity | 2 Guid | 3 Int | 4 Bool | 1 Entity | 3 Int | 5 Bool |
| 5 Float | 6 String | 12 Vector | 14 Enum | 7 Float | 9 String | 11 Vector |
| 17 Faction | 20 Config | 21 Prefab | 25 Struct | 13 Enum | 14 Guid | 16 Faction |
| 27 Dict | 16 Local-var ref | 28 Snapshot ref | | 18 Config | 19 Prefab | |

Server list types: Guid 7, Int 8, Bool 9, Float 10, String 11, Entity 13, Vector 15, Enum 18, Config 22, Prefab 23, Faction 24, Struct 26.
Client list types: Entity 2, Int 4, Bool 6, Float 8, String 10, Vector 12, Guid 15, Enum 17, Config 20, Prefab 21, Faction 25. The client ids 21–25 (and struct 22, struct list 23, dict 24) are named in `model.mjs` but the proto's `ClientTypeId` stops at 20.

### `TypedValue`

`{1 widget, 2 is_value_set, 3 client_inline, 4 type_def, 5 tracker, <one of 101–112>}`; the value is one of:
`101 id`, `102 int`, `104 float`, `105 string`, `106 enum`, `107 vector`, `108 struct`, `109 list`, `110 poly`, `111 pair`, `112 map`.

* **`is_value_set = 0`** means the user never edited the value: it still holds the engine default (for example enum 101 on `Less Than`). Treat it as
  "no value" for display; keep it for completeness.
* **Booleans are enums** (`val_enum`; type tag 4 on the server, 5 on the client): 0 = No, 1 = Yes.
* **Enum integers are not unique across families** (0 and 1 collide everywhere). Which family applies depends on the node and pin, which the
  built-in node database knows; without it, list all candidate names.
* **`poly` wrapper:** generic input pins wrap their value: `chosen_type_index` is an index into the node's variant list, present with or without a
  literal. `actual_value` holds the real value.
* A `struct` value's `tracker.identity.local_index` numbers struct values within one graph (the editor displays `StructName_index`).
* Floats are 32-bit; `Int` is 32-bit; ids are 64-bit (use BigInt or strings beyond 2⁵³).
* `client_inline` (field 3 of a value) holds a client-side binding. It first appears in 7.1.0 files and is only partly modelled; this
  project does not use it.

## 6. User-defined nodes: declarations

User-defined things are stored as **declarations** (`NodeInterface`, resource classes 12 and 14), and each call site is an ordinary node of
shell kind 22001 whose `runtime_id` is the declaration's GUID. A declaration has `id` (4: `shell_ref`, `kernel_ref`, `graph_ref`, `signal_version`),
pin lists `inflows` (100), `outflows` (101), `inputs` (102), `outputs` (103), `meta_pins` (106), an `impl` (107) and the generic title `name` (200),
`description` (201), `template_root` (203), `template_sub` (204). Pin *names* live in the declaration and are user data.
`impl.category` says what it is:

| category | what | `impl` field |
|---|---|---|
| 1000 | composite | none; the body is a separate graph |
| 1001 | send signal | 101 `send_signal` |
| 1002 | listen signal | 102 `listen_signal` |
| 1003 | struct assemble | 104 = the struct's id |
| 1004 | struct split | 105 = the struct's id |
| 1005 | struct modify | 106 = the struct's id |

### Composites

* The declaration has category 1000. The **body** is a graph with locator kind 21002. The declaration's `id.graph_ref` (`id.graph`) points at the body; the GUIDs of the two
  usually differ (always in a `.gil`, and in the 7.1.0 `.gia` fixtures). Match through `graph_ref` first and fall back to equal GUIDs (the
  linkage of the older exports was equal GUIDs).
* `NodeGraph.port_mappings` connect the declaration's external pins to inner nodes: each is
  `{external_port {kind, index}, internal_target_node_handle, internal_port_shell, internal_port_kernel}`, with external kinds 1 in-flow, 2 out-flow,
  3 in-param, 4 out-param. The external pin's *name* is in the declaration's pin list.
* Two call nodes may point at the same declaration. A body can call other composites. A body has no owner graph: a variable accessed inside it
  belongs to whichever graph the composite is called from, and a name arriving through an input port can differ per call site.
* The composite's description is `description` (201) of the **declaration**; the body has none. Empty descriptions are absent.

### Signals

A signal's identity is its **name**. It is stored in the declaration (`impl.send_signal.signal_name` or `listen_signal.signal_name`) *and* as a string
literal on the meta pin (kind 5) of every call site; a `.gil` also keeps a signal table (root 10.5). A signal is declared **three** times with one
name: a server send declaration, a server listen declaration, and a client "send to server graph" twin of the send declaration. The send pair
(always both present) names each other as `client_node` and share the same `server_node`; the twin's generic title is "Send Signal to Server Node
Graph". The two halves differ in the service domain of their own id: the one living in the server node's domain is the "real" one. The same pair
exists in a `.gia`, with renumbered ids. Signal parameters are the declaration's pins.

### Structs

A struct definition is a resource of class 29 (locator kind 15; GUIDs started at 1077936129 in the samples): `StructureDefinition` with
`genericField` (1) and `concreteField` (2, identical), `structVersion` (3), and a field list: each field has `varName` (501), `varType` (502, server type
id), `varIndex` (503) and a type description in `typedef1` / `typedef3` (for struct- or container-typed fields). Assemble / split / modify nodes are
class-12 declarations whose `impl` carries the struct's GUID. *Modify* nodes have paired "is set" and value pins per field. Pin names
are user/exporter data: in one sample the modify-structure flag pins are named in Chinese.

## 7. `.gil`: the level payload

`GilFile` has about 45 numbered sections. **Interpreted (by this project) or at least identified:**

| root | content | notes |
|---|---|---|
| 2 | level name | |
| 4 | templates: `{1 guid, 2 config id, 6 components[]}` | prefabs, creation templates, player and character templates |
| 5 | entities: `{1 guid, 5/6/7 components[]}` | placed entities, plus player, character and level entities |
| 6 | **folder index** | section 9 below |
| 7 | terrain: `{1 guid, 2 {1 name}}` | |
| 8 | prefab *editing area* | instances of the prefab currently open for editing `{1 guid, 2 {1 prefab guid}, …}`; saved prefabs live only in root 4, an unsaved draft exists only here. Not decoded, and not listed |
| 9 | UI: entries `{501 guid, 504 parent layout, 505[] → 12 → 501 name}` | no parent = layout, parent = control |
| 10 | **node graphs** | below |
| 11 | level settings: `3.2` respawn points `{2 guid, 501 name}`, `5.1` preset points `{1 guid, 501 name}` | factions and score settings not decoded |
| 12 | global timers `{1 name}` | **no GUID** |
| 15 | configs: `{1 guid, 2 config type, 4 components[]}` | skills, statuses, items, classes, … (type table below) |
| 16 | skill event tracks | same GUIDs as 15; not decoded |
| 18 / 30 / 32 / 33 | cameras / unit tags / paths / deployment groups | named entries |
| 31 | `3 {1 guid, 100 {1 {501 name}}}` | temporary in-game save data |
| 44 | scene-generation templates `{13 name, 14 guid}`: field 1 = kind A, field 2 = kind B | |
| 42 / 43 | classic-mode flag / engine version | same meaning as `AssetBundle` 4 / 5 |
| 25, 29, 36, 40, … | peripheral systems, editor info, language texts, save time (40, unix seconds), … | present, not decoded |

Everything not in this table exists in the schema as `opaque_N` or shows up as an unknown field.

**Node-graph section (root 10):** `1` = `{1: NodeGraph}` ordinary graphs (kind 21001); `2` = `{1: NodeInterface}` declarations; `3` = the composite
palette (section 9); `4` = `{1: NodeGraph}` composite bodies (kind 21002); `5` = signal table; `6` = `StructureDefinition` entries directly; `7` = 1.
These are the same messages a `.gia` holds, without the `ResourceEntry` wrapper: **no `resource_class`** and no primary/dependency split.
Consequences: the class of a graph must be derived from its service domain; composite body GUID ≠ declaration GUID; and **GUIDs are allocated per kind**,
so a graph and a composite declaration may share a number.

### Deriving classes in a level

A level has no `resource_class`, so a parser derives it:

* **Graphs:** from the service domain (table in section 3).
* **Declarations:** send-signal declarations → 14; everything else (composite, listen signal, struct nodes) → 12.
* **Configs (root 15):** from the entry's `config type`: 1 unit status (7), 4 class (17), 6 skill (8), 7 skill resource (16), 9 item (26),
  17 shop template (30), 18 scan tag (45), 22 shield (39), 26 environment configuration (49), 27 light source (48), 28 custom creation skill (54),
  30 skill variable (60), 32 VFX tool (58), 36 control skill (65). Types 5 (growth curve) and 12 (inventory template) have no `.gia` class.
  (Class numbers in parentheses are the `.gia` `ResourceClass` values.)
* **Templates and entities, from the GUID band.** The game allocates GUIDs in blocks of 2²² starting at `0x40000000`; the block index is
  `(guid − 0x40000000) >> 22`. Templates (root 4): band 1 object (prefab), 2 creation, 3 player template, 4 character template. Entities (root 5):
  band 1 object entity, 2 creation entity, 3 player entity, 4 character entity, 5 level entity. A projectile is a band-1 template whose base config
  id is `10003001` (**one sample, heuristic**).
* Other sections map to fixed classes (terrain 5, UI controls 15 / layouts 20, preset points 6, global timers 24, cameras 13, unit tags 44,
  save data 41, paths 38, deployment groups 43, scene templates 55 / 56). Respawn points have no `.gia` class.
* **Names** come from the components: the component with `kind == 1` holds the name at field 11 (`{1: name}`).

Differences between a game's stages and its `.gia` exports: when a sample is imported into a stage, the game renumbers its GUIDs (`1610612737…` →
`1073741825…`); apart from that, the graph content is identical (`stage_N.gil` dumps equal `sample_N.gia`). The same stage in another locale
differs in the stored names of default resources.

## 8. Components, mounts and static entities

Entities, templates and configs hold **component lists** (several repeated fields per entry: root 4 uses 6/7/8, root 5 uses 5/6/7, root 15 uses
4/5). A component is `{1: kind, <payload field>: payload}`, where the payload field depends on the kind: kind 1 → 11, kind 3 → 13, kind 6 → 21.
Observed kinds: 1 (name), 3 (graph mount), 6 (status), and in dynamic lists 14, 18, 19, 40, … (hit effects, unit status, …; meanings not decoded).

### Graph mounts

A **mount** says which graph is attached to which host. It is a component of kind 3, payload (field 13):
`{1: {1: {1: 1, 2: <graph guid>, 501: <graph service domain>}, [501: "PlayerBP"|"AvatarBP"]}}*`.

* Found in entities and templates (root 5 / 4), the stage entity and class configs (root 15, type 4).
* The graph is identified by **GUID plus service domain**: GUIDs repeat across kinds.
* The per-graph `501` label exists **only on classes**: `PlayerBP` = runs on the Player, `AvatarBP` = on the Character. A class graph of either
  kind can sit under either label: one test class has all four combinations.
* A player or character *template* is two separate root-4 entries (GUID bands 3 and 4), so the entry itself says which side a graph is on.
  Player and character *entities* (root 5, bands 3 and 4) repeat their template's mounts.
* **Status graph:** a status config (type 1) holds, at component kind 6 → field 21 → 1 → 1 → 2, the message `{1: 1, 2: <guid>, 501: 20003}`. A status with
  no graph has the same message with only `501: 20003`. A status has at most one graph.
* The same graph can be mounted on several identical hosts (same class and name); every host has its own entry.

### Static vs dynamic entities

The game distinguishes *static* entities (no stage limit) from *dynamic* ones (counted against the 3000 limit). In a root-5 entry (a template's root-4
entry: field 8) a **dynamic component list** is held in field 7: hit effects, unit status, …. The rule that fits all samples:

> an entity is dynamic if its dynamic list holds a component whose kind is **not 1**.

* A native static entity may still have a list with exactly one component, kind 1 (`08 01 10 01 5a 00`). Dynamic ones have kinds like
  18, 1, 3, 19, 6, 14 (18, 3, 19 when stripped of everything removable; 40, 1, 3 for players).
* Base config ids do **not** decide it: a static entity converted to dynamic keeps its static config id (e.g. 20001430), and dynamic natives use others (20001856).
* Converting between static and dynamic in the editor adds or removes the list. Creation entities always have it.
* Whether the list can ever disappear entirely for a dynamic entity is unknown. Prefabs (class 1) are not classified.
* In a `.gia` the entity definition is in the resource's field 12: `12 → 1 = {1 guid, 2 {1 base config, 2 1}, 5 [components], 6 [components], 7 [dynamic components], 8 base config}`;
  the rule is the same.

## 9. Folders: where the editor filed things

**Folder index = root 6** (a `.gil` only; a `.gia` has no information on where a graph was saved).
`{1: family entry}*`, an entry = `{1: family id, 2: root node, 3: default tab}`. Both nodes are `{1: name, 3: number, 4: custom folder*, 5: item*}`; an item is
`{1: type code, 2: guid}`. The root node is named `root` and holds the custom folders (`4: {1: "New Folder", 3: n, 5: items}`); the default tab holds
the items that are in no folder. **The name of the default tab is localised** (`"Uncategorized Tab"` in an English client, `"Default Category"`,
`"Player Template"`, `"Class"` in some families), so never compare against it. The `3` numbers are 1 for the root, 2 for the default tab and 3, 4, 5, … for the
custom folders in the order they were created.

**Order, as the editor lists things** (confirmed on a stage whose resources were named by their position in the editor):

* **Custom folders** are listed in the order they are stored (= creation order), not alphabetically. The default tab is told by its place in the index (`DEFAULT_TAB_RANK`), never by its name, which is localized; the tool prints it as `/(default)/` (`folderLabel` in `model.mjs`).
* **Items inside a folder** are listed in the stored order of the folder's item list for everything except graphs. That order is the order they were
  *moved into* the folder, not their GUID order. **Graphs are the exception: the editor sorts them alphabetically inside a folder.**
* **The default tab comes first for graphs and last for every other kind of resource** (prefabs, statuses, skills, …).
* The graph kinds are listed in their own tabs; this project lists them in the order entity, status, class, item, composites, character skill, creation
  skill, creation status, creation decision, boolean filter, integer filter, control skill.

Families seen, with the type code of their items:

| family | what | type code | notes |
|---|---|---|---|
| 4 | entity graphs | 800 | service domain 20000 |
| 13 | boolean filter graphs | 2100 | 20001 |
| 14 | character skill graphs | 2200 | 20002 |
| 15 | status graphs | 2300 | 20003 |
| 16 | class graphs | 2400 | 20004 |
| 20 | item graphs | 4300 | 20005 |
| 57 | integer filter graphs | 6300 | 20006 |
| 58 | creation decision | 20007 | 6600 |
| 59 | creation skill | status | 20008 | 6700 |
| 60 | creation status | 20009 | 6800 |
| 67 | character control skill graphs | 7400 | 20010 |
| 6 | prefabs (templates, root 4 band 1) | 100 | custom folders and a default tab |
| 11 | status configs (root 15, type 1) | 1900 | same |
| 12 | skills (root 15, type 6) | 2800 | same |
| 61 | custom creation skills (root 15, type 28) | 6900 | same |
| 68 | character control skills (root 15, type 36) | 7500 | same |
| 3 | every entity and prefab instance | 100 / 200 / 400 | only a default tab; repeats the prefabs of family 6 |
| 9, 10, 22, 56, 204, 35, 109, 110 | player templates, classes, … | 1700, 1800, 3800, 5400, 6400, 3000 | a default tab only; not decoded |

* **An item is keyed by family *and* type *and* GUID.** GUIDs repeat across kinds (a prefab and a status config can both be `1077936129`), and the type
  code alone is not enough either: family 3 lists the prefabs again with the same code 100 as family 6, in its own default tab, so reading by type alone
  puts every prefab in the default tab.
* Every graph of the observed stages is in exactly one folder or tab.
* The other families (ui, entities, …) have tabs of their own; most hold nothing in the observed files and are not decoded.
* **Composite folders live elsewhere.** Root 10 field 3 is the *palette*: `3: {1: 2, 2: {1: "Composite Node", 2: {1: <folder name>, 3: {1: <locator>}*}*}}`, where the locator is of kind 22001 and its `runtime_id` (5) is the **declaration's** id, the one a
  call node carries as its shell id. **It is not the body's GUID**: the two can be equal in a small file, which hides the difference
  (the palette's own name is not a folder). The folders are stored in the order the editor lists them. Only composites in a **custom** folder are listed; a
  composite in no folder is not listed at all and sits in the default tab, which is listed first, alphabetically by the composite's name (the name is that
  of its declaration; the body has none). Composite bodies are not in root 6.

## 10. Known gaps and uncertainties

* Struct field **default values** (`TypeDef3` fields 21 / 35 / 36) and map/struct typed defaults: kept as raw bytes.
* The interior of non-graph resources (prefabs, terrain, skills, UI, cameras, …): only name, class and GUID are read, plus mounts and the dynamic flag.
* `val_struct` / `val_map` literal *pin values* are implemented from the schema but no sample contains one, so that path is untested; so are
  struct-typed graph variables and client-side composite/struct usage.
* The projectile-versus-object split rests on one observed base-config id. Class 41 (save data) has no name in the `.gia` enum.
* `client_inline` (see section 5), a second layer inside signal declarations, and a few `.gil` root fields (1, 50, 52, 53) appear in 7.1.0 files
  and are not decoded; nothing here depends on them.
* The dynamic-list rule (section 8) is based on a few samples; a re-saved sample of a static entity converted to dynamic would settle it.
* All observations come from games 7.0.0 and 7.1.0 and files saved by them. The editor's UI language affects stored default names and the default-tab name.
