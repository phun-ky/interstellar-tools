[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / PLANETS

# Variable: PLANETS

```ts
const PLANETS: PlanetsType;
```

Defined in:
[bodies/planets.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/planets.ts#L57)

Represents a dataset of planets and planetoids in the solar system.

::: info

- Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in
  au.

- `orbit.angle` is the true anomaly at J2000 (2000-01-01 12:00 TT). `x`,`y`,`z`
  are the heliocentric position at J2000 in the J2000 ecliptic frame, x towards
  the equinox.

- For the planets, both are computed from the J2000 elements in JPL's
  "Approximate Positions of the Planets" (Table 1), using this dataset's `a` and
  `e`. For the dwarf planets, the orbit and position are JPL Horizons'
  osculating heliocentric elements and state at J2000; Pluto's are its system
  barycenter's, which Charon also circles. Sedna's orbit around the Solar
  System's barycenter is longer, about 506 au and 11 400 years.

- `i`, `w` and `om`, in degrees, are against the J2000 ecliptic, `frame`, from
  the same sources. Earth's orbit defines the ecliptic, so its `i` and `om` are
  0, and `w` is its longitude of perihelion.

- TRAPPIST-1's seven planets orbit their star, `trappist-1a`, with `i` and `w`
  on the sky, `frame: { plane: 'sky' }`, and have no `x`,`y`,`z`, which are
  heliocentric.

- `period` is always positive; retrograde orbits have `retrograde: true`.

- `rotation.period` is the sidereal rotation in days: 360° over the IAU's
  rotation rate (Archinal et al. 2018), and for Earth the IERS's Earth rotation
  angle. The IAU gives no rate for the other dwarf planets, so theirs is a light
  curve's. Venus, Uranus and Pluto spin backwards, `retrograde: true`.
  TRAPPIST-1's planets' spins aren't measured.

- `rotation.obliquity` is the axial tilt in degrees, the angle between the spin
  axis, by the right-hand rule, and the orbit's pole: from the IAU pole at J2000
  and JPL's mean orbit, to 0.01°. Over 90°, as for Venus, Uranus and Pluto, the
  body spins backwards. Pluto's is 119.61°: the 122.53° often quoted comes from
  the IAU's pole before 2009.

- `rotation.iau` is the IAU's rotation model (Archinal et al. 2018), with every
  periodic term: without them Mars's pole would be 1.6° off, and its tilt 23.9°.
  Earth's is the 2009 report's (Archinal et al. 2011), which the 2015 report
  dropped: its prime meridian can be 150″ or more off, so use the IERS's Earth
  rotation angle for precise work. The planets' poles are the IAU's `'north'`,
  on the north side of the solar system's invariable plane, so Venus's and
  Uranus's prime meridians turn backwards; Ceres's and Pluto's are `'positive'`,
  by the right-hand rule. The IAU has none for the other dwarf planets.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of planets in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id          | name        | type               | category  | parent      | orbit.a     | orbit.e  | orbit.period                                                                  | orbit.retrograde | orbit.angle | orbit.i     | orbit.w      | orbit.om     | orbit.frame | rotation.period | rotation.retrograde | rotation.obliquity | rotation.iau                    | radius       | mu (m³/s²)        | display.color                                                          | x           | y           | z           |
| ----------- | ----------- | ------------------ | --------- | ----------- | ----------- | -------- | ----------------------------------------------------------------------------- | ---------------- | ----------- | ----------- | ------------ | ------------ | ----------- | --------------- | ------------------- | ------------------ | ------------------------------- | ------------ | ----------------- | ---------------------------------------------------------------------- | ----------- | ----------- | ----------- |
| mercury     | Mercury     | silicate planet    | planet    | sun         | 0.387 au    | 0.2056   | 87.969 d                                                                      |                  | 3.080377    | 7.00497902  | 29.12703035  | 48.33076593  | ecliptic    | 58.6461459 d    |                     | 0.034              | north (281.0103°, 61.4155°)     | 2439.4 km    | 2.2031868551e+13  | #8B8B8B                                                                | -0.1301 au  | -0.4472 au  | -0.0246 au  |
| venus       | Venus       | silicate planet    | planet    | sun         | 0.723 au    | 0.0068   | 224.701 d                                                                     |                  | 0.88977     | 3.39467605  | 54.92262463  | 76.67984255  | ecliptic    | 243.018484 d    | yes                 | 177.362            | north (272.76°, 67.16°)         | 6051.8 km    | 3.24858592e+14    | #E49B0F                                                                | -0.718 au   | -0.0327 au  | 0.041 au    |
| earth       | Earth       | silicate planet    | planet    | sun         | 1 au        | 0.0167   | 365.256 d                                                                     |                  | 6.238549    | 0           | 102.93768193 | 0            | ecliptic    | 0.9972696632 d  |                     | 23.439             | north (0°, 90°)                 | 6371.0084 km | 3.98600435507e+14 | #1E90FF                                                                | -0.1772 au  | 0.9672 au   | 0 au        |
| mars        | Mars        | desert planet      | planet    | sun         | 1.524 au    | 0.0934   | 686.98 d                                                                      |                  | 0.408015    | 1.84969142  | 286.4968315  | 49.55953891  | ecliptic    | 1.025956756 d   |                     | 25.192             | north (317.269202°, 54.432516°) | 3389.5 km    | 4.282837362e+13   | #D14A28                                                                | 1.3909 au   | -0.0134 au  | -0.0345 au  |
| ceres       | Ceres       | ice planet         | planetoid | sun         | 2.7665 au   | 0.07838  | 1680.7 d                                                                      |                  | 0.126478    | 10.58336046 | 73.92286274  | 80.49435747  | ecliptic    | 0.3780904165 d  |                     |                    | positive (291.418°, 66.764°)    | 469.7 km     | 6.26284e+10       | #C0C0C0                                                                | -2.3793 au  | 0.7955 au   | 0.463 au    |
| jupiter     | Jupiter     | gas giant          | planet    | sun         | 5.203 au    | 0.0489   | 4332.59 d                                                                     |                  | 0.378185    | 1.30439695  | 274.25457074 | 100.47390909 | ecliptic    | 0.4135383258 d  |                     | 3.119              | north (268.056595°, 64.495303°) | 69911 km     | 1.266865319e+17   | #C08850                                                                | 3.9953 au   | 2.9459 au   | -0.1016 au  |
| saturn      | Saturn      | gas giant          | planet    | sun         | 9.537 au    | 0.0565   | 10759.22 d                                                                    |                  | 5.458247    | 2.48599187  | 338.93645383 | 113.66242448 | ecliptic    | 0.4440092592 d  |                     | 26.73              | north (40.589°, 83.537°)        | 58232 km     | 3.793120623e+16   | #D2B48C                                                                | 6.4288 au   | 6.5083 au   | -0.3691 au  |
| uranus      | Uranus      | ice giant          | planet    | sun         | 19.191 au   | 0.0463   | 30687.15 d                                                                    |                  | 2.537459    | 0.77263783  | 96.93735127  | 74.01692503  | ecliptic    | 0.7183333333 d  | yes                 | 97.77              | north (257.311°, -15.175°)      | 25362 km     | 5.7939513e+15     | #78D6FF                                                                | 14.4012 au  | -13.7439 au | -0.2377 au  |
| neptune     | Neptune     | ice giant          | planet    | sun         | 30.069 au   | 0.0086   | 60190.03 d                                                                    |                  | 4.519475    | 1.77004347  | 273.18053653 | 131.78422574 | ecliptic    | 0.6652625 d     |                     | 28.318             | north (299.36°, 43.46°)         | 24622 km     | 6.83509997e+15    | #0053D6                                                                | 16.8038 au  | -24.9923 au | 0.1274 au   |
| pluto       | Pluto       | ice planet         | planetoid | sun         | 39.2643 au  | 0.24467  | 89866.1 d                                                                     |                  | 0.440001    | 17.1513644  | 113.76290249 | 110.28692974 | ecliptic    | 6.387222999 d   | yes                 | 119.608            | positive (132.993°, -6.163°)    | 1188.3 km    | 8.693e+11         | #B0A99F                                                                | -9.8754 au  | -27.9588 au | 5.8504 au   |
| eris        | Eris        | ice planet         | planetoid | sun         | 68.1399 au  | 0.432505 | 205447.3 d                                                                    |                  | 3.251515    | 43.74050564 | 150.84480964 | 36.12852074  | ecliptic    | 15.771 d        |                     |                    |                                 | 1163 km      | 1.0935e+12        | #F2F0EC                                                                | 88.3933 au  | 30.7652 au  | -26.0944 au |
| haumea      | Haumea      | ice planet         | planetoid | sun         | 42.9093 au  | 0.199921 | 102665.6 d                                                                    |                  | 3.255681    | 28.20614177 | 240.59077767 | 121.93323859 | ecliptic    | 0.163139208 d   |                     |                    |                                 | 797.6 km     | 2.63798e+11       | #F4F5F7                                                                | -45.9898 au | -5.1205 au  | 22.3856 au  |
| makemake    | Makemake    | ice planet         | planetoid | sun         | 45.3721 au  | 0.164523 | 111630.1 d                                                                    |                  | 2.621343    | 29.00018554 | 296.28099919 | 79.27490607  | ecliptic    | 0.9511083333 d  |                     |                    |                                 | 714 km       |                   | #D9B48F                                                                | -43.5785 au | 11.4783 au  | 24.9182 au  |
| gonggong    | Gonggong    | ice planet         | planetoid | sun         | 67.0513 au  | 0.499574 | 200543.7 d                                                                    |                  | 2.487949    | 30.71461209 | 206.94098704 | 336.87541406 | ecliptic    | 1.867083333 d   |                     |                    |                                 | 615 km       | 1.168e+11         | #B5553A                                                                | 70.2665 au  | -44.2264 au | -7.7691 au  |
| quaoar      | Quaoar      | ice planet         | planetoid | sun         | 43.133 au   | 0.03951  | 103469.7 d                                                                    |                  | 4.442872    | 8.00508947  | 163.78548728 | 189.07999041 | ecliptic    | 0.7366166667 d  |                     |                    |                                 | 545 km       | 8.0626e+10        | #A86E52                                                                | -16.7665 au | -39.8317 au | 5.1593 au   |
| sedna       | Sedna       | ice planet         | planetoid | sun         | 549.8733 au | 0.86098  | [`4709690`](https://github.com/phun-ky/interstellar-tools/commit/4709690).2 d |                  | 5.428088    | 11.92524942 | 310.73286356 | 144.31692861 | ecliptic    | 0.4280416667 d  |                     |                    |                                 | 497.5 km     |                   | #B0472F                                                                | 61.9508 au  | 63.8763 au  | -18.5892 au |
| trappist-1b | TRAPPIST-1b | terrestrial planet | planet    | trappist-1a | 0.01154 au  | 0.0031   | 1.51088432 d                                                                  |                  | 5.951573    | 89.728      | 134.7        |              | sky         |                 |                     |                    |                                 | 7119 km      | 5.4768e+14        | #8A7566                                                                |             |             |             |
| trappist-1c | TRAPPIST-1c | terrestrial planet | planet    | trappist-1a | 0.0158 au   | 0.0006   | 2.42179346 d                                                                  |                  | 0.039794    | 89.778      | 1            |              | sky         |                 |                     |                    |                                 | 6995 km      | 5.2137e+14        | [#968779](https://github.com/phun-ky/interstellar-tools/issues/968779) |             |             |             |
| trappist-1d | TRAPPIST-1d | terrestrial planet | planet    | trappist-1a | 0.02227 au  | 0.0056   | 4.04978035 d                                                                  |                  | 2.310118    | 89.896      | 151.7        |              | sky         |                 |                     |                    |                                 | 5026 km      | 1.5466e+14        | #8F9190                                                                |             |             |             |
| trappist-1e | TRAPPIST-1e | terrestrial planet | planet    | trappist-1a | 0.02925 au  | 0.0063   | 6.09956479 d                                                                  |                  | 4.937536    | 89.793      | 313.2        |              | sky         |                 |                     |                    |                                 | 5868 km      | 2.7583e+14        | #7F8F99                                                                |             |             |             |
| trappist-1f | TRAPPIST-1f | terrestrial planet | planet    | trappist-1a | 0.03849 au  | 0.0084   | 9.20659399 d                                                                  |                  | 1.961925    | 89.74       | 183.5        |              | sky         |                 |                     |                    |                                 | 6664 km      | 4.1415e+14        | #8C9BA6                                                                |             |             |             |
| trappist-1g | TRAPPIST-1g | terrestrial planet | planet    | trappist-1a | 0.04683 au  | 0.004    | 12.3535557 d                                                                  |                  | 4.790929    | 89.742      | 18.6         |              | sky         |                 |                     |                    |                                 | 7204 km      | 5.2655e+14        | #A1AEB8                                                                |             |             |             |
| trappist-1h | TRAPPIST-1h | terrestrial planet | planet    | trappist-1a | 0.06189 au  | 0.0037   | 18.7672745 d                                                                  |                  | 4.893554    | 89.805      | 180.3        |              | sky         |                 |                     |                    |                                 | 4817 km      | 1.2994e+14        | #B8C1C7                                                                |             |             |             |

</div>

**Example item in dataset:**

```ts
{
  id: 'mercury',
  name: 'Mercury',
  type: 'silicate planet',
  category: 'planet',
  parent: 'sun',
  orbit: {
    /** Semi-major axis in AU */
    a: { value: 0.387, unit: 'au' },
    /** Orbital eccentricity */
    e: 0.2056,
    /** Orbital period in days */
    period: { value: 87.969, unit: 'd' },
    /** True anomaly at J2000 */
    angle: 3.080377 as Radians,
    i: 7.00497902 as DegreesType,
    w: 29.12703035 as DegreesType,
    om: 48.33076593 as DegreesType,
    frame: { plane: 'ecliptic' }
  },
  /** Sidereal rotation in days */
  rotation: {
    period: { value: 58.6461459, unit: 'd' },
    obliquity: 0.034 as DegreesType,
    iau: {
      pole: 'north',
      rightAscension: 281.0103 as DegreesType,
      rightAscensionRate: -0.0328,
      declination: 61.4155 as DegreesType,
      declinationRate: -0.0049,
      primeMeridian: 329.5988 as DegreesType,
      primeMeridianRate: 6.1385108,
      primeMeridianTerms: [
        iauTerm(0.01067257, 174.7910857, 149472.535875),
        iauTerm(-0.00112309, 349.5821714, 298945.07175),
        iauTerm(-0.0001104, 164.3732571, 448417.607625),
        iauTerm(-0.00002539, 339.1643429, 597890.1435),
        iauTerm(-0.00000571, 153.9554286, 747362.679375)
      ]
    }
  },
  /** Radius in km */
  radius: { value: 2439.4, unit: 'km' },
  ellipsoid: {
    equatorialRadius: { value: 2439.4, unit: 'km' },
    polarRadius: { value: 2439.4, unit: 'km' }
  },
  mu: 2.2031868551e13,
  display: {
    /** Visual representation color */
    color: '#8B8B8B'
  },
  /** Heliocentric position at J2000 (J2000 ecliptic frame) in au */
  x: { value: -0.1301, unit: 'au' },
  y: { value: -0.4472, unit: 'au' },
  z: { value: -0.0246, unit: 'au' }
},
```

## See

[PlanetsType](../../types/type-aliases/PlanetsType.md).

## Example

```ts
console.log(PLANETS[0].name); // "Mercury"
```
