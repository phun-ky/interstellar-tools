/**
 * **Vis-viva (orbital speed)** - compute speed magnitude ($ v $) from ($ r $), ($ a $), and ($ \mu $).
 *
 * **Definition**
 *
 * $$
 * v = \sqrt{\mu\!\left(\frac{2}{r}-\frac{1}{a}\right)}
 * $$
 *
 * - ($ r $): current distance from the focus (m)
 * - ($ a $): semi-major axis (m). Elliptic ($ a>0 $), parabolic ($ a\to\infty $), hyperbolic ($ a<0 $)
 * - ($ \mu $): gravitational parameter (m³/s²)
 *
 * **Units**
 * - Inputs: ($ r $) in **m**, ($ a $) in **m**, ($ \mu $) in **m³/s²**.
 * - Output: ($ v $) in **m/s**.
 *
 * ::: tip
 *
 * - For circular orbits (($ a=r $)): ($ v=\sqrt{\mu/r} $).
 * - For parabolic trajectories, pass `a = Infinity` (so ($ 1/a=0 $)): ($ v=\sqrt{2\mu/r} $).
 *
 * :::
 *
 * @param {number} r  Radius ($ r $) (m), distance to the attracting body.
 * @param {number} a  Semi-major axis ($ a $) (m). Use `Infinity` for parabolic, negative for hyperbolic.
 * @param {number} mu Gravitational parameter ($ \mu $) (m³/s²).
 * @returns {number} Speed magnitude ($ v $) (m/s).
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If inputs are non-finite / out of domain, or the radicand becomes negative.
 *
 * @example
 * ```ts
 * // LEO (~400 km): a ≈ r for near-circular
 * const muEarth = 3.986004418e14; // m³/s²
 * const r = 6378e3 + 400e3;       // m
 * const a = r;                    // circular
 * const v = visVivaSpeed(r, a, muEarth); // ≈ 7670 m/s
 * ```
 * @group Orbits
 */
export const visVivaSpeed = (r: number, a: number, mu: number): number => {
  if (!Number.isFinite(r) || r <= 0) {
    throw new Error('r must be a finite, positive number (m).');
  }

  if (!Number.isFinite(mu) || mu < 0) {
    throw new Error('mu must be a finite, non-negative number (m³/s²).');
  }

  if (!Number.isFinite(a)) {
    // Allow Infinity (parabolic); disallow NaN/-Infinity for clarity
    if (a === Infinity) {
      // v = sqrt(2mu/r)
      return Math.sqrt((2 * mu) / r);
    }

    throw new Error('a must be finite (or +Infinity for parabolic) in meters.');
  }

  if (a === 0) {
    throw new Error('a must be non-zero (m). Use a→∞ for parabolic.');
  }

  const invA = 1 / a; // works for a>0 (elliptic) and a<0 (hyperbolic)
  const radicand = mu * (2 / r - invA);

  // Numerical guard: tiny negative due to FP → clamp; otherwise throw
  if (radicand < 0) {
    const tol = Math.abs((1e-14 * mu) / r);

    if (radicand > -tol) return 0; // effectively zero speed

    throw new Error(
      `Invalid state: μ*(2/r - 1/a) < 0 (μ=${mu}, r=${r}, a=${a}).`
    );
  }

  return Math.sqrt(radicand);
};
