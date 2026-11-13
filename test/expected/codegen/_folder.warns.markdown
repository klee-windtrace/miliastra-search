# Warnings and limits

Scanned 2 files:

- `codetest_1.gia`
- `codetest_2.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO* | custom-variable-undeclared | custom variable "**Var1**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**MyList**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**Test**" is used in \['*New Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**test**" is used in \['<u>\<creation\></u>*New Creation Status Decision Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |
| *INFO* | custom-variable-undeclared | custom variable "**list**" is used in \['<u>\<filter\></u>*New Filter Node Graph*'\] but no entity, prefab or template declares it | `codetest_1.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 10/1000 |
| prefabs (OBJECT) | 1/1000 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '<u>\<status\></u>*Status*' | 35/3000 | `codetest_2.gia` |
| '*New Node Graph*' | 30/3000 | `codetest_1.gia` |
| '<u>\<filter\></u>*New Filter Node Graph*' | 5/3000 | `codetest_1.gia` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 4/3000 | `codetest_1.gia` |
