[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / COMETS

# Variable: COMETS

```ts
const COMETS: CometsType;
```

Defined in:
[bodies/comets.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/comets.ts#L34)

Represents a collection of well-known comets within the solar system simulation.

::: info

- Units: `a` (au), `period` (days), `radius` (km); angles `i`, `w`, `om` in
  degrees, against the J2000 ecliptic, `frame`.

- `orbit.angle` is the true anomaly at J2000, from the mean anomaly in JPL
  Horizons' osculating elements at J2000, converted with this dataset's `e`.

- `period` is always positive; retrograde orbits have `retrograde: true`.

- `rotation.period` is the nucleus's rotation when it was measured: comets
  change their spin as they outgas. 67P's, Tempel 1's and Borrelly's are the
  IAU's, from Rosetta, Deep Impact and Deep Space 1. Halley and Hartley 2
  tumble, `tumbling: true`.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of comets in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id                        | name                            | type               | category             | parent | orbit.a   | orbit.e  | orbit.i | orbit.w | orbit.om | orbit.angle | orbit.period                                                                | orbit.retrograde | orbit.q    | rotation.period | rotation.tumbling | display.color | display.size | radius  |
| ------------------------- | ------------------------------- | ------------------ | -------------------- | ------ | --------- | -------- | ------- | ------- | -------- | ----------- | --------------------------------------------------------------------------- | ---------------- | ---------- | --------------- | ----------------- | ------------- | ------------ | ------- |
| 1p-halley                 | Halley's Comet                  | periodic comet     | halley-type comet    | sun    | 17.834 au | 0.96714  | 162.26  | 111.33  | 58.42    | 2.97966     | 27576 d                                                                     | yes              | 0.586 au   | 7.4 d           | yes               | #FFFFFF       | 5            | 5.5 km  |
| c-1995-o1-hale-bopp       | Comet Hale-Bopp                 | oort cloud comet   | long-period comet    | sun    | 186 au    | 0.9951   | 89.4    | 130.6   | 282.5    | 2.550719    | 926530 d                                                                    |                  | 0.914 au   | 11.34 h         |                   | #00A6FF       | 4            | 30 km   |
| 67p-churyumov-gerasimenko | Comet 67P/Churyumov–Gerasimenko | short-period comet | jupiter-family comet | sun    | 3.464 au  | 0.641    | 7.04    | 12.78   | 50.14    | 3.32542     | 2355 d                                                                      |                  | 1.243 au   | 12.4041 h       |                   | #AAAAAA       | 4            | 2 km    |
| 2p-encke                  | Comet Encke                     | short-period comet | jupiter-family comet | sun    | 2.22 au   | 0.85     | 11.8    | 186.5   | 334.6    | 3.479299    | 1204 d                                                                      |                  | 0.34 au    | 11.083 h        |                   | #FFD700       | 3            | 4.8 km  |
| 9p-tempel-1               | Comet Tempel 1                  | short-period comet | jupiter-family comet | sun    | 3.1183 au | 0.51896  | 10.541  | 178.911 | 68.967   | 6.270289    | 2011.3 d                                                                    |                  | 1.5 au     | 40.783766 h     |                   | #B5A48A       | 3            | 2.83 km |
| 19p-borrelly              | Comet Borrelly                  | short-period comet | jupiter-family comet | sun    | 3.6125 au | 0.62364  | 30.321  | 353.33  | 75.419   | 3.681708    | 2507.9 d                                                                    |                  | 1.3596 au  | 26.641998 h     |                   | #6E6259       | 3            | 2.5 km  |
| 81p-wild-2                | Comet Wild 2                    | short-period comet | jupiter-family comet | sun    | 3.4453 au | 0.53862  | 3.2402  | 41.885  | 136.146  | 2.950501    | 2335.8 d                                                                    |                  | 1.5896 au  | 13.5 h          |                   | #8C8070       | 3            | 1.98 km |
| 103p-hartley-2            | Comet Hartley 2                 | short-period comet | jupiter-family comet | sun    | 3.4463 au | 0.70055  | 13.624  | 180.781 | 219.933  | 2.837671    | 2336.8 d                                                                    |                  | 1.032 au   | 18.4 h          | yes               | #9FC3D1       | 2            | 0.58 km |
| c-2020-f3-neowise         | Comet NEOWISE                   | oort cloud comet   | long-period comet    | sun    | 274.8 au  | 0.998873 | 129.784 | 37.876  | 62.264   | 3.308662    | [`1663874`](https://github.com/phun-ky/interstellar-tools/commit/1663874) d | yes              | 0.30962 au | 7.8 h           |                   | #F2C46D       | 4            | 2.5 km  |

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
    frame: { plane: 'ecliptic' },
    angle: 3.479299 as Radians,
    period: { value: 1204, unit: 'd' }, // ~3.3 years
    q: { value: 0.34, unit: 'au' }
  },
  /** Rotation in hours: Lowry & Weissman 2007. It slows by minutes each orbit, and may tumble */
  rotation: { period: { value: 11.083, unit: 'h' } },
  display: {
    color: '#FFD700', // Golden yellow (dusty tail, lower albedo)
    size: 3
  },
  radius: { value: 4.8, unit: 'km' }
},
```

## See

[CometsType](../../types/type-aliases/CometsType.md).

## Example

```ts
console.log(COMETS[0].name); // "Halley's Comet"
```
