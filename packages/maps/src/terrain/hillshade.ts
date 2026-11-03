import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import { aspectAt } from './aspect.js';
import type { GridInterface } from './grid.js';
import { slopeAt } from './slope.js';
import { assertGrid, mapGrid } from './window.js';

const assertSun = (sunAzimuth: number, sunElevation: number) => {
  assertFinite([
    ['sunAzimuth', sunAzimuth],
    ['sunElevation', sunElevation]
  ]);

  if (Math.abs(sunElevation) > Math.PI / 2)
    throw new RangeError(
      `sunElevation must be in [-π/2, π/2]. Received: ${sunElevation}`
    );
};

/**
 * Compute the **hillshade** of a patch of terrain: how brightly the Sun lights it, from its slope and aspect.
 *
 * $$
 * \cos i = \sin\alpha\cos s + \cos\alpha\sin s\cos(\psi - A),
 * \qquad
 * \text{hillshade} = \max(0, \cos i)
 * $$
 *
 * Where:
 * - $ s $ is the slope and $ A $ the aspect, clockwise from north (rad), from {@link slopeAt} and {@link aspectAt}
 * - $ \psi $ is the Sun's azimuth, clockwise from north, and $ \alpha $ its elevation above the horizon (rad)
 * - $ i $ is the angle between the Sun and the ground's normal: the incidence angle
 *
 * **Units**
 * - Inputs: all angles in **radians**.
 * - Output: brightness in [0, 1]: 1 facing the Sun squarely, 0 facing away from it.
 *
 * ::: info Notes
 *
 * - It's {@link lambertReflectance} for the ground's normal: what shaded relief maps show. Level ground gets $ \sin\alpha $; a slope facing the Sun gets more, one facing away less.
 * - The Sun's azimuth uses the same convention as the aspect, so a slope faces the Sun when $ \psi = A $.
 * - Only the patch's own orientation counts: it doesn't know about shadows cast by other terrain, such as a crater's rim. A slope can be lit while the Sun is below the horizon, if it faces it steeply enough.
 * - Level ground has no aspect: with `slope` 0, `aspect` is ignored and may be `NaN`. A `NaN` slope, from the edge of a grid or a missing cell, gives `NaN`.
 *
 * :::
 *
 * ::: practice Apollo 11, morning at Tranquility Base
 *
 * **0.19**
 *
 * _Level ground, with the Sun 10.8° above the eastern horizon_
 *
 * A 10° slope facing the Sun was almost twice as bright, 0.36, and one facing away almost black, 0.01. That contrast is why Apollo landings came in with the Sun low behind them: craters and boulders stood out.
 *
 * ```ts
 * const sun = toRad(10.8);
 * const east = toRad(90);
 * hillshadeAt(0 as Radians, NaN as Radians, east, sun); // ≈ 0.19
 * hillshadeAt(toRad(10), east, east, sun); // ≈ 0.36
 * hillshadeAt(toRad(10), toRad(270), east, sun); // ≈ 0.01
 * ```
 *
 * :::
 *
 * @param slope - Slope $ s $ in **radians** (in [0, π/2], or `NaN`).
 * @param aspect - Aspect $ A $ in **radians**, clockwise from north (finite; ignored when `slope` is 0).
 * @param sunAzimuth - Sun's azimuth $ \psi $ in **radians**, clockwise from north (finite).
 * @param sunElevation - Sun's elevation $ \alpha $ above the horizon in **radians** (in [−π/2, π/2]).
 * @returns The hillshade in [0, 1], or `NaN` for a `NaN` slope.
 * @throws {TypeError} If `sunAzimuth`, `sunElevation` or a sloping cell's `aspect` is not finite, or `slope` is infinite.
 * @throws {RangeError} If `slope` is outside [0, π/2], or `sunElevation` outside [−π/2, π/2].
 * @group Terrain
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // A 30° slope facing south, the Sun 45° up in the south
 * hillshadeAt(
 *   (Math.PI / 6) as Radians,
 *   Math.PI as Radians,
 *   Math.PI as Radians,
 *   (Math.PI / 4) as Radians
 * ); // sin 75° ≈ 0.97
 * ```
 *
 * @see {@link hillshadeGrid}
 * @see {@link lambertReflectance}
 * @see https://doi.org/10.1109/PROC.1981.11918 Horn (1981), Hill shading and the reflectance map
 */
export const hillshadeAt = (
  slope: Radians,
  aspect: Radians,
  sunAzimuth: Radians,
  sunElevation: Radians
): number => {
  assertSun(sunAzimuth, sunElevation);

  if (Number.isNaN(slope)) return NaN;

  assertFinite([['slope', slope]]);

  if (slope < 0 || slope > Math.PI / 2)
    throw new RangeError(`slope must be in [0, π/2]. Received: ${slope}`);

  if (slope === 0) return Math.max(0, Math.sin(sunElevation));

  assertFinite([['aspect', aspect]]);

  return Math.max(
    0,
    Math.sin(sunElevation) * Math.cos(slope) +
      Math.cos(sunElevation) * Math.sin(slope) * Math.cos(sunAzimuth - aspect)
  );
};

/**
 * Compute the **hillshade** of every cell of an elevation grid, as a new grid of brightness in [0, 1].
 *
 * See {@link hillshadeAt}; the slope and aspect come from {@link slopeAt} and {@link aspectAt}. Cells on the edge and next to a missing cell are `NaN`.
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param sunAzimuth - Sun's azimuth in **radians**, clockwise from north (finite).
 * @param sunElevation - Sun's elevation above the horizon in **radians** (in [−π/2, π/2]).
 * @returns A grid of the same shape, hillshade in [0, 1].
 * @throws {TypeError} If a size, cell size or Sun angle is not finite.
 * @throws {RangeError} If the grid's parts don't fit together, or `sunElevation` is outside [−π/2, π/2].
 * @group Terrain
 *
 * @example
 * ```ts
 * // The cartographers' convention: light from the north-west, 45° up
 * const shaded = hillshadeGrid(grid, toRad(315), toRad(45));
 * ```
 *
 * @see {@link hillshadeAt}
 */
export const hillshadeGrid = (
  grid: GridInterface,
  sunAzimuth: Radians,
  sunElevation: Radians
): GridInterface => {
  assertGrid(grid);
  assertSun(sunAzimuth, sunElevation);

  return mapGrid(grid, (row, column) =>
    hillshadeAt(
      slopeAt(grid, row, column),
      aspectAt(grid, row, column),
      sunAzimuth,
      sunElevation
    )
  );
};
