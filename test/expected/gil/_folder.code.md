# FILE `test/cases/gil/stage_0.gil`

**GRAPH** '*Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Graph*'/VAR **Graph\_Var** : *Ety* public=false<br>
'*Graph*'/COMMENT '`Comment`' @(-193,-100)<br>
'*Graph*'/\[1\] **When Entity Is Created** (71) @(-219,48)<br>
'*Graph*'/\[1\] **When Entity Is Created** (71) `out.flow#0` -\> \[4\] **Double Branch** (2) `in.flow#0`<br>
'*Graph*'/\[2\] **Get Self Entity** (73) @(221.28572,-430.57144)<br>
'*Graph*'/\[3\] **Equal** (14/16) variant=C\<T:Ety\> @(107.57143,-232.42857)<br>
'*Graph*'/\[3\] **Equal** (14/16) `in#0` "Input 1" \<- \[2\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Graph*'/\[3\] **Equal** (14/16) `in#1` "Input 2" \<- \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*Graph*'/\[4\] **Double Branch** (2) @(214.57143,48.57143)<br>
'*Graph*'/\[4\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[5\] **Print String** (1) `in.flow#0`<br>
'*Graph*'/\[4\] **Double Branch** (2) `out.flow#1` "No" -\> \[6\] **Destroy Entity** (69) `in.flow#0`<br>
'*Graph*'/\[4\] **Double Branch** (2) `in#0` "Condition" \<- \[3\] **Equal** (14/16) `out#0` "Result" : *Bol*<br>
'*Graph*'/\[5\] **Print String** (1) @(814,-200.84126)<br>
'*Graph*'/\[5\] **Print String** (1) `in#0` "String" = '`Created`' : *Str*<br>
'*Graph*'/\[6\] **Destroy Entity** (69) @(795.1111,250.26984)<br>
'*Graph*'/\[6\] **Destroy Entity** (69) `in#0` "Target Entity" \<- \[8\] **Get Node Graph Variable** (337) `out#0` "Variable Value" : *Ety*<br>
'*Graph*'/\[8\] **Get Node Graph Variable** (337) @(769.55554,25.825397)<br>
'*Graph*'/\[8\] **Get Node Graph Variable** (337) `in#0` "Variable Name" = '`Graph_Var`' : *Str*<br>
**GRAPH** '<u>\<status\></u>*Empty*' STATUS\_NODE\_GRAPH (guid 1073741826)

# FILE `test/cases/gil/stage_012379.gil`

**DECL** "**Signal\_2**" SIGNAL\_NODE\_DECL guid='`1073741831`'<br>
DECL/**Signal\_2** SEND\_SIGNAL name='`Signal_2`' server\_node=1073741830 client\_node=1073741832<br>
DECL/**Signal\_2** `in.flow#0` uid=30<br>
DECL/**Signal\_2** `out.flow#0` uid=31<br>
DECL/**Signal\_2** `in#0` "Parameter\_1" : *Int* uid=42<br>
DECL/**Signal\_2** `in#1` "Parameter\_2" : *Flt* uid=43<br>
DECL/**Signal\_2** `in#2` "Parameter\_3" : *Vec* uid=44<br>
DECL/**Signal\_2** `in#3` "Parameter\_4" : *Bol* enum\_family=1 uid=45<br>
DECL/**Signal\_2** `in#4` "Parameter\_5" : *Gid* uid=46<br>
DECL/**Signal\_2** `in#5` "Parameter\_6" : *Ety* uid=47<br>
DECL/**Signal\_2** `in#6` "Parameter\_7" : *Pfb* uid=48<br>
DECL/**Signal\_2** `in#7` "Parameter\_8" : *Cfg* uid=49<br>
DECL/**Signal\_2** `in#8` "Parameter\_9" : *L\<Int\>* uid=50<br>
DECL/**Signal\_2** `in#9` "Parameter\_10" : *Str* uid=72<br>
DECL/**Signal\_2** `meta#0` "Signal Name" uid=32<br>
**DECL** "**Signal\_1**" SIGNAL\_NODE\_DECL guid='`1073741828`'<br>
DECL/**Signal\_1** SEND\_SIGNAL name='`Signal_1`' server\_node=1073741827 client\_node=1073741829<br>
DECL/**Signal\_1** `in.flow#0` uid=18<br>
DECL/**Signal\_1** `out.flow#0` uid=19<br>
DECL/**Signal\_1** `meta#0` "Signal Name" uid=20<br>
**DECL** "**Signal\_3**" SIGNAL\_NODE\_DECL guid='`1073741851`'<br>
DECL/**Signal\_3** SEND\_SIGNAL name='`Signal_3`' server\_node=1073741852 client\_node=1073741853<br>
DECL/**Signal\_3** `in.flow#0` uid=178<br>
DECL/**Signal\_3** `out.flow#0` uid=179<br>
DECL/**Signal\_3** `meta#0` "Signal Name" uid=180<br>
**STRUCT** "**Structure**" guid='`1077936129`' id=1077936129 version=7<br>
STRUCT/**Structure** FIELD#1 "**Add variable 1**" : *Str*<br>
**STRUCT** "**Structure\_1**" guid='`1077936130`' id=1077936130 version=5<br>
STRUCT/**Structure\_1** FIELD#1 "**Add variable 1**" : *L\<Str\>*<br>
STRUCT/**Structure\_1** FIELD#2 "**Add variable 2**" : *Int*<br>
STRUCT/**Structure\_1** FIELD#3 "**Add variable 3**" : *Struct* struct=Structure<br>
STRUCT/**Structure\_1** FIELD#4 "**Add variable 4**" : *L\<Struct\>* struct=Structure<br>
**STRUCT** "**Structure\_2**" guid='`1077936131`' id=1077936131 version=3<br>
**GRAPH** '*Both*' ENTITY\_NODE\_GRAPH (guid 1073741832)<br>
'*Both*'/\[2\] **Monitor Signal** (1073741827) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-293,-150) sigver=1<br>
'*Both*'/\[2\] **Monitor Signal** (1073741827) `out.flow#0` -\> \[4\] **Send Signal** (1073741828) `in.flow#0`<br>
'*Both*'/\[2\] **Monitor Signal** (1073741827) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Both*'/\[4\] **Send Signal** (1073741828) user=SEND\_SIGNAL signal='`Signal_1`' @(207,-148) sigver=1<br>
'*Both*'/\[4\] **Send Signal** (1073741828) `out.flow#0` -\> \[6\] **Send Signal** (1073741831) `in.flow#0`<br>
'*Both*'/\[4\] **Send Signal** (1073741828) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Both*'/\[6\] **Send Signal** (1073741831) user=SEND\_SIGNAL signal='`Signal_2`' @(583,-153) sigver=3<br>
'*Both*'/\[6\] **Send Signal** (1073741831) `in#8` "Parameter\_9" \<- \[7\] **Monitor Signal** (1073741830) `out#11` "Parameter\_9" : *L\<Int\>*<br>
'*Both*'/\[6\] **Send Signal** (1073741831) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Both*'/\[7\] **Monitor Signal** (1073741830) user=LISTEN\_SIGNAL signal='`Signal_2`' @(102.85714,143.28572) sigver=3<br>
'*Both*'/\[7\] **Monitor Signal** (1073741830) `out.flow#0` -\> \[6\] **Send Signal** (1073741831) `in.flow#0`<br>
'*Both*'/\[7\] **Monitor Signal** (1073741830) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
**GRAPH** '*Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Graph*'/VAR **Graph\_Var** : *Ety* public=false<br>
'*Graph*'/COMMENT '`Comment`' @(-193,-100)<br>
'*Graph*'/\[1\] **When Entity Is Created** (71) @(-219,48)<br>
'*Graph*'/\[1\] **When Entity Is Created** (71) `out.flow#0` -\> \[4\] **Double Branch** (2) `in.flow#0`<br>
'*Graph*'/\[2\] **Get Self Entity** (73) @(221.28572,-430.57144)<br>
'*Graph*'/\[3\] **Equal** (14/16) variant=C\<T:Ety\> @(107.57143,-232.42857)<br>
'*Graph*'/\[3\] **Equal** (14/16) `in#0` "Input 1" \<- \[2\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Graph*'/\[3\] **Equal** (14/16) `in#1` "Input 2" \<- \[1\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*Graph*'/\[4\] **Double Branch** (2) @(214.57143,48.57143)<br>
'*Graph*'/\[4\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[5\] **Print String** (1) `in.flow#0`<br>
'*Graph*'/\[4\] **Double Branch** (2) `out.flow#1` "No" -\> \[6\] **Destroy Entity** (69) `in.flow#0`<br>
'*Graph*'/\[4\] **Double Branch** (2) `in#0` "Condition" \<- \[3\] **Equal** (14/16) `out#0` "Result" : *Bol*<br>
'*Graph*'/\[5\] **Print String** (1) @(814,-200.84126)<br>
'*Graph*'/\[5\] **Print String** (1) `in#0` "String" = '`Created`' : *Str*<br>
'*Graph*'/\[6\] **Destroy Entity** (69) @(795.1111,250.26984)<br>
'*Graph*'/\[6\] **Destroy Entity** (69) `in#0` "Target Entity" \<- \[8\] **Get Node Graph Variable** (337) `out#0` "Variable Value" : *Ety*<br>
'*Graph*'/\[8\] **Get Node Graph Variable** (337) @(769.55554,25.825397)<br>
'*Graph*'/\[8\] **Get Node Graph Variable** (337) `in#0` "Variable Name" = '`Graph_Var`' : *Str*<br>
**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741827)<br>
'*New Node Graph*'/\[1\] **Create Composite Node** (1073741825) user=COMPOSITE @(514.5714,126.28571)<br>
'*New Node Graph*'/\[3\] **When Tab Is Selected** (307) @(-329,128)<br>
'*New Node Graph*'/\[3\] **When Tab Is Selected** (307) `out.flow#0` -\> \[9\] **Multiple Branches** (3) `in.flow#0`<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) @(1016,306.14285)<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `out.flow#0` -\> \[16\] **Set Local Variable** (19/2677) `in.flow#0`<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#0` "Target Entity" \<- \[3\] **When Tab Is Selected** (307) `out#0` "Event Source Entity" : *Ety*<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#1` "Preset Status Index" \<- \[5\] **Create Composite Node** (1073741825) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#2` "Preset Status Value" \<- \[5\] **Create Composite Node** (1073741825) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[5\] **Create Composite Node** (1073741825) user=COMPOSITE @(1063,118.14286)<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) @(33.57143,126.71429)<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) `out.flow#1` "1" -\> \[15\] **Create Composite Node(1)** (1073741826) `in.flow#0`<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[3\] **When Tab Is Selected** (307) `out#2` "Tab ID" : *Int*<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) user=COMPOSITE @(480.42856,307)<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) `out.flow#0` "Yes" -\> \[4\] **Set Preset Status** (66) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) `in#0` "Input" \<- \[1\] **Create Composite Node** (1073741825) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) `in#1` "3D Vector" = (1, 2, 3) : *Vec*<br>
'*New Node Graph*'/\[16\] **Set Local Variable** (19/2677) variant=C\<T:Flt\> @(1517.8572,305.2857)<br>
'*New Node Graph*'/\[16\] **Set Local Variable** (19/2677) `in#1` "Value" \<- \[15\] **Create Composite Node(1)** (1073741826) `out#0` "X-Component" : *Flt*<br>
**GRAPH** '*New Node Graph\_2*' ENTITY\_NODE\_GRAPH (guid 1073741834)<br>
**GRAPH** '*Receive*' ENTITY\_NODE\_GRAPH (guid 1073741830)<br>
'*Receive*'/\[2\] **Monitor Signal** (1073741827) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-286,-207) sigver=1<br>
'*Receive*'/\[2\] **Monitor Signal** (1073741827) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Receive*'/\[5\] **Monitor Signal** (1073741830) user=LISTEN\_SIGNAL signal='`Signal_2`' @(-284,98) sigver=3<br>
'*Receive*'/\[5\] **Monitor Signal** (1073741830) `out.flow#0` -\> \[6\] **Print String** (1) `in.flow#0`<br>
'*Receive*'/\[5\] **Monitor Signal** (1073741830) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Receive*'/\[6\] **Print String** (1) @(223,96)<br>
'*Receive*'/\[6\] **Print String** (1) `in#0` "String" \<- \[5\] **Monitor Signal** (1073741830) `out#12` "Parameter\_10" : *Str*<br>
**GRAPH** '*Send*' ENTITY\_NODE\_GRAPH (guid 1073741831)<br>
'*Send*'/\[2\] **Send Signal** (1073741828) user=SEND\_SIGNAL signal='`Signal_1`' @(-172.85715,-372.7143) sigver=1<br>
'*Send*'/\[2\] **Send Signal** (1073741828) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Send*'/\[4\] **Send Signal** (1073741831) user=SEND\_SIGNAL signal='`Signal_2`' @(-197,-101) sigver=3<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#0` "Parameter\_1" \<- \[5\] **When Timer Is Triggered** (83) `out#3` "Timer Sequence ID" : *Int*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#1` "Parameter\_2" = 4 : *Flt*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#2` "Parameter\_3" = (1, 2, 3) : *Vec*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#3` "Parameter\_4" = Yes : *Bol*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#4` "Parameter\_5" \<- \[5\] **When Timer Is Triggered** (83) `out#1` "Event Source GUID" : *Gid*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#5` "Parameter\_6" \<- \[5\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" : *Ety*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#6` "Parameter\_7" = id:5 : *Pfb*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#7` "Parameter\_8" = id:6 : *Cfg*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `in#9` "Parameter\_10" \<- \[5\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'*Send*'/\[4\] **Send Signal** (1073741831) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Send*'/\[5\] **When Timer Is Triggered** (83) @(-582,-100)<br>
'*Send*'/\[5\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[4\] **Send Signal** (1073741831) `in.flow#0`<br>
**GRAPH** '*Structs*' ENTITY\_NODE\_GRAPH (guid 1073741833)<br>
'*Structs*'/\[2\] **Modify Structure** (1073741835) user=STRUCT\_MODIFY struct='`Structure`' @(-291,-272)<br>
'*Structs*'/\[2\] **Modify Structure** (1073741835) `out.flow#0` -\> \[10\] **Modify Structure** (1073741844) `in.flow#0`<br>
'*Structs*'/\[2\] **Modify Structure** (1073741835) `in#0` "Structure" \<- \[4\] **Assemble Structure** (1073741833) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[2\] **Modify Structure** (1073741835) `in#2` "是否设置\_Add variable 1" \<- \[6\] **Split Structure** (1073741834) `out#0` "Add variable 1" : *Str*<br>
'*Structs*'/\[2\] **Modify Structure** (1073741835) `in#3` "是否设置\_Add variable 1" = Yes : *Bol*<br>
'*Structs*'/\[4\] **Assemble Structure** (1073741833) user=STRUCT\_ASSEMBLY struct='`Structure`' @(-1207,-226)<br>
'*Structs*'/\[4\] **Assemble Structure** (1073741833) `in#0` "Add variable 1" = '`9`' : *Str*<br>
'*Structs*'/\[6\] **Split Structure** (1073741834) user=STRUCT\_SPLIT struct='`Structure`' @(-788,-86)<br>
'*Structs*'/\[6\] **Split Structure** (1073741834) `in#0` "Structure" \<- \[4\] **Assemble Structure** (1073741833) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[8\] **When Entity Is Removed/Destroyed** (72) @(-788,-424)<br>
'*Structs*'/\[8\] **When Entity Is Removed/Destroyed** (72) `out.flow#0` -\> \[2\] **Modify Structure** (1073741835) `in.flow#0`<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) user=STRUCT\_MODIFY struct='`Structure_1`' @(150.14285,-270.42856)<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) `in#2` "是否设置\_Add variable 1" \<- \[14\] **Split Structure** (1073741843) `out#0` "Add variable 1" : *L\<Str\>*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) `in#3` "Add variable 2" = Yes : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) `in#5` "Add variable 3" = No : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) `in#6` "是否设置\_Add variable 3" \<- \[4\] **Assemble Structure** (1073741833) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) `in#7` "Add variable 4" = Yes : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741844) `in#9` "是否设置\_Add variable 4" = No : *Bol*<br>
'*Structs*'/\[13\] **Assemble Structure** (1073741842) user=STRUCT\_ASSEMBLY struct='`Structure_1`' @(-790.7857,146.71428)<br>
'*Structs*'/\[13\] **Assemble Structure** (1073741842) `in#1` "Add variable 2" = 8 : *Int*<br>
'*Structs*'/\[14\] **Split Structure** (1073741843) user=STRUCT\_SPLIT struct='`Structure_1`' @(-313.2143,141)<br>
'*Structs*'/\[14\] **Split Structure** (1073741843) `in#0` "Structure\_1" \<- \[13\] **Assemble Structure** (1073741842) `out#0` "Structure\_1" : *Struct*<br>
**GRAPH** '<u>\<status\></u>*Empty*' STATUS\_NODE\_GRAPH (guid 1073741826)<br>
**GRAPH** '<u>\<status\></u>*New Node Graph\_1*' STATUS\_NODE\_GRAPH (guid 1073741835)<br>
**GRAPH** '<u>\<class\></u>*New Node Graph\_2\_1*' CLASS\_NODE\_GRAPH (guid 1073741836)<br>
**GRAPH** '*New Node Graph\_3*' ITEM\_NODE\_GRAPH (guid 1073741837)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1073741828, decl 1073741825)<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out#0` "Value" -\> \[1\] **Get Local Variable** (18/20) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(-128,-138)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/20) `in#0` "Initial Value" = 42 : *Int*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1073741829, decl 1073741826)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[11\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[1\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[11\] **Double Branch** (2) `out.flow#0` "Yes"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[1\] **Print String** (1) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#1` "No" -\> \[11\] **Double Branch** (2) `out.flow#1` "No"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#0` "Input" -\> \[2\] **Data Type Conversion** (180/182) `in#0` "Input"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#0` "Input" -\> \[10\] **Equal** (14/370) `in#1` "Input 2"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#1` "3D Vector" -\> \[21\] **Split 3D Vector** (9) `in#0` "3D Vector"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out#0` "X-Component" -\> \[21\] **Split 3D Vector** (9) `out#0` "X-Component"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out#1` "Z-Component" -\> \[21\] **Split 3D Vector** (9) `out#2` "Z-Component"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Print String** (1) @(203.85715,-324.7143)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Print String** (1) `in#0` "String" \<- \[2\] **Data Type Conversion** (180/182) `out#0` "Output" : *Str*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[2\] **Data Type Conversion** (180/182) variant=C\<K:Int,V:Str\> @(186.71428,-546.1429)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[6\] **When Entering Collision Trigger** (92) @(-344,-190.28572)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[6\] **When Entering Collision Trigger** (92) `out.flow#0` -\> \[1\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[8\] **When Exiting Collision Trigger** (91) @(-325.42856,228.28572)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[8\] **When Exiting Collision Trigger** (91) `out.flow#0` -\> \[11\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[10\] **Equal** (14/370) variant=C\<T:Int\> @(124.57143,-50.285713)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[10\] **Equal** (14/370) `in#0` "Input 1" \<- \[6\] **When Entering Collision Trigger** (92) `out#4` "Trigger ID" : *Int*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[11\] **Double Branch** (2) @(268.85715,226.85715)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[11\] **Double Branch** (2) `in#0` "Condition" \<- \[10\] **Equal** (14/370) `out#0` "Result" : *Bol*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[21\] **Split 3D Vector** (9) @(709.5714,-327.57144)<br>
**GRAPH** '<u>\<skill\></u>*New Character Skill Node Graph*' SKILL\_NODE\_GRAPH (guid 1082130435)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[3\] **Play Timed Effects** (200038/2000) `in.flow#0`<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) @(375,1)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) `in#0` "Special Effects Asset Configuration ID" = id:2 : *Cfg*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) `in#1` "Location" \<- \[4\] **3D Vector Zoom** (200066/134) `out#0` "Result" : *Vec*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) `in#2` "Rotate" \<- \[5\] **Get Ray Detection Result** (200109/1047) `out#0` "On-Hit Location" : *Vec*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[4\] **3D Vector Zoom** (200066/134) @(-42,195)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[5\] **Get Ray Detection Result** (200109/1047) @(-113.25,499.25)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[5\] **Get Ray Detection Result** (200109/1047) `in#0` "Detect Initiator Entity" \<- \[6\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" : *Ety*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[6\] **Get Self Entity** (200033/1013) @(-415.5,510.25)<br>
**GRAPH** '<u>\<skill\></u>*New Character Skill Node Graph\_1*' SKILL\_NODE\_GRAPH (guid 1082130442)<br>
'<u>\<skill\></u>*New Character Skill Node Graph\_1*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Skill Node Graph*' CREATION\_SKILL\_GRAPH (guid 1082130436)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[2\] **Taunt Target** (200089/2000) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[2\] **Taunt Target** (200089/2000) @(385,-6)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[2\] **Taunt Target** (200089/2000) `in#0` "Taunter Entity" \<- \[4\] **Traverse Entity List** (200055/2000) `out#0` "Current Entity" : *Ety*<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[4\] **Traverse Entity List** (200055/2000) @(26,195)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Skill Node Graph\_1*' CREATION\_SKILL\_GRAPH (guid 1082130443)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph\_1*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Node Graph*' CREATION\_STATUS\_GRAPH (guid 1082130437)<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#0` "1" -\> \[2\] **Tactic: Ground Escape** (200138/4019) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[2\] **Tactic: Ground Escape** (200138/4019) @(431,-2)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Node Graph\_1*' CREATION\_STATUS\_GRAPH (guid 1082130444)<br>
'<u>\<creation\></u>*New Creation Status Node Graph\_1*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130439)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/2<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#1` "2" -\> \[2\] **Multiple Branches** (200127) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Multiple Branches** (200127) @(445,39)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Multiple Branches** (200127) `out.flow#0` "Default" -\> \[3\] **Switch to self execution status** (200128/4011) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) @(883,144)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) `in#1` "Status Node Graph Configuration ID" = id:1082130437 : *Cfg*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) `in#2` "Autonomous Logic Parameter ID" = 0 : *Int*<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph\_1*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130446)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph\_1*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
**GRAPH** '<u>\<skill\></u>*New Character Control Skill Node Graph*' CHARACTER\_CONTROL\_SKILL\_GRAPH (guid 1082130438)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[2\] **Complete Current Pre-Aim** (200288/2000) `in.flow#0`<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[2\] **Complete Current Pre-Aim** (200288/2000) @(347,-4)<br>
**GRAPH** '<u>\<skill\></u>*New Character Control Skill Node Graph\_1*' CHARACTER\_CONTROL\_SKILL\_GRAPH (guid 1082130445)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph\_1*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' BOOLEAN\_FILTER\_GRAPH (guid 1082130433)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) `in#0` "Output Result (Boolean)" \<- \[2\] **Less Than** (200008/12) `out#0` "Result" : *Bol*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) variant=C\<T:Int\> @(-531,-5)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) `in#1` \<- \[3\] **Get List Length** (200018) `out#0` "Length" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) `in#2` = 0 : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List Length** (200018) @(-935,5)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_2*' BOOLEAN\_FILTER\_GRAPH (guid 1082130440)<br>
'<u>\<filter\></u>*New Filter Node Graph\_2*'/\[1\] **Node Graph End (Boolean)** (200000) @(0,0)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_1*' INTEGER\_FILTER\_GRAPH (guid 1082130434)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) `in#0` "Output Result (Integer)" \<- \[2\] **Get Custom Variable** (200016/41) `out#0` "Variable Value" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) variant=C\<T:Int\> @(-467,2)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) `in#0` "Target Entity" \<- \[3\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" : *Ety*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) `in#1` "Variable Name" = '`test`' : *Str*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[3\] **Get Self Entity** (200033/1013) @(-413,-166)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_1\_1*' INTEGER\_FILTER\_GRAPH (guid 1082130441)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1\_1*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)

# FILE `test/cases/gil/stage_1.gil`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*New Node Graph*'/\[1\] **Create Composite Node** (1073741825) user=COMPOSITE @(514.5714,126.28571)<br>
'*New Node Graph*'/\[3\] **When Tab Is Selected** (307) @(-329,128)<br>
'*New Node Graph*'/\[3\] **When Tab Is Selected** (307) `out.flow#0` -\> \[9\] **Multiple Branches** (3) `in.flow#0`<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) @(1016,306.14285)<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `out.flow#0` -\> \[16\] **Set Local Variable** (19/2677) `in.flow#0`<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#0` "Target Entity" \<- \[3\] **When Tab Is Selected** (307) `out#0` "Event Source Entity" : *Ety*<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#1` "Preset Status Index" \<- \[5\] **Create Composite Node** (1073741825) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#2` "Preset Status Value" \<- \[5\] **Create Composite Node** (1073741825) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[5\] **Create Composite Node** (1073741825) user=COMPOSITE @(1063,118.14286)<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) @(33.57143,126.71429)<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) `out.flow#1` "1" -\> \[15\] **Create Composite Node(1)** (1073741826) `in.flow#0`<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[3\] **When Tab Is Selected** (307) `out#2` "Tab ID" : *Int*<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) user=COMPOSITE @(480.42856,307)<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) `out.flow#0` "Yes" -\> \[4\] **Set Preset Status** (66) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) `in#0` "Input" \<- \[1\] **Create Composite Node** (1073741825) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1073741826) `in#1` "3D Vector" = (1, 2, 3) : *Vec*<br>
'*New Node Graph*'/\[16\] **Set Local Variable** (19/2677) variant=C\<T:Flt\> @(1517.8572,305.2857)<br>
'*New Node Graph*'/\[16\] **Set Local Variable** (19/2677) `in#1` "Value" \<- \[15\] **Create Composite Node(1)** (1073741826) `out#0` "X-Component" : *Flt*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1073741826, decl 1073741825)<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out#0` "Value" -\> \[1\] **Get Local Variable** (18/20) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(-128,-138)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/20) `in#0` "Initial Value" = 42 : *Int*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1073741827, decl 1073741826)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[11\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[1\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[11\] **Double Branch** (2) `out.flow#0` "Yes"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[1\] **Print String** (1) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#1` "No" -\> \[11\] **Double Branch** (2) `out.flow#1` "No"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#0` "Input" -\> \[2\] **Data Type Conversion** (180/182) `in#0` "Input"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#0` "Input" -\> \[10\] **Equal** (14/370) `in#1` "Input 2"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#1` "3D Vector" -\> \[21\] **Split 3D Vector** (9) `in#0` "3D Vector"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out#0` "X-Component" -\> \[21\] **Split 3D Vector** (9) `out#0` "X-Component"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out#1` "Z-Component" -\> \[21\] **Split 3D Vector** (9) `out#2` "Z-Component"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Print String** (1) @(203.85715,-324.7143)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Print String** (1) `in#0` "String" \<- \[2\] **Data Type Conversion** (180/182) `out#0` "Output" : *Str*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[2\] **Data Type Conversion** (180/182) variant=C\<K:Int,V:Str\> @(186.71428,-546.1429)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[6\] **When Entering Collision Trigger** (92) @(-344,-190.28572)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[6\] **When Entering Collision Trigger** (92) `out.flow#0` -\> \[1\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[8\] **When Exiting Collision Trigger** (91) @(-325.42856,228.28572)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[8\] **When Exiting Collision Trigger** (91) `out.flow#0` -\> \[11\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[10\] **Equal** (14/370) variant=C\<T:Int\> @(124.57143,-50.285713)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[10\] **Equal** (14/370) `in#0` "Input 1" \<- \[6\] **When Entering Collision Trigger** (92) `out#4` "Trigger ID" : *Int*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[11\] **Double Branch** (2) @(268.85715,226.85715)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[11\] **Double Branch** (2) `in#0` "Condition" \<- \[10\] **Equal** (14/370) `out#0` "Result" : *Bol*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[21\] **Split 3D Vector** (9) @(709.5714,-327.57144)

# FILE `test/cases/gil/stage_2.gil`

**DECL** "**Signal\_2**" SIGNAL\_NODE\_DECL guid='`1073741829`'<br>
DECL/**Signal\_2** SEND\_SIGNAL name='`Signal_2`' server\_node=1073741828 client\_node=1073741830<br>
DECL/**Signal\_2** `in.flow#0` uid=30<br>
DECL/**Signal\_2** `out.flow#0` uid=31<br>
DECL/**Signal\_2** `in#0` "Parameter\_1" : *Int* uid=42<br>
DECL/**Signal\_2** `in#1` "Parameter\_2" : *Flt* uid=43<br>
DECL/**Signal\_2** `in#2` "Parameter\_3" : *Vec* uid=44<br>
DECL/**Signal\_2** `in#3` "Parameter\_4" : *Bol* enum\_family=1 uid=45<br>
DECL/**Signal\_2** `in#4` "Parameter\_5" : *Gid* uid=46<br>
DECL/**Signal\_2** `in#5` "Parameter\_6" : *Ety* uid=47<br>
DECL/**Signal\_2** `in#6` "Parameter\_7" : *Pfb* uid=48<br>
DECL/**Signal\_2** `in#7` "Parameter\_8" : *Cfg* uid=49<br>
DECL/**Signal\_2** `in#8` "Parameter\_9" : *L\<Int\>* uid=50<br>
DECL/**Signal\_2** `in#9` "Parameter\_10" : *Str* uid=72<br>
DECL/**Signal\_2** `meta#0` "Signal Name" uid=32<br>
**DECL** "**Signal\_1**" SIGNAL\_NODE\_DECL guid='`1073741826`'<br>
DECL/**Signal\_1** SEND\_SIGNAL name='`Signal_1`' server\_node=1073741825 client\_node=1073741827<br>
DECL/**Signal\_1** `in.flow#0` uid=18<br>
DECL/**Signal\_1** `out.flow#0` uid=19<br>
DECL/**Signal\_1** `meta#0` "Signal Name" uid=20<br>
**GRAPH** '*Both*' ENTITY\_NODE\_GRAPH (guid 1073741827)<br>
'*Both*'/\[2\] **Monitor Signal** (1073741825) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-293,-150) sigver=1<br>
'*Both*'/\[2\] **Monitor Signal** (1073741825) `out.flow#0` -\> \[4\] **Send Signal** (1073741826) `in.flow#0`<br>
'*Both*'/\[2\] **Monitor Signal** (1073741825) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Both*'/\[4\] **Send Signal** (1073741826) user=SEND\_SIGNAL signal='`Signal_1`' @(207,-148) sigver=1<br>
'*Both*'/\[4\] **Send Signal** (1073741826) `out.flow#0` -\> \[6\] **Send Signal** (1073741829) `in.flow#0`<br>
'*Both*'/\[4\] **Send Signal** (1073741826) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Both*'/\[6\] **Send Signal** (1073741829) user=SEND\_SIGNAL signal='`Signal_2`' @(583,-153) sigver=3<br>
'*Both*'/\[6\] **Send Signal** (1073741829) `in#8` "Parameter\_9" \<- \[7\] **Monitor Signal** (1073741828) `out#11` "Parameter\_9" : *L\<Int\>*<br>
'*Both*'/\[6\] **Send Signal** (1073741829) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Both*'/\[7\] **Monitor Signal** (1073741828) user=LISTEN\_SIGNAL signal='`Signal_2`' @(102.85714,143.28572) sigver=3<br>
'*Both*'/\[7\] **Monitor Signal** (1073741828) `out.flow#0` -\> \[6\] **Send Signal** (1073741829) `in.flow#0`<br>
'*Both*'/\[7\] **Monitor Signal** (1073741828) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
**GRAPH** '*Receive*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Receive*'/\[2\] **Monitor Signal** (1073741825) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-286,-207) sigver=1<br>
'*Receive*'/\[2\] **Monitor Signal** (1073741825) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Receive*'/\[5\] **Monitor Signal** (1073741828) user=LISTEN\_SIGNAL signal='`Signal_2`' @(-284,98) sigver=3<br>
'*Receive*'/\[5\] **Monitor Signal** (1073741828) `out.flow#0` -\> \[6\] **Print String** (1) `in.flow#0`<br>
'*Receive*'/\[5\] **Monitor Signal** (1073741828) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Receive*'/\[6\] **Print String** (1) @(223,96)<br>
'*Receive*'/\[6\] **Print String** (1) `in#0` "String" \<- \[5\] **Monitor Signal** (1073741828) `out#12` "Parameter\_10" : *Str*<br>
**GRAPH** '*Send*' ENTITY\_NODE\_GRAPH (guid 1073741826)<br>
'*Send*'/\[2\] **Send Signal** (1073741826) user=SEND\_SIGNAL signal='`Signal_1`' @(-172.85715,-372.7143) sigver=1<br>
'*Send*'/\[2\] **Send Signal** (1073741826) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Send*'/\[4\] **Send Signal** (1073741829) user=SEND\_SIGNAL signal='`Signal_2`' @(-197,-101) sigver=3<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#0` "Parameter\_1" \<- \[5\] **When Timer Is Triggered** (83) `out#3` "Timer Sequence ID" : *Int*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#1` "Parameter\_2" = 4 : *Flt*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#2` "Parameter\_3" = (1, 2, 3) : *Vec*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#3` "Parameter\_4" = Yes : *Bol*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#4` "Parameter\_5" \<- \[5\] **When Timer Is Triggered** (83) `out#1` "Event Source GUID" : *Gid*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#5` "Parameter\_6" \<- \[5\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" : *Ety*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#6` "Parameter\_7" = id:5 : *Pfb*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#7` "Parameter\_8" = id:6 : *Cfg*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `in#9` "Parameter\_10" \<- \[5\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'*Send*'/\[4\] **Send Signal** (1073741829) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Send*'/\[5\] **When Timer Is Triggered** (83) @(-582,-100)<br>
'*Send*'/\[5\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[4\] **Send Signal** (1073741829) `in.flow#0`

# FILE `test/cases/gil/stage_3.gil`

**STRUCT** "**Structure**" guid='`1077936129`' id=1077936129 version=7<br>
STRUCT/**Structure** FIELD#1 "**Add variable 1**" : *Str*<br>
**STRUCT** "**Structure\_1**" guid='`1077936130`' id=1077936130 version=5<br>
STRUCT/**Structure\_1** FIELD#1 "**Add variable 1**" : *L\<Str\>*<br>
STRUCT/**Structure\_1** FIELD#2 "**Add variable 2**" : *Int*<br>
STRUCT/**Structure\_1** FIELD#3 "**Add variable 3**" : *Struct* struct=Structure<br>
STRUCT/**Structure\_1** FIELD#4 "**Add variable 4**" : *L\<Struct\>* struct=Structure<br>
**GRAPH** '*Structs*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Structs*'/\[2\] **Modify Structure** (1073741827) user=STRUCT\_MODIFY struct='`Structure`' @(-291,-272)<br>
'*Structs*'/\[2\] **Modify Structure** (1073741827) `out.flow#0` -\> \[10\] **Modify Structure** (1073741836) `in.flow#0`<br>
'*Structs*'/\[2\] **Modify Structure** (1073741827) `in#0` "Structure" \<- \[4\] **Assemble Structure** (1073741825) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[2\] **Modify Structure** (1073741827) `in#2` "是否设置\_Add variable 1" \<- \[6\] **Split Structure** (1073741826) `out#0` "Add variable 1" : *Str*<br>
'*Structs*'/\[2\] **Modify Structure** (1073741827) `in#3` "是否设置\_Add variable 1" = Yes : *Bol*<br>
'*Structs*'/\[4\] **Assemble Structure** (1073741825) user=STRUCT\_ASSEMBLY struct='`Structure`' @(-1207,-226)<br>
'*Structs*'/\[4\] **Assemble Structure** (1073741825) `in#0` "Add variable 1" = '`9`' : *Str*<br>
'*Structs*'/\[6\] **Split Structure** (1073741826) user=STRUCT\_SPLIT struct='`Structure`' @(-788,-86)<br>
'*Structs*'/\[6\] **Split Structure** (1073741826) `in#0` "Structure" \<- \[4\] **Assemble Structure** (1073741825) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[8\] **When Entity Is Removed/Destroyed** (72) @(-788,-424)<br>
'*Structs*'/\[8\] **When Entity Is Removed/Destroyed** (72) `out.flow#0` -\> \[2\] **Modify Structure** (1073741827) `in.flow#0`<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) user=STRUCT\_MODIFY struct='`Structure_1`' @(150.14285,-270.42856)<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) `in#2` "是否设置\_Add variable 1" \<- \[14\] **Split Structure** (1073741835) `out#0` "Add variable 1" : *L\<Str\>*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) `in#3` "Add variable 2" = Yes : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) `in#5` "Add variable 3" = No : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) `in#6` "是否设置\_Add variable 3" \<- \[4\] **Assemble Structure** (1073741825) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) `in#7` "Add variable 4" = Yes : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1073741836) `in#9` "是否设置\_Add variable 4" = No : *Bol*<br>
'*Structs*'/\[13\] **Assemble Structure** (1073741834) user=STRUCT\_ASSEMBLY struct='`Structure_1`' @(-790.7857,146.71428)<br>
'*Structs*'/\[13\] **Assemble Structure** (1073741834) `in#1` "Add variable 2" = 8 : *Int*<br>
'*Structs*'/\[14\] **Split Structure** (1073741835) user=STRUCT\_SPLIT struct='`Structure_1`' @(-313.2143,141)<br>
'*Structs*'/\[14\] **Split Structure** (1073741835) `in#0` "Structure\_1" \<- \[13\] **Assemble Structure** (1073741834) `out#0` "Structure\_1" : *Struct*

# FILE `test/cases/gil/stage_6.gil`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*New Node Graph*'/\[1\] **When All Player's Characters Are Revived** (286) @(-446,-135)<br>
'*New Node Graph*'/\[1\] **When All Player's Characters Are Revived** (286) `out.flow#0` -\> \[2\] **Revive the active character** (803) `in.flow#0`<br>
'*New Node Graph*'/\[2\] **Revive the active character** (803) @(103,-135)<br>
'*New Node Graph*'/\[2\] **Revive the active character** (803) `in#0` "Player Entity" \<- \[1\] **When All Player's Characters Are Revived** (286) `out#0` "Player Entity" : *Ety*<br>
**GRAPH** '*New Node Graph\_1*' ITEM\_NODE\_GRAPH (guid 1073741826)<br>
'*New Node Graph\_1*'/\[1\] **When Floating Interaction Page is Triggered** (826) @(-343,-157)<br>
'*New Node Graph\_1*'/\[1\] **When Floating Interaction Page is Triggered** (826) `out.flow#0` -\> \[2\] **Teleport Player (Classic Mode)** (805) `in.flow#0`<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) @(208,-159)<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) `in#0` "Player Entity" \<- \[1\] **When Floating Interaction Page is Triggered** (826) `out#0` "Player Entity" : *Ety*<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) `in#1` "Target Location" = (1, 1, 1) : *Vec*<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) `in#2` "Target Rotation" = (2, 2, 2) : *Vec*

# FILE `test/cases/gil/stage_7.gil`

**GRAPH** '<u>\<skill\></u>*New Character Skill Node Graph*' SKILL\_NODE\_GRAPH (guid 1082130435)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[3\] **Play Timed Effects** (200038/2000) `in.flow#0`<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) @(375,1)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) `in#0` "Special Effects Asset Configuration ID" = id:2 : *Cfg*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) `in#1` "Location" \<- \[4\] **3D Vector Zoom** (200066/134) `out#0` "Result" : *Vec*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[3\] **Play Timed Effects** (200038/2000) `in#2` "Rotate" \<- \[5\] **Get Ray Detection Result** (200109/1047) `out#0` "On-Hit Location" : *Vec*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[4\] **3D Vector Zoom** (200066/134) @(-42,195)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[5\] **Get Ray Detection Result** (200109/1047) @(-113.25,499.25)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[5\] **Get Ray Detection Result** (200109/1047) `in#0` "Detect Initiator Entity" \<- \[6\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" : *Ety*<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[6\] **Get Self Entity** (200033/1013) @(-415.5,510.25)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Skill Node Graph*' CREATION\_SKILL\_GRAPH (guid 1082130436)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[2\] **Taunt Target** (200089/2000) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[2\] **Taunt Target** (200089/2000) @(385,-6)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[2\] **Taunt Target** (200089/2000) `in#0` "Taunter Entity" \<- \[4\] **Traverse Entity List** (200055/2000) `out#0` "Current Entity" : *Ety*<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[4\] **Traverse Entity List** (200055/2000) @(26,195)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Node Graph*' CREATION\_STATUS\_GRAPH (guid 1082130437)<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#0` "1" -\> \[2\] **Tactic: Ground Escape** (200138/4019) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[2\] **Tactic: Ground Escape** (200138/4019) @(431,-2)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130439)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/2<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#1` "2" -\> \[2\] **Multiple Branches** (200127) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Multiple Branches** (200127) @(445,39)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Multiple Branches** (200127) `out.flow#0` "Default" -\> \[3\] **Switch to self execution status** (200128/4011) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) @(883,144)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) `in#1` "Status Node Graph Configuration ID" = id:1082130437 : *Cfg*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) `in#2` "Autonomous Logic Parameter ID" = 0 : *Int*<br>
**GRAPH** '<u>\<skill\></u>*New Character Control Skill Node Graph*' CHARACTER\_CONTROL\_SKILL\_GRAPH (guid 1082130438)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[2\] **Complete Current Pre-Aim** (200288/2000) `in.flow#0`<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[2\] **Complete Current Pre-Aim** (200288/2000) @(347,-4)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' BOOLEAN\_FILTER\_GRAPH (guid 1082130433)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) `in#0` "Output Result (Boolean)" \<- \[2\] **Less Than** (200008/12) `out#0` "Result" : *Bol*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) variant=C\<T:Int\> @(-531,-5)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) `in#1` \<- \[3\] **Get List Length** (200018) `out#0` "Length" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) `in#2` = 0 : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List Length** (200018) @(-935,5)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_1*' INTEGER\_FILTER\_GRAPH (guid 1082130434)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) `in#0` "Output Result (Integer)" \<- \[2\] **Get Custom Variable** (200016/41) `out#0` "Variable Value" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) variant=C\<T:Int\> @(-467,2)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) `in#0` "Target Entity" \<- \[3\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" : *Ety*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) `in#1` "Variable Name" = '`test`' : *Str*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[3\] **Get Self Entity** (200033/1013) @(-413,-166)

# FILE `test/cases/gil/stage_9.gil`

**DECL** "**Signal\_1**" SIGNAL\_NODE\_DECL guid='`1073741825`'<br>
DECL/**Signal\_1** SEND\_SIGNAL name='`Signal_1`' server\_node=1073741826 client\_node=1073741827<br>
DECL/**Signal\_1** `in.flow#0` uid=178<br>
DECL/**Signal\_1** `out.flow#0` uid=179<br>
DECL/**Signal\_1** `meta#0` "Signal Name" uid=180<br>
**STRUCT** "**Structure**" guid='`1077936129`' id=1077936129 version=2<br>
**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
**GRAPH** '<u>\<status\></u>*New Node Graph\_1*' STATUS\_NODE\_GRAPH (guid 1073741826)<br>
**GRAPH** '<u>\<class\></u>*New Node Graph\_2*' CLASS\_NODE\_GRAPH (guid 1073741827)<br>
**GRAPH** '*New Node Graph\_3*' ITEM\_NODE\_GRAPH (guid 1073741828)<br>
**GRAPH** '<u>\<skill\></u>*New Character Skill Node Graph*' SKILL\_NODE\_GRAPH (guid 1082130435)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Skill Node Graph*' CREATION\_SKILL\_GRAPH (guid 1082130436)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Node Graph*' CREATION\_STATUS\_GRAPH (guid 1082130437)<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130439)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
**GRAPH** '<u>\<skill\></u>*New Character Control Skill Node Graph*' CHARACTER\_CONTROL\_SKILL\_GRAPH (guid 1082130438)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' BOOLEAN\_FILTER\_GRAPH (guid 1082130433)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) @(0,0)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_1*' INTEGER\_FILTER\_GRAPH (guid 1082130434)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)
