
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
picker or by dropping them anywhere on the page, choose a tab, and press **Process!** (or press Enter in any option field). **Plain** shows the report as lines, **Rich** as tables, **Json** downloads the report as a file (`<input files> - <mode>.json`; the frame only says so, and only when the exit code is 0).
The **LLM** tab has no options: the text goes into a text area, and **download** saves it as `<input files> - llm.txt`. **fullscreen** opens the result in a new browser tab. Your files always stay locally in the page.


## Available modes

```
node miliastra-search.mjs <mode> <files or folders...> [options]
```

Wherever a file is expected you can give a **folder** instead: every `.gia` and `.gil` inside it (including subfolders) is read, and several files
are combined into one report. Files are shown by their name only, never with a folder, so files with the same name (case-sensitive) are refused even from different folders. A file that cannot be read or decoded stops the run before anything is printed or written (exit code 1); `--lenient` tolerates a damaged container header or tail.

| Mode | Prints |
|---|---|
| `info` | The file itself: format, game version, mode, name, how many resources of each kind it holds. |
| `dump` | An overview: one line per graph and declaration, and a list of every other resource in the stage (with where each graph is mounted), then the variables of the graphs, the custom variables of the prefabs and what entities change in them. |
| `code` | The code: every graph node by node, with its pins, values and wires. |
| `refs` | The reference index: for every named thing, who uses it and how. |
| `warns` | Findings (likely problems), resource and graph-size limits, and the largest graphs. |
| `check` | Whether the tool understood the whole file: unknown fields and node types it has no name for. |
| `raw` | A schema-less dump of one file, for when the game has changed and nothing else works. |
| `all` | `info`, `dump`, `refs` and `warns` one after the other, each under its own heading (`# INFO`, ...). Add `--with-code` for `code` too (a lot of text, so it is off by default). It takes the options of every mode. |
| `llm` | Everything a language model needs to read your stage, as one plain text: the `all` report without `warns` (and without `--details`), with the code as short pseudocode, resources deduplicated and columns separated by tabs. It sets its options itself (`--lenient --lang EN --format text --short --dedup --tab --pseudocode --optimize --lazy --with-code`) and accepts none. It needs game files, not a saved report. |

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

**Pseudocode.** `code --pseudocode` prints every graph as one JavaScript-looking function instead of the line per pin and wire: a `case` for each node that has flow pins, the data nodes it needs written out before it, events as entry points. A composite is not flattened into its callers: it is a function of its own (`Composite['Name']`), every call node is an *instance* with a name of its own (`Comp_001`), given to the composite as the second argument; a call that has flow pins is written after how the composite passes the flow on (its *execution type*, found by following every path inside it): a composite that always leaves through one output is just called (`await Composite['Name']($, "Comp_001", { inputs }, $.input); // .Next=="0"`, the comment says which output the flow goes on from), one that leaves through exactly one of its outputs is an `if` / `else` (two ways out, a flow it drops being one of them) or a `switch` (more) on `.Next`, and only a composite that may leave several times, or does something after it gave the flow back, is a `for await ($.next of Composite['Name'](...)) { switch($.next) { ... } }`; a call that only reads data pins is `const { Out: Ety_02 } = Composite['Name']($, "Comp_001", { inputs })`; `--expand` writes the calls as the nodes of the composite's body instead. A composite is given the values of its inputs and returns the values of its outputs. Every input a node has is written, also the ones the file does not store: a value nobody edited is the game's default and is marked `// (default)`; `--expand` marks every case that comes from an expanded composite with a `// in composite Name (node_0012)` comment. It is meant to be read, not run. Graphs are filed by kind: `ServerGraphs[...]` (entity, status, class and item graphs), `ClientGraphs[...]` and `Composite[...]`. A node's outputs that nothing reads are left out, every use of an intermediate (`Flt_01`, `$.Bol_005`) carries a comment with the node and pin it comes from (`// Division.Result`), and every jump says which node it goes to. `--all-pins` still applies (it brings back the unread outputs); `--search` / `--match` still look at the lines of the plain `code` listing and then choose nodes: a line that matches finds the node it is about, a data node that is found also finds the nodes that read its outputs, up to the execution nodes, and only the cases of found nodes are written, in the graphs that have one (a jump may name a case that is left out). `--context` does nothing. In `markdown` / `html` each graph is a heading and a plain preformatted block. Special nodes: a Double Branch is an `if` / `else` on its `Next` (`}else{ // =="No"` names the output of the `else`), a Multiple Branches a `switch` whose `default:` is its first output (`default: // "Default"`, as it is written first), and every branch ends the case; a flow that runs into an output nothing is wired to ends it with `return Exit();`; a filter graph (no execution at all) is one expression written straight into the function, ending in its *Node Graph End* call with the graph's time interval as second argument (`Flt(0.3)`); every *Get Local Variable* is given a name of its own as second argument (`"Var_0001"`), since each one creates a different variable; a composite is written as `function Composite_GUID($,Comp,In = { Pin: Type },node)`: without a node it returns the data pins it hands out (`if (!node){ ... return { Pin: value }; }`), with one it starts at that node (`case 'input: Name':` for each flow input of the composite, `case 'node_0001':` for the nodes inside, events included): a composite that leaves once is an `async function` that returns the output (`return { Next: "Name" };`), a generic one an async generator that yields the names of the outputs (`return yield "Name";`). What the execution nodes of a composite give out is filed under the name of the instance (`$$.Ety_001`, with `$$ = $[Comp]`), so whoever reads the instance's data pins gets the value its execution node stored, as if the node was not inside a composite; the same goes for the local variables (`Comp + "_Var_0001"`; written in full, `"Comp_001_Var_0001"`, where `--expand` puts the body in place). After each `case` a comment lists the cases that send the flow to it (links in the `html` format; the `htm` format has no links at all).

`--optimize` writes it shorter: a node with one output is read directly (`const Ety_01 = Get_Self_Entity().Self_Entity;`) instead of destructured, and an intermediate that is read only once is not declared at all: the call stands where it is read, inside a typecast of its type (`Ety(Get_Self_Entity().Self_Entity)`). `--lazy` writes the values that cross a composite's boundary as lazy ones, which shows when a composite really reads its inputs and when its outputs are calculated: a composite looks at a data pin only when one of its executed nodes needs the value, and its caller calculates an output only when something reads it. A data node whose value goes into a composite (and the data nodes it is computed from) is written `lazy(()=> Node(...))`, a native node that reads a lazy value forces it with `unlz(value)`, and the two helpers are written once as a comment in front of the first composite. Code with no composite in it is not touched; `--expand` and `--lazy` combine (the composite bodies are still functions of their own). The pseudocode is always part of the JSON report (with `--expand` it holds the expanded form).

Options for `code`: `--all-pins` also shows pins with no value and no wire (with `--pseudocode`: the outputs nothing reads). Values you never edited are always shown, marked `(default)`, except the pins the game hides (`is_bp_var` of Get / Set Custom Variable) when they hold nothing but the default: `--all-pins` shows them. (The 100 placeholder inputs the editor stores on every Assembly List / Dictionary are never shown: only the `Count` and the slots up to it; without a stored `Count` the game's default applies, one slot for a list and two for a dictionary.)

The pseudocode lists the cases in the order the flow takes: from each event, what it reaches, depth first, so a case is usually followed by the case it passes the flow to (`void "node_0005";`). A composite that has events inside is entered by them from its caller: `case 'node_0007.event_0001':` hands `event_0001` to the composite's function. What no event reaches starts with `throw 'unreachable';` and comes last, and so does a composite whose body no reachable code enters or reads.

`dump` is the overview of the resources, in this order: declarations (signals), graphs, then the other resources by class (GIL_LEVEL_ENTITY, PLAYER_TEMPLATE, CHARACTER_TEMPLATE, CLASS, SKILL, ... UNKNOWN_TYPE; the order is `CLASS_ORDER` in `src/model.mjs`, classes not listed follow alphabetically). In `code` the declarations and structs also come before the graphs. It is: one line per graph and resource (a table in the `markdown` / `html` formats), a resource filed in a folder starts with `/folder name/` (`/(default)/` for the default tab).
Structs are not listed there (they are in `code` and `refs`). A prefab line ends with `parent=(entities: N)`, the number of entities placed from it; an entity line with the prefab it was
created from, `parent=(GUID:"name")`, or just `parent=(GUID)` when that is a native object of the game or unknown. The `markdown` / `html` tables have this as a **Parent** column.
Add `--details` for the numeric values the editor does not show (`class=`, `section=`, and for graphs `kind=`, `service=`, `decl=` (the GUID of a composite's declaration), entry slot, evaluation interval). `all` always shows them. Add `--dedup` to list resources that only differ in their GUID once: resources without a folder that have the same name, class (and section with `--details`), parent and mounted graphs become one line with the smallest GUID of them and a bright purple `+N more` label (in the Folder column of the tables, at the end of the line in the line formats).

Variable names in the `Variables` section are 'single-quoted' (and yellow).

The **Variables** section at the end of `dump` lists the variables in three tables under one heading:

* *Graphs*: one `GRAPH_VARIABLE` line per variable of every node graph, `GRAPH_VARIABLE 'My Graph' "Score" : Int (public) = 0`. `(public)` marks a variable the graph publishes, which a prefab, a template or an entity that mounts the graph can give another value.

* *Prefabs* (custom variables): one `VARIABLE` line per variable, `VARIABLE Player 1086324737:"Default Template" "Score" : Int = 0`. The stage (`Stage`), the player templates (`Player`) and the character templates (`Character`) come first, in that order, then the prefabs and creations (`GUID:"name"`). A dictionary shows its key and value types (`Dict<Str,Int>`), a struct its struct (`struct=Name`). A published graph variable that a prefab gives another value than the graph's has a line of its own after the custom variables, with the graph in braces behind the name: `VARIABLE 1077936131:"Prefab" "Score" {'My Graph'} : Int = 10`.
* *Entities*: only what an entity changes compared with the prefab it was created from, one `VARIABLE_CHANGE` line per variable, `VARIABLE_CHANGE 1077936134:"Added" (1077936129:"Empty Model") "Extra" add: Str = '12'`. The change is `add: TYPE` (the prefab has no such variable), `delete: TYPE` (it was removed; no value), `newtype: TYPE` (another type; the value is the new one) or `edit: TYPE` (another value). An entity made from something that is not in the file (a native object of the game) is compared with a prefab that has no variables, so all its variables are `add`. An entity that changes nothing is not listed. Published graph variables show up as `edit` lines with the graph in braces, compared with the value its prefab has for that graph (the graph's own value when the prefab does not mount it). The `markdown` / `html` formats show the same as three tables (**Graph**, **Variable**, **Type**, **Value**; **Prefab**, **Variable**, **Type**, **Value**; and **Entity**, **Prefab**, **Variable**, **Change**, **Value**).

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
* **Literal ids** (`Cfg`, `Pfb`, `Gid`, and large plain integers) are matched against the resources in the file and shown as `CLASS:"name"`. An id is only matched with resources of its own kind of id, by the type of the pin or variable: `Gid` (GUID) with entities (OBJECT_ENTITY, CREATION_ENTITY) and with the stage and the players (GIL_LEVEL_ENTITY, GIL_PLAYER_ENTITY), `Pfb` (Prefab ID) with PROJECTILE / OBJECT / CREATION, `Cfg` (Configuration ID) with classes, skills, statuses, items ..., and a big plain `Int` (Index) with shop templates, tags, deployment groups, layouts, paths ... Other resources (timers, cameras ...) are referred to by name, never by id.
* **Mounts:** a `.gil` records which graph is attached to which host (prefab, entity, creation, stage entity, player or character template, status, class).
  `refs` has a `mount` kind (listed in the order of the graphs) and `dump` prints `MOUNT` lines.
* Names and ids are local to one file, so signals and structs are matched by name, and a finding such as "signal never listened to" only knows the files you passed in.

### Problems and limits: `warns`

```
$ node miliastra-search.mjs warns exports/
# findings
INFO  catch-all-listener: [5] When Timer Is Triggered in graph 'Send' also runs code for every name: …
# limits
signals: 2/99 declared
top graphs by node count:
'Both': 4/3000 nodes
```

Findings are `WARN` (probably wrong) or `INFO` (worth a look). The custom variables of a file are checked against its graphs, as `INFO`, whenever the file holds entities, prefabs or templates (a `.gia` of graphs only declares nothing to check against). The game decides at run time which entity a node reads, so the checks go by name and cannot tell which declaration is meant:

* `custom-variable-type-conflict`: the same name is declared with different types (once per name; a dictionary counts by its key and value types, a struct by the struct). Two declarations of one name will do as long as they agree.
* `custom-variable-type-mismatch`: a node reads or writes the name as a type that no declaration of that name has. Silenceable.
* `custom-variable-undeclared`: a name that a node uses (also one it only listens to) and no entity, prefab or template declares. Writing an undeclared variable is allowed in the game, which then creates it. Silenceable.

Only names the tool can read statically are checked, as in `refs`. `--kind` / `--name` keep only matching findings; `--top-graphs N` sets how many graphs are listed
(default 20). Limit lines appear only when something is counted against them.

**Silencing a finding you accept:** write the finding's name (for example `catch-all-listener`) anywhere in the **comment of that node** in the editor, with any
text around it (`catch-all-listener: intentional, see TODO-12`). Works for `catch-all-listener`, `listener-no-handlers`, `dynamic-reference`,
`signal-sent-never-listened`, `signal-listened-never-sent`, `duplicate-branch-value`, `used-but-undeclared`, `custom-variable-undeclared` and `custom-variable-type-mismatch`. If the problem goes away while the comment stays,
you get a `stale-suppression-comment` warning, so comments cannot silently go out of date.

### The file itself: `info`, `check`, `raw`

`info` shows the format, game version, mode (classic or the default), the name, and counts per resource class; for a `.gil` also its sections (each with a short description) and resource folders (with the number of graphs and of other resources in each, a zero left out).
The File and Contents blocks are two-column tables (`property  value`) in every format.
The export tag contains your **account UID** and is hidden unless you pass `--show-tag` (it is then also part of the JSON report; without the option it is not).

`--key KEY` prints only one value, as plain text in any format: a property of those two blocks or the count of a resource class (the **Class** column of "Resources by class"), ignoring case. For scripts:

```
$ node miliastra-search.mjs info stage.gil --key level_name
My Stage
$ node miliastra-search.mjs info stage.gil --key mode
beyond
$ node miliastra-search.mjs info stage.gil --key ENTITY_NODE_GRAPH
12
```

The exit code is 1 when the file has no such key (a `.gia` has an `export_name`, not a `level_name`). With several files each value gets a `file:` prefix (`--no-file-prefix` removes it); `--key` cannot be combined with `--format json` or `--search` / `--match`.
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
| `json` | The parsed result itself, for other programs (every mode). Described in [JSON.md](JSON.md). |
| `auto` (default) | By the extension of `--output` (`.md .markdown .htm .html .json`); otherwise `color` in a terminal and `text` when piped. |

`--output FILE` (or `-o FILE`) writes the report to a file: `node miliastra-search.mjs refs exports/ -o refs.html`. The file is only written when the run succeeded (exit code 0): a file that exists is a complete report, never the leftover of a failed run or of a search that found nothing. Markdown files start with a UTF-8 byte-order mark so editors read them correctly.

`json` cannot be combined with `--search` / `--match`.

### Saved reports as input

A report saved as JSON (`node miliastra-search.mjs all exports/ -o all.json`) can be used in place of the game files, to get any other format later without them:

```
$ node miliastra-search.mjs refs all.json --format html -o refs.html
```

Only one report at a time (and not together with game files); a `.json` file inside a folder is not picked up. The mode must be the report's own, or any part of an `all` report (`info`, `dump`, `code`, `refs`, `warns`, `all`; `code` only if the report was made with `--with-code`). `check` and `raw` cannot be rendered from a report. Options that change *what* is reported (`--kind`, `--name`, `--sort-desc`, `--top-graphs`, `--show-tag`, `--lang`, ...) were applied when the report was made; if they differ on the command line, one warning line lists them. `--details` and `--all-pins` only change what is *shown* (a report always holds that data), so they work on a saved report, with or without. `--lenient` reads a report that does not fit the format as far as it can. The presentation options (`--format`, `--search`, `--match`, `--context`, `--key`, `--no-file-prefix`, `--output`) work as usual. `node scripts/render-json.mjs report.json` does the same without the mode rules (it also renders `check` and `raw` reports; `--help` lists its options).

## More options

| Option | Effect |
|---|---|
| `--lang CODE` | Node and pin names in another language: `EN` (default), `CHS` (`ZH` works too), `CHT`, `DE`, `ES`, `FR`, `ID`, `IT`, `JP`, `KR`, `PT`, `RU`, `TH`, `TR`, `VI`; any case. |
| `--lenient` | Decode a file whose header or tail looks damaged, best effort. |
| `--input gia\|gil` | Force the file type instead of detecting it. |
| `--db FILE` | Use another node database. |
| `--short` | `info` (and `all`): leave out the level sections and the `class=` numbers of the resource classes. |
| `--tab` | Every mode, `text` and `color` formats: separate the columns of a line with a single tab instead of spaces, and indent pseudocode with tabs, so a line splits into its values on `\t`. A separator character (`:`, `->`, `=`) stays with the value on its left. `--search` / `--match` still see the usual spaces. No effect in the other formats. |
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
