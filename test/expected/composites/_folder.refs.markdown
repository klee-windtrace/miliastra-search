# Reference index

Scanned 4 files:

- `test/cases/composites/test_All_Composite.gia`
- `test/cases/composites/test_composite.gia`
- `test/cases/composites/test_composite.gil`
- `test/cases/composites/var_change.gia`

## References

### `composite` (29)

| composite | call |
| --- | --- |
| "**Create Composite Node**" | **5**<br>'*All\_Composite*'<br>'*New Node Graph*' |
| "**Create Composite Node(1)**" | **3**<br>'*All\_Composite*'<br>'<u>\<composite\></u>*Create Composite Node*' |
| "**Create Composite Node(10)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(11)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(12)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(13)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(14)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(15)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(16)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(17)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(18)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(19)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(2)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(20)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(21)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(22)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(23)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(24)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(25)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(3)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(4)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(5)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(6)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(7)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(8)**" | **1**<br>'*All\_Composite*' |
| "**Create Composite Node(9)**" | **1**<br>'*All\_Composite*' |
| "**VAR\_TEST\_1**" | **1**<br>'*VAR\_TEST*' |
| "**VAR\_TEST\_2**" | **1**<br>'*VAR\_TEST*' |
| "**VAR\_TEST\_3**" | **1**<br>'*VAR\_TEST*' |

### `custom_variable` (3)

| custom\_variable | Type | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- |
| "**Static\_Var**" | *Flt* | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' | **1**<br>'<u>\<composite\></u>*Create Composite Node(15)*' | **1**<br>'*All\_Composite*' |
| "**Var1**" | *Int* | **0** | **0** | **1**<br>'*VAR\_TEST*' | **1**<br>'*VAR\_TEST*' |
| "**Var2**" | *Str* | **0** | **0** | **1**<br>'<u>\<composite\></u>*VAR\_TEST\_2*' | **1**<br>'<u>\<composite\></u>*VAR\_TEST\_3*' |

### `global_timer` (1)

| global\_timer | start | stop | listen |
| --- | --- | --- | --- |
| "**Static\_Global**" | **1**<br>'<u>\<composite\></u>*Create Composite Node(5)*' | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |

### `graph_variable` (3)

| graph\_variable | Type | Graph | get | set | trigger | listen |
| --- | --- | --- | --- | --- | --- | --- |
| "**Static\_Graph**" | *L\<Gid\>* | '*All\_Composite*' | **1** | **1** | **1** | **1** |
| "**Var\_1**" | *Int* | '*New Node Graph*' | **2** | **2** |   |   |
| "**Var\_1**" | *Int* | '*New Node Graph*' | **2** | **2** |   |   |

### `literal_id` (4)

| literal\_id | Resolved | Ref |
| --- | --- | --- |
| "**Cfg:1098907649**" | SKILL:"**test\_skill**" | **2**<br>'*New Node Graph*' |
| "**Gid:1077936131**" | OBJECT\_ENTITY:"**entity\_test**" | **2**<br>'*New Node Graph*' |
| "**Int: 1073741825**" | INTERFACE\_LAYOUT:"**Default Layout**" | **2**<br>'*New Node Graph*' |
| "**Pfb:10005018**" |   | **2**<br>'*New Node Graph*' |

### `signal` (2)

| signal | listen | send |
| --- | --- | --- |
| "**Static\_1**" | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |
| "**Static\_2**" | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |

### `timer` (1)

| timer | Type | start | stop | listen |
| --- | --- | --- | --- | --- |
| "**Static\_Timer**" | *onetime* | **1**<br>'<u>\<composite\></u>*Create Composite Node(4)*' | **1**<br>'*All\_Composite*' | **1**<br>'*All\_Composite*' |
