# FILE `test/cases/composites/test_All_Composite.gia`

**DECL** "**Static\_2**" SIGNAL\_NODE\_DECL guid='`1610612741`' role=dependency<br>
DECL/**Static\_2** SEND\_SIGNAL name='`Static_2`' server\_node=1610612742 client\_node=1610612743<br>
DECL/**Static\_2** `in.flow#0` uid=17<br>
DECL/**Static\_2** `out.flow#0` uid=18<br>
DECL/**Static\_2** `meta#0` "Signal Name" uid=19<br>
**DECL** "**Static\_1**" SIGNAL\_NODE\_DECL guid='`1610612737`' role=dependency<br>
DECL/**Static\_1** SEND\_SIGNAL name='`Static_1`' server\_node=1610612738 client\_node=1610612739<br>
DECL/**Static\_1** `in.flow#0` uid=1<br>
DECL/**Static\_1** `out.flow#0` uid=2<br>
DECL/**Static\_1** `meta#0` "Signal Name" uid=3<br>
**GRAPH** '*All\_Composite*' ENTITY\_NODE\_GRAPH (guid 1073741826)<br>
'*All\_Composite*'/VAR **Static\_Graph** : *L\<Gid\>* public=false<br>
'*All\_Composite*'/\[1\] **Create Composite Node** (1610612745) user=COMPOSITE @(-335,-156)<br>
'*All\_Composite*'/\[1\] **Create Composite Node** (1610612745) `out.flow#0` -\> \[2\] **Create Composite Node(1)** (1610612746) `in.flow#0`<br>
'*All\_Composite*'/\[2\] **Create Composite Node(1)** (1610612746) user=COMPOSITE @(117,-156)<br>
'*All\_Composite*'/\[2\] **Create Composite Node(1)** (1610612746) `out.flow#0` "1" -\> \[18\] **Create Composite Node(15)** (1610612760) `in.flow#0`<br>
'*All\_Composite*'/\[2\] **Create Composite Node(1)** (1610612746) `in#0` "Control Expression" \<- \[1\] **Create Composite Node** (1610612745) `out#1` "Variable Name" : *Str*<br>
'*All\_Composite*'/\[3\] **Create Composite Node(2)** (1610612747) user=COMPOSITE @(-311.2381,-664.2857)<br>
'*All\_Composite*'/\[3\] **Create Composite Node(2)** (1610612747) `out.flow#0` -\> \[5\] **Create Composite Node(3)** (1610612748) `in.flow#0`<br>
'*All\_Composite*'/\[5\] **Create Composite Node(3)** (1610612748) user=COMPOSITE @(131.0238,-663.1667)<br>
'*All\_Composite*'/\[5\] **Create Composite Node(3)** (1610612748) `out.flow#0` "1" -\> \[6\] **Create Composite Node(4)** (1610612749) `in.flow#0`<br>
'*All\_Composite*'/\[5\] **Create Composite Node(3)** (1610612748) `in#0` "Control Expression" \<- \[3\] **Create Composite Node(2)** (1610612747) `out#1` "Timer Name" : *Str*<br>
'*All\_Composite*'/\[6\] **Create Composite Node(4)** (1610612749) user=COMPOSITE @(622.4008,-488.64682)<br>
'*All\_Composite*'/\[6\] **Create Composite Node(4)** (1610612749) `out.flow#0` -\> \[14\] **Create Composite Node(11)** (1610612756) `in.flow#0`<br>
'*All\_Composite*'/\[6\] **Create Composite Node(4)** (1610612749) `in#0` "Target Entity" \<- \[3\] **Create Composite Node(2)** (1610612747) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[8\] **Create Composite Node(5)** (1610612750) user=COMPOSITE @(724.48413,-957.6746)<br>
'*All\_Composite*'/\[8\] **Create Composite Node(5)** (1610612750) `out.flow#0` -\> \[12\] **Create Composite Node(9)** (1610612754) `in.flow#0`<br>
'*All\_Composite*'/\[8\] **Create Composite Node(5)** (1610612750) `in#0` "Target Entity" \<- \[10\] **Create Composite Node(7)** (1610612752) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[9\] **Create Composite Node(6)** (1610612751) user=COMPOSITE @(145.46825,-1135.3889)<br>
'*All\_Composite*'/\[9\] **Create Composite Node(6)** (1610612751) `out.flow#0` "1" -\> \[8\] **Create Composite Node(5)** (1610612750) `in.flow#0`<br>
'*All\_Composite*'/\[9\] **Create Composite Node(6)** (1610612751) `in#0` "Control Expression" \<- \[10\] **Create Composite Node(7)** (1610612752) `out#1` "Timer Name" : *Str*<br>
'*All\_Composite*'/\[10\] **Create Composite Node(7)** (1610612752) user=COMPOSITE @(-349.57144,-1134.2858)<br>
'*All\_Composite*'/\[10\] **Create Composite Node(7)** (1610612752) `out.flow#0` -\> \[9\] **Create Composite Node(6)** (1610612751) `in.flow#0`<br>
'*All\_Composite*'/\[11\] **Create Composite Node(8)** (1610612753) user=COMPOSITE @(1335.5952,-1168.0913)<br>
'*All\_Composite*'/\[12\] **Create Composite Node(9)** (1610612754) user=COMPOSITE @(1300.5952,-955.59125)<br>
'*All\_Composite*'/\[12\] **Create Composite Node(9)** (1610612754) `in#0` "Timer Name" \<- \[11\] **Create Composite Node(8)** (1610612753) `out#0` "Value" : *Str*<br>
'*All\_Composite*'/\[12\] **Create Composite Node(9)** (1610612754) `in#1` "Target Entity" \<- \[10\] **Create Composite Node(7)** (1610612752) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[13\] **Create Composite Node(10)** (1610612755) user=COMPOSITE @(1130.7738,-650.76984)<br>
'*All\_Composite*'/\[14\] **Create Composite Node(11)** (1610612756) user=COMPOSITE @(1113.0952,-488.09128)<br>
'*All\_Composite*'/\[14\] **Create Composite Node(11)** (1610612756) `in#0` "Timer Name" \<- \[13\] **Create Composite Node(10)** (1610612755) `out#0` "Value" : *Str*<br>
'*All\_Composite*'/\[14\] **Create Composite Node(11)** (1610612756) `in#1` "Target Entity" \<- \[3\] **Create Composite Node(2)** (1610612747) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[15\] **Create Composite Node(12)** (1610612757) user=COMPOSITE @(1241.488,-193.26984)<br>
'*All\_Composite*'/\[16\] **Create Composite Node(13)** (1610612758) user=COMPOSITE @(1822.9166,-171.84126)<br>
'*All\_Composite*'/\[16\] **Create Composite Node(13)** (1610612758) `in#0` "Target Entity" \<- \[1\] **Create Composite Node** (1610612745) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[16\] **Create Composite Node(13)** (1610612758) `in#1` "Variable Name" \<- \[15\] **Create Composite Node(12)** (1610612757) `out#0` "Value" : *Str*<br>
'*All\_Composite*'/\[17\] **Create Composite Node(14)** (1610612759) user=COMPOSITE @(1238.631,19.587301)<br>
'*All\_Composite*'/\[17\] **Create Composite Node(14)** (1610612759) `in#0` "Variable Value" \<- \[16\] **Create Composite Node(13)** (1610612758) `out#0` "Variable Value" : *Flt*<br>
'*All\_Composite*'/\[17\] **Create Composite Node(14)** (1610612759) `in#1` "Variable Name" \<- \[15\] **Create Composite Node(12)** (1610612757) `out#0` "Value" : *Str*<br>
'*All\_Composite*'/\[17\] **Create Composite Node(14)** (1610612759) `in#2` "Target Entity" \<- \[1\] **Create Composite Node** (1610612745) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[18\] **Create Composite Node(15)** (1610612760) user=COMPOSITE @(687.2024,21.015873)<br>
'*All\_Composite*'/\[18\] **Create Composite Node(15)** (1610612760) `out.flow#0` -\> \[17\] **Create Composite Node(14)** (1610612759) `in.flow#0`<br>
'*All\_Composite*'/\[18\] **Create Composite Node(15)** (1610612760) `in#0` "Target Entity" \<- \[1\] **Create Composite Node** (1610612745) `out#0` "Event Source Entity" : *Ety*<br>
'*All\_Composite*'/\[19\] **Create Composite Node(16)** (1610612761) user=COMPOSITE @(-361.8095,352.38095)<br>
'*All\_Composite*'/\[19\] **Create Composite Node(16)** (1610612761) `out.flow#0` -\> \[20\] **Create Composite Node(17)** (1610612762) `in.flow#0`<br>
'*All\_Composite*'/\[20\] **Create Composite Node(17)** (1610612762) user=COMPOSITE @(127.690475,351.83334)<br>
'*All\_Composite*'/\[20\] **Create Composite Node(17)** (1610612762) `out.flow#0` "1" -\> \[21\] **Create Composite Node(18)** (1610612763) `in.flow#0`<br>
'*All\_Composite*'/\[20\] **Create Composite Node(17)** (1610612762) `in#0` "Control Expression" \<- \[19\] **Create Composite Node(16)** (1610612761) `out#0` "Variable Name" : *Str*<br>
'*All\_Composite*'/\[21\] **Create Composite Node(18)** (1610612763) user=COMPOSITE @(716.1427,526.788)<br>
'*All\_Composite*'/\[21\] **Create Composite Node(18)** (1610612763) `out.flow#0` -\> \[24\] **Create Composite Node(21)** (1610612766) `in.flow#0`<br>
'*All\_Composite*'/\[22\] **Create Composite Node(19)** (1610612764) user=COMPOSITE @(161.2619,822.7976)<br>
'*All\_Composite*'/\[23\] **Create Composite Node(20)** (1610612765) user=COMPOSITE @(-331.2381,827.381)<br>
'*All\_Composite*'/\[23\] **Create Composite Node(20)** (1610612765) `out.flow#0` -\> \[22\] **Create Composite Node(19)** (1610612764) `in.flow#0`<br>
'*All\_Composite*'/\[24\] **Create Composite Node(21)** (1610612766) user=COMPOSITE @(1157.5713,529.64514)<br>
'*All\_Composite*'/\[24\] **Create Composite Node(21)** (1610612766) `in#0` "Variable Name" \<- \[26\] **Create Composite Node(23)** (1610612768) `out#0` "Value" : *Str*<br>
'*All\_Composite*'/\[24\] **Create Composite Node(21)** (1610612766) `in#1` "Variable Value" \<- \[25\] **Create Composite Node(22)** (1610612767) `out#0` "Variable Value" : *L\<Gid\>*<br>
'*All\_Composite*'/\[25\] **Create Composite Node(22)** (1610612767) user=COMPOSITE @(1635.1427,538.5499)<br>
'*All\_Composite*'/\[25\] **Create Composite Node(22)** (1610612767) `in#0` "Variable Name" \<- \[26\] **Create Composite Node(23)** (1610612768) `out#0` "Value" : *Str*<br>
'*All\_Composite*'/\[26\] **Create Composite Node(23)** (1610612768) user=COMPOSITE @(1173.4641,895.1809)<br>
'*All\_Composite*'/\[27\] **Create Composite Node(24)** (1610612769) user=COMPOSITE @(173.7619,1110.2976)<br>
'*All\_Composite*'/\[28\] **Create Composite Node(25)** (1610612770) user=COMPOSITE @(-317.90475,1112.381)<br>
'*All\_Composite*'/\[28\] **Create Composite Node(25)** (1610612770) `out.flow#0` -\> \[27\] **Create Composite Node(24)** (1610612769) `in.flow#0`<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1610612737, decl 1610612745) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out.flow#0` -\> \[1\] **When Custom Variable Changes** (36/40) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out#0` "Event Source Entity" -\> \[1\] **When Custom Variable Changes** (36/40) `out#0` "Event Source Entity"<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out#1` "Variable Name" -\> \[1\] **When Custom Variable Changes** (36/40) `out#2` "Variable Name"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[1\] **When Custom Variable Changes** (36/40) variant=C\<T:Flt\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(2)*' ENTITY\_NODE\_GRAPH (guid 1610612739, decl 1610612747) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(2)*'/PORTMAP `ext.out.flow#0` -\> \[6\] **When Timer Is Triggered** (83) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(2)*'/PORTMAP `ext.out#0` "Event Source Entity" -\> \[6\] **When Timer Is Triggered** (83) `out#0` "Event Source Entity"<br>
'<u>\<composite\></u>*Create Composite Node(2)*'/PORTMAP `ext.out#1` "Timer Name" -\> \[6\] **When Timer Is Triggered** (83) `out#2` "Timer Name"<br>
'<u>\<composite\></u>*Create Composite Node(2)*'/\[6\] **When Timer Is Triggered** (83) @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(4)*' ENTITY\_NODE\_GRAPH (guid 1610612741, decl 1610612749) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(4)*'/PORTMAP `ext.in.flow#0` -\> \[34\] **Start Timer** (79) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(4)*'/PORTMAP `ext.out.flow#0` -\> \[34\] **Start Timer** (79) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(4)*'/PORTMAP `ext.in#0` "Target Entity" -\> \[34\] **Start Timer** (79) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(4)*'/\[34\] **Start Timer** (79) @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(4)*'/\[34\] **Start Timer** (79) `in#1` "Timer Name" = '`Static_Timer`' : *Str*<br>
'<u>\<composite\></u>*Create Composite Node(4)*'/\[34\] **Start Timer** (79) `in#2` "Loop" = No : *Bol*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(6)*' ENTITY\_NODE\_GRAPH (guid 1610612743, decl 1610612751) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(6)*'/PORTMAP `ext.in.flow#0` -\> \[11\] **Multiple Branches** (3/4) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(6)*'/PORTMAP `ext.out.flow#0` "1" -\> \[11\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Global"<br>
'<u>\<composite\></u>*Create Composite Node(6)*'/PORTMAP `ext.in#0` "Control Expression" -\> \[11\] **Multiple Branches** (3/4) `in#0` "Control Expression"<br>
'<u>\<composite\></u>*Create Composite Node(6)*'/\[11\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(8)*' ENTITY\_NODE\_GRAPH (guid 1610612745, decl 1610612753) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(8)*'/PORTMAP `ext.out#0` "Value" -\> \[33\] **Get Local Variable** (18/2656) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node(8)*'/\[33\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(8)*'/\[33\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Global`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(9)*' ENTITY\_NODE\_GRAPH (guid 1610612746, decl 1610612754) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(9)*'/PORTMAP `ext.in.flow#0` -\> \[32\] **Stop Global Timer** (313) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(9)*'/PORTMAP `ext.in#0` "Timer Name" -\> \[32\] **Stop Global Timer** (313) `in#1` "Timer Name"<br>
'<u>\<composite\></u>*Create Composite Node(9)*'/PORTMAP `ext.in#1` "Target Entity" -\> \[32\] **Stop Global Timer** (313) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(9)*'/\[32\] **Stop Global Timer** (313) @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(10)*' ENTITY\_NODE\_GRAPH (guid 1610612747, decl 1610612755) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(10)*'/PORTMAP `ext.out#0` "Value" -\> \[36\] **Get Local Variable** (18/2656) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node(10)*'/\[36\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(10)*'/\[36\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Timer`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(11)*' ENTITY\_NODE\_GRAPH (guid 1610612748, decl 1610612756) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(11)*'/PORTMAP `ext.in.flow#0` -\> \[35\] **Stop Timer** (82) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(11)*'/PORTMAP `ext.in#0` "Timer Name" -\> \[35\] **Stop Timer** (82) `in#1` "Timer Name"<br>
'<u>\<composite\></u>*Create Composite Node(11)*'/PORTMAP `ext.in#1` "Target Entity" -\> \[35\] **Stop Timer** (82) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(11)*'/\[35\] **Stop Timer** (82) @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(12)*' ENTITY\_NODE\_GRAPH (guid 1610612749, decl 1610612757) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(12)*'/PORTMAP `ext.out#0` "Value" -\> \[39\] **Get Local Variable** (18/2656) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node(12)*'/\[39\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(12)*'/\[39\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Var`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(13)*' ENTITY\_NODE\_GRAPH (guid 1610612750, decl 1610612758) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(13)*'/PORTMAP `ext.in#0` "Target Entity" -\> \[40\] **Get Custom Variable** (50/54) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(13)*'/PORTMAP `ext.in#1` "Variable Name" -\> \[40\] **Get Custom Variable** (50/54) `in#1` "Variable Name"<br>
'<u>\<composite\></u>*Create Composite Node(13)*'/PORTMAP `ext.out#0` "Variable Value" -\> \[40\] **Get Custom Variable** (50/54) `out#0` "Variable Value"<br>
'<u>\<composite\></u>*Create Composite Node(13)*'/\[40\] **Get Custom Variable** (50/54) variant=C\<T:Flt\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(14)*' ENTITY\_NODE\_GRAPH (guid 1610612751, decl 1610612759) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(14)*'/PORTMAP `ext.in.flow#0` -\> \[38\] **Set Custom Variable** (22/26) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(14)*'/PORTMAP `ext.in#0` "Variable Value" -\> \[38\] **Set Custom Variable** (22/26) `in#2` "Variable Value"<br>
'<u>\<composite\></u>*Create Composite Node(14)*'/PORTMAP `ext.in#1` "Variable Name" -\> \[38\] **Set Custom Variable** (22/26) `in#1` "Variable Name"<br>
'<u>\<composite\></u>*Create Composite Node(14)*'/PORTMAP `ext.in#2` "Target Entity" -\> \[38\] **Set Custom Variable** (22/26) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(14)*'/\[38\] **Set Custom Variable** (22/26) variant=C\<T:Flt\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(14)*'/\[38\] **Set Custom Variable** (22/26) `in#4` "Trigger Event" = No : *Bol*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(15)*' ENTITY\_NODE\_GRAPH (guid 1610612752, decl 1610612760) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(15)*'/PORTMAP `ext.in.flow#0` -\> \[37\] **Set Custom Variable** (22/26) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(15)*'/PORTMAP `ext.out.flow#0` -\> \[37\] **Set Custom Variable** (22/26) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(15)*'/PORTMAP `ext.in#0` "Target Entity" -\> \[37\] **Set Custom Variable** (22/26) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(15)*'/\[37\] **Set Custom Variable** (22/26) variant=C\<T:Flt\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(15)*'/\[37\] **Set Custom Variable** (22/26) `in#1` "Variable Name" = '`Static_Var`' : *Str*<br>
'<u>\<composite\></u>*Create Composite Node(15)*'/\[37\] **Set Custom Variable** (22/26) `in#2` "Variable Value" = 0 : *Flt*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(16)*' ENTITY\_NODE\_GRAPH (guid 1610612753, decl 1610612761) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(16)*'/PORTMAP `ext.out.flow#0` -\> \[4\] **When Node Graph Variable Changes** (351/357) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(16)*'/PORTMAP `ext.out#0` "Variable Name" -\> \[4\] **When Node Graph Variable Changes** (351/357) `out#2` "Variable Name"<br>
'<u>\<composite\></u>*Create Composite Node(16)*'/\[4\] **When Node Graph Variable Changes** (351/357) variant=C\<T:L\<Gid\>\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(17)*' ENTITY\_NODE\_GRAPH (guid 1610612754, decl 1610612762) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(17)*'/PORTMAP `ext.in.flow#0` -\> \[7\] **Multiple Branches** (3/4) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(17)*'/PORTMAP `ext.out.flow#0` "1" -\> \[7\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Graph"<br>
'<u>\<composite\></u>*Create Composite Node(17)*'/PORTMAP `ext.in#0` "Control Expression" -\> \[7\] **Multiple Branches** (3/4) `in#0` "Control Expression"<br>
'<u>\<composite\></u>*Create Composite Node(17)*'/\[7\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(18)*' ENTITY\_NODE\_GRAPH (guid 1610612755, decl 1610612763) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(18)*'/PORTMAP `ext.in.flow#0` -\> \[41\] **Set Node Graph Variable** (323) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(18)*'/PORTMAP `ext.out.flow#0` -\> \[41\] **Set Node Graph Variable** (323) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(18)*'/\[41\] **Set Node Graph Variable** (323) @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(18)*'/\[41\] **Set Node Graph Variable** (323) `in#0` "Variable Name" = '`Static_Graph`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(19)*' ENTITY\_NODE\_GRAPH (guid 1610612756, decl 1610612764) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(19)*'/PORTMAP `ext.in.flow#0` -\> \[29\] **Send Signal** (1610612741) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(19)*'/\[29\] **Send Signal** (1610612741) user=SEND\_SIGNAL signal='`Static_2`' @(0,0) sigver=2<br>
'<u>\<composite\></u>*Create Composite Node(19)*'/\[29\] **Send Signal** (1610612741) `meta.rpc#0` "Signal Name" = '`Static_2`'<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(20)*' ENTITY\_NODE\_GRAPH (guid 1610612757, decl 1610612765) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(20)*'/PORTMAP `ext.out.flow#0` -\> \[27\] **Monitor Signal** (1610612738) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(20)*'/\[27\] **Monitor Signal** (1610612738) user=LISTEN\_SIGNAL signal='`Static_1`' @(0,0) sigver=2<br>
'<u>\<composite\></u>*Create Composite Node(20)*'/\[27\] **Monitor Signal** (1610612738) `meta.rpc#0` "Signal Name" = '`Static_1`'<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(21)*' ENTITY\_NODE\_GRAPH (guid 1610612758, decl 1610612766) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(21)*'/PORTMAP `ext.in.flow#0` -\> \[42\] **Set Node Graph Variable** (323/329) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(21)*'/PORTMAP `ext.in#0` "Variable Name" -\> \[42\] **Set Node Graph Variable** (323/329) `in#0` "Variable Name"<br>
'<u>\<composite\></u>*Create Composite Node(21)*'/PORTMAP `ext.in#1` "Variable Value" -\> \[42\] **Set Node Graph Variable** (323/329) `in#1` "Variable Value"<br>
'<u>\<composite\></u>*Create Composite Node(21)*'/\[42\] **Set Node Graph Variable** (323/329) variant=C\<T:L\<Gid\>\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(21)*'/\[42\] **Set Node Graph Variable** (323/329) `in#2` "Trigger Event" = No : *Bol*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(22)*' ENTITY\_NODE\_GRAPH (guid 1610612759, decl 1610612767) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(22)*'/PORTMAP `ext.in#0` "Variable Name" -\> \[44\] **Get Node Graph Variable** (337/343) `in#0` "Variable Name"<br>
'<u>\<composite\></u>*Create Composite Node(22)*'/PORTMAP `ext.out#0` "Variable Value" -\> \[44\] **Get Node Graph Variable** (337/343) `out#0` "Variable Value"<br>
'<u>\<composite\></u>*Create Composite Node(22)*'/\[44\] **Get Node Graph Variable** (337/343) variant=C\<T:L\<Gid\>\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(23)*' ENTITY\_NODE\_GRAPH (guid 1610612760, decl 1610612768) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(23)*'/PORTMAP `ext.out#0` "Value" -\> \[43\] **Get Local Variable** (18/2656) `out#1` "Value"<br>
'<u>\<composite\></u>*Create Composite Node(23)*'/\[43\] **Get Local Variable** (18/2656) variant=C\<T:Str\> @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(23)*'/\[43\] **Get Local Variable** (18/2656) `in#0` "Initial Value" = '`Static_Graph`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(24)*' ENTITY\_NODE\_GRAPH (guid 1610612761, decl 1610612769) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(24)*'/PORTMAP `ext.in.flow#0` -\> \[30\] **Send Signal** (1610612737) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(24)*'/\[30\] **Send Signal** (1610612737) user=SEND\_SIGNAL signal='`Static_1`' @(0,0) sigver=2<br>
'<u>\<composite\></u>*Create Composite Node(24)*'/\[30\] **Send Signal** (1610612737) `meta.rpc#0` "Signal Name" = '`Static_1`'<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(25)*' ENTITY\_NODE\_GRAPH (guid 1610612762, decl 1610612770) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(25)*'/PORTMAP `ext.out.flow#0` -\> \[28\] **Monitor Signal** (1610612742) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(25)*'/\[28\] **Monitor Signal** (1610612742) user=LISTEN\_SIGNAL signal='`Static_2`' @(0,0) sigver=2<br>
'<u>\<composite\></u>*Create Composite Node(25)*'/\[28\] **Monitor Signal** (1610612742) `meta.rpc#0` "Signal Name" = '`Static_2`'<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1610612738, decl 1610612746) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[2\] **Multiple Branches** (3/4) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.out.flow#0` "1" -\> \[2\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Var"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in#0` "Control Expression" -\> \[2\] **Multiple Branches** (3/4) `in#0` "Control Expression"<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[2\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(5)*' ENTITY\_NODE\_GRAPH (guid 1610612742, decl 1610612750) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(5)*'/PORTMAP `ext.in.flow#0` -\> \[31\] **Start Global Timer** (311) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(5)*'/PORTMAP `ext.out.flow#0` -\> \[31\] **Start Global Timer** (311) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(5)*'/PORTMAP `ext.in#0` "Target Entity" -\> \[31\] **Start Global Timer** (311) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Create Composite Node(5)*'/\[31\] **Start Global Timer** (311) @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(5)*'/\[31\] **Start Global Timer** (311) `in#1` "Timer Name" = '`Static_Global`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(3)*' ENTITY\_NODE\_GRAPH (guid 1610612740, decl 1610612748) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(3)*'/PORTMAP `ext.in.flow#0` -\> \[10\] **Multiple Branches** (3/4) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(3)*'/PORTMAP `ext.out.flow#0` "1" -\> \[10\] **Multiple Branches** (3/4) `out.flow#1` "Static\_Timer"<br>
'<u>\<composite\></u>*Create Composite Node(3)*'/PORTMAP `ext.in#0` "Control Expression" -\> \[10\] **Multiple Branches** (3/4) `in#0` "Control Expression"<br>
'<u>\<composite\></u>*Create Composite Node(3)*'/\[10\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(0,0)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(7)*' ENTITY\_NODE\_GRAPH (guid 1610612744, decl 1610612752) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(7)*'/PORTMAP `ext.out.flow#0` -\> \[14\] **When Global Timer Is Triggered** (315) `out.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(7)*'/PORTMAP `ext.out#0` "Event Source Entity" -\> \[14\] **When Global Timer Is Triggered** (315) `out#0` "Event Source Entity"<br>
'<u>\<composite\></u>*Create Composite Node(7)*'/PORTMAP `ext.out#1` "Timer Name" -\> \[14\] **When Global Timer Is Triggered** (315) `out#2` "Timer Name"<br>
'<u>\<composite\></u>*Create Composite Node(7)*'/\[14\] **When Global Timer Is Triggered** (315) @(0,0)

# FILE `test/cases/composites/test_composite.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*New Node Graph*'/VAR **Var\_1** : *Int* public=false = 1<br>
'*New Node Graph*'/\[1\] **When Entity Is Created** (71) @(-373.85715,-177.28572)<br>
'*New Node Graph*'/\[1\] **When Entity Is Created** (71) `out.flow#0` -\> \[15\] **Create Composite Node** (1610613134) `in.flow#0`<br>
'*New Node Graph*'/\[14\] **Create Composite Node** (1610613134) user=COMPOSITE @(354.14285,-179.14285)<br>
'*New Node Graph*'/\[14\] **Create Composite Node** (1610613134) `out.flow#0` "Yes" -\> \[18\] **Switch Current Interface Layout** (382) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Create Composite Node** (1610613134) user=COMPOSITE @(-28.714285,-178.66667)<br>
'*New Node Graph*'/\[15\] **Create Composite Node** (1610613134) `out.flow#0` "Yes" -\> \[14\] **Create Composite Node** (1610613134) `in.flow#0`<br>
'*New Node Graph*'/\[17\] **Query All Skill Instance IDs by Skill Config ID** (812) @(1276.608,-540.3176)<br>
'*New Node Graph*'/\[17\] **Query All Skill Instance IDs by Skill Config ID** (812) `in#1` "Skill Config ID" = id:1098907649 : *Cfg*<br>
'*New Node Graph*'/\[18\] **Switch Current Interface Layout** (382) @(751.2857,-176.28572)<br>
'*New Node Graph*'/\[18\] **Switch Current Interface Layout** (382) `in#1` "Layout Index" = 1073741825 : *Int*<br>
'*New Node Graph*'/\[21\] **Get Entity With Specified Prefab ID on the Field** (320) @(1255.24,-266.45618)<br>
'*New Node Graph*'/\[21\] **Get Entity With Specified Prefab ID on the Field** (320) `in#0` "Prefab ID" = id:10005018 : *Pfb*<br>
'*New Node Graph*'/\[22\] **Query Entity by GUID** (75) @(1283.8114,-45.02761)<br>
'*New Node Graph*'/\[22\] **Query Entity by GUID** (75) `in#0` "GUID" = id:1077936131 : *Gid*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1610612900, decl 1610613134) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.in.flow#0` -\> \[2\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[2\] **Double Branch** (2) `out.flow#0` "Yes"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[2\] **Double Branch** (2) @(51.142857,247.95238)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[2\] **Double Branch** (2) `out.flow#1` "No" -\> \[7\] **Create Composite Node(1)** (1610613135) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node*'/\[2\] **Double Branch** (2) `in#0` "Condition" \<- \[4\] **Equal** (14/370) `out#0` "Result" : *Bol*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[3\] **Get Node Graph Variable** (337/339) variant=C\<T:Int\> @(1.7142857,-224.7619)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[3\] **Get Node Graph Variable** (337/339) `in#0` "Variable Name" = '`Var_1`' : *Str*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[4\] **Equal** (14/370) variant=C\<T:Int\> @(-52.857143,-23.190475)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[4\] **Equal** (14/370) `in#0` "Input 1" \<- \[3\] **Get Node Graph Variable** (337/339) `out#0` "Variable Value" : *Int*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[4\] **Equal** (14/370) `in#1` "Input 2" = 0 : *Int*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[7\] **Create Composite Node(1)** (1610613135) user=COMPOSITE @(478.7143,291)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1610612901, decl 1610613135) role=dependency<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[1\] **Set Node Graph Variable** (323) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) `in#0` "Variable Name" = '`Var_1`' : *Str*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) `in#1` "Variable Value" = 0 : *Int*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) `in#2` "Trigger Event" = No : *Bol*

# FILE `test/cases/composites/test_composite.gil`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*New Node Graph*'/VAR **Var\_1** : *Int* public=false = 1<br>
'*New Node Graph*'/\[1\] **When Entity Is Created** (71) @(-373.85715,-177.28572)<br>
'*New Node Graph*'/\[1\] **When Entity Is Created** (71) `out.flow#0` -\> \[15\] **Create Composite Node** (1610613134) `in.flow#0`<br>
'*New Node Graph*'/\[14\] **Create Composite Node** (1610613134) user=COMPOSITE @(354.14285,-179.14285)<br>
'*New Node Graph*'/\[14\] **Create Composite Node** (1610613134) `out.flow#0` "Yes" -\> \[18\] **Switch Current Interface Layout** (382) `in.flow#0`<br>
'*New Node Graph*'/\[15\] **Create Composite Node** (1610613134) user=COMPOSITE @(-28.714285,-178.66667)<br>
'*New Node Graph*'/\[15\] **Create Composite Node** (1610613134) `out.flow#0` "Yes" -\> \[14\] **Create Composite Node** (1610613134) `in.flow#0`<br>
'*New Node Graph*'/\[17\] **Query All Skill Instance IDs by Skill Config ID** (812) @(1276.608,-540.3176)<br>
'*New Node Graph*'/\[17\] **Query All Skill Instance IDs by Skill Config ID** (812) `in#1` "Skill Config ID" = id:1098907649 : *Cfg*<br>
'*New Node Graph*'/\[18\] **Switch Current Interface Layout** (382) @(751.2857,-176.28572)<br>
'*New Node Graph*'/\[18\] **Switch Current Interface Layout** (382) `in#1` "Layout Index" = 1073741825 : *Int*<br>
'*New Node Graph*'/\[21\] **Get Entity With Specified Prefab ID on the Field** (320) @(1255.24,-266.45618)<br>
'*New Node Graph*'/\[21\] **Get Entity With Specified Prefab ID on the Field** (320) `in#0` "Prefab ID" = id:10005018 : *Pfb*<br>
'*New Node Graph*'/\[22\] **Query Entity by GUID** (75) @(1283.8114,-45.02761)<br>
'*New Node Graph*'/\[22\] **Query Entity by GUID** (75) `in#0` "GUID" = id:1077936131 : *Gid*<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH (guid 1610612900, decl 1610613134)<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.in.flow#0` -\> \[2\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node*'/PORTMAP `ext.out.flow#0` "Yes" -\> \[2\] **Double Branch** (2) `out.flow#0` "Yes"<br>
'<u>\<composite\></u>*Create Composite Node*'/\[2\] **Double Branch** (2) @(51.142857,247.95238)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[2\] **Double Branch** (2) `out.flow#1` "No" -\> \[7\] **Create Composite Node(1)** (1610613135) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node*'/\[2\] **Double Branch** (2) `in#0` "Condition" \<- \[4\] **Equal** (14/370) `out#0` "Result" : *Bol*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[3\] **Get Node Graph Variable** (337/339) variant=C\<T:Int\> @(1.7142857,-224.7619)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[3\] **Get Node Graph Variable** (337/339) `in#0` "Variable Name" = '`Var_1`' : *Str*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[4\] **Equal** (14/370) variant=C\<T:Int\> @(-52.857143,-23.190475)<br>
'<u>\<composite\></u>*Create Composite Node*'/\[4\] **Equal** (14/370) `in#0` "Input 1" \<- \[3\] **Get Node Graph Variable** (337/339) `out#0` "Variable Value" : *Int*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[4\] **Equal** (14/370) `in#1` "Input 2" = 0 : *Int*<br>
'<u>\<composite\></u>*Create Composite Node*'/\[7\] **Create Composite Node(1)** (1610613135) user=COMPOSITE @(478.7143,291)<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH (guid 1610612901, decl 1610613135)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/PORTMAP `ext.in.flow#0` -\> \[1\] **Set Node Graph Variable** (323) `in.flow#0`<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) @(0,0)<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) `in#0` "Variable Name" = '`Var_1`' : *Str*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) `in#1` "Variable Value" = 0 : *Int*<br>
'<u>\<composite\></u>*Create Composite Node(1)*'/\[1\] **Set Node Graph Variable** (323) `in#2` "Trigger Event" = No : *Bol*

# FILE `test/cases/composites/var_change.gia`

**GRAPH** '*VAR\_TEST*' ENTITY\_NODE\_GRAPH (guid 1073741841)<br>
'*VAR\_TEST*'/\[1\] **When Custom Variable Changes** (36) @(-277,-215)<br>
'*VAR\_TEST*'/\[1\] **When Custom Variable Changes** (36) `out.flow#0` -\> \[2\] **Multiple Branches** (3/4) `in.flow#0`<br>
'*VAR\_TEST*'/\[2\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(130,-200)<br>
'*VAR\_TEST*'/\[2\] **Multiple Branches** (3/4) `out.flow#1` "Var1" -\> \[14\] **Settle Stage** (77) `in.flow#0`<br>
'*VAR\_TEST*'/\[2\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[1\] **When Custom Variable Changes** (36) `out#2` "Variable Name" : *Str*<br>
'*VAR\_TEST*'/\[3\] **When Entity Is Created** (71) @(-208,314)<br>
'*VAR\_TEST*'/\[3\] **When Entity Is Created** (71) `out.flow#0` -\> \[9\] **VAR\_TEST\_1** (1610612743) `in.flow#0`<br>
'*VAR\_TEST*'/\[9\] **VAR\_TEST\_1** (1610612743) user=COMPOSITE @(200,314)<br>
'*VAR\_TEST*'/\[9\] **VAR\_TEST\_1** (1610612743) `out.flow#0` -\> \[15\] **VAR\_TEST\_2** (1610612744) `in.flow#0`<br>
'*VAR\_TEST*'/\[9\] **VAR\_TEST\_1** (1610612743) `in#0` "Target Entity" \<- \[3\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*VAR\_TEST*'/\[9\] **VAR\_TEST\_1** (1610612743) `in#1` "Variable Name" = '`Var1`' : *Str*<br>
'*VAR\_TEST*'/\[13\] **VAR\_TEST\_3** (1610612745) user=COMPOSITE @(814,-123)<br>
'*VAR\_TEST*'/\[13\] **VAR\_TEST\_3** (1610612745) `out.flow#0` "1" -\> \[14\] **Settle Stage** (77) `in.flow#0`<br>
'*VAR\_TEST*'/\[14\] **Settle Stage** (77) @(1302,130)<br>
'*VAR\_TEST*'/\[15\] **VAR\_TEST\_2** (1610612744) user=COMPOSITE @(742,314)<br>
'*VAR\_TEST*'/\[15\] **VAR\_TEST\_2** (1610612744) `out.flow#0` -\> \[14\] **Settle Stage** (77) `in.flow#0`<br>
'*VAR\_TEST*'/\[15\] **VAR\_TEST\_2** (1610612744) `in#0` "Target Entity" \<- \[3\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
**GRAPH** '<u>\<composite\></u>*VAR\_TEST\_1*' ENTITY\_NODE\_GRAPH (guid 1610612743, decl 1610612743) role=dependency<br>
'<u>\<composite\></u>*VAR\_TEST\_1*'/PORTMAP `ext.in.flow#0` -\> \[4\] **Set Custom Variable** (22) `in.flow#0`<br>
'<u>\<composite\></u>*VAR\_TEST\_1*'/PORTMAP `ext.out.flow#0` -\> \[4\] **Set Custom Variable** (22) `out.flow#0`<br>
'<u>\<composite\></u>*VAR\_TEST\_1*'/PORTMAP `ext.in#0` "Target Entity" -\> \[4\] **Set Custom Variable** (22) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*VAR\_TEST\_1*'/PORTMAP `ext.in#1` "Variable Name" -\> \[4\] **Set Custom Variable** (22) `in#1` "Variable Name"<br>
'<u>\<composite\></u>*VAR\_TEST\_1*'/\[4\] **Set Custom Variable** (22) @(0,0)<br>
'<u>\<composite\></u>*VAR\_TEST\_1*'/\[4\] **Set Custom Variable** (22) `in#2` "Variable Value" = 1 : *Int*<br>
**GRAPH** '<u>\<composite\></u>*VAR\_TEST\_2*' ENTITY\_NODE\_GRAPH (guid 1610612744, decl 1610612744) role=dependency<br>
'<u>\<composite\></u>*VAR\_TEST\_2*'/PORTMAP `ext.in.flow#0` -\> \[5\] **Set Custom Variable** (22/23) `in.flow#0`<br>
'<u>\<composite\></u>*VAR\_TEST\_2*'/PORTMAP `ext.out.flow#0` -\> \[5\] **Set Custom Variable** (22/23) `out.flow#0`<br>
'<u>\<composite\></u>*VAR\_TEST\_2*'/PORTMAP `ext.in#0` "Target Entity" -\> \[5\] **Set Custom Variable** (22/23) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*VAR\_TEST\_2*'/\[5\] **Set Custom Variable** (22/23) variant=C\<T:Str\> @(0,0)<br>
'<u>\<composite\></u>*VAR\_TEST\_2*'/\[5\] **Set Custom Variable** (22/23) `in#1` "Variable Name" = '`Var2`' : *Str*<br>
'<u>\<composite\></u>*VAR\_TEST\_2*'/\[5\] **Set Custom Variable** (22/23) `in#2` "Variable Value" = '`2`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*VAR\_TEST\_3*' ENTITY\_NODE\_GRAPH (guid 1610612745, decl 1610612745) role=dependency<br>
'<u>\<composite\></u>*VAR\_TEST\_3*'/PORTMAP `ext.out.flow#0` "1" -\> \[7\] **Multiple Branches** (3/4) `out.flow#1` "Var2"<br>
'<u>\<composite\></u>*VAR\_TEST\_3*'/PORTMAP `ext.out#0` "Post-Change Value" -\> \[6\] **When Custom Variable Changes** (36/37) `out#4` "Post-Change Value"<br>
'<u>\<composite\></u>*VAR\_TEST\_3*'/\[6\] **When Custom Variable Changes** (36/37) variant=C\<T:Str\> @(-211.5,-0.5)<br>
'<u>\<composite\></u>*VAR\_TEST\_3*'/\[6\] **When Custom Variable Changes** (36/37) `out.flow#0` -\> \[7\] **Multiple Branches** (3/4) `in.flow#0`<br>
'<u>\<composite\></u>*VAR\_TEST\_3*'/\[7\] **Multiple Branches** (3/4) variant=C\<T:Str\> @(211.5,0.5)<br>
'<u>\<composite\></u>*VAR\_TEST\_3*'/\[7\] **Multiple Branches** (3/4) `in#0` "Control Expression" \<- \[6\] **When Custom Variable Changes** (36/37) `out#2` "Variable Name" : *Str*
