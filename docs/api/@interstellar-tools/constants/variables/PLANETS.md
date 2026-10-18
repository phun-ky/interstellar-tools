[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / PLANETS

# Variable: PLANETS

```ts
const PLANETS: PlanetsType;
```

Defined in:
[bodies/planets.ts:32](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/constants/src/bodies/planets.ts#L32)

Represents a dataset of planets and planetoids in the solar system.

::: info

- Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in
  au.

- `orbit.angle` is the true anomaly at J2000 (2000-01-01 12:00 TT). `x`,`y`,`z`
  are the heliocentric position at J2000 in the J2000 ecliptic frame, x towards
  the equinox.

- Both are computed from the J2000 elements in JPL's "Approximate Positions of
  the Planets" (Table 1), and for Ceres and Pluto from the JPL Small-Body
  Database, using this dataset's `a` and `e`.

- Some entries may encode integration direction via a negative `period`; the
  table reflects the raw value.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of planets in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id      | name    | type            | category  | parent | orbit.a   | orbit.e | orbit.period | orbit.angle | radius   | display.color | x          | y           | z          |
| ------- | ------- | --------------- | --------- | ------ | --------- | ------- | ------------ | ----------- | -------- | ------------- | ---------- | ----------- | ---------- |
| mercury | Mercury | silicate planet | planet    | sun    | 0.387 au  | 0.2056  | -87.969 d    | 3.080377    | 2440 km  | #8B8B8B       | -0.1301 au | -0.4472 au  | -0.0246 au |
| venus   | Venus   | silicate planet | planet    | sun    | 0.723 au  | 0.0068  | -224.701 d   | 0.88977     | 6052 km  | #E49B0F       | -0.718 au  | -0.0327 au  | 0.041 au   |
| earth   | Earth   | silicate planet | planet    | sun    | 1 au      | 0.0167  | -365.256 d   | 6.238549    | 6371 km  | #1E90FF       | -0.1772 au | 0.9672 au   | 0 au       |
| mars    | Mars    | desert planet   | planet    | sun    | 1.524 au  | 0.0934  | -686.98 d    | 0.408015    | 3389 km  | #D14A28       | 1.3909 au  | -0.0134 au  | -0.0345 au |
| ceres   | Ceres   | ice planet      | planetoid | sun    | 2.766 au  | 0.079   | -1680.5 d    | 0.106686    | 469.7 km | #C0C0C0       | -2.3475 au | 0.8788 au   | 0.4603 au  |
| jupiter | Jupiter | gas giant       | planet    | sun    | 5.203 au  | 0.0489  | -4332.59 d   | 0.378185    | 69911 km | #C08850       | 3.9953 au  | 2.9459 au   | -0.1016 au |
| saturn  | Saturn  | gas giant       | planet    | sun    | 9.537 au  | 0.0565  | -10759.22 d  | 5.458247    | 58232 km | #D2B48C       | 6.4288 au  | 6.5083 au   | -0.3691 au |
| uranus  | Uranus  | ice giant       | planet    | sun    | 19.191 au | 0.0463  | -30687.15 d  | 2.537459    | 25362 km | #78D6FF       | 14.4012 au | -13.7439 au | -0.2377 au |
| neptune | Neptune | ice giant       | planet    | sun    | 30.069 au | 0.0086  | -60190.03 d  | 4.519475    | 24622 km | #0053D6       | 16.8038 au | -24.9923 au | 0.1274 au  |
| pluto   | Pluto   | ice planet      | planetoid | sun    | 39.482 au | 0.2488  | -90560 d     | 0.436892    | 1188 km  | #B0A99F       | -9.984 au  | -27.916 au  | 5.8767 au  |

</div>

**Example item in dataset:**

```ts
{
  id: 'mercury',
  name: 'Mercury',
  type: 'silicate planet',
  category: 'planet',
  parent: 'sun',
  orbit: {
    /** Semi-major axis in AU */
    a: { value: 0.387, unit: 'au' },
    /** Orbital eccentricity */
    e: 0.2056,
    /** Orbital period in days */
    period: { value: -87.969, unit: 'd' },
    /** True anomaly at J2000 */
    angle: 3.080377 as Radians
  },
  /** Radius in km */
  radius: { value: 2440, unit: 'km' },
  display: {
    /** Visual representation color */
    color: '#8B8B8B'
  },
  /** Heliocentric position at J2000 (J2000 ecliptic frame) in au */
  x: { value: -0.1301, unit: 'au' },
  y: { value: -0.4472, unit: 'au' },
  z: { value: -0.0246, unit: 'au' }
},
```

## See

[PlanetsType](../../types/type-aliases/PlanetsType.md).

## Example

```ts
console.log(PLANETS[0].name); // "Mercury"
```
