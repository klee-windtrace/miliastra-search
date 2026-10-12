# File `test/cases/gil/stage_0.gil`

## Graph '*Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Variables

| Name | Type | Public | Struct | Value |
| --- | --- | --- | --- | --- |
| **Graph\_Var** | *Ety* | false |   |   |

### Comments

- '`Comment`' @(-193,-100)

### Nodes

\[1\] **When Entity Is Created** (71) @(-219,48)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Double Branch** (2) `in.flow#0` |   |   |

\[2\] **Get Self Entity** (73) @(221.28572,-430.57144)

\[3\] **Equal** (14/16) variant=C\<T:Ety\> @(107.57143,-232.42857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Input 1" | \<- | \[2\] **Get Self Entity** (73) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Input 2" | \<- | \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" | *Ety* |   |

\[4\] **Double Branch** (2) @(214.57143,48.57143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Yes" | -\> | \[5\] **Print String** (1) `in.flow#0` |   |   |
| `out.flow#1` | "No" | -\> | \[6\] **Destroy Entity** (69) `in.flow#0` |   |   |
| `in#0` | "Condition" | \<- | \[3\] **Equal** (14/16) `out#0` "Result" | *Bol* |   |

\[5\] **Print String** (1) @(814,-200.84126)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | = | '`Created`' | *Str* |   |

\[6\] **Destroy Entity** (69) @(795.1111,250.26984)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[8\] **Get Node Graph Variable** (337) `out#0` "Variable Value" | *Ety* |   |

\[8\] **Get Node Graph Variable** (337) @(769.55554,25.825397)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Variable Name" | = | '`Graph_Var`' | *Str* |   |

## Graph '<u>\<status\></u>*Empty*'

- **type**: STATUS\_NODE\_GRAPH
- **guid**: '`1073741826`'

# File `test/cases/gil/stage_012379.gil`

## Decl "**Signal\_2**"

- **type**: SIGNAL\_NODE\_DECL
- **guid**: '`1073741831`'

- SEND\_SIGNAL name='`Signal_2`' server\_node=1073741830 client\_node=1073741832

| Pin | Name | Type | Details |
| --- | --- | --- | --- |
| `in.flow#0` |   |   |  uid=30 |
| `out.flow#0` |   |   |  uid=31 |
| `in#0` | "Parameter\_1" | *Int* |  uid=42 |
| `in#1` | "Parameter\_2" | *Flt* |  uid=43 |
| `in#2` | "Parameter\_3" | *Vec* |  uid=44 |
| `in#3` | "Parameter\_4" | *Bol* |  enum\_family=1 uid=45 |
| `in#4` | "Parameter\_5" | *Gid* |  uid=46 |
| `in#5` | "Parameter\_6" | *Ety* |  uid=47 |
| `in#6` | "Parameter\_7" | *Pfb* |  uid=48 |
| `in#7` | "Parameter\_8" | *Cfg* |  uid=49 |
| `in#8` | "Parameter\_9" | *L\<Int\>* |  uid=50 |
| `in#9` | "Parameter\_10" | *Str* |  uid=72 |
| `meta#0` | "Signal Name" |   |  uid=32 |

## Decl "**Signal\_1**"

- **type**: SIGNAL\_NODE\_DECL
- **guid**: '`1073741828`'

- SEND\_SIGNAL name='`Signal_1`' server\_node=1073741827 client\_node=1073741829

| Pin | Name | Type | Details |
| --- | --- | --- | --- |
| `in.flow#0` |   |   |  uid=18 |
| `out.flow#0` |   |   |  uid=19 |
| `meta#0` | "Signal Name" |   |  uid=20 |

## Decl "**Signal\_3**"

- **type**: SIGNAL\_NODE\_DECL
- **guid**: '`1073741851`'

- SEND\_SIGNAL name='`Signal_3`' server\_node=1073741852 client\_node=1073741853

| Pin | Name | Type | Details |
| --- | --- | --- | --- |
| `in.flow#0` |   |   |  uid=178 |
| `out.flow#0` |   |   |  uid=179 |
| `meta#0` | "Signal Name" |   |  uid=180 |

## Struct "**Structure**"

- **guid**: '`1077936129`'
- **id**: 1077936129
- **version**: 7

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *Str* |   |

## Struct "**Structure\_1**"

- **guid**: '`1077936130`'
- **id**: 1077936130
- **version**: 5

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *L\<Str\>* |   |
| 2 | "**Add variable 2**" | *Int* |   |
| 3 | "**Add variable 3**" | *Struct* | Structure |
| 4 | "**Add variable 4**" | *L\<Struct\>* | Structure |

## Struct "**Structure\_2**"

- **guid**: '`1077936131`'
- **id**: 1077936131
- **version**: 3

## Graph '*Both*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741832`'

### Nodes

\[2\] **Monitor Signal** (1073741827) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-293,-150) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Send Signal** (1073741828) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[4\] **Send Signal** (1073741828) user=SEND\_SIGNAL signal='`Signal_1`' @(207,-148) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Send Signal** (1073741831) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[6\] **Send Signal** (1073741831) user=SEND\_SIGNAL signal='`Signal_2`' @(583,-153) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#8` | "Parameter\_9" | \<- | \[7\] **Monitor Signal** (1073741830) `out#11` "Parameter\_9" | *L\<Int\>* |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

\[7\] **Monitor Signal** (1073741830) user=LISTEN\_SIGNAL signal='`Signal_2`' @(102.85714,143.28572) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Send Signal** (1073741831) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

## Graph '*Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Variables

| Name | Type | Public | Struct | Value |
| --- | --- | --- | --- | --- |
| **Graph\_Var** | *Ety* | false |   |   |

### Comments

- '`Comment`' @(-193,-100)

### Nodes

\[1\] **When Entity Is Created** (71) @(-219,48)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Double Branch** (2) `in.flow#0` |   |   |

\[2\] **Get Self Entity** (73) @(221.28572,-430.57144)

\[3\] **Equal** (14/16) variant=C\<T:Ety\> @(107.57143,-232.42857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Input 1" | \<- | \[2\] **Get Self Entity** (73) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Input 2" | \<- | \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" | *Ety* |   |

\[4\] **Double Branch** (2) @(214.57143,48.57143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Yes" | -\> | \[5\] **Print String** (1) `in.flow#0` |   |   |
| `out.flow#1` | "No" | -\> | \[6\] **Destroy Entity** (69) `in.flow#0` |   |   |
| `in#0` | "Condition" | \<- | \[3\] **Equal** (14/16) `out#0` "Result" | *Bol* |   |

\[5\] **Print String** (1) @(814,-200.84126)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | = | '`Created`' | *Str* |   |

\[6\] **Destroy Entity** (69) @(795.1111,250.26984)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[8\] **Get Node Graph Variable** (337) `out#0` "Variable Value" | *Ety* |   |

\[8\] **Get Node Graph Variable** (337) @(769.55554,25.825397)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Variable Name" | = | '`Graph_Var`' | *Str* |   |

## Graph '*New Node Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741827`'

### Nodes

\[1\] **Create Composite Node** (1073741825) user=COMPOSITE @(514.5714,126.28571)

\[3\] **When Tab Is Selected** (307) @(-329,128)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[9\] **Multiple Branches** (3) `in.flow#0` |   |   |

\[4\] **Set Preset Status** (66) @(1016,306.14285)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[16\] **Set Local Variable** (19/2677) `in.flow#0` |   |   |
| `in#0` | "Target Entity" | \<- | \[3\] **When Tab Is Selected** (307) `out#0` "Event Source Entity" | *Ety* |   |
| `in#1` | "Preset Status Index" | \<- | \[5\] **Create Composite Node** (1073741825) `out#0` "Value" | *Int* |   |
| `in#2` | "Preset Status Value" | \<- | \[5\] **Create Composite Node** (1073741825) `out#0` "Value" | *Int* |   |

\[5\] **Create Composite Node** (1073741825) user=COMPOSITE @(1063,118.14286)

\[9\] **Multiple Branches** (3) @(33.57143,126.71429)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "1" | -\> | \[15\] **Create Composite Node(1)** (1073741826) `in.flow#0` |   |   |
| `in#0` | "Control Expression" | \<- | \[3\] **When Tab Is Selected** (307) `out#2` "Tab ID" | *Int* |   |

\[15\] **Create Composite Node(1)** (1073741826) user=COMPOSITE @(480.42856,307)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Yes" | -\> | \[4\] **Set Preset Status** (66) `in.flow#0` |   |   |
| `in#0` | "Input" | \<- | \[1\] **Create Composite Node** (1073741825) `out#0` "Value" | *Int* |   |
| `in#1` | "3D Vector" | = | (1, 2, 3) | *Vec* |   |

\[16\] **Set Local Variable** (19/2677) variant=C\<T:Flt\> @(1517.8572,305.2857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Value" | \<- | \[15\] **Create Composite Node(1)** (1073741826) `out#0` "X-Component" | *Flt* |   |

## Graph '*New Node Graph\_2*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741834`'

## Graph '*Receive*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741830`'

### Nodes

\[2\] **Monitor Signal** (1073741827) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-286,-207) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[5\] **Monitor Signal** (1073741830) user=LISTEN\_SIGNAL signal='`Signal_2`' @(-284,98) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Print String** (1) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

\[6\] **Print String** (1) @(223,96)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | \<- | \[5\] **Monitor Signal** (1073741830) `out#12` "Parameter\_10" | *Str* |   |

## Graph '*Send*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741831`'

### Nodes

\[2\] **Send Signal** (1073741828) user=SEND\_SIGNAL signal='`Signal_1`' @(-172.85715,-372.7143) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[4\] **Send Signal** (1073741831) user=SEND\_SIGNAL signal='`Signal_2`' @(-197,-101) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Parameter\_1" | \<- | \[5\] **When Timer Is Triggered** (83) `out#3` "Timer Sequence ID" | *Int* |   |
| `in#1` | "Parameter\_2" | = | 4 | *Flt* |   |
| `in#2` | "Parameter\_3" | = | (1, 2, 3) | *Vec* |   |
| `in#3` | "Parameter\_4" | = | Yes | *Bol* |   |
| `in#4` | "Parameter\_5" | \<- | \[5\] **When Timer Is Triggered** (83) `out#1` "Event Source GUID" | *Gid* |   |
| `in#5` | "Parameter\_6" | \<- | \[5\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" | *Ety* |   |
| `in#6` | "Parameter\_7" | = | id:5 | *Pfb* |   |
| `in#7` | "Parameter\_8" | = | id:6 | *Cfg* |   |
| `in#9` | "Parameter\_10" | \<- | \[5\] **When Timer Is Triggered** (83) `out#2` "Timer Name" | *Str* |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

\[5\] **When Timer Is Triggered** (83) @(-582,-100)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Send Signal** (1073741831) `in.flow#0` |   |   |

## Graph '*Structs*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741833`'

### Nodes

\[2\] **Modify Structure** (1073741835) user=STRUCT\_MODIFY struct='`Structure`' @(-291,-272)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[10\] **Modify Structure** (1073741844) `in.flow#0` |   |   |
| `in#0` | "Structure" | \<- | \[4\] **Assemble Structure** (1073741833) `out#0` "Structure" | *Struct* |   |
| `in#2` | "是否设置\_Add variable 1" | \<- | \[6\] **Split Structure** (1073741834) `out#0` "Add variable 1" | *Str* |   |
| `in#3` | "是否设置\_Add variable 1" | = | Yes | *Bol* |   |

\[4\] **Assemble Structure** (1073741833) user=STRUCT\_ASSEMBLY struct='`Structure`' @(-1207,-226)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Add variable 1" | = | '`9`' | *Str* |   |

\[6\] **Split Structure** (1073741834) user=STRUCT\_SPLIT struct='`Structure`' @(-788,-86)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Structure" | \<- | \[4\] **Assemble Structure** (1073741833) `out#0` "Structure" | *Struct* |   |

\[8\] **When Entity Is Removed/Destroyed** (72) @(-788,-424)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Modify Structure** (1073741835) `in.flow#0` |   |   |

\[10\] **Modify Structure** (1073741844) user=STRUCT\_MODIFY struct='`Structure_1`' @(150.14285,-270.42856)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#2` | "是否设置\_Add variable 1" | \<- | \[14\] **Split Structure** (1073741843) `out#0` "Add variable 1" | *L\<Str\>* |   |
| `in#3` | "Add variable 2" | = | Yes | *Bol* |   |
| `in#5` | "Add variable 3" | = | No | *Bol* |   |
| `in#6` | "是否设置\_Add variable 3" | \<- | \[4\] **Assemble Structure** (1073741833) `out#0` "Structure" | *Struct* |   |
| `in#7` | "Add variable 4" | = | Yes | *Bol* |   |
| `in#9` | "是否设置\_Add variable 4" | = | No | *Bol* |   |

\[13\] **Assemble Structure** (1073741842) user=STRUCT\_ASSEMBLY struct='`Structure_1`' @(-790.7857,146.71428)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Add variable 2" | = | 8 | *Int* |   |

\[14\] **Split Structure** (1073741843) user=STRUCT\_SPLIT struct='`Structure_1`' @(-313.2143,141)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Structure\_1" | \<- | \[13\] **Assemble Structure** (1073741842) `out#0` "Structure\_1" | *Struct* |   |

## Graph '<u>\<status\></u>*Empty*'

- **type**: STATUS\_NODE\_GRAPH
- **guid**: '`1073741826`'

## Graph '<u>\<status\></u>*New Node Graph\_1*'

- **type**: STATUS\_NODE\_GRAPH
- **guid**: '`1073741835`'

## Graph '<u>\<class\></u>*New Node Graph\_2\_1*'

- **type**: CLASS\_NODE\_GRAPH
- **guid**: '`1073741836`'

## Graph '*New Node Graph\_3*'

- **type**: ITEM\_NODE\_GRAPH
- **guid**: '`1073741837`'

## Graph '<u>\<composite\></u>*Create Composite Node*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741828`'
- **declaration guid**: '`1073741825`'

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.out#0` | "Value" | \[1\] **Get Local Variable** (18/20) | `out#1` | "Value" |

### Nodes

\[1\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(-128,-138)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Initial Value" | = | 42 | *Int* |   |

## Graph '<u>\<composite\></u>*Create Composite Node(1)*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741829`'
- **declaration guid**: '`1073741826`'

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.in.flow#0` |   | \[11\] **Double Branch** (2) | `in.flow#0` |   |
| `ext.in.flow#0` |   | \[1\] **Print String** (1) | `in.flow#0` |   |
| `ext.out.flow#0` | "Yes" | \[11\] **Double Branch** (2) | `out.flow#0` | "Yes" |
| `ext.out.flow#0` | "Yes" | \[1\] **Print String** (1) | `out.flow#0` |   |
| `ext.out.flow#1` | "No" | \[11\] **Double Branch** (2) | `out.flow#1` | "No" |
| `ext.in#0` | "Input" | \[2\] **Data Type Conversion** (180/182) | `in#0` | "Input" |
| `ext.in#0` | "Input" | \[10\] **Equal** (14/370) | `in#1` | "Input 2" |
| `ext.in#1` | "3D Vector" | \[21\] **Split 3D Vector** (9) | `in#0` | "3D Vector" |
| `ext.out#0` | "X-Component" | \[21\] **Split 3D Vector** (9) | `out#0` | "X-Component" |
| `ext.out#1` | "Z-Component" | \[21\] **Split 3D Vector** (9) | `out#2` | "Z-Component" |

### Nodes

\[1\] **Print String** (1) @(203.85715,-324.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | \<- | \[2\] **Data Type Conversion** (180/182) `out#0` "Output" | *Str* |   |

\[2\] **Data Type Conversion** (180/182) variant=C\<K:Int,V:Str\> @(186.71428,-546.1429)

\[6\] **When Entering Collision Trigger** (92) @(-344,-190.28572)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[1\] **Print String** (1) `in.flow#0` |   |   |

\[8\] **When Exiting Collision Trigger** (91) @(-325.42856,228.28572)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[11\] **Double Branch** (2) `in.flow#0` |   |   |

\[10\] **Equal** (14/370) variant=C\<T:Int\> @(124.57143,-50.285713)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Input 1" | \<- | \[6\] **When Entering Collision Trigger** (92) `out#4` "Trigger ID" | *Int* |   |

\[11\] **Double Branch** (2) @(268.85715,226.85715)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Condition" | \<- | \[10\] **Equal** (14/370) `out#0` "Result" | *Bol* |   |

\[21\] **Split 3D Vector** (9) @(709.5714,-327.57144)

## Graph '<u>\<skill\></u>*New Character Skill Node Graph*'

- **type**: SKILL\_NODE\_GRAPH
- **guid**: '`1082130435`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Play Timed Effects** (200038/2000) `in.flow#0` |   |   |

\[3\] **Play Timed Effects** (200038/2000) @(375,1)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Special Effects Asset Configuration ID" | = | id:2 | *Cfg* |   |
| `in#1` | "Location" | \<- | \[4\] **3D Vector Zoom** (200066/134) `out#0` "Result" | *Vec* |   |
| `in#2` | "Rotate" | \<- | \[5\] **Get Ray Detection Result** (200109/1047) `out#0` "On-Hit Location" | *Vec* |   |

\[4\] **3D Vector Zoom** (200066/134) @(-42,195)

\[5\] **Get Ray Detection Result** (200109/1047) @(-113.25,499.25)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Detect Initiator Entity" | \<- | \[6\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" | *Ety* |   |

\[6\] **Get Self Entity** (200033/1013) @(-415.5,510.25)

## Graph '<u>\<skill\></u>*New Character Skill Node Graph\_1*'

- **type**: SKILL\_NODE\_GRAPH
- **guid**: '`1082130442`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

## Graph '<u>\<creation\></u>*New Creation Skill Node Graph*'

- **type**: CREATION\_SKILL\_GRAPH
- **guid**: '`1082130436`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Taunt Target** (200089/2000) `in.flow#0` |   |   |

\[2\] **Taunt Target** (200089/2000) @(385,-6)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Taunter Entity" | \<- | \[4\] **Traverse Entity List** (200055/2000) `out#0` "Current Entity" | *Ety* |   |

\[4\] **Traverse Entity List** (200055/2000) @(26,195)

## Graph '<u>\<creation\></u>*New Creation Skill Node Graph\_1*'

- **type**: CREATION\_SKILL\_GRAPH
- **guid**: '`1082130443`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

## Graph '<u>\<creation\></u>*New Creation Status Node Graph*'

- **type**: CREATION\_STATUS\_GRAPH
- **guid**: '`1082130437`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "1" | -\> | \[2\] **Tactic: Ground Escape** (200138/4019) `in.flow#0` |   |   |

\[2\] **Tactic: Ground Escape** (200138/4019) @(431,-2)

## Graph '<u>\<creation\></u>*New Creation Status Node Graph\_1*'

- **type**: CREATION\_STATUS\_GRAPH
- **guid**: '`1082130444`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

## Graph '<u>\<creation\></u>*New Creation Status Decision Node Graph*'

- **type**: CREATION\_STATUS\_DECISION\_GRAPH
- **guid**: '`1082130439`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/2

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "2" | -\> | \[2\] **Multiple Branches** (200127) `in.flow#0` |   |   |

\[2\] **Multiple Branches** (200127) @(445,39)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Default" | -\> | \[3\] **Switch to self execution status** (200128/4011) `in.flow#0` |   |   |

\[3\] **Switch to self execution status** (200128/4011) @(883,144)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Status Node Graph Configuration ID" | = | id:1082130437 | *Cfg* |   |
| `in#2` | "Autonomous Logic Parameter ID" | = | 0 | *Int* |   |

## Graph '<u>\<creation\></u>*New Creation Status Decision Node Graph\_1*'

- **type**: CREATION\_STATUS\_DECISION\_GRAPH
- **guid**: '`1082130446`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

## Graph '<u>\<skill\></u>*New Character Control Skill Node Graph*'

- **type**: CHARACTER\_CONTROL\_SKILL\_GRAPH
- **guid**: '`1082130438`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Complete Current Pre-Aim** (200288/2000) `in.flow#0` |   |   |

\[2\] **Complete Current Pre-Aim** (200288/2000) @(347,-4)

## Graph '<u>\<skill\></u>*New Character Control Skill Node Graph\_1*'

- **type**: CHARACTER\_CONTROL\_SKILL\_GRAPH
- **guid**: '`1082130445`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

## Graph '<u>\<filter\></u>*New Filter Node Graph*'

- **type**: BOOLEAN\_FILTER\_GRAPH
- **guid**: '`1082130433`'

### Nodes

\[1\] **Node Graph End (Boolean)** (200000) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Output Result (Boolean)" | \<- | \[2\] **Less Than** (200008/12) `out#0` "Result" | *Bol* |   |

\[2\] **Less Than** (200008/12) variant=C\<T:Int\> @(-531,-5)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` |   | \<- | \[3\] **Get List Length** (200018) `out#0` "Length" | *Int* |   |
| `in#2` |   | = | 0 | *Int* |   |

\[3\] **Get List Length** (200018) @(-935,5)

## Graph '<u>\<filter\></u>*New Filter Node Graph\_2*'

- **type**: BOOLEAN\_FILTER\_GRAPH
- **guid**: '`1082130440`'

### Nodes

\[1\] **Node Graph End (Boolean)** (200000) @(0,0)

## Graph '<u>\<filter\></u>*New Filter Node Graph\_1*'

- **type**: INTEGER\_FILTER\_GRAPH
- **guid**: '`1082130434`'

### Nodes

\[1\] **Node Graph End (Integer)** (200122) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Output Result (Integer)" | \<- | \[2\] **Get Custom Variable** (200016/41) `out#0` "Variable Value" | *Int* |   |

\[2\] **Get Custom Variable** (200016/41) variant=C\<T:Int\> @(-467,2)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[3\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Variable Name" | = | '`test`' | *Str* |   |

\[3\] **Get Self Entity** (200033/1013) @(-413,-166)

## Graph '<u>\<filter\></u>*New Filter Node Graph\_1\_1*'

- **type**: INTEGER\_FILTER\_GRAPH
- **guid**: '`1082130441`'

### Nodes

\[1\] **Node Graph End (Integer)** (200122) @(0,0)

# File `test/cases/gil/stage_1.gil`

## Graph '*New Node Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Nodes

\[1\] **Create Composite Node** (1073741825) user=COMPOSITE @(514.5714,126.28571)

\[3\] **When Tab Is Selected** (307) @(-329,128)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[9\] **Multiple Branches** (3) `in.flow#0` |   |   |

\[4\] **Set Preset Status** (66) @(1016,306.14285)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[16\] **Set Local Variable** (19/2677) `in.flow#0` |   |   |
| `in#0` | "Target Entity" | \<- | \[3\] **When Tab Is Selected** (307) `out#0` "Event Source Entity" | *Ety* |   |
| `in#1` | "Preset Status Index" | \<- | \[5\] **Create Composite Node** (1073741825) `out#0` "Value" | *Int* |   |
| `in#2` | "Preset Status Value" | \<- | \[5\] **Create Composite Node** (1073741825) `out#0` "Value" | *Int* |   |

\[5\] **Create Composite Node** (1073741825) user=COMPOSITE @(1063,118.14286)

\[9\] **Multiple Branches** (3) @(33.57143,126.71429)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "1" | -\> | \[15\] **Create Composite Node(1)** (1073741826) `in.flow#0` |   |   |
| `in#0` | "Control Expression" | \<- | \[3\] **When Tab Is Selected** (307) `out#2` "Tab ID" | *Int* |   |

\[15\] **Create Composite Node(1)** (1073741826) user=COMPOSITE @(480.42856,307)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Yes" | -\> | \[4\] **Set Preset Status** (66) `in.flow#0` |   |   |
| `in#0` | "Input" | \<- | \[1\] **Create Composite Node** (1073741825) `out#0` "Value" | *Int* |   |
| `in#1` | "3D Vector" | = | (1, 2, 3) | *Vec* |   |

\[16\] **Set Local Variable** (19/2677) variant=C\<T:Flt\> @(1517.8572,305.2857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Value" | \<- | \[15\] **Create Composite Node(1)** (1073741826) `out#0` "X-Component" | *Flt* |   |

## Graph '<u>\<composite\></u>*Create Composite Node*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741826`'
- **declaration guid**: '`1073741825`'

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.out#0` | "Value" | \[1\] **Get Local Variable** (18/20) | `out#1` | "Value" |

### Nodes

\[1\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(-128,-138)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Initial Value" | = | 42 | *Int* |   |

## Graph '<u>\<composite\></u>*Create Composite Node(1)*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741827`'
- **declaration guid**: '`1073741826`'

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.in.flow#0` |   | \[11\] **Double Branch** (2) | `in.flow#0` |   |
| `ext.in.flow#0` |   | \[1\] **Print String** (1) | `in.flow#0` |   |
| `ext.out.flow#0` | "Yes" | \[11\] **Double Branch** (2) | `out.flow#0` | "Yes" |
| `ext.out.flow#0` | "Yes" | \[1\] **Print String** (1) | `out.flow#0` |   |
| `ext.out.flow#1` | "No" | \[11\] **Double Branch** (2) | `out.flow#1` | "No" |
| `ext.in#0` | "Input" | \[2\] **Data Type Conversion** (180/182) | `in#0` | "Input" |
| `ext.in#0` | "Input" | \[10\] **Equal** (14/370) | `in#1` | "Input 2" |
| `ext.in#1` | "3D Vector" | \[21\] **Split 3D Vector** (9) | `in#0` | "3D Vector" |
| `ext.out#0` | "X-Component" | \[21\] **Split 3D Vector** (9) | `out#0` | "X-Component" |
| `ext.out#1` | "Z-Component" | \[21\] **Split 3D Vector** (9) | `out#2` | "Z-Component" |

### Nodes

\[1\] **Print String** (1) @(203.85715,-324.7143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | \<- | \[2\] **Data Type Conversion** (180/182) `out#0` "Output" | *Str* |   |

\[2\] **Data Type Conversion** (180/182) variant=C\<K:Int,V:Str\> @(186.71428,-546.1429)

\[6\] **When Entering Collision Trigger** (92) @(-344,-190.28572)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[1\] **Print String** (1) `in.flow#0` |   |   |

\[8\] **When Exiting Collision Trigger** (91) @(-325.42856,228.28572)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[11\] **Double Branch** (2) `in.flow#0` |   |   |

\[10\] **Equal** (14/370) variant=C\<T:Int\> @(124.57143,-50.285713)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Input 1" | \<- | \[6\] **When Entering Collision Trigger** (92) `out#4` "Trigger ID" | *Int* |   |

\[11\] **Double Branch** (2) @(268.85715,226.85715)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Condition" | \<- | \[10\] **Equal** (14/370) `out#0` "Result" | *Bol* |   |

\[21\] **Split 3D Vector** (9) @(709.5714,-327.57144)

# File `test/cases/gil/stage_2.gil`

## Decl "**Signal\_2**"

- **type**: SIGNAL\_NODE\_DECL
- **guid**: '`1073741829`'

- SEND\_SIGNAL name='`Signal_2`' server\_node=1073741828 client\_node=1073741830

| Pin | Name | Type | Details |
| --- | --- | --- | --- |
| `in.flow#0` |   |   |  uid=30 |
| `out.flow#0` |   |   |  uid=31 |
| `in#0` | "Parameter\_1" | *Int* |  uid=42 |
| `in#1` | "Parameter\_2" | *Flt* |  uid=43 |
| `in#2` | "Parameter\_3" | *Vec* |  uid=44 |
| `in#3` | "Parameter\_4" | *Bol* |  enum\_family=1 uid=45 |
| `in#4` | "Parameter\_5" | *Gid* |  uid=46 |
| `in#5` | "Parameter\_6" | *Ety* |  uid=47 |
| `in#6` | "Parameter\_7" | *Pfb* |  uid=48 |
| `in#7` | "Parameter\_8" | *Cfg* |  uid=49 |
| `in#8` | "Parameter\_9" | *L\<Int\>* |  uid=50 |
| `in#9` | "Parameter\_10" | *Str* |  uid=72 |
| `meta#0` | "Signal Name" |   |  uid=32 |

## Decl "**Signal\_1**"

- **type**: SIGNAL\_NODE\_DECL
- **guid**: '`1073741826`'

- SEND\_SIGNAL name='`Signal_1`' server\_node=1073741825 client\_node=1073741827

| Pin | Name | Type | Details |
| --- | --- | --- | --- |
| `in.flow#0` |   |   |  uid=18 |
| `out.flow#0` |   |   |  uid=19 |
| `meta#0` | "Signal Name" |   |  uid=20 |

## Graph '*Both*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741827`'

### Nodes

\[2\] **Monitor Signal** (1073741825) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-293,-150) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Send Signal** (1073741826) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[4\] **Send Signal** (1073741826) user=SEND\_SIGNAL signal='`Signal_1`' @(207,-148) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Send Signal** (1073741829) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[6\] **Send Signal** (1073741829) user=SEND\_SIGNAL signal='`Signal_2`' @(583,-153) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#8` | "Parameter\_9" | \<- | \[7\] **Monitor Signal** (1073741828) `out#11` "Parameter\_9" | *L\<Int\>* |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

\[7\] **Monitor Signal** (1073741828) user=LISTEN\_SIGNAL signal='`Signal_2`' @(102.85714,143.28572) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Send Signal** (1073741829) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

## Graph '*Receive*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Nodes

\[2\] **Monitor Signal** (1073741825) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-286,-207) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[5\] **Monitor Signal** (1073741828) user=LISTEN\_SIGNAL signal='`Signal_2`' @(-284,98) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Print String** (1) `in.flow#0` |   |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

\[6\] **Print String** (1) @(223,96)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | \<- | \[5\] **Monitor Signal** (1073741828) `out#12` "Parameter\_10" | *Str* |   |

## Graph '*Send*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741826`'

### Nodes

\[2\] **Send Signal** (1073741826) user=SEND\_SIGNAL signal='`Signal_1`' @(-172.85715,-372.7143) sigver=1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_1`' |   |   |

\[4\] **Send Signal** (1073741829) user=SEND\_SIGNAL signal='`Signal_2`' @(-197,-101) sigver=3

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Parameter\_1" | \<- | \[5\] **When Timer Is Triggered** (83) `out#3` "Timer Sequence ID" | *Int* |   |
| `in#1` | "Parameter\_2" | = | 4 | *Flt* |   |
| `in#2` | "Parameter\_3" | = | (1, 2, 3) | *Vec* |   |
| `in#3` | "Parameter\_4" | = | Yes | *Bol* |   |
| `in#4` | "Parameter\_5" | \<- | \[5\] **When Timer Is Triggered** (83) `out#1` "Event Source GUID" | *Gid* |   |
| `in#5` | "Parameter\_6" | \<- | \[5\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" | *Ety* |   |
| `in#6` | "Parameter\_7" | = | id:5 | *Pfb* |   |
| `in#7` | "Parameter\_8" | = | id:6 | *Cfg* |   |
| `in#9` | "Parameter\_10" | \<- | \[5\] **When Timer Is Triggered** (83) `out#2` "Timer Name" | *Str* |   |
| `meta.rpc#0` | "Signal Name" | = | '`Signal_2`' |   |   |

\[5\] **When Timer Is Triggered** (83) @(-582,-100)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Send Signal** (1073741829) `in.flow#0` |   |   |

# File `test/cases/gil/stage_3.gil`

## Struct "**Structure**"

- **guid**: '`1077936129`'
- **id**: 1077936129
- **version**: 7

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *Str* |   |

## Struct "**Structure\_1**"

- **guid**: '`1077936130`'
- **id**: 1077936130
- **version**: 5

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *L\<Str\>* |   |
| 2 | "**Add variable 2**" | *Int* |   |
| 3 | "**Add variable 3**" | *Struct* | Structure |
| 4 | "**Add variable 4**" | *L\<Struct\>* | Structure |

## Graph '*Structs*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Nodes

\[2\] **Modify Structure** (1073741827) user=STRUCT\_MODIFY struct='`Structure`' @(-291,-272)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[10\] **Modify Structure** (1073741836) `in.flow#0` |   |   |
| `in#0` | "Structure" | \<- | \[4\] **Assemble Structure** (1073741825) `out#0` "Structure" | *Struct* |   |
| `in#2` | "是否设置\_Add variable 1" | \<- | \[6\] **Split Structure** (1073741826) `out#0` "Add variable 1" | *Str* |   |
| `in#3` | "是否设置\_Add variable 1" | = | Yes | *Bol* |   |

\[4\] **Assemble Structure** (1073741825) user=STRUCT\_ASSEMBLY struct='`Structure`' @(-1207,-226)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Add variable 1" | = | '`9`' | *Str* |   |

\[6\] **Split Structure** (1073741826) user=STRUCT\_SPLIT struct='`Structure`' @(-788,-86)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Structure" | \<- | \[4\] **Assemble Structure** (1073741825) `out#0` "Structure" | *Struct* |   |

\[8\] **When Entity Is Removed/Destroyed** (72) @(-788,-424)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Modify Structure** (1073741827) `in.flow#0` |   |   |

\[10\] **Modify Structure** (1073741836) user=STRUCT\_MODIFY struct='`Structure_1`' @(150.14285,-270.42856)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#2` | "是否设置\_Add variable 1" | \<- | \[14\] **Split Structure** (1073741835) `out#0` "Add variable 1" | *L\<Str\>* |   |
| `in#3` | "Add variable 2" | = | Yes | *Bol* |   |
| `in#5` | "Add variable 3" | = | No | *Bol* |   |
| `in#6` | "是否设置\_Add variable 3" | \<- | \[4\] **Assemble Structure** (1073741825) `out#0` "Structure" | *Struct* |   |
| `in#7` | "Add variable 4" | = | Yes | *Bol* |   |
| `in#9` | "是否设置\_Add variable 4" | = | No | *Bol* |   |

\[13\] **Assemble Structure** (1073741834) user=STRUCT\_ASSEMBLY struct='`Structure_1`' @(-790.7857,146.71428)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Add variable 2" | = | 8 | *Int* |   |

\[14\] **Split Structure** (1073741835) user=STRUCT\_SPLIT struct='`Structure_1`' @(-313.2143,141)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Structure\_1" | \<- | \[13\] **Assemble Structure** (1073741834) `out#0` "Structure\_1" | *Struct* |   |

# File `test/cases/gil/stage_6.gil`

## Graph '*New Node Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Nodes

\[1\] **When All Player's Characters Are Revived** (286) @(-446,-135)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Revive the active character** (803) `in.flow#0` |   |   |

\[2\] **Revive the active character** (803) @(103,-135)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Player Entity" | \<- | \[1\] **When All Player's Characters Are Revived** (286) `out#0` "Player Entity" | *Ety* |   |

## Graph '*New Node Graph\_1*'

- **type**: ITEM\_NODE\_GRAPH
- **guid**: '`1073741826`'

### Nodes

\[1\] **When Floating Interaction Page is Triggered** (826) @(-343,-157)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Teleport Player (Classic Mode)** (805) `in.flow#0` |   |   |

\[2\] **Teleport Player (Classic Mode)** (805) @(208,-159)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Player Entity" | \<- | \[1\] **When Floating Interaction Page is Triggered** (826) `out#0` "Player Entity" | *Ety* |   |
| `in#1` | "Target Location" | = | (1, 1, 1) | *Vec* |   |
| `in#2` | "Target Rotation" | = | (2, 2, 2) | *Vec* |   |

# File `test/cases/gil/stage_7.gil`

## Graph '<u>\<skill\></u>*New Character Skill Node Graph*'

- **type**: SKILL\_NODE\_GRAPH
- **guid**: '`1082130435`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Play Timed Effects** (200038/2000) `in.flow#0` |   |   |

\[3\] **Play Timed Effects** (200038/2000) @(375,1)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Special Effects Asset Configuration ID" | = | id:2 | *Cfg* |   |
| `in#1` | "Location" | \<- | \[4\] **3D Vector Zoom** (200066/134) `out#0` "Result" | *Vec* |   |
| `in#2` | "Rotate" | \<- | \[5\] **Get Ray Detection Result** (200109/1047) `out#0` "On-Hit Location" | *Vec* |   |

\[4\] **3D Vector Zoom** (200066/134) @(-42,195)

\[5\] **Get Ray Detection Result** (200109/1047) @(-113.25,499.25)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Detect Initiator Entity" | \<- | \[6\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" | *Ety* |   |

\[6\] **Get Self Entity** (200033/1013) @(-415.5,510.25)

## Graph '<u>\<creation\></u>*New Creation Skill Node Graph*'

- **type**: CREATION\_SKILL\_GRAPH
- **guid**: '`1082130436`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Taunt Target** (200089/2000) `in.flow#0` |   |   |

\[2\] **Taunt Target** (200089/2000) @(385,-6)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Taunter Entity" | \<- | \[4\] **Traverse Entity List** (200055/2000) `out#0` "Current Entity" | *Ety* |   |

\[4\] **Traverse Entity List** (200055/2000) @(26,195)

## Graph '<u>\<creation\></u>*New Creation Status Node Graph*'

- **type**: CREATION\_STATUS\_GRAPH
- **guid**: '`1082130437`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "1" | -\> | \[2\] **Tactic: Ground Escape** (200138/4019) `in.flow#0` |   |   |

\[2\] **Tactic: Ground Escape** (200138/4019) @(431,-2)

## Graph '<u>\<creation\></u>*New Creation Status Decision Node Graph*'

- **type**: CREATION\_STATUS\_DECISION\_GRAPH
- **guid**: '`1082130439`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/2

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "2" | -\> | \[2\] **Multiple Branches** (200127) `in.flow#0` |   |   |

\[2\] **Multiple Branches** (200127) @(445,39)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Default" | -\> | \[3\] **Switch to self execution status** (200128/4011) `in.flow#0` |   |   |

\[3\] **Switch to self execution status** (200128/4011) @(883,144)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Status Node Graph Configuration ID" | = | id:1082130437 | *Cfg* |   |
| `in#2` | "Autonomous Logic Parameter ID" | = | 0 | *Int* |   |

## Graph '<u>\<skill\></u>*New Character Control Skill Node Graph*'

- **type**: CHARACTER\_CONTROL\_SKILL\_GRAPH
- **guid**: '`1082130438`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Complete Current Pre-Aim** (200288/2000) `in.flow#0` |   |   |

\[2\] **Complete Current Pre-Aim** (200288/2000) @(347,-4)

## Graph '<u>\<filter\></u>*New Filter Node Graph*'

- **type**: BOOLEAN\_FILTER\_GRAPH
- **guid**: '`1082130433`'

### Nodes

\[1\] **Node Graph End (Boolean)** (200000) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Output Result (Boolean)" | \<- | \[2\] **Less Than** (200008/12) `out#0` "Result" | *Bol* |   |

\[2\] **Less Than** (200008/12) variant=C\<T:Int\> @(-531,-5)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` |   | \<- | \[3\] **Get List Length** (200018) `out#0` "Length" | *Int* |   |
| `in#2` |   | = | 0 | *Int* |   |

\[3\] **Get List Length** (200018) @(-935,5)

## Graph '<u>\<filter\></u>*New Filter Node Graph\_1*'

- **type**: INTEGER\_FILTER\_GRAPH
- **guid**: '`1082130434`'

### Nodes

\[1\] **Node Graph End (Integer)** (200122) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Output Result (Integer)" | \<- | \[2\] **Get Custom Variable** (200016/41) `out#0` "Variable Value" | *Int* |   |

\[2\] **Get Custom Variable** (200016/41) variant=C\<T:Int\> @(-467,2)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[3\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Variable Name" | = | '`test`' | *Str* |   |

\[3\] **Get Self Entity** (200033/1013) @(-413,-166)

# File `test/cases/gil/stage_9.gil`

## Decl "**Signal\_1**"

- **type**: SIGNAL\_NODE\_DECL
- **guid**: '`1073741825`'

- SEND\_SIGNAL name='`Signal_1`' server\_node=1073741826 client\_node=1073741827

| Pin | Name | Type | Details |
| --- | --- | --- | --- |
| `in.flow#0` |   |   |  uid=178 |
| `out.flow#0` |   |   |  uid=179 |
| `meta#0` | "Signal Name" |   |  uid=180 |

## Struct "**Structure**"

- **guid**: '`1077936129`'
- **id**: 1077936129
- **version**: 2

## Graph '*New Node Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

## Graph '<u>\<status\></u>*New Node Graph\_1*'

- **type**: STATUS\_NODE\_GRAPH
- **guid**: '`1073741826`'

## Graph '<u>\<class\></u>*New Node Graph\_2*'

- **type**: CLASS\_NODE\_GRAPH
- **guid**: '`1073741827`'

## Graph '*New Node Graph\_3*'

- **type**: ITEM\_NODE\_GRAPH
- **guid**: '`1073741828`'

## Graph '<u>\<skill\></u>*New Character Skill Node Graph*'

- **type**: SKILL\_NODE\_GRAPH
- **guid**: '`1082130435`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

## Graph '<u>\<creation\></u>*New Creation Skill Node Graph*'

- **type**: CREATION\_SKILL\_GRAPH
- **guid**: '`1082130436`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

## Graph '<u>\<creation\></u>*New Creation Status Node Graph*'

- **type**: CREATION\_STATUS\_GRAPH
- **guid**: '`1082130437`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

## Graph '<u>\<creation\></u>*New Creation Status Decision Node Graph*'

- **type**: CREATION\_STATUS\_DECISION\_GRAPH
- **guid**: '`1082130439`'

### Nodes

\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1

## Graph '<u>\<skill\></u>*New Character Control Skill Node Graph*'

- **type**: CHARACTER\_CONTROL\_SKILL\_GRAPH
- **guid**: '`1082130438`'

### Nodes

\[1\] **Node Graph Starts** (200042/2001) @(0,0)

## Graph '<u>\<filter\></u>*New Filter Node Graph*'

- **type**: BOOLEAN\_FILTER\_GRAPH
- **guid**: '`1082130433`'

### Nodes

\[1\] **Node Graph End (Boolean)** (200000) @(0,0)

## Graph '<u>\<filter\></u>*New Filter Node Graph\_1*'

- **type**: INTEGER\_FILTER\_GRAPH
- **guid**: '`1082130434`'

### Nodes

\[1\] **Node Graph End (Integer)** (200122) @(0,0)
