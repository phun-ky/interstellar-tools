/**
 * Compute **atmospheric drag acceleration magnitude**.
 *
 * Equation:
 * $$
 * a_D=\frac{1}{2}\,\frac{C_D A}{m}\,\rho\,v^2
 * $$
 *
 * Where:
 * - $C_D$ is the drag coefficient (dimensionless)
 * - $A$ is reference area normal to the flow (m²)
 * - $m$ is spacecraft mass (kg)
 * - $\rho$ is atmospheric density (kg/m³)
 * - $v$ is speed relative to the atmosphere (m/s)
 *
 * Units:
 * - Returns acceleration magnitude in **m/s²**.
 *
 * Note:
 * - This returns the **magnitude** of drag acceleration. The drag acceleration vector points
 *   opposite the velocity direction (i.e., along $-\hat{v}$).
 *
 * @param Cd Drag coefficient $C_D$ (finite, >= 0).
 * @param A Reference area $A$ (finite, >= 0), in m².
 * @param m Mass $m$ (finite, > 0), in kg.
 * @param rho Atmospheric density $\rho$ (finite, >= 0), in kg/m³.
 * @param v Speed relative to the atmosphere $v$ (finite, >= 0), in m/s.
 * @returns Drag acceleration magnitude $a_D$ in m/s².
 * @throws {TypeError} If any input is not finite.
 * @throws {RangeError} If `m <= 0` or any of `Cd, A, rho, v` is negative.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Example (rough LEO order-of-magnitude):
 * const aD = atmosphericDragAcceleration(2.2, 2.0, 500, 1e-12, 7700);
 * ```
 */
export const atmosphericDragAcceleration = (
  Cd: number,
  A: number,
  m: number,
  rho: number,
  v: number
): number => {
  for (const [name, value] of [
    ['Cd', Cd],
    ['A', A],
    ['m', m],
    ['rho', rho],
    ['v', v]
  ] as const) {
    if (!Number.isFinite(value)) {
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );
    }
  }

  if (Cd < 0) throw new RangeError(`Cd must be >= 0. Received: ${Cd}`);

  if (A < 0) throw new RangeError(`A must be >= 0. Received: ${A}`);

  if (m <= 0) throw new RangeError(`m must be > 0. Received: ${m}`);

  if (rho < 0) throw new RangeError(`rho must be >= 0. Received: ${rho}`);

  if (v < 0) throw new RangeError(`v must be >= 0. Received: ${v}`);

  return 0.5 * ((Cd * A) / m) * rho * v * v;
};
