# Warnings and limits

## findings

*INFO*  listener-no-handlers: \[2\] **When Custom Variable Changes** in graph '*Graph*' has no name switch and no code after it: it reacts to nothing \[`data_order.gia`\]<br>
*INFO*  dynamic-reference: \[6\] **Get Custom Variable** `in#1` "Variable Name" in graph '*Graph*': name is computed at runtime (wired from \[7\] **Query Dictionary Value by Key**; Query Dictionary Value by Key output "Value" is computed at runtime); cannot be resolved statically \[`data_order.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**Var1**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**MyList**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**Test**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**test**" is used in \['<u>\<creation\></u>*New Creation Status Decision Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]<br>
*INFO*  custom-variable-undeclared: custom variable "**list**" is used in \['<u>\<filter\></u>*New Filter Node Graph*'\] but no entity, prefab or template declares it \[`codetest_1.gia`\]

---

## limits

composites: 12/1000 declared<br>
prefabs (OBJECT): 1/1000

---

## top graphs by node count:

'<u>\<status\></u>*Status*': 35/3000 nodes \[`codetest_2.gia`\]<br>
'*New Node Graph*': 30/3000 nodes \[`codetest_1.gia`\]<br>
'*Graph*': 27/3000 nodes \[`data_order.gia`\]<br>
'<u>\<filter\></u>*New Filter Node Graph*': 5/3000 nodes \[`codetest_1.gia`\]<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*': 4/3000 nodes \[`codetest_1.gia`\]
