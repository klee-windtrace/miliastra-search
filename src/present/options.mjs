// The options of the command line that decide what a report contains ("data options"), shared by the engine (which records them in
// `header.options`) and by the code that renders a saved report (which compares them with the command line). Options that only change
// how a report is shown (--search, --format, --key, --details, --all-pins, ...) are not data options: a report holds what they
// would show, and the renderer decides.

/** Every data option: its key in `header.options`, the command-line option, and the value that means "not given". */
export const OPTIONS = {
  lang: { flag: '--lang', fallback: 'EN' },
  node_db: { flag: '--db', fallback: null },
  input: { flag: '--input', fallback: null },
  lenient: { flag: '--lenient', fallback: false },
  show_tag: { flag: '--show-tag', fallback: false },
  kind: { flag: '--kind', fallback: null },
  name: { flag: '--name', fallback: null },
  sort_desc: { flag: '--sort-desc', fallback: false },
  top_graphs: { flag: '--top-graphs', fallback: 20 },
  with_code: { flag: '--with-code', fallback: false },
  expand: { flag: '--expand', fallback: false },
};
export const DEFAULT_TOP_GRAPHS = OPTIONS.top_graphs.fallback;

const PARSE = ['lang', 'node_db', 'input', 'lenient'];
/** The keys of `header.options` per mode, in the order they are written. */
export const MODE_OPTIONS = {
  info: [...PARSE, 'show_tag'],
  dump: PARSE,
  refs: [...PARSE, 'kind', 'name', 'sort_desc'],
  warns: [...PARSE, 'kind', 'name', 'top_graphs'],
  code: [...PARSE, 'expand'],
  check: PARSE,
  raw: [],
  all: [...PARSE, 'show_tag', 'kind', 'name', 'sort_desc', 'top_graphs', 'with_code', 'expand'],
};

/** The modes `all` is made of, in the order they are listed (`code` only with the option `with_code`). */
export const ALL_PARTS = ['info', 'dump', 'refs', 'warns', 'code']; // the order of the web tabs; the code view is the heavy one
