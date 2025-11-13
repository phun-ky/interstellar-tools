/**
 * Time-scale tags used in this package.
 *
 * ::: info
 *
 * Astronomy formulas are defined in specific time scales (most commonly **TT**).
 * JavaScript `Date` represents **UTC** only. Keep these symbols explicit to avoid ambiguity.
 *
 * :::
 *
 * @category Date
 */
export const TIME_SCALE_UTC = 'UTC' as const;

/**
 * @category Date
 */
export const TIME_SCALE_TT = 'TT' as const;

/**
 * **J2000 epoch as a UTC timestamp** for JavaScript usage.
 *
 * J2000 is *defined* as **JD 2451545.0 (TT)**, i.e. 2000-01-01 12:00:00 **TT**.
 * At that epoch **TT − UTC = 64.184 s**, so the corresponding UTC instant is:
 * **2000-01-01T11:58:55.816Z**.
 *
 * @example
 * // Milliseconds from UTC midnight to J2000 (UTC):
 * const deltaMs = +J2000_UTC - +EPOCH_2000_UTC_MIDNIGHT; // 43_135_816 ms
 *
 * // If you need the TT-based Julian centuries since J2000:
 * //   T = (JD_TT - J2000_TT) / 36525
 * // Compute JD_TT from a UTC Date using your UTC→TT→JD pipeline, then use J2000_TT.
 * @category Date
 */
export const J2000_UTC = new Date('2000-01-01T11:58:55.816Z');

/**
 * Time scale associated with {@link J2000_UTC}.
 * @category Date
 */
export const J2000_UTC_TIME_SCALE = TIME_SCALE_UTC;

/**
 * **UTC midnight at the start of 2000-01-01** (convenient calendar anchor).
 *
 * ::: warning
 *
 * This is **not** the J2000 epoch itself (which occurs 11:58:55.816 later in UTC).
 *
 * :::
 *
 * @category Date
 */
export const EPOCH_2000_UTC_MIDNIGHT = new Date('2000-01-01T00:00:00Z');

/**
 * Time scale associated with {@link EPOCH_2000_UTC_MIDNIGHT}.
 * @category Date
 */
export const EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE = TIME_SCALE_UTC;

/**
 * **J2000 epoch as a Julian Date in the TT time scale.**
 *
 * Defined as **JD 2451545.0 (TT)**, corresponding to 2000-01-01 12:00:00 **TT**.
 *
 * @example
 * // Julian centuries since J2000 in TT:
 * // const T = (jdTT - J2000_TT) / 36525;
 * @category Date
 */
export const J2000_TT = 2451545.0 as const;

/**
 * The **defining** time scale for the J2000 epoch.
 * J2000 is conventionally specified in **Terrestrial Time** (TT).
 *
 * @example
 * // When computing Julian centuries:
 * //   T = (JD_TT - J2000_TT) / 36525
 * @category Date
 */
export const J2000_EPOCH_TIME_SCALE = TIME_SCALE_TT;

/**
 * Useful offset at the J2000 epoch (for UTC↔TT conversions near that instant).
 *
 * - TT − UTC = **64.184 s** at 2000-01-01
 * - Provided in both seconds and milliseconds for convenience.
 *
 * ::: info
 *
 * UTC–TT offset changes when leap seconds are introduced; this constant is
 * specific to the J2000 epoch.
 *
 * :::
 * @category Date
 */
export const TT_MINUS_UTC_AT_J2000_SECONDS = 64.184;

/**
 * @category Date
 */
export const TT_MINUS_UTC_AT_J2000_MS = 64_184;
