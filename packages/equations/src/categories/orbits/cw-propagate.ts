import type { CwState, Vector3DTupleType } from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';

import { cwStateTransition } from './cw-state-transition.js';

/**
 * **Propagate** a Clohessy–Wiltshire / Hill relative state in closed form.
 *
 * $$
 * \begin{pmatrix}\mathbf r \\ \mathbf v\end{pmatrix}(t) =
 * \begin{bmatrix}\Phi_{rr} & \Phi_{rv} \\ \Phi_{vr} & \Phi_{vv}\end{bmatrix}
 * \begin{pmatrix}\mathbf r_0 \\ \mathbf v_0\end{pmatrix}
 * $$
 *
 * with $ \Phi(t) $ from {@link cwStateTransition}.
 *
 * **Units**
 * - Inputs: `state` positions in **m** and velocities in **m/s**, `n` in **rad/s**, `t` in **s**.
 * - Output: the state at `t`, in the same units.
 *
 * ::: info Notes
 *
 * - The exact solution of the equations {@link cwHillDerivatives} gives to a numerical integrator: no step size, no accumulated error.
 * - Same LVLH frame and `CwState` layout as `cwHillDerivatives`: `[x, y, z, xDot, yDot, zDot]`, with $ x $ radial, $ y $ along-track, $ z $ cross-track.
 * - A state with $ \dot y_0 = -2n x_0 $ has no along-track drift: it traces a closed ellipse around the chief.
 *
 * :::
 *
 * @param state - Relative state `[x, y, z, xDot, yDot, zDot]` (finite).
 * @param n - Mean motion of the circular reference orbit in **rad/s** (finite, > 0).
 * @param t - Time to propagate in **s** (finite; negative goes backwards).
 * @returns The relative state at `t`.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `n <= 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { CwState } from '@interstellar-tools/types';
 *
 * // 100 m below the chief with no drift: back where it started after one orbit
 * const n = 0.00113;
 * const start: CwState = [-100, 0, 0, 0, 2 * n * 100, 0];
 * const later = cwPropagate(start, n, (2 * Math.PI) / n);
 * // later ≈ start
 * ```
 *
 * @see {@link cwStateTransition}
 * @see {@link cwTwoImpulseTransfer}
 */
export const cwPropagate = (state: CwState, n: number, t: number): CwState => {
  for (const x of state)
    if (!Number.isFinite(x))
      throw new TypeError(`state must have finite components. Received: ${x}`);

  const { rr, rv, vr, vv } = cwStateTransition(n, t);
  const r0: Vector3DTupleType = [state[0], state[1], state[2]];
  const v0: Vector3DTupleType = [state[3], state[4], state[5]];
  const rA = applyMatrix3(rr, r0);
  const rB = applyMatrix3(rv, v0);
  const vA = applyMatrix3(vr, r0);
  const vB = applyMatrix3(vv, v0);

  return [
    rA[0] + rB[0],
    rA[1] + rB[1],
    rA[2] + rB[2],
    vA[0] + vB[0],
    vA[1] + vB[1],
    vA[2] + vB[2]
  ] as const;
};
