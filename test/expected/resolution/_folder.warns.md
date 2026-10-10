# Warnings and limits

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
signals: 2/100 declared

---

## top graphs by node count:

'*Dynamic*': 37/3000 nodes \[`test_resolution.gia`\]<br>
'*Static*': 35/3000 nodes \[`test_resolution.gia`\]<br>
'*All\_Static*': 26/3000 nodes \[`test_All_Static.gia`\]<br>
'*Indirect*': 15/3000 nodes \[`test_resolution.gia`\]
