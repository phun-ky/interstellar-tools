[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TemporalUnitType

# Type Alias: TemporalUnitType

```ts
type TemporalUnitType =
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
  | 'yr'
  | 'kyr'
  | 'Myr'
  | 'Gyr';
```

Defined in:
[temporal.ts:37](https://github.com/phun-ky/interstellar-tools/blob/8e4fe75a07b42cadc88954820349dccaa19bbbc8/packages/types/src/temporal.ts#L37)

Canonical **temporal unit symbols** for spacetime/physics **durations**.

## Design principles

- **Canonical symbols only** (no plurals): stable for math and serialization.
- **Durations, not timestamps/"ago"** semantics.
- **Days** are the
  [SI](https://en.wikipedia.org/wiki/International_System_of_Units) day: exactly
  **86 400 s**.
- **Years** are the **Julian year** (astronomy) by convention: **365.25 d = 31
  557 600 s**. This keeps `yr/kyr/Myr/Gyr` numerically crisp for large-scale
  calculations.
- Microseconds use the Unicode micro sign **`μs`**. If your environment is
  ASCII-only, normalize external inputs (e.g. `"us"` → `"μs"`) **before** using
  this type.

## Members

- Subsecond [SI](https://en.wikipedia.org/wiki/International_System_of_Units):
  `ms`, `μs`, `ns`, `ps`, `fs`, `as`, `zs`, `ys`
- Base [SI](https://en.wikipedia.org/wiki/International_System_of_Units): `s`
- Convenient larger units: `min`, `h`, `d`
- Astronomical year family (durations): `yr`, `kyr`, `Myr`, `Gyr`

::: info

If you need to accept user-friendly aliases (e.g. `"seconds"`, `"us"`,
`"hours"`), map them to these canonical symbols in a normalization step outside
this type.

:::

## See

- https://www.bipm.org/en/publications/si-brochure
  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure -
  second & day)
- https://en.wikipedia.org/wiki/Julian\_year\_(astronomy) (Julian year used for
  `yr`)
