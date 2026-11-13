// The all report as one document: the output of every mode it holds, one after the other, each under a heading of its own (`# INFO` in the line
// formats, a real heading in the others). Input: an `all` report (JSON.md).
import { S, marker } from './doc.mjs';
import { partOf } from './parts.mjs';
import { infoGroups } from './info.mjs';
import { dumpDocs } from './dump.mjs';
import { codeDocs, searchedNodes } from './code.mjs';
import { pseudocodeDocument } from './pseudocode.mjs';
import { fileGroups } from './files.mjs';
import { refsDocument } from './refs.mjs';
import { warnsDocument } from './warns.mjs';

const heading = (name) => ({ t: 'title', spans: name[0].toUpperCase() + name.slice(1), text: [[marker('# '), S('heading', name.toUpperCase())]] });
// inside the document of `all` the title of each part is a heading of its own, below the part's heading
const demote = (blocks) => blocks.map((b) => (b.t === 'title' ? { ...b, t: 'heading', level: 2 } : b));

/** Print the all report. Its dump part shows the details unless `noDetails` is set; `dedup` and `short` are the rendering options of the dump and info parts; `allPins`, `pseudocode`, `optimize` and `lazy` those of the code part. */
export function printAll(report, printer, { noFilePrefix = false, allPins = false, pseudocode = false, optimize = false, lazy = false, dedup = false, short = false, noDetails = false } = {}) {
  const { files } = report.header;
  const multi = files.length > 1;
  const sections = report.all.map((name) => {
    const sub = partOf(report, name);
    switch (name) {
      case 'info': return { name, groups: infoGroups(sub, { noFilePrefix, short }), sep: true };
      case 'dump': return { name, groups: fileGroups(dumpDocs(sub, { details: !noDetails, dedup }), { multi, noFilePrefix }), sep: false };
      case 'code': if (pseudocode) {
        // the search of the pseudocode is made on the listing, and picks the nodes (code.mjs): what it picked is not searched again, line by line
        const found = printer.grepping ? searchedNodes(sub, printer.isMatch, { allPins }) : null;
        const { blocks, count } = pseudocodeDocument(sub, { allPins, optimize, lazy, found });
        return { name, groups: [{ prefix: '', blocks, keep: found != null, hits: count }], sep: false };
      }
        return { name, groups: fileGroups(codeDocs(sub, { allPins }), { multi, noFilePrefix }), sep: false };
      case 'refs': { const d = refsDocument(sub); if (d.empty) { printer.note('no references found'); printer.fail(); } return { name, groups: [{ prefix: '', blocks: d.blocks }], sep: false }; }
      case 'warns': return { name, groups: [{ prefix: '', blocks: warnsDocument(sub) }], sep: false };
      default: throw new Error(`the all report lists the unknown mode "${name}"`);
    }
  });
  const title = `all ${files.join(', ')}`;
  if (printer.grepping) return printer.groups(sections.flatMap((s) => (s.groups.some((g) => g.keep) ? s.groups.map((g) => ({ ...g, blocks: [heading(s.name), ...demote(g.blocks)] })) : [{ blocks: [heading(s.name)] }, ...s.groups.map((g) => ({ ...g, blocks: demote(g.blocks) }))])), title, true);
  const joined = (s) => s.groups.flatMap((g, i) => (s.sep && i ? [{ t: 'hr' }, ...g.blocks] : g.blocks));
  return printer.groups(sections.map((s) => ({ blocks: [heading(s.name), ...demote(joined(s))] })), title, true);
}
