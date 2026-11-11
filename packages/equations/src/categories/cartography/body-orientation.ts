import { julianDate } from '@interstellar-tools/temporal';
import type {
  CelestialDirectionInterface,
  DegreesType,
  IauPeriodicTermInterface,
  IauRotationModelInterface,
  Matrix3x3Type,
  Radians
} from '@interstellar-tools/types';

import { bodyFixedFromInertialDcmIAU } from './body-fixed-from-inertial-dcm-iau.js';

const DEG = Math.PI / 180;
// Julian date of J2000.0, 2000-01-01T12:00:00 TDB
const JD_J2000 = 2_451_545;
const DAYS_PER_CENTURY = 36_525;

/**
 * A body's orientation at a moment, as {@link bodyOrientation} gives it.
 *
 * @group Cartography
 */
export interface BodyOrientationInterface {
  /**
   * The direction of the model's pole in the ICRF, the body-fixed `z` axis:
   * right ascension from 0° up to 360°, and declination.
   */
  pole: CelestialDirectionInterface;
  /**
   * $W$, how far the prime meridian has turned east of the node where the
   * body's equator crosses the ICRF equator northwards, from 0° up to 360°.
   */
  primeMeridian: DegreesType;
  /** The rotation from the ICRF to the body-fixed frame, row-major. */
  matrix: Matrix3x3Type;
}

/** The sum of a model's periodic terms at `T` centuries, with `f` sin or cos. */
const periodic = (
  terms: readonly IauPeriodicTermInterface[] | undefined,
  T: number,
  f: (angle: number) => number
) =>
  (terms ?? []).reduce(
    (sum, { amplitude, phase, rate, acceleration = 0 }) =>
      sum + amplitude * f((phase + rate * T + acceleration * T * T) * DEG),
    0
  );

/* node:coverage disable */
/**
 * The **orientation of a body at a moment**, from its IAU rotation model, as
 * `rotation.iau` in `@interstellar-tools/constants` gives it: where its pole
 * points, how far it has turned, and the rotation into its body-fixed frame.
 *
 * With $T$ in Julian centuries and $d$ in days from J2000.0 TDB, and
 * $\theta_k = \theta_{0,k} + \dot\theta_k T + \ddot\theta_k T^2$ the angle of
 * each periodic term:
 *
 * $$
 * \begin{aligned}
 * \alpha_0 &= \alpha_{0} + \dot\alpha T + \textstyle\sum_k A_k \sin\theta_k \\
 * \delta_0 &= \delta_{0} + \dot\delta T + \textstyle\sum_k A_k \cos\theta_k \\
 * W &= W_0 + \dot W d + \ddot W d^2 + \textstyle\sum_k A_k \sin\theta_k
 * \end{aligned}
 * $$
 *
 * and the matrix is {@link bodyFixedFromInertialDcmIAU} of those angles,
 * $R_3(W)\,R_1(90° - \delta_0)\,R_3(90° + \alpha_0)$.
 *
 * ::: info Notes
 *
 * - The pole is the model's: the IAU's `'north'` pole for the planets and
 *   their moons, on the north side of the solar system's invariable plane,
 *   and the `'positive'` one, by the right-hand rule, for dwarf planets and
 *   asteroids. For Venus, Uranus, Uranus's moons and Triton, $W$ decreases.
 * - The date is turned into TDB with {@link julianDate}, so it must be on or
 *   after 1972-01-01.
 * - It matches NASA NAIF's SPICE, with `pck00011.tpc`, to $10^{-12}$: SPICE's
 *   `IAU_<body>` frames are these models.
 * - The IAU gives these models to about 0.1°, and Earth's to 150″ or worse:
 *   use the IERS's Earth rotation angle for Earth.
 *
 * :::
 *
 * @param {IauRotationModelInterface} model - The body's IAU rotation model, for example `body.rotation.iau` from a dataset.
 * @param {Date} date - The moment, as a UTC `Date`, on or after 1972-01-01.
 * @returns {BodyOrientationInterface} The pole, the prime meridian's angle, and the ICRF → body-fixed rotation.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `date` is before 1972-01-01, or the model gives an angle that isn't finite.
 *
 * @example
 * ```ts
 * import { PLANETS } from '@interstellar-tools/constants';
 *
 * const mars = PLANETS.find((planet) => planet.id === 'mars')!;
 * const { pole, primeMeridian } = bodyOrientation(
 *   mars.rotation!.iau!,
 *   new Date('2026-06-20T23:58:50.816Z')
 * );
 * // pole { rightAscension: 317.6521, declination: 52.8700 }, primeMeridian 144.8722
 * ```
 *
 * @see {@link bodyFixedFromInertialDcmIAU}, for the matrix.
 * @see {@link subsolarPoint}, for where the Sun is overhead.
 * @see https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00011.tpc NASA NAIF's `pck00011.tpc`
 * @group Cartography
 */
/* node:coverage enable */
export const bodyOrientation = (
  model: IauRotationModelInterface,
  date: Date
): BodyOrientationInterface => {
  const d = julianDate(date, 'TDB') - JD_J2000;
  const T = d / DAYS_PER_CENTURY;
  const rightAscension =
    model.rightAscension +
    model.rightAscensionRate * T +
    periodic(model.rightAscensionTerms, T, Math.sin);
  const declination =
    model.declination +
    model.declinationRate * T +
    periodic(model.declinationTerms, T, Math.cos);
  const W =
    model.primeMeridian +
    model.primeMeridianRate * d +
    (model.primeMeridianAcceleration ?? 0) * d * d +
    periodic(model.primeMeridianTerms, T, Math.sin);

  if (![rightAscension, declination, W].every(Number.isFinite))
    throw new RangeError(
      `The model must give finite angles. Received: α ${rightAscension}, δ ${declination}, W ${W}`
    );

  const wrap = (angle: number) => (((angle % 360) + 360) % 360) as DegreesType;

  return {
    pole: {
      rightAscension: wrap(rightAscension),
      declination: declination as DegreesType
    },
    primeMeridian: wrap(W),
    matrix: bodyFixedFromInertialDcmIAU(
      (rightAscension * DEG) as Radians,
      (declination * DEG) as Radians,
      (W * DEG) as Radians
    )
  };
};
