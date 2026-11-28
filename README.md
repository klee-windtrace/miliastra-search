# miliastra-search

Turns your **Miliastra Wonderland** node graphs into text you can search, and tells you where every variable, signal, timer and composite is used.

Give it the files the editor produces – a `.gia` export or a whole-stage `.gil` save – and it prints what is in them:

* **The code of every node graph**, as plain text (every node, wire and value, one fact per line to search as text), or it can also be written as JS-alike pseudocode to show your favorite LLM and ask it questions.
* **A cross-reference** of everything that is named: where a graph variable, custom variable, timer, signal, composite or struct is read, written, started, sent or listened to, and which graphs are attached to which entities, prefabs, templates, statuses and classes.
* **All main types of resources used**: GUID to name resolution, folders, parent prefabs, all declared variables and their values (including changes made on individual entities).
* **A list of likely problems**: variables used but never declared, signals sent but never listened to, composites never called, and similar; how close your stage to editor's limits, and top largest graphs.

Your files are only read, not modified. The type of a file is recognised from its content, so file names do not matter.

### Disclaimer

_This project is entirely written by an LLM, specifically [Claude](https://claude.ai/) AI._

## Try it in your browser

Open this self-contained webpage and follow the instructions there:

- [miliastra-search.htm](https://klee-windtrace.github.io/miliastra-search/miliastra-search.htm)

Your files are not uploaded anywhere, and there are no usage trackers. If you are still wary, open the link in a private window, disconnect from the internet, and close it when you are done.

The same page is in this folder: just open **`miliastra-search.htm`** (keep the `web/` folder next to it). Add your files with the picker or by dropping them on the page, choose a tab, and press **Process!**.

## Running it on your computer

You need [Node.js](https://nodejs.org) 20 or newer. There is nothing to install: clone this repository and run it from there in command prompt.

```
node miliastra-search.mjs refs my_export.gia
```

On Windows you can also use `miliastra-search.bat` in a console. Instead of a file you can give a folder: every `.gia` and `.gil` inside it is read.

The first word says what to print:

| Mode | Prints |
|---|---|
| `code` | The code of every graph. |
| `refs` | Who uses each variable, signal, timer, composite, … |
| `warns` | Likely problems, editor limits and the largest graphs. |
| `dump` | An overview of everything in the stage. |
| `info` | The file itself: format, game version, name, counts. |
| `all` | `info`, `dump`, `refs` and `warns` in one report. |
| `llm` | One plain text with everything a language model needs to read your stage. |
| `check`, `raw` | Diagnostics, for when the game has changed and something is not understood. |

Add `--search TEXT` to keep only the lines that contain the text, `--output report.html` to write a file instead of printing, and `--help` for every option.

```
node miliastra-search.mjs refs exports/ --search Signal_2
node miliastra-search.mjs warns stage.gil -o warns.html
node miliastra-search.mjs code graphs.gia --pseudocode --optimize
```

Node names come from a database built from the game's own editor files. After a game update some nodes can be unnamed (shown as `<node#1234>`) but everything else will be still readable.

## Documentation

* [ADVANCED.md](ADVANCED.md): every mode and option, what each finding means, output examples, saved reports.
* [TECHNICAL.md](TECHNICAL.md): how the tool works inside, tests and maintenance.
* [FORMAT.md](FORMAT.md): the `.gia` / `.gil` file format.
* [JSON.md](JSON.md): the JSON report, for other programs.

## Credits

This tool has no dependencies and is licensed under 0BSD, but was based on two MIT-licensed community projects. Thank you to their authors:

* [**Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack**](https://github.com/Wu-Yijun/Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack) by Wu-Yijun
* [**genshin-ts**](https://github.com/josStorer/genshin-ts) by josStorer

The schema in `schema/gia.merged.proto` and parts of the format notes grew from them. Keep the copyright notices of those projects if you redistribute; see [LICENSE](LICENSE).
