# Warnings and limits

## findings

*INFO*  catch-all-listener: \[5\] **When Timer Is Triggered** in graph '*Send*' also runs code for every name: \[4\] **Send Signal** runs for every name (not a name switch) \[`sample_2.gia`\]<br>
*INFO*  catch-all-listener: \[1\] **When Custom Variable Changes** in graph '*Variables*' also runs code for every name: \[6\] **Double Branch**: condition is not an Equal comparison \[`sample_5.gia`\]<br>
*INFO*  catch-all-listener: \[3\] **When Node Graph Variable Changes** in graph '*Variables*' also runs code for every name: \[5\] **Set Node Graph Variable** runs for every name (not a name switch) \[`sample_5.gia`\]<br>
*INFO*  signal-never-used: signal "**Signal\_1**" is declared but never sent or listened to in the scanned graphs \[`sample_9.gia`\]<br>
*INFO*  struct-never-used: struct "**Structure**" (guid=1077936129 fields=) is defined but never used in the scanned graphs \[`sample_9.gia`\]

---

## limits

composites: 2/1000 declared<br>
signals: 2/100 declared<br>
prefabs (OBJECT): 5/1000<br>
dynamic entities (OBJECT\_ENTITY): 3/3000<br>
ENTITY\_DEPLOYMENT\_GROUP: 1/500<br>
PRESET\_POINT: 1/2000<br>
ENVIRONMENT\_CONFIGURATION: 1/50<br>
CLASS: 1/100<br>
UNIT\_STATUS: 1/1000<br>
SKILL: 1/100<br>
TERRAIN\_ENTITY: 1/1200<br>
GLOBAL\_TIMER: 1/50<br>
static entities: **1**

---

## top graphs by node count:

'*New Node Graph*': 16/3000 nodes \[`sample_1.gia`\]<br>
'*Lists*': 14/3000 nodes \[`sample_4.gia`\]<br>
'*Variables*': 10/3000 nodes \[`sample_5.gia`\]<br>
'*Graph*': 7/3000 nodes \[`sample_0_main.gia`\]<br>
'*Structs*': 7/3000 nodes \[`sample_3.gia`\]<br>
'*Graph*': 7/3000 nodes \[`sample_8.gia`\]<br>
'<u>\<skill\></u>*New Character Skill Node Graph*': 5/3000 nodes \[`sample_7.gia`\]<br>
'*Both*': 4/3000 nodes \[`sample_2.gia`\]<br>
'*Receive*': 3/3000 nodes \[`sample_2.gia`\]<br>
'*Send*': 3/3000 nodes \[`sample_2.gia`\]<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*': 3/3000 nodes \[`sample_7.gia`\]<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*': 3/3000 nodes \[`sample_7.gia`\]<br>
'<u>\<filter\></u>*New Filter Node Graph*': 3/3000 nodes \[`sample_7.gia`\]<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*': 3/3000 nodes \[`sample_7.gia`\]<br>
'*New Node Graph*': 2/3000 nodes \[`sample_6.gia`\]<br>
'*New Node Graph\_1*': 2/3000 nodes \[`sample_6.gia`\]<br>
'<u>\<creation\></u>*New Creation Status Node Graph*': 2/3000 nodes \[`sample_7.gia`\]<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*': 2/3000 nodes \[`sample_7.gia`\]<br>
'<u>\<skill\></u>*New Character Skill Node Graph*': 1/3000 nodes \[`sample_9.gia`\]<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*': 1/3000 nodes \[`sample_9.gia`\]
