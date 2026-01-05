/**
 * Clohessy–Wiltshire / Hill relative-motion **state vector** in the LVLH frame.
 *
 * Axes (LVLH / RSW-style):
 * - `x`   — **radial** (outward from the central body / reference orbit radius)
 * - `y`   — **along-track** / tangential (direction of motion of the reference orbit)
 * - `z`   — **cross-track** (completes right-handed frame, roughly orbit-normal)
 *
 * Components:
 * - `x`, `y`, `z` are relative position components.
 * - `xDot`, `yDot`, `zDot` are relative velocity components (time derivatives).
 *
 * Units:
 * - Positions in meters or kilometers (choose one and stay consistent).
 * - Velocities in m/s or km/s accordingly.
 *
 * This tuple is commonly used as the state for integrating the CW/Hill ODEs.
 *
 * @example
 * ```ts
 * const s: CwState = [
 *   100,   // x (m)
 *   0,     // y (m)
 *   0,     // z (m)
 *   0,     // xDot (m/s)
 *   0.01,  // yDot (m/s)
 *   0      // zDot (m/s)
 * ];
 * ```
 *
 * @group Orbits
 */
export type CwState = readonly [
  /** Radial relative position (outward). */
  x: number,
  /** Along-track relative position (tangential). */
  y: number,
  /** Cross-track relative position (orbit-normal). */
  z: number,
  /** Time derivative of `x` (radial relative velocity). */
  xDot: number,
  /** Time derivative of `y` (along-track relative velocity). */
  yDot: number,
  /** Time derivative of `z` (cross-track relative velocity). */
  zDot: number
];

/**
 * Time derivative of {@link CwState} for CW/Hill dynamics.
 *
 * Ordered as:
 * - Position derivatives: `[xDot, yDot, zDot]`
 * - Acceleration terms:   `[xDDot, yDDot, zDDot]`
 *
 * Units:
 * - First three components: velocity (m/s or km/s).
 * - Last three components: acceleration (m/s² or km/s²).
 *
 * Useful as the return type for an ODE RHS function, e.g. `cwHillDerivatives(state, n)`.
 *
 * @example
 * ```ts
 * const ds: CwStateDerivative = [
 *   0,     // xDot (m/s)
 *   0.01,  // yDot (m/s)
 *   0,     // zDot (m/s)
 *   0.0002,// xDDot (m/s²)
 *   0,     // yDDot (m/s²)
 *   0      // zDDot (m/s²)
 * ];
 * ```
 *
 * @group Orbits
 */
export type CwStateDerivative = readonly [
  /** Time derivative of `x` (radial relative velocity). */
  xDot: number,
  /** Time derivative of `y` (along-track relative velocity). */
  yDot: number,
  /** Time derivative of `z` (cross-track relative velocity). */
  zDot: number,
  /** Time derivative of `xDot` (radial relative acceleration). */
  xDDot: number,
  /** Time derivative of `yDot` (along-track relative acceleration). */
  yDDot: number,
  /** Time derivative of `zDot` (cross-track relative acceleration). */
  zDDot: number
];
