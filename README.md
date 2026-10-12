
# miliastra-search

Turns your **Miliastra Wonderland** node graphs into text you can search, and tells you where every variable, signal, timer and composite is used.

Give it the files the editor produces – a `.gia` export or a whole-stage `.gil` save – and it prints what is in them: the code of every node
graph, a cross-reference of everything that is named, a list of likely problems, and how close the stage is to the editor's limits.
It never modifies your files. The type of a file is recognised from its content, so file names do not matter.

### Disclaimer

_This project is entirely written by an LLM, specifically [Claude](https://claude.ai/) AI._

## What you can find out

* **Read the graphs as text.** Every node, wire and value, one fact per line, so you can search it with any text tool.
* **See what uses what.** Where a graph variable, custom variable, timer, signal, composite or struct is read, written, started, sent or listened to,
  including names that are wired in rather than typed, and which graphs are mounted on which entities, prefabs, templates, statuses and classes.
* **Catch problems.** Variables used but never declared (or declared and never used), signals sent but never listened to, listeners that react to
  every name by accident, composites never called, `Multiple Branches` nodes listing the same value twice.
* **Check the limits.** How many signals, composites, entities, prefabs, … the stage has against the editor's caps, and which graphs are largest
  once composite calls are expanded (the editor allows 3000 nodes per graph).

## Try it out right now in your browser

Open this self-contained webpage and follow instructions there:
- [miliastra-search.htm](https://klee-windtrace.github.io/miliastra-search/miliastra-search.htm)
Your files are not uploaded anywhere. Zero usage trackers. If you're still afraid, open the link in Incognito tab, disconnect the internet, and just close it when you're done.

## Getting started

You need [Node.js](https://nodejs.org) 20 or newer. There is nothing to install: unpack the folder and run it from there.

```
node miliastra-search.mjs code my_export.gia
```

On Windows, you can also run `miliastra-search.bat` in console.

Prefer a window to a terminal? Open **`miliastra-search.htm`** in a browser (double-click it; keep the `web/` folder next to it). Add your files with the
picker or by dropping them anywhere on the page, choose a tab, and press **Process!** (or press Enter in any option field). **Plain** shows the report as lines, **Rich** as tables.
**fullscreen** opens the result in a new browser tab. Your files always stay locally in the page.


## Available modes

```
node miliastra-search.mjs <mode> <files or folders...> [options]
```

Wherever a file is expected you can give a **folder** instead: every `.gia` and `.gil` inside it (including subfolders) is read, and several files
are combined into one report.

| Mode | Prints |
|---|---|
| `info` | The file itself: format, game version, mode, name, how many resources of each kind it holds. |
| `dump` | An overview: one line per graph and declaration, and a list of every other resource in the stage (with where each graph is mounted). |
| `code` | The code: every graph node by node, with its pins, values and wires. |
| `refs` | The reference index: for every named thing, who uses it and how. |
| `warns` | Findings (likely problems), resource and graph-size limits, and the largest graphs. |
| `check` | Whether the tool understood the whole file: unknown fields and node types it has no name for. |
| `raw` | A schema-less dump of one file, for when the game has changed and nothing else works. |

### Reading graphs: `code` and `dump`

```
$ node miliastra-search.mjs code my_export.gia
GRAPH 'Receive' ENTITY_NODE_GRAPH (guid 1073741826)
'Receive'/[5] Monitor Signal (1610612743) user=LISTEN_SIGNAL signal='Signal_2' @(-284,98) sigver=3
'Receive'/[5] Monitor Signal (1610612743) out.flow#0 -> [6] Print String (1) in.flow#0 "FlowIn"
'Receive'/[6] Print String (1) in#0 "String" <- [5] Monitor Signal (1610612743) out#12 "Parameter_10" : Str
```

Each line stands on its own: the graph, the node `[index] name (id)`, the pin, and what it is wired to or set to. A wire is shown once, on the
pin that owns it: `->` on an output flow pin, `<-` on an input value pin. To find everything that reads a node's output, search for `<- [5] Monitor Signal`.
Node ids are always printed, so a saved search keeps working if the game renames a node. Things the tool cannot name are explicit:
`<node#1234>`, `<unknown-enum:2811>`, `UNRESOLVED …`.

Options for `code`: `--defaults` also shows values you never edited (marked `(default)`), `--all-pins` also shows pins with no value and no wire.

`dump` is the overview of the resources, in this order: declarations (signals), graphs, then the other resources by class (GIL_LEVEL_ENTITY, PLAYER_TEMPLATE, CHARACTER_TEMPLATE, CLASS, SKILL, ... UNKNOWN_TYPE; the order is `CLASS_ORDER` in `src/model.mjs`, classes not listed follow alphabetically). In `code` the declarations and structs also come before the graphs. It is: one line per graph and resource (a table in the `markdown` / `html` formats), a resource filed in a folder starts with `/folder name/` (`/(default)/` for the default tab).
Structs are not listed there (they are in `code` and `refs`). A prefab line ends with `parent=(entities: N)`, the number of entities placed from it; an entity line with the prefab it was
created from, `parent=(GUID:"name")`, or just `parent=(GUID)` when that is a native object of the game or unknown. The `markdown` / `html` tables have this as a **Parent** column.
Add `--details` for the numeric values the editor does not show (`class=`, `section=`, and for graphs `kind=`, `service=`, `composite_body=`, entry slot, evaluation interval).

### Searching: `--search`, `--match`

Any mode can be turned into a search over what it prints:

```
node miliastra-search.mjs code exports/ --search Graph_Var --context 2
node miliastra-search.mjs refs exports/ --search signal --match "listen"
```

`--search TEXT` keeps the lines containing the text (ignoring case); `--match REGEXP` keeps lines matching a regular expression; with both, a line has to satisfy both.
`--context N` adds N lines around every hit. With several files each line is prefixed with its file (`--no-file-prefix` removes it). The exit code is 1 when nothing matched.
The search always runs over the lines of the line formats. In `markdown` / `html` the report keeps its look: the table rows, list items and lines that match are kept, under their headings.
On Windows, where a double quote is awkward on the command line, write two single quotes (`''`) instead.

### Finding uses: `refs`

```
$ node miliastra-search.mjs refs my_export.gia
signal    "Signal_1"    2 listen: ['Receive'; 'Both'], 2 send: ['Send'; 'Both']
signal    "Signal_2"    2 listen: ['Receive'; 'Both'], 2 send: ['Send'; 'Both']
timer     "* (listener for any name)"   1 listen: ['Send']
```

One entry per named thing, with the graphs that use it. Graph names are in single quotes and tagged where it matters (`<composite>`, `<status>`,
`<class>`, `<skill>`, `<filter>`, `<creation>`); everything else is in double quotes.

* `--kind K` limits it to one kind: `graph_variable`, `custom_variable`, `timer`, `global_timer`, `signal`, `composite`, `struct`, `mount`, `node_type`, `literal_id`.
  `node_type` is a listing of its own: the overview leaves it out, only `--kind node_type` (or `--name`) shows which node types the graphs use.
* `--name N` lists every single use of the exact name `N`, node by node (`refs --kind signal --name Signal_2`).
* `--sort-desc` orders the overview by number of uses.
* A variable's type is shown after its name, `"Var" (Int)`, in server and client graphs alike.
* A variable's uses are counted as `get`, `set`, `trigger` and `listen`. A *Set* whose **Trigger Event** is on (or wired, so not known to be off) is a `trigger`, not a `set`.

Good to know:

* **Names that are wired in instead of typed are followed**: through *Get Local Variable*, through *Get Node Graph Variable* (its declared value; a
  runtime *Set* is not tracked), and through composites. If a name cannot be known without running the graph, it is listed as `<dynamic>`.
* **Composites count for whoever calls them.** A use inside a composite is attributed to each graph that calls it, as if the composite were expanded
  there. `refs --name` shows such entries with `[inlined via '<composite>Name']`. The exception: a custom variable, timer, global timer or listener
  whose name is fixed *inside* the composite (not an input the caller fills in) belongs to the composite itself, since it keeps its own variables on entities.
* **Listeners:** a *When … Changes / Triggered* node does not name what it listens to. The tool follows its execution wire: a chain of name checks gives one entry per
  name; anything else means the listener runs for every name and is shown as the key `* (listener for any name)`.
* **Literal ids** (`Cfg`, `Pfb`, `Gid`, and large plain integers) are matched against the resources in the file and shown as `CLASS:"name"`. An id is only matched with resources of its own kind of id, by the type of the pin or variable: `Gid` (GUID) with entities (OBJECT_ENTITY, CREATION_ENTITY), `Pfb` (Prefab ID) with PROJECTILE / OBJECT / CREATION, `Cfg` (Configuration ID) with classes, skills, statuses, items ..., and a big plain `Int` (Index) with shop templates, tags, deployment groups, layouts, paths ... Other resources (timers, cameras ...) are referred to by name, never by id.
* **Mounts:** a `.gil` records which graph is attached to which host (prefab, entity, creation, stage entity, player or character template, status, class).
  `refs` has a `mount` kind (listed in the order of the graphs) and `dump` prints `MOUNT` lines.
* Names and ids are local to one file, so signals and structs are matched by name, and a finding such as "signal never listened to" only knows the files you passed in.

### Problems and limits: `warns`

```
$ node miliastra-search.mjs warns exports/
# findings
INFO  catch-all-listener: [5] When Timer Is Triggered in graph 'Send' also runs code for every name: …
# limits
signals: 2/100 declared
top graphs by node count:
'Both': 4/3000 nodes
```

Findings are `WARN` (probably wrong) or `INFO` (worth a look). `--kind` / `--name` keep only matching findings; `--top-graphs N` sets how many graphs are listed
(default 20). Limit lines appear only when something is counted against them.

**Silencing a finding you accept:** write the finding's name (for example `catch-all-listener`) anywhere in the **comment of that node** in the editor, with any
text around it (`catch-all-listener: intentional, see TODO-12`). Works for `catch-all-listener`, `listener-no-handlers`, `dynamic-reference`,
`signal-sent-never-listened`, `signal-listened-never-sent`, `duplicate-branch-value` and `used-but-undeclared`. If the problem goes away while the comment stays,
you get a `stale-suppression-comment` warning, so comments cannot silently go out of date.

### The file itself: `info`, `check`, `raw`

`info` shows the format, game version, mode (classic or the default), the name, and counts per resource class; for a `.gil` also its sections (each with a short description) and resource folders (with the number of graphs and of other resources in each, a zero left out).
The File and Contents blocks are two-column tables (`property  value`) in every format.
The export tag contains your **account UID** and is hidden unless you pass `--show-tag`.

`--key KEY` prints only one value, as plain text in any format: a property of those two blocks or the count of a resource class (the **Class** column of "Resources by class"), ignoring case. For scripts:

```
$ node miliastra-search.mjs info stage.gil --key level_name
My Stage
$ node miliastra-search.mjs info stage.gil --key mode
beyond
$ node miliastra-search.mjs info stage.gil --key ENTITY_NODE_GRAPH
12
```

The exit code is 1 when the file has no such key (a `.gia` has an `export_name`, not a `level_name`). With several files each value gets a `file:` prefix (`--no-file-prefix` removes it); `--key` cannot be combined with `--json` or `--search` / `--match`.
`check` reports anything it did not fully understand; add `--strict` for exit code 1 when anything is reported, handy in scripts.
`raw` dumps the protobuf structure without any schema.

## Output formats and files

`--format` chooses how the report looks, for every mode:

| Format | Use it for |
|---|---|
| `text` | Plain lines, ideal for searching and piping. |
| `color` | The same with terminal colors. |
| `md`, `htm` | The same lines as a Markdown file or a web page (styled, with headings). |
| `markdown`, `html` | A real document: a section per graph, tables for references and pins. `html` is a standalone dark page. |
| `auto` (default) | By the extension of `--output`; otherwise `color` in a terminal and `text` when piped. |

`--output FILE` (or `-o FILE`) writes the report to a file: `node miliastra-search.mjs refs exports/ -o refs.html`. Markdown files start with a UTF-8 byte-order mark so editors read them correctly.

`--json` (`info`, `refs`, `warns`, `check`) prints machine-readable data instead; it cannot be combined with `--search` / `--match`.

## More options

| Option | Effect |
|---|---|
| `--lang CODE` | Node and pin names in another language: `EN` (default), `CHS` (`ZH` works too), `CHT`, `DE`, `ES`, `FR`, `ID`, `IT`, `JP`, `KR`, `PT`, `RU`, `TH`, `TR`, `VI`; any case. |
| `--lenient` | Decode a file whose header or tail looks damaged, best effort. |
| `--input gia\|gil` | Force the file type instead of detecting it. |
| `--db FILE` | Use another node database. |
| `--help` | All options, with the modes each one applies to. |

## When something is not recognised

Node names come from a database built from the game's own editor files. After a game update some nodes may be missing:
they print as `<node#1234>` with their ids, pins and values intact, and searching by id still works. `check` lists them. Unknown file contents are
reported rather than ignored. With the game installed, `npm run build-db` rebuilds the database (all languages); see [TECHNICAL.md](TECHNICAL.md) for its options and for extending the decoder.

## Documentation

* [TECHNICAL.md](TECHNICAL.md): how the tool is built, how to run the tests, how to update it after a game update.
* [FORMAT.md](FORMAT.md): a description of the `.gia` / `.gil` binary format, for anyone writing their own parser.

## Credits

This tool has no dependencies and licensed under 0BSD, but was based on two MIT-licensed community projects. Thank you to their authors:

* [**Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack**](https://github.com/Wu-Yijun/Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack) by Wu-Yijun
* [**genshin-ts**](https://github.com/josStorer/genshin-ts) by josStorer

The schema in `schema/gia.merged.proto` and parts of the format notes grew from it. Keep the copyright notices of those projects if you redistribute, see [LICENSE](LICENSE)
