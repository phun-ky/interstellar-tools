[Documentation](../../index.md) /
[**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

# [**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

Time and epoch utilities for space applications, from attoseconds to gigayears,
with unit normalisation and conversion that the rest of the stack builds on, and
Julian dates on the UTC, TAI, TT and UT1 time scales, with leap seconds.

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

## Time scales

| Function                                              | Description                                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [dateFromJulianDate](functions/dateFromJulianDate.md) | The **UTC `Date`** of a Julian date in a time scale: the inverse of [julianDate](functions/julianDate.md).                                       |
| [julianDate](functions/julianDate.md)                 | The **Julian date** of a moment, in a time scale: the number of days since noon on 1 January 4713 BC, counted on that scale's clock.             |
| [modifiedJulianDate](functions/modifiedJulianDate.md) | The **modified Julian date** of a moment, in a time scale: the Julian date minus 2 400 000.5, so days start at midnight and MJD 0 is 1858-11-17. |
| [taiMinusUtc](functions/taiMinusUtc.md)               | **TAI − UTC**, in **s**, at a moment: the number of leap seconds so far, plus the 10 s UTC started with in 1972.                                 |
