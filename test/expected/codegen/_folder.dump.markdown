# File `codetest_1.gia`

## Graphs (3)

| Name | Class | Guid | Nodes |
| --- | --- | --- | ---: |
| '*New Node Graph*' | ENTITY\_NODE\_GRAPH | '`1073741829`' | **30** |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | CREATION\_STATUS\_DECISION\_GRAPH | '`1082130435`' | **4** |
| '<u>\<filter\></u>*New Filter Node Graph*' | INTEGER\_FILTER\_GRAPH | '`1082130436`' | **5** |

## Resources (1)

| Name | Class | Guid | Parent |
| --- | --- | --- | --- |
| "**Empty Model**" | OBJECT | '`1077936129`' | (entities: **0**) |

# File `codetest_2.gia`

## Graphs (11)

| Name | Class | Guid | Nodes | Role |
| --- | --- | --- | ---: | --- |
| '<u>\<status\></u>*Status*' | STATUS\_NODE\_GRAPH | '`1073741830`' | **17** |   |
| '<u>\<composite\></u>*Calling Twice*' | ENTITY\_NODE\_GRAPH | '`1610612743`' | **3** | dependency |
| '<u>\<composite\></u>*Exposed Computed*' | ENTITY\_NODE\_GRAPH | '`1610612748`' | **2** | dependency |
| '<u>\<composite\></u>*Exposed Local*' | ENTITY\_NODE\_GRAPH | '`1610612745`' | **2** | dependency |
| '<u>\<composite\></u>*Exposed Native*' | ENTITY\_NODE\_GRAPH | '`1610612746`' | **1** | dependency |
| '<u>\<composite\></u>*Linear Flow*' | ENTITY\_NODE\_GRAPH | '`1610612738`' | **1** | dependency |
| '<u>\<composite\></u>*Simple Data*' | ENTITY\_NODE\_GRAPH | '`1610612737`' | **1** | dependency |
| '<u>\<composite\></u>*Terminal*' | ENTITY\_NODE\_GRAPH | '`1610612739`' | **1** | dependency |
| '<u>\<composite\></u>*Two Exclusive Outs*' | ENTITY\_NODE\_GRAPH | '`1610612742`' | **1** | dependency |
| '<u>\<composite\></u>*Two In One Out*' | ENTITY\_NODE\_GRAPH | '`1610612741`' | **2** | dependency |
| '<u>\<composite\></u>*With Event*' | ENTITY\_NODE\_GRAPH | '`1610612744`' | **4** | dependency |

## Variables

| Graph | Variable | Type | Value |
| --- | --- | --- | --- |
| '<u>\<status\></u>*Status*' | '**gvar**' | *Int* | 1 |
