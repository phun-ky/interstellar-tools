import type { LeapSecondInterface } from '@interstellar-tools/types';

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
 * @group Date
 */
export const TIME_SCALE_UTC = 'UTC' as const;

/**
 * @group Date
 */
export const TIME_SCALE_TT = 'TT' as const;

/**
 * @group Date
 */
export const TIME_SCALE_TAI = 'TAI' as const;

/**
 * @group Date
 */
export const TIME_SCALE_UT1 = 'UT1' as const;

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
 * @group Date
 */
export const J2000_UTC = new Date('2000-01-01T11:58:55.816Z');

/**
 * Time scale associated with {@link J2000_UTC}.
 * @group Date
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
 * @group Date
 */
export const EPOCH_2000_UTC_MIDNIGHT = new Date('2000-01-01T00:00:00Z');

/**
 * Time scale associated with {@link EPOCH_2000_UTC_MIDNIGHT}.
 * @group Date
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
 * @group Date
 */
export const J2000_TT = 2451545.0 as const;

/**
 * The **defining** time scale for the J2000 epoch.
 * J2000 is conventionally specified in **Terrestrial Time** (TT).
 *
 * @example
 * // When computing Julian centuries:
 * //   T = (JD_TT - J2000_TT) / 36525
 * @group Date
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
 * @group Date
 */
export const TT_MINUS_UTC_AT_J2000_SECONDS = 64.184;

/**
 * @group Date
 */
export const TT_MINUS_UTC_AT_J2000_MS = 64_184;

/**
 * **TT − TAI**: Terrestrial Time runs a fixed **32.184 s** ahead of
 * International Atomic Time, by definition.
 *
 * @group Date
 */
export const TT_MINUS_TAI_SECONDS = 32.184;

/**
 * The **Julian date of the Unix epoch**, 1970-01-01T00:00:00Z: **2440587.5**.
 * A Julian date counts days from noon on 1 January 4713 BC, so whole days start
 * at noon.
 *
 * @example
 * ```ts
 * // Julian date (UTC) of a JavaScript Date
 * const jd = date.getTime() / MILLISECONDS_PER_DAY + JULIAN_DATE_UNIX_EPOCH;
 * ```
 * @group Date
 */
export const JULIAN_DATE_UNIX_EPOCH = 2440587.5 as const;

/**
 * The offset of the **modified Julian date**: MJD = JD − **2400000.5**, so MJD 0
 * is 1858-11-17T00:00:00, and days start at midnight.
 *
 * @group Date
 */
export const MODIFIED_JULIAN_DATE_OFFSET = 2400000.5 as const;

/**
 * The **leap second table**: TAI − UTC, in **s**, from each date on, since UTC
 * took whole-second steps on 1972-01-01.
 *
 * Each step after the first is a leap second, inserted as 23:59:60 UTC on the
 * day before `date`. Before 1972, TAI − UTC wasn't a whole number of seconds,
 * and this table doesn't cover it.
 *
 * ::: warning Keeping it current
 *
 * The International Earth Rotation and Reference Systems Service (IERS)
 * announces each leap second about six months ahead, in its Bulletin C. When
 * it announces one, add a row here and release `constants`. The last one so far
 * was at the end of 2016.
 *
 * :::
 *
 * @example
 * ```ts
 * LEAP_SECONDS[LEAP_SECONDS.length - 1]; // { date: '2017-01-01', taiMinusUtc: 37 }
 * ```
 * @see {@link https://hpiers.obspm.fr/iers/bul/bulc/Leap_Second.dat | IERS: leap seconds since 1972}
 * @group Date
 */
export const LEAP_SECONDS: readonly Readonly<LeapSecondInterface>[] =
  Object.freeze(
    (
      [
        ['1972-01-01', 10],
        ['1972-07-01', 11],
        ['1973-01-01', 12],
        ['1974-01-01', 13],
        ['1975-01-01', 14],
        ['1976-01-01', 15],
        ['1977-01-01', 16],
        ['1978-01-01', 17],
        ['1979-01-01', 18],
        ['1980-01-01', 19],
        ['1981-07-01', 20],
        ['1982-07-01', 21],
        ['1983-07-01', 22],
        ['1985-07-01', 23],
        ['1988-01-01', 24],
        ['1990-01-01', 25],
        ['1991-01-01', 26],
        ['1992-07-01', 27],
        ['1993-07-01', 28],
        ['1994-07-01', 29],
        ['1996-01-01', 30],
        ['1997-07-01', 31],
        ['1999-01-01', 32],
        ['2006-01-01', 33],
        ['2009-01-01', 34],
        ['2012-07-01', 35],
        ['2015-07-01', 36],
        ['2017-01-01', 37]
      ] as const
    ).map(([date, taiMinusUtc]) => Object.freeze({ date, taiMinusUtc }))
  );
