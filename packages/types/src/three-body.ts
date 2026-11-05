import type { Vector3DTupleType } from './math.js';

/**
 * A state in the **circular restricted three-body problem** (CR3BP), in the
 * rotating, normalised frame.
 *
 * The two large bodies sit on the x axis, the larger at $x = -\mu$ and the
 * smaller at $x = 1 - \mu$, and the frame turns with them. Lengths are in
 * units of their separation, times in units of $1/n$ (so one revolution is
 * $2\pi$), and speeds in units of the separation times $n$.
 *
 * @example
 * ```ts
 * // At rest at the Earth–Moon L4 point
 * const l4: Cr3bpState = [0.5 - 0.01215, Math.sqrt(3) / 2, 0, 0, 0, 0];
 * ```
 *
 * @group Three-body
 */
export type Cr3bpState = readonly [
  /** Position along the line from the larger to the smaller body. */
  x: number,
  /** Position in the orbital plane, ahead of the x axis. */
  y: number,
  /** Position out of the orbital plane. */
  z: number,
  /** Velocity along x, in the rotating frame. */
  xDot: number,
  /** Velocity along y, in the rotating frame. */
  yDot: number,
  /** Velocity along z. */
  zDot: number
];

/**
 * The time derivative of a {@link Cr3bpState}: velocities, then accelerations.
 *
 * @group Three-body
 */
export type Cr3bpStateDerivative = readonly [
  xDot: number,
  yDot: number,
  zDot: number,
  xDDot: number,
  yDDot: number,
  zDDot: number
];

/**
 * The units of the normalised CR3BP frame for a pair of bodies, in SI.
 *
 * Multiply a normalised length by `length`, a time by `time` and a speed by
 * `speed` to get metres, seconds and metres per second.
 *
 * @group Three-body
 */
export interface Cr3bpUnitsInterface {
  /** Mass ratio $\mu = m_2 / (m_1 + m_2)$ of the smaller body. */
  mu: number;
  /** Length unit: the separation of the two bodies, in m. */
  length: number;
  /** Time unit: $1/n$, in s. One revolution takes $2\pi$ of these. */
  time: number;
  /** Speed unit: `length / time`, in m/s. */
  speed: number;
}

/**
 * The five **Lagrange points** of two bodies circling each other: where a
 * third, small body can stay put relative to them.
 *
 * Returned by `lagrangePoints` in `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - Positions in m, in the frame turning with the two bodies, from their
 *   barycentre: x points from the larger body to the smaller, y ahead along
 *   the smaller body's orbit, z out of the orbital plane.
 * - L1 lies between the bodies, L2 beyond the smaller one, and L3 beyond the
 *   larger one, all on the x axis. L4 leads the smaller body by 60° and L5
 *   trails it, each at the corner of an equilateral triangle with the two
 *   bodies.
 *
 * :::
 *
 * @example
 * ```ts
 * // Earth and the Moon, 384 400 km apart
 * const points: LagrangePointsInterface = {
 *   L1: [321_710_000, 0, 0],
 *   L2: [444_244_000, 0, 0],
 *   L3: [-386_346_000, 0, 0],
 *   L4: [187_529_000, 332_900_000, 0],
 *   L5: [187_529_000, -332_900_000, 0]
 * };
 * ```
 * @group Three-body
 */
export interface LagrangePointsInterface {
  /** Between the two bodies, in m. */
  L1: Vector3DTupleType;
  /** Beyond the smaller body, in m. */
  L2: Vector3DTupleType;
  /** Beyond the larger body, opposite the smaller, in m. */
  L3: Vector3DTupleType;
  /** 60° ahead of the smaller body, in m. */
  L4: Vector3DTupleType;
  /** 60° behind the smaller body, in m. */
  L5: Vector3DTupleType;
}
