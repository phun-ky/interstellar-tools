/**
 * Compute **flattening** ($ f $) of an oblate spheroid.
 *
 * Flattening quantifies how much an ellipsoid of revolution is "squashed" at the poles,
 * using equatorial radius ($ a $) and polar radius ($ c $):
 *
 * $$
 * f = \frac{a - c}{a}
 * $$
 *
 * ::: info Notes:
 *
 * - ($ f $) is **dimensionless**.
 * - For a physically valid oblate spheroid with ($ a \ge c > 0 $), ($ 0 \le f < 1 $).
 * - Commonly used in geodesy/cartography (e.g., defining reference ellipsoids and deriving
 *   related parameters like eccentricity).
 *
 * :::
 *
 * @param a - Equatorial radius ($ a $) (finite, > 0).
 * @param c - Polar radius ($ c $) (finite, > 0).
 * @returns Flattening ($ f $) (dimensionless).
 * @throws {TypeError} If `a` or `c` is not a finite number.
 * @throws {RangeError} If `a <= 0` or `c <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Earth (WGS84-ish radii in meters):
 * const a = 6378137.0;
 * const c = 6356752.314245;
 * const f = flatteningOblateSpheroid(a, c);
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Flattening Flattening (definition and geodesy usage)
 * @see https://en.wikipedia.org/wiki/Reference_ellipsoid Reference ellipsoid (a, b/c, and flattening used to define ellipsoids)
 * @see https://epsg.org/guidance-notes.html EPSG Guidance Notes (geodesy reference; ellipsoid parameters and derived quantities)
 */
export const flatteningOblateSpheroid = (a: number, c: number): number => {
  if (!Number.isFinite(a))
    throw new TypeError(`a must be finite. Received: ${a}`);

  if (!Number.isFinite(c))
    throw new TypeError(`c must be finite. Received: ${c}`);

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (c <= 0) throw new RangeError(`c must be > 0. Received: ${c}`);

  return (a - c) / a;
};
