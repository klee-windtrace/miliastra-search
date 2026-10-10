# Warnings and limits

Scanned 4 files:

- `test/cases/composites/test_All_Composite.gia`
- `test/cases/composites/test_composite.gia`
- `test/cases/composites/test_composite.gil`
- `test/cases/composites/var_change.gia`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| **WARN**  | composite-definition-count-anomaly | composite "**Create Composite Node**" has **3** definition(s) in the scanned files (expected exactly 1) – guid=1610612745; guid=1610613134; guid=1610613134; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `test_All_Composite.gia` |
| **WARN**  | composite-definition-count-anomaly | composite "**Create Composite Node(1)**" has **3** definition(s) in the scanned files (expected exactly 1) – guid=1610612746; guid=1610613135; guid=1610613135; this points to a structural bug in the GIL/GIA or in how this tool parsed it | `test_All_Composite.gia` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 33/1000 |
| signals (declared) | 2/100 |
| prefabs (OBJECT) | 2/1000 |
| dynamic entities (OBJECT\_ENTITY) | 2/3000 |
| PRESET\_POINT | 1/2000 |
| ENVIRONMENT\_CONFIGURATION | 1/50 |
| CLASS | 1/100 |
| SKILL | 2/100 |
| TERRAIN\_ENTITY | 1/1200 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '*All\_Composite*' | 52/3000 | `test_All_Composite.gia` |
| '*New Node Graph*' | 17/3000 | `test_composite.gia` |
| '*New Node Graph*' | 17/3000 | `test_composite.gil` |
| '*VAR\_TEST*' | 11/3000 | `var_change.gia` |
