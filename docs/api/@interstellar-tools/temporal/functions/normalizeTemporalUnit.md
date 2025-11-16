[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ normalizeTemporalUnit

# Function: normalizeTemporalUnit()

```ts
function normalizeTemporalUnit(u: string): TemporalUnitType;
```

Defined in:
[normalize-temporal-unit.ts:131](https://github.com/phun-ky/interstellar-tools/blob/c2a8425242ca61bd8c42f52b2d0a00fec4fef730/packages/temporal/src/normalize-temporal-unit.ts#L131)

Normalize a user-provided **temporal unit string** into a canonical
[TemporalUnitType](../../types/type-aliases/TemporalUnitType.md).

- Trims surrounding whitespace.
- Accepts both **canonical symbols** (e.g., `"s"`, `"ms"`, `"μs"`, `"min"`,
  `"h"`, `"d"`, `"yr"`, `"kyr"`, `"Myr"`, `"Gyr"`) and **aliases** (e.g.,
  `"seconds"`, `"milliseconds"`, `"us"`, `"hours"`, `"years"`, `"Ma"`, `"Ga"`),
  using [NORMALIZE_UNIT](../variables/NORMALIZE_UNIT.md) as the single source of
  truth.
- Returns a **canonical** unit suitable for arithmetic, storage, and
  serialization.

### Conventions

- **Durations only** (no timestamp or "ago" semantics). Geology-style tokens
  like `"Ma"`/`"Ga"` are interpreted as durations and normalized to
  `"Myr"`/`"Gyr"`.
- **Case-sensitive** exact match against
  [NORMALIZE_UNIT](../variables/NORMALIZE_UNIT.md). For example, `"Seconds"`
  (capital S) will fail; use `"seconds"` instead, or pre-normalize casing
  upstream if desired.
- The ASCII alias `"us"` is accepted and normalized to the Unicode microsecond
  symbol `"μs"`.

## Parameters

| Parameter | Type     | Description                                                                                   |
| --------- | -------- | --------------------------------------------------------------------------------------------- |
| `u`       | `string` | The input unit string. Leading/trailing whitespace is ignored; content is **case-sensitive**. |

## Returns

[`TemporalUnitType`](../../types/type-aliases/TemporalUnitType.md)

The canonical [TemporalUnitType](../../types/type-aliases/TemporalUnitType.md)
(e.g., `"s"`, `"ms"`, `"μs"`, `"min"`, `"h"`, `"d"`, `"yr"`, `"kyr"`, `"Myr"`,
`"Gyr"`).

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If `u` does not match any known key in
[NORMALIZE_UNIT](../variables/NORMALIZE_UNIT.md).

## Example

```ts
// Canonical conversion using the normalized unit:
const unit = normalizeTemporalUnit(' seconds '); // → 's'
const valueInSeconds = 2 * (unit === 's' ? 1 : NaN); // 2

normalizeTemporalUnit('us'); // → 'μs'
normalizeTemporalUnit('Myr'); // → 'Myr' (already canonical)
normalizeTemporalUnit('Ma'); // → 'Myr' (geology-style alias)
normalizeTemporalUnit('Ga'); // → 'Gyr'
// normalizeTemporalUnit('Seconds'); // throws (case-sensitive)
```

## See

- [NORMALIZE_UNIT](../variables/NORMALIZE_UNIT.md) for the complete
  alias→canonical mapping.
- https://www.bipm.org/en/publications/si-brochure (SI Brochure - second/day)
- https://en.wikipedia.org/wiki/Julian\_year\_(astronomy) (Julian year for
  yr/kyr/Myr/Gyr)
