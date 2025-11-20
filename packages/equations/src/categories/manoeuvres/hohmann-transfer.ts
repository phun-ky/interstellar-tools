export type HohmannTransferReturnType = {
  at: number;
  dv1: number;
  dv2: number;
  dvTotal: number;
  tTransfer: number;
  dir1: 'prograde' | 'retrograde' | 'none';
  dir2: 'prograde' | 'retrograde' | 'none';
};

/**
 * **Hohmann transfer** (coplanar, circular ($ r_1 \to r_2 $)).
 *
 * **Definitions**
 *
 * $$
 * a_t=\frac{r_1+r_2}{2}
 * $$
 * $$
 * \Delta v_1=\sqrt{\frac{\mu}{r_1}}\!\left(\sqrt{\frac{2r_2}{r_1+r_2}}-1\right),\qquad
 * \Delta v_2=\sqrt{\frac{\mu}{r_2}}\!\left(1-\sqrt{\frac{2r_1}{r_1+r_2}}\right)
 * $$
 * $$
 * \Delta v_{\text{total}}=\Delta v_1+\Delta v_2,\qquad
 * t_t=\pi \sqrt{\frac{a_t^3}{\mu}}
 * $$
 *
 * **Conventions**
 * - Inputs in **SI**: ($ r_1,r_2 $) in **meters**, ($ \mu $) in **m³/s²**.
 * - The returned ($ \Delta v_1,\Delta v_2 $) are **magnitudes** (non-negative).
 *   Their **signs** (prograde/retrograde) are provided separately for clarity.
 * - Works for ($ r_2>r_1 $) (raise) and ($ r_2<r_1 $) (lower). If ($ r_1=r_2 $): ($ \Delta v $)s are 0 and ($ t_t $) is half the circular period.
 *
 * **Domain**
 * - ($ r_1>0,\ r_2>0,\ \mu>0 $)
 *
 * @param {number} r1 Initial circular-orbit radius (m).
 * @param {number} r2 Target circular-orbit radius (m).
 * @param {number} mu Standard gravitational parameter ($ \mu $) (m³/s²).
 * @returns {HohmannTransferReturnType}
 * Object with transfer semi-major axis `at` (m), burn magnitudes `dv1`, `dv2`, their sum `dvTotal` (m/s), transfer time `tTransfer` (s),
 * and burn directions `dir1`, `dir2`.
 *
 * @throws {TypeError}  If an input is not a number.
 * @throws {RangeError} If ($ r_1\le 0 $), ($ r_2\le 0 $), or ($ \mu\le 0 $), or a value is non-finite.
 *
 * @example
 * ```ts
 * // No code example here by request; see package docs for usage.
 * ```
 *
 * @group Manoeuvres
 */
export const hohmannTransfer = (
  r1: number,
  r2: number,
  mu: number
): HohmannTransferReturnType => {
  // Type & range checks
  if (
    typeof r1 !== 'number' ||
    typeof r2 !== 'number' ||
    typeof mu !== 'number'
  ) {
    throw new TypeError('r1, r2, and mu must be numbers.');
  }

  if (!Number.isFinite(r1) || !Number.isFinite(r2) || !Number.isFinite(mu)) {
    throw new RangeError('r1, r2, and mu must be finite.');
  }

  if (r1 <= 0 || r2 <= 0 || mu <= 0) {
    throw new RangeError(
      'r1 and r2 must be > 0 (m), mu must be > 0 (m^3/s^2).'
    );
  }

  const at = 0.5 * (r1 + r2);
  // Circular speeds at the endpoints
  const v1c = Math.sqrt(mu / r1);
  const v2c = Math.sqrt(mu / r2);
  // Transfer-ellipse speeds at peri/apo
  const vPeriTrans = Math.sqrt(mu * (2 / r1 - 1 / at)); // speed at r1 on transfer
  const vApoTrans = Math.sqrt(mu * (2 / r2 - 1 / at)); // speed at r2 on transfer
  // Signed burns relative to local circular velocity direction.
  // Positive => prograde (speed up), negative => retrograde (slow down).
  const signedDv1 = vPeriTrans - v1c;
  const signedDv2 = v2c - vApoTrans;
  const dv1 = Math.abs(signedDv1);
  const dv2 = Math.abs(signedDv2);
  const dvTotal = dv1 + dv2;
  const dir1: 'prograde' | 'retrograde' | 'none' =
    Math.abs(signedDv1) < 1e-15
      ? 'none'
      : signedDv1 > 0
        ? 'prograde'
        : 'retrograde';
  const dir2: 'prograde' | 'retrograde' | 'none' =
    Math.abs(signedDv2) < 1e-15
      ? 'none'
      : signedDv2 > 0
        ? 'prograde'
        : 'retrograde';
  // Half the period of the transfer ellipse
  const tTransfer = Math.PI * Math.sqrt((at * at * at) / mu);

  return { at, dv1, dv2, dvTotal, tTransfer, dir1, dir2 };
};

/**
 * Convenience: compute only the **semi-major axis** ($ a_t $) (m) of the Hohmann transfer.
 *
 * $$ a_t=\frac{r_1+r_2}{2} $$
 *
 * @param {number} r1 Initial circular-orbit radius (m).
 * @param {number} r2 Target circular-orbit radius (m).
 * @returns {number} ($ a_t $) (m).
 * @throws {TypeError|RangeError} On invalid inputs.
 * @group Manoeuvres
 */
export const hohmannSemiMajorAxis = (r1: number, r2: number): number => {
  if (typeof r1 !== 'number' || typeof r2 !== 'number')
    throw new TypeError('r1 and r2 must be numbers.');

  if (!Number.isFinite(r1) || !Number.isFinite(r2))
    throw new RangeError('r1 and r2 must be finite.');

  if (r1 <= 0 || r2 <= 0) throw new RangeError('r1 and r2 must be > 0 (m).');

  return 0.5 * (r1 + r2);
};

/**
 * Convenience: compute only the **transfer time** ($ t_t $) (s).
 *
 * $$ t_t=\pi \sqrt{\frac{a_t^3}{\mu}} $$
 *
 * @param {number} r1 Initial radius (m).
 * @param {number} r2 Target radius (m).
 * @param {number} mu Gravitational parameter (m³/s²).
 * @returns {number} Transfer time ($ t_t $) (s).
 * @throws {TypeError|RangeError} On invalid inputs.
 * @group Manoeuvres
 */
export const hohmannTransferTime = (
  r1: number,
  r2: number,
  mu: number
): number => {
  const at = hohmannSemiMajorAxis(r1, r2);

  if (typeof mu !== 'number') throw new TypeError('mu must be a number.');

  if (!Number.isFinite(mu) || mu <= 0)
    throw new RangeError('mu must be finite and > 0 (m^3/s^2).');

  return Math.PI * Math.sqrt((at * at * at) / mu);
};
