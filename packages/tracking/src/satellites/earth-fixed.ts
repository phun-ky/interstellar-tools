import {
  bodyFixedToGeodetic,
  greenwichMeanSiderealTime
} from '@interstellar-tools/equations';
import type {
  GeodeticCoordinatesInterface,
  MeanElementsInterface,
  StateVectorInterface
} from '@interstellar-tools/types';

import { propagate } from './propagate.js';
import { assertVector } from './validate.js';
import { A, E_SQUARED } from './wgs84.js';

// Earth's rotation rate in rad/s, as Vallado et al. (2006) use it to turn TEME
// velocities into Earth-fixed ones
const OMEGA_EARTH = 7.29211514670698e-5;

/**
 * Turn a position and velocity in **TEME**, the frame SGP4 works in, into
 * **Earth-fixed** coordinates, by turning them with Earth through Greenwich
 * mean sidereal time.
 *
 * $$
 * \mathbf{r}_{\mathrm{EF}} = R_z(\theta_{\mathrm{GMST}})\,\mathbf{r}_{\mathrm{TEME}},
 * \qquad
 * \mathbf{v}_{\mathrm{EF}} = R_z(\theta_{\mathrm{GMST}})\,\mathbf{v}_{\mathrm{TEME}} - \boldsymbol{\omega}_\oplus \times \mathbf{r}_{\mathrm{EF}}
 * $$
 *
 * Where:
 * - $ \theta_{\mathrm{GMST}} $ is Greenwich mean sidereal time (rad), from `greenwichMeanSiderealTime` in `@interstellar-tools/equations`
 * - $ \boldsymbol{\omega}_\oplus $ is Earth's rotation, $ 7.292115 \times 10^{-5} $ rad/s about the z axis
 *
 * **Units**
 * - Inputs: `r` in **m**, `v` in **m/s**, and a `Date`.
 * - Output: `r` in **m**, `v` in **m/s**, Earth-fixed: x through the prime meridian, z along the rotation axis.
 *
 * ::: info Notes
 *
 * - **Polar motion is ignored**: the result is the pseudo Earth-fixed frame
 *   (PEF), which differs from ITRF, the frame of GPS coordinates, by up to
 *   about 15 m at the surface as the pole wanders.
 * - **UT1 is taken as UTC**, as in `greenwichMeanSiderealTime`: up to 0.9 s
 *   of Earth's rotation, about 400 m on the equator.
 * - The velocity is relative to the rotating Earth, as a ground station sees
 *   it, not inertial.
 *
 * :::
 *
 * @param state - The position `r` in **m** and velocity `v` in **m/s** in TEME, as {@link propagate} returns them.
 * @param date - The moment of the position, as a `Date`.
 * @returns The Earth-fixed position `r` in **m** and velocity `v` in **m/s**.
 * @throws {TypeError} If `r` or `v` is not three finite numbers, or `date` is not a valid `Date`.
 * @group Satellites
 *
 * @example
 * ```ts
 * const date = new Date('2026-11-04T12:00:00Z');
 * const { r } = temeToEarthFixed(propagate(iss, date), date);
 * ```
 *
 * @see {@link subSatellitePoint}
 * @see https://celestrak.org/publications/AIAA/2006-6753/ Vallado, Crawford, Hujsak & Kelso (2006), Revisiting Spacetrack Report #3, section on TEME
 */
export const temeToEarthFixed = (
  state: StateVectorInterface,
  date: Date
): StateVectorInterface => {
  assertVector('r', state?.r);
  assertVector('v', state?.v);

  const theta = greenwichMeanSiderealTime(date);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const [x, y, z] = state.r;
  const [vx, vy, vz] = state.v;
  const xe = cos * x + sin * y;
  const ye = -sin * x + cos * y;

  return {
    r: [xe, ye, z],
    v: [
      cos * vx + sin * vy + OMEGA_EARTH * ye,
      -sin * vx + cos * vy - OMEGA_EARTH * xe,
      vz
    ]
  };
};

/**
 * Find the point on Earth **under a satellite** at a moment: the geodetic
 * latitude, longitude and height on the WGS 84 ellipsoid.
 *
 * Propagates the elements with SGP4 ({@link propagate}), turns the position
 * with Earth ({@link temeToEarthFixed}) and converts it to geodetic
 * coordinates (`bodyFixedToGeodetic` in `@interstellar-tools/equations`).
 * Taking it at a series of times draws the satellite's **ground track**.
 *
 * ::: info Notes
 *
 * - The point is where the normal to the ellipsoid through the satellite
 *   meets it: the geodetic latitude on maps and GPS receivers.
 * - The height is above the WGS 84 ellipsoid, not above the ground or sea
 *   level.
 * - It's as accurate as the elements: about 1 km at the epoch, growing a few
 *   kilometres a day.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param date - The moment, as a `Date`.
 * @returns `phi`, the geodetic latitude in **radians**, `lambda`, the longitude in **radians** (east positive, in (-π, π]), and `h`, the height in **m**.
 * @throws {TypeError} If `date` is not a valid `Date`, or a value of `elements` is not a finite number.
 * @throws {RangeError} If SGP4 fails at that time, as in {@link propagate}.
 * @group Satellites
 *
 * @example
 * ```ts
 * const { phi, lambda, h } = subSatellitePoint(iss, new Date('2026-11-04T12:00:00Z'));
 * // |phi| up to 51.6°, the ISS's inclination; h about 420 km
 * ```
 *
 * @see {@link temeToEarthFixed}
 */
export const subSatellitePoint = (
  elements: MeanElementsInterface,
  date: Date
): GeodeticCoordinatesInterface => {
  const { r } = temeToEarthFixed(propagate(elements, date), date);

  return bodyFixedToGeodetic(r[0], r[1], r[2], A, E_SQUARED);
};
