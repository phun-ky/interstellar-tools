import type { Radians } from '@interstellar-tools/types';

/**
 * The eccentricity of a **frozen orbit**: the small eccentricity at which the
 * pear shape of the planet, J3, and its bulge, J2, balance, so the perigee
 * stays put at 90° and the orbit's height over each latitude stays the same,
 * orbit after orbit. Earth-observation missions fly them for steady imaging
 * heights.
 *
 * $$
 * e_f \approx -\frac{J_3}{2 J_2}\,\frac{R}{a}\,\sin i
 * $$
 *
 * with the argument of perigee frozen at $ \omega = 90^\circ $.
 *
 * Where:
 * - $ J_2 $, $ J_3 $ are the planet's second and third zonal harmonics: 1.08263 × 10⁻³ and −2.53266 × 10⁻⁶ for Earth
 * - $ R $ is the planet's equatorial radius, and $ a $ the semi-major axis (same unit)
 * - $ i $ is the inclination (rad)
 *
 * **Units**
 * - Inputs: `Re` and `a` in the same unit, `i` in **radians**.
 * - Output: $ e_f $, dimensionless; negative means the perigee freezes at 270° instead, with eccentricity $ |e_f| $.
 *
 * ::: info Notes
 *
 * - Earth's J3 is negative, so its frozen orbits have their perigee in the
 *   north, at 90°: about 0.001 for low orbits.
 * - First order in J2 and J3, away from the critical inclinations 63.4° and
 *   116.6°, where the perigee doesn't drift anyway.
 *
 * :::
 *
 * @param J2 - The planet's second zonal harmonic $ J_2 $ (finite, ≠ 0).
 * @param J3 - The planet's third zonal harmonic $ J_3 $ (finite).
 * @param Re - The planet's equatorial radius $ R $ (finite, > 0).
 * @param a - Semi-major axis $ a $, in the unit of `Re` (finite, > 0).
 * @param i - Inclination $ i $ in **radians** (finite).
 * @returns The frozen eccentricity $ e_f $.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `J2` is 0, or `Re` or `a` is not > 0.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Earth, 700 km up at 98.2°
 * frozenOrbitEccentricity(1.08262668e-3, -2.53265649e-6, 6_378_137, 7_078_137, toRad(98.2));
 * // ≈ 0.00104
 * ```
 *
 * @see {@link j2ArgumentOfPerigeeRate}
 * @see {@link sunSynchronousInclination}
 */
export const frozenOrbitEccentricity = (
  J2: number,
  J3: number,
  Re: number,
  a: number,
  i: Radians
): number => {
  for (const [name, x] of [
    ['J2', J2],
    ['J3', J3],
    ['Re', Re],
    ['a', a],
    ['i', i]
  ] as const)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

  if (J2 === 0) throw new RangeError('J2 must not be 0.');

  for (const [name, x] of [
    ['Re', Re],
    ['a', a]
  ] as const)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);

  return (-J3 / (2 * J2)) * (Re / a) * Math.sin(i);
};
