[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / STARS

# Variable: STARS

```ts
const STARS: StarsType;
```

Defined in:
[bodies/stars.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/stars.ts#L67)

Represents a dataset of well-known stars within the Milky Way.

::: info

- Each star names its `parent` (a galaxy, a system barycenter, or Sagittarius
  A\* for the S-stars) and its `orbit` around it.

- Units: `radius` (km). Orbits around the galaxy: `a` and `x`,`y`,`z` in ly,
  `period` in Myr. Orbits within a system or around Sagittarius A\*: `a` in au,
  `period` in d, yr or kyr. `angle` in radians. `mass` in M☉.

- Orbits within a system or around Sagittarius A\* that have an `i` are on the
  sky, `frame: { plane: 'sky' }`: `i` to the plane of the sky, `om` the position
  angle of the node from north through east.

- `color` is for visualization only.

- `period` is always positive; retrograde orbits have `retrograde: true`.

- `rotation.period` is the rotation, from interferometry, spectroscopy or
  starspots, where one is published: none for Deneb, Sirius, Rigel and Canopus.
  The Sun's is the IAU's Carrington period, with its faster equator and slower
  poles in `equatorialPeriod` and `polarPeriod`. A star's spin direction is
  unknown.

- The Sun's `rotation.iau` is the IAU's rotation model (Archinal et al. 2018),
  turning with the Carrington period.

- What is measured about the stars isn't carried here, so an app loads only what
  it shows. It is exported apart, keyed by star id:
  [STAR_PARAMETERS](STAR_PARAMETERS.md), [STAR_ASTROMETRY](STAR_ASTROMETRY.md)
  and [HELIOSPHERE](HELIOSPHERE.md), with
  [HELIOSPHERE_DISPLAY](HELIOSPHERE_DISPLAY.md) to draw the heliosphere.
  [withObservations](../functions/withObservations.md) and
  [withDisplay](../functions/withDisplay.md) put them on the stars, as the
  `observations` and `display.astrosphere` described below.

- `observations.spectralClassification` is each star's `type` split into its
  parts.

- `observations.identifiers`, `astrometry` and `apparentMagnitudes` are given
  for every star but the Sun and the S-stars, as SIMBAD has them: the ICRS
  position at J2000, and the parallax and proper motion from the Hipparcos new
  reduction (van Leeuwen 2007), or from Gaia DR3 for Sirius B, Proxima Centauri,
  Barnard's Star and TRAPPIST-1. α Centauri's parallax is Pourbaix et al.'s
  (1997), and the radial velocities and V magnitudes credit the paper each is
  from. SIMBAD lists Spica as one star, so Spica A carries the pair's values.

- `observations.effectiveTemperature`, `luminosity` (L☉), `logSurfaceGravity`
  and `metallicity` (\[Fe/H]) are from the papers each credits, chosen to agree
  with the star's `mass` and `radius`: with `radius`, the temperature and
  luminosity meet L = (R/R☉)² (T/T☉)⁴ within 12 % for every star but the
  S-stars, whose radii aren't Habibi et al.'s. A luminosity given as log L/L☉ is
  converted, error bars and all. Vega and Altair spin fast enough to be hotter
  at their poles, so their temperatures are in `gravityDarkening`, and their
  gravities are the pole's. The Sun's are the IAU's nominal values (Prša et al.
  2016). A metallicity is left out where no bulk \[Fe/H] is measured, as for
  Altair, Spica and Sirius A; Deneb's and Rigel's are \[M/H]. Deneb's `radius`
  is Schiller & Przybilla's 203 R☉, like its mass.

- The Sun's `observations.astrosphere` is the heliosphere. Its heliopause is
  IBEX's map (Reisenfeld et al. 2021): nearest just south of the nose, flaring
  towards the flanks, and at least 350 au down the tail. Its nose faces
  `upwind`, where the interstellar wind comes from, opposite the inflow
  direction McComas et al. 2015 give. `crossings` are the Voyagers' termination
  shock and heliopause crossings, from the papers each credits, with the
  direction each was in from JPL Horizons; Horizons puts them within 0.03 au of
  the papers' distances. Whether the heliosphere has a bow shock is disputed, so
  it has none here. The Sun's `display.astrosphere` keeps it hidden until a
  renderer offers to show it.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of stars in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id               | name             | type        | category | parent             | orbit.a               | orbit.e | orbit.period | orbit.retrograde | orbit.angle        | rotation.period | rotation.iau            | mass         | radius                                                                         | mu (m³/s²)             | display.color | x        | y                     | z    |
| ---------------- | ---------------- | ----------- | -------- | ------------------ | --------------------- | ------- | ------------ | ---------------- | ------------------ | --------------- | ----------------------- | ------------ | ------------------------------------------------------------------------------ | ---------------------- | ------------- | -------- | --------------------- | ---- |
| sun              | Sun              | G2V         | star     | solar-system       |                       |         |              |                  |                    | 25.379995 d     | north (286.13°, 63.87°) | 1 M_sun      | 696340 km                                                                      | 1.3271244004127942e+20 | #fff5f1       |          |                       |      |
| vega             | Vega             | A0V         | star     | milky-way          | 27230.011753394454 ly | 0.005   | 480 Myr      |                  | 1.569867205171707  | 0.71 d          |                         | 2.135 M_sun  | [`2600000`](https://github.com/phun-ky/interstellar-tools/commit/2600000) km   |                        | blue          | 25.3 ly  | 27230.011753394454 ly | 0 ly |
| altair           | Altair           | A7V         | star     | milky-way          | 27050.005155082687 ly | 0.004   | 410 Myr      |                  | 1.5701789517599378 | 7.766667 h      |                         | 1.791 M_sun  | [`1700000`](https://github.com/phun-ky/interstellar-tools/commit/1700000) km   |                        | white         | 16.7 ly  | 27050.005155082687 ly | 0 ly |
| deneb            | Deneb            | A2Ia        | star     | milky-way          | 27375.280016832705 ly | 0.009   | 720 Myr      |                  | 1.475524958596149  |                 |                         | 19 M_sun     | [`1412271`](https://github.com/phun-ky/interstellar-tools/commit/141227100) km |                        | #cad7ff       | 2616 ly  | 27375.280016832705 ly | 0 ly |
| spica-a          | Spica A          | B1III-IV    | star     | spica              | 0.050727 au           | 0.133   | 4.0145 d     |                  | 2.3899             | 2.007 d         |                         | 11.43 M_sun  | [`5196879`](https://github.com/phun-ky/interstellar-tools/commit/5196879) km   |                        | blue          |          |                       |      |
| spica-b          | Spica B          | B2V         | star     | spica              | 0.080417 au           | 0.133   | 4.0145 d     |                  | 2.3899             | 2.676 d         |                         | 7.21 M_sun   | [`2601918`](https://github.com/phun-ky/interstellar-tools/commit/2601918) km   |                        | #cad7ff       |          |                       |      |
| alpha-centauri-a | Alpha Centauri A | G2V         | star     | alpha-centauri-ab  | 10.66 au              | 0.51947 | 79.762 yr    |                  | 3.275243601437025  | 28.8 d          |                         | 1.0788 M_sun | 847015 km                                                                      |                        | #fff4ea       |          |                       |      |
| alpha-centauri-b | Alpha Centauri B | K1V         | star     | alpha-centauri-ab  | 12.64 au              | 0.51947 | 79.762 yr    |                  | 3.275243601437025  | 36.2 d          |                         | 0.9092 M_sun | 597676 km                                                                      |                        | #ffd2a1       |          |                       |      |
| proxima-centauri | Proxima Centauri | M5.5Ve      | star     | alpha-centauri     | 8197 au               | 0.5     | 547 kyr      |                  | 3.099566485428788  | 83 d            |                         | 0.1221 M_sun | 107277 km                                                                      |                        | #ffcc6f       |          |                       |      |
| sirius-a         | Sirius A         | A1V         | star     | sirius             | 6.5365 au             | 0.59142 | 50.1284 yr   |                  | 1.906838           |                 |                         | 2.063 M_sun  | [`1192708`](https://github.com/phun-ky/interstellar-tools/commit/1192708) km   |                        | #b5c7ff       |          |                       |      |
| sirius-b         | Sirius B         | DA2         | star     | sirius             | 13.2463 au            | 0.59142 | 50.1284 yr   |                  | 1.906838           |                 |                         | 1.018 M_sun  | 5634 km                                                                        |                        | #a8bdff       |          |                       |      |
| betelgeuse       | Betelgeuse       | M1-M2Ia-Iab | star     | milky-way          | 27005.560612584955 ly | 0.07    | 230 Myr      |                  | 1.5505028167596557 | 31 yr           |                         | 18 M_sun     | [`5315148`](https://github.com/phun-ky/interstellar-tools/commit/531514800) km |                        | #ffca8a       | 548 ly   | 27230.011753394454 ly | 0 ly |
| polaris          | Polaris          | F7Ib        | star     | milky-way          | 27003.691641144178 ly | 0.07    | 230 Myr      |                  | 1.554260796991538  | 119 d           |                         | 5.13 M_sun   | [`3219003`](https://github.com/phun-ky/interstellar-tools/commit/32190039) km  |                        | #fffcf7       | 446.5 ly | 27003.691641144178 ly | 0 ly |
| arcturus         | Arcturus         | K1.5III     | star     | milky-way          | 27000.024969588456 ly | 0.07    | 230 Myr      |                  | 1.569436327633381  | 2 yr            |                         | 1.08 M_sun   | [`1767078`](https://github.com/phun-ky/interstellar-tools/commit/17670780) km  |                        | #ffdfb5       | 36.72 ly | 27000.024969588456 ly | 0 ly |
| rigel            | Rigel            | B8Ia        | star     | milky-way          | 27013.782109138294 ly | 0.07    | 230 Myr      |                  | 1.538851641798522  |                 |                         | 23 M_sun     | [`5489073`](https://github.com/phun-ky/interstellar-tools/commit/54890730) km  |                        | #b6ceff       | 862.8 ly | 27013.782109138294 ly | 0 ly |
| canopus          | Canopus          | A9II        | star     | milky-way          | 27001.77039825352 ly  | 0.07    | 230 Myr      |                  | 1.5593449755210198 |                 |                         | 9.81 M_sun   | [`5099481`](https://github.com/phun-ky/interstellar-tools/commit/50994810) km  |                        | #cbd9ff       | 309.2 ly | 27001.77039825352 ly  | 0 ly |
| barnards-star    | Barnard's Star   | M4V         | star     | milky-way          | 27000.00065846979 ly  | 0.07    | 230 Myr      |                  | 1.5705754749466354 | 142 d           |                         | 0.162 M_sun  | 128705 km                                                                      |                        | #ffc97f       | 5.963 ly | 27000.00065846979 ly  | 0 ly |
| trappist-1a      | TRAPPIST-1       | M8V         | star     | trappist-1         |                       |         |              |                  |                    | 3.295 d         |                         | 0.0898 M_sun | 82927 km                                                                       | 1.19176e+19            | #ffa24c       |          |                       |      |
| s1               | S1               | B0-B3V      | star     | sagittarius-a-star | 4924.2 au             | 0.556   | 166 yr       |                  | 5.998693           |                 |                         | 12.4 M_sun   | [`3610683`](https://github.com/phun-ky/interstellar-tools/commit/3610683) km   |                        | #cad7ff       |          |                       |      |
| s2               | S2               | B0V         | star     | sagittarius-a-star | 1034.7 au             | 0.88444 | 16.046 yr    |                  | 3.537946           |                 |                         | 13.6 M_sun   | [`3847221`](https://github.com/phun-ky/interstellar-tools/commit/3847221) km   |                        | #cad7ff       |          |                       |      |
| s4               | S4               | B0-B3V      | star     | sagittarius-a-star | 2954.5 au             | 0.3905  | 77 yr        |                  | 3.301758           |                 |                         | 12.2 M_sun   | [`3638511`](https://github.com/phun-ky/interstellar-tools/commit/3638511) km   |                        | #cad7ff       |          |                       |      |
| s6               | S6               | B0-B3V      | star     | sagittarius-a-star | 5440.6 au             | 0.84    | 192 yr       |                  | 3.074946           |                 |                         | 9.2 M_sun    | [`3137607`](https://github.com/phun-ky/interstellar-tools/commit/3137607) km   |                        | #cad7ff       |          |                       |      |
| s8               | S8               | B0-B3V      | star     | sagittarius-a-star | 3349.3 au             | 0.8031  | 92.9 yr      |                  | 2.66468            |                 |                         | 13.2 M_sun   | [`3555027`](https://github.com/phun-ky/interstellar-tools/commit/3555027) km   |                        | #cad7ff       |          |                       |      |
| s9               | S9               | B0-B3V      | star     | sagittarius-a-star | 2254.4 au             | 0.644   | 51.3 yr      |                  | 3.059443           |                 |                         | 8.2 M_sun    | [`2706273`](https://github.com/phun-ky/interstellar-tools/commit/2706273) km   |                        | #cad7ff       |          |                       |      |
| s12              | S12              | B0-B3V      | star     | sagittarius-a-star | 2472 au               | 0.8883  | 58.9 yr      |                  | 2.542369           |                 |                         | 7.6 M_sun    | [`2831499`](https://github.com/phun-ky/interstellar-tools/commit/2831499) km   |                        | #cad7ff       |          |                       |      |

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
  /** Equatorial rotation in days: Monnier et al. 2012, from interferometry. Seen nearly pole-on */
  rotation: { period: { value: 0.71, unit: 'd' } },
  /** Radius in km */
  mass: { value: 2.135, unit: 'M_sun' }, // Yoon et al. 2010
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
