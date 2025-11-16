[Documentation](../../index.md) /
[**@interstellar-tools/constants**](https://github.com/interstellar-tools/constants)

# [**@interstellar-tools/constants**](https://github.com/interstellar-tools/constants)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

```shell [npm]
npm i --save @interstellar-tools/constants
```

## Variables

| Variable                  | Description                               |
| ------------------------- | ----------------------------------------- |
| [G_SI](variables/G_SI.md) | Gravitational constant **G** in SI units. |

## Date

| Variable                                                                              | Description                                                                                                      |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [EPOCH_2000_UTC_MIDNIGHT](variables/EPOCH_2000_UTC_MIDNIGHT.md)                       | **UTC midnight at the start of 2000-01-01** (convenient calendar anchor).                                        |
| [EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE](variables/EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE.md) | Time scale associated with [EPOCH_2000_UTC_MIDNIGHT](variables/EPOCH_2000_UTC_MIDNIGHT.md).                      |
| [J2000_EPOCH_TIME_SCALE](variables/J2000_EPOCH_TIME_SCALE.md)                         | The **defining** time scale for the J2000 epoch. J2000 is conventionally specified in **Terrestrial Time** (TT). |
| [J2000_TT](variables/J2000_TT.md)                                                     | **J2000 epoch as a Julian Date in the TT time scale.**                                                           |
| [J2000_UTC](variables/J2000_UTC.md)                                                   | **J2000 epoch as a UTC timestamp** for JavaScript usage.                                                         |
| [J2000_UTC_TIME_SCALE](variables/J2000_UTC_TIME_SCALE.md)                             | Time scale associated with [J2000_UTC](variables/J2000_UTC.md).                                                  |
| [TIME_SCALE_TT](variables/TIME_SCALE_TT.md)                                           | -                                                                                                                |
| [TIME_SCALE_UTC](variables/TIME_SCALE_UTC.md)                                         | Time-scale tags used in this package.                                                                            |
| [TT_MINUS_UTC_AT_J2000_MS](variables/TT_MINUS_UTC_AT_J2000_MS.md)                     | -                                                                                                                |
| [TT_MINUS_UTC_AT_J2000_SECONDS](variables/TT_MINUS_UTC_AT_J2000_SECONDS.md)           | Useful offset at the J2000 epoch (for UTC↔TT conversions near that instant).                                    |

## Distance

| Variable                                                      | Description                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [AU_METERS](variables/AU_METERS.md)                           | Astronomical unit in meters, **exact** (IAU 2012 B2).                                    |
| [AU_PER_LY](variables/AU_PER_LY.md)                           | Astronomical units per light-year.                                                       |
| [KM_PER_AU](variables/KM_PER_AU.md)                           | Kilometers in one astronomical unit.                                                     |
| [LY_PER_AU](variables/LY_PER_AU.md)                           | Light-years per astronomical unit (reciprocal of [AU_PER_LY](variables/AU_PER_LY.md)).   |
| [LY_PER_PC](variables/LY_PER_PC.md)                           | Light-years per parsec.                                                                  |
| [METERS_PER_LY](variables/METERS_PER_LY.md)                   | Meters in one **light-year**, defined as `c × (Julian year)`.                            |
| [METERS_PER_PC](variables/METERS_PER_PC.md)                   | Meters in one **parsec**, using the exact trigonometric definition: `pc = au / tan(1″)`. |
| [PC_PER_LY](variables/PC_PER_LY.md)                           | Parsecs per light-year (reciprocal of [LY_PER_PC](variables/LY_PER_PC.md)).              |
| [RADIANS_PER_ARCSECOND](variables/RADIANS_PER_ARCSECOND.md)   | Radians in one arcsecond: `π / 648 000`.                                                 |
| [SPEED_OF_LIGHT_M_PER_S](variables/SPEED_OF_LIGHT_M_PER_S.md) | Speed of light in vacuum, **exact** per SI (m·s⁻¹).                                      |

## Math

| Variable                      | Description                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TWO_PI](variables/TWO_PI.md) | The circle constant **τ** (tau), equal to **2π** `(≈ 6.283185307179586)`. Useful for full rotations, radians-per-turn calculations, angular velocity, and other periodic math where factors of 2 arise naturally. |

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

## Temporal

| Variable                                                        | Description                                                |
| --------------------------------------------------------------- | ---------------------------------------------------------- |
| [JULIAN_YEAR_DAYS](variables/JULIAN_YEAR_DAYS.md)               | Length of the **Julian year** in SI days (exactly 365.25). |
| [JULIAN_YEAR_SECONDS](variables/JULIAN_YEAR_SECONDS.md)         | Length of the **Julian year** in seconds.                  |
| [MILLISECONDS_PER_DAY](variables/MILLISECONDS_PER_DAY.md)       | Milliseconds in one **SI day**.                            |
| [MILLISECONDS_PER_SECOND](variables/MILLISECONDS_PER_SECOND.md) | Milliseconds in one second (exact).                        |
| [SECONDS_PER_DAY](variables/SECONDS_PER_DAY.md)                 | Length of the **SI day** in seconds (exact).               |
