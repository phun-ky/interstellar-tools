import type { Vector3DTupleType } from '@interstellar-tools/types';

/**
 * The pull of a planet's **flattening and pear shape** on a satellite: the
 * acceleration from its zonal harmonics, $ J_2 $ and up, on top of the
 * central $ -\mu\mathbf r/r^3 $.
 *
 * A planet isn't a sphere. Earth bulges at the equator, $ J_2 $, and is
 * slightly pear-shaped, $ J_3 $; the higher zonals are smaller ripples from
 * pole to pole. The bulge turns a satellite's orbit plane and its perigee,
 * which is what makes sun-synchronous orbits and frozen orbits possible.
 *
 * $$
 * \mathbf a = \sum_{n \ge 2} \frac{\mu J_n}{r^2}\left(\frac{R}{r}\right)^n
 * \Big[\big((n + 1)P_n(u) + u\,P_n'(u)\big)\,\hat{\mathbf r} - P_n'(u)\,\hat{\mathbf z}\Big],
 * \qquad u = \frac{z}{r}
 * $$
 *
 * Where:
 * - $ \mathbf r $ is the position from the planet's centre, on axes with $ z $ along its rotation axis (m)
 * - $ \mu $ is the planet's gravitational parameter (m³/s²) and $ R $ the reference radius of its $ J_n $ (m)
 * - $ P_n $ is the Legendre polynomial of degree $ n $, and $ P_n' $ its derivative
 *
 * **Units**
 * - Inputs: `r` and `Re` in **m**, `mu` in **m³/s²**, `J` dimensionless.
 * - Output: the acceleration in **m/s²**, on the axes of `r`.
 *
 * ::: info Notes
 *
 * - **Only the perturbation**: add the central acceleration $ -\mu\mathbf r/r^3 $ for the full gravity.
 * - $ J_2 $ is a few thousandths of the central pull in low Earth orbit; $ J_3 $ to $ J_6 $ are each a few thousandths of $ J_2 $ or less.
 * - The $ J_n $ belong with the reference radius they were fitted with: for EGM2008, 6 378 136.3 m.
 * - Zonal harmonics only: the tesseral terms, which make gravity vary with longitude, matter for geostationary station-keeping and precise orbits, not for most satellite lifetimes.
 * - The series describes the field outside the planet; it doesn't converge inside it.
 *
 * :::
 *
 * ::: practice J₂ on the ISS
 *
 * **0.014 m/s²**
 *
 * _420 km up, over 45° latitude_
 *
 * A six-hundredth of the 8.6 m/s² of the central pull, and up to 0.025 m/s²
 * over the poles: enough to turn the ISS's orbit plane 5° a day westward.
 *
 * ```ts
 * const r = 6_798_000;
 * const at45 = [r * Math.SQRT1_2, 0, r * Math.SQRT1_2];
 * const a = zonalHarmonicsAcceleration(at45, 3.986004418e14, 6_378_136.3, [1.0826e-3]);
 *
 * Math.hypot(...a); // ≈ 0.0138 m/s²
 * ```
 *
 * :::
 *
 * @param r - Position $ \mathbf r $ in **m**, from the planet's centre, with $ z $ along its rotation axis (finite, not zero).
 * @param mu - Gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @param Re - Reference radius $ R $ in **m** of the coefficients (finite, > 0).
 * @param J - The zonal coefficients $ J_2, J_3, \ldots $ in order, from $ J_2 $ (finite numbers).
 * @returns The acceleration in **m/s²**, without the central term.
 * @throws {TypeError} If `r` is not three finite numbers, or a number in `mu`, `Re` or `J` is not finite.
 * @throws {RangeError} If `r` is zero, or `mu` or `Re` is not > 0.
 * @group Gravity
 *
 * @example
 * ```ts
 * // EGM2008's J2 to J6, at a satellite over the equator
 * zonalHarmonicsAcceleration([7_000_000, 0, 0], 3.986004415e14, 6_378_136.3, [
 *   1.0826e-3, -2.5324e-6, -1.6199e-6, -2.2775e-7, 5.4067e-7
 * ]); // ≈ [-0.0110, 0, 0]: toward the planet, from the bulge's extra mass under it
 * ```
 *
 * @see {@link j2NodalPrecessionRate}
 * @see {@link thirdBodyAcceleration}
 * @see Vallado, _Fundamentals of Astrodynamics and Applications_, 4th ed. (2013), on the zonal harmonics
 */
export const zonalHarmonicsAcceleration = (
  r: Vector3DTupleType,
  mu: number,
  Re: number,
  J: readonly number[]
): Vector3DTupleType => {
  if (!Array.isArray(r) || r.length !== 3 || !r.every(Number.isFinite))
    throw new TypeError(
      `r must be three finite numbers. Received: ${String(r)}`
    );

  if (!Array.isArray(J))
    throw new TypeError(`J must be an array of numbers. Received: ${J}`);

  for (const [name, x] of [
    ['mu', mu],
    ['Re', Re],
    ...J.map((x, k) => [`J[${k}]`, x] as const)
  ] as const)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

  for (const [name, x] of [
    ['mu', mu],
    ['Re', Re]
  ] as const)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);

  const [x, y, z] = r;
  const distance = Math.hypot(x, y, z);

  if (distance === 0) throw new RangeError('r must not be zero.');

  const u = z / distance;

  // Legendre polynomials and their derivatives, from degree 0 and 1 up
  let previous = 1;
  let current = u;
  let previousSlope = 0;
  let currentSlope = 1;
  let radial = 0;
  let axial = 0;

  for (let n = 1; n <= J.length; n++) {
    const next = ((2 * n + 1) * u * current - n * previous) / (n + 1);
    const nextSlope = previousSlope + (2 * n + 1) * current;
    // Degree n + 1, from J[n - 1]
    const scale =
      ((mu * J[n - 1]!) / distance ** 2) * (Re / distance) ** (n + 1);

    radial += scale * ((n + 2) * next + u * nextSlope);
    axial -= scale * nextSlope;
    [previous, current] = [current, next];
    [previousSlope, currentSlope] = [currentSlope, nextSlope];
  }

  return [
    (radial * x) / distance,
    (radial * y) / distance,
    (radial * z) / distance + axial
  ];
};
