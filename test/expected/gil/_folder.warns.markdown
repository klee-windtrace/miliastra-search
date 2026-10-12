# Warnings and limits

Scanned 8 files:

- `test/cases/gil/stage_0.gil`
- `test/cases/gil/stage_012379.gil`
- `test/cases/gil/stage_1.gil`
- `test/cases/gil/stage_2.gil`
- `test/cases/gil/stage_3.gil`
- `test/cases/gil/stage_6.gil`
- `test/cases/gil/stage_7.gil`
- `test/cases/gil/stage_9.gil`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO*  | catch-all-listener | \[5\] **When Timer Is Triggered** in graph '*Send*' also runs code for every name: \[4\] **Send Signal** runs for every name (not a name switch) | `stage_012379.gil` |
| *INFO*  | catch-all-listener | \[5\] **When Timer Is Triggered** in graph '*Send*' also runs code for every name: \[4\] **Send Signal** runs for every name (not a name switch) | `stage_2.gil` |
| *INFO*  | signal-never-used | signal "**Signal\_3**" is declared but never sent or listened to in the scanned graphs | `stage_012379.gil` |
| *INFO*  | signal-never-used | signal "**Signal\_1**" is declared but never sent or listened to in the scanned graphs | `stage_9.gil` |
| **WARN**  | composite-definition-count-anomaly | composite "**Create Composite Node**" has **2** definition(s) in the scanned files (expected exactly 1) – guid=1073741825; guid=1073741825; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `stage_012379.gil` |
| **WARN**  | composite-definition-count-anomaly | composite "**Create Composite Node(1)**" has **2** definition(s) in the scanned files (expected exactly 1) – guid=1073741826; guid=1073741826; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `stage_012379.gil` |
| *INFO*  | struct-never-used | struct "**Structure\_2**" (guid=1077936131 fields=) is defined but never used in the scanned graphs | `stage_012379.gil` |
| *INFO*  | struct-never-used | struct "**Structure**" (guid=1077936129 fields=) is defined but never used in the scanned graphs | `stage_9.gil` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 4/1000 |
| signals (declared) | 3/100 |
| prefabs (OBJECT) | 10/1000 |
| dynamic entities (OBJECT\_ENTITY) | 6/3000 |
| ENTITY\_DEPLOYMENT\_GROUP | 2/500 |
| PRESET\_POINT | 10/2000 |
| ENVIRONMENT\_CONFIGURATION | 10/50 |
| CLASS | 9/100 |
| UNIT\_STATUS | 2/1000 |
| SKILL | 2/100 |
| TERRAIN\_ENTITY | 10/1200 |
| GLOBAL\_TIMER | 2/50 |
| static entities (unlimited) | **2** |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '*New Node Graph*' | 16/3000 | `stage_012379.gil` |
| '*New Node Graph*' | 16/3000 | `stage_1.gil` |
| '*Graph*' | 7/3000 | `stage_0.gil` |
| '*Graph*' | 7/3000 | `stage_012379.gil` |
| '*Structs*' | 7/3000 | `stage_012379.gil` |
| '*Structs*' | 7/3000 | `stage_3.gil` |
| '<u>\<skill\></u>*New Character Skill Node Graph*' | 5/3000 | `stage_012379.gil` |
| '<u>\<skill\></u>*New Character Skill Node Graph*' | 5/3000 | `stage_7.gil` |
| '*Both*' | 4/3000 | `stage_012379.gil` |
| '*Both*' | 4/3000 | `stage_2.gil` |
| '*Receive*' | 3/3000 | `stage_012379.gil` |
| '*Send*' | 3/3000 | `stage_012379.gil` |
| '<u>\<creation\></u>*New Creation Skill Node Graph*' | 3/3000 | `stage_012379.gil` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 3/3000 | `stage_012379.gil` |
| '<u>\<filter\></u>*New Filter Node Graph*' | 3/3000 | `stage_012379.gil` |
| '<u>\<filter\></u>*New Filter Node Graph\_1*' | 3/3000 | `stage_012379.gil` |
| '*Receive*' | 3/3000 | `stage_2.gil` |
| '*Send*' | 3/3000 | `stage_2.gil` |
| '<u>\<creation\></u>*New Creation Skill Node Graph*' | 3/3000 | `stage_7.gil` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph*' | 3/3000 | `stage_7.gil` |
