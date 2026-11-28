# File `variables_beyond.gia`

# File `variables_classic.gil`

## Struct "**Struct**"

- **guid**: '`1077936129`'
- **id**: 1077936129
- **version**: 2

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *Str* |   |
| 2 | "**Add variable 2**" | *Int* |   |
| 3 | "**Add variable 3**" | *Flt* |   |
| 4 | "**Add variable 4**" | *Bol* |   |

# File `variables_graph.gia`

## Graph '*New Node Graph*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

### Variables

| Name | Type | Public | Struct | Value |
| --- | --- | --- | --- | --- |
| **String** | *Str* | true |   | '`graph`' |
| **Integer** | *Int* | true |   | 0 |
| **Faction** | *Fct* | true |   | id:1 |
| **Float** | *Flt* | true |   | 2.00 |
| **Entity** | *Ety* | true |   | null |
| **Private** | *Bol* | false |   | true |

## Graph '*Test5*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741826`'

### Variables

| Name | Type | Public | Struct | Value |
| --- | --- | --- | --- | --- |
| **Faction** | *Fct* | true |   | null |

## Graph '<u>\<status\></u>*Status*'

- **type**: STATUS\_NODE\_GRAPH
- **guid**: '`1073741827`'

### Variables

| Name | Type | Public | Struct | Value |
| --- | --- | --- | --- | --- |
| **Status** | *Dict* | false |   | {'`Status`': '`Status`'} |

# File `variables_ref.gil`

# File `variables_save.gil`

## Struct "**Structure\_Normal\_1**"

- **guid**: '`1077936129`'
- **id**: 1077936129
- **version**: 10

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *Struct* | Structure\_Normal\_2 |
| 2 | "**Add variable 2**" | *L\<Struct\>* | Structure\_Normal\_2 |

## Struct "**Structure\_Save\_1**"

- **guid**: '`1077936130`'
- **id**: 1077936130
- **version**: 8

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *Str* |   |

## Struct "**Structure\_Save\_2**"

- **guid**: '`1077936131`'
- **id**: 1077936131
- **version**: 8

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**Add variable 1**" | *L\<Int\>* |   |
| 2 | "**Add variable 2**" | *L\<Int\>* |   |

## Struct "**Structure\_Normal\_2**"

- **guid**: '`1077936132`'
- **id**: 1077936132
- **version**: 8

| # | Field | Type | Struct |
| ---: | --- | --- | --- |
| 1 | "**test**" | *Str* |   |

## Graph '*Player*'

- **type**: ENTITY\_NODE\_GRAPH
- **guid**: '`1073741825`'

- AFFIL struct=1077936130 source\_guid=50
- AFFIL struct=1077936130 source\_guid=142

### Nodes

\[1\] **Get Custom Variable** (50) @(-183.5,-84)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[2\] **Get Self Entity** (73) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Variable Name" | = | '`1_chip_1`' | *Str* |   |
| `out#0` | "Variable Value" | = | \[\] | *L\<Struct\>* |   |

\[2\] **Get Self Entity** (73) @(-71.5,-242)

\[3\] **Get List Length** (142) @(-173.5,207)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "List" | \<- | \[1\] **Get Custom Variable** (50) `out#0` "Variable Value" | *L\<Struct\>* |   |
| `in#0` | "List" | = | \[\] | *L\<Struct\>* | also wired |

\[4\] **Multiple Branches** (3) @(-125.5,419)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Control Expression" | \<- | \[6\] **Addition** (200) `out#0` "Result" | *Int* |   |
| `in#0` | "Control Expression" | = | 0 | *Int* | also wired |

\[5\] **When Entity Is Created** (71) @(-508.5,418)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `out.flow#0` |   | -\> | \[4\] **Multiple Branches** (3) `in.flow#0` |   |   |

\[6\] **Addition** (200) @(295.35715,450.92856)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` |   | \<- | \[3\] **Get List Length** (142) `out#0` "Length" | *Int* |   |
| `in#0` |   | = | 0 | *Int* | also wired |
| `in#1` |   | \<- | \[7\] **Get List Length** (142) `out#0` "Length" | *Int* |   |
| `in#1` |   | = | 0 | *Int* | also wired |
| `out#0` | "Result" | = | 0 | *Int* |   |

\[7\] **Get List Length** (142) @(355.35715,193.09525)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "List" | \<- | \[8\] **Get Custom Variable** (50) `out#0` "Variable Value" | *L\<Struct\>* |   |
| `in#0` | "List" | = | \[\] | *L\<Struct\>* | also wired |

\[8\] **Get Custom Variable** (50) @(345.35715,-97.90476)

| Pin | Name | Dir | Target / value | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| `in#0` | "Target Entity" | \<- | \[2\] **Get Self Entity** (73) `out#0` "Self Entity" | *Ety* |   |
| `in#1` | "Variable Name" | = | '`Norm1`' | *Str* |   |
| `out#0` | "Variable Value" | = | \[\] | *L\<Struct\>* |   |
