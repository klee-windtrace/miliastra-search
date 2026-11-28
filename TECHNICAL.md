
# miliastra-search – technical notes

How the tool is built, and how to maintain it. For using it see [README.md](README.md) and [ADVANCED.md](ADVANCED.md) (every mode and option, the findings, output examples); for the binary format itself see
[FORMAT.md](FORMAT.md); for conventions to follow when changing code see [CLAUDE.md](CLAUDE.md).

Plain Node.js (≥ 20), ESM, **no npm dependencies**. The engine also runs unchanged in a browser (see "Running outside Node").

## Pipeline

```
bytes ─ container ─ protobuf decode ─ Bundle (model) ─ resolve names ─┬─ info / dump / refs / warns / check / raw / all ─ report.mjs ─ report (JSON) ─ present/ ─ text, md, html, …
        L0          L1 / L1b / L1c    L2               L3             │                                                                     └─ json: the report itself
saved report (.json) ───────────────────────────────────────────────────────────────────────────────────────────────── present/saved.mjs ─┘
```

| Layer | Files | Role |
|---|---|---|
| L0 container | `container.mjs` | Checks the 24-byte header and tail tag, decides `.gia` vs `.gil` **by content** (header file type cross-checked against the payload's top-level fields). `--lenient` turns header problems into warnings. |
| L1 decode | `protoparse.mjs`, `decode.mjs`, `schema.mjs`, `schema/gia.merged.proto` | A small `.proto` parser and a schema-driven decoder. Never throws on unknown fields: it records them in a **census**. |
| L1b `.gil` adapter | `gil.mjs` | Decodes the level with the `GilFile` schema and re-wraps its graphs/declarations/structs as GIA-style entries, so everything downstream is format-agnostic. Every other resource becomes an *opaque* entry (name, class, GUID). |
| L1c raw scans | `mounts.mjs`, `varscan.mjs` | Walks the raw protobuf of parts the schema keeps opaque: graph mounts (with the values a host sets for the graph's published variables), static/dynamic flag, folder index, composite palette, and the custom variables of entities and templates (`varscan.mjs`). |
| L2 model | `model.mjs` | Raw messages → `Bundle` (`resources[]`, each `kind` = `graph` \| `interface` \| `struct` \| `opaque`), value ASTs (`normValue`), edges (grouped by source pin; the wires of one pin keep the order the output pin stores them in, which is the order the game runs the targets in, so a consumer must not re-sort them by target). |
| L3 names | `nodedb.mjs`, `resolve.mjs`, `data/nodes.json`, `data/overlay.json` | Node/pin/enum names; binding a node instance to its definition (built-in, composite, signal, struct). |
| L4 analysis | `staticres.mjs`, `refs.mjs`, `analyze.mjs` | Static name resolution, the reference index and findings, and the analysis of a file that the reports share (`analyzeBundle`: resolved node names, graph labels, mounts). |
| L5 report | `report.mjs`, `info.mjs`, `dump.mjs`, `variables.mjs`, `code.mjs`, `check.mjs`, `raw.mjs`, `refs.mjs` | The report of a mode: a plain JSON object, everything resolved, no styling (see "Reports"). |
| L6 present | `present/` (`doc.mjs`, `theme.mjs`, `output/`, `filter.mjs`, `emit.mjs`, one printer per mode), `cli.mjs` | Renders a report as text / Markdown / HTML; document model, styling, search filter. Never reads a game file. |

Read in that order when you need to change something. `schema/gia.merged.proto` is the reference for what a numeric class, service
domain or field means; check it before guessing.

### Decoding details

* **Census.** `decodeMessage` records every field the schema does not declare (`path#field/wire`, count, a sample). `check` prints it,
  `check --strict` exits 1 if anything is reported, and the tests assert that every file in `test/cases/gia` and `test/cases/gil` has an
  empty census. Fields declared as `opaque_N` (or inside a message with `option opaque_rest = true;`, a custom option understood by
  `protoparse.mjs`) are *known but not interpreted*: they are counted separately and listed by `check`, never silently dropped.
* **Varints and 64-bit values** become a `Number` when exactly representable, otherwise a decimal string.
* `RangeError` means structurally broken bytes (truncation, bad varint); `ContainerError` means a bad header. The CLI reports both per file
  and continues with the other files.

### `.gil` handling

A `.gil` payload is one `GilFile` message (root section numbers in [FORMAT.md](FORMAT.md)). `gil.mjs`:

* re-wraps node-graph sections 10.1 / 10.2 / 10.4 / 10.6 as `graph_data` / `interface_data` / `struct_data` entries (`resource_class` is
  derived from the service domain; there is no such field in a level);
* lists all other sections as opaque resources, with the class derived from the section, the config type, or the GUID band;
* attaches `mounts`, `dynamic` (→ `STATIC_ENTITY`) and the folder facts (`folder`, `folderRank`, `folderPos`) from the raw scans of `mounts.mjs`.

### Order of the resources

`dump` prints a resource's folder as a `/name/` prefix (`folderName` theme style; `folderLabel` gives `(default)` for the default tab) and takes `--details` (a rendering option: the report always holds the numeric values). `info` lists `SECTION_DESCRIPTIONS` and the resource folders. In `dump` a run of consecutive graphs is one table, like a run of other resources (`flushGraphs`, `flushResources`); structs are only in `code`.

Literal ids: the same number can be the id of a resource in each of the four id spaces, so `buildRefs` indexes resources by `pinType:guid`, from the class lists of `ID_SPACES` (`refs.mjs`; GUID = `Gid`, which also covers the stage and the players (`GIL_LEVEL_ENTITY`, `GIL_PLAYER_ENTITY`), PrefabID = `Pfb`, ConfigurationID = `Cfg`, IntegerID = plain `Int` > 1e9). A class in no list is never matched by guid. Edit the lists there.

### Custom variables

Entities and templates (root 4 / root 5 of a `.gil`; the entity resources 3 / 4 and the template resources 1 / 2 / 18 / 19 / 25 of a `.gia`) keep their custom variables in a component of the *dynamic* list the schema leaves opaque. `varscan.mjs` (`scanVariables`) reads it, `scanSection` / `scanGiaDefinitions` (`mounts.mjs`) call it and `gil.mjs` / `model.mjs` attach the result as `resource.variables` (`null` for any other resource, `[]` for an entity or template that holds none). A variable is `{ name, typeId, structId, keyType, valueType, value }`; `buildVariable` (`model.mjs`) adds `type` (the datatype word) and `label` (`Dict<Str,Int>`: the type told apart by what a dictionary maps). The value is an AST of the shape `normValue` makes (`kind` `bool` too), so `valueJson` and `valueSpans` handle it like a pin's value. The wire layout is in [FORMAT.md](FORMAT.md) ("Custom variables"). Type ids are the server ones (`SERVER_TYPES`), the same as a graph variable's.

**Save variables.** The in-game saves of a `.gil` (root 31, `GilSaveData.sets`; FORMAT.md, "In-game saves") declare variables the templates do not store. `saveVariables` (`gil.mjs`) turns every slot into a custom variable in the
shape `scanVariables` makes (type `L<Struct>`, the slot's struct, an empty list as value; a name and struct declared by several saves once) and `withSaves` appends them to the `variables` of every player template
(class `PLAYER_TEMPLATE`) and every player entity (`GIL_PLAYER_ENTITY`), after their own, unless the owner declares the same name and type itself. Everything downstream (`fileVariables`, the checks of `refs.mjs`) sees them as
ordinary declarations; entities mirror their template, so the entity table has no rows for them. The saves themselves are resources of class 41 (`class#41`).

`variables.mjs` (`fileVariables`) builds the `variables` key of a `dump` item: the **graph table** (one row per variable of every graph but composite bodies, in resource order; `public` marks the published ones), the **prefab table** (stage, player templates, character templates, then prefabs / creations / projectiles, each kind in resource order: one row per variable) and the **entity table** (an entity against the prefab named by its `parentId`, looked up among the templates of the file; no such template = no variables). Per entity the rows are, in the order of the prefab's variables, `delete` (gone), `newtype` (`variableTypeKey` differs: label and struct id), `edit` (value AST differs), then `add` in the entity's own order; an entity with no row is left out. `present/dump.mjs` prints the three under one `Variables` heading (`GRAPH_VARIABLE` / `VARIABLE` / `VARIABLE_CHANGE` lines).

**Graph variables set by a host.** A mount carries `edits` (`scanSection` / `scanGiaDefinitions` read them with `readVariable` of `varscan.mjs`; `model.mjs` gives `resource.mounts[]` = `{ slot, graph, service, edits }`, a .gia's mounts coming from `scanGiaDefinitions` with the slot told by the template class), see [FORMAT.md](FORMAT.md) ("Graph mounts"). `fileVariables` takes every public variable of every mounted graph (`mountsOf`) with the host's value (`edit.value`, else the graph's own) and adds a row (`graph` set to the graph reference, the graph's variable's type) where the value differs from the baseline: for a prefab / template / stage the graph's own value (a stored entry that equals it is no change), for an entity the value the *parent's* mount of the same graph has (matched by graph GUID + service) and the graph's own value when the parent does not mount it or there is no parent in the file. Values are compared as `valueJson` without `set` (a graph's default says whether the editor saw it set, an edit does not). Those rows follow the custom variables of their owner in the prefab table, and follow the custom-variable rows of their entity (always `change: 'edit'`) in the entity table; an entity with only such rows is listed. The graph is written in braces behind the variable name, `"Faction" {'Graph'}`. Ids in a value are resolved against the file's resources with `literalResource` (as a pin's literal in `code`): `varscan` tags an id with its type (`ty`), `fileVariables` puts `resource` on the `id` / `int` value objects that match and `valueSpans` prints it as `{CLASS:"name"}` behind the value, in every position of a list, struct or dictionary.

`refs.mjs` checks the declarations against the graphs' use of custom variables (the `literal` refs of kind `custom_variable`; raw composite copies skipped) once per file that has at least one entity or template: `custom-variable-type-conflict` (a name declared with different `variableTypeKey`s), `custom-variable-type-mismatch` (the datatype a node selects, `varType` of the ref, is no declared type of that name: compared by `type`, not `label`, because a node's pin says `Dict`, not `Dict<K,V>`) and `custom-variable-undeclared` (no declaration of the name at all). A name is not resolved to an entity, so one matching declaration is enough. The last two are comment-suppressible and raise `stale-suppression-comment` like the others.

Entities carry the id they were created from (`parentId`: entity field `2.1`, in a `.gil` root 5 entry and in the `.gia` entity definition; `scanSection` / `scanGiaEntities` in `mounts.mjs`): the GUID of a prefab / creation / projectile template, or the id of a native object that is no resource of the file. `dump.mjs` joins it to the templates of the file (classes 1, 2, 25) for the `Parent` column of the resource table and counts the entities of each prefab.

`parseBundle` ends with `orderResources` (`model.mjs`), so every mode lists resources in the editor's order. Each group is re-sorted within its own
positions in the list; other resources stay where they are, and `idx` (the position within the primary or dependency list) is unchanged.

| Group | Sorted by |
|---|---|
| graphs | domain (`GRAPH_ORDER`: entity, status, class, item, composite bodies, character skill, creation skill / status / decision, control skill, boolean / integer filter), then folder rank (default tab first, then custom folders as stored), then name (`Intl.Collator('en', { numeric: true, sensitivity: 'base' })`: a fixed locale, so the order is the same on every machine) |
| composite declarations | like their bodies: folder rank, then name (a body is named by its declaration) |
| prefabs, statuses, skills, custom creation skills, control skills (`FOLDER_BY_CLASS`) | folder rank (custom folders as stored, the default tab last), then position in the folder |

`mounts.mjs` reads the folder index into `placeByKey` (`{ rank, pos }` per `family/type/guid`) and the composite palette into per-composite ranks;
`gil.mjs` passes them on as `folder`, `folderRank` and `folderPos`. Without folder information (a `.gia`, or a resource the index does not list) the
folder step does nothing. To order another kind of resource: add its class to `FOLDER_BY_CLASS` (family and type code from the folder index, see FORMAT.md).

GUIDs in a level are unique **per kind** only, so `model.mjs` gives every graph a bundle-unique `gkey` (`body:<guid>` for composite
bodies) used in reference scopes, and `mountsOf()` joins mounts to graphs by GUID **and** service domain.

## The resolver and static analysis

`Resolver` (`resolve.mjs`) turns a node instance into `{ name, user, variant, sys, branchValues, unresolved, ... }`: built-in nodes come
from the node DB; nodes whose shell id is a declaration GUID in the same file (composite call, signal, struct node) come from that
declaration. Every lookup can miss and degrades to `<node#ID>` / index-only pins while keeping values and wires.
`declForBody(res)` finds the declaration of a composite body (through the declaration's `graph_ref`, falling back to an equal GUID).

`Multiple Branches` (shell id 3) is special-cased: the game names its branches `1`, `2`, …, but each compares against the matching entry
of the static `valid_pin_list` input. The resolver exposes those values as `info.branchValues`; printers name branch *k* after entry *k*,
and the list pin is hidden. A wired list has no static values, so nothing changes then.

`StaticResolver` (`staticres.mjs`) answers three questions for `refs.mjs`. It is deliberately not a general interpreter.

* `resolvePin()` follows an input pin backwards to a string: through `Get Local Variable` (its Initial Value input), `Get Node Graph
  Variable` (the variable's *declared* value; runtime `Set` calls are not tracked), and composites (through the port map, in both
  directions, with a frame stack for nesting). The result is `value`, `unset`, `symbol` or `dynamic`.
* `resolveBool()` does the same for a Boolean input pin (`true`, `false`, `dynamic`, or `null` when no pin is stored), following an exposed composite
  input port to the call site on the frame stack. It reads the Trigger Event and Loop pins.
* `analyzeListener()` walks the execution flow after a `When … Changes/Triggered` event while it is a pure name switch (`Multiple Branches`
  on the event's name, or `Double Branch` on `Equal(name, X)`), and returns the handled names plus an optional catch-all. Flow is followed
  across composite boundaries in both directions.

Node ids and pin indices used there are constants at the top of the file (shell ids 2, 3, 14, 18, 337); the name pins of the event nodes
are in `data/ref-rules.json`.

## The reference index (`refs.mjs`)

`buildRefs(bundles, db)` returns `{ refs, findings, limits }`.

A ref is `{ file, kind, key, scope, graph, graphGuid, graphKindNum, node, nodeName, nodeId, pin, mode, role, note, ... }`.

* `kind` ∈ `KINDS`: `graph_variable`, `custom_variable`, `timer`, `global_timer`, `signal`, `composite`, `struct`, `mount`, `node_type`, `literal_id`.
* `mode` ∈ `declaration | definition | literal | dynamic | unset | usage`.
* A name resolved through wires is `literal` with `resolvedVia`. A listener that handles every name has `key: ANY_NAME_KEY` (`'* (listener for any name)'`), role `listen`,
  and the reason in `note`.
* Node pins in files are **sparse** (only pins with a value or wire exist), so code must never assume a pin object is present.

**Which pins carry names is data.** `data/ref-rules.json` → `namedPins` lists, per node id, the pin holding the name, the role (`get`, `set`,
`start`, …), and optionally `valuePin` (the datatype), `triggerPin` (with `triggerDefault`) and `loopPin` (boolean pins).
A pin is stored only when edited, so a Set without a stored Trigger Event pin uses `triggerDefault` (true for both Set nodes). Trigger and loop are evaluated
per caller, because the pin may be exposed as a composite input port. A `set` whose trigger is not statically false (true, wired, or unreadable)
is shown as `trigger` instead of `set`, in the overview and in `--name` (`displayRole`); the ref itself keeps `role: 'set'` and its `trigger` value. Supporting a new named-pin node is usually one
entry; check the node's pin layout in `data/nodes.json` first (`in_param:N` / `out_param:N`, indexed by *shell* order). Extra entries can come
from `data/overlay.json` (`refRules.namedPins`).

### Composites

A composite body (`graph.kind === 21002`) behaves as if expanded into each graph that calls it, so a check made *inside* a body only has a
meaning from one caller's point of view.

* `buildRefs` builds the call graph first (`callSitesOf`, plus `callersOf` / `calleesOf` for `effectiveNodeCount`).
* `callFrames(bodyGuid)` returns one call-frame stack per real call path (arbitrarily nested). `attributionsFor(ref)` turns that into one
  perspective per real caller, plus a `raw` perspective (the body itself).
* For each non-raw perspective, `resolvePin` / `analyzeListener` is re-run with that caller's frames, so a name fed through a composite input
  port resolves statically wherever that caller wires in a literal. A composite called twice (directly or through an outer composite called
  twice) is attributed twice.
* This applies to graph/custom variables, timers, global timers and signals. The copies carry `viaComposite: [<composite label>]`.
  The `raw` copy (`rawCopy: true`) is kept for `--name` and the JSON `references` only; the overview and the declared/used findings skip it.
* Exception, `OWN_NAME_KINDS` (custom variables, timers, global timers, and listeners of them): when the name resolves statically with no
  caller frames (`frames: []`, so it is not an exposed port), the reference is attributed once to the composite body itself (`rawCopy` unset, no
  `viaComposite`) and not to the callers. For listeners that is decided per handler; catch-alls and names coming through a port stay per caller. A trigger / loop pin that
  is exposed is resolved for every caller, and kept only when they agree (otherwise `true` / `dynamic`).
* Findings for a node inside a body (`dynamic-reference`, `catch-all-listener`, `listener-no-handlers`) are raised once per real caller, never for
  `raw`. A composite with no callers raises none (`composite-never-called` covers it).
* A circular call chain raises `composite-circular-call`.
* The same call graph drives the *effective* node count of a graph: its own nodes plus the nodes of every expanded composite call.

Fixtures and worked arithmetic: `test/composite-inheritance.test.mjs`, `test/composite-flow-crossing.test.mjs`, and the "Indirect" graph of
`test/resolution.test.mjs`.

### Findings

The finding types, with their meaning for a user, are listed in [ADVANCED.md](ADVANCED.md) ("Findings"); `findings` of `buildRefs` holds them as `{ level, type, kind, key, file, graph, message }`. `struct-never-used` is
implemented but not raised (`STRUCT_NEVER_USED_REPORTED` in `refs.mjs`): a struct can be used in places the graphs do not show, which the analysis does not follow, so the absence of a use proves nothing.

**Comment-based suppression.** For `catch-all-listener`, `listener-no-handlers`, `dynamic-reference`, `duplicate-branch-value`,
`signal-sent-never-listened`, `signal-listened-never-sent`, `used-but-undeclared`, `custom-variable-undeclared` and `custom-variable-type-mismatch`: if the relevant node's comment contains the finding's `type`
as a substring (`suppressed()`), the finding is silenced. For findings backed by several nodes (the two signal ones, `used-but-undeclared`), a
match on *any* contributing node suffices. If the condition does not hold while the comment remains, `stale-suppression-comment` is raised
instead (`staleSuppression()` for the event and named-pin blocks, inline for signals and `used-but-undeclared`; never for `raw`).
Tests: `test/lint-suppression.test.mjs`, `test/multi-branch.test.mjs`.

### Literal ids

Typed id values (`Cfg`, `Pfb`, `Gid`, `Fct`) and plain `Int` values over 10⁹ are matched against **every other resource in the file**
(`resourceGuidIndexOf` / `literalResource` in `refs.mjs`, shared with `code`, so the priorities and the class filter below apply there too), and the overview and `code` show `CLASS:"name"` on a match. `Fct` is never matched. A typed `Cfg` skips the classes in
`CFG_EXCLUDED_CLASSES` (UI, layout, environment, deployment group): references to those are stored as a plain `Int`, which is what the
>10⁹ heuristic catches. An id that is the GUID of a *graph* gets a "matches guid of graph …" note instead.

### Limits

The `# limits` section of `warns` combines three things: `composites` / `signals` (counted from refs: a signal is three declaration resources
sharing one name), `resources` (`RESOURCE_LIMITS`: counts of `className` over all bundles; a new capped class is one line there), and
`graphSizes` (effective node counts). `STATIC_ENTITY` has no limit and is only counted. Limit numbers are those of game 7.1.0.

## Reports

`info`, `dump`, `refs`, `warns`, `check`, `raw` and `all` first build a **report** (`report.mjs`: `buildReport`, `buildRawReport`): one plain JSON-serializable object
`{ header, <mode> }` that holds everything a presentation shows, already resolved (graph names split into `{ tag, name }`, the titles of resolved ids,
the grouping of the refs overview, the findings' messages), and nothing about how it looks: no colors, quotes, padding or column choices. The format is
documented in [JSON.md](JSON.md) and described by `schema/report.schema.json`; **change them together with `report.mjs`** (`test/render-json.test.mjs`
validates every report against the schema, so a drift fails the tests).

* Every key of an object is always present; what does not apply is `null` (or `[]`), so a reader never tests for a missing key.
* Messages that carry structure (finding messages, notes, pins) are **rich texts**: arrays of plain strings and `{ role, text }` terms. A role says what
  the text *is* (`key`, `pinName`, `nodeName`, `graph`, ...); the theme turns it into colors. The engine still builds them with the tagged template `T`
  (which returns the plain string and remembers the structure) and converts at the boundary with `toRich` (`present/doc.mjs`); `fromRich` goes back to spans.
* `header` = `{ software, version, mode, files, options }`: the file names (a file is known by its **name only** from the moment it is decoded: `parseBundle`
  gets `basename(path)`, so no report, printer or message ever holds a directory) and the options that shaped the data. The printers take their titles, the
  "Scanned N files" lists and the multi-file prefixes from it. A report never holds an error: a file that cannot be read or decoded, or two files with the same
  name, end the run in `cli.mjs` before a report is built, and an `--output` file is only written for a run that succeeded.
* **Data options** (`present/options.mjs`: the key in `header.options`, the command-line flag, the "not given" value, and the options of each mode) are the ones that decide
  what the data holds: `--lang --db --input --lenient`, `--show-tag` (info: the export tag is in the data only with it), `--kind --name --sort-desc --top-graphs`, `--expand` (code: composite calls are expanded in the pseudocode), and for `all` also `--with-code`. A renderer reads them from the header, never from the command line.
* `dump` (`dump.mjs`, `fileDump`) lists the graphs, declarations and other resources as `items` in the editor's order; `present/dump.mjs` groups consecutive items of one kind into a
  table. `code.mjs` (`fileCode`) builds the code report: the complete graph model (see "The code report" below).
* `all` (`buildReport('all', …)`) builds the parts of `info, dump, refs, warns[, code]` over one analysis per file and one reference index, as `{ header, all: [parts], info, dump, code, refs, warns }`
  (a part that is not listed is `null`). `code` is in it only with `--with-code`.
  `present/all.mjs` prints the parts one after the other under a heading each (`# INFO` in the line formats), turning each part's title into a level-2 heading; `present/parts.mjs`
  (`partOf`) cuts the single-mode report of a part out of an `all` report.

`src/present/` renders a report and must not import anything of the decoder (only `paths.mjs`): `renderReport(report, opts)` (`present/index.mjs`) picks
the printer of `header.mode` and returns `{ text, err, code }`; `json` is the report pretty-printed. `scripts/render-json.mjs` calls just that on a saved
file, so a report can be rendered later without the game files. `test/render-json.test.mjs` checks that the direct output equals the output rendered from
the JSON, in every format, for many cases.

**A saved report as input** (`present/saved.mjs`, used by `cli.mjs` and by nothing that decodes): `loadReport` parses it and, unless `--lenient`, checks it against `schema/report.schema.json` (the
bundle and the web page carry the schema); `selectPart` decides what it can answer (its own mode; any of `info dump refs warns all` for an `all` report; never `check`, `raw`, `code`);
`optionDifferences` compares the data options of the (selected) report with those of the command line – each side's "not given" value counts as absent, `--lenient` is not compared –
and returns the one warning line. A report is recognized by its extension or by a first character of `{` (like the game files, by content); only one is processed at a time, and a
folder only yields game files. `scripts/render-json.mjs` renders a report as it is, without these rules.

## Output layer

Presentation does not print strings either. A printer in `present/` (`info.mjs`, `dump.mjs`, `code.mjs`, `refs.mjs`, `warns.mjs`, `check.mjs`, `raw.mjs`, `all.mjs`) turns its report into a **document**: a list of blocks
(`title`, `heading`, `para`, `facts`, `list`, `table`, `lines`, `note`, `pre`, `hr`) made of **inline spans** (`S(style, text)`, `graph(label)`,
`frac(used, max)`, `marker('### ')`, `sep(text, tab)`, plain strings). The header comment of `present/doc.mjs` documents every block and span. A formatter in `src/present/output/`
renders it; `present/emit.mjs` (`createPrinter`) adds the format choice, the Markdown BOM and `--search` / `--match`.

| `--format` | what it is | file |
|---|---|---|
| `text` | one greppable fact per line | `text.mjs` |
| `color` | the same lines with ANSI colors | `text.mjs` |
| `md` | the same lines as Markdown (theme emphasis, `&nbsp;` for alignment, real headings, `---`) | `simple.mjs` |
| `htm` | the same lines in `<pre>` blocks of a standalone dark page | `simple.mjs` |
| `markdown` | a real document: headings, tables, facts lists | `markdown.mjs` |
| `html` | the same document as a standalone dark page | `html.mjs` |
| `json` | the report itself, `JSON.stringify(report, null, 2)` (not a formatter; `renderReport` prints it) | `present/index.mjs` |
| `auto` | by the `--output` extension (`.md .markdown .htm .html .json`), else `color` on a terminal without `NO_COLOR`, else `text` | `output/index.mjs` |

Rules:

* **Styling lives in `src/present/theme.mjs`**: one entry per kind of thing with its console color (`ansi`), Markdown look (`md`) and the `quote` printed
  around it in *every* format. HTML gets a CSS class per style, with colors generated from `ansi`. Nothing decides styling by pattern-matching text;
  builders say what each piece is. `test/output.test.mjs` checks that every style used is defined.
* Every block may carry `text` (the lines it contributes to `text`/`color`/`md`/`htm`); `markdown`/`html` use the structure instead. `text: null`
  hides a block in the line formats. A `plain: true` heading (the `GRAPH` / `DECL` / `STRUCT` lines) is an ordinary line in the line formats;
  only `markdown`/`html` make it a real heading.
* **Columns of a line are separated by `sep()`**, never by a bare `' '` (a space inside one value stays a plain string). A separator prints its text everywhere,
  and a tab in `text` / `color` with `--tab` (`makeFormatter(fmt, { tab })`, `createPrinter({ tab })`); `pad(n)` is column padding that vanishes then, `gap(n, m)` an indent
  of `n` spaces that is `m` tabs (`ind()` of the pseudocode, the key column of `info`). A separator character (`:`, `->`, `=`) is written next to the value on its left
  (`' :'`, `' ='`) and the `sep()` follows it. `--search` / `--match` and widths use `plain()`, which sees the spaces. `sep` is presentation: it has no rich-text form.
* Messages assembled as strings (findings, notes, resolution reasons) use the tagged template `T`: it returns the plain string (JSON output,
  tests and `.includes()` keep working) and remembers the structure for `spansOf(text)`.
* **Quoting convention:** a graph name is single-quoted (`'<skill>My Graph'`); everything else (keys, resource names, pin names) is double-quoted.
  The quotes come from the theme, never from hand-written strings.
* **The `text` output is the contract people grep.** It is covered by the expected-output files; a change to it must be intended.
* `md` and `markdown` output gets a UTF-8 BOM, added by the printer (`present/emit.mjs`), not in the formatters, so `json` is unaffected.

### The code report

`fileCode` (`code.mjs`) is the complete, resolved **graph model** of a file, one item per graph, declaration and struct (JSON.md has every key). Design decisions:

* **Model first, style last.** The report says what the file contains (nodes with resolved names and ids, pins with name / type / typed value / wires, variables, comments, port
  mappings) and nothing about how a style shows it. Pins without value or wire and values nobody edited are in it; `--all-pins` decides only what `present/code.mjs`
  prints. `present/code.mjs` is the *wire-by-line* style (the greppable text): it turns each pin into its lines, and the document formats group the same facts into tables.
* **No joining by index in a renderer.** A wire carries the target node's name and ids and the target pin's name (`nodeRef`, `pinRef`), a port mapping likewise, so a style never
  looks a node up. The same two objects are what any later view would use to name a node.
* **Values are typed trees** (`value`: `kind`, `set`, payload; enum values carry the names the database knows), not strings; a style formats them (`present/values.mjs`, `valueSpans`).
* **Wires are stored once**, where the file stores them (a flow on its out pin, a data connection on its in pin); a renderer picks the arrow from the pin kind.
* **A statement style (pseudocode from a static analysis) is added next to the model, not instead of it.** The analyser runs in the engine over the same resolved graph and its result
  becomes a new key of the graph item (statements and expressions that name the nodes they come from by `nodeRef`, reuse `value` for literals and `pinRef` for pins). The model stays
  complete, so any style can be rendered from one JSON file, and a statement can always be traced to its nodes. Adding the key is a format change: schema and JSON.md in step.

### Pseudocode

`pseudocode.mjs` (`pseudocodeBuilder`) adds the `pseudocode` key to every graph item of the code report (JSON.md has the keys); `present/pseudocode.mjs` prints it (`code --pseudocode`) and decides nothing about the flow.

* **Every input is given.** The file stores a pin only for the ones that were wired or edited, so `describe` takes the inputs from the node's definition (node database, or the declaration of a user node) and `defaultOf` gives each unstored one its default: the database's `default`, a composite declaration's default value, else the zero value of its type (`defaultValueOf`; an unbound generic pin is an `unset` expression). A stored value nobody edited (`set` false) is the same default. Both are `literal` expressions with `value.set` false and print as `(default)`. Only slots a node does not have are left out: Assembly List / Dictionary beyond their count (`assemblyCount` in `resolve.mjs`: the stored `Count`, else the database default, 1 and 2, and at least the last wired slot) and the case list of a Multiple Branches that is named by its branches. Hidden pins (`Count`, `is_bp_var`) are inputs too.
* A node is an execution node when its definition (node database, or the declaration of a user node) or its wires give it flow pins; pins the file does not store are taken from the definition. Anything else is a data node and is written again before each execution node that needs it (once per case: `memo` in `buildCase`).
* A call of a composite (`describe`: `d.callee`, `{ name, keys }`; `name` is what the body is filed under in `Composite[...]`) is a node like any other: a case (`kind: 'composite'`) when the composite declares flow pins, a data node otherwise, with `call.composite` set and an argument for **every** declared input (`interfaceKeys` makes the keys the call and the body agree on: `In` keys, returned keys, yielded flow-output labels). A composite call has no `$.` outputs: `outputExpr` never reads its data pin from a variable of the caller, the reader writes a data read of the composite into its own case (`callOf(..., { data: true })`, no entry point), also when the call is a case as well; the read returns what the instance's execution nodes stored (`$$.name`). Every call node is an *instance* (`instance()`: `comp` maps the node indexes of the composite calls of a graph to `Comp_001`, ..., by position, so the names are the same with and without `--expand`; `tag` is the names of the instances an expanded body is in); `call.composite.instance` is its name, the second argument of the call, under which the composite files what its instance keeps. The entry point is the call's `input` (`input: <flow input name>`, set by the caller's jump; a composite call that only reads data has none).
* With `expandComposites` (`--expand`, recorded as `header.options.expand`) a call is replaced through *instances* (a body entered from a call node, with its call path): flow wires, data inputs and outputs cross the boundary through the body's port mappings, so a call node is never a case. A composite called in a cycle, or whose body is not in the file, stays a call. Without it no instance exists except the root. A composite body is printed on its own in both modes, with its ports left open (`port` expressions, `exit_` targets whose `label` is what the body yields).
* **Events inside a composite.** A call that is not expanded is a case that the events inside the composite enter (the editor shows the composite itself as the event). `eventsOf` lists them over the body and the bodies it calls (a cycle ends the list): `case.events` = `<id of the call>.<event id in the body>`, a nested call's events behind the id of its node (`node_0007.node_0004.event_0002`); an expanded call has the same ids as event cases. The renderer writes a `case` label per entry, and the body is entered at the part after the id of the call (`node.slice(node.indexOf('.')+1)`); a call that has flow inputs too is also a label of its own id, and tells the two apart by comparing `node` with that id. Such a call is an entry point like an event (`callers: null` when nothing is wired to its flow inputs).
* **The order of the cases** (`run` in `build`): from each entry point (events and composite calls with events, in node order; then, in a body, the cases its flow inputs enter) the cases it reaches, depth first in the order of the flow pins and wires, each once, so a case that has one target is mostly followed by it (`void "id";`). What no entry point reaches is `unreachable` and comes last: first the cases nothing is wired to (each with what it reaches), then whatever is left (cycles) in node order; the renderer starts each such case with `throw 'unreachable';`.
* **Unreachable composite bodies** (`liveBodies`, a fixed point over the file). Each case records the bodies it makes use of (`caseBodies`: the composite it calls, the bodies an expanded call is inside of, the bodies whose node outputs it reads), the outputs of a body the ones its data uses. A graph that is not a composite body is run by its events; a body is live when a reachable case of a live graph uses it (flow, events inside, a data read), and what a live body's reachable cases and outputs use is live in turn. `pseudocode.unreachable` is the rest; the renderer's first line of such a body is `throw 'unreachable';`. A body that is entered through any flow input is taken to be entered through all of them, as the body is shown once for every caller.
* The function is filed in a namespace chosen by the engine (`namespace`): `ServerGraphs` for the server service domains (entity, status, class, item), `ClientGraphs` for the others, `Composite` for composite bodies. The graph's name is printed without its `<tag>`; the namespace says what the tag said, and a name shared by two graphs is already told apart by the GUID suffix (`dup` in `analyze.mjs`).
* **Execution types** (`flow.mjs`, `behaviorOf` / `compositeFlow` / `flowOf` in `pseudocode.mjs`). Every execution node, and every composite, is `single` (the flow always goes on through its one output, once: native nodes with one flow output), `choice` (through exactly one of several, or, for a composite, none: `terminal`) or `generic` (anything else: loops and other natives with several outputs run them in turn, a composite that does more after it gave the flow back). A native node is typed by `data/codegen-rules.json` (the choice nodes, `form` `if` / `switch`, `default: "first"`) and its number of flow outputs. A composite is typed by `analyzeFlow`: the model is plain data (the nodes, the type of each, the wires of each output, the entries per flow input), the outcome of a path is nothing ran (`E`), the flow ended inside (`T`), it was given back through output n, or messy (`X`); the outcomes of a node are the fixed point of the outcomes of the nodes it reaches (cycles are fine), sequences make an outcome messy when anything runs after the flow was given back, a flow output that feeds the composite's output and another target is messy, a loop repeats its body (any exit there is messy) and runs its last output once, and a flow into a node's second input (*Break Loop*) just ends the path. The body is generic when any entry can end messy, when it has events of its own, no flow input, or calls itself (`callsItself`); several flow inputs give the union. The result is `pseudocode.flow` of the body and, through the callee, the `flow` of every case that calls it; a composite call's `next` keeps only the outputs its body can leave through. `flow.form` is what a renderer writes: `call` (single), `if`, `switch` (a composite from three ways out; the dropped flow is the `default`, else `default: throw null`), `loop`. Tests: `test/flow.test.mjs`.
* **Special nodes are data** (`data/codegen-rules.json`, by node id): *choice* nodes (their `flow` is `choice`; Double Branch is `form: "if"`, Multiple Branches `form: "switch"` with its first output as the `default`; neither drops the flow), *hidden inputs* (`hiddenInputs`: `is_bp_var` of Get / Set Custom Variable; the call's `args[].hidden` is set while it holds nothing but its default and the renderer leaves it out without `--all-pins`), the *graph end* node of a filter graph (an execution node without flow pins; a graph that is just that case is `flat`, written without a switch, and the node's `extra` is the graph's `evaluation_interval`, 0.3 when the file has none) and *Get Local Variable* (the call's `id` is `{ kind: 'var', name: "Var_NNNN" }`, NNNN the node's index, behind the names of the instances where a body is expanded, because every such node makes its own variable; every other data node that is not a composite call has `{ kind: 'data', name: "data_NNNN" }`, behind the ids of the calls of an expanded body, and a composite call is named by its instance, `Comp_NNNN`; the renderer writes the id as the first argument, before the pin object). Adding such a node is one entry.
* A composite body shown on its own has `interface`: its data inputs and, for each data output, the expression inside that stands for it with the data nodes it needs; inputs mapped to a node pin that the file does not store are added to that node's arguments, also where the body is expanded into a caller. Its cases carry `ports` (`{ pin, label }`: the flow inputs that enter there, written as `case 'input: <label>':`). A composite case with no flow input has no callers (`callers: null`): the events inside it enter there.
* **Lazy values (`--lazy`, renderer only).** The report is the same; the renderer wraps only what crosses a composite's boundary. `lazyCallsOf` takes the data nodes of a scope (a case, or the outputs of a composite body) whose values go into a composite call (or stand for a composite's output) and, transitively, the data nodes those are computed from; their calls are written `lazy(()=> Node(...))`. A read of a lazy value (such a node's output, a composite's output, `In.Pin`) by a native node is `unlz(...)`, a read by a composite is passed as it is. Without `--lazy`, or in a scope with no composite, nothing is wrapped. The helpers are one block comment in front of the first composite body. 
* **Values are plain.** A data node is computed where its case needs it (`const { Key: Ety_01 } = Node(...)`); a composite is given the values of its inputs (`In = { key: Type }` in its definition) and returns the values of its outputs, so a call, an expanded body and a body shown on its own all use the same convention. Only `--optimize` moves a call: into the argument that reads it, in a typecast of the variable's type (a composite's output is not cast). `$.` variables, `event` and literals hold values as well. `varNo` numbers the Get Local Variable nodes of the file by node (resource order, node order), so a name is the same in every mode; an expanded body's variable is written in full (`"Comp_001_Var_0001"`), a body shown on its own leaves the prefix to the renderer.
* **A composite body stores per instance**: it is shared by every caller, so the renderer (`def` option, from `composite_body`) files what its execution nodes give out under the instance (`const $$ = $[Comp] ??= {};`, `$$.Ety_001`; declared when something is read), keeps `next` and `input` in `let` variables of one run, writes the local variables as `Comp + "_Var_0005"`, and a generic body writes `yield* GoTo` (return what the other case yields), `yield "label"` (leave through a flow output) instead of `await GoTo`; a body that leaves once (`plain`) is an `async function` that awaits `GoTo` like a graph and returns `{ Next: "label" }`, and a path that ends without leaving (`return Exit();`, `return;`) is how it drops the flow, `.Next` of what it returned being undefined.
* **Search in pseudocode** (`searchedNodes` in `code.mjs`, a render option: the report is the same). The test is made on the lines of the plain `code` listing (`graphBlocks` tags its node and port-mapping blocks with the node they are about), never on the pseudocode. A line that matches finds its node; a found node that is not an execution node finds the nodes that read its outputs, repeatedly, until execution nodes (`in_param` wires of the report), so that a case, which writes its data nodes, exists to show it. The result is one `graph key -> node indexes` map per file (`graph key` = `guid|service`, `call.graph` / `via[].graph` of the report); `shownCases` keeps the cases of found nodes (or expanded from a found call), `shownFace` the data outputs of a composite when one of their nodes is found, and a graph without a found node is not written. `all` uses the same pass for its code part, which is then not grepped again (`keep` of a group).
* Every case has `callers` (the cases whose flow outputs lead to it, null for an event); the renderer writes them as a comment after the `case`.
* **Orphaned data nodes** (`orphanChains` in `build`; `orphans` of the graph, `case 'orphaned'` in the renderer, last, with `throw 'unreachable'`). Every data node of every instance that no case or composite output wrote (`printed`, filled where a data call is made) is written in the end, so nothing of the graph is lost: among the nodes left the one that ends the longest chain of data wires (the first in node order on a tie; with a data loop every node is a candidate) is written by itself with what it needs above it (shared `memo`, so a node two chains need is written once), then the search is made again. A composite call needs all of its inputs, whatever its body does with them, which falls out of writing it as a call. The sink of a chain has no output variables. A graph with orphans is not `flat`; a search shows the chains that have a found node.
* **Types of pins nobody stored.** A node whose kernel is its shell is the generic node or its first variant, which the file does not tell apart, so the variant's constraint (`C<T:Int>`) is applied only when the kernel differs; otherwise the parameters come from the types of the pins the file stores, and what is left is `Any` (`unset` for an input, no default value). A dictionary says what it maps (`dict` of an output, of a literal and of an interface pin: from the value's own binding (`map_binding` of its type definition, `keyType` / `valueType` of `normValue`), the declaration's `map_type`, or the database's `D<R<K>,R<V>>` with the parameters bound); a pin the database types just `Dict` says nothing about them; a generic pin also learns them from the wires (`inferFromWires`: what feeds an input, and what the inputs fed by an output make of their own parameters). The renderer writes `Dict(k,v,expr)`, `Any` for a side nothing tells, and `Dict(expr)` when neither is known.
* **Pins a style hides** (`hidden` of an argument, data in `codegen-rules.json`): the pins that hold their default (`hiddenInputs`), and the ones that say nothing the node does not (`redundantInputs` by node and pin index, `redundantEnums`: the operator of a math, comparison, logic or type conversion node, found by the enum family of the pin).
* **Constants** (renderer, `literal` / `bare` in `present/pseudocode.mjs`): a float has at least two decimals (`Flt(0.00)`, more are kept; the parts of a `Vec` are not changed), a boolean is `Bol(false)` / `Bol(true)`, an entity constant of 0 is `Ety(null)`. `dump` and plain `code` write values alike (`values.mjs`: `flt`, `true` / `false`, `null` for an id of 0, in the theme's `bool` style).
* **The explanation** at the top of a pseudocode document (`PSEUDOCODE_INTRO`, `present/pseudocode-intro.mjs`, one block comment before the first graph, after the file's opening; written only with `--lazy`, the language model's form, and not when a search is on). It is text, so the tests do not compare it (they strip it); edit it there and run `npm run update-expected`.
* Numbers: intermediates are numbered per case in the order the data nodes are written; the outputs of execution nodes over the whole graph (pass 1 numbers them all first, a node may read the output of one that comes later).
* Every output carries `uses`, the number of reads of the variable (a local one in its case, a `$.` one over the whole graph, counted after all cases are built); every `var` / `global` expression names the node and pin it reads (`from`, `Function.Key`) and every flow target the function of the node it reaches. The renderer decides from these: an output nobody reads is not printed (`--all-pins` prints it), the read of a variable is followed by a comment with its source, a jump by a comment with its target.
* `--optimize` is a rendering option (`present/pseudocode.mjs`), the report is the same. When a call has exactly one printed output it is read through the call (`const x = Fn().Key;`, `$.x = Fn().Key;`, `(await Fn()).Key` for an event); a local variable read exactly once whose call has one printed output is not declared, its call is written in the argument that reads it, in a typecast of the variable's type (`Ety(Fn(...).Key)`), recursively. Data nodes have no side effects, so moving the call to its only reader does not change the result; a node's comment goes on a line of its own in front of the argument. `$.` variables are never inlined.
* A node with several flow inputs (a loop's *Break Loop*) takes `$.input` as an optional second argument of its function (`call.input`), which every `GoTo` to it sets first to the name of the flow input the wire goes to. A pin name can therefore never clash with it. Flow pins are only strings (branch labels, `$.input`, `exit_` ids), so an unnamed or numeric one is its index as it is, while data pins are object keys and are identifiers (`_0`).
* A literal carries `enum` (the family title and the value title, from the node database; printed `Enum("Family", "Value")`, or `Enum(1504, "Value")` when the family has no title) and `resource` (what an id literal points at, from the shared index in `refs.mjs`; printed in a comment).
* A flow wire that is not connected ends a case with `return Exit()` (also after a `for` over a generator when nothing at all is wired, a branch of an `if` / `switch`, and a composite that has no wire at all); `return;` is the end of a node that has no flow output, and of the flow a composite drops (`// terminal`); a jump to the case printed right after it is `void "node_id";` (fall-through). Graph canvas comments are printed one per line before `switch(node){`.
* The renderer gives every case, node-local intermediate and graph-global output an anchor id (`p<file>_<graph>-c|l|g-…`, unique across the whole page); in `html` each use of a variable and each `GoTo` target links to it, the other formats print plain text.
* `expandComposites` only decides which calls are replaced by their body; everything else (the definitions) is the same in both modes.

## Command-line internals (`cli.mjs`)

`main(argv, io)` is testable in-process (`io = { out, err, isTTY, env }`); `safeMain` adds the last-resort error handler (set `GIA_DEBUG` for a
stack trace). Modes: `info`, `dump`, `code`, `refs`, `warns`, `check`, `raw`, in that order everywhere (help, README, web tabs), then `all`, the mode made of the others, then `llm` (`all` with fixed options, see below).

* The whole file is analysed once per run (`analyzeBundle` in `analyze.mjs`); a mode only picks what is reported. `dump` = one summary line per
  graph / declaration (a table row in the document formats), plus a `RESOURCE` list and `MOUNT` lines; `code` = every node, no resource list.
  `refs`, `warns` and `check` never depend on what was printed.
* Order of a run: parse the options, collect the inputs (a saved report ends here, see above), refuse files with the same name (exit 2), decode every file and refuse the run if any failed (exit 1,
  every failure listed with its path, nothing printed). Errors name the path because they have to say which file; reports only know names. `--output` is written only when the exit code is 0.
* `--search TEXT` / `--match REGEXP` (AND when both) filter the *printed lines* of any mode (`emitGrep`, `present`); they never filter data
  (`--kind` / `--name` do). Exit code 1 when no line matches. Two single quotes (`''`) stand for a double quote, to ease quoting on Windows.
  The line formats print the matching lines (plus `--context`, groups separated by `--`). The document formats (`markdown`, `html`) keep the document: `filterBlocks`
  (`filter.mjs`) matches the same text lines, but each line belongs to the unit that prints it (a table row via `rowLines`, or `text` with one line per row; a list item; a
  line of `lines` / `pre`; else the whole block) and keeps the unit when one of its lines is shown. A heading stays while something under it stays, and recounts a count in its
  title (`recount`); the paragraphs and facts under a heading follow it; a node's head line stays with its pin table. The title of each file is kept when the file has a hit.
* `info --key KEY` prints one value (`infoValue`: a row of the File / Contents tables, else the count of a resource class by name) as plain lines through `emitLines`; it is the
  only place an `info` option replaces the report. The tag parts need `--show-tag` (without it they are not in the data).
* `llm` is not a report mode: `main` turns it into `all` with the options of `LLM_OPTIONS` (its only options are `--lang` and `--output`, which `LLM_OPTIONS` leaves to the caller; any other option, and a saved report, is a usage error; the format stays `text` whatever the extension of `--output` says), takes `warns` out of the report (`all` and `warns` of the object, but without details for `dump`) and prints it with `--short --dedup --tab --pseudocode --optimize --lazy` plus `# END` line. The web page has an `LLM` tab for it, after `All` (no options of its own, a text area, a `<input files> - llm.txt` download); it passes `llm`, the files and the language chosen on the Input tab (`globalArgs(['lang'])`), not the other global options.
* Option scope: `--tab` every mode (rendering, text and color only); `--short` info and the info part of `all` (rendering); `--dedup` dump and the dump part of `all` (rendering: `dedupResources` in `present/dump.mjs`); `--show-tag` info; `--details` dump (rendering; `all` always shows the details); `--sort-desc` refs; `--top-graphs` warns; `--kind` / `--name` refs and warns; `--expand` code (a data option: it decides what the pseudocode in the report holds); `--all-pins` code (rendering; also applied to the code part of `all`); `--pseudocode` / `--optimize` code (rendering; `--optimize` only with `--pseudocode`); `--with-code` all (which takes every other data option too). The data options (see "Reports") are recorded in `header.options` of the report; the rest (`--details`, `--all-pins`, `--pseudocode`, `--optimize`, `--key`, `--search`, `--match`, `--context`, `--no-file-prefix`, `--strict`) only change how a report is shown. A mode ignores options of other modes.
  The `HELP` text groups options by mode: keep it in sync when adding an option (`test/search.test.mjs` and `test/warns.test.mjs` check parts of it).
* Directories are searched recursively for `.gia` / `.gil` files **and** for any file whose header is a GIA/GIL container.

## Running outside Node

`miliastra-search.htm` is only a form; the engine in the page is the same code.

* **The engine never touches `fs`, `path`, `process`, `Buffer` or `import.meta`.** Everything from the outside world goes through `src/host.mjs`
  (`host.fs.*`, `host.data('data/nodes.json')`), and the *entry point* installs the implementation: `host-node.mjs` (real files; used by
  `miliastra-search.mjs`, the tests via `test/helpers.mjs`, and the scripts) or `host-web.mjs` (a Map of name → bytes, with data files embedded).
  There are no "am I in a browser" checks. A new capability = a function in `host.mjs` and in both hosts. Pure path helpers are in `paths.mjs`;
  use `toHex` (decode.mjs) instead of `Buffer`.
* `src/web.mjs` is the web entry: `run(argv, files)` = `safeMain` with in-memory io, returning `{ code, out, err }`; `identifyFile(bytes)` says
  gia / gil / neither by content.
* `web/miliastra-search.bundle.js` is **generated** (`npm run build-web`, `scripts/build-web.mjs`): a small bundler folds `src/web.mjs`, its imports,
  `data/*.json` and `schema/*.proto` into one *classic* script, because browsers block ES modules and `fetch` on `file://`. It understands only the
  import/export forms the engine uses (named imports; `export function|const|let|class`; no cycles; no `import *` or `export default`) and rejects
  Node-specific code in bundled modules. **Rebuild after any change under `src/`, `data/` or `schema/`**; `test/web.test.mjs` fails on a stale bundle.
* The page builds an ordinary argv from its form (`['code', ...files, '--format', 'html', ...]`). Enter in any option field of a tab presses its Process button.
  "fullscreen" writes the engine's page (without the frame's `<base>`) into a new tab with `document.write` (a `blob:` URL is refused from `file://`). Such a tab is `about:blank`, where
  `href="#x"` would navigate away, so the page gets a click handler that scrolls to the target. Options reach the page through the `TABS` table
  (and `GLOBAL_OPTS` for `--lenient` / `--lang`); an option that is not listed there is simply not available on the page.
* Page behaviour (DOM code) is not covered by `npm test`. Checks done by hand in headless Chromium from `file://`, simulating drops with `DataTransfer`.
  A window-level drag handler shows the drop overlay only when the drag carries `Files`; a drop replaces the file list; every file-list change goes
  through `renderFiles()`, which blanks each tab's frame and status. Rich/Plain output is shown in a sandboxed `<iframe srcdoc>` with
  `<base href="about:srcdoc">` injected, otherwise `href="#x"` anchors resolve against the page's own address and do not scroll. A frame is its own
  document and never passes a drag to the page, so every page shown in one (also the blank one, which is a `srcdoc` too) gets `DRAG_SCRIPT`, which posts a
  message up on a file `dragenter`; the page then shows the overlay, which hides the frames. That is why the frame is `sandbox="allow-scripts"` (and never
  `allow-same-origin`: its script can do nothing but post). The Json format is not shown but downloaded as a `Blob` (exit code 0 only); the frame gets a
  one-line note.
* `test/web.test.mjs` runs the bundle in a `vm` context without Node globals and compares `run()` with the CLI for the same argv.

## Data files

| File | What | How it is made |
|---|---|---|
| `data/nodes.json` | The node database the engine loads: node names in every language the game ships, pin names and types, kernel variants, enum families | `npm run build-db` from a local game install |
| `data/overlay.json` | Hand-written additions merged over the database at load time (`nodes`, `enums`, `kernels`, `refRules`) | by hand; empty by default |
| `data/codegen-rules.json` | Nodes the pseudocode treats specially: choice nodes (and how they are written), hidden inputs (`hiddenInputs`: while they hold their default; `redundantInputs` and `redundantEnums`: whatever they hold), the filter graph end node, Get Local Variable | by hand |
| `data/ref-rules.json` | Which node pins carry names; the event nodes and their name pins | by hand |
| `schema/gia.merged.proto` | Field/enum reference for the decoder | see `schema/CHANGELOG.md` |

### `nodes.json`

```
{ formatVersion: 2, languages: ["CHS", "CHT", "DE", "EN", …], counts, sources, nodes, enums, kernels }
```

* `languages`: the language codes of the names, as the game names its `TextMap` folders (CHS, CHT, DE, EN, ES, FR, ID, IT, JP, KR, PT, RU, TH, TR, VI). `--lang` takes them in any case; `ZH` is CHS. A missing name falls back to EN, then CHS.
* `sources[0]`: `kind: "game"`, `gameVersion` (when known), `nodeFiles`, and SHA-256 hashes of the inputs (`nodeAggregateSha256`, `textMapSha256` per language, `beyondGlobalSha256`).
* `nodes`: node id → `{ id, names, sys, dom, variant, kernel, services, pins, variants }`.
  * `names`: `{ LANG: text }` for every language that has a text; absent when none has. Node descriptions are not in the game files and not in the database.
  * `sys`: `Server` or `Client`. `dom`: `Execution`, `Trigger`, `Control`, `Query` or `Arithmetic`. `variant`: true for a generic node (one id, several type combinations).
  * `kernel`: the id written into `.gia`/`.gil` files, when it differs from the node id. `services`: the graph types (service ids) the node exists in, when more than one.
  * `pins`: `in_flow|out_flow|in_param|out_param:<index>` → `{ names, type, hidden, default, slot }`. `default` is present for explicit defaults only; a pin without one is unset, i.e. the zero value of its type. `slot` is the pin's own number on client nodes when it differs from its list position; graph files use the list position, so it is informational.
  * `variants`: `[{ c, kernel }]`, one per concrete type combination: the id written into files and the constraint it stands for.
* `enums`: family id → `{ names, values: { n: { names } } }`.
* `kernels`: concrete id → `{ node, constraint }`. The key is the id alone and ids repeat across nodes (the first node wins); nothing reads the table, `variants` is the reliable source.

Types are written `Int`, `Str`, `Ety`, … (the tables in `model.mjs`), `L<T>` for lists, `E<family id>` for an enum, `Enum` for any enum, `R<T>` / `R<K>` / `R<V>` for a generic pin tied to a type parameter, `D<R<K>,R<V>>` for a generic dictionary and `D<Str,Flt>` for a dictionary pin of fixed kinds (its key and value type codes are in the pin's type block, `4.105.3` and `4.105.4`; a pin without them is just `Dict`). A constraint names the parameters of one variant: `C<T:Int>`, `C<K:Int,V:Str>`, `C<T:D<Ety,Gid>>`, `C<T:E<2>>`. A variant that cannot be told apart from another by its id (several type combinations behind one id, as on the client *Data Type Conversion* and *Assembly Dictionary* nodes) has no constraint.

`NodeDb.version` is `sources[].gameVersion`, or `null`. The "node DB is based on game …" warning of `dump` / `code` is printed only when it is not null and differs from the file's engine version.

**Overlay.** `data/overlay.json` entries are merged over the database: `{"nodes":{"1234":{"names":{"EN":"New Node"},"pins":{"in_param:0":{"names":{"EN":"Target"}}}}}}`. Names merge per language; a pin entry replaces the built pin.

## Scripts

Every script prints its usage for `--help` and fails on an argument it does not know.

| Script | Purpose |
|---|---|
| `scripts/build-db.mjs` (`npm run build-db [-- options]`) | Builds `data/nodes.json` from the editor resources of a local game install; see below. |
| `scripts/build-web.mjs` (`npm run build-web`) | Builds the browser bundle. |
| `scripts/mihoyobin.mjs` (`npm run mihoyobin -- <command> …`) | Developer aid: a schema-less explorer for `.mihoyobin` files (XOR `0xe5` protobuf; `--xor none` / `--container` for any other protobuf, such as the payload of a `.gia`/`.gil`). `dump` prints one file as a tree (`--flat`: one `path = value` line per leaf, for diff and grep); `census` aggregates many files per field path (files, count, repeated, value sets, text samples; `--proto` writes a draft `.proto`, `--json` machine-readable); `find` searches by `--path` / `--value` / `--text`; `keys` groups TextMap keys by pattern (numbers masked; `--grep S` lists the matching entries with their hashes); `table` writes TSV, one row per file or per entry of a repeated root field (e.g. per input pin); `unxor` writes the decoded bytes. `--text-map FILE\|DIR` resolves text-hash varints in every command, and `find --text` then follows hashes. Whether a length-delimited value is text, a sub-message or bytes is a guess (strict parse, UTF-8 check; text wins when both fit, `--prefer-msg` flips it). |
| `scripts/dump-json.mjs` | Developer aid: prints the resources of a `.gia` as JSON with the schema's field names (cut to 6000 characters each). Selector: `all`, `R3`, `D1`, or a `resource_class` number. `raw` mode of the main tool is the schema-less counterpart. |
| `scripts/render-json.mjs` | Renders a saved report (`--format json` output) in any other format with `src/present/` only; `--validate` checks it against `schema/report.schema.json`. |
| `scripts/add-bom.mjs` (`npm run add-bom`) | Adds a UTF-8 BOM to every `.md` / `.mjs` file under the project (`node_modules` and `.git` skipped; files that have one are left alone). |
| `scripts/cli-args.mjs` | Strict option parsing shared by the scripts. |

### `build-db`

```
npm run build-db [-- options]        node scripts/build-db.mjs [options]

--genshin <folder>  where to look for the game (default: %PROGRAMFILES%)
--version <V>       game version to record (default: game_version from the install's config.ini)
--compare <file>    database to compare the result with (default: data/nodes.json)
--out <file>        where to write the result (default: data/nodes.json)
--limit <N>         examples per difference in the comparison (default 5)
--help
```

With no arguments, `npm run build-db` reads a default install under `%PROGRAMFILES%` and rewrites `data/nodes.json`. For an install elsewhere: `npm run build-db -- --genshin "D:\Games"`. Run `npm run build-web` afterwards, since the bundle embeds the database.

**Finding the resources.** `--genshin` may be any folder from the drive root down to the editor's `Beyond/Node` folder. From that folder the script tries, one by one and skipping the ones that do not exist, the steps `Program Files`, `Genshin Impact`, `Genshin Impact game`, `BeyondAssets`, `BeyondAssistEditor`, `Resource`, `Json`, `Beyond`, `Node`. It accepts the result when `../BeyondGlobal` and `../../TextMap` exist; otherwise it goes one folder up and tries again, and gives up at the drive root.

**Version.** `game_version` in section `[General]` of `config.ini`, which sits six folders above `Node` (in `Genshin Impact game`). `--version` overrides it. When neither is available a warning is printed and the database records no version.

**Inputs.** `Node/*.mihoyobin` (one node each), `BeyondGlobal/*.mihoyobin` (enums), and one `.mihoyobin` per language folder of `TextMap/`; every language folder found is read.

**Output.** The reference database (`--compare`, read before anything is written) is compared with the built one and the result is always printed: per category (nodes only on one side, names per language, system, domain, variant flag, pin keys, pin names, pin types, variant ids and constraints, kernels, enums and their values) how many facts agree, with examples of the ones that do not. Enum codes are ignored in the type comparison. Only the languages both databases have are compared. Then the database is written to `--out`. A missing comparison file is noted, not an error. Notes follow for what the build could not derive: nodes with a variant without a constraint (with the reason), explicit defaults in a layout the script does not read, concrete ids shared by several type combinations, duplicate kernel ids, enum families named by a pin but absent from `BeyondGlobal`.

## Editor resource files

The input of `build-db`, all below `<game>/BeyondAssets/BeyondAssistEditor/Resource/Json`:

| Folder | Content |
|---|---|
| `Beyond/Node/*.mihoyobin` | One node per file |
| `Beyond/BeyondGlobal/<hash>.mihoyobin` | Enum families and values; the node palette |
| `TextMap/<LANG>/<hash>.mihoyobin` | The strings, one folder per language |

Every file is a protobuf message with each byte XOR-ed with `0xE5`. Strings are referenced by hash. The files are readable with `scripts/mihoyobin.mjs`.

**TextMap.** Repeated field `2`: `{ 1: key, 2: hash, 3: text }`. The key names the table a string belongs to (for example `…_inParamList_3_name_22`); some entries have no text. The game ships no node descriptions: the description hash of a node (`207`) has no text in any language.

**Node file.**

| Field | Meaning |
|---|---|
| `4` | One block per graph type the node exists in: `4.1` the id block `{ 1: 10001, 2: service, 3: 22000, 5: generic id }`, `4.2.5` the kernel id (omitted: the node id; an empty `4.2` means 0), `4.3[]` the concrete variants |
| `4.3[]` | `3.1` an id block whose `5` is the concrete id (an entry without it is a combination the game does not offer; id 0 is omitted on the wire), `3.2[]` the bindings |
| binding | `1`: `{ 1: pin kind (3 input, 4 output), 2: pin index }`, `2`: the type-selector index, `3`: a role, `100`: `{ 1: key type code, 2: value type code }` for dictionary variants |
| `100` `101` `102` `103` | In-flow, out-flow, input and output pins; `106` / `107` client execution and signal pins |
| `203` | Domain: 1 Execution, 2 Trigger, 3 Control, 4 Query, 5 Arithmetic |
| `206` / `207` | Name / description hash |
| `208[].1` | Search keywords (Chinese) |

The service in `4.1.2` is the graph type: 20000, 20003, 20004 and 20005 are server graphs (type codes from the server table in `model.mjs`), every other service is client (client table). A node that exists in several graph types has several `4` blocks with the same id.

**Pin.**

| Field | Meaning |
|---|---|
| `3` | Slot descriptor; `3.2` the pin's own slot number |
| `4` | Type block: `1` widget (10000 generic selector, 6 enum/bool picker, 2 number, 4 decimal, 7 vector, 1 id, 5 text, 10002 list, 10003 dictionary), `2` default, `3` connection type (10000 + family for enums), `4` type code, `101.1` enum family, `105` key (`3`) and value (`4`) type codes of a dictionary, `103.1[]` the allowed types of a generic pin |
| `4.103.1[]` | `{ 8: type-selector index, 3: connection type, 4: type code, 101.1: enum family }`; the selector index is what variant bindings refer to |
| `5[].1` | Roles (a pin can have several): 2 hidden, 3 data-type conversion, 8 dictionary key, 9 dictionary value, 10 dictionary, 11 key list, 12 value list, 13 structure |
| `7` | Name hash |

Type code 14 is an enum; its family comes from `4.101.1` or, failing that, from the connection type (10000 + family). Family 0 and 200000 mean "any enum".

**Defaults.** `4.2` holds a whole `TypedValue`: `1` widget, `2` is-set (always 1), then the value in `102` int, `103` dropdown, `104` float, `106` enum/bool, `107` vector. No `4.2` means the zero value; `106: {1: 1}` is true, `106: {}` is explicit false; `103: {}` is dropdown index 0.

**Generic pins and variants.** A generic pin (widget 10000) lists its allowed types in `4.103.1[]`. A variant's bindings choose, per pin, one entry by selector index (or, for a dictionary pin, give the key and value type codes in `100`); the chosen types of the pins tied to one parameter must agree, and that is the constraint of the variant. Pins with role 3 are the data-type conversion's input (K) and output (V); hidden pins select a mode (an operator, the conversion kind) and take no part in the constraint. A pin without role whose every allowed type is a list is `L<R<T>>`.

**BeyondGlobal.** Root `1.1[]` is the enum table: `{ 1: family id, 2[]: { 1: value (omitted when 0), 3: name hash }, 4: title hash }`. Families 1–49 are server, 200001 and up client. Root `3` is the node palette (folders of node references), which the database does not use.

## When the game updates

1. `node miliastra-search.mjs check <your files>`: read the census and the `UNRESOLVED` list. Nothing is lost silently.
2. **Missing node names or variants**, cheapest first:
   1. Rebuild the database from the updated install: `npm run build-db` (add `--genshin "<folder>"` when the game is not under `%PROGRAMFILES%`). Read the printed comparison: new nodes, variants and enum values are expected; anything else deserves a look. Then `npm run build-web`, `npm run update-expected`, review the diff, `npm test`.
   2. Add entries to `data/overlay.json` (format under "Data files"; pin keys `in_flow|out_flow|in_param|out_param:<shellIndex>`). The overlay wins over the built database and survives rebuilds.
   3. Create the node in the editor, export a `.gia`, and read the id and pin indices with `code`: the id is in the `(id)` column even when the name is missing.
3. **Unknown fields**: inspect with `raw` or `scripts/dump-json.mjs`, add the field to `schema/gia.merged.proto`, note it in
   `schema/CHANGELOG.md` (schema notes), decode it in `model.mjs` if it matters, run `npm run update-expected`, review the diff.
4. Add a new export as a fixture (below) and run `npm run build-web`.

## Tests

`npm test` (Node's built-in runner, no dependencies). Test files should work on Windows and Linux alike: normalise paths to `/`.

**Fixtures**, `test/cases/<category>/`, one folder per category so the CLI can process a whole category at once:

| Category | Contents | Notes |
|---|---|---|
| `gia` | the main ten exports (engine 7.0.0) | `core.test.mjs` asserts an empty census for each; do not add a file with undecoded fields here |
| `gil` | stage saves of the same content (7.0.0) | `gil.test.mjs` assumes engine 7.0.0 for this folder |
| `composites` | composite and listener fixtures (7.1.0) | `.gia` and `.gil` of one stage, `test_All_Composite.gia`, `var_change.gia` (Sets without a stored Trigger Event pin, in composites), and `composite_order.gia` (one composite whose flow output has two wires, to a node with a larger id first: the wire order of the file decides the order of the branches) |
| `resolution` | static-resolution fixtures (7.1.0) | `test_resolution.gia`, `test_All_Static.gia` |
| `codegen` | pseudocode fixtures (7.1.0) | `codetest_1.gia` (server graph with data nodes shared and single-use, a loop with `Break Loop`, a creation and a filter graph), `codetest_2.gia` (a status graph and the composites it calls; `--expand` flattens them); `codegen.test.mjs`; the expected outputs also hold the `--pseudocode` option sets (`--optimize`, `--all-pins`, `--expand`) |
| `codegen72` | pseudocode fixtures (7.2.0) | `codetest_3.gia`, for the order and `unreachable`: "Cycle with no entry" (a loop an event enters, whose `A` is reached, and a loop nothing enters, whose `B` is not), "Dead composite" (calls `1` and `2` reached, `2` by a data read only, `3`..`5` not), "Composite with event" (four calls of a composite that has an event inside, which are entry points whatever wires them: `X` and `Z` run, `Y` is wired from nothing), "Nested event" (an event two composites deep); same option sets as `codegen`. It has one undecoded field (see FORMAT.md) |
| `variables72` | custom and graph variables (7.2.0) | `variables_graph.gia` (a graph with published and private variables, a second graph, a status graph with a dictionary; a prefab, entities and the templates that mount and edit them: see `variables.test.mjs`), `variables_beyond.gia` (stage-less export: player / character templates (default and custom), a prefab with five entities that keep, edit, retype, add and remove a variable, a native-object entity, two creations with entities adding a variable) and `variables_classic.gil` (classic mode: player and character templates with the 40 variables of every type, the character's edited; stage without variables) and `variables_save.gil` (two in-game saves with slots `1_chip_1` / `1_chip_2`, a player template with the custom variables `Norm1` / `Norm2`, and a graph that reads a custom variable of each kind); `variables.test.mjs` |
| `mounts` | mounts, folders, static entities (7.1.0) | `test_mount.gil`, `test_folders.gil` / `.gia`, and `graph_folders.gil`: every resource named `... - NN` by its position in the editor, for `ordering.test.mjs`; `composite_folders.gil`: 27 composites in folders A–I plus three in the default tab |

The 7.1.0 categories have dedicated tests rather than loops. They decode with a few unknown fields (run `check` on them): `pins.value.client_inline`
(field 103), some `.gil` root fields, and a second layer inside signal declarations. None of these affect what the tool reports.

**Expected outputs**, `test/expected/<category>/`, generated by `test/expected.mjs`: the text output of every fixture under several option sets
(`info`, `info --show-tag`, `dump`, `code`, `code --all-pins`, `refs`, `refs --sort-desc`, `warns`, `warns --top-graphs 2`, `check`), the text
output of each whole folder (including grep runs), and one `md` / `markdown` / `htm` / `html` file per category and command. `expected.test.mjs`
compares them. **They are meant to fail whenever the output changes**: review the diff, then run `npm run update-expected` (rewrites the files and
removes stale ones). To add a fixture: drop it in a category folder, run `npm run update-expected`, read the new expected files.

Other suites are organised by topic: `core` (ground truth of the main sample, container failures, census injection, degradation), `gil`, `info`, `warns`,
`search`, `refs`, `resolution`, `trigger`, `lint-suppression`, `composite-*`, `multi-branch`, `mounts`, `folders`, `ordering`, `output` (formats, escaping, theme, BOM), `render-json` (report == direct output in every format, schema validation, the script), `web`,
`lang`, `mihoyobin`, `build-db`. `test/helpers.mjs` holds the shared loaders and the plain-text views (`renderText`, `overviewLines`).

