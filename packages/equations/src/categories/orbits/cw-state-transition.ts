import type { Matrix3x3Type } from '@interstellar-tools/types';

/**
 * The Clohessy–Wiltshire state transition matrix $ \Phi(t) $, split into its four 3×3 blocks:
 * $ \mathbf r(t) = \Phi_{rr}\mathbf r_0 + \Phi_{rv}\mathbf v_0 $ and $ \mathbf v(t) = \Phi_{vr}\mathbf r_0 + \Phi_{vv}\mathbf v_0 $.
 *
 * @group Orbits
 */
export interface CwStateTransitionInterface {
  /** Position from initial position. */
  rr: Matrix3x3Type;
  /** Position from initial velocity (s). */
  rv: Matrix3x3Type;
  /** Velocity from initial position (1/s). */
  vr: Matrix3x3Type;
  /** Velocity from initial velocity. */
  vv: Matrix3x3Type;
}

/**
 * Compute the **Clohessy–Wiltshire state transition matrix**: the closed-form solution of the CW / Hill equations.
 *
 * With $ s = \sin nt $ and $ c = \cos nt $, in the LVLH frame of {@link cwHillDerivatives}
 * ($ x $ radial, $ y $ along-track, $ z $ cross-track):
 *
 * $$
 * \Phi_{rr} = \begin{bmatrix} 4 - 3c & 0 & 0 \\ 6(s - nt) & 1 & 0 \\ 0 & 0 & c \end{bmatrix}, \quad
 * \Phi_{rv} = \frac{1}{n}\begin{bmatrix} s & 2(1 - c) & 0 \\ -2(1 - c) & 4s - 3nt & 0 \\ 0 & 0 & s \end{bmatrix}
 * $$
 *
 * $$
 * \Phi_{vr} = \begin{bmatrix} 3ns & 0 & 0 \\ 6n(c - 1) & 0 & 0 \\ 0 & 0 & -ns \end{bmatrix}, \quad
 * \Phi_{vv} = \begin{bmatrix} c & 2s & 0 \\ -2s & 4c - 3 & 0 \\ 0 & 0 & c \end{bmatrix}
 * $$
 *
 * **Units**
 * - Inputs: `n` in **rad/s**, `t` in **s**.
 * - Output: dimensionless blocks, except $ \Phi_{rv} $ in **s** and $ \Phi_{vr} $ in **1/s**.
 *
 * ::: info Notes
 *
 * - Valid near a **circular** reference orbit, for separations small compared with its radius. Elliptic reference orbits need other solutions (e.g. Yamanaka–Ankersen).
 * - The $ -3nt $ terms grow without bound: a deputy slightly lower than the chief drifts ahead every orbit.
 * - $ \Phi(0) $ is the identity, and $ \Phi(t_1 + t_2) = \Phi(t_2)\,\Phi(t_1) $.
 * - Negative `t` propagates backwards.
 *
 * :::
 *
 * @param n - Mean motion of the circular reference orbit $ n $ in **rad/s** (finite, > 0).
 * @param t - Time since the initial state $ t $ in **s** (finite).
 * @returns The four 3×3 blocks of $ \Phi(t) $.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `n <= 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * // ISS-like orbit: n ≈ 0.00113 rad/s, a quarter of an orbit later
 * const { rr, rv } = cwStateTransition(0.00113, (Math.PI / 2) / 0.00113);
 * ```
 *
 * @see {@link cwPropagate}
 * @see {@link cwTwoImpulseTransfer}
 * @see https://en.wikipedia.org/wiki/Clohessy%E2%80%93Wiltshire_equations Clohessy–Wiltshire equations
 */
export const cwStateTransition = (
  n: number,
  t: number
): CwStateTransitionInterface => {
  for (const [name, x] of [
    ['n', n],
    ['t', t]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (n <= 0) throw new RangeError(`n must be > 0. Received: ${n}`);

  const nt = n * t;
  const s = Math.sin(nt);
  const c = Math.cos(nt);

  return {
    rr: [
      [4 - 3 * c, 0, 0],
      [6 * (s - nt), 1, 0],
      [0, 0, c]
    ],
    rv: [
      [s / n, (2 * (1 - c)) / n, 0],
      [(-2 * (1 - c)) / n, (4 * s - 3 * nt) / n, 0],
      [0, 0, s / n]
    ],
    vr: [
      [3 * n * s, 0, 0],
      [6 * n * (c - 1), 0, 0],
      [0, 0, -n * s]
    ],
    vv: [
      [c, 2 * s, 0],
      [-2 * s, 4 * c - 3, 0],
      [0, 0, c]
    ]
  };
};
