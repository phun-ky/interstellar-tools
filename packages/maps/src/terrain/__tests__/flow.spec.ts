import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { flowAccumulation } from '../flow-accumulation.js';
import { flowDirections } from '../flow-directions.js';
import { createGrid } from '../grid.js';

// Row and column steps for directions 0–7, clockwise from north
const STEPS = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1]
];
// A rows × columns grid with z(x, y), x east and y north from the north-west
// cell's centre, so y = −row · dy
const gridOf = (
  rows: number,
  columns: number,
  dx: number,
  dy: number,
  z: (x: number, y: number) => number
) =>
  createGrid({
    rows,
    columns,
    values: Array.from({ length: rows * columns }, (_, k) =>
      z((k % columns) * dx, -Math.floor(k / columns) * dy)
    ),
    cellSize: { x: dx, y: dy }
  });
// Random small grids, with ties and missing cells
const randomGrid = fc
  .record({
    rows: fc.integer({ min: 1, max: 7 }),
    columns: fc.integer({ min: 1, max: 7 }),
    dx: fc.constantFrom(1, 2.5, 10),
    dy: fc.constantFrom(1, 4, 10)
  })
  .chain(({ rows, columns, dx, dy }) =>
    fc
      .array(fc.oneof(fc.integer({ min: 0, max: 5 }), fc.constant(NaN)), {
        minLength: rows * columns,
        maxLength: rows * columns
      })
      .map((values) =>
        createGrid({ rows, columns, values, cellSize: { x: dx, y: dy } })
      )
  );
// Index of the cell direction `d` leads to from `index`
const receiverOf = (columns: number, index: number, d: number) =>
  index + STEPS[d]![0]! * columns + STEPS[d]![1]!;

describe('flowDirections', () => {
  test('runs downhill on a plane', () => {
    // Falling east, north, and south-west on square cells
    const east = flowDirections(gridOf(3, 4, 10, 10, (x) => -x));
    const north = flowDirections(gridOf(4, 3, 10, 10, (_x, y) => -y));
    const southWest = flowDirections(gridOf(3, 3, 5, 5, (x, y) => x + y));

    assert.deepEqual(
      [...east.values],
      [2, 2, 2, NaN, 2, 2, 2, NaN, 2, 2, 2, NaN]
    );
    assert.deepEqual(
      [...north.values],
      [NaN, NaN, NaN, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert.equal(southWest.values[4], 5);
  });

  test('measures the drop per metre, with the cell size each way', () => {
    // 1 m lower 1 m to the east beats 1.5 m lower 10 m to the north
    const grid = createGrid({
      rows: 3,
      columns: 3,
      values: [20, 8.5, 20, 20, 10, 9, 20, 20, 20],
      cellSize: { x: 1, y: 10 }
    });

    assert.equal(flowDirections(grid).values[4], 2);
  });

  test('takes the first direction clockwise from north on a tie', () => {
    const grid = createGrid({
      rows: 3,
      columns: 3,
      values: [9, 4, 9, 9, 5, 4, 9, 9, 9],
      cellSize: { x: 1, y: 1 }
    });

    assert.equal(flowDirections(grid).values[4], 0);
  });

  test('points to the steepest lower neighbour, or is NaN if there is none', () => {
    fc.assert(
      fc.property(randomGrid, (grid) => {
        const { rows, columns, values, cellSize } = grid;
        const directions = flowDirections(grid).values;

        for (let index = 0; index < rows * columns; index++) {
          const row = Math.floor(index / columns);
          const column = index % columns;
          const drops = STEPS.map(([dr, dc], d) => {
            const r = row + dr!;
            const c = column + dc!;

            if (r < 0 || c < 0 || r >= rows || c >= columns) return -Infinity;

            const drop =
              (values[index]! - values[receiverOf(columns, index, d)]!) /
              Math.hypot(dr! * cellSize.y, dc! * cellSize.x);

            return Number.isNaN(drop) ? -Infinity : drop;
          });
          const steepest = Math.max(...drops);
          const d = directions[index]!;

          if (Number.isNaN(values[index]!) || steepest <= 0)
            assert.ok(Number.isNaN(d));
          else assert.equal(d, drops.indexOf(steepest));
        }
      })
    );
  });

  test('skips missing cells', () => {
    const grid = createGrid({
      rows: 3,
      columns: 3,
      values: [9, 9, 9, 9, 5, -9999, 9, 9, 4],
      cellSize: { x: 1, y: 1 },
      noData: -9999
    });
    const directions = flowDirections(grid).values;

    assert.equal(directions[4], 3);
    assert.ok(Number.isNaN(directions[5]!));
  });

  test('throws on a grid whose parts do not fit together', () => {
    assert.throws(
      () =>
        flowDirections({
          rows: 2,
          columns: 2,
          values: [1, 2, 3],
          cellSize: { x: 1, y: 1 }
        }),
      RangeError
    );
  });
});

describe('flowAccumulation', () => {
  test('grows along a tilted plane', () => {
    const area = flowAccumulation(gridOf(3, 4, 10, 5, (x) => -x));

    assert.deepEqual(
      [...area.values],
      [50, 100, 150, 200, 50, 100, 150, 200, 50, 100, 150, 200]
    );
    assert.deepEqual(area.cellSize, { x: 10, y: 5 });
  });

  test('collects a V-shaped valley in its middle', () => {
    // Sides falling 1 in 2 towards the middle column, which falls 1 in 10
    // to the north
    const rows = 6;
    const columns = 7;
    const area = flowAccumulation(
      gridOf(rows, columns, 1, 1, (x, y) => 0.5 * Math.abs(x - 3) - 0.1 * y)
    ).values;

    for (let row = 0; row < rows; row++) {
      const middle = area[row * columns + 3]!;

      for (let column = 0; column < columns; column++)
        if (column !== 3) assert.ok(area[row * columns + column]! < middle);

      if (row > 0) assert.ok(middle < area[(row - 1) * columns + 3]!);
    }

    // The whole valley leaves through the north end of the middle column
    assert.equal(area[3], rows * columns);
  });

  test('collects a bowl at its bottom', () => {
    const area = flowAccumulation(
      gridOf(5, 5, 2, 2, (x, y) => (x - 4) ** 2 + (y + 4) ** 2)
    );

    assert.equal(area.values[12], 25 * 4);
  });

  test('is the cell plus what flows in, and all of it ends somewhere', () => {
    fc.assert(
      fc.property(randomGrid, (grid) => {
        const { rows, columns, values, cellSize } = grid;
        const cellArea = cellSize.x * cellSize.y;
        const directions = flowDirections(grid).values;
        const area = flowAccumulation(grid).values;
        const inflow = new Float64Array(rows * columns);
        let ending = 0;
        let cells = 0;

        for (let index = 0; index < rows * columns; index++) {
          if (Number.isNaN(values[index]!)) {
            assert.ok(Number.isNaN(area[index]!));
            continue;
          }

          cells++;

          const d = directions[index]!;

          if (Number.isNaN(d)) ending += area[index]!;
          else inflow[receiverOf(columns, index, d)]! += area[index]!;
        }

        for (let index = 0; index < rows * columns; index++)
          if (!Number.isNaN(values[index]!))
            assert.ok(
              Math.abs(area[index]! - cellArea - inflow[index]!) <= 1e-9
            );

        assert.ok(Math.abs(ending - cells * cellArea) <= 1e-9);
      })
    );
  });

  test('throws on a grid whose parts do not fit together', () => {
    assert.throws(
      () =>
        flowAccumulation({
          rows: 2,
          columns: 2,
          values: [1, 2, 3],
          cellSize: { x: 1, y: 1 }
        }),
      RangeError
    );
  });
});
