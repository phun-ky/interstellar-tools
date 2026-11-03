import { D8_STEPS, d8Directions, isMissing } from './d8.js';
import type { GridInterface } from './grid.js';
import { assertGrid } from './window.js';

/**
 * Compute the **flow accumulation** of every cell of an elevation grid: the area that drains through it, its own included.
 *
 * $$
 * A_0 = \Delta x\,\Delta y + \sum_{i \to 0} A_i
 * $$
 *
 * Where:
 * - $ A_0 $ is the cell's contributing area and $ A_i $ that of each neighbour draining into it (m²)
 * - $ \Delta x\,\Delta y $ is the cell's own area (m²)
 *
 * **Units**
 * - Input: heights and the cell size in **m**.
 * - Output: contributing area in **m²**, at least one cell's area. Divide by $ \Delta x\,\Delta y $ for a number of cells.
 *
 * ::: info Notes
 *
 * - Flow follows {@link flowDirections}: D8, all of a cell's flow to one neighbour. The largest values trace the channels where water, or on Mars perhaps ice and fine material, would gather.
 * - Flow stops at a cell with nowhere to drain, so the areas of all such cells add up to the whole grid's. A pit cuts off everything upstream of it: fill pits first for connected drainage.
 * - Only area inside the grid counts: near an edge, more may drain in from outside.
 * - Missing cells are `NaN` and receive no flow.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @returns A grid of the same shape, contributing area in **m²**.
 * @throws {TypeError} If a size or cell size is not finite.
 * @throws {RangeError} If the grid's parts don't fit together.
 * @group Terrain
 *
 * @example
 * ```ts
 * // Falling to the east, 10 m cells
 * const grid = createGrid({
 *   rows: 2,
 *   columns: 3,
 *   values: [3, 2, 1, 3, 2, 1],
 *   cellSize: { x: 10, y: 10 }
 * });
 *
 * flowAccumulation(grid).values; // [100, 200, 300, 100, 200, 300] m²
 * ```
 *
 * @see {@link flowDirections}
 * @see {@link topographicWetnessIndex}
 * @see https://doi.org/10.1016/S0734-189X(84)80011-0 O'Callaghan & Mark (1984), The extraction of drainage networks from digital elevation data
 */
export const flowAccumulation = (grid: GridInterface): GridInterface => {
  assertGrid(grid);

  const { rows, columns, cellSize } = grid;
  const directions = d8Directions(grid);
  const receivers = new Int32Array(rows * columns).fill(-1);
  const inflows = new Uint8Array(rows * columns);
  const area = new Float64Array(rows * columns);

  directions.forEach((d, index) => {
    if (d < 0) return;

    const [dr, dc] = D8_STEPS[d]!;
    const receiver = index + dr * columns + dc;

    receivers[index] = receiver;
    inflows[receiver]!++;
  });

  // Pass each cell's area on once everything upstream of it has arrived
  const ready: number[] = [];

  for (let index = 0; index < rows * columns; index++) {
    area[index] = isMissing(grid, index) ? NaN : cellSize.x * cellSize.y;

    if (inflows[index] === 0) ready.push(index);
  }

  for (let k = 0; k < ready.length; k++) {
    const index = ready[k]!;
    const receiver = receivers[index]!;

    if (receiver < 0) continue;

    area[receiver]! += area[index]!;

    if (--inflows[receiver]! === 0) ready.push(receiver);
  }

  return {
    rows,
    columns,
    values: area,
    cellSize: { x: cellSize.x, y: cellSize.y }
  };
};
