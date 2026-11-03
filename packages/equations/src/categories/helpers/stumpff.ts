// Below this |z|, the closed forms lose digits to cancellation; the series
// (to z^5) is exact to double precision there
const SERIES_LIMIT = 0.1;
const assertZ = (z: number) => {
  if (!Number.isFinite(z))
    throw new TypeError(`z must be a finite number. Received: ${z}`);
};

/**
 * Compute the **Stumpff function** $ C(z) $, used by the universal-variable formulation of the two-body problem.
 *
 * $$
 * C(z) =
 * \begin{cases}
 * \dfrac{1 - \cos\sqrt z}{z} & z > 0 \\[1ex]
 * \dfrac{\cosh\sqrt{-z} - 1}{-z} & z < 0 \\[1ex]
 * \tfrac12 & z = 0
 * \end{cases}
 * \qquad
 * = \sum_{k=0}^{\infty} \frac{(-z)^k}{(2k + 2)!}
 * $$
 *
 * Where $ z = \alpha\chi^2 $ is the universal anomaly squared, scaled by $ \alpha = 1/a $: positive on an ellipse, zero on a parabola and negative on a hyperbola.
 *
 * ::: info Notes
 *
 * - One formula for all three kinds of orbit: the circular functions on an ellipse, the hyperbolic ones on a hyperbola, and the series that joins them at $ z = 0 $.
 * - Near $ z = 0 $ (for $ |z| < 0.1 $) the series is used, since $ 1 - \cos\sqrt z $ loses digits to cancellation there.
 * - $ C(4\pi^2) = 0 $: one whole revolution. {@link solveLambert} only searches below it.
 *
 * :::
 *
 * @param z - The argument $ z $ (finite, dimensionless).
 * @returns $ C(z) $, positive everywhere but at $ z = (2\pi k)^2 $ for whole $ k \ge 1 $.
 * @throws {TypeError} If `z` is not a finite number.
 * @group Helpers
 *
 * @example
 * ```ts
 * stumpffC(0); // 0.5
 * stumpffC(Math.PI ** 2); // 2 / π² ≈ 0.2026
 * ```
 *
 * @see {@link stumpffS}
 * @see {@link solveLambert}
 * @see https://en.wikipedia.org/wiki/Universal_variable_formulation Universal variable formulation
 */
export const stumpffC = (z: number): number => {
  assertZ(z);

  if (Math.abs(z) < SERIES_LIMIT)
    return (
      1 / 2 -
      z / 24 +
      z ** 2 / 720 -
      z ** 3 / 40_320 +
      z ** 4 / 3_628_800 -
      z ** 5 / 479_001_600
    );

  if (z > 0) return (1 - Math.cos(Math.sqrt(z))) / z;

  return (Math.cosh(Math.sqrt(-z)) - 1) / -z;
};

/**
 * Compute the **Stumpff function** $ S(z) $, used by the universal-variable formulation of the two-body problem.
 *
 * $$
 * S(z) =
 * \begin{cases}
 * \dfrac{\sqrt z - \sin\sqrt z}{\sqrt{z}^{\,3}} & z > 0 \\[1ex]
 * \dfrac{\sinh\sqrt{-z} - \sqrt{-z}}{\sqrt{-z}^{\,3}} & z < 0 \\[1ex]
 * \tfrac16 & z = 0
 * \end{cases}
 * \qquad
 * = \sum_{k=0}^{\infty} \frac{(-z)^k}{(2k + 3)!}
 * $$
 *
 * Where $ z = \alpha\chi^2 $ is the universal anomaly squared, scaled by $ \alpha = 1/a $: positive on an ellipse, zero on a parabola and negative on a hyperbola.
 *
 * ::: info Notes
 *
 * - Near $ z = 0 $ (for $ |z| < 0.1 $) the series is used, since $ \sqrt z - \sin\sqrt z $ loses digits to cancellation there.
 * - $ S $ decreases as $ z $ grows, and stays positive.
 *
 * :::
 *
 * @param z - The argument $ z $ (finite, dimensionless).
 * @returns $ S(z) $.
 * @throws {TypeError} If `z` is not a finite number.
 * @group Helpers
 *
 * @example
 * ```ts
 * stumpffS(0); // 1/6
 * stumpffS(Math.PI ** 2); // 1 / π² ≈ 0.1013
 * ```
 *
 * @see {@link stumpffC}
 * @see {@link solveLambert}
 * @see https://en.wikipedia.org/wiki/Universal_variable_formulation Universal variable formulation
 */
export const stumpffS = (z: number): number => {
  assertZ(z);

  if (Math.abs(z) < SERIES_LIMIT)
    return (
      1 / 6 -
      z / 120 +
      z ** 2 / 5040 -
      z ** 3 / 362_880 +
      z ** 4 / 39_916_800 -
      z ** 5 / 6_227_020_800
    );

  if (z > 0) {
    const s = Math.sqrt(z);

    return (s - Math.sin(s)) / s ** 3;
  }

  const s = Math.sqrt(-z);

  return (Math.sinh(s) - s) / s ** 3;
};
