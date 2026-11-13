# Warnings and limits

Scanned 1 file:

- `codetest_3.gia`

## Findings

| Level | Type | Message |
| --- | --- | --- |
| *INFO* | dynamic-reference | \[1\] **Set Custom Variable** `in#1` "Variable Name" in graph '*Dead composite*': name is computed at runtime (Data Type Conversion output "Output" is computed at runtime); cannot be resolved statically |
| *INFO* | dynamic-reference | \[2\] **Get Custom Variable** `in#1` "Variable Name" in graph '*Dead composite*': name is computed at runtime (Data Type Conversion output "Output" is computed at runtime); cannot be resolved statically |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| composites (declared) | 3/1000 |

---

## Top graphs by node count

| Graph | Effective nodes |
| --- | ---: |
| '*Composite with event*' | 39/3000 |
| '*Nested event*' | 31/3000 |
| '*Dead composite*' | 20/3000 |
| '*Cycle with no entry*' | 16/3000 |
