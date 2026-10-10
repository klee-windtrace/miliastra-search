# Warnings and limits

Scanned 5 files:

- `test/cases/mounts/composite_folders.gil`
- `test/cases/mounts/graph_folders.gil`
- `test/cases/mounts/test_folders.gia`
- `test/cases/mounts/test_folders.gil`
- `test/cases/mounts/test_mount.gil`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO*  | signal-never-used | signal "**Signal\_Name**" is declared but never sent or listened to in the scanned graphs | `test_folders.gia` |
| *INFO*  | signal-never-used | signal "**Signal\_Name**" is declared but never sent or listened to in the scanned graphs | `test_folders.gil` |
| *INFO*  | composite-never-called | composite "**01**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**02**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**03**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**A1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**A2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**A3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**B1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**B2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**B3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**C1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**C2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**C3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**D1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**D2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**D3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**E1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**E2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**E3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**F1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**F2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**F3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**G1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**G2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**G3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**H1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**H2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**H3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**I1**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**I2**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**I3**" is defined but never called in the scanned graphs | `composite_folders.gil` |
| *INFO*  | composite-never-called | composite "**AA - 01**" is defined but never called in the scanned graphs | `graph_folders.gil` |
| *INFO*  | composite-never-called | composite "**BB - 02**" is defined but never called in the scanned graphs | `graph_folders.gil` |
| *INFO*  | composite-never-called | composite "**CC - 03**" is defined but never called in the scanned graphs | `graph_folders.gil` |
| *INFO*  | composite-never-called | composite "**Tab A - 04**" is defined but never called in the scanned graphs | `graph_folders.gil` |
| *INFO*  | composite-never-called | composite "**Tab C - 05**" is defined but never called in the scanned graphs | `graph_folders.gil` |
| *INFO*  | composite-never-called | composite "**Tab B - 06**" is defined but never called in the scanned graphs | `graph_folders.gil` |
| **WARN**  | composite-definition-count-anomaly | composite "**Composite in custom**" has **2** definition(s) in the scanned files (expected exactly 1) – guid=1610612738; guid=1610612738; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `test_folders.gia` |
| *INFO*  | composite-never-called | composite "**Composite in custom**" is defined but never called in the scanned graphs | `test_folders.gia` |
| **WARN**  | composite-definition-count-anomaly | composite "**Composite in default**" has **2** definition(s) in the scanned files (expected exactly 1) – guid=1610612737; guid=1610612737; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `test_folders.gia` |
| *INFO*  | composite-never-called | composite "**Composite in default**" is defined but never called in the scanned graphs | `test_folders.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 40/1000 |
| signals (declared) | 1/100 |
| prefabs (OBJECT) | 12/1000 |
| dynamic entities (OBJECT\_ENTITY) | 13/3000 |
| PRESET\_POINT | 5/2000 |
| ENVIRONMENT\_CONFIGURATION | 5/50 |
| CLASS | 8/100 |
| UNIT\_STATUS | 8/1000 |
| SKILL | 6/100 |
| TERRAIN\_ENTITY | 4/1200 |
| static entities (unlimited) | **5** |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '<u>\<skill\></u>*New Character Skill Node Graph - 14*' | 1/3000 | `graph_folders.gil` |
| '<u>\<skill\></u>*New Character Skill Node Graph - 15*' | 1/3000 | `graph_folders.gil` |
| '<u>\<creation\></u>*New Creation Skill Node Graph - 16*' | 1/3000 | `graph_folders.gil` |
| '<u>\<creation\></u>*New Creation Skill Node Graph - 17*' | 1/3000 | `graph_folders.gil` |
| '<u>\<creation\></u>*New Creation Status Node Graph - 18*' | 1/3000 | `graph_folders.gil` |
| '<u>\<creation\></u>*New Creation Status Node Graph - 19*' | 1/3000 | `graph_folders.gil` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph - 20*' | 1/3000 | `graph_folders.gil` |
| '<u>\<creation\></u>*New Creation Status Decision Node Graph - 21*' | 1/3000 | `graph_folders.gil` |
| '<u>\<skill\></u>*New Character Control Skill Node Graph*' | 1/3000 | `graph_folders.gil` |
| '<u>\<filter\></u>*New Filter Node Graph Bool*' | 1/3000 | `graph_folders.gil` |
| '<u>\<filter\></u>*New Filter Node Graph Int*' | 1/3000 | `graph_folders.gil` |
| '<u>\<skill\></u>*Character skill, custom*' | 1/3000 | `test_folders.gia` |
| '<u>\<skill\></u>*Character skill, default*' | 1/3000 | `test_folders.gia` |
| '<u>\<creation\></u>*Creation skill, custom*' | 1/3000 | `test_folders.gia` |
| '<u>\<creation\></u>*Creation skill, default*' | 1/3000 | `test_folders.gia` |
| '<u>\<creation\></u>*Creation status, custom*' | 1/3000 | `test_folders.gia` |
| '<u>\<creation\></u>*Creation status, default*' | 1/3000 | `test_folders.gia` |
| '<u>\<creation\></u>*Creation decision, custom*' | 1/3000 | `test_folders.gia` |
| '<u>\<creation\></u>*Creation decision, default*' | 1/3000 | `test_folders.gia` |
| '<u>\<skill\></u>*Character control, custom*' | 1/3000 | `test_folders.gia` |
