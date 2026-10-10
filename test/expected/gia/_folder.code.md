# FILE `test/cases/gia/sample_0_main.gia`

**GRAPH** '*Graph*' ENTITY\_NODE\_GRAPH (guid 1073742366)<br>
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
**GRAPH** '<u>\<status\></u>*Empty*' STATUS\_NODE\_GRAPH (guid 1073742384)

# FILE `test/cases/gia/sample_1.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*New Node Graph*'/\[1\] **Create Composite Node** (1610612737) user=COMPOSITE @(514.5714,126.28571)<br>
'*New Node Graph*'/\[3\] **When Tab Is Selected** (307) @(-329,128)<br>
'*New Node Graph*'/\[3\] **When Tab Is Selected** (307) `out.flow#0` -\> \[9\] **Multiple Branches** (3) `in.flow#0`<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) @(1016,306.14285)<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `out.flow#0` -\> \[16\] **Set Local Variable** (19/2677) `in.flow#0`<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#0` "Target Entity" \<- \[3\] **When Tab Is Selected** (307) `out#0` "Event Source Entity" : *Ety*<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#1` "Preset Status Index" \<- \[5\] **Create Composite Node** (1610612737) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[4\] **Set Preset Status** (66) `in#2` "Preset Status Value" \<- \[5\] **Create Composite Node** (1610612737) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[5\] **Create Composite Node** (1610612737) user=COMPOSITE @(1063,118.14286)<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) @(33.57143,126.71429)<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) `out.flow#1` "1" -\> \[15\] **Create Composite Node(1)** (1610612738) `in.flow#0`<br>
'*New Node Graph*'/\[9\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[3\] **When Tab Is Selected** (307) `out#2` "Tab ID" : *Int*<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1610612738) user=COMPOSITE @(480.42856,307)<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1610612738) `out.flow#0` "Yes" -\> \[4\] **Set Preset Status** (66) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1610612738) `in#0` "Input" \<- \[1\] **Create Composite Node** (1610612737) `out#0` "Value" : *Int*<br>
'*New Node Graph*'/\[15\] **Create Composite Node(1)** (1610612738) `in#1` "3D Vector" = (1, 2, 3) : *Vec*<br>
'*New Node Graph*'/\[16\] **Set Local Variable** (19/2677) variant=C\<T:Flt\> @(1517.8572,305.2857)<br>
'*New Node Graph*'/\[16\] **Set Local Variable** (19/2677) `in#1` "Value" \<- \[15\] **Create Composite Node(1)** (1610612738) `out#0` "X-Component" : *Flt*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1610612737, decl 1610612737) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out#0` "Value" -\> \[1\] **Get Local Variable** (18/20) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(-128,-138)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/20) `in#0` "Initial Value" = 42 : *Int*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1610612738, decl 1610612738) role=dependency<br>
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

# FILE `test/cases/gia/sample_2.gia`

**DECL** "**Signal\_1**" SIGNAL\_NODE\_DECL guid='`1610612739`'<br>
DECL/**Signal\_1** SEND\_SIGNAL name='`Signal_1`' server\_node=1610612740 client\_node=1610612741<br>
DECL/**Signal\_1** `in.flow#0` uid=18<br>
DECL/**Signal\_1** `out.flow#0` uid=19<br>
DECL/**Signal\_1** `meta#0` "Signal Name" uid=20<br>
**DECL** "**Signal\_2**" SIGNAL\_NODE\_DECL guid='`1610612742`'<br>
DECL/**Signal\_2** SEND\_SIGNAL name='`Signal_2`' server\_node=1610612743 client\_node=1610612744<br>
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
**GRAPH** '*Both*' ENTITY\_NODE\_GRAPH (guid 1073741828)<br>
'*Both*'/\[2\] **Monitor Signal** (1610612740) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-293,-150) sigver=1<br>
'*Both*'/\[2\] **Monitor Signal** (1610612740) `out.flow#0` -\> \[4\] **Send Signal** (1610612739) `in.flow#0`<br>
'*Both*'/\[2\] **Monitor Signal** (1610612740) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Both*'/\[4\] **Send Signal** (1610612739) user=SEND\_SIGNAL signal='`Signal_1`' @(207,-148) sigver=1<br>
'*Both*'/\[4\] **Send Signal** (1610612739) `out.flow#0` -\> \[6\] **Send Signal** (1610612742) `in.flow#0`<br>
'*Both*'/\[4\] **Send Signal** (1610612739) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Both*'/\[6\] **Send Signal** (1610612742) user=SEND\_SIGNAL signal='`Signal_2`' @(583,-153) sigver=3<br>
'*Both*'/\[6\] **Send Signal** (1610612742) `in#8` "Parameter\_9" \<- \[7\] **Monitor Signal** (1610612743) `out#11` "Parameter\_9" : *L\<Int\>*<br>
'*Both*'/\[6\] **Send Signal** (1610612742) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Both*'/\[7\] **Monitor Signal** (1610612743) user=LISTEN\_SIGNAL signal='`Signal_2`' @(102.85714,143.28572) sigver=3<br>
'*Both*'/\[7\] **Monitor Signal** (1610612743) `out.flow#0` -\> \[6\] **Send Signal** (1610612742) `in.flow#0`<br>
'*Both*'/\[7\] **Monitor Signal** (1610612743) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
**GRAPH** '*Receive*' ENTITY\_NODE\_GRAPH (guid 1073741826)<br>
'*Receive*'/\[2\] **Monitor Signal** (1610612740) user=LISTEN\_SIGNAL signal='`Signal_1`' @(-286,-207) sigver=1<br>
'*Receive*'/\[2\] **Monitor Signal** (1610612740) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Receive*'/\[5\] **Monitor Signal** (1610612743) user=LISTEN\_SIGNAL signal='`Signal_2`' @(-284,98) sigver=3<br>
'*Receive*'/\[5\] **Monitor Signal** (1610612743) `out.flow#0` -\> \[6\] **Print String** (1) `in.flow#0`<br>
'*Receive*'/\[5\] **Monitor Signal** (1610612743) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Receive*'/\[6\] **Print String** (1) @(223,96)<br>
'*Receive*'/\[6\] **Print String** (1) `in#0` "String" \<- \[5\] **Monitor Signal** (1610612743) `out#12` "Parameter\_10" : *Str*<br>
**GRAPH** '*Send*' ENTITY\_NODE\_GRAPH (guid 1073741827)<br>
'*Send*'/\[2\] **Send Signal** (1610612739) user=SEND\_SIGNAL signal='`Signal_1`' @(-172.85715,-372.7143) sigver=1<br>
'*Send*'/\[2\] **Send Signal** (1610612739) `meta.rpc#0` "Signal Name" = '`Signal_1`'<br>
'*Send*'/\[4\] **Send Signal** (1610612742) user=SEND\_SIGNAL signal='`Signal_2`' @(-197,-101) sigver=3<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#0` "Parameter\_1" \<- \[5\] **When Timer Is Triggered** (83) `out#3` "Timer Sequence ID" : *Int*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#1` "Parameter\_2" = 4 : *Flt*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#2` "Parameter\_3" = (1, 2, 3) : *Vec*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#3` "Parameter\_4" = Yes : *Bol*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#4` "Parameter\_5" \<- \[5\] **When Timer Is Triggered** (83) `out#1` "Event Source GUID" : *Gid*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#5` "Parameter\_6" \<- \[5\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" : *Ety*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#6` "Parameter\_7" = id:5 : *Pfb*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#7` "Parameter\_8" = id:6 : *Cfg*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `in#9` "Parameter\_10" \<- \[5\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'*Send*'/\[4\] **Send Signal** (1610612742) `meta.rpc#0` "Signal Name" = '`Signal_2`'<br>
'*Send*'/\[5\] **When Timer Is Triggered** (83) @(-582,-100)<br>
'*Send*'/\[5\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[4\] **Send Signal** (1610612742) `in.flow#0`

# FILE `test/cases/gia/sample_3.gia`

**STRUCT** "**Structure**" guid='`1077936129`' id=1077936129 version=7<br>
STRUCT/**Structure** FIELD#1 "**Add variable 1**" : *Str*<br>
**STRUCT** "**Structure\_1**" guid='`1077936130`' id=1077936130 version=5<br>
STRUCT/**Structure\_1** FIELD#1 "**Add variable 1**" : *L\<Str\>*<br>
STRUCT/**Structure\_1** FIELD#2 "**Add variable 2**" : *Int*<br>
STRUCT/**Structure\_1** FIELD#3 "**Add variable 3**" : *Struct* struct=Structure<br>
STRUCT/**Structure\_1** FIELD#4 "**Add variable 4**" : *L\<Struct\>* struct=Structure<br>
**GRAPH** '*Structs*' ENTITY\_NODE\_GRAPH (guid 1073741829)<br>
'*Structs*'/\[2\] **Modify Structure** (1610612747) user=STRUCT\_MODIFY struct='`Structure`' @(-291,-272)<br>
'*Structs*'/\[2\] **Modify Structure** (1610612747) `out.flow#0` -\> \[10\] **Modify Structure** (1610612756) `in.flow#0`<br>
'*Structs*'/\[2\] **Modify Structure** (1610612747) `in#0` "Structure" \<- \[4\] **Assemble Structure** (1610612745) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[2\] **Modify Structure** (1610612747) `in#2` "是否设置\_Add variable 1" \<- \[6\] **Split Structure** (1610612746) `out#0` "Add variable 1" : *Str*<br>
'*Structs*'/\[2\] **Modify Structure** (1610612747) `in#3` "是否设置\_Add variable 1" = Yes : *Bol*<br>
'*Structs*'/\[4\] **Assemble Structure** (1610612745) user=STRUCT\_ASSEMBLY struct='`Structure`' @(-1207,-226)<br>
'*Structs*'/\[4\] **Assemble Structure** (1610612745) `in#0` "Add variable 1" = '`9`' : *Str*<br>
'*Structs*'/\[6\] **Split Structure** (1610612746) user=STRUCT\_SPLIT struct='`Structure`' @(-788,-86)<br>
'*Structs*'/\[6\] **Split Structure** (1610612746) `in#0` "Structure" \<- \[4\] **Assemble Structure** (1610612745) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[8\] **When Entity Is Removed/Destroyed** (72) @(-788,-424)<br>
'*Structs*'/\[8\] **When Entity Is Removed/Destroyed** (72) `out.flow#0` -\> \[2\] **Modify Structure** (1610612747) `in.flow#0`<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) user=STRUCT\_MODIFY struct='`Structure_1`' @(150.14285,-270.42856)<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) `in#2` "是否设置\_Add variable 1" \<- \[14\] **Split Structure** (1610612755) `out#0` "Add variable 1" : *L\<Str\>*<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) `in#3` "Add variable 2" = Yes : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) `in#5` "Add variable 3" = No : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) `in#6` "是否设置\_Add variable 3" \<- \[4\] **Assemble Structure** (1610612745) `out#0` "Structure" : *Struct*<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) `in#7` "Add variable 4" = Yes : *Bol*<br>
'*Structs*'/\[10\] **Modify Structure** (1610612756) `in#9` "是否设置\_Add variable 4" = No : *Bol*<br>
'*Structs*'/\[13\] **Assemble Structure** (1610612754) user=STRUCT\_ASSEMBLY struct='`Structure_1`' @(-790.7857,146.71428)<br>
'*Structs*'/\[13\] **Assemble Structure** (1610612754) `in#1` "Add variable 2" = 8 : *Int*<br>
'*Structs*'/\[14\] **Split Structure** (1610612755) user=STRUCT\_SPLIT struct='`Structure_1`' @(-313.2143,141)<br>
'*Structs*'/\[14\] **Split Structure** (1610612755) `in#0` "Structure\_1" \<- \[13\] **Assemble Structure** (1610612754) `out#0` "Structure\_1" : *Struct*

# FILE `test/cases/gia/sample_4.gia`

**GRAPH** '*Lists*' ENTITY\_NODE\_GRAPH (guid 1073741830)<br>
'*Lists*'/\[1\] **Clear List** (107/111) variant=C\<T:Flt\> @(-446,-210)<br>
'*Lists*'/\[1\] **Clear List** (107/111) `out.flow#0` -\> \[3\] **Concatenate List** (100/101) `in.flow#0`<br>
'*Lists*'/\[1\] **Clear List** (107/111) `in#0` "List" \<- \[2\] **Assembly List** (169/173) `out#0` "List" : *L\<Flt\>*<br>
'*Lists*'/\[2\] **Assembly List** (169/173) variant=C\<T:Flt\> @(-992,-180)<br>
'*Lists*'/\[3\] **Concatenate List** (100/101) variant=C\<T:Str\> @(-101,51)<br>
'*Lists*'/\[3\] **Concatenate List** (100/101) `out.flow#0` -\> \[5\] **Clear Dictionary** (1718/1777) `in.flow#0`<br>
'*Lists*'/\[3\] **Concatenate List** (100/101) `in#0` "Target List" \<- \[4\] **Assembly List** (169/170) `out#0` "List" : *L\<Str\>*<br>
'*Lists*'/\[3\] **Concatenate List** (100/101) `in#1` "Input List" \<- \[7\] **Get List of Values From Dictionary** (1578/1583) `out#0` "Value List" : *L\<Str\>*<br>
'*Lists*'/\[4\] **Assembly List** (169/170) variant=C\<T:Str\> @(-534,92)<br>
'*Lists*'/\[4\] **Assembly List** (169/170) `in#0` "Count" = 2 : *Int*<br>
'*Lists*'/\[4\] **Assembly List** (169/170) `in#1` "0" = '`2`' : *Str*<br>
'*Lists*'/\[4\] **Assembly List** (169/170) `in#2` "1" = '`3`' : *Str*<br>
'*Lists*'/\[5\] **Clear Dictionary** (1718/1777) variant=C\<K:Cfg,V:Pfb\> @(398,324.7143)<br>
'*Lists*'/\[5\] **Clear Dictionary** (1718/1777) `out.flow#0` -\> \[13\] **Insert Value Into List** (135/139) `in.flow#0`<br>
'*Lists*'/\[5\] **Clear Dictionary** (1718/1777) `in#0` "Dictionary" \<- \[6\] **Assembly Dictionary** (1788/1897) `out#0` "Dictionary" : *Dict*<br>
'*Lists*'/\[6\] **Assembly Dictionary** (1788/1897) variant=C\<K:Cfg,V:Pfb\> @(-142.85715,350.7143)<br>
'*Lists*'/\[6\] **Assembly Dictionary** (1788/1897) `in#0` "Count" = 2 : *Int*<br>
'*Lists*'/\[6\] **Assembly Dictionary** (1788/1897) `in#1` "Key 0" = id:10 : *Cfg*<br>
'*Lists*'/\[6\] **Assembly Dictionary** (1788/1897) `in#2` "Value 0" = id:20 : *Pfb*<br>
'*Lists*'/\[7\] **Get List of Values From Dictionary** (1578/1583) variant=C\<K:Ety,V:Str\> @(-660,426.42856)<br>
'*Lists*'/\[7\] **Get List of Values From Dictionary** (1578/1583) `in#0` "Dictionary" \<- \[8\] **Create Dictionary** (1088/1093) `out#0` "Dictionary" : *Dict*<br>
'*Lists*'/\[8\] **Create Dictionary** (1088/1093) variant=C\<K:Ety,V:Str\> @(-1057.1428,437.85715)<br>
'*Lists*'/\[9\] **3D Vector: Zero Vector** (192) @(-1138.8572,802.1429)<br>
'*Lists*'/\[10\] **Split 3D Vector** (9) @(-822.8571,808.1429)<br>
'*Lists*'/\[10\] **Split 3D Vector** (9) `in#0` "3D Vector" \<- \[9\] **3D Vector: Zero Vector** (192) `out#0` "(0, 0, 0)" : *Vec*<br>
'*Lists*'/\[11\] **Create 3D Vector** (225) @(-262.85715,806.7143)<br>
'*Lists*'/\[11\] **Create 3D Vector** (225) `in#0` "X-Component" \<- \[10\] **Split 3D Vector** (9) `out#0` "X-Component" : *Flt*<br>
'*Lists*'/\[11\] **Create 3D Vector** (225) `in#1` "Y-Component" = 44 : *Flt*<br>
'*Lists*'/\[11\] **Create 3D Vector** (225) `in#2` "Z-Component" = 55 : *Flt*<br>
'*Lists*'/\[12\] **3D Vector Dot Product** (505) @(292.85715,812.4286)<br>
'*Lists*'/\[12\] **3D Vector Dot Product** (505) `in#0` "3D Vector 1" \<- \[11\] **Create 3D Vector** (225) `out#0` "3D Vector" : *Vec*<br>
'*Lists*'/\[12\] **3D Vector Dot Product** (505) `in#1` "3D Vector 2" \<- \[11\] **Create 3D Vector** (225) `out#0` "3D Vector" : *Vec*<br>
'*Lists*'/\[13\] **Insert Value Into List** (135/139) variant=C\<T:Flt\> @(1020,322.14285)<br>
'*Lists*'/\[13\] **Insert Value Into List** (135/139) `in#0` "List" \<- \[2\] **Assembly List** (169/173) `out#0` "List" : *L\<Flt\>*<br>
'*Lists*'/\[13\] **Insert Value Into List** (135/139) `in#1` "Insert ID" = 0 : *Int*<br>
'*Lists*'/\[13\] **Insert Value Into List** (135/139) `in#2` "Insert Value" \<- \[12\] **3D Vector Dot Product** (505) `out#0` "Result" : *Flt*<br>
'*Lists*'/\[14\] **When Character Revives** (281) @(-900.8571,-418.7143)<br>
'*Lists*'/\[14\] **When Character Revives** (281) `out.flow#0` -\> \[1\] **Clear List** (107/111) `in.flow#0`

# FILE `test/cases/gia/sample_5.gia`

**GRAPH** '*Variables*' ENTITY\_NODE\_GRAPH (guid 1073741831)<br>
'*Variables*'/VAR **Variable\_1** : *Bol* public=false<br>
'*Variables*'/\[1\] **When Custom Variable Changes** (36) @(-420,-317)<br>
'*Variables*'/\[1\] **When Custom Variable Changes** (36) `out.flow#0` -\> \[6\] **Double Branch** (2) `in.flow#0`<br>
'*Variables*'/\[3\] **When Node Graph Variable Changes** (351/354) variant=C\<T:Bol\> @(-412,85)<br>
'*Variables*'/\[3\] **When Node Graph Variable Changes** (351/354) `out.flow#0` -\> \[4\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Variables*'/\[4\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(71.14286,82.42857)<br>
'*Variables*'/\[4\] **Multiple Branches** (3/4) `out.flow#0` "Default" -\> \[5\] **Set Node Graph Variable** (323/325) `in.flow#0`<br>
'*Variables*'/\[4\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[3\] **When Node Graph Variable Changes** (351/354) `out#2` "Variable Name" : *Str*<br>
'*Variables*'/\[5\] **Set Node Graph Variable** (323/325) variant=C\<T:Bol\> @(658,217)<br>
'*Variables*'/\[5\] **Set Node Graph Variable** (323/325) `in#0` "Variable Name" = '`Variable_1`' : *Str*<br>
'*Variables*'/\[5\] **Set Node Graph Variable** (323/325) `in#1` "Variable Value" \<- \[3\] **When Node Graph Variable Changes** (351/354) `out#4` "Post-Change Value" : *Bol*<br>
'*Variables*'/\[5\] **Set Node Graph Variable** (323/325) `in#2` "Trigger Event" = No : *Bol*<br>
'*Variables*'/\[6\] **Double Branch** (2) @(75.14286,-316.57144)<br>
'*Variables*'/\[6\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[8\] **Set Local Variable** (19/21) `in.flow#0`<br>
'*Variables*'/\[6\] **Double Branch** (2) `in#0` "Condition" \<- \[7\] **Get Node Graph Variable** (337/340) `out#0` "Variable Value" : *Bol*<br>
'*Variables*'/\[7\] **Get Node Graph Variable** (337/340) variant=C\<T:Bol\> @(99.42857,-539.4286)<br>
'*Variables*'/\[7\] **Get Node Graph Variable** (337/340) `in#0` "Variable Name" = '`Variable_1`' : *Str*<br>
'*Variables*'/\[8\] **Set Local Variable** (19/21) variant=C\<T:Int\> @(658,-313.7143)<br>
'*Variables*'/\[8\] **Set Local Variable** (19/21) `out.flow#0` -\> \[10\] **Set Custom Variable** (22) `in.flow#0`<br>
'*Variables*'/\[8\] **Set Local Variable** (19/21) `in#0` "Local Variable" \<- \[9\] **Get Local Variable** (18/20) `out#0` "Local Variable" : *Loc*<br>
'*Variables*'/\[8\] **Set Local Variable** (19/21) `in#1` "Value" \<- \[1\] **When Custom Variable Changes** (36) `out#4` "Post-Change Value" : *Int*<br>
'*Variables*'/\[9\] **Get Local Variable** (18/20) variant=C\<T:Int\> @(660.8571,-563.7143)<br>
'*Variables*'/\[9\] **Get Local Variable** (18/20) `in#0` "Initial Value" \<- \[11\] **Get Custom Variable** (50) `out#0` "Variable Value" : *Int*<br>
'*Variables*'/\[9\] **Get Local Variable** (18/20) `in#0` "Initial Value" = 42 : *Int* *(also wired)*<br>
'*Variables*'/\[10\] **Set Custom Variable** (22) @(1250.8572,-310.85715)<br>
'*Variables*'/\[10\] **Set Custom Variable** (22) `in#0` "Target Entity" \<- \[1\] **When Custom Variable Changes** (36) `out#0` "Event Source Entity" : *Ety*<br>
'*Variables*'/\[10\] **Set Custom Variable** (22) `in#1` "Variable Name" = '`Test`' : *Str*<br>
'*Variables*'/\[10\] **Set Custom Variable** (22) `in#2` "Variable Value" \<- \[9\] **Get Local Variable** (18/20) `out#1` "Value" : *Int*<br>
'*Variables*'/\[11\] **Get Custom Variable** (50) @(668.8571,-841.1429)<br>
'*Variables*'/\[11\] **Get Custom Variable** (50) `in#1` "Variable Name" = '`Test`' : *Str*

# FILE `test/cases/gia/sample_6.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741827)<br>
'*New Node Graph*'/\[1\] **When All Player's Characters Are Revived** (286) @(-446,-135)<br>
'*New Node Graph*'/\[1\] **When All Player's Characters Are Revived** (286) `out.flow#0` -\> \[2\] **Revive the active character** (803) `in.flow#0`<br>
'*New Node Graph*'/\[2\] **Revive the active character** (803) @(103,-135)<br>
'*New Node Graph*'/\[2\] **Revive the active character** (803) `in#0` "Player Entity" \<- \[1\] **When All Player's Characters Are Revived** (286) `out#0` "Player Entity" : *Ety*<br>
**GRAPH** '*New Node Graph\_1*' ITEM\_NODE\_GRAPH (guid 1073741828)<br>
'*New Node Graph\_1*'/\[1\] **When Floating Interaction Page is Triggered** (826) @(-343,-157)<br>
'*New Node Graph\_1*'/\[1\] **When Floating Interaction Page is Triggered** (826) `out.flow#0` -\> \[2\] **Teleport Player (Classic Mode)** (805) `in.flow#0`<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) @(208,-159)<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) `in#0` "Player Entity" \<- \[1\] **When Floating Interaction Page is Triggered** (826) `out#0` "Player Entity" : *Ety*<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) `in#1` "Target Location" = (1, 1, 1) : *Vec*<br>
'*New Node Graph\_1*'/\[2\] **Teleport Player (Classic Mode)** (805) `in#2` "Target Rotation" = (2, 2, 2) : *Vec*

# FILE `test/cases/gia/sample_7.gia`

**GRAPH** '<u>\<skill\></u>*New Character Skill Node Graph*' SKILL\_NODE\_GRAPH (guid 1082130433)<br>
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
**GRAPH** '<u>\<creation\></u>*New Creation Skill Node Graph*' CREATION\_SKILL\_GRAPH (guid 1082130434)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[2\] **Taunt Target** (200089/2000) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[2\] **Taunt Target** (200089/2000) @(385,-6)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[2\] **Taunt Target** (200089/2000) `in#0` "Taunter Entity" \<- \[4\] **Traverse Entity List** (200055/2000) `out#0` "Current Entity" : *Ety*<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[4\] **Traverse Entity List** (200055/2000) @(26,195)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Node Graph*' CREATION\_STATUS\_GRAPH (guid 1082130435)<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#0` "1" -\> \[2\] **Tactic: Ground Escape** (200138/4019) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[2\] **Tactic: Ground Escape** (200138/4019) @(431,-2)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130436)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/2<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) `out.flow#1` "2" -\> \[2\] **Multiple Branches** (200127) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Multiple Branches** (200127) @(445,39)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[2\] **Multiple Branches** (200127) `out.flow#0` "Default" -\> \[3\] **Switch to self execution status** (200128/4011) `in.flow#0`<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) @(883,144)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) `in#1` "Status Node Graph Configuration ID" = id:1082130435 : *Cfg*<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[3\] **Switch to self execution status** (200128/4011) `in#2` "Autonomous Logic Parameter ID" = 0 : *Int*<br>
**GRAPH** '<u>\<skill\></u>*New Character Control Skill Node Graph*' CHARACTER\_CONTROL\_SKILL\_GRAPH (guid 1082130437)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) `out.flow#0` -\> \[2\] **Complete Current Pre-Aim** (200288/2000) `in.flow#0`<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[2\] **Complete Current Pre-Aim** (200288/2000) @(347,-4)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' BOOLEAN\_FILTER\_GRAPH (guid 1082130438)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) `in#0` "Output Result (Boolean)" \<- \[2\] **Less Than** (200008/12) `out#0` "Result" : *Bol*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) variant=C\<T:Int\> @(-531,-5)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) `in#1` \<- \[3\] **Get List Length** (200018) `out#0` "Length" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[2\] **Less Than** (200008/12) `in#2` = 0 : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[3\] **Get List Length** (200018) @(-935,5)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_1*' INTEGER\_FILTER\_GRAPH (guid 1082130439)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) `in#0` "Output Result (Integer)" \<- \[2\] **Get Custom Variable** (200016/41) `out#0` "Variable Value" : *Int*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) variant=C\<T:Int\> @(-467,2)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) `in#0` "Target Entity" \<- \[3\] **Get Self Entity** (200033/1013) `out#0` "Self Entity" : *Ety*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[2\] **Get Custom Variable** (200016/41) `in#1` "Variable Name" = '`test`' : *Str*<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[3\] **Get Self Entity** (200033/1013) @(-413,-166)

# FILE `test/cases/gia/sample_8.gia`

**GRAPH** '*Graph*' ENTITY\_NODE\_GRAPH (guid 1073741832)<br>
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
'*Graph*'/\[8\] **Get Node Graph Variable** (337) `in#0` "Variable Name" = '`Graph_Var`' : *Str*

# FILE `test/cases/gia/sample_9.gia`

**DECL** "**Signal\_1**" SIGNAL\_NODE\_DECL guid='`1610612781`'<br>
DECL/**Signal\_1** SEND\_SIGNAL name='`Signal_1`' server\_node=1610612782 client\_node=1610612783<br>
DECL/**Signal\_1** `in.flow#0` uid=178<br>
DECL/**Signal\_1** `out.flow#0` uid=179<br>
DECL/**Signal\_1** `meta#0` "Signal Name" uid=180<br>
**STRUCT** "**Structure**" guid='`1077936129`' id=1077936129 version=2<br>
**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
**GRAPH** '<u>\<status\></u>*New Node Graph\_1*' STATUS\_NODE\_GRAPH (guid 1073741826)<br>
**GRAPH** '<u>\<class\></u>*New Node Graph\_2*' CLASS\_NODE\_GRAPH (guid 1073741827)<br>
**GRAPH** '*New Node Graph\_3*' ITEM\_NODE\_GRAPH (guid 1073741828)<br>
**GRAPH** '<u>\<skill\></u>*New Character Skill Node Graph*' SKILL\_NODE\_GRAPH (guid 1082130433)<br>
'<u>\<skill\></u>*New Character Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Skill Node Graph*' CREATION\_SKILL\_GRAPH (guid 1082130434)<br>
'<u>\<creation\></u>*New Creation Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Node Graph*' CREATION\_STATUS\_GRAPH (guid 1082130435)<br>
'<u>\<creation\></u>*New Creation Status Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
**GRAPH** '<u>\<creation\></u>*New Creation Status Decision Node Graph*' CREATION\_STATUS\_DECISION\_GRAPH (guid 1082130436)<br>
'<u>\<creation\></u>*New Creation Status Decision Node Graph*'/\[1\] **Execute only by sequence** (200126/4000) @(0,0) status\_ext=1/1<br>
**GRAPH** '<u>\<skill\></u>*New Character Control Skill Node Graph*' CHARACTER\_CONTROL\_SKILL\_GRAPH (guid 1082130437)<br>
'<u>\<skill\></u>*New Character Control Skill Node Graph*'/\[1\] **Node Graph Starts** (200042/2001) @(0,0)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph*' BOOLEAN\_FILTER\_GRAPH (guid 1082130438)<br>
'<u>\<filter\></u>*New Filter Node Graph*'/\[1\] **Node Graph End (Boolean)** (200000) @(0,0)<br>
**GRAPH** '<u>\<filter\></u>*New Filter Node Graph\_1*' INTEGER\_FILTER\_GRAPH (guid 1082130439)<br>
'<u>\<filter\></u>*New Filter Node Graph\_1*'/\[1\] **Node Graph End (Integer)** (200122) @(0,0)
