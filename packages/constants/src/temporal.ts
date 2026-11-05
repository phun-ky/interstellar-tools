/**
 * Core **time constants** used across the temporal utilities.
 *
 * ## Conventions
 * - **Base units**: seconds and milliseconds.
 * - **SI day**: exactly `86 400 s`.
 * - **Julian year** (astronomy): exactly `365.25 d = 31 557 600 s`.
 *
 * @see https://www.bipm.org/en/publications/si-brochure (SI Brochure - second & day)
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
 * @group Temporal
 */
export const SECONDS_PER_DAY = 86_400 as const;

/**
 *  Milliseconds in one second (exact).
 * @group Temporal
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
 * @group Temporal
 */
export const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * MILLISECONDS_PER_SECOND;

// Julian year (astronomy) - EXACT 365.25 d

/**
 *  Length of the **Julian year** in SI days (exactly 365.25).
 * @group Temporal
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
 * @group Temporal
 */
export const JULIAN_YEAR_SECONDS = SECONDS_PER_DAY * JULIAN_YEAR_DAYS; // 31_557_600

// Days on Earth and Mars

/**
 * Earth's **sidereal day** in seconds: one turn against the vernal equinox,
 * 23 h 56 m 4.0905 s. Sidereal time runs at this rate.
 *
 * ::: info
 *
 * - The equinox drifts west as Earth's axis precesses, so this is 8.4 ms
 *   shorter than one turn against the stars, 23 h 56 m 4.0989 s, the
 *   `rotation` of Earth in {@link PLANETS}.
 * - Taken with the tropical year, 365.24219 days, it gives the 86 400 s
 *   solar day: see `solarDayLength` in `@interstellar-tools/equations`.
 *
 * :::
 *
 * @see {@link "@interstellar-tools/equations"!greenwichMeanSiderealTime | greenwichMeanSiderealTime}
 * @group Temporal
 */
export const EARTH_SIDEREAL_DAY_SECONDS = 86_164.0905 as const;

/**
 * The **Martian sol** in seconds: the mean solar day on Mars, sunrise to
 * sunrise, 24 h 39 m 35.244 s.
 *
 * ::: info
 *
 * - Rovers count their days on Mars in sols, from landing.
 * - It is {@link MARS_SOL_DAYS} Earth days.
 *
 * :::
 *
 * @see Allison & McEwen (2000), _Planetary and Space Science_ 48, 215, table 4
 * @see https://www.giss.nasa.gov/tools/mars24/help/notes.html Mars24 technical notes
 * @group Temporal
 */
export const MARS_SOL_SECONDS = 88_775.244 as const;

/**
 * The **Martian sol** in Earth days: the ratio of a sol to a day,
 * 1.0274912517.
 *
 * ::: info
 *
 * - The Mars Sol Date counts sols by dividing a Julian date's days by it.
 * - Allison & McEwen (2000) give 1.02749125. This is the more precise value
 *   NASA GISS's Mars24 has used since 2015.
 *
 * :::
 *
 * @see https://www.giss.nasa.gov/tools/mars24/help/algorithm.html Mars24 algorithm, step C-2
 * @group Temporal
 */
export const MARS_SOL_DAYS = 1.027_491_251_7 as const;

/**
 * Mars's **sidereal day** in seconds: one turn against the stars,
 * 24 h 37 m 22.663 s, the `rotation` of Mars in {@link PLANETS}.
 *
 * @see Allison & McEwen (2000), _Planetary and Space Science_ 48, 215, table 4
 * @group Temporal
 */
export const MARS_SIDEREAL_DAY_SECONDS = 88_642.663 as const;
