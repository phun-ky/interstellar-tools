[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / SYSTEMS

# Variable: SYSTEMS

```ts
const SYSTEMS: SystemsType;
```

Defined in:
[bodies/systems.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/systems.ts#L29)

Predefined systems: the barycenters that stars and planets orbit.

::: info

- Systems don't list their members; stars and planets name their system as
  `parent`.

- Systems nest: `alpha-centauri-ab` orbits inside `alpha-centauri`.

- `distance` (from the Sun) and galactic `x`,`y`,`z` are in light-years (ly).

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of systems in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id                | name              | kind      | parent         | orbit.a               | orbit.e | orbit.period | orbit.retrograde | orbit.angle        | distance  | x         | y                     | z     |
| ----------------- | ----------------- | --------- | -------------- | --------------------- | ------- | ------------ | ---------------- | ------------------ | --------- | --------- | --------------------- | ----- |
| solar-system      | Solar System      | planetary | milky-way      | 27000 ly              | 0.07    | 230 Myr      |                  | 1.5707963267948966 | 0 ly      | 0 ly      | 27000 ly              | 20 ly |
| spica             | Spica             | binary    | milky-way      | 27201.148872795795 ly | 0.006   | 550 Myr      |                  | 1.5616057972952029 | 250 ly    | 250 ly    | 27201.148872795795 ly | 0 ly  |
| alpha-centauri    | Alpha Centauri    | multiple  | milky-way      | 27000.000353646294 ly | 0.07    | 230 Myr      |                  | 1.570634474946578  | 4.37 ly   | 4.37 ly   | 27000.000353646294 ly | 0 ly  |
| trappist-1        | TRAPPIST-1        | planetary | milky-way      | 27000.030618468638 ly | 0.07    | 230 Myr      |                  | 1.5692903279334491 | 40.662 ly | 40.662 ly | 27000.030618468638 ly | 0 ly  |
| sirius            | Sirius            | binary    | milky-way      | 27000.001372178926 ly | 0.07    | 230 Myr      |                  | 1.5704775119908836 | 8.608 ly  | 8.608 ly  | 27000.001372178926 ly | 0 ly  |
| alpha-centauri-ab | Alpha Centauri AB | binary    | alpha-centauri | 503 au                | 0.5     | 547 kyr      |                  | 3.099566485428788  |           |           |                       |       |

</div>

**Example item in dataset:**

```ts
{
  id: 'alpha-centauri',
  name: 'Alpha Centauri',
  kind: 'multiple',
  parent: 'milky-way',
  // ~4.4 ly away, so its galactic orbit is approximated by the Sun's
  orbit: {
    a: { value: 27000.000353646294, unit: 'ly' },
    e: 0.07,
    period: { value: 230, unit: 'Myr' },
    angle: 1.570634474946578 as Radians
  },
  distance: { value: 4.37, unit: 'ly' },
  x: { value: 4.37, unit: 'ly' },
  y: { value: 27000.000353646294, unit: 'ly' },
  z: { value: 0, unit: 'ly' }
},
{
  // TRAPPIST-1's star and seven planets; 40.662 ly away (Gaia DR3). Placed like Alpha
  // Centauri, at its distance along x with the Sun's galactic orbit
  id: 'trappist-1',
  name: 'TRAPPIST-1',
  kind: 'planetary',
  parent: 'milky-way',
  orbit: {
    a: { value: 27000.030618468638, unit: 'ly' },
    e: 0.07,
    period: { value: 230, unit: 'Myr' },
    angle: 1.5692903279334491 as Radians
  },
  distance: { value: 40.662, unit: 'ly' },
  x: { value: 40.662, unit: 'ly' },
  y: { value: 27000.030618468638, unit: 'ly' },
  z: { value: 0, unit: 'ly' }
},
{
  // Sirius's two stars orbit this barycenter; 8.608 ly away (Bond et al. 2017). Placed
  // like Alpha Centauri, at its distance along x with the Sun's galactic orbit
  id: 'sirius',
  name: 'Sirius',
  kind: 'binary',
  parent: 'milky-way',
  orbit: {
    a: { value: 27000.001372178926, unit: 'ly' },
    e: 0.07,
    period: { value: 230, unit: 'Myr' },
    angle: 1.5704775119908836 as Radians
  },
  distance: { value: 8.608, unit: 'ly' },
  x: { value: 8.608, unit: 'ly' },
  y: { value: 27000.001372178926, unit: 'ly' },
  z: { value: 0, unit: 'ly' }
},
{
  // The A-B pair, orbiting the system barycenter opposite Proxima (Kervella et al. 2017)
  id: 'alpha-centauri-ab',
  name: 'Alpha Centauri AB',
  kind: 'binary',
  parent: 'alpha-centauri',
  orbit: {
    a: { value: 503, unit: 'au' }, // 8700 au × m_P / (m_AB + m_P)
    e: 0.5,
    period: { value: 547, unit: 'kyr' },
    angle: 3.099566485428788 as Radians
  }
}
```

## Example

```ts
console.log(SYSTEMS[0].name); // "Solar System"
```

## See

- [SystemsType](../../types/type-aliases/SystemsType.md)
- https://en.wikipedia.org/wiki/Alpha_Centauri
