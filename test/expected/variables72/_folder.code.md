# FILE `variables_beyond.gia`

# FILE `variables_classic.gil`

**STRUCT** "**Struct**" guid='`1077936129`' id=1077936129 version=2<br>
STRUCT/**Struct** FIELD#1 "**Add variable 1**" : *Str*<br>
STRUCT/**Struct** FIELD#2 "**Add variable 2**" : *Int*<br>
STRUCT/**Struct** FIELD#3 "**Add variable 3**" : *Flt*<br>
STRUCT/**Struct** FIELD#4 "**Add variable 4**" : *Bol*

# FILE `variables_graph.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*New Node Graph*'/VAR **String** : *Str* public=true = '`graph`'<br>
'*New Node Graph*'/VAR **Integer** : *Int* public=true = 0<br>
'*New Node Graph*'/VAR **Faction** : *Fct* public=true = id:1<br>
'*New Node Graph*'/VAR **Float** : *Flt* public=true = 2.00<br>
'*New Node Graph*'/VAR **Entity** : *Ety* public=true = null<br>
'*New Node Graph*'/VAR **Private** : *Bol* public=false = true<br>
**GRAPH** '*Test5*' ENTITY\_NODE\_GRAPH (guid 1073741826)<br>
'*Test5*'/VAR **Faction** : *Fct* public=true = null<br>
**GRAPH** '<u>\<status\></u>*Status*' STATUS\_NODE\_GRAPH (guid 1073741827)<br>
'<u>\<status\></u>*Status*'/VAR **Status** : *Dict* public=false = {'`Status`': '`Status`'}

# FILE `variables_ref.gil`

# FILE `variables_save.gil`

**STRUCT** "**Structure\_Normal\_1**" guid='`1077936129`' id=1077936129 version=10<br>
STRUCT/**Structure\_Normal\_1** FIELD#1 "**Add variable 1**" : *Struct* struct=Structure\_Normal\_2<br>
STRUCT/**Structure\_Normal\_1** FIELD#2 "**Add variable 2**" : *L\<Struct\>* struct=Structure\_Normal\_2<br>
**STRUCT** "**Structure\_Save\_1**" guid='`1077936130`' id=1077936130 version=8<br>
STRUCT/**Structure\_Save\_1** FIELD#1 "**Add variable 1**" : *Str*<br>
**STRUCT** "**Structure\_Save\_2**" guid='`1077936131`' id=1077936131 version=8<br>
STRUCT/**Structure\_Save\_2** FIELD#1 "**Add variable 1**" : *L\<Int\>*<br>
STRUCT/**Structure\_Save\_2** FIELD#2 "**Add variable 2**" : *L\<Int\>*<br>
**STRUCT** "**Structure\_Normal\_2**" guid='`1077936132`' id=1077936132 version=8<br>
STRUCT/**Structure\_Normal\_2** FIELD#1 "**test**" : *Str*<br>
**GRAPH** '*Player*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Player*'/AFFIL struct=1077936130 source\_guid=50<br>
'*Player*'/AFFIL struct=1077936130 source\_guid=142<br>
'*Player*'/\[1\] **Get Custom Variable** (50) @(-183.5,-84)<br>
'*Player*'/\[1\] **Get Custom Variable** (50) `in#0` "Target Entity" \<- \[2\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Player*'/\[1\] **Get Custom Variable** (50) `in#1` "Variable Name" = '`1_chip_1`' : *Str*<br>
'*Player*'/\[1\] **Get Custom Variable** (50) `out#0` "Variable Value" = \[\] : *L\<Struct\>*<br>
'*Player*'/\[2\] **Get Self Entity** (73) @(-71.5,-242)<br>
'*Player*'/\[3\] **Get List Length** (142) @(-173.5,207)<br>
'*Player*'/\[3\] **Get List Length** (142) `in#0` "List" \<- \[1\] **Get Custom Variable** (50) `out#0` "Variable Value" : *L\<Struct\>*<br>
'*Player*'/\[3\] **Get List Length** (142) `in#0` "List" = \[\] : *L\<Struct\>* *(also wired)*<br>
'*Player*'/\[4\] **Multiple Branches** (3) @(-125.5,419)<br>
'*Player*'/\[4\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[6\] **Addition** (200) `out#0` "Result" : *Int*<br>
'*Player*'/\[4\] **Multiple Branches** (3) `in#0` "Control Expression" = 0 : *Int* *(also wired)*<br>
'*Player*'/\[5\] **When Entity Is Created** (71) @(-508.5,418)<br>
'*Player*'/\[5\] **When Entity Is Created** (71) `out.flow#0` -\> \[4\] **Multiple Branches** (3) `in.flow#0`<br>
'*Player*'/\[6\] **Addition** (200) @(295.35715,450.92856)<br>
'*Player*'/\[6\] **Addition** (200) `in#0` \<- \[3\] **Get List Length** (142) `out#0` "Length" : *Int*<br>
'*Player*'/\[6\] **Addition** (200) `in#0` = 0 : *Int* *(also wired)*<br>
'*Player*'/\[6\] **Addition** (200) `in#1` \<- \[7\] **Get List Length** (142) `out#0` "Length" : *Int*<br>
'*Player*'/\[6\] **Addition** (200) `in#1` = 0 : *Int* *(also wired)*<br>
'*Player*'/\[6\] **Addition** (200) `out#0` "Result" = 0 : *Int*<br>
'*Player*'/\[7\] **Get List Length** (142) @(355.35715,193.09525)<br>
'*Player*'/\[7\] **Get List Length** (142) `in#0` "List" \<- \[8\] **Get Custom Variable** (50) `out#0` "Variable Value" : *L\<Struct\>*<br>
'*Player*'/\[7\] **Get List Length** (142) `in#0` "List" = \[\] : *L\<Struct\>* *(also wired)*<br>
'*Player*'/\[8\] **Get Custom Variable** (50) @(345.35715,-97.90476)<br>
'*Player*'/\[8\] **Get Custom Variable** (50) `in#0` "Target Entity" \<- \[2\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Player*'/\[8\] **Get Custom Variable** (50) `in#1` "Variable Name" = '`Norm1`' : *Str*<br>
'*Player*'/\[8\] **Get Custom Variable** (50) `out#0` "Variable Value" = \[\] : *L\<Struct\>*
