// One document per file (dump and code): the documents follow each other, or with --search / --match only their matching lines are
// shown, each prefixed with "file:" when several files were asked for.

/** The groups printer.groups() takes, one per document ({ file, blocks }). */
export const fileGroups = (docs, { multi, noFilePrefix }) => docs.map((d) => ({ prefix: multi && !noFilePrefix ? d.file + ':' : '', blocks: d.blocks }));

/** The documents as the text of a run: whole, or only the lines matching --search / --match. */
export const printFileDocs = (docs, printer, { multi, noFilePrefix, title }) => printer.groups(fileGroups(docs, { multi, noFilePrefix }), title);
