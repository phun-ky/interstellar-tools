import type {
  DistanceInterface,
  VelocityInterface
} from '@interstellar-tools/types';

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

/**
 * The **Sun's velocity around the Milky Way's centre**, in km/s, in the
 * `'galactocentric'` frame: $(12.9, 251.51, 8.56)$.
 *
 * ::: info Notes
 *
 * - `x` points towards the centre, `y` the way the Milky Way turns, and `z` to
 *   its north pole. Most of the motion, `y`, is the Sun's orbit around the
 *   centre, about 200 million years a turn.
 * - Sagittarius A* sits still at the centre, so its motion across the sky,
 *   $\mu_l = -6.411$ and $\mu_b = -0.219$ mas/yr (Reid & Brunthaler 2020), is
 *   the Sun's, reflected. `y` and `z` are solved so that it does, at
 *   {@link SUN_GALACTOCENTRIC_DISTANCE}: about the proper motion times the
 *   distance.
 * - `x`, 12.9 km/s, is Astropy's: the Sun's motion towards the centre
 *   relative to the stars around it, 11.1 km/s (Schönrich, Binney & Dehnen
 *   2010), plus 1.9 km/s (Drimmel & Poggio 2018).
 * - Astropy's `Galactocentric` frame uses $(12.9, 245.6, 7.78)$ by default,
 *   from the same recipe with its 8.122 kpc and Reid & Brunthaler's 2004
 *   proper motion. With 8275.9 pc, that would make Sagittarius A* drift by
 *   about 6 km/s.
 *
 * :::
 *
 * @see https://arxiv.org/abs/2001.04386 Reid & Brunthaler 2020, ApJ 892, 39
 *
 * @example
 * ```ts
 * console.log(SUN_GALACTOCENTRIC_VELOCITY.y); // 251.51 km/s
 * ```
 * @group Galactic
 */
export const SUN_GALACTOCENTRIC_VELOCITY: Readonly<VelocityInterface> =
  Object.freeze({
    frame: 'galactocentric' as const,
    x: 12.9,
    y: 251.51,
    z: 8.56
  });
