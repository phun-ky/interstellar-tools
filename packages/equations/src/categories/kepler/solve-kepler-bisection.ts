import { Radians } from '@interstellar-tools/types';

/**
 * Solve **Kepler's equation** for the **eccentric anomaly** ($ E $) via **bisection** (elliptic case: ($ 0 \le e < 1 $)).
 *
 * **Equation**
 *
 * $$
 * M = E - e\sin E,\qquad F(E)=E-e\sin E - M
 * $$
 *
 * **Bracketing & normalization**
 * - Normalize ($ M $) to ($ [0,2\pi) $).
 * - Use the bracket ($ [0,2\pi] $). Then ($ F(0)=-M\le 0 $) and ($ F(2\pi)=2\pi-M\ge 0 $).
 * - For ($ 0\le e<1 $), ($ F'(E)=1-e\cos E \ge 1-e > 0 $) ⇒ **strictly increasing** ⇒ unique root.
 *
 * **Stopping criteria (either)**
 * - **Residual**: ($ |F(E)| < \text{tolerance} $)
 * - **Bracket width**: ($ \tfrac{1}{2}(E_{\text{high}}-E_{\text{low}}) < \text{tolerance} $)
 *
 * @param {Radians} M Mean anomaly (radians). Can be any real; will be normalized to ($ [0,2\pi) $).
 * @param {number} e Eccentricity, must satisfy ($ 0 \le e < 1 $) (elliptic).
 * @param {number} maxIter Maximum iterations (must be > 0).
 * @param {number} tolerance Convergence tolerance for both residual and half-interval (must be > 0, radians).
 * @returns {Radians} Eccentric anomaly ($ E $) in **radians**, normalized to ($ [0,2\pi) $).
 * @throws {TypeError|RangeError} If inputs are non-finite or out of domain.
 *
 * @example
 * ```ts
 * const E = solveKeplerBisection((Math.PI/3) as Radians, 0.5, 100, 1e-12);
 * ```
 *
 * @group Kepler Solvers
 */
export const solveKeplerBisection = (
  M: Radians,
  e: number,
  maxIter: number,
  tolerance: number
): Radians => {
  if (typeof M !== 'number')
    throw new TypeError('M must be a number (radians).');

  if (!Number.isFinite(M)) throw new RangeError('M must be finite (radians).');

  if (typeof e !== 'number') throw new TypeError('e must be a number.');

  if (!Number.isFinite(e) || e < 0 || e >= 1)
    throw new RangeError('e must satisfy 0 ≤ e < 1 (elliptic).');

  if (!Number.isFinite(maxIter) || maxIter <= 0)
    throw new RangeError('maxIter must be a positive number.');

  if (!Number.isFinite(tolerance) || tolerance <= 0)
    throw new RangeError(
      'tolerance must be a finite, positive number (radians).'
    );

  const TWO_PI = 2 * Math.PI;
  // Normalize M to [0, 2π)
  const Mm = ((Number(M) % TWO_PI) + TWO_PI) % TWO_PI;

  // Bracket [0, 2π]
  let Elow = 0;
  let Ehigh = TWO_PI;

  // Early exit if an endpoint already solves it (normalize 2π → 0)
  const Flow = -Mm; // F(0) = -M

  if (Math.abs(Flow) < tolerance) return 0 as Radians;

  const Fhigh = TWO_PI - Mm; // F(2π) = 2π - M

  if (Math.abs(Fhigh) < tolerance) return 0 as Radians; // 2π ≡ 0

  // Bisection
  let E = (Elow + Ehigh) / 2;

  for (let i = 0; i < maxIter; i++) {
    const F = E - e * Math.sin(E) - Mm;

    // Residual stop
    if (Math.abs(F) < tolerance) {
      return (E % TWO_PI) as Radians;
    }

    // Update bracket based on sign of F (monotone increasing ⇒ standard rule)
    if (F > 0) {
      Ehigh = E;
    } else {
      Elow = E;
    }

    // Interval stop
    const halfWidth = (Ehigh - Elow) / 2;

    if (halfWidth < tolerance) {
      const Emid = (Elow + Ehigh) / 2;

      return (Emid % TWO_PI) as Radians;
    }

    E = (Elow + Ehigh) / 2;
  }

  // Best approximation if maxIter reached

  return (E % TWO_PI) as Radians;
};
