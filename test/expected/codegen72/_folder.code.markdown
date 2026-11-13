# File `codetest_3.gia`

## Graph '*Composite with event*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741827`'

### Nodes

\[7\] **Naive execution delay** (1610612738) user=COMPOSITE @(-277.1143,-168.15237)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[18\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |
| `in#0` | "Delay" | = | 1 | *Flt* |   |
| `in#1` | "Timer Name" | = | '`1`' | *Str* |   |

\[8\] **When Entity Is Created** (71) @(-741.4286,-167.5238)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[7\] **Naive execution delay** (1610612738) `in.flow#0` |   |   |

\[10\] **Naive execution delay** (1610612738) user=COMPOSITE @(-305.33334,434.61905)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Delay" | = | 2 | *Flt* |   |
| `in#1` | "Timer Name" | = | '`2`' | *Str* |   |

\[12\] **Naive execution delay** (1610612738) user=COMPOSITE @(555.7143,339.33334)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[20\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |
| `in#0` | "Delay" | = | 3 | *Flt* |   |
| `in#1` | "Timer Name" | = | '`3`' | *Str* |   |

\[13\] **Double Branch** (2) @(198.57143,549.3333)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Yes" | -\> | \[12\] **Naive execution delay** (1610612738) `in.flow#0` |   |   |
| `out.flow#1` | "No" | -\> | \[20\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |
| `in#0` | "Condition" | = | Yes | *Bol* |   |

\[18\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(165,-167.5)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Variable Name" | = | '`X`' | *Str* |   |
| `in#2` | "Variable Value" | = | 0 | *Int* |   |
| `in#3` | "Trigger Event" | = | Yes | *Bol* |   |

\[19\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-769.6667,429.5)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[10\] **Naive execution delay** (1610612738) `in.flow#0` |   |   |
| `in#1` | "Variable Name" | = | '`Y`' | *Str* |   |
| `in#2` | "Variable Value" | = | 0 | *Int* |   |
| `in#3` | "Trigger Event" | = | Yes | *Bol* |   |

\[20\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(934.3333,583.5)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Variable Name" | = | '`Z`' | *Str* |   |
| `in#2` | "Variable Value" | = | 0 | *Int* |   |
| `in#3` | "Trigger Event" | = | Yes | *Bol* |   |

\[21\] **Naive execution delay** (1610612738) user=COMPOSITE @(847,-151.83333)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Delay" | = | 4 | *Flt* |   |
| `in#1` | "Timer Name" | = | '`4`' | *Str* |   |

## Graph '*Cycle with no entry*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741826`'

### Nodes

\[1\] **When Entity Is Created** (71) @(-288,-86)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Finite Loop** (5) `in.flow#0` |   |   |

\[2\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(968.3571,-72.57143)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Multiple Branches** (3) `in.flow#0` |   |   |
| `in#1` | "Variable Name" | = | '`A`' | *Str* |   |
| `in#2` | "Variable Value" | \<- | \[3\] **Finite Loop** (5) `out#0` "Current Loop Value" | *Int* |   |
| `in#3` | "Trigger Event" | = | Yes | *Bol* |   |

\[3\] **Finite Loop** (5) @(224.57143,-81.14286)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Loop Body" | -\> | \[2\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |
| `out.flow#1` | "Loop Complete" | -\> | \[6\] **Settle Stage** (77) `in.flow#0` |   |   |
| `in#0` | "Loop Start Value" | = | 1 | *Int* |   |
| `in#1` | "Loop Termination Value" | = | 5 | *Int* |   |

\[4\] **Multiple Branches** (3) @(1577.7858,-56.142857)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "3" | -\> | \[5\] **Break Loop** (6) `in.flow#0` |   |   |
| `in#0` | "Control Expression" | \<- | \[2\] **Wrapped (Custom Variable)** (1610612737) `out#0` "Variable Value" | *Int* |   |
| `in#0` | "Control Expression" | = | 0 | *Int* | also wired |

\[5\] **Break Loop** (6) @(2133.6355,21.877337)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Finite Loop** (5) `in.flow#1` "Break Loop" |   |   |

\[6\] **Settle Stage** (77) @(718.5641,230.59163)

\[7\] **Clear List** (107) @(-241.26927,482.2583)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[16\] **Finite Loop** (5) `in.flow#0` |   |   |

\[13\] **Settle Stage** (77) @(711.8787,782.6609)

\[14\] **Break Loop** (6) @(2126.9502,573.9466)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[16\] **Finite Loop** (5) `in.flow#1` "Break Loop" |   |   |

\[15\] **Multiple Branches** (3) @(1571.1003,495.9264)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#1` | "3" | -\> | \[14\] **Break Loop** (6) `in.flow#0` |   |   |
| `in#0` | "Control Expression" | \<- | \[17\] **Wrapped (Custom Variable)** (1610612737) `out#0` "Variable Value" | *Int* |   |
| `in#0` | "Control Expression" | = | 0 | *Int* | also wired |

\[16\] **Finite Loop** (5) @(217.88606,470.9264)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` | "Loop Body" | -\> | \[17\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |
| `out.flow#1` | "Loop Complete" | -\> | \[13\] **Settle Stage** (77) `in.flow#0` |   |   |
| `in#0` | "Loop Start Value" | = | 1 | *Int* |   |
| `in#1` | "Loop Termination Value" | = | 5 | *Int* |   |

\[17\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(961.67175,479.49783)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[15\] **Multiple Branches** (3) `in.flow#0` |   |   |
| `in#1` | "Variable Name" | = | '`B`' | *Str* |   |
| `in#2` | "Variable Value" | \<- | \[16\] **Finite Loop** (5) `out#0` "Current Loop Value" | *Int* |   |
| `in#3` | "Trigger Event" | = | Yes | *Bol* |   |

## Graph '*Dead composite*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Nodes

\[3\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-20.333334,277.66666)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[6\] **Print String** (1) `in.flow#0` |   |   |
| `in#1` | "Variable Name" | = | '`1`' | *Str* |   |
| `in#2` | "Variable Value" | = | 1 | *Int* |   |
| `in#3` | "Trigger Event" | = | No | *Bol* |   |

\[4\] **When Entity Is Created** (71) @(-467.66666,283.33334)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |

\[6\] **Print String** (1) @(466.33334,274)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | \<- | \[7\] **Data Type Conversion** (180/182) `out#0` "Output" | *Str* |   |

\[7\] **Data Type Conversion** (180/182) variant=C\<K:Int,V:Str\> @(449.33334,19.333334)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Input" | \<- | \[8\] **Wrapped (Custom Variable)** (1610612737) `out#0` "Variable Value" | *Int* |   |
| `in#0` | "Input" | = | 0 | *Int* | also wired |
| `out#0` | "Output" | = | '' | *Str* |   |

\[8\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-11.163849,-218.76569)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Variable Name" | = | '`2`' | *Str* |   |
| `in#2` | "Variable Value" | = | 2 | *Int* |   |
| `in#3` | "Trigger Event" | = | No | *Bol* |   |

\[9\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(967.1695,279.901)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[4\] **When Entity Is Created** (71) `out#0` "Event Source Entity" | *Ety* |   |
| `in#1` | "Variable Name" | \<- | \[7\] **Data Type Conversion** (180/182) `out#0` "Output" | *Str* |   |
| `in#1` | "Variable Name" | = | '`3`' | *Str* | also wired |
| `in#2` | "Variable Value" | = | 3 | *Int* |   |
| `in#3` | "Trigger Event" | = | No | *Bol* |   |

\[10\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-45.330517,840.901)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "Variable Name" | = | '`4`' | *Str* |   |
| `in#2` | "Variable Value" | = | 4 | *Int* |   |
| `in#3` | "Trigger Event" | = | No | *Bol* |   |

\[11\] **Print String** (1) @(515.6695,846.401)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[13\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0` |   |   |

\[13\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(938.1695,851.401)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[14\] **Print String** (1) `in.flow#0` |   |   |
| `in#1` | "Variable Name" | = | '`5`' | *Str* |   |
| `in#2` | "Variable Value" | = | 5 | *Int* |   |
| `in#3` | "Trigger Event" | = | No | *Bol* |   |

\[14\] **Print String** (1) @(1457.3362,852.2343)

## Graph '*Nested event*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741828`'

### Nodes

\[6\] **Test Delay Print** (1610612739) user=COMPOSITE @(48,-245.77777)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Delay" | = | 1 | *Flt* |   |

\[7\] **When Entity Is Created** (71) @(-421.66666,120.333336)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[8\] **Test Delay Print** (1610612739) `in.flow#0` |   |   |

\[8\] **Test Delay Print** (1610612739) user=COMPOSITE @(2.2737368e-13,123.666664)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[9\] **Test Delay Print** (1610612739) `in.flow#0` |   |   |
| `in#0` | "Delay" | = | 2 | *Flt* |   |

\[9\] **Test Delay Print** (1610612739) user=COMPOSITE @(400,122)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Delay" | = | 3 | *Flt* |   |

## Graph '<u>\<composite\></u>*Naive execution delay*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1610612738`'
- **declaration guid**: '`1610612738`'
- **role**: dependency

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.in.flow#0` |   | \[4\] **Start Timer** (79) | `in.flow#0` |   |
| `ext.out.flow#0` |   | \[2\] **Double Branch** (2) | `out.flow#0` | "Yes" |
| `ext.in#0` | "Delay" | \[5\] **Assembly List** (169/173) | `in#1` | "0" |
| `ext.in#1` | "Timer Name" | \[4\] **Start Timer** (79) | `in#1` | "Timer Name" |
| `ext.in#1` | "Timer Name" | \[3\] **Equal** (14) | `in#1` | "Input 2" |

### Nodes

\[1\] **When Timer Is Triggered** (83) @(-8.6,124.057144)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Double Branch** (2) `in.flow#0` |   |   |

\[2\] **Double Branch** (2) @(425.49524,127.34286)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Condition" | \<- | \[3\] **Equal** (14) `out#0` "Result" | *Bol* |   |

\[3\] **Equal** (14) @(366.49524,-159.8)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Input 1" | \<- | \[1\] **When Timer Is Triggered** (83) `out#2` "Timer Name" | *Str* |   |
| `in#0` | "Input 1" | = | '' | *Str* | also wired |
| `in#1` | "Input 2" | = | '' | *Str* |   |

\[4\] **Start Timer** (79) @(-408.6,113.48572)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[6\] **Get Self Entity** (73) `out#0` "Self Entity" | *Ety* |   |
| `in#2` | "Loop" | = | No | *Bol* |   |
| `in#3` | "Timer Sequence" | \<- | \[5\] **Assembly List** (169/173) `out#0` "List" | *L\<Flt\>* |   |

\[5\] **Assembly List** (169/173) variant=C\<T:Flt\> @(-431.45715,-185.08571)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#1` | "0" | = | 0 | *Flt* |   |
| `out#0` | "List" | = | \[\] | *L\<Flt\>* |   |

\[6\] **Get Self Entity** (73) @(-765,146.19048)

## Graph '<u>\<composite\></u>*Test Delay Print*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1610612739`'
- **declaration guid**: '`1610612739`'
- **role**: dependency

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.in.flow#0` |   | \[4\] **Print String** (1) | `in.flow#0` |   |
| `ext.out.flow#0` |   | \[3\] **Print String** (1) | `out.flow#0` |   |
| `ext.in#0` | "Delay" | \[2\] **Naive execution delay** (1610612738) | `in#0` | "Delay" |

### Nodes

\[2\] **Naive execution delay** (1610612738) user=COMPOSITE @(-22.333334,1.1111112)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[3\] **Print String** (1) `in.flow#0` |   |   |
| `in#1` | "Timer Name" | = | '`Delay`' | *Str* |   |

\[3\] **Print String** (1) @(433.66666,2.7777777)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "String" | = | '`Two`' | *Str* |   |

\[4\] **Print String** (1) @(-411.33334,-3.8888888)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[2\] **Naive execution delay** (1610612738) `in.flow#0` |   |   |
| `in#0` | "String" | = | '`One`' | *Str* |   |

## Graph '<u>\<composite\></u>*Wrapped (Custom Variable)*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1610612737`'
- **declaration guid**: '`1610612737`'
- **role**: dependency

### Port mappings

| External pin | Name | Internal node | Internal pin | Name |
| --- | --- | --- | --- | --- |
| `ext.in.flow#0` |   | \[1\] **Set Custom Variable** (22) | `in.flow#0` |   |
| `ext.out.flow#0` |   | \[1\] **Set Custom Variable** (22) | `out.flow#0` |   |
| `ext.in#0` | "Target Entity" | \[1\] **Set Custom Variable** (22) | `in#0` | "Target Entity" |
| `ext.in#0` | "Target Entity" | \[2\] **Get Custom Variable** (50) | `in#0` | "Target Entity" |
| `ext.in#1` | "Variable Name" | \[1\] **Set Custom Variable** (22) | `in#1` | "Variable Name" |
| `ext.in#1` | "Variable Name" | \[2\] **Get Custom Variable** (50) | `in#1` | "Variable Name" |
| `ext.in#2` | "Variable Value" | \[1\] **Set Custom Variable** (22) | `in#2` | "Variable Value" |
| `ext.in#3` | "Trigger Event" | \[1\] **Set Custom Variable** (22) | `in#4` | "Trigger Event" |
| `ext.out#0` | "Variable Value" | \[2\] **Get Custom Variable** (50) | `out#0` | "Variable Value" |

### Nodes

\[1\] **Set Custom Variable** (22) @(0,0)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#2` | "Variable Value" | = | 0 | *Int* |   |

\[2\] **Get Custom Variable** (50) @(-55,384)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out#0` | "Variable Value" | = | 0 | *Int* |   |
