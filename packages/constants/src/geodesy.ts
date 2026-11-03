import type { EllipsoidInterface } from '@interstellar-tools/types';

/**
 * The **WGS 84** reference ellipsoid: Earth's shape as GPS uses it.
 *
 * Defined by its equatorial radius and flattening; the polar radius follows:
 *
 * $$
 * a = 6\,378\,137\ \text{m}, \qquad \frac{1}{f} = 298.257223563, \qquad b = a(1 - f) \approx 6\,356\,752.314\ \text{m}
 * $$
 *
 * ::: info Notes
 *
 * - The latitudes and heights of GPS receivers and most maps are on this ellipsoid.
 * - The IAU's values for Earth (in `PLANETS`) agree to well under a metre, but come from a different fit; use WGS 84 for GPS coordinates.
 * - Get $ e^2 $ for the geodesy functions with `eccentricitySquaredOblateSpheroid` in `@interstellar-tools/equations`, or as $ f(2 - f) $.
 *
 * :::
 *
 * @see https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84 NGA: World Geodetic System 1984
 *
 * @example
 * ```ts
 * import { geodeticToBodyFixed } from '@interstellar-tools/equations';
 *
 * const f = 1 / WGS84.inverseFlattening;
 * geodeticToBodyFixed(lat, lon, 0, WGS84.equatorialRadius.value, f * (2 - f));
 * ```
 */
export const WGS84: Readonly<
  EllipsoidInterface & {
    /** Inverse flattening $1/f$, as defined. */
    inverseFlattening: number;
  }
> = Object.freeze({
  equatorialRadius: Object.freeze({ value: 6_378_137, unit: 'm' as const }),
  polarRadius: Object.freeze({
    value: 6_378_137 * (1 - 1 / 298.257223563),
    unit: 'm' as const
  }),
  inverseFlattening: 298.257223563
});
