# INFO

## FILE `assembly_pins.gil`

format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gil<br>
detected\_by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header<br>
file\_size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;68307<br>
container\_file\_type&nbsp;&nbsp;&nbsp;&nbsp;gil<br>
engine\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.1.0<br>
mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beyond<br>
level\_name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;empty\_pins<br>
node\_db\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
resources&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46<br>
graphs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
nodes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;63<br>
composite\_bodies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
declarations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
structs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
mounts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
unresolved\_node\_types&nbsp;&nbsp;0<br>
CLASS TERRAIN\_ENTITY class=5 count=1<br>
CLASS PRESET\_POINT class=6 count=1<br>
CLASS ENTITY\_NODE\_GRAPH class=9 count=1<br>
CLASS SKILL\_NODE\_GRAPH class=11 count=1<br>
CLASS CAMERA class=13 count=1<br>
CLASS UI\_CONTROL class=15 count=14<br>
CLASS CLASS class=17 count=1<br>
CLASS PLAYER\_TEMPLATE class=18 count=1<br>
CLASS CHARACTER\_TEMPLATE class=19 count=1<br>
CLASS INTERFACE\_LAYOUT class=20 count=6<br>
CLASS STATUS\_NODE\_GRAPH class=22 count=1<br>
CLASS ENVIRONMENT\_CONFIGURATION class=49 count=1<br>
CLASS CREATION\_STATUS\_DECISION\_GRAPH class=51 count=1<br>
CLASS CREATION\_STATUS\_GRAPH class=53 count=1<br>
CLASS GIL\_CHARACTER\_ENTITY class=- count=1<br>
CLASS GIL\_GROWTH\_CURVE class=- count=1<br>
CLASS GIL\_INVENTORY\_TEMPLATE class=- count=1<br>
CLASS GIL\_LEVEL\_ENTITY class=- count=1<br>
CLASS GIL\_PLAYER\_ENTITY class=- count=9<br>
CLASS GIL\_RESPAWN\_POINT class=- count=1<br>
SECTION root.4 resources=2 description='`templates: prefabs, player and character templates, creation templates`'<br>
SECTION root.5 resources=11 description='`entities placed in the level, plus the stage, player and character entities`'<br>
SECTION root.7 resources=1 description='`terrains`'<br>
SECTION root.9 resources=20 description='`UI: layouts and their controls`'<br>
SECTION root.10.1 resources=5 description='`node graphs (entity, status, class, item, skill, filter, creation graphs)`'<br>
SECTION root.11.3 resources=1 description='`respawn points`'<br>
SECTION root.11.5 resources=1 description='`preset points`'<br>
SECTION root.15 resources=4 description='`configs: unit statuses, classes, skills, items and the like`'<br>
SECTION root.18 resources=1 description='`cameras`'<br>
FOLDER /(default)/ graphs=5

---

# DUMP

**GRAPH** /(default)/'*New Node Graph*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741825`' kind=21001 service=20000 nodes=14<br>
**GRAPH** /(default)/'<u>\<status\></u>*New Node Graph\_1*' STATUS\_NODE\_GRAPH class=22 guid='`1073741826`' kind=21001 service=20003 nodes=11<br>
**GRAPH** /(default)/'<u>\<skill\></u>*New Character Skill Node Graph*' SKILL\_NODE\_GRAPH class=11 guid='`1082130433`' kind=21001 service=20002 nodes=15 entry\_slot=1<br>
**GRAPH** /(default)/'<u>\<creation\></u>*New Creation Status Node Graph*' CREATION\_STATUS\_GRAPH class=53 guid='`1082130435`' kind=21001 service=20009 nodes=17 entry\_slot=1<br>
**GRAPH** /(default)/'<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH class=51 guid='`1082130434`' kind=21001 service=20007 nodes=6 entry\_slot=1<br>
**RESOURCE** "**Stage Entity**" GIL\_LEVEL\_ENTITY class=- guid='`1094713345`' section=root.5<br>
**RESOURCE** "**Default Template**" PLAYER\_TEMPLATE class=18 guid='`1086324737`' section=root.4<br>
**RESOURCE** "**Default Template(Edit Character)**" CHARACTER\_TEMPLATE class=19 guid='`1090519041`' section=root.4<br>
**RESOURCE** "**Custom Class**" CLASS class=17 guid='`1090519041`' section=root.15<br>
**RESOURCE** "**Inventory Template**" GIL\_INVENTORY\_TEMPLATE class=- guid='`1119879169`' section=root.15<br>
**RESOURCE** "**Custom Camera**" CAMERA class=13 guid='`1073741825`' section=root.18<br>
**RESOURCE** "**Terrain01**" TERRAIN\_ENTITY class=5 guid='`1073741825`' section=root.7<br>
**RESOURCE** "**Default Layout**" INTERFACE\_LAYOUT class=20 guid='`1073741825`' section=root.9<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT class=20 guid='`1073741840`' section=root.9<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT class=20 guid='`1073741841`' section=root.9<br>
**RESOURCE** "**ExclusiveEleGroupHierarchyRoot**" INTERFACE\_LAYOUT class=20 guid='`1073741842`' section=root.9<br>
**RESOURCE** "**ClientUIRootHierarchyRoot**" INTERFACE\_LAYOUT class=20 guid='`1073741843`' section=root.9<br>
**RESOURCE** "**ClientUIPrototypeHierarchyRoot**" INTERFACE\_LAYOUT class=20 guid='`1073741844`' section=root.9<br>
**RESOURCE** "**Environment Configuration**" ENVIRONMENT\_CONFIGURATION class=49 guid='`1186988033`' section=root.15<br>
**RESOURCE** "**Create Preset Point**" PRESET\_POINT class=6 guid='`1073741825`' section=root.11.5<br>
**RESOURCE** "**Spawn Point1**" GIL\_RESPAWN\_POINT class=- guid='`1073741825`' section=root.11.3<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324737`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324738`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324739`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324740`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324741`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324742`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324743`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324744`' section=root.5<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY class=- guid='`1086324745`' section=root.5<br>
**RESOURCE** "**Default Template(Edit Character)**" GIL\_CHARACTER\_ENTITY class=- guid='`1090519041`' section=root.5<br>
**RESOURCE** "**Custom Growth Curve**" GIL\_GROWTH\_CURVE class=- guid='`1094713345`' section=root.15<br>
**RESOURCE** "**Mini-Map**" UI\_CONTROL class=15 guid='`1073741826`' section=root.9<br>
**RESOURCE** "**Skill Area**" UI\_CONTROL class=15 guid='`1073741827`' section=root.9<br>
**RESOURCE** "**Team Information**" UI\_CONTROL class=15 guid='`1073741828`' section=root.9<br>
**RESOURCE** "**Character HP Bar**" UI\_CONTROL class=15 guid='`1073741829`' section=root.9<br>
**RESOURCE** "**Joystick**" UI\_CONTROL class=15 guid='`1073741830`' section=root.9<br>
**RESOURCE** "**Creation HP Bar**" UI\_CONTROL class=15 guid='`1073741831`' section=root.9<br>
**RESOURCE** "**Exit Button**" UI\_CONTROL class=15 guid='`1073741832`' section=root.9<br>
**RESOURCE** "**Voice-Over**" UI\_CONTROL class=15 guid='`1073741833`' section=root.9<br>
**RESOURCE** "**Tab**" UI\_CONTROL class=15 guid='`1073741834`' section=root.9<br>
**RESOURCE** "**Chat Button**" UI\_CONTROL class=15 guid='`1073741835`' section=root.9<br>
**RESOURCE** "**Network Status**" UI\_CONTROL class=15 guid='`1073741836`' section=root.9<br>
**RESOURCE** "**Struggle Button**" UI\_CONTROL class=15 guid='`1073741837`' section=root.9<br>
**RESOURCE** "**Voice Chat Button**" UI\_CONTROL class=15 guid='`1073741838`' section=root.9<br>
**RESOURCE** "**Voice Chat Hint Queue**" UI\_CONTROL class=15 guid='`1073741839`' section=root.9

---

# REFS

`graph_variable`&nbsp;&nbsp; "**\<unset\>**" (*Bol*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*New Node Graph*'\]: **3** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**\<unset\>**" (*Cfg*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*New Node Graph*'\]: **1** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**\<unset\>**" (*Ety*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*New Node Graph*'\]: **1** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**\<unset\>**" (*Flt*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*New Node Graph*'\]: **1** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**\<unset\>**" (*Str*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*New Node Graph*'\]: **1** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**\<unset\>**" (*Vec*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*New Node Graph*'\]: **2** get, **0** set<br>
`literal_id`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Cfg:2**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** Ref: \['*New Node Graph*'\]

---

# WARNS

## findings

(no findings)

---

## limits

PRESET\_POINT: 1/2000<br>
ENVIRONMENT\_CONFIGURATION: 1/50<br>
CLASS: 1/100<br>
TERRAIN\_ENTITY: 1/1200

---

## top graphs by node count:

'<u>\<creation\></u>*New Creation Status Node Graph*': 17/3000 nodes<br>
'<u>\<skill\></u>*New Character Skill Node Graph*': 15/3000 nodes<br>
'*New Node Graph*': 14/3000 nodes<br>
'<u>\<status\></u>*New Node Graph\_1*': 11/3000 nodes<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*': 6/3000 nodes
