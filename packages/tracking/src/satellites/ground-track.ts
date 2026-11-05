import type {
  GeodeticCoordinatesInterface,
  MeanElementsInterface,
  Radians
} from '@interstellar-tools/types';

import { subSatellitePoint } from './earth-fixed.js';
import { assertDate } from './validate.js';
import { A } from './wgs84.js';

const TWO_PI = 2 * Math.PI;
// A track longer than this many points is almost certainly a mistaken step
const MAX_POINTS = 1_000_000;
// Wrap a longitude to (-π, π]
const wrap = (lambda: number): Radians => {
  // % is exact, so only the last step rounds, and only as far as ±π
  let wrapped = lambda % TWO_PI;

  if (wrapped > Math.PI) wrapped -= TWO_PI;
  else if (wrapped <= -Math.PI) wrapped += TWO_PI;

  // -π and π are the same meridian
  return (wrapped === -Math.PI ? Math.PI : wrapped) as Radians;
};

/**
 * The **ground track** of a satellite: the points on the ground directly
 * below it over time, ready to draw on a flat map.
 *
 * Steps {@link subSatellitePoint} from `from` to `to`, and splits the track
 * where it crosses the antimeridian, ±180°: each segment ends at the edge of
 * the map, and the next starts at the other edge, at the latitude where the
 * track crosses it. A renderer then never draws a line across the whole map.
 *
 * ::: info Notes
 *
 * - **Westward drift.** Each orbit's track lies west of the one before, by
 *   the angle Earth turns in an orbit: about 23° for the ISS.
 * - A geostationary satellite's track is a point, or a small figure eight if
 *   its orbit is a little inclined.
 * - Each point's `h` is the satellite's height above the WGS 84 ellipsoid.
 * - Pick the step to suit the map: a minute draws a smooth track for a low
 *   orbit. The track is linear between points, so a step much longer than a
 *   few minutes cuts corners.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param from - Start of the track, as a `Date`.
 * @param to - End of the track, as a `Date` after `from`.
 * @param step - Time between points in **s** (finite, > 0): 60 by default.
 * @returns The track, as segments of points: geodetic latitude `phi` and longitude `lambda` in **radians**, longitude in (-π, π], and height `h` in **m**.
 * @throws {TypeError} If `from` or `to` is not a valid `Date`, `step` is not a finite number, or a value of `elements` is not a finite number.
 * @throws {RangeError} If `to` is not after `from`, `step <= 0`, the track would have more than a million points, or SGP4 fails along it, as in {@link propagate}.
 * @group Satellites
 *
 * @example
 * ```ts
 * const now = new Date();
 * const later = new Date(now.getTime() + 92 * 60_000); // one ISS orbit
 *
 * for (const segment of groundTrack(iss, now, later))
 *   drawLine(segment.map(({ phi, lambda }) => [toDeg(lambda), toDeg(phi)]));
 * ```
 *
 * @see {@link subSatellitePoint}
 * @see {@link coverageFootprint}
 */
export const groundTrack = (
  elements: MeanElementsInterface,
  from: Date,
  to: Date,
  step = 60
): GeodeticCoordinatesInterface[][] => {
  const start = assertDate('from', from);
  const end = assertDate('to', to);

  if (end <= start)
    throw new RangeError(
      `to must be after from. Received: ${to.toISOString()}, from ${from.toISOString()}`
    );

  if (!Number.isFinite(step))
    throw new TypeError(`step must be a finite number. Received: ${step}`);

  if (step <= 0) throw new RangeError(`step must be > 0. Received: ${step}`);

  const stepMs = step * 1000;
  const count = Math.ceil((end - start) / stepMs);

  if (count >= MAX_POINTS)
    throw new RangeError(
      `The track would have more than ${MAX_POINTS} points: take a longer step. Received: ${step} s`
    );

  const segments: GeodeticCoordinatesInterface[][] = [];

  let segment: GeodeticCoordinatesInterface[] = [];
  let previous: GeodeticCoordinatesInterface | undefined;

  for (let k = 0; k <= count; k++) {
    const point = subSatellitePoint(
      elements,
      new Date(Math.min(start + k * stepMs, end))
    );

    if (previous) {
      const jump = point.lambda - previous.lambda;

      // The shorter way round crosses ±180°: end the segment at the edge,
      // and start the next one at the other edge, at the same latitude
      if (Math.abs(jump) > Math.PI) {
        const edge = Math.sign(previous.lambda) * Math.PI;
        const unwrapped = point.lambda + Math.sign(previous.lambda) * TWO_PI;
        const f = (edge - previous.lambda) / (unwrapped - previous.lambda);
        const phi = (previous.phi + f * (point.phi - previous.phi)) as Radians;
        const h = previous.h + f * (point.h - previous.h);

        segment.push({ phi, lambda: edge as Radians, h });
        segments.push(segment);
        segment = [{ phi, lambda: -edge as Radians, h }];
      }
    }

    segment.push(point);
    previous = point;
  }

  segments.push(segment);

  return segments;
};

/**
 * The **angular radius of a satellite's footprint**: how far from the point
 * below it, as an angle at Earth's centre, the satellite is above the minimum
 * elevation.
 *
 * $$
 * \lambda_0 = \arccos\!\left(\frac{R\cos\varepsilon}{R + h}\right) - \varepsilon
 * $$
 *
 * Where:
 * - $ R $ is Earth's equatorial radius, 6 378 137 m (WGS 84)
 * - $ h $ is the satellite's height (m)
 * - $ \varepsilon $ is the minimum elevation (rad)
 *
 * **Units**
 * - Inputs: `height` in **m**, `minElevation` in **radians**.
 * - Output: $ \lambda_0 $ in **radians**; times $ R $, the radius along the ground in m.
 *
 * ::: info Notes
 *
 * - With `minElevation` 0, it's the distance to the horizon,
 *   `horizonSurfaceDistance` in `@interstellar-tools/equations`, over $ R $.
 * - It grows with height, toward $ 90^\circ - \varepsilon $: even from far
 *   away, a satellite sees less than half of Earth.
 *
 * :::
 *
 * @param height - Height $ h $ above the ground in **m** (finite, > 0).
 * @param minElevation - Minimum elevation $ \varepsilon $ in **radians** (in [0, π/2), default 0).
 * @returns The angular radius $ \lambda_0 $ in **radians**.
 * @throws {TypeError} If an input is not a finite number.
 * @throws {RangeError} If `height <= 0`, or `minElevation` is outside [0, π/2).
 * @group Satellites
 *
 * @example
 * ```ts
 * footprintRadius(420_000); // ≈ 0.353 rad, 20.2°: 2 252 km, the ISS's horizon
 * footprintRadius(35_786_000, toRad(10)); // ≈ 1.23 rad, 71°: a geostationary satellite
 * ```
 *
 * @see {@link coverageFootprint}
 */
export const footprintRadius = (
  height: number,
  minElevation: Radians = 0 as Radians
): Radians => {
  for (const [name, value] of [
    ['height', height],
    ['minElevation', minElevation]
  ] as const)
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

  if (height <= 0)
    throw new RangeError(`height must be > 0. Received: ${height}`);

  if (minElevation < 0 || minElevation >= Math.PI / 2)
    throw new RangeError(
      `minElevation must be in [0, π/2). Received: ${minElevation}`
    );

  const c = (A * Math.cos(minElevation)) / (A + height);

  // atan2 rather than arccos, which loses digits close to 1
  return (Math.atan2(Math.sqrt(1 - c * c), c) - minElevation) as Radians;
};

/**
 * The **coverage footprint** of a satellite: the circle on the ground from
 * which it's above a minimum elevation, as a polygon of latitudes and
 * longitudes, ready to draw on a map.
 *
 * The circle's angular radius is {@link footprintRadius}, and its points are
 * the destinations at that distance from the point below the satellite, in
 * every direction:
 *
 * $$
 * \begin{aligned}
 * \varphi_k &= \arcsin(\sin\varphi\cos\lambda_0 + \cos\varphi\sin\lambda_0\cos\alpha_k) \\
 * \lambda_k &= \lambda + \operatorname{atan2}(\sin\alpha_k\sin\lambda_0\cos\varphi,\ \cos\lambda_0 - \sin\varphi\sin\varphi_k)
 * \end{aligned}
 * $$
 *
 * Where:
 * - $ \varphi $, $ \lambda $ are the latitude and longitude below the satellite (rad)
 * - $ \lambda_0 $ is the footprint's angular radius (rad)
 * - $ \alpha_k = 2\pi k / n $ are the directions, clockwise from north
 *
 * **Units**
 * - Inputs: the position's `phi` and `lambda` in **radians** and `h` in **m**; `minElevation` in **radians**.
 * - Output: the polygon's points, `phi` and `lambda` in **radians**, longitude in (-π, π], and `h` 0.
 *
 * ::: info Notes
 *
 * - On a sphere of Earth's equatorial radius: the flattening moves the edge by
 *   a fraction of a percent.
 * - **Near the antimeridian or a pole**, the polygon wraps: points jump from
 *   one edge of a flat map to the other, or circle the pole. Split it, or
 *   draw it on an azimuthal projection, before filling it.
 * - Its area on the sphere is $ 2\pi R^2 (1 - \cos\lambda_0) $; with many
 *   points, `sphericalPolygonArea` in `@interstellar-tools/equations` gives
 *   the same.
 *
 * :::
 *
 * @param position - The point below the satellite and its height, as {@link subSatellitePoint} returns them.
 * @param minElevation - Minimum elevation in **radians** (in [0, π/2), default 0).
 * @param points - Number of points on the circle (an integer, at least 3): 72 by default, one every 5°.
 * @returns The polygon, in order clockwise from north: geodetic latitude `phi` and longitude `lambda` in **radians**, and `h` 0.
 * @throws {TypeError} If a value is not a finite number, or `points` is not an integer.
 * @throws {RangeError} If `phi` is outside [-π/2, π/2], `h <= 0`, `minElevation` is outside [0, π/2), or `points < 3`.
 * @group Satellites
 *
 * @example
 * ```ts
 * const below = subSatellitePoint(iss, new Date());
 *
 * // Where the ISS is at least 10° above the horizon
 * const footprint = coverageFootprint(below, toRad(10));
 * ```
 *
 * @see {@link footprintRadius}
 * @see {@link groundTrack}
 */
export const coverageFootprint = (
  position: GeodeticCoordinatesInterface,
  minElevation: Radians = 0 as Radians,
  points = 72
): GeodeticCoordinatesInterface[] => {
  const { phi, lambda, h } = position;

  for (const [name, value] of [
    ['phi', phi],
    ['lambda', lambda]
  ] as const)
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

  if (Math.abs(phi) > Math.PI / 2)
    throw new RangeError(`phi must be in [-π/2, π/2]. Received: ${phi}`);

  if (!Number.isInteger(points))
    throw new TypeError(`points must be an integer. Received: ${points}`);

  if (points < 3)
    throw new RangeError(`points must be at least 3. Received: ${points}`);

  const radius = footprintRadius(h, minElevation);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinRadius = Math.sin(radius);
  const cosRadius = Math.cos(radius);

  return Array.from({ length: points }, (_, k) => {
    const azimuth = (TWO_PI * k) / points;
    const sinPhiK = sinPhi * cosRadius + cosPhi * sinRadius * Math.cos(azimuth);

    return {
      phi: Math.asin(sinPhiK) as Radians,
      lambda: wrap(
        lambda +
          Math.atan2(
            Math.sin(azimuth) * sinRadius * cosPhi,
            cosRadius - sinPhi * sinPhiK
          )
      ),
      h: 0
    };
  });
};
