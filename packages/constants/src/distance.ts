import { JULIAN_YEAR_SECONDS } from './temporal';

/**
 * Core **astronomical distance constants** and **conversion ratios**.
 *
 * ## Conventions
 * - **Meters** are the base distance unit.
 * - **Light-year** uses the **Julian year** (exactly 365.25 d) via {@link JULIAN_YEAR_SECONDS}.
 * - **Astronomical unit (au)** is exact per IAU 2012 B2.
 * - **Parsec** is defined by trigonometric parallax: `pc = au / tan(1″)`.
 *
 * @see https://www.bipm.org/en/publications/si-brochure (SI Brochure)
 * @see https://www.iau.org/static/resolutions/IAU2012_English.pdf (IAU 2012 B2 - astronomical unit)
 * @see https://en.wikipedia.org/wiki/Julian_year_(astronomy) (Julian year)
 * @see https://en.wikipedia.org/wiki/Parsec (Parsec definition)
 */

// Base physical/constants

/**
 * Speed of light in vacuum, **exact** per SI (m·s⁻¹).
 * @group Distance
 */
export const SPEED_OF_LIGHT_M_PER_S = 299_792_458 as const; // exact (SI)

/**
 *  Astronomical unit in meters, **exact** (IAU 2012 B2).
 * @group Distance
 */
export const AU_METERS = 149_597_870_700 as const;

/**
 * Meters in one **light-year**, defined as `c × (Julian year)`.
 *
 * ::: info
 *
 * Uses {@link SPEED_OF_LIGHT_M_PER_S} × {@link JULIAN_YEAR_SECONDS}.
 *
 * :::
 *
 * @group Distance
 */
export const METERS_PER_LY = SPEED_OF_LIGHT_M_PER_S * JULIAN_YEAR_SECONDS; // 9_460_730_472_580_800

/**
 * Radians in one arcsecond: `π / 648 000`.
 *
 * ::: tip
 *
 * Convenient for expressing the exact parsec definition.
 *
 * :::
 *
 * @group Distance
 */
export const RADIANS_PER_ARCSECOND = Math.PI / 648_000;

/**
 * Meters in one **parsec**, using the exact trigonometric definition: `pc = au / tan(1″)`.
 *
 * ::: info
 *
 * Computed as {@link AU_METERS} / tan({@link RADIANS_PER_ARCSECOND}).
 *
 * :::
 *
 * @group Distance
 */
export const METERS_PER_PC = AU_METERS / Math.tan(RADIANS_PER_ARCSECOND); // ≈ 3.08567758149e16

// Helpful ratios (derive from the above to avoid drift)

/**
 * Astronomical units per light-year.
 *
 * ::: info
 *
 * Computed as {@link METERS_PER_LY} / {@link AU_METERS}.
 *
 * :::
 *
 * @group Distance
 */
export const AU_PER_LY = METERS_PER_LY / AU_METERS; // ≈ 63_241.07708426628

/**
 * Light-years per astronomical unit (reciprocal of {@link AU_PER_LY}).
 * @group Distance
 */
export const LY_PER_AU = 1 / AU_PER_LY;

/**
 * Kilometers in one astronomical unit.
 * @group Distance
 */
export const KM_PER_AU = AU_METERS / 1_000;

/**
 * Light-years per parsec.
 *
 * ::: info
 *
 * Computed as {@link METERS_PER_PC} / {@link METERS_PER_LY}.
 *
 * :::
 *
 * @group Distance
 */
export const LY_PER_PC = METERS_PER_PC / METERS_PER_LY; // ≈ 3.26156…

/**
 * Parsecs per light-year (reciprocal of {@link LY_PER_PC}).
 * @group Distance
 */
export const PC_PER_LY = 1 / LY_PER_PC;
