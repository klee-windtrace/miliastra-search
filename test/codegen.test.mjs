// The pseudocode style (`code --pseudocode`, with `--optimize`, `--all-pins`, `--expand`) on the fixtures made for it: codetest_1.gia (server graph, creation graph,
// filter graph) and codetest_2.gia (a status graph and the composites it calls). The complete outputs are in test/expected; these tests state the rules.
import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from './expected.mjs';
import { main } from '../src/cli.mjs';
import { resourceGuidIndexOf, literalResource } from '../src/refs.mjs';

const ONE = 'test/cases/codegen/codetest_1.gia', TWO = 'test/cases/codegen/codetest_2.gia';
// The explanation block is editable text: tests look at the code only.
const pseudo = (file, ...opts) => run(['code', file, '--pseudocode', ...opts, '--format', 'text']).replace(/^\/\*\n[\s\S]*?\n\*\/\n\n/m, '');
const report = (file) => JSON.parse(run(['code', file, '--format', 'json']));
/** The text of one case (from `case 'id':{` to its closing brace) of a pseudocode output. */
const caseOf = (text, id) => {
  const start = text.indexOf(`case '${id}':{`);
  assert.ok(start >= 0, `case ${id}`);
  const end = text.indexOf('\n    }\n', start);
  return text.slice(start, end);
};
const graphs = (file) => report(file).code[0].items.filter((x) => x.type === 'graph');
/** Every expression of a case (the arguments of its data nodes and of the node itself). */
const exprsOf = (c) => [...c.data, c.call].flatMap((call) => call.args.map((a) => a.expr).filter(Boolean));

// ---- 1. execution pins are strings ---------------------------------------------------------------------------------------------------------------------
test('flow pins are plain strings: a numeric pin is not prefixed, a data pin is an identifier', () => {
  const two = pseudo(TWO);
  assert.match(two, /case "0":/, 'a branch of Multiple Branches named by its number');
  const one = pseudo(ONE);
  assert.match(one, /\$\.input = "0";/, 'the flow input of Finite Loop');
  for (const text of [one, two]) assert.doesNotMatch(text, /"_\d+"|exit__/);
  assert.match(one, /^\s+_0: \$\.Int_003,/m, 'the pins of Multiplication are keys of an object, so they keep the underscore');
  // the report holds the same strings
  const labels = graphs(TWO).flatMap((x) => x.pseudocode.cases.flatMap((c) => c.next.map((b) => b.label)));
  assert.ok(labels.includes('0') && labels.every((l) => !/^_\d/.test(l)));
});

// ---- 2. outputs nobody reads ---------------------------------------------------------------------------------------------------------------------------
test('an output that is not wired is not printed, unless --all-pins', () => {
  const plain = caseOf(pseudo(ONE), 'node_0010'), all = caseOf(pseudo(ONE, '--all-pins'), 'node_0010');
  assert.match(plain, /const \{\n\s+Local_Variable: Loc_01,\n\s+\} = Get_Local_Variable\("Var_0011", \{\n\s+Initial_Value: Bol\(false\), \/\/ \(default\)\n\s+\}\);/);
  assert.doesNotMatch(plain, /Bol_02/);
  assert.match(all, /Value: Bol_02,/);
});
test('`uses` of every output is the number of reads in the report', () => {
  for (const file of [ONE, TWO]) for (const g of graphs(file)) {
    const global = new Map(); // name -> reads, over the whole graph
    const face = g.pseudocode.interface; // what a composite hands out reads the outputs of its execution nodes too
    const faceExprs = face ? [...face.data.flatMap((call) => call.args.map((a) => a.expr)), ...face.outputs.map((o) => o.expr)].filter(Boolean) : [];
    for (const e of [...g.pseudocode.cases.flatMap(exprsOf), ...faceExprs]) if (e.kind === 'global') global.set(e.name, (global.get(e.name) ?? 0) + 1);
    for (const c of g.pseudocode.cases) {
      const local = new Map();
      for (const e of exprsOf(c)) if (e.kind === 'var') local.set(e.name, (local.get(e.name) ?? 0) + 1);
      for (const call of [...c.data, c.call]) for (const o of call.outputs) assert.equal(o.uses, (o.global ? global : local).get(o.name) ?? 0, `${g.name.name} ${c.id} ${o.name}`);
    }
  }
});

// ---- 3. --optimize: a single output is read from the call ------------------------------------------------------------------------------------------
test('--optimize: one output is read directly, also for an event and an assignment to `$.`', () => {
  const plain = pseudo(ONE), opt = pseudo(ONE, '--optimize');
  assert.match(plain, /const \{\n\s+Self_Entity: Ety_01,\n\s+\} = Get_Self_Entity\("data_0004", \{\}\);/);
  assert.match(opt, /Ety\(Get_Self_Entity\("data_0004", \{\}\)\.Self_Entity\)/);
  assert.match(caseOf(opt, 'node_0024'), /const Ety_02 = Get_Local_Variable\("Var_0026", \{\n\s+Initial_Value: \$\.Ety_001, \/\/ When_Entity_Is_Created\.Event_Source_Entity\n\s+\}\)\.Value;/);
  assert.match(caseOf(opt, 'node_0024'), /\$\.Ety_004 = Create_Prefab\(\{[^]*\}\)\.Created_Entity;/);
  // an event is awaited: the read needs parentheses, or it would be `await (call.Key)`
  assert.match(pseudo(TWO, '--optimize', '--expand'), /\$\.Str_012 = \(await When_Timer_Is_Triggered\(\{\n\s+Event: \$\.event,\n\s+\}\)\)\.Timer_Name;/);
  // a node with several printed outputs keeps its destructuring
  assert.match(caseOf(opt, 'node_0024'), /const \{\n\s+Location: Vec_03,\n\s+Rotate: Vec_04,\n\s+\} = Get_Entity_Location_and_Rotation\(/);
  assert.match(opt, /\$\.Ety_001,\n\s+Event_Source_GUID: \$\.Gid_002,/, 'the event has two outputs that are read');
});
test('--optimize --all-pins: every output is printed, so a node with several outputs is destructured', () => {
  const text = pseudo(ONE, '--optimize', '--all-pins');
  assert.match(caseOf(text, 'node_0010'), /const \{\n\s+Local_Variable: Loc_01,\n\s+Value: Bol_02,\n\s+\} = Get_Local_Variable\("Var_0011", \{\n\s+Initial_Value: Bol\(false\), \/\/ \(default\)/);
});

// ---- 4. --optimize: a value read once is written where it is read ---------------------------------------------------------------------------------
test('--optimize: an intermediate that is read once is not declared; its call stands in a typecast of its type', () => {
  const opt = pseudo(ONE, '--optimize');
  assert.equal(caseOf(opt, 'node_0010'), `case 'node_0010':{ // called from 'node_0009: Double_Branch'
      Set_Local_Variable({
        Local_Variable: Loc(Get_Local_Variable("Var_0011", {
          Initial_Value: Bol(false), // (default)
        }).Local_Variable),
        Value: Int(1),
      });
      void "node_0013"; // Print_String`);
  assert.equal(caseOf(opt, 'node_0002'), `case 'node_0002':{ // called from 'event_0001: When_Entity_Is_Created'
      Set_Custom_Variable({
        Target_Entity: $.Ety_001, // When_Entity_Is_Created.Event_Source_Entity
        Variable_Name: "Var1",
        Variable_Value: Ety(Get_Owner_Entity("data_0003", {
          Target_Entity: Ety(Get_Self_Entity("data_0004", {}).Self_Entity),
        }).Owner_Entity),
        Trigger_Event: Bol(false),
      });
      void "node_0005"; // Set_Preset_Status`);
  // nested through three levels, and an argument of a generator
  assert.match(caseOf(opt, 'node_0009'), /Condition: Bol\(Enumerations_Equal\("data_0008", \{\n\s+Enumeration_1: Enum\(Get_Entity_Type\("data_0007", \{\n\s+Target_Entity: Ety\(Get_Self_Entity\("data_0006", \{\}\)\.Self_Entity\),\n\s+\}\)\.Entity_Type\),/);
  assert.doesNotMatch(opt, /\bconst (Bol_03|Enum_02)\b/);
});
test('--optimize: a value read twice is declared, and so is one whose node has two printed outputs', () => {
  const two = pseudo(TWO, '--optimize', '--expand');
  assert.match(caseOf(two, 'node_0034'), /const Bol_02 = Get_Local_Variable\("(Comp_\d+_)?Var_\d{4}", \{\n\s+Initial_Value: Bol\(true\),\n\s+\}\)\.Value;/);
  assert.match(caseOf(two, 'node_0034'), /Variable_Value: Bol_02, \/\/ Get_Local_Variable\.Value\n\s+Trigger_Event: Bol_02, \/\/ Get_Local_Variable\.Value/);
  const one = pseudo(ONE, '--optimize');
  assert.match(caseOf(one, 'node_0024'), /Target_Entity: Ety_02, \/\/ Get_Local_Variable\.Value/);
  assert.match(caseOf(one, 'node_0024'), /Owner_Entity: Ety_02, \/\/ Get_Local_Variable\.Value/);
});
test('--optimize does not inline a `$.` variable and does not change the report', () => {
  const opt = pseudo(ONE, '--optimize');
  assert.match(opt, /ID: \$\.Int_003, \/\/ Finite_Loop\.Current_Loop_Value/);
  assert.doesNotMatch(opt, /Int\(Finite_Loop/);
  // a render option: the JSON is the same either way
  assert.equal(run(['code', ONE, '--pseudocode', '--optimize', '--format', 'json']), run(['code', ONE, '--format', 'json']));
});
test('--optimize is only about --pseudocode', () => {
  assert.equal(run(['code', ONE, '--optimize', '--format', 'text']), run(['code', ONE, '--format', 'text']));
});

// ---- 5. where a variable comes from ------------------------------------------------------------------------------------------------------------------
test('every read of an intermediate or `$.` variable says which node and pin it comes from', () => {
  const text = pseudo(ONE);
  assert.match(caseOf(text, 'node_0002'), /Target_Entity: Ety_01, \/\/ Get_Self_Entity\.Self_Entity/);
  assert.match(caseOf(text, 'node_0002'), /Target_Entity: \$\.Ety_001, \/\/ When_Entity_Is_Created\.Event_Source_Entity/);
  assert.match(caseOf(text, 'node_0002'), /Variable_Value: Ety_02, \/\/ Get_Owner_Entity\.Owner_Entity/);
  // the declaration has no comment, a literal has none of this kind
  assert.doesNotMatch(caseOf(text, 'node_0002'), /Self_Entity: Ety_01, \/\//);
  assert.doesNotMatch(caseOf(text, 'node_0002'), /Variable_Name: "Var1", \/\//);
  // the same in the report: the node and the pin the expression reads
  const e = exprsOf(graphs(ONE)[0].pseudocode.cases.find((c) => c.id === 'node_0002')).find((x) => x.kind === 'var' && x.name === 'Ety_01');
  assert.equal(e.from, 'Get_Self_Entity.Self_Entity');
  assert.equal(e.node.name, 'Get Self Entity');
  assert.equal(e.pin.name, 'Self Entity');
});
test('a note on a literal and the source of a variable share one comment', () => {
  const text = pseudo(ONE);
  assert.match(text, /Prefab_ID: Pfb\(1077936129\), \/\/ OBJECT:"Empty Model"/);
});

// ---- 6. where a jump goes -------------------------------------------------------------------------------------------------------------------------------
test('every jump, `void` included, names the node it goes to', () => {
  const text = pseudo(ONE);
  assert.match(text, /void "node_0002"; \/\/ Set_Custom_Variable/);
  assert.match(text, /return GoTo\("node_0010"\); \/\/ Set_Local_Variable/);
  assert.match(text, /return GoTo\("node_0013"\); \/\/ Print_String/);
  assert.match(text, /\$\.input = "0";\n\s+void "node_0015"; \/\/ Finite_Loop/);
  // a jump into an expanded composite names the node of its body
  assert.match(pseudo(TWO, '--expand'), /void "node_0012\.node_0008"; \/\/ Set_Node_Graph_Variable/);
  for (const g of graphs(TWO)) for (const c of g.pseudocode.cases) for (const b of c.next) for (const t of b.targets) assert.equal(t.function === null, t.exit !== null);
});

// ---- 7. namespaces ---------------------------------------------------------------------------------------------------------------------------------------
test('graphs are filed by kind, without the tag in the name', () => {
  const one = pseudo(ONE), two = pseudo(TWO);
  assert.match(one, /^ServerGraphs\['New Node Graph'\] = async function Entity_\d+\(\$,node\)\{$/m);
  assert.match(one, /^ClientGraphs\['New Filter Node Graph'\] = async function Filter_\d+\(/m);
  assert.match(one, /^ClientGraphs\['New Creation Status Decision Node Graph'\] = async function Creation_\d+\(/m);
  assert.match(two, /^ServerGraphs\['Status'\] = async function Status_\d+\(/m);
  assert.match(two, /^Composite\['Calling Twice'\] = function Composite_\d+\(\$,Comp,In = \{\},node\)\{$/m);
  for (const text of [one, two]) assert.doesNotMatch(text, /^Graphs\[|\['<|\]\['<[a-z]+>/m);
  assert.deepEqual([...new Set(graphs(ONE).concat(graphs(TWO)).map((g) => g.pseudocode.namespace))].sort(), ['ClientGraphs', 'Composite', 'ServerGraphs']);
});
test('the heading keeps the tag, and a second file is addressed through `File[...]`', () => {
  const md = run(['code', TWO, '--pseudocode', '--format', 'markdown']);
  assert.match(md, /^## Graph .*composite.*Calling Twice/m, 'the heading still tells the tag');
  assert.match(md, /^Composite\['Calling Twice'\] = /m);
  const both = run(['code', ONE, TWO, '--pseudocode', '--format', 'text']);
  assert.match(both, /^File\['codetest_1\.gia'\]\.ServerGraphs\['New Node Graph'\] = /m);
  assert.match(both, /^File\['codetest_2\.gia'\]\.Composite\['Calling Twice'\] = /m);
});
test('a server graph of every server domain is a ServerGraphs entry', async () => {
  const { pseudocodeBuilder } = await import('../src/pseudocode.mjs');
  assert.equal(typeof pseudocodeBuilder, 'function');
  const tags = new Map(graphs('test/cases/gia/sample_0_main.gia').concat(graphs('test/cases/composites/test_All_Composite.gia')).filter((g) => !g.composite_body).map((g) => [g.service, [g.pseudocode.tag, g.pseudocode.namespace]]));
  assert.ok(tags.size);
  for (const [service, [tag, ns]] of tags) {
    if (service === 20000) assert.deepEqual([tag, ns], ['Entity', 'ServerGraphs']);
    if (service === 20003) assert.deepEqual([tag, ns], ['Status', 'ServerGraphs']);
  }
});

// ---- 8. GUID literals ------------------------------------------------------------------------------------------------------------------------------------
test('a Gid names the stage and the players as well as the entities, a Pfb or a Cfg does not', () => {
  const bundle = { resources: [
    { guid: 5, kind: 'object', className: 'GIL_LEVEL_ENTITY', name: 'Stage' },
    { guid: 6, kind: 'object', className: 'GIL_PLAYER_ENTITY', name: 'Player 1' },
    { guid: 7, kind: 'object', className: 'OBJECT_ENTITY', name: 'Crate' },
    { guid: 8, kind: 'object', className: 'CREATION_ENTITY', name: 'Mage' },
  ] };
  const index = resourceGuidIndexOf(bundle), id = (ty, v) => ({ k: 'id', ty, v, set: true });
  assert.deepEqual(literalResource(index, id('Gid', 5)), { className: 'GIL_LEVEL_ENTITY', name: 'Stage' });
  assert.deepEqual(literalResource(index, id('Gid', 6)), { className: 'GIL_PLAYER_ENTITY', name: 'Player 1' });
  assert.deepEqual(literalResource(index, id('Gid', 7)), { className: 'OBJECT_ENTITY', name: 'Crate' });
  assert.deepEqual(literalResource(index, id('Gid', 8)), { className: 'CREATION_ENTITY', name: 'Mage' });
  for (const ty of ['Pfb', 'Cfg']) for (const v of [5, 6]) assert.equal(literalResource(index, id(ty, v)), null);
});

// ---- the output is code ----------------------------------------------------------------------------------------------------------------------------------
test('every option set prints text that parses as JavaScript', () => {
  for (const file of [ONE, TWO]) for (const opts of [[], ['--optimize'], ['--all-pins'], ['--optimize', '--all-pins']]) {
    assert.doesNotThrow(() => new Function(pseudo(file, ...opts)), `${file} ${opts.join(' ')}`);
  }
});
test('--optimize prints less, and the same cases and jumps', () => {
  for (const file of [ONE, TWO]) {
    const plain = pseudo(file), opt = pseudo(file, '--optimize');
    assert.ok(opt.length < plain.length);
    const skeleton = (t) => t.split('\n').filter((l) => /^\s+(case '|void |await GoTo|return GoTo|\$\.input)/.test(l));
    assert.deepEqual(skeleton(opt), skeleton(plain));
  }
});

// ---- choice nodes ----------------------------------------------------------------------------------------------------------------------------------------
test('Multiple Branches is a switch whose `default` is its first output; Double Branch is an if / else; every branch ends the case', () => {
  assert.equal(caseOf(pseudo(TWO), 'node_0002'), `case 'node_0002':{ // called from 'event_0001: When_Unit_Status_Changes'
      ({
        Next: $.next,
      } = Multiple_Branches({
        Control_Expression: $.Int_008, // When_Unit_Status_Changes.Original_Status_Stacks
      }));
      switch($.next){
        default: // "Default"
          return Exit();
        case "0":
          return GoTo("node_0003"); // Remove_Unit_Status
      }`);
  const one = caseOf(pseudo(ONE), 'node_0009');
  assert.match(one, /\(\{\n\s+Next: \$\.next,\n\s+\} = Double_Branch\(\{\n\s+Condition: Bol_03, \/\/ Enumerations_Equal\.Result\n\s+\}\)\);\n\s+if\(\$\.next=="Yes"\)\{\n\s+return GoTo\("node_0010"\); \/\/ Set_Local_Variable\n\s+\}else\{ \/\/ =="No"\n\s+return GoTo\("node_0012"\); \/\/ Set_Local_Variable\n\s+\}$/);
  assert.doesNotMatch(one, /\bfor \(|break;|throw null/);
});
test('a branch nothing is wired to ends the case with Exit(); --optimize tests the call itself', () => {
  const opt = pseudo(ONE, '--optimize');
  assert.equal(caseOf(opt, 'node_0031'), `case 'node_0031':{ // called from 'node_0029: Set_Custom_Variable'
      if(Double_Branch({
        Condition: Bol(true),
      }).Next=="Yes"){
        return GoTo("node_0033"); // Destroy_Entity
      }else{ // =="No"
        return GoTo("node_0032"); // Print_String
      }`);
  assert.match(opt, /\.Next=="Yes"\)\{\n\s+return Exit\(\);\n\s+\}else\{ \/\/ =="No"\n\s+return Exit\(\);\n/);
  const flows = [ONE, TWO].flatMap((f) => graphs(f).flatMap((g) => g.pseudocode.cases.filter((c) => c.flow.type === 'choice').map((c) => [c.call.function, c.flow.form, c.flow.default, c.flow.terminal])));
  assert.deepEqual([...new Set(flows.map((f) => f.join(':')))].sort(), ['Double_Branch:if::false', 'Multiple_Branches:switch:pin:false', 'Two_Exclusive_Outs:if::false']);
});
test('--optimize keeps `Next` in a destructuring when the choice node has other outputs that are read', () => {
  // no node of the fixtures is such a node, so this is the rule on the data of the report: the printed outputs decide
  const opt = pseudo(ONE, '--optimize', '--all-pins');
  assert.match(opt, /if\(Double_Branch\(\{/, 'a Double Branch has no output but Next');
});

// ---- the end node of a filter graph ----------------------------------------------------------------------------------------------------------------
test('a filter graph is one expression: no switch, a const per data node, and the end node with the evaluation interval', () => {
  const text = pseudo(ONE);
  const filter = text.slice(text.indexOf("ClientGraphs['New Filter Node Graph']"));
  assert.doesNotMatch(filter, /switch|case |GoTo/);
  assert.match(filter, /Node_Graph_End_Integer\(\{\n\s+Output_Result_Integer: Int_04, \/\/ Get_Maximum_Value_From_List\.Maximum_Value\n\s+Filter_Return_Type: Enum\("Filter Return Type", "Return Integer"\), \/\/ \(default\)\n\s+\}, Flt\(0\.30\)\);\n\};/);
  assert.match(filter, /const \{\n\s+Self_Entity: Ety_01,\n\s+\} = Get_Self_Entity\("data_0005", \{\}\);/);
  const g = graphs(ONE).find((x) => x.name.name === 'New Filter Node Graph');
  assert.equal(g.pseudocode.flat, true);
  assert.equal(g.pseudocode.cases.length, 1);
  assert.equal(g.pseudocode.cases[0].kind, 'end');
  assert.ok(Math.abs(g.evaluation_interval - 0.3) < 1e-6);
  assert.deepEqual(g.pseudocode.cases[0].call.extra.value.kind, 'float');
  assert.ok(graphs(ONE).filter((x) => x.name.name !== g.name.name).every((x) => !x.pseudocode.flat));
});
test('the filter graph written with --optimize is one call', () => {
  const text = pseudo(ONE, '--optimize');
  assert.match(text.slice(text.indexOf("ClientGraphs['New Filter Node Graph']")), /^ClientGraphs\['New Filter Node Graph'\] = async function Filter_\d+\(\$,node\)\{\n  Node_Graph_End_Integer\(\{\n    Output_Result_Integer: Int\(Get_Maximum_Value_From_List\("data_0002", \{/);
});

// ---- Get Local Variable ----------------------------------------------------------------------------------------------------------------------------------
test('each Get Local Variable node has a name of its own: the same node reads as the same variable everywhere', () => {
  const one = pseudo(ONE);
  assert.equal([...one.matchAll(/Get_Local_Variable\("Var_0011", /g)].length, 3, 'node 11 in three cases');
  assert.match(one, /Get_Local_Variable\("Var_0026", /, 'node 26 is another variable');
  const expanded = JSON.parse(run(['code', TWO, '--expand', '--format', 'json'])).code[0].items.filter((x) => x.type === 'graph');
  const names = new Set(expanded.flatMap((g) => g.pseudocode.cases.flatMap((c) => [...c.data, c.call].filter((x) => x.function === 'Get_Local_Variable').map((x) => x.id))));
  assert.ok(names.size >= 2 && [...names].every((n) => n.kind === 'var' && /^(Comp_\d{4}_)*Var_\d{4}$/.test(n.name)), 'behind the instance of an expanded composite');
});

// ---- composites ------------------------------------------------------------------------------------------------------------------------------------------
/** The text of one composite definition (from its header to the closing `};`). */
const definition = (text, name) => { const start = text.indexOf(`Composite['${name}'] = `); assert.ok(start >= 0, `composite ${name}`); return text.slice(start, text.indexOf('\n};', start)); };
const RESOLUTION = 'test/cases/resolution/test_resolution.gia', NESTED = 'test/cases/composites/test_composite.gia';

test('a composite body is a function of its own: `In` lists its inputs, no node returns its data pins, a node runs the generator from there', () => {
  const two = pseudo(TWO);
  assert.match(definition(two, 'Exposed Local'), /^Composite\['Exposed Local'\] = function Composite_\d+\(\$,Comp,In = \{\n  Target_Entity: Ety,\n\},node\)\{\n  if \(!node\)\{\n    const \{\n      Value: Bol_02,\n    \} = Get_Local_Variable\(Comp \+ "_Var_0037", \{\n      Initial_Value: Bol\(true\),\n    \}\);\n\n    return \{\n      Value: Bol_02, \/\/ Get_Local_Variable\.Value\n    \};\n  \}\n  return \(async function GoTo\(node\)\{\n    switch\(node\)\{\n/);
  assert.match(definition(two, 'Exposed Local'), /\n  \}\)\(node\);$/);
  // a body that only hands out data has no generator, one that only runs flow has no `if (!node)`
  assert.doesNotMatch(definition(two, 'Simple Data'), /async function/);
  assert.doesNotMatch(definition(two, 'Linear Flow'), /if \(!node\)/);
  assert.match(definition(pseudo(TWO, '--optimize'), 'Simple Data'), /return \{\n      Value: Int\(Get_Local_Variable\(Comp \+ "_Var_0004", \{\n        Initial_Value: Int\(42\),\n      \}\)\.Value\),\n    \};/);
  // an input pin that stands for a pin of the composite is an argument of the node inside, read through `In` and forced for a native node
  assert.match(definition(two, 'Two Exclusive Outs'), /Double_Branch\(\{\n\s+Condition: In\.Condition,/);
  assert.doesNotMatch(two, /\$\.in\./);
  assert.doesNotMatch(pseudo(ONE), /\bIn\b|\bComp\b/);
  const face = graphs(TWO).find((g) => g.name.name === 'Exposed Local').pseudocode.interface;
  assert.deepEqual(face.inputs.map((p) => [p.key, p.type]), [['Target_Entity', 'Ety']]);
  assert.deepEqual(face.outputs.map((p) => [p.key, p.type]), [['Value', 'Bol']]);
});
test('a composite body is entered by the names of its flow inputs; one that leaves once returns the output, a generic one yields it', () => {
  const two = pseudo(TWO);
  const both = definition(two, 'Two In One Out');
  assert.match(both, /case 'input: 0':\n\s+case 'node_0017':\{/);
  assert.match(both, /case 'input: 1':\n\s+case 'node_0018':\{/);
  assert.match(both, /return \{ Next: "0" \};/);
  assert.doesNotMatch(both, /yield/);
  assert.match(definition(two, 'Two Exclusive Outs'), /if\(next=="Yes"\)\{\n\s+return \{ Next: "Yes" \};\n\s+\}else\{ \/\/ =="No"\n\s+return \{ Next: "No" \};/);
  // the other cases of the body are reached by `yield* GoTo`, several targets one after the other
  assert.match(definition(two, 'Calling Twice'), /yield\* GoTo\("node_0022"\); \/\/ Double_Branch\n\s+return yield\* GoTo\("node_0001"\); \/\/ Double_Branch/);
  assert.match(definition(two, 'Calling Twice'), /async function\* GoTo/);
  assert.match(definition(two, 'Calling Twice'), /case 'node_0001':\{[^]*?return yield "0";/);
  assert.doesNotMatch(definition(two, 'Calling Twice'), /\bawait GoTo|return GoTo|exit_/);
  // an event inside the body is an entry point of its own
  assert.match(definition(two, 'With Event'), /case 'event_0030':\{\n\s+\(\{\n\s+Timer_Name: \$\$\.Str_003,\n\s+\} = await When_Timer_Is_Triggered\(\{\n\s+Event: \$\.event,/);
  const targets = graphs(TWO).find((g) => g.name.name === 'Calling Twice').pseudocode.cases.flatMap((c) => c.next.flatMap((b) => b.targets)).filter((t) => t.exit);
  assert.deepEqual(targets.map((t) => [t.id, t.label, t.function]), [['exit_0', '0', null]]);
  const ports = graphs(TWO).find((g) => g.name.name === 'Two In One Out').pseudocode.cases.flatMap((c) => c.ports.map((p) => [c.id, p.label]));
  assert.deepEqual(ports, [['node_0017', '0'], ['node_0018', '1']]);
});
test('an instance of a composite keeps what its execution nodes give out: `$$` is its bucket, named by the caller', () => {
  const two = pseudo(TWO);
  const native = definition(two, 'Exposed Native');
  assert.match(native, /\)\{\n  const \$\$ = \$\[Comp\] \?\?= \{\};\n/);
  assert.match(native, /if \(!node\)\{\n    return \{\n      Consume: \$\$\.Bol_001, \/\/ Consume_Gift_Box\.Consume\n    \};/, 'a caller that only reads the pin gets what the execution node stored');
  assert.match(native, /\(\{\n\s+Consume: \$\$\.Bol_001,\n\s+\} = Consume_Gift_Box\(\{/);
  // no `$.` variable is written, `next` and `input` are variables of one run, and a body that stores nothing has no bucket
  for (const name of ['Calling Twice', 'Exposed Native', 'With Event', 'Two Exclusive Outs']) assert.doesNotMatch(definition(two, name), /(?<!\$)\$\.(?!event\b)/, name);
  assert.match(definition(two, 'Calling Twice'), /\)\{\n  let next;\n/);
  assert.doesNotMatch(definition(two, 'Calling Twice'), /\$\$/);
  assert.match(definition(two, 'With Event'), /\n  const \$\$ = \$\[Comp\] \?\?= \{\};\n  let next;\n/);
  assert.match(definition(two, 'Calling Twice'), /\} = Double_Branch\(\{\n\s+Condition: Bol\(false\),\n\s+\}\)\);\n\s+if\(next=="Yes"\)\{/);
  assert.match(definition(two, 'With Event'), /Control_Expression: \$\$\.Str_003, \/\/ When_Timer_Is_Triggered\.Timer_Name/);
  // the local variables of a node are the instance's too
  assert.match(definition(two, 'Exposed Local'), /Get_Local_Variable\(Comp \+ "_Var_0037", /);
});

// ---- a call of a composite -------------------------------------------------------------------------------------------------------------------------------
test('a composite call is written after its execution type: a call, an if / switch on Next, or a for await; a read of its data pins otherwise', () => {
  const two = pseudo(TWO);
  // a choice of two ways out: like Double Branch, `Next` of the awaited call is tested
  assert.equal(caseOf(two, 'node_0025'), `case 'node_0025':{ // called from 'node_0012: Linear_Flow'
      ({
        Next: $.next,
      } = await Composite['Two Exclusive Outs']($, "Comp_0025", {
        Condition: Bol(false),
      }, $.input));
      if($.next=="Yes"){
        $.input = "input: 0";
        return GoTo("node_0015"); // Terminal
      }else{ // =="No"
        $.input = "input: 0";
        return GoTo("node_0021"); // Two_In_One_Out
      }`);
  // one way out: just called, the output the body leaves through is in a comment; a composite that only drops the flow says so
  assert.match(caseOf(two, 'node_0012'), /await Composite\['Linear Flow'\]\(\$, "Comp_0012", \{\}, \$\.input\); \/\/ \.Next=="0"/);
  assert.match(caseOf(two, 'node_0015'), /await Composite\['Terminal'\]\(\$, "Comp_0015", \{\}, \$\.input\); \/\/ terminal\n\s+return;/);
  // a generic composite is a loop over what it yields
  assert.equal(caseOf(two, 'node_0029'), `case 'node_0029':{ // called from 'node_0021: Two_In_One_Out'
      for await ($.next of Composite['Calling Twice']($, "Comp_0029", {}, $.input)) {
        switch($.next){
          case "0":
            $.input = "input: 0";
            await GoTo("node_0036"); // With_Event
            break;
          default:
            return;
        }
      }
      return;`);
  // the last node of a chain ends in an output nothing is wired to
  assert.match(caseOf(two, 'node_0054'), /await Composite\['Exposed Computed'\]\(\$, "Comp_0054", \{\}, \$\.input\); \/\/ \.Next=="0"\n\s+return Exit\(\);$/);
  // the flow arrives through a named flow input of the composite
  assert.match(two, /\$\.input = "input: 1";\n\s+await GoTo\("node_0021"\); \/\/ Two_In_One_Out\n\s+\$\.input = "input: 0";\n\s+return GoTo\("node_0025"\);/);
  // data: the result is read in the case that needs it, and the values are forced where a native node uses them
  assert.match(caseOf(two, 'node_0034'), /const \{\n\s+Value: Bol_01,\n\s+\} = Composite\['Exposed Local'\]\(\$, "Comp_0042", \{\n\s+Target_Entity: Ety\(null\), \/\/ \(default\)\n\s+\}\);/);
  assert.match(caseOf(two, 'node_0034'), /Variable_Value: Bol_01, \/\/ Exposed_Local\.Value\n\s+Trigger_Event: Bol_01, \/\/ Exposed_Local\.Value/);
  assert.match(two, /case 'node_0036':\{ \/\/ called from 'node_0029: Calling_Twice'\n\s+for await \(\$\.next of Composite\['With Event'\]\(\$, "Comp_0036", \{\}, node === "node_0036" \? \$\.input : node\.slice\(node\.indexOf\('\.'\)\+1\)\)\)/);
  const c = graphs(TWO).find((g) => !g.composite_body).pseudocode.cases;
  assert.equal(c.find((x) => x.id === 'node_0025').kind, 'composite');
  assert.deepEqual(c.find((x) => x.id === 'node_0025').call.composite, { name: 'Two Exclusive Outs', instance: 'Comp_0025' });
  assert.deepEqual(c.find((x) => x.id === 'node_0025').call.outputs, []);
  assert.deepEqual(c.find((x) => x.id === 'node_0042').callers, [], 'nothing is wired to it');
  assert.equal(c.every((x) => x.via.length === 0), true, 'nothing is expanded');
});
test('a call node is one instance: its flow and its data pins name the same one, another call node names another', () => {
  const two = pseudo(TWO);
  const instances = (fn) => [...two.matchAll(new RegExp(`Composite\\['${fn}'\\]\\(\\$, "(Comp_\\d+)"`, 'g'))].map((m) => m[1]);
  assert.deepEqual([...new Set(instances('Exposed Local'))], ['Comp_0042'], 'node 42 runs it, node 34 reads it');
  assert.equal(instances('Exposed Local').length, 2);
  assert.deepEqual([...new Set(instances('Exposed Native'))], ['Comp_0046']);
  const all = [...two.matchAll(/Composite\['[^']+'\]\(\$, "(Comp_\d+)"/g)].map((m) => m[1]);
  assert.equal(new Set(all).size, 10, 'ten call nodes, ten instances');
  // inside a body the instances are named behind the instance of the body
  const nested = pseudo(NESTED);
  assert.match(nested, /Composite\['Create Composite Node\(1\)'\]\(\$, Comp \+ "_Comp_0007", \{\}, input\)/);
  assert.doesNotMatch(nested.slice(0, nested.indexOf('\nComposite[')), /Comp \+/);
});
test('every input a node has is given: a pin the file does not store has its default, marked `(default)`', () => {
  const plain = caseOf(pseudo(TWO), 'node_0042');
  // the pin of the composite's declaration, which the file does not store on the call node
  assert.match(plain, /Composite\['Exposed Local'\]\(\$, "Comp_0042", \{\n\s+Target_Entity: Ety\(null\), \/\/ \(default\)\n\s+\}, \$\.input\)/);
  assert.equal(pseudo(TWO, '--all-pins').includes('(no value, no wire)'), false, 'every pin has a value, so nothing is left to show');
  // the report has the same expression: a literal that nobody edited
  const call = graphs(TWO).find((g) => !g.composite_body).pseudocode.cases.find((x) => x.id === 'node_0042').call;
  assert.deepEqual(call.args.map((a) => [a.key, a.expr.kind, a.expr.value.kind, a.expr.value.set]), [['Target_Entity', 'literal', 'id', false]]);
  // a Set Custom Variable's `is_bp_var` is a pin the game hides: it is only written with --all-pins, or when it holds more than its default
  assert.doesNotMatch(caseOf(pseudo(ONE), 'node_0029'), /is_bp_var/);
  assert.match(caseOf(pseudo(ONE, '--all-pins'), 'node_0029'), /is_bp_var: Bol\(false\), \/\/ \(default\)\n\s+Trigger_Event: Bol\(false\),/);
  const hidden = graphs(ONE).flatMap((g) => g.pseudocode.cases.flatMap((c) => [...c.data, c.call].flatMap((x) => x.args.filter((a) => a.hidden).map((a) => [x.function, a.key, a.expr.value.set]))));
  assert.ok(hidden.length > 0 && hidden.every(([, , set]) => !set));
  assert.ok(hidden.some(([f, k]) => /Custom_Variable$/.test(f) && k === 'is_bp_var'));
  // pins that say nothing the node does not: a list / dictionary assembly's Count, the operator of a math / comparison node, a timer's context_GUID
  const DATA = 'test/cases/codegen/data_order.gia';
  const shown = pseudo(DATA), all = pseudo(DATA, '--all-pins');
  for (const re of [/\bCount:/, /\bop: Enum\("(Mathematical|Comparison) Operators"/, /context_GUID:/]) assert.doesNotMatch(shown, re);
  assert.match(all, /\bCount:/);
  // the zero value of a list, a dictionary and an id, and an enum's default
  assert.match(pseudo(TWO), /Applied_Stacks: Int\(0\), \/\/ \(default\)\n\s+Unit_Status_Parameter_Dictionary: Dict\(Str,Flt,\[\]\), \/\/ \(default\)/);
  assert.match(pseudo(TWO), /Removal_Reason: Enum\("Unit Status Removal Reason", "Dispelled"\), \/\/ \(default\)/);
  // only a generic pin whose type nobody chose has no value to show
  const unset = (JSON.stringify(report(TWO)).match(/"kind":"unset"/g) || []).length;
  assert.equal(unset, (pseudo(TWO).match(/: undefined, \/\/ \(default\)/g) || []).length);
  assert.ok(unset > 0);
});
test('there is no --defaults: the option is refused', () => {
  let err = '';
  const code = main(['code', ONE, '--pseudocode', '--defaults'], { out: () => {}, err: (t) => { err += t; }, isTTY: false, env: {} });
  assert.notEqual(code, 0);
  assert.match(err, /unknown option --defaults/);
});
test('values are plain without --lazy: no lazy value anywhere, with or without --expand', () => {
  for (const file of [ONE, TWO, RESOLUTION, NESTED]) for (const opts of [[], ['--optimize'], ['--expand'], ['--expand', '--optimize', '--all-pins']]) {
    const text = pseudo(file, ...opts);
    assert.doesNotMatch(text, /\blazy\b|\bunlz\b|Lazy values/, `${file} ${opts.join(' ')}`);
  }
  const plain = pseudo(RESOLUTION);
  assert.match(plain, /Composite\['Create Composite Node'\]\(\$, "Comp_\d+", \{\n\s+x: Str_\d+, \/\/ Get_Custom_Variable\.Variable_Value\n\s+\}\)/);
  assert.match(plain, /Input_1: Str_\d+, \/\/ Create_Composite_Node\.y/);
  // --optimize writes a value that is read once where it is read
  assert.match(pseudo(RESOLUTION, '--optimize'), /Input_1: Composite\['Create Composite Node'\]\(\$, "Comp_\d+", \{\n\s+x: Str\(Get_Custom_Variable\("data_\d{4}", \{[^]*?\}\)\.Variable_Value\),\n\s+\}\)\.y,/);
  // a body returns what its outputs are, and a port is read as it was given
  assert.match(definition(pseudo(TWO, '--optimize'), 'Exposed Computed'), /return \{\n\s+Result: Bol\(Greater_Than\("data_0047", \{/);
  assert.match(definition(pseudo(TWO), 'Two Exclusive Outs'), /Double_Branch\(\{\n\s+Condition: In\.Condition,/);
  // no document has a block comment any more
  assert.equal([...pseudo(TWO).matchAll(/^\/\*$/gm)].length, 0);
});
test('--lazy: lazy values only where composites are involved, with or without --expand', () => {
  const lazy = pseudo(TWO, '--lazy', '--optimize');
  // the helpers are written once, as a comment in front of the first composite
  assert.equal([...lazy.matchAll(/^function lazy\(x\) \{$/gm)].length, 1);
  assert.ok(lazy.indexOf('function lazy(x)') < lazy.indexOf("Composite['Calling Twice'] ="));
  // a composite hands out lazy outputs, a native node reads a port forced, a caller forces what a composite handed out
  assert.match(definition(lazy, 'Exposed Computed'), /Result: lazy\(\(\)=> Bol\(Greater_Than\("data_0047", \{/);
  assert.match(definition(lazy, 'Exposed Native'), /Player_Entity: unlz\(In\.Player_Entity\)/);
  assert.match(lazy, /Variable_Value: unlz\(Composite\['Simple Data'\]\(\$, "Comp_\d+", \{\}\)\.Value\)/);
  // a data node whose value goes into a composite is lazy, and so is whatever it is computed from; a native node forces what it reads
  assert.match(pseudo(RESOLUTION, '--lazy'), /const \{[^}]*\} = lazy\(\(\)=> Get_Custom_Variable\(/);
  assert.match(pseudo(RESOLUTION, '--lazy'), /x: Str_\d+, \/\/ Get_Custom_Variable\.Variable_Value/);
  // a graph with no composite in it has none of it, and nothing else is wrapped
  for (const file of [ONE]) {
    const text = pseudo(file, '--lazy');
    assert.doesNotMatch(text, /\blazy\b|\bunlz\b|Lazy values/, file);
  }
  // with --expand no call is left, but the bodies are written as functions that take and hand out lazy values
  const expanded = pseudo(TWO, '--lazy', '--expand', '--optimize');
  assert.match(definition(expanded, 'Exposed Computed'), /Result: lazy\(\(\)=> Bol\(/);
  assert.doesNotMatch(expanded.slice(0, expanded.indexOf('/*')), /\blazy\(|\bunlz\(/);
});
test('the notes of a pseudocode line are comments: (default) and (no value, no wire) are gray', () => {
  const colored = (file, ...a) => { let out = ''; main(['code', file, '--pseudocode', '--format', 'color', ...a], { out: (t) => { out += t; }, err: () => {}, isTTY: false, env: {} }); return out; };
  assert.match(colored(TWO), /\x1b\[90m\/\/\x1b\[0m \x1b\[90m\(default\)\x1b\[0m/);
  assert.match(colored('test/cases/gia/sample_7.gia', '--all-pins'), /\x1b\[90m\/\/\x1b\[0m \x1b\[90m\(no value, no wire\)\x1b\[0m/);
});
test('every call agrees with the definition it calls: the name, the inputs, the entry points and the flow outputs', () => {
  for (const file of [TWO, RESOLUTION, 'test/cases/composites/test_All_Composite.gia', NESTED]) {
    const text = pseudo(file);
    const defs = new Set([...text.matchAll(/^Composite\['(.*?)'\] = function Composite_\d+\(\$,Comp,In = \{/gm)].map((m) => m[1]));
    const calls = [...text.matchAll(/Composite\['(.*?)'\]\(\$, /g)];
    assert.ok(defs.size && calls.length, file);
    for (const [, name] of calls) assert.ok(defs.has(name), `${file}: no definition for ${name}`);
    for (const g of graphs(file)) for (const c of g.pseudocode.cases.concat(...g.pseudocode.cases.map((x) => x.data.map((d) => ({ call: d }))))) {
      const comp = c.call.composite;
      if (!comp) continue;
      const callee = graphs(file).find((x) => x.composite_body && x.name.name === comp.name);
      assert.ok(callee, `${file}: ${comp.name}`);
      const keys = new Set(callee.pseudocode.interface.inputs.map((p) => p.key));
      assert.ok(c.call.args.every((a) => keys.has(a.key)), `${comp.name}: an argument is no input of the composite`);
      assert.equal(c.call.args.length, keys.size, `${comp.name}: the report has an argument for every input`);
      if (c.kind !== 'composite') continue;
      const labels = new Set(c.next.map((b) => b.label)), yielded = new Set(callee.pseudocode.cases.flatMap((x) => x.next.flatMap((b) => b.targets.filter((t) => t.exit).map((t) => t.label))));
      for (const y of yielded) assert.ok(labels.has(y), `${comp.name} yields ${y}, the call has no branch for it`);
      for (const e of new Set(callee.pseudocode.cases.flatMap((x) => x.ports.map((p) => `input: ${p.label}`)))) assert.ok(text.includes(`case '${e}':`), e);
    }
  }
});

// ---- --expand ---------------------------------------------------------------------------------------------------------------------------------------------
test('--expand writes a composite call as the nodes of its body; the definitions are the same', () => {
  const flat = pseudo(TWO, '--expand'), calls = pseudo(TWO);
  assert.match(flat, /case 'node_0012\.node_0008':\{ \/\/ called from 'node_0005: Set_Node_Graph_Variable'/);
  assert.match(flat, /case 'node_0025\.node_0010':[^]*?Double_Branch\(\{\n\s+Condition: Bol\(false\),/);
  assert.doesNotMatch(flat.slice(0, flat.indexOf("Composite['Calling Twice'] = ")), /Composite\[/, 'no call is left in the graph');
  assert.doesNotMatch(calls, /case 'node_0012\.node_0008'/);
  const defs = (t) => t.slice(t.indexOf("Composite['Calling Twice'] = "));
  assert.equal(defs(flat), defs(calls));
  // what a composite hands out is read where the body was put
  assert.match(caseOf(flat, 'node_0005'), /\} = Get_Local_Variable\("Comp_0007_Var_0004", \{\n\s+Initial_Value: Int\(42\),\n\s+\}\);/);
  // the variables of an expanded body are the instance's: the final name is written out, where a body shown on its own puts it behind its own instance
  assert.match(caseOf(flat, 'node_0034'), /Get_Local_Variable\("Comp_0042_Var_0037", \{/);
  assert.match(definition(calls, 'Exposed Local'), /Get_Local_Variable\(Comp \+ "_Var_0037", \{/);
  // every case of an expanded body says which call it is in
  assert.match(caseOf(flat, 'node_0012.node_0008'), /\{ \/\/ called from 'node_0005: Set_Node_Graph_Variable'\n\s+\/\/ in composite Linear Flow \(node_0012\)\n/);
  assert.doesNotMatch(calls, /\/\/ in composite/);
  assert.match(pseudo(NESTED, '--expand'), /\/\/ in composite Create Composite Node \(node_0014\) > Create Composite Node\(1\) \(node_0007\)/);
  assert.match(caseOf(flat, 'node_0034'), /Variable_Value: Bol_02, \/\/ Get_Local_Variable\.Value/);
  // it decides what the report holds: the pseudocode of the JSON report, and the option the report records
  const plain = JSON.parse(run(['code', TWO, '--format', 'json'])), expanded = JSON.parse(run(['code', TWO, '--expand', '--format', 'json']));
  assert.equal(plain.header.options.expand, false);
  assert.equal(expanded.header.options.expand, true);
  const main = (r) => r.code[0].items.find((x) => x.type === 'graph' && !x.composite_body).pseudocode.cases;
  assert.ok(main(plain).every((c) => c.via.length === 0) && main(expanded).some((c) => c.via.length > 0));
  assert.ok(main(plain).some((c) => c.kind === 'composite') && main(expanded).every((c) => c.kind !== 'composite'));
  assert.notEqual(run(['code', TWO, '--expand', '--format', 'json']), run(['code', TWO, '--format', 'json']));
  // it is about the pseudocode only, and the other modes do not record it
  assert.equal(run(['code', TWO, '--expand', '--format', 'text']), run(['code', TWO, '--format', 'text']));
  assert.equal(JSON.parse(run(['dump', TWO, '--expand', '--format', 'json'])).header.options.expand, undefined);
  assert.equal(JSON.parse(run(['all', TWO, '--with-code', '--expand', '--format', 'json'])).header.options.expand, true);
});

// ---- who calls a case ------------------------------------------------------------------------------------------------------------------------------------
test('a case names the cases that send it the flow: none, one or several', () => {
  const text = pseudo(ONE);
  assert.match(text, /case 'node_0005':\{ \/\/ called from 'node_0002: Set_Custom_Variable'$/m);
  assert.match(text, /case 'node_0013':\{ \/\/ 2 callers: \['node_0010: Set_Local_Variable', 'node_0012: Set_Local_Variable'\]$/m);
  assert.match(pseudo(TWO), /case 'node_0048':\{ \/\/ no callers$/m);
  assert.doesNotMatch(text, /case 'event_0001':\{ \/\//, 'an event is not called');
  const c = graphs(ONE)[0].pseudocode.cases.find((x) => x.id === 'node_0013');
  assert.deepEqual(c.callers, [{ id: 'node_0010', function: 'Set_Local_Variable' }, { id: 'node_0012', function: 'Set_Local_Variable' }]);
});
test('in the rich page the callers are links to their cases, the plain page has no links', () => {
  const rich = run(['code', ONE, '--pseudocode', '--format', 'html']), plain = run(['code', ONE, '--pseudocode', '--format', 'htm']);
  assert.match(rich, /<a class="jsComment" href="#p0_0-c-event_0001">event_0001<\/a><span class="jsComment">: When_Entity_Is_Created&#39;<\/span>/);
  assert.match(rich, /<span class="string" id="p0_0-c-node_0002">/);
  assert.match(rich, /<a class="jsVar" href="#/);
  assert.doesNotMatch(plain, /<a |href=|\bid="p\d/);
  assert.match(plain, /<span class="jsComment">event_0001<\/span><span class="jsComment">: When_Entity_Is_Created&#39;<\/span>/);
});

// ---- events inside a composite ----------------------------------------------------------------------------------------------------------------------
const ALL = 'test/cases/composites/test_All_Composite.gia';
const allCases = (file) => graphs(file).flatMap((g) => g.pseudocode.cases.map((c) => ({ g, c })));
test('a composite with events inside is entered by them: a case label per event, and the event goes to the body as its entry point', () => {
  // no flow input: only the events enter, so the call itself is not a label
  const all = pseudo(ALL);
  assert.match(all, /^    case 'node_0001\.event_0001':\{\n      for await \(\$\.next of Composite\['Create Composite Node'\]\(\$, "Comp_0001", \{\}, node\.slice\(node\.indexOf\('\.'\)\+1\)\)\) \{/m);
  assert.doesNotMatch(all, /case 'node_0001':/);
  // a flow input too: both enter the same case, and the entry point says which
  const two = pseudo(TWO);
  assert.match(two, /case 'node_0036\.event_0030':\n    case 'node_0036':\{ \/\/ called from 'node_0029: Calling_Twice'\n/);
  assert.match(two, /\{\}, node === "node_0036" \? \$\.input : node\.slice\(node\.indexOf\('\.'\)\+1\)\)\)/);
  // the label is the id of the call and the id of the event in the body, which is a case of the body
  assert.match(definition(two, 'With Event'), /case 'event_0030':\{/);
  const withEvent = allCases(TWO).find(({ c }) => c.id === 'node_0036').c;
  assert.deepEqual(withEvent.events, ['node_0036.event_0030']);
  assert.equal(withEvent.callers.length, 1, 'a call with a flow input has its callers');
  assert.equal(allCases(ALL).find(({ c }) => c.id === 'node_0001').c.callers, null, 'a call with no flow input is an entry point, as an event is');
  // every entry names a case of the composite (a call inside it is named behind the id of its node)
  for (const file of [TWO, ALL, NESTED, RESOLUTION]) for (const { g, c } of allCases(file)) {
    if (c.kind !== 'composite') { assert.deepEqual(c.events, [], c.id); continue; }
    const callee = graphs(file).find((x) => x.composite_body && x.name.name === c.call.composite.name);
    const ids = new Set(callee.pseudocode.cases.flatMap((x) => [x.id, ...x.events]));
    for (const e of c.events) assert.ok(ids.has(e.slice(c.id.length + 1)), `${file} ${g.name.name} ${e}`);
    assert.ok(c.events.every((e) => e.startsWith(`${c.id}.`)));
  }
  // an expanded body has the same entry points as event cases of its own
  assert.match(pseudo(TWO, '--expand'), /^    case 'node_0036\.event_0030':\{\n/m);
});

// ---- the order of the cases, and what nothing reaches ------------------------------------------------------------------------------------------------
test('the cases follow the flow from each event: depth first, in the order of the pins and wires', () => {
  const ids = (file, name) => graphs(file).find((g) => g.name.name === name).pseudocode.cases.map((c) => c.id);
  // a chain with a branch: each branch is followed to its end before the next one is taken, and a join is where it is reached first
  assert.deepEqual(ids(ONE, 'New Node Graph'), ['event_0001', 'node_0002', 'node_0005', 'node_0009', 'node_0010', 'node_0013', 'node_0015', 'node_0016', 'node_0024', 'node_0029', 'node_0031', 'node_0033', 'node_0032', 'node_0012']);
  // an event of a composite that is expanded comes after the first event's cases
  const expanded = JSON.parse(run(['code', TWO, '--expand', '--format', 'json'])).code[0].items.find((x) => x.type === 'graph' && !x.composite_body).pseudocode.cases.map((c) => c.id);
  assert.ok(expanded.indexOf('node_0036.event_0030') > expanded.indexOf('node_0015.node_0013'), 'after what the first event reaches');
  assert.equal(expanded[expanded.indexOf('node_0036.event_0030') + 2], 'node_0034', 'the flow of the event goes on into the caller\'s graph');
  assert.equal(expanded[0], 'event_0001');
  // a case that is followed by the case it jumps to falls through to it
  assert.match(pseudo(ONE), /void "node_0005"; \/\/ Set_Preset_Status\n\s+\}\n\s+case 'node_0005':/);
});
test('in every graph of the fixtures, each reachable case follows one of its callers, and what is unreachable comes last', () => {
  const files = ['test/cases/gia/sample_0_main.gia', 'test/cases/gia/sample_4.gia', ONE, TWO, ALL, NESTED, RESOLUTION, 'test/cases/gil/stage_1.gil', 'test/cases/mounts/composite_folders.gil'];
  let reached = 0, unreached = 0;
  for (const file of files) for (const g of graphs(file)) {
    const cases = g.pseudocode.cases, at = new Map(cases.map((c, i) => [c.id, i]));
    const firstUnreachable = cases.findIndex((c) => c.unreachable);
    if (firstUnreachable >= 0) assert.ok(cases.slice(firstUnreachable).every((c) => c.unreachable), 'unreachable cases are last');
    cases.forEach((c, i) => {
      const entry = c.event || c.kind === 'end' || c.events.length > 0 || c.ports.length > 0;
      if (c.unreachable) { unreached++; return; }
      reached++;
      if (!entry) assert.ok(c.callers.some((k) => at.get(k.id) < i), `${g.name.name} ${c.id} follows a caller`);
    });
    // the first unreachable case has no caller when anything has none
    const un = cases.filter((c) => c.unreachable);
    if (un.length && un.some((c) => c.callers.length === 0)) assert.equal(un[0].callers.length, 0, `${g.name.name}`);
  }
  assert.ok(reached > 100 && unreached >= 4);
});
test('an unreachable case starts with `throw \'unreachable\';`, and no other case does', () => {
  const two = pseudo(TWO);
  for (const id of ['node_0042', 'node_0046', 'node_0054']) assert.match(caseOf(two, id), /^case 'node_00\d\d':\{ \/\/ [^\n]*\n      throw 'unreachable';\n/, id);
  assert.equal([...two.matchAll(/throw 'unreachable';/g)].length, 3);
  assert.deepEqual(graphs(TWO).flatMap((g) => g.pseudocode.cases.filter((c) => c.unreachable).map((c) => c.id)), ['node_0042', 'node_0046', 'node_0054']);
  // they come last, the one nothing is wired to first, and its flow is followed as an event's is
  const ids = graphs(TWO).find((g) => !g.composite_body).pseudocode.cases.map((c) => c.id);
  assert.deepEqual(ids.slice(-3), ['node_0042', 'node_0046', 'node_0054']);
  assert.equal(caseOf(two, 'node_0042').includes('// no callers'), true);
  assert.doesNotMatch(pseudo(ONE), /unreachable/);
});
test('a composite body that no reachable code enters or reads is unreachable as a whole; one a reachable case only reads is not', () => {
  // the 30 composites of the folder fixture are not called from anywhere
  const folders = pseudo('test/cases/mounts/composite_folders.gil');
  assert.equal([...folders.matchAll(/^  throw 'unreachable';$/gm)].length, 30);
  assert.match(folders, /^Composite\['01'\] = function Composite_\d+\(\$,Comp,In = \{\},node\)\{\n  throw 'unreachable';\n/m);
  assert.ok(graphs('test/cases/mounts/composite_folders.gil').filter((g) => g.composite_body).every((g) => g.pseudocode.unreachable));
  // codetest_2: its cases that call composites are partly unreachable, but every composite is used by reachable code: the flow, a data read, an event
  assert.deepEqual(graphs(TWO).filter((g) => g.pseudocode.unreachable), []);
  assert.doesNotMatch(definition(pseudo(TWO), 'Exposed Native'), /unreachable/);
  assert.doesNotMatch(definition(pseudo(TWO, '--expand'), 'Exposed Native'), /unreachable/, 'the same when the body is expanded and its output read');
  assert.equal(graphs(ONE).every((g) => g.pseudocode.unreachable === false), true);
});

// ---- codetest_3 (engine 7.2.0): what is and is not reached --------------------------------------------------------------------------------------------
const THREE = 'test/cases/codegen72/codetest_3.gia';
const casesOf = (file, graph) => graphs(file).find((g) => !g.composite_body && g.name.name === graph).pseudocode.cases;
const unreachableIds = (graph) => casesOf(THREE, graph).filter((c) => c.unreachable).map((c) => c.id).sort();
// the name a "Wrapped (Custom Variable)" call is given; in "Dead composite" call 3 has its name wired, so its value (3) stands for it
const variableOf = (c) => { const lit = (key) => c.call.args.find((a) => a.key === key)?.expr.value?.value; return lit('Variable_Name') ?? (lit('Variable_Value') == null ? null : String(lit('Variable_Value'))); };
test('a loop nothing enters is unreachable as a whole, the loop an event enters is not', () => {
  const cases = casesOf(THREE, 'Cycle with no entry');
  const named = (name) => cases.find((c) => c.call.composite && variableOf(c) === name);
  assert.equal(named('A').unreachable, false);
  assert.equal(named('B').unreachable, true);
  // the unreachable loop is a cycle with one case nothing is wired to, which is where it is started from; every case of it follows
  const un = cases.filter((c) => c.unreachable);
  assert.deepEqual(un.map((c) => c.id), ['node_0007', 'node_0016', 'node_0017', 'node_0015', 'node_0014', 'node_0013']);
  assert.deepEqual(un.map((c) => c.callers.length), [0, 2, 1, 1, 1, 1]);
  assert.deepEqual(cases.slice(0, 6).map((c) => c.unreachable), [false, false, false, false, false, false]);
  const text = pseudo(THREE);
  assert.match(text, /case 'node_0007':\{ \/\/ no callers\n      throw 'unreachable';\n/);
  assert.match(text, /case 'node_0016':\{ \/\/ 2 callers: [^\n]*\n      throw 'unreachable';\n/);
});
test('a composite call is reached by the flow or by a read of its data; its own flow is not needed for that', () => {
  const cases = casesOf(THREE, 'Dead composite');
  const state = (name) => cases.filter((c) => c.call.composite && variableOf(c) === name).map((c) => c.unreachable);
  assert.deepEqual(state('1'), [false]);
  assert.deepEqual(state('2'), [true], 'the call node is run by nothing, but node 0006 reads its Variable Value: the body is used, the case is not');
  for (const n of ['3', '4', '5']) assert.deepEqual(state(n), [true], n);
  assert.deepEqual(unreachableIds('Dead composite'), ['node_0008', 'node_0009', 'node_0010', 'node_0011', 'node_0013', 'node_0014']);
  // the data read is a data node of the reachable case, and what the unreachable case 0008 would run is the same call
  const reader = cases.find((c) => c.id === 'node_0006');
  assert.equal(reader.unreachable, false);
  assert.equal(reader.data.filter((d) => d.composite).length, 1);
});
test('a composite call with an event inside is an entry point, whatever it is wired to', () => {
  const cases = casesOf(THREE, 'Composite with event');
  const delays = cases.filter((c) => c.kind === 'composite' && c.events.length);
  assert.equal(delays.length, 4);
  assert.ok(delays.every((c) => !c.unreachable), 'all four are reached by the event inside the composite');
  assert.deepEqual(delays.map((c) => c.events), delays.map((c) => [`${c.id}.event_0001`]));
  // the one nothing is wired to has no callers to list, the others have theirs (the first is wired from the event)
  assert.deepEqual(delays.map((c) => c.callers === null), [false, false, false, true]);
  // X and Z follow a call that is reached; Y follows a call that is wired from an unreachable one only
  const wrapped = (name) => cases.find((c) => c.call.composite && variableOf(c) === name);
  assert.equal(wrapped('X').unreachable, false);
  assert.equal(wrapped('Z').unreachable, false, 'wired from a call that is an entry point, besides from a Double Branch that nothing enters');
  assert.equal(wrapped('Y').unreachable, true);
  assert.deepEqual(unreachableIds('Composite with event'), ['node_0013', 'node_0019']);
  // Z has two callers, and the unreachable one is among them: reachability does not depend on it
  assert.equal(wrapped('Z').callers.length, 2);
});
test('an event two composites deep is an entry point of the call that holds the outer composite', () => {
  const cases = casesOf(THREE, 'Nested event');
  const calls = cases.filter((c) => c.kind === 'composite');
  assert.equal(calls.length, 3);
  assert.ok(calls.every((c) => !c.unreachable));
  assert.deepEqual(calls.map((c) => c.events), calls.map((c) => [`${c.id}.node_0002.event_0001`]));
  const text = pseudo(THREE);
  assert.match(text, /case 'node_0006\.node_0002\.event_0001':\n    case 'node_0006':\{\n/, 'no callers to list: the events enter');
  assert.match(definition(text, 'Test Delay Print'), /case 'node_0002\.event_0001':\n      case 'node_0002':\{ \/\/ called from 'node_0004: Print_String'/);
  assert.match(definition(text, 'Naive execution delay'), /case 'event_0001':\{/);
  // expanded, the entry point is an event case of the graph, under the same id
  const expanded = pseudo(THREE, '--expand');
  assert.match(expanded, /case 'node_0006\.node_0002\.event_0001':\{/);
  assert.doesNotMatch(expanded, /Composite\['Test Delay Print'\]\(\$, "Comp_/);
});
test('every composite of codetest_3 is used: each is called from reachable code', () => {
  assert.deepEqual(graphs(THREE).filter((g) => g.composite_body && g.pseudocode.unreachable), []);
});
test('the 7.2.0 file decodes with the one undecoded field FORMAT.md names', () => {
  const out = run(['check', THREE]);
  assert.match(out, /engine 7\.2\.0/);
  assert.equal([...out.matchAll(/UNKNOWN FIELD/g)].length, 1);
  assert.match(out, /context_declaration #103/);
});

// ---- colors ----------------------------------------------------------------------------------------------------------------------------------------------
test('intermediates are bright red and every comment is gray, the source of a variable included', () => {
  const html = run(['code', ONE, '--pseudocode', '--format', 'htm']);
  assert.match(html, /\.jsVar\{color:#E74856\}/);
  assert.match(html, /\.jsComment\{color:#767676/);
  assert.match(html, /<span class="jsComment">Get_Self_Entity\.Self_Entity<\/span>/);
  assert.match(run(['code', ONE, '--pseudocode', '--format', 'color']), /\x1b\[91mEty_01/);
});

// ---- the all mode --------------------------------------------------------------------------------------------------------------------------------------------
test('all: the code part comes last, and takes --pseudocode and --optimize', () => {
  const text = run(['all', ONE, '--with-code', '--format', 'text']);
  const at = (h) => text.search(new RegExp(`^# ${h}$`, 'm'));
  assert.ok(at('INFO') >= 0 && at('INFO') < at('DUMP') && at('DUMP') < at('REFS') && at('REFS') < at('WARNS') && at('WARNS') < at('CODE'));
  assert.deepEqual(JSON.parse(run(['all', ONE, '--with-code', '--format', 'json'])).all, ['info', 'dump', 'refs', 'warns', 'code']);
  const pseudo_ = run(['all', ONE, '--with-code', '--pseudocode', '--optimize', '--format', 'text']);
  assert.match(pseudo_, /ServerGraphs\['New Node Graph'\] = async function/);
  assert.match(pseudo_, /Ety\(Get_Self_Entity\("data_0004", \{\}\)\.Self_Entity\)/);
  assert.ok(pseudo_.search(/^# WARNS$/m) < pseudo_.indexOf('ServerGraphs['));
});

// ---- the web page ------------------------------------------------------------------------------------------------------------------------------------------
test('the page: Rich is the first format (the default), and the All tab has --pseudocode and --optimize', async () => {
  const { readFileSync } = await import('node:fs');
  const page = readFileSync(new URL('../miliastra-search.htm', import.meta.url), 'utf8');
  assert.match(page, /const FORMATS = \[\['html', 'Rich'\], \['htm', 'Plain'\], \['json', 'Json'\]\]/);
  const all = page.slice(page.indexOf('  all: ['), page.indexOf('};', page.indexOf('  all: [')));
  assert.match(all, /opt: 'pseudocode'/);
  assert.match(all, /opt: 'optimize'/);
});

// ---- the id of a node in a call ------------------------------------------------------------------------------------------------------------------------
test('a call names its node as the editor does: `Comp_NNNN`, `Var_NNNN` and `data_NNNN` in front of the pin object, an execution node by its case', () => {
  const text = pseudo(ONE);
  assert.match(text, /Get_Self_Entity\("data_0004", \{\}\)/, 'a data node without inputs');
  assert.match(text, /Get_Owner_Entity\("data_0003", \{\n\s+Target_Entity: Ety_01,/, 'a data node with inputs');
  assert.match(text, /Get_Local_Variable\("Var_0011", \{/, 'a local variable');
  assert.doesNotMatch(text, /\}, "Var_\d+"\)/, 'the name is not behind the pins any more');
  assert.match(caseOf(text, 'node_0002'), /^\s+Set_Custom_Variable\(\{$/m, 'an execution node takes the pin object alone');
  assert.doesNotMatch(text, /(?:Set_Custom_Variable|Create_Prefab|Finite_Loop)\("(?:data|node)_/);
  const order = pseudo('test/cases/composites/composite_order.gia');
  assert.match(order, /Composite\['C1'\]\(\$, "Comp_0021", \{\}, \$\.input\)/, 'the instance is the id of the call node (node 21)');
  assert.match(order, /Composite\['C5'\]\(\$, "Comp_0026", /);
  // the report: `id` of a data node and of a variable, null for an execution node and a composite call
  const cases = graphs(ONE).flatMap((g) => g.pseudocode.cases), calls = cases.flatMap((c) => [...c.data, c.call]);
  assert.ok(cases.every((c) => c.call.id == null), 'the call of a case is an execution node or a composite call');
  assert.ok(calls.filter((x) => !cases.some((c) => c.call === x)).every((x) => x.id != null || x.composite), 'every other call has an id');
  assert.deepEqual(calls.find((x) => x.function === 'Get_Self_Entity').id.kind, 'data');
  assert.deepEqual(calls.find((x) => x.function === 'Get_Local_Variable').id, { kind: 'var', name: 'Var_0011' });
  assert.equal(calls.find((x) => x.function === 'Set_Custom_Variable').id, null);
  // expanded: behind the ids of the calls
  const expanded = pseudo(TWO, '--expand');
  assert.match(expanded, /Get_Local_Variable\("Comp_0007_Var_0004", /);
  assert.match(expanded, /Greater_Than\("node_\d{4}\.data_0047", /);
});

// ---- orphaned data nodes, constants, the explanation block --------------------------------------------------------------------------------------------------
const ORDER = 'test/cases/codegen/data_order.gia';
test('data nodes nothing reads end up in a final unreachable case: the longest chain\'s sink alone, its providers above it', () => {
  const text = pseudo(ORDER);
  const i = text.indexOf("case 'orphaned':{");
  assert.ok(i > 0);
  const body = text.slice(i);
  assert.match(body, /^case 'orphaned':\{\n\s+throw 'unreachable';/);
  assert.equal(text.slice(0, i).includes("case 'orphaned'"), false);
  // the sink of the first chain is a bare call, the nodes it needs are declared above it
  assert.match(body, /\} = _3D_Vector_Normalization\("data_0018"[^]*?\} = Split_3D_Vector\("data_0016"[^]*?\} = Sign_Operation\("data_0017"[^]*?\n\s+Take_Larger_Value\("data_0015"/);
  assert.doesNotMatch(body, /const \{[^}]*\} = Take_Larger_Value/);
  // a graph that has orphans is not flat, and the report carries them
  const orphans = graphs(ORDER).flatMap((g) => g.pseudocode.orphans || []);
  assert.ok(orphans.length >= 2 && orphans.every((c) => Array.isArray(c.data) && c.call));
  // a composite body has its own
  assert.match(text, /Composite\['Composite_data'\][^]*?case 'orphaned'/);
});
test('hidden pins: Count, the operator of a math / comparison node and a timer\'s context_GUID are left out unless --all-pins', () => {
  const shown = pseudo(ORDER), all = pseudo(ORDER, '--all-pins');
  assert.doesNotMatch(shown, /\bCount:/);
  assert.match(all, /\bCount:/);
});
test('constants: floats have two decimals at least, booleans are words, an empty entity is null; a typed dictionary says what it maps', () => {
  const all = pseudo(ORDER) + pseudo(ONE) + pseudo(TWO);
  assert.match(all, /Flt\(\d+\.\d\d\d*\)/);
  assert.doesNotMatch(all, /Flt\(\d+\.\d\)/);
  assert.doesNotMatch(all, /Bol\([01]\)|Ety\(0\)/);
  assert.match(all, /Bol\(true\)/);
  assert.match(all, /Ety\(null\)/);
  assert.match(all, /Dict\(\w+,\w+,/);
  assert.match(pseudo(ORDER), /Dict\(Any,Str,\[\]\)/);
});
test('the explanation block opens a pseudocode document, and is left out of a search; its wording is not tested', () => {
  // the explanation is for the language model's form: only --lazy writes it
  assert.equal(run(['code', ONE, '--pseudocode', '--format', 'text']).startsWith('/*'), false);
  const raw = run(['code', ONE, '--pseudocode', '--lazy', '--format', 'text']);
  assert.match(raw, /^\/\*\n[^]*?\n\*\/\n\nServerGraphs\[/);
  const found = run(['code', ONE, '--pseudocode', '--lazy', '--search', 'Print', '--format', 'text']);
  assert.equal(found.startsWith('/*'), false);
});
test('the operator enums of math, comparison, logic and type conversion nodes are left out unless --all-pins; the orphaned case has a blank line after its throw', () => {
  const all = [ORDER, ONE, TWO].map((f) => pseudo(f)).join('\n');
  assert.doesNotMatch(all, /\bop: Enum\("(Mathematical|Comparison|Logical) Operators"|\bop: Enum\("Type Conversions"/);
  assert.match(pseudo(ORDER), /case 'orphaned':\{\n\s+throw 'unreachable';\n\n/);
});
test('a dictionary learns what it maps from the pins it is wired to; a pin the database types just Dict says nothing about its types', () => {
  const one = pseudo('test/cases/codegen/codetest_1.gia', '--optimize');
  assert.match(one, /Dict\(Ety,Ety,Assembly_Dictionary\(/); // from what feeds Key_0 / Value_0
  assert.match(one, /Dict\(Any,Int,Get_Custom_Variable\(/); // the value from the list the next node makes of it, the key is not told
  // Add Unit Status's parameter dictionary: the database names what it maps (string to float)
  assert.match(pseudo('test/cases/codegen/codetest_2.gia'), /Dict\(Str,Flt,\[\]\), \/\/ \(default\)/);
});
