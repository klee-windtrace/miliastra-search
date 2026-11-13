# File `codetest_3.gia`

**GRAPH** '*Composite with event*' ENTITY\_NODE\_GRAPH (guid 1073741827)<br>
'*Composite with event*'/\[7\] **Naive execution delay** (1610612738) user=COMPOSITE @(-277.1143,-168.15237)<br>
'*Composite with event*'/\[7\] **Naive execution delay** (1610612738) `out.flow#0` -\> \[18\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Composite with event*'/\[7\] **Naive execution delay** (1610612738) `in#0` "Delay" = 1 : *Flt*<br>
'*Composite with event*'/\[7\] **Naive execution delay** (1610612738) `in#1` "Timer Name" = '`1`' : *Str*<br>
'*Composite with event*'/\[8\] **When Entity Is Created** (71) @(-741.4286,-167.5238)<br>
'*Composite with event*'/\[8\] **When Entity Is Created** (71) `out.flow#0` -\> \[7\] **Naive execution delay** (1610612738) `in.flow#0`<br>
'*Composite with event*'/\[10\] **Naive execution delay** (1610612738) user=COMPOSITE @(-305.33334,434.61905)<br>
'*Composite with event*'/\[10\] **Naive execution delay** (1610612738) `in#0` "Delay" = 2 : *Flt*<br>
'*Composite with event*'/\[10\] **Naive execution delay** (1610612738) `in#1` "Timer Name" = '`2`' : *Str*<br>
'*Composite with event*'/\[12\] **Naive execution delay** (1610612738) user=COMPOSITE @(555.7143,339.33334)<br>
'*Composite with event*'/\[12\] **Naive execution delay** (1610612738) `out.flow#0` -\> \[20\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Composite with event*'/\[12\] **Naive execution delay** (1610612738) `in#0` "Delay" = 3 : *Flt*<br>
'*Composite with event*'/\[12\] **Naive execution delay** (1610612738) `in#1` "Timer Name" = '`3`' : *Str*<br>
'*Composite with event*'/\[13\] **Double Branch** (2) @(198.57143,549.3333)<br>
'*Composite with event*'/\[13\] **Double Branch** (2) `out.flow#0` "Yes" -\> \[12\] **Naive execution delay** (1610612738) `in.flow#0`<br>
'*Composite with event*'/\[13\] **Double Branch** (2) `out.flow#1` "No" -\> \[20\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Composite with event*'/\[13\] **Double Branch** (2) `in#0` "Condition" = Yes : *Bol*<br>
'*Composite with event*'/\[18\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(165,-167.5)<br>
'*Composite with event*'/\[18\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`X`' : *Str*<br>
'*Composite with event*'/\[18\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 0 : *Int*<br>
'*Composite with event*'/\[18\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = Yes : *Bol*<br>
'*Composite with event*'/\[19\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-769.6667,429.5)<br>
'*Composite with event*'/\[19\] **Wrapped (Custom Variable)** (1610612737) `out.flow#0` -\> \[10\] **Naive execution delay** (1610612738) `in.flow#0`<br>
'*Composite with event*'/\[19\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`Y`' : *Str*<br>
'*Composite with event*'/\[19\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 0 : *Int*<br>
'*Composite with event*'/\[19\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = Yes : *Bol*<br>
'*Composite with event*'/\[20\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(934.3333,583.5)<br>
'*Composite with event*'/\[20\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`Z`' : *Str*<br>
'*Composite with event*'/\[20\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 0 : *Int*<br>
'*Composite with event*'/\[20\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = Yes : *Bol*<br>
'*Composite with event*'/\[21\] **Naive execution delay** (1610612738) user=COMPOSITE @(847,-151.83333)<br>
'*Composite with event*'/\[21\] **Naive execution delay** (1610612738) `in#0` "Delay" = 4 : *Flt*<br>
'*Composite with event*'/\[21\] **Naive execution delay** (1610612738) `in#1` "Timer Name" = '`4`' : *Str*<br>
**GRAPH** '*Cycle with no entry*' ENTITY\_NODE\_GRAPH (guid 1073741826)<br>
'*Cycle with no entry*'/\[1\] **When Entity Is Created** (71) @(-288,-86)<br>
'*Cycle with no entry*'/\[1\] **When Entity Is Created** (71) `out.flow#0` -\> \[3\] **Finite Loop** (5) `in.flow#0`<br>
'*Cycle with no entry*'/\[2\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(968.3571,-72.57143)<br>
'*Cycle with no entry*'/\[2\] **Wrapped (Custom Variable)** (1610612737) `out.flow#0` -\> \[4\] **Multiple Branches** (3) `in.flow#0`<br>
'*Cycle with no entry*'/\[2\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`A`' : *Str*<br>
'*Cycle with no entry*'/\[2\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" \<- \[3\] **Finite Loop** (5) `out#0` "Current Loop Value" : *Int*<br>
'*Cycle with no entry*'/\[2\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = Yes : *Bol*<br>
'*Cycle with no entry*'/\[3\] **Finite Loop** (5) @(224.57143,-81.14286)<br>
'*Cycle with no entry*'/\[3\] **Finite Loop** (5) `out.flow#0` "Loop Body" -\> \[2\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Cycle with no entry*'/\[3\] **Finite Loop** (5) `out.flow#1` "Loop Complete" -\> \[6\] **Settle Stage** (77) `in.flow#0`<br>
'*Cycle with no entry*'/\[3\] **Finite Loop** (5) `in#0` "Loop Start Value" = 1 : *Int*<br>
'*Cycle with no entry*'/\[3\] **Finite Loop** (5) `in#1` "Loop Termination Value" = 5 : *Int*<br>
'*Cycle with no entry*'/\[4\] **Multiple Branches** (3) @(1577.7858,-56.142857)<br>
'*Cycle with no entry*'/\[4\] **Multiple Branches** (3) `out.flow#1` "3" -\> \[5\] **Break Loop** (6) `in.flow#0`<br>
'*Cycle with no entry*'/\[4\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[2\] **Wrapped (Custom Variable)** (1610612737) `out#0` "Variable Value" : *Int*<br>
'*Cycle with no entry*'/\[4\] **Multiple Branches** (3) `in#0` "Control Expression" = 0 : *Int* *(also wired)*<br>
'*Cycle with no entry*'/\[5\] **Break Loop** (6) @(2133.6355,21.877337)<br>
'*Cycle with no entry*'/\[5\] **Break Loop** (6) `out.flow#0` -\> \[3\] **Finite Loop** (5) `in.flow#1` "Break Loop"<br>
'*Cycle with no entry*'/\[6\] **Settle Stage** (77) @(718.5641,230.59163)<br>
'*Cycle with no entry*'/\[7\] **Clear List** (107) @(-241.26927,482.2583)<br>
'*Cycle with no entry*'/\[7\] **Clear List** (107) `out.flow#0` -\> \[16\] **Finite Loop** (5) `in.flow#0`<br>
'*Cycle with no entry*'/\[13\] **Settle Stage** (77) @(711.8787,782.6609)<br>
'*Cycle with no entry*'/\[14\] **Break Loop** (6) @(2126.9502,573.9466)<br>
'*Cycle with no entry*'/\[14\] **Break Loop** (6) `out.flow#0` -\> \[16\] **Finite Loop** (5) `in.flow#1` "Break Loop"<br>
'*Cycle with no entry*'/\[15\] **Multiple Branches** (3) @(1571.1003,495.9264)<br>
'*Cycle with no entry*'/\[15\] **Multiple Branches** (3) `out.flow#1` "3" -\> \[14\] **Break Loop** (6) `in.flow#0`<br>
'*Cycle with no entry*'/\[15\] **Multiple Branches** (3) `in#0` "Control Expression" \<- \[17\] **Wrapped (Custom Variable)** (1610612737) `out#0` "Variable Value" : *Int*<br>
'*Cycle with no entry*'/\[15\] **Multiple Branches** (3) `in#0` "Control Expression" = 0 : *Int* *(also wired)*<br>
'*Cycle with no entry*'/\[16\] **Finite Loop** (5) @(217.88606,470.9264)<br>
'*Cycle with no entry*'/\[16\] **Finite Loop** (5) `out.flow#0` "Loop Body" -\> \[17\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Cycle with no entry*'/\[16\] **Finite Loop** (5) `out.flow#1` "Loop Complete" -\> \[13\] **Settle Stage** (77) `in.flow#0`<br>
'*Cycle with no entry*'/\[16\] **Finite Loop** (5) `in#0` "Loop Start Value" = 1 : *Int*<br>
'*Cycle with no entry*'/\[16\] **Finite Loop** (5) `in#1` "Loop Termination Value" = 5 : *Int*<br>
'*Cycle with no entry*'/\[17\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(961.67175,479.49783)<br>
'*Cycle with no entry*'/\[17\] **Wrapped (Custom Variable)** (1610612737) `out.flow#0` -\> \[15\] **Multiple Branches** (3) `in.flow#0`<br>
'*Cycle with no entry*'/\[17\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`B`' : *Str*<br>
'*Cycle with no entry*'/\[17\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" \<- \[16\] **Finite Loop** (5) `out#0` "Current Loop Value" : *Int*<br>
'*Cycle with no entry*'/\[17\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = Yes : *Bol*<br>
**GRAPH** '*Dead composite*' ENTITY\_NODE\_GRAPH (guid 1073741825)<br>
'*Dead composite*'/\[3\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-20.333334,277.66666)<br>
'*Dead composite*'/\[3\] **Wrapped (Custom Variable)** (1610612737) `out.flow#0` -\> \[6\] **Print String** (1) `in.flow#0`<br>
'*Dead composite*'/\[3\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`1`' : *Str*<br>
'*Dead composite*'/\[3\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 1 : *Int*<br>
'*Dead composite*'/\[3\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = No : *Bol*<br>
'*Dead composite*'/\[4\] **When Entity Is Created** (71) @(-467.66666,283.33334)<br>
'*Dead composite*'/\[4\] **When Entity Is Created** (71) `out.flow#0` -\> \[3\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Dead composite*'/\[6\] **Print String** (1) @(466.33334,274)<br>
'*Dead composite*'/\[6\] **Print String** (1) `in#0` "String" \<- \[7\] **Data Type Conversion** (180/182) `out#0` "Output" : *Str*<br>
'*Dead composite*'/\[7\] **Data Type Conversion** (180/182) variant=C\<K:Int,V:Str\> @(449.33334,19.333334)<br>
'*Dead composite*'/\[7\] **Data Type Conversion** (180/182) `in#0` "Input" \<- \[8\] **Wrapped (Custom Variable)** (1610612737) `out#0` "Variable Value" : *Int*<br>
'*Dead composite*'/\[7\] **Data Type Conversion** (180/182) `in#0` "Input" = 0 : *Int* *(also wired)*<br>
'*Dead composite*'/\[7\] **Data Type Conversion** (180/182) `out#0` "Output" = '' : *Str*<br>
'*Dead composite*'/\[8\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-11.163849,-218.76569)<br>
'*Dead composite*'/\[8\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`2`' : *Str*<br>
'*Dead composite*'/\[8\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 2 : *Int*<br>
'*Dead composite*'/\[8\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = No : *Bol*<br>
'*Dead composite*'/\[9\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(967.1695,279.901)<br>
'*Dead composite*'/\[9\] **Wrapped (Custom Variable)** (1610612737) `in#0` "Target Entity" \<- \[4\] **When Entity Is Created** (71) `out#0` "Event Source Entity" : *Ety*<br>
'*Dead composite*'/\[9\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" \<- \[7\] **Data Type Conversion** (180/182) `out#0` "Output" : *Str*<br>
'*Dead composite*'/\[9\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`3`' : *Str* *(also wired)*<br>
'*Dead composite*'/\[9\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 3 : *Int*<br>
'*Dead composite*'/\[9\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = No : *Bol*<br>
'*Dead composite*'/\[10\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(-45.330517,840.901)<br>
'*Dead composite*'/\[10\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`4`' : *Str*<br>
'*Dead composite*'/\[10\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 4 : *Int*<br>
'*Dead composite*'/\[10\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = No : *Bol*<br>
'*Dead composite*'/\[11\] **Print String** (1) @(515.6695,846.401)<br>
'*Dead composite*'/\[11\] **Print String** (1) `out.flow#0` -\> \[13\] **Wrapped (Custom Variable)** (1610612737) `in.flow#0`<br>
'*Dead composite*'/\[13\] **Wrapped (Custom Variable)** (1610612737) user=COMPOSITE @(938.1695,851.401)<br>
'*Dead composite*'/\[13\] **Wrapped (Custom Variable)** (1610612737) `out.flow#0` -\> \[14\] **Print String** (1) `in.flow#0`<br>
'*Dead composite*'/\[13\] **Wrapped (Custom Variable)** (1610612737) `in#1` "Variable Name" = '`5`' : *Str*<br>
'*Dead composite*'/\[13\] **Wrapped (Custom Variable)** (1610612737) `in#2` "Variable Value" = 5 : *Int*<br>
'*Dead composite*'/\[13\] **Wrapped (Custom Variable)** (1610612737) `in#3` "Trigger Event" = No : *Bol*<br>
'*Dead composite*'/\[14\] **Print String** (1) @(1457.3362,852.2343)<br>
**GRAPH** '*Nested event*' ENTITY\_NODE\_GRAPH (guid 1073741828)<br>
'*Nested event*'/\[6\] **Test Delay Print** (1610612739) user=COMPOSITE @(48,-245.77777)<br>
'*Nested event*'/\[6\] **Test Delay Print** (1610612739) `in#0` "Delay" = 1 : *Flt*<br>
'*Nested event*'/\[7\] **When Entity Is Created** (71) @(-421.66666,120.333336)<br>
'*Nested event*'/\[7\] **When Entity Is Created** (71) `out.flow#0` -\> \[8\] **Test Delay Print** (1610612739) `in.flow#0`<br>
'*Nested event*'/\[8\] **Test Delay Print** (1610612739) user=COMPOSITE @(2.2737368e-13,123.666664)<br>
'*Nested event*'/\[8\] **Test Delay Print** (1610612739) `out.flow#0` -\> \[9\] **Test Delay Print** (1610612739) `in.flow#0`<br>
'*Nested event*'/\[8\] **Test Delay Print** (1610612739) `in#0` "Delay" = 2 : *Flt*<br>
'*Nested event*'/\[9\] **Test Delay Print** (1610612739) user=COMPOSITE @(400,122)<br>
'*Nested event*'/\[9\] **Test Delay Print** (1610612739) `in#0` "Delay" = 3 : *Flt*<br>
**GRAPH** '<u>\<composite\></u>*Naive execution delay*' ENTITY\_NODE\_GRAPH (guid 1610612738, decl 1610612738) role=dependency<br>
'<u>\<composite\></u>*Naive execution delay*'/PORTMAP `ext.in.flow#0` -\> \[4\] **Start Timer** (79) `in.flow#0`<br>
'<u>\<composite\></u>*Naive execution delay*'/PORTMAP `ext.out.flow#0` -\> \[2\] **Double Branch** (2) `out.flow#0` "Yes"<br>
'<u>\<composite\></u>*Naive execution delay*'/PORTMAP `ext.in#0` "Delay" -\> \[5\] **Assembly List** (169/173) `in#1` "0"<br>
'<u>\<composite\></u>*Naive execution delay*'/PORTMAP `ext.in#1` "Timer Name" -\> \[4\] **Start Timer** (79) `in#1` "Timer Name"<br>
'<u>\<composite\></u>*Naive execution delay*'/PORTMAP `ext.in#1` "Timer Name" -\> \[3\] **Equal** (14) `in#1` "Input 2"<br>
'<u>\<composite\></u>*Naive execution delay*'/\[1\] **When Timer Is Triggered** (83) @(-8.6,124.057144)<br>
'<u>\<composite\></u>*Naive execution delay*'/\[1\] **When Timer Is Triggered** (83) `out.flow#0` -\> \[2\] **Double Branch** (2) `in.flow#0`<br>
'<u>\<composite\></u>*Naive execution delay*'/\[2\] **Double Branch** (2) @(425.49524,127.34286)<br>
'<u>\<composite\></u>*Naive execution delay*'/\[2\] **Double Branch** (2) `in#0` "Condition" \<- \[3\] **Equal** (14) `out#0` "Result" : *Bol*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[3\] **Equal** (14) @(366.49524,-159.8)<br>
'<u>\<composite\></u>*Naive execution delay*'/\[3\] **Equal** (14) `in#0` "Input 1" \<- \[1\] **When Timer Is Triggered** (83) `out#2` "Timer Name" : *Str*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[3\] **Equal** (14) `in#0` "Input 1" = '' : *Str* *(also wired)*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[3\] **Equal** (14) `in#1` "Input 2" = '' : *Str*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[4\] **Start Timer** (79) @(-408.6,113.48572)<br>
'<u>\<composite\></u>*Naive execution delay*'/\[4\] **Start Timer** (79) `in#0` "Target Entity" \<- \[6\] **Get Self Entity** (73) `out#0` "Self Entity" : *Ety*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[4\] **Start Timer** (79) `in#2` "Loop" = No : *Bol*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[4\] **Start Timer** (79) `in#3` "Timer Sequence" \<- \[5\] **Assembly List** (169/173) `out#0` "List" : *L\<Flt\>*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[5\] **Assembly List** (169/173) variant=C\<T:Flt\> @(-431.45715,-185.08571)<br>
'<u>\<composite\></u>*Naive execution delay*'/\[5\] **Assembly List** (169/173) `in#1` "0" = 0 : *Flt*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[5\] **Assembly List** (169/173) `out#0` "List" = \[\] : *L\<Flt\>*<br>
'<u>\<composite\></u>*Naive execution delay*'/\[6\] **Get Self Entity** (73) @(-765,146.19048)<br>
**GRAPH** '<u>\<composite\></u>*Test Delay Print*' ENTITY\_NODE\_GRAPH (guid 1610612739, decl 1610612739) role=dependency<br>
'<u>\<composite\></u>*Test Delay Print*'/PORTMAP `ext.in.flow#0` -\> \[4\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Test Delay Print*'/PORTMAP `ext.out.flow#0` -\> \[3\] **Print String** (1) `out.flow#0`<br>
'<u>\<composite\></u>*Test Delay Print*'/PORTMAP `ext.in#0` "Delay" -\> \[2\] **Naive execution delay** (1610612738) `in#0` "Delay"<br>
'<u>\<composite\></u>*Test Delay Print*'/\[2\] **Naive execution delay** (1610612738) user=COMPOSITE @(-22.333334,1.1111112)<br>
'<u>\<composite\></u>*Test Delay Print*'/\[2\] **Naive execution delay** (1610612738) `out.flow#0` -\> \[3\] **Print String** (1) `in.flow#0`<br>
'<u>\<composite\></u>*Test Delay Print*'/\[2\] **Naive execution delay** (1610612738) `in#1` "Timer Name" = '`Delay`' : *Str*<br>
'<u>\<composite\></u>*Test Delay Print*'/\[3\] **Print String** (1) @(433.66666,2.7777777)<br>
'<u>\<composite\></u>*Test Delay Print*'/\[3\] **Print String** (1) `in#0` "String" = '`Two`' : *Str*<br>
'<u>\<composite\></u>*Test Delay Print*'/\[4\] **Print String** (1) @(-411.33334,-3.8888888)<br>
'<u>\<composite\></u>*Test Delay Print*'/\[4\] **Print String** (1) `out.flow#0` -\> \[2\] **Naive execution delay** (1610612738) `in.flow#0`<br>
'<u>\<composite\></u>*Test Delay Print*'/\[4\] **Print String** (1) `in#0` "String" = '`One`' : *Str*<br>
**GRAPH** '<u>\<composite\></u>*Wrapped (Custom Variable)*' ENTITY\_NODE\_GRAPH (guid 1610612737, decl 1610612737) role=dependency<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in.flow#0` -\> \[1\] **Set Custom Variable** (22) `in.flow#0`<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.out.flow#0` -\> \[1\] **Set Custom Variable** (22) `out.flow#0`<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in#0` "Target Entity" -\> \[1\] **Set Custom Variable** (22) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in#0` "Target Entity" -\> \[2\] **Get Custom Variable** (50) `in#0` "Target Entity"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in#1` "Variable Name" -\> \[1\] **Set Custom Variable** (22) `in#1` "Variable Name"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in#1` "Variable Name" -\> \[2\] **Get Custom Variable** (50) `in#1` "Variable Name"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in#2` "Variable Value" -\> \[1\] **Set Custom Variable** (22) `in#2` "Variable Value"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.in#3` "Trigger Event" -\> \[1\] **Set Custom Variable** (22) `in#4` "Trigger Event"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/PORTMAP `ext.out#0` "Variable Value" -\> \[2\] **Get Custom Variable** (50) `out#0` "Variable Value"<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/\[1\] **Set Custom Variable** (22) @(0,0)<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/\[1\] **Set Custom Variable** (22) `in#2` "Variable Value" = 0 : *Int*<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/\[2\] **Get Custom Variable** (50) @(-55,384)<br>
'<u>\<composite\></u>*Wrapped (Custom Variable)*'/\[2\] **Get Custom Variable** (50) `out#0` "Variable Value" = 0 : *Int*
