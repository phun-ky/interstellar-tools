[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TemporalUnitAliasType

# Type Alias: TemporalUnitAliasType

```ts
type TemporalUnitAliasType =
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
  | 'Ga';
```

Defined in:
[temporal.ts:84](https://github.com/phun-ky/interstellar-tools/blob/f613425043c94828d8fadf35a707105a661f469f/packages/types/src/temporal.ts#L84)

Human-friendly **temporal unit aliases** accepted at input time.

These strings could be parsed and **normalized** to your canonical
`TemporalUnitType` (e.g., `"seconds"` → `"s"`, `"us"` → `"μs"`, `"megayears"` →
`"Myr"`).

## Scope & conventions

- **Durations only** (not timestamps or "ago" semantics).
- **Day** is the
  [SI](https://en.wikipedia.org/wiki/International_System_of_Units) day: exactly
  **86 400 s**.
- **Year-family** (`yr`, `kyr`, `Myr`, `Gyr`) is based on the **Julian year**
  (365.25 d = 31 557 600 s) for stable large-scale calculations.
- **ASCII micro**: `"us"` is accepted and normalized to `"μs"`.
- **Geology-style** tokens (`Ma`, `Ga`, `megaannum`, `gigaannum`) are accepted
  but normalized to `Myr`/`Gyr` **as durations** (not "million years ago").
- **Case-sensitive**: tokens are matched exactly as listed.

## Recommended flow

1. Accept `TemporalUnitAliasType` from users/IO.
2. Normalize to `TemporalUnitType`.
3. Use only canonical units for arithmetic, storage, and serialization.

## See

- https://www.bipm.org/en/publications/si-brochure
  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure —
  second & day)
- https://en.wikipedia.org/wiki/Julian\_year\_(astronomy) (Julian year used for
  `yr`/`kyr`/`Myr`/`Gyr`)
- https://en.wikipedia.org/wiki/Year#SI\_multiples (Usage of `ka`/`Ma`/`Ga` vs
  `kyr`/`Myr`/`Gyr`)
