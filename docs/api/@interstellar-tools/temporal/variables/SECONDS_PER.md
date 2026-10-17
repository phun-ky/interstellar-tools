[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ SECONDS_PER

# Variable: SECONDS_PER

```ts
const SECONDS_PER: Record<TemporalUnitType, number>;
```

Defined in:
[convert-temporal-unit.ts:32](https://github.com/phun-ky/interstellar-tools/blob/863383fff6e28d7137a1400d3602561b477a518c/packages/temporal/src/convert-temporal-unit.ts#L32)

Seconds-per-unit lookup for all canonical
[TemporalUnitType](../../types/type-aliases/TemporalUnitType.md) symbols.

### Conventions

- **Base**: conversions are performed via **seconds**.
- **SI day**: `d = 86 400 s` (from
  [SECONDS_PER_DAY](../../constants/variables/SECONDS_PER_DAY.md)).
- **Julian year**: `yr = 365.25 d = 31 557 600 s` (from
  [JULIAN_YEAR_SECONDS](../../constants/variables/JULIAN_YEAR_SECONDS.md));
  `kyr/Myr/Gyr` are powers of 10 thereof.
- Units are **canonical** and **case-sensitive** (e.g., `'μs'` uses the Unicode
  micro sign).

$$
\text{seconds}(u) \;=\; \text{value}\times \mathrm{SECONDS\_PER}[u]
$$

## Example

```ts
// seconds per hour:
SECONDS_PER.h; // 3600

// seconds in a Julian year:
SECONDS_PER.yr; // 31_557_600
```
