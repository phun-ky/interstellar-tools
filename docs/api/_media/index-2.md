[Documentation](../../packages.md) /
[**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

# [**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

```shell [npm]
npm i --save @interstellar-tools/temporal
```

## Variables

| Variable                                      | Description                                                                                                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [NORMALIZE_UNIT](variables/NORMALIZE_UNIT.md) | Lookup table that **normalizes user-facing time unit aliases** (and the canonical symbols themselves) to a single, canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md). |

## Functions

| Function                                                    | Description                                                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [convertTemporalUnit](functions/convertTemporalUnit.md)     | Convert a temporal **duration** between any two canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md) units.     |
| [normalizeTemporalUnit](functions/normalizeTemporalUnit.md) | Normalize a user-provided **temporal unit string** into a canonical [TemporalUnitType](../types/type-aliases/TemporalUnitType.md). |
