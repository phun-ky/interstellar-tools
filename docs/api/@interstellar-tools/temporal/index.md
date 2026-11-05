[Documentation](../../index.md) /
[**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

# [**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

Time and epoch utilities for space applications, from attoseconds to gigayears,
with unit normalisation and conversion that the rest of the stack builds on, and
Julian dates on the UTC, TAI, TT, UT1, TDB and GPS time scales, with leap
seconds.

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Getting started](https://phun-ky.net/interstellar-tools/guide/introduction/):
  installation, unit conventions and recommended practices
- [API reference for `@interstellar-tools/temporal`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/temporal/):
  every export, with formulas, parameters and examples

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher

```shell [npm]
npm i --save @interstellar-tools/temporal
```

## Variables

| Variable                                                        | Description                                                                                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [NORMALIZE_TEMPORAL_UNIT](variables/NORMALIZE_TEMPORAL_UNIT.md) | Lookup table that **normalizes user-facing time unit aliases** (and the canonical symbols themselves) to a single, canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md). |
| [SECONDS_PER](variables/SECONDS_PER.md)                         | Seconds-per-unit lookup for all canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md) symbols.                                                                            |

## Functions

| Function                                                    | Description                                                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [convertTemporalUnit](functions/convertTemporalUnit.md)     | Convert a temporal **duration** between any two canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md) units.     |
| [normalizeTemporalUnit](functions/normalizeTemporalUnit.md) | Normalize a user-provided **temporal unit string** into a canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md). |

## Mars time

| Function                                                      | Description                                                                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [coordinatedMarsTime](functions/coordinatedMarsTime.md)       | **Coordinated Mars Time** (MTC): the mean solar time at Mars's prime meridian, Airy-0, in hours, like UTC is at Greenwich.               |
| [marsLocalMeanSolarTime](functions/marsLocalMeanSolarTime.md) | The **local mean solar time on Mars** at a longitude, in hours: Coordinated Mars Time plus the east longitude in hours, 15° to the hour. |
| [marsSolDate](functions/marsSolDate.md)                       | The **Mars Sol Date** of a moment: a continuous count of sols, Mars's mean solar days, like the Julian date for Earth.                   |
| [missionSol](functions/missionSol.md)                         | The **mission sol** at a landing site: the number of the sol a rover is on, counted from its landing.                                    |

## Time scales

| Function                                              | Description                                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [dateFromJulianDate](functions/dateFromJulianDate.md) | The **UTC `Date`** of a Julian date in a time scale: the inverse of [julianDate](functions/julianDate.md).                                       |
| [julianDate](functions/julianDate.md)                 | The **Julian date** of a moment, in a time scale: the number of days since noon on 1 January 4713 BC, counted on that scale's clock.             |
| [modifiedJulianDate](functions/modifiedJulianDate.md) | The **modified Julian date** of a moment, in a time scale: the Julian date minus 2 400 000.5, so days start at midnight and MJD 0 is 1858-11-17. |
| [taiMinusUtc](functions/taiMinusUtc.md)               | **TAI − UTC**, in **s**, at a moment: the number of leap seconds so far, plus the 10 s UTC started with in 1972.                                 |
