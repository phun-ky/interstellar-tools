import type { Vector3DTupleType } from '@interstellar-tools/types';

import { cross, dot, norm } from '../helpers/misc.js';
import { stumpffC, stumpffS } from '../helpers/stumpff.js';

export interface SolveLambertOptionsInterface {
  /**
   * Fly the transfer counterclockwise seen from $ +z $ (`true`, the default), or clockwise (`false`).
   */
  prograde?: boolean;
}

export interface LambertSolutionInterface {
  /** Velocity at `r1`, at the start of the transfer, in m/s. */
  v1: Vector3DTupleType;
  /** Velocity at `r2`, at the end of the transfer, in m/s. */
  v2: Vector3DTupleType;
}

const FULL_TURN = 4 * Math.PI ** 2;

/**
 * Solve **Lambert's problem**: find the orbit that goes from one position to another in a given time.
 *
 * In universal variables, solve for $ z $
 *
 * $$
 * \sqrt\mu\,\Delta t = \left(\frac{y(z)}{C(z)}\right)^{3/2} S(z) + A\sqrt{y(z)},
 * \qquad
 * y(z) = r_1 + r_2 + A\,\frac{z S(z) - 1}{\sqrt{C(z)}},
 * \qquad
 * A = \sin\Delta\theta\,\sqrt{\frac{r_1 r_2}{1 - \cos\Delta\theta}}
 * $$
 *
 * and recover the velocities from the Lagrange coefficients
 *
 * $$
 * f = 1 - \frac{y}{r_1}, \quad g = A\sqrt{\frac{y}{\mu}}, \quad \dot g = 1 - \frac{y}{r_2},
 * \qquad
 * \mathbf v_1 = \frac{\mathbf r_2 - f\,\mathbf r_1}{g}, \quad
 * \mathbf v_2 = \frac{\dot g\,\mathbf r_2 - \mathbf r_1}{g}
 * $$
 *
 * Where:
 * - $ \mathbf r_1 $, $ \mathbf r_2 $ are the two positions and $ r_1 $, $ r_2 $ their lengths (m)
 * - $ \Delta\theta $ is the angle swept from $ \mathbf r_1 $ to $ \mathbf r_2 $ (rad)
 * - $ C(z) $ and $ S(z) $ are the Stumpff functions, {@link stumpffC} and {@link stumpffS}
 * - $ \mu $ is the gravitational parameter (m³/s²)
 *
 * **Units**
 * - Inputs: `r1` and `r2` in **m**, `dt` in **s**, `mu` in **m³/s²**.
 * - Output: `v1` and `v2` in **m/s**.
 *
 * ::: info Notes
 *
 * - One formula for ellipses, parabolas and hyperbolas: $ z > 0 $ is an ellipse, $ z < 0 $ a hyperbola. The time of flight grows steadily with $ z $, so this solves for $ z $ by bisection, which can't diverge, below $ z = 4\pi^2 $: single-revolution transfers only.
 * - Two positions allow two transfers, the short way round and the long way. `prograde` picks the one that goes counterclockwise seen from $ +z $, so $ \Delta\theta $ is under 180° when $ (\mathbf r_1 \times \mathbf r_2)_z \ge 0 $; `prograde: false` picks the clockwise one.
 * - At 0° and 180° the transfer plane isn't defined by the two positions, and the function throws. Near 180° the solution exists but is sensitive to small changes in the positions.
 * - For a transfer between two circular orbits, the velocity changes are `v1` minus the speed of the first orbit and the speed of the second minus `v2`, as vectors.
 *
 * :::
 *
 * ::: practice Apollo 11, aiming for home
 *
 * **11 032 m/s at −6.48°**
 *
 * _At entry interface, 44.8 h and 154.15° round Earth from the edge of the Moon's sphere of influence, 322 000 km out_
 *
 * Chapter V of the Apollo 11 tutorial runs Columbia's orbit back from entry interface to the edge of the Moon's sphere of influence: 44.8 h of falling. Ask Lambert's question for those two positions and that time, and it finds the same orbit: it arrives at the flown entry speed and angle, and leaves the edge at 1 239 m/s. Planners asked the question the other way round, to target the midcourse corrections.
 *
 * ```ts
 * const swept = toRad(154.15); // from the edge to entry interface
 * const edge: Vector3DTupleType = [322e6 * Math.cos(swept), -322e6 * Math.sin(swept), 0];
 * const entry: Vector3DTupleType = [6_500_086, 0, 0]; // 121.92 km up
 * const { v2 } = solveLambert(edge, entry, 161_219, 3.986004418e14);
 * Math.hypot(...v2); // ≈ 11 032 m/s
 * toDeg(Math.asin(v2[0] / Math.hypot(...v2))); // ≈ −6.48°
 * ```
 *
 * :::
 *
 * @param r1 - Position $ \mathbf r_1 $ at the start, in **m** (finite components, not zero).
 * @param r2 - Position $ \mathbf r_2 $ at the end, in **m** (finite components, not zero).
 * @param dt - Time of flight $ \Delta t $ in **s** (finite, > 0).
 * @param mu - Gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @param options - `prograde` (default `true`): the direction of the transfer. Room for more, such as multi-revolution transfers, later.
 * @returns The velocities `v1` at `r1` and `v2` at `r2`, in **m/s**.
 * @throws {TypeError} If any input is not finite.
 * @throws {RangeError} If `dt <= 0`, `mu <= 0`, a position is zero, the positions are 0° or 180° apart, or no transfer was found.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // Curtis, Example 5.2: one hour between two positions around Earth
 * const { v1, v2 } = solveLambert(
 *   [5_000_000, 10_000_000, 2_100_000],
 *   [-14_600_000, 2_500_000, 7_000_000],
 *   3600,
 *   3.986e14
 * );
 * // v1 ≈ [-5 992, 1 925, 3 246] m/s, v2 ≈ [-3 312, -4 197, -385] m/s
 * ```
 *
 * @see {@link stumpffC}
 * @see {@link stumpffS}
 * @see {@link hohmannTransfer}
 * @see https://en.wikipedia.org/wiki/Lambert%27s_problem Lambert's problem
 */
export const solveLambert = (
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  dt: number,
  mu: number,
  { prograde = true }: SolveLambertOptionsInterface = {}
): LambertSolutionInterface => {
  for (const [name, r] of [
    ['r1', r1],
    ['r2', r2]
  ] as const)
    for (const x of r)
      if (!Number.isFinite(x))
        throw new TypeError(
          `${name} must have finite components. Received: ${x}`
        );

  for (const [name, x] of [
    ['dt', dt],
    ['mu', mu]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);
  }

  const r1n = norm(r1);
  const r2n = norm(r2);

  if (r1n === 0 || r2n === 0)
    throw new RangeError('r1 and r2 must not be zero.');

  const c = cross(r1, r2);

  if (norm(c) <= 1e-12 * r1n * r2n)
    throw new RangeError(
      'r1 and r2 are 0° or 180° apart, so the transfer plane is undefined.'
    );

  const cosTheta = Math.min(1, Math.max(-1, dot(r1, r2) / (r1n * r2n)));
  const shortWay = prograde === c[2] >= 0;
  const theta = shortWay
    ? Math.acos(cosTheta)
    : 2 * Math.PI - Math.acos(cosTheta);
  const A = Math.sin(theta) * Math.sqrt((r1n * r2n) / (1 - cosTheta));
  const y = (z: number) =>
    r1n + r2n + (A * (z * stumpffS(z) - 1)) / Math.sqrt(stumpffC(z));
  // √μ times the time of flight; −∞ where y < 0 (no orbit), +∞ from one
  // revolution on
  const flight = (z: number) => {
    if (z >= FULL_TURN) return Infinity;

    const yz = y(z);

    if (yz < 0) return -Infinity;

    return (yz / stumpffC(z)) ** 1.5 * stumpffS(z) + A * Math.sqrt(yz);
  };
  const target = Math.sqrt(mu) * dt;

  // Bracket the root: hyperbolas (z < 0) for fast transfers. Below about
  // −5 × 10⁵, cosh(√−z) overflows
  let lo = -1;
  let hi = FULL_TURN;

  while (flight(lo) > target) {
    if (lo < -1e5)
      throw new RangeError(
        `No transfer found: dt=${dt} is too short for these positions.`
      );

    hi = lo;
    lo *= 4;
  }

  // Bisect until the interval can't shrink
  for (;;) {
    const mid = (lo + hi) / 2;

    if (mid <= lo || mid >= hi) break;

    if (flight(mid) < target) lo = mid;
    else hi = mid;
  }

  if (hi === FULL_TURN)
    throw new RangeError(
      `No transfer found: dt=${dt} is too long for a single revolution.`
    );

  const yz = y(hi);
  const f = 1 - yz / r1n;
  const g = A * Math.sqrt(yz / mu);
  const gDot = 1 - yz / r2n;

  return {
    v1: [
      (r2[0] - f * r1[0]) / g,
      (r2[1] - f * r1[1]) / g,
      (r2[2] - f * r1[2]) / g
    ],
    v2: [
      (gDot * r2[0] - r1[0]) / g,
      (gDot * r2[1] - r1[1]) / g,
      (gDot * r2[2] - r1[2]) / g
    ]
  };
};
