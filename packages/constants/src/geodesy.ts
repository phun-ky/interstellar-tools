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

// EGM2008's fully normalised zonal coefficients C̄(n,0), tide-free, for n = 2
// to 6, from the model's coefficient file
const C_BAR = [
  -0.484165143790815e-3, 0.957161207093473e-6, 0.539965866638991e-6,
  0.686702913736681e-7, -0.149953927978527e-6
];

/**
 * **Earth's gravity field** from EGM2008, the Earth Gravitational Model of
 * the US National Geospatial-Intelligence Agency, to the sixth zonal
 * harmonic: what a numerical propagator needs beyond a point mass.
 *
 * $$
 * J_n = -\sqrt{2n + 1}\;\bar C_{n,0}
 * $$
 *
 * Where:
 * - $ \bar C_{n,0} $ are the model's fully normalised zonal coefficients, tide-free
 * - $ J_n $ are the unnormalised zonal harmonics, as `zonalHarmonicsAcceleration` in `@interstellar-tools/equations` takes them
 *
 * ::: info Notes
 *
 * - `J` holds $ J_2 $ to $ J_6 $, in order. $ J_2 $, the equatorial bulge,
 *   is a thousand times the others: it turns orbit planes and perigees.
 * - Use `mu` and `radius` with these $ J_n $: they were fitted together. The
 *   radius is EGM2008's reference radius, 0.7 m less than WGS 84's.
 * - Only the zonal terms, which don't vary with longitude. The full model
 *   goes to degree 2190, for geodesy.
 *
 * :::
 *
 * @see https://icgem.gfz-potsdam.de/tom_longtime ICGEM, where the EGM2008 coefficients are served
 * @see https://marees.obspm.fr/content/chapter6/icc6.pdf IERS Conventions (2010), chapter 6, on EGM2008's GM and radius
 *
 * @example
 * ```ts
 * import { zonalHarmonicsAcceleration } from '@interstellar-tools/equations';
 *
 * zonalHarmonicsAcceleration(r, EGM2008.mu, EGM2008.radius, EGM2008.J);
 * ```
 */
export const EGM2008: Readonly<{
  /** Earth's gravitational parameter $\mu$ in m³/s², with the atmosphere. */
  mu: number;
  /** The reference radius of the coefficients in m. */
  radius: number;
  /** The zonal harmonics $J_2$ to $J_6$, dimensionless. */
  J: readonly number[];
}> = Object.freeze({
  mu: 3.986004415e14,
  radius: 6_378_136.3,
  J: Object.freeze(C_BAR.map((c, k) => -Math.sqrt(2 * (k + 2) + 1) * c))
});
