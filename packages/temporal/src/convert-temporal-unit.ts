import {
  JULIAN_YEAR_SECONDS,
  SECONDS_PER_DAY
} from '@interstellar-tools/constants';
import type {
  TemporalInterface,
  TemporalUnitAliasType,
  TemporalUnitType
} from '@interstellar-tools/types';

import { normalizeTemporalUnit } from './normalize-temporal-unit.js';

/**
 * Seconds-per-unit lookup for all canonical {@link TemporalUnitType} symbols.
 *
 * ### Conventions
 * - **Base**: conversions are performed via **seconds**.
 * - **SI day**: `d = 86 400 s` (from {@link SECONDS_PER_DAY}).
 * - **Julian year**: `yr = 365.25 d = 31 557 600 s`
 *   (from {@link JULIAN_YEAR_SECONDS}); `kyr/Myr/Gyr` are powers of 10 thereof.
 * - Units are **canonical** and **case-sensitive** (e.g., `'μs'` uses the Unicode micro sign).
 * - The table is frozen: it can be read, but not changed at runtime.
 *
 * $$
 * \text{seconds}(u) \;=\; \text{value}\times \mathrm{SECONDS\_PER}[u]
 * $$
 *
 * @example
 * ```ts
 * // seconds per hour:
 * SECONDS_PER.h; // 3600
 *
 * // seconds in a Julian year:
 * SECONDS_PER.yr; // 31_557_600
 * ```
 */
export const SECONDS_PER: Readonly<Record<TemporalUnitType, number>> =
  Object.freeze({
    // SI base & submultiples
    s: 1,
    ms: 1e-3,
    μs: 1e-6,
    ns: 1e-9,
    ps: 1e-12,
    fs: 1e-15,
    as: 1e-18,
    zs: 1e-21,
    ys: 1e-24,

    // convenient larger units
    min: 60,
    h: 60 * 60,
    d: SECONDS_PER_DAY,

    // year family (Julian-year-based)
    yr: JULIAN_YEAR_SECONDS,
    kyr: JULIAN_YEAR_SECONDS * 1e3,
    Myr: JULIAN_YEAR_SECONDS * 1e6,
    Gyr: JULIAN_YEAR_SECONDS * 1e9
  });

// Each unit as a whole number of seconds times a power of ten. 1e-3 and 1e-6
// aren't exact in binary, but 10 ** 3 is, so whole values can convert exactly
const SCALED: Readonly<Record<TemporalUnitType, readonly [number, number]>> = {
  s: [1, 0],
  ms: [1, -3],
  μs: [1, -6],
  ns: [1, -9],
  ps: [1, -12],
  fs: [1, -15],
  as: [1, -18],
  zs: [1, -21],
  ys: [1, -24],
  min: [60, 0],
  h: [60 * 60, 0],
  d: [SECONDS_PER_DAY, 0],
  yr: [JULIAN_YEAR_SECONDS, 0],
  kyr: [JULIAN_YEAR_SECONDS, 3],
  Myr: [JULIAN_YEAR_SECONDS, 6],
  Gyr: [JULIAN_YEAR_SECONDS, 9]
};

/**
 * Convert a temporal **duration** between any two {@link TemporalUnitType} units or their aliases.
 *
 * - Converts by the ratio of the units' lengths in {@link SECONDS_PER}, with
 *   the powers of ten kept apart, so whole numbers convert exactly: 1 ms is
 *   1000 μs, not 1000.0000000000001.
 * - Interprets `d` as the **SI day** and `yr/kyr/Myr/Gyr` via the **Julian year** convention.
 * - Both `time.unit` and `targetUnit` may be canonical units or aliases such as
 *   `'days'`; they are normalized with `normalizeTemporalUnit`.
 *
 * $$
 * \text{value}_{\text{target}}
 * \;=\;
 * \frac{\text{value}_{\text{in}} \cdot \mathrm{SECONDS\_PER}[u_{\text{in}}]}
 *      {\mathrm{SECONDS\_PER}[u_{\text{out}}]}
 * $$
 *
 * @param time       Input duration `{ value, unit }`, in a canonical unit or an alias.
 * @param targetUnit Desired output unit, canonical or an alias (will be normalized).
 * @returns          A new `{ value, unit }` where `unit` is the canonical target symbol.
 *
 * @example
 * ```ts
 * convertTemporalUnit({ value: 2, unit: 'h' }, 'min');
 * // → { value: 120, unit: 'min' }
 *
 * convertTemporalUnit({ value: 1, unit: 'd' }, 's');
 * // → { value: 86_400, unit: 's' }
 *
 * convertTemporalUnit({ value: 3, unit: 'Myr' }, 'kyr');
 * // → { value: 3000, unit: 'kyr' }
 *
 * convertTemporalUnit({ value: 1, unit: 'yr' }, 'd');
 * // → { value: 365.25, unit: 'd' }
 * ```
 *
 * @throws {TypeError} If `time.unit` or `targetUnit` is not a string.
 * @throws {RangeError} If `time.unit` or `targetUnit` is not a known unit or alias.
 * @see SECONDS_PER_DAY
 * @see JULIAN_YEAR_SECONDS
 * @see normalizeTemporalUnit
 */
export const convertTemporalUnit = (
  time: TemporalInterface,
  targetUnit: TemporalUnitType | TemporalUnitAliasType
): TemporalInterface => {
  const normalizedTargetUnit = normalizeTemporalUnit(targetUnit);
  const [secondsIn, powerIn] = SCALED[normalizeTemporalUnit(time.unit)];
  const [secondsOut, powerOut] = SCALED[normalizedTargetUnit];
  const power = powerIn - powerOut;
  // Whole numbers on both sides, so a single division does the rounding
  const numerator = secondsIn * 10 ** Math.max(power, 0);
  const denominator = secondsOut * 10 ** Math.max(-power, 0);

  return {
    value: (time.value * numerator) / denominator,
    unit: normalizedTargetUnit
  };
};
