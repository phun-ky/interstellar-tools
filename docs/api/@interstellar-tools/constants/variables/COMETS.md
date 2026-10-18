[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / COMETS

# Variable: COMETS

```ts
const COMETS: CometsType;
```

Defined in:
[bodies/comets.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/comets.ts#L30)

Represents a collection of well-known comets within the solar system simulation.

::: info

- Units: `a` (au), `period` (days), `radius` (km); angles `i`, `w`, `om` in
  degrees.

- `orbit.angle` is the true anomaly at J2000, from the mean anomaly in JPL
  Horizons' osculating elements at J2000, converted with this dataset's `e`.

- `period` is always positive; retrograde orbits have `retrograde: true`.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of comets in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id                        | name                            | type               | category             | parent | orbit.a   | orbit.e | orbit.i | orbit.w | orbit.om | orbit.angle | orbit.period | orbit.retrograde | orbit.q  | display.color | display.size | radius |
| ------------------------- | ------------------------------- | ------------------ | -------------------- | ------ | --------- | ------- | ------- | ------- | -------- | ----------- | ------------ | ---------------- | -------- | ------------- | ------------ | ------ |
| 1p-halley                 | Halley's Comet                  | periodic comet     | halley-type comet    | sun    | 17.834 au | 0.96714 | 162.26  | 111.33  | 58.42    | 2.97966     | 27576 d      | yes              | 0.586 au | #FFFFFF       | 5            | 5.5 km |
| c-1995-o1-hale-bopp       | Comet Hale-Bopp                 | oort cloud comet   | long-period comet    | sun    | 186 au    | 0.9951  | 89.4    | 130.6   | 282.5    | 2.550719    | 926530 d     |                  | 0.914 au | #00A6FF       | 4            | 30 km  |
| 67p-churyumov-gerasimenko | Comet 67P/Churyumov–Gerasimenko | short-period comet | jupiter-family comet | sun    | 3.464 au  | 0.641   | 7.04    | 12.78   | 50.14    | 3.32542     | 2355 d       |                  | 1.243 au | #AAAAAA       | 4            | 2 km   |
| 2p-encke                  | Comet Encke                     | short-period comet | jupiter-family comet | sun    | 2.22 au   | 0.85    | 11.8    | 186.5   | 334.6    | 3.479299    | 1204 d       |                  | 0.34 au  | #FFD700       | 3            | 4.8 km |

</div>

**Example item in dataset:**

```ts
{
  id: '2p-encke',
  name: 'Comet Encke',
  type: 'short-period comet',
  category: 'jupiter-family comet',
  parent: 'sun',
  orbit: {
    a: { value: 2.22, unit: 'au' },
    e: 0.85,
    i: 11.8 as DegreesType,
    w: 186.5 as DegreesType,
    om: 334.6 as DegreesType,
    angle: 3.479299 as Radians,
    period: { value: 1204, unit: 'd' }, // ~3.3 years
    q: { value: 0.34, unit: 'au' }
  },
  display: {
    color: '#FFD700', // Golden yellow (dusty tail, lower albedo)
    size: 3
  },
  radius: { value: 4.8, unit: 'km' }
}
```

## See

[CometsType](../../types/type-aliases/CometsType.md).

## Example

```ts
console.log(COMETS[0].name); // "Halley's Comet"
```
