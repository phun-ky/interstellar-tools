import {
  JULIAN_YEAR_SECONDS,
  SECONDS_PER_DAY
} from '@interstellar-tools/constants';
import { TemporalInterface, TemporalUnitType } from '@interstellar-tools/types';

import { normalizeTemporalUnit } from './normalize-temporal-unit';

/**
 * Seconds-per-unit lookup for all canonical {@link TemporalUnitType} symbols.
 *
 * ### Conventions
 * - **Base**: conversions are performed via **seconds**.
 * - **SI day**: `d = 86 400 s` (from {@link SECONDS_PER_DAY}).
 * - **Julian year**: `yr = 365.25 d = 31 557 600 s`
 *   (from {@link JULIAN_YEAR_SECONDS}); `kyr/Myr/Gyr` are powers of 10 thereof.
 * - Units are **canonical** and **case-sensitive** (e.g., `'μs'` uses the Unicode micro sign).
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
 * @hidden
 */
export const SECONDS_PER: Record<TemporalUnitType, number> = {
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
};

/**
 * Convert a temporal **duration** between any two canonical {@link TemporalUnitType} units.
 *
 * - Uses {@link SECONDS_PER} with **seconds** as the intermediate unit.
 * - Interprets `d` as the **SI day** and `yr/kyr/Myr/Gyr` via the **Julian year** convention.
 * - The `time.unit` is expected to be **canonical**; if you accept aliases upstream,
 *   normalize them before calling (e.g., with `normalizeTemporalUnit`).
 * - The `targetUnit` is normalized to a canonical symbol (idempotent for canonical input).
 *
 * $$
 * \text{value}_{\text{target}}
 * \;=\;
 * \frac{\text{value}_{\text{in}} \cdot \mathrm{SECONDS\_PER}[u_{\text{in}}]}
 *      {\mathrm{SECONDS\_PER}[u_{\text{out}}]}
 * $$
 *
 * @param time       Input duration `{ value, unit }` in canonical units.
 * @param targetUnit Desired canonical output unit (will be normalized).
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
 * @see SECONDS_PER_DAY
 * @see JULIAN_YEAR_SECONDS
 * @see normalizeTemporalUnit
 */
export const convertTemporalUnit = (
  time: TemporalInterface,
  targetUnit: TemporalUnitType
): TemporalInterface => {
  const normalizedTargetUnit = normalizeTemporalUnit(targetUnit);
  const { value, unit } = time;
  // Convert input to seconds
  const inSeconds = value * SECONDS_PER[unit];
  // Convert seconds to target
  const convertedValue = inSeconds / SECONDS_PER[normalizedTargetUnit];

  return { value: convertedValue, unit: normalizedTargetUnit };
};
