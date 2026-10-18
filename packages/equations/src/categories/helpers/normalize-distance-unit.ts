import type {
  DistanceUnitAliasType,
  DistanceUnitType
} from '@interstellar-tools/types';

/**
 * Lookup table that **normalizes distance unit aliases** (and the canonical
 * symbols themselves) to a single, canonical {@link DistanceUnitType}.
 *
 * - Canonical symbols map to themselves (`'au'` → `'au'`).
 * - Aliases map to their symbol (`'AU'` → `'au'`, `'light-years'` → `'ly'`,
 *   `'kiloparsecs'` → `'kpc'`).
 * - **Case-sensitive** and exact: `'AU'` and `'Au'` are accepted, `'aU'` is not.
 * - The table is frozen: it can be read, but not changed at runtime.
 *
 * @group Helpers
 * @see normalizeDistanceUnit
 * @see https://www.iau.org/static/resolutions/IAU2012_English.pdf (IAU 2012 B2 - astronomical unit, symbol "au")
 */
export const NORMALIZE_DISTANCE_UNIT = Object.freeze({
  // canonical already map to themselves:
  m: 'm',
  km: 'km',
  au: 'au',
  ly: 'ly',
  kly: 'kly',
  Mly: 'Mly',
  Gly: 'Gly',
  pc: 'pc',
  kpc: 'kpc',
  Mpc: 'Mpc',
  Gpc: 'Gpc',

  // aliases → canonical
  meter: 'm',
  meters: 'm',
  metre: 'm',
  metres: 'm',
  kilometer: 'km',
  kilometers: 'km',
  kilometre: 'km',
  kilometres: 'km',
  AU: 'au',
  Au: 'au',
  'astronomical-unit': 'au',
  'astronomical-units': 'au',
  'astronomical unit': 'au',
  'astronomical units': 'au',
  lightyear: 'ly',
  lightyears: 'ly',
  'light-year': 'ly',
  'light-years': 'ly',
  kilolightyear: 'kly',
  kilolightyears: 'kly',
  megalightyear: 'Mly',
  megalightyears: 'Mly',
  gigalightyear: 'Gly',
  gigalightyears: 'Gly',
  parsec: 'pc',
  parsecs: 'pc',
  kiloparsec: 'kpc',
  kiloparsecs: 'kpc',
  megaparsec: 'Mpc',
  megaparsecs: 'Mpc',
  gigaparsec: 'Gpc',
  gigaparsecs: 'Gpc'
} as const satisfies Record<
  DistanceUnitAliasType | DistanceUnitType,
  DistanceUnitType
>);

/**
 * Normalize a **distance unit string** into a canonical {@link DistanceUnitType}.
 *
 * - Trims surrounding whitespace.
 * - Accepts canonical symbols (`'km'`, `'au'`, `'ly'`, `'kpc'`, ...) and aliases
 *   (`'AU'`, `'kilometres'`, `'light-years'`, `'parsecs'`, ...), using
 *   {@link NORMALIZE_DISTANCE_UNIT} as the single source of truth.
 * - **Case-sensitive**: `'Parsecs'` is rejected; use `'parsecs'` or `'pc'`.
 *
 * @param u - The input unit string. Leading/trailing whitespace is ignored.
 * @returns The canonical {@link DistanceUnitType}.
 * @throws {RangeError} If `u` is not a known unit or alias.
 * @group Helpers
 *
 * @example
 * ```ts
 * normalizeDistanceUnit('AU'); // 'au'
 * normalizeDistanceUnit(' light-years '); // 'ly'
 * normalizeDistanceUnit('kiloparsecs'); // 'kpc'
 * normalizeDistanceUnit('Mpc'); // 'Mpc' (already canonical)
 * ```
 */
export const normalizeDistanceUnit = (u: string): DistanceUnitType => {
  const k = u.trim();
  const v = Object.prototype.hasOwnProperty.call(NORMALIZE_DISTANCE_UNIT, k)
    ? NORMALIZE_DISTANCE_UNIT[k as keyof typeof NORMALIZE_DISTANCE_UNIT]
    : undefined;

  if (!v) throw new RangeError(`Unsupported unit: ${u}`);

  return v;
};
