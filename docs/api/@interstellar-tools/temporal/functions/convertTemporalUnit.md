[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ convertTemporalUnit

# Function: convertTemporalUnit()

```ts
function convertTemporalUnit(
  time: TemporalInterface,
  targetUnit:
    | 'second'
    | 'seconds'
    | 'millisecond'
    | 'milliseconds'
    | 'microsecond'
    | 'microseconds'
    | 'us'
    | 'minute'
    | 'minutes'
    | 'hour'
    | 'hours'
    | 'day'
    | 'days'
    | 'year'
    | 'years'
    | 'yr'
    | 'yrs'
    | 'kiloyear'
    | 'kiloyears'
    | 'kyr'
    | 'megayear'
    | 'megayears'
    | 'megaannum'
    | 'megaannums'
    | 'Myr'
    | 'Ma'
    | 'gigayear'
    | 'gigayears'
    | 'gigaannum'
    | 'gigaannums'
    | 'Gyr'
    | 'Ga'
    | 's'
    | 'ms'
    | 'μs'
    | 'ns'
    | 'ps'
    | 'fs'
    | 'as'
    | 'zs'
    | 'ys'
    | 'min'
    | 'h'
    | 'd'
): TemporalInterface;
```

Defined in:
[convert-temporal-unit.ts:125](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/convert-temporal-unit.ts#L125)

Convert a temporal **duration** between any two
[TemporalUnitType](../../types/type-aliases/TemporalUnitType.md) units or their
aliases.

- Converts by the ratio of the units' lengths in
  [SECONDS_PER](../variables/SECONDS_PER.md), with the powers of ten kept apart,
  so whole numbers convert exactly: 1 ms is 1000 μs, not 1000.0000000000001.
- Interprets `d` as the **SI day** and `yr/kyr/Myr/Gyr` via the **Julian year**
  convention.
- Both `time.unit` and `targetUnit` may be canonical units or aliases such as
  `'days'`; they are normalized with `normalizeTemporalUnit`.

$$
\text{value}_{\text{target}}
\;=\;
\frac{\text{value}_{\text{in}} \cdot \mathrm{SECONDS\_PER}[u_{\text{in}}]}
     {\mathrm{SECONDS\_PER}[u_{\text{out}}]}
$$

## Parameters

| Parameter    | Type                                                               | Description                                                        |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `time`       | [`TemporalInterface`](../../types/interfaces/TemporalInterface.md) | Input duration `{ value, unit }`, in a canonical unit or an alias. |
| `targetUnit` |                                                                    | `"second"`                                                         | `"seconds"` | `"millisecond"` | `"milliseconds"` | `"microsecond"` | `"microseconds"` | `"us"` | `"minute"` | `"minutes"` | `"hour"` | `"hours"` | `"day"` | `"days"` | `"year"` | `"years"` | `"yr"` | `"yrs"` | `"kiloyear"` | `"kiloyears"` | `"kyr"` | `"megayear"` | `"megayears"` | `"megaannum"` | `"megaannums"` | `"Myr"` | `"Ma"` | `"gigayear"` | `"gigayears"` | `"gigaannum"` | `"gigaannums"` | `"Gyr"` | `"Ga"` | `"s"` | `"ms"` | `"μs"` | `"ns"` | `"ps"` | `"fs"` | `"as"` | `"zs"` | `"ys"` | `"min"` | `"h"` | `"d"` | Desired output unit, canonical or an alias (will be normalized). |

## Returns

[`TemporalInterface`](../../types/interfaces/TemporalInterface.md)

A new `{ value, unit }` where `unit` is the canonical target symbol.

## Example

```ts
convertTemporalUnit({ value: 2, unit: 'h' }, 'min');
// → { value: 120, unit: 'min' }

convertTemporalUnit({ value: 1, unit: 'd' }, 's');
// → { value: 86_400, unit: 's' }

convertTemporalUnit({ value: 3, unit: 'Myr' }, 'kyr');
// → { value: 3000, unit: 'kyr' }

convertTemporalUnit({ value: 1, unit: 'yr' }, 'd');
// → { value: 365.25, unit: 'd' }
```

## Throws

- If `time.unit` or `targetUnit` is not a string.
- If `time.unit` or `targetUnit` is not a known unit or alias.

## See

- SECONDS_PER_DAY
- JULIAN_YEAR_SECONDS
- normalizeTemporalUnit
