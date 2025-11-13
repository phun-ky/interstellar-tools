[Documentation](../../index.md) / [@interstellar-tools/temporal](../temporal.md)
/ NORMALIZE_UNIT

# Variable: NORMALIZE_UNIT

```ts
const NORMALIZE_UNIT: {
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
};
```

Defined in: normalize-temporal-unit.ts:35

Lookup table that **normalizes user-facing time unit aliases** (and the
canonical symbols themselves) to a single, canonical
[TemporalUnitType](../types/TemporalUnitType.md).

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
  [TemporalUnitType](../types/TemporalUnitType.md).

::: tip

If you require runtime immutability, wrap with `Object.freeze(NORMALIZE_UNIT)`.

:::

## Type Declaration

| Name                                     | Type    | Default value | Defined in                    |
| ---------------------------------------- | ------- | ------------- | ----------------------------- |
| <a id="as"></a> `as`                     | `"as"`  | `'as'`        | normalize-temporal-unit.ts:43 |
| <a id="d"></a> `d`                       | `"d"`   | `'d'`         | normalize-temporal-unit.ts:48 |
| <a id="day"></a> `day`                   | `"d"`   | `'d'`         | normalize-temporal-unit.ts:66 |
| <a id="days"></a> `days`                 | `"d"`   | `'d'`         | normalize-temporal-unit.ts:67 |
| <a id="fs"></a> `fs`                     | `"fs"`  | `'fs'`        | normalize-temporal-unit.ts:42 |
| <a id="ga"></a> `Ga`                     | `"Gyr"` | `'Gyr'`       | normalize-temporal-unit.ts:83 |
| <a id="gigaannum"></a> `gigaannum`       | `"Gyr"` | `'Gyr'`       | normalize-temporal-unit.ts:81 |
| <a id="gigaannums"></a> `gigaannums`     | `"Gyr"` | `'Gyr'`       | normalize-temporal-unit.ts:82 |
| <a id="gigayear"></a> `gigayear`         | `"Gyr"` | `'Gyr'`       | normalize-temporal-unit.ts:79 |
| <a id="gigayears"></a> `gigayears`       | `"Gyr"` | `'Gyr'`       | normalize-temporal-unit.ts:80 |
| <a id="gyr"></a> `Gyr`                   | `"Gyr"` | `'Gyr'`       | normalize-temporal-unit.ts:52 |
| <a id="h"></a> `h`                       | `"h"`   | `'h'`         | normalize-temporal-unit.ts:47 |
| <a id="hour"></a> `hour`                 | `"h"`   | `'h'`         | normalize-temporal-unit.ts:64 |
| <a id="hours"></a> `hours`               | `"h"`   | `'h'`         | normalize-temporal-unit.ts:65 |
| <a id="kiloyear"></a> `kiloyear`         | `"kyr"` | `'kyr'`       | normalize-temporal-unit.ts:72 |
| <a id="kiloyears"></a> `kiloyears`       | `"kyr"` | `'kyr'`       | normalize-temporal-unit.ts:73 |
| <a id="kyr"></a> `kyr`                   | `"kyr"` | `'kyr'`       | normalize-temporal-unit.ts:50 |
| <a id="ma"></a> `Ma`                     | `"Myr"` | `'Myr'`       | normalize-temporal-unit.ts:78 |
| <a id="megaannum"></a> `megaannum`       | `"Myr"` | `'Myr'`       | normalize-temporal-unit.ts:76 |
| <a id="megaannums"></a> `megaannums`     | `"Myr"` | `'Myr'`       | normalize-temporal-unit.ts:77 |
| <a id="megayear"></a> `megayear`         | `"Myr"` | `'Myr'`       | normalize-temporal-unit.ts:74 |
| <a id="megayears"></a> `megayears`       | `"Myr"` | `'Myr'`       | normalize-temporal-unit.ts:75 |
| <a id="microsecond"></a> `microsecond`   | `"μs"`  | `'μs'`        | normalize-temporal-unit.ts:59 |
| <a id="microseconds"></a> `microseconds` | `"μs"`  | `'μs'`        | normalize-temporal-unit.ts:60 |
| <a id="millisecond"></a> `millisecond`   | `"ms"`  | `'ms'`        | normalize-temporal-unit.ts:57 |
| <a id="milliseconds"></a> `milliseconds` | `"ms"`  | `'ms'`        | normalize-temporal-unit.ts:58 |
| <a id="min"></a> `min`                   | `"min"` | `'min'`       | normalize-temporal-unit.ts:46 |
| <a id="minute"></a> `minute`             | `"min"` | `'min'`       | normalize-temporal-unit.ts:62 |
| <a id="minutes"></a> `minutes`           | `"min"` | `'min'`       | normalize-temporal-unit.ts:63 |
| <a id="ms"></a> `ms`                     | `"ms"`  | `'ms'`        | normalize-temporal-unit.ts:38 |
| <a id="myr"></a> `Myr`                   | `"Myr"` | `'Myr'`       | normalize-temporal-unit.ts:51 |
| <a id="ns"></a> `ns`                     | `"ns"`  | `'ns'`        | normalize-temporal-unit.ts:40 |
| <a id="ps"></a> `ps`                     | `"ps"`  | `'ps'`        | normalize-temporal-unit.ts:41 |
| <a id="s"></a> `s`                       | `"s"`   | `'s'`         | normalize-temporal-unit.ts:37 |
| <a id="second"></a> `second`             | `"s"`   | `'s'`         | normalize-temporal-unit.ts:55 |
| <a id="seconds"></a> `seconds`           | `"s"`   | `'s'`         | normalize-temporal-unit.ts:56 |
| <a id="us"></a> `us`                     | `"μs"`  | `'μs'`        | normalize-temporal-unit.ts:61 |
| <a id="year"></a> `year`                 | `"yr"`  | `'yr'`        | normalize-temporal-unit.ts:68 |
| <a id="years"></a> `years`               | `"yr"`  | `'yr'`        | normalize-temporal-unit.ts:69 |
| <a id="yr"></a> `yr`                     | `"yr"`  | `'yr'`        | normalize-temporal-unit.ts:49 |
| <a id="yrs"></a> `yrs`                   | `"yr"`  | `'yr'`        | normalize-temporal-unit.ts:70 |
| <a id="ys"></a> `ys`                     | `"ys"`  | `'ys'`        | normalize-temporal-unit.ts:45 |
| <a id="zs"></a> `zs`                     | `"zs"`  | `'zs'`        | normalize-temporal-unit.ts:44 |
| <a id="μs"></a> `μs`                     | `"μs"`  | `'μs'`        | normalize-temporal-unit.ts:39 |

## See

- https://www.bipm.org/en/publications/si-brochure
  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure —
  second & day)
- https://en.wikipedia.org/wiki/Julian\_year\_(astronomy) (Julian year for
  yr/kyr/Myr/Gyr)
