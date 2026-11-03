import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { aspectAt, aspectGrid } from '../aspect.js';
import { gradientAt } from '../gradient-at.js';
import { createGrid, gridValueAt } from '../grid.js';
import { slopeAt, slopeGrid } from '../slope.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
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

describe('gradientAt', () => {
  test('is exact on any plane, for any cell size', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -5, max: 5, noNaN: true }),
        fc.double({ min: -5, max: 5, noNaN: true }),
        fc.double({ min: 0.5, max: 500, noNaN: true }),
        fc.double({ min: 0.5, max: 500, noNaN: true }),
        (a, b, dx, dy) => {
          const grid = gridOf(4, 5, dx, dy, (x, y) => 100 + a * x + b * y);
          const { dzdx, dzdy } = gradientAt(grid, 2, 2);

          close(dzdx, a, 1e-9);
          close(dzdy, b, 1e-9);
        }
      )
    );
  });

  test('is NaN on the edge and next to a missing cell', () => {
    const grid = createGrid({
      rows: 4,
      columns: 4,
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -9999, 1, 1, 1, 1],
      cellSize: { x: 1, y: 1 },
      noData: -9999
    });

    for (const [row, column] of [
      [0, 1],
      [3, 2],
      [1, 0],
      [2, 3],
      [2, 2],
      [1, 2]
    ]) {
      const { dzdx, dzdy } = gradientAt(grid, row!, column!);

      assert.ok(Number.isNaN(dzdx) && Number.isNaN(dzdy), `${row}, ${column}`);
    }

    close(gradientAt(grid, 1, 1).dzdx, 0);
  });

  test('throws outside the grid', () => {
    const grid = gridOf(3, 3, 1, 1, () => 0);

    assert.throws(() => gradientAt(grid, 3, 1), RangeError);
    assert.throws(() => gradientAt(grid, 1, -1), RangeError);
  });
});

describe('slopeAt', () => {
  test('is 0 on flat ground', () => {
    assert.equal(
      slopeAt(
        gridOf(3, 3, 5, 5, () => 42),
        1,
        1
      ),
      0
    );
  });

  test('is atan of the rise per metre on a plane', () => {
    const grid = gridOf(3, 3, 10, 20, (x, y) => 0.3 * x - 0.4 * y);

    close(slopeAt(grid, 1, 1), Math.atan(0.5));
  });

  test('is 45° for a rise of one metre per metre', () => {
    close(
      slopeAt(
        gridOf(3, 3, 2, 2, (x) => x),
        1,
        1
      ),
      Math.PI / 4
    );
  });
});

describe('aspectAt', () => {
  test('faces the way the ground descends, clockwise from north', () => {
    // Descending towards the north, east, south and west
    const descending: [number, (x: number, y: number) => number][] = [
      [0, (_x, y) => -y],
      [Math.PI / 2, (x) => -x],
      [Math.PI, (_x, y) => y],
      [(3 * Math.PI) / 2, (x) => x]
    ];

    for (const [aspect, z] of descending)
      close(aspectAt(gridOf(3, 3, 1, 1, z), 1, 1), aspect);
  });

  test('faces south-east for ground descending to the south-east', () => {
    close(
      aspectAt(
        gridOf(3, 3, 1, 1, (x, y) => -x + y),
        1,
        1
      ),
      (3 * Math.PI) / 4
    );
  });

  test('is NaN on flat ground', () => {
    assert.ok(
      Number.isNaN(
        aspectAt(
          gridOf(3, 3, 1, 1, () => 7),
          1,
          1
        )
      )
    );
  });

  test('turns by 90° when the terrain is turned by 90° clockwise', () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: -100, max: 100, noNaN: true }), {
          minLength: 9,
          maxLength: 9
        }),
        (values) => {
          const grid = createGrid({
            rows: 3,
            columns: 3,
            values,
            cellSize: { x: 1, y: 1 }
          });
          // Turned clockwise: the new row r, column c is the old row 2 − c,
          // column r
          const turned = createGrid({
            rows: 3,
            columns: 3,
            values: values.map(
              (_, k) => values[(2 - (k % 3)) * 3 + Math.floor(k / 3)]!
            ),
            cellSize: { x: 1, y: 1 }
          });
          const before = aspectAt(grid, 1, 1);
          const after = aspectAt(turned, 1, 1);

          fc.pre(!Number.isNaN(before) && slopeAt(grid, 1, 1) > 1e-6);

          const turn = (after - before + 2 * Math.PI) % (2 * Math.PI);

          close(turn, Math.PI / 2, 1e-9);
        }
      )
    );
  });
});

describe('slopeGrid and aspectGrid', () => {
  const grid = gridOf(4, 5, 10, 10, (x, y) => 0.1 * x + 0.2 * y);

  test('give a grid of the same shape, NaN around the edge', () => {
    for (const result of [slopeGrid(grid), aspectGrid(grid)]) {
      assert.equal(result.rows, 4);
      assert.equal(result.columns, 5);
      assert.deepEqual(result.cellSize, grid.cellSize);

      for (let row = 0; row < 4; row++)
        for (let column = 0; column < 5; column++) {
          const edge = row === 0 || row === 3 || column === 0 || column === 4;

          assert.equal(
            Number.isNaN(gridValueAt(result, row, column)),
            edge,
            `${row}, ${column}`
          );
        }
    }
  });

  test('match the single-cell functions inside', () => {
    close(gridValueAt(slopeGrid(grid), 2, 3), slopeAt(grid, 2, 3));
    close(gridValueAt(aspectGrid(grid), 1, 2), aspectAt(grid, 1, 2));
  });

  test('reject a malformed grid', () => {
    assert.throws(
      () =>
        slopeGrid({
          rows: 2,
          columns: 2,
          values: [1],
          cellSize: { x: 1, y: 1 }
        }),
      RangeError
    );
  });
});
