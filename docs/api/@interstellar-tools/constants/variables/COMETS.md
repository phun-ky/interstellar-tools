[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / COMETS

# Variable: COMETS

```ts
const COMETS: CometsType;
```

Defined in:
[bodies/comets.ts:27](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/constants/src/bodies/comets.ts#L27)

Represents a collection of well-known comets within the solar system simulation.

::: info

- Units: `a` (au), `period` (days), `radius` (km); angles `i`, `w`, `om` in
  degrees.
- Some entries may encode integration direction via a negative `period`; the
  table reflects the raw value.

:::

## Full list of comets in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name                            | type               | category             | system | a         | e       | i      | w      | om    | angle    | period    | q     | color   | size | radius |
| ------------------------------- | ------------------ | -------------------- | ------ | --------- | ------- | ------ | ------ | ----- | -------- | --------- | ----- | ------- | ---- | ------ |
| Halley's Comet                  | periodic comet     | halley-type comet    | Sun    | 17.834 au | 0.96714 | 162.26 | 111.33 | 58.42 | 0.669857 | 27576 d   | 0.586 | #FFFFFF | 5    | 5.5 km |
| Comet Hale-Bopp                 | oort cloud comet   | long-period comet    | Sun    | 186 au    | 0.9951  | 89.4   | 130.6  | 282.5 | 3.141593 | -253533 d | 0.914 | #00A6FF | 4    | 30 km  |
| Comet 67P/Churyumov–Gerasimenko | short-period comet | jupiter-family comet | Sun    | 3.464 au  | 0.641   | 7.04   | 12.78  | 50.14 | 0        | -2484 d   | 1.243 | #AAAAAA | 4    | 2 km   |
| Comet Encke                     | short-period comet | jupiter-family comet | Sun    | 2.22 au   | 0.85    | 11.8   | 186.5  | 334.6 | 2.792527 | -1204 d   | 0.34  | #FFD700 | 3    | 4.8 km |

</div>

**Example item in dataset:**

```ts
{
  name: 'Comet Encke',
  type: 'short-period comet',
  category: 'jupiter-family comet',
  system: 'Sun',
  a: { value: 2.22, unit: 'au' },
  e: 0.85,
  i: 11.8,
  w: 186.5,
  om: 334.6,
  angle: 2.792527 as Radians,
  period: { value: -1204, unit: 'd' }, // ~3.3 years
  q: 0.34,
  color: '#FFD700', // Golden yellow (dusty tail, lower albedo)
  size: 3,
  radius: { value: 4.8, unit: 'km' }
}
```

## See

[CometsType](../../types/type-aliases/CometsType.md).

## Example

```ts
console.log(COMETS[0].name); // "Halley's Comet"
```
