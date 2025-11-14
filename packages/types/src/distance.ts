import { ValueInterface } from './numeric';

/**
 *
 * @module
 */

/**
 * Canonical **distance unit symbols** for astronomy/space visualization.
 *
 * ## Design principles
 * - **Canonical symbols only** (no plurals / long names) for stable math & serialization.
 * - Uses **meters** as the [SI](https://en.wikipedia.org/wiki/International_System_of_Units) base; larger units have conventional scientific definitions.
 *
 * ## Conventions
 * - **`au`** - Astronomical Unit (IAU 2012 B2): **149 597 870 700 m** (lowercase `au` is the IAU symbol).
 * - **`ly` family** - Light-year based on the **Julian year**:
 *   `1 ly = c × 365.25 d = 9 460 730 472 580 800 m` (with `kly = 10³ ly`, `Mly = 10⁶ ly`, `Gly = 10⁹ ly`).
 * - **`pc` family** - Parsec defined from the arcsecond parallax:
 *   `1 pc = au × (648000 / π) ≈ 3.085677581×10¹⁶ m` (`kpc/Mpc/Gpc` are ×10³/×10⁶/×10⁹).
 *
 * ## Members
 * - [SI](https://en.wikipedia.org/wiki/International_System_of_Units) base & common multiple: `m`, `km`
 * - Astronomical: `au`
 * - Light-year family: `ly`, `kly`, `Mly`, `Gly`
 * - Parsec family: `pc`, `kpc`, `Mpc`, `Gpc`
 *
 * @example
 * ```ts
 * // Example shape often used alongside this type:
 * type Distance = { value: number; unit: DistanceUnitType };
 *
 * const d1: Distance = { value: 1, unit: 'au' };
 * const d2: Distance = { value: 3.26, unit: 'ly' };
 * const d3: Distance = { value: 8, unit: 'kpc' };
 * ```
 *
 * @see https://www.iau.org/static/resolutions/IAU2012_English.pdf (IAU 2012 B2 - definition of the astronomical unit)
 * @see https://en.wikipedia.org/wiki/Light-year (Light-year based on Julian year)
 * @see https://en.wikipedia.org/wiki/Parsec (Parsec definition & meter equivalence)
 * @group Distance
 */
export type DistanceUnitType =
  | 'm'
  | 'km'
  | 'au'
  | 'ly'
  | 'kly'
  | 'Mly'
  | 'Gly'
  | 'pc'
  | 'kpc'
  | 'Mpc'
  | 'Gpc';

/**
 * Human-friendly **distance unit aliases** accepted at input time.
 *
 * These strings should be parsed and **normalized** to canonical {@link DistanceUnitType}
 * (e.g., `"AU"` → `"au"`, `"lightyears"` → `"ly"`, `"kiloparsecs"` → `"kpc"`).
 *
 * ## Scope & conventions
 * - **Canonical vs. aliases**: This type is for *inputs*. Convert to canonical symbols
 *   (`m`, `km`, `au`, `ly/kly/Mly/Gly`, `pc/kpc/Mpc/Gpc`) before math or serialization.
 * - **Case-sensitive** and **exact** matches: tokens are matched exactly as listed here.
 *   For example, `"AU"` is valid (alias) while `"au"` is the canonical symbol (not part of this alias type).
 * - **IAU symbol**: canonical astronomical unit is lowercase **`au`**; we accept `"AU"`, `"Au"`,
 *   and textual forms as aliases.
 * - **Light-year and parsec families**: long names (with/without hyphens) normalize to their
 *   canonical symbols (`ly/kly/Mly/Gly`, `pc/kpc/Mpc/Gpc`). By convention, `ly` uses the
 *   **Julian year** (consistent with your temporal units).
 *
 * ### Typical flow
 * 1) Accept `DistanceUnitAliasType | DistanceUnitType` at your API boundary.
 * 2) Normalize to `DistanceUnitType` (e.g., via `normalizeDistanceUnit`).
 * 3) Perform calculations using canonical units only.
 *
 * @example
 * ```ts
 * // Assuming `normalizeDistanceUnit` and `NORMALIZE_DISTANCE_UNIT` are defined:
 * normalizeDistanceUnit('AU');           // 'au'
 * normalizeDistanceUnit('lightyears');   // 'ly'
 * normalizeDistanceUnit('kilolightyears'); // 'kly'
 * normalizeDistanceUnit('parsecs');      // 'pc'
 * normalizeDistanceUnit('Mpc');          // 'Mpc' (already canonical)
 * ```
 *
 * @see DistanceUnitType for the canonical symbol set.
 * @see https://www.iau.org/static/resolutions/IAU2012_English.pdf (IAU 2012 B2 - astronomical unit, symbol "au")
 * @see https://en.wikipedia.org/wiki/Light-year (Light-year; Julian-year convention)
 * @see https://en.wikipedia.org/wiki/Parsec (Parsec definition)
 * @group Distance
 */
export type DistanceUnitAliasType =
  // meters
  | 'meter'
  | 'meters'
  | 'metre'
  | 'metres'
  // kilometers
  | 'kilometer'
  | 'kilometers'
  | 'kilometre'
  | 'kilometres'
  // astronomical unit
  | 'AU'
  | 'Au'
  | 'astronomical-unit'
  | 'astronomical-units'
  | 'astronomical unit'
  | 'astronomical units'
  // light-year family
  | 'lightyear'
  | 'lightyears'
  | 'light-year'
  | 'light-years'
  | 'kilolightyear'
  | 'kilolightyears'
  | 'kly'
  | 'megalightyear'
  | 'megalightyears'
  | 'Mly'
  | 'gigalightyear'
  | 'gigalightyears'
  | 'Gly'
  // parsec family
  | 'parsec'
  | 'parsecs'
  | 'kiloparsec'
  | 'kiloparsecs'
  | 'kpc'
  | 'megaparsec'
  | 'megaparsecs'
  | 'Mpc'
  | 'gigaparsec'
  | 'gigaparsecs'
  | 'Gpc';

/**
 * Represents a measurement with an associated unit.
 *
 * @extends ValueInterface
 * @property {DistanceUnitType} unit - The unit of measurement.
 *
 * @example
 * ```ts
 * const planetRadius: MeasureInterface = { value: 6371, unit: 'km' };
 * ```
 * @group Distance
 */
export interface MeasureInterface extends ValueInterface {
  unit: DistanceUnitType;
}

/**
 * Represents a distance measurement with an associated unit.
 *
 * @extends ValueInterface
 * @property {DistanceUnitType} unit - The unit of distance measurement.
 *
 * @example
 * ```ts
 * const distanceToAlphaCentauri: DistanceInterface = { value: 4.367, unit: 'lightyears' };
 * ```
 * @group Distance
 */
export interface DistanceInterface extends ValueInterface {
  unit: DistanceUnitType;
}
