/**
 * Core **time constants** used across the temporal utilities.
 *
 * ## Conventions
 * - **Base units**: seconds and milliseconds.
 * - **SI day**: exactly `86 400 s`.
 * - **Julian year** (astronomy): exactly `365.25 d = 31 557 600 s`.
 *
 * @see https://www.bipm.org/en/publications/si-brochure (SI Brochure — second & day)
 * @see https://en.wikipedia.org/wiki/Julian_year_(astronomy) (Julian year definition)
 *
 * @example
 * ```ts
 * const hoursPerDay = SECONDS_PER_DAY / 3600; // 24
 * const msInTwoDays = 2 * MILLISECONDS_PER_DAY; // 172_800_000
 * const secondsInHalfJulianYear = JULIAN_YEAR_SECONDS / 2; // 15_778_800
 * ```
 */

/**
 *  Length of the **SI day** in seconds (exact).
 * @category Temporal
 */
export const SECONDS_PER_DAY = 86_400 as const;

/**
 *  Milliseconds in one second (exact).
 * @category Temporal
 */
export const MILLISECONDS_PER_SECOND = 1_000 as const;

/**
 * Milliseconds in one **SI day**.
 *
 * ::: info
 *
 * Computed from {@link SECONDS_PER_DAY} × {@link MILLISECONDS_PER_SECOND}.
 *
 * :::
 *
 * @category Temporal
 */
export const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * MILLISECONDS_PER_SECOND;

// Julian year (astronomy) — EXACT 365.25 d

/**
 *  Length of the **Julian year** in SI days (exactly 365.25).
 * @category Temporal
 */
export const JULIAN_YEAR_DAYS = 365.25 as const;

/**
 * Length of the **Julian year** in seconds.
 *
 * ::: info
 *
 * Computed as {@link SECONDS_PER_DAY} × {@link JULIAN_YEAR_DAYS} = **31 557 600 s**.
 *
 * :::
 *
 * @category Temporal
 */
export const JULIAN_YEAR_SECONDS = SECONDS_PER_DAY * JULIAN_YEAR_DAYS; // 31_557_600
