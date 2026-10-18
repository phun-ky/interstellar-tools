[Documentation](../../index.md) /
[**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

# [**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

Time and epoch utilities for space applications, from attoseconds to gigayears,
with unit normalisation and conversion that the rest of the stack builds on.

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
