[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / STARS

# Variable: STARS

```ts
const STARS: StarsType;
```

Defined in:
[bodies/stars.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/stars.ts#L29)

Represents a dataset of well-known stars within the Milky Way.

::: info

- Each star names its `parent` (a galaxy or a system barycenter) and its `orbit`
  around it.

- Units: `radius` (km). Orbits around the galaxy: `a` and `x`,`y`,`z` in ly,
  `period` in Myr. Orbits within a system: `a` in au, `period` in yr or kyr.
  `angle` in radians. `mass` in M☉.

- `color` is for visualization only.

- `period` is always positive; retrograde orbits have `retrograde: true`.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of stars in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id               | name             | type     | category | parent            | orbit.a               | orbit.e | orbit.period | orbit.retrograde | orbit.angle        | mass (M☉) | radius                                                                         | mu (m³/s²)             | display.color | x       | y                     | z    |
| ---------------- | ---------------- | -------- | -------- | ----------------- | --------------------- | ------- | ------------ | ---------------- | ------------------ | --------- | ------------------------------------------------------------------------------ | ---------------------- | ------------- | ------- | --------------------- | ---- |
| sun              | Sun              | G2V      | star     | solar-system      |                       |         |              |                  |                    | 1         | 696340 km                                                                      | 1.3271244004127942e+20 | #fff5f1       |         |                       |      |
| vega             | Vega             | A0V      | star     | milky-way         | 27230.011753394454 ly | 0.005   | 480 Myr      |                  | 1.569867205171707  | 2.135     | [`2600000`](https://github.com/phun-ky/interstellar-tools/commit/2600000) km   |                        | blue          | 25.3 ly | 27230.011753394454 ly | 0 ly |
| altair           | Altair           | A7V      | star     | milky-way         | 27050.005155082687 ly | 0.004   | 410 Myr      |                  | 1.5701789517599378 | 1.791     | [`1700000`](https://github.com/phun-ky/interstellar-tools/commit/1700000) km   |                        | white         | 16.7 ly | 27050.005155082687 ly | 0 ly |
| deneb            | Deneb            | A2Ia     | star     | milky-way         | 27375.280016832705 ly | 0.009   | 720 Myr      |                  | 1.475524958596149  | 19        | [`1080000`](https://github.com/phun-ky/interstellar-tools/commit/108000000) km |                        | #cad7ff       | 2616 ly | 27375.280016832705 ly | 0 ly |
| spica-a          | Spica A          | B1III-IV | star     | spica             | 0.050727 au           | 0.133   | 4.0145 d     |                  | 2.3899             | 11.43     | [`5196879`](https://github.com/phun-ky/interstellar-tools/commit/5196879) km   |                        | blue          |         |                       |      |
| spica-b          | Spica B          | B2V      | star     | spica             | 0.080417 au           | 0.133   | 4.0145 d     |                  | 2.3899             | 7.21      | [`2601918`](https://github.com/phun-ky/interstellar-tools/commit/2601918) km   |                        | #cad7ff       |         |                       |      |
| alpha-centauri-a | Alpha Centauri A | G2V      | star     | alpha-centauri-ab | 10.66 au              | 0.51947 | 79.762 yr    |                  | 3.275243601437025  | 1.0788    | 847015 km                                                                      |                        | #fff4ea       |         |                       |      |
| alpha-centauri-b | Alpha Centauri B | K1V      | star     | alpha-centauri-ab | 12.64 au              | 0.51947 | 79.762 yr    |                  | 3.275243601437025  | 0.9092    | 597676 km                                                                      |                        | #ffd2a1       |         |                       |      |
| proxima-centauri | Proxima Centauri | M5.5Ve   | star     | alpha-centauri    | 8197 au               | 0.5     | 547 kyr      |                  | 3.099566485428788  | 0.1221    | 107277 km                                                                      |                        | #ffcc6f       |         |                       |      |

</div>

**Example item in dataset:**

```ts
{
  id: 'vega',
  name: 'Vega',
  type: 'A0V', // White-Blue Main Sequence
  category: 'star',
  /** A single star orbits the galaxy directly */
  parent: 'milky-way',
  orbit: {
    /** Semi-major axis in light-years */
    a: { value: 27230.011753394454, unit: 'ly' },
    /** Orbital eccentricity */
    e: 0.005,
    /** Orbital period in million years (Myr) */
    period: { value: 480, unit: 'Myr' },
    /** Initial angle in orbit */
    angle: 1.569867205171707 as Radians
  },
  /** Radius in km */
  mass: 2.135, // Yoon et al. 2010
  radius: { value: 2600000, unit: 'km' },
  display: {
    /** Visual representation color */
    color: 'blue'
  },
  /** Galactic position in light-years (relative to Milky Way center) */
  x: { value: 25.3, unit: 'ly' },
  y: { value: 27230.011753394454, unit: 'ly' },
  z: { value: 0, unit: 'ly' }
},
```

## See

[StarsType](../../types/type-aliases/StarsType.md).

## Example

```ts
console.log(STARS[0].name); // "Sun"
```
