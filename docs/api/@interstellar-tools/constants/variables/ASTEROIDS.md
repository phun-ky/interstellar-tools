[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / ASTEROIDS

# Variable: ASTEROIDS

```ts
const ASTEROIDS: AsteroidsType;
```

Defined in:
[bodies/asteroids.ts:27](https://github.com/phun-ky/interstellar-tools/blob/553025c86206fb0b337446892f555a77561ee55e/packages/constants/src/bodies/asteroids.ts#L27)

Represents a collection of well-known asteroids within the solar system
simulation.

::: info

- Units: `a` in astronomical units (au); `period` in days (d); `radius` in km.

- Orbital angles `i`, `w`, and `om` are in degrees.

- `color` and `size` are visual rendering hints only.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of asteroids in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id             | name       | type                | category       | spectralType | parent | orbit.a  | orbit.e | orbit.i | orbit.w | orbit.om | orbit.angle | orbit.period | orbit.q | radius   | color                                                                  | size |
| -------------- | ---------- | ------------------- | -------------- | ------------ | ------ | -------- | ------- | ------- | ------- | -------- | ----------- | ------------ | ------- | -------- | ---------------------------------------------------------------------- | ---- |
| 4-vesta        | Vesta      | main-belt asteroid  | large asteroid | v-type       | sun    | 2.362 au | 0.09    | 7.1     | 151.2   | 103.8    | 5.527458    | -1325.2 d    | 2.151   | 262.7 km | [#999999](https://github.com/phun-ky/interstellar-tools/issues/999999) | 1    |
| 433-eros       | Eros       | near-earth asteroid | amor group     | s-type       | sun    | 1.458 au | 0.223   | 10.8    | 178.9   | 304.3    | 1.553343    | -643.2 d     | 1.134   | 8.4 km   | #aaaaaa                                                                | 1    |
| 2-pallas       | Pallas     | main-belt asteroid  | large asteroid | b-type       | sun    | 2.773 au | 0.231   | 34.8    | 310.2   | 173.1    | 0.579449    | -1684.9 d    | 2.13    | 256 km   | [#888888](https://github.com/phun-ky/interstellar-tools/issues/888888) | 1    |
| 10-hygiea      | Hygiea     | main-belt asteroid  | large asteroid | c-type       | sun    | 3.141 au | 0.112   | 3.8     | 312.3   | 283.2    | 2.656391    | -2033.8 d    | 2.788   | 216.5 km | [#666666](https://github.com/phun-ky/interstellar-tools/issues/666666) | 1    |
| 704-interamnia | Interamnia | main-belt asteroid  | large asteroid | f-type       | sun    | 3.062 au | 0.127   | 17.3    | 339.4   | 73.1     | 0.788889    | -1960.9 d    | 2.671   | 166 km   | [#777777](https://github.com/phun-ky/interstellar-tools/issues/777777) | 1    |
| 31-euphrosyne  | Euphrosyne | main-belt asteroid  | large asteroid | c-type       | sun    | 3.155 au | 0.223   | 26.3    | 34.8    | 359.2    | 3.150319    | -2045.5 d    | 2.451   | 134 km   | [#555555](https://github.com/phun-ky/interstellar-tools/issues/555555) | 1    |
| 16-psyche      | Psyche     | main-belt asteroid  | large asteroid | m-type       | sun    | 2.924 au | 0.14    | 3.1     | 228     | 150.2    | 1.520182    | -1820.1 d    | 2.515   | 111 km   | [#999999](https://github.com/phun-ky/interstellar-tools/issues/999999) | 1    |
| 511-davida     | Davida     | main-belt asteroid  | large asteroid | c-type       | sun    | 3.168 au | 0.195   | 15.9    | 308.2   | 296.1    | 2.099631    | -2059.6 d    | 2.549   | 149 km   | [#444444](https://github.com/phun-ky/interstellar-tools/issues/444444) | 1    |
| 52-europa      | Europa     | main-belt asteroid  | large asteroid | c-type       | sun    | 3.101 au | 0.101   | 7.5     | 87.7    | 304.4    | 3.675663    | -1977.9 d    | 2.788   | 156.5 km | [#555555](https://github.com/phun-ky/interstellar-tools/issues/555555) | 1    |
| 3-juno         | Juno       | main-belt asteroid  | large asteroid | s-type       | sun    | 2.67 au  | 0.257   | 12.9    | 248.3   | 169.8    | 1.74882     | -1594.4 d    | 1.986   | 117 km   | #aaaaaa                                                                | 1    |
| 15-eunomia     | Eunomia    | main-belt asteroid  | large asteroid | s-type       | sun    | 2.643 au | 0.186   | 11.7    | 97.5    | 293.3    | 1.054179    | -1567.6 d    | 2.153   | 136 km   | #bbbbbb                                                                | 1    |

</div>

**Example item in dataset:**

```ts
{
  id: '4-vesta',
  name: 'Vesta',
  type: 'main-belt asteroid',
  category: 'large asteroid',
  spectralType: 'v-type', // vesta has a unique basaltic surface
  parent: 'sun',
  orbit: {
    a: { value: 2.362, unit: 'au' },
    e: 0.09,
    i: 7.1,
    w: 151.2,
    om: 103.8,
    angle: 5.527458 as Radians,
    period: { value: -1325.2, unit: 'd' },
    q: 2.151
  },
  radius: { value: 262.7, unit: 'km' },
  color: '#999999',
  size: 1
},
```

## See

[AsteroidsType](../../types/type-aliases/AsteroidsType.md).

## Example

```ts
console.log(ASTEROIDS[0].name); // "Ceres"
```
