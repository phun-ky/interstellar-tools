import type { Vector3DTupleType } from './math.js';
import type { Radians } from './numeric.js';
import type { TimeScaleType } from './temporal.js';

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

/**
 * One **Orbit Mean-elements Message** (OMM) record in JSON, as CelesTrak
 * publishes it: a satellite's mean elements, with the keywords of the CCSDS
 * standard.
 *
 * Read by `parseOmm`, and carried by the `SATELLITES` dataset, in
 * `@interstellar-tools/tracking`.
 *
 * ::: info
 *
 * - The angles are in degrees and the mean motion in revolutions per day, as
 *   in a TLE. `parseOmm` turns them into radians and rad/s.
 * - `MEAN_MOTION_DOT` and `MEAN_MOTION_DDOT` are half the first and a sixth of
 *   the second derivative of the mean motion, also as in a TLE.
 * - Space-Track sends the numbers as strings; `parseOmm` reads both.
 *
 * :::
 *
 * @example
 * ```ts
 * const omm: OmmRecordInterface = {
 *   OBJECT_NAME: 'ISS (ZARYA)',
 *   OBJECT_ID: '1998-067A',
 *   EPOCH: '2026-11-04T21:15:15.204960',
 *   MEAN_MOTION: 15.49180468,
 *   ECCENTRICITY: 0.00072122,
 *   INCLINATION: 51.6327,
 *   RA_OF_ASC_NODE: 323.8448,
 *   ARG_OF_PERICENTER: 348.649,
 *   MEAN_ANOMALY: 11.4335,
 *   EPHEMERIS_TYPE: 0,
 *   CLASSIFICATION_TYPE: 'U',
 *   NORAD_CAT_ID: 25544,
 *   ELEMENT_SET_NO: 999,
 *   REV_AT_EPOCH: 59356,
 *   BSTAR: 0.00010456704,
 *   MEAN_MOTION_DOT: 0.00005352,
 *   MEAN_MOTION_DDOT: 0
 * };
 * ```
 * @see https://public.ccsds.org/Pubs/502x0b3e1.pdf CCSDS 502.0-B-3, Orbit Data Messages
 * @group Tracking
 */
export interface OmmRecordInterface {
  /** The object's name, as the catalogue gives it. */
  OBJECT_NAME?: string;
  /** International designator: launch year, launch number and piece, like `1998-067A`. */
  OBJECT_ID?: string;
  /** Epoch of the elements, in UTC: `YYYY-MM-DDTHH:MM:SS.ffffff`. */
  EPOCH: string;
  /** Mean motion in revolutions per day. */
  MEAN_MOTION: number;
  /** Eccentricity. */
  ECCENTRICITY: number;
  /** Inclination in degrees. */
  INCLINATION: number;
  /** Right ascension of the ascending node in degrees. */
  RA_OF_ASC_NODE: number;
  /** Argument of perigee in degrees. */
  ARG_OF_PERICENTER: number;
  /** Mean anomaly in degrees. */
  MEAN_ANOMALY: number;
  /** Ephemeris type: 0 for SGP4 and SDP4. */
  EPHEMERIS_TYPE?: number;
  /** Classification: `U` unclassified, `C` classified or `S` secret. */
  CLASSIFICATION_TYPE?: 'U' | 'C' | 'S';
  /** NORAD catalogue number. */
  NORAD_CAT_ID: number;
  /** Element set number. */
  ELEMENT_SET_NO?: number;
  /** Revolution number at the epoch. */
  REV_AT_EPOCH?: number;
  /** Drag term B* in inverse Earth radii. */
  BSTAR: number;
  /** Half the first derivative of the mean motion, in revolutions per day². */
  MEAN_MOTION_DOT: number;
  /** A sixth of the second derivative of the mean motion, in revolutions per day³. */
  MEAN_MOTION_DDOT: number;
}

/**
 * The **orbit regime** a satellite flies in.
 *
 * - `'LEO'`: low Earth orbit, below about 2 000 km, an orbit in under about
 *   2 hours: the ISS, Starlink, Earth observation.
 * - `'MEO'`: medium Earth orbit, between LEO and geostationary: navigation
 *   satellites such as GPS and Galileo.
 * - `'GEO'`: geostationary orbit, 35 786 km above the equator, turning with
 *   Earth: weather and communications satellites.
 * - `'HEO'`: highly elliptical orbit, such as Molniya, lingering high over
 *   one hemisphere.
 *
 * @example
 * ```ts
 * const regime: OrbitRegimeType = 'MEO'; // a GPS satellite
 * ```
 * @group Tracking
 */
export type OrbitRegimeType = 'LEO' | 'MEO' | 'GEO' | 'HEO';

/**
 * A satellite in the `SATELLITES` dataset of `@interstellar-tools/tracking`: a
 * stable id, a common name, its orbit regime and a dated OMM record.
 *
 * ::: info
 *
 * - **The elements go stale within days.** They're a snapshot, for examples
 *   and tests; for tracking, fetch fresh elements from CelesTrak.
 *
 * :::
 *
 * @example
 * ```ts
 * const hubble: SatelliteRecordInterface = {
 *   id: 'hubble',
 *   name: 'Hubble Space Telescope',
 *   regime: 'LEO',
 *   omm: { OBJECT_NAME: 'HST', NORAD_CAT_ID: 20580, ... }
 * };
 * ```
 * @group Tracking
 */
export interface SatelliteRecordInterface {
  /** Stable id, in kebab case: `'iss'`, `'hubble'`. */
  id: string;
  /** Common name: `'International Space Station'`. */
  name: string;
  /** The orbit regime. */
  regime: OrbitRegimeType;
  /** The elements, as an OMM record. */
  omm: OmmRecordInterface;
}

/**
 * One **sample of an ephemeris**: a spacecraft's position and velocity at a
 * moment.
 *
 * @example
 * ```ts
 * // Voyager 1 from the Sun, 169 au away, at 2026-01-01 00:00 TDB (JPL Horizons)
 * const sample: EphemerisSampleInterface = {
 *   epoch: new Date('2025-12-31T23:58:50.816Z'),
 *   r: [-4.7627e12, -2.4284e13, 5.3604e12],
 *   v: [-2072.8, -16400.0, 3609.0]
 * };
 * ```
 * @group Tracking
 */
export interface EphemerisSampleInterface {
  /** The moment, as a UTC `Date`. */
  epoch: Date;
  /** Position in m, from the ephemeris's centre, on its frame's axes. */
  r: Vector3DTupleType;
  /** Velocity in m/s. */
  v: Vector3DTupleType;
}

/**
 * An **ephemeris**: a table of a spacecraft's position and velocity over time,
 * as JPL Horizons and the CCSDS Orbit Ephemeris Message (OEM) publish them.
 * It's how deep-space probes, which have no TLEs, are tracked.
 *
 * Returned by `parseOem` and `parseHorizonsVectors`, and interpolated by
 * `stateAt`, in `@interstellar-tools/tracking`.
 *
 * ::: info
 *
 * - The epochs are UTC `Date`s, converted from the file's time scale, which
 *   `timeScale` keeps.
 * - Positions and velocities are in m and m/s, whatever the file's units.
 * - `center` and `frame` are as the file names them, such as `'SUN'` and
 *   `'ICRF'`: positions from different centres or frames don't mix.
 *
 * :::
 *
 * @example
 * ```ts
 * const ephemeris: EphemerisInterface = {
 *   objectName: 'Voyager 1',
 *   objectId: '1977-084A',
 *   center: 'SUN',
 *   frame: 'ICRF',
 *   timeScale: 'TDB',
 *   samples: [sample, nextSample]
 * };
 * ```
 * @group Tracking
 */
export interface EphemerisInterface {
  /** The spacecraft's name, if the file gives one. */
  objectName?: string;
  /** The spacecraft's id, such as its international designator, if the file gives one. */
  objectId?: string;
  /** The body the positions are measured from, as the file names it: `'EARTH'`, `'SUN'`. */
  center: string;
  /** The reference frame, as the file names it: `'ICRF'`, `'EME2000'`. */
  frame: string;
  /** The time scale of the file's epochs. */
  timeScale: TimeScaleType;
  /** The samples, in time order. */
  samples: readonly EphemerisSampleInterface[];
}

/**
 * Whether a space probe is still at work: `'active'` while its mission
 * operates it, `'ended'` once contact is lost or the mission is over. An ended
 * probe keeps flying: Pioneer 10 still coasts out of the Solar System.
 *
 * @example
 * ```ts
 * const status: ProbeStatusType = 'ended'; // Pioneer 10, last heard from in 2003
 * ```
 * @group Tracking
 */
export type ProbeStatusType = 'active' | 'ended';

/**
 * A probe in the `PROBES` dataset of `@interstellar-tools/tracking`: a
 * deep-space spacecraft, with what it is, where it's headed and a dated
 * ephemeris.
 *
 * ::: info
 *
 * - `near` and `destination` are ids from the body datasets of
 *   `@interstellar-tools/constants`, such as `'sun'` or `'europa'`, or a
 *   Lagrange point as the two bodies and the point, such as `'sun-earth-l2'`.
 * - `status` is as of the ephemeris's start.
 * - The ephemeris covers a limited span: outside it, fetch one from JPL
 *   Horizons with `horizonsId`.
 *
 * :::
 *
 * @example
 * ```ts
 * const jwst: ProbeRecordInterface = {
 *   id: 'jwst',
 *   name: 'James Webb Space Telescope',
 *   agencies: ['NASA', 'ESA', 'CSA'],
 *   launch: '2021-12-25',
 *   status: 'active',
 *   near: 'sun-earth-l2',
 *   horizonsId: '-170',
 *   ephemeris
 * };
 * ```
 * @group Tracking
 */
export interface ProbeRecordInterface {
  /** Stable id, in kebab case: `'voyager-1'`, `'jwst'`. */
  id: string;
  /** Common name: `'Voyager 1'`. */
  name: string;
  /** The agencies that built and fly it, leading agency first. */
  agencies: readonly string[];
  /** Launch date, in UTC: `YYYY-MM-DD`. */
  launch: string;
  /** Whether its mission still operates it. */
  status: ProbeStatusType;
  /** The body or Lagrange point it's near, or orbits: `'sun'` for a probe in interplanetary space. */
  near: string;
  /** The body or Lagrange point it's on its way to, if it's still travelling there. */
  destination?: string;
  /** Its id in JPL Horizons, for fetching a fresh ephemeris: `'-31'`. */
  horizonsId: string;
  /** Positions and velocities from the Sun's centre, in the ICRF. */
  ephemeris: EphemerisInterface;
}

/**
 * A point on an **orthographic globe view**: where it falls on the disc, and
 * whether it's on the side facing the viewer.
 *
 * Returned by `globeView` in `@interstellar-tools/tracking`.
 *
 * ::: info
 *
 * - `x` and `y` are given for every point, so a renderer can fade the far
 *   side rather than leave it out; points with `visible` false sit behind the
 *   globe.
 * - Points on the edge of the disc, the horizon seen from the viewer, are
 *   visible.
 *
 * :::
 *
 * @example
 * ```ts
 * // The point at the centre of the view, on a globe of radius 1
 * const centre: GlobePointInterface = { x: 0, y: 0, visible: true };
 * ```
 * @group Tracking
 */
export interface GlobePointInterface {
  /** Distance right of the disc's centre, in the unit of the globe's radius. */
  x: number;
  /** Distance up from the disc's centre, in the unit of the globe's radius. */
  y: number;
  /** Whether the point is on the near side of the globe. */
  visible: boolean;
}
