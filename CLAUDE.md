
# CLAUDE.md

Orientation for working on this repository. Read it first; the details live in the documents it points to.

## What this is

A read-only, zero-dependency Node.js CLI (also runnable in a browser page) that decodes Miliastra Wonderland `.gia` / `.gil` files into greppable
text (`dump` / `code`), a file summary (`info`), a reference index (`refs`), lint and limits (`warns`), a decoder-health report (`check`) and a
schema-less dump (`raw`). Users are content authors auditing their own node graphs.

| Document | Holds |
|---|---|
| `README.md` | User guide. Keep it free of internals. |
| `TECHNICAL.md` | Architecture, layers, refs model, output layer, host/web design, data files, scripts, tests, update procedure. |
| `FORMAT.md` | The binary format: the source of truth for every format fact the code relies on. |
| `schema/gia.merged.proto` + `schema/CHANGELOG.md` | Field and enum reference; check it before guessing what a number means. |

A behaviour change to `refs`, `dump`, `code` or `check` comes with a test and a matching update to whichever document owns that fact.

## Layers (read in this order)

`container.mjs` → `decode.mjs` / `protoparse.mjs` → `gil.mjs` + `mounts.mjs` → `model.mjs` → `nodedb.mjs` / `resolve.mjs` → `staticres.mjs` → `refs.mjs` /
`render.mjs` / `info.mjs` → `doc.mjs` / `theme.mjs` / `output/` / `filter.mjs` / `report-refs.mjs` → `cli.mjs`. `refs.mjs` is by far the largest and most intricate file
(composite attribution in particular): read its section of `TECHNICAL.md` before touching it, and re-derive the numbers in
`test/composite-inheritance.test.mjs` by hand before trusting a refactor there.

## Rules that are easy to break

* **Zero npm dependencies.** Do not add one for something that fits in a screenful of code.
* **The engine never touches `fs`, `path`, `process`, `Buffer` or `import.meta`.** All outside access goes through `src/host.mjs`; the entry point installs
  `host-node.mjs` or `host-web.mjs`. Need a new capability? Add it to `host.mjs` and both hosts. No "am I in a browser" checks.
* **After any change under `src/`, `data/` or `schema/`, run `npm run build-web`.** `test/web.test.mjs` fails on a stale bundle. The bundler supports only the
  import/export forms already in use (named imports, `export function|const|let|class`, no cycles) and fails loudly otherwise.
* **Styling lives only in `src/theme.mjs`.** Builders say what a piece *is* (`S('key', …)`, `graph(…)`, `T` messages); nothing styles by pattern-matching text.
* **The `text` output is the contract people grep.** `test/expected/` is meant to fail when output changes: read the diff, then `npm run update-expected`.
* **GUIDs are file-local, and per kind inside a `.gil`.** Never join across files or kinds by GUID; join signals/structs/composites by name, and graphs by GUID *and* service domain.
* **Node pins are sparse.** Never assume a pin object exists; identify pins by `(kind, index)`. An absent pin is the node's default, which the file does not state (data: `triggerDefault` in `ref-rules.json`).
* **Resources are listed in the editor's order** (`orderResources` in `model.mjs`, applied once in `parseBundle`); do not sort again in a printer.
* **Which node pins carry names is data** (`data/ref-rules.json`), not code. Adding a named-pin node is usually one entry.
* Adding a CLI option: update `HELP` in `cli.mjs` (grouped by the modes it affects), the web page's `TABS` if the page should expose it, and README.
* Modes are always listed in the order `info, dump, code, refs, warns, check, raw`.

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

## Comment style

Comments explain *why* something is the way it is, especially magic numbers, service-domain tags and pin indices.
Do not name other projects or where a fact came from. Describe the code as it is now: no history ("now", "no longer", "used to"), no bug stories, no reference to who asked for something, and neutral wording
(no "never"/"always" unless it is literally an invariant). Do not restate what the line does.

## Working notes

* Tell the user when something in their example or spec looks inconsistent; pick the sane interpretation and say which one.
* Keep this file short. At the end of a session, fix what turned out inaccurate and drop what is obsolete; do not log bug fixes here.

## Files not to read when reading code

- `data/nodes.json` (built from a game install by `scripts/build-db.mjs`)
- `test/cases/` (binary game files)
- `test/expected/` (generated outputs)
- `web/miliastra-search.bundle.js` (generated).

Add a line here whenever a generated file is added.
