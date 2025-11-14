import { Vector3DTupleType } from './math';

/**
 * Result of a Newtonian gravitational force computation between two point masses.
 *
 * **Units:** SI (newtons for force). `vector` and `direction` point **from body 1 toward body 2**.
 *
 * **Relevant equations (invariants & definitions)**
 *
 * $$
 * \mathbf F = \langle F_x, F_y, F_z \rangle,\qquad
 * \|\mathbf F\| = \sqrt{F_x^2 + F_y^2 + F_z^2}
 * $$
 *
 * $$
 * \hat{\mathbf r}=\frac{\mathbf r_2-\mathbf r_1}{\|\mathbf r_2-\mathbf r_1\|},\qquad
 * \|\hat{\mathbf r}\|=1
 * $$
 *
 * $$
 * \mathbf F = \|\mathbf F\|\,\hat{\mathbf r}
 * $$
 *
 * And, for context (how the magnitude is obtained in Newtonian gravity):
 *
 * $$
 * \|\mathbf F\| = G\,\frac{m_1 m_2}{\|\mathbf r_2-\mathbf r_1\|^2}
 * $$
 *
 * **Mappings to fields**
 * - `vector`  ↔ ($  \mathbf F  $)
 * - `magnitude` ↔ ($  \|\mathbf F\|  $)
 * - `direction` ↔ ($  \hat{\mathbf r}  $)
 *
 * @property vector     Force vector on body 1 due to body 2 (N).
 * @property magnitude  Scalar magnitude of the force (N).
 * @property direction  Unit direction from body 1 to body 2 (dimensionless).
 *
 * @example
 * ```ts
 * const res: ForceResultInterface = gravitationalForce(m1, m2, r1, r2);
 * // Invariant checks:
 * const [Fx, Fy, Fz] = res.vector;
 * const magFromVec = Math.hypot(Fx, Fy, Fz);
 * console.assert(Math.abs(magFromVec - res.magnitude) / res.magnitude < 1e-9);
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
 */
export interface ForceResultInterface {
  /** Force vector on body 1 due to body 2 (newtons, N). */
  readonly vector: Vector3DTupleType;
  /** Magnitude (scalar) of the gravitational force (N). */
  readonly magnitude: number;
  /** Unit direction from body 1 to body 2 (dimensionless). */
  readonly direction: Vector3DTupleType;
}

/**
 * **Peri/apoapsis radii pair**.
 *
 * **Definitions**
 *
 * $$
 * r_p = a(1-e),\qquad r_a = a(1+e)
 * $$
 *
 * **Conic validity**
 * - **Elliptic / circular** (($ a>0,\;0\le e<1 $)): both ($ r_p>0 $) and ($ r_a>0 $).
 * - **Hyperbolic** (($ a<0,\;e>1 $)): ($ r_p = |a|(e-1) > 0 $) and **no apoapsis** (unbounded), so set `ra = null`.
 * - **Parabolic** (($ e=1 $)) with finite ($ a $) is not represented; use parabolic relations or state vectors.
 *
 * **Units**
 * - Values are in **meters (m)**.
 *
 * @property {number} rp Periapsis radius ($ r_p $) (m).
 * @property {number|null} ra Apoapsis radius ($ r_a $) (m) for closed orbits; `null` for hyperbolic trajectories.
 *
 * @example
 * ```ts
 * // Elliptic example
 * const radii: PeriApoRadiiType = { rp: 6930e3, ra: 7070e3 };
 * ```
 *
 * @example
 * ```ts
 * // Hyperbolic example - no apoapsis
 * const flyby: PeriApoRadiiType = { rp: 10_000e3, ra: null };
 * ```
 *
 * @see periApoapsisRadii - function that computes `{ rp, ra }` from `(a, e)`.
 * @see https://en.wikipedia.org/wiki/Apsis
 * @category Orbits
 */
export type PeriApoRadiiType = { rp: number; ra: number | null };
