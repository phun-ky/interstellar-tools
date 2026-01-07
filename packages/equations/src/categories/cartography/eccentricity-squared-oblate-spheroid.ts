/**
 * Compute **first eccentricity squared** ($ e^2 $) for an oblate spheroid.
 *
 * The first eccentricity describes how much an oblate spheroid (ellipsoid of revolution)
 * deviates from a perfect sphere. For equatorial radius ($ a $) and polar radius ($ c $):
 *
 * $$
 * e^2 = 1 - \frac{c^2}{a^2}
 * $$
 *
 * ::: info Notes:
 *
 * - ($ e^2 $) is **dimensionless**.
 * - For a physically valid oblate spheroid with ($ a \ge c > 0 $), ($ 0 \le e^2 < 1 $).
 * - This quantity is widely used in geodesy and mapping formulas (e.g., planetographic latitude,
 *   geodetic coordinates, map projections).
 *
 * :::
 *
 * @param a - Equatorial radius ($ a $) (finite, > 0).
 * @param c - Polar radius ($ c $) (finite, > 0).
 * @returns First eccentricity squared ($ e^2 $) (dimensionless).
 * @throws {TypeError} If `a` or `c` is not a finite number.
 * @throws {RangeError} If `a <= 0` or `c <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Earth (WGS84-ish radii in meters):
 * const a = 6378137.0;
 * const c = 6356752.314245;
 * const e2 = eccentricitySquaredOblateSpheroid(a, c);
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Eccentricity_(mathematics)#Ellipses_and_ellipsoids Eccentricity for ellipses/ellipsoids (includes first eccentricity)
 * @see https://en.wikipedia.org/wiki/Reference_ellipsoid Reference ellipsoid (geodesy context; uses a, b and eccentricity)
 * @see https://epsg.org/guidance-notes.html EPSG Guidance Notes (geodesy reference; ellipsoid parameters and derived quantities)
 */
export const eccentricitySquaredOblateSpheroid = (
  a: number,
  c: number
): number => {
  if (!Number.isFinite(a))
    throw new TypeError(`a must be finite. Received: ${a}`);

  if (!Number.isFinite(c))
    throw new TypeError(`c must be finite. Received: ${c}`);

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (c <= 0) throw new RangeError(`c must be > 0. Received: ${c}`);

  return 1 - (c * c) / (a * a);
};
