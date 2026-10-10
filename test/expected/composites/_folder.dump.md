# FILE `test/cases/composites/test_All_Composite.gia`

**DECL** "**Static\_2**" SIGNAL\_NODE\_DECL guid='`1610612741`' role=dependency<br>
**DECL** "**Static\_1**" SIGNAL\_NODE\_DECL guid='`1610612737`' role=dependency<br>
**GRAPH** '*All\_Composite*' ENTITY\_NODE\_GRAPH guid='`1073741826`' nodes=26<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH guid='`1610612737`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(2)*' ENTITY\_NODE\_GRAPH guid='`1610612739`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(4)*' ENTITY\_NODE\_GRAPH guid='`1610612741`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(6)*' ENTITY\_NODE\_GRAPH guid='`1610612743`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(8)*' ENTITY\_NODE\_GRAPH guid='`1610612745`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(9)*' ENTITY\_NODE\_GRAPH guid='`1610612746`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(10)*' ENTITY\_NODE\_GRAPH guid='`1610612747`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(11)*' ENTITY\_NODE\_GRAPH guid='`1610612748`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(12)*' ENTITY\_NODE\_GRAPH guid='`1610612749`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(13)*' ENTITY\_NODE\_GRAPH guid='`1610612750`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(14)*' ENTITY\_NODE\_GRAPH guid='`1610612751`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(15)*' ENTITY\_NODE\_GRAPH guid='`1610612752`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(16)*' ENTITY\_NODE\_GRAPH guid='`1610612753`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(17)*' ENTITY\_NODE\_GRAPH guid='`1610612754`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(18)*' ENTITY\_NODE\_GRAPH guid='`1610612755`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(19)*' ENTITY\_NODE\_GRAPH guid='`1610612756`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(20)*' ENTITY\_NODE\_GRAPH guid='`1610612757`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(21)*' ENTITY\_NODE\_GRAPH guid='`1610612758`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(22)*' ENTITY\_NODE\_GRAPH guid='`1610612759`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(23)*' ENTITY\_NODE\_GRAPH guid='`1610612760`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(24)*' ENTITY\_NODE\_GRAPH guid='`1610612761`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(25)*' ENTITY\_NODE\_GRAPH guid='`1610612762`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH guid='`1610612738`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(5)*' ENTITY\_NODE\_GRAPH guid='`1610612742`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(3)*' ENTITY\_NODE\_GRAPH guid='`1610612740`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(7)*' ENTITY\_NODE\_GRAPH guid='`1610612744`' nodes=1 role=dependency

# FILE `test/cases/composites/test_composite.gia`

**GRAPH** '*New Node Graph*' ENTITY\_NODE\_GRAPH guid='`1073741825`' nodes=7<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH guid='`1610612900`' nodes=4 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH guid='`1610612901`' nodes=1 role=dependency<br>
**RESOURCE** "**test\_skill**" SKILL guid='`1098907649`'<br>
**RESOURCE** "**prefab\_test**" OBJECT guid='`1077936129`' parent=(entities: **1**)<br>
**RESOURCE** "**entity\_test**" OBJECT\_ENTITY guid='`1077936131`' parent=(1077936129:"**prefab\_test**")<br>
**RESOURCE** "**Default Layout**" INTERFACE\_LAYOUT guid='`1073741825`'<br>
**RESOURCE** "**Mini-Map**" UI\_CONTROL guid='`1073741826`'<br>
**RESOURCE** "**Skill Area**" UI\_CONTROL guid='`1073741827`'<br>
**RESOURCE** "**Team Information**" UI\_CONTROL guid='`1073741828`'<br>
**RESOURCE** "**Character HP Bar**" UI\_CONTROL guid='`1073741829`'<br>
**RESOURCE** "**Joystick**" UI\_CONTROL guid='`1073741830`'<br>
**RESOURCE** "**Creation HP Bar**" UI\_CONTROL guid='`1073741831`'<br>
**RESOURCE** "**Exit Button**" UI\_CONTROL guid='`1073741832`'<br>
**RESOURCE** "**Voice-Over**" UI\_CONTROL guid='`1073741833`'<br>
**RESOURCE** "**Tab**" UI\_CONTROL guid='`1073741834`'<br>
**RESOURCE** "**Chat Button**" UI\_CONTROL guid='`1073741835`'<br>
**RESOURCE** "**Network Status**" UI\_CONTROL guid='`1073741836`'<br>
**RESOURCE** "**Struggle Button**" UI\_CONTROL guid='`1073741837`'<br>
**RESOURCE** "**Voice Chat Button**" UI\_CONTROL guid='`1073741838`'<br>
**RESOURCE** "**Voice Chat Hint Queue**" UI\_CONTROL guid='`1073741839`'

# FILE `test/cases/composites/test_composite.gil`

**GRAPH** /(default)/'*New Node Graph*' ENTITY\_NODE\_GRAPH guid='`1073741825`' nodes=7<br>
**GRAPH** /(default)/'<u>\<composite\></u>*Create Composite Node*' ENTITY\_NODE\_GRAPH guid='`1610612900`' nodes=4<br>
**GRAPH** /(default)/'<u>\<composite\></u>*Create Composite Node(1)*' ENTITY\_NODE\_GRAPH guid='`1610612901`' nodes=1<br>
**RESOURCE** "**Stage Entity**" GIL\_LEVEL\_ENTITY guid='`1094713345`'<br>
**RESOURCE** "**Default Template**" PLAYER\_TEMPLATE guid='`1086324737`'<br>
**RESOURCE** "**Default Template(Edit Character)**" CHARACTER\_TEMPLATE guid='`1090519041`'<br>
**RESOURCE** "**Custom Class**" CLASS guid='`1090519041`'<br>
**RESOURCE** /(default)/"**test\_skill**" SKILL guid='`1098907649`'<br>
**RESOURCE** "**Inventory Template**" GIL\_INVENTORY\_TEMPLATE guid='`1119879169`'<br>
**RESOURCE** "**Custom Camera**" CAMERA guid='`1073741825`'<br>
**RESOURCE** /(default)/"**prefab\_test**" OBJECT guid='`1077936129`' parent=(entities: **1**)<br>
**RESOURCE** "**entity\_test**" OBJECT\_ENTITY guid='`1077936131`' parent=(1077936129:"**prefab\_test**")<br>
**RESOURCE** "**Terrain01**" TERRAIN\_ENTITY guid='`1073741825`'<br>
**RESOURCE** "**Default Layout**" INTERFACE\_LAYOUT guid='`1073741825`'<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741840`'<br>
**RESOURCE** "**HierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741841`'<br>
**RESOURCE** "**ExclusiveEleGroupHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741842`'<br>
**RESOURCE** "**ClientUIRootHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741843`'<br>
**RESOURCE** "**ClientUIPrototypeHierarchyRoot**" INTERFACE\_LAYOUT guid='`1073741844`'<br>
**RESOURCE** "**Environment Configuration**" ENVIRONMENT\_CONFIGURATION guid='`1186988033`'<br>
**RESOURCE** "**Create Preset Point**" PRESET\_POINT guid='`1073741825`'<br>
**RESOURCE** "**Spawn Point1**" GIL\_RESPAWN\_POINT guid='`1073741825`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324737`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324738`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324739`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324740`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324741`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324742`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324743`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324744`'<br>
**RESOURCE** "**Default Template**" GIL\_PLAYER\_ENTITY guid='`1086324745`'<br>
**RESOURCE** "**Default Template(Edit Character)**" GIL\_CHARACTER\_ENTITY guid='`1090519041`'<br>
**RESOURCE** "**Custom Growth Curve**" GIL\_GROWTH\_CURVE guid='`1094713345`'<br>
**RESOURCE** "**Mini-Map**" UI\_CONTROL guid='`1073741826`'<br>
**RESOURCE** "**Skill Area**" UI\_CONTROL guid='`1073741827`'<br>
**RESOURCE** "**Team Information**" UI\_CONTROL guid='`1073741828`'<br>
**RESOURCE** "**Character HP Bar**" UI\_CONTROL guid='`1073741829`'<br>
**RESOURCE** "**Joystick**" UI\_CONTROL guid='`1073741830`'<br>
**RESOURCE** "**Creation HP Bar**" UI\_CONTROL guid='`1073741831`'<br>
**RESOURCE** "**Exit Button**" UI\_CONTROL guid='`1073741832`'<br>
**RESOURCE** "**Voice-Over**" UI\_CONTROL guid='`1073741833`'<br>
**RESOURCE** "**Tab**" UI\_CONTROL guid='`1073741834`'<br>
**RESOURCE** "**Chat Button**" UI\_CONTROL guid='`1073741835`'<br>
**RESOURCE** "**Network Status**" UI\_CONTROL guid='`1073741836`'<br>
**RESOURCE** "**Struggle Button**" UI\_CONTROL guid='`1073741837`'<br>
**RESOURCE** "**Voice Chat Button**" UI\_CONTROL guid='`1073741838`'<br>
**RESOURCE** "**Voice Chat Hint Queue**" UI\_CONTROL guid='`1073741839`'

# FILE `test/cases/composites/var_change.gia`

**GRAPH** '*VAR\_TEST*' ENTITY\_NODE\_GRAPH guid='`1073741841`' nodes=7<br>
**GRAPH** '<u>\<composite\></u>*VAR\_TEST\_1*' ENTITY\_NODE\_GRAPH guid='`1610612743`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*VAR\_TEST\_2*' ENTITY\_NODE\_GRAPH guid='`1610612744`' nodes=1 role=dependency<br>
**GRAPH** '<u>\<composite\></u>*VAR\_TEST\_3*' ENTITY\_NODE\_GRAPH guid='`1610612745`' nodes=2 role=dependency
