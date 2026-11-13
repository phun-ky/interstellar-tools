import type { DegreesType } from '../numeric.js';
import type { TemporalInterface } from '../temporal.js';

/**
 * A **periodic term** in an IAU rotation model: an amplitude times the sine or
 * cosine of an angle that grows with time.
 *
 * ::: info
 *
 * - The angle is $\theta = \theta_0 + \dot\theta T + \ddot\theta T^2$, with
 *   $T$ in Julian centuries of 36 525 days from J2000.0 TDB.
 * - Terms for the pole's right ascension and the prime meridian add
 *   $A \sin\theta$, and terms for its declination $A \cos\theta$.
 *
 * :::
 *
 * @example
 * ```ts
 * // Neptune's pole swings around 0.7° in right ascension, every 688 years
 * const term: IauPeriodicTermInterface = {
 *   amplitude: 0.7,
 *   phase: 357.85 as DegreesType,
 *   rate: 52.316
 * };
 * ```
 * @group Celestial Bodies
 */
export interface IauPeriodicTermInterface {
  /** Amplitude $A$, in degrees. */
  amplitude: number;
  /** The angle $\theta_0$ at J2000.0, in degrees. */
  phase: DegreesType;
  /** Its rate $\dot\theta$, in degrees per Julian century. */
  rate: number;
  /** Its quadratic term $\ddot\theta$, in degrees per Julian century². Omitted when 0. */
  acceleration?: number;
}

/**
 * A body's **IAU rotation model**: which way its spin axis points, and how far
 * it has turned, at any moment (Archinal et al. 2018).
 *
 * ::: info
 *
 * - With $T$ in Julian centuries and $d$ in days from J2000.0 TDB, the pole is
 *   at right ascension $\alpha_0 + \dot\alpha T$ and declination
 *   $\delta_0 + \dot\delta T$, and the prime meridian at
 *   $W = W_0 + \dot W d + \ddot W d^2$, each plus its periodic terms.
 * - $W$ is measured east along the body's equator from where it crosses the
 *   ICRF equator northwards, at right ascension $\alpha + 90°$.
 * - `pole` says which pole the model gives. For planets and their moons it's
 *   the `'north'` one, on the north side of the solar system's invariable
 *   plane, so $\dot W$ is negative for a backwards spin, like Venus's and
 *   Uranus's. For dwarf planets, asteroids and comets it's the `'positive'`
 *   one, by the right-hand rule, so $\dot W$ is always positive, and Pluto's
 *   points south.
 * - The periodic terms can't be left out where they're large: they move
 *   Mars's pole by 1.6° and Triton's by 21°.
 *
 * :::
 *
 * @example
 * ```ts
 * // Saturn
 * const saturn: IauRotationModelInterface = {
 *   pole: 'north',
 *   rightAscension: 40.589 as DegreesType,
 *   rightAscensionRate: -0.036,
 *   declination: 83.537 as DegreesType,
 *   declinationRate: -0.004,
 *   primeMeridian: 38.9 as DegreesType,
 *   primeMeridianRate: 810.7939024
 * };
 * ```
 * @group Celestial Bodies
 */
export interface IauRotationModelInterface {
  /** Which pole the model gives: `'north'` for planets and moons, `'positive'` by the right-hand rule for small bodies. */
  pole: 'north' | 'positive';
  /** The pole's right ascension at J2000.0, $\alpha_0$, in degrees. */
  rightAscension: DegreesType;
  /** Its rate $\dot\alpha$, in degrees per Julian century. */
  rightAscensionRate: number;
  /** The pole's declination at J2000.0, $\delta_0$, in degrees. */
  declination: DegreesType;
  /** Its rate $\dot\delta$, in degrees per Julian century. */
  declinationRate: number;
  /** The prime meridian's angle at J2000.0, $W_0$, in degrees. */
  primeMeridian: DegreesType;
  /** Its rate $\dot W$, in degrees per day: negative for a backwards spin about a `'north'` pole. */
  primeMeridianRate: number;
  /** Its quadratic term $\ddot W$, in degrees per day². Omitted when 0. */
  primeMeridianAcceleration?: number;
  /** Periodic terms added to the right ascension, each $A \sin\theta$. */
  rightAscensionTerms?: readonly IauPeriodicTermInterface[];
  /** Periodic terms added to the declination, each $A \cos\theta$. */
  declinationTerms?: readonly IauPeriodicTermInterface[];
  /** Periodic terms added to the prime meridian, each $A \sin\theta$. */
  primeMeridianTerms?: readonly IauPeriodicTermInterface[];
}

/**
 * How a star, planet, moon, asteroid or comet **spins**: its sidereal rotation
 * period, one turn against the stars.
 *
 * ::: info
 *
 * - **Direction**: like an orbit's, `period` is always a positive duration. A
 *   backwards spin, against its parent's, has `retrograde: true`: Venus,
 *   Uranus and Pluto against the Sun's spin, and Triton, which keeps one face
 *   to Neptune on its backwards orbit. A star's direction is mostly unknown,
 *   so it's left out.
 * - **Synchronous**: a moon that keeps one face to its planet, like the Moon,
 *   has `synchronous: true`. Its `period` is its orbital period, and its
 *   `retrograde` is its orbit's.
 * - **Differential rotation**: a ball of gas, like the Sun, turns faster at
 *   its equator than at its poles. `period` is then its reference period, the
 *   one its coordinates turn with (the Carrington period for the Sun), and
 *   `equatorialPeriod` and `polarPeriod` give the range.
 * - **Tumbling**: a body with no fixed spin axis, like Halley's comet, has
 *   `tumbling: true`, and `period` is the main period of its motion.
 * - **Axial tilt**: `obliquity` is the angle between its spin axis and its
 *   orbit's pole: Earth's 23.44° gives it seasons, and Venus's 177.36° is
 *   why it spins backwards.
 * - **Orientation**: `iau` is its IAU rotation model, the direction of its
 *   pole and its prime meridian at any moment.
 * - **Not a day**: one turn against the stars is not sunrise to sunrise. The
 *   body moves along its orbit as it turns, so a solar day also depends on
 *   the orbital period: Earth turns in 23 h 56 m, and its day is 24 h.
 *
 * :::
 *
 * @example
 * ```ts
 * const mars: RotationInterface = {
 *   period: { value: 24.623, unit: 'h' }
 * };
 * const moon: RotationInterface = {
 *   period: { value: 27.321661, unit: 'd' },
 *   synchronous: true
 * };
 * const venus: RotationInterface = {
 *   period: { value: 243.0226, unit: 'd' },
 *   retrograde: true
 * };
 * const sun: RotationInterface = {
 *   period: { value: 25.38, unit: 'd' },
 *   equatorialPeriod: { value: 24.47, unit: 'd' },
 *   polarPeriod: { value: 34.16, unit: 'd' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface RotationInterface {
  /** Sidereal rotation period, always positive. See `retrograde` for the direction. */
  period: TemporalInterface;
  /** `true` for a spin against the parent's. Omitted for the usual prograde spin. */
  retrograde?: boolean;
  /** `true` for a moon that keeps one face to its planet. Omitted otherwise. */
  synchronous?: boolean;
  /** Sidereal period at the equator, for a body that turns faster there than at its poles. */
  equatorialPeriod?: TemporalInterface;
  /** Sidereal period at the poles, for a body that turns slower there than at its equator. */
  polarPeriod?: TemporalInterface;
  /** `true` for a body with no fixed spin axis. `period` is then the main period of its motion. */
  tumbling?: boolean;
  /**
   * Axial tilt: the angle between its spin axis, by the right-hand rule, and
   * its orbit's pole, from 0° to 180°. Over 90° for a backwards spin.
   */
  obliquity?: DegreesType;
  /** Its IAU rotation model, where the IAU gives one. */
  iau?: IauRotationModelInterface;
}
