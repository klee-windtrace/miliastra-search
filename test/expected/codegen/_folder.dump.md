# FILE `codetest_1.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH guid='`1073741829`' nodes=30<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH guid='`1082130435`' nodes=4<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' INTEGER\_FILTER\_GRAPH guid='`1082130436`' nodes=5<br>
**RESOURCE** "**Empty Model**" OBJECT guid='`1077936129`' parent=(entities: **0**)

# FILE `codetest_2.gia`

**GRAPH** '<u>\<status\></u>*Status*' STATUS\_NODE\_GRAPH guid='`1073741830`' nodes=17<br>
**GRAPH** '<u>\<composite\></u>*Calling Twice*' ENTITY\_NODE\_GRAPH guid='`1610612743`' nodes=3 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Exposed Computed*' ENTITY\_NODE\_GRAPH guid='`1610612748`' nodes=2 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Exposed Local*' ENTITY\_NODE\_GRAPH guid='`1610612745`' nodes=2 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Exposed Native*' ENTITY\_NODE\_GRAPH guid='`1610612746`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Linear Flow*' ENTITY\_NODE\_GRAPH guid='`1610612738`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Simple Data*' ENTITY\_NODE\_GRAPH guid='`1610612737`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Terminal*' ENTITY\_NODE\_GRAPH guid='`1610612739`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Two Exclusive Outs*' ENTITY\_NODE\_GRAPH guid='`1610612742`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Two In One Out*' ENTITY\_NODE\_GRAPH guid='`1610612741`' nodes=2 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*With Event*' ENTITY\_NODE\_GRAPH guid='`1610612744`' nodes=4 role=dependency<br>
**GRAPH\_VARIABLE** '<u>\<status\></u>*Status*' '**gvar**' : *Int* = 1
