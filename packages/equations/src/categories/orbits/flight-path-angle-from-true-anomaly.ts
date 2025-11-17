import { Radians } from '@interstellar-tools/types';

/**
 * **Flight-path angle** ($ \gamma $) from **true anomaly** ($ \nu $) and eccentricity ($ e $).
 *
 * **Definition**
 *
 * $$
 * \tan\gamma=\frac{e\sin\nu}{1+e\cos\nu}
 * $$
 *
 * ::: info Domain notes
 *
 * - **Elliptic / circular** ($ 0\le e<1 $): since $ 1+e\cos\nu \ge 1-e > 0 $ for all $ \nu $, we have $ \gamma\in(-\tfrac{\pi}{2},\tfrac{\pi}{2}) $.
 * - **Parabolic** ($ e=1 $): at $ \nu=\pi $ the ratio is $ 0/0 $; by continuity $ \gamma\to 0 $ (this function returns $ 0 $ in that limit).
 * - **Hyperbolic** ($ e>1$ ): only $ \nu $ with $ 1+e\cos\nu>0 $ are physical; when $ 1+e\cos\nu=0 $ the angle tends to $ \pm\tfrac{\pi}{2} $.
 *
 * :::
 *
 * **Conventions**
 * - Returns ($ \gamma $) in **radians** (positive outbound $ 0<\nu<\pi $, negative inbound).
 * - Uses `atan2(e sin ν, 1 + e cos ν)` for correct quadrant handling and robust behavior near asymptotes.
 *
 * @param {Radians} nu True anomaly ($ \nu $) in **radians**; must be finite.
 * @param {number} e  Eccentricity ($ e $), dimensionless, must be finite and **≥ 0**.
 * @returns {Radians} Flight-path angle ($ \gamma $) in **radians**.
 * @throws {Error} If inputs are non-finite or ($ e<0 $). Note: at the parabolic limit ($ e=1,\ \nu=\pi $) this function returns $ 0 $; at hyperbolic asymptotes ($ 1+e\cos\nu=0 $) it tends to $ \pm\pi/2 $.
 * @group Orbits
 */
export const flightPathAngleFromTrueAnomaly = (
  nu: Radians,
  e: number
): Radians => {
  if (!Number.isFinite(nu)) throw new Error('nu must be finite (radians).');

  if (!Number.isFinite(e) || e < 0)
    throw new Error('e must be finite and ≥ 0.');

  const y = e * Math.sin(nu as number);
  const x = 1 + e * Math.cos(nu as number);
  const tol = 1e-15;

  if (Math.abs(x) < tol && Math.abs(y) < tol) return 0 as Radians;

  return Math.atan2(y, x) as Radians;
};
