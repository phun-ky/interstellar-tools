import type { Radians } from '@interstellar-tools/types';

/**
 * Compute the **eastward speed** of a point on a rotating body's surface, at a latitude.
 *
 * $$
 * v_\text{rot} = \omega\, R \cos\varphi
 * $$
 *
 * Where:
 * - $ \omega $ is the body's rotation rate (rad/s), sidereal, not solar
 * - $ R $ is the distance from the rotation axis's centre to the point (m)
 * - $ \varphi $ is the latitude (rad)
 *
 * **Units**
 * - Inputs: `lat` in **radians**, `R` in **m**, `omega` in **rad/s**.
 * - Output: $ v_\text{rot} $ in **m/s**, positive eastward.
 *
 * ::: info Notes
 *
 * - A rocket launched eastward gets this speed for free; one launched westward has to cancel it first.
 * - Earth's sidereal rotation rate is about 7.2921150 × 10⁻⁵ rad/s.
 * - A body that rotates backwards (Venus, Uranus) has a negative `omega`, and the result is negative: westward.
 * - Uses a spherical body. For an oblate one, pass the distance from the axis's centre at that latitude as `R`.
 *
 * :::
 *
 * ::: practice Apollo 11, on Pad 39A
 *
 * **408 m/s**
 *
 * _Eastward speed at 28.61° N, before the engines light_
 *
 * At the equator it's 465 m/s, which is one reason Europe launches from Kourou, at 5.2° N (463 m/s).
 *
 * ```ts
 * surfaceRotationSpeed(toRad(28.608), 6_378_137, 7.292115e-5); // ≈ 408.3 m/s
 * ```
 *
 * :::
 *
 * @param lat - Latitude $ \varphi $ in **radians** (finite, in [-π/2, π/2]).
 * @param R - Radius $ R $ in **m** (finite, > 0).
 * @param omega - Rotation rate $ \omega $ in **rad/s** (finite).
 * @returns Eastward surface speed $ v_\text{rot} $ in **m/s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `lat` is outside [-π/2, π/2] or `R <= 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // Earth's equator
 * surfaceRotationSpeed(0 as Radians, 6_378_137, 7.292115e-5); // ≈ 465.1 m/s
 * ```
 *
 * @see {@link inclinationFromLaunchAzimuth}
 * @see {@link rotatingLaunchAzimuth}
 */
export const surfaceRotationSpeed = (
  lat: Radians,
  R: number,
  omega: number
): number => {
  for (const [name, v] of [
    ['lat', lat],
    ['R', R],
    ['omega', omega]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (Math.abs(lat) > Math.PI / 2)
    throw new RangeError(`lat must be in [-π/2, π/2]. Received: ${lat}`);

  if (R <= 0) throw new RangeError(`R must be > 0. Received: ${R}`);

  return omega * R * Math.cos(lat);
};
