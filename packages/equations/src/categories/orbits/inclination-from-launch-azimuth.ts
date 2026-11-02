import type { Radians } from '@interstellar-tools/types';

/**
 * Compute the **inclination** of the orbit reached by launching from a latitude on an azimuth.
 *
 * $$
 * \cos i = \cos\varphi \,\sin\beta
 * $$
 *
 * Where:
 * - $ i $ is the orbit's inclination (rad)
 * - $ \varphi $ is the geocentric latitude of the point (rad)
 * - $ \beta $ is the inertial azimuth or heading at that point, clockwise from north (rad)
 *
 * **Units**
 * - Inputs: `lat` and `azimuth` in **radians**.
 * - Output: $ i $ in **radians**, in [0, π].
 *
 * ::: info Notes
 *
 * - `lat` is the **geocentric** latitude. Published latitudes are usually geodetic, which on Earth differ by up to 0.19°, and the inclination by about as much. Convert first with {@link geodeticToBodyFixed}, at the point's height.
 * - The relation holds at every point of the ground track, not only at launch: an orbit never reaches a latitude higher than its inclination.
 * - Launching due east ($ \beta = 90° $) gives the lowest inclination a site can reach without a plane change: its own latitude.
 * - Azimuths between 180° and 360° head west, into retrograde orbits ($ i > 90° $).
 * - `azimuth` is inertial. A rocket's azimuth over the ground differs, because the pad is moving east; see {@link rotatingLaunchAzimuth}.
 *
 * :::
 *
 * ::: practice Apollo 11, entering Earth orbit
 *
 * **32.521°**
 *
 * _At orbit insertion: 32.502° N geocentric (32.672° geodetic, 191.1 km up), heading 88.848°_
 *
 * The flown parking orbit was inclined 32.521°. Apollo 11 entered orbit near the northernmost point of its track, heading almost due east. With the published geodetic latitude, 32.672°, the result would be 32.69°.
 *
 * ```ts
 * const [x, y, z] = geodeticToBodyFixed(toRad(32.672), toRad(-52.694), 191_100, 6_378_137, 0.00669437999014);
 * const lat = Math.atan2(z, Math.hypot(x, y)); // 32.502°
 * inclinationFromLaunchAzimuth(lat, toRad(88.848)); // ≈ 32.521°
 * ```
 *
 * :::
 *
 * @param lat - Geocentric latitude $ \varphi $ in **radians** (finite, in [-π/2, π/2]).
 * @param azimuth - Inertial azimuth $ \beta $ in **radians**, clockwise from north (finite).
 * @returns Inclination $ i $ in **radians**, in [0, π].
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `lat` is outside [-π/2, π/2].
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
 *
 * // Baikonur (45.97° N), launching north-east at 63°
 * const i = inclinationFromLaunchAzimuth(toRad(45.97), toRad(63));
 * // i ≈ 51.7°
 * ```
 *
 * @see {@link launchAzimuthForInclination}
 * @see https://en.wikipedia.org/wiki/Launch_azimuth Launch azimuth
 */
export const inclinationFromLaunchAzimuth = (
  lat: Radians,
  azimuth: Radians
): Radians => {
  for (const [name, v] of [
    ['lat', lat],
    ['azimuth', azimuth]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (Math.abs(lat) > Math.PI / 2)
    throw new RangeError(`lat must be in [-π/2, π/2]. Received: ${lat}`);

  // Clamp against rounding just outside [-1, 1]
  const cosI = Math.min(1, Math.max(-1, Math.cos(lat) * Math.sin(azimuth)));

  return Math.acos(cosI) as Radians;
};
