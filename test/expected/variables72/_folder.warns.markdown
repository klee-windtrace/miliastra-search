# Warnings and limits

Scanned 4 files:

- `variables_beyond.gia`
- `variables_classic.gil`
- `variables_graph.gia`
- `variables_ref.gil`

## Findings

| Level | Type | Message | File |
| --- | --- | --- | --- |
| *INFO* | declared-but-unused | graph variable "**String**" in graph '*New Node Graph*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Integer**" in graph '*New Node Graph*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Faction**" in graph '*New Node Graph*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Float**" in graph '*New Node Graph*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Entity**" in graph '*New Node Graph*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Private**" in graph '*New Node Graph*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Faction**" in graph '*Test5*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | declared-but-unused | graph variable "**Status**" in graph '<u>\<status\></u>*Status*' is declared but no node references it by literal name | `variables_graph.gia` |
| *INFO* | struct-never-used | struct "**Struct**" (guid=1077936129 fields=Add variable 1\|Add variable 2\|Add variable 3\|Add variable 4) is defined but never used in the scanned graphs | `variables_classic.gil` |
| *INFO* | custom-variable-type-conflict | custom variable "**On\_Prefab**" is declared with **2** different types: *Str* on "**Empty Model**", "**Same**", "**Value**", +1 more; *Int* on "**Type**" | `variables_beyond.gia` |
| *INFO* | custom-variable-type-conflict | custom variable "**String**" is declared with **2** different types: *Dict\<Str,Str\>* on "**Stage Entity**"; *Str* on "**Default Template**", "**Default Template(Edit Character)**" | `variables_classic.gil` |
| *INFO* | custom-variable-type-conflict | custom variable "**Struct**" is declared with **2** different types: *Dict\<Str,Struct\>* on "**Stage Entity**"; *Struct* struct=Struct on "**Default Template**", "**Default Template(Edit Character)**" | `variables_classic.gil` |

---

## Limits

| Resource | Used / max |
| --- | ---: |
| prefabs (OBJECT) | 5/1000 |
| dynamic entities (OBJECT\_ENTITY) | 11/3000 |
| PRESET\_POINT | 2/2000 |
| ENVIRONMENT\_CONFIGURATION | 2/50 |
| CLASS | 2/100 |
| TERRAIN\_ENTITY | 2/1200 |

---

## Top graphs by node count

| Graph | Effective nodes | File |
| --- | ---: | --- |
| '*New Node Graph*' | 0/3000 | `variables_graph.gia` |
| '*Test5*' | 0/3000 | `variables_graph.gia` |
| '<u>\<status\></u>*Status*' | 0/3000 | `variables_graph.gia` |
