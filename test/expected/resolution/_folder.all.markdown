# Info

## File `test_All_Static.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 6905 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | test\_All\_Static.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 9 |
| primary | 1 |
| dependencies | 8 |
| graphs | 1 |
| nodes | 26 |
| composite\_bodies | 0 |
| declarations | 8 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **1** |
| COMPOSITE\_NODE\_DECL | 12 | **4** |
| SIGNAL\_NODE\_DECL | 14 | **4** |

---

## File `test_resolution.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 8947 |
| container\_file\_type | gia |
| engine\_version | 7.1.0 |
| mode | beyond |
| export\_name | test\_resolution.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 7 |
| primary | 5 |
| dependencies | 2 |
| graphs | 5 |
| nodes | 71 |
| composite\_bodies | 2 |
| declarations | 2 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **5** |
| COMPOSITE\_NODE\_DECL | 12 | **2** |

---

# Dump

## File `test_All_Static.gia`

## Declarations (2)

| Name | Class | Class id | Guid | Category | Role |
| --- | --- | ---: | --- | --- | --- |
| "**Static\_1**" | SIGNAL\_NODE\_DECL | 14 | '`1610612737`' | SEND\_SIGNAL | dependency |
| "**Static\_2**" | SIGNAL\_NODE\_DECL | 14 | '`1610612741`' | SEND\_SIGNAL | dependency |

## Graphs (1)

| Name | Class | Class id | Guid | Kind | Service | Nodes |
| --- | --- | ---: | --- | ---: | ---: | ---: |
| '*All\_Static*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **26** |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '*All\_Static*' | '**Static\_Graph**' | *L\<Gid\>* | \[\] |

## File `test_resolution.gia`

## Graphs (5)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*Dynamic*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741826`' | 21001 | 20000 | **30** |   |   |
| '*Indirect*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741827`' | 21001 | 20000 | **10** |   |   |
| '*Static*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **28** |   |   |
| '<u>\<composite\></u>*Create Composite Node*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612737`' | 21002 | 20000 | **2** | '`1610612737`' | dependency |
| '<u>\<composite\></u>*Create Composite Node(1)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612738`' | 21002 | 20000 | **1** | '`1610612738`' | dependency |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '*Dynamic*' | '**name**' | *Str* | '`gvar3`' |
| '*Indirect*' | '**test2**' | *Str* | '`test4`' |
| '*Static*' | '**name**' | *Str* | '`gvar3`' |

---

# Refs

## Reference index

Scanned 2 files:

- `test_All_Static.gia`
- `test_resolution.gia`

## References

### `composite` (2)

| composite | call |
| --- | --- |
| "**Create Composite Node**" | **6**<br>'*Dynamic*'<br>'*Indirect*'<br>'*Static*'<br>'<u>\<composite\></u>*Create Composite Node(1)*' |
| "**Create Composite Node(1)**" | **3**<br>'*Dynamic*'<br>'*Indirect*'<br>'*Static*' |

### `custom_variable` (7)

| custom\_variable | Type | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- |
| "**\* (listener for any name)**" |   |   |   |   | **1**<br>'*Dynamic*' |
| "**Static\_Var**" | *Flt* | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |
| "**test**" | *Str* | **1**<br>'*Dynamic*' | **0** |   |   |
| "**test1**" |   | **1**<br>'*Indirect*' | **0** |   |   |
| "**var1**" |   | **0** | **0** |   | **2**<br>'*Dynamic*'<br>'*Static*' |
| "**var2**" |   | **0** | **0** |   | **2**<br>'*Dynamic*'<br>'*Static*' |
| "**var3**" |   | **0** | **0** |   | **2**<br>'*Dynamic*'<br>'*Static*' |

### `global_timer` (3)

| global\_timer | start | stop | get-time | listen |
| --- | --- | --- | --- | --- |
| "**\* (listener for any name)**" |   |   |   | **1**<br>'*Dynamic*' |
| "**Static\_Global**" | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |   | **1**<br>'*All\_Static*' |
| "**test3**" |   |   | **1**<br>'*Indirect*' |   |

### `graph_variable` (9)

| graph\_variable | Type | Graph | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- | --- |
| "**Static\_Graph**" | *L\<Gid\>* | '*All\_Static*' | **1** | **1** | **1** | **1** |
| "**gvar1**" |   | '*Static*' | **0** | **0** |   | **2** |
| "**gvar3**" |   | '*Static*' | **0** | **0** |   | **1** |
| "**gvar4**" |   | '*Static*' | **0** | **0** |   | **1** |
| "**name**" | *Str* | '*Static*' | **1** | **0** |   |   |
| "**\* (listener for any name)**" |   |   |   |   |   | **1**<br>'*Dynamic*' |
| "**gvar1**" |   | '*Dynamic*' | **0** | **0** |   | **1** |
| "**name**" | *Str* | '*Dynamic*' | **1** | **0** |   |   |
| "**test2**" | *Str* | '*Indirect*' | **2** | **0** |   |   |

### `signal` (2)

| signal | listen | send |
| --- | --- | --- |
| "**Static\_1**" | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |
| "**Static\_2**" | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |

### `timer` (4)

| timer | Type | start | stop | listen |
| --- | --- | --- | --- | --- |
| "**\<dynamic\>**" |   | **0** | **0** | **1**<br>'*Dynamic*' |
| "**Static\_Timer**" | *onetime* | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |
| "**test4**" |   | **0** | **1**<br>'*Indirect*' |   |
| "**tm**" |   | **0** | **0** | **1**<br>'*Static*' |

---

# Warns

## Warnings and limits

Scanned 2 files:

- `test_All_Static.gia`
- `test_resolution.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO* | catch-all-listener | \[1\] **When Custom Variable Changes** in graph '*Dynamic*' also runs code for every name: \[21\] **Settle Stage** runs for every name (not a name switch) | `test_resolution.gia` |
| *INFO* | catch-all-listener | \[2\] **When Node Graph Variable Changes** in graph '*Dynamic*' also runs code for every name: \[11\] **Double Branch**: Equal does not compare the event's name (\[12\] **Equal**) | `test_resolution.gia` |
| *INFO* | dynamic-reference | \[3\] **When Timer Is Triggered** name switch in graph '*Dynamic*': name is computed at runtime (\[19\] **Double Branch** compares via \[20\] **Equal** with a value that is not static: Get Custom Variable output "Variable Value" is computed at runtime); cannot be resolved statically | `test_resolution.gia` |
| *INFO* | catch-all-listener | \[4\] **When Global Timer Is Triggered** in graph '*Dynamic*' also runs code for every name: \[22\] **Settle Stage** runs for every name (not a name switch) | `test_resolution.gia` |
| *INFO* | listener-no-handlers | \[4\] **When Global Timer Is Triggered** in graph '*Static*' has no name switch and no code after it: it reacts to nothing | `test_resolution.gia` |
| **WARN** | used-but-undeclared | graph variable "**gvar1**" is referenced in graph '*Dynamic*' but not declared there | `test_resolution.gia` |
| **WARN** | used-but-undeclared | graph variable "**gvar1**" is referenced in graph '*Static*' but not declared there | `test_resolution.gia` |
| **WARN** | used-but-undeclared | graph variable "**gvar3**" is referenced in graph '*Static*' but not declared there | `test_resolution.gia` |
| **WARN** | used-but-undeclared | graph variable "**gvar4**" is referenced in graph '*Static*' but not declared there | `test_resolution.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 2/1000 |
| signals (declared) | 2/99 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '*Dynamic*' | 37/3000 | `test_resolution.gia` |
| '*Static*' | 35/3000 | `test_resolution.gia` |
| '*All\_Static*' | 26/3000 | `test_All_Static.gia` |
| '*Indirect*' | 15/3000 | `test_resolution.gia` |
