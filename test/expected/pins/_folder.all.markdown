# Info

## File `assembly_pins.gil`

## File

| Property | Value |
| --- | --- |
| format | gil |
| detected\_by | header |
| file\_size | 68307 |
| container\_file\_type | gil |
| engine\_version | 7.1.0 |
| mode | beyond |
| level\_name | empty\_pins |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 46 |
| graphs | 5 |
| nodes | 63 |
| composite\_bodies | 0 |
| declarations | 0 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| TERRAIN\_ENTITY | 5 | **1** |
| PRESET\_POINT | 6 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **1** |
| SKILL\_NODE\_GRAPH | 11 | **1** |
| CAMERA | 13 | **1** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **1** |
| PLAYER\_TEMPLATE | 18 | **1** |
| CHARACTER\_TEMPLATE | 19 | **1** |
| INTERFACE\_LAYOUT | 20 | **6** |
| STATUS\_NODE\_GRAPH | 22 | **1** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| CREATION\_STATUS\_DECISION\_GRAPH | 51 | **1** |
| CREATION\_STATUS\_GRAPH | 53 | **1** |
| GIL\_CHARACTER\_ENTITY | - | **1** |
| GIL\_GROWTH\_CURVE | - | **1** |
| GIL\_INVENTORY\_TEMPLATE | - | **1** |
| GIL\_LEVEL\_ENTITY | - | **1** |
| GIL\_PLAYER\_ENTITY | - | **9** |
| GIL\_RESPAWN\_POINT | - | **1** |

### Level sections

| Section | Resources | Description |
| --- | ---: | --- |
| root.4 | **2** | templates: prefabs, player and character templates, creation templates |
| root.5 | **11** | entities placed in the level, plus the stage, player and character entities |
| root.7 | **1** | terrains |
| root.9 | **20** | UI: layouts and their controls |
| root.10.1 | **5** | node graphs (entity, status, class, item, skill, filter, creation graphs) |
| root.11.3 | **1** | respawn points |
| root.11.5 | **1** | preset points |
| root.15 | **4** | configs: unit statuses, classes, skills, items and the like |
| root.18 | **1** | cameras |

### Resource folders

| Folder | Graphs | Resources |
| --- | ---: | ---: |
| /(default)/ | **5** |   |

---

# Dump

## File `assembly_pins.gil`

## Graphs (5)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Entry slot | Folder |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |
| '*New Node Graph*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **14** |   | /(default)/ |
| '<u>\<status\></u>*New Node Graph\_1*' | STATUS\_NODE\_GRAPH | 22 | '`1073741826`' | 21001 | 20003 | **11** |   | /(default)/ |
| '<u>\<skill\></u>*New Character Skill Node Graph*' | SKILL\_NODE\_GRAPH | 11 | '`1082130433`' | 21001 | 20002 | **15** | 1 | /(default)/ |
| '<u>\<creation\></u>*New Creation Status Node Graph*' | CREATION\_STATUS\_GRAPH | 53 | '`1082130435`' | 21001 | 20009 | **17** | 1 | /(default)/ |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | CREATION\_STATUS\_DECISION\_GRAPH | 51 | '`1082130434`' | 21001 | 20007 | **6** | 1 | /(default)/ |

## Resources (41)

| Name | Class | Class id | Guid | Section |
| --- | --- | ---: | --- | --- |
| "**Stage Entity**" | GIL\_LEVEL\_ENTITY | - | '`1094713345`' | root.5 |
| "**Default Template**" | PLAYER\_TEMPLATE | 18 | '`1086324737`' | root.4 |
| "**Default Template(Edit Character)**" | CHARACTER\_TEMPLATE | 19 | '`1090519041`' | root.4 |
| "**Custom Class**" | CLASS | 17 | '`1090519041`' | root.15 |
| "**Inventory Template**" | GIL\_INVENTORY\_TEMPLATE | - | '`1119879169`' | root.15 |
| "**Custom Camera**" | CAMERA | 13 | '`1073741825`' | root.18 |
| "**Terrain01**" | TERRAIN\_ENTITY | 5 | '`1073741825`' | root.7 |
| "**Default Layout**" | INTERFACE\_LAYOUT | 20 | '`1073741825`' | root.9 |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741840`' | root.9 |
| "**HierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741841`' | root.9 |
| "**ExclusiveEleGroupHierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741842`' | root.9 |
| "**ClientUIRootHierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741843`' | root.9 |
| "**ClientUIPrototypeHierarchyRoot**" | INTERFACE\_LAYOUT | 20 | '`1073741844`' | root.9 |
| "**Environment Configuration**" | ENVIRONMENT\_CONFIGURATION | 49 | '`1186988033`' | root.15 |
| "**Create Preset Point**" | PRESET\_POINT | 6 | '`1073741825`' | root.11.5 |
| "**Spawn Point1**" | GIL\_RESPAWN\_POINT | - | '`1073741825`' | root.11.3 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324737`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324738`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324739`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324740`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324741`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324742`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324743`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324744`' | root.5 |
| "**Default Template**" | GIL\_PLAYER\_ENTITY | - | '`1086324745`' | root.5 |
| "**Default Template(Edit Character)**" | GIL\_CHARACTER\_ENTITY | - | '`1090519041`' | root.5 |
| "**Custom Growth Curve**" | GIL\_GROWTH\_CURVE | - | '`1094713345`' | root.15 |
| "**Mini-Map**" | UI\_CONTROL | 15 | '`1073741826`' | root.9 |
| "**Skill Area**" | UI\_CONTROL | 15 | '`1073741827`' | root.9 |
| "**Team Information**" | UI\_CONTROL | 15 | '`1073741828`' | root.9 |
| "**Character HP Bar**" | UI\_CONTROL | 15 | '`1073741829`' | root.9 |
| "**Joystick**" | UI\_CONTROL | 15 | '`1073741830`' | root.9 |
| "**Creation HP Bar**" | UI\_CONTROL | 15 | '`1073741831`' | root.9 |
| "**Exit Button**" | UI\_CONTROL | 15 | '`1073741832`' | root.9 |
| "**Voice-Over**" | UI\_CONTROL | 15 | '`1073741833`' | root.9 |
| "**Tab**" | UI\_CONTROL | 15 | '`1073741834`' | root.9 |
| "**Chat Button**" | UI\_CONTROL | 15 | '`1073741835`' | root.9 |
| "**Network Status**" | UI\_CONTROL | 15 | '`1073741836`' | root.9 |
| "**Struggle Button**" | UI\_CONTROL | 15 | '`1073741837`' | root.9 |
| "**Voice Chat Button**" | UI\_CONTROL | 15 | '`1073741838`' | root.9 |
| "**Voice Chat Hint Queue**" | UI\_CONTROL | 15 | '`1073741839`' | root.9 |

---

# Refs

## Reference index

Scanned 1 file:

- `assembly_pins.gil`

## References

### `graph_variable` (6)

| graph\_variable | Type | Graph | get | set |
| --- | --- | --- | --- | --- |
| "**\<unset\>**" | *Bol* | '*New Node Graph*' | **3** | **0** |
| "**\<unset\>**" | *Cfg* | '*New Node Graph*' | **1** | **0** |
| "**\<unset\>**" | *Ety* | '*New Node Graph*' | **1** | **0** |
| "**\<unset\>**" | *Flt* | '*New Node Graph*' | **1** | **0** |
| "**\<unset\>**" | *Str* | '*New Node Graph*' | **1** | **0** |
| "**\<unset\>**" | *Vec* | '*New Node Graph*' | **2** | **0** |

### `literal_id` (1)

| literal\_id | Ref |
| --- | --- |
| "**Cfg:2**" | **1**<br>'*New Node Graph*' |

---

# Warns

## Warnings and limits

Scanned 1 file:

- `assembly_pins.gil`

## Findings

(no findings)

---

## Limits

| Resource | Used / max |
| --- | ---: |
| PRESET\_POINT | 1/2000 |
| ENVIRONMENT\_CONFIGURATION | 1/50 |
| CLASS | 1/100 |
| TERRAIN\_ENTITY | 1/1200 |

---

## Top graphs by node count

| Graph | Effective nodes |
| --- | ---: |
| '<u>\<creation\></u>*New Creation Status Node Graph*' | 17/3000 |
| '<u>\<skill\></u>*New Character Skill Node Graph*' | 15/3000 |
| '*New Node Graph*' | 14/3000 |
| '<u>\<status\></u>*New Node Graph\_1*' | 11/3000 |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 6/3000 |
