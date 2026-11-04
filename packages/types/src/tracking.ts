import type { Radians } from './numeric.js';

/**
 * A satellite's **mean elements**, as published in a two-line element set
 * (TLE) or an Orbit Mean-elements Message (OMM): the orbit SGP4 was fitted to
 * at an epoch, with the drag terms it needs.
 *
 * Returned by `parseTle` and `parseOmm` in `@interstellar-tools/tracking`.
 *
 * ::: info
 *
 * - **These aren't osculating elements.** They're averaged the way SGP4
 *   averages them, and only give correct positions through SGP4: Kepler's
 *   equations on them are off by kilometres.
 * - The angles are in radians and the mean motion in rad/s, like the rest of
 *   the library. TLEs and OMMs carry degrees and revolutions per day.
 * - TLEs and OMMs carry half the first derivative of the mean motion and a
 *   sixth of the second; `meanMotionDot` and `meanMotionDdot` are the
 *   derivatives themselves. SGP4 doesn't use them.
 *
 * :::
 *
 * @example
 * ```ts
 * // The ISS on 2026-11-04
 * const iss: MeanElementsInterface = {
 *   name: 'ISS (ZARYA)',
 *   objectId: '1998-067A',
 *   catalogNumber: 25544,
 *   classification: 'U',
 *   epoch: new Date('2026-11-04T08:52:07.404Z'),
 *   epochJulianDate: 2461348.86953014,
 *   meanMotion: 0.0011266,
 *   meanMotionDot: 8.8e-14,
 *   meanMotionDdot: 0,
 *   e: 0.0007186,
 *   i: 0.9012 as Radians,
 *   raan: 5.6967 as Radians,
 *   argp: 6.0519 as Radians,
 *   meanAnomaly: 0.2327 as Radians,
 *   bstar: 0.00010236,
 *   elementSetNumber: 999,
 *   revolutionNumber: 59348
 * };
 * ```
 * @group Tracking
 */
export interface MeanElementsInterface {
  /** The satellite's name, such as `ISS (ZARYA)`. Omitted when not given. */
  name?: string;
  /** The international designator (COSPAR ID), such as `1998-067A`: launch year, launch number and piece. Omitted when blank. */
  objectId?: string;
  /** The NORAD catalogue number. */
  catalogNumber: number;
  /** The security classification: `U` unclassified, `C` classified or `S` secret. Public element sets are `U`. */
  classification: 'U' | 'C' | 'S';
  /** The epoch the elements hold at, in UTC, to the millisecond. */
  epoch: Date;
  /** The epoch as a Julian date in UTC (d), to about 40 µs: finer than `epoch`. */
  epochJulianDate: number;
  /** Mean motion $n$ in rad/s. */
  meanMotion: number;
  /** First time derivative of the mean motion $\dot{n}$ in rad/s². */
  meanMotionDot: number;
  /** Second time derivative of the mean motion $\ddot{n}$ in rad/s³. */
  meanMotionDdot: number;
  /** Eccentricity, in [0, 1). */
  e: number;
  /** Inclination in radians, in [0, π]. */
  i: Radians;
  /** Right ascension of the ascending node (Ω) in radians, in [0, 2π]. */
  raan: Radians;
  /** Argument of perigee (ω) in radians, in [0, 2π]. */
  argp: Radians;
  /** Mean anomaly (M) in radians, in [0, 2π]. */
  meanAnomaly: Radians;
  /** SGP4's drag term $B^*$, in inverse Earth radii (1/R⊕). */
  bstar: number;
  /** The element set number, counted up by the publisher for each new set. */
  elementSetNumber: number;
  /** The number of revolutions at the epoch. TLEs only hold five digits: it wraps at 100 000. */
  revolutionNumber: number;
}
