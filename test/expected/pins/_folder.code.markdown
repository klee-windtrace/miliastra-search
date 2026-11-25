# File `assembly_pins.gil`

## Graph '*New Node Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Nodes

\[1\] **Play Timed Effects** (93) @(-779,-262)

\[2\] **Play Timed Effects** (93) @(-367,-264.5)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Special Effects Asset" | = | id:2 | *Cfg* |   |
| `in#2` | "Attachment Point Name" | = | '`GI_RootNode`' | *Str* |   |
| `in#3` | "Move With the Target" | = | false | *Bol* |   |
| `in#4` | "Rotate With the Target" | = | false | *Bol* |   |
| `in#5` | "Location Offset" | = | (0, 0, 0) | *Vec* |   |
| `in#6` | "Rotation Offset" | = | (1, 1, 1) | *Vec* |   |
| `in#7` | "Zoom Multiplier" | = | 2.00 | *Flt* |   |
| `in#8` | "Play Built-In Sound Effect" | = | false | *Bol* |   |

\[3\] **Play Timed Effects** (93) @(580.8571,-245.64285)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[5\] **Settle Stage** (77) `in.flow#0` |   |   |
| `in#0` | "Special Effects Asset" | \<- | \[9\] **Get Node Graph Variable** (337/538) `out#0` "Variable Value" | *Cfg* |   |
| `in#1` | "Target Entity" | \<- | \[12\] **Get Node Graph Variable** (337) `out#0` "Variable Value" | *Ety* |   |
| `in#2` | "Attachment Point Name" | \<- | \[10\] **Get Node Graph Variable** (337/342) `out#0` "Variable Value" | *Str* |   |
| `in#3` | "Move With the Target" | \<- | \[11\] **Get Node Graph Variable** (337/340) `out#0` "Variable Value" | *Bol* |   |
| `in#4` | "Rotate With the Target" | \<- | \[13\] **Get Node Graph Variable** (337/340) `out#0` "Variable Value" | *Bol* |   |
| `in#5` | "Location Offset" | \<- | \[14\] **Get Node Graph Variable** (337/348) `out#0` "Variable Value" | *Vec* |   |
| `in#6` | "Rotation Offset" | \<- | \[15\] **Get Node Graph Variable** (337/348) `out#0` "Variable Value" | *Vec* |   |
| `in#7` | "Zoom Multiplier" | \<- | \[16\] **Get Node Graph Variable** (337/341) `out#0` "Variable Value" | *Flt* |   |
| `in#8` | "Play Built-In Sound Effect" | \<- | \[17\] **Get Node Graph Variable** (337/340) `out#0` "Variable Value" | *Bol* |   |

\[4\] **Settle Stage** (77) @(396.57144,-414.2143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Play Timed Effects** (93) `in.flow#0` |   |   |

\[5\] **Settle Stage** (77) @(916.5714,-412.7857)

\[9\] **Get Node Graph Variable** (337/538) variant=C\<T:Cfg\> @(22.714285,-512.2857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | null | *Cfg* |   |

\[10\] **Get Node Graph Variable** (337/342) variant=C\<T:Str\> @(106.71429,-22.285715)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | '' | *Str* |   |

\[11\] **Get Node Graph Variable** (337/340) variant=C\<T:Bol\> @(86.71429,181.71428)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | false | *Bol* |   |

\[12\] **Get Node Graph Variable** (337) @(58.714287,-238.28572)

\[13\] **Get Node Graph Variable** (337/340) variant=C\<T:Bol\> @(74.71429,369.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | false | *Bol* |   |

\[14\] **Get Node Graph Variable** (337/348) variant=C\<T:Vec\> @(42.714287,583.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | (0, 0, 0) | *Vec* |   |

\[15\] **Get Node Graph Variable** (337/348) variant=C\<T:Vec\> @(-23.285715,799.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | (0, 0, 0) | *Vec* |   |

\[16\] **Get Node Graph Variable** (337/341) variant=C\<T:Flt\> @(552.7143,595.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | 0.00 | *Flt* |   |

\[17\] **Get Node Graph Variable** (337/340) variant=C\<T:Bol\> @(518.7143,819.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | false | *Bol* |   |

## Graph '<u>\<status\></u>*New Node Graph\_1*'

- **type**: STATUS\_NODE\_GRAPH
- **guid**: '`1073741826`'

### Nodes

\[1\] **Assembly List** (169) @(-404.2857,-210)

\[2\] **Assembly Dictionary** (1788) @(-15.714286,-215.71428)

\[3\] **Assembly List** (169) @(-417.14285,80)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "0" | = | 0 | *Int* |   |
| `out#0` | "List" | = | \[\] | *L\<Int\>* |   |

\[4\] **Assembly Dictionary** (1788/1830) variant=C\<K:Int,V:Int\> @(-28.571428,74.28571)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Key 0" | = | 0 | *Int* |   |
| `in#2` | "Value 0" | = | 0 | *Int* |   |
| `out#0` | "Dictionary" | = | {} | *Dict* |   |

\[5\] **Assembly Dictionary** (1788/1830) variant=C\<K:Int,V:Int\> @(-46.666668,455)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 12 | *Int* |   |
| `in#1` | "Key 0" | = | 0 | *Int* |   |
| `in#2` | "Value 0" | = | 0 | *Int* |   |
| `in#3` | "Key 1" | = | 0 | *Int* |   |
| `in#4` | "Value 1" | = | 0 | *Int* |   |
| `in#5` | "Key 2" | = | 0 | *Int* |   |
| `in#6` | "Value 2" | = | 0 | *Int* |   |
| `in#7` | "Key 3" | = | 0 | *Int* |   |
| `in#8` | "Value 3" | = | 0 | *Int* |   |
| `in#9` | "Key 4" | = | 0 | *Int* |   |
| `in#10` | "Value 4" | = | 0 | *Int* |   |
| `in#11` | "Key 5" | = | 0 | *Int* |   |
| `in#12` | "Value 5" | = | 0 | *Int* |   |
| `out#0` | "Dictionary" | = | {} | *Dict* |   |

\[6\] **Assembly List** (169) @(-438.57144,455.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 6 | *Int* |   |
| `in#1` | "0" | = | 0 | *Int* |   |
| `in#2` | "1" | = | 0 | *Int* |   |
| `in#3` | "2" | = | 0 | *Int* |   |
| `in#4` | "3" | = | 0 | *Int* |   |
| `in#5` | "4" | = | 0 | *Int* |   |
| `in#6` | "5" | = | 0 | *Int* |   |
| `out#0` | "List" | = | \[\] | *L\<Int\>* |   |

\[7\] **Assembly Dictionary** (1788/1830) variant=C\<K:Int,V:Int\> @(1032.619,-272.0238)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 12 | *Int* |   |
| `in#1` | "Key 0" | = | 0 | *Int* |   |
| `in#2` | "Value 0" | = | 0 | *Int* |   |
| `in#3` | "Key 1" | = | 1 | *Int* |   |
| `in#4` | "Value 1" | = | 1 | *Int* |   |
| `in#5` | "Key 2" | = | 2 | *Int* |   |
| `in#6` | "Value 2" | = | 2 | *Int* |   |
| `in#7` | "Key 3" | = | 3 | *Int* |   |
| `in#8` | "Value 3" | = | 3 | *Int* |   |
| `in#9` | "Key 4" | = | 4 | *Int* |   |
| `in#10` | "Value 4" | = | 4 | *Int* |   |
| `in#11` | "Key 5" | = | 5 | *Int* |   |
| `in#12` | "Value 5" | = | 5 | *Int* |   |
| `out#0` | "Dictionary" | = | {} | *Dict* |   |

\[8\] **Assembly List** (169) @(640.7143,-271.3095)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 6 | *Int* |   |
| `in#1` | "0" | = | 0 | *Int* |   |
| `in#2` | "1" | = | 1 | *Int* |   |
| `in#3` | "2" | = | 2 | *Int* |   |
| `in#4` | "3" | = | 3 | *Int* |   |
| `in#5` | "4" | = | 4 | *Int* |   |
| `in#6` | "5" | = | 5 | *Int* |   |
| `out#0` | "List" | = | \[\] | *L\<Int\>* |   |

\[11\] **Assembly List** (169) @(762.9365,1143.8016)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 6 | *Int* |   |
| `in#1` | "0" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#1` | "0" | = | 0 | *Int* | also wired |
| `in#2` | "1" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#2` | "1" | = | 0 | *Int* | also wired |
| `in#3` | "2" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#3` | "2" | = | 0 | *Int* | also wired |
| `in#4` | "3" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#4` | "3" | = | 0 | *Int* | also wired |
| `in#5` | "4" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#5` | "4" | = | 0 | *Int* | also wired |
| `in#6` | "5" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#6` | "5" | = | 0 | *Int* | also wired |
| `out#0` | "List" | = | \[\] | *L\<Int\>* |   |

\[12\] **Assembly Dictionary** (1788/1830) variant=C\<K:Int,V:Int\> @(1154.8413,1143.0873)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 12 | *Int* |   |
| `in#1` | "Key 0" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#1` | "Key 0" | = | 0 | *Int* | also wired |
| `in#2` | "Value 0" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#2` | "Value 0" | = | 0 | *Int* | also wired |
| `in#3` | "Key 1" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#3` | "Key 1" | = | 0 | *Int* | also wired |
| `in#4` | "Value 1" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#4` | "Value 1" | = | 0 | *Int* | also wired |
| `in#5` | "Key 2" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#5` | "Key 2" | = | 0 | *Int* | also wired |
| `in#6` | "Value 2" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#6` | "Value 2" | = | 0 | *Int* | also wired |
| `in#7` | "Key 3" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#7` | "Key 3" | = | 0 | *Int* | also wired |
| `in#8` | "Value 3" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#8` | "Value 3" | = | 0 | *Int* | also wired |
| `in#9` | "Key 4" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#9` | "Key 4" | = | 0 | *Int* | also wired |
| `in#10` | "Value 4" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#10` | "Value 4" | = | 0 | *Int* | also wired |
| `in#11` | "Key 5" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#11` | "Key 5" | = | 0 | *Int* | also wired |
| `in#12` | "Value 5" | \<- | \[13\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#12` | "Value 5" | = | 0 | *Int* | also wired |
| `out#0` | "Dictionary" | = | {} | *Dict* |   |

\[13\] **Addition** (200) @(590.8889,851.44446)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` |   | = | 0 | *Int* |   |
| `in#1` |   | = | 0 | *Int* |   |
| `out#0` | "Result" | = | 0 | *Int* |   |

## Graph '<u>\<skill\></u>*New Character Skill Node Graph*'

- **type**: SKILL\_NODE\_GRAPH
- **guid**: '`1082130433`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

\[2\] **Get Ray Detection Result** (200109/1047) @(350.42856,-332.14285)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Launch Location" | = | (0, 0, 0) | *Vec* | default |
| `in#2` | "Launch Direction" | = | (0, 0, 0) | *Vec* | default |
| `in#3` | "Max Ray Length" | = | 0.00 | *Flt* | default |
| `in#4` | "Faction Filter" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#5` | "Entity Type Filter" | = | \[\] | *L\<Enum\>* | default |
| `in#6` | "Hit Layer Filter" | = | \[\] | *L\<Enum\>* | default |
| `out#0` | "On-Hit Location" | = | (0, 0, 0) | *Vec* | default |

\[3\] **Get Ray Detection Result** (200109/1047) @(881.4286,-330)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Launch Location" | = | (0, 0, 0) | *Vec* |   |
| `in#2` | "Launch Direction" | = | (1, 1, 1) | *Vec* |   |
| `in#3` | "Max Ray Length" | = | 2.00 | *Flt* |   |
| `in#4` | "Faction Filter" | = | enum:2005«All» | *Enum* |   |
| `in#5` | "Entity Type Filter" | = | \[\] | *L\<Enum\>* | default |
| `in#6` | "Hit Layer Filter" | = | \[\] | *L\<Enum\>* | default |
| `out#0` | "On-Hit Location" | = | (0, 0, 0) | *Vec* | default |

\[5\] **Get Local Variable** (200082/1036) @(1980,-554.2857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Variable Name" | = | '' | *Str* | default |

\[6\] **Get Local Variable** (200082/1036) @(1475.7142,-450)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Variable Name" | = | '' | *Str* | default |
| `out#0` | "Variable Value" | = | (0, 0, 0) | *Vec* |   |

\[7\] **Get Local Variable** (200082/1036) @(1487.1428,-242.85715)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Variable Name" | = | '' | *Str* | default |
| `out#0` | "Variable Value" | = | (0, 0, 0) | *Vec* |   |

\[9\] **Get Ray Detection Result** (200109/1047) @(1980,-324.2857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Detect Initiator Entity" | \<- | \[5\] **Get Local Variable** (200082/1036) `out#0` "Variable Value" | *Ety* |   |
| `in#1` | "Launch Location" | \<- | \[6\] **Get Local Variable** (200082/1036) `out#0` "Variable Value" | *Vec* |   |
| `in#1` | "Launch Location" | = | (0, 0, 0) | *Vec* | default, also wired |
| `in#2` | "Launch Direction" | \<- | \[7\] **Get Local Variable** (200082/1036) `out#0` "Variable Value" | *Vec* |   |
| `in#2` | "Launch Direction" | = | (0, 0, 0) | *Vec* | default, also wired |
| `in#3` | "Max Ray Length" | \<- | \[10\] **Get Local Variable** (200082/1036) `out#0` "Variable Value" | *Flt* |   |
| `in#3` | "Max Ray Length" | = | 0.00 | *Flt* | default, also wired |
| `in#4` | "Faction Filter" | = | enum:2000«None \| Don't Find Target» | *Enum* |   |
| `in#5` | "Entity Type Filter" | \<- | \[11\] **Get Entity Type List** (200050/1031) `out#0` "List" | *L\<Enum\>* |   |
| `in#5` | "Entity Type Filter" | = | \[\] | *L\<Enum\>* | default, also wired |
| `in#6` | "Hit Layer Filter" | \<- | \[12\] **Get Ray Filter Type List** (200110/1031) `out#0` "List" | *L\<Enum\>* |   |
| `in#6` | "Hit Layer Filter" | = | \[\] | *L\<Enum\>* | default, also wired |
| `out#0` | "On-Hit Location" | = | (0, 0, 0) | *Vec* | default |

\[10\] **Get Local Variable** (200082/1036) @(1448.5714,-62.857143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Variable Name" | = | '' | *Str* | default |
| `out#0` | "Variable Value" | = | 0.00 | *Flt* |   |

\[11\] **Get Entity Type List** (200050/1031) @(1490,132.85715)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 1 | *Int* | default |
| `in#1` | "0" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#2` | "1" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#3` | "2" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#4` | "3" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#5` | "4" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#6` | "5" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#7` | "6" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#8` | "7" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#9` | "8" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#10` | "9" | = | enum:0«No \| Default \| None» | *Enum* | default |

\[12\] **Get Ray Filter Type List** (200110/1031) @(1740,355.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Count" | = | 0 | *Int* | default |
| `in#1` | "0" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#2` | "1" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#3` | "2" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#4` | "3" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#5` | "4" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#6` | "5" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#7` | "6" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#8` | "7" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#9` | "8" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `in#10` | "9" | = | enum:0«No \| Default \| None» | *Enum* | default |
| `out#0` | "List" | = | \[\] | *L\<Enum\>* | default |

\[13\] **Taunt Target** (200089/2000) @(81.42857,426.03174)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `meta.rpc#0` |   | = | 0 | *Int* | default |

\[14\] **Taunt Target** (200089/2000) @(770.31744,419.92062)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Taunter Entity" | \<- | \[15\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Target Entity" | \<- | \[16\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" | *Ety* |   |
| `meta.rpc#0` |   | = | 0 | *Int* | default |

\[15\] **Get Self Entity** (200033/1013) @(440.31747,416.5873)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Self Entity" | = | null | *Ety* | default |

\[16\] **Get Self Entity** (200033/1013) @(436.98413,555.4762)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Self Entity" | = | null | *Ety* | default |

\[17\] **Get Self Entity** (200033/1013) @(448.09525,247.69841)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Self Entity" | = | null | *Ety* | default |

## Graph '<u>\<creation\></u>*New Creation Status Node Graph*'

- **type**: CREATION\_STATUS\_GRAPH
- **guid**: '`1082130435`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

\[2\] **Tactic: Ground Escape** (200138/4019) @(489,-153)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Execute" | = | true | *Bol* | default |
| `in#1` | "Escape Trigger Distance" | = | 0.00 | *Flt* | default |
| `in#2` | "Movement Speed" | = | enum:3601«Walk» | *Enum* | default |
| `in#3` | "Maximum Escape Angle" | = | 0.00 | *Flt* | default |
| `in#4` | "Minimum Escape Segments" | = | 0 | *Int* | default |
| `in#5` | "Maximum Escape Segments" | = | 0 | *Int* | default |
| `in#6` | "Minimum Escape Distance" | = | 0.00 | *Flt* | default |
| `in#7` | "Maximum Escape Distance" | = | 0.00 | *Flt* | default |
| `in#8` | "Escape Trigger CD" | = | 1.00 | *Flt* | default |
| `in#9` | "Clear aggro and cancel tactic after countdown" | = | 0.00 | *Flt* | default |
| `in#10` | "Whether restricted by territory" | = | true | *Bol* | default |
| `in#11` | "Tactical Context" | = | '' | *Str* | default |
| `in#12` | "Can skill be interrupted" | = | false | *Bol* | default |

\[3\] **Tactic: Ground Escape** (200138/4019) @(2220.5715,-276.0238)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Failed Execution" | -\> | \[5\] **Double Branch** (200125/4001) `in.flow#0` |   |   |
| `in#0` | "Execute" | \<- | \[7\] **Equal** (200179) `out#0` "Result" | *Bol* |   |
| `in#0` | "Execute" | = | true | *Bol* | default, also wired |
| `in#1` | "Escape Trigger Distance" | \<- | \[8\] **Addition** (200184/31) `out#0` "Result" | *Flt* |   |
| `in#1` | "Escape Trigger Distance" | = | 0.00 | *Flt* | default, also wired |
| `in#2` | "Movement Speed" | = | enum:3602«Run» | *Enum* |   |
| `in#3` | "Maximum Escape Angle" | \<- | \[9\] **Addition** (200184/31) `out#0` "Result" | *Flt* |   |
| `in#3` | "Maximum Escape Angle" | = | 0.00 | *Flt* | default, also wired |
| `in#4` | "Minimum Escape Segments" | \<- | \[10\] **Addition** (200184/30) `out#0` "Result" | *Int* |   |
| `in#4` | "Minimum Escape Segments" | = | 0 | *Int* | default, also wired |
| `in#5` | "Maximum Escape Segments" | \<- | \[11\] **Addition** (200184/30) `out#0` "Result" | *Int* |   |
| `in#5` | "Maximum Escape Segments" | = | 0 | *Int* | default, also wired |
| `in#6` | "Minimum Escape Distance" | \<- | \[12\] **Addition** (200184/31) `out#0` "Result" | *Flt* |   |
| `in#6` | "Minimum Escape Distance" | = | 0.00 | *Flt* | default, also wired |
| `in#7` | "Maximum Escape Distance" | \<- | \[13\] **Addition** (200184/31) `out#0` "Result" | *Flt* |   |
| `in#7` | "Maximum Escape Distance" | = | 0.00 | *Flt* | default, also wired |
| `in#8` | "Escape Trigger CD" | \<- | \[14\] **Addition** (200184/31) `out#0` "Result" | *Flt* |   |
| `in#8` | "Escape Trigger CD" | = | 1.00 | *Flt* | default, also wired |
| `in#9` | "Clear aggro and cancel tactic after countdown" | \<- | \[15\] **Addition** (200184/31) `out#0` "Result" | *Flt* |   |
| `in#9` | "Clear aggro and cancel tactic after countdown" | = | 0.00 | *Flt* | default, also wired |
| `in#10` | "Whether restricted by territory" | \<- | \[16\] **Equal** (200179) `out#0` "Result" | *Bol* |   |
| `in#10` | "Whether restricted by territory" | = | true | *Bol* | default, also wired |
| `in#11` | "Tactical Context" | = | '` `' | *Str* |   |
| `in#12` | "Can skill be interrupted" | \<- | \[17\] **Equal** (200179) `out#0` "Result" | *Bol* |   |
| `in#12` | "Can skill be interrupted" | = | false | *Bol* | default, also wired |

\[4\] **Double Branch** (200125/4001) @(1874.8572,-600.3095)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "No" | -\> | \[3\] **Tactic: Ground Escape** (200138/4019) `in.flow#0` |   |   |
| `in#0` | "Condition" | = | false | *Bol* | default |

\[5\] **Double Branch** (200125/4001) @(2734.8572,-537.4524)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Condition" | = | false | *Bol* | default |

\[6\] **Tactic: Ground Escape** (200138/4019) @(1096.5238,-125.666664)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Execute" | = | false | *Bol* |   |
| `in#1` | "Escape Trigger Distance" | = | 1.00 | *Flt* |   |
| `in#2` | "Movement Speed" | = | enum:3602«Run» | *Enum* |   |
| `in#3` | "Maximum Escape Angle" | = | 2.00 | *Flt* |   |
| `in#4` | "Minimum Escape Segments" | = | 3 | *Int* |   |
| `in#5` | "Maximum Escape Segments" | = | 4 | *Int* |   |
| `in#6` | "Minimum Escape Distance" | = | 5.00 | *Flt* |   |
| `in#7` | "Maximum Escape Distance" | = | 6.00 | *Flt* |   |
| `in#8` | "Escape Trigger CD" | = | 7.00 | *Flt* |   |
| `in#9` | "Clear aggro and cancel tactic after countdown" | = | 8.00 | *Flt* |   |
| `in#10` | "Whether restricted by territory" | = | false | *Bol* |   |
| `in#11` | "Tactical Context" | = | '`9`' | *Str* |   |
| `in#12` | "Can skill be interrupted" | = | true | *Bol* |   |

\[7\] **Equal** (200179) @(1786.381,-363.66666)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:100«Comparison Operators\_Equal To» | *Enum* | default |
| `out#0` | "Result" | = | false | *Bol* | default |

\[8\] **Addition** (200184/31) variant=C\<T:Flt\> @(1626.8572,-108.42857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0.00 | *Flt* |   |
| `in#2` |   | = | 0.00 | *Flt* |   |
| `out#0` | "Result" | = | 0.00 | *Flt* |   |

\[9\] **Addition** (200184/31) variant=C\<T:Flt\> @(1663.0476,59.666668)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0.00 | *Flt* |   |
| `in#2` |   | = | 0.00 | *Flt* |   |
| `out#0` | "Result" | = | 0.00 | *Flt* |   |

\[10\] **Addition** (200184/30) variant=C\<T:Int\> @(1633.0476,233)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0 | *Int* |   |
| `in#2` |   | = | 0 | *Int* |   |
| `out#0` | "Result" | = | 0 | *Int* |   |

\[11\] **Addition** (200184/30) variant=C\<T:Int\> @(1649.7142,409.66666)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0 | *Int* |   |
| `in#2` |   | = | 0 | *Int* |   |
| `out#0` | "Result" | = | 0 | *Int* |   |

\[12\] **Addition** (200184/31) variant=C\<T:Flt\> @(1623.0476,618)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0.00 | *Flt* |   |
| `in#2` |   | = | 0.00 | *Flt* |   |
| `out#0` | "Result" | = | 0.00 | *Flt* |   |

\[13\] **Addition** (200184/31) variant=C\<T:Flt\> @(1644.7142,833)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0.00 | *Flt* |   |
| `in#2` |   | = | 0.00 | *Flt* |   |
| `out#0` | "Result" | = | 0.00 | *Flt* |   |

\[14\] **Addition** (200184/31) variant=C\<T:Flt\> @(1623.0476,1056.3334)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0.00 | *Flt* |   |
| `in#2` |   | = | 0.00 | *Flt* |   |
| `out#0` | "Result" | = | 0.00 | *Flt* |   |

\[15\] **Addition** (200184/31) variant=C\<T:Flt\> @(2238.0476,843)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:300«Mathematical Operators\_Addition» | *Enum* | default |
| `in#1` |   | = | 0.00 | *Flt* |   |
| `in#2` |   | = | 0.00 | *Flt* |   |
| `out#0` | "Result" | = | 0.00 | *Flt* |   |

\[16\] **Equal** (200179) @(2274.7144,1053)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:100«Comparison Operators\_Equal To» | *Enum* | default |
| `out#0` | "Result" | = | false | *Bol* | default |

\[17\] **Equal** (200179) @(2704.7144,1138)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "op" | = | enum:100«Comparison Operators\_Equal To» | *Enum* | default |
| `out#0` | "Result" | = | false | *Bol* | default |

## Graph '<u>\<creation\></u>*New Creation Status Decision Node Graph*'

- **type**: CREATION\_STATUS\_DECISION\_GRAPH
- **guid**: '`1082130434`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

\[2\] **Multiple Branches** (200127) @(447,-38)

\[3\] **Multiple Branches** (200127/4002) @(831,-42)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Control Expression" | = | 0 | *Int* |   |
| `in#1` | "valid\_pin\_list" | = | \[\] | *L\<Int\>* |   |

\[4\] **Multiple Branches** (200127/4002) @(1174,-48)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Control Expression" | = | '' | *Str* |   |
| `in#1` | "valid\_pin\_list" | = | \[\] | *L\<Str\>* |   |

\[5\] **Multiple Branches** (200127/4002) @(2218,-76)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Control Expression" | = | 0 | *Int* |   |
| `in#1` | "valid\_pin\_list" | = | \[0, 0, 0, 0, 0, 0, 0, 0, 0, 0\] | *L\<Int\>* |   |

\[6\] **Multiple Branches** (200127/4002) @(1617,-55)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Default" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#1` | "1" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#2` | "2" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#3` | "3" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#4` | "4" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#5` | "5" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#6` | "6" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#7` | "7" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#8` | "8" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#9` | "9" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `out.flow#10` | "10" | -\> | \[5\] **Multiple Branches** (200127/4002) `in.flow#0` |   |   |
| `in#0` | "Control Expression" | = | 0 | *Int* |   |
| `in#1` | "valid\_pin\_list" | = | \[0, 0, 0, 0, 0, 0, 0, 0, 0, 0\] | *L\<Int\>* |   |
