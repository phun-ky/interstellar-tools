[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / STARS

# Variable: STARS

```ts
const STARS: StarsType;
```

Defined in:
[bodies/stars.ts:27](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/constants/src/bodies/stars.ts#L27)

Represents a dataset of well-known stars within the Milky Way.

::: info

- Units: `radius` (km); galactocentric coordinates `x`,`y`,`z` (ly); orbital
  semi-major axis `a` (ly); `period` in million years (Myr); orbital angles are
  unitless here (radians) if provided.
- `color` is for visualization only.
- Negative `period` may encode integration direction; the table shows raw
  values.

:::

## Full list of stars in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name   | type     | category | system.name  | system.type      | radius                                                                         | color      | x       | y                     | z     | a                     | e     | angle              | period   |
| ------ | -------- | -------- | ------------ | ---------------- | ------------------------------------------------------------------------------ | ---------- | ------- | --------------------- | ----- | --------------------- | ----- | ------------------ | -------- |
| Sun    | G2V      | star     | Solar System | planetary system | 696340 km                                                                      | #fff5f1    | 0 ly    | 27000 ly              | 20 ly | 27000 ly              | 0.07  | 1.5707963267948966 | -230 Myr |
| Vega   | A0V      | star     | Lyra         | stellar system   | [`2600000`](https://github.com/phun-ky/interstellar-tools/commit/2600000) km   | blue       | 25.3 ly | 27230.011753394454 ly | 0 ly  | 27230.011753394454 ly | 0.005 | 1.569867205171707  | -480 Myr |
| Altair | A7V      | star     | Aquila       | stellar system   | [`1700000`](https://github.com/phun-ky/interstellar-tools/commit/1700000) km   | white      | 16.7 ly | 27050.005155082687 ly | 0 ly  | 27050.005155082687 ly | 0.004 | 1.5701789517599378 | -410 Myr |
| Deneb  | A2Ia     | star     | Cygnus       | stellar system   | [`1080000`](https://github.com/phun-ky/interstellar-tools/commit/108000000) km | blue-white | 2616 ly | 27375.280016832705 ly | 0 ly  | 27375.280016832705 ly | 0.009 | 1.475524958596149  | -720 Myr |
| Spica  | B1III-IV | star     | Virgo        | stellar system   | [`7350000`](https://github.com/phun-ky/interstellar-tools/commit/73500000) km  | blue       | 250 ly  | 27201.148872795795 ly | 0 ly  | 27201.148872795795 ly | 0.006 | 1.5616057972952029 | -550 Myr |

</div>

**Example item in dataset:**

```ts
{
  name: 'Sun',
  type: 'G2V', // Yellow Dwarf, Main Sequence
  category: 'star',
  system: { name: 'Solar System', type: 'planetary system' },
  /** Radius in km */
  radius: { value: 696340, unit: 'km' },
  /** Visual representation color */
  color: '#fff5f1',
  /** Galactic position in light-years (relative to Milky Way center) */
  x: { value: 0, unit: 'ly' },
  y: { value: 27000, unit: 'ly' },
  z: { value: 20, unit: 'ly' },
  /** Semi-major axis in light-years */
  a: { value: 27000, unit: 'ly' },
  /** Orbital eccentricity */
  e: 0.07,
  /** Initial angle in orbit */
  angle: 1.5707963267948966 as Radians,
  /** Orbital period in million years (Myr) */
  period: { value: -230, unit: 'Myr' }
},
```

## See

[StarsType](../../types/type-aliases/StarsType.md).

## Example

```ts
console.log(STARS[0].name); // "Sun"
```
