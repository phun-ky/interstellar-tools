import { J2000_UTC } from '@interstellar-tools/constants';
import type {
  DegreesType,
  IauRotationModelInterface,
  OrbitInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';
import { orbitFrameToIcrf } from '../orbits/orbit-frame-to-icrf.js';

import { bodyOrientation } from './body-orientation.js';

const DEG = Math.PI / 180;

/* node:coverage disable */
/**
 * The **axial tilt** of a body, its obliquity: the angle between its spin
 * axis and its orbit's pole, from its IAU rotation model and its orbit.
 *
 * The spin axis is the model's pole $\hat{p}$, turned around if the prime
 * meridian runs backwards, and the orbit's pole $\hat{n}$ comes from its `i`
 * and `om`, placed in the ICRF by {@link orbitFrameToIcrf}:
 *
 * $$
 * \hat{s} = \operatorname{sign}(\dot W)\,\hat{p}, \qquad
 * \hat{n} = R_\text{frame} \begin{pmatrix} \sin i \sin\Omega \\ -\sin i \cos\Omega \\ \cos i \end{pmatrix}, \qquad
 * \varepsilon = \arccos(\hat{s} \cdot \hat{n})
 * $$
 *
 * ::: info Notes
 *
 * - Over 90°, the body spins backwards against its orbit: Venus 177.36°,
 *   Uranus 97.77°, Pluto 119.61°.
 * - The spin axis follows the right-hand rule, so it doesn't matter whether
 *   the model's pole is the IAU's `'north'` or `'positive'` one.
 * - The datasets' orbits are fixed at J2000, so the default `date` is J2000.
 *   A later date moves the pole, not the orbit.
 * - The IAU's models of most moons assume the spin axis follows the orbit's
 *   pole, so a moon's tilt from them says how well the model fits the orbit,
 *   not what anyone measured.
 *
 * :::
 *
 * @param {IauRotationModelInterface} model - The body's IAU rotation model, for example `body.rotation.iau` from a dataset.
 * @param {OrbitInterface} orbit - Its orbit, with a `frame` that can be placed in the ICRF.
 * @param {Date} [date] - The moment to take the pole at, on or after 1972-01-01. Defaults to J2000.
 * @returns {DegreesType} The axial tilt, from 0° to 180°.
 * @throws {RangeError} If the model's prime meridian doesn't turn, the orbit has no `frame`,
 * or one that can't be placed in the ICRF ({@link orbitFrameToIcrf}).
 *
 * @example
 * ```ts
 * import { PLANETS } from '@interstellar-tools/constants';
 *
 * const mars = PLANETS.find((planet) => planet.id === 'mars')!;
 *
 * axialTilt(mars.rotation!.iau!, mars.orbit!); // ≈ 25.19
 * ```
 *
 * @see {@link bodyOrientation}, for the pole.
 * @group Cartography
 */
/* node:coverage enable */
export const axialTilt = (
  model: IauRotationModelInterface,
  orbit: OrbitInterface,
  date: Date = J2000_UTC
): DegreesType => {
  const sign = Math.sign(model.primeMeridianRate);

  if (sign === 0 || Number.isNaN(sign))
    throw new RangeError(
      `The model's prime meridian must turn. Received: primeMeridianRate ${model.primeMeridianRate}`
    );

  if (!orbit.frame)
    throw new RangeError(
      'The orbit needs a frame to place its pole in the ICRF.'
    );

  const toIcrf = orbitFrameToIcrf(orbit.frame);
  const { matrix } = bodyOrientation(model, date);
  // The body-fixed z axis, the model's pole, in the ICRF
  const spin = matrix[2].map((value) => sign * value);
  const i = (orbit.i ?? (orbit.retrograde ? 180 : 0)) * DEG;
  const om = (orbit.om ?? 0) * DEG;
  const normal = applyMatrix3(toIcrf, [
    Math.sin(i) * Math.sin(om),
    -Math.sin(i) * Math.cos(om),
    Math.cos(i)
  ] as Vector3DTupleType);
  const dot = spin.reduce((sum, value, k) => sum + value * normal[k]!, 0);

  return (Math.acos(Math.max(-1, Math.min(1, dot))) / DEG) as DegreesType;
};
