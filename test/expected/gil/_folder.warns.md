# Warnings and limits

## findings

*INFO*  catch-all-listener: \[5\] **When Timer Is Triggered** in graph '*Send*' also runs code for every name: \[4\] **Send Signal** runs for every name (not a name switch) \[`stage_012379.gil`\]<br>
*INFO*  catch-all-listener: \[5\] **When Timer Is Triggered** in graph '*Send*' also runs code for every name: \[4\] **Send Signal** runs for every name (not a name switch) \[`stage_2.gil`\]<br>
*INFO*  signal-never-used: signal "**Signal\_3**" is declared but never sent or listened to in the scanned graphs \[`stage_012379.gil`\]<br>
*INFO*  signal-never-used: signal "**Signal\_1**" is declared but never sent or listened to in the scanned graphs \[`stage_9.gil`\]<br>
**WARN**  composite-definition-count-anomaly: composite "**Create Composite Node**" has **2** definition(s) in the scanned files (expected exactly 1) – guid=1073741825; guid=1073741825; this points to a structural bug in the GIL/GIA or in how this tool parsed it \[`stage_012379.gil`\]<br>
**WARN**  composite-definition-count-anomaly: composite "**Create Composite Node(1)**" has **2** definition(s) in the scanned files (expected exactly 1) – guid=1073741826; guid=1073741826; this points to a structural bug in the GIL/GIA or in how this tool parsed it \[`stage_012379.gil`\]<br>
*INFO*  struct-never-used: struct "**Structure\_2**" (guid=1077936131 fields=) is defined but never used in the scanned graphs \[`stage_012379.gil`\]<br>
*INFO*  struct-never-used: struct "**Structure**" (guid=1077936129 fields=) is defined but never used in the scanned graphs \[`stage_9.gil`\]

---

## limits

composites: 4/1000 declared<br>
signals: 3/100 declared<br>
prefabs (OBJECT): 10/1000<br>
dynamic entities (OBJECT\_ENTITY): 6/3000<br>
ENTITY\_DEPLOYMENT\_GROUP: 2/500<br>
PRESET\_POINT: 10/2000<br>
ENVIRONMENT\_CONFIGURATION: 10/50<br>
CLASS: 9/100<br>
UNIT\_STATUS: 2/1000<br>
SKILL: 2/100<br>
TERRAIN\_ENTITY: 10/1200<br>
GLOBAL\_TIMER: 2/50<br>
static entities: **2**

---

## top graphs by node count:

'*New Node Graph*': 16/3000 nodes \[`stage_012379.gil`\]<br>
'*New Node Graph*': 16/3000 nodes \[`stage_1.gil`\]<br>
'*Graph*': 7/3000 nodes \[`stage_0.gil`\]<br>
'*Graph*': 7/3000 nodes \[`stage_012379.gil`\]<br>
'*Structs*': 7/3000 nodes \[`stage_012379.gil`\]<br>
'*Structs*': 7/3000 nodes \[`stage_3.gil`\]<br>
'<u>\<skill\></u>*New Character Skill Node Graph*': 5/3000 nodes \[`stage_012379.gil`\]<br>
'<u>\<skill\></u>*New Character Skill Node Graph*': 5/3000 nodes \[`stage_7.gil`\]<br>
'*Both*': 4/3000 nodes \[`stage_012379.gil`\]<br>
'*Both*': 4/3000 nodes \[`stage_2.gil`\]<br>
'*Receive*': 3/3000 nodes \[`stage_012379.gil`\]<br>
'*Send*': 3/3000 nodes \[`stage_012379.gil`\]<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*': 3/3000 nodes \[`stage_012379.gil`\]<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*': 3/3000 nodes \[`stage_012379.gil`\]<br>
'<u>\<filter\></u>*New Filter Node Graph*': 3/3000 nodes \[`stage_012379.gil`\]<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*': 3/3000 nodes \[`stage_012379.gil`\]<br>
'*Receive*': 3/3000 nodes \[`stage_2.gil`\]<br>
'*Send*': 3/3000 nodes \[`stage_2.gil`\]<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*': 3/3000 nodes \[`stage_7.gil`\]<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*': 3/3000 nodes \[`stage_7.gil`\]
