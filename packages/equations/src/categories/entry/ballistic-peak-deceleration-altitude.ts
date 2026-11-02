import {
  assertFinite,
  assertFlightPathAngle,
  assertPositive
} from './validate.js';

/**
 * Compute the **altitude of peak deceleration** in a ballistic entry, with the Allen–Eggers solution.
 *
 * $$
 * h^\ast = H \ln\frac{\rho_0 H}{\beta \sin\lvert\gamma\rvert}
 * $$
 *
 * Where:
 * - $ \beta $ is the ballistic coefficient (kg/m²)
 * - $ \gamma $ is the flight-path angle (rad)
 * - $ \rho_0 $ and $ H $ describe an exponential atmosphere, $ \rho = \rho_0 e^{-h/H} $
 *
 * **Units**
 * - Inputs: `gamma` in **radians**, `beta` in **kg/m²**, `rho0` in **kg/m³**, `H` in **m**.
 * - Output: $ h^\ast $ in **m**.
 *
 * ::: info Notes
 *
 * - Unlike the size of the peak ({@link ballisticPeakDeceleration}), its altitude does depend on the vehicle: a higher $ \beta $ peaks lower down.
 * - A negative result means the vehicle would reach the surface before its deceleration peaks: it hits the ground still fast.
 * - Same assumptions as {@link ballisticEntrySpeed}.
 *
 * :::
 *
 * @param gamma - Flight-path angle $ \gamma $ in **radians** (finite, non-zero, within [-π/2, π/2]).
 * @param beta - Ballistic coefficient $ \beta $ in **kg/m²** (finite, > 0).
 * @param rho0 - Reference density $ \rho_0 $ in **kg/m³** (finite, > 0).
 * @param H - Scale height $ H $ in **m** (finite, > 0).
 * @returns Altitude of peak deceleration $ h^\ast $ in **m** (negative if below the surface).
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `beta`, `rho0` or `H` is `<= 0`, or `gamma` is zero or past vertical.
 * @group Entry
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // A 322 kg/m² capsule, 6.5° below horizontal, in Earth's atmosphere
 * const h = ballisticPeakDecelerationAltitude((-6.5 * Math.PI / 180) as Radians, 322, 1.225, 7200);
 * // h ≈ 39.5 km
 * ```
 *
 * @see {@link ballisticPeakDeceleration}
 * @see {@link ballisticEntrySpeed}
 */
export const ballisticPeakDecelerationAltitude = (
  gamma: number,
  beta: number,
  rho0: number,
  H: number
): number => {
  assertFinite([
    ['gamma', gamma],
    ['beta', beta],
    ['rho0', rho0],
    ['H', H]
  ]);
  assertPositive([
    ['beta', beta],
    ['rho0', rho0],
    ['H', H]
  ]);
  assertFlightPathAngle(gamma);

  return H * Math.log((rho0 * H) / (beta * Math.sin(Math.abs(gamma))));
};
