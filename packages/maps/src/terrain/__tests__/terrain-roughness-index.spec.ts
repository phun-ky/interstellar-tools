import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { createGrid, gridValueAt } from '../grid.js';
import {
  terrainRoughnessIndexAt,
  terrainRoughnessIndexGrid
} from '../terrain-roughness-index.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
const grid3 = (values: number[]) =>
  createGrid({ rows: 3, columns: 3, values, cellSize: { x: 1, y: 1 } });

describe('terrainRoughnessIndexAt', () => {
  test('is 0 on level ground', () => {
    assert.equal(terrainRoughnessIndexAt(grid3(Array(9).fill(12)), 1, 1), 0);
  });

  test('is the height of a spike above level surroundings', () => {
    close(terrainRoughnessIndexAt(grid3([0, 0, 0, 0, 2, 0, 0, 0, 0]), 1, 1), 2);
  });

  test('is h / √8 for one neighbour h higher', () => {
    close(
      terrainRoughnessIndexAt(grid3([0, 0, 0, 0, 0, 0, 0, 0, 3]), 1, 1),
      3 / Math.sqrt(8)
    );
  });

  test('is Riley’s index divided by √8', () => {
    const values = [3, 1, 4, 1, 5, 9, 2, 6, 5];
    const riley = Math.sqrt(values.reduce((s, z) => s + (z - 5) ** 2, 0));

    close(terrainRoughnessIndexAt(grid3(values), 1, 1), riley / Math.sqrt(8));
  });

  test('ignores a constant offset in height, and grows in step with a scale', () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: -100, max: 100, noNaN: true }), {
          minLength: 9,
          maxLength: 9
        }),
        fc.double({ min: -1e4, max: 1e4, noNaN: true }),
        fc.double({ min: 0.1, max: 10, noNaN: true }),
        (values, offset, scale) => {
          const tri = terrainRoughnessIndexAt(grid3(values), 1, 1);

          close(
            terrainRoughnessIndexAt(grid3(values.map((z) => z + offset)), 1, 1),
            tri,
            1e-9 * Math.max(1, Math.abs(offset))
          );
          close(
            terrainRoughnessIndexAt(grid3(values.map((z) => z * scale)), 1, 1),
            tri * scale,
            1e-9 * Math.max(1, tri * scale)
          );
        }
      )
    );
  });

  test('is NaN on the edge and next to a missing cell', () => {
    const grid = createGrid({
      rows: 3,
      columns: 4,
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
      cellSize: { x: 1, y: 1 },
      noData: -1
    });

    assert.ok(Number.isNaN(terrainRoughnessIndexAt(grid, 0, 1)));
    assert.ok(Number.isNaN(terrainRoughnessIndexAt(grid, 1, 2)));
    assert.equal(terrainRoughnessIndexAt(grid, 1, 1), 0);
  });

  test('throws outside the grid', () => {
    assert.throws(
      () => terrainRoughnessIndexAt(grid3(Array(9).fill(0)), 1, 3),
      RangeError
    );
  });
});

describe('terrainRoughnessIndexGrid', () => {
  test('gives a grid of the same shape, NaN around the edge', () => {
    const grid = createGrid({
      rows: 4,
      columns: 4,
      values: [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      cellSize: { x: 5, y: 5 }
    });
    const tri = terrainRoughnessIndexGrid(grid);

    assert.equal(tri.rows, 4);
    assert.equal(tri.columns, 4);
    close(gridValueAt(tri, 1, 1), 4);
    close(gridValueAt(tri, 2, 2), 4 / Math.sqrt(8));
    assert.ok(Number.isNaN(gridValueAt(tri, 0, 0)));
    assert.ok(Number.isNaN(gridValueAt(tri, 3, 2)));
  });

  test('rejects a malformed grid', () => {
    assert.throws(
      () =>
        terrainRoughnessIndexGrid({
          rows: 2,
          columns: 2,
          values: [1],
          cellSize: { x: 1, y: 1 }
        }),
      RangeError
    );
  });
});
