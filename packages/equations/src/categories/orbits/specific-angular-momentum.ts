import { Vector3DTupleType } from '@interstellar-tools/types';

/**
 * **Specific angular momentum** ($ h $) (scalar magnitude).
 *
 * **Definitions**
 *
 * $$
 * h = \lVert \mathbf r \times \mathbf v \rVert
 * $$
 *
 * Useful identities:
 *
 * $$
 * h = r\,v_{\perp},\qquad
 * \text{(circular)}\ \ v_\perp=\sqrt{\mu/r}\Rightarrow h=\sqrt{\mu r}
 * $$
 *
 * (For orbital elements, one also has ($ h=\sqrt{\mu\,a\,(1-e^2)} $), not used here.)
 *
 * **Units**
 * - Inputs: ($ \mathbf r $) in **meters (m)**, ($ \mathbf v $) in **m/s**.
 * - Output: ($ h $) in **m²/s**.
 *
 * ::: info
 *
 * - Returns the **magnitude** of ($ \mathbf h = \mathbf r \times \mathbf v $) (not the vector).
 * - ($ h = 0 $) iff ($ \mathbf r \parallel \mathbf v $) (purely radial motion) or ($ \mathbf v=\mathbf 0 $).
 * - In a two-body Keplerian model, ($ h $) is constant along the orbit.
 *
 * :::
 *
 * **Invariants (floating-point tolerance aside)**
 * - ($ h \ge 0 $)
 * - ($ \mathbf h \perp \mathbf r $) and ($ \mathbf h \perp \mathbf v $) (directional property; this function returns only ($ \lVert\mathbf h\rVert $)).
 *
 * @param {Vector3DTupleType} r Inertial position vector ($ \mathbf r=[x,y,z] $) (m).
 * @param {Vector3DTupleType} v Inertial velocity vector ($ \mathbf v=[v_x,v_y,v_z] $) (m/s).
 * @returns {number} Specific angular momentum ($ h $) (m²/s).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If any component of `r`/`v` is non-finite; if `r` has zero length; or if `v` is invalid (NaN).
 *
 * @example
 * ```ts
 * // LEO-like state: r ⟂ v
 * const r: [number, number, number] = [6778e3, 0, 0]; // m
 * const v: [number, number, number] = [0, 7.67e3, 0]; // m/s
 * const h = specificAngularMomentum(r, v);            // ≈ 5.20e10 m^2/s
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Specific_angular_momentum}
 * @see {@link specificAngularMomentumFromElements} (if you compute from ($ a,e,\mu $))
 * @category Orbits
 */
export const specificAngularMomentum = (
  r: Vector3DTupleType,
  v: Vector3DTupleType
): number => {
  // Validate inputs
  for (const x of r)
    if (!Number.isFinite(x)) throw new Error('r must be finite (meters).');
  for (const x of v)
    if (!Number.isFinite(x)) throw new Error('v must be finite (m/s).');

  const r2 = r[0] * r[0] + r[1] * r[1] + r[2] * r[2];
  const v2 = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];

  if (!(r2 > 0)) throw new Error('r must be non-zero (meters).');

  if (!(v2 >= 0)) throw new Error('v must be valid (m/s).');

  // h⃗ = r × v
  const hx = r[1] * v[2] - r[2] * v[1];
  const hy = r[2] * v[0] - r[0] * v[2];
  const hz = r[0] * v[1] - r[1] * v[0];
  const h = Math.hypot(hx, hy, hz); // m^2/s

  return h;
};
