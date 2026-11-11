import type { DistanceInterface } from '@interstellar-tools/types';

/**
 * The **Sun's distance from the Milky Way's centre**, $R_0$: 8275.9 ± 8.6 pc.
 *
 * ::: info Notes
 *
 * - The GRAVITY Collaboration (2024) fitted it with the mass of Sagittarius A*,
 *   from the orbits of the S-stars. It's the same as Sagittarius A*'s
 *   `distance` in `GALAXIES`.
 * - The distances and directions in `GALAXIES` are measured from the Sun. To
 *   draw them around the Milky Way's centre, move them by $R_0$ and
 *   {@link SUN_HEIGHT_ABOVE_GALACTIC_PLANE}, as `galactocentricPosition` in
 *   `@interstellar-tools/equations` does.
 * - Astropy's `Galactocentric` frame calls it `galcen_distance`, and uses
 *   8.122 kpc (GRAVITY 2018) by default. It puts the centre at this distance
 *   towards galactic longitude and latitude 0°, the IAU's galactic centre,
 *   4.3′ (10.5 pc) from Sagittarius A*.
 *
 * :::
 *
 * @see GRAVITY Collaboration 2024, A&A 692, A242
 *
 * @example
 * ```ts
 * console.log(SUN_GALACTOCENTRIC_DISTANCE); // { value: 8275.9, unit: 'pc' }
 * ```
 * @group Galactic
 */
export const SUN_GALACTOCENTRIC_DISTANCE: Readonly<DistanceInterface> =
  Object.freeze({ value: 8275.9, unit: 'pc' as const });

/**
 * The **Sun's height above the Milky Way's plane**, $z_\odot$: 20.8 ± 0.3 pc,
 * to the galactic north.
 *
 * ::: info Notes
 *
 * - Bennett & Bovy (2019) measured it from the stars around the Sun in Gaia
 *   DR2.
 * - The galactic equator runs through the Sun and the centre, so with the Sun
 *   above the plane, the equator is tilted from the plane by
 *   $\arcsin(z_\odot / R_0)$, about 0.144°.
 * - Astropy's `Galactocentric` frame calls it `z_sun`, and uses this value by
 *   default.
 *
 * :::
 *
 * @see https://arxiv.org/abs/1809.03507 Bennett & Bovy 2019, MNRAS 482, 1417
 *
 * @example
 * ```ts
 * console.log(SUN_HEIGHT_ABOVE_GALACTIC_PLANE); // { value: 20.8, unit: 'pc' }
 * ```
 * @group Galactic
 */
export const SUN_HEIGHT_ABOVE_GALACTIC_PLANE: Readonly<DistanceInterface> =
  Object.freeze({ value: 20.8, unit: 'pc' as const });
