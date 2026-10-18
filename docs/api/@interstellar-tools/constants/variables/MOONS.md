[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / MOONS

# Variable: MOONS

```ts
const MOONS: MoonsType;
```

Defined in:
[bodies/moons.ts:29](https://github.com/phun-ky/interstellar-tools/blob/252dd3ac244f95681e2ed31cec6cd670ff1f9a83/packages/constants/src/bodies/moons.ts#L29)

Represents a dataset of natural satellites (moons) in the solar system.

::: info

- Units: `a` in astronomical units (au), `period` in days (d), `radius` in
  kilometers (km).

- Colors are hex strings used only for visual representation.

- The table below is **NOT CURRENTLY** generated from the dataset at build time.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id        | name      | category             | parent  | orbit.a     | orbit.e  | orbit.period | orbit.angle | radius    | color                                                                  |
| --------- | --------- | -------------------- | ------- | ----------- | -------- | ------------ | ----------- | --------- | ---------------------------------------------------------------------- |
| moon      | Moon      | natural satellite    | earth   | 0.00257 au  | 0.0549   | -27.322 d    | 2.41        | 1737.4 km | #BFBFBF                                                                |
| phobos    | Phobos    | natural satellite    | mars    | 0.00006 au  | 0.0151   | -0.3189 d    | 0           | 11 km     | [#888888](https://github.com/phun-ky/interstellar-tools/issues/888888) |
| deimos    | Deimos    | natural satellite    | mars    | 0.00016 au  | 0.0002   | -1.2624 d    | 0           | 6 km      | #A0A0A0                                                                |
| io        | Io        | natural satellite    | jupiter | 0.00282 au  | 0.0041   | -1.769 d     | 0           | 1821 km   | #FF8C00                                                                |
| europa    | Europa    | natural satellite    | jupiter | 0.00448 au  | 0.0094   | -3.551 d     | 0           | 1560 km   | #E6E6E6                                                                |
| ganymede  | Ganymede  | natural satellite    | jupiter | 0.00715 au  | 0.0013   | -7.155 d     | 0           | 2634 km   | #8B4513                                                                |
| callisto  | Callisto  | natural satellite    | jupiter | 0.01258 au  | 0.0074   | -16.689 d    | 0           | 2410 km   | [#696969](https://github.com/phun-ky/interstellar-tools/issues/696969) |
| amalthea  | Amalthea  | natural satellite    | jupiter | 0.0025 au   | 0.003    | -0.498 d     | 0           | 83 km     | #A0522D                                                                |
| himalia   | Himalia   | natural satellite    | jupiter | 0.045 au    | 0.25     | -250.2 d     | 0           | 85 km     | #A9A9A9                                                                |
| metis     | Metis     | natural satellite    | jupiter | 0.00179 au  | 0.0002   | -0.295 d     | 0           | 21 km     | #CD853F                                                                |
| thebe     | Thebe     | natural satellite    | jupiter | 0.00222 au  | 0.0176   | -0.675 d     | 0           | 49 km     | #B87333                                                                |
| pasiphae  | Pasiphae  | irregular satellite  | jupiter | 0.157 au    | 0.407    | 735 d        | 0           | 30 km     | #8B0000                                                                |
| titan     | Titan     | natural satellite    | saturn  | 0.00817 au  | 0.0288   | -15.945 d    | 0           | 2575 km   | #D4A017                                                                |
| enceladus | Enceladus | natural satellite    | saturn  | 0.00159 au  | 0.0047   | -1.37 d      | 0           | 252 km    | #F0FFFF                                                                |
| rhea      | Rhea      | natural satellite    | saturn  | 0.00874 au  | 0.0012   | -4.518 d     | 0           | 764 km    | #C0C0C0                                                                |
| iapetus   | Iapetus   | natural satellite    | saturn  | 0.0238 au   | 0.0283   | -79.33 d     | 0           | 735 km    | #2F4F4F                                                                |
| hyperion  | Hyperion  | irregular satellite  | saturn  | 0.00873 au  | 0.123    | -21.3 d      | 0           | 135 km    | #CDAA7D                                                                |
| phoebe    | Phoebe    | retrograde satellite | saturn  | 0.0865 au   | 0.1634   | 550 d        | 0           | 106 km    | #483D8B                                                                |
| titania   | Titania   | natural satellite    | uranus  | 0.00292 au  | 0.0011   | -8.706 d     | 0           | 788 km    | #8B8886                                                                |
| oberon    | Oberon    | natural satellite    | uranus  | 0.00384 au  | 0.0014   | -13.46 d     | 0           | 761 km    | #6E6E6E                                                                |
| miranda   | Miranda   | natural satellite    | uranus  | 0.00129 au  | 0.0013   | -1.41 d      | 0           | 235 km    | #CCCCCC                                                                |
| ariel     | Ariel     | natural satellite    | uranus  | 0.00191 au  | 0.0012   | -2.52 d      | 0           | 578 km    | #A9A9A9                                                                |
| umbriel   | Umbriel   | natural satellite    | uranus  | 0.00266 au  | 0.0039   | -4.14 d      | 0           | 584 km    | #5F9EA0                                                                |
| triton    | Triton    | retrograde satellite | neptune | 0.002375 au | 0.000016 | 5.87685 d    | 0           | 1353.4 km | #C2A17C                                                                |
| nereid    | Nereid    | natural satellite    | neptune | 0.0369 au   | 0.75     | -360.14 d    | 0           | 170 km    | #87CEFA                                                                |
| proteus   | Proteus   | natural satellite    | neptune | 0.00082 au  | 0.0005   | -1.12 d      | 0           | 210 km    | [#708090](https://github.com/phun-ky/interstellar-tools/issues/708090) |
| halimede  | Halimede  | irregular satellite  | neptune | 0.0985 au   | 0.5711   | 1879 d       | 0           | 62 km     | #A9A9A9                                                                |

</div>

## See

[MoonsType](../../types/type-aliases/MoonsType.md).

**Example item in dataset:**

```ts
{
  id: 'moon',
  name: 'Moon',
  category: 'natural satellite',
  parent: 'earth',
  orbit: {
    /** Semi-major axis in AU */
    a: { value: 0.00257, unit: 'au' },
    /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
    e: 0.0549,
    /** Orbital period in days */
    period: { value: -27.322, unit: 'd' },
    /** Initial angle in orbit at J2000 */
    angle: 2.41 as Radians
  },
  /** Radius in km */
  radius: { value: 1737.4, unit: 'km' },
  /** Visual representation color */
  color: '#BFBFBF' // Light gray (realistic lunar appearance)
},
```

## Example

```ts
console.log(MOONS[0].name); // "Moon"
```
