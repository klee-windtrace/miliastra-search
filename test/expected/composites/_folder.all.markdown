# Info

## File `test_All_Composite.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 15914 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | test\_All\_Composite.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 61 |
| primary | 1 |
| dependencies | 60 |
| graphs | 27 |
| nodes | 52 |
| composite\_bodies | 26 |
| declarations | 34 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **27** |
| COMPOSITE\_NODE\_DECL | 12 | **30** |
| SIGNAL\_NODE\_DECL | 14 | **4** |

---

## File `test_composite.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 6705 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | test\_composite.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 23 |
| primary | 7 |
| dependencies | 16 |
| graphs | 3 |
| nodes | 12 |
| composite\_bodies | 2 |
| declarations | 2 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT | 1 | **1** |
| OBJECT\_ENTITY | 3 | **1** |
| SKILL | 8 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **3** |
| COMPOSITE\_NODE\_DECL | 12 | **2** |
| UI\_CONTROL | 15 | **14** |
| INTERFACE\_LAYOUT | 20 | **1** |

---

## File `test_composite.gil`

## File

| Property | Value |
| --- | --- |
| format | gil |
| detected\_by | header |
| file\_size | 26658 |
| container\_file\_type | gil |
| engine\_version | 7.1.0 |
| mode | beyond |
| level\_name | New Stage\_Save\_3 |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 49 |
| graphs | 3 |
| nodes | 12 |
| composite\_bodies | 2 |
| declarations | 2 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT | 1 | **1** |
| OBJECT\_ENTITY | 3 | **1** |
| TERRAIN\_ENTITY | 5 | **1** |
| PRESET\_POINT | 6 | **1** |
| SKILL | 8 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **3** |
| COMPOSITE\_NODE\_DECL | 12 | **2** |
| CAMERA | 13 | **1** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **1** |
| PLAYER\_TEMPLATE | 18 | **1** |
| CHARACTER\_TEMPLATE | 19 | **1** |
| INTERFACE\_LAYOUT | 20 | **6** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| GIL\_CHARACTER\_ENTITY | - | **1** |
| GIL\_GROWTH\_CURVE | - | **1** |
| GIL\_INVENTORY\_TEMPLATE | - | **1** |
| GIL\_LEVEL\_ENTITY | - | **1** |
| GIL\_PLAYER\_ENTITY | - | **9** |
| GIL\_RESPAWN\_POINT | - | **1** |

### Level sections

| Section | Resources | Description |
| --- | ---: | --- |
| root.4 | **3** | templates: prefabs, player and character templates, creation templates |
| root.5 | **12** | entities placed in the level, plus the stage, player and character entities |
| root.7 | **1** | terrains |
| root.9 | **20** | UI: layouts and their controls |
| root.10.1 | **1** | node graphs (entity, status, class, item, skill, filter, creation graphs) |
| root.10.2 | **2** | node declarations: signals and composite declarations |
| root.10.4 | **2** | composite bodies: the graphs inside composite nodes |
| root.11.3 | **1** | respawn points |
| root.11.5 | **1** | preset points |
| root.15 | **5** | configs: unit statuses, classes, skills, items and the like |
| root.18 | **1** | cameras |

### Resource folders

| Folder | Graphs | Resources |
| --- | ---: | ---: |
| /(default)/ | **3** | **2** |

---

## File `var_change.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 2369 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | var\_change.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 7 |
| primary | 1 |
| dependencies | 6 |
| graphs | 4 |
| nodes | 11 |
| composite\_bodies | 3 |
| declarations | 3 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **4** |
| COMPOSITE\_NODE\_DECL | 12 | **3** |

---

# Dump

## File `test_All_Composite.gia`

## Declarations (2)

| Name | Class | Class id | Guid | Category | Role |
| --- | --- | ---: | --- | --- | --- |
| "**Static\_2**" | SIGNAL\_NODE\_DECL | 14 | '`1610612741`' | SEND\_SIGNAL | dependency |
| "**Static\_1**" | SIGNAL\_NODE\_DECL | 14 | '`1610612737`' | SEND\_SIGNAL | dependency |

## Graphs (27)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*All\_Composite*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741826`' | 21001 | 20000 | **26** |   |   |
| '<u>\<composite\></u>*Create Composite Node*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612737`' | 21002 | 20000 | **1** | '`1610612745`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(2)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612739`' | 21002 | 20000 | **1** | '`1610612747`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(4)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612741`' | 21002 | 20000 | **1** | '`1610612749`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(6)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612743`' | 21002 | 20000 | **1** | '`1610612751`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(8)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612745`' | 21002 | 20000 | **1** | '`1610612753`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(9)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612746`' | 21002 | 20000 | **1** | '`1610612754`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(10)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612747`' | 21002 | 20000 | **1** | '`1610612755`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(11)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612748`' | 21002 | 20000 | **1** | '`1610612756`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(12)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612749`' | 21002 | 20000 | **1** | '`1610612757`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(13)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612750`' | 21002 | 20000 | **1** | '`1610612758`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(14)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612751`' | 21002 | 20000 | **1** | '`1610612759`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(15)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612752`' | 21002 | 20000 | **1** | '`1610612760`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(16)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612753`' | 21002 | 20000 | **1** | '`1610612761`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(17)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612754`' | 21002 | 20000 | **1** | '`1610612762`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(18)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612755`' | 21002 | 20000 | **1** | '`1610612763`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(19)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612756`' | 21002 | 20000 | **1** | '`1610612764`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(20)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612757`' | 21002 | 20000 | **1** | '`1610612765`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(21)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612758`' | 21002 | 20000 | **1** | '`1610612766`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(22)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612759`' | 21002 | 20000 | **1** | '`1610612767`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(23)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612760`' | 21002 | 20000 | **1** | '`1610612768`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(24)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612761`' | 21002 | 20000 | **1** | '`1610612769`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(25)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612762`' | 21002 | 20000 | **1** | '`1610612770`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(1)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612738`' | 21002 | 20000 | **1** | '`1610612746`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(5)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612742`' | 21002 | 20000 | **1** | '`1610612750`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(3)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612740`' | 21002 | 20000 | **1** | '`1610612748`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(7)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612744`' | 21002 | 20000 | **1** | '`1610612752`' | dependency |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '*All\_Composite*' | '**Static\_Graph**' | *L\<Gid\>* | \[\] |

## File `test_composite.gia`

## Graphs (3)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*New Node Graph*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **7** |   |   |
| '<u>\<composite\></u>*Create Composite Node*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612900`' | 21002 | 20000 | **4** | '`1610613134`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(1)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612901`' | 21002 | 20000 | **1** | '`1610613135`' | dependency |

## Resources (18)

| Name | Class | Class id | Guid | Section | Parent |
| --- | --- | ---: | --- | --- | --- |
| "**test\_skill**" | SKILL | 8 | '`1098907649`' |   |   |
| "**prefab\_test**" | OBJECT | 1 | '`1077936129`' |   | (entities: **1**) |
| "**entity\_test**" | OBJECT\_ENTITY | 3 | '`1077936131`' |   | (1077936129:"**prefab\_test**") |
| "**Default Layout**" | INTERFACE\_LAYOUT | 20 | '`1073741825`' |   |   |
| "**Mini-Map**" | UI\_CONTROL | 15 | '`1073741826`' |   |   |
| "**Skill Area**" | UI\_CONTROL | 15 | '`1073741827`' |   |   |
| "**Team Information**" | UI\_CONTROL | 15 | '`1073741828`' |   |   |
| "**Character HP Bar**" | UI\_CONTROL | 15 | '`1073741829`' |   |   |
| "**Joystick**" | UI\_CONTROL | 15 | '`1073741830`' |   |   |
| "**Creation HP Bar**" | UI\_CONTROL | 15 | '`1073741831`' |   |   |
| "**Exit Button**" | UI\_CONTROL | 15 | '`1073741832`' |   |   |
| "**Voice-Over**" | UI\_CONTROL | 15 | '`1073741833`' |   |   |
| "**Tab**" | UI\_CONTROL | 15 | '`1073741834`' |   |   |
| "**Chat Button**" | UI\_CONTROL | 15 | '`1073741835`' |   |   |
| "**Network Status**" | UI\_CONTROL | 15 | '`1073741836`' |   |   |
| "**Struggle Button**" | UI\_CONTROL | 15 | '`1073741837`' |   |   |
| "**Voice Chat Button**" | UI\_CONTROL | 15 | '`1073741838`' |   |   |
| "**Voice Chat Hint Queue**" | UI\_CONTROL | 15 | '`1073741839`' |   |   |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '*New Node Graph*' | '**Var\_1**' | *Int* | 1 |

## File `test_composite.gil`

## Graphs (3)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Folder |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*New Node Graph*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **7** |   | /(default)/ |
| '<u>\<composite\></u>*Create Composite Node*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612900`' | 21002 | 20000 | **4** | '`1610613134`' | /(default)/ |
| '<u>\<composite\></u>*Create Composite Node(1)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612901`' | 21002 | 20000 | **1** | '`1610613135`' | /(default)/ |

## Resources (44)

| Name | Class | Class id | Guid | Section | Parent | Folder |
| --- | --- | ---: | --- | --- | --- | --- |
| "**Stage Entity**" | GIL\_LEVEL\_ENTITY | - | '`1094713345`' | root.5 |   |   |
| "**Default Template**" | PLAYER\_TEMPLATE | 18 | '`1086324737`' | root.4 |   |   |
| "**Default Template(Edit Character)**" | CHARACTER\_TEMPLATE | 19 | '`1090519041`' | root.4 |   |   |
| "**Custom Class**" | CLASS | 17 | '`1090519041`' | root.15 |   |   |
| "**test\_skill**" | SKILL | 8 | '`1098907649`' | root.15 |   | /(default)/ |
| "**Inventory Template**" | GIL\_INVENTORY\_TEMPLATE | - | '`1119879169`' | root.15 |   |   |
| "**Custom Camera**" | CAMERA | 13 | '`1073741825`' | root.18 |   |   |
| "**prefab\_test**" | OBJECT | 1 | '`1077936129`' | root.4 | (entities: **1**) | /(default)/ |
| "**entity\_test**" | OBJECT\_ENTITY | 3 | '`1077936131`' | root.5 | (1077936129:"**prefab\_test**") |   |
| "**Terrain01**" | TERRAIN\_ENTITY | 5 | '`1073741825`' | root.7 |   |   |
| "**Default Layout**" | INTERFACE\_LAYOUT | 20 | '`1073741825`' | root.9 |   |   |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741840`' | root.9 |   |   |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741841`' | root.9 |   |   |
| "**ExclusiveEleGroupHierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741842`' | root.9 |   |   |
| "**ClientUIRootHierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741843`' | root.9 |   |   |
| "**ClientUIPrototypeHierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741844`' | root.9 |   |   |
| "**Environment Configuration**" | ENVIRONMENT\_CONFIGURATION | 49 | '`1186988033`' | root.15 |   |   |
| "**Create Preset Point**" | PRESET\_POINT | 6 | '`1073741825`' | root.11.5 |   |   |
| "**Spawn Point1**" | GIL\_RESPAWN\_POINT | - | '`1073741825`' | root.11.3 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324737`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324738`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324739`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324740`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324741`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324742`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324743`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324744`' | root.5 |   |   |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324745`' | root.5 |   |   |
| "**Default Template(Edit Character)**" | GIL\_CHARACTER\_ENTITY | - | '`1090519041`' | root.5 |   |   |
| "**Custom Growth Curve**" | GIL\_GROWTH\_CURVE | - | '`1094713345`' | root.15 |   |   |
| "**Mini-Map**" | UI\_CONTROL | 15 | '`1073741826`' | root.9 |   |   |
| "**Skill Area**" | UI\_CONTROL | 15 | '`1073741827`' | root.9 |   |   |
| "**Team Information**" | UI\_CONTROL | 15 | '`1073741828`' | root.9 |   |   |
| "**Character HP Bar**" | UI\_CONTROL | 15 | '`1073741829`' | root.9 |   |   |
| "**Joystick**" | UI\_CONTROL | 15 | '`1073741830`' | root.9 |   |   |
| "**Creation HP Bar**" | UI\_CONTROL | 15 | '`1073741831`' | root.9 |   |   |
| "**Exit Button**" | UI\_CONTROL | 15 | '`1073741832`' | root.9 |   |   |
| "**Voice-Over**" | UI\_CONTROL | 15 | '`1073741833`' | root.9 |   |   |
| "**Tab**" | UI\_CONTROL | 15 | '`1073741834`' | root.9 |   |   |
| "**Chat Button**" | UI\_CONTROL | 15 | '`1073741835`' | root.9 |   |   |
| "**Network Status**" | UI\_CONTROL | 15 | '`1073741836`' | root.9 |   |   |
| "**Struggle Button**" | UI\_CONTROL | 15 | '`1073741837`' | root.9 |   |   |
| "**Voice Chat Button**" | UI\_CONTROL | 15 | '`1073741838`' | root.9 |   |   |
| "**Voice Chat Hint Queue**" | UI\_CONTROL | 15 | '`1073741839`' | root.9 |   |   |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '*New Node Graph*' | '**Var\_1**' | *Int* | 1 |

## File `var_change.gia`

## Graphs (4)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*VAR\_TEST*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741841`' | 21001 | 20000 | **7** |   |   |
| '<u>\<composite\></u>*VAR\_TEST\_1*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612743`' | 21002 | 20000 | **1** | '`1610612743`' | dependency |
| '<u>\<composite\></u>*VAR\_TEST\_2*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612744`' | 21002 | 20000 | **1** | '`1610612744`' | dependency |
| '<u>\<composite\></u>*VAR\_TEST\_3*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612745`' | 21002 | 20000 | **2** | '`1610612745`' | dependency |

---

# Refs

## Reference index

Scanned 4 files:

- `test_All_Composite.gia`
- `test_composite.gia`
- `test_composite.gil`
- `var_change.gia`

## References

### `composite` (29)

| composite | call |
| --- | --- |
| "**Create Composite Node**" | **5**<br>'*All\_Composite*'<br>'*New Node Graph*' |
| "**Create Composite Node(1)**" | **3**<br>'*All\_Composite*'<br>'<u>\<composite\></u>*Create Composite Node*' |
| "**Create Composite Node(10)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(11)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(12)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(13)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(14)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(15)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(16)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(17)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(18)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(19)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(2)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(20)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(21)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(22)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(23)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(24)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(25)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(3)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(4)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(5)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(6)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(7)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(8)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(9)**" | **1**<br>'*All\_Composite*' |
| "**VAR\_TEST\_1**" | **1**<br>'*VAR\_TEST*' |
| "**VAR\_TEST\_2**" | **1**<br>'*VAR\_TEST*' |
| "**VAR\_TEST\_3**" | **1**<br>'*VAR\_TEST*' |

### `custom_variable` (3)

| custom\_variable | Type | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- |
| "**Static\_Var**" | *Flt* | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' | **1**<br>'<u>\<composite\></u>*Create Composite Node(15)*' | **1**<br>'*All\_Composite*' |
| "**Var1**" | *Int* | **0** | **0** | **1**<br>'*VAR\_TEST*' | **1**<br>'*VAR\_TEST*' |
| "**Var2**" | *Str* | **0** | **0** | **1**<br>'<u>\<composite\></u>*VAR\_TEST\_2*' | **1**<br>'<u>\<composite\></u>*VAR\_TEST\_3*' |

### `global_timer` (1)

| global\_timer | start | stop | listen |
| --- | --- | --- | --- |
| "**Static\_Global**" | **1**<br>'<u>\<composite\></u>*Create Composite Node(5)*' | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |

### `graph_variable` (3)

| graph\_variable | Type | Graph | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- | --- |
| "**Static\_Graph**" | *L\<Gid\>* | '*All\_Composite*' | **1** | **1** | **1** | **1** |
| "**Var\_1**" | *Int* | '*New Node Graph*' | **2** | **2** |   |   |
| "**Var\_1**" | *Int* | '*New Node Graph*' | **2** | **2** |   |   |

### `literal_id` (4)

| literal\_id | Resolved | Ref |
| --- | --- | --- |
| "**Cfg:1098907649**" | SKILL:"**test\_skill**" | **2**<br>'*New Node Graph*' |
| "**Gid:1077936131**" | OBJECT\_ENTITY:"**entity\_test**" | **2**<br>'*New Node Graph*' |
| "**Int: 1073741825**" | INTERFACE\_LAYOUT:"**Default Layout**" | **2**<br>'*New Node Graph*' |
| "**Pfb:10005018**" |   | **2**<br>'*New Node Graph*' |

### `signal` (2)

| signal | listen | send |
| --- | --- | --- |
| "**Static\_1**" | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |
| "**Static\_2**" | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |

### `timer` (1)

| timer | Type | start | stop | listen |
| --- | --- | --- | --- | --- |
| "**Static\_Timer**" | *onetime* | **1**<br>'<u>\<composite\></u>*Create Composite Node(4)*' | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |

---

# Warns

## Warnings and limits

Scanned 4 files:

- `test_All_Composite.gia`
- `test_composite.gia`
- `test_composite.gil`
- `var_change.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| **WARN** | composite-definition-count-anomaly | composite "**Create Composite Node**" has **3** definition(s) in the scanned files (expected exactly 1) – guid=1610612745; guid=1610613134; guid=1610613134; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `test_All_Composite.gia` |
| **WARN** | composite-definition-count-anomaly | composite "**Create Composite Node(1)**" has **3** definition(s) in the scanned files (expected exactly 1) – guid=1610612746; guid=1610613135; guid=1610613135; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `test_All_Composite.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 33/1000 |
| signals (declared) | 2/99 |
| prefabs (OBJECT) | 2/1000 |
| dynamic entities (OBJECT\_ENTITY) | 2/3000 |
| PRESET\_POINT | 1/2000 |
| ENVIRONMENT\_CONFIGURATION | 1/50 |
| CLASS | 1/100 |
| SKILL | 2/100 |
| TERRAIN\_ENTITY | 1/1200 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '*All\_Composite*' | 52/3000 | `test_All_Composite.gia` |
| '*New Node Graph*' | 17/3000 | `test_composite.gia` |
| '*New Node Graph*' | 17/3000 | `test_composite.gil` |
| '*VAR\_TEST*' | 11/3000 | `var_change.gia` |
