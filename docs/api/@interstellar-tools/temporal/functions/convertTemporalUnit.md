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
[convert-temporal-unit.ts:103](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/temporal/src/convert-temporal-unit.ts#L103)

Convert a temporal **duration** between any two canonical
[TemporalUnitType](../../types/type-aliases/TemporalUnitType.md) units.

- Uses [SECONDS_PER](../variables/SECONDS_PER.md) with **seconds** as the
  intermediate unit.
- Interprets `d` as the **SI day** and `yr/kyr/Myr/Gyr` via the **Julian year**
  convention.
- The `time.unit` is expected to be **canonical**; if you accept aliases
  upstream, normalize them before calling (e.g., with `normalizeTemporalUnit`).
- The `targetUnit` may be a canonical unit or an alias such as `'days'`; it is
  normalized to a canonical symbol.

$$
\text{value}_{\text{target}}
\;=\;
\frac{\text{value}_{\text{in}} \cdot \mathrm{SECONDS\_PER}[u_{\text{in}}]}
     {\mathrm{SECONDS\_PER}[u_{\text{out}}]}
$$

## Parameters

| Parameter    | Type                                                               | Description                                          |
| ------------ | ------------------------------------------------------------------ | ---------------------------------------------------- |
| `time`       | [`TemporalInterface`](../../types/interfaces/TemporalInterface.md) | Input duration `{ value, unit }` in canonical units. |
| `targetUnit` |                                                                    | `"second"`                                           | `"seconds"` | `"millisecond"` | `"milliseconds"` | `"microsecond"` | `"microseconds"` | `"us"` | `"minute"` | `"minutes"` | `"hour"` | `"hours"` | `"day"` | `"days"` | `"year"` | `"years"` | `"yr"` | `"yrs"` | `"kiloyear"` | `"kiloyears"` | `"kyr"` | `"megayear"` | `"megayears"` | `"megaannum"` | `"megaannums"` | `"Myr"` | `"Ma"` | `"gigayear"` | `"gigayears"` | `"gigaannum"` | `"gigaannums"` | `"Gyr"` | `"Ga"` | `"s"` | `"ms"` | `"μs"` | `"ns"` | `"ps"` | `"fs"` | `"as"` | `"zs"` | `"ys"` | `"min"` | `"h"` | `"d"` | Desired output unit, canonical or an alias (will be normalized). |

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

If `targetUnit` is not a known unit or alias.

## See

- SECONDS_PER_DAY
- JULIAN_YEAR_SECONDS
- normalizeTemporalUnit
