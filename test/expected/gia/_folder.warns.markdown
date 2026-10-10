# Warnings and limits

Scanned 10 files:

- `test/cases/gia/sample_0_main.gia`
- `test/cases/gia/sample_1.gia`
- `test/cases/gia/sample_2.gia`
- `test/cases/gia/sample_3.gia`
- `test/cases/gia/sample_4.gia`
- `test/cases/gia/sample_5.gia`
- `test/cases/gia/sample_6.gia`
- `test/cases/gia/sample_7.gia`
- `test/cases/gia/sample_8.gia`
- `test/cases/gia/sample_9.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO*  | catch-all-listener | \[5\] **When Timer Is Triggered** in graph '*Send*' also runs code for every name: \[4\] **Send Signal** runs for every name (not a name switch) | `sample_2.gia` |
| *INFO*  | catch-all-listener | \[1\] **When Custom Variable Changes** in graph '*Variables*' also runs code for every name: \[6\] **Double Branch**: condition is not an Equal comparison | `sample_5.gia` |
| *INFO*  | catch-all-listener | \[3\] **When Node Graph Variable Changes** in graph '*Variables*' also runs code for every name: \[5\] **Set Node Graph Variable** runs for every name (not a name switch) | `sample_5.gia` |
| *INFO*  | signal-never-used | signal "**Signal\_1**" is declared but never sent or listened to in the scanned graphs | `sample_9.gia` |
| *INFO*  | struct-never-used | struct "**Structure**" (guid=1077936129 fields=) is defined but never used in the scanned graphs | `sample_9.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 2/1000 |
| signals (declared) | 2/100 |
| prefabs (OBJECT) | 5/1000 |
| dynamic entities (OBJECT\_ENTITY) | 3/3000 |
| ENTITY\_DEPLOYMENT\_GROUP | 1/500 |
| PRESET\_POINT | 1/2000 |
| ENVIRONMENT\_CONFIGURATION | 1/50 |
| CLASS | 1/100 |
| UNIT\_STATUS | 1/1000 |
| SKILL | 1/100 |
| TERRAIN\_ENTITY | 1/1200 |
| GLOBAL\_TIMER | 1/50 |
| static entities (unlimited) | **1** |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '*New Node Graph*' | 16/3000 | `sample_1.gia` |
| '*Lists*' | 14/3000 | `sample_4.gia` |
| '*Variables*' | 10/3000 | `sample_5.gia` |
| '*Graph*' | 7/3000 | `sample_0_main.gia` |
| '*Structs*' | 7/3000 | `sample_3.gia` |
| '*Graph*' | 7/3000 | `sample_8.gia` |
| '<u>\<skill\></u>*New Character Skill Node Graph*' | 5/3000 | `sample_7.gia` |
| '*Both*' | 4/3000 | `sample_2.gia` |
| '*Receive*' | 3/3000 | `sample_2.gia` |
| '*Send*' | 3/3000 | `sample_2.gia` |
| '<u>\<creation\></u>*New Creation Skill Node Graph*' | 3/3000 | `sample_7.gia` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 3/3000 | `sample_7.gia` |
| '<u>\<filter\></u>*New Filter Node Graph*' | 3/3000 | `sample_7.gia` |
| '<u>\<filter\></u>*New Filter Node Graph\_1*' | 3/3000 | `sample_7.gia` |
| '*New Node Graph*' | 2/3000 | `sample_6.gia` |
| '*New Node Graph\_1*' | 2/3000 | `sample_6.gia` |
| '<u>\<creation\></u>*New Creation Status Node Graph*' | 2/3000 | `sample_7.gia` |
| '<u>\<skill\></u>*New Character Control Skill Node Graph*' | 2/3000 | `sample_7.gia` |
| '<u>\<skill\></u>*New Character Skill Node Graph*' | 1/3000 | `sample_9.gia` |
| '<u>\<creation\></u>*New Creation Skill Node Graph*' | 1/3000 | `sample_9.gia` |
