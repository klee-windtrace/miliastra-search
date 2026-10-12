# Reference index

Scanned 10 files:

- `test/cases/gia/sample_0_main.gia`
- `test/cases/gia/sample_1.gia`
- `test/cases/gia/sample_2.gia`
- `test/cases/gia/sample_3.gia`
- `test/cases/gia/sample_4.gia`
- `test/cases/gia/sample_5.gia`
- `test/cases/gia/sample_6.gia`
- `test/cases/gia/sample_7.gia`
- `test/cases/gia/sample_8.gia`
- `test/cases/gia/sample_9.gia`

## References

### `composite` (2)

| composite | call |
| --- | --- |
| "**Create Composite Node**" | **2**<br>'*New Node Graph*' |
| "**Create Composite Node(1)**" | **1**<br>'*New Node Graph*' |

### `custom_variable` (3)

| custom\_variable | Type | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- |
| "**\* (listener for any name)**" |   |   |   |   | **1**<br>'*Variables*' |
| "**test**" | *Int* | **1**<br>'<u>\<filter\></u>*New Filter Node Graph\_1*' | **0** |   |   |
| "**Test**" | *Int* | **1**<br>'*Variables*' | **0** | **1**<br>'*Variables*' |   |

### `graph_variable` (4)

| graph\_variable | Type | Graph | get | set | listen |
| --- | --- | --- | --- | --- | --- |
| "**Graph\_Var**" | *Ety* | '*Graph*' | **1** | **0** |   |
| "**\* (listener for any name)**" |   |   |   |   | **1**<br>'*Variables*' |
| "**Variable\_1**" | *Bol* | '*Variables*' | **1** | **1** |   |
| "**Graph\_Var**" | *Ety* | '*Graph*' | **1** | **0** |   |

### `literal_id` (6)

| literal\_id | Ref |
| --- | --- |
| "**Cfg:10**" | **1**<br>'*Lists*' |
| "**Cfg:1082130435**" | **1**<br>'<u>\<creation\></u>*New Creation Status Decision Node Graph*' |
| "**Cfg:2**" | **1**<br>'<u>\<skill\></u>*New Character Skill Node Graph*' |
| "**Cfg:6**" | **1**<br>'*Send*' |
| "**Pfb:20**" | **1**<br>'*Lists*' |
| "**Pfb:5**" | **1**<br>'*Send*' |

### `signal` (2)

| signal | listen | send |
| --- | --- | --- |
| "**Signal\_1**" | **2**<br>'*Both*'<br>'*Receive*' | **2**<br>'*Both*'<br>'*Send*' |
| "**Signal\_2**" | **2**<br>'*Both*'<br>'*Receive*' | **2**<br>'*Both*'<br>'*Send*' |

### `struct` (3)

| struct | Definition | modify | field-type | assemble | split |
| --- | --- | --- | --- | --- | --- |
| "**Structure**" | guid=1077936129 fields=Add variable 1 | **1**<br>'*Structs*' | **2**<br>Structure\_1.Add variable 3; Structure\_1.Add variable 4 | **1**<br>'*Structs*' | **1**<br>'*Structs*' |
| "**Structure\_1**" | guid=1077936130 fields=Add variable 1\|Add variable 2\|Add variable 3\|Add variable 4 | **1**<br>'*Structs*' |   | **1**<br>'*Structs*' | **1**<br>'*Structs*' |
| "**Structure**" | guid=1077936129 fields= |   |   |   |   |

### `timer` (1)

| timer | listen |
| --- | --- |
| "**\* (listener for any name)**" | **1**<br>'*Send*' |
