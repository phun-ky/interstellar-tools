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
