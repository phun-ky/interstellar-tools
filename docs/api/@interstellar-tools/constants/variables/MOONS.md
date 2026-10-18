[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / MOONS

# Variable: MOONS

```ts
const MOONS: MoonsType;
```

Defined in:
[bodies/moons.ts:35](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/moons.ts#L35)

Represents a dataset of natural satellites (moons) in the solar system.

::: info

- Units: `a` in astronomical units (au), `period` in days (d), `radius` in
  kilometers (km), `mu` in m³/s².

- `a` and `e` are JPL's mean elements; `orbit.angle` is the true anomaly at
  J2000, from the mean anomaly in JPL Horizons' osculating elements at J2000,
  converted with this dataset's `e`. For near-circular orbits (e < 0.001) it is
  close to the mean anomaly, since the periapsis is barely defined. Irregular
  moons are strongly perturbed by the Sun, so their elements describe J2000
  only.

- `mu` is the moon's G·M from JPL's satellite physical parameters, where JPL
  publishes one.

- Colors are hex strings used only for visual representation.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id        | name      | category             | parent  | orbit.a        | orbit.e  | orbit.period | orbit.retrograde | orbit.angle | radius    | mu (m³/s²)      | display.color                                                          |
| --------- | --------- | -------------------- | ------- | -------------- | -------- | ------------ | ---------------- | ----------- | --------- | --------------- | ---------------------------------------------------------------------- |
| moon      | Moon      | natural satellite    | earth   | 0.00257 au     | 0.0549   | 27.322 d     |                  | 2.41        | 1737.4 km | 4.902800118e+12 | #BFBFBF                                                                |
| phobos    | Phobos    | natural satellite    | mars    | 0.000062668 au | 0.0151   | 0.3189 d     |                  | 3.307969    | 11 km     | 7.087e+5        | [#888888](https://github.com/phun-ky/interstellar-tools/issues/888888) |
| deimos    | Deimos    | natural satellite    | mars    | 0.0001568 au   | 0.0002   | 1.2624 d     |                  | 0.088942    | 6 km      | 9.62e+4         | #A0A0A0                                                                |
| io        | Io        | natural satellite    | jupiter | 0.00282 au     | 0.0041   | 1.769 d      |                  | 5.846065    | 1821 km   | 5.95991547e+12  | #FF8C00                                                                |
| europa    | Europa    | natural satellite    | jupiter | 0.00448 au     | 0.0094   | 3.551 d      |                  | 6.02377     | 1560 km   | 3.2027121e+12   | #E6E6E6                                                                |
| ganymede  | Ganymede  | natural satellite    | jupiter | 0.00715 au     | 0.0013   | 7.155 d      |                  | 4.832832    | 2634 km   | 9.88783275e+12  | #8B4513                                                                |
| callisto  | Callisto  | natural satellite    | jupiter | 0.01258 au     | 0.0074   | 16.689 d     |                  | 1.500362    | 2410 km   | 7.1792834e+12   | [#696969](https://github.com/phun-ky/interstellar-tools/issues/696969) |
| amalthea  | Amalthea  | natural satellite    | jupiter | 0.00121258 au  | 0.003    | 0.498 d      |                  | 5.866533    | 83 km     | 1.6456e+8       | #A0522D                                                                |
| himalia   | Himalia   | natural satellite    | jupiter | 0.076465 au    | 0.16     | 250.2 d      |                  | 1.686531    | 85 km     | 1.5155e+8       | #A9A9A9                                                                |
| metis     | Metis     | natural satellite    | jupiter | 0.000855627 au | 0.0002   | 0.295 d      |                  | 6.248627    | 21 km     | 2.5e+6          | #CD853F                                                                |
| thebe     | Thebe     | natural satellite    | jupiter | 0.00148331 au  | 0.0176   | 0.675 d      |                  | 3.183597    | 49 km     | 3.015e+7        | #B87333                                                                |
| pasiphae  | Pasiphae  | irregular satellite  | jupiter | 0.157 au       | 0.407    | 735 d        | yes              | 4.08832     | 30 km     |                 | #8B0000                                                                |
| titan     | Titan     | natural satellite    | saturn  | 0.00817 au     | 0.0288   | 15.945 d     |                  | 2.868371    | 2575 km   | 8.9781371e+12   | #D4A017                                                                |
| enceladus | Enceladus | natural satellite    | saturn  | 0.00159 au     | 0.0047   | 1.37 d       |                  | 0.122504    | 252 km    | 7.21037e+9      | #F0FFFF                                                                |
| rhea      | Rhea      | natural satellite    | saturn  | 0.00352411 au  | 0.0012   | 4.518 d      |                  | 3.610039    | 764 km    | 1.5394175e+11   | #C0C0C0                                                                |
| iapetus   | Iapetus   | natural satellite    | saturn  | 0.0238 au      | 0.0283   | 79.33 d      |                  | 3.604813    | 735 km    | 1.2051511e+11   | #2F4F4F                                                                |
| hyperion  | Hyperion  | irregular satellite  | saturn  | 0.00990322 au  | 0.105    | 21.3 d       |                  | 1.437895    | 135 km    | 3.7049e+8       | #CDAA7D                                                                |
| phoebe    | Phoebe    | retrograde satellite | saturn  | 0.0865 au      | 0.1634   | 550 d        | yes              | 1.330749    | 106 km    | 5.5479e+8       | #483D8B                                                                |
| titania   | Titania   | natural satellite    | uranus  | 0.00292 au     | 0.0011   | 8.706 d      |                  | 1.300938    | 788 km    | 2.269e+11       | #8B8886                                                                |
| oberon    | Oberon    | natural satellite    | uranus  | 0.00390053 au  | 0.0014   | 13.46 d      |                  | 1.634613    | 761 km    | 2.053e+11       | #6E6E6E                                                                |
| miranda   | Miranda   | natural satellite    | uranus  | 0.000867967 au | 0.0013   | 1.41 d       |                  | 1.085483    | 235 km    | 4.3e+9          | #CCCCCC                                                                |
| ariel     | Ariel     | natural satellite    | uranus  | 0.00127628 au  | 0.0012   | 2.52 d       |                  | 2.667861    | 578 km    | 8.35e+10        | #A9A9A9                                                                |
| umbriel   | Umbriel   | natural satellite    | uranus  | 0.00177801 au  | 0.0039   | 4.14 d       |                  | 4.725942    | 584 km    | 8.51e+10        | #5F9EA0                                                                |
| triton    | Triton    | retrograde satellite | neptune | 0.002375 au    | 0.000016 | 5.87685 d    | yes              | 5.99451     | 1353.4 km | 1.42849546e+12  | #C2A17C                                                                |
| nereid    | Nereid    | natural satellite    | neptune | 0.0369 au      | 0.75     | 360.14 d     |                  | 3.278379    | 170 km    |                 | #87CEFA                                                                |
| proteus   | Proteus   | natural satellite    | neptune | 0.000786107 au | 0.0005   | 1.12 d       |                  | 4.949202    | 210 km    | 2.58342e+9      | [#708090](https://github.com/phun-ky/interstellar-tools/issues/708090) |
| halimede  | Halimede  | irregular satellite  | neptune | 0.110901 au    | 0.521    | 1879 d       | yes              | 3.476227    | 62 km     |                 | #A9A9A9                                                                |

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
    period: { value: 27.322, unit: 'd' },
    /** Initial angle in orbit at J2000 */
    angle: 2.41 as Radians
  },
  /** Radius in km */
  radius: { value: 1737.4, unit: 'km' },
  mu: 4.902800118e12,
  display: {
    /** Visual representation color */
    color: '#BFBFBF' // Light gray (realistic lunar appearance)
  }
},
```

## Example

```ts
console.log(MOONS[0].name); // "Moon"
```
