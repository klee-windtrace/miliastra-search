# INFO

## FILE `codetest_3.gia`

format&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
detected\_by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header<br>
file\_size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11438<br>
container\_file\_type&nbsp;&nbsp;&nbsp;&nbsp;gia<br>
engine\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beyond<br>
export\_name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;codetest\_3.gia<br>
node\_db\_version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.2.0<br>
resources&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
primary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7<br>
dependencies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
graphs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7<br>
nodes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46<br>
composite\_bodies&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
declarations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
structs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
mounts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
unresolved\_node\_types&nbsp;&nbsp;0<br>
CLASS ENTITY\_NODE\_GRAPH class=9 count=7<br>
CLASS COMPOSITE\_NODE\_DECL class=12 count=3

---

# DUMP

**GRAPH** '*Composite with event*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741827`' kind=21001 service=20000 nodes=9<br>
**GRAPH** '*Cycle with no entry*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741826`' kind=21001 service=20000 nodes=12<br>
**GRAPH** '*Dead composite*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741825`' kind=21001 service=20000 nodes=10<br>
**GRAPH** '*Nested event*' ENTITY\_NODE\_GRAPH class=9 guid='`1073741828`' kind=21001 service=20000 nodes=4<br>
**GRAPH** '<u>\<composite\></u>*Naive execution delay*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612738`' kind=21002 service=20000 nodes=6 role=dependency decl='`1610612738`'<br>
**GRAPH** '<u>\<composite\></u>*Test Delay Print*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612739`' kind=21002 service=20000 nodes=3 role=dependency decl='`1610612739`'<br>
**GRAPH** '<u>\<composite\></u>*Wrapped (Custom Variable)*' ENTITY\_NODE\_GRAPH class=9 guid='`1610612737`' kind=21002 service=20000 nodes=2 role=dependency decl='`1610612737`'

---

# REFS

`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Naive execution delay**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **5** call: \['*Composite with event*'; '<u>\<composite\></u>*Test Delay Print*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Test Delay Print**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **3** call: \['*Nested event*'\]<br>
`composite`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Wrapped (Custom Variable)**"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **10** call: \['*Composite with event*'; '*Cycle with no entry*'; '*Dead composite*'\]<br>
`custom_variable`  "**\<dynamic\>**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Dead composite*'\], **1** set: \['*Dead composite*'\]<br>
`custom_variable`  "**1**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Dead composite*'\], **1** set: \['*Dead composite*'\]<br>
`custom_variable`  "**2**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Dead composite*'\], **1** set: \['*Dead composite*'\]<br>
`custom_variable`  "**4**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Dead composite*'\], **1** set: \['*Dead composite*'\]<br>
`custom_variable`  "**5**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Dead composite*'\], **1** set: \['*Dead composite*'\]<br>
`custom_variable`  "**A**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Cycle with no entry*'\], **0** set: \[\], **1** trigger: \['*Cycle with no entry*'\]<br>
`custom_variable`  "**B**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Cycle with no entry*'\], **0** set: \[\], **1** trigger: \['*Cycle with no entry*'\]<br>
`custom_variable`  "**X**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Composite with event*'\], **0** set: \[\], **1** trigger: \['*Composite with event*'\]<br>
`custom_variable`  "**Y**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Composite with event*'\], **0** set: \[\], **1** trigger: \['*Composite with event*'\]<br>
`custom_variable`  "**Z**" (*Int*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** get: \['*Composite with event*'\], **0** set: \[\], **1** trigger: \['*Composite with event*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**1**" (*onetime*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** start: \['*Composite with event*'\], **0** stop: \[\], **1** listen: \['*Composite with event*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**2**" (*onetime*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** start: \['*Composite with event*'\], **0** stop: \[\], **1** listen: \['*Composite with event*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**3**" (*onetime*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** start: \['*Composite with event*'\], **0** stop: \[\], **1** listen: \['*Composite with event*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**4**" (*onetime*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1** start: \['*Composite with event*'\], **0** stop: \[\], **1** listen: \['*Composite with event*'\]<br>
`timer`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "**Delay**" (*onetime*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **3** start: \['*Nested event*'\], **0** stop: \[\], **3** listen: \['*Nested event*'\]

---

# WARNS

## findings

*INFO*  dynamic-reference: \[1\] **Set Custom Variable** `in#1` "Variable Name" in graph '*Dead composite*': name is computed at runtime (Data Type Conversion output "Output" is computed at runtime); cannot be resolved statically<br>
*INFO*  dynamic-reference: \[2\] **Get Custom Variable** `in#1` "Variable Name" in graph '*Dead composite*': name is computed at runtime (Data Type Conversion output "Output" is computed at runtime); cannot be resolved statically

---

## limits

composites: 3/1000 declared

---

## top graphs by node count:

'*Composite with event*': 39/3000 nodes<br>
'*Nested event*': 31/3000 nodes<br>
'*Dead composite*': 20/3000 nodes<br>
'*Cycle with no entry*': 16/3000 nodes
