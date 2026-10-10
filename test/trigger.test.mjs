// Trigger Event of the Set nodes. A pin is stored in a file only when it was edited, so a Set without a Trigger Event pin
// uses the engine default (true, see data/ref-rules.json). test/cases/composites/var_change.gia has two Set Custom Variable nodes
// in composites without a stored pin (one gets the variable name through a composite input port, one has it as a literal)
// and a listener.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { casesDir, overviewLines } from './helpers.mjs';
import { parseBundle } from '../src/model.mjs';
import { NodeDb } from '../src/nodedb.mjs';
import { buildRefs, refLineSpans } from '../src/refs.mjs';
import { plain } from '../src/doc.mjs';

const db = new NodeDb();
const bundle = () => parseBundle(fs.readFileSync(path.join(casesDir, 'composites', 'var_change.gia')), { file: 'var_change.gia' });

test('Sets with no stored Trigger Event pin count as triggers, exposed name or literal name alike', () => {
  // Var1: the name is an exposed composite input (the caller's choice) -> the caller owns it; Var2: the name is fixed inside the composite -> the composite owns it
  const { refs } = buildRefs([bundle()], db);
  const line = (key) => overviewLines(refs.filter((r) => r.kind === 'custom_variable' && r.key === key))[0];
  assert.match(line('Var1'), /0 set: \[\], 1 trigger: \['VAR_TEST'\], 1 listen: \['VAR_TEST'\]/);
  assert.match(line('Var2'), /0 set: \[\], 1 trigger: \['<composite>VAR_TEST_2'\], 1 listen: \['<composite>VAR_TEST_3'\]/);
});

test('the detail view shows the same role as the overview', () => {
  const { refs } = buildRefs([bundle()], db);
  const sets = refs.filter((r) => r.kind === 'custom_variable' && r.key === 'Var1' && r.role === 'set');
  assert.ok(sets.length >= 1);
  for (const r of sets) assert.match(plain(refLineSpans(r)), / literal trigger @ /);
});

test('an explicit false (a stored pin) makes it a plain set again', () => {
  const b = bundle();
  for (const r of b.resources) if (r.graph) for (const n of r.graph.nodes) if (n.shell.id === 22) {
    n.pins.push({ kind: 3, index: 4, conns: [], value: { k: 'enum', v: 0 } });
  }
  const { refs } = buildRefs([b], db);
  const line = overviewLines(refs.filter((r) => r.kind === 'custom_variable' && r.key === 'Var2'))[0];
  assert.match(line, /1 set: \['<composite>VAR_TEST_2'\], 1 listen/);
  assert.doesNotMatch(line, /trigger/);
});
