
# CLAUDE.md

Orientation for working on this repository. Read it first; the details live in the documents it points to.

## What this is

A read-only, zero-dependency Node.js CLI (also runnable in a browser page) that decodes Miliastra Wonderland `.gia` / `.gil` files into greppable
text (`dump` / `code`), a file summary (`info`), a reference index (`refs`), lint and limits (`warns`), a decoder-health report (`check`) and a
schema-less dump (`raw`). Users are content authors auditing their own node graphs.

| Document | Audience | Holds |
|---|---|---|
| `README.md` | A person with no prior knowledge | What the program is for and how to run it. No internals, no option-by-option reference. |
| `ADVANCED.md` | A user who wants the details | Every mode and option, the full list of findings, output examples, saved reports, behaviour on newer game versions. |
| `TECHNICAL.md` | Someone (or an AI) asking how the project works | Architecture, layers, refs model, output layer, host/web design, option internals, data files, scripts, tests, update procedure. |
| `FORMAT.md` | Someone (or an AI) building another tool for `.gia` / `.gil` | The file format: what is stored, how it is interpreted. The source of truth for every format fact the code relies on. |
| `JSON.md` + `schema/report.schema.json` | Authors of third-party software | The JSON report every mode prints (`--format json`). |
| `schema/gia.merged.proto` + `schema/CHANGELOG.md` | Anyone checking a field number | Field and enum reference, and notes on it (not a change log). |

A behaviour change to `refs`, `dump`, `code` or `check` comes with a test and a matching update to whichever document owns that fact.

## Layers (read in this order)

`container.mjs` → `decode.mjs` / `protoparse.mjs` → `gil.mjs` + `mounts.mjs` → `model.mjs` → `nodedb.mjs` / `resolve.mjs` → `staticres.mjs` → `refs.mjs` /
`analyze.mjs` → `info.mjs` / `dump.mjs` / `code.mjs` → `report.mjs` (the JSON report of a mode) → `present/` (renders a report; `doc.mjs`, `theme.mjs`, `output/`, `filter.mjs`, `saved.mjs` for a report saved as JSON) → `cli.mjs`. `refs.mjs` is by far the largest and most intricate file
(composite attribution in particular): read its section of `TECHNICAL.md` before touching it, and re-derive the numbers in
`test/composite-inheritance.test.mjs` by hand before trusting a refactor there.

## Rules that are easy to break

* **Zero npm dependencies.** Do not add one for something that fits in a screenful of code.
* **The engine never touches `fs`, `path`, `process`, `Buffer` or `import.meta`.** All outside access goes through `src/host.mjs`; the entry point installs
  `host-node.mjs` or `host-web.mjs`. Need a new capability? Add it to `host.mjs` and both hosts. No "am I in a browser" checks.
* **After any change under `src/`, `data/` or `schema/`, run `npm run build-web`.** `test/web.test.mjs` fails on a stale bundle. The bundler supports only the
  import/export forms already in use (named imports, `export function|const|let|class`, no cycles) and fails loudly otherwise.
* **Parsing and presentation are separate.** Everything that reads a `.gia` / `.gil` ends in a report object (`report.mjs`); `src/present/` renders it and must not import the decoder or touch a bundle. A report holds resolved data and roles (`{ role, text }`), never colors, quotes or layout. A renderer should do plain rendering, no joining by index.
* **Keep `JSON.md` and `schema/report.schema.json` in step with every change to a report** (a new key, a renamed field, a new mode or view). `test/render-json.test.mjs` validates real reports against the schema and compares direct output with output rendered from the JSON; bump nothing silently, update both documents.
* **Columns of a text line are separated with `sep()`** (`present/doc.mjs`), not with a literal space, so `--tab` can turn them into tabs.
* **Styling lives only in `src/present/theme.mjs`.** Builders say what a piece *is* (`S('key', …)`, `graph(…)`, `T` messages); nothing styles by pattern-matching text.
* **The `text` output is the contract people grep.** `test/expected/` is meant to fail when output changes: read the diff, then `npm run update-expected`.
* **GUIDs are file-local, and per kind inside a `.gil`.** Never join across files or kinds by GUID; join signals/structs/composites by name, and graphs by GUID *and* service domain.
* **Node pins are sparse.** Never assume a pin object exists; identify pins by `(kind, index)`. An absent pin is the node's default, which the file does not state (data: `triggerDefault` in `ref-rules.json`).
* **Resources are listed in the editor's order** (`orderResources` in `model.mjs`, applied once in `parseBundle`); do not sort again in a printer.
* **Which node pins carry names is data** (`data/ref-rules.json`), not code. Adding a named-pin node is usually one entry.
* Adding a CLI option: update `HELP` in `cli.mjs` (grouped by the modes it affects), the web page's `TABS` if the page should expose it, and README.
* Modes are always listed in the order `info, dump, code, refs, warns, check, raw`, then `all` (the mode made of the others), then `llm` (`all` without warns and with fixed options; web tab last). The parts of an `all` report are `info, dump, refs, warns`, then `code` (`ALL_PARTS`, the order of the web tabs).
* **Options that decide what a report holds** (`--show-tag`, `--kind`, ... : `present/options.mjs`) belong to the report builder and are recorded in `header.options`; a renderer reads them from the header. A new one goes into `options.mjs`, `reportOptions`, the schema and `JSON.md`. **Options that only choose what is shown** (`--details`, `--all-pins`, `--pseudocode`, `--optimize`, `--lazy`, `--dedup`, `--short`, `--tab`) are not recorded: the report always holds that data and `renderReport` takes them as render options (`all` always shows the details).
* **A report is complete or there is none**: a file error or two files with the same name end the run before any output; an `--output` file is written only for exit code 0. Reports show file *names* only (`parseBundle` gets `basename`).
* Pseudocode (`src/pseudocode.mjs`, `src/flow.mjs` for the execution type of every node and composite, `present/pseudocode.mjs`): all flow / data analysis in the engine, the renderer only prints (a search is the one exception: `searchedNodes` in `present/code.mjs` greps the plain listing, then the renderer keeps the found cases) (`--all-pins`, `--optimize`, `--lazy` are render options); suite tests on the `codegen` / `codegen72` fixtures (`test/codegen.test.mjs`, engine 7.1.0 / 7.2.0 files, hence their own categories).
* The `code` report is the complete graph model (`src/code.mjs`, rendered by `present/code.mjs`); a new code style adds its derived data next to the model, never instead of it (TECHNICAL.md, "The code report").

## Workflow

| Command | When |
|---|---|
| `npm test` | Always before finishing. |
| `npm run build-web` | After changing `src/`, `data/` or `schema/`. |
| `npm run update-expected` | After an intended output change; review the diff first. |
| `npm run add-bom` | Before finishing: `.md` and `.mjs` files carry a UTF-8 BOM. |

Fixtures are in `test/cases/<category>/`, one folder per category. A new fixture goes in a category folder, then `npm run update-expected`. The `gia` and `gil`
categories must keep an empty unknown-field census (`core.test.mjs`) and engine 7.0.0 (`gil.test.mjs`); newer-engine files get their own category.
A genuinely new unknown field shows up in `check` / `check --strict`: decide whether to decode it (proto + `normValue` in `model.mjs`) or record it in `FORMAT.md` as seen but not decoded.

## Comments and documentation

Applies to code comments, test titles, and every `.md` file. Write as if the project had no development history.

* Describe only the present state: what something is, why it is that way (magic numbers, service-domain tags, pin indices, invariants, format facts). Do not restate what a line does.
* No history or prompt leakage: no "before", "as before", "same as earlier", "now", "no longer", "used to", "still", "again", "instead of <old way>", "new", "fixed", "bug", "regression", no "it is printed here, not there". Nothing refers to a previous version of the code, to a request, or to who asked. A task phrased as "keep X working" yields no comment about X; delete rather than paraphrase a history sentence.
* No "never" / "always" unless it is literally an invariant; otherwise use neutral present-tense wording.
* Do not name other projects, sample or fixture files, or where a fact came from. Format facts are stated as facts ("observed in games 7.0.0 to 7.2.0" is fine).
* Each document keeps to its audience (table above). A fact belongs in one document; the others link to it. `README.md` has no technical details. `FORMAT.md` describes the format, not this project's code. `TECHNICAL.md` describes how the project works, not how it got there.
* `schema/CHANGELOG.md` holds schema notes, not a log of edits.

## Working notes

* Tell the user when something in their example or spec looks inconsistent; pick the sane interpretation and say which one.
* Keep this file short. At the end of a session, fix what turned out inaccurate and drop what is obsolete; do not log bug fixes here.

## Files not to read when reading code

- `data/nodes.json` (built from a game install by `scripts/build-db.mjs`)
- `test/cases/` (binary game files)
- `test/expected/` (generated outputs)
- `web/miliastra-search.bundle.js` (generated).

Add a line here whenever a generated file is added.
