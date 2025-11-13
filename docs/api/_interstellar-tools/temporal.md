[Documentation](../index.md) /
[**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

# [**@interstellar-tools/temporal**](https://github.com/interstellar-tools/temporal)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

::: code-group

```shell [npm]
npm i --save @interstellar-tools/temporal
```

```shell [yarn]
yarn add @interstellar-tools/temporal
```

:::

## Variables

| Variable                                     | Description                                                                                                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [NORMALIZE_UNIT](temporal/NORMALIZE_UNIT.md) | Lookup table that **normalizes user-facing time unit aliases** (and the canonical symbols themselves) to a single, canonical [TemporalUnitType](types/TemporalUnitType.md). |

## Functions

| Function                                                   | Description                                                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [convertTemporalUnit](temporal/convertTemporalUnit.md)     | Convert a temporal **duration** between any two canonical [TemporalUnitType](types/TemporalUnitType.md) units.     |
| [normalizeTemporalUnit](temporal/normalizeTemporalUnit.md) | Normalize a user-provided **temporal unit string** into a canonical [TemporalUnitType](types/TemporalUnitType.md). |
