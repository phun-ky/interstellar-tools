[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / PLANETS

# Variable: PLANETS

```ts
const PLANETS: PlanetsType;
```

Defined in:
[bodies/planets.ts:28](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/constants/src/bodies/planets.ts#L28)

Represents a dataset of planets and planetoids in the solar system.

::: info

- Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in
  au.

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

| id      | name    | type            | category  | parent | orbit.a   | orbit.e | orbit.period | orbit.angle | radius   | color   | x         | y         | z        |
| ------- | ------- | --------------- | --------- | ------ | --------- | ------- | ------------ | ----------- | -------- | ------- | --------- | --------- | -------- |
| mercury | Mercury | silicate planet | planet    | sun    | 0.387 au  | 0.2056  | -87.969 d    | 0.843       | 2440 km  | #8B8B8B | 0.387 au  | 0.024 au  | 0.001 au |
| venus   | Venus   | silicate planet | planet    | sun    | 0.723 au  | 0.0068  | -224.701 d   | 1.338       | 6052 km  | #E49B0F | 0.723 au  | 0.012 au  | 0.002 au |
| earth   | Earth   | silicate planet | planet    | sun    | 1 au      | 0.0167  | -365.256 d   | 1.796       | 6371 km  | #1E90FF | 1 au      | 0.017 au  | 0 au     |
| mars    | Mars    | desert planet   | planet    | sun    | 1.524 au  | 0.0934  | -686.98 d    | 2.182       | 3389 km  | #D14A28 | 1.524 au  | 0.024 au  | 0.002 au |
| ceres   | Ceres   | ice planet      | planetoid | sun    | 2.766 au  | 0.079   | -1680.5 d    | 1.97920337  | 469.7 km | #C0C0C0 | 2.766 au  | 0 au      | 0 au     |
| jupiter | Jupiter | gas giant       | planet    | sun    | 5.203 au  | 0.0489  | -4332.59 d   | 0.634       | 69911 km | #C08850 | 5.203 au  | 0.017 au  | 0.003 au |
| saturn  | Saturn  | gas giant       | planet    | sun    | 9.537 au  | 0.0565  | -10759.22 d  | 1.101       | 58232 km | #D2B48C | 9.537 au  | 0.019 au  | 0.003 au |
| uranus  | Uranus  | ice giant       | planet    | sun    | 19.191 au | 0.0463  | -30687.15 d  | 2.983       | 25362 km | #78D6FF | 19.191 au | -0.021 au | 0.004 au |
| neptune | Neptune | ice giant       | planet    | sun    | 30.069 au | 0.0086  | -60190.03 d  | 0.526       | 24622 km | #0053D6 | 30.069 au | 0.03 au   | 0.005 au |
| pluto   | Pluto   | ice planet      | planetoid | sun    | 39.482 au | 0.2488  | -90560 d     | 4.585       | 1188 km  | #B0A99F | 39.482 au | -0.033 au | 0.006 au |

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
    /** Initial angle in orbit at J2000 */
    angle: 0.843 as Radians
  },
  /** Radius in km */
  radius: { value: 2440, unit: 'km' },
  /** Visual representation color */
  color: '#8B8B8B',
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
