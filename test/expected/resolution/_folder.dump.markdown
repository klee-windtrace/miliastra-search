# File `test/cases/resolution/test_All_Static.gia`

## Declarations (2)

| Name | Class | Guid | Role |
| --- | --- | --- | --- |
| "**Static\_1**" | SIGNAL\_NODE\_DECL | '`1610612737`' | dependency |
| "**Static\_2**" | SIGNAL\_NODE\_DECL | '`1610612741`' | dependency |

## Graphs (1)

| Name | Class | Guid | Nodes |
| --- | --- | --- | ---: |
| '*All\_Static*' | ENTITY\_NODE\_GRAPH | '`1073741825`' | **26** |

# File `test/cases/resolution/test_resolution.gia`

## Graphs (5)

| Name | Class | Guid | Nodes | Role |
| --- | --- | --- | ---: | --- |
| '*Dynamic*' | ENTITY\_NODE\_GRAPH | '`1073741826`' | **30** |   |
| '*Indirect*' | ENTITY\_NODE\_GRAPH | '`1073741827`' | **10** |   |
| '*Static*' | ENTITY\_NODE\_GRAPH | '`1073741825`' | **28** |   |
| '<u>\<composite\></u>*Create Composite Node*' | ENTITY\_NODE\_GRAPH | '`1610612737`' | **2** | dependency |
| '<u>\<composite\></u>*Create Composite Node(1)*' | ENTITY\_NODE\_GRAPH | '`1610612738`' | **1** | dependency |
