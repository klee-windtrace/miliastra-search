
# miliastra-search – technical notes

How the tool is built, and how to maintain it. For usage see [README.md](README.md); for the binary format itself see
[FORMAT.md](FORMAT.md); for conventions to follow when changing code see [CLAUDE.md](CLAUDE.md).

Plain Node.js (≥ 20), ESM, **no npm dependencies**. The engine also runs unchanged in a browser (see "Running outside Node").

## Pipeline

```
bytes ─ container ─ protobuf decode ─ Bundle (model) ─ resolve names ─┬─ render.mjs   → dump / code  ┐
        L0          L1 / L1b / L1c    L2               L3             ├─ info.mjs     → info         ├─ document ─ formatter ─ text
                                                                      └─ refs.mjs     → refs / warns ┘   (doc.mjs)  (output/)
```

| Layer | Files | Role |
|---|---|---|
| L0 container | `container.mjs` | Checks the 24-byte header and tail tag, decides `.gia` vs `.gil` **by content** (header file type cross-checked against the payload's top-level fields). `--lenient` turns header problems into warnings. |
| L1 decode | `protoparse.mjs`, `decode.mjs`, `schema.mjs`, `schema/gia.merged.proto` | A small `.proto` parser and a schema-driven decoder. Never throws on unknown fields: it records them in a **census**. |
| L1b `.gil` adapter | `gil.mjs` | Decodes the level with the `GilFile` schema and re-wraps its graphs/declarations/structs as GIA-style entries, so everything downstream is format-agnostic. Every other resource becomes an *opaque* entry (name, class, GUID). |
| L1c raw scans | `mounts.mjs` | Walks the raw protobuf of parts the schema keeps opaque: graph mounts, static/dynamic flag, folder index, composite palette. |
| L2 model | `model.mjs` | Raw messages → `Bundle` (`resources[]`, each `kind` = `graph` \| `interface` \| `struct` \| `opaque`), value ASTs (`normValue`), edges. |
| L3 names | `nodedb.mjs`, `resolve.mjs`, `data/nodes.json`, `data/overlay.json` | Node/pin/enum names; binding a node instance to its definition (built-in, composite, signal, struct). |
| L4 analysis | `staticres.mjs`, `refs.mjs`, `render.mjs`, `info.mjs` | Static name resolution, the reference index and findings, the printable documents. |
| L5 output | `doc.mjs`, `theme.mjs`, `output/`, `filter.mjs`, `report-refs.mjs`, `cli.mjs` | Document model, styling, formatters, search filter for the document formats, command line. |

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

`dump` prints a resource's folder as a `/name/` prefix (`folderName` theme style; `folderLabel` gives `(default)` for the default tab) and takes `--details` (`opts.details` of `renderDoc`; `code` never sets it, so its DECL lines are always the short form). `info` lists `SECTION_DESCRIPTIONS` and the resource folders. In `dump` a run of consecutive graphs is one table, like a run of other resources (`flushGraphs`, `flushResources`); structs are only in `code`.

Literal ids: the same number can be the id of a resource in each of the four id spaces, so `buildRefs` indexes resources by `pinType:guid`, from the class lists of `ID_SPACES` (`refs.mjs`; GUID = `Gid`, PrefabID = `Pfb`, ConfigurationID = `Cfg`, IntegerID = plain `Int` > 1e9). A class in no list is never matched by guid. Edit the lists there.

Entities carry the id they were created from (`parentId`: entity field `2.1`, in a `.gil` root 5 entry and in the `.gia` entity definition; `scanSection` / `scanGiaEntities` in `mounts.mjs`): the GUID of a prefab / creation / projectile template, or the id of a native object that is no resource of the file. `render.mjs` joins it to the templates of the file (classes 1, 2, 25) for the `Parent` column of the resource table and counts the entities of each prefab.

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
  The `raw` copy (`rawCopy: true`) is kept for `--name` / `--json` only; the overview and the declared/used findings skip it.
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

| type | level | meaning |
|---|---|---|
| `declared-but-unused` | info | graph variable never referenced by literal name |
| `used-but-undeclared` | warn | graph variable referenced in a graph that does not declare it |
| `signal-sent-never-listened` | warn | |
| `signal-listened-never-sent` | info | |
| `signal-never-used` | info | |
| `composite-never-called` | info | |
| `composite-definition-count-anomaly` | warn | a composite name with other than exactly one definition: a structural problem |
| `composite-circular-call` | warn | |
| `struct-never-used` | info | |
| `catch-all-listener` | info | listener also runs code for every name |
| `listener-no-handlers` | info | listener with no name switch and no code after it |
| `dynamic-reference` | info | a name computed at runtime |
| `duplicate-branch-value` | warn | `Multiple Branches` lists a value twice: the game then always takes `Default` |
| `graph-node-count-exceeded` | warn | effective node count over the editor limit |
| `stale-suppression-comment` | warn | see below |

**Comment-based suppression.** For `catch-all-listener`, `listener-no-handlers`, `dynamic-reference`, `duplicate-branch-value`,
`signal-sent-never-listened`, `signal-listened-never-sent` and `used-but-undeclared`: if the relevant node's comment contains the finding's `type`
as a substring (`suppressed()`), the finding is silenced. For findings backed by several nodes (the two signal ones, `used-but-undeclared`), a
match on *any* contributing node suffices. If the condition no longer holds while the comment remains, `stale-suppression-comment` is raised
instead (`staleSuppression()` for the event and named-pin blocks, inline for signals and `used-but-undeclared`; never for `raw`).
Tests: `test/lint-suppression.test.mjs`, `test/multi-branch.test.mjs`.

### Literal ids

Typed id values (`Cfg`, `Pfb`, `Gid`, `Fct`) and plain `Int` values over 10⁹ are matched against **every other resource in the file**
(`resourceGuidIndex`), and the overview shows `CLASS:"name"` on a match. `Fct` is never matched. A typed `Cfg` skips the classes in
`CFG_EXCLUDED_CLASSES` (UI, layout, environment, deployment group): references to those are stored as a plain `Int`, which is what the
>10⁹ heuristic catches. An id that is the GUID of a *graph* gets a "matches guid of graph …" note instead.

### Limits

The `# limits` section of `warns` combines three things: `composites` / `signals` (counted from refs: a signal is three declaration resources
sharing one name), `resources` (`RESOURCE_LIMITS`: counts of `className` over all bundles; a new capped class is one line there), and
`graphSizes` (effective node counts). `STATIC_ENTITY` has no limit and is only counted. Limit numbers are those of game 7.1.0.

## Output layer

Commands do not print strings. `render.mjs` (`renderDoc`), `info.mjs` and `report-refs.mjs` build a **document**: a list of blocks
(`title`, `heading`, `para`, `facts`, `list`, `table`, `lines`, `note`, `pre`, `hr`) made of **inline spans** (`S(style, text)`, `graph(label)`,
`frac(used, max)`, `marker('### ')`, plain strings). The header comment of `doc.mjs` documents every block and span. A formatter in `src/output/`
renders it.

| `--format` | what it is | file |
|---|---|---|
| `text` | one greppable fact per line | `text.mjs` |
| `color` | the same lines with ANSI colors | `text.mjs` |
| `md` | the same lines as Markdown (theme emphasis, `&nbsp;` for alignment, real headings, `---`) | `simple.mjs` |
| `htm` | the same lines in `<pre>` blocks of a standalone dark page | `simple.mjs` |
| `markdown` | a real document: headings, tables, facts lists | `markdown.mjs` |
| `html` | the same document as a standalone dark page | `html.mjs` |
| `auto` | by the `--output` extension (`.md .markdown .htm .html`), else `color` on a terminal without `NO_COLOR`, else `text` | `output/index.mjs` |

Rules:

* **Styling lives in `src/theme.mjs`**: one entry per kind of thing with its console color (`ansi`), Markdown look (`md`) and the `quote` printed
  around it in *every* format. HTML gets a CSS class per style, with colors generated from `ansi`. Nothing decides styling by pattern-matching text;
  builders say what each piece is. `test/output.test.mjs` checks that every style used is defined.
* Every block may carry `text` (the lines it contributes to `text`/`color`/`md`/`htm`); `markdown`/`html` use the structure instead. `text: null`
  hides a block in the line formats. A `plain: true` heading (the `GRAPH` / `DECL` / `STRUCT` lines) is an ordinary line in the line formats;
  only `markdown`/`html` make it a real heading.
* Messages assembled as strings (findings, notes, resolution reasons) use the tagged template `T`: it returns the plain string (JSON output,
  tests and `.includes()` keep working) and remembers the structure for `spansOf(text)`.
* **Quoting convention:** a graph name is single-quoted (`'<skill>My Graph'`); everything else (keys, resource names, pin names) is double-quoted.
  The quotes come from the theme, never from hand-written strings.
* **The `text` output is the contract people grep.** It is covered by the expected-output files; a change to it must be intended.
* `md` and `markdown` output gets a UTF-8 BOM, added in `cli.mjs` (`emitDoc`), not in the formatters, so `--json` is unaffected.

## Command line (`cli.mjs`)

`main(argv, io)` is testable in-process (`io = { out, err, isTTY, env }`); `safeMain` adds the last-resort error handler (set `GIA_DEBUG` for a
stack trace). Modes: `info`, `dump`, `code`, `refs`, `warns`, `check`, `raw`, in that order everywhere (help, README, web tabs).

* The whole file is analysed once per run (`analyzeBundle` in `render.mjs`); a mode only picks what is printed. `dump` = one summary line per
  graph / declaration (a table row in the document formats), plus a `RESOURCE` list and `MOUNT` lines; `code` = every node, no resource list. They are two views
  (`opts.code` / `opts.resources`) of one analysis. `refs`, `warns` and `check` never depend on what was printed.
* `--search TEXT` / `--match REGEXP` (AND when both) filter the *printed lines* of any mode (`emitGrep`, `present`); they never filter data
  (`--kind` / `--name` do). Exit code 1 when no line matches. Two single quotes (`''`) stand for a double quote, to ease quoting on Windows.
  The line formats print the matching lines (plus `--context`, groups separated by `--`). The document formats (`markdown`, `html`) keep the document: `filterBlocks`
  (`filter.mjs`) matches the same text lines, but each line belongs to the unit that prints it (a table row via `rowLines`, or `text` with one line per row; a list item; a
  line of `lines` / `pre`; else the whole block) and keeps the unit when one of its lines is shown. A heading stays while something under it stays, and recounts a count in its
  title (`recount`); the paragraphs and facts under a heading follow it; a node's head line stays with its pin table. The title of each file is kept when the file has a hit.
* `info --key KEY` prints one value (`infoValue`: a row of the File / Contents tables, else the count of a resource class by name) as plain lines through `emitLines`; it is the
  only place an `info` option replaces the report. The tag rows are always computed for it.
* Option scope: `--show-tag` info; `--sort-desc` refs; `--top-graphs` warns; `--kind` / `--name` refs and warns; `--json` info/refs/warns/check
  (`refs` → `{refs}`, `warns` → `{findings, limits}`); `--defaults` / `--all-pins` code. A mode ignores options of other modes.
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
  `<base href="about:srcdoc">` injected, otherwise `href="#x"` anchors resolve against the page's own address and do not scroll. The blank frame is a
  `data:` URL, where `#` must be written `%23`.
* `test/web.test.mjs` runs the bundle in a `vm` context without Node globals and compares `run()` with the CLI for the same argv.

## Data files

| File | What | How it is made |
|---|---|---|
| `data/nodes.json` | The node database the engine loads: node names in every language the game ships, pin names and types, kernel variants, enum families | `npm run build-db` from a local game install |
| `data/overlay.json` | Hand-written additions merged over the database at load time (`nodes`, `enums`, `kernels`, `refRules`) | by hand; empty by default |
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
* `enums`: family id → `{ names, values: { n: { names } } }`. Enum identifiers (the short codes of older databases) are not stored.
* `kernels`: concrete id → `{ node, constraint }`. The key is the id alone and ids repeat across nodes (the first node wins); nothing reads the table, `variants` is the reliable source.

Types are written `Int`, `Str`, `Ety`, … (the tables in `model.mjs`), `L<T>` for lists, `E<family id>` for an enum, `Enum` for any enum, `R<T>` / `R<K>` / `R<V>` for a generic pin tied to a type parameter, `D<R<K>,R<V>>` for a generic dictionary. A constraint names the parameters of one variant: `C<T:Int>`, `C<K:Int,V:Str>`, `C<T:D<Ety,Gid>>`, `C<T:E<2>>`. A variant that cannot be told apart from another by its id (several type combinations behind one id, as on the client *Data Type Conversion* and *Assembly Dictionary* nodes) has no constraint.

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

**Output.** The old database (`--compare`, read before anything is written) is compared with the new one and the result is always printed: per category (nodes only on one side, names per language, system, domain, variant flag, pin keys, pin names, pin types, variant ids and constraints, kernels, enums and their values) how many facts agree, with examples of the ones that do not. Enum codes are ignored in the type comparison. Only the languages both databases have are compared. Then the database is written to `--out`. A missing comparison file is noted, not an error. Notes follow for what the build could not derive: nodes with a variant without a constraint (with the reason), explicit defaults in a layout the script does not read, concrete ids shared by several type combinations, duplicate kernel ids, enum families named by a pin but absent from `BeyondGlobal`.

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
| `4` | Type block: `1` widget (10000 generic selector, 6 enum/bool picker, 2 number, 4 decimal, 7 vector, 1 id, 5 text, 10002 list, 10003 dictionary), `2` default, `3` connection type (10000 + family for enums), `4` type code, `101.1` enum family, `103.1[]` the allowed types of a generic pin |
| `4.103.1[]` | `{ 8: type-selector index, 3: connection type, 4: type code, 101.1: enum family }`; the selector index is what variant bindings refer to |
| `5[].1` | Roles (a pin can have several): 2 hidden, 3 data-type conversion, 8 dictionary key, 9 dictionary value, 10 dictionary, 11 key list, 12 value list, 13 structure |
| `7` | Name hash |

Type code 14 is an enum; its family comes from `4.101.1` or, failing that, from the connection type (10000 + family). Family 0 and 200000 mean "any enum".

**Defaults.** `4.2` holds a whole `TypedValue`: `1` widget, `2` is-set (always 1), then the value in `102` int, `103` dropdown, `104` float, `106` enum/bool, `107` vector. No `4.2` means the zero value; `106: {1: 1}` is true, `106: {}` is explicit false; `103: {}` is dropdown index 0.

**Generic pins and variants.** A generic pin (widget 10000) lists its allowed types in `4.103.1[]`. A variant's bindings choose, per pin, one entry by selector index (or, for a dictionary pin, give the key and value type codes in `100`); the chosen types of the pins tied to one parameter must agree, and that is the constraint of the variant. Pins with role 3 are the data-type conversion's input (K) and output (V); hidden pins select a mode (an operator, the conversion kind) and take no part in the constraint. A pin without role whose every allowed type is a list is `L<R<T>>`.

**BeyondGlobal.** Root `1.1[]` is the enum table: `{ 1: family id, 2[]: { 1: value (omitted when 0), 3: name hash }, 4: title hash }`. Families 1–49 are server, 200001 and up client. Root `3` is the node palette (folders of node references), which the database does not use.

## Behaviour on newer game versions

| Situation | What happens |
|---|---|
| node id not in the DB | `<node#ID>`; pins by `(kind, index)`; literals and wires intact; listed under `UNRESOLVED` |
| new or renamed pins | resolved by `(kind, index)`; unknown ones print without a name |
| unknown enum value | `enum:2811` / `<unknown-enum:2811>` |
| unknown resource class | printed as `class#N`; a graph payload is still decoded |
| new section in a `.gil` | census entry (`GilFile #N`); known-but-uninterpreted sections are `opaque_N` in the schema and shown by `check` |
| new protobuf fields | census entry (path, field, wire type, sample); `check --strict` exits 1 |
| container tag or length changed | clear error; `--lenient` decodes best-effort; `raw` dumps without a schema |
| structural change (e.g. singular → repeated) | cannot be foreseen: the census and `raw` make it visible, the expected-output tests catch regressions |

## When the game updates

1. `node miliastra-search.mjs check <your files>`: read the census and the `UNRESOLVED` list. Nothing is lost silently.
2. **Missing node names or variants**, cheapest first:
   1. Rebuild the database from the updated install: `npm run build-db` (add `--genshin "<folder>"` when the game is not under `%PROGRAMFILES%`). Read the printed comparison: new nodes, variants and enum values are expected; anything else deserves a look. Then `npm run build-web`, `npm run update-expected`, review the diff, `npm test`.
   2. Add entries to `data/overlay.json` (format under "Data files"; pin keys `in_flow|out_flow|in_param|out_param:<shellIndex>`). The overlay wins over the built database and survives rebuilds.
   3. Create the node in the editor, export a `.gia`, and read the id and pin indices with `code`: the id is in the `(id)` column even when the name is missing.
3. **Unknown fields**: inspect with `raw` or `scripts/dump-json.mjs`, add the field to `schema/gia.merged.proto` (mark it `[MERGED]`), note it in
   `schema/CHANGELOG.md`, decode it in `model.mjs` if it matters, run `npm run update-expected`, review the diff.
4. Add a new export as a fixture (below) and run `npm run build-web`.

## Tests

`npm test` (Node's built-in runner, no dependencies). Test files should work on Windows and Linux alike: normalise paths to `/`.

**Fixtures**, `test/cases/<category>/`, one folder per category so the CLI can process a whole category at once:

| Category | Contents | Notes |
|---|---|---|
| `gia` | the main ten exports (engine 7.0.0) | `core.test.mjs` asserts an empty census for each; do not add a file with undecoded fields here |
| `gil` | stage saves of the same content (7.0.0) | `gil.test.mjs` assumes engine 7.0.0 for this folder |
| `composites` | composite and listener fixtures (7.1.0) | `.gia` and `.gil` of one stage, `test_All_Composite.gia`, and `var_change.gia` (Sets without a stored Trigger Event pin, in composites) |
| `resolution` | static-resolution fixtures (7.1.0) | `test_resolution.gia`, `test_All_Static.gia` |
| `mounts` | mounts, folders, static entities (7.1.0) | `test_mount.gil`, `test_folders.gil` / `.gia`, and `graph_folders.gil`: every resource named `... - NN` by its position in the editor, for `ordering.test.mjs`; `composite_folders.gil`: 27 composites in folders A–I plus three in the default tab |

The 7.1.0 categories have dedicated tests rather than loops. They decode with a few unknown fields (run `check` on them): `pins.value.client_inline`
(field 103), some `.gil` root fields, and a second layer inside signal declarations. None of these affect what the tool reports.

**Expected outputs**, `test/expected/<category>/`, generated by `test/expected.mjs`: the text output of every fixture under several option sets
(`info`, `info --show-tag`, `dump`, `code`, `code --defaults --all-pins`, `refs`, `refs --sort-desc`, `warns`, `warns --top-graphs 2`, `check`), the text
output of each whole folder (including grep runs), and one `md` / `markdown` / `htm` / `html` file per category and command. `expected.test.mjs`
compares them. **They are meant to fail whenever the output changes**: review the diff, then run `npm run update-expected` (rewrites the files and
removes stale ones). To add a fixture: drop it in a category folder, run `npm run update-expected`, read the new expected files.

Other suites are organised by topic: `core` (ground truth of the main sample, container failures, census injection, degradation), `gil`, `info`, `warns`,
`search`, `refs`, `resolution`, `trigger`, `lint-suppression`, `composite-*`, `multi-branch`, `mounts`, `folders`, `ordering`, `output` (formats, escaping, theme, BOM), `web`,
`lang`, `mihoyobin`, `build-db`. `test/helpers.mjs` holds the shared loaders and the plain-text views (`renderText`, `overviewLines`).

