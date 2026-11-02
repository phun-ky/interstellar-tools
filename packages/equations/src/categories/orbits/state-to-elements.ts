import type {
  ClassicalElementsInterface,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { cross, dot, norm, norm2pi, scale, sub } from '../helpers/misc.js';

/**
 * Convert a **state vector** (position and velocity) to the six **classical orbital elements**.
 *
 * $$
 * \mathbf h = \mathbf r \times \mathbf v, \quad
 * \mathbf e = \frac{\mathbf v \times \mathbf h}{\mu} - \frac{\mathbf r}{r}, \quad
 * \mathbf n = \hat{\mathbf k} \times \mathbf h, \quad
 * a = -\frac{\mu}{2\varepsilon}, \quad
 * \varepsilon = \frac{v^2}{2} - \frac{\mu}{r}
 * $$
 *
 * $$
 * i = \arccos\frac{h_z}{h}, \quad
 * \Omega = \operatorname{atan2}(n_y, n_x), \quad
 * \omega = \angle(\mathbf n, \mathbf e), \quad
 * \nu = \angle(\mathbf e, \mathbf r)
 * $$
 *
 * where each angle $ \angle $ is measured in the direction of motion, about $ \mathbf h $.
 *
 * **Units**
 * - Inputs: `r` in **m**, `v` in **m/s**, `mu` in **m³/s²**.
 * - Output: `a` in **m**, `e` dimensionless, angles in **radians**.
 *
 * ::: info Notes
 *
 * - Works for elliptic and hyperbolic orbits. A hyperbolic orbit has a negative `a`, and `nu` in [0, 2π) like the others: the incoming branch is just below 2π.
 * - Some angles are undefined for special orbits. Below `tolerance`, the function uses these conventions, which {@link elementsToState} reverses:
 *   - **circular** ($ e \approx 0 $): `argp = 0`, and `nu` is measured from the ascending node (the argument of latitude);
 *   - **equatorial** ($ i \approx 0 $ or $ \pi $): `raan = 0`, and `argp` is measured from the x axis (the longitude of periapsis);
 *   - **circular and equatorial**: `raan = argp = 0`, and `nu` is measured from the x axis (the true longitude).
 * - The frame is whatever inertial frame `r` and `v` are given in, centred on the body with parameter `mu`; the reference plane is its xy plane.
 *
 * :::
 *
 * ::: practice Apollo 11, leaving for the Moon
 *
 * **e = 0.977**
 *
 * _From the flown state at trans-lunar injection: 6 712.6 km from Earth's centre, 10 834.3 m/s, 7.367° above the horizontal_
 *
 * The AS-506 flight evaluation report gives 0.97696; the inputs here are rounded. An orbit that stretched reaches far beyond the Moon, but the Moon's gravity takes over long before.
 *
 * ```ts
 * const r = 6_712_602; // m
 * const v = 10_834.3; // m/s
 * const gamma = toRad(7.367);
 * stateToElements(
 *   [r, 0, 0],
 *   [v * Math.sin(gamma), v * Math.cos(gamma), 0],
 *   3.986004418e14
 * ).e; // ≈ 0.97715
 * ```
 *
 * :::
 *
 * @param r - Position vector in **m** (finite components, not zero).
 * @param v - Velocity vector in **m/s** (finite components).
 * @param mu - Gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @param tolerance - Below this, `e` counts as circular and $ \sin i $ as equatorial. Defaults to `1e-10`.
 * @returns The classical orbital elements.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `mu <= 0`, `tolerance < 0`, `r` is zero, or the motion is straight up or down (no angular momentum).
 * @group Orbits
 *
 * @example
 * ```ts
 * // Curtis, Orbital Mechanics for Engineering Students, in km and km/s
 * const { a, e, i, raan, argp, nu } = stateToElements(
 *   [-6045e3, -3490e3, 2500e3],
 *   [-3.457e3, 6.618e3, 2.533e3],
 *   398_600e9
 * );
 * // e ≈ 0.1712, i ≈ 153.2°, raan ≈ 255.3°, argp ≈ 20.07°, nu ≈ 28.45°
 * ```
 *
 * @see {@link elementsToState}
 * @see https://en.wikipedia.org/wiki/Orbital_elements Orbital elements
 */
export const stateToElements = (
  r: Vector3DTupleType,
  v: Vector3DTupleType,
  mu: number,
  tolerance = 1e-10
): ClassicalElementsInterface => {
  for (const [name, vector] of [
    ['r', r],
    ['v', v]
  ] as const) {
    for (const x of vector)
      if (!Number.isFinite(x))
        throw new TypeError(
          `${name} must have finite components. Received: ${x}`
        );
  }

  for (const [name, x] of [
    ['mu', mu],
    ['tolerance', tolerance]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (mu <= 0) throw new RangeError(`mu must be > 0. Received: ${mu}`);

  if (tolerance < 0)
    throw new RangeError(`tolerance must be >= 0. Received: ${tolerance}`);

  const rn = norm(r);
  const vn = norm(v);

  if (rn === 0) throw new RangeError('r must not be the zero vector.');

  const h = cross(r, v);
  const hn = norm(h);

  if (hn <= 1e-12 * rn * vn || hn === 0)
    throw new RangeError(
      'The motion is straight up or down (no angular momentum), so the orbit has no plane.'
    );

  const hHat = scale(h, 1 / hn);
  const eVec = sub(scale(cross(v, h), 1 / mu), scale(r, 1 / rn));
  const e = norm(eVec);
  const energy = (vn * vn) / 2 - mu / rn;
  const a = -mu / (2 * energy);
  const i = Math.acos(Math.min(1, Math.max(-1, h[2] / hn)));
  // The ascending node points along k × h
  const node: Vector3DTupleType = [-h[1], h[0], 0];
  const equatorial = Math.hypot(h[0], h[1]) <= tolerance * hn;
  const circular = e <= tolerance;
  // The angle from u to w, measured in the direction of motion
  const angle = (u: Vector3DTupleType, w: Vector3DTupleType) =>
    norm2pi(Math.atan2(dot(cross(u, w), hHat), dot(u, w)));
  const reference: Vector3DTupleType = equatorial ? [1, 0, 0] : node;

  return {
    a,
    e,
    i: i as Radians,
    raan: (equatorial ? 0 : norm2pi(Math.atan2(node[1], node[0]))) as Radians,
    argp: (circular ? 0 : angle(reference, eVec)) as Radians,
    nu: (circular ? angle(reference, r) : angle(eVec, r)) as Radians
  };
};
