# Reference index

Scanned 1 file:

- `codetest_3.gia`

## References

### `composite` (3)

| composite | call |
| --- | --- |
| "**Naive execution delay**" | **5**<br>'*Composite with event*'<br>'<u>\<composite\></u>*Test Delay Print*' |
| "**Test Delay Print**" | **3**<br>'*Nested event*' |
| "**Wrapped (Custom Variable)**" | **10**<br>'*Composite with event*'<br>'*Cycle with no entry*'<br>'*Dead composite*' |

### `custom_variable` (10)

| custom\_variable | Type | get | set | trigger |
| --- | --- | --- | --- | --- |
| "**\<dynamic\>**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**1**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**2**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**4**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**5**" | *Int* | **1**<br>'*Dead composite*' | **1**<br>'*Dead composite*' |   |
| "**A**" | *Int* | **1**<br>'*Cycle with no entry*' | **0** | **1**<br>'*Cycle with no entry*' |
| "**B**" | *Int* | **1**<br>'*Cycle with no entry*' | **0** | **1**<br>'*Cycle with no entry*' |
| "**X**" | *Int* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**Y**" | *Int* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**Z**" | *Int* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |

### `timer` (5)

| timer | Type | start | stop | listen |
| --- | --- | --- | --- | --- |
| "**1**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**2**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**3**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**4**" | *onetime* | **1**<br>'*Composite with event*' | **0** | **1**<br>'*Composite with event*' |
| "**Delay**" | *onetime* | **3**<br>'*Nested event*' | **0** | **3**<br>'*Nested event*' |
