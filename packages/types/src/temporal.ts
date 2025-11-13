import { ValueInterface } from './numeric';

/**
 * @showCategories
 * @module
 */

/**
 * Canonical **temporal unit symbols** for spacetime/physics **durations**.
 *
 * ## Design principles
 * - **Canonical symbols only** (no plurals): stable for math and serialization.
 * - **Durations, not timestamps/"ago"** semantics.
 * - **Days** are the [SI](https://en.wikipedia.org/wiki/International_System_of_Units) day: exactly **86 400 s**.
 * - **Years** are the **Julian year** (astronomy) by convention: **365.25 d = 31 557 600 s**.
 *   This keeps `yr/kyr/Myr/Gyr` numerically crisp for large-scale calculations.
 * - Microseconds use the Unicode micro sign **`μs`**. If your environment is ASCII-only,
 *   normalize external inputs (e.g. `"us"` → `"μs"`) **before** using this type.
 *
 * ## Members
 * - Subsecond [SI](https://en.wikipedia.org/wiki/International_System_of_Units): `ms`, `μs`, `ns`, `ps`, `fs`, `as`, `zs`, `ys`
 * - Base [SI](https://en.wikipedia.org/wiki/International_System_of_Units): `s`
 * - Convenient larger units: `min`, `h`, `d`
 * - Astronomical year family (durations): `yr`, `kyr`, `Myr`, `Gyr`
 *
 * ::: info
 *
 * If you need to accept user-friendly aliases (e.g. `"seconds"`, `"us"`, `"hours"`),
 * map them to these canonical symbols in a normalization step outside this type.
 *
 * :::
 *
 * @see https://www.bipm.org/en/publications/si-brochure  ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure — second & day)
 * @see https://en.wikipedia.org/wiki/Julian_year_(astronomy) (Julian year used for `yr`)
 * @category Temporal
 */
export type TemporalUnitType =
  // SI base & submultiples
  | 's'
  | 'ms'
  | 'μs'
  | 'ns'
  | 'ps'
  | 'fs'
  | 'as'
  | 'zs'
  | 'ys'
  // convenient larger units
  | 'min'
  | 'h'
  | 'd'
  // years
  | 'yr'
  | 'kyr'
  | 'Myr'
  | 'Gyr';

/**
 * Human-friendly **temporal unit aliases** accepted at input time.
 *
 * These strings could be parsed and **normalized** to your canonical `TemporalUnitType`
 * (e.g., `"seconds"` → `"s"`, `"us"` → `"μs"`, `"megayears"` → `"Myr"`).
 *
 * ## Scope & conventions
 * - **Durations only** (not timestamps or "ago" semantics).
 * - **Day** is the [SI](https://en.wikipedia.org/wiki/International_System_of_Units) day: exactly **86 400 s**.
 * - **Year-family** (`yr`, `kyr`, `Myr`, `Gyr`) is based on the **Julian year**
 *   (365.25 d = 31 557 600 s) for stable large-scale calculations.
 * - **ASCII micro**: `"us"` is accepted and normalized to `"μs"`.
 * - **Geology-style** tokens (`Ma`, `Ga`, `megaannum`, `gigaannum`) are accepted
 *   but normalized to `Myr`/`Gyr` **as durations** (not "million years ago").
 * - **Case-sensitive**: tokens are matched exactly as listed.
 *
 * ## Recommended flow
 * 1) Accept `TemporalUnitAliasType` from users/IO.
 * 2) Normalize to `TemporalUnitType`.
 * 3) Use only canonical units for arithmetic, storage, and serialization.
 *
 * @see https://www.bipm.org/en/publications/si-brochure ([SI](https://en.wikipedia.org/wiki/International_System_of_Units) Brochure — second & day)
 * @see https://en.wikipedia.org/wiki/Julian_year_(astronomy) (Julian year used for `yr`/`kyr`/`Myr`/`Gyr`)
 * @see https://en.wikipedia.org/wiki/Year#SI_multiples (Usage of `ka`/`Ma`/`Ga` vs `kyr`/`Myr`/`Gyr`)
 * @category Temporal
 */
export type TemporalUnitAliasType =
  | 'second'
  | 'seconds'
  | 'millisecond'
  | 'milliseconds'
  | 'microsecond'
  | 'microseconds'
  | 'us' // ASCII micro
  | 'minute'
  | 'minutes'
  | 'hour'
  | 'hours'
  | 'day'
  | 'days'
  | 'year'
  | 'years'
  | 'yr'
  | 'yrs'
  | 'kiloyear'
  | 'kiloyears'
  | 'kyr'
  | 'megayear'
  | 'megayears'
  | 'megaannum'
  | 'megaannums'
  | 'Myr'
  | 'Ma'
  | 'gigayear'
  | 'gigayears'
  | 'gigaannum'
  | 'gigaannums'
  | 'Gyr'
  | 'Ga';

/**
 * Typed container for a scalar **duration**, combining a numeric `value`
 * (from {@link ValueInterface}) with a canonical {@link TemporalUnitType} `unit`.
 *
 * ## Conventions
 * - **Durations only** (not timestamps or "ago" semantics).
 * - `unit` must be a **canonical symbol** (e.g., `'s'`, `'min'`, `'h'`, `'d'`, `'yr'`, `'Myr'`).
 *   If you accept user-friendly aliases (e.g., `"seconds"`, `"hours"`), normalize them **before** constructing this type.
 * - Day is the **SI day** (86 400 s) and year-family uses the **Julian year** (365.25 d).
 *
 * $$
 * \text{seconds} \;=\; \text{value} \times \mathrm{SECONDS\_PER}[\text{unit}]
 * $$
 *
 *
 * @see {@link TemporalUnitType}
 * @category Temporal
 */
export interface TemporalInterface extends ValueInterface {
  /** Canonical temporal unit symbol (case-sensitive). */
  unit: TemporalUnitType;
}

/**
 * Represents a **time step measurement** in simulation, restricted to days.
 *
 * @extends ValueInterface
 * @property {'day'} unit - The unit is always **days**.
 *
 * @example
 * ```ts
 * const timeStep: TimeStepInterface = { value: 1, unit: 'day' };
 * ```
 * @category Temporal
 */
export interface TimeStepInterface extends ValueInterface {
  unit: 'd';
}
