/**
 * Test whether a 3D point lies on the surface of a **triaxial ellipsoid** (within a tolerance).
 *
 * A triaxial ellipsoid centered at the origin with semi-axes ($ a $), ($ b $), ($ c $) aligned to
 * the ($ x $), ($ y $), ($ z $) axes is defined by the implicit surface:
 *
 * $$
 * \frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1
 * $$
 *
 * This function evaluates the left-hand side and checks whether it is within `eps` of 1.
 *
 * ::: info Notes:
 *
 * - This is a **pure geometric** surface membership test; it does not compute the closest
 *   point on the ellipsoid or any geodetic latitude/longitude.
 * - For ellipsoids of revolution (oblate/prolate), you typically have ($ a=b $), but this
 *   supports the general triaxial case.
 *
 * :::
 *
 * @param x - X coordinate (finite).
 * @param y - Y coordinate (finite).
 * @param z - Z coordinate (finite).
 * @param a - Semi-axis length along x (finite, > 0).
 * @param b - Semi-axis length along y (finite, > 0).
 * @param c - Semi-axis length along z (finite, > 0).
 * @param eps - Allowed absolute tolerance on the implicit value (finite, >= 0). Defaults to `1e-12`.
 * @returns `true` if the point satisfies the ellipsoid equation within `eps`, otherwise `false`.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `a <= 0`, `b <= 0`, `c <= 0`, or `eps < 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Ellipsoid with semi-axes a=3, b=2, c=1
 * // Point on +X axis should be on the surface: (x,y,z) = (a,0,0)
 * const onSurface = isOnTriaxialEllipsoidSurface(3, 0, 0, 3, 2, 1);
 * // onSurface === true
 * ```
 *
 * @example
 * ```ts
 * // Slightly off the surface (use a looser eps if needed)
 * const onSurface = isOnTriaxialEllipsoidSurface(3.0000001, 0, 0, 3, 2, 1, 1e-6);
 * // onSurface === true
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Ellipsoid Ellipsoid (general definition and implicit equation)
 * @see https://mathworld.wolfram.com/Ellipsoid.html Wolfram MathWorld — Ellipsoid (properties and equations)
 * @see https://en.wikipedia.org/wiki/Triaxial_ellipsoid Triaxial ellipsoid (special case discussion)
 */
export const isOnTriaxialEllipsoidSurface = (
  x: number,
  y: number,
  z: number,
  a: number,
  b: number,
  c: number,
  eps = 1e-12
): boolean => {
  for (const [name, v] of [
    ['x', x],
    ['y', y],
    ['z', z],
    ['a', a],
    ['b', b],
    ['c', c],
    ['eps', eps]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be finite. Received: ${v}`);
  }

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (b <= 0) throw new RangeError(`b must be > 0. Received: ${b}`);

  if (c <= 0) throw new RangeError(`c must be > 0. Received: ${c}`);

  if (eps < 0) throw new RangeError(`eps must be >= 0. Received: ${eps}`);

  const value = (x * x) / (a * a) + (y * y) / (b * b) + (z * z) / (c * c);

  return Math.abs(value - 1) <= eps;
};
