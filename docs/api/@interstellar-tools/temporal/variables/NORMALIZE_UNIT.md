[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
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

Defined in:
[normalize-temporal-unit.ts:37](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L37)

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

::: tip

If you require runtime immutability, wrap with `Object.freeze(NORMALIZE_UNIT)`.

:::

## Type Declaration

| Name                                              | Type    | Default value | Defined in                                                                                                                                                                        |
| ------------------------------------------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-as"></a> `as`                     | `"as"`  | `'as'`        | [normalize-temporal-unit.ts:45](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L45) |
| <a id="property-d"></a> `d`                       | `"d"`   | `'d'`         | [normalize-temporal-unit.ts:50](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L50) |
| <a id="property-day"></a> `day`                   | `"d"`   | `'d'`         | [normalize-temporal-unit.ts:68](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L68) |
| <a id="property-days"></a> `days`                 | `"d"`   | `'d'`         | [normalize-temporal-unit.ts:69](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L69) |
| <a id="property-fs"></a> `fs`                     | `"fs"`  | `'fs'`        | [normalize-temporal-unit.ts:44](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L44) |
| <a id="property-ga"></a> `Ga`                     | `"Gyr"` | `'Gyr'`       | [normalize-temporal-unit.ts:85](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L85) |
| <a id="property-gigaannum"></a> `gigaannum`       | `"Gyr"` | `'Gyr'`       | [normalize-temporal-unit.ts:83](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L83) |
| <a id="property-gigaannums"></a> `gigaannums`     | `"Gyr"` | `'Gyr'`       | [normalize-temporal-unit.ts:84](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L84) |
| <a id="property-gigayear"></a> `gigayear`         | `"Gyr"` | `'Gyr'`       | [normalize-temporal-unit.ts:81](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L81) |
| <a id="property-gigayears"></a> `gigayears`       | `"Gyr"` | `'Gyr'`       | [normalize-temporal-unit.ts:82](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L82) |
| <a id="property-gyr"></a> `Gyr`                   | `"Gyr"` | `'Gyr'`       | [normalize-temporal-unit.ts:54](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L54) |
| <a id="property-h"></a> `h`                       | `"h"`   | `'h'`         | [normalize-temporal-unit.ts:49](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L49) |
| <a id="property-hour"></a> `hour`                 | `"h"`   | `'h'`         | [normalize-temporal-unit.ts:66](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L66) |
| <a id="property-hours"></a> `hours`               | `"h"`   | `'h'`         | [normalize-temporal-unit.ts:67](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L67) |
| <a id="property-kiloyear"></a> `kiloyear`         | `"kyr"` | `'kyr'`       | [normalize-temporal-unit.ts:74](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L74) |
| <a id="property-kiloyears"></a> `kiloyears`       | `"kyr"` | `'kyr'`       | [normalize-temporal-unit.ts:75](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L75) |
| <a id="property-kyr"></a> `kyr`                   | `"kyr"` | `'kyr'`       | [normalize-temporal-unit.ts:52](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L52) |
| <a id="property-ma"></a> `Ma`                     | `"Myr"` | `'Myr'`       | [normalize-temporal-unit.ts:80](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L80) |
| <a id="property-megaannum"></a> `megaannum`       | `"Myr"` | `'Myr'`       | [normalize-temporal-unit.ts:78](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L78) |
| <a id="property-megaannums"></a> `megaannums`     | `"Myr"` | `'Myr'`       | [normalize-temporal-unit.ts:79](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L79) |
| <a id="property-megayear"></a> `megayear`         | `"Myr"` | `'Myr'`       | [normalize-temporal-unit.ts:76](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L76) |
| <a id="property-megayears"></a> `megayears`       | `"Myr"` | `'Myr'`       | [normalize-temporal-unit.ts:77](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L77) |
| <a id="property-microsecond"></a> `microsecond`   | `"μs"`  | `'μs'`        | [normalize-temporal-unit.ts:61](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L61) |
| <a id="property-microseconds"></a> `microseconds` | `"μs"`  | `'μs'`        | [normalize-temporal-unit.ts:62](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L62) |
| <a id="property-millisecond"></a> `millisecond`   | `"ms"`  | `'ms'`        | [normalize-temporal-unit.ts:59](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L59) |
| <a id="property-milliseconds"></a> `milliseconds` | `"ms"`  | `'ms'`        | [normalize-temporal-unit.ts:60](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L60) |
| <a id="property-min"></a> `min`                   | `"min"` | `'min'`       | [normalize-temporal-unit.ts:48](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L48) |
| <a id="property-minute"></a> `minute`             | `"min"` | `'min'`       | [normalize-temporal-unit.ts:64](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L64) |
| <a id="property-minutes"></a> `minutes`           | `"min"` | `'min'`       | [normalize-temporal-unit.ts:65](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L65) |
| <a id="property-ms"></a> `ms`                     | `"ms"`  | `'ms'`        | [normalize-temporal-unit.ts:40](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L40) |
| <a id="property-myr"></a> `Myr`                   | `"Myr"` | `'Myr'`       | [normalize-temporal-unit.ts:53](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L53) |
| <a id="property-ns"></a> `ns`                     | `"ns"`  | `'ns'`        | [normalize-temporal-unit.ts:42](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L42) |
| <a id="property-ps"></a> `ps`                     | `"ps"`  | `'ps'`        | [normalize-temporal-unit.ts:43](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L43) |
| <a id="property-s"></a> `s`                       | `"s"`   | `'s'`         | [normalize-temporal-unit.ts:39](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L39) |
| <a id="property-second"></a> `second`             | `"s"`   | `'s'`         | [normalize-temporal-unit.ts:57](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L57) |
| <a id="property-seconds"></a> `seconds`           | `"s"`   | `'s'`         | [normalize-temporal-unit.ts:58](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L58) |
| <a id="property-us"></a> `us`                     | `"μs"`  | `'μs'`        | [normalize-temporal-unit.ts:63](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L63) |
| <a id="property-year"></a> `year`                 | `"yr"`  | `'yr'`        | [normalize-temporal-unit.ts:70](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L70) |
| <a id="property-years"></a> `years`               | `"yr"`  | `'yr'`        | [normalize-temporal-unit.ts:71](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L71) |
| <a id="property-yr"></a> `yr`                     | `"yr"`  | `'yr'`        | [normalize-temporal-unit.ts:51](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L51) |
| <a id="property-yrs"></a> `yrs`                   | `"yr"`  | `'yr'`        | [normalize-temporal-unit.ts:72](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L72) |
| <a id="property-ys"></a> `ys`                     | `"ys"`  | `'ys'`        | [normalize-temporal-unit.ts:47](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L47) |
| <a id="property-zs"></a> `zs`                     | `"zs"`  | `'zs'`        | [normalize-temporal-unit.ts:46](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L46) |
| <a id="property-μs"></a> `μs`                     | `"μs"`  | `'μs'`        | [normalize-temporal-unit.ts:41](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/temporal/src/normalize-temporal-unit.ts#L41) |

## See

- https://www.bipm.org/en/publications/si-brochure
  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure -
  second & day)
- https://en.wikipedia.org/wiki/Julian\_year\_(astronomy) (Julian year for
  yr/kyr/Myr/Gyr)
