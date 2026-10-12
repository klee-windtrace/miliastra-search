// Strict command-line parsing shared by the scripts: an unknown option is an error, and --help always wins (even next to bad arguments).
//
//   parseArgs(argv, { flags, values, multi, short, min, max })
//     flags / values  names (without "--") of options without / with a value; `--name=value` works for values
//     multi           the value options that may repeat (their entry in `opts` is an array)
//     short           { '-o': 'out' }: one-dash aliases of long options
//     min / max       how many positional arguments are allowed
//   -> { help: true } | { help: false, opts, positional }; throws UsageError for anything it does not accept.
export class UsageError extends Error {}

export function parseArgs(argv, { flags = [], values = [], multi = [], short = {}, min = 0, max = 0 } = {}) {
  if (argv.includes('--help')) return { help: true, opts: {}, positional: [] };
  const isFlag = new Set(flags), isValue = new Set(values), isMulti = new Set(multi);
  const known = new Set([...flags, ...values].map((n) => `--${n}`).concat(Object.keys(short)));
  const opts = {}, positional = [];
  for (let i = 0; i < argv.length; i++) {
    let a = argv[i], inline;
    if (!a.startsWith('-') || a === '-') { positional.push(a); continue; }
    if (short[a]) a = `--${short[a]}`;
    const eq = a.startsWith('--') ? a.indexOf('=') : -1;
    if (eq > 0) { inline = a.slice(eq + 1); a = a.slice(0, eq); }
    const name = a.slice(2);
    if (!a.startsWith('--') || !(isFlag.has(name) || isValue.has(name))) throw new UsageError(`unknown option ${argv[i]}`);
    if (isFlag.has(name)) {
      if (inline !== undefined) throw new UsageError(`option --${name} takes no value`);
      opts[name] = true;
      continue;
    }
    const v = inline ?? argv[++i];
    if (v === undefined || (inline === undefined && known.has(v))) throw new UsageError(`option --${name} needs a value`);
    if (isMulti.has(name)) (opts[name] ??= []).push(v); else opts[name] = v;
  }
  if (positional.length < min || positional.length > max) {
    throw new UsageError(max === 0 ? `unexpected argument ${positional[0]}` : positional.length < min ? 'missing argument' : `unexpected argument ${positional[max]}`);
  }
  return { help: false, opts, positional };
}

/** A non-negative integer option value, or a UsageError naming the option. */
export function toInt(name, v, min = 0) {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min) throw new UsageError(`option --${name} needs an integer >= ${min}, got "${v}"`);
  return n;
}
