[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / PLANETS

# Variable: PLANETS

```ts
const PLANETS: PlanetsType;
```

Defined in:
[bodies/planets.ts:27](https://github.com/phun-ky/interstellar-tools/blob/eba42da13df2a93d9bf5de153f401b02d475cf3b/packages/constants/src/bodies/planets.ts#L27)

Represents a dataset of planets and planetoids in the solar system.

::: info

- Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in
  au.
- Some entries may encode integration direction via a negative `period`; the
  table reflects the raw value.

:::

## Full list of planets in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name    | type            | category  | system | a         | e      | radius   | color   | angle      | period      | x         | y         | z        |
| ------- | --------------- | --------- | ------ | --------- | ------ | -------- | ------- | ---------- | ----------- | --------- | --------- | -------- |
| Mercury | silicate planet | planet    | Sun    | 0.387 au  | 0.2056 | 2440 km  | #8B8B8B | 0.843      | -87.969 d   | 0.387 au  | 0.024 au  | 0.001 au |
| Venus   | silicate planet | planet    | Sun    | 0.723 au  | 0.0068 | 6052 km  | #E49B0F | 1.338      | -224.701 d  | 0.723 au  | 0.012 au  | 0.002 au |
| Earth   | silicate planet | planet    | Sun    | 1 au      | 0.0167 | 6371 km  | #1E90FF | 1.796      | -365.256 d  | 1 au      | 0.017 au  | 0 au     |
| Mars    | desert planet   | planet    | Sun    | 1.524 au  | 0.0934 | 3389 km  | #D14A28 | 2.182      | -686.98 d   | 1.524 au  | 0.024 au  | 0.002 au |
| Ceres   | ice planet      | planetoid | Sun    | 2.766 au  | 0.079  | 469.7 km | #C0C0C0 | 1.97920337 | -1680.5 d   | 2.766 au  | 0 au      | 0 au     |
| Jupiter | gas giant       | planet    | Sun    | 5.203 au  | 0.0489 | 69911 km | #C08850 | 0.634      | -4332.59 d  | 5.203 au  | 0.017 au  | 0.003 au |
| Saturn  | gas giant       | planet    | Sun    | 9.537 au  | 0.0565 | 58232 km | #D2B48C | 1.101      | -10759.22 d | 9.537 au  | 0.019 au  | 0.003 au |
| Uranus  | ice giant       | planet    | Sun    | 19.191 au | 0.0463 | 25362 km | #78D6FF | 2.983      | -30687.15 d | 19.191 au | -0.021 au | 0.004 au |
| Neptune | ice giant       | planet    | Sun    | 30.069 au | 0.0086 | 24622 km | #0053D6 | 0.526      | -60190.03 d | 30.069 au | 0.03 au   | 0.005 au |
| Pluto   | ice planet      | planetoid | Sun    | 39.482 au | 0.2488 | 1188 km  | #B0A99F | 4.585      | -90560 d    | 39.482 au | -0.033 au | 0.006 au |

</div>

**Example item in dataset:**

```ts
{
  name: 'Mercury',
  type: 'silicate planet',
  category: 'planet',
  system: 'Sun',
  /** Semi-major axis in AU */
  a: { value: 0.387, unit: 'au' },
  /** Orbital eccentricity */
  e: 0.2056,
  /** Radius in km */
  radius: { value: 2440, unit: 'km' },
  /** Visual representation color */
  color: '#8B8B8B',
  /** Initial angle in orbit at J2000 */
  angle: 0.843 as Radians,
  /** Orbital period in days */
  period: { value: -87.969, unit: 'd' },
  /** Initial position coordinates in AU */
  x: { value: 0.387, unit: 'au' },
  y: { value: 0.024, unit: 'au' },
  z: { value: 0.001, unit: 'au' }
},
```

## See

[PlanetsType](../../types/type-aliases/PlanetsType.md).

## Example

```ts
console.log(PLANETS[0].name); // "Mercury"
```
