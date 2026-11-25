# FILE `variables_beyond.gia`

**RESOURCE** "**Default Template**" PLAYER\_TEMPLATE guid='`1086324737`'<br>
**RESOURCE** "**Custom Player Template**" PLAYER\_TEMPLATE guid='`1086324738`'<br>
**RESOURCE** "**Default Template(Edit Character)**" CHARACTER\_TEMPLATE guid='`1090519041`'<br>
**RESOURCE** "**Custom Player Template(Edit Character)**" CHARACTER\_TEMPLATE guid='`1090519042`'<br>
**RESOURCE** "**Custom Class**" CLASS guid='`1090519041`'<br>
**RESOURCE** "**Empty Model**" OBJECT guid='`1077936129`' parent=(entities: **5**)<br>
**RESOURCE** "**Basic**" CREATION guid='`1082130433`' parent=(entities: **1**)<br>
**RESOURCE** "**Complex**" CREATION guid='`1082130434`' parent=(entities: **1**)<br>
**RESOURCE** "**Same**" OBJECT\_ENTITY guid='`1077936130`' parent=(1077936129:"**Empty Model**")<br>
**RESOURCE** "**Value**" OBJECT\_ENTITY guid='`1077936131`' parent=(1077936129:"**Empty Model**")<br>
**RESOURCE** "**Type**" OBJECT\_ENTITY guid='`1077936132`' parent=(1077936129:"**Empty Model**")<br>
**RESOURCE** "**Added**" OBJECT\_ENTITY guid='`1077936134`' parent=(1077936129:"**Empty Model**")<br>
**RESOURCE** "**Removed**" OBJECT\_ENTITY guid='`1077936135`' parent=(1077936129:"**Empty Model**")<br>
**RESOURCE** "**Empty Model**" OBJECT\_ENTITY guid='`1077936136`' parent=(10005018)<br>
**RESOURCE** "**Basic**" CREATION\_ENTITY guid='`1082130436`' parent=(1082130433:"**Basic**")<br>
**RESOURCE** "**Complex**" CREATION\_ENTITY guid='`1082130438`' parent=(1082130434:"**Complex**")<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**On\_Player**' : *Str* = '`1`'<br>
**VARIABLE** Player 1086324738:"**Custom Player Template**" '**Custom\_Player**' : *Str* = '`3`'<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**On\_Character**' : *Str* = '`2`'<br>
**VARIABLE** Character 1090519042:"**Custom Player Template(Edit Character)**" '**Custom\_Character**' : *Str* = '`4`'<br>
**VARIABLE** 1077936129:"**Empty Model**" '**On\_Prefab**' : *Str* = '`10`'<br>
**VARIABLE** 1082130433:"**Basic**" '**On\_Basic**' : *Str* = '`7`'<br>
**VARIABLE** 1082130434:"**Complex**" '**On\_Complex**' : *Str* = '`8`'<br>
**VARIABLE\_CHANGE** 1077936131:"**Value**" (1077936129:"**Empty Model**") '**On\_Prefab**' edit: *Str* = '`11`'<br>
**VARIABLE\_CHANGE** 1077936132:"**Type**" (1077936129:"**Empty Model**") '**On\_Prefab**' newtype: *Int* = 0<br>
**VARIABLE\_CHANGE** 1077936134:"**Added**" (1077936129:"**Empty Model**") '**Extra**' add: *Str* = '`12`'<br>
**VARIABLE\_CHANGE** 1077936135:"**Removed**" (1077936129:"**Empty Model**") '**On\_Prefab**' delete: *Str*<br>
**VARIABLE\_CHANGE** 1077936136:"**Empty Model**" (10005018) '**On\_Entity**' add: *Str* = '`9`'<br>
**VARIABLE\_CHANGE** 1082130436:"**Basic**" (1082130433:"**Basic**") '**add**' add: *Str* = ''<br>
**VARIABLE\_CHANGE** 1082130438:"**Complex**" (1082130434:"**Complex**") '**add**' add: *Str* = ''

# FILE `variables_classic.gil`

**RESOURCE** "**Stage Entity**" GIL\_LEVEL\_ENTITY guid='`1094713345`'<br>
**RESOURCE** "**Default Template**" PLAYER\_TEMPLATE guid='`1086324737`'<br>
**RESOURCE** "**Default Template(Edit Character)**" CHARACTER\_TEMPLATE guid='`1090519041`'<br>
**RESOURCE** "**Inventory Template**" GIL\_INVENTORY\_TEMPLATE guid='`1119879169`'<br>
**RESOURCE** "**Character Camera**" CAMERA guid='`1073741825`'<br>
**RESOURCE** "**Terrain01**" TERRAIN\_ENTITY guid='`1073741825`'<br>
**RESOURCE** "**Default Layout**" INTERFACE\_LAYOUT guid='`1073741825`'<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741843`'<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741844`'<br>
**RESOURCE** "**ExclusiveEleGroupHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741845`'<br>
**RESOURCE** "**ClientUIRootHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741846`'<br>
**RESOURCE** "**ClientUIPrototypeHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741847`'<br>
**RESOURCE** "**Environment Configuration**" ENVIRONMENT\_CONFIGURATION guid='`1186988033`'<br>
**RESOURCE** "**Create Preset Point**" PRESET\_POINT guid='`1073741825`'<br>
**RESOURCE** "**Spawn Point1**" GIL\_RESPAWN\_POINT guid='`1073741825`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324737`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324738`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324739`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324740`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324741`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324742`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324743`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324744`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324745`'<br>
**RESOURCE** "**Default Template(Edit Character)**" GIL\_CHARACTER\_ENTITY guid='`1090519041`'<br>
**RESOURCE** "**Mini-Map**" UI\_CONTROL guid='`1073741826`'<br>
**RESOURCE** "**Custom Button 1**" UI\_CONTROL guid='`1073741827`'<br>
**RESOURCE** "**Custom Button 2**" UI\_CONTROL guid='`1073741828`'<br>
**RESOURCE** "**Skill Area**" UI\_CONTROL guid='`1073741829`'<br>
**RESOURCE** "**Team Information**" UI\_CONTROL guid='`1073741830`'<br>
**RESOURCE** "**Character HP Bar**" UI\_CONTROL guid='`1073741831`'<br>
**RESOURCE** "**Joystick**" UI\_CONTROL guid='`1073741832`'<br>
**RESOURCE** "**Creation HP Bar**" UI\_CONTROL guid='`1073741833`'<br>
**RESOURCE** "**Exit Button**" UI\_CONTROL guid='`1073741834`'<br>
**RESOURCE** "**Voice-Over**" UI\_CONTROL guid='`1073741835`'<br>
**RESOURCE** "**Tab**" UI\_CONTROL guid='`1073741836`'<br>
**RESOURCE** "**Chat Button**" UI\_CONTROL guid='`1073741837`'<br>
**RESOURCE** "**Network Status**" UI\_CONTROL guid='`1073741838`'<br>
**RESOURCE** "**Struggle Button**" UI\_CONTROL guid='`1073741839`'<br>
**RESOURCE** "**Elemental Sight**" UI\_CONTROL guid='`1073741840`'<br>
**RESOURCE** "**Voice Chat Button**" UI\_CONTROL guid='`1073741841`'<br>
**RESOURCE** "**Voice Chat Hint Queue**" UI\_CONTROL guid='`1073741842`'<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**On\_Stage**' : *Str* = '`0`'<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**String**' : *Dict\<Str,Str\>* = {'`1`': '`1`', '`2`': '`2`', '`3`': '`3`'}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**String\_List**' : *Dict\<Str,L\<Str\>\>* = {'`1`': \['`1.1`', '`1.2`', '`1.3`'\], '`2`': \['`2.1`', '`2.2`', '`2.3`'\], '`3`': \['`3.1`', '`3.2`', '`3.3`'\]}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Struct**' : *Dict\<Str,Struct\>* = {'`1`': struct{'`0`', 0, 0.00, false}}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Struct\_List**' : *Dict\<Str,L\<Struct\>\>* = {'`1`': \[struct{'', 0, 0.00, false}\], '`2`': \[struct{'`1`', 1, 1.00, true}, struct{'', 0, 0.00, false}\]}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**String**' : *Str* = ''<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**String\_0**' : *L\<Str\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**String\_2**' : *L\<Str\>* = \['', ''\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Integer**' : *Int* = 0<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Integer\_0**' : *L\<Int\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Integer\_2**' : *L\<Int\>* = \[0, 0\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Float**' : *Flt* = 0.00<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Float\_0**' : *L\<Flt\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Float\_2**' : *L\<Flt\>* = \[0.00, 0.00\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Boolean**' : *Bol* = false<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Boolean\_0**' : *L\<Bol\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Boolean\_2**' : *L\<Bol\>* = \[false, false\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Vector**' : *Vec* = (0, 0, 0)<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Vector\_0**' : *L\<Vec\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Vector\_2**' : *L\<Vec\>* = \[(0, 0, 0), (0, 0, 0)\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Entity**' : *Ety* = null<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Entity\_0**' : *L\<Ety\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Entity\_2**' : *L\<Ety\>* = \[null, null\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**GUID**' : *Gid* = null<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**GUID\_0**' : *L\<Gid\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**GUID\_2**' : *L\<Gid\>* = \[null, null\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Config**' : *Cfg* = null<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Config\_0**' : *L\<Cfg\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Config\_2**' : *L\<Cfg\>* = \[null, null\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Prefab**' : *Pfb* = null<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Prefab\_0**' : *L\<Pfb\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Prefab\_2**' : *L\<Pfb\>* = \[null, null\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Faction**' : *Fct* = null<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Faction\_0**' : *L\<Fct\>* = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Faction\_2**' : *L\<Fct\>* = \[null, null\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Struct**' : *Struct* struct=Struct = struct{'', 0, 0.00, false}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Struct\_0**' : *L\<Struct\>* struct=Struct = \[\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Struct\_2**' : *L\<Struct\>* struct=Struct = \[struct{'', 0, 0.00, false}, struct{'', 0, 0.00, false}\]<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**String\_Dict**' : *Dict\<Str,Str\>* = {'`1`': ''}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Integer\_Dict**' : *Dict\<Int,Str\>* = {1: ''}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**GUID\_Dict**' : *Dict\<Gid,Str\>* = {id:1: ''}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Config\_Dict**' : *Dict\<Cfg,Str\>* = {id:1: ''}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Prefab\_Dict**' : *Dict\<Pfb,Str\>* = {id:1: ''}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Faction\_Dict**' : *Dict\<Fct,Str\>* = {id:1: ''}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**Entity\_Dict**' : *Dict\<Ety,Str\>* = {}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**String**' : *Str* = '`1`'<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**String\_0**' : *L\<Str\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**String\_2**' : *L\<Str\>* = \['`1`', '`1`'\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Integer**' : *Int* = 1<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Integer\_0**' : *L\<Int\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Integer\_2**' : *L\<Int\>* = \[1, 1\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Float**' : *Flt* = 1.00<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Float\_0**' : *L\<Flt\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Float\_2**' : *L\<Flt\>* = \[1.00, 1.00\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Boolean**' : *Bol* = true<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Boolean\_0**' : *L\<Bol\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Boolean\_2**' : *L\<Bol\>* = \[true, true\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Vector**' : *Vec* = (1, 1, 1)<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Vector\_0**' : *L\<Vec\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Vector\_2**' : *L\<Vec\>* = \[(1, 1, 1), (1, 1, 1)\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Entity**' : *Ety* = null<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Entity\_0**' : *L\<Ety\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Entity\_2**' : *L\<Ety\>* = \[null, null\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**GUID**' : *Gid* = id:1<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**GUID\_0**' : *L\<Gid\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**GUID\_2**' : *L\<Gid\>* = \[id:1, id:1\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Config**' : *Cfg* = id:1<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Config\_0**' : *L\<Cfg\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Config\_2**' : *L\<Cfg\>* = \[id:1, id:1\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Prefab**' : *Pfb* = id:1<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Prefab\_0**' : *L\<Pfb\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Prefab\_2**' : *L\<Pfb\>* = \[id:1, id:1\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Faction**' : *Fct* = id:1<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Faction\_0**' : *L\<Fct\>* = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Faction\_2**' : *L\<Fct\>* = \[id:1, id:1\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Struct**' : *Struct* struct=Struct = struct{'`1`', 1, 1.00, true}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Struct\_0**' : *L\<Struct\>* struct=Struct = \[\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Struct\_2**' : *L\<Struct\>* struct=Struct = \[struct{'`1`', 1, 1.00, true}, struct{'`1`', 1, 1.00, true}\]<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**String\_Dict**' : *Dict\<Str,Str\>* = {'`1`': '`1`'}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Integer\_Dict**' : *Dict\<Int,Str\>* = {1: '`1`'}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**GUID\_Dict**' : *Dict\<Gid,Str\>* = {id:1: '`1`'}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Config\_Dict**' : *Dict\<Cfg,Str\>* = {id:1: '`1`'}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Prefab\_Dict**' : *Dict\<Pfb,Str\>* = {id:1: '`1`'}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Faction\_Dict**' : *Dict\<Fct,Str\>* = {id:1: '`1`'}<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Entity\_Dict**' : *Dict\<Ety,Str\>* = {}

# FILE `variables_graph.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH guid='`1073741825`' nodes=0<br>
**GRAPH** '*Test5*' ENTITY\_NODE\_GRAPH guid='`1073741826`' nodes=0<br>
**GRAPH** '<u>\<status\></u>*Status*' STATUS\_NODE\_GRAPH guid='`1073741827`' nodes=0<br>
**RESOURCE** "**Default Template**" PLAYER\_TEMPLATE guid='`1086324737`'<br>
MOUNT '*New Node Graph*' -\> PLAYER\_TEMPLATE "**Default Template**" player<br>
**RESOURCE** "**Default Template(Edit Character)**" CHARACTER\_TEMPLATE guid='`1090519041`'<br>
MOUNT '*New Node Graph*' -\> CHARACTER\_TEMPLATE "**Default Template(Edit Character)**" character<br>
MOUNT '*Test5*' -\> CHARACTER\_TEMPLATE "**Default Template(Edit Character)**" character<br>
**RESOURCE** "**Prefab\_no\_edits**" OBJECT guid='`1077936129`' parent=(entities: **0**)<br>
MOUNT '*New Node Graph*' -\> OBJECT "**Prefab\_no\_edits**" entity<br>
**RESOURCE** "**Prefab\_no\_graph**" OBJECT guid='`1077936130`' parent=(entities: **1**)<br>
**RESOURCE** "**Prefab\_edited**" OBJECT guid='`1077936131`' parent=(entities: **4**)<br>
MOUNT '*New Node Graph*' -\> OBJECT "**Prefab\_edited**" entity<br>
**RESOURCE** "**Entity\_no\_graph**" OBJECT\_ENTITY guid='`1077936132`' parent=(1077936131:"**Prefab\_edited**")<br>
**RESOURCE** "**Entity\_no\_edits**" OBJECT\_ENTITY guid='`1077936134`' parent=(1077936131:"**Prefab\_edited**")<br>
MOUNT '*New Node Graph*' -\> OBJECT\_ENTITY "**Entity\_no\_edits**" entity<br>
**RESOURCE** "**Prefab\_no\_graph**" OBJECT\_ENTITY guid='`1077936137`' parent=(1077936130:"**Prefab\_no\_graph**")<br>
MOUNT '*New Node Graph*' -\> OBJECT\_ENTITY "**Prefab\_no\_graph**" entity<br>
**RESOURCE** "**Prefab\_edited**" OBJECT\_ENTITY guid='`1077936138`' parent=(1077936131:"**Prefab\_edited**")<br>
MOUNT '*New Node Graph*' -\> OBJECT\_ENTITY "**Prefab\_edited**" entity<br>
**RESOURCE** "**Entity\_edited**" OBJECT\_ENTITY guid='`1077936139`' parent=(1077936131:"**Prefab\_edited**")<br>
MOUNT '*New Node Graph*' -\> OBJECT\_ENTITY "**Entity\_edited**" entity<br>
**GRAPH\_VARIABLE** '*New Node Graph*' '**String**' : *Str* (public) = '`graph`'<br>
**GRAPH\_VARIABLE** '*New Node Graph*' '**Integer**' : *Int* (public) = 0<br>
**GRAPH\_VARIABLE** '*New Node Graph*' '**Faction**' : *Fct* (public) = id:1<br>
**GRAPH\_VARIABLE** '*New Node Graph*' '**Float**' : *Flt* (public) = 2.00<br>
**GRAPH\_VARIABLE** '*New Node Graph*' '**Entity**' : *Ety* (public) = null<br>
**GRAPH\_VARIABLE** '*New Node Graph*' '**Private**' : *Bol* = true<br>
**GRAPH\_VARIABLE** '*Test5*' '**Faction**' : *Fct* (public) = null<br>
**GRAPH\_VARIABLE** '<u>\<status\></u>*Status*' '**Status**' : *Dict\<Str,Str\>* = {'`Status`': '`Status`'}<br>
**VARIABLE** Player 1086324737:"**Default Template**" '**String**' {'*New Node Graph*'} : *Str* = '`player`'<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Faction**' {'*New Node Graph*'} : *Fct* = id:5<br>
**VARIABLE** Character 1090519041:"**Default Template(Edit Character)**" '**Faction**' {'*Test5*'} : *Fct* = id:5<br>
**VARIABLE** 1077936131:"**Prefab\_edited**" '**String**' {'*New Node Graph*'} : *Str* = '`prefab`'<br>
**VARIABLE** 1077936131:"**Prefab\_edited**" '**Integer**' {'*New Node Graph*'} : *Int* = 10<br>
**VARIABLE** 1077936131:"**Prefab\_edited**" '**Faction**' {'*New Node Graph*'} : *Fct* = null<br>
**VARIABLE** 1077936131:"**Prefab\_edited**" '**Float**' {'*New Node Graph*'} : *Flt* = 20.00<br>
**VARIABLE\_CHANGE** 1077936138:"**Prefab\_edited**" (1077936131:"**Prefab\_edited**") '**String**' {'*New Node Graph*'} edit: *Str* = '`graph`'<br>
**VARIABLE\_CHANGE** 1077936138:"**Prefab\_edited**" (1077936131:"**Prefab\_edited**") '**Integer**' {'*New Node Graph*'} edit: *Int* = 0<br>
**VARIABLE\_CHANGE** 1077936138:"**Prefab\_edited**" (1077936131:"**Prefab\_edited**") '**Faction**' {'*New Node Graph*'} edit: *Fct* = id:1<br>
**VARIABLE\_CHANGE** 1077936138:"**Prefab\_edited**" (1077936131:"**Prefab\_edited**") '**Float**' {'*New Node Graph*'} edit: *Flt* = 2.00<br>
**VARIABLE\_CHANGE** 1077936139:"**Entity\_edited**" (1077936131:"**Prefab\_edited**") '**String**' {'*New Node Graph*'} edit: *Str* = '`entity`'<br>
**VARIABLE\_CHANGE** 1077936139:"**Entity\_edited**" (1077936131:"**Prefab\_edited**") '**Integer**' {'*New Node Graph*'} edit: *Int* = 100<br>
**VARIABLE\_CHANGE** 1077936139:"**Entity\_edited**" (1077936131:"**Prefab\_edited**") '**Faction**' {'*New Node Graph*'} edit: *Fct* = id:200<br>
**VARIABLE\_CHANGE** 1077936139:"**Entity\_edited**" (1077936131:"**Prefab\_edited**") '**Float**' {'*New Node Graph*'} edit: *Flt* = 0.00

# FILE `variables_ref.gil`

**RESOURCE** "**Stage Entity**" GIL\_LEVEL\_ENTITY guid='`1094713345`'<br>
**RESOURCE** "**Default Template**" PLAYER\_TEMPLATE guid='`1086324737`'<br>
**RESOURCE** "**Default Template(Edit Character)**" CHARACTER\_TEMPLATE guid='`1090519041`'<br>
**RESOURCE** "**Custom Class**" CLASS guid='`1090519041`'<br>
**RESOURCE** "**Inventory Template**" GIL\_INVENTORY\_TEMPLATE guid='`1119879169`'<br>
**RESOURCE** "**Custom Camera**" CAMERA guid='`1073741825`'<br>
**RESOURCE** /(default)/"**Empty Model**" OBJECT guid='`1077936129`' parent=(entities: **0**)<br>
**RESOURCE** "**Terrain01**" TERRAIN\_ENTITY guid='`1073741825`'<br>
**RESOURCE** "**Default Layout**" INTERFACE\_LAYOUT guid='`1073741825`'<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741840`'<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741841`'<br>
**RESOURCE** "**ExclusiveEleGroupHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741842`'<br>
**RESOURCE** "**ClientUIRootHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741843`'<br>
**RESOURCE** "**ClientUIPrototypeHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741844`'<br>
**RESOURCE** "**Environment Configuration**" ENVIRONMENT\_CONFIGURATION guid='`1186988033`'<br>
**RESOURCE** "**Create Preset Point**" PRESET\_POINT guid='`1073741825`'<br>
**RESOURCE** "**Spawn Point1**" GIL\_RESPAWN\_POINT guid='`1073741825`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324737`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324738`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324739`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324740`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324741`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324742`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324743`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324744`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324745`'<br>
**RESOURCE** "**Default Template(Edit Character)**" GIL\_CHARACTER\_ENTITY guid='`1090519041`'<br>
**RESOURCE** "**Custom Growth Curve**" GIL\_GROWTH\_CURVE guid='`1094713345`'<br>
**RESOURCE** "**Mini-Map**" UI\_CONTROL guid='`1073741826`'<br>
**RESOURCE** "**Skill Area**" UI\_CONTROL guid='`1073741827`'<br>
**RESOURCE** "**Team Information**" UI\_CONTROL guid='`1073741828`'<br>
**RESOURCE** "**Character HP Bar**" UI\_CONTROL guid='`1073741829`'<br>
**RESOURCE** "**Joystick**" UI\_CONTROL guid='`1073741830`'<br>
**RESOURCE** "**Creation HP Bar**" UI\_CONTROL guid='`1073741831`'<br>
**RESOURCE** "**Exit Button**" UI\_CONTROL guid='`1073741832`'<br>
**RESOURCE** "**Voice-Over**" UI\_CONTROL guid='`1073741833`'<br>
**RESOURCE** "**Tab**" UI\_CONTROL guid='`1073741834`'<br>
**RESOURCE** "**Chat Button**" UI\_CONTROL guid='`1073741835`'<br>
**RESOURCE** "**Network Status**" UI\_CONTROL guid='`1073741836`'<br>
**RESOURCE** "**Struggle Button**" UI\_CONTROL guid='`1073741837`'<br>
**RESOURCE** "**Voice Chat Button**" UI\_CONTROL guid='`1073741838`'<br>
**RESOURCE** "**Voice Chat Hint Queue**" UI\_CONTROL guid='`1073741839`'<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Sky**' : *Int* = 1186988033 {ENVIRONMENT\_CONFIGURATION:"**Environment Configuration**"}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**UI**' : *Int* = 1073741825 {INTERFACE\_LAYOUT:"**Default Layout**"}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**List**' : *L\<Int\>* = \[1186988033 {ENVIRONMENT\_CONFIGURATION:"**Environment Configuration**"}, 1073741825 {INTERFACE\_LAYOUT:"**Default Layout**"}\]<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**GUID**' : *Gid* = id:1094713345 {GIL\_LEVEL\_ENTITY:"**Stage Entity**"}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Config**' : *Cfg* = id:1090519041 {CLASS:"**Custom Class**"}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Prefab**' : *Pfb* = id:1077936129 {OBJECT:"**Empty Model**"}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Dict**' : *Dict\<Gid,Pfb\>* = {id:1094713345 {GIL\_LEVEL\_ENTITY:"**Stage Entity**"}: id:1077936129 {OBJECT:"**Empty Model**"}}<br>
**VARIABLE** Stage 1094713345:"**Stage Entity**" '**Entity**' : *Ety* = null
