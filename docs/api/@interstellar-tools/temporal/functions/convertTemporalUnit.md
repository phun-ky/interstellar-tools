[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ convertTemporalUnit

# Function: convertTemporalUnit()

```ts
function convertTemporalUnit(
  time: TemporalInterface,
  targetUnit: TemporalUnitType
): TemporalInterface;
```

Defined in:
[convert-temporal-unit.ts:96](https://github.com/phun-ky/interstellar-tools/blob/7f69ef1cdcae94524fd5860b2f8dc549143e8207/packages/temporal/src/convert-temporal-unit.ts#L96)

Convert a temporal **duration** between any two canonical
[TemporalUnitType](../../types/type-aliases/TemporalUnitType.md) units.

- Uses SECONDS_PER with **seconds** as the intermediate unit.
- Interprets `d` as the **SI day** and `yr/kyr/Myr/Gyr` via the **Julian year**
  convention.
- The `time.unit` is expected to be **canonical**; if you accept aliases
  upstream, normalize them before calling (e.g., with `normalizeTemporalUnit`).
- The `targetUnit` is normalized to a canonical symbol (idempotent for canonical
  input).

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
| `targetUnit` | [`TemporalUnitType`](../../types/type-aliases/TemporalUnitType.md) | Desired canonical output unit (will be normalized).  |

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

## See

- SECONDS_PER_DAY
- JULIAN_YEAR_SECONDS
- normalizeTemporalUnit
