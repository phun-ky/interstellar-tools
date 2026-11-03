import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import { flowAccumulation } from './flow-accumulation.js';
import type { GridInterface } from './grid.js';
import { slopeAt } from './slope.js';
import { assertGrid, mapGrid } from './window.js';

/**
 * Options for {@link topographicWetnessIndex}.
 *
 * @group Terrain
 */
export interface TopographicWetnessIndexOptionsInterface {
  /** Smallest slope to use, in **radians** (in (0, π/2)), so level ground gets a finite index. Defaults to 0.001 (about 0.06°). */
  minSlope?: Radians;
}

/**
 * Compute the **Topographic Wetness Index** of every cell of an elevation grid: where water would collect, from how much ground drains through a cell and how slowly it drains away.
 *
 * $$
 * \text{TWI} = \ln\frac{a}{\tan\beta},
 * \qquad
 * a = \frac{A}{w}
 * $$
 *
 * Where:
 * - $ A $ is the area draining through the cell, from {@link flowAccumulation} (m²)
 * - $ w = \sqrt{\Delta x\,\Delta y} $ is the width the flow crosses, taken as the cell size (m)
 * - $ a $ is the area draining through each metre of that width (m)
 * - $ \beta $ is the cell's slope, from {@link slopeAt}, at least `minSlope` (rad)
 *
 * **Units**
 * - Input: heights and the cell size in **m**.
 * - Output: the index, the logarithm of $ a/\tan\beta $ in **m**. Higher is wetter.
 *
 * ::: info Notes
 *
 * - High where a large area drains through gentle ground: valley floors and the foot of slopes. Low on ridges and steep slopes, which shed water fast. Beven & Kirkby (1979) used it to predict where soil saturates; on Mars it points to where water or ice would collect.
 * - $ a $ is in metres, so the index depends on the unit of length: in kilometres it would be $ \ln 1000 \approx 6.9 $ lower. Compare values computed the same way.
 * - Level ground has $ \tan\beta = 0 $; `minSlope` stands in for it there, and makes flat ground very wet. Flow is D8, as in {@link flowDirections}, which can't split flow and stops at pits: fill pits first.
 * - `NaN` on the grid's edge and next to a missing cell, where the slope can't be computed.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param options - `minSlope`, the smallest slope to use (radians).
 * @returns A grid of the same shape, the index for each cell.
 * @throws {TypeError} If a size, cell size or `minSlope` is not finite.
 * @throws {RangeError} If the grid's parts don't fit together, or `minSlope` is not in (0, π/2).
 * @group Terrain
 *
 * @example
 * ```ts
 * // Falling 1 m every 10 m to the east
 * const grid = createGrid({
 *   rows: 3,
 *   columns: 4,
 *   values: [4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1],
 *   cellSize: { x: 10, y: 10 }
 * });
 * const twi = topographicWetnessIndex(grid);
 *
 * gridValueAt(twi, 1, 1); // ln(200 m² / 10 m / 0.1) = ln 200 ≈ 5.30
 * gridValueAt(twi, 1, 2); // ln 300 ≈ 5.70: wetter downhill
 * ```
 *
 * @see {@link flowAccumulation}
 * @see {@link slopeAt}
 * @see https://doi.org/10.1080/02626667909491834 Beven & Kirkby (1979), A physically based, variable contributing area model of basin hydrology
 */
export const topographicWetnessIndex = (
  grid: GridInterface,
  { minSlope = 0.001 as Radians }: TopographicWetnessIndexOptionsInterface = {}
): GridInterface => {
  assertGrid(grid);
  assertFinite([['minSlope', minSlope]]);

  if (minSlope <= 0 || minSlope >= Math.PI / 2)
    throw new RangeError(`minSlope must be in (0, π/2). Received: ${minSlope}`);

  const area = flowAccumulation(grid);
  const width = Math.sqrt(grid.cellSize.x * grid.cellSize.y);
  const minTan = Math.tan(minSlope);

  return mapGrid(grid, (row, column) =>
    Math.log(
      area.values[row * grid.columns + column]! /
        width /
        Math.max(Math.tan(slopeAt(grid, row, column)), minTan)
    )
  );
};
