import type {
  TemporalUnitAliasType,
  TemporalUnitType
} from '@interstellar-tools/types';

/* node:coverage disable */
/**
 * Lookup table that **normalizes user-facing time unit aliases** (and the canonical
 * symbols themselves) to a single, canonical {@link TemporalUnitType}.
 *
 * ## Purpose
 * - Centralizes all **string → symbol** normalization (e.g., `"seconds"` → `"s"`, `"us"` → `"μs"`).
 * - Ensures downstream math uses only **canonical units** (`s`, `ms`, `μs`, `min`, `h`, `d`, `yr`, `kyr`, `Myr`, `Gyr`).
 *
 * ## Conventions & semantics
 * - **Durations only** (no timestamp/"ago" meaning). Geology-style tokens (`Ma`, `Ga`, `megaannum`, `gigaannum`)
 *   are treated as **durations** and normalized to `Myr`/`Gyr`.
 * - **Day** is [SI](https://en.wikipedia.org/wiki/International_System_of_Units) day: exactly **86 400 s**.
 * - **Year family** (`yr`, `kyr`, `Myr`, `Gyr`) is the **Julian year** convention: **365.25 d = 31 557 600 s**.
 * - **Case-sensitive** and exact matching. The ASCII alias `"us"` is accepted and normalized to the Unicode `μs`.
 *
 * ## Usage pattern
 * - Accept `TemporalUnitAliasType | TemporalUnitType` at your boundaries.
 * - Normalize with this map.
 * - Store/compute exclusively with canonical {@link TemporalUnitType}.
 *
 * ::: tip
 *
 * If you require runtime immutability, wrap with `Object.freeze(NORMALIZE_UNIT)`.
 *
 * :::
 *
 * @see https://www.bipm.org/en/publications/si-brochure  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure - second & day)
 * @see https://en.wikipedia.org/wiki/Julian_year_(astronomy) (Julian year for yr/kyr/Myr/Gyr)
 */
/* node:coverage enable */
export const NORMALIZE_UNIT = {
  // canonical already map to themselves:
  s: 's',
  ms: 'ms',
  μs: 'μs',
  ns: 'ns',
  ps: 'ps',
  fs: 'fs',
  as: 'as',
  zs: 'zs',
  ys: 'ys',
  min: 'min',
  h: 'h',
  d: 'd',
  yr: 'yr',
  kyr: 'kyr',
  Myr: 'Myr',
  Gyr: 'Gyr',

  // aliases → canonical
  second: 's',
  seconds: 's',
  millisecond: 'ms',
  milliseconds: 'ms',
  microsecond: 'μs',
  microseconds: 'μs',
  us: 'μs',
  minute: 'min',
  minutes: 'min',
  hour: 'h',
  hours: 'h',
  day: 'd',
  days: 'd',
  year: 'yr',
  years: 'yr',
  yrs: 'yr',

  kiloyear: 'kyr',
  kiloyears: 'kyr',
  megayear: 'Myr',
  megayears: 'Myr',
  megaannum: 'Myr',
  megaannums: 'Myr',
  Ma: 'Myr',
  gigayear: 'Gyr',
  gigayears: 'Gyr',
  gigaannum: 'Gyr',
  gigaannums: 'Gyr',
  Ga: 'Gyr'
} as const satisfies Record<
  TemporalUnitAliasType | TemporalUnitType,
  TemporalUnitType
>;

/* node:coverage disable */
/**
 * Normalize a user-provided **temporal unit string** into a canonical {@link TemporalUnitType}.
 *
 * - Trims surrounding whitespace.
 * - Accepts both **canonical symbols** (e.g., `"s"`, `"ms"`, `"μs"`, `"min"`, `"h"`, `"d"`, `"yr"`, `"kyr"`, `"Myr"`, `"Gyr"`)
 *   and **aliases** (e.g., `"seconds"`, `"milliseconds"`, `"us"`, `"hours"`, `"years"`, `"Ma"`, `"Ga"`),
 *   using {@link NORMALIZE_UNIT} as the single source of truth.
 * - Returns a **canonical** unit suitable for arithmetic, storage, and serialization.
 *
 * ### Conventions
 * - **Durations only** (no timestamp or "ago" semantics). Geology-style tokens like `"Ma"`/`"Ga"` are
 *   interpreted as durations and normalized to `"Myr"`/`"Gyr"`.
 * - **Case-sensitive** exact match against {@link NORMALIZE_UNIT}. For example, `"Seconds"` (capital S)
 *   will fail; use `"seconds"` instead, or pre-normalize casing upstream if desired.
 * - The ASCII alias `"us"` is accepted and normalized to the Unicode microsecond symbol `"μs"`.
 *
 * @param u - The input unit string. Leading/trailing whitespace is ignored; content is **case-sensitive**.
 * @returns The canonical {@link TemporalUnitType} (e.g., `"s"`, `"ms"`, `"μs"`, `"min"`, `"h"`, `"d"`, `"yr"`, `"kyr"`, `"Myr"`, `"Gyr"`).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError}  If `u` does not match any known key in {@link NORMALIZE_UNIT}.
 *
 * @example
 * ```ts
 * // Canonical conversion using the normalized unit:
 * const unit = normalizeTemporalUnit(' seconds '); // → 's'
 * const valueInSeconds = 2 * (unit === 's' ? 1 : NaN); // 2
 *
 * normalizeTemporalUnit('us');   // → 'μs'
 * normalizeTemporalUnit('Myr');  // → 'Myr' (already canonical)
 * normalizeTemporalUnit('Ma');   // → 'Myr' (geology-style alias)
 * normalizeTemporalUnit('Ga');   // → 'Gyr'
 * // normalizeTemporalUnit('Seconds'); // throws (case-sensitive)
 * ```
 *
 * @see {@link NORMALIZE_UNIT} for the complete alias→canonical mapping.
 * @see https://www.bipm.org/en/publications/si-brochure (SI Brochure - second/day)
 * @see https://en.wikipedia.org/wiki/Julian_year_(astronomy) (Julian year for yr/kyr/Myr/Gyr)
 */
/* node:coverage enable */
export const normalizeTemporalUnit = (u: string): TemporalUnitType => {
  const k = u.trim();
  const v = NORMALIZE_UNIT[k as keyof typeof NORMALIZE_UNIT];

  if (!v) throw new Error(`Unsupported unit: ${u}`);

  return v;
};
