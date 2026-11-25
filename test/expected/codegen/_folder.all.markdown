# Info

## File `codetest_1.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 13891 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | codetest\_1.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 4 |
| primary | 4 |
| dependencies | 0 |
| graphs | 3 |
| nodes | 39 |
| composite\_bodies | 0 |
| declarations | 0 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| OBJECT | 1 | **1** |
| ENTITY\_NODE\_GRAPH | 9 | **1** |
| INTEGER\_FILTER\_GRAPH | 47 | **1** |
| CREATION\_STATUS\_DECISION\_GRAPH | 51 | **1** |

---

## File `codetest_2.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 6553 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | codetest\_2.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 21 |
| primary | 1 |
| dependencies | 20 |
| graphs | 11 |
| nodes | 35 |
| composite\_bodies | 10 |
| declarations | 10 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **10** |
| COMPOSITE\_NODE\_DECL | 12 | **10** |
| STATUS\_NODE\_GRAPH | 22 | **1** |

---

## File `data_order.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 2445 |
| container\_file\_type | gia |
| engine\_version | 7.2.0 |
| mode | beyond |
| export\_name | data\_order.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 5 |
| primary | 1 |
| dependencies | 4 |
| graphs | 3 |
| nodes | 27 |
| composite\_bodies | 2 |
| declarations | 2 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **3** |
| COMPOSITE\_NODE\_DECL | 12 | **2** |

---

# Dump

## File `codetest_1.gia`

## Graphs (3)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Entry slot | Evaluation interval |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| '*New Node Graph*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741829`' | 21001 | 20000 | **30** |   |   |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | CREATION\_STATUS\_DECISION\_GRAPH | 51 | '`1082130435`' | 21001 | 20007 | **4** | 1 |   |
| '<u>\<filter\></u>*New Filter Node Graph*' | INTEGER\_FILTER\_GRAPH | 47 | '`1082130436`' | 21001 | 20006 | **5** | 1 | 0.3 |

## Resources (1)

| Name | Class | Class id | Guid | Section | Parent |
| --- | --- | ---: | --- | --- | --- |
| "**Empty Model**" | OBJECT | 1 | '`1077936129`' |   | (entities: **0**) |

## File `codetest_2.gia`

## Graphs (11)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '<u>\<status\></u>*Status*' | STATUS\_NODE\_GRAPH | 22 | '`1073741830`' | 21001 | 20003 | **17** |   |   |
| '<u>\<composite\></u>*Calling Twice*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612743`' | 21002 | 20000 | **3** | '`1610612743`' | dependency |
| '<u>\<composite\></u>*Exposed Computed*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612748`' | 21002 | 20000 | **2** | '`1610612748`' | dependency |
| '<u>\<composite\></u>*Exposed Local*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612745`' | 21002 | 20000 | **2** | '`1610612745`' | dependency |
| '<u>\<composite\></u>*Exposed Native*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612746`' | 21002 | 20000 | **1** | '`1610612746`' | dependency |
| '<u>\<composite\></u>*Linear Flow*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612738`' | 21002 | 20000 | **1** | '`1610612738`' | dependency |
| '<u>\<composite\></u>*Simple Data*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612737`' | 21002 | 20000 | **1** | '`1610612737`' | dependency |
| '<u>\<composite\></u>*Terminal*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612739`' | 21002 | 20000 | **1** | '`1610612739`' | dependency |
| '<u>\<composite\></u>*Two Exclusive Outs*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612742`' | 21002 | 20000 | **1** | '`1610612742`' | dependency |
| '<u>\<composite\></u>*Two In One Out*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612741`' | 21002 | 20000 | **2** | '`1610612741`' | dependency |
| '<u>\<composite\></u>*With Event*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612744`' | 21002 | 20000 | **4** | '`1610612744`' | dependency |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '<u>\<status\></u>*Status*' | '**gvar**' | *Int* | 1 |

## File `data_order.gia`

## Graphs (3)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*Graph*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **23** |   |   |
| '<u>\<composite\></u>*Composite\_data*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612737`' | 21002 | 20000 | **2** | '`1610612737`' | dependency |
| '<u>\<composite\></u>*Composite\_exec*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612738`' | 21002 | 20000 | **2** | '`1610612738`' | dependency |

---

# Refs

## Reference index

Scanned 3 files:

- `codetest_1.gia`
- `codetest_2.gia`
- `data_order.gia`

## References

### `composite` (12)

| composite | call |
| --- | --- |
| "**Calling Twice**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Composite\_data**" | **1**<br>'*Graph*' |
| "**Composite\_exec**" | **1**<br>'*Graph*' |
| "**Exposed Computed**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Exposed Local**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Exposed Native**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Linear Flow**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Simple Data**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Terminal**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Two Exclusive Outs**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Two In One Out**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**With Event**" | **1**<br>'<u>\<status\></u>*Status*' |

### `custom_variable` (10)

| custom\_variable | Type | get | set | trigger |
| --- | --- | --- | --- | --- |
| "**\<dynamic\>**" | *Int* | **1**<br>'*Graph*' | **0** |   |
| "**list**" | *Dict* | **1**<br>'<u>\<filter\></u>*New Filter Node Graph*' | **0** |   |
| "**MyList**" | *L\<Int\>* | **1**<br>'*New Node Graph*' | **0** |   |
| "**none**" |   | **0** | **0** | **1**<br>'<u>\<composite\></u>*With Event*' |
| "**test**" | *Bol* | **1**<br>'<u>\<creation\></u>*New Creation Status Decision Node Graph*' | **0** |   |
| "**Test**" | *Dict* | **0** | **1**<br>'*New Node Graph*' |   |
| "**Var1**" | *Ety* | **0** | **1**<br>'*New Node Graph*' |   |
| "**x**" | *Bol* | **0** | **0** | **1**<br>'<u>\<status\></u>*Status*' |
| "**y**" | *Bol* | **0** | **0** | **1**<br>'<u>\<status\></u>*Status*' |
| "**z**" | *Bol* | **0** | **0** | **1**<br>'<u>\<status\></u>*Status*' |

### `graph_variable` (1)

| graph\_variable | Type | Graph | get | set | trigger |
| --- | --- | --- | --- | --- | --- |
| "**gvar**" | *Int* | '<u>\<status\></u>*Status*' | **0** | **1** | **1** |

### `literal_id` (1)

| literal\_id | Resolved | Ref |
| --- | --- | --- |
| "**Pfb:1077936129**" | OBJECT:"**Empty Model**" | **1**<br>'*New Node Graph*' |

### `timer` (2)

| timer | start | stop | listen |
| --- | --- | --- | --- |
| "**\<unset\>**" | **1**<br>'*Graph*' | **0** |   |
| "**timer**" | **0** | **0** | **1**<br>'<u>\<composite\></u>*With Event*' |

---

# Warns

## Warnings and limits

Scanned 3 files:

- `codetest_1.gia`
- `codetest_2.gia`
- `data_order.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO* | listener-no-handlers | \[2\] **When Custom Variable Changes** in graph '*Graph*' has no name switch and no code after it: it reacts to nothing | `data_order.gia` |
| *INFO* | dynamic-reference | \[6\] **Get Custom Variable** `in#1` "Variable Name" in graph '*Graph*': name is computed at runtime (wired from \[7\] **Query Dictionary Value by Key**; Query Dictionary Value by Key output "Value" is computed at runtime); cannot be resolved statically | `data_order.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**Var1**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**MyList**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**Test**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**test**" is used in \['<u>\<creation\></u>*New Creation Status Decision Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**list**" is used in \['<u>\<filter\></u>*New Filter Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 12/1000 |
| prefabs (OBJECT) | 1/1000 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '<u>\<status\></u>*Status*' | 35/3000 | `codetest_2.gia` |
| '*New Node Graph*' | 30/3000 | `codetest_1.gia` |
| '*Graph*' | 27/3000 | `data_order.gia` |
| '<u>\<filter\></u>*New Filter Node Graph*' | 5/3000 | `codetest_1.gia` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 4/3000 | `codetest_1.gia` |
