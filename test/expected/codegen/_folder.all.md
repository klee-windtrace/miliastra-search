# INFO

## FILE `codetest_1.gia`

format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
detected\_by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header<br>
file\_size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13891<br>
container\_file\_type&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
engine\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.1.0<br>
mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beyond<br>
export\_name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;codetest\_1.gia<br>
node\_db\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
resources&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4<br>
primary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4<br>
dependencies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
graphs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
nodes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;39<br>
composite\_bodies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
declarations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
structs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
mounts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
unresolved\_node\_types&nbsp;&nbsp;0<br>
CLASS OBJECT class=1 count=1<br>
CLASS ENTITY\_NODE\_GRAPH class=9 count=1<br>
CLASS INTEGER\_FILTER\_GRAPH class=47 count=1<br>
CLASS CREATION\_STATUS\_DECISION\_GRAPH class=51 count=1

---

## FILE `codetest_2.gia`

format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
detected\_by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header<br>
file\_size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6553<br>
container\_file\_type&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
engine\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.1.0<br>
mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beyond<br>
export\_name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;codetest\_2.gia<br>
node\_db\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
resources&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21<br>
primary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
dependencies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20<br>
graphs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11<br>
nodes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;35<br>
composite\_bodies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
declarations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
structs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
mounts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
unresolved\_node\_types&nbsp;&nbsp;0<br>
CLASS ENTITY\_NODE\_GRAPH class=9 count=10<br>
CLASS COMPOSITE\_NODE\_DECL class=12 count=10<br>
CLASS STATUS\_NODE\_GRAPH class=22 count=1

---

# DUMP

## FILE `codetest_1.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741829`' kind=21001 service=20000 nodes=30<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH class=51 guid='`1082130435`' kind=21001 service=20007 nodes=4 entry\_slot=1<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' INTEGER\_FILTER\_GRAPH class=47 guid='`1082130436`' kind=21001 service=20006 nodes=5 entry\_slot=1 evaluation\_interval=0.3<br>
**RESOURCE** "**Empty Model**" OBJECT class=1 guid='`1077936129`' parent=(entities: **0**)

## FILE `codetest_2.gia`

**GRAPH** '<u>\<status\></u>*Status*' STATUS\_NODE\_GRAPH class=22 guid='`1073741830`' kind=21001 service=20003 nodes=17<br>
**GRAPH** '<u>\<composite\></u>*Calling Twice*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612743`' kind=21002 service=20000 nodes=3 role=dependency decl='`1610612743`'<br>
**GRAPH** '<u>\<composite\></u>*Exposed Computed*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612748`' kind=21002 service=20000 nodes=2 role=dependency decl='`1610612748`'<br>
**GRAPH** '<u>\<composite\></u>*Exposed Local*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612745`' kind=21002 service=20000 nodes=2 role=dependency decl='`1610612745`'<br>
**GRAPH** '<u>\<composite\></u>*Exposed Native*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612746`' kind=21002 service=20000 nodes=1 role=dependency decl='`1610612746`'<br>
**GRAPH** '<u>\<composite\></u>*Linear Flow*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612738`' kind=21002 service=20000 nodes=1 role=dependency decl='`1610612738`'<br>
**GRAPH** '<u>\<composite\></u>*Simple Data*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612737`' kind=21002 service=20000 nodes=1 role=dependency decl='`1610612737`'<br>
**GRAPH** '<u>\<composite\></u>*Terminal*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612739`' kind=21002 service=20000 nodes=1 role=dependency decl='`1610612739`'<br>
**GRAPH** '<u>\<composite\></u>*Two Exclusive Outs*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612742`' kind=21002 service=20000 nodes=1 role=dependency decl='`1610612742`'<br>
**GRAPH** '<u>\<composite\></u>*Two In One Out*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612741`' kind=21002 service=20000 nodes=2 role=dependency decl='`1610612741`'<br>
**GRAPH** '<u>\<composite\></u>*With Event*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612744`' kind=21002 service=20000 nodes=4 role=dependency decl='`1610612744`'<br>
**GRAPH\_VARIABLE** '<u>\<status\></u>*Status*' '**gvar**' : *Int* = 1

---

# REFS

`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Calling Twice**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Exposed Computed**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Exposed Local**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Exposed Native**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Linear Flow**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Simple Data**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Terminal**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Two Exclusive Outs**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Two In One Out**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**With Event**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** call: \['<u>\<status\></u>*Status*'\]<br>
`custom_variable`  "**list**" (*Dict*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['<u>\<filter\></u>*New Filter Node Graph*'\], **0** set: \[\]<br>
`custom_variable`  "**MyList**" (*L\<Int\>*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*New Node Graph*'\], **0** set: \[\]<br>
`custom_variable`  "**none**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **1** trigger: \['<u>\<composite\></u>*With Event*'\]<br>
`custom_variable`  "**test**" (*Bol*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['<u>\<creation\></u>*New Creation Status Decision Node Graph*'\], **0** set: \[\]<br>
`custom_variable`  "**Test**" (*Dict*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **1** set: \['*New Node Graph*'\]<br>
`custom_variable`  "**Var1**" (*Ety*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **1** set: \['*New Node Graph*'\]<br>
`custom_variable`  "**x**" (*Bol*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **1** trigger: \['<u>\<status\></u>*Status*'\]<br>
`custom_variable`  "**y**" (*Bol*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **1** trigger: \['<u>\<status\></u>*Status*'\]<br>
`custom_variable`  "**z**" (*Bol*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **1** trigger: \['<u>\<status\></u>*Status*'\]<br>
`graph_variable`&nbsp;&nbsp; "**gvar**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['<u>\<status\></u>*Status*'\]: **0** get, **1** set, **1** trigger<br>
`literal_id`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Pfb:1077936129**" (OBJECT:"**Empty Model**") **1** Ref: \['*New Node Graph*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**timer**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** start: \[\], **0** stop: \[\], **1** listen: \['<u>\<composite\></u>*With Event*'\]

---

# WARNS

## findings

*INFO*  custom-variable-undeclared: custom variable "**Var1**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**MyList**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**Test**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**test**" is used in \['<u>\<creation\></u>*New Creation Status Decision Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**list**" is used in \['<u>\<filter\></u>*New Filter Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]

---

## limits

composites: 10/1000 declared<br>
prefabs (OBJECT): 1/1000

---

## top graphs by node count:

'<u>\<status\></u>*Status*': 35/3000 nodes \[`codetest_2.gia`\]<br>
'*New Node Graph*': 30/3000 nodes \[`codetest_1.gia`\]<br>
'<u>\<filter\></u>*New Filter Node Graph*': 5/3000 nodes \[`codetest_1.gia`\]<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*': 4/3000 nodes \[`codetest_1.gia`\]
