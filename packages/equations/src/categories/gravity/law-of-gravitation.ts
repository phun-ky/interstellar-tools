import { G_SI } from '@interstellar-tools/constants';
import type {
  ForceResultInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

/**
 * Compute the Newtonian **gravitational force** on body 1 due to body 2.
 *
 * **Definitions**
 *
 * $$
 * \mathbf r=\mathbf r_2-\mathbf r_1,\quad
 * r=\lVert\mathbf r\rVert,\quad
 * \hat{\mathbf r}=\frac{\mathbf r}{r}
 * $$
 *
 * **Law & Decomposition**
 *
 * $$
 * \mathbf F_{1\leftarrow2}
 * = G\,\frac{m_1 m_2}{r^2}\,\hat{\mathbf r}
 * $$
 *
 * $$
 * \lVert\mathbf F\rVert
 * = G\,\frac{m_1 m_2}{r^2},\qquad
 * \mathbf F=\langle F_x,F_y,F_z\rangle
 * = \lVert\mathbf F\rVert\,\hat{\mathbf r}
 * $$
 *
 * $$
 * F_x=\lVert\mathbf F\rVert\,\hat r_x,\quad
 * F_y=\lVert\mathbf F\rVert\,\hat r_y,\quad
 * F_z=\lVert\mathbf F\rVert\,\hat r_z
 * $$
 *
 * **Newton's 3rd law, for context**
 *
 * $$
 * \mathbf F_{1\leftarrow2}=-\,\mathbf F_{2\leftarrow1}
 * $$
 *
 * **Conventions & units**
 * - Input masses in **kilograms (kg)**; positions in **meters (m)**.
 * - Output force in **newtons (N)**.
 * - Returned `vector` and `direction` point **from body 1 toward body 2**; i.e., `direction = \hat{\mathbf r}`.
 *
 * **Invariants (within numerical tolerance)**
 * - `vector = magnitude * direction`
 * - `magnitude = sqrt(Fx² + Fy² + Fz²)`
 * - `||direction|| = 1`
 *
 *
 * @param {number} m1 Mass of body 1 (kg).
 * @param {number} m2 Mass of body 2 (kg).
 * @param {Vector3DTupleType} r1 Position of body 1 as a 3-tuple `[x, y, z]` in meters.
 * @param {Vector3DTupleType} r2 Position of body 2 as a 3-tuple `[x, y, z]` in meters.
 * @param {number} [G]  Gravitational constant (defaults to `G_SI`, m³·kg⁻¹·s⁻²).
 * @returns {ForceResultInterface} `{ vector, magnitude, direction }`.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `m1` or `m2` are non-finite or negative.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If positions coincide (`r = 0`).
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `G` is non-finite or not positive.
 *
 * @example
 * ```ts
 * import { gravitationalForce } from "@interstellar-tools/equations";
 * import { G_SI } from "@interstellar-tools/constants";
 *
 * // Earth–Sun at ~1 AU
 * const mEarth = 5.972e24;     // kg
 * const mSun   = 1.9885e30;    // kg
 * const rEarth: [number, number, number] = [0, 0, 0];
 * const rSun  : [number, number, number] = [1.495978707e11, 0, 0]; // m
 *
 * const F = gravitationalForce(mEarth, mSun, rEarth, rSun, G_SI);
 * console.log(F.magnitude.toExponential(3)); // ≈ "3.542e+22" N
 * console.log(F.vector); // Points from Earth toward Sun (−x here)
 * ```
 *
 * **Get F directly (recommended)**
 *
 * ```ts
 * import { gravitationalForce } from "@interstellar-tools/equations";
 * import type { Vector3DTupleType, ForceResultInterface } from "@interstellar-tools/types";
 *
 * const m1 = 5.972e24; // kg
 * const m2 = 1.9885e30; // kg
 * const r1: Vector3DTupleType = [0, 0, 0];                 // m
 * const r2: Vector3DTupleType = [1.495978707e11, 0, 0];    // m
 *
 * const { vector: F, magnitude, direction }: ForceResultInterface = gravitationalForce(m1, m2, r1, r2);
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
 * @category Gravity
 */
export const gravitationalForce = (
  m1: number,
  m2: number,
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  G: number = G_SI
): ForceResultInterface => {
  if (!Number.isFinite(m1) || !Number.isFinite(m2) || m1 < 0 || m2 < 0) {
    throw new Error('m1 and m2 must be finite, non-negative numbers (kg).');
  }

  if (!Number.isFinite(G) || G <= 0) {
    throw new Error('G must be a finite, positive number (m^3·kg^-1·s^-2).');
  }

  const rx = r2[0] - r1[0];
  const ry = r2[1] - r1[1];
  const rz = r2[2] - r1[2];
  const r2mag = rx * rx + ry * ry + rz * rz;

  if (r2mag === 0) {
    throw new Error(
      'Bodies are at the same position: gravitational force is singular (r = 0).'
    );
  }

  const invR = 1 / Math.sqrt(r2mag);
  const dir: Vector3DTupleType = [rx * invR, ry * invR, rz * invR];
  // |F| = G m1 m2 / r^2
  const magnitude = (G * m1 * m2) / r2mag;
  // Vector points from body 1 toward body 2.
  const Fx = dir[0] * magnitude;
  const Fy = dir[1] * magnitude;
  const Fz = dir[2] * magnitude;
  // Ensure the tuple type is preserved for callers.
  const vector: Vector3DTupleType = [Fx, Fy, Fz];

  return { vector, magnitude, direction: dir };
};

/**
 * Gravitational **acceleration** of body 1 due to body 2 (vector, m/s²).
 *
 * **Definitions**
 *
 * $$
 * \mathbf r=\mathbf r_2-\mathbf r_1,\quad
 * r=\lVert\mathbf r\rVert,\quad
 * \hat{\mathbf r}=\frac{\mathbf r}{r}
 * $$
 *
 * **Acceleration field**
 *
 * $$
 * \mathbf a_{1\leftarrow2}
 * = \frac{\mathbf F_{1\leftarrow2}}{m_1}
 * = G\,\frac{m_2}{r^2}\,\hat{\mathbf r}
 * $$
 *
 * **Units**
 * - Inputs: masses in **kg**, positions in **m**, ($ G $) in **m³·kg⁻¹·s⁻²**.
 * - Output: acceleration in **m/s²**.
 *
 * ::: info
 *
 * - Implemented via `gravitationalForce(1, m2, r1, r2, G)`, so the returned vector equals the force on a **1 kg** test mass (i.e., the acceleration).
 * - Direction points **from body 1 toward body 2**: ($  \hat{\mathbf r}  $).
 *
 * :::
 *
 * **Invariants (within FP tolerance)**
 * - `||a|| = G*m2/r^2`
 * - `a = ||a|| * r̂`
 *
 * @param {number} m2 Mass of body 2 (kg).
 * @param {Vector3DTupleType} r1 Position of body 1 `[x, y, z]` in meters.
 * @param {Vector3DTupleType} r2 Position of body 2 `[x, y, z]` in meters.
 * @param {number} [G=G_SI] Gravitational constant.
 * @returns {Vector3DTupleType} Acceleration of body 1 due to body 2 (m/s²).
 *
 * @example
 * ```ts
 * // Acceleration of a satellite due to Earth at ~7000 km from Earth's center
 * const mSat = 500;                       // kg (any value; a is independent of mSat)
 * const mEarth = 5.972e24;                // kg
 * const rSat:   [number, number, number] = [7.0e6, 0, 0]; // m
 * const rEarth: [number, number, number] = [0, 0, 0];
 *
 * const a = gravitationalAccelerationOn1By2(mSat, mEarth, rSat, rEarth);
 * // ≈ [-8.14, 0, 0] m/s² (toward Earth)
 * ```
 *
 * @example
 * ```ts
 * // Derive force from acceleration (F = m1 * a)
 * const m1 = 1200; // kg spacecraft
 * const a = gravitationalAccelerationOn1By2(m1, mEarth, rSat, rEarth);
 * const F: [number, number, number] = [a[0]*m1, a[1]*m1, a[2]*m1]; // newtons
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
 * @category Gravity
 */
export const gravitationalAccelerationOn1By2 = (
  m2: number,
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  G: number = G_SI
): Vector3DTupleType => {
  const { direction, magnitude } = gravitationalForce(1, m2, r1, r2, G); // |F| on 1 kg == |a|
  const a: Vector3DTupleType = [
    direction[0] * magnitude,
    direction[1] * magnitude,
    direction[2] * magnitude
  ];

  return a;
};

/**
 * Gravitational **force vector** on body 1 due to body 2 (newtons, N).
 *
 * **Definitions**
 *
 * $$
 * \mathbf r=\mathbf r_2-\mathbf r_1,\quad
 * r=\lVert\mathbf r\rVert,\quad
 * \hat{\mathbf r}=\frac{\mathbf r}{r}
 * $$
 *
 * **Newton's law (vector form)**
 *
 * $$
 * \mathbf F_{1\leftarrow2}
 * = G\,\frac{m_1 m_2}{r^2}\,\hat{\mathbf r}
 * $$
 *
 * **Magnitude & Components**
 *
 * $$
 * \lVert\mathbf F\rVert=G\,\frac{m_1 m_2}{r^2},\qquad
 * \mathbf F=\langle F_x,F_y,F_z\rangle=\lVert\mathbf F\rVert\,\hat{\mathbf r}
 * $$
 *
 * $$
 * F_x=\lVert\mathbf F\rVert\,\hat r_x,\quad
 * F_y=\lVert\mathbf F\rVert\,\hat r_y,\quad
 * F_z=\lVert\mathbf F\rVert\,\hat r_z
 * $$
 *
 * **Newton's 3rd law (context)**
 *
 * $$
 * \mathbf F_{1\leftarrow2}=-\,\mathbf F_{2\leftarrow1}
 * $$
 *
 * **Units**
 * - Inputs: masses in **kg**, positions in **m**, ($ G $) in **m³·kg⁻¹·s⁻²**.
 * - Output: force vector in **newtons (N)**.
 *
 * ::: info
 *
 * - The returned vector points **from body 1 toward body 2** (i.e., along ($  \hat{\mathbf r}  $)).
 * - Internally delegates to `gravitationalForce(m1, m2, r1, r2, G)` and returns its
 *   direction-scaled magnitude as a 3-tuple.
 * - For acceleration instead of force, use `gravitationalAccelerationOn1By2` or compute ($  \mathbf a=\mathbf F/m_1  $).
 *
 * :::
 *
 * **Invariants (within FP tolerance)**
 * - `||F|| = G*m1*m2/r^2`
 * - `F = ||F|| * r̂`
 *
 * @param {number} m1 Mass of body 1 (kg).
 * @param {number} m2 Mass of body 2 (kg).
 * @param {Vector3DTupleType} r1 Position of body 1 `[x, y, z]` in meters.
 * @param {Vector3DTupleType} r2 Position of body 2 `[x, y, z]` in meters.
 * @param {number} [G=G_SI] Gravitational constant.
 * @returns {Vector3DTupleType} Force on body 1 due to body 2, in newtons `[Fx, Fy, Fz]`.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} Propagated from `gravitationalForce` if inputs are invalid (non-finite/negative masses, coincident positions ($ r=0 $), or non-positive ($ G $)).
 *
 * @example
 * ```ts
 * // Earth–Sun at ~1 AU (force on Earth due to Sun)
 * const mEarth = 5.972e24;  // kg
 * const mSun   = 1.9885e30; // kg
 * const rEarth: [number, number, number] = [0, 0, 0];
 * const rSun  : [number, number, number] = [1.495978707e11, 0, 0]; // m
 *
 * const F = gravitationalForceOn1By2(mEarth, mSun, rEarth, rSun); // N
 * const Fmag = Math.hypot(F[0], F[1], F[2]); // ≈ 3.54e22 N
 * ```
 *
 * @example
 * ```ts
 * // Derive acceleration from the returned force: a = F / m1
 * const a: [number, number, number] = [F[0]/mEarth, F[1]/mEarth, F[2]/mEarth]; // m/s^2
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
 * @category Gravity
 */
export const gravitationalForceOn1By2 = (
  m1: number,
  m2: number,
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  G: number = G_SI
): Vector3DTupleType => {
  const { direction, magnitude } = gravitationalForce(m1, m2, r1, r2, G); // |F|
  const F: Vector3DTupleType = [
    direction[0] * magnitude,
    direction[1] * magnitude,
    direction[2] * magnitude
  ];

  return F;
};
