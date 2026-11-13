// The blocks that open and close the document of every per-file listing (dump, code): the title, the warnings of the file, and the node types the
// database has no name for. Input: the file facts of a dump / code report item (JSON.md).
import { S, marker, sep } from './doc.mjs';

/**
 * The title and the warnings. The title only gives the document formats their H1; in the line formats it prints nothing for a single file, and a
 * `# FILE name` line when several files are printed in one run (`fileLine`), else lines of different files would run together.
 * `asComment`: the warnings are `// ...` lines (the document is code) and the title never prints a line.
 */
export function openingBlocks(item, { fileLine = false, asComment = false } = {}) {
  const blocks = [{ t: 'title', spans: ['File ', S('fileName', item.file)], text: fileLine && !asComment ? [[marker('# '), S('heading', 'FILE'), sep(), S('fileName', item.file)]] : null }];
  const line = (word, msg) => (asComment ? [S('jsComment', `// ${word} ${msg}`)] : [marker('# '), S('warn', word), sep(), msg]);
  const unresolved = item.unresolved_nodes;
  if (unresolved.length && item.node_db_version) {
    const msg = `${unresolved.length} unresolved node type(s); node DB is based on game ${item.node_db_version}, file is ${item.engine_version}. Names are cosmetic: search on IDs still works. See TECHNICAL.md "When the game updates".`;
    blocks.push({ t: 'note', level: 'warn', spans: ['Warning: ', msg], text: [line('WARNING:', msg)] });
  }
  for (const w of item.container_warnings) blocks.push({ t: 'note', level: 'warn', spans: ['Container warning: ', w], text: [line('CONTAINER WARNING:', w)] });
  return blocks;
}

/** The list of the node types without a name (nothing when there are none). */
export function unresolvedBlocks(unresolved) {
  if (!unresolved.length) return [];
  const kw = S('keyword', 'UNRESOLVED');
  return [
    { t: 'hr', text: null },
    { t: 'heading', level: 2, spans: 'Unresolved nodes', text: [[S('heading', 'UNRESOLVED')]] },
    {
      t: 'table', cols: [{ title: 'Node' }, { title: 'Count', align: 'right' }, { title: 'Where' }],
      rows: unresolved.map((u) => [u.what, S('count', u.count), u.where.join(', ')]),
      text: unresolved.map((u) => [kw, sep(), u.what, ' x', S('count', u.count), sep(), 'e.g. ', u.where.join(', ')]),
    },
  ];
}
