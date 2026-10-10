# File `test/cases/mounts/composite_folders.gil`

## File

| Property | Value |
| --- | --- |
| format | gil |
| detected\_by | header |
| file\_size | 133059 |
| container\_file\_type | gil |
| engine\_version | 7.1.0 |
| mode | beyond |
| level\_name | composite\_folders |
| node\_db\_version | 7.1.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 126 |
| graphs | 30 |
| nodes | 0 |
| composite\_bodies | 30 |
| declarations | 30 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT | 1 | **1** |
| PRESET\_POINT | 6 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **30** |
| COMPOSITE\_NODE\_DECL | 12 | **30** |
| CAMERA | 13 | **1** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **1** |
| PLAYER\_TEMPLATE | 18 | **1** |
| CHARACTER\_TEMPLATE | 19 | **1** |
| INTERFACE\_LAYOUT | 20 | **3** |
| SHIELD | 39 | **1** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| GIL\_CHARACTER\_ENTITY | - | **1** |
| GIL\_GROWTH\_CURVE | - | **26** |
| GIL\_LEVEL\_ENTITY | - | **1** |
| GIL\_PLAYER\_ENTITY | - | **9** |
| GIL\_RESPAWN\_POINT | - | **1** |
| GIL\_UI\_UNNAMED | - | **3** |

### Level sections

| Section | Resources | Description |
| --- | ---: | --- |
| root.4 | **3** | templates: prefabs, player and character templates, creation templates |
| root.5 | **11** | entities placed in the level, plus the stage, player and character entities |
| root.9 | **20** | UI: layouts and their controls |
| root.10.2 | **30** | node declarations: signals and composite declarations |
| root.10.4 | **30** | composite bodies: the graphs inside composite nodes |
| root.11.3 | **1** | respawn points |
| root.11.5 | **1** | preset points |
| root.15 | **29** | configs: unit statuses, classes, skills, items and the like |
| root.18 | **1** | cameras |

### Resource folders

| Folder | Graphs | Resources |
| --- | ---: | ---: |
| /(default)/ | **3** |   |
| /A/ | **3** |   |
| /B/ | **3** |   |
| /C/ | **3** |   |
| /D/ | **3** |   |
| /E/ | **3** |   |
| /F/ | **3** |   |
| /G/ | **3** |   |
| /H/ | **3** |   |
| /I/ | **3** |   |

---

# File `test/cases/mounts/graph_folders.gil`

## File

| Property | Value |
| --- | --- |
| format | gil |
| detected\_by | header |
| file\_size | 44561 |
| container\_file\_type | gil |
| engine\_version | 7.1.0 |
| mode | beyond |
| level\_name | graph\_folders |
| node\_db\_version | 7.1.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 101 |
| graphs | 30 |
| nodes | 11 |
| composite\_bodies | 6 |
| declarations | 6 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT | 1 | **6** |
| TERRAIN\_ENTITY | 5 | **1** |
| PRESET\_POINT | 6 | **1** |
| UNIT\_STATUS | 7 | **6** |
| SKILL | 8 | **6** |
| ENTITY\_NODE\_GRAPH | 9 | **13** |
| BOOLEAN\_FILTER\_GRAPH | 10 | **1** |
| SKILL\_NODE\_GRAPH | 11 | **2** |
| COMPOSITE\_NODE\_DECL | 12 | **6** |
| CAMERA | 13 | **1** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **1** |
| PLAYER\_TEMPLATE | 18 | **1** |
| CHARACTER\_TEMPLATE | 19 | **1** |
| INTERFACE\_LAYOUT | 20 | **6** |
| STATUS\_NODE\_GRAPH | 22 | **2** |
| CLASS\_NODE\_GRAPH | 23 | **2** |
| ITEM\_NODE\_GRAPH | 46 | **2** |
| INTEGER\_FILTER\_GRAPH | 47 | **1** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| CREATION\_STATUS\_DECISION\_GRAPH | 51 | **2** |
| CREATION\_SKILL\_GRAPH | 52 | **2** |
| CREATION\_STATUS\_GRAPH | 53 | **2** |
| CUSTOM\_CREATION\_SKILL | 54 | **3** |
| CHARACTER\_CONTROL\_SKILL\_GRAPH | 64 | **1** |
| CONTROL\_SKILL | 65 | **3** |
| GIL\_CHARACTER\_ENTITY | - | **1** |
| GIL\_GROWTH\_CURVE | - | **1** |
| GIL\_INVENTORY\_TEMPLATE | - | **1** |
| GIL\_LEVEL\_ENTITY | - | **1** |
| GIL\_PLAYER\_ENTITY | - | **9** |
| GIL\_RESPAWN\_POINT | - | **1** |

### Level sections

| Section | Resources | Description |
| --- | ---: | --- |
| root.4 | **8** | templates: prefabs, player and character templates, creation templates |
| root.5 | **11** | entities placed in the level, plus the stage, player and character entities |
| root.7 | **1** | terrains |
| root.9 | **20** | UI: layouts and their controls |
| root.10.1 | **24** | node graphs (entity, status, class, item, skill, filter, creation graphs) |
| root.10.2 | **6** | node declarations: signals and composite declarations |
| root.10.4 | **6** | composite bodies: the graphs inside composite nodes |
| root.11.3 | **1** | respawn points |
| root.11.5 | **1** | preset points |
| root.15 | **22** | configs: unit statuses, classes, skills, items and the like |
| root.18 | **1** | cameras |

### Resource folders

| Folder | Graphs | Resources |
| --- | ---: | ---: |
| /(default)/ | **16** | **8** |
| /B/ | **1** |   |
| /C/ | **2** |   |
| /A/ | **1** |   |
| /Status Graph Tab/ | **1** |   |
| /Class Graph Tab/ | **1** |   |
| /Item Graph Tab/ | **1** |   |
| /Composite Tab A/ | **1** |   |
| /Composite Tab C/ | **1** |   |
| /Composite Tab B/ | **1** |   |
| /Char Skill Graph Tab/ | **1** |   |
| /Creation Skill Graph Tab/ | **1** |   |
| /Creation Status Graph Tab/ | **1** |   |
| /Creation Decision Graph Tab/ | **1** |   |
| /char skill tab 1/ |   | **2** |
| /char skill tab 2/ |   | **2** |
| /Control skill tab 1/ |   | **1** |
| /Control skill tab 2/ |   | **1** |
| /Custom Creation Skill Tab 1/ |   | **1** |
| /Custom Creation Skill Tab 2/ |   | **1** |
| /First status tab/ |   | **2** |
| /Second status tab/ |   | **2** |
| /First prefab tab/ |   | **2** |
| /Second prefab tab/ |   | **2** |

---

# File `test/cases/mounts/test_folders.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 21619 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | test\_folders.gia |
| node\_db\_version | 7.1.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 61 |
| primary | 41 |
| dependencies | 20 |
| graphs | 25 |
| nodes | 14 |
| composite\_bodies | 2 |
| declarations | 6 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT\_ENTITY | 3 | **4** |
| STATIC\_ENTITY | 3 | **1** |
| TERRAIN\_ENTITY | 5 | **1** |
| PRESET\_POINT | 6 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **5** |
| BOOLEAN\_FILTER\_GRAPH | 10 | **2** |
| SKILL\_NODE\_GRAPH | 11 | **2** |
| COMPOSITE\_NODE\_DECL | 12 | **4** |
| CAMERA | 13 | **1** |
| SIGNAL\_NODE\_DECL | 14 | **2** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **1** |
| PLAYER\_TEMPLATE | 18 | **1** |
| CHARACTER\_TEMPLATE | 19 | **1** |
| INTERFACE\_LAYOUT | 20 | **1** |
| STATUS\_NODE\_GRAPH | 22 | **2** |
| CLASS\_NODE\_GRAPH | 23 | **2** |
| ITEM\_NODE\_GRAPH | 46 | **2** |
| INTEGER\_FILTER\_GRAPH | 47 | **2** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| CREATION\_STATUS\_DECISION\_GRAPH | 51 | **2** |
| CREATION\_SKILL\_GRAPH | 52 | **2** |
| CREATION\_STATUS\_GRAPH | 53 | **2** |
| CHARACTER\_CONTROL\_SKILL\_GRAPH | 64 | **2** |
| class#66 | 66 | **1** |
| class#67 | 67 | **1** |
| class#68 | 68 | **1** |

---

# File `test/cases/mounts/test_folders.gil`

## File

| Property | Value |
| --- | --- |
| format | gil |
| detected\_by | header |
| file\_size | 29389 |
| container\_file\_type | gil |
| engine\_version | 7.1.0 |
| mode | beyond |
| level\_name | test\_folders |
| node\_db\_version | 7.1.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 77 |
| graphs | 25 |
| nodes | 14 |
| composite\_bodies | 2 |
| declarations | 6 |
| structs | 0 |
| mounts | 4 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT\_ENTITY | 3 | **4** |
| STATIC\_ENTITY | 3 | **1** |
| TERRAIN\_ENTITY | 5 | **1** |
| PRESET\_POINT | 6 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **5** |
| BOOLEAN\_FILTER\_GRAPH | 10 | **2** |
| SKILL\_NODE\_GRAPH | 11 | **2** |
| COMPOSITE\_NODE\_DECL | 12 | **4** |
| CAMERA | 13 | **1** |
| SIGNAL\_NODE\_DECL | 14 | **2** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **1** |
| PLAYER\_TEMPLATE | 18 | **1** |
| CHARACTER\_TEMPLATE | 19 | **1** |
| INTERFACE\_LAYOUT | 20 | **6** |
| STATUS\_NODE\_GRAPH | 22 | **2** |
| CLASS\_NODE\_GRAPH | 23 | **2** |
| ITEM\_NODE\_GRAPH | 46 | **2** |
| INTEGER\_FILTER\_GRAPH | 47 | **2** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| CREATION\_STATUS\_DECISION\_GRAPH | 51 | **2** |
| CREATION\_SKILL\_GRAPH | 52 | **2** |
| CREATION\_STATUS\_GRAPH | 53 | **2** |
| CHARACTER\_CONTROL\_SKILL\_GRAPH | 64 | **2** |
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
| root.5 | **16** | entities placed in the level, plus the stage, player and character entities |
| root.7 | **1** | terrains |
| root.9 | **20** | UI: layouts and their controls |
| root.10.1 | **23** | node graphs (entity, status, class, item, skill, filter, creation graphs) |
| root.10.2 | **6** | node declarations: signals and composite declarations |
| root.10.4 | **2** | composite bodies: the graphs inside composite nodes |
| root.11.3 | **1** | respawn points |
| root.11.5 | **1** | preset points |
| root.15 | **4** | configs: unit statuses, classes, skills, items and the like |
| root.18 | **1** | cameras |

### Resource folders

| Folder | Graphs | Resources |
| --- | ---: | ---: |
| /(default)/ | **12** |   |
| /New Folder/ | **12** |   |
| /My/ | **1** |   |

---

# File `test/cases/mounts/test_mount.gil`

## File

| Property | Value |
| --- | --- |
| format | gil |
| detected\_by | header |
| file\_size | 57042 |
| container\_file\_type | gil |
| engine\_version | 7.1.0 |
| mode | beyond |
| level\_name | test\_mount |
| node\_db\_version | 7.1.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 84 |
| graphs | 9 |
| nodes | 0 |
| composite\_bodies | 0 |
| declarations | 0 |
| structs | 0 |
| mounts | 20 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT | 1 | **5** |
| OBJECT\_ENTITY | 3 | **5** |
| STATIC\_ENTITY | 3 | **3** |
| CREATION\_ENTITY | 4 | **1** |
| TERRAIN\_ENTITY | 5 | **1** |
| PRESET\_POINT | 6 | **1** |
| UNIT\_STATUS | 7 | **2** |
| ENTITY\_NODE\_GRAPH | 9 | **6** |
| CAMERA | 13 | **1** |
| UI\_CONTROL | 15 | **14** |
| CLASS | 17 | **4** |
| PLAYER\_TEMPLATE | 18 | **4** |
| CHARACTER\_TEMPLATE | 19 | **4** |
| INTERFACE\_LAYOUT | 20 | **6** |
| STATUS\_NODE\_GRAPH | 22 | **1** |
| CLASS\_NODE\_GRAPH | 23 | **2** |
| ENVIRONMENT\_CONFIGURATION | 49 | **1** |
| GIL\_CHARACTER\_ENTITY | - | **4** |
| GIL\_GROWTH\_CURVE | - | **4** |
| GIL\_INVENTORY\_TEMPLATE | - | **1** |
| GIL\_LEVEL\_ENTITY | - | **1** |
| GIL\_PLAYER\_ENTITY | - | **12** |
| GIL\_RESPAWN\_POINT | - | **1** |

### Level sections

| Section | Resources | Description |
| --- | ---: | --- |
| root.4 | **13** | templates: prefabs, player and character templates, creation templates |
| root.5 | **26** | entities placed in the level, plus the stage, player and character entities |
| root.7 | **1** | terrains |
| root.9 | **20** | UI: layouts and their controls |
| root.10.1 | **9** | node graphs (entity, status, class, item, skill, filter, creation graphs) |
| root.11.3 | **1** | respawn points |
| root.11.5 | **1** | preset points |
| root.15 | **12** | configs: unit statuses, classes, skills, items and the like |
| root.18 | **1** | cameras |

### Resource folders

| Folder | Graphs | Resources |
| --- | ---: | ---: |
| /(default)/ | **9** | **7** |
