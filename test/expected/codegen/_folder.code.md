# FILE `codetest_1.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741829)<br>
'*New Node Graph*'/\[1\] **When Entity Is Created** (71) @(-221.14285,-138.42857)<br>
'*New Node Graph*'/\[1\] **When Entity Is Created** (71) `out.flow#0` -\> \[2\] **Set Custom Variable** (22/24) `in.flow#0`<br>
'*New Node Graph*'/\[2\] **Set Custom Variable** (22/24) variant=C\<T:Ety\> @(180,-141)<br>
'*New Node Graph*'/\[2\] **Set Custom Variable** (22/24) `out.flow#0` -\> \[5\] **Set Preset Status** (66) `in.flow#0`<br>
'*New Node Graph*'/\[2\] **Set Custom Variable** (22/24) `in#0` "Target Entity" \<- \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*New Node Graph*'/\[2\] **Set Custom Variable** (22/24) `in#1` "Variable Name" = '`Var1`' : *Str*<br>
'*New Node Graph*'/\[2\] **Set Custom Variable** (22/24) `in#2` "Variable Value" \<- \[3\] **Get Owner Entity** (744) `out#0` "Owner Entity" : *Ety*<br>
'*New Node Graph*'/\[2\] **Set Custom Variable** (22/24) `in#4` "Trigger Event" = No : *Bol*<br>
'*New Node Graph*'/\[3\] **Get Owner Entity** (744) @(175.77753,-337.94766)<br>
'*New Node Graph*'/\[3\] **Get Owner Entity** (744) `in#0` "Target Entity" \<- \[4\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*New Node Graph*'/\[4\] **Get Self Entity** (73) @(288.77753,-525.3762)<br>
'*New Node Graph*'/\[5\] **Set Preset Status** (66) @(702.2061,-140.80481)<br>
'*New Node Graph*'/\[5\] **Set Preset Status** (66) `out.flow#0` -\> \[9\] **Double Branch** (2) `in.flow#0`<br>
'*New Node Graph*'/\[5\] **Set Preset Status** (66) `in#0` "Target Entity" \<- \[6\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*New Node Graph*'/\[5\] **Set Preset Status** (66) `in#1` "Preset Status Index" = 1 : *Int*<br>
'*New Node Graph*'/\[5\] **Set Preset Status** (66) `in#2` "Preset Status Value" = 2 : *Int*<br>
'*New Node Graph*'/\[6\] **Get Self Entity** (73) @(730.7775,-307.94766)<br>
'*New Node Graph*'/\[7\] **Get Entity Type** (260) @(1066.4918,-723.3762)<br>
'*New Node Graph*'/\[7\] **Get Entity Type** (260) `in#0` "Target Entity" \<- \[6\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*New Node Graph*'/\[8\] **Enumerations Equal** (475/489) variant=C\<T:E\<15\>\> @(1080.4918,-473.37622)<br>
'*New Node Graph*'/\[8\] **Enumerations Equal** (475/489) `in#0` "Enumeration 1" \<- \[7\] **Get Entity Type** (260) `out#0` "Entity Type" : *Enum*<br>
'*New Node Graph*'/\[8\] **Enumerations Equal** (475/489) `in#0` "Enumeration 1" = enum:0«No \| Default \| None» : *Enum* *(also wired)*<br>
'*New Node Graph*'/\[8\] **Enumerations Equal** (475/489) `in#1` "Enumeration 2" = enum:1402«Entity Type\_Object \| Object» : *Enum*<br>
'*New Node Graph*'/\[9\] **Double Branch** (2) @(1098.4918,-143.37624)<br>
'*New Node Graph*'/\[9\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[10\] **Set Local Variable** (19/21) `in.flow#0`<br>
'*New Node Graph*'/\[9\] **Double Branch** (2) `out.flow#1` "No" -\> \[12\] **Set Local Variable** (19/21) `in.flow#0`<br>
'*New Node Graph*'/\[9\] **Double Branch** (2) `in#0` "Condition" \<- \[8\] **Enumerations Equal** (475/489) `out#0` "Result" : *Bol*<br>
'*New Node Graph*'/\[10\] **Set Local Variable** (19/21) variant=C\<T:Int\> @(1616.4918,-441.37622)<br>
'*New Node Graph*'/\[10\] **Set Local Variable** (19/21) `out.flow#0` -\> \[13\] **Print String** (1) `in.flow#0`<br>
'*New Node Graph*'/\[10\] **Set Local Variable** (19/21) `in#0` "Local Variable" \<- \[11\] **Get Local Variable** (18) `out#0` "Local Variable" : *Loc*<br>
'*New Node Graph*'/\[10\] **Set Local Variable** (19/21) `in#1` "Value" = 1 : *Int*<br>
'*New Node Graph*'/\[11\] **Get Local Variable** (18) @(1130.4918,178.62376)<br>
'*New Node Graph*'/\[11\] **Get Local Variable** (18) `in#0` "Initial Value" = No : *Bol*<br>
'*New Node Graph*'/\[11\] **Get Local Variable** (18) `out#1` "Value" = No : *Bol*<br>
'*New Node Graph*'/\[12\] **Set Local Variable** (19/21) variant=C\<T:Int\> @(1620.4918,-111.376236)<br>
'*New Node Graph*'/\[12\] **Set Local Variable** (19/21) `out.flow#0` -\> \[13\] **Print String** (1) `in.flow#0`<br>
'*New Node Graph*'/\[12\] **Set Local Variable** (19/21) `in#0` "Local Variable" \<- \[11\] **Get Local Variable** (18) `out#0` "Local Variable" : *Loc*<br>
'*New Node Graph*'/\[12\] **Set Local Variable** (19/21) `in#1` "Value" = 2 : *Int*<br>
'*New Node Graph*'/\[13\] **Print String** (1) @(2179.8252,-118.376236)<br>
'*New Node Graph*'/\[13\] **Print String** (1) `out.flow#0` -\> \[15\] **Finite Loop** (5) `in.flow#0`<br>
'*New Node Graph*'/\[13\] **Print String** (1) `in#0` "String" \<- \[14\] **Data Type Conversion** (180/186) `out#0` "Output" : *Str*<br>
'*New Node Graph*'/\[14\] **Data Type Conversion** (180/186) variant=C\<K:Bol,V:Str\> @(2154.8252,-375.0429)<br>
'*New Node Graph*'/\[14\] **Data Type Conversion** (180/186) `in#0` "Input" \<- \[11\] **Get Local Variable** (18) `out#1` "Value" : *Bol*<br>
'*New Node Graph*'/\[14\] **Data Type Conversion** (180/186) `in#0` "Input" = No : *Bol* *(also wired)*<br>
'*New Node Graph*'/\[14\] **Data Type Conversion** (180/186) `out#0` "Output" = '' : *Str*<br>
'*New Node Graph*'/\[15\] **Finite Loop** (5) @(2639.8252,-121.70957)<br>
'*New Node Graph*'/\[15\] **Finite Loop** (5) `out.flow#0` "Loop Body" -\> \[16\] **Set List Value** (160) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Finite Loop** (5) `out.flow#1` "Loop Complete" -\> \[24\] **Create Prefab** (252) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Finite Loop** (5) `in#0` "Loop Start Value" = 1 : *Int*<br>
'*New Node Graph*'/\[15\] **Finite Loop** (5) `in#1` "Loop Termination Value" = 8 : *Int*<br>
'*New Node Graph*'/\[16\] **Set List Value** (160) @(3554.23,-215.93576)<br>
'*New Node Graph*'/\[16\] **Set List Value** (160) `in#0` "List" \<- \[21\] **Get Custom Variable** (50/57) `out#0` "Variable Value" : *L\<Int\>*<br>
'*New Node Graph*'/\[16\] **Set List Value** (160) `in#0` "List" = \[\] : *L\<Int\>* *(also wired)*<br>
'*New Node Graph*'/\[16\] **Set List Value** (160) `in#1` "ID" \<- \[15\] **Finite Loop** (5) `out#0` "Current Loop Value" : *Int*<br>
'*New Node Graph*'/\[16\] **Set List Value** (160) `in#2` "Value" \<- \[17\] **Multiplication** (204) `out#0` "Result" : *Int*<br>
'*New Node Graph*'/\[16\] **Set List Value** (160) `in#2` "Value" = 0 : *Int* *(also wired)*<br>
'*New Node Graph*'/\[17\] **Multiplication** (204) @(3523.1584,-495.7572)<br>
'*New Node Graph*'/\[17\] **Multiplication** (204) `in#0` \<- \[15\] **Finite Loop** (5) `out#0` "Current Loop Value" : *Int*<br>
'*New Node Graph*'/\[17\] **Multiplication** (204) `in#0` = 0 : *Int* *(also wired)*<br>
'*New Node Graph*'/\[17\] **Multiplication** (204) `in#1` \<- \[20\] **Get Random Integer** (257) `out#0` "Result" : *Int*<br>
'*New Node Graph*'/\[17\] **Multiplication** (204) `in#1` = 0 : *Int* *(also wired)*<br>
'*New Node Graph*'/\[17\] **Multiplication** (204) `out#0` "Result" = 0 : *Int*<br>
'*New Node Graph*'/\[20\] **Get Random Integer** (257) @(3574.372,-837.0729)<br>
'*New Node Graph*'/\[20\] **Get Random Integer** (257) `in#0` "Lower Limit" \<- \[15\] **Finite Loop** (5) `out#0` "Current Loop Value" : *Int*<br>
'*New Node Graph*'/\[20\] **Get Random Integer** (257) `in#1` "Upper Limit" \<- \[15\] **Finite Loop** (5) `out#0` "Current Loop Value" : *Int*<br>
'*New Node Graph*'/\[21\] **Get Custom Variable** (50/57) variant=C\<T:L\<Int\>\> @(2628.2412,-437.84668)<br>
'*New Node Graph*'/\[21\] **Get Custom Variable** (50/57) `in#0` "Target Entity" \<- \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*New Node Graph*'/\[21\] **Get Custom Variable** (50/57) `in#1` "Variable Name" = '`MyList`' : *Str*<br>
'*New Node Graph*'/\[21\] **Get Custom Variable** (50/57) `out#0` "Variable Value" = \[\] : *L\<Int\>*<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) @(3536.408,360.48663)<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `out.flow#0` -\> \[29\] **Set Custom Variable** (22/1928) `in.flow#0`<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#0` "Prefab ID" = id:1077936129 : *Pfb* {OBJECT:"**Empty Model**"}<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#1` "Location" \<- \[25\] **Get Entity Location and Rotation** (99) `out#0` "Location" : *Vec*<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#2` "Rotate" \<- \[25\] **Get Entity Location and Rotation** (99) `out#1` "Rotate" : *Vec*<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#3` "Owner Entity" \<- \[26\] **Get Local Variable** (18/2657) `out#1` "Value" : *Ety*<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#5` "Overwrite Level" = Yes : *Bol*<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#6` "Level" \<- \[27\] **Get List Length** (142) `out#0` "Length" : *Int*<br>
'*New Node Graph*'/\[24\] **Create Prefab** (252) `in#7` "Unit Tag Index List" \<- \[28\] **Assembly List** (169) `out#0` "List" : *L\<Int\>*<br>
'*New Node Graph*'/\[25\] **Get Entity Location and Rotation** (99) @(3021.122,610.55804)<br>
'*New Node Graph*'/\[25\] **Get Entity Location and Rotation** (99) `in#0` "Target Entity" \<- \[26\] **Get Local Variable** (18/2657) `out#1` "Value" : *Ety*<br>
'*New Node Graph*'/\[26\] **Get Local Variable** (18/2657) variant=C\<T:Ety\> @(2833.0745,813.48663)<br>
'*New Node Graph*'/\[26\] **Get Local Variable** (18/2657) `in#0` "Initial Value" \<- \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*New Node Graph*'/\[27\] **Get List Length** (142) @(2987.765,400.33188)<br>
'*New Node Graph*'/\[27\] **Get List Length** (142) `in#0` "List" \<- \[21\] **Get Custom Variable** (50/57) `out#0` "Variable Value" : *L\<Int\>*<br>
'*New Node Graph*'/\[27\] **Get List Length** (142) `in#0` "List" = \[\] : *L\<Int\>* *(also wired)*<br>
'*New Node Graph*'/\[28\] **Assembly List** (169) @(3084.908,1128.9033)<br>
'*New Node Graph*'/\[28\] **Assembly List** (169) `in#1` "0" = 0 : *Int*<br>
'*New Node Graph*'/\[28\] **Assembly List** (169) `out#0` "List" = \[\] : *L\<Int\>*<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) variant=C\<T:D\<Ety,Ety\>\> @(4250.622,341.76044)<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `out.flow#0` -\> \[31\] **Double Branch** (2) `in.flow#0`<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `out.flow#0` -\> \[32\] **Print String** (1) `in.flow#0`<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `in#0` "Target Entity" \<- \[24\] **Create Prefab** (252) `out#0` "Created Entity" : *Ety*<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `in#1` "Variable Name" = '`Test`' : *Str*<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `in#2` "Variable Value" \<- \[30\] **Assembly Dictionary** (1788) `out#0` "Dictionary" : *Dict*<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `in#2` "Variable Value" = {} : *Dict* *(also wired)*<br>
'*New Node Graph*'/\[29\] **Set Custom Variable** (22/1928) `in#4` "Trigger Event" = No : *Bol*<br>
'*New Node Graph*'/\[30\] **Assembly Dictionary** (1788) @(4238.003,19.855686)<br>
'*New Node Graph*'/\[30\] **Assembly Dictionary** (1788) `in#1` "Key 0" \<- \[24\] **Create Prefab** (252) `out#0` "Created Entity" : *Ety*<br>
'*New Node Graph*'/\[30\] **Assembly Dictionary** (1788) `in#2` "Value 0" \<- \[26\] **Get Local Variable** (18/2657) `out#1` "Value" : *Ety*<br>
'*New Node Graph*'/\[30\] **Assembly Dictionary** (1788) `out#0` "Dictionary" = {} : *Dict*<br>
'*New Node Graph*'/\[31\] **Double Branch** (2) @(4832.8774,100.87852)<br>
'*New Node Graph*'/\[31\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[33\] **Destroy Entity** (69) `in.flow#0`<br>
'*New Node Graph*'/\[31\] **Double Branch** (2) `out.flow#1` "No" -\> \[32\] **Print String** (1) `in.flow#0`<br>
'*New Node Graph*'/\[31\] **Double Branch** (2) `in#0` "Condition" = Yes : *Bol*<br>
'*New Node Graph*'/\[32\] **Print String** (1) @(5249.5444,334.21185)<br>
'*New Node Graph*'/\[32\] **Print String** (1) `out.flow#0` -\> \[33\] **Destroy Entity** (69) `in.flow#0`<br>
'*New Node Graph*'/\[32\] **Print String** (1) `in#0` "String" = '`!`' : *Str*<br>
'*New Node Graph*'/\[33\] **Destroy Entity** (69) @(5617.8774,97.54519)<br>
'*New Node Graph*'/\[33\] **Destroy Entity** (69) `in#0` "Target Entity" \<- \[34\] **Query Entity by GUID** (75) `out#0` "Entity" : *Ety*<br>
'*New Node Graph*'/\[34\] **Query Entity by GUID** (75) @(5558.3374,-130.19812)<br>
'*New Node Graph*'/\[34\] **Query Entity by GUID** (75) `in#0` "GUID" \<- \[1\] **When Entity Is Created** (71) `out#1` "Event Source GUID" : *Gid*<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130435)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/4<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#0` "1" -\> \[2\] **Switch to self execution status** (200128/4011) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#1` "2" -\> \[3\] **Double Branch** (200125/4001) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#2` "3" -\> \[3\] **Double Branch** (200125/4001) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Switch to self execution status** (200128/4011) @(493,-144)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Switch to self execution status** (200128/4011) `in#0` "Execute" = Yes : *Bol* *(default)*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Switch to self execution status** (200128/4011) `in#1` "Status Node Graph Configuration ID" = id:0 : *Cfg* *(default)*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Switch to self execution status** (200128/4011) `in#2` "Autonomous Logic Parameter ID" = 0 : *Int* *(default)*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Double Branch** (200125/4001) @(504.14285,248.42857)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Double Branch** (200125/4001) `in#0` "Condition" \<- \[4\] **Get Custom Variable** (200173/4200) `out#0` "Variable Value" : *Bol*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Double Branch** (200125/4001) `in#0` "Condition" = No : *Bol* *(default)* *(also wired)*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[4\] **Get Custom Variable** (200173/4200) variant=C\<T:Bol\> @(68.42857,335.57144)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[4\] **Get Custom Variable** (200173/4200) `in#0` "Target Entity" = enum:6003«Self» : *Enum*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[4\] **Get Custom Variable** (200173/4200) `in#1` "Variable Name" = '`test`' : *Str*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[4\] **Get Custom Variable** (200173/4200) `out#0` "Variable Value" = No : *Bol*<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' INTEGER\_FILTER\_GRAPH (guid 1082130436)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Integer)** (200122) `in#0` "Output Result (Integer)" \<- \[2\] **Get Maximum Value From List** (200020/120) `out#0` "Maximum Value" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Integer)** (200122) `in#0` "Output Result (Integer)" = 0 : *Int* *(default)* *(also wired)*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Integer)** (200122) `in#1` "Filter Return Type" = enum:10000011«Return Integer» : *Enum* *(default)*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Get Maximum Value From List** (200020/120) variant=C\<T:Int\> @(-691,6)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Get Maximum Value From List** (200020/120) `in#0` "List" \<- \[3\] **Get List of Values From Dictionary** (200158/1055) `out#0` "Value List" : *L\<Int\>*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Get Maximum Value From List** (200020/120) `in#0` "List" = \[\] : *L\<Int\>* *(also wired)*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Get Maximum Value From List** (200020/120) `out#0` "Maximum Value" = 0 : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List of Values From Dictionary** (200158/1055) @(-1240.6666,62.666668)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List of Values From Dictionary** (200158/1055) `in#0` "Dictionary" \<- \[4\] **Get Custom Variable** (200016/1056) `out#0` "Variable Value" : *Dict*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List of Values From Dictionary** (200158/1055) `in#0` "Dictionary" = {} : *Dict* *(also wired)*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List of Values From Dictionary** (200158/1055) `out#0` "Value List" = \[\] : *L\<Int\>*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[4\] **Get Custom Variable** (200016/1056) @(-1768.6666,78.666664)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[4\] **Get Custom Variable** (200016/1056) `in#0` "Target Entity" \<- \[5\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" : *Ety*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[4\] **Get Custom Variable** (200016/1056) `in#1` "Variable Name" = '`list`' : *Str*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[4\] **Get Custom Variable** (200016/1056) `out#0` "Variable Value" = {} : *Dict*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[5\] **Get Self Entity** (200033/1013) @(-1628.6666,-134.66667)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[5\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" = id:0 : *Ety* *(default)*

# FILE `codetest_2.gia`

**GRAPH** '<u>\<status\></u>*Status*' STATUS\_NODE\_GRAPH (guid 1073741830)<br>
'<u>\<status\></u>*Status*'/VAR **gvar** : *Int* public=false = 1<br>
'<u>\<status\></u>*Status*'/\[1\] **When Unit Status Changes** (300) @(-136,-84)<br>
'<u>\<status\></u>*Status*'/\[1\] **When Unit Status Changes** (300) `out.flow#0` -\> \[2\] **Multiple Branches** (3) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[2\] **Multiple Branches** (3) @(303,-88.57143)<br>
'<u>\<status\></u>*Status*'/\[2\] **Multiple Branches** (3) `out.flow#1` "0" -\> \[3\] **Remove Unit Status** (301) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[2\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[1\] **When Unit Status Changes** (300) `out#7` "Original Status Stacks" : *Int*<br>
'<u>\<status\></u>*Status*'/\[2\] **Multiple Branches** (3) `in#0` "Control Expression" = 0 : *Int* *(also wired)*<br>
'<u>\<status\></u>*Status*'/\[3\] **Remove Unit Status** (301) @(892.5714,88.28571)<br>
'<u>\<status\></u>*Status*'/\[3\] **Remove Unit Status** (301) `out.flow#0` -\> \[5\] **Set Node Graph Variable** (323) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[3\] **Remove Unit Status** (301) `in#0` "Remove Target Entity" \<- \[1\] **When Unit Status Changes** (300) `out#0` "Event Source Entity" : *Ety*<br>
'<u>\<status\></u>*Status*'/\[3\] **Remove Unit Status** (301) `in#1` "Unit Status Config ID" \<- \[1\] **When Unit Status Changes** (300) `out#2` "Unit Status Config ID" : *Cfg*<br>
'<u>\<status\></u>*Status*'/\[3\] **Remove Unit Status** (301) `in#2` "Removal Method" = enum:1540«All Coexisting Statuses With the Same Name» : *Enum*<br>
'<u>\<status\></u>*Status*'/\[3\] **Remove Unit Status** (301) `in#4` "Remover Entity" \<- \[1\] **When Unit Status Changes** (300) `out#3` "Applier Entity" : *Ety*<br>
'<u>\<status\></u>*Status*'/\[5\] **Set Node Graph Variable** (323) @(1444.7142,84.85714)<br>
'<u>\<status\></u>*Status*'/\[5\] **Set Node Graph Variable** (323) `out.flow#0` -\> \[12\] **Linear Flow** (1610612738) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[5\] **Set Node Graph Variable** (323) `in#0` "Variable Name" = '`gvar`' : *Str*<br>
'<u>\<status\></u>*Status*'/\[5\] **Set Node Graph Variable** (323) `in#1` "Variable Value" \<- \[7\] **Simple Data** (1610612737) `out#0` "Value" : *Int*<br>
'<u>\<status\></u>*Status*'/\[5\] **Set Node Graph Variable** (323) `in#1` "Variable Value" = 0 : *Int* *(also wired)*<br>
'<u>\<status\></u>*Status*'/\[5\] **Set Node Graph Variable** (323) `in#2` "Trigger Event" = No : *Bol*<br>
'<u>\<status\></u>*Status*'/\[7\] **Simple Data** (1610612737) user=COMPOSITE @(1474.7142,-142.28572)<br>
'<u>\<status\></u>*Status*'/\[12\] **Linear Flow** (1610612738) user=COMPOSITE @(1889.4166,88.36905)<br>
'<u>\<status\></u>*Status*'/\[12\] **Linear Flow** (1610612738) `out.flow#0` -\> \[21\] **Two In One Out** (1610612741) `in.flow#1`<br>
'<u>\<status\></u>*Status*'/\[12\] **Linear Flow** (1610612738) `out.flow#0` -\> \[25\] **Two Exclusive Outs** (1610612742) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[15\] **Terminal** (1610612739) user=COMPOSITE @(2682.9285,-420.61905)<br>
'<u>\<status\></u>*Status*'/\[21\] **Two In One Out** (1610612741) user=COMPOSITE @(2726.738,39.38095)<br>
'<u>\<status\></u>*Status*'/\[21\] **Two In One Out** (1610612741) `out.flow#0` -\> \[29\] **Calling Twice** (1610612743) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[25\] **Two Exclusive Outs** (1610612742) user=COMPOSITE @(2280.0715,-157.7619)<br>
'<u>\<status\></u>*Status*'/\[25\] **Two Exclusive Outs** (1610612742) `out.flow#0` "Yes" -\> \[15\] **Terminal** (1610612739) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[25\] **Two Exclusive Outs** (1610612742) `out.flow#1` "No" -\> \[21\] **Two In One Out** (1610612741) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[25\] **Two Exclusive Outs** (1610612742) `in#0` "Condition" = No : *Bol*<br>
'<u>\<status\></u>*Status*'/\[29\] **Calling Twice** (1610612743) user=COMPOSITE @(3124.5952,34.261906)<br>
'<u>\<status\></u>*Status*'/\[29\] **Calling Twice** (1610612743) `out.flow#0` -\> \[36\] **With Event** (1610612744) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[34\] **Set Custom Variable** (22/28) variant=C\<T:Bol\> @(3877.5952,36.714287)<br>
'<u>\<status\></u>*Status*'/\[34\] **Set Custom Variable** (22/28) `out.flow#0` -\> \[39\] **Set Custom Variable** (22/28) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[34\] **Set Custom Variable** (22/28) `in#1` "Variable Name" = '`x`' : *Str*<br>
'<u>\<status\></u>*Status*'/\[34\] **Set Custom Variable** (22/28) `in#2` "Variable Value" \<- \[42\] **Exposed Local** (1610612745) `out#0` "Value" : *Bol*<br>
'<u>\<status\></u>*Status*'/\[34\] **Set Custom Variable** (22/28) `in#2` "Variable Value" = Yes : *Bol* *(also wired)*<br>
'<u>\<status\></u>*Status*'/\[34\] **Set Custom Variable** (22/28) `in#4` "Trigger Event" \<- \[42\] **Exposed Local** (1610612745) `out#0` "Value" : *Bol*<br>
'<u>\<status\></u>*Status*'/\[36\] **With Event** (1610612744) user=COMPOSITE @(3528.6577,41.24107)<br>
'<u>\<status\></u>*Status*'/\[36\] **With Event** (1610612744) `out.flow#0` -\> \[34\] **Set Custom Variable** (22/28) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[39\] **Set Custom Variable** (22/28) variant=C\<T:Bol\> @(4237.9287,39.440475)<br>
'<u>\<status\></u>*Status*'/\[39\] **Set Custom Variable** (22/28) `out.flow#0` -\> \[40\] **Set Custom Variable** (22/28) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[39\] **Set Custom Variable** (22/28) `in#1` "Variable Name" = '`y`' : *Str*<br>
'<u>\<status\></u>*Status*'/\[39\] **Set Custom Variable** (22/28) `in#2` "Variable Value" \<- \[46\] **Exposed Native** (1610612746) `out#0` "Consume?" : *Bol*<br>
'<u>\<status\></u>*Status*'/\[39\] **Set Custom Variable** (22/28) `in#2` "Variable Value" = Yes : *Bol* *(also wired)*<br>
'<u>\<status\></u>*Status*'/\[39\] **Set Custom Variable** (22/28) `in#4` "Trigger Event" \<- \[46\] **Exposed Native** (1610612746) `out#0` "Consume?" : *Bol*<br>
'<u>\<status\></u>*Status*'/\[40\] **Set Custom Variable** (22/28) variant=C\<T:Bol\> @(4663.643,34.440475)<br>
'<u>\<status\></u>*Status*'/\[40\] **Set Custom Variable** (22/28) `in#1` "Variable Name" = '`z`' : *Str*<br>
'<u>\<status\></u>*Status*'/\[40\] **Set Custom Variable** (22/28) `in#2` "Variable Value" \<- \[54\] **Exposed Computed** (1610612748) `out#0` "Result" : *Bol*<br>
'<u>\<status\></u>*Status*'/\[40\] **Set Custom Variable** (22/28) `in#2` "Variable Value" = Yes : *Bol* *(also wired)*<br>
'<u>\<status\></u>*Status*'/\[40\] **Set Custom Variable** (22/28) `in#4` "Trigger Event" \<- \[54\] **Exposed Computed** (1610612748) `out#0` "Result" : *Bol*<br>
'<u>\<status\></u>*Status*'/\[42\] **Exposed Local** (1610612745) user=COMPOSITE @(3867.1223,-274.70096)<br>
'<u>\<status\></u>*Status*'/\[42\] **Exposed Local** (1610612745) `out.flow#0` -\> \[46\] **Exposed Native** (1610612746) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[46\] **Exposed Native** (1610612746) user=COMPOSITE @(4251.911,-278.6043)<br>
'<u>\<status\></u>*Status*'/\[46\] **Exposed Native** (1610612746) `out.flow#0` -\> \[54\] **Exposed Computed** (1610612748) `in.flow#0`<br>
'<u>\<status\></u>*Status*'/\[54\] **Exposed Computed** (1610612748) user=COMPOSITE @(4693.5776,-274.43765)<br>
**GRAPH** '<u>\<composite\></u>*Calling Twice*' ENTITY\_NODE\_GRAPH (guid 1610612743, decl 1610612743) role=dependency<br>
'<u>\<composite\></u>*Calling Twice*'/PORTMAP `ext.in.flow#0` -\> \[19\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Calling Twice*'/PORTMAP `ext.out.flow#0` -\> \[1\] **Double Branch** (2) `out.flow#1` "No"<br>
'<u>\<composite\></u>*Calling Twice*'/\[1\] **Double Branch** (2) @(485,-41)<br>
'<u>\<composite\></u>*Calling Twice*'/\[1\] **Double Branch** (2) `in#0` "Condition" = No : *Bol*<br>
'<u>\<composite\></u>*Calling Twice*'/\[19\] **Double Branch** (2) @(-160,-85)<br>
'<u>\<composite\></u>*Calling Twice*'/\[19\] **Double Branch** (2) `out.flow#1` "No" -\> \[22\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Calling Twice*'/\[19\] **Double Branch** (2) `out.flow#1` "No" -\> \[1\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Calling Twice*'/\[19\] **Double Branch** (2) `in#0` "Condition" = No : *Bol*<br>
'<u>\<composite\></u>*Calling Twice*'/\[22\] **Double Branch** (2) @(160,85)<br>
'<u>\<composite\></u>*Calling Twice*'/\[22\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[1\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Calling Twice*'/\[22\] **Double Branch** (2) `in#0` "Condition" = Yes : *Bol*<br>
**GRAPH** '<u>\<composite\></u>*Exposed Computed*' ENTITY\_NODE\_GRAPH (guid 1610612748, decl 1610612748) role=dependency<br>
'<u>\<composite\></u>*Exposed Computed*'/PORTMAP `ext.in.flow#0` -\> \[48\] **Add Unit Status** (297) `in.flow#0`<br>
'<u>\<composite\></u>*Exposed Computed*'/PORTMAP `ext.out.flow#0` -\> \[48\] **Add Unit Status** (297) `out.flow#0`<br>
'<u>\<composite\></u>*Exposed Computed*'/PORTMAP `ext.out#0` "Result" -\> \[47\] **Greater Than** (232) `out#0` "Result"<br>
'<u>\<composite\></u>*Exposed Computed*'/\[47\] **Greater Than** (232) @(20,234.16667)<br>
'<u>\<composite\></u>*Exposed Computed*'/\[47\] **Greater Than** (232) `in#0` "Left Value" \<- \[48\] **Add Unit Status** (297) `out#1` "Slot ID" : *Int*<br>
'<u>\<composite\></u>*Exposed Computed*'/\[47\] **Greater Than** (232) `in#0` "Left Value" = 0 : *Int* *(also wired)*<br>
'<u>\<composite\></u>*Exposed Computed*'/\[47\] **Greater Than** (232) `in#1` "Right Value" \<- \[48\] **Add Unit Status** (297) `out#1` "Slot ID" : *Int*<br>
'<u>\<composite\></u>*Exposed Computed*'/\[47\] **Greater Than** (232) `in#1` "Right Value" = 0 : *Int* *(also wired)*<br>
'<u>\<composite\></u>*Exposed Computed*'/\[48\] **Add Unit Status** (297) @(-20,-234.16667)<br>
**GRAPH** '<u>\<composite\></u>*Exposed Local*' ENTITY\_NODE\_GRAPH (guid 1610612745, decl 1610612745) role=dependency<br>
'<u>\<composite\></u>*Exposed Local*'/PORTMAP `ext.in.flow#0` -\> \[38\] **Forwarding Event** (190) `in.flow#0`<br>
'<u>\<composite\></u>*Exposed Local*'/PORTMAP `ext.out.flow#0` -\> \[38\] **Forwarding Event** (190) `out.flow#0`<br>
'<u>\<composite\></u>*Exposed Local*'/PORTMAP `ext.in#0` "Target Entity" -\> \[38\] **Forwarding Event** (190) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Exposed Local*'/PORTMAP `ext.out#0` "Value" -\> \[37\] **Get Local Variable** (18) `out#1` "Value"<br>
'<u>\<composite\></u>*Exposed Local*'/\[37\] **Get Local Variable** (18) @(-12.646014,109.14144)<br>
'<u>\<composite\></u>*Exposed Local*'/\[37\] **Get Local Variable** (18) `in#0` "Initial Value" = Yes : *Bol*<br>
'<u>\<composite\></u>*Exposed Local*'/\[37\] **Get Local Variable** (18) `out#1` "Value" = No : *Bol*<br>
'<u>\<composite\></u>*Exposed Local*'/\[38\] **Forwarding Event** (190) @(12.646014,-109.14144)<br>
**GRAPH** '<u>\<composite\></u>*Exposed Native*' ENTITY\_NODE\_GRAPH (guid 1610612746, decl 1610612746) role=dependency<br>
'<u>\<composite\></u>*Exposed Native*'/PORTMAP `ext.in.flow#0` -\> \[44\] **Consume Gift Box** (772) `in.flow#0`<br>
'<u>\<composite\></u>*Exposed Native*'/PORTMAP `ext.out.flow#0` -\> \[44\] **Consume Gift Box** (772) `out.flow#0`<br>
'<u>\<composite\></u>*Exposed Native*'/PORTMAP `ext.in#0` "Player Entity" -\> \[44\] **Consume Gift Box** (772) `in#0` "Player Entity"<br>
'<u>\<composite\></u>*Exposed Native*'/PORTMAP `ext.out#0` "Consume?" -\> \[44\] **Consume Gift Box** (772) `out#0` "Consume?"<br>
'<u>\<composite\></u>*Exposed Native*'/\[44\] **Consume Gift Box** (772) @(0,0)<br>
'<u>\<composite\></u>*Exposed Native*'/\[44\] **Consume Gift Box** (772) `in#1` "Gift Box Index" = 1 : *Int*<br>
'<u>\<composite\></u>*Exposed Native*'/\[44\] **Consume Gift Box** (772) `in#2` "Consumption Quantity" = 1 : *Int*<br>
**GRAPH** '<u>\<composite\></u>*Linear Flow*' ENTITY\_NODE\_GRAPH (guid 1610612738, decl 1610612738) role=dependency<br>
'<u>\<composite\></u>*Linear Flow*'/PORTMAP `ext.in.flow#0` -\> \[8\] **Set Node Graph Variable** (323) `in.flow#0`<br>
'<u>\<composite\></u>*Linear Flow*'/PORTMAP `ext.out.flow#0` -\> \[8\] **Set Node Graph Variable** (323) `out.flow#0`<br>
'<u>\<composite\></u>*Linear Flow*'/\[8\] **Set Node Graph Variable** (323) @(0,0)<br>
'<u>\<composite\></u>*Linear Flow*'/\[8\] **Set Node Graph Variable** (323) `in#0` "Variable Name" = '`gvar`' : *Str*<br>
'<u>\<composite\></u>*Linear Flow*'/\[8\] **Set Node Graph Variable** (323) `in#1` "Variable Value" = 0 : *Int*<br>
'<u>\<composite\></u>*Linear Flow*'/\[8\] **Set Node Graph Variable** (323) `in#2` "Trigger Event" = Yes : *Bol*<br>
**GRAPH** '<u>\<composite\></u>*Simple Data*' ENTITY\_NODE\_GRAPH (guid 1610612737, decl 1610612737) role=dependency<br>
'<u>\<composite\></u>*Simple Data*'/PORTMAP `ext.out#0` "Value" -\> \[4\] **Get Local Variable** (18/20) `out#1` "Value"<br>
'<u>\<composite\></u>*Simple Data*'/\[4\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(0,0)<br>
'<u>\<composite\></u>*Simple Data*'/\[4\] **Get Local Variable** (18/20) `in#0` "Initial Value" = 42 : *Int*<br>
'<u>\<composite\></u>*Simple Data*'/\[4\] **Get Local Variable** (18/20) `out#1` "Value" = 0 : *Int*<br>
**GRAPH** '<u>\<composite\></u>*Terminal*' ENTITY\_NODE\_GRAPH (guid 1610612739, decl 1610612739) role=dependency<br>
'<u>\<composite\></u>*Terminal*'/PORTMAP `ext.in.flow#0` -\> \[13\] **Break Loop** (6) `in.flow#0`<br>
'<u>\<composite\></u>*Terminal*'/\[13\] **Break Loop** (6) @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Two Exclusive Outs*' ENTITY\_NODE\_GRAPH (guid 1610612742, decl 1610612742) role=dependency<br>
'<u>\<composite\></u>*Two Exclusive Outs*'/PORTMAP `ext.in.flow#0` -\> \[10\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Two Exclusive Outs*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[10\] **Double Branch** (2) `out.flow#0` "Yes"<br>
'<u>\<composite\></u>*Two Exclusive Outs*'/PORTMAP `ext.out.flow#1` "No" -\> \[10\] **Double Branch** (2) `out.flow#1` "No"<br>
'<u>\<composite\></u>*Two Exclusive Outs*'/PORTMAP `ext.in#0` "Condition" -\> \[10\] **Double Branch** (2) `in#0` "Condition"<br>
'<u>\<composite\></u>*Two Exclusive Outs*'/\[10\] **Double Branch** (2) @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Two In One Out*' ENTITY\_NODE\_GRAPH (guid 1610612741, decl 1610612741) role=dependency<br>
'<u>\<composite\></u>*Two In One Out*'/PORTMAP `ext.in.flow#0` -\> \[17\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Two In One Out*'/PORTMAP `ext.in.flow#1` -\> \[18\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Two In One Out*'/PORTMAP `ext.out.flow#0` -\> \[18\] **Print String** (1) `out.flow#0`<br>
'<u>\<composite\></u>*Two In One Out*'/PORTMAP `ext.out.flow#0` -\> \[17\] **Print String** (1) `out.flow#0`<br>
'<u>\<composite\></u>*Two In One Out*'/\[17\] **Print String** (1) @(2.142857,-114.28571)<br>
'<u>\<composite\></u>*Two In One Out*'/\[17\] **Print String** (1) `in#0` "String" = '`First`' : *Str*<br>
'<u>\<composite\></u>*Two In One Out*'/\[18\] **Print String** (1) @(-2.142857,114.28571)<br>
'<u>\<composite\></u>*Two In One Out*'/\[18\] **Print String** (1) `in#0` "String" = '`Second`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*With Event*' ENTITY\_NODE\_GRAPH (guid 1610612744, decl 1610612744) role=dependency<br>
'<u>\<composite\></u>*With Event*'/PORTMAP `ext.in.flow#0` -\> \[32\] **Set Custom Variable** (22) `in.flow#0`<br>
'<u>\<composite\></u>*With Event*'/PORTMAP `ext.out.flow#0` -\> \[31\] **Multiple Branches** (3/4) `out.flow#1` "timer"<br>
'<u>\<composite\></u>*With Event*'/\[30\] **When Timer Is Triggered** (83) @(52.1875,30.9375)<br>
'<u>\<composite\></u>*With Event*'/\[30\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[31\] **Multiple Branches** (3/4) `in.flow#0`<br>
'<u>\<composite\></u>*With Event*'/\[31\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(417.1875,32.1875)<br>
'<u>\<composite\></u>*With Event*'/\[31\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[30\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'<u>\<composite\></u>*With Event*'/\[31\] **Multiple Branches** (3/4) `in#0` "Control Expression" = '' : *Str* *(also wired)*<br>
'<u>\<composite\></u>*With Event*'/\[32\] **Set Custom Variable** (22) @(-262.8125,47.1875)<br>
'<u>\<composite\></u>*With Event*'/\[32\] **Set Custom Variable** (22) `in#0` "Target Entity" \<- \[33\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'<u>\<composite\></u>*With Event*'/\[32\] **Set Custom Variable** (22) `in#1` "Variable Name" = '`none`' : *Str*<br>
'<u>\<composite\></u>*With Event*'/\[33\] **Get Self Entity** (73) @(-206.5625,-110.3125)
