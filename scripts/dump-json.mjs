// Developer aid for extending the schema: prints the resources of a .gia as JSON, decoded with schema/gia.merged.proto
// (field names, nothing normalised by model.mjs), each cut to 6000 characters. `raw` mode is the schema-less counterpart.
//
// usage: node scripts/dump-json.mjs <file.gia> [selector]
//   selector: `all` (or none) = every resource; `R3` / `D1` = resource 3 / dependency 1 (prefix match);
//             a number = every resource of that resource_class
import fs from 'node:fs';
import { parseArgs, UsageError } from './cli-args.mjs';
import '../src/host-node.mjs';
import { unwrapContainer } from '../src/container.mjs';
import { loadSchema } from '../src/schema.mjs';
import { decodeMessage, Census } from '../src/decode.mjs';

const USAGE = `usage: node scripts/dump-json.mjs <file.gia> [all | R<n> | D<n> | <resource_class>]
Prints the resources of a .gia as JSON, decoded with schema/gia.merged.proto (field names as in the schema), each cut to 6000 characters.
  all (default)  every resource
  R3 / D1        resource 3 / dependency 1 (prefix match)
  <number>       every resource of that resource_class
`;
let parsed;
try { parsed = parseArgs(process.argv.slice(2), { min: 1, max: 2 }); } catch (e) {
  if (!(e instanceof UsageError)) throw e;
  console.error(`error: ${e.message}\n\n${USAGE}`);
  process.exit(2);
}
if (parsed.help) { process.stdout.write(USAGE); process.exit(0); }
const [file, selector] = parsed.positional;

const { payload } = unwrapContainer(fs.readFileSync(file));
const bundle = decodeMessage(payload, loadSchema().messages.get('AssetBundle'), new Census());
const entries = [...(bundle.resources || []).map((r) => ['R', r]), ...(bundle.dependencies || []).map((r) => ['D', r])];

entries.forEach(([prefix, r], i) => {
  const id = `${prefix}${i}`;
  if (selector !== undefined && selector !== 'all' && !id.startsWith(selector) && String(r.resource_class) !== selector) return;
  console.log(`--- ${id} class=${r.resource_class} name=${r.internal_name}`);
  console.log(JSON.stringify(r, null, 1).replace(/\n\s+/g, ' ').replace(/\{ /g, '{').slice(0, 6000));
});
