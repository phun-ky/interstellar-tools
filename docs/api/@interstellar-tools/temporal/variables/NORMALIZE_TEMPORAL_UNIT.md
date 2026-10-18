[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ NORMALIZE_TEMPORAL_UNIT

# Variable: NORMALIZE_TEMPORAL_UNIT

```ts
const NORMALIZE_TEMPORAL_UNIT: Readonly<{
  as: 'as';
  d: 'd';
  day: 'd';
  days: 'd';
  fs: 'fs';
  Ga: 'Gyr';
  gigaannum: 'Gyr';
  gigaannums: 'Gyr';
  gigayear: 'Gyr';
  gigayears: 'Gyr';
  Gyr: 'Gyr';
  h: 'h';
  hour: 'h';
  hours: 'h';
  kiloyear: 'kyr';
  kiloyears: 'kyr';
  kyr: 'kyr';
  Ma: 'Myr';
  megaannum: 'Myr';
  megaannums: 'Myr';
  megayear: 'Myr';
  megayears: 'Myr';
  microsecond: 'μs';
  microseconds: 'μs';
  millisecond: 'ms';
  milliseconds: 'ms';
  min: 'min';
  minute: 'min';
  minutes: 'min';
  ms: 'ms';
  Myr: 'Myr';
  ns: 'ns';
  ps: 'ps';
  s: 's';
  second: 's';
  seconds: 's';
  us: 'μs';
  year: 'yr';
  years: 'yr';
  yr: 'yr';
  yrs: 'yr';
  ys: 'ys';
  zs: 'zs';
  μs: 'μs';
}>;
```

Defined in:
[normalize-temporal-unit.ts:33](https://github.com/phun-ky/interstellar-tools/blob/c937a42cf99d9a589645c5e215479f165095d9c2/packages/temporal/src/normalize-temporal-unit.ts#L33)

Lookup table that **normalizes user-facing time unit aliases** (and the
canonical symbols themselves) to a single, canonical
[TemporalUnitType](../../types/type-aliases/TemporalUnitType.md).

## Purpose

- Centralizes all **string → symbol** normalization (e.g., `"seconds"` → `"s"`,
  `"us"` → `"μs"`).
- Ensures downstream math uses only **canonical units** (`s`, `ms`, `μs`, `min`,
  `h`, `d`, `yr`, `kyr`, `Myr`, `Gyr`).

## Conventions & semantics

- **Durations only** (no timestamp/"ago" meaning). Geology-style tokens (`Ma`,
  `Ga`, `megaannum`, `gigaannum`) are treated as **durations** and normalized to
  `Myr`/`Gyr`.
- **Day** is [SI](https://en.wikipedia.org/wiki/International_System_of_Units)
  day: exactly **86 400 s**.
- **Year family** (`yr`, `kyr`, `Myr`, `Gyr`) is the **Julian year** convention:
  **365.25 d = 31 557 600 s**.
- **Case-sensitive** and exact matching. The ASCII alias `"us"` is accepted and
  normalized to the Unicode `μs`.

## Usage pattern

- Accept `TemporalUnitAliasType | TemporalUnitType` at your boundaries.
- Normalize with this map.
- Store/compute exclusively with canonical
  [TemporalUnitType](../../types/type-aliases/TemporalUnitType.md).

The table is frozen: it can be read, but not changed at runtime.

## See

- https://www.bipm.org/en/publications/si-brochure
  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure -
  second & day)
- https://en.wikipedia.org/wiki/Julian_year\_(astronomy) (Julian year for
  yr/kyr/Myr/Gyr)
