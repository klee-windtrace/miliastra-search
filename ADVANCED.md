
# miliastra-search – advanced guide

The full reference for using the tool: every mode and option, what each finding means, what the output looks like and how to get it in other formats. For a first look see [README.md](README.md); for how the
program works inside see [TECHNICAL.md](TECHNICAL.md); for the file format see [FORMAT.md](FORMAT.md); for the JSON report see [JSON.md](JSON.md).

* [Running it](#running-it)
* [Modes](#modes)
* [Reading graphs: `code` and `dump`](#reading-graphs-code-and-dump)
* [Searching: `--search`, `--match`](#searching---search---match)
* [Finding uses: `refs`](#finding-uses-refs)
* [Problems and limits: `warns`](#problems-and-limits-warns)
* [The file itself: `info`, `check`, `raw`](#the-file-itself-info-check-raw)
* [For a language model: `llm`](#for-a-language-model-llm)
* [Output formats and files](#output-formats-and-files)
* [Saved reports as input](#saved-reports-as-input)
* [More options](#more-options)
* [The web page](#the-web-page)
* [Newer game versions](#newer-game-versions)

## Running it

```
node miliastra-search.mjs <mode> <files or folders...> [options]
```

Wherever a file is expected, a **folder** can be given instead: every `.gia` and `.gil` inside it (including subfolders) is read, and several files are combined into one report. The type of a file is recognised from its
content, so a renamed file works too. Files are shown by their name only, without a folder, so files with the same name (case-sensitive) are refused even when they come from different folders.

A file that cannot be read or decoded stops the run before anything is printed or written (exit code 1); `--lenient` tolerates a damaged container header or tail. `--help` lists every option, grouped by the modes it
applies to; an option that does not apply to a mode is ignored.

| Exit code | Meaning |
|---|---|
| 0 | Success. |
| 1 | A file could not be read or decoded; a search found nothing; `check --strict` found something; `info --key` found no such key. |
| 2 | Wrong usage: an unknown option, a missing file, two files with the same name. |

## Modes

| Mode | Prints |
|---|---|
| `info` | The file itself: format, game version, mode, name, how many resources of each kind it holds. |
| `dump` | An overview: one line per graph and declaration, and a list of every other resource in the stage (with where each graph is mounted), then the variables of the graphs, the custom variables of the prefabs and what entities change in them. |
| `code` | The code: every graph node by node, with its pins, values and wires (or as pseudocode). |
| `refs` | The reference index: for every named thing, who uses it and how. |
| `warns` | Findings (likely problems), resource and graph-size limits, and the largest graphs. |
| `check` | Whether the tool understood the whole file: unknown fields and node types it has no name for. |
| `raw` | A schema-less dump of one file, for when the game has changed and nothing else works. |
| `all` | `info`, `dump`, `refs` and `warns` one after the other, each under its own heading (`# INFO`, ...). Add `--with-code` for `code` too (a lot of text, so it is off by default). It takes the options of every mode. |
| `llm` | Everything a language model needs to read your stage, as one plain text. See [below](#for-a-language-model-llm). |

## Reading graphs: `code` and `dump`

```
$ node miliastra-search.mjs code my_export.gia
GRAPH 'Receive' ENTITY_NODE_GRAPH (guid 1073741826)
'Receive'/[5] Monitor Signal (1610612743) user=LISTEN_SIGNAL signal='Signal_2' @(-284,98) sigver=3
'Receive'/[5] Monitor Signal (1610612743) out.flow#0 -> [6] Print String (1) in.flow#0 "FlowIn"
'Receive'/[6] Print String (1) in#0 "String" <- [5] Monitor Signal (1610612743) out#12 "Parameter_10" : Str
```

Each line stands on its own: the graph, the node `[index] name (id)`, the pin, and what it is wired to or set to. A wire is shown once, on the pin that owns it: `->` on an output flow pin, `<-` on an input value
pin. To find everything that reads a node's output, search for `<- [5] Monitor Signal`. Node ids are printed on every node, so a saved search keeps working if the game renames a node. Things the tool cannot name
are explicit: `<node#1234>`, `<unknown-enum:2811>`, `UNRESOLVED …`. In `code`, the declarations and structs come before the graphs.

`--all-pins` also shows pins with no value and no wire. Values nobody edited are shown, marked `(default)`, except the pins the game hides (`is_bp_var` of Get / Set Custom Variable) when they hold nothing but the
default. The 100 placeholder inputs the editor stores on every Assembly List / Dictionary are not shown: only the `Count` and the slots up to it; without a stored `Count` the game's default applies, one slot for a list
and two for a dictionary.

### Pseudocode

`code --pseudocode` prints every graph as one JavaScript-looking function instead of one line per pin and wire. It is meant to be read (by you or a language model), not run.

```
ServerGraphs['Both'] = async function Entity_1073741828($,node){
  const GoTo = this.bind(this,$);
  switch(node){
    case 'event_0002':{
      await Monitor_Signal({
        Event: $.event,
        Signal_Name: "Signal_1",
      });
      void "node_0004"; // Send_Signal
    }
    case 'node_0004':{ // called from 'event_0002: Monitor_Signal'
      Send_Signal({
        Signal_Name: "Signal_1",
      });
      void "node_0006"; // Send_Signal
    }
    ...
```

* **Cases.** Every node that has flow pins is a `case`; events are the entry points. The cases are listed in the order the flow takes: from each event, what it reaches, depth first, so a case is usually followed by the
  case it passes the flow to (`void "node_0005";`). A comment after each `case` lists the cases that send the flow to it, and every jump says which node it goes to. A flow that runs into an output nothing is wired to
  ends the case with `return Exit();`. What no event reaches starts with `throw 'unreachable';` and comes last.
* **Data nodes** are written out in full before each node that needs them (`const { Out: Ety_02 } = Division("data_0007", { ... })`), so a node whose output is read twice appears twice; the id in `data_0007` is the
  node id in the editor. A node's outputs that nothing reads are left out; every use of an intermediate (`Flt_01`, `$.Bol_005`) carries a comment with the node and pin it comes from (`// Division.Result`).
  Data nodes that no node reads are written last, in a `case 'orphaned':`.
* **Every input is given**, also the ones the file does not store: a value nobody edited is the game's default and is marked `// (default)`. Pins that say nothing the node does not (the operator of a math,
  comparison, logic or type conversion node, the `Count` of a list or dictionary assembly, a timer's `context_GUID`) are left out until `--all-pins`.
* **Constants** read `Flt(0.00)` (at least two decimals), `Bol(true)` / `Bol(false)`, `Ety(null)`. A pin type the file does not tell is `Any`. A dictionary says what it maps, `Dict(Ety,Int,x)`; when nothing tells
  (the file, the declaration or the wires of the node), it is `Dict(x)`, and `Dict(Any,Int,x)` when only one side is known.
* **Composites** are not flattened into their callers: a composite is a function of its own (`Composite['Name']`), and every call node is an *instance* named after its node id (`Comp_0012`), given to the composite as
  the second argument. The call is written after how the composite passes the flow on: one that always leaves through one output is just called (`await Composite['Name']($, "Comp_0012", { inputs }, $.input); // .Next=="0"`),
  one that leaves through exactly one of its outputs is an `if` / `else` or a `switch` on `.Next`, and only a composite that may leave several times, or does something after it gave the flow back, is a
  `for await ($.next of Composite['Name'](...)) { switch($.next) { ... } }`. A call that only reads data pins is `const { Out: Ety_02 } = Composite['Name']($, "Comp_0012", { inputs })`. What the execution
  nodes of a composite give out is filed under the name of the instance (`$$.Ety_001`), and its local variables are named after it (`Comp + "_Var_0005"`).
* **Special nodes.** A Double Branch is an `if` / `else` on its `Next`; a Multiple Branches a `switch` whose `default:` is its first output; every *Get Local Variable* is given a name of its own as first argument
  (`Get_Local_Variable("Var_0005", { ... })`), since each one creates a different variable; a filter graph (no execution at all) is one expression ending in its *Node Graph End* call.
* Graphs are filed by kind: `ServerGraphs[...]` (entity, status, class and item graphs), `ClientGraphs[...]` and `Composite[...]`. In the `html` format every use of a variable and every jump is a link to its source;
  the `htm` format has no links.

Options of the pseudocode:

| Option | Effect |
|---|---|
| `--expand` | Write a composite call as the nodes of the composite's body, as if they stood where the call is; every case that comes from a composite is marked `// in composite Name (node_0012)`. |
| `--optimize` | Write it shorter: a node with one output is read directly (`const Ety_01 = Get_Self_Entity().Self_Entity;`) instead of destructured, and an intermediate that is read only once is not declared: the call stands where it is read, inside a typecast of its type (`Ety(Get_Self_Entity().Self_Entity)`). |
| `--lazy` | Write the values that cross a composite's boundary as lazy ones, which shows when a composite really reads its inputs and when its outputs are calculated: `lazy(()=> Node(...))` for a data node whose value goes into a composite, `unlz(value)` where a native node reads a lazy value. A comment block before the first graph explains the conventions (it is left out of a search). Code with no composite in it is not touched. |
| `--all-pins` | Also the outputs nothing reads. |

`--search` / `--match` with `--pseudocode` choose nodes: they look at the lines of the plain `code` listing, and only the cases of the nodes that matched are written (a data node that matched also finds the nodes
that read its outputs, up to the execution nodes), in the graphs that have one. `--context` does nothing there. In `markdown` / `html` each graph is a heading and a plain preformatted block.

### `dump`

`dump` is the overview of the resources, in this order: declarations (signals), graphs, then the other resources by class (stage, player templates, character templates, classes, skills, ... unknown types). It is
one line per graph and resource (a table in the `markdown` / `html` formats); a resource filed in a folder starts with `/folder name/` (`/(default)/` for the default tab). Structs are not listed there (they are in
`code` and `refs`).

A prefab line ends with `parent=(entities: N)`, the number of entities placed from it; an entity line with the prefab it was created from, `parent=(GUID:"name")`, or just `parent=(GUID)` when that is a native
object of the game or unknown. The `markdown` / `html` tables have this as a **Parent** column.

Add `--details` for the numeric values the editor does not show (`class=`, `section=`, and for graphs `kind=`, `service=`, `decl=` (the GUID of a composite's declaration), entry slot, evaluation interval).
`all` always shows them. Add `--dedup` to list resources that only differ in their GUID once: resources without a folder that have the same name, class (and section with `--details`), parent and mounted graphs
become one line with the smallest GUID of them and a `+N more` label.

The **Variables** section at the end lists the variables in three tables under one heading. Variable names are 'single-quoted'.

* *Graphs*: one `GRAPH_VARIABLE` line per variable of every node graph, `GRAPH_VARIABLE 'My Graph' "Score" : Int (public) = 0`. `(public)` marks a variable the graph publishes, which a prefab, a template or an entity that mounts the graph can give another value.
* *Prefabs* (custom variables): one `VARIABLE` line per variable, `VARIABLE Player 1086324737:"Default Template" "Score" : Int = 0`. The stage (`Stage`), the player templates (`Player`) and the character templates (`Character`) come first, in that order, then the prefabs and creations (`GUID:"name"`). A dictionary shows its key and value types (`Dict<Str,Int>`), a struct its struct (`struct=Name`). A published graph variable that a prefab gives another value than the graph's has a line of its own after the custom variables, with the graph in braces behind the name: `VARIABLE 1077936131:"Prefab" "Score" {'My Graph'} : Int = 10`.
* *Entities*: only what an entity changes compared with the prefab it was created from, one `VARIABLE_CHANGE` line per variable, `VARIABLE_CHANGE 1077936134:"Added" (1077936129:"Empty Model") "Extra" add: Str = '12'`. The change is `add: TYPE` (the prefab has no such variable), `delete: TYPE` (it was removed; no value), `newtype: TYPE` (another type; the value is the new one) or `edit: TYPE` (another value). An entity made from something that is not in the file (a native object of the game) is compared with a prefab that has no variables, so all its variables are `add`. An entity that changes nothing is not listed. Published graph variables show up as `edit` lines with the graph in braces, compared with the value its prefab has for that graph (the graph's own value when the prefab does not mount it). The `markdown` / `html` formats show the same as three tables.

**Save variables.** The in-game saves of a stage (a `.gil` section) declare *save variables*, always lists of structures. The file does not say which template uses a save, so every player template lists the save
variables as custom variables of its own, after its regular ones (`VARIABLE Player 1086324737:"Default Template" '1_chip_1' : L<Struct> struct=Structure_Save_1 = []`), and the player entities have them too. A graph
that reads a save variable by name is therefore not reported as using an undeclared variable.

## Searching: `--search`, `--match`

Any mode can be turned into a search over what it prints:

```
node miliastra-search.mjs code exports/ --search Graph_Var --context 2
node miliastra-search.mjs refs exports/ --search signal --match "listen"
```

`--search TEXT` keeps the lines containing the text (ignoring case); `--match REGEXP` keeps lines matching a regular expression (JavaScript syntax); with both, a line has to satisfy both. `--context N` adds N
lines around every hit. With several files each line is prefixed with its file (`--no-file-prefix` removes it). The exit code is 1 when nothing matched, and the number of matching lines goes to stderr.

The search runs over the lines of the line formats. In `markdown` / `html` the report keeps its look: the table rows, list items and lines that match are kept, under their headings. On Windows, where a double
quote is awkward on the command line, write two single quotes (`''`) instead. `--format json` cannot be combined with a search.

## Finding uses: `refs`

```
$ node miliastra-search.mjs refs my_export.gia
signal    "Signal_1"    2 listen: ['Receive'; 'Both'], 2 send: ['Send'; 'Both']
signal    "Signal_2"    2 listen: ['Receive'; 'Both'], 2 send: ['Send'; 'Both']
timer     "* (listener for any name)"   1 listen: ['Send']
```

One entry per named thing, with the graphs that use it. Graph names are in single quotes and tagged where it matters (`<composite>`, `<status>`, `<class>`, `<skill>`, `<filter>`, `<creation>`); everything else is in
double quotes.

| Option | Effect |
|---|---|
| `--kind K` | Limits it to one kind: `graph_variable`, `custom_variable`, `timer`, `global_timer`, `signal`, `composite`, `struct`, `mount`, `node_type`, `literal_id`. `node_type` is a listing of its own: the overview leaves it out, only `--kind node_type` (or `--name`) shows which node types the graphs use. |
| `--name N` | Lists every single use of the exact name `N`, node by node (`refs --kind signal --name Signal_2`). |
| `--sort-desc` | Orders the overview by number of uses. |

A variable's type is shown after its name, `"Var" (Int)`, in server and client graphs alike. A variable's uses are counted as `get`, `set`, `trigger` and `listen`; a *Set* whose **Trigger Event** is on (or wired, so
not known to be off) is a `trigger`, not a `set`.

Good to know:

* **Names that are wired in instead of typed are followed**: through *Get Local Variable*, through *Get Node Graph Variable* (its declared value; a runtime *Set* is not tracked), and through composites. If a name
  cannot be known without running the graph, it is listed as `<dynamic>`.
* **Composites count for whoever calls them.** A use inside a composite is attributed to each graph that calls it, as if the composite were expanded there. `refs --name` shows such entries with
  `[inlined via '<composite>Name']`. The exception: a custom variable, timer, global timer or listener whose name is fixed *inside* the composite (not an input the caller fills in) belongs to the composite itself,
  since it keeps its own variables on entities.
* **Listeners:** a *When … Changes / Triggered* node does not name what it listens to. The tool follows its execution wire: a chain of name checks gives one entry per name; anything else means the listener runs for
  every name and is shown as the key `* (listener for any name)`.
* **Literal ids** (`Cfg`, `Pfb`, `Gid`, and large plain integers) are matched against the resources in the file and shown as `CLASS:"name"`. An id is only matched with resources of its own kind of id, by the type
  of the pin or variable: `Gid` (GUID) with entities (OBJECT_ENTITY, CREATION_ENTITY) and with the stage and the players (GIL_LEVEL_ENTITY, GIL_PLAYER_ENTITY), `Pfb` (Prefab ID) with PROJECTILE / OBJECT /
  CREATION, `Cfg` (Configuration ID) with classes, skills, statuses, items ..., and a big plain `Int` (Index) with shop templates, tags, deployment groups, layouts, paths ... Other resources (timers, cameras ...)
  are referred to by name, never by id.
* **Mounts:** a `.gil` records which graph is attached to which host (prefab, entity, creation, stage entity, player or character template, status, class). `refs` has a `mount` kind (listed in the order of the
  graphs) and `dump` prints `MOUNT` lines.
* Names and ids are local to one file, so signals and structs are matched by name, and a finding such as "signal sent but never listened to" only knows the files you passed in.

## Problems and limits: `warns`

```
$ node miliastra-search.mjs warns exports/
# findings
INFO  catch-all-listener: [5] When Timer Is Triggered in graph 'Send' also runs code for every name: …
# limits
signals: 2/99 declared
top graphs by node count:
'Both': 4/3000 nodes
```

Findings are `WARN` (probably wrong) or `INFO` (worth a look). `--kind` / `--name` keep only matching findings (and print no limits); `--top-graphs N` sets how many graphs are listed (default 20). Limit lines
appear only when something is counted against them.

### Findings

| Type | Level | Meaning |
|---|---|---|
| `declared-but-unused` | info | A graph variable never referenced by its literal name. |
| `used-but-undeclared` | warn | A graph variable referenced in a graph that does not declare it. |
| `signal-sent-never-listened` | warn | A signal that is sent and has no listener in the scanned files. |
| `signal-listened-never-sent` | info | A signal that is listened to and never sent. |
| `signal-never-used` | info | A signal that is declared and neither sent nor listened to. |
| `composite-never-called` | info | A composite that no scanned graph calls. |
| `composite-definition-count-anomaly` | warn | A composite name with other than exactly one definition: a structural problem of the file. |
| `composite-circular-call` | warn | Composites that call each other in a circle. |
| `custom-variable-type-conflict` | info | A custom variable name declared with different types by entities / prefabs / templates (once per name; a dictionary counts by its key and value types, a struct by the struct). Two declarations of one name will do as long as they agree. |
| `custom-variable-type-mismatch` | info | A node reads or writes a custom variable as a type that no declaration of that name has. |
| `custom-variable-undeclared` | info | A custom variable name that a node uses (also one it only listens to) and no entity, prefab or template declares (the save variables of a stage count as declared by the players). Writing an undeclared variable is allowed in the game, which then creates it. |
| `catch-all-listener` | info | A listener that also runs code for every name. |
| `listener-no-handlers` | info | A listener with no name switch and no code after it. |
| `dynamic-reference` | info | A name that is computed at runtime, so it cannot be checked. |
| `duplicate-branch-value` | warn | A `Multiple Branches` lists a value twice: the game then always takes `Default`. |
| `graph-node-count-exceeded` | warn | The effective node count (own nodes plus the nodes of every composite it calls) is over the editor limit. |
| `stale-suppression-comment` | warn | A node comment silences a finding that no longer applies; see below. |

The custom variables of a file are checked against its graphs whenever the file holds entities, prefabs or templates (a `.gia` of graphs only declares nothing to check against). The game decides at run time which
entity a node reads, so these checks go by name and cannot tell which declaration is meant. Only names the tool can read statically are checked, as in `refs`.

### Silencing a finding you accept

Write the finding's name (for example `catch-all-listener`) anywhere in the **comment of that node** in the editor, with any text around it (`catch-all-listener: intentional, see TODO-12`). It works for
`catch-all-listener`, `listener-no-handlers`, `dynamic-reference`, `signal-sent-never-listened`, `signal-listened-never-sent`, `duplicate-branch-value`, `used-but-undeclared`, `custom-variable-undeclared` and
`custom-variable-type-mismatch`. If the problem goes away while the comment stays, you get a `stale-suppression-comment` warning, so comments cannot silently go out of date.

### Limits

The `# limits` section counts signals and composites against the editor's caps, every capped class of resource (prefabs, dynamic entities, classes, ...), and the nodes of the biggest graphs (a graph's size includes
the composites it calls). Static entities have no limit and are only counted. The limit numbers are those of game 7.1.0.

## The file itself: `info`, `check`, `raw`

`info` shows the format, game version, mode (classic or the default), the name, and counts per resource class; for a `.gil` also its sections (each with a short description) and resource folders (with the number
of graphs and of other resources in each, a zero left out). The File and Contents blocks are two-column tables (`property  value`) in every format. The export tag contains your **account UID** and is hidden unless
you pass `--show-tag`.

`--key KEY` prints only one value, as plain text in any format: a property of those two blocks or the count of a resource class (the **Class** column of "Resources by class"), ignoring case. For scripts:

```
$ node miliastra-search.mjs info stage.gil --key level_name
My Stage
$ node miliastra-search.mjs info stage.gil --key mode
beyond
$ node miliastra-search.mjs info stage.gil --key ENTITY_NODE_GRAPH
12
```

The exit code is 1 when the file has no such key (a `.gia` has an `export_name`, not a `level_name`). With several files each value gets a `file:` prefix (`--no-file-prefix` removes it); `--key` cannot be
combined with `--format json` or `--search` / `--match`. `--short` leaves out the level sections and the `class=` numbers.

`check` reports anything it did not fully understand: fields the tool has no definition for, node types it has no name for; add `--strict` for exit code 1 when anything is reported, handy in scripts. `raw` dumps
the protobuf structure of one file without any schema.

## For a language model: `llm`

```
node miliastra-search.mjs llm my_stage.gil -o stage.txt
```

Everything a language model needs to read your stage, as one plain text: the `all` report without `warns` (and without `--details`), with the code as short pseudocode, resources deduplicated and columns separated by
tabs. The mode sets its options itself (`--lenient --format text --short --dedup --tab --pseudocode --optimize --lazy --with-code`) and accepts only two of its own:

* `--lang CODE` for the language of the names (English unless given),
* `--output FILE` / `-o FILE` to write the text to a file instead of printing it (the file is only written when the run succeeded; its extension does not change the format).

It needs game files, not a saved report. The text ends with a `# END` line.

## Output formats and files

`--format` chooses how the report looks, for every mode:

| Format | Use it for |
|---|---|
| `text` | Plain lines, ideal for searching and piping. |
| `color` | The same with terminal colors. |
| `md`, `htm` | The same lines as a Markdown file or a web page (styled, with headings). |
| `markdown`, `html` | A real document: a section per graph, tables for references and pins. `html` is a standalone dark page. |
| `json` | The parsed result itself, for other programs (every mode). Described in [JSON.md](JSON.md). |
| `auto` (default) | By the extension of `--output` (`.md .markdown .htm .html .json`); otherwise `color` in a terminal (unless `NO_COLOR` is set) and `text` when piped. |

`--output FILE` (or `-o FILE`) writes the report to a file: `node miliastra-search.mjs refs exports/ -o refs.html`. The file is only written when the run succeeded (exit code 0): a file that exists is a complete
report, not the leftover of a failed run or of a search that found nothing. Markdown files start with a UTF-8 byte-order mark so editors read them correctly.

`--tab` (`text` and `color` formats): separate the columns of a line with a single tab instead of spaces, and indent pseudocode with tabs, so a line splits into its values on `\t`. A separator character (`:`,
`->`, `=`) stays with the value on its left. `--search` / `--match` see the usual spaces.

## Saved reports as input

A report saved as JSON (`node miliastra-search.mjs all exports/ -o all.json`) can be used in place of the game files, to get any other format later without them:

```
$ node miliastra-search.mjs refs all.json --format html -o refs.html
```

Only one report at a time (and not together with game files); a `.json` file inside a folder is not picked up. The mode must be the report's own, or any part of an `all` report (`info`, `dump`, `code`, `refs`,
`warns`, `all`; `code` only if the report was made with `--with-code`). `check` and `raw` cannot be rendered from a report. Options that change *what* is reported (`--kind`, `--name`, `--sort-desc`,
`--top-graphs`, `--show-tag`, `--lang`, ...) were applied when the report was made; if they differ on the command line, one warning line lists them. `--details` and `--all-pins` only change what is *shown* (a
report always holds that data), so they work on a saved report, with or without. `--lenient` reads a report that does not fit the format as far as it can. The presentation options (`--format`, `--search`,
`--match`, `--context`, `--key`, `--no-file-prefix`, `--output`) work as usual. `node scripts/render-json.mjs report.json` does the same without the mode rules (it also renders `check` and `raw` reports; `--help`
lists its options).

## More options

| Option | Effect |
|---|---|
| `--lang CODE` | Node and pin names in another language: `EN` (default), `CHS` (`ZH` works too), `CHT`, `DE`, `ES`, `FR`, `ID`, `IT`, `JP`, `KR`, `PT`, `RU`, `TH`, `TR`, `VI`; any case. |
| `--lenient` | Decode a file whose header or tail looks damaged, best effort. |
| `--input gia\|gil` | Force the file type instead of detecting it. |
| `--db FILE` | Use another node database. |
| `--short` | `info` (and `all`): leave out the level sections and the `class=` numbers of the resource classes. |
| `--tab` | See [Output formats and files](#output-formats-and-files). |
| `--help` | All options, with the modes each one applies to. |

## The web page

`miliastra-search.htm` offers the same modes in tabs. Files are added with the picker or dropped anywhere on the page, and **Process!** (or Enter in an option field) runs the tab. **Plain** shows the report as
lines, **Rich** as tables, **Json** downloads the report as `<input files> - <mode>.json`. The **LLM** tab has no options of its own (it uses the language chosen on the Input tab): the text goes into a text area, and
**download** saves it as `<input files> - llm.txt`. **fullscreen** opens the result in a new browser tab. Files stay local to the page.

## Newer game versions

| Situation | What happens |
|---|---|
| A node id that is not in the node database | Printed as `<node#ID>`, its pins by kind and index; its values and wires are intact; listed under `UNRESOLVED`. |
| New or renamed pins | Resolved by kind and index; unknown ones print without a name. |
| An unknown enum value | `enum:2811` / `<unknown-enum:2811>`. |
| An unknown resource class | Printed as `class#N`; a graph payload is still decoded. |
| A new section in a `.gil`, or new protobuf fields | Listed by `check` (as a census of fields the tool has no definition for); `check --strict` exits 1. |
| The container tag or length changed | A clear error; `--lenient` decodes best-effort; `raw` dumps without a schema. |
| A structural change (for example a single field becoming repeated) | Cannot be foreseen: `check` and `raw` make it visible. |

After a game update, run `check` on your files first: nothing is lost silently. Names of new nodes can be added by rebuilding the node database or with an overlay file; see "When the game updates" in
[TECHNICAL.md](TECHNICAL.md).
