# Warnings and limits

Scanned 3 files:

- `codetest_1.gia`
- `codetest_2.gia`
- `data_order.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO* | listener-no-handlers | \[2\] **When Custom Variable Changes** in graph '*Graph*' has no name switch and no code after it: it reacts to nothing | `data_order.gia` |
| *INFO* | dynamic-reference | \[6\] **Get Custom Variable** `in#1` "Variable Name" in graph '*Graph*': name is computed at runtime (wired from \[7\] **Query Dictionary Value by Key**; Query Dictionary Value by Key output "Value" is computed at runtime); cannot be resolved statically | `data_order.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**Var1**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**MyList**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**Test**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**test**" is used in \['<u>\<creation\></u>*New Creation Status Decision Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**list**" is used in \['<u>\<filter\></u>*New Filter Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 12/1000 |
| prefabs (OBJECT) | 1/1000 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '<u>\<status\></u>*Status*' | 35/3000 | `codetest_2.gia` |
| '*New Node Graph*' | 30/3000 | `codetest_1.gia` |
| '*Graph*' | 27/3000 | `data_order.gia` |
| '<u>\<filter\></u>*New Filter Node Graph*' | 5/3000 | `codetest_1.gia` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 4/3000 | `codetest_1.gia` |
