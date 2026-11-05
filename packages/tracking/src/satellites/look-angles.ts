import { SPEED_OF_LIGHT_M_PER_S } from '@interstellar-tools/constants';
import { geodeticToBodyFixed } from '@interstellar-tools/equations';
import type {
  GeodeticCoordinatesInterface,
  LookAnglesInterface,
  MeanElementsInterface,
  Radians,
  StateVectorInterface
} from '@interstellar-tools/types';

import { temeToEarthFixed } from './earth-fixed.js';
import { propagate } from './propagate.js';
import { assertVector } from './validate.js';
import { A, E_SQUARED } from './wgs84.js';

const TWO_PI = 2 * Math.PI;

/**
 * The **look angles** to a satellite from an observer, given the satellite's
 * Earth-fixed position and velocity: azimuth, elevation, range and range rate.
 * {@link lookAngles} does the same from orbital elements.
 *
 * The line of sight $ \boldsymbol{\rho} = \mathbf{r} - \mathbf{r}_{\mathrm{obs}} $
 * is turned into the observer's east-north-up frame:
 *
 * $$
 * \begin{aligned}
 * \rho_E &= -\sin\lambda\,\rho_x + \cos\lambda\,\rho_y \\
 * \rho_N &= -\sin\varphi\cos\lambda\,\rho_x - \sin\varphi\sin\lambda\,\rho_y + \cos\varphi\,\rho_z \\
 * \rho_U &= \cos\varphi\cos\lambda\,\rho_x + \cos\varphi\sin\lambda\,\rho_y + \sin\varphi\,\rho_z
 * \end{aligned}
 * $$
 *
 * and then
 *
 * $$
 * A = \operatorname{atan2}(\rho_E, \rho_N), \qquad
 * E = \operatorname{atan2}\!\left(\rho_U, \sqrt{\rho_E^2 + \rho_N^2}\right), \qquad
 * \dot\rho = \frac{\boldsymbol{\rho}\cdot\mathbf{v}}{\lVert\boldsymbol{\rho}\rVert}
 * $$
 *
 * Where:
 * - $ \varphi $, $ \lambda $ are the observer's geodetic latitude and longitude (rad)
 * - $ \mathbf{r} $, $ \mathbf{v} $ are the satellite's Earth-fixed position (m) and velocity (m/s)
 * - $ \mathbf{r}_{\mathrm{obs}} $ is the observer's Earth-fixed position on WGS 84 (m)
 *
 * **Units**
 * - Inputs: `r` in **m**, `v` in **m/s**, Earth-fixed as {@link temeToEarthFixed} returns them; the observer's `phi` and `lambda` in **radians** and `h` in **m**.
 * - Output: `azimuth` and `elevation` in **radians**, `range` in **m**, `rangeRate` in **m/s**.
 *
 * ::: info Notes
 *
 * - The elevation is geometric: refraction lifts objects near the horizon by
 *   about half a degree, which this leaves out.
 * - The observer turns with Earth, so `v` must be the Earth-fixed velocity,
 *   relative to the ground, not the inertial one.
 *
 * :::
 *
 * @param state - The satellite's Earth-fixed position `r` in **m** and velocity `v` in **m/s**.
 * @param observer - The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**.
 * @returns The azimuth, elevation, range and range rate: see {@link LookAnglesInterface}.
 * @throws {TypeError} If `r` or `v` is not three finite numbers, or the observer's coordinates aren't finite.
 * @throws {RangeError} If the observer's `phi` is outside [-π/2, π/2], or the satellite is at the observer.
 * @group Satellites
 *
 * @example
 * ```ts
 * const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
 * const date = new Date('2026-11-04T12:00:00Z');
 * const state = temeToEarthFixed(propagate(iss, date), date);
 *
 * lookAnglesFromEarthFixed(state, oslo); // { azimuth, elevation, range, rangeRate }
 * ```
 *
 * @see {@link lookAngles}
 */
export const lookAnglesFromEarthFixed = (
  state: StateVectorInterface,
  observer: GeodeticCoordinatesInterface
): LookAnglesInterface => {
  assertVector('r', state?.r);
  assertVector('v', state?.v);

  const { phi, lambda, h } = observer;
  const site = geodeticToBodyFixed(phi, lambda, h, A, E_SQUARED);
  const rho = state.r.map((x, k) => x - site[k]!) as [number, number, number];
  const range = Math.hypot(...rho);

  if (range === 0)
    throw new RangeError('The satellite must not be at the observer.');

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinLambda = Math.sin(lambda);
  const cosLambda = Math.cos(lambda);
  const east = -sinLambda * rho[0] + cosLambda * rho[1];
  const north =
    -sinPhi * cosLambda * rho[0] -
    sinPhi * sinLambda * rho[1] +
    cosPhi * rho[2];
  const up =
    cosPhi * cosLambda * rho[0] + cosPhi * sinLambda * rho[1] + sinPhi * rho[2];
  const angle = Math.atan2(east, north);
  // A tiny negative angle, a rounding error just west of north, rounds up to
  // 2π: that is north, 0
  const azimuth = angle < 0 ? angle + TWO_PI : angle;

  return {
    azimuth: (azimuth < TWO_PI ? azimuth : 0) as Radians,
    elevation: Math.atan2(up, Math.hypot(east, north)) as Radians,
    range,
    rangeRate:
      (rho[0] * state.v[0] + rho[1] * state.v[1] + rho[2] * state.v[2]) / range
  };
};

/**
 * The **look angles** to a satellite from a ground observer at a moment:
 * where to point an antenna or a camera (azimuth and elevation), how far away
 * the satellite is (range), and how fast that changes (range rate, for the
 * Doppler shift).
 *
 * Propagates the elements with SGP4 ({@link propagate}), turns the result
 * with Earth ({@link temeToEarthFixed}) and finds the direction in the
 * observer's local frame ({@link lookAnglesFromEarthFixed}).
 *
 * ::: info Notes
 *
 * - The satellite is above the horizon while `elevation` is above 0; in
 *   practice trees, buildings and refraction set the limit a few degrees
 *   higher.
 * - As accurate as the elements: about 1 km at the epoch, a few hundredths of
 *   a degree for a satellite 1 000 km away, growing by a few kilometres a day.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param observer - The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**.
 * @param date - The moment, as a `Date`.
 * @returns The azimuth, elevation, range and range rate: see {@link LookAnglesInterface}.
 * @throws {TypeError} If `date` is not a valid `Date`, or a value of `elements` or `observer` is not a finite number.
 * @throws {RangeError} If the observer's `phi` is outside [-π/2, π/2], or SGP4 fails at that time, as in {@link propagate}.
 * @group Satellites
 *
 * @example
 * ```ts
 * const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
 * const { azimuth, elevation } = lookAngles(iss, oslo, new Date());
 *
 * elevation > 0; // the ISS is above Oslo's horizon
 * ```
 *
 * @see {@link lookAnglesFromEarthFixed}
 * @see {@link dopplerShift}
 */
export const lookAngles = (
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  date: Date
): LookAnglesInterface =>
  lookAnglesFromEarthFixed(
    temeToEarthFixed(propagate(elements, date), date),
    observer
  );

/**
 * The **Doppler shift** of a radio signal from a satellite: how far the
 * received frequency is from the transmitted one, as the satellite approaches
 * or leaves.
 *
 * $$
 * \Delta f = -f\,\frac{\dot\rho}{c}
 * $$
 *
 * Where:
 * - $ f $ is the transmitted frequency (Hz)
 * - $ \dot\rho $ is the range rate (m/s), from {@link lookAngles}
 * - $ c $ is the speed of light, 299 792 458 m/s
 *
 * **Units**
 * - Inputs: `frequency` in **Hz**, `rangeRate` in **m/s**.
 * - Output: $ \Delta f $ in **Hz**: positive while the satellite approaches.
 *
 * ::: info Notes
 *
 * - First order in $ \dot\rho / c $: relativistic terms are below a
 *   millihertz for satellites in Earth orbit.
 * - A ground station tunes to $ f + \Delta f $ to receive a downlink, and
 *   transmits on $ f - \Delta f $ for the satellite to hear an uplink on $ f $.
 *
 * :::
 *
 * ::: practice ISS, amateur radio downlink
 *
 * **+3.4 kHz**
 *
 * _145.800 MHz, the ISS approaching at 7 km/s at the start of a low pass_
 *
 * The shift sweeps through 0 at the closest approach to -3.4 kHz as it
 * leaves: radio operators retune through the pass.
 *
 * ```ts
 * dopplerShift(145_800_000, -7000); // ≈ 3 404 Hz
 * ```
 *
 * :::
 *
 * @param frequency - Transmitted frequency $ f $ in **Hz** (finite, > 0).
 * @param rangeRate - Range rate $ \dot\rho $ in **m/s** (finite, slower than light).
 * @returns The Doppler shift $ \Delta f $ in **Hz**.
 * @throws {TypeError} If an input is not a finite number.
 * @throws {RangeError} If `frequency <= 0`, or `rangeRate` is as fast as light or faster.
 * @group Satellites
 *
 * @example
 * ```ts
 * dopplerShift(437_000_000, 5000); // ≈ -7 288 Hz: a UHF signal from a leaving satellite
 * ```
 *
 * @see {@link lookAngles}
 */
export const dopplerShift = (frequency: number, rangeRate: number): number => {
  for (const [name, value] of [
    ['frequency', frequency],
    ['rangeRate', rangeRate]
  ] as const)
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

  if (frequency <= 0)
    throw new RangeError(`frequency must be > 0. Received: ${frequency}`);

  if (Math.abs(rangeRate) >= SPEED_OF_LIGHT_M_PER_S)
    throw new RangeError(
      `rangeRate must be slower than light. Received: ${rangeRate}`
    );

  return (-frequency * rangeRate) / SPEED_OF_LIGHT_M_PER_S;
};
