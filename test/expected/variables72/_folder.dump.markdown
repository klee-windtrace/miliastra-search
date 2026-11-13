# File `variables_beyond.gia`

## Resources (16)

| Name | Class | Guid | Parent |
| --- | --- | --- | --- |
| "**Default Template**" | PLAYER\_TEMPLATE | '`1086324737`' |   |
| "**Custom Player Template**" | PLAYER\_TEMPLATE | '`1086324738`' |   |
| "**Default Template(Edit Character)**" | CHARACTER\_TEMPLATE | '`1090519041`' |   |
| "**Custom Player Template(Edit Character)**" | CHARACTER\_TEMPLATE | '`1090519042`' |   |
| "**Custom Class**" | CLASS | '`1090519041`' |   |
| "**Empty Model**" | OBJECT | '`1077936129`' | (entities: **5**) |
| "**Basic**" | CREATION | '`1082130433`' | (entities: **1**) |
| "**Complex**" | CREATION | '`1082130434`' | (entities: **1**) |
| "**Same**" | OBJECT\_ENTITY | '`1077936130`' | (1077936129:"**Empty Model**") |
| "**Value**" | OBJECT\_ENTITY | '`1077936131`' | (1077936129:"**Empty Model**") |
| "**Type**" | OBJECT\_ENTITY | '`1077936132`' | (1077936129:"**Empty Model**") |
| "**Added**" | OBJECT\_ENTITY | '`1077936134`' | (1077936129:"**Empty Model**") |
| "**Removed**" | OBJECT\_ENTITY | '`1077936135`' | (1077936129:"**Empty Model**") |
| "**Empty Model**" | OBJECT\_ENTITY | '`1077936136`' | (10005018) |
| "**Basic**" | CREATION\_ENTITY | '`1082130436`' | (1082130433:"**Basic**") |
| "**Complex**" | CREATION\_ENTITY | '`1082130438`' | (1082130434:"**Complex**") |

## Variables

| Prefab | Variable | Type | Value |
| --- | --- | --- | --- |
| Player 1086324737:"**Default Template**" | '**On\_Player**' | *Str* | '`1`' |
| Player 1086324738:"**Custom Player Template**" | '**Custom\_Player**' | *Str* | '`3`' |
| Character 1090519041:"**Default Template(Edit Character)**" | '**On\_Character**' | *Str* | '`2`' |
| Character 1090519042:"**Custom Player Template(Edit Character)**" | '**Custom\_Character**' | *Str* | '`4`' |
| 1077936129:"**Empty Model**" | '**On\_Prefab**' | *Str* | '`10`' |
| 1082130433:"**Basic**" | '**On\_Basic**' | *Str* | '`7`' |
| 1082130434:"**Complex**" | '**On\_Complex**' | *Str* | '`8`' |

| Entity | Prefab | Variable | Change | Value |
| --- | --- | --- | --- | --- |
| 1077936131:"**Value**" | (1077936129:"**Empty Model**") | '**On\_Prefab**' | edit: *Str* | '`11`' |
| 1077936132:"**Type**" | (1077936129:"**Empty Model**") | '**On\_Prefab**' | newtype: *Int* | 0 |
| 1077936134:"**Added**" | (1077936129:"**Empty Model**") | '**Extra**' | add: *Str* | '`12`' |
| 1077936135:"**Removed**" | (1077936129:"**Empty Model**") | '**On\_Prefab**' | delete: *Str* |   |
| 1077936136:"**Empty Model**" | (10005018) | '**On\_Entity**' | add: *Str* | '`9`' |
| 1082130436:"**Basic**" | (1082130433:"**Basic**") | '**add**' | add: *Str* | '' |
| 1082130438:"**Complex**" | (1082130434:"**Complex**") | '**add**' | add: *Str* | '' |

# File `variables_classic.gil`

## Resources (42)

| Name | Class | Guid |
| --- | --- | --- |
| "**Stage Entity**" | GIL\_LEVEL\_ENTITY | '`1094713345`' |
| "**Default Template**" | PLAYER\_TEMPLATE | '`1086324737`' |
| "**Default Template(Edit Character)**" | CHARACTER\_TEMPLATE | '`1090519041`' |
| "**Inventory Template**" | GIL\_INVENTORY\_TEMPLATE | '`1119879169`' |
| "**Character Camera**" | CAMERA | '`1073741825`' |
| "**Terrain01**" | TERRAIN\_ENTITY | '`1073741825`' |
| "**Default Layout**" | INTERFACE\_LAYOUT | '`1073741825`' |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741843`' |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741844`' |
| "**ExclusiveEleGroupHierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741845`' |
| "**ClientUIRootHierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741846`' |
| "**ClientUIPrototypeHierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741847`' |
| "**Environment Configuration**" | ENVIRONMENT\_CONFIGURATION | '`1186988033`' |
| "**Create Preset Point**" | PRESET\_POINT | '`1073741825`' |
| "**Spawn Point1**" | GIL\_RESPAWN\_POINT | '`1073741825`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324737`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324738`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324739`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324740`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324741`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324742`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324743`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324744`' |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324745`' |
| "**Default Template(Edit Character)**" | GIL\_CHARACTER\_ENTITY | '`1090519041`' |
| "**Mini-Map**" | UI\_CONTROL | '`1073741826`' |
| "**Custom Button 1**" | UI\_CONTROL | '`1073741827`' |
| "**Custom Button 2**" | UI\_CONTROL | '`1073741828`' |
| "**Skill Area**" | UI\_CONTROL | '`1073741829`' |
| "**Team Information**" | UI\_CONTROL | '`1073741830`' |
| "**Character HP Bar**" | UI\_CONTROL | '`1073741831`' |
| "**Joystick**" | UI\_CONTROL | '`1073741832`' |
| "**Creation HP Bar**" | UI\_CONTROL | '`1073741833`' |
| "**Exit Button**" | UI\_CONTROL | '`1073741834`' |
| "**Voice-Over**" | UI\_CONTROL | '`1073741835`' |
| "**Tab**" | UI\_CONTROL | '`1073741836`' |
| "**Chat Button**" | UI\_CONTROL | '`1073741837`' |
| "**Network Status**" | UI\_CONTROL | '`1073741838`' |
| "**Struggle Button**" | UI\_CONTROL | '`1073741839`' |
| "**Elemental Sight**" | UI\_CONTROL | '`1073741840`' |
| "**Voice Chat Button**" | UI\_CONTROL | '`1073741841`' |
| "**Voice Chat Hint Queue**" | UI\_CONTROL | '`1073741842`' |

## Variables

| Prefab | Variable | Type | Value |
| --- | --- | --- | --- |
| Stage 1094713345:"**Stage Entity**" | '**On\_Stage**' | *Str* | '`0`' |
| Stage 1094713345:"**Stage Entity**" | '**String**' | *Dict\<Str,Str\>* | {'`1`': '`1`', '`2`': '`2`', '`3`': '`3`'} |
| Stage 1094713345:"**Stage Entity**" | '**String\_List**' | *Dict\<Str,L\<Str\>\>* | {'`1`': \['`1.1`', '`1.2`', '`1.3`'\], '`2`': \['`2.1`', '`2.2`', '`2.3`'\], '`3`': \['`3.1`', '`3.2`', '`3.3`'\]} |
| Stage 1094713345:"**Stage Entity**" | '**Struct**' | *Dict\<Str,Struct\>* | {'`1`': struct{'`0`', 0, 0, No}} |
| Stage 1094713345:"**Stage Entity**" | '**Struct\_List**' | *Dict\<Str,L\<Struct\>\>* | {'`1`': \[struct{'', 0, 0, No}\], '`2`': \[struct{'`1`', 1, 1, Yes}, struct{'', 0, 0, No}\]} |
| Player 1086324737:"**Default Template**" | '**String**' | *Str* | '' |
| Player 1086324737:"**Default Template**" | '**String\_0**' | *L\<Str\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**String\_2**' | *L\<Str\>* | \['', ''\] |
| Player 1086324737:"**Default Template**" | '**Integer**' | *Int* | 0 |
| Player 1086324737:"**Default Template**" | '**Integer\_0**' | *L\<Int\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Integer\_2**' | *L\<Int\>* | \[0, 0\] |
| Player 1086324737:"**Default Template**" | '**Float**' | *Flt* | 0 |
| Player 1086324737:"**Default Template**" | '**Float\_0**' | *L\<Flt\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Float\_2**' | *L\<Flt\>* | \[0, 0\] |
| Player 1086324737:"**Default Template**" | '**Boolean**' | *Bol* | No |
| Player 1086324737:"**Default Template**" | '**Boolean\_0**' | *L\<Bol\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Boolean\_2**' | *L\<Bol\>* | \[No, No\] |
| Player 1086324737:"**Default Template**" | '**Vector**' | *Vec* | (0, 0, 0) |
| Player 1086324737:"**Default Template**" | '**Vector\_0**' | *L\<Vec\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Vector\_2**' | *L\<Vec\>* | \[(0, 0, 0), (0, 0, 0)\] |
| Player 1086324737:"**Default Template**" | '**Entity**' | *Ety* | id:0 |
| Player 1086324737:"**Default Template**" | '**Entity\_0**' | *L\<Ety\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Entity\_2**' | *L\<Ety\>* | \[id:0, id:0\] |
| Player 1086324737:"**Default Template**" | '**GUID**' | *Gid* | id:0 |
| Player 1086324737:"**Default Template**" | '**GUID\_0**' | *L\<Gid\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**GUID\_2**' | *L\<Gid\>* | \[id:0, id:0\] |
| Player 1086324737:"**Default Template**" | '**Config**' | *Cfg* | id:0 |
| Player 1086324737:"**Default Template**" | '**Config\_0**' | *L\<Cfg\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Config\_2**' | *L\<Cfg\>* | \[id:0, id:0\] |
| Player 1086324737:"**Default Template**" | '**Prefab**' | *Pfb* | id:0 |
| Player 1086324737:"**Default Template**" | '**Prefab\_0**' | *L\<Pfb\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Prefab\_2**' | *L\<Pfb\>* | \[id:0, id:0\] |
| Player 1086324737:"**Default Template**" | '**Faction**' | *Fct* | id:0 |
| Player 1086324737:"**Default Template**" | '**Faction\_0**' | *L\<Fct\>* | \[\] |
| Player 1086324737:"**Default Template**" | '**Faction\_2**' | *L\<Fct\>* | \[id:0, id:0\] |
| Player 1086324737:"**Default Template**" | '**Struct**' | *Struct* struct=Struct | struct{'', 0, 0, No} |
| Player 1086324737:"**Default Template**" | '**Struct\_0**' | *L\<Struct\>* struct=Struct | \[\] |
| Player 1086324737:"**Default Template**" | '**Struct\_2**' | *L\<Struct\>* struct=Struct | \[struct{'', 0, 0, No}, struct{'', 0, 0, No}\] |
| Player 1086324737:"**Default Template**" | '**String\_Dict**' | *Dict\<Str,Str\>* | {'`1`': ''} |
| Player 1086324737:"**Default Template**" | '**Integer\_Dict**' | *Dict\<Int,Str\>* | {1: ''} |
| Player 1086324737:"**Default Template**" | '**GUID\_Dict**' | *Dict\<Gid,Str\>* | {id:1: ''} |
| Player 1086324737:"**Default Template**" | '**Config\_Dict**' | *Dict\<Cfg,Str\>* | {id:1: ''} |
| Player 1086324737:"**Default Template**" | '**Prefab\_Dict**' | *Dict\<Pfb,Str\>* | {id:1: ''} |
| Player 1086324737:"**Default Template**" | '**Faction\_Dict**' | *Dict\<Fct,Str\>* | {id:1: ''} |
| Player 1086324737:"**Default Template**" | '**Entity\_Dict**' | *Dict\<Ety,Str\>* | {} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**String**' | *Str* | '`1`' |
| Character 1090519041:"**Default Template(Edit Character)**" | '**String\_0**' | *L\<Str\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**String\_2**' | *L\<Str\>* | \['`1`', '`1`'\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Integer**' | *Int* | 1 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Integer\_0**' | *L\<Int\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Integer\_2**' | *L\<Int\>* | \[1, 1\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Float**' | *Flt* | 1 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Float\_0**' | *L\<Flt\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Float\_2**' | *L\<Flt\>* | \[1, 1\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Boolean**' | *Bol* | Yes |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Boolean\_0**' | *L\<Bol\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Boolean\_2**' | *L\<Bol\>* | \[Yes, Yes\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Vector**' | *Vec* | (1, 1, 1) |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Vector\_0**' | *L\<Vec\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Vector\_2**' | *L\<Vec\>* | \[(1, 1, 1), (1, 1, 1)\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Entity**' | *Ety* | id:0 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Entity\_0**' | *L\<Ety\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Entity\_2**' | *L\<Ety\>* | \[id:0, id:0\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**GUID**' | *Gid* | id:1 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**GUID\_0**' | *L\<Gid\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**GUID\_2**' | *L\<Gid\>* | \[id:1, id:1\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Config**' | *Cfg* | id:1 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Config\_0**' | *L\<Cfg\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Config\_2**' | *L\<Cfg\>* | \[id:1, id:1\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Prefab**' | *Pfb* | id:1 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Prefab\_0**' | *L\<Pfb\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Prefab\_2**' | *L\<Pfb\>* | \[id:1, id:1\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Faction**' | *Fct* | id:1 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Faction\_0**' | *L\<Fct\>* | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Faction\_2**' | *L\<Fct\>* | \[id:1, id:1\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Struct**' | *Struct* struct=Struct | struct{'`1`', 1, 1, Yes} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Struct\_0**' | *L\<Struct\>* struct=Struct | \[\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Struct\_2**' | *L\<Struct\>* struct=Struct | \[struct{'`1`', 1, 1, Yes}, struct{'`1`', 1, 1, Yes}\] |
| Character 1090519041:"**Default Template(Edit Character)**" | '**String\_Dict**' | *Dict\<Str,Str\>* | {'`1`': '`1`'} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Integer\_Dict**' | *Dict\<Int,Str\>* | {1: '`1`'} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**GUID\_Dict**' | *Dict\<Gid,Str\>* | {id:1: '`1`'} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Config\_Dict**' | *Dict\<Cfg,Str\>* | {id:1: '`1`'} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Prefab\_Dict**' | *Dict\<Pfb,Str\>* | {id:1: '`1`'} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Faction\_Dict**' | *Dict\<Fct,Str\>* | {id:1: '`1`'} |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Entity\_Dict**' | *Dict\<Ety,Str\>* | {} |

# File `variables_graph.gia`

## Graphs (3)

| Name | Class | Guid | Nodes |
| --- | --- | --- | ---: |
| '*New Node Graph*' | ENTITY\_NODE\_GRAPH | '`1073741825`' | **0** |
| '*Test5*' | ENTITY\_NODE\_GRAPH | '`1073741826`' | **0** |
| '<u>\<status\></u>*Status*' | STATUS\_NODE\_GRAPH | '`1073741827`' | **0** |

## Resources (10)

| Name | Class | Guid | Parent | Mounted graphs |
| --- | --- | --- | --- | --- |
| "**Default Template**" | PLAYER\_TEMPLATE | '`1086324737`' |   | player: '*New Node Graph*' |
| "**Default Template(Edit Character)**" | CHARACTER\_TEMPLATE | '`1090519041`' |   | character: '*New Node Graph*'<br>character: '*Test5*' |
| "**Prefab\_no\_edits**" | OBJECT | '`1077936129`' | (entities: **0**) | entity: '*New Node Graph*' |
| "**Prefab\_no\_graph**" | OBJECT | '`1077936130`' | (entities: **1**) |   |
| "**Prefab\_edited**" | OBJECT | '`1077936131`' | (entities: **4**) | entity: '*New Node Graph*' |
| "**Entity\_no\_graph**" | OBJECT\_ENTITY | '`1077936132`' | (1077936131:"**Prefab\_edited**") |   |
| "**Entity\_no\_edits**" | OBJECT\_ENTITY | '`1077936134`' | (1077936131:"**Prefab\_edited**") | entity: '*New Node Graph*' |
| "**Prefab\_no\_graph**" | OBJECT\_ENTITY | '`1077936137`' | (1077936130:"**Prefab\_no\_graph**") | entity: '*New Node Graph*' |
| "**Prefab\_edited**" | OBJECT\_ENTITY | '`1077936138`' | (1077936131:"**Prefab\_edited**") | entity: '*New Node Graph*' |
| "**Entity\_edited**" | OBJECT\_ENTITY | '`1077936139`' | (1077936131:"**Prefab\_edited**") | entity: '*New Node Graph*' |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '*New Node Graph*' | '**String**' | *Str* (public) | '`graph`' |
| '*New Node Graph*' | '**Integer**' | *Int* (public) | 0 |
| '*New Node Graph*' | '**Faction**' | *Fct* (public) | id:1 |
| '*New Node Graph*' | '**Float**' | *Flt* (public) | 2 |
| '*New Node Graph*' | '**Entity**' | *Ety* (public) | id:0 |
| '*New Node Graph*' | '**Private**' | *Bol* | Yes |
| '*Test5*' | '**Faction**' | *Fct* (public) | id:0 |
| '<u>\<status\></u>*Status*' | '**Status**' | *Dict\<Str,Str\>* | {'`Status`': '`Status`'} |

| Prefab | Variable | Type | Value |
| --- | --- | --- | --- |
| Player 1086324737:"**Default Template**" | '**String**' {'*New Node Graph*'} | *Str* | '`player`' |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Faction**' {'*New Node Graph*'} | *Fct* | id:5 |
| Character 1090519041:"**Default Template(Edit Character)**" | '**Faction**' {'*Test5*'} | *Fct* | id:5 |
| 1077936131:"**Prefab\_edited**" | '**String**' {'*New Node Graph*'} | *Str* | '`prefab`' |
| 1077936131:"**Prefab\_edited**" | '**Integer**' {'*New Node Graph*'} | *Int* | 10 |
| 1077936131:"**Prefab\_edited**" | '**Faction**' {'*New Node Graph*'} | *Fct* | id:0 |
| 1077936131:"**Prefab\_edited**" | '**Float**' {'*New Node Graph*'} | *Flt* | 20 |

| Entity | Prefab | Variable | Change | Value |
| --- | --- | --- | --- | --- |
| 1077936138:"**Prefab\_edited**" | (1077936131:"**Prefab\_edited**") | '**String**' {'*New Node Graph*'} | edit: *Str* | '`graph`' |
| 1077936138:"**Prefab\_edited**" | (1077936131:"**Prefab\_edited**") | '**Integer**' {'*New Node Graph*'} | edit: *Int* | 0 |
| 1077936138:"**Prefab\_edited**" | (1077936131:"**Prefab\_edited**") | '**Faction**' {'*New Node Graph*'} | edit: *Fct* | id:1 |
| 1077936138:"**Prefab\_edited**" | (1077936131:"**Prefab\_edited**") | '**Float**' {'*New Node Graph*'} | edit: *Flt* | 2 |
| 1077936139:"**Entity\_edited**" | (1077936131:"**Prefab\_edited**") | '**String**' {'*New Node Graph*'} | edit: *Str* | '`entity`' |
| 1077936139:"**Entity\_edited**" | (1077936131:"**Prefab\_edited**") | '**Integer**' {'*New Node Graph*'} | edit: *Int* | 100 |
| 1077936139:"**Entity\_edited**" | (1077936131:"**Prefab\_edited**") | '**Faction**' {'*New Node Graph*'} | edit: *Fct* | id:200 |
| 1077936139:"**Entity\_edited**" | (1077936131:"**Prefab\_edited**") | '**Float**' {'*New Node Graph*'} | edit: *Flt* | 0 |

# File `variables_ref.gil`

## Resources (42)

| Name | Class | Guid | Parent | Folder |
| --- | --- | --- | --- | --- |
| "**Stage Entity**" | GIL\_LEVEL\_ENTITY | '`1094713345`' |   |   |
| "**Default Template**" | PLAYER\_TEMPLATE | '`1086324737`' |   |   |
| "**Default Template(Edit Character)**" | CHARACTER\_TEMPLATE | '`1090519041`' |   |   |
| "**Custom Class**" | CLASS | '`1090519041`' |   |   |
| "**Inventory Template**" | GIL\_INVENTORY\_TEMPLATE | '`1119879169`' |   |   |
| "**Custom Camera**" | CAMERA | '`1073741825`' |   |   |
| "**Empty Model**" | OBJECT | '`1077936129`' | (entities: **0**) | /(default)/ |
| "**Terrain01**" | TERRAIN\_ENTITY | '`1073741825`' |   |   |
| "**Default Layout**" | INTERFACE\_LAYOUT | '`1073741825`' |   |   |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741840`' |   |   |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741841`' |   |   |
| "**ExclusiveEleGroupHierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741842`' |   |   |
| "**ClientUIRootHierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741843`' |   |   |
| "**ClientUIPrototypeHierarchyRoot**" | INTERFACE\_LAYOUT | '`1073741844`' |   |   |
| "**Environment Configuration**" | ENVIRONMENT\_CONFIGURATION | '`1186988033`' |   |   |
| "**Create Preset Point**" | PRESET\_POINT | '`1073741825`' |   |   |
| "**Spawn Point1**" | GIL\_RESPAWN\_POINT | '`1073741825`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324737`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324738`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324739`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324740`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324741`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324742`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324743`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324744`' |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | '`1086324745`' |   |   |
| "**Default Template(Edit Character)**" | GIL\_CHARACTER\_ENTITY | '`1090519041`' |   |   |
| "**Custom Growth Curve**" | GIL\_GROWTH\_CURVE | '`1094713345`' |   |   |
| "**Mini-Map**" | UI\_CONTROL | '`1073741826`' |   |   |
| "**Skill Area**" | UI\_CONTROL | '`1073741827`' |   |   |
| "**Team Information**" | UI\_CONTROL | '`1073741828`' |   |   |
| "**Character HP Bar**" | UI\_CONTROL | '`1073741829`' |   |   |
| "**Joystick**" | UI\_CONTROL | '`1073741830`' |   |   |
| "**Creation HP Bar**" | UI\_CONTROL | '`1073741831`' |   |   |
| "**Exit Button**" | UI\_CONTROL | '`1073741832`' |   |   |
| "**Voice-Over**" | UI\_CONTROL | '`1073741833`' |   |   |
| "**Tab**" | UI\_CONTROL | '`1073741834`' |   |   |
| "**Chat Button**" | UI\_CONTROL | '`1073741835`' |   |   |
| "**Network Status**" | UI\_CONTROL | '`1073741836`' |   |   |
| "**Struggle Button**" | UI\_CONTROL | '`1073741837`' |   |   |
| "**Voice Chat Button**" | UI\_CONTROL | '`1073741838`' |   |   |
| "**Voice Chat Hint Queue**" | UI\_CONTROL | '`1073741839`' |   |   |

## Variables

| Prefab | Variable | Type | Value |
| --- | --- | --- | --- |
| Stage 1094713345:"**Stage Entity**" | '**Sky**' | *Int* | 1186988033 {ENVIRONMENT\_CONFIGURATION:"**Environment Configuration**"} |
| Stage 1094713345:"**Stage Entity**" | '**UI**' | *Int* | 1073741825 {INTERFACE\_LAYOUT:"**Default Layout**"} |
| Stage 1094713345:"**Stage Entity**" | '**List**' | *L\<Int\>* | \[1186988033 {ENVIRONMENT\_CONFIGURATION:"**Environment Configuration**"}, 1073741825 {INTERFACE\_LAYOUT:"**Default Layout**"}\] |
| Stage 1094713345:"**Stage Entity**" | '**GUID**' | *Gid* | id:1094713345 {GIL\_LEVEL\_ENTITY:"**Stage Entity**"} |
| Stage 1094713345:"**Stage Entity**" | '**Config**' | *Cfg* | id:1090519041 {CLASS:"**Custom Class**"} |
| Stage 1094713345:"**Stage Entity**" | '**Prefab**' | *Pfb* | id:1077936129 {OBJECT:"**Empty Model**"} |
| Stage 1094713345:"**Stage Entity**" | '**Dict**' | *Dict\<Gid,Pfb\>* | {id:1094713345 {GIL\_LEVEL\_ENTITY:"**Stage Entity**"}: id:1077936129 {OBJECT:"**Empty Model**"}} |
| Stage 1094713345:"**Stage Entity**" | '**Entity**' | *Ety* | id:0 |
