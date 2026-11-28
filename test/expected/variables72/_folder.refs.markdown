# Reference index

Scanned 5 files:

- `variables_beyond.gia`
- `variables_classic.gil`
- `variables_graph.gia`
- `variables_ref.gil`
- `variables_save.gil`

## References

### `custom_variable` (2)

| custom\_variable | Type | get | set |
| --- | --- | --- | --- |
| "**1\_chip\_1**" | *L\<Struct\>* | **1**<br>'*Player*' | **0** |
| "**Norm1**" | *L\<Struct\>* | **1**<br>'*Player*' | **0** |

### `graph_variable` (8)

| graph\_variable | Type | Graph | get | set |
| --- | --- | --- | --- | --- |
| "**Entity**" | *Ety* | '*New Node Graph*' | **0** | **0** |
| "**Faction**" | *Fct* | '*New Node Graph*' | **0** | **0** |
| "**Float**" | *Flt* | '*New Node Graph*' | **0** | **0** |
| "**Integer**" | *Int* | '*New Node Graph*' | **0** | **0** |
| "**Private**" | *Bol* | '*New Node Graph*' | **0** | **0** |
| "**String**" | *Str* | '*New Node Graph*' | **0** | **0** |
| "**Faction**" | *Fct* | '*Test5*' | **0** | **0** |
| "**Status**" | *Dict* | '<u>\<status\></u>*Status*' | **0** | **0** |

### `mount` (3)

| mount | player | character | entity |
| --- | --- | --- | --- |
| '*New Node Graph*' | **1**<br>PLAYER\_TEMPLATE:"**Default Template**" | **1**<br>CHARACTER\_TEMPLATE:"**Default Template(Edit Character)**" | **6**<br>OBJECT:"**Prefab\_no\_edits**"; OBJECT:"**Prefab\_edited**"; OBJECT\_ENTITY:"**Entity\_no\_edits**"; OBJECT\_ENTITY:"**Prefab\_no\_graph**"; OBJECT\_ENTITY:"**Prefab\_edited**"; OBJECT\_ENTITY:"**Entity\_edited**" |
| '*Test5*' |   | **1**<br>CHARACTER\_TEMPLATE:"**Default Template(Edit Character)**" |   |
| '*Player*' | **1**<br>PLAYER\_TEMPLATE:"**Default Template**" |   |   |

### `struct` (7)

| struct | Definition | using-declaration | field-type | graph-affiliation | pin-value |
| --- | --- | --- | --- | --- | --- |
| "**Struct**" | guid=1077936129 fields=Add variable 1\|Add variable 2\|Add variable 3\|Add variable 4 |   |   |   |   |
| "**\<struct#142\>**" | (no definition found in the scanned files) | **2**<br>'*Player*' |   |   |   |
| "**\<struct#50\>**" | (no definition found in the scanned files) | **2**<br>'*Player*' |   |   |   |
| "**Structure\_Normal\_1**" | guid=1077936129 fields=Add variable 1\|Add variable 2 |   |   |   |   |
| "**Structure\_Normal\_2**" | guid=1077936132 fields=test |   | **2**<br>Structure\_Normal\_1.Add variable 1; Structure\_Normal\_1.Add variable 2 |   |   |
| "**Structure\_Save\_1**" | guid=1077936130 fields=Add variable 1 |   |   | **2**<br>'*Player*' | **4**<br>'*Player*' |
| "**Structure\_Save\_2**" | guid=1077936131 fields=Add variable 1\|Add variable 2 |   |   |   |   |
