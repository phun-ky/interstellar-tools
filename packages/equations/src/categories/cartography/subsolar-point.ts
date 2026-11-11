import type {
  DegreesType,
  IauRotationModelInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';

import { bodyOrientation } from './body-orientation.js';

const DEG = Math.PI / 180;

/**
 * A point on a body, in planetocentric coordinates, as {@link subsolarPoint}
 * gives it.
 *
 * @group Cartography
 */
export interface PlanetocentricPointInterface {
  /** Planetocentric latitude, from −90° to 90°, the angle seen from the body's centre. */
  latitude: DegreesType;
  /** Longitude east of the prime meridian, around the model's pole, from 0° up to 360°. */
  longitude: DegreesType;
}

/* node:coverage disable */
/**
 * The **subsolar point**: where on a body the Sun is overhead, from its IAU
 * rotation model and the direction from the body to the Sun.
 *
 * The direction is turned into the body-fixed frame by
 * {@link bodyOrientation}'s matrix, $\vec{s}' = M \vec{s}$, and read off as
 *
 * $$
 * \varphi = \operatorname{atan2}\left(s'_z, \sqrt{s'^2_x + s'^2_y}\right), \qquad
 * \lambda = \operatorname{atan2}(s'_y, s'_x)
 * $$
 *
 * ::: info Notes
 *
 * - Any direction will do: the direction to Earth gives the sub-Earth point,
 *   the centre of the disk a telescope sees.
 * - The latitude is **planetocentric**, from the body's centre. Maps of Mars
 *   use planetographic latitudes, which are a little further from the
 *   equator on a flattened body: −25.23° where this gives −24.98°.
 * - The longitude is east, around the model's pole. Mars's maps also count
 *   west, which is $360° - \lambda$.
 * - The axes of `sunDirection` are the ICRF's. Light time is the caller's to
 *   apply: the Sun moves little in the minutes its light takes.
 *
 * :::
 *
 * @param {IauRotationModelInterface} model - The body's IAU rotation model, for example `body.rotation.iau` from a dataset.
 * @param {Vector3DTupleType} sunDirection - The direction from the body to the Sun in the ICRF, of any length.
 * @param {Date} date - The moment, as a UTC `Date`, on or after 1972-01-01.
 * @returns {PlanetocentricPointInterface} The planetocentric latitude and east longitude where the Sun is overhead.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `sunDirection` is zero or not finite, `date` is before 1972-01-01,
 * or the model gives an angle that isn't finite.
 *
 * @example
 * ```ts
 * import { PLANETS } from '@interstellar-tools/constants';
 *
 * const mars = PLANETS.find((planet) => planet.id === 'mars')!;
 * const date = new Date('2000-01-06T00:00:00Z');
 * // From Mars to the Sun: minus Mars's place around the Sun
 * const { r } = stateAt(mars.orbit!, date);
 * const point = subsolarPoint(
 *   mars.rotation!.iau!,
 *   [-r[0], -r[1], -r[2]],
 *   date
 * ); // ≈ { latitude: -24.98, longitude: 185.27 }, 174.73° west
 * ```
 *
 * @see {@link bodyOrientation}, for the matrix.
 * @see https://www.giss.nasa.gov/tools/mars24/help/algorithm.html NASA GISS's Mars24 algorithm and worked examples
 * @group Cartography
 */
/* node:coverage enable */
export const subsolarPoint = (
  model: IauRotationModelInterface,
  sunDirection: Vector3DTupleType,
  date: Date
): PlanetocentricPointInterface => {
  const length = Math.hypot(...sunDirection);

  if (!Number.isFinite(length) || length === 0)
    throw new RangeError(
      `sunDirection must be finite and not zero. Received: ${JSON.stringify(sunDirection)}`
    );

  const [x, y, z] = applyMatrix3(
    bodyOrientation(model, date).matrix,
    sunDirection
  );

  return {
    latitude: (Math.atan2(z, Math.hypot(x, y)) / DEG) as DegreesType,
    longitude: ((((Math.atan2(y, x) / DEG) % 360) + 360) % 360) as DegreesType
  };
};
