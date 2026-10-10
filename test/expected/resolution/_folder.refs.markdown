# Reference index

Scanned 2 files:

- `test/cases/resolution/test_All_Static.gia`
- `test/cases/resolution/test_resolution.gia`

## References

### `composite` (2)

| composite | call |
| --- | --- |
| "**Create Composite Node**" | **6**<br>'*Dynamic*'<br>'*Indirect*'<br>'*Static*'<br>'<u>\<composite\></u>*Create Composite Node(1)*' |
| "**Create Composite Node(1)**" | **3**<br>'*Dynamic*'<br>'*Indirect*'<br>'*Static*' |

### `custom_variable` (7)

| custom\_variable | Type | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- |
| "**\* (listener for any name)**" |   |   |   |   | **1**<br>'*Dynamic*' |
| "**Static\_Var**" | *Flt* | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |
| "**test**" | *Str* | **1**<br>'*Dynamic*' | **0** |   |   |
| "**test1**" |   | **1**<br>'*Indirect*' | **0** |   |   |
| "**var1**" |   | **0** | **0** |   | **2**<br>'*Dynamic*'<br>'*Static*' |
| "**var2**" |   | **0** | **0** |   | **2**<br>'*Dynamic*'<br>'*Static*' |
| "**var3**" |   | **0** | **0** |   | **2**<br>'*Dynamic*'<br>'*Static*' |

### `global_timer` (3)

| global\_timer | start | stop | get-time | listen |
| --- | --- | --- | --- | --- |
| "**\* (listener for any name)**" |   |   |   | **1**<br>'*Dynamic*' |
| "**Static\_Global**" | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |   | **1**<br>'*All\_Static*' |
| "**test3**" |   |   | **1**<br>'*Indirect*' |   |

### `graph_variable` (9)

| graph\_variable | Type | Graph | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- | --- |
| "**Static\_Graph**" | *L\<Gid\>* | '*All\_Static*' | **1** | **1** | **1** | **1** |
| "**gvar1**" |   | '*Static*' | **0** | **0** |   | **2** |
| "**gvar3**" |   | '*Static*' | **0** | **0** |   | **1** |
| "**gvar4**" |   | '*Static*' | **0** | **0** |   | **1** |
| "**name**" | *Str* | '*Static*' | **1** | **0** |   |   |
| "**\* (listener for any name)**" |   |   |   |   |   | **1**<br>'*Dynamic*' |
| "**gvar1**" |   | '*Dynamic*' | **0** | **0** |   | **1** |
| "**name**" | *Str* | '*Dynamic*' | **1** | **0** |   |   |
| "**test2**" | *Str* | '*Indirect*' | **2** | **0** |   |   |

### `signal` (2)

| signal | listen | send |
| --- | --- | --- |
| "**Static\_1**" | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |
| "**Static\_2**" | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |

### `timer` (4)

| timer | Type | start | stop | listen |
| --- | --- | --- | --- | --- |
| "**\<dynamic\>**" |   | **0** | **0** | **1**<br>'*Dynamic*' |
| "**Static\_Timer**" | *onetime* | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' | **1**<br>'*All\_Static*' |
| "**test4**" |   | **0** | **1**<br>'*Indirect*' |   |
| "**tm**" |   | **0** | **0** | **1**<br>'*Static*' |
