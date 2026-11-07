[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / GALAXIES

# Variable: GALAXIES

```ts
const GALAXIES: GalaxiesType;
```

Defined in:
[bodies/galaxies.ts:35](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/galaxies.ts#L35)

Represents a collection of galaxies within the space visualization.

::: info

- Units: `diameter` and `distance` in light-years (ly); black hole `radius`,
  `x`, `y` in astronomical units (au).

- `distance` is from the Sun: Cepheids for Andromeda (Li et al. 2021) and
  Triangulum (Breuval et al. 2023).

- `diameter` is the D25 isophotal diameter, where the disk fades to 25
  B-magnitudes per square arcsecond: from RC3 (de Vaucouleurs et al. 1991) and
  the distance for Andromeda and Triangulum, and an estimate from a model of its
  disk for the Milky Way (Goodwin, Gribbin & Hendry 1998). The stars reach
  further out.

- Black hole `mass` is in solar masses ($M_\odot$), and `radius` is its
  Schwarzschild radius, $2GM/c^2$. Each black hole sits at its galaxy's centre,
  `x` and `y` 0. Sagittarius A\* has an `id`, so the S-stars in `STARS` can
  orbit it, its `mu`, its distance from the Sun (GRAVITY Collaboration 2024),
  and the diameter of the ring the Event Horizon Telescope imaged (EHT 2022).
  Triangulum has none: observations limit its mass to 1500 $M_\odot$ (Gebhardt
  et al. 2001).

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of galaxies in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id         | name       | type    | diameter  | distance                                                                     | blackHole.name  | blackHole.mass                                                              | blackHole.radius | blackHole.x | blackHole.y |
| ---------- | ---------- | ------- | --------- | ---------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------- | ---------------- | ----------- | ----------- |
| milky-way  | Milky Way  | SBbc    | 87410 ly  | 0 ly                                                                         | Sagittarius A\* | [`4299600`](https://github.com/phun-ky/interstellar-tools/commit/4299600)   | 0.08488 au       | 0 au        | 0 au        |
| andromeda  | Andromeda  | SA(s)b  | 137570 ly | [`2482050`](https://github.com/phun-ky/interstellar-tools/commit/2482050) ly | M31\*           | [`1400000`](https://github.com/phun-ky/interstellar-tools/commit/140000000) | 2.764 au         | 0 au        | 0 au        |
| triangulum | Triangulum | SA(s)cd | 56420 ly  | [`2739714`](https://github.com/phun-ky/interstellar-tools/commit/2739714) ly |                 |                                                                             |                  |             |             |

</div>

**Example item in dataset:**

```ts
{
  id: 'milky-way',
  name: 'Milky Way',
  type: 'SBbc', // Barred spiral (McConnachie 2012)
  /** D25 diameter in light-years: 26.8 kpc, an estimate from a model of its disk */
  diameter: { value: 87410, unit: 'ly' },
  /** Distance from the Sun: 0, the Sun is in it */
  distance: { value: 0, unit: 'ly' },
  /** Supermassive black hole at the center. */
  blackHole: {
    id: 'sagittarius-a-star',
    name: 'Sagittarius A*',
    /** Mass in solar masses: GRAVITY Collaboration 2024 */
    mass: 4.2996e6,
    /** G·M in m³/s², from its mass and the Sun's GM */
    mu: 5.70610407201485e26,
    /** Schwarzschild radius in au */
    radius: { value: 0.08488, unit: 'au' },
    /** Distance from the Sun in light-years: R₀ = 8275.9 ± 8.6 pc, fitted with its mass */
    distance: { value: 26992.38, unit: 'ly' },
    /** The ring the Event Horizon Telescope imaged: 51.8 ± 2.3 μas (EHT 2022) */
    ringDiameter: 2.511334868e-10 as Radians,
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
