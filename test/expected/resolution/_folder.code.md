# FILE `test/cases/resolution/test_All_Static.gia`

**DECL** "**Static\_1**" SIGNAL\_NODE\_DECL guid='`1610612737`' role=dependency<br>
DECL/**Static\_1** SEND\_SIGNAL name='`Static_1`' server\_node=1610612738 client\_node=1610612739<br>
DECL/**Static\_1** `in.flow#0` uid=1<br>
DECL/**Static\_1** `out.flow#0` uid=2<br>
DECL/**Static\_1** `meta#0` "Signal Name" uid=3<br>
**DECL** "**Static\_2**" SIGNAL\_NODE\_DECL guid='`1610612741`' role=dependency<br>
DECL/**Static\_2** SEND\_SIGNAL name='`Static_2`' server\_node=1610612742 client\_node=1610612743<br>
DECL/**Static\_2** `in.flow#0` uid=17<br>
DECL/**Static\_2** `out.flow#0` uid=18<br>
DECL/**Static\_2** `meta#0` "Signal Name" uid=19<br>
**GRAPH** '*All\_Static*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*All\_Static*'/VAR **Static\_Graph** : *L\<Gid\>* public=false<br>
'*All\_Static*'/\[1\] **When Custom Variable Changes** (36/40) variant=C\<T:Flt\> @(-335,-156)<br>
'*All\_Static*'/\[1\] **When Custom Variable Changes** (36/40) `out.flow#0` -\> \[2\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*All\_Static*'/\[2\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(117,-156)<br>
'*All\_Static*'/\[2\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Var" -\> \[37\] **Set Custom Variable** (22/26) `in.flow#0`<br>
'*All\_Static*'/\[2\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[1\] **When Custom Variable Changes** (36/40) `out#2` "Variable Name" : *Str*<br>
'*All\_Static*'/\[4\] **When Node Graph Variable Changes** (351/357) variant=C\<T:L\<Gid\>\> @(-361.8095,352.38095)<br>
'*All\_Static*'/\[4\] **When Node Graph Variable Changes** (351/357) `out.flow#0` -\> \[7\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*All\_Static*'/\[6\] **When Timer Is Triggered** (83) @(-311.2381,-664.2857)<br>
'*All\_Static*'/\[6\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[10\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*All\_Static*'/\[7\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(127.690475,351.83334)<br>
'*All\_Static*'/\[7\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Graph" -\> \[41\] **Set Node Graph Variable** (323) `in.flow#0`<br>
'*All\_Static*'/\[7\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[4\] **When Node Graph Variable Changes** (351/357) `out#2` "Variable Name" : *Str*<br>
'*All\_Static*'/\[10\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(131.0238,-663.1667)<br>
'*All\_Static*'/\[10\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Timer" -\> \[34\] **Start Timer** (79) `in.flow#0`<br>
'*All\_Static*'/\[10\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[6\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'*All\_Static*'/\[11\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(145.46825,-1135.3889)<br>
'*All\_Static*'/\[11\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Global" -\> \[31\] **Start Global Timer** (311) `in.flow#0`<br>
'*All\_Static*'/\[11\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[14\] **When Global Timer Is Triggered** (315) `out#2` "Timer Name" : *Str*<br>
'*All\_Static*'/\[14\] **When Global Timer Is Triggered** (315) @(-349.57144,-1134.2858)<br>
'*All\_Static*'/\[14\] **When Global Timer Is Triggered** (315) `out.flow#0` -\> \[11\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*All\_Static*'/\[27\] **Monitor Signal** (1610612738) user=LISTEN\_SIGNAL signal='`Static_1`' @(-331.2381,827.381) sigver=2<br>
'*All\_Static*'/\[27\] **Monitor Signal** (1610612738) `out.flow#0` -\> \[29\] **Send Signal** (1610612741) `in.flow#0`<br>
'*All\_Static*'/\[27\] **Monitor Signal** (1610612738) `meta.rpc#0` "Signal Name" = '`Static_1`'<br>
'*All\_Static*'/\[28\] **Monitor Signal** (1610612742) user=LISTEN\_SIGNAL signal='`Static_2`' @(-317.90475,1112.381) sigver=2<br>
'*All\_Static*'/\[28\] **Monitor Signal** (1610612742) `out.flow#0` -\> \[30\] **Send Signal** (1610612737) `in.flow#0`<br>
'*All\_Static*'/\[28\] **Monitor Signal** (1610612742) `meta.rpc#0` "Signal Name" = '`Static_2`'<br>
'*All\_Static*'/\[29\] **Send Signal** (1610612741) user=SEND\_SIGNAL signal='`Static_2`' @(161.2619,822.7976) sigver=2<br>
'*All\_Static*'/\[29\] **Send Signal** (1610612741) `meta.rpc#0` "Signal Name" = '`Static_2`'<br>
'*All\_Static*'/\[30\] **Send Signal** (1610612737) user=SEND\_SIGNAL signal='`Static_1`' @(173.7619,1110.2976) sigver=2<br>
'*All\_Static*'/\[30\] **Send Signal** (1610612737) `meta.rpc#0` "Signal Name" = '`Static_1`'<br>
'*All\_Static*'/\[31\] **Start Global Timer** (311) @(724.48413,-957.6746)<br>
'*All\_Static*'/\[31\] **Start Global Timer** (311) `out.flow#0` -\> \[32\] **Stop Global Timer** (313) `in.flow#0`<br>
'*All\_Static*'/\[31\] **Start Global Timer** (311) `in#0` "Target Entity" \<- \[14\] **When Global Timer Is Triggered** (315) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[31\] **Start Global Timer** (311) `in#1` "Timer Name" = '`Static_Global`' : *Str*<br>
'*All\_Static*'/\[32\] **Stop Global Timer** (313) @(1300.5952,-955.59125)<br>
'*All\_Static*'/\[32\] **Stop Global Timer** (313) `in#0` "Target Entity" \<- \[14\] **When Global Timer Is Triggered** (315) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[32\] **Stop Global Timer** (313) `in#1` "Timer Name" \<- \[33\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*All\_Static*'/\[33\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1335.5952,-1168.0913)<br>
'*All\_Static*'/\[33\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Global`' : *Str*<br>
'*All\_Static*'/\[34\] **Start Timer** (79) @(622.4008,-488.64682)<br>
'*All\_Static*'/\[34\] **Start Timer** (79) `out.flow#0` -\> \[35\] **Stop Timer** (82) `in.flow#0`<br>
'*All\_Static*'/\[34\] **Start Timer** (79) `in#0` "Target Entity" \<- \[6\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[34\] **Start Timer** (79) `in#1` "Timer Name" = '`Static_Timer`' : *Str*<br>
'*All\_Static*'/\[34\] **Start Timer** (79) `in#2` "Loop" = No : *Bol*<br>
'*All\_Static*'/\[35\] **Stop Timer** (82) @(1113.0952,-488.09128)<br>
'*All\_Static*'/\[35\] **Stop Timer** (82) `in#0` "Target Entity" \<- \[6\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[35\] **Stop Timer** (82) `in#1` "Timer Name" \<- \[36\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*All\_Static*'/\[36\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1130.7738,-650.76984)<br>
'*All\_Static*'/\[36\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Timer`' : *Str*<br>
'*All\_Static*'/\[37\] **Set Custom Variable** (22/26) variant=C\<T:Flt\> @(687.2024,21.015873)<br>
'*All\_Static*'/\[37\] **Set Custom Variable** (22/26) `out.flow#0` -\> \[38\] **Set Custom Variable** (22/26) `in.flow#0`<br>
'*All\_Static*'/\[37\] **Set Custom Variable** (22/26) `in#0` "Target Entity" \<- \[1\] **When Custom Variable Changes** (36/40) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[37\] **Set Custom Variable** (22/26) `in#1` "Variable Name" = '`Static_Var`' : *Str*<br>
'*All\_Static*'/\[37\] **Set Custom Variable** (22/26) `in#2` "Variable Value" = 0 : *Flt*<br>
'*All\_Static*'/\[38\] **Set Custom Variable** (22/26) variant=C\<T:Flt\> @(1238.631,19.587301)<br>
'*All\_Static*'/\[38\] **Set Custom Variable** (22/26) `in#0` "Target Entity" \<- \[1\] **When Custom Variable Changes** (36/40) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[38\] **Set Custom Variable** (22/26) `in#1` "Variable Name" \<- \[39\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*All\_Static*'/\[38\] **Set Custom Variable** (22/26) `in#1` "Variable Name" = '`Static_Var`' : *Str* *(also wired)*<br>
'*All\_Static*'/\[38\] **Set Custom Variable** (22/26) `in#2` "Variable Value" \<- \[40\] **Get Custom Variable** (50/54) `out#0` "Variable Value" : *Flt*<br>
'*All\_Static*'/\[38\] **Set Custom Variable** (22/26) `in#4` "Trigger Event" = No : *Bol*<br>
'*All\_Static*'/\[39\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1241.488,-193.26984)<br>
'*All\_Static*'/\[39\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Var`' : *Str*<br>
'*All\_Static*'/\[40\] **Get Custom Variable** (50/54) variant=C\<T:Flt\> @(1822.9166,-171.84126)<br>
'*All\_Static*'/\[40\] **Get Custom Variable** (50/54) `in#0` "Target Entity" \<- \[1\] **When Custom Variable Changes** (36/40) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Static*'/\[40\] **Get Custom Variable** (50/54) `in#1` "Variable Name" \<- \[39\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*All\_Static*'/\[40\] **Get Custom Variable** (50/54) `in#1` "Variable Name" = '`Static_Var`' : *Str* *(also wired)*<br>
'*All\_Static*'/\[41\] **Set Node Graph Variable** (323) @(716.1427,526.788)<br>
'*All\_Static*'/\[41\] **Set Node Graph Variable** (323) `out.flow#0` -\> \[42\] **Set Node Graph Variable** (323/329) `in.flow#0`<br>
'*All\_Static*'/\[41\] **Set Node Graph Variable** (323) `in#0` "Variable Name" = '`Static_Graph`' : *Str*<br>
'*All\_Static*'/\[42\] **Set Node Graph Variable** (323/329) variant=C\<T:L\<Gid\>\> @(1157.5713,529.64514)<br>
'*All\_Static*'/\[42\] **Set Node Graph Variable** (323/329) `in#0` "Variable Name" \<- \[43\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*All\_Static*'/\[42\] **Set Node Graph Variable** (323/329) `in#1` "Variable Value" \<- \[44\] **Get Node Graph Variable** (337/343) `out#0` "Variable Value" : *L\<Gid\>*<br>
'*All\_Static*'/\[42\] **Set Node Graph Variable** (323/329) `in#2` "Trigger Event" = No : *Bol*<br>
'*All\_Static*'/\[43\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1173.4641,895.1809)<br>
'*All\_Static*'/\[43\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Graph`' : *Str*<br>
'*All\_Static*'/\[44\] **Get Node Graph Variable** (337/343) variant=C\<T:L\<Gid\>\> @(1635.1427,538.5499)<br>
'*All\_Static*'/\[44\] **Get Node Graph Variable** (337/343) `in#0` "Variable Name" \<- \[43\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*All\_Static*'/\[44\] **Get Node Graph Variable** (337/343) `in#0` "Variable Name" = '`Static_Graph`' : *Str* *(also wired)*

# FILE `test/cases/resolution/test_resolution.gia`

**GRAPH** '*Dynamic*' ENTITY\_NODE\_GRAPH (guid 1073741826)<br>
'*Dynamic*'/VAR **name** : *Str* public=false = '`gvar3`'<br>
'*Dynamic*'/\[1\] **When Custom Variable Changes** (36) @(-527,-416)<br>
'*Dynamic*'/\[1\] **When Custom Variable Changes** (36) `out.flow#0` -\> \[5\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Dynamic*'/\[2\] **When Node Graph Variable Changes** (351/356) variant=C\<T:Str\> @(-540,117)<br>
'*Dynamic*'/\[2\] **When Node Graph Variable Changes** (351/356) `out.flow#0` -\> \[8\] **Double Branch** (2) `in.flow#0`<br>
'*Dynamic*'/\[3\] **When Timer Is Triggered** (83) @(1586,-498)<br>
'*Dynamic*'/\[3\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[19\] **Double Branch** (2) `in.flow#0`<br>
'*Dynamic*'/\[4\] **When Global Timer Is Triggered** (315) @(1037.3334,-25.666666)<br>
'*Dynamic*'/\[4\] **When Global Timer Is Triggered** (315) `out.flow#0` -\> \[22\] **Settle Stage** (77) `in.flow#0`<br>
'*Dynamic*'/\[5\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(-44,-414)<br>
'*Dynamic*'/\[5\] **Multiple Branches** (3/4) `out.flow#0` "Default" -\> \[7\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Dynamic*'/\[5\] **Multiple Branches** (3/4) `out.flow#2` "var2" -\> \[6\] **Settle Stage** (77) `in.flow#0`<br>
'*Dynamic*'/\[5\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[1\] **When Custom Variable Changes** (36) `out#2` "Variable Name" : *Str*<br>
'*Dynamic*'/\[6\] **Settle Stage** (77) @(508,-198)<br>
'*Dynamic*'/\[7\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(756,-530)<br>
'*Dynamic*'/\[7\] **Multiple Branches** (3/4) `out.flow#0` "Default" -\> \[21\] **Settle Stage** (77) `in.flow#0`<br>
'*Dynamic*'/\[7\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[1\] **When Custom Variable Changes** (36) `out#2` "Variable Name" : *Str*<br>
'*Dynamic*'/\[8\] **Double Branch** (2) @(0,112)<br>
'*Dynamic*'/\[8\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[10\] **Settle Stage** (77) `in.flow#0`<br>
'*Dynamic*'/\[8\] **Double Branch** (2) `out.flow#1` "No" -\> \[11\] **Double Branch** (2) `in.flow#0`<br>
'*Dynamic*'/\[8\] **Double Branch** (2) `in#0` "Condition" \<- \[9\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Dynamic*'/\[9\] **Equal** (14) @(-78,446)<br>
'*Dynamic*'/\[9\] **Equal** (14) `in#0` "Input 1" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Dynamic*'/\[9\] **Equal** (14) `in#1` "Input 2" = '`gvar1`' : *Str*<br>
'*Dynamic*'/\[10\] **Settle Stage** (77) @(402,32)<br>
'*Dynamic*'/\[11\] **Double Branch** (2) @(646,258)<br>
'*Dynamic*'/\[11\] **Double Branch** (2) `out.flow#1` "No" -\> \[14\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Dynamic*'/\[11\] **Double Branch** (2) `in#0` "Condition" \<- \[12\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Dynamic*'/\[12\] **Equal** (14) @(658,544)<br>
'*Dynamic*'/\[12\] **Equal** (14) `in#0` "Input 1" \<- \[13\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Dynamic*'/\[12\] **Equal** (14) `in#1` "Input 2" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#4` "Post-Change Value" : *Str*<br>
'*Dynamic*'/\[13\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(222,756)<br>
'*Dynamic*'/\[13\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`gvar1`' : *Str*<br>
'*Dynamic*'/\[14\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(1414,504)<br>
'*Dynamic*'/\[14\] **Multiple Branches** (3/4) `out.flow#0` "Default" -\> \[15\] **Double Branch** (2) `in.flow#0`<br>
'*Dynamic*'/\[14\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Dynamic*'/\[15\] **Double Branch** (2) @(2096,540)<br>
'*Dynamic*'/\[15\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[28\] **Settle Stage** (77) `in.flow#0`<br>
'*Dynamic*'/\[15\] **Double Branch** (2) `out.flow#1` "No" -\> \[29\] **Double Branch** (2) `in.flow#0`<br>
'*Dynamic*'/\[15\] **Double Branch** (2) `in#0` "Condition" \<- \[16\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Dynamic*'/\[16\] **Equal** (14) @(2128,842)<br>
'*Dynamic*'/\[16\] **Equal** (14) `in#0` "Input 1" \<- \[17\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Dynamic*'/\[16\] **Equal** (14) `in#1` "Input 2" \<- \[18\] **Get Node Graph Variable** (337/342) `out#0` "Variable Value" : *Str*<br>
'*Dynamic*'/\[17\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1159.5,865)<br>
'*Dynamic*'/\[17\] **Get Local Variable** (18/2656) `in#0` "Initial Value" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Dynamic*'/\[18\] **Get Node Graph Variable** (337/342) variant=C\<T:Str\> @(1659.5,1100)<br>
'*Dynamic*'/\[18\] **Get Node Graph Variable** (337/342) `in#0` "Variable Name" = '`name`' : *Str*<br>
'*Dynamic*'/\[19\] **Double Branch** (2) @(2022.5,-473)<br>
'*Dynamic*'/\[19\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[26\] **Settle Stage** (77) `in.flow#0`<br>
'*Dynamic*'/\[19\] **Double Branch** (2) `in#0` "Condition" \<- \[20\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Dynamic*'/\[20\] **Equal** (14) @(2310.8333,-266.33334)<br>
'*Dynamic*'/\[20\] **Equal** (14) `in#0` "Input 1" \<- \[24\] **Create Composite Node** (1610612737) `out#0` "y" : *Str*<br>
'*Dynamic*'/\[20\] **Equal** (14) `in#1` "Input 2" \<- \[3\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'*Dynamic*'/\[21\] **Settle Stage** (77) @(1272.6666,-391.66666)<br>
'*Dynamic*'/\[22\] **Settle Stage** (77) @(1432.6666,170)<br>
'*Dynamic*'/\[23\] **Get Custom Variable** (50/51) variant=C\<T:Str\> @(1541,-91.666664)<br>
'*Dynamic*'/\[23\] **Get Custom Variable** (50/51) `in#0` "Target Entity" \<- \[3\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity" : *Ety*<br>
'*Dynamic*'/\[23\] **Get Custom Variable** (50/51) `in#1` "Variable Name" = '`test`' : *Str*<br>
'*Dynamic*'/\[24\] **Create Composite Node** (1610612737) user=COMPOSITE @(2110.8333,37)<br>
'*Dynamic*'/\[24\] **Create Composite Node** (1610612737) `in#0` "x" \<- \[23\] **Get Custom Variable** (50/51) `out#0` "Variable Value" : *Str*<br>
'*Dynamic*'/\[26\] **Settle Stage** (77) @(2460.8333,-588)<br>
'*Dynamic*'/\[28\] **Settle Stage** (77) @(2457.5,378.66666)<br>
'*Dynamic*'/\[29\] **Double Branch** (2) @(2860.8333,622)<br>
'*Dynamic*'/\[29\] **Double Branch** (2) `in#0` "Condition" \<- \[30\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Dynamic*'/\[30\] **Equal** (14) @(3040.8333,1015.3333)<br>
'*Dynamic*'/\[30\] **Equal** (14) `in#0` "Input 1" \<- \[31\] **Create Composite Node** (1610612737) `out#0` "y" : *Str*<br>
'*Dynamic*'/\[30\] **Equal** (14) `in#1` "Input 2" \<- \[17\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Dynamic*'/\[31\] **Create Composite Node** (1610612737) user=COMPOSITE @(2820.8333,1435.3334)<br>
'*Dynamic*'/\[31\] **Create Composite Node** (1610612737) `in#0` "x" \<- \[35\] **Create Composite Node(1)** (1610612738) `out#0` "yy" : *Str*<br>
'*Dynamic*'/\[35\] **Create Composite Node(1)** (1610612738) user=COMPOSITE @(2337.5,1442)<br>
'*Dynamic*'/\[35\] **Create Composite Node(1)** (1610612738) `in#0` "yy" = '`gvar4`' : *Str*<br>
**GRAPH** '*Indirect*' ENTITY\_NODE\_GRAPH (guid 1073741827)<br>
'*Indirect*'/VAR **test2** : *Str* public=false = '`test4`'<br>
'*Indirect*'/\[1\] **Get Custom Variable** (50) @(-14,-200)<br>
'*Indirect*'/\[1\] **Get Custom Variable** (50) `in#0` "Target Entity" \<- \[10\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Indirect*'/\[1\] **Get Custom Variable** (50) `in#1` "Variable Name" \<- \[2\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Indirect*'/\[2\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(-442,-186)<br>
'*Indirect*'/\[2\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`test1`' : *Str*<br>
'*Indirect*'/\[3\] **Get Node Graph Variable** (337) @(8,39)<br>
'*Indirect*'/\[3\] **Get Node Graph Variable** (337) `in#0` "Variable Name" \<- \[4\] **Create Composite Node** (1610612737) `out#0` "y" : *Str*<br>
'*Indirect*'/\[4\] **Create Composite Node** (1610612737) user=COMPOSITE @(-317,36)<br>
'*Indirect*'/\[4\] **Create Composite Node** (1610612737) `in#0` "x" = '`test2`' : *Str*<br>
'*Indirect*'/\[5\] **Get Current Global Timer Time** (310) @(555,89)<br>
'*Indirect*'/\[5\] **Get Current Global Timer Time** (310) `in#0` "Target Entity" \<- \[10\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Indirect*'/\[5\] **Get Current Global Timer Time** (310) `in#1` "Timer Name" \<- \[6\] **Create Composite Node(1)** (1610612738) `out#0` "yy" : *Str*<br>
'*Indirect*'/\[6\] **Create Composite Node(1)** (1610612738) user=COMPOSITE @(190,219)<br>
'*Indirect*'/\[6\] **Create Composite Node(1)** (1610612738) `in#0` "yy" \<- \[7\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Indirect*'/\[7\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(-211.25,207)<br>
'*Indirect*'/\[7\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`test3`' : *Str*<br>
'*Indirect*'/\[9\] **Stop Timer** (82) @(812.5,347)<br>
'*Indirect*'/\[9\] **Stop Timer** (82) `in#0` "Target Entity" \<- \[10\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'*Indirect*'/\[9\] **Stop Timer** (82) `in#1` "Timer Name" \<- \[11\] **Get Node Graph Variable** (337/342) `out#0` "Variable Value" : *Str*<br>
'*Indirect*'/\[10\] **Get Self Entity** (73) @(1022.5,-0.5)<br>
'*Indirect*'/\[11\] **Get Node Graph Variable** (337/342) variant=C\<T:Str\> @(391.25,449.5)<br>
'*Indirect*'/\[11\] **Get Node Graph Variable** (337/342) `in#0` "Variable Name" = '`test2`' : *Str*<br>
**GRAPH** '*Static*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Static*'/VAR **name** : *Str* public=false = '`gvar3`'<br>
'*Static*'/\[1\] **When Custom Variable Changes** (36) @(-527,-416)<br>
'*Static*'/\[1\] **When Custom Variable Changes** (36) `out.flow#0` -\> \[5\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Static*'/\[2\] **When Node Graph Variable Changes** (351/356) variant=C\<T:Str\> @(-540,117)<br>
'*Static*'/\[2\] **When Node Graph Variable Changes** (351/356) `out.flow#0` -\> \[8\] **Double Branch** (2) `in.flow#0`<br>
'*Static*'/\[3\] **When Timer Is Triggered** (83) @(1586,-498)<br>
'*Static*'/\[3\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[19\] **Double Branch** (2) `in.flow#0`<br>
'*Static*'/\[4\] **When Global Timer Is Triggered** (315) @(1037.3334,-25.666666)<br>
'*Static*'/\[5\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(-44,-414)<br>
'*Static*'/\[5\] **Multiple Branches** (3/4) `out.flow#0` "Default" -\> \[7\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Static*'/\[5\] **Multiple Branches** (3/4) `out.flow#2` "var2" -\> \[6\] **Settle Stage** (77) `in.flow#0`<br>
'*Static*'/\[5\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[1\] **When Custom Variable Changes** (36) `out#2` "Variable Name" : *Str*<br>
'*Static*'/\[6\] **Settle Stage** (77) @(508,-198)<br>
'*Static*'/\[7\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(756,-530)<br>
'*Static*'/\[7\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[1\] **When Custom Variable Changes** (36) `out#2` "Variable Name" : *Str*<br>
'*Static*'/\[8\] **Double Branch** (2) @(0,112)<br>
'*Static*'/\[8\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[10\] **Settle Stage** (77) `in.flow#0`<br>
'*Static*'/\[8\] **Double Branch** (2) `out.flow#1` "No" -\> \[11\] **Double Branch** (2) `in.flow#0`<br>
'*Static*'/\[8\] **Double Branch** (2) `in#0` "Condition" \<- \[9\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Static*'/\[9\] **Equal** (14) @(-78,446)<br>
'*Static*'/\[9\] **Equal** (14) `in#0` "Input 1" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Static*'/\[9\] **Equal** (14) `in#1` "Input 2" = '`gvar1`' : *Str*<br>
'*Static*'/\[10\] **Settle Stage** (77) @(402,32)<br>
'*Static*'/\[11\] **Double Branch** (2) @(646,258)<br>
'*Static*'/\[11\] **Double Branch** (2) `out.flow#1` "No" -\> \[14\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*Static*'/\[11\] **Double Branch** (2) `in#0` "Condition" \<- \[12\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Static*'/\[12\] **Equal** (14) @(658,544)<br>
'*Static*'/\[12\] **Equal** (14) `in#0` "Input 1" \<- \[13\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Static*'/\[12\] **Equal** (14) `in#1` "Input 2" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Static*'/\[13\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(222,756)<br>
'*Static*'/\[13\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`gvar1`' : *Str*<br>
'*Static*'/\[14\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(1414,504)<br>
'*Static*'/\[14\] **Multiple Branches** (3/4) `out.flow#0` "Default" -\> \[15\] **Double Branch** (2) `in.flow#0`<br>
'*Static*'/\[14\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Static*'/\[15\] **Double Branch** (2) @(2096,540)<br>
'*Static*'/\[15\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[28\] **Settle Stage** (77) `in.flow#0`<br>
'*Static*'/\[15\] **Double Branch** (2) `out.flow#1` "No" -\> \[29\] **Double Branch** (2) `in.flow#0`<br>
'*Static*'/\[15\] **Double Branch** (2) `in#0` "Condition" \<- \[16\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Static*'/\[16\] **Equal** (14) @(2128,842)<br>
'*Static*'/\[16\] **Equal** (14) `in#0` "Input 1" \<- \[17\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Static*'/\[16\] **Equal** (14) `in#1` "Input 2" \<- \[18\] **Get Node Graph Variable** (337/342) `out#0` "Variable Value" : *Str*<br>
'*Static*'/\[17\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1159.5,865)<br>
'*Static*'/\[17\] **Get Local Variable** (18/2656) `in#0` "Initial Value" \<- \[2\] **When Node Graph Variable Changes** (351/356) `out#2` "Variable Name" : *Str*<br>
'*Static*'/\[18\] **Get Node Graph Variable** (337/342) variant=C\<T:Str\> @(1659.5,1100)<br>
'*Static*'/\[18\] **Get Node Graph Variable** (337/342) `in#0` "Variable Name" = '`name`' : *Str*<br>
'*Static*'/\[19\] **Double Branch** (2) @(2022.5,-473)<br>
'*Static*'/\[19\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[26\] **Settle Stage** (77) `in.flow#0`<br>
'*Static*'/\[19\] **Double Branch** (2) `in#0` "Condition" \<- \[20\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Static*'/\[20\] **Equal** (14) @(2310.8333,-266.33334)<br>
'*Static*'/\[20\] **Equal** (14) `in#0` "Input 1" \<- \[24\] **Create Composite Node** (1610612737) `out#0` "y" : *Str*<br>
'*Static*'/\[20\] **Equal** (14) `in#1` "Input 2" \<- \[3\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'*Static*'/\[24\] **Create Composite Node** (1610612737) user=COMPOSITE @(2110.8333,37)<br>
'*Static*'/\[24\] **Create Composite Node** (1610612737) `in#0` "x" \<- \[25\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Static*'/\[25\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1635.8334,27)<br>
'*Static*'/\[25\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`tm`' : *Str*<br>
'*Static*'/\[26\] **Settle Stage** (77) @(2460.8333,-588)<br>
'*Static*'/\[28\] **Settle Stage** (77) @(2457.5,378.66666)<br>
'*Static*'/\[29\] **Double Branch** (2) @(2860.8333,622)<br>
'*Static*'/\[29\] **Double Branch** (2) `in#0` "Condition" \<- \[30\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'*Static*'/\[30\] **Equal** (14) @(3040.8333,1015.3333)<br>
'*Static*'/\[30\] **Equal** (14) `in#0` "Input 1" \<- \[31\] **Create Composite Node** (1610612737) `out#0` "y" : *Str*<br>
'*Static*'/\[30\] **Equal** (14) `in#1` "Input 2" \<- \[17\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
'*Static*'/\[31\] **Create Composite Node** (1610612737) user=COMPOSITE @(2820.8333,1435.3334)<br>
'*Static*'/\[31\] **Create Composite Node** (1610612737) `in#0` "x" \<- \[35\] **Create Composite Node(1)** (1610612738) `out#0` "yy" : *Str*<br>
'*Static*'/\[35\] **Create Composite Node(1)** (1610612738) user=COMPOSITE @(2337.5,1442)<br>
'*Static*'/\[35\] **Create Composite Node(1)** (1610612738) `in#0` "yy" = '`gvar4`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1610612737, decl 1610612737) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.in#0` "x" -\> \[1\] **Get Local Variable** (18/2656) `in#0` "Initial Value"<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out#0` "y" -\> \[21\] **Get Local Variable** (18/2656) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(-27,-189)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[21\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(1,5)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[21\] **Get Local Variable** (18/2656) `in#0` "Initial Value" \<- \[1\] **Get Local Variable** (18/2656) `out#1` "Value" : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1610612738, decl 1610612738) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#0` "yy" -\> \[32\] **Create Composite Node** (1610612737) `in#0` "x"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out#0` "yy" -\> \[32\] **Create Composite Node** (1610612737) `out#0` "y"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[32\] **Create Composite Node** (1610612737) user=COMPOSITE @(0,0)
