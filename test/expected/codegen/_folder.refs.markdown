# Reference index

Scanned 2 files:

- `codetest_1.gia`
- `codetest_2.gia`

## References

### `composite` (10)

| composite | call |
| --- | --- |
| "**Calling Twice**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Exposed Computed**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Exposed Local**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Exposed Native**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Linear Flow**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Simple Data**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Terminal**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Two Exclusive Outs**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**Two In One Out**" | **1**<br>'<u>\<status\></u>*Status*' |
| "**With Event**" | **1**<br>'<u>\<status\></u>*Status*' |

### `custom_variable` (9)

| custom\_variable | Type | get | set | trigger |
| --- | --- | --- | --- | --- |
| "**list**" | *Dict* | **1**<br>'<u>\<filter\></u>*New Filter Node Graph*' | **0** |   |
| "**MyList**" | *L\<Int\>* | **1**<br>'*New Node Graph*' | **0** |   |
| "**none**" |   | **0** | **0** | **1**<br>'<u>\<composite\></u>*With Event*' |
| "**test**" | *Bol* | **1**<br>'<u>\<creation\></u>*New Creation Status Decision Node Graph*' | **0** |   |
| "**Test**" | *Dict* | **0** | **1**<br>'*New Node Graph*' |   |
| "**Var1**" | *Ety* | **0** | **1**<br>'*New Node Graph*' |   |
| "**x**" | *Bol* | **0** | **0** | **1**<br>'<u>\<status\></u>*Status*' |
| "**y**" | *Bol* | **0** | **0** | **1**<br>'<u>\<status\></u>*Status*' |
| "**z**" | *Bol* | **0** | **0** | **1**<br>'<u>\<status\></u>*Status*' |

### `graph_variable` (1)

| graph\_variable | Type | Graph | get | set | trigger |
| --- | --- | --- | --- | --- | --- |
| "**gvar**" | *Int* | '<u>\<status\></u>*Status*' | **0** | **1** | **1** |

### `literal_id` (1)

| literal\_id | Resolved | Ref |
| --- | --- | --- |
| "**Pfb:1077936129**" | OBJECT:"**Empty Model**" | **1**<br>'*New Node Graph*' |

### `timer` (1)

| timer | start | stop | listen |
| --- | --- | --- | --- |
| "**timer**" | **0** | **0** | **1**<br>'<u>\<composite\></u>*With Event*' |
