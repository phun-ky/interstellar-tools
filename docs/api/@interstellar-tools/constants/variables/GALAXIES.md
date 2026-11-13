[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / GALAXIES

# Variable: GALAXIES

```ts
const GALAXIES: GalaxiesType;
```

Defined in:
[bodies/galaxies.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/galaxies.ts#L58)

Represents a collection of galaxies within the space visualization.

::: info

- Units: `diameter` and `distance` in light-years (ly); black hole `radius`,
  `x`, `y`, `z` in astronomical units (au).

- `distance` is from the Sun: Cepheids for Andromeda (Li et al. 2021) and
  Triangulum (Breuval et al. 2023), eclipsing binaries for the Large and Small
  Magellanic Clouds (Pietrzyński et al. 2019, Graczyk et al. 2020), Vasiliev &
  Belokurov 2020 for the Sagittarius dwarf, the EHT's 16.8 Mpc for M87, and red
  giants for Centaurus A (Harris et al. 2010).

- `direction` is the galactic longitude `l` and latitude `b` of its centre, seen
  from the Sun, from [NED](https://ned.ipac.caltech.edu/). The Milky Way has
  none: the Sun is in it. For the Large Magellanic Cloud it's the optical centre
  of its bar, 0.9° from the centre its stars and gas turn about. For the
  Sagittarius dwarf it's the centre of Ibata, Gilmore & Irwin (1994), 5.3′ from
  M54, the cluster at its heart.

- Both `distance` and `direction` are from the Sun, where they're measured. To
  draw the galaxies around the Milky Way's centre, convert them with
  `galactocentricPosition` in `@interstellar-tools/equations`, which uses
  [SUN_GALACTOCENTRIC_DISTANCE](SUN_GALACTOCENTRIC_DISTANCE.md) and
  [SUN_HEIGHT_ABOVE_GALACTIC_PLANE](SUN_HEIGHT_ABOVE_GALACTIC_PLANE.md).

- `disk` is how a disk galaxy's disk is turned on the sky, from the motions of
  its gas or stars: its inclination, the position angle of its receding half,
  and of its nearer side where that's known. Andromeda's inclination is 77.7°
  (Corbelli et al. 2010); Chemin et al. (2009) measure 74.3°, from H I further
  in, and Corbelli et al. find theirs closer to the optical shape. Which side of
  Triangulum is nearer isn't settled, and the Small Magellanic Cloud's stars
  don't form a clear disk, so neither has a `nearSide`. The Sagittarius dwarf,
  M87 and Centaurus A have no disk to turn: Centaurus A's dust disk is warped,
  and crosses edge-on.

- `motion` is the velocity along the line of sight, in km/s, positive moving
  away, and for the Local Group, the proper motion across the sky in mas/yr:
  from Gaia and HST, measured against distant quasars. Combined with the Sun's
  own motion, [SUN_GALACTOCENTRIC_VELOCITY](SUN_GALACTOCENTRIC_VELOCITY.md),
  they give each galaxy's 3D velocity around the Milky Way's centre. Across the
  sky, 10 µas/yr is 36 km/s at Andromeda's distance, so its sideways speed is
  uncertain by about 40 km/s; the Magellanic Clouds' and the Sagittarius dwarf's
  by a few km/s.

- `diameter` is the D25 isophotal diameter, where the disk fades to 25
  B-magnitudes per square arcsecond: from RC3 (de Vaucouleurs et al. 1991) and
  the distance, and an estimate from a model of its disk for the Milky Way
  (Goodwin, Gribbin & Hendry 1998). The stars reach further out. The Sagittarius
  dwarf, which the Milky Way is tearing apart, has no such edge: its diameter is
  its half-light diameter (McConnachie 2012).

- Black hole `mass` is in solar masses ($M_\odot$), and `radius` is its
  Schwarzschild radius, $2GM/c^2$. Each black hole sits at its galaxy's centre,
  `x`, `y` and `z` 0. Sagittarius A\* has an `id`, so the S-stars in `STARS` can
  orbit it, its `mu`, its distance from the Sun (GRAVITY Collaboration 2024),
  and the diameter of the ring the Event Horizon Telescope imaged (EHT 2022).
  M87\*, the first black hole it imaged, has its ring's diameter too (EHT 2019).
  Triangulum has none: observations limit its mass to 1500 $M_\odot$ (Gebhardt
  et al. 2001\). None is detected in the Magellanic Clouds or the Sagittarius
  dwarf.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of galaxies in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id                     | name                                | type       | diameter    | distance                                                                         | direction.l | direction.b | disk.inclination | disk.positionAngle | motion.radialVelocity | blackHole.name  | blackHole.mass                                                                     | blackHole.radius | blackHole.x | blackHole.y |
| ---------------------- | ----------------------------------- | ---------- | ----------- | -------------------------------------------------------------------------------- | ----------- | ----------- | ---------------- | ------------------ | --------------------- | --------------- | ---------------------------------------------------------------------------------- | ---------------- | ----------- | ----------- |
| milky-way              | Milky Way                           | SBbc       | 87410 ly    | 0 ly                                                                             |             |             |                  |                    |                       | Sagittarius A\* | [`4299600`](https://github.com/phun-ky/interstellar-tools/commit/4299600) M_sun    | 0.08488 au       | 0 au        | 0 au        |
| andromeda              | Andromeda                           | SA(s)b     | 137570 ly   | [`2482050`](https://github.com/phun-ky/interstellar-tools/commit/2482050) ly     | 121.1744    | -21.573     | 77.7             | 38                 | -300                  | M31\*           | [`1400000`](https://github.com/phun-ky/interstellar-tools/commit/140000000) M_sun  | 2.764 au         | 0 au        | 0 au        |
| triangulum             | Triangulum                          | SA(s)cd    | 56420 ly    | [`2739714`](https://github.com/phun-ky/interstellar-tools/commit/2739714) ly     | 133.6101    | -31.3306    | 54               | 201.3              | -180                  |                 |                                                                                    |                  |             |             |
| large-magellanic-cloud | Large Magellanic Cloud              | SB(s)m     | 30377.1 ly  | 161740.95 ly                                                                     | 280.4652    | -32.8884    | 34.1             | 309.9              | 262.2                 |                 |                                                                                    |                  |             |             |
| small-magellanic-cloud | Small Magellanic Cloud              | SB(s)m pec | 18733.3 ly  | 203652.04 ly                                                                     | 302.797     | -44.2993    | 51               | 66                 | 145.6                 |                 |                                                                                    |                  |             |             |
| sagittarius-dwarf      | Sagittarius Dwarf Spheroidal Galaxy | dSph(t)    | 17197.1 ly  | 86431.44 ly                                                                      | 5.5689      | -14.1664    |                  |                    | 142                   |                 |                                                                                    |                  |             |             |
| m87                    | Messier 87                          | E+0-1 pec  | 132574.9 ly | [`5479427`](https://github.com/phun-ky/interstellar-tools/commit/54794271).45 ly | 283.7777    | 74.4912     |                  |                    | 1284                  | M87\*           | [`6500000`](https://github.com/phun-ky/interstellar-tools/commit/6500000000) M_sun | 128.318 au       | 0 au        | 0 au        |
| centaurus-a            | Centaurus A                         | S0 pec     | 92669.2 ly  | [`1239394`](https://github.com/phun-ky/interstellar-tools/commit/12393942).35 ly | 309.5159    | 19.4173     |                  |                    | 547                   | Centaurus A\*   | [`5500000`](https://github.com/phun-ky/interstellar-tools/commit/55000000) M_sun   | 1.08577 au       | 0 au        | 0 au        |

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
    mass: { value: 4.2996e6, unit: 'M_sun' },
    /** G·M in m³/s², from its mass and the Sun's GM */
    mu: 5.70610407201485e26,
    /** Schwarzschild radius in au */
    radius: { value: 0.08488, unit: 'au' },
    /** Distance from the Sun in light-years: R₀ = 8275.9 ± 8.6 pc, fitted with its mass */
    distance: { value: 26992.38, unit: 'ly' },
    /** The ring the Event Horizon Telescope imaged: 51.8 ± 2.3 μas (EHT 2022) */
    ringDiameter: 2.511334868e-10 as Radians,
    x: { value: 0, unit: 'au' },
    y: { value: 0, unit: 'au' },
    z: { value: 0, unit: 'au' }
  }
},
```

## See

[GalaxiesType](../../types/type-aliases/GalaxiesType.md).

## Example

```ts
console.log(GALAXIES[0].name); // "Milky Way"
```
