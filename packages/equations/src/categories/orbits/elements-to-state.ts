import type {
  ClassicalElementsInterface,
  StateVectorInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';
import { matMul3 } from '../helpers/mat-mul3.js';
import { rot1 } from '../helpers/rot-1.js';
import { rot3 } from '../helpers/rot-3.js';

/**
 * Convert the six **classical orbital elements** to a **state vector** (position and velocity).
 *
 * In the perifocal frame, with $ p = a(1 - e^2) $:
 *
 * $$
 * \mathbf r_{PQW} = \frac{p}{1 + e\cos\nu}\begin{pmatrix}\cos\nu \\ \sin\nu \\ 0\end{pmatrix}, \quad
 * \mathbf v_{PQW} = \sqrt{\frac{\mu}{p}}\begin{pmatrix}-\sin\nu \\ e + \cos\nu \\ 0\end{pmatrix}
 * $$
 *
 * then rotated into the inertial frame:
 *
 * $$
 * \mathbf r = R_3(\Omega)\,R_1(i)\,R_3(\omega)\,\mathbf r_{PQW}, \quad
 * \mathbf v = R_3(\Omega)\,R_1(i)\,R_3(\omega)\,\mathbf v_{PQW}
 * $$
 *
 * **Units**
 * - Inputs: `a` in **m**, `e` dimensionless, angles in **radians**, `mu` in **m³/s²**.
 * - Output: `r` in **m**, `v` in **m/s**.
 *
 * ::: info Notes
 *
 * - The inverse of {@link stateToElements}, including its conventions for circular and equatorial orbits.
 * - Elliptic orbits need $ a > 0 $ and hyperbolic ones $ a < 0 $. A parabolic orbit ($ e = 1 $) has no finite $ a $, so it isn't supported.
 * - On a hyperbola, only true anomalies with $ 1 + e\cos\nu > 0 $ exist: the body never reaches the asymptotes.
 *
 * :::
 *
 * @param elements - The classical orbital elements.
 * @param mu - Gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @returns The position `r` in **m** and velocity `v` in **m/s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `mu <= 0`, `e < 0`, `e = 1`, `i` is outside [0, π], `a` has the wrong sign for `e`, or `nu` is beyond a hyperbola's asymptotes.
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // A circular, equatorial orbit at 7000 km, a quarter of the way round
 * const { r, v } = elementsToState(
 *   {
 *     a: 7_000_000,
 *     e: 0,
 *     i: 0 as Radians,
 *     raan: 0 as Radians,
 *     argp: 0 as Radians,
 *     nu: (Math.PI / 2) as Radians
 *   },
 *   3.986004418e14
 * );
 * // r ≈ [0, 7 000 000, 0] m, v ≈ [-7546, 0, 0] m/s
 * ```
 *
 * @see {@link stateToElements}
 * @see https://en.wikipedia.org/wiki/Perifocal_coordinate_system Perifocal coordinate system
 */
export const elementsToState = (
  elements: ClassicalElementsInterface,
  mu: number
): StateVectorInterface => {
  const { a, e, i, raan, argp, nu } = elements;

  for (const [name, x] of [
    ['a', a],
    ['e', e],
    ['i', i],
    ['raan', raan],
    ['argp', argp],
    ['nu', nu],
    ['mu', mu]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (mu <= 0) throw new RangeError(`mu must be > 0. Received: ${mu}`);

  if (e < 0) throw new RangeError(`e must be >= 0. Received: ${e}`);

  if (Math.abs(e - 1) < 1e-12)
    throw new RangeError(
      'Parabolic orbits (e = 1) are not supported: they have no finite semi-major axis.'
    );

  if (i < 0 || i > Math.PI)
    throw new RangeError(`i must be in [0, π]. Received: ${i}`);

  if (e < 1 && a <= 0)
    throw new RangeError(
      `a must be > 0 for an elliptic orbit. Received: a=${a}, e=${e}`
    );

  if (e > 1 && a >= 0)
    throw new RangeError(
      `a must be < 0 for a hyperbolic orbit. Received: a=${a}, e=${e}`
    );

  const p = a * (1 - e * e);
  const denominator = 1 + e * Math.cos(nu);

  if (denominator <= 0)
    throw new RangeError(
      `nu is beyond the hyperbola's asymptotes (1 + e cos nu <= 0). Received: nu=${nu}, e=${e}`
    );

  const rPqw: Vector3DTupleType = [
    (p * Math.cos(nu)) / denominator,
    (p * Math.sin(nu)) / denominator,
    0
  ];
  const speed = Math.sqrt(mu / p);
  const vPqw: Vector3DTupleType = [
    -speed * Math.sin(nu),
    speed * (e + Math.cos(nu)),
    0
  ];
  const Q = matMul3(matMul3(rot3(raan), rot1(i)), rot3(argp));

  return { r: applyMatrix3(Q, rPqw), v: applyMatrix3(Q, vPqw) };
};
