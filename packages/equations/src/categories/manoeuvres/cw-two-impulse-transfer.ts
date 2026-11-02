import type { CwState, Vector3DTupleType } from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';
import { cwStateTransition } from '../orbits/cw-state-transition.js';

export interface CwTwoImpulseTransferInterface {
  /** First burn, at the start, in m/s (LVLH). */
  dv1: Vector3DTupleType;
  /** Second burn, on arrival, in m/s (LVLH). */
  dv2: Vector3DTupleType;
}

/**
 * Compute the **two burns of a Clohessy–Wiltshire rendezvous**: from a relative state to a target state in a given time.
 *
 * $$
 * \mathbf v_0^+ = \Phi_{rv}^{-1}\left(\mathbf r_f - \Phi_{rr}\,\mathbf r_0\right), \quad
 * \Delta\mathbf v_1 = \mathbf v_0^+ - \mathbf v_0, \quad
 * \Delta\mathbf v_2 = \mathbf v_f - \left(\Phi_{vr}\,\mathbf r_0 + \Phi_{vv}\,\mathbf v_0^+\right)
 * $$
 *
 * with the blocks of $ \Phi(t) $ from {@link cwStateTransition}.
 *
 * **Units**
 * - Inputs: states in **m** and **m/s**, `n` in **rad/s**, `t` in **s**.
 * - Output: both burns in **m/s**, as vectors in the LVLH frame.
 *
 * ::: info Notes
 *
 * - The first burn puts the deputy on a path that reaches the target position after `t`; the second matches the target velocity there. For a rendezvous with the chief, the target state is all zeros.
 * - Some transfer times can't be targeted: in the orbital plane, every whole number of orbits ($ nt = 2\pi k $), and out of plane, every half orbit, where the cross-track motion returns to $ \pm z_0 $ whatever the burn. At a half orbit the cross-track burn is zero if the target is already on that path, and otherwise the function throws.
 * - Valid near a circular reference orbit, for small separations.
 *
 * :::
 *
 * @param state0 - Deputy's relative state before the first burn `[x, y, z, xDot, yDot, zDot]` (finite).
 * @param target - State to arrive at `[x, y, z, xDot, yDot, zDot]` (finite); all zeros to rendezvous with the chief.
 * @param n - Mean motion of the circular reference orbit in **rad/s** (finite, > 0).
 * @param t - Transfer time in **s** (finite, > 0).
 * @returns The two burns `dv1` and `dv2` in **m/s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `n <= 0`, `t <= 0`, or the transfer time can't be targeted.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * import type { CwState } from '@interstellar-tools/types';
 *
 * // 1 km behind the chief, at rest: rendezvous in a quarter of an orbit
 * const n = 0.00113;
 * const { dv1, dv2 } = cwTwoImpulseTransfer(
 *   [0, -1000, 0, 0, 0, 0],
 *   [0, 0, 0, 0, 0, 0],
 *   n,
 *   Math.PI / 2 / n
 * );
 * ```
 *
 * @see {@link cwPropagate}
 * @see https://en.wikipedia.org/wiki/Clohessy%E2%80%93Wiltshire_equations Clohessy–Wiltshire equations
 */
export const cwTwoImpulseTransfer = (
  state0: CwState,
  target: CwState,
  n: number,
  t: number
): CwTwoImpulseTransferInterface => {
  for (const [name, state] of [
    ['state0', state0],
    ['target', target]
  ] as const) {
    for (const x of state)
      if (!Number.isFinite(x))
        throw new TypeError(
          `${name} must have finite components. Received: ${x}`
        );
  }

  if (!Number.isFinite(t))
    throw new TypeError(`t must be a finite number. Received: ${t}`);

  if (t <= 0) throw new RangeError(`t must be > 0. Received: ${t}`);

  const { rr, rv, vr, vv } = cwStateTransition(n, t);
  const r0: Vector3DTupleType = [state0[0], state0[1], state0[2]];
  const v0: Vector3DTupleType = [state0[3], state0[4], state0[5]];
  const fromR0 = applyMatrix3(rr, r0);
  // Position the first burn's velocity has to cover
  const dx = target[0] - fromR0[0];
  const dy = target[1] - fromR0[1];
  const dz = target[2] - fromR0[2];
  // In-plane: invert the 2×2 block of Φrv
  const [[a, b], [c, d]] = rv;
  const det = a * d - b * c;

  if (Math.abs(det) * n * n <= 1e-10)
    throw new RangeError(
      `The transfer time is a whole number of orbits (nt = 2πk), which can't be targeted in the orbital plane. Received: nt=${n * t}`
    );

  const xDot = (d * dx - b * dy) / det;
  const yDot = (-c * dx + a * dy) / det;
  // Out of plane: z(t) = c z0 + (s / n) zDot0
  const sOverN = rv[2][2];

  let zDot: number;

  if (Math.abs(sOverN) * n > 1e-10) {
    zDot = dz / sOverN;
  } else if (Math.abs(dz) <= 1e-9 * Math.max(1, Math.abs(target[2]))) {
    zDot = v0[2];
  } else {
    throw new RangeError(
      `At a half orbit (nt = πk) the cross-track position can't be changed. Received: nt=${n * t}`
    );
  }

  const v0Plus: Vector3DTupleType = [xDot, yDot, zDot];
  const fromR = applyMatrix3(vr, r0);
  const fromV = applyMatrix3(vv, v0Plus);

  return {
    dv1: [xDot - v0[0], yDot - v0[1], zDot - v0[2]],
    dv2: [
      target[3] - (fromR[0] + fromV[0]),
      target[4] - (fromR[1] + fromV[1]),
      target[5] - (fromR[2] + fromV[2])
    ]
  };
};
