[Documentation](../../index.md) /
[**@interstellar-tools/constants**](https://github.com/interstellar-tools/constants)

# [**@interstellar-tools/constants**](https://github.com/interstellar-tools/constants)

Authoritative physical and astronomical constants in SI units, plus curated
datasets of planets, moons, stars, comets, asteroids and galaxies, so every
calculation in your stack draws on the same source of truth.

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Getting started](https://phun-ky.net/interstellar-tools/guide/introduction/):
  installation, unit conventions and recommended practices
- [API reference for `@interstellar-tools/constants`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/constants/):
  every export, with formulas, parameters and examples

## Installation

- [Node.js](https://nodejs.org/) version 22.12.0 or higher
- ES modules; `require()` needs Node 22.12 or later

```shell [npm]
npm i --save @interstellar-tools/constants
```

## Variables

| Variable                        | Description                                                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [EGM2008](variables/EGM2008.md) | **Earth's gravity field** from EGM2008, the Earth Gravitational Model of the US National Geospatial-Intelligence Agency, to the sixth zonal harmonic: what a numerical propagator needs beyond a point mass. |
| [G_SI](variables/G_SI.md)       | Gravitational constant **G** in SI units.                                                                                                                                                                    |
| [WGS84](variables/WGS84.md)     | The **WGS 84** reference ellipsoid: Earth's shape as GPS uses it.                                                                                                                                            |

## Datasets

| Variable                                                  | Description                                                                                                                 |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [ASTEROID_BELTS](variables/ASTEROID_BELTS.md)             | Predefined asteroid belts in the solar system visualization.                                                                |
| [ASTEROIDS](variables/ASTEROIDS.md)                       | Represents a collection of well-known asteroids within the solar system simulation.                                         |
| [COMETS](variables/COMETS.md)                             | Represents a collection of well-known comets within the solar system simulation.                                            |
| [GALAXIES](variables/GALAXIES.md)                         | Represents a collection of galaxies within the space visualization.                                                         |
| [INTERSTELLAR_OBJECTS](variables/INTERSTELLAR_OBJECTS.md) | Represents the **interstellar objects** seen so far: bodies from other stars' systems, passing the Sun once on open orbits. |
| [MOONS](variables/MOONS.md)                               | Represents a dataset of natural satellites (moons) in the solar system.                                                     |
| [PLANETS](variables/PLANETS.md)                           | Represents a dataset of planets and planetoids in the solar system.                                                         |
| [STARS](variables/STARS.md)                               | Represents a dataset of well-known stars within the Milky Way.                                                              |
| [SYSTEMS](variables/SYSTEMS.md)                           | Predefined systems: the barycenters that stars and planets orbit.                                                           |

## Date

| Variable                                                                              | Description                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [EPOCH_2000_UTC_MIDNIGHT](variables/EPOCH_2000_UTC_MIDNIGHT.md)                       | **UTC midnight at the start of 2000-01-01** (convenient calendar anchor).                                                                                                                                                            |
| [EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE](variables/EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE.md) | Time scale associated with [EPOCH_2000_UTC_MIDNIGHT](variables/EPOCH_2000_UTC_MIDNIGHT.md).                                                                                                                                          |
| [J2000_EPOCH_TIME_SCALE](variables/J2000_EPOCH_TIME_SCALE.md)                         | The **defining** time scale for the J2000 epoch. J2000 is conventionally specified in **Terrestrial Time** (TT).                                                                                                                     |
| [J2000_TT](variables/J2000_TT.md)                                                     | **J2000 epoch as a Julian Date in the TT time scale.**                                                                                                                                                                               |
| [J2000_UTC](variables/J2000_UTC.md)                                                   | **J2000 epoch as a UTC timestamp** for JavaScript usage.                                                                                                                                                                             |
| [J2000_UTC_TIME_SCALE](variables/J2000_UTC_TIME_SCALE.md)                             | Time scale associated with [J2000_UTC](variables/J2000_UTC.md).                                                                                                                                                                      |
| [JULIAN_DATE_UNIX_EPOCH](variables/JULIAN_DATE_UNIX_EPOCH.md)                         | The **Julian date of the Unix epoch**, 1970-01-01T00:00:00Z: **[`2440587`](https://github.com/phun-ky/interstellar-tools/commit/2440587).5**. A Julian date counts days from noon on 1 January 4713 BC, so whole days start at noon. |
| [LEAP_SECONDS](variables/LEAP_SECONDS.md)                                             | The **leap second table**: TAI − UTC, in **s**, from each date on, since UTC took whole-second steps on 1972-01-01.                                                                                                                  |
| [MODIFIED_JULIAN_DATE_OFFSET](variables/MODIFIED_JULIAN_DATE_OFFSET.md)               | The offset of the **modified Julian date**: MJD = JD − **[`2400000`](https://github.com/phun-ky/interstellar-tools/commit/2400000).5**, so MJD 0 is 1858-11-17T00:00:00, and days start at midnight.                                 |
| [TIME_SCALE_TAI](variables/TIME_SCALE_TAI.md)                                         | -                                                                                                                                                                                                                                    |
| [TIME_SCALE_TT](variables/TIME_SCALE_TT.md)                                           | -                                                                                                                                                                                                                                    |
| [TIME_SCALE_UT1](variables/TIME_SCALE_UT1.md)                                         | -                                                                                                                                                                                                                                    |
| [TIME_SCALE_UTC](variables/TIME_SCALE_UTC.md)                                         | Time-scale tags used in this package.                                                                                                                                                                                                |
| [TT_MINUS_TAI_SECONDS](variables/TT_MINUS_TAI_SECONDS.md)                             | **TT − TAI**: Terrestrial Time runs a fixed **32.184 s** ahead of International Atomic Time, by definition.                                                                                                                          |
| [TT_MINUS_UTC_AT_J2000_MS](variables/TT_MINUS_UTC_AT_J2000_MS.md)                     | -                                                                                                                                                                                                                                    |
| [TT_MINUS_UTC_AT_J2000_SECONDS](variables/TT_MINUS_UTC_AT_J2000_SECONDS.md)           | Useful offset at the J2000 epoch (for UTC↔TT conversions near that instant).                                                                                                                                                         |

## Distance

| Variable                                                      | Description                                                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [AU_METERS](variables/AU_METERS.md)                           | Astronomical unit in meters, **exact** (IAU 2012 B2).                                                |
| [AU_PER_LY](variables/AU_PER_LY.md)                           | Astronomical units per light-year.                                                                   |
| [KM_PER_AU](variables/KM_PER_AU.md)                           | Kilometers in one astronomical unit.                                                                 |
| [LY_PER_AU](variables/LY_PER_AU.md)                           | Light-years per astronomical unit (reciprocal of [AU_PER_LY](variables/AU_PER_LY.md)).               |
| [LY_PER_PC](variables/LY_PER_PC.md)                           | Light-years per parsec.                                                                              |
| [METERS_PER_LY](variables/METERS_PER_LY.md)                   | Meters in one **light-year**, defined as `c × (Julian year)`.                                        |
| [METERS_PER_PC](variables/METERS_PER_PC.md)                   | Meters in one **parsec**, using the exact IAU 2015 Resolution B2 definition: `pc = (648000 / π) au`. |
| [PC_PER_LY](variables/PC_PER_LY.md)                           | Parsecs per light-year (reciprocal of [LY_PER_PC](variables/LY_PER_PC.md)).                          |
| [RADIANS_PER_ARCSECOND](variables/RADIANS_PER_ARCSECOND.md)   | Radians in one arcsecond: `π / 648 000`.                                                             |
| [SPEED_OF_LIGHT_M_PER_S](variables/SPEED_OF_LIGHT_M_PER_S.md) | Speed of light in vacuum, **exact** per SI (m·s⁻¹).                                                  |

## Galactic

| Variable                                                                        | Description                                                                                                             |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [SUN_GALACTOCENTRIC_DISTANCE](variables/SUN_GALACTOCENTRIC_DISTANCE.md)         | The **Sun's distance from the Milky Way's centre**, $R_0$: 8275.9 ± 8.6 pc.                                             |
| [SUN_GALACTOCENTRIC_VELOCITY](variables/SUN_GALACTOCENTRIC_VELOCITY.md)         | The **Sun's velocity around the Milky Way's centre**, in km/s, in the `'galactocentric'` frame: $(12.9, 251.51, 8.56)$. |
| [SUN_HEIGHT_ABOVE_GALACTIC_PLANE](variables/SUN_HEIGHT_ABOVE_GALACTIC_PLANE.md) | The **Sun's height above the Milky Way's plane**, $z_\odot$: 20.8 ± 0.3 pc, to the galactic north.                      |

## Math

| Variable                      | Description                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TWO_PI](variables/TWO_PI.md) | The circle constant **τ** (tau), equal to **2π** `(≈ 6.283185307179586)`. Useful for full rotations, radians-per-turn calculations, angular velocity, and other periodic math where factors of 2 arise naturally. |

## Nominal

| Variable                                                                                    | Description                                                                                   |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [EARTH_EQUATORIAL_RADIUS_NOMINAL_KM](variables/EARTH_EQUATORIAL_RADIUS_NOMINAL_KM.md)       | Nominal **equatorial radius of Earth**, $R^\mathrm{N}_{eE}$: 6378.1 km, zero tide.            |
| [EARTH_GM_NOMINAL_M3_PER_S2](variables/EARTH_GM_NOMINAL_M3_PER_S2.md)                       | Nominal **mass parameter of Earth**, $(GM)^\mathrm{N}_E$: 3.986004 × 10¹⁴ m³/s².              |
| [EARTH_POLAR_RADIUS_NOMINAL_KM](variables/EARTH_POLAR_RADIUS_NOMINAL_KM.md)                 | Nominal **polar radius of Earth**, $R^\mathrm{N}_{pE}$: 6356.8 km, zero tide.                 |
| [JUPITER_EQUATORIAL_RADIUS_NOMINAL_KM](variables/JUPITER_EQUATORIAL_RADIUS_NOMINAL_KM.md)   | Nominal **equatorial radius of Jupiter**, $R^\mathrm{N}_{eJ}$: 71 492 km, at the 1-bar level. |
| [JUPITER_GM_NOMINAL_M3_PER_S2](variables/JUPITER_GM_NOMINAL_M3_PER_S2.md)                   | Nominal **mass parameter of Jupiter**, $(GM)^\mathrm{N}_J$: 1.2668653 × 10¹⁷ m³/s².           |
| [JUPITER_POLAR_RADIUS_NOMINAL_KM](variables/JUPITER_POLAR_RADIUS_NOMINAL_KM.md)             | Nominal **polar radius of Jupiter**, $R^\mathrm{N}_{pJ}$: 66 854 km, at the 1-bar level.      |
| [SOLAR_EFFECTIVE_TEMPERATURE_NOMINAL_K](variables/SOLAR_EFFECTIVE_TEMPERATURE_NOMINAL_K.md) | Nominal **solar effective temperature**, $T^\mathrm{N}_{\mathrm{eff}\odot}$: 5772 K.          |
| [SOLAR_GM_NOMINAL_M3_PER_S2](variables/SOLAR_GM_NOMINAL_M3_PER_S2.md)                       | Nominal **solar mass parameter**, $(GM)^\mathrm{N}_\odot$: 1.3271244 × 10²⁰ m³/s².            |
| [SOLAR_IRRADIANCE_NOMINAL_W_PER_M2](variables/SOLAR_IRRADIANCE_NOMINAL_W_PER_M2.md)         | Nominal **total solar irradiance**, $S^\mathrm{N}_\odot$: 1361 W/m².                          |
| [SOLAR_LUMINOSITY_NOMINAL_W](variables/SOLAR_LUMINOSITY_NOMINAL_W.md)                       | Nominal **solar luminosity**, $L^\mathrm{N}_\odot$: 3.828 × 10²⁶ W.                           |

## Objects

| Variable                                                                                                  | Description                                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [SOLAR_RADIUS_NOMINAL_KM](variables/SOLAR_RADIUS_NOMINAL_KM.md)                                           | Nominal solar radius (IAU 2015 B3), exact.                                                                                      |
| [SOLAR_RADIUS_PHOTOSPHERIC_KM](variables/SOLAR_RADIUS_PHOTOSPHERIC_KM.md)                                 | Photospheric / "standard" solar radius suggested for models (HSK 2008). Reconciles seismic and photospheric definitions.        |
| [SOLAR_RADIUS_PICARD_SODISM_535_7_NM_KM](variables/SOLAR_RADIUS_PICARD_SODISM_535_7_NM_KM.md)             | PICARD/SODISM radius at 535.7 nm.                                                                                               |
| [SOLAR_RADIUS_PICARD_SODISM_535_7_NM_UNC_KM](variables/SOLAR_RADIUS_PICARD_SODISM_535_7_NM_UNC_KM.md)     | 1σ uncertainty at 535.7 nm.                                                                                                     |
| [SOLAR_RADIUS_PICARD_SODISM_607_1_NM_KM](variables/SOLAR_RADIUS_PICARD_SODISM_607_1_NM_KM.md)             | PICARD/SODISM radius at 607.1 nm.                                                                                               |
| [SOLAR_RADIUS_PICARD_SODISM_607_1_NM_UNC_KM](variables/SOLAR_RADIUS_PICARD_SODISM_607_1_NM_UNC_KM.md)     | 1σ uncertainty at 607.1 nm.                                                                                                     |
| [SOLAR_RADIUS_PICARD_SODISM_782_2_NM_KM](variables/SOLAR_RADIUS_PICARD_SODISM_782_2_NM_KM.md)             | PICARD/SODISM radius at 782.2 nm.                                                                                               |
| [SOLAR_RADIUS_PICARD_SODISM_782_2_NM_UNC_KM](variables/SOLAR_RADIUS_PICARD_SODISM_782_2_NM_UNC_KM.md)     | 1σ uncertainty at 782.2 nm.                                                                                                     |
| [SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_KM](variables/SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_KM.md)         | Limb–inflection minus photospheric offset (~0.333 Mm). / export const SOLAR_RADIUS_LIMB_INFLECTION_MINUS_PHOTOSPHERIC_KM = 333; |
| [SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_UNC_KM](variables/SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_UNC_KM.md) | 1σ uncertainty for SOHO/MDI Mercury-transit radius.                                                                             |

## Observations

| Name                                                                              | Description                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [DISCOVERIES](variables/DISCOVERIES.md)                                           | How and when bodies were **discovered**, keyed by body id: the date, the people credited and the observatory, from the Minor Planet Center's circulars. For the interstellar objects so far.                                                                                                       |
| [HELIOSPHERE](variables/HELIOSPHERE.md)                                           | The Sun's **heliosphere**, the bubble the solar wind blows into the interstellar medium: the heliopause's distance towards the nose, on the flanks and down the tail, the interstellar wind's direction and speed, and the Voyagers' crossings of its boundaries.                                  |
| [HELIOSPHERE_DISPLAY](variables/HELIOSPHERE_DISPLAY.md)                           | How to **draw the heliosphere**: hidden until a renderer offers to show it, as it has no colour of its own. [withDisplay](functions/withDisplay.md) puts it on the Sun as its `display.astrosphere`.                                                                                               |
| [INTERSTELLAR_OBJECT_OBSERVATIONS](variables/INTERSTELLAR_OBJECT_OBSERVATIONS.md) | What is **measured about the interstellar objects**, keyed by id: their catalogue identifiers, JPL's orbit solutions with the fitted non-gravitational accelerations, the radiants they came from, their magnitudes and, for ʻOumuamua, its push in m/s².                                          |
| [MOON_RING_ROLES](variables/MOON_RING_ROLES.md)                                   | The moons whose dust **feeds a ring**, keyed by moon id: Metis, Amalthea and Thebe for Jupiter's (Burns et al. 1999), Enceladus for Saturn's E ring and Phoebe for its Phoebe ring.                                                                                                                |
| [PLANET_RINGS](variables/PLANET_RINGS.md)                                         | The **rings** of Jupiter, Saturn, Uranus and Neptune, keyed by planet id: each ring's edges and optical depth, and Saturn's named gaps, from the PDS Ring-Moon Systems Node and NASA NSSDCA.                                                                                                       |
| [RING_DISPLAY](variables/RING_DISPLAY.md)                                         | How to **draw the giant planets' rings**, keyed by planet id: each as opaque as its densest ring, with Saturn's colour measured from Cassini's images and the others' assumed. `derivation` says which.                                                                                            |
| [STAR_ASTROMETRY](variables/STAR_ASTROMETRY.md)                                   | Where each star **is on the sky**, keyed by star id: its catalogue identifiers, its ICRS position at J2000, parallax, proper motion and radial velocity, its V magnitude, and its letter within its system. Given for every star but the Sun and the S-stars, from SIMBAD, Hipparcos and Gaia DR3. |
| [STAR_PARAMETERS](variables/STAR_PARAMETERS.md)                                   | What each star's **light** tells about it, keyed by star id: its spectral class, effective temperature, luminosity, surface gravity and metallicity, and for Vega and Altair, the temperatures at their poles and equators.                                                                        |
| [withDisplay](functions/withDisplay.md)                                           | The bodies, with **drawing groups kept apart** put on them: each body's entry in each group is merged into its `display`, beside its colour.                                                                                                                                                       |
| [withObservations](functions/withObservations.md)                                 | The bodies, with **observations kept apart** put on them: each body's entry in each group is merged into its `observations`.                                                                                                                                                                       |

## Temporal

| Variable                                                              | Description                                                                                                                                    |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [EARTH_SIDEREAL_DAY_SECONDS](variables/EARTH_SIDEREAL_DAY_SECONDS.md) | Earth's **sidereal day** in seconds: one turn against the vernal equinox, 23 h 56 m 4.0905 s. Sidereal time runs at this rate.                 |
| [JULIAN_YEAR_DAYS](variables/JULIAN_YEAR_DAYS.md)                     | Length of the **Julian year** in SI days (exactly 365.25).                                                                                     |
| [JULIAN_YEAR_SECONDS](variables/JULIAN_YEAR_SECONDS.md)               | Length of the **Julian year** in seconds.                                                                                                      |
| [MARS_SIDEREAL_DAY_SECONDS](variables/MARS_SIDEREAL_DAY_SECONDS.md)   | Mars's **sidereal day** in seconds: one turn against the stars, 24 h 37 m 22.663 s, the `rotation` of Mars in [PLANETS](variables/PLANETS.md). |
| [MARS_SOL_DAYS](variables/MARS_SOL_DAYS.md)                           | The **Martian sol** in Earth days: the ratio of a sol to a day, 1.0274912517.                                                                  |
| [MARS_SOL_SECONDS](variables/MARS_SOL_SECONDS.md)                     | The **Martian sol** in seconds: the mean solar day on Mars, sunrise to sunrise, 24 h 39 m 35.244 s.                                            |
| [MILLISECONDS_PER_DAY](variables/MILLISECONDS_PER_DAY.md)             | Milliseconds in one **SI day**.                                                                                                                |
| [MILLISECONDS_PER_SECOND](variables/MILLISECONDS_PER_SECOND.md)       | Milliseconds in one second (exact).                                                                                                            |
| [SECONDS_PER_DAY](variables/SECONDS_PER_DAY.md)                       | Length of the **SI day** in seconds (exact).                                                                                                   |
