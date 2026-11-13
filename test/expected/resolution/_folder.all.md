# INFO

## FILE `test_All_Static.gia`

format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
detected\_by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header<br>
file\_size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6905<br>
container\_file\_type&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
engine\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.1.0<br>
mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beyond<br>
export\_name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;test\_All\_Static.gia<br>
node\_db\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
resources&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9<br>
primary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
dependencies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8<br>
graphs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
nodes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26<br>
composite\_bodies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
declarations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8<br>
structs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
mounts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
unresolved\_node\_types&nbsp;&nbsp;0<br>
CLASS ENTITY\_NODE\_GRAPH class=9 count=1<br>
CLASS COMPOSITE\_NODE\_DECL class=12 count=4<br>
CLASS SIGNAL\_NODE\_DECL class=14 count=4

---

## FILE `test_resolution.gia`

format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
detected\_by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header<br>
file\_size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8947<br>
container\_file\_type&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
engine\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.1.0<br>
mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beyond<br>
export\_name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;test\_resolution.gia<br>
node\_db\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
resources&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7<br>
primary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
dependencies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
graphs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
nodes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;71<br>
composite\_bodies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
declarations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
structs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
mounts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
unresolved\_node\_types&nbsp;&nbsp;0<br>
CLASS ENTITY\_NODE\_GRAPH class=9 count=5<br>
CLASS COMPOSITE\_NODE\_DECL class=12 count=2

---

# DUMP

## FILE `test_All_Static.gia`

**DECL** "**Static\_1**" SIGNAL\_NODE\_DECL class=14 guid='`1610612737`' category=SEND\_SIGNAL role=dependency<br>
**DECL** "**Static\_2**" SIGNAL\_NODE\_DECL class=14 guid='`1610612741`' category=SEND\_SIGNAL role=dependency<br>
**GRAPH** '*All\_Static*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741825`' kind=21001 service=20000 nodes=26<br>
**GRAPH\_VARIABLE** '*All\_Static*' '**Static\_Graph**' : *L\<Gid\>* = \[\]

## FILE `test_resolution.gia`

**GRAPH** '*Dynamic*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741826`' kind=21001 service=20000 nodes=30<br>
**GRAPH** '*Indirect*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741827`' kind=21001 service=20000 nodes=10<br>
**GRAPH** '*Static*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741825`' kind=21001 service=20000 nodes=28<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612737`' kind=21002 service=20000 nodes=2 role=dependency decl='`1610612737`'<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612738`' kind=21002 service=20000 nodes=1 role=dependency decl='`1610612738`'<br>
**GRAPH\_VARIABLE** '*Dynamic*' '**name**' : *Str* = '`gvar3`'<br>
**GRAPH\_VARIABLE** '*Indirect*' '**test2**' : *Str* = '`test4`'<br>
**GRAPH\_VARIABLE** '*Static*' '**name**' : *Str* = '`gvar3`'

---

# REFS

`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Create Composite Node**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **6** call: \['*Dynamic*'; '*Indirect*'; '*Static*'; '<u>\<composite\></u>*Create Composite Node(1)*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Create Composite Node(1)**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **3** call: \['*Dynamic*'; '*Indirect*'; '*Static*'\]<br>
`custom_variable`  "**\* (listener for any name)**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** listen: \['*Dynamic*'\]<br>
`custom_variable`  "**Static\_Var**" (*Flt*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*All\_Static*'\], **1** set: \['*All\_Static*'\], **1** trigger: \['*All\_Static*'\], **1** listen: \['*All\_Static*'\]<br>
`custom_variable`  "**test**" (*Str*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Dynamic*'\], **0** set: \[\]<br>
`custom_variable`  "**test1**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Indirect*'\], **0** set: \[\]<br>
`custom_variable`  "**var1**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **2** listen: \['*Dynamic*'; '*Static*'\]<br>
`custom_variable`  "**var2**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **2** listen: \['*Dynamic*'; '*Static*'\]<br>
`custom_variable`  "**var3**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** get: \[\], **0** set: \[\], **2** listen: \['*Dynamic*'; '*Static*'\]<br>
`global_timer`&nbsp;&nbsp;&nbsp;&nbsp; "**\* (listener for any name)**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** listen: \['*Dynamic*'\]<br>
`global_timer`&nbsp;&nbsp;&nbsp;&nbsp; "**Static\_Global**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** start: \['*All\_Static*'\], **1** stop: \['*All\_Static*'\], **1** listen: \['*All\_Static*'\]<br>
`global_timer`&nbsp;&nbsp;&nbsp;&nbsp; "**test3**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get-time: \['*Indirect*'\]<br>
`graph_variable`&nbsp;&nbsp; "**Static\_Graph**" (*L\<Gid\>*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*All\_Static*'\]: **1** get, **1** set, **1** trigger, **1** listen<br>
`graph_variable`&nbsp;&nbsp; "**gvar1**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Static*'\]: **0** get, **0** set, **2** listen<br>
`graph_variable`&nbsp;&nbsp; "**gvar3**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Static*'\]: **0** get, **0** set, **1** listen<br>
`graph_variable`&nbsp;&nbsp; "**gvar4**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Static*'\]: **0** get, **0** set, **1** listen<br>
`graph_variable`&nbsp;&nbsp; "**name**" (*Str*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Static*'\]: **1** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**\* (listener for any name)**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** listen: \['*Dynamic*'\]<br>
`graph_variable`&nbsp;&nbsp; "**gvar1**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Dynamic*'\]: **0** get, **0** set, **1** listen<br>
`graph_variable`&nbsp;&nbsp; "**name**" (*Str*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Dynamic*'\]: **1** get, **0** set<br>
`graph_variable`&nbsp;&nbsp; "**test2**" (*Str*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \['*Indirect*'\]: **2** get, **0** set<br>
`signal`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Static\_1**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** listen: \['*All\_Static*'\], **1** send: \['*All\_Static*'\]<br>
`signal`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Static\_2**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** listen: \['*All\_Static*'\], **1** send: \['*All\_Static*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**\<dynamic\>**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** start: \[\], **0** stop: \[\], **1** listen: \['*Dynamic*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Static\_Timer**" (*onetime*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** start: \['*All\_Static*'\], **1** stop: \['*All\_Static*'\], **1** listen: \['*All\_Static*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**test4**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** start: \[\], **1** stop: \['*Indirect*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**tm**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **0** start: \[\], **0** stop: \[\], **1** listen: \['*Static*'\]

---

# WARNS

## findings

*INFO*  catch-all-listener: \[1\] **When Custom Variable Changes** in graph '*Dynamic*' also runs code for every name: \[21\] **Settle Stage** runs for every name (not a name switch) \[`test_resolution.gia`\]<br>
*INFO*  catch-all-listener: \[2\] **When Node Graph Variable Changes** in graph '*Dynamic*' also runs code for every name: \[11\] **Double Branch**: Equal does not compare the event's name (\[12\] **Equal**) \[`test_resolution.gia`\]<br>
*INFO*  dynamic-reference: \[3\] **When Timer Is Triggered** name switch in graph '*Dynamic*': name is computed at runtime (\[19\] **Double Branch** compares via \[20\] **Equal** with a value that is not static: Get Custom Variable output "Variable Value" is computed at runtime); cannot be resolved statically \[`test_resolution.gia`\]<br>
*INFO*  catch-all-listener: \[4\] **When Global Timer Is Triggered** in graph '*Dynamic*' also runs code for every name: \[22\] **Settle Stage** runs for every name (not a name switch) \[`test_resolution.gia`\]<br>
*INFO*  listener-no-handlers: \[4\] **When Global Timer Is Triggered** in graph '*Static*' has no name switch and no code after it: it reacts to nothing \[`test_resolution.gia`\]<br>
**WARN**  used-but-undeclared: graph variable "**gvar1**" is referenced in graph '*Dynamic*' but not declared there \[`test_resolution.gia`\]<br>
**WARN**  used-but-undeclared: graph variable "**gvar1**" is referenced in graph '*Static*' but not declared there \[`test_resolution.gia`\]<br>
**WARN**  used-but-undeclared: graph variable "**gvar3**" is referenced in graph '*Static*' but not declared there \[`test_resolution.gia`\]<br>
**WARN**  used-but-undeclared: graph variable "**gvar4**" is referenced in graph '*Static*' but not declared there \[`test_resolution.gia`\]

---

## limits

composites: 2/1000 declared<br>
signals: 2/99 declared

---

## top graphs by node count:

'*Dynamic*': 37/3000 nodes \[`test_resolution.gia`\]<br>
'*Static*': 35/3000 nodes \[`test_resolution.gia`\]<br>
'*All\_Static*': 26/3000 nodes \[`test_All_Static.gia`\]<br>
'*Indirect*': 15/3000 nodes \[`test_resolution.gia`\]
