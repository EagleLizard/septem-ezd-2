
# Generating my own unique-enough ids

I may want to write my own id generator. The idea is to:

1. define a charset to represent the IDs with
1. generate a sequence of cryptographically secure random bits
1. use the minimum amount of bits to encode into the charset

I may want to remove visually ambiguous chars, like the letter "o" (looks like number `0`), lowercase L "l" and uppercase "I" (looks like number `1`), etc.

[This guide from the NIH](https://pmc.ncbi.nlm.nih.gov/articles/PMC3541865/) has a guide.

[This stackoverflow comment](https://stackoverflow.com/a/58098360/4677252) has a good list with reasoning. [This comment from the same post](https://stackoverflow.com/a/12552204/4677252) and related discussion have good resources.

- aA`aA`
- bB`bB`
    - b - b6G `b6G`
    - B - B8 `B8`
- cC`cC`
    - cC
- dD`dD`
- eE`eE`
- fF`fF` - f (?)
- gG`gG`
    - g - g9q`g9q`
    - G - Gb6`Gb6`
- hH`hH`
- iI`iI`
    - I -  I1l`I1l`
- jJ`jJ`
- kK`kK`
    - kK - kK`kK`
- lL`lL`
    - l - lI1`lI1`
- mM`mM`
- nN`nN`
- oO`oO`
    - oO - oO0DQ`oO0DQ`
- pP`pP`
    - P - Pp`Pp`
- qQ`qQ`
    - q - qg9`qg9`
    - Q - QoO0D`QoO0D`
- rR`rR`
- sS`sS`
    - sS - sS5`sS5`
- tT`tT`
- uU`uU`
    - uU - uUvV`uUvV`
- vV`vV`
    - vV - vVuU`vVuU`
- wW`wW`
    - wW - wW`wW`
- xX`xX`
    - xX - xX`xX`
- yY`yY`
    - yY - yY`yY`
- zZ`zZ`
    - zZ - zZ2`zZ2`

unambiguous chars:

```
acdefhijkmnprtvwxyADEFHJLMNRT23456789
```

~37 chars `100101` 6 bits.

If I can remove 5+ chars, I can get down to 5 bits.

- i - internationally confusing. See: Europe, Turkey
- k - close to x (kx`kx`)
- p - maybe hard if dyslexic?
- D - close to O/Q/0
- F - close to E, could render similar to lowercase in fonts
    - put back in
- 4 - close to A
    - put back in
- 9 - close to g

Removing `ikpD9` gives:

```
acdefhjmnrtvwxyAEFHJLMNRT2345678
```

30 chars `11110`, 5 bits.

## Example `"abcd1234"`

For the charset: `"abcd1234"`, 8 chars. 8 chars can be represented with 3 bits:

| char | bits | int |
|-|-|-|
| 'a' | `000` | 0 |
| 'b' | `001` | 1 |
| 'c' | `010` | 2 |
| 'd' | `011` | 3 |
| '1' | `100` | 4 |
| '2' | `101` | 5 |
| '3' | `110` | 6 |
| '4' | `111` | 7 |

Given 2 random bytes `0x5d 0xac`:

```
0x5d     0xac
01011101 10101100
c  4  d   c  6  a -- left to right
a2  3  6   2  1   -- right to left
```

I can take the bits from left to right, or right to left.

Taken l2r: `c4dc6a`

Taken r2l: `a23621`

## Example `"acdefhjmnrtvwxyAEFHJLMNRT2345678"`

|char|bits|int|
|-|-|-|
| a | `00000` | 0 |
| c | `00001` | 1 |
| d | `00010` | 2 |
| e | `00011` | 3 |
| f | `00100` | 4 |
| h | `00101` | 5 |
| j | `00110` | 6 |
| m | `00111` | 7 |
| n | `01000` | 8 |
| r | `01001` | 9 |
| t | `01010` | 10 |
| v | `01011` | 11 |
| w | `01100` | 12 |
| x | `01101` | 13 |
| y | `01110` | 14 |
| A | `01111` | 15 |
| E | `10000` | 16 |
| F | `10001` | 17 |
| H | `10010` | 18 |
| J | `10011` | 19 |
| L | `10100` | 20 |
| M | `10101` | 21 |
| N | `10110` | 22 |
| R | `10111` | 23 |
| T | `11000` | 24 |
| 2 | `11001` | 25 |
| 3 | `11010` | 26 |
| 4 | `11011` | 27 |
| 5 | `11100` | 28 |
| 6 | `11101` | 29 |
| 7 | `11110` | 30 |
| 8 | `11111` | 31 |

Given 2 random bytes (hex): `5d ac`:

```
5d     ac
01011101 10101100
01011 10110 10110 0 - l2r
v     N     N     a
0 10111 01101 01100 - r2l
a R     x     w
```

l2r: `vNNa`

r2l: `aRxw`

Given 4 random bytes: `d5 36 3a 08`:

```
d5       36       3a       08
11010101 00110110 00111010 00001000
11010 10100 11011 00011 10100 00010 00
3     L     4     e     L     d     a
11 01010 10011 01100 01110 10000 01000
e  t     J     w     y     E     n
```

l2r: `3L4eLda`

r2l: `etJwyEn`

```
c0       25       f3       69
11000000 00100101 11110011 01101001
11000 00000 10010 11111 00110 11010 01
T     a     H     8     j     3     c
11 00000 00010 01011 11100 11011 01001
e  a     d     v     5     4     r
```

l2r: `TaH8j3c`

r2l: `eadv54r`

```
11       11       11       3F
00010001 00010001 00010001 00111111
00010 00100 01000 10001 00010 01111 11
d     f     n     F     d     A     e
```

l2r: `dfnFdAe`

```
24 1a d7 44 a4 66 a7 fa
-----
24       1a       d7       44
00100100 00011010 11010111 01000100
a4       66       a7       fa
10100100 01100110 10100111 11111010
-----
00100 10000 01101 01101 01110 10001
f     E     x     x     y     F
00101 00100 01100 11010 10011 11111
h     f     w     3     J     8
1010
t
```

l2r: `fExxyFhfw3J8t`


## Example `"acdefhijkmnprtvwxyADEFHJLMNRT23456789"`

| char | bits | int |
|-|-|-|
| a | `000000` | 0 |
| c | `000001` | 1 |
| d | `000010` | 2 |
| e | `000011` | 3 |
| f | `000100` | 4 |
| h | `000101` | 5 |
| i | `000110` | 6 |
| j | `000111` | 7 |
| k | `001000` | 8 |
| m | `001001` | 9 |
| n | `001010` | 10 |
| p | `001011` | 11 |
| r | `001100` | 12 |
| t | `001101` | 13 |
| v | `001110` | 14 |
| w | `001111` | 15 |
| x | `010000` | 16 |
| y | `010001` | 17 |
| A | `010010` | 18 |
| D | `010011` | 19 |
| E | `010100` | 20 |
| F | `010101` | 21 |
| H | `010110` | 22 |
| J | `010111` | 23 |
| L | `011000` | 24 |
| M | `011001` | 25 |
| N | `011010` | 26 |
| R | `011011` | 27 |
| T | `011100` | 28 |
| 2 | `011101` | 29 |
| 3 | `011110` | 30 |
| 4 | `011111` | 31 |
| 5 | `100000` | 32 |
| 6 | `100001` | 33 |
| 7 | `100010` | 34 |
| 8 | `100011` | 35 |
| 9 | `100100` | 36 |

1111 1111
