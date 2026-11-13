# Info

## File `codetest_3.gia`

## File

| Property | Value |
| --- | --- |
| format | gia |
| detected\_by | header |
| file\_size | 11438 |
| container\_file\_type | gia |
| engine\_version | 7.2.0 |
| mode | beyond |
| export\_name | codetest\_3.gia |
| node\_db\_version | 7.2.0 |

## Contents

| Property | Value |
| --- | --- |
| resources | 10 |
| primary | 7 |
| dependencies | 3 |
| graphs | 7 |
| nodes | 46 |
| composite\_bodies | 3 |
| declarations | 3 |
| structs | 0 |
| mounts | 0 |
| unresolved\_node\_types | 0 |

### Resources by class

| Class | Class id | Count |
| --- | ---: | ---: |
| ENTITY\_NODE\_GRAPH | 9 | **7** |
| COMPOSITE\_NODE\_DECL | 12 | **3** |

---

# Dump

## File `codetest_3.gia`

## Graphs (7)

| Name | Class | Class id | Guid | Kind | Service | Nodes | Declaration | Role |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- | --- |
| '*Composite with event*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741827`' | 21001 | 20000 | **9** |   |   |
| '*Cycle with no entry*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741826`' | 21001 | 20000 | **12** |   |   |
| '*Dead composite*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741825`' | 21001 | 20000 | **10** |   |   |
| '*Nested event*' | ENTITY\_NODE\_GRAPH | 9 | '`1073741828`' | 21001 | 20000 | **4** |   |   |
| '<u>\<composite\></u>*Naive execution delay*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612738`' | 21002 | 20000 | **6** | '`1610612738`' | dependency |
| '<u>\<composite\></u>*Test Delay Print*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612739`' | 21002 | 20000 | **3** | '`1610612739`' | dependency |
| '<u>\<composite\></u>*Wrapped (Custom Variable)*' | ENTITY\_NODE\_GRAPH | 9 | '`1610612737`' | 21002 | 20000 | **2** | '`1610612737`' | dependency |

---

# Refs

## Reference index

Scanned 1 file:

- `codetest_3.gia`

## References

### `composite` (3)

| composite | call |
| --- | --- |
| "**Naive execution delay**" | **5**<br>'*Composite with event*'<br>'<u>\<composite\></u>*Test Delay Print*' |
| "**Test Delay Print**" | **3**<br>'*Nested event*' |
| "**Wrapped (Custom Variable)**" | **10**<br>'*Composite with event*'<br>'*Cycle with no entry*'<br>'*Dead composite*' |

### `custom_variable` (10)

| custom\_variable | Type | get | set | trigger |
| --- | --- | --- | --- | --- |
| "**\<dynamic\>**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**1**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**2**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**4**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**5**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**A**" | *Int* | **1**<br>'*Cycle with no entry*' | **0** | **1**<br>'*Cycle with no entry*' |
| "**B**" | *Int* | **1**<br>'*Cycle with no entry*' | **0** | **1**<br>'*Cycle with no entry*' |
| "**X**" | *Int* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**Y**" | *Int* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**Z**" | *Int* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |

### `timer` (5)

| timer | Type | start | stop | listen |
| --- | --- | --- | --- | --- |
| "**1**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**2**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**3**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**4**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**Delay**" | *onetime* | **3**<br>'*Nested event*' | **0** | **3**<br>'*Nested event*' |

---

# Warns

## Warnings and limits

Scanned 1 file:

- `codetest_3.gia`

## Findings

| Level | Type | Message |
| --- | --- | --- |
| *INFO* | dynamic-reference | \[1\] **Set Custom Variable** `in#1` "Variable Name" in graph '*Dead composite*': name is computed at runtime (Data Type Conversion output "Output" is computed at runtime); cannot be resolved statically |
| *INFO* | dynamic-reference | \[2\] **Get Custom Variable** `in#1` "Variable Name" in graph '*Dead composite*': name is computed at runtime (Data Type Conversion output "Output" is computed at runtime); cannot be resolved statically |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 3/1000 |

---

## Top graphs by node count

| Graph | Effective nodes |
| --- | ---: |
| '*Composite with event*' | 39/3000 |
| '*Nested event*' | 31/3000 |
| '*Dead composite*' | 20/3000 |
| '*Cycle with no entry*' | 16/3000 |
