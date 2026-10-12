# Reference index

Scanned 8 files:

- `test/cases/gil/stage_0.gil`
- `test/cases/gil/stage_012379.gil`
- `test/cases/gil/stage_1.gil`
- `test/cases/gil/stage_2.gil`
- `test/cases/gil/stage_3.gil`
- `test/cases/gil/stage_6.gil`
- `test/cases/gil/stage_7.gil`
- `test/cases/gil/stage_9.gil`

## References

### `composite` (2)

| composite | call |
| --- | --- |
| "**Create Composite Node**" | **4**<br>'*New Node Graph*' |
| "**Create Composite Node(1)**" | **2**<br>'*New Node Graph*' |

### `custom_variable` (1)

| custom\_variable | Type | get | set |
| --- | --- | --- | --- |
| "**test**" | *Int* | **2**<br>'<u>\<filter\></u>*New Filter Node Graph\_1*' | **0** |

### `graph_variable` (2)

| graph\_variable | Type | Graph | get | set |
| --- | --- | --- | --- | --- |
| "**Graph\_Var**" | *Ety* | '*Graph*' | **1** | **0** |
| "**Graph\_Var**" | *Ety* | '*Graph*' | **1** | **0** |

### `literal_id` (4)

| literal\_id | Ref |
| --- | --- |
| "**Cfg:1082130437**" | **2**<br>'<u>\<creation\></u>*New Creation Status Decision Node Graph*' |
| "**Cfg:2**" | **2**<br>'<u>\<skill\></u>*New Character Skill Node Graph*' |
| "**Cfg:6**" | **2**<br>'*Send*' |
| "**Pfb:5**" | **2**<br>'*Send*' |

### `signal` (3)

| signal | listen | send |
| --- | --- | --- |
| "**Signal\_1**" | **4**<br>'*Both*'<br>'*Receive*' | **4**<br>'*Both*'<br>'*Send*' |
| "**Signal\_2**" | **4**<br>'*Both*'<br>'*Receive*' | **4**<br>'*Both*'<br>'*Send*' |
| "**Signal\_3**" | **0** | **0** |

### `struct` (6)

| struct | Definition | modify | field-type | assemble | split |
| --- | --- | --- | --- | --- | --- |
| "**Structure**" | guid=1077936129 fields=Add variable 1 | **1**<br>'*Structs*' | **2**<br>Structure\_1.Add variable 3; Structure\_1.Add variable 4 | **1**<br>'*Structs*' | **1**<br>'*Structs*' |
| "**Structure\_1**" | guid=1077936130 fields=Add variable 1\|Add variable 2\|Add variable 3\|Add variable 4 | **1**<br>'*Structs*' |   | **1**<br>'*Structs*' | **1**<br>'*Structs*' |
| "**Structure\_2**" | guid=1077936131 fields= |   |   |   |   |
| "**Structure**" | guid=1077936129 fields=Add variable 1 | **1**<br>'*Structs*' | **2**<br>Structure\_1.Add variable 3; Structure\_1.Add variable 4 | **1**<br>'*Structs*' | **1**<br>'*Structs*' |
| "**Structure\_1**" | guid=1077936130 fields=Add variable 1\|Add variable 2\|Add variable 3\|Add variable 4 | **1**<br>'*Structs*' |   | **1**<br>'*Structs*' | **1**<br>'*Structs*' |
| "**Structure**" | guid=1077936129 fields= |   |   |   |   |

### `timer` (1)

| timer | listen |
| --- | --- |
| "**\* (listener for any name)**" | **2**<br>'*Send*' |
