
# miliastra-search – the JSON report

`miliastra-search <mode> … --format json` (or `-o file.json`) prints the **report** of a mode: everything the tool found out, as one JSON object
(`JSON.stringify(report, null, 2)`, UTF-8, no BOM). Text, Markdown and HTML are only renderings of this object; `node scripts/render-json.mjs report.json
--format html` produces any of them from a saved report without the game files, and the output is identical to a direct run.

| | |
|---|---|
| Machine-readable description | [`schema/report.schema.json`](schema/report.schema.json) (JSON Schema 2020-12; only `$ref`, `type`, `enum`, `const`, `properties`, `required`, `additionalProperties`, `items`, `oneOf` are used) |
| Validate without dependencies | `node scripts/render-json.mjs report.json --validate`, or `validate(report, schema)` from `src/present/validate.mjs` |
| Modes with a report | `info`, `dump`, `code`, `refs`, `warns`, `check`, `raw`, and `all` (several of them in one object) |
| As input | `miliastra-search <mode> report.json` renders a saved report (see README); `info`, `dump`, `code`, `refs`, `warns` and `all` reports, and those parts of an `all` report |

Conventions that hold everywhere:

* **Every key is always present.** What does not apply is `null` (or `[]`); a reader never has to test whether a key exists. The only objects whose
  keys depend on a type are the terms of a rich text (`tag` only on `graph` terms) and the fields of a `raw` tree (by `type`). The schema is closed
  (`additionalProperties: false`): a new key is a format change.
* Keys are `snake_case`. Counts are integers. Files are named by their file name only (with extension, original case), never with a directory; the files of one report have different names.
* **A report is complete.** A file that cannot be read or decoded stops the run: no report is written, so a report never holds an error.
* **No styling.** Nothing in a report says how something looks. Terms carry a *role* (what the text is); a renderer decides colors, quotes and layout.
* **Complete data, shown on request.** What a person may or may not want to see (numeric ids, pins nobody wired) is in the report; `--details`, `--all-pins`, `--dedup`, `--short` and `--tab` only decide what a renderer prints, so they are not in `header.options`, and a saved report can be rendered with or without.
* Lists come in the order the tool lists them (resources in the editor's order, refs overview by key, ...): a renderer must not sort again.
* Missing optional facts are `null`, not empty strings.

## Top level

```json
{ "header": { … }, "<mode>": … }
```

### `header`

| Key | Meaning |
|---|---|
| `software` | Always `"miliastra-search"`. |
| `version` | The version of the tool that wrote the report (`package.json`). |
| `mode` | `info`, `dump`, `code`, `refs`, `warns`, `check`, `raw` or `all`. Names the other top-level key, which holds the payload (for `all`: the keys listed in `all`). |
| `files` | The files the report is about, by file name, in command-line order (directories expanded). |
| `options` | The command-line options that decided what the data contains, with their effective values. See below. |

`options` by mode (options that only change how a report is *shown* – `--search`, `--match`, `--context`, `--key`, `--no-file-prefix`,
`--strict`, `--format`, `--output` – are not recorded):

| Mode | Keys |
|---|---|
| `check` | `lang` (the names language, `"EN"` by default), `node_db` (`--db` path or null), `input` (`"gia"`, `"gil"` or null), `lenient` (boolean) |
| `info` | the above plus `show_tag` (boolean: the export tag is in the data) |
| `dump` | the first four only |
| `code` | the first four plus `expand` (boolean: the pseudocode writes composite calls as the nodes of the composite's body) |
| `refs` | the first four plus `kind`, `name` (`--kind`, `--name`, or null) and `sort_desc` (boolean) |
| `warns` | the first four plus `kind`, `name` and `top_graphs` (integer, default 20) |
| `all` | all of the above together (`show_tag`, `kind`, `name`, `sort_desc`, `top_graphs`, `expand`) plus `with_code` (boolean: the `code` part is in the report) |
| `raw` | none (`{}`) |

(`--show-tag` and `--expand` belong to the options because they decide what the data holds, not how it looks.)

## Shared building blocks

**graph reference** – a graph name, already split: `{ "tag": "composite" | "status" | "class" | "filter" | "skill" | "creation" | null, "name": "My Graph" }`.
`tag` is the `<tag>` the editor-less name needs to be found again; null for an ordinary graph. Duplicate names carry their guid in `name` (`Name#123`).

**rich text** – a message that carries structure: an array of plain strings and *terms* `{ "role": "key", "text": "Var1" }`. A `graph` term also has
`"tag"` (`{ "role": "graph", "tag": "composite", "text": "Name" }`; `tag` is left out when there is none). Concatenating the texts gives the sentence.
Roles in use: `key` (a variable, signal, timer, composite or struct name), `graph`, `className` (a resource class such as `ENTITY_NODE_GRAPH`),
`nodeIndex` (`[3]`), `nodeName`, `pinLabel` (`in#0`), `pinName`, `findingType`, `count`, `string`. Unknown roles must be shown as plain text.

## `info`

`info` is a list with one item per decoded file.

| Key | Meaning |
|---|---|
| `file`, `format` (`gia`/`gil`), `detected_by`, `file_size`, `container_file_type`, `engine_version`, `mode` (`beyond`, `classic`, `mode#N`), `node_db_version` | The file itself. |
| `level_name` | `.gil` only, else null. |
| `export_name`, `primary`, `dependencies`, `export_tag` | `.gia` only, else null. `export_tag` = `{ raw, uid, time, file_id }`, and only with the option `show_tag` (null otherwise). |
| `resources`, `graphs`, `nodes`, `composite_bodies`, `declarations`, `structs`, `mounts`, `unresolved_node_types` | Counts. |
| `container_warnings` | Problems of a `--lenient` decode. |
| `classes` | `[{ class_name, class_id, count }]`, one per resource class, in class-id order. |
| `sections` | `.gil` only: `[{ section, count, description }]`, the level sections (`root.10.1`, ...). |
| `folders` | `.gil` only: `[{ name, graphs, resources }]`, the editor's resource folders. |

## `dump`

`dump` is a list with one item per decoded file: `{ file, container_warnings, engine_version, node_db_version, items, variables, unresolved_nodes }`.
`items` lists, in the editor's order, what the file holds as three kinds of item, told apart by `type`:

| `type` | Keys |
|---|---|
| `graph` | `name` (graph reference, with the `<tag>` of its service domain), `folder`, `class_name`, `class_id`, `guid`, `kind`, `service`, `nodes` (count), `entry_slot`, `evaluation_interval`, `composite_body` (boolean), `decl_guid` (the GUID of a composite body's declaration, else null), `description` (a composite's), `dependency` (boolean: a dependency of a `.gia`). |
| `declaration` | A signal or composite declaration: `name`, `class_name`, `class_id`, `guid`, `category`, `description`, `dependency`. A composite's declaration and the second half of a send-signal pair are left out (the composite is a `graph`). |
| `resource` | Any other resource: `name`, `folder`, `class_name`, `class_id`, `guid`, `section`, `parent` (`{ id, name }` of the template an entity was made from, `name` null for a native object), `entities` (how many entities a template has), `mounts` (`[{ slot, graph, graph_guid, host: { class_name, name, slot } }]`: the graphs mounted on it; `graph` is null when the file has no such graph). |

The numeric facts the editor does not show (`class_id`, `section`, `kind`, `service`, `entry_slot`, `evaluation_interval`, `decl_guid`, a signal's `category`) are always in the data; a renderer shows them with `--details`. Structs are not part of `dump`.

`variables` = `{ graphs, prefabs, entities }`, the variables of the file (`.gil` and `.gia` alike; an entity or template that holds none adds no row):

| Key | Rows |
|---|---|
| `graphs` | One row per variable of a node graph (composite bodies have none), in the order of the resources: `{ graph, name, type, struct, public, value }`. `graph` is a graph reference (`{ tag, name }` as in `items`), `public` says the variable is published (set from outside, see `prefabs`), `type` / `struct` / `value` as below (a graph's value of a type that is never set, like an Entity, reads as the zero value). |
| `prefabs` | One row per variable a prefab declares: `{ owner, graph, name, type, struct, value }`; `graph` is null. `owner` = `{ kind, guid, name, class_name }`, `kind` one of `stage` (the stage entity), `player` / `character` (a player / character template) and `prefab` (a prefab, a creation or a projectile); the rows come in that order, each kind in the order of the resources. `type` is the datatype word (`Str`, `L<Int>`, `Struct`, `Dict<Int,Str>`: a dictionary names its key and value types); `struct` = `{ id, name }` for a struct or a list of structs (`name` null when the file has no such struct), else null; `value` is a value object (see `code`; a dictionary is a `map` of `pair`s, a struct a `struct` of its fields in order, a `bool` a Boolean, an entity / GUID / config / prefab / faction an `id`; an `int` or `id` value that points at a resource of the file, matched as `refs` matches literal ids, also has `resource` = `{ class_name, name }`, which is the only place a value object carries it). After the variables of a prefab come its **graph variable** rows: for each graph mounted on it, every published variable whose value the prefab sets to another value than the graph's, with `graph` set to the graph reference (`type` / `struct` are the graph variable's, `value` is the prefab's). |
| `entities` | One row per way an entity differs from the prefab it was created from, in the order of the prefab's variables (the removed and changed ones), then the added ones: `{ entity, prefab, graph, name, change, type, struct, value }`; `graph` is null for a custom variable. `entity` = `{ guid, name, class_name }`; `prefab` = `{ guid, name }` (`name` null when the file has no such prefab, e.g. for a native object), null when the entity names none; a missing prefab counts as one without variables. `change` is `add` (a variable the prefab does not have), `delete` (the prefab's variable is gone: `type` is the prefab's, `value` null), `newtype` (another type than the prefab's: `type` / `value` are the entity's) or `edit` (same type, another value: the entity's). An entity that changes nothing has no row; the stage is among the `prefabs`, not here. After its custom variables come its graph variable rows: `change` is `edit` and `graph` the graph reference, for each published variable of a graph mounted on the entity whose value differs from the one the entity's prefab has for that graph (the graph's own value when the prefab does not mount it or the entity has no prefab in the file). |
`unresolved_nodes` = `[{ what, count, where }]` (node types without a name in the database, as in `check`); with `node_db_version` and `engine_version` a renderer can say that the database is for another game version.

## `code`

`code` is a list with one item per decoded file: `{ file, container_warnings, engine_version, node_db_version, items, unresolved_nodes }` (the same file facts as `dump`).
`items` lists, in the editor's order (declarations and structs, then the graphs), three kinds of item told apart by `type`: `declaration`, `struct`, `graph`.

The data is the **complete, resolved graph model** and says nothing about how it is shown. Pins that have neither a value nor a wire are in it; the text
renderer prints them only with `--all-pins`, and always prints a value nobody edited, marked `(default)`. The one exception is the placeholder slots of an Assembly List / Assembly Dictionary: the editor stores 100 input slots (`in#1`..`in#100`) whatever the node holds, and the hidden `in#0` `Count` says how many the person added with the "+" button (the node database's default, 1 for a list and 2 for a dictionary, when the file stores none), so the slots beyond the count (and beyond the last wired slot) are not in the report. Nothing has to be looked up by index: a wire names its target node and pin, a port mapping its node.

**Building blocks** (shared by everything below, and by any later view of a graph):

| Object | Keys |
|---|---|
| `nodeRef` | `{ index, name, shell_id, kernel_id }`: a node of the same graph. `name` and the ids are null when the graph has no node with that index (a broken wire). |
| `pinRef` | `{ kind, index, name }`: `kind` is `in_flow`, `out_flow`, `in_param`, `out_param`, `meta_rpc`, `meta_topic`, a struct kind, or `kind<N>` for one this version does not know; `name` is what the node's definition calls the pin, else null. |
| `structRef` | `{ id, name }`; `name` null when the file does not define the struct. |
| `value` | `{ kind, set, ... }` by `kind`: `int`, `float`, `str`, `id`, `vec` (`value` = `[x, y, z]`) and `bool` have `value`; `enum` has `value` and `names` (every name the database knows for that number: a number can belong to several enum families; `[]` = none); `list` and `struct` have `items`; `pair` has `key` and `value`; `map` has `pairs` (pairs). Inside `items` / `pairs` / `key` / `value` a missing value is null. `set` is false for a value nobody edited (the game's default). A float that is not finite is `"NaN"`, `"Infinity"` or `"-Infinity"`; an integer too big for a number is a decimal string. |

**`graph`** (a composite body too): `name` (graph reference, with the `<tag>` of its service domain), `class_name`, `guid`, `decl_guid` (a composite body's declaration, else null), `composite_body`,
`service` (the service domain: 20000, 20003, 20004, 20005 are server graphs, the others client graphs), `evaluation_interval` (a filter graph's time interval in seconds; null when the file stores none, the game then uses 0.3), `description` (a composite's), `dependency`, and

| Key | Meaning |
|---|---|
| `variables` | `[{ name, type, public, struct (structRef or null), value (value or null) }]` |
| `comments` | `[{ text, x, y }]`: the comments on the canvas (`x`, `y` null without a position) |
| `port_mappings` | A composite body: `[{ external: pinRef, internal: { node: nodeRef, pin: pinRef } }]`, the pins of the composite's declaration and the pins inside they stand for |
| `affiliations` | `[{ struct_id, source_guid }]` |
| `anomalies` | Strings: inconsistencies found in the graph (a wire to a node that does not exist, ...) |
| `nodes` | `[node]`, in node-index order |

**`node`**: `index`, `name`, `shell_id`, `kernel_id` (equal unless the node is a variant), `unresolved` (the database has no name: `name` is `<node#ID>`), `variant` (the type combination of a generic node),
`user` (what kind of user-defined node it is: composite, signal, ...), `signal` and `struct` (the signal or struct a node sends / listens to / builds), `x`, `y`, `signal_version`, `status_ext` (`{ type, inner }`),
`comment` (attached to the node), `pins`.

**`pin`** (only pins the file stores; any other pin of the node has its definition's default, which the file does not state): `kind`, `index`, `name`, `type` (datatype label), `hidden` (its content is shown another way:
the case list of *Multiple Branches* is shown as the names of its branches), `value`, `resource` (`{ class_name, name }`: what a literal id points at among the file's resources, matched as `refs` matches its `literal_id` references, else null), `default` (the file holds a value that nobody edited), `wires` and `binding`.
`wires` = `[{ node: nodeRef, pin: pinRef }]`, the pins this one is wired to **as the file stores them**: a flow wire on its `out_flow` pin (the list is its targets), a data connection on its `in_param` pin (the list
is its source), so a wire is on one of its two ends only. `binding` = `{ kind, index, source_ref }` or null (what a pin of a generic or client node is bound to). Pins are listed by kind (`in_flow`, `out_flow`, `in_param`, `out_param`, then the others), then index.

**`declaration`** (a signal, or a struct assemble / split / modify node; composite declarations are not listed, the composite is a graph; of a send signal's two halves only the one in its server node's domain): `name`, `class_name`, `guid`, `category`
(`SEND_SIGNAL`, `LISTEN_SIGNAL`, `STRUCT_ASSEMBLY`, ...), `description`, `dependency`, `send_signal` / `listen_signal` (`{ name, server_node, client_node }` or null), `assemble_struct` / `split_struct` / `modify_struct` (structRef or null),
`pins` = `[{ group, index, name, type, enum_family, struct, uid }]` (`group`: `in_flow`, `out_flow`, `in_param`, `out_param`, `meta`).

**`struct`**: `name`, `guid`, `id`, `version`, `dependency`, `fields` = `[{ index, name, type, struct }]`.

**`pseudocode`** (a key of every graph item): the graph as a function, decided entirely by the engine so a style only prints it. `{ tag, namespace, function, flat, unreachable, flow, interface, cases, orphans }`: `tag` is `Entity`, `Status`, `Class`, `Item` (the server graphs), `Filter`, `Skill`, `Creation` (the client graphs), `Composite`, or `Graph` for a service domain that is none of them; `namespace` is where a renderer files the function: `ServerGraphs` (entity, status, class and item graphs), `ClientGraphs` (every other graph) or `Composite` (composite bodies);
`function` the identifier `TAG_GUID`; `flat`: the graph is a single case ending in the graph's end node, which is how a filter graph looks (it has no execution, only one expression), so a renderer writes the statements without a switch; `flow`: for a composite body how the flow leaves it, `{ type, pins, terminal }` (see *Execution types* below), null for any other graph; `unreachable`: true for a composite body that no reachable code makes use of (no reachable case enters one of its instances or has an event inside it, and no reachable calculation reads one of its data outputs; a graph that is not a composite body is never unreachable); `interface`: for a composite body its data pins, `{ inputs, data, outputs }` (`inputs` = `[{ pin, key, type, dict }]`, each read in the body as a `port` expression (`In.key`); the caller and the body agree on every `key`; `outputs` = `[{ pin, key, type, dict, expr }]` with `expr` what the output pin is read from inside, `data` the data nodes those expressions need), null for any other graph. A `case` is one node with flow pins (an execution node). `cases` are in the order of the flow: from each entry point (an event, or a composite call that has events inside; then, in a composite body, the cases its flow inputs enter) the cases it reaches, depth first in the order of the pins and wires, each case once; what no entry point reaches follows, marked `unreachable` (first what nothing is wired to, with the flow it reaches, then whatever is left in node order, which are cycles). A call of a composite is a node like any other: a case when the composite has flow pins, a data node otherwise, and a composite keeps no output of its own, so whoever reads a data output of a call runs the data chain of the composite again (a data node in the `data` of the case, also when the composite is a case too). With the option `expand` (`header.options.expand`) every call is replaced by the nodes of the composite's body (a call is then transparent: the pins of the call are the pins of the body); a body shown on its own has its
ports as `port` expressions and `exit_*` targets. Entry points of a body are its flow inputs (`ports`) and its own events. A node without flow pins is a data node: it is not a case, it is repeated in the `data` of each case that needs it (once per case, innermost first), as the game does not keep a data node's result from one execution node to the next. A data node that no case needs and no output of a composite is made of is in `orphans`: null when there is none, else `[{ data, call }]`, one chain after another, found by taking among the nodes not written yet the one that ends the longest chain of data wires (the first on a tie): `call` is that node (nothing reads it, so its `outputs` have no `name` and no `uses`), `data` the data nodes it needs that no earlier chain has written, in the order of writing (a composite call needs all of its inputs, whatever its body does with them). The intermediates of all the chains are numbered together, as in one case; a renderer writes them in one last case that is never entered (`case 'orphaned'`, which has no entry in `cases`). A graph with orphans is never `flat`.

| Key of a case | Meaning |
|---|---|
| `id` | What a `target` names: `node_0002` / `event_0001` (the node index, 4 digits); nodes inside expanded composites are prefixed with the ids of the calls (`node_0005.node_0002`); |
| `kind` | `event` (no flow input), `composite` (a call of a composite that is not expanded), `end` (the end node of a filter graph: it has no flow pins but is what the graph runs), `execution`, `terminal` (nothing follows). Which nodes are end nodes is data (`data/codegen-rules.json`). |
| `flow` | How the flow leaves the node, `{ type, form, terminal, default }`: see *Execution types* below. `next` only has the flow outputs the flow may leave through. |
| `callers` | `[{ id, function }]`, the cases whose flow outputs are wired to this case (once each, in case order); null for an event, and for a composite call that has events inside and nothing wired to its flow inputs (the events enter there). |
| `event` | The node has no flow input. |
| `node`, `via` | The node, and the composite calls it was expanded from (outermost first, each a `nodeRef` of the graph that holds the call, plus that `graph` as `{ guid, service }`; `[]` for the graph's own nodes). |
| `events` | A call of a composite (not expanded): the entry points the composite's events give this case, `[id]` as `<id of the case>.<event>`: `node_0007.event_0001` for the event `event_0001` of the body, `node_0007.node_0004.event_0002` for an event of a composite the body calls; the body enters at the part after the first `<id of the case>.`. `[]` for any other case. An expanded call has the same events as event cases of its own under the same ids. |
| `unreachable` | No entry point reaches the case (see `cases` above). |
| `ports` | A composite body: `[{ pin, label }]`, the composite's flow inputs that lead to this node and the `label` the body is entered by. |
| `data`, `call` | The data nodes needed, in order of writing; the node itself. A call is `{ node, graph, via, comment, function, composite, id, input, args, extra, outputs }` (`graph`: `{ guid, service }` of the graph `node` is a node of, which differs from the graph of the case for a node of an expanded body): `function` is the node's name as an identifier; `composite` is `{ name, instance }` for a call of a composite that is not expanded (`name`: what the composite's body is filed under, `Composite['name']`; `instance`: the name of the instance the call stands for, `Comp_0012` for the call node with index 12, behind the names of the instances it is expanded from); `id` is which node a call of a data node is, `{ kind, name }`: `data` with `data_0007` (the node index, 4 digits; behind the ids of the calls an expanded body is inside of, `node_0005.data_0007`) for a data node that is not a composite call, `var` with `Var_0005` for a Get Local Variable (one variable per node; where a composite is expanded behind the names of the instances, `Comp_0012_Var_0005`; a composite body shown on its own leaves it to the renderer to put the name of its own instance in front), null for an execution node (the id of its case says it) and for a composite call; such a call has an `args` entry for every input the composite declares, whether the file stores the pin or not, and no `outputs` when it is a case; `args` = `[{ pin, key, expr, hidden }]` for every input the node has (the file stores a pin only for the ones that were wired or edited; the others are given their default, see `expr`) and the meta pins the file stores, `Event` first for an event (`pin` null); the slots a node does not have are not inputs (an Assembly List / Dictionary has as many as its `Count`, which is the node database's default when the file stores none, and at least up to its last wired slot); `input` is true for a node with several flow inputs: it takes the name of the one the flow came through as a second argument, and for a call of a composite that has a flow input (as a case, not as a data node); `extra` (a literal expression, or null) is a constant given after the pins: the end node of a filter graph gets the graph's interval as `Flt(0.3)`; `expr` is null only for a meta pin without value; `hidden` is true for a pin a style leaves out unless it shows every pin: one the game hides that holds nothing but its default (`is_bp_var` of Get / Set Custom Variable), or one that says nothing the node does not say already (the operator of a math or comparison node, the `Count` of an Assembly List / Dictionary, the `context_GUID` of Start Timer); both are data, `data/codegen-rules.json`. `outputs` = `[{ pin, key, type, dict, name, global, uses }]`, all outputs the node can have: `name` is the variable (`Ety_01`, numbered per case, or with `global` `Ety_001`, numbered over the graph and kept for the other cases, which read it as `$.Ety_001`; a composite body shown on its own files them under its instance, `$$.Ety_001`); `type` is the datatype word (`L<Vec>` is `LVec`); `uses` is how many times the variable is read (for a local one: in the case, for a `global` one: in the whole graph; each read is an `expr` of kind `var` / `global`), so 0 for an output nobody wired. |
| `next` | `[{ pin, label, targets }]`, one per flow output the flow may leave through; `label` is the string a generator yields for it (and a node's `Next` is compared with); `targets` = `[{ id, exit, label, input, function }]` in wire order (`function`: the identifier of the node the flow goes to, null for a composite's flow output; `input`: for a node with several flow inputs (a loop's *Break Loop*) the name of the one the flow goes through, which a renderer assigns to `$.input` before `GoTo`, else null; `exit`: the composite's flow output pin when the body is shown on its own, with `label` the string the body yields for it, null for any other target; `input` of a composite call is `input: ` and the name of its flow input, the name of the case of the body that is entered). |

**Execution types.** Every node, and every composite, leaves the flow in one of three ways. `single`: it always passes the flow to its one and only flow output, once (almost every native node). `choice`: it passes it to exactly one of several flow outputs, once (Double Branch, Multiple Branches); a composite may also drop the flow (`terminal`), which counts as one more way out that no test of an output matches. `generic`: anything else, which includes every output that may run more than once or in turn (Finite Loop, List Iteration Loop, client loops, Execute only by sequence) and every composite that does something after it gave the flow back. The type of a native node is data (`data/codegen-rules.json`: the choice nodes) and its number of flow outputs; the type of a composite is found from its body: every path from its flow inputs is followed, knowing the type of each node on it, including composites inside it (the paths of a cycle are a fixed point, a recursive composite is generic). A body is `single` when every path leaves through the same one output and `choice` when each leaves through one, and nothing runs after the flow left, so an output that is wired to a node as well as to the composite's output, a loop body that leaves, an output reached twice, an event inside (it starts a flow whenever it likes), or a composite called inside that is generic make it generic. A composite with several flow inputs has the union of its inputs. The `flow` of a case is `{ type, form, terminal, default }`: `form` is `call` (single), `if` (a choice of two ways out, counting a dropped flow), `switch` (a choice of any number: Multiple Branches always, a composite from three ways), `loop` (generic); `terminal` the flow may end without leaving through an output; `default` (switch only): `pin` (the first branch of `next` is the `default` of the switch: Multiple Branches), `terminal` (the `default` is the dropped flow), `none` (nothing is dropped: the `default` throws). The `flow` of a graph (`pseudocode.flow`) is `{ type, pins, terminal }`: the labels of the outputs it may leave through (empty for generic) and whether it may drop the flow. `form` of a native choice node is data too (`if` for Double Branch).

An `expr` is `{ kind, name, type, dict, value, node, pin, from }` with `kind` `var` (`name`; `node` and `pin`: the node and the output it reads; `from`: those two as `Function.Key`, the way the code writes them), `global` (the same), `literal` (`type`: datatype word or null, `value`: a value object; `value.set` is false for a value nobody edited, which is the game's default: a pin the file does not store has the default the node database gives it, else the zero value of its type), `unset` (`type`: an input without a stored value whose type is not known, so that not even a zero value can be given), `port` (`name`, `pin`), `event` or `missing` (`node`: the wire leads to a node the graph does not have); the other keys are null. `dict` is what a dictionary maps, `{ key, value }` (datatype words: `Ety`, `LInt`, `Any` for a generic type nobody chose), for a literal dictionary; the `outputs` of a call and the `inputs` / `outputs` of a composite's interface have it as well, for a dictionary pin (null when what it maps is not known, and for any other type): a renderer writes `Dict(Ety,Int,value)`. A pin of a generic node that nobody gave a type (a node whose kernel is its shell and whose stored pins say nothing) has the type word `Any`, and no default value (`unset`). A literal also has `enum` (`{ family, name }`: the titles of the enum family and of the value, from the node database; either may be null; null when it is no enum) and `resource` (as in a pin).
`--all-pins` decides what a renderer prints of `outputs` (those with `uses` 0); every input is printed but the `hidden` ones (the pins the game hides while they hold their default, and the pins that say nothing the node does not say already, whatever they hold: the operator of a math or comparison node, the Count of an Assembly List / Dictionary, the context GUID of Start Timer; which they are is data, `data/codegen-rules.json`), a default marked `(default)`. A flow pin is only ever named by a string, so `label` and `input` are the pin's name made of identifier characters (`Loop_Body`, `0`), or the pin's index when it has none; data pins are keys of an object and get an identifier (`_0` for an unnamed one).

## `refs`

`{ "view": "overview" | "detail", "entries": [...] | null, "references": [...] }`

* `view` is `detail` exactly when `--name` was given; then `entries` is null.
* `references` is always the selection (`--kind`, `--name`) one reference at a time. The default selection leaves out the `node_type` kind.
* `entries` (overview) groups the same references by key, in the order they are listed:

| Key | Meaning |
|---|---|
| `kind` | `graph_variable`, `custom_variable`, `timer`, `global_timer`, `signal`, `composite`, `struct`, `mount`, `node_type`, `literal_id` |
| `key` | The name (for a mount: the graph's plain name; for `literal_id`: `Cfg:6`; for `node_type`: `Name (id)`). |
| `key_graph` | Graph reference of a mounted graph (the key with its tag), else null. |
| `type` | Datatype of a variable, else null. |
| `loop` | `"onetime"` or `"looped"` when every Start Timer of a timer agrees, else null. |
| `resolved` | Rich text: what a `literal_id` points at (`CLASS:"name"`), else null. |
| `graph` | Graph reference: the graph owning a `graph_variable`, else null. |
| `definition` | A `struct`: what its definition says, null when no definition is in the scanned files. |
| `parts` | What happens to the key: `{ role, count, graphs, note }` – `count` references with this `role` (`get`, `set`, `trigger`, `listen`, `send`, `call`, `start`, ... – for a mount the slot: `entity`, `player`, ...); `graphs` = the graph references they are in (array, possibly empty) or null when the list is not about graphs; `note` = rich text instead of a graph list, else null. |

A reference (`references[]`):

| Key | Meaning |
|---|---|
| `file`, `kind`, `key`, `key_graph`, `scope` | As above; `scope` separates equal names (per graph for graph variables, per file for structs, `"global"`). |
| `mode` | `declaration`, `definition`, `literal` (name known), `dynamic` (computed at runtime), `unset`, `usage` |
| `role`, `display_role` | `display_role` is `trigger` for a `set` that fires change events, else the role. |
| `var_type`, `trigger`, `loop` | Datatype; `"true"`/`"false"`/`"dynamic"` of the Trigger Event / Loop pins, null when not relevant. |
| `graph`, `graph_guid`, `graph_class`, `composite_body` | The graph the reference is attributed to (for a composite body's access: the caller). |
| `node` | `{ index, name, id, comment }` of the node, null for a declaration. |
| `host` | A mount: `{ class_name, name, guid }` of what the graph is mounted on, else null. |
| `pin`, `resolved`, `note` | Rich texts or null. `note` explains how a name was resolved or why it is dynamic. |
| `resolved_via` | List of rich texts: the steps a name was followed through wires. |
| `via_composite` | Graph references of the composites the access was inlined from. |
| `raw_copy` | True for the physical copy inside a composite body (kept here, left out of the overview and the findings). |

## `warns`

`{ "view": "report" | "findings", "findings": [...], "limits": {...} | null }`; `findings` view (a `--kind` / `--name` selection) has `limits: null`.

* finding: `{ level ("info"/"warn"), type, kind, key, file, graph, message }`; `message` is a rich text, `graph` a graph reference or null. The types are
  listed in TECHNICAL.md.
* `limits`: `composites` and `signals` as `{ used, max }`; `resources` = `[{ class_name, label, used, max }]` (every capped class, also those with `used` 0);
  `static_entities` (counted, no limit); `graph_node_max`; `graph_sizes` = `[{ file, graph, nodes }]`, the effective node counts, biggest first, cut to
  `options.top_graphs`.

## `check`

A list with one item per decoded file: `file`, `format`, `engine_version`, `mode`, `resources`, `opaque_resources`, `container_warnings`;
`unknown_fields` = `[{ path, field, wire, count, note, sample }]` (fields the decoder's schema lacks); `opaque_sections` = `[{ section, count }]` (`.gil`
level sections listed but not interpreted); `opaque_fields` = `[{ path, count }]`; `unresolved_nodes` = `[{ what, count, where }]`.
`check --strict` exits 1 when `unknown_fields`, `unresolved_nodes` or `container_warnings` of any file is not empty.

## `raw`

`{ "container_warnings": [...], "payload": message }` where a message is `{ "error": null | "reason", "fields": [...] }` and a field is
`{ field, type, ... }` by `type`: `varint` (`value`: integer, or a decimal string when too big), `f32` / `f64` (`value`: a number, or `"NaN"` /
`"Infinity"` / `"-Infinity"`), `string` (`value`), `message` (`message`: a message again, nested at most 12 levels), `bytes` (`length`, `hex` of the first
32 bytes, `truncated`).

## `all`

```json
{ "header": { "mode": "all", … }, "all": ["info", "dump", "refs", "warns"], "info": [...], "dump": [...], "code": null, "refs": {...}, "warns": {...} }
```

`all` lists the parts that are there, in this order (`code` only when the option `with_code` was given); each of `info`, `dump`, `code`, `refs`, `warns` is exactly the payload of the single-mode report, and a part that is not listed is `null`. The single-mode report of a part is the part with `header.mode` set to it and the options that mode has.

## When something goes wrong

* A file that cannot be read or decoded (or two files with the same name) ends the run before any report is made: nothing is written to stdout or to `--output`.
