// D8 flow routing, shared by the flow functions; not part of the public API.
import type { GridInterface } from './grid.js';

/** Row and column steps to the eight neighbours, clockwise from north. */
export const D8_STEPS = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1]
] as const;

/** Whether the cell at `index` is missing: `NaN` or `noData`. */
export const isMissing = ({ values, noData }: GridInterface, index: number) => {
  const z = values[index]!;

  return Number.isNaN(z) || z === noData;
};

/**
 * The D8 flow direction of every cell, 0–7 clockwise from north: towards the
 * neighbour inside the grid with the steepest drop per metre, the first one
 * clockwise from north on a tie. -1 where no neighbour is lower, and for a
 * missing cell; missing neighbours are skipped.
 */
export const d8Directions = (grid: GridInterface): Int8Array => {
  const { rows, columns, values, cellSize } = grid;
  const distances = D8_STEPS.map(([dr, dc]) =>
    Math.hypot(dr * cellSize.y, dc * cellSize.x)
  );
  const directions = new Int8Array(rows * columns).fill(-1);

  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;

      if (isMissing(grid, index)) continue;

      let steepest = 0;

      for (let d = 0; d < 8; d++) {
        const [dr, dc] = D8_STEPS[d]!;
        const r = row + dr;
        const c = column + dc;

        if (r < 0 || c < 0 || r >= rows || c >= columns) continue;

        const neighbour = r * columns + c;

        if (isMissing(grid, neighbour)) continue;

        const drop = (values[index]! - values[neighbour]!) / distances[d]!;

        if (drop > steepest) {
          steepest = drop;
          directions[index] = d;
        }
      }
    }

  return directions;
};
