[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / MOONS

# Variable: MOONS

```ts
const MOONS: MoonsType;
```

Defined in:
[bodies/moons.ts:28](https://github.com/phun-ky/interstellar-tools/blob/9c13350dafd209031a6cfebe54b6883c404a0515/packages/constants/src/bodies/moons.ts#L28)

Represents a dataset of natural satellites (moons) in the solar system.

::: info

- Units: `a` in astronomical units (au), `period` in days (d), `radius` in
  kilometers (km).
- Colors are hex strings used only for visual representation.
- The table below is **NOT CURRENTLY** generated from the dataset at build time.

:::

## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name      | category             | system  | a           | e        | period    | radius    | color                                                                  | angle |
| --------- | -------------------- | ------- | ----------- | -------- | --------- | --------- | ---------------------------------------------------------------------- | ----- |
| Moon      | natural satellite    | Earth   | 0.00257 au  | 0.0549   | -27.322 d | 1737.4 km | #BFBFBF                                                                | 2.41  |
| Phobos    | natural satellite    | Mars    | 0.00006 au  | 0.0151   | -0.3189 d | 11 km     | [#888888](https://github.com/phun-ky/interstellar-tools/issues/888888) | 0     |
| Deimos    | natural satellite    | Mars    | 0.00016 au  | 0.0002   | -1.2624 d | 6 km      | #A0A0A0                                                                | 0     |
| Io        | natural satellite    | Jupiter | 0.00282 au  | 0.0041   | -1.769 d  | 1821 km   | #FF8C00                                                                | 0     |
| Europa    | natural satellite    | Jupiter | 0.00448 au  | 0.0094   | -3.551 d  | 1560 km   | #E6E6E6                                                                | 0     |
| Ganymede  | natural satellite    | Jupiter | 0.00715 au  | 0.0013   | -7.155 d  | 2634 km   | #8B4513                                                                | 0     |
| Callisto  | natural satellite    | Jupiter | 0.01258 au  | 0.0074   | -16.689 d | 2410 km   | [#696969](https://github.com/phun-ky/interstellar-tools/issues/696969) | 0     |
| Amalthea  | natural satellite    | Jupiter | 0.0025 au   | 0.003    | -0.498 d  | 83 km     | #A0522D                                                                | 0     |
| Himalia   | natural satellite    | Jupiter | 0.045 au    | 0.25     | -250.2 d  | 85 km     | #A9A9A9                                                                | 0     |
| Metis     | natural satellite    | Jupiter | 0.00179 au  | 0.0002   | -0.295 d  | 21 km     | #CD853F                                                                | 0     |
| Thebe     | natural satellite    | Jupiter | 0.00222 au  | 0.0176   | -0.675 d  | 49 km     | #B87333                                                                | 0     |
| Pasiphae  | irregular satellite  | Jupiter | 0.157 au    | 0.407    | 735 d     | 30 km     | #8B0000                                                                | 0     |
| Titan     | natural satellite    | Saturn  | 0.00817 au  | 0.0288   | -15.945 d | 2575 km   | #D4A017                                                                | 0     |
| Enceladus | natural satellite    | Saturn  | 0.00159 au  | 0.0047   | -1.37 d   | 252 km    | #F0FFFF                                                                | 0     |
| Rhea      | natural satellite    | Saturn  | 0.00874 au  | 0.0012   | -4.518 d  | 764 km    | #C0C0C0                                                                | 0     |
| Iapetus   | natural satellite    | Saturn  | 0.0238 au   | 0.0283   | -79.33 d  | 735 km    | #2F4F4F                                                                | 0     |
| Hyperion  | irregular satellite  | Saturn  | 0.00873 au  | 0.123    | -21.3 d   | 135 km    | #CDAA7D                                                                | 0     |
| Phoebe    | retrograde satellite | Saturn  | 0.0865 au   | 0.1634   | 550 d     | 106 km    | #483D8B                                                                | 0     |
| Titania   | natural satellite    | Uranus  | 0.00292 au  | 0.0011   | -8.706 d  | 788 km    | #8B8886                                                                | 0     |
| Oberon    | natural satellite    | Uranus  | 0.00384 au  | 0.0014   | -13.46 d  | 761 km    | #6E6E6E                                                                | 0     |
| Miranda   | natural satellite    | Uranus  | 0.00129 au  | 0.0013   | -1.41 d   | 235 km    | #CCCCCC                                                                | 0     |
| Ariel     | natural satellite    | Uranus  | 0.00191 au  | 0.0012   | -2.52 d   | 578 km    | #A9A9A9                                                                | 0     |
| Umbriel   | natural satellite    | Uranus  | 0.00266 au  | 0.0039   | -4.14 d   | 584 km    | #5F9EA0                                                                | 0     |
| Triton    | natural satellite    | Neptune | 0.002375 au | 0.000016 | 5.87685 d | 1353.4 km | #C2A17C                                                                | 0     |
| Nereid    | natural satellite    | Neptune | 0.0369 au   | 0.75     | -360.14 d | 170 km    | #87CEFA                                                                | 0     |
| Proteus   | natural satellite    | Neptune | 0.00082 au  | 0.0005   | -1.12 d   | 210 km    | [#708090](https://github.com/phun-ky/interstellar-tools/issues/708090) | 0     |
| Halimede  | irregular satellite  | Neptune | 0.0985 au   | 0.5711   | -1879 d   | 62 km     | #A9A9A9                                                                | 0     |

</div>

## See

[MoonsType](../../types/type-aliases/MoonsType.md).

**Example item in dataset:**

```ts
{
  name: 'Moon',
  category: 'natural satellite',
  system: 'Earth',
  /** Semi-major axis in AU */
  a: { value: 0.00257, unit: 'au' },
  /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
  e: 0.0549,
  /** Orbital period in days */
  period: { value: -27.322, unit: 'd' },
  /** Radius in km */
  radius: { value: 1737.4, unit: 'km' },
  /** Visual representation color */
  color: '#BFBFBF', // Light gray (realistic lunar appearance)
  /** Initial angle in orbit at J2000 */
  angle: 2.41 as Radians
},
```

## Example

```ts
console.log(MOONS[0].name); // "Moon"
```
