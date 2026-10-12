# FILE `test/cases/resolution/test_All_Static.gia`

**DECL** "**Static\_1**" SIGNAL\_NODE\_DECL guid='`1610612737`' role=dependency<br>
**DECL** "**Static\_2**" SIGNAL\_NODE\_DECL guid='`1610612741`' role=dependency<br>
**GRAPH** '*All\_Static*' ENTITY\_NODE\_GRAPH guid='`1073741825`' nodes=26

# FILE `test/cases/resolution/test_resolution.gia`

**GRAPH** '*Dynamic*' ENTITY\_NODE\_GRAPH guid='`1073741826`' nodes=30<br>
**GRAPH** '*Indirect*' ENTITY\_NODE\_GRAPH guid='`1073741827`' nodes=10<br>
**GRAPH** '*Static*' ENTITY\_NODE\_GRAPH guid='`1073741825`' nodes=28<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH guid='`1610612737`' nodes=2 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH guid='`1610612738`' nodes=1 role=dependency
