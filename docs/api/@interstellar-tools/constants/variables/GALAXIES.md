[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / GALAXIES

# Variable: GALAXIES

```ts
const GALAXIES: GalaxiesType;
```

Defined in:
[bodies/galaxies.ts:27](https://github.com/phun-ky/interstellar-tools/blob/ff0caf6b6530d3c273826ec4e8273e6792a27186/packages/constants/src/bodies/galaxies.ts#L27)

Represents a collection of galaxies within the space visualization.

::: info

- Units: `diameter` and `distance` in light-years (ly); black hole `radius`,
  `x`, `y` in astronomical units (au).
- Black hole `mass` is in solar masses ($M_\odot$).
- Values are mainly for visualization; not all are observationally exact.

:::

## Full list of galaxies in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name       | type          | diameter  | distance                                                                           | blackHole.name                | blackHole.mass                                                              | blackHole.radius | blackHole.x | blackHole.y                                                                       |
| ---------- | ------------- | --------- | ---------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------- | ---------------- | ----------- | --------------------------------------------------------------------------------- |
| Milky Way  | Barred Spiral | 105700 ly | 0 ly                                                                               | Sagittarius A\*               | [`4154000`](https://github.com/phun-ky/interstellar-tools/commit/4154000)   | 0.08 au          | 0 au        | 0 au                                                                              |
| Andromeda  | Barred Spiral | 220000 ly | [`2537002`](https://github.com/phun-ky/interstellar-tools/commit/2537002537000) ly | Andromeda Central Black Hole  | [`1100000`](https://github.com/phun-ky/interstellar-tools/commit/110000000) | 5 au             | 0 au        | [`1604424`](https://github.com/phun-ky/interstellar-tools/commit/160442417000) au |
| Triangulum | Spiral        | 60000 ly  | [`3000003`](https://github.com/phun-ky/interstellar-tools/commit/3000003000000) ly | Triangulum Central Black Hole | [`1500000`](https://github.com/phun-ky/interstellar-tools/commit/1500000)   | 0.1 au           | 0 au        | [`1897230`](https://github.com/phun-ky/interstellar-tools/commit/189723000000) au |

</div>

**Example item in dataset:**

```ts
{
  name: 'Milky Way',
  type: 'Barred Spiral',
  /** Diameter of the galaxy in light-years. */
  diameter: { value: 105700, unit: 'ly' },
  /** Distance from the reference point (Milky Way itself). */
  distance: { value: 0, unit: 'ly' },
  /** Supermassive black hole at the center. */
  blackHole: {
    name: 'Sagittarius A*',
    /** Mass of the black hole in Solar Masses ($ M_\odot $). */
    mass: 4.154e6,
    /** Schwarzschild radius (approximate) in AU. */
    radius: { value: 0.08, unit: 'au' },
    /** Positional reference within the galaxy in AU. */
    x: { value: 0, unit: 'au' },
    y: { value: 0, unit: 'au' }
  }
},
```

## See

[GalaxiesType](../../types/type-aliases/GalaxiesType.md).

## Example

```ts
console.log(GALAXIES[0].name); // "Milky Way"
```
