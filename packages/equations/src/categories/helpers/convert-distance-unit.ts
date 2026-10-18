import {
  AU_METERS,
  METERS_PER_LY,
  METERS_PER_PC
} from '@interstellar-tools/constants';
import type {
  DistanceInterface,
  DistanceUnitAliasType,
  DistanceUnitType
} from '@interstellar-tools/types';

import { normalizeDistanceUnit } from './normalize-distance-unit.js';

/**
 * Meters-per-unit lookup for all canonical {@link DistanceUnitType} symbols.
 *
 * - **Base**: conversions are performed via **meters**.
 * - **Astronomical unit**: `au = 149 597 870 700 m`, exact (from {@link AU_METERS}).
 * - **Light-year**: `c × Julian year` (from {@link METERS_PER_LY}); `kly/Mly/Gly`
 *   are powers of 10 thereof.
 * - **Parsec**: `(648 000 / π) au` (from {@link METERS_PER_PC}); `kpc/Mpc/Gpc`
 *   are powers of 10 thereof.
 * - The table is frozen: it can be read, but not changed at runtime.
 *
 * @group Helpers
 * @example
 * ```ts
 * METERS_PER.km; // 1000
 * METERS_PER.au; // 149_597_870_700
 * ```
 */
export const METERS_PER: Readonly<Record<DistanceUnitType, number>> =
  Object.freeze({
    m: 1,
    km: 1e3,
    au: AU_METERS,
    ly: METERS_PER_LY,
    kly: METERS_PER_LY * 1e3,
    Mly: METERS_PER_LY * 1e6,
    Gly: METERS_PER_LY * 1e9,
    pc: METERS_PER_PC,
    kpc: METERS_PER_PC * 1e3,
    Mpc: METERS_PER_PC * 1e6,
    Gpc: METERS_PER_PC * 1e9
  });

/**
 * Convert a **distance** between any two {@link DistanceUnitType} units.
 *
 * - Uses {@link METERS_PER} with **meters** as the intermediate unit.
 * - The `distance.unit` is expected to be **canonical**, as in the datasets.
 * - The `targetUnit` may be a canonical unit or an alias such as `'AU'`; it is
 *   normalized to a canonical symbol.
 *
 * $$
 * \text{value}_{\text{target}}
 * \;=\;
 * \frac{\text{value}_{\text{in}} \cdot \mathrm{METERS\_PER}[u_{\text{in}}]}
 *      {\mathrm{METERS\_PER}[u_{\text{out}}]}
 * $$
 *
 * @param distance   Input distance `{ value, unit }` in a canonical unit.
 * @param targetUnit Desired output unit, canonical or an alias (will be normalized).
 * @returns          A new `{ value, unit }` where `unit` is the canonical target symbol.
 * @throws {RangeError} If `targetUnit` is not a known unit or alias.
 * @group Helpers
 *
 * @example
 * ```ts
 * convertDistanceUnit({ value: 1, unit: 'au' }, 'km');
 * // → { value: 149_597_870.7, unit: 'km' }
 *
 * convertDistanceUnit({ value: 1, unit: 'pc' }, 'ly');
 * // → { value: 3.2615637771674333, unit: 'ly' }
 *
 * // Put a dataset's semi-major axis in the unit a renderer draws in:
 * const jupiter = PLANETS.find((p) => p.id === 'jupiter');
 * convertDistanceUnit(jupiter.orbit.a, 'au').value;
 * ```
 *
 * @see normalizeDistanceUnit
 */
export const convertDistanceUnit = (
  distance: DistanceInterface,
  targetUnit: DistanceUnitType | DistanceUnitAliasType
): DistanceInterface => {
  const unit = normalizeDistanceUnit(targetUnit);
  const inMeters = distance.value * METERS_PER[distance.unit];

  return { value: inMeters / METERS_PER[unit], unit };
};
