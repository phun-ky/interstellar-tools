import type {
  GeodeticCoordinatesInterface,
  GlobePointInterface,
  MeanElementsInterface,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { temeToEarthFixed } from './earth-fixed.js';
import { propagate } from './propagate.js';
import { assertDate } from './validate.js';

// A path longer than this many points is almost certainly a mistaken step
const MAX_POINTS = 1_000_000;

/** Options for {@link orbitPath3D}. */
export interface OrbitPath3DOptionsInterface {
  /** Time between points in **s**: 60 by default. */
  step?: number;
  /** `'earth-fixed'`, turning with Earth, the default; or `'inertial'`, SGP4's TEME frame, where the orbit stays still. */
  frame?: 'earth-fixed' | 'inertial';
  /** The length of one unit of the result, in **m**: 1 by default. Earth's radius, 6 378 137, gives Earth radii, for a globe of radius 1. */
  unit?: number;
}

/** Options for {@link globeView}. */
export interface GlobeViewOptionsInterface {
  /** Latitude of the point at the centre of the view, in **radians** (in [-π/2, π/2]): 0 by default. */
  phi0?: Radians;
  /** Longitude of the point at the centre of the view, in **radians**: 0 by default. */
  lambda0?: Radians;
}

/**
 * The **path of a satellite in 3D**, for drawing its orbit around a globe:
 * positions from Earth's centre over time, in the frame and unit a renderer
 * wants.
 *
 * Propagates the elements with SGP4 ({@link propagate}) from `from` to `to`,
 * and turns the positions with Earth ({@link temeToEarthFixed}) unless the
 * inertial frame is asked for.
 *
 * ::: info Notes
 *
 * - **Earth-fixed or inertial.** In the Earth-fixed frame, the ground stays
 *   still under the path: the path is the ground track, lifted to the
 *   satellite's height, and a geostationary satellite is a point. In the
 *   inertial frame, the orbit stays still while Earth turns under it: draw
 *   the globe turned by `greenwichMeanSiderealTime`.
 * - Axes: x toward 0° longitude (Earth-fixed) or the vernal equinox
 *   (inertial), z toward the North Pole. Many 3D engines put y up: swap the
 *   axes to suit.
 * - Positions are divided by `unit`: pass Earth's radius to draw on a globe of
 *   radius 1.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param from - Start of the path, as a `Date`.
 * @param to - End of the path, as a `Date` after `from`.
 * @param options - `step` in **s** (finite, > 0), `frame`, and `unit` in **m** (finite, > 0).
 * @returns The positions, at `from`, every `step` after it, and at `to`, in units of `unit`.
 * @throws {TypeError} If `from` or `to` is not a valid `Date`, `step` or `unit` is not a finite number, or a value of `elements` is not a finite number.
 * @throws {RangeError} If `to` is not after `from`, `step` or `unit` is not > 0, `frame` is neither `'earth-fixed'` nor `'inertial'`, the path would have more than a million points, or SGP4 fails along it, as in {@link propagate}.
 * @group Satellites
 *
 * @example
 * ```ts
 * import { WGS84 } from '@interstellar-tools/constants';
 *
 * const now = new Date();
 * const later = new Date(now.getTime() + 92 * 60_000);
 *
 * // One ISS orbit, in Earth radii, around a globe of radius 1
 * const path = orbitPath3D(iss, now, later, {
 *   frame: 'inertial',
 *   unit: WGS84.equatorialRadius.value
 * });
 * ```
 *
 * @see {@link globeView}
 * @see {@link groundTrack}
 */
export const orbitPath3D = (
  elements: MeanElementsInterface,
  from: Date,
  to: Date,
  options: OrbitPath3DOptionsInterface = {}
): Vector3DTupleType[] => {
  const start = assertDate('from', from);
  const end = assertDate('to', to);
  const { step = 60, frame = 'earth-fixed', unit = 1 } = options;

  if (end <= start)
    throw new RangeError(
      `to must be after from. Received: ${to.toISOString()}, from ${from.toISOString()}`
    );

  for (const [name, value] of [
    ['step', step],
    ['unit', unit]
  ] as const) {
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

    if (value <= 0)
      throw new RangeError(`${name} must be > 0. Received: ${value}`);
  }

  if (frame !== 'earth-fixed' && frame !== 'inertial')
    throw new RangeError(
      `frame must be 'earth-fixed' or 'inertial'. Received: ${String(frame)}`
    );

  const stepMs = step * 1000;
  const count = Math.ceil((end - start) / stepMs);

  if (count >= MAX_POINTS)
    throw new RangeError(
      `The path would have more than ${MAX_POINTS} points: take a longer step. Received: ${step} s`
    );

  return Array.from({ length: count + 1 }, (_, k) => {
    const date = new Date(Math.min(start + k * stepMs, end));
    const state = propagate(elements, date);
    const { r } = frame === 'inertial' ? state : temeToEarthFixed(state, date);

    return [r[0] / unit, r[1] / unit, r[2] / unit];
  });
};

/**
 * Points on a **globe view**: the orthographic projection, a globe seen from
 * far away, with the points on the far side marked hidden. It draws ground
 * tracks and footprints on a 2D globe, without WebGL.
 *
 * $$
 * \begin{aligned}
 * x &= R\cos\varphi\sin(\lambda - \lambda_0) \\
 * y &= R\,(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)) \\
 * \cos c &= \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0)
 * \end{aligned}
 * $$
 *
 * A point is visible when $ \cos c \ge 0 $: within 90° of the centre of the
 * view.
 *
 * Where:
 * - $ \varphi $, $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \varphi_0 $, $ \lambda_0 $ are those of the centre of the view (rad)
 * - $ R $ is the globe's radius on the screen, in any unit
 *
 * **Units**
 * - Inputs: latitudes and longitudes in **radians**; `R` in the unit of the drawing.
 * - Output: `x` and `y` in the unit of `R`, from the centre of the disc, with `visible`.
 *
 * ::: info Notes
 *
 * - **Every point gets `x` and `y`**, the far side's mirrored onto the disc,
 *   so a renderer can fade them or break a line where it goes behind.
 *   `orthographic` in `@interstellar-tools/maps` throws for them instead.
 * - For points on the ground: a satellite above the far side can still show
 *   past the edge of the disc. Project its 3D position from
 *   {@link orbitPath3D} for that.
 * - Any `h` on the points is ignored.
 *
 * :::
 *
 * @param points - The points, `{ phi, lambda }` in **radians**: from {@link groundTrack} or {@link coverageFootprint}, for example.
 * @param R - The globe's radius, in the unit of the drawing (finite, > 0): 1 by default.
 * @param options - The centre of the view, `phi0` and `lambda0` in **radians**: 0 and 0 by default.
 * @returns The points on the disc, in order: see {@link GlobePointInterface}.
 * @throws {TypeError} If a latitude, longitude, `R`, `phi0` or `lambda0` is not a finite number.
 * @throws {RangeError} If a latitude or `phi0` is outside [-π/2, π/2], or `R <= 0`.
 * @group Satellites
 *
 * @example
 * ```ts
 * // The ISS's next orbit, on a globe of radius 200 px centred on Oslo
 * const track = groundTrack(iss, now, later).flat();
 * const view = globeView(track, 200, { phi0: toRad(59.91), lambda0: toRad(10.75) });
 *
 * view.filter(({ visible }) => visible); // the part of the track on the near side
 * ```
 *
 * @see {@link groundTrack}
 * @see {@link coverageFootprint}
 */
export const globeView = (
  points: readonly Pick<GeodeticCoordinatesInterface, 'phi' | 'lambda'>[],
  R = 1,
  options: GlobeViewOptionsInterface = {}
): GlobePointInterface[] => {
  const { phi0 = 0, lambda0 = 0 } = options;
  const latitude = (name: string, value: number) => {
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

    if (Math.abs(value) > Math.PI / 2)
      throw new RangeError(
        `${name} must be in [-π/2, π/2]. Received: ${value}`
      );
  };

  for (const [name, value] of [
    ['R', R],
    ['lambda0', lambda0]
  ] as const)
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

  if (R <= 0) throw new RangeError(`R must be > 0. Received: ${R}`);

  latitude('phi0', phi0);

  const sinPhi0 = Math.sin(phi0);
  const cosPhi0 = Math.cos(phi0);

  return points.map(({ phi, lambda }) => {
    latitude('phi', phi);

    if (!Number.isFinite(lambda))
      throw new TypeError(
        `lambda must be a finite number. Received: ${lambda}`
      );

    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosDLambda = Math.cos(lambda - lambda0);

    return {
      x: R * cosPhi * Math.sin(lambda - lambda0),
      y: R * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDLambda),
      // On the horizon, allowing for rounding
      visible: sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDLambda >= -1e-12
    };
  });
};
