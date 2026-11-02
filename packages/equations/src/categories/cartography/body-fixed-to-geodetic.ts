import type {
  GeodeticCoordinatesInterface,
  Radians
} from '@interstellar-tools/types';

/**
 * Convert a **body-fixed Cartesian** position (ECEF for Earth) to **geodetic coordinates**: latitude, longitude and height.
 *
 * There's no closed form for the latitude. This uses Bowring's iteration on the parametric latitude $ \beta $:
 *
 * $$
 * \tan\varphi = \frac{z + e'^2 b \sin^3\beta}{p - e^2 a \cos^3\beta},
 * \qquad
 * \tan\beta = \frac{b}{a}\tan\varphi
 * $$
 *
 * and then
 *
 * $$
 * \lambda = \operatorname{atan2}(y, x), \qquad
 * h = p\cos\varphi + z\sin\varphi - a\sqrt{1 - e^2\sin^2\varphi}
 * $$
 *
 * Where:
 * - $ p = \sqrt{x^2 + y^2} $ is the distance from the rotation axis (m)
 * - $ a $ is the equatorial radius, $ b = a\sqrt{1 - e^2} $ the polar radius (m)
 * - $ e^2 $ is the first eccentricity squared, $ e'^2 = e^2 / (1 - e^2) $ the second
 *
 * **Units**
 * - Inputs: `x`, `y`, `z` and `a` in **m**, `eSquared` dimensionless.
 * - Output: `phi` and `lambda` in **radians**, `h` in **m**.
 *
 * ::: info Notes
 *
 * - Starting from $ \tan\beta = a z / (b p) $, two iterations reach sub-millimetre accuracy for points near Earth's surface; the loop runs until $ \beta $ stops changing, to at most 10 iterations.
 * - The height formula is stable everywhere, the poles included. On the rotation axis, `phi` is ±π/2 and `lambda` is 0.
 * - For a point on the surface, `phi` equals {@link planetographicLatitudeOblate}; this one also handles points above and below it.
 * - {@link geodeticToBodyFixed} goes the other way.
 *
 * :::
 *
 * ::: practice Apollo 11, in Earth orbit
 *
 * **32.672° N, 191.1 km up**
 *
 * _At orbit insertion: 6 563.0 km from Earth's centre, at 32.502° N geocentric_
 *
 * Seen from Earth's centre, the insertion point was at 32.502°, the latitude that fixes the orbit's inclination. On a map it was 0.170° further north, the latitude the flight evaluation report gives.
 *
 * ```ts
 * const lat = toRad(32.502);
 * const r = 6_563_041;
 * bodyFixedToGeodetic(r * Math.cos(lat), 0, r * Math.sin(lat), 6_378_137, 0.00669437999014);
 * // phi ≈ 32.672°, h ≈ 191.1 km
 * ```
 *
 * :::
 *
 * @param x - Body-fixed $ x $ in **m** (finite), through the prime meridian.
 * @param y - Body-fixed $ y $ in **m** (finite), through 90° east.
 * @param z - Body-fixed $ z $ in **m** (finite), along the rotation axis.
 * @param a - Equatorial radius $ a $ in **m** (finite, > 0).
 * @param eSquared - First eccentricity squared $ e^2 $ (finite, in [0, 1)).
 * @returns The geodetic latitude, longitude and height.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `a <= 0`, `eSquared` is outside [0, 1), or the point is at the centre.
 * @group Cartography
 *
 * @example
 * ```ts
 * // 1 km above the North Pole on WGS84
 * const { phi, h } = bodyFixedToGeodetic(0, 0, 6_357_752.314, 6_378_137, 0.00669437999014);
 * // phi = π/2, h ≈ 1 000 m
 * ```
 *
 * @see {@link geodeticToBodyFixed}
 * @see {@link planetographicLatitudeOblate}
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_conversion Geographic coordinate conversion
 */
export const bodyFixedToGeodetic = (
  x: number,
  y: number,
  z: number,
  a: number,
  eSquared: number
): GeodeticCoordinatesInterface => {
  for (const [name, v] of [
    ['x', x],
    ['y', y],
    ['z', z],
    ['a', a],
    ['eSquared', eSquared]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (eSquared < 0 || eSquared >= 1)
    throw new RangeError(`eSquared must be in [0, 1). Received: ${eSquared}`);

  const p = Math.hypot(x, y);

  if (p === 0 && z === 0)
    throw new RangeError('The point must not be at the centre of the body.');

  const lambda = (p === 0 ? 0 : Math.atan2(y, x)) as Radians;
  const b = a * Math.sqrt(1 - eSquared);
  const ePrimeSquared = eSquared / (1 - eSquared);

  let beta = Math.atan2(a * z, b * p);
  let phi = 0;

  for (let k = 0; k < 10; k++) {
    phi = Math.atan2(
      z + ePrimeSquared * b * Math.sin(beta) ** 3,
      p - eSquared * a * Math.cos(beta) ** 3
    );

    const next = Math.atan2(b * Math.sin(phi), a * Math.cos(phi));

    if (Math.abs(next - beta) < 1e-15) break;

    beta = next;
  }

  const sinPhi = Math.sin(phi);
  const h =
    p * Math.cos(phi) +
    z * sinPhi -
    a * Math.sqrt(1 - eSquared * sinPhi * sinPhi);

  return { phi: phi as Radians, lambda, h };
};
