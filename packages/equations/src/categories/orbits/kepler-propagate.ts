import type {
  StateVectorInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { cross, dot, norm } from '../helpers/misc.js';
import { stumpffC, stumpffS } from '../helpers/stumpff.js';

/**
 * Propagate a **two-body state vector** by a time `dt`, on any conic: ellipse, parabola or hyperbola.
 *
 * Uses the **universal-variable** formulation. With $ r_0 = |\mathbf r_0| $,
 * $ v_{r0} = \mathbf r_0 \cdot \mathbf v_0 / r_0 $ and $ \alpha = 2/r_0 - v_0^2/\mu $ (that is, $ 1/a $),
 * it solves the universal Kepler equation for $ \chi $, with $ z = \alpha\chi^2 $:
 *
 * $$
 * \frac{r_0 v_{r0}}{\sqrt\mu}\,\chi^2 C(z) + (1 - \alpha r_0)\,\chi^3 S(z) + r_0\chi = \sqrt\mu\,\Delta t
 * $$
 *
 * then applies the Lagrange coefficients:
 *
 * $$
 * f = 1 - \frac{\chi^2}{r_0}C, \quad g = \Delta t - \frac{\chi^3}{\sqrt\mu}S, \quad
 * \dot f = \frac{\sqrt\mu}{r r_0}\left(\alpha\chi^3 S - \chi\right), \quad
 * \dot g = 1 - \frac{\chi^2}{r}C
 * $$
 *
 * $$
 * \mathbf r = f\,\mathbf r_0 + g\,\mathbf v_0, \quad \mathbf v = \dot f\,\mathbf r_0 + \dot g\,\mathbf v_0
 * $$
 *
 * where $ C $ and $ S $ are the Stumpff functions, {@link stumpffC} and {@link stumpffS}.
 *
 * **Units**
 * - Inputs: `r0` in **m**, `v0` in **m/s**, `dt` in **s**, `mu` in **m³/s²**.
 * - Output: `r` in **m**, `v` in **m/s**.
 *
 * ::: info Notes
 *
 * - One formula covers every conic: a parabola is just $ \alpha = 0 $, with no special case.
 * - `dt` may be negative, to propagate backwards.
 * - On an ellipse, whole periods are taken off `dt` first: they change nothing, and a large $ \chi $ costs digits in $ C $ and $ S $.
 * - The left side grows with $ \chi $ at the rate $ r \ge r_p $, the periapsis radius, so there's exactly one root, between 0 and $ \sqrt\mu\,\Delta t / r_p $. Newton's method finds it, falling back to bisection when a step leaves that bracket or slows down.
 * - Two-body motion only: no perturbations, no collision with the central body.
 *
 * :::
 *
 * @param r0 - Position vector in **m** (finite components, not zero).
 * @param v0 - Velocity vector in **m/s** (finite components).
 * @param dt - Time to propagate by, in **s** (finite; negative goes backwards).
 * @param mu - Gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @returns The position `r` in **m** and velocity `v` in **m/s** at `dt`.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `mu <= 0`, `r0` is zero, the motion is straight up or down (no angular momentum), or `dt` is so long the solution overflows (far out on a hyperbola).
 * @group Orbits
 *
 * @example
 * ```ts
 * // Curtis, Orbital Mechanics for Engineering Students, Example 3.7: one hour on
 * const { r, v } = keplerPropagate(
 *   [7000e3, -12_124e3, 0],
 *   [2667.9, 4621.0, 0],
 *   3600,
 *   398_600e9
 * );
 * // r ≈ [-3297.8, 7413.4, 0] km, v ≈ [-8.2976, -0.96404, 0] km/s
 * ```
 *
 * @see {@link stumpffC}
 * @see {@link stumpffS}
 * @see {@link elementsToState}
 * @see https://en.wikipedia.org/wiki/Universal_variable_formulation Universal variable formulation
 */
export const keplerPropagate = (
  r0: Vector3DTupleType,
  v0: Vector3DTupleType,
  dt: number,
  mu: number
): StateVectorInterface => {
  for (const [name, vector] of [
    ['r0', r0],
    ['v0', v0]
  ] as const) {
    for (const x of vector)
      if (!Number.isFinite(x))
        throw new TypeError(
          `${name} must have finite components. Received: ${x}`
        );
  }

  for (const [name, x] of [
    ['dt', dt],
    ['mu', mu]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (mu <= 0) throw new RangeError(`mu must be > 0. Received: ${mu}`);

  const rn = norm(r0);
  const vn = norm(v0);

  if (rn === 0) throw new RangeError('r0 must not be the zero vector.');

  const hn = norm(cross(r0, v0));

  if (hn <= 1e-12 * rn * vn || hn === 0)
    throw new RangeError(
      'The motion is straight up or down (no angular momentum), so the two-body trajectory hits the centre.'
    );

  const sqrtMu = Math.sqrt(mu);
  const alpha = 2 / rn - (vn * vn) / mu;
  // Whole periods change nothing, but a large χ costs digits in C and S
  const t = alpha > 0 ? dt % ((2 * Math.PI) / (sqrtMu * alpha ** 1.5)) : dt;

  if (t === 0) return { r: [...r0], v: [...v0] };

  const sigma = dot(r0, v0) / sqrtMu;
  const kepler = (x: number) => {
    const z = alpha * x * x;

    // Overflowed: the caller treats NaN as past the root
    if (!Number.isFinite(z)) return { F: Number.NaN, r: 0, C: 0, S: 0 };

    const C = stumpffC(z);
    const S = stumpffS(z);

    return {
      F:
        sigma * x * x * C + (1 - alpha * rn) * x ** 3 * S + rn * x - sqrtMu * t,
      // dF/dχ, which is also the radius
      r: sigma * x * (1 - z * S) + (1 - alpha * rn) * x * x * C + rn,
      C,
      S
    };
  };
  const tooLong = new RangeError(
    `dt=${dt} is too long to solve accurately on this trajectory.`
  );
  // F = √μ (t(χ) − t) with dF/dχ = r ≥ rp, so its root lies between 0 and
  // √μ t / rp, on the side of t's sign
  const p = (hn * hn) / mu;
  const rp = p / (1 + Math.sqrt(Math.max(0, 1 - alpha * p)));
  const s = Math.sign(t);

  let lo = 0;
  let hi = (sqrtMu * t) / rp;

  if (!Number.isFinite(hi)) throw tooLong;

  let x = hi / 2;
  let step = hi;
  // Overflow only happens past the root, where F has t's sign, so it counts as
  // the high side. If the high side never gets a finite F, the root itself
  // overflows
  let hiOverflows = false;

  // Bisection at least halves the bracket every other step, so this always ends
  for (;;) {
    const { F, r } = kepler(x);

    if (F === 0) break;

    if (s * F < 0) lo = x;
    else {
      hi = x;
      hiOverflows = !Number.isFinite(F);
    }

    let next = x - F / r;

    // Bisect when Newton leaves the bracket, or crawls: far out on a
    // hyperbola F grows exponentially and Newton moves only ~1/√−α a step
    if (
      !((next - lo) * (next - hi) < 0) ||
      Math.abs(2 * F) > Math.abs(step * r)
    )
      next = (lo + hi) / 2;

    step = next - x;
    x = next;

    if (Math.abs(step) <= 1e-15 * Math.abs(x)) break;
  }

  const { C, S } = kepler(x);
  const f = 1 - ((x * x) / rn) * C;
  const g = t - (x ** 3 * S) / sqrtMu;
  const combine = (a: number, b: number): Vector3DTupleType => [
    a * r0[0] + b * v0[0],
    a * r0[1] + b * v0[1],
    a * r0[2] + b * v0[2]
  ];
  const r = combine(f, g);
  const rNew = norm(r);
  const fDot = (sqrtMu / (rNew * rn)) * (alpha * x ** 3 * S - x);
  const gDot = 1 - ((x * x) / rNew) * C;
  const v = combine(fDot, gDot);

  // A root past overflow, or a state too far out for a double
  if (hiOverflows || ![...r, ...v].every(Number.isFinite)) throw tooLong;

  return { r, v };
};
