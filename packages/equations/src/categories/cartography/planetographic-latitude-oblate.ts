import type { Radians } from '@interstellar-tools/types';

/**
 * Compute planetographic latitude (oblate spheroid) from body-fixed Cartesian coordinates.
 *
 * Given:
 * $$ \tan\varphi_g = \frac{z}{\sqrt{x^2+y^2}}(1-e^2)^{-1}, \qquad e^2=1-\frac{c^2}{a^2} $$
 *
 * This returns:
 * $$ \varphi_g = \arctan\!\left(\frac{z}{\sqrt{x^2+y^2}}\frac{1}{1-e^2}\right) $$
 *
 * @param x X coordinate (finite)
 * @param y Y coordinate (finite)
 * @param z Z coordinate (finite)
 * @param a Equatorial radius (finite, > 0)
 * @param c Polar radius (finite, > 0)
 * @returns Planetographic latitude φg in radians (range: [-π/2, π/2])
 */
export const planetographicLatitudeOblate = (
  x: number,
  y: number,
  z: number,
  a: number,
  c: number
): Radians => {
  if (!Number.isFinite(x))
    throw new TypeError(`x must be finite. Received: ${x}`);

  if (!Number.isFinite(y))
    throw new TypeError(`y must be finite. Received: ${y}`);

  if (!Number.isFinite(z))
    throw new TypeError(`z must be finite. Received: ${z}`);

  if (!Number.isFinite(a))
    throw new TypeError(`a must be finite. Received: ${a}`);

  if (!Number.isFinite(c))
    throw new TypeError(`c must be finite. Received: ${c}`);

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (c <= 0) throw new RangeError(`c must be > 0. Received: ${c}`);

  const rxy = Math.hypot(x, y);
  const e2 = 1 - (c * c) / (a * a);
  const oneMinusE2 = 1 - e2; // = c²/a²

  // Guard against degenerate shapes
  if (oneMinusE2 <= 0) {
    throw new RangeError(`(1 - e²) must be > 0. Computed: ${oneMinusE2}`);
  }

  // φg = atan2(z / (1 - e²), sqrt(x²+y²))
  return Math.atan2(z / oneMinusE2, rxy) as Radians;
};
