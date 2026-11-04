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

/**
 * Where a satellite is in an observer's sky: the direction to point an
 * antenna or a camera, how far away it is and how fast that distance changes.
 *
 * Returned by `lookAngles` in `@interstellar-tools/tracking`.
 *
 * ::: info
 *
 * - `azimuth` runs clockwise from north: 0 north, π/2 east, π south, 3π/2 west.
 * - `elevation` is above the plane tangent to the WGS 84 ellipsoid at the
 *   observer: 0 on that horizon, π/2 straight overhead, negative below it.
 * - `rangeRate` is negative while the satellite approaches, as during the
 *   first half of a pass, and positive as it leaves.
 *
 * :::
 *
 * @example
 * ```ts
 * // The ISS low in the south-west, approaching
 * const angles: LookAnglesInterface = {
 *   azimuth: 3.93 as Radians,
 *   elevation: 0.17 as Radians,
 *   range: 1_420_000,
 *   rangeRate: -5_900
 * };
 * ```
 * @group Tracking
 */
export interface LookAnglesInterface {
  /** Azimuth in radians, clockwise from north, in [0, 2π). */
  azimuth: Radians;
  /** Elevation above the observer's horizon in radians, in [-π/2, π/2]. */
  elevation: Radians;
  /** Distance from the observer in m. */
  range: number;
  /** Rate of change of the distance in m/s: negative approaching, positive leaving. */
  rangeRate: number;
}

/**
 * One **pass** of a satellite over an observer: when it rises above the
 * horizon, when it's highest, and when it sets.
 *
 * Returned by `predictPasses` in `@interstellar-tools/tracking`.
 *
 * ::: info
 *
 * - Rise and set are where the elevation crosses the minimum asked for, 0 by
 *   default: the horizon.
 * - Azimuths run clockwise from north, as in `LookAnglesInterface`.
 *
 * :::
 *
 * @example
 * ```ts
 * // A pass of the ISS, low in the south
 * const pass: SatellitePassInterface = {
 *   rise: new Date('2026-11-04T16:41:12Z'),
 *   riseAzimuth: 4.36 as Radians,
 *   culmination: new Date('2026-11-04T16:45:30Z'),
 *   culminationAzimuth: 3.31 as Radians,
 *   maxElevation: 0.29 as Radians,
 *   set: new Date('2026-11-04T16:49:51Z'),
 *   setAzimuth: 2.21 as Radians
 * };
 * ```
 * @group Tracking
 */
export interface SatellitePassInterface {
  /** When the satellite rises above the minimum elevation. */
  rise: Date;
  /** Azimuth at rise in radians, clockwise from north. */
  riseAzimuth: Radians;
  /** When the satellite is highest. */
  culmination: Date;
  /** Azimuth at culmination in radians, clockwise from north. */
  culminationAzimuth: Radians;
  /** The highest elevation in radians, at culmination. */
  maxElevation: Radians;
  /** When the satellite sets below the minimum elevation. */
  set: Date;
  /** Azimuth at set in radians, clockwise from north. */
  setAzimuth: Radians;
}

/**
 * Where a satellite is relative to **Earth's shadow**.
 *
 * - `'sunlit'`: the whole Sun is visible from the satellite.
 * - `'penumbra'`: Earth covers part of the Sun.
 * - `'umbra'`: Earth covers the whole Sun.
 *
 * Returned by `earthShadow` in `@interstellar-tools/tracking`.
 *
 * @example
 * ```ts
 * const shadow: ShadowType = 'umbra'; // in eclipse: no sunlight on the panels
 * ```
 * @group Tracking
 */
export type ShadowType = 'sunlit' | 'penumbra' | 'umbra';
