import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { curvatureAt, curvatureGrid } from '../curvature.js';
import { createGrid, gridValueAt } from '../grid.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
// A 3 × 3 grid of z(x, y) around the point (x0, y0), x east and y north
const gridAround = (
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  z: (x: number, y: number) => number
) =>
  createGrid({
    rows: 3,
    columns: 3,
    values: Array.from({ length: 9 }, (_, k) =>
      z(x0 + ((k % 3) - 1) * dx, y0 - (Math.floor(k / 3) - 1) * dy)
    ),
    cellSize: { x: dx, y: dy }
  });
// The curvatures of z = a x² + b xy + c y² + d x + e y at the origin
const quadratic = (a: number, b: number, c: number, d: number, e: number) => {
  const [p, q, r, s, t] = [d, e, 2 * a, b, 2 * c];
  const w = p ** 2 + q ** 2;

  return {
    profile: -(p ** 2 * r + 2 * p * q * s + q ** 2 * t) / (w * (1 + w) ** 1.5),
    planform:
      -(q ** 2 * r - 2 * p * q * s + p ** 2 * t) / (w * Math.sqrt(1 + w))
  };
};
const coefficient = fc.double({ min: -0.05, max: 0.05, noNaN: true });
const gradient = fc.double({ min: -2, max: 2, noNaN: true });
const cellSize = fc.double({ min: 0.5, max: 50, noNaN: true });

describe('curvatureAt', () => {
  test('is exact on any quadratic surface, for any cell size', () => {
    fc.assert(
      fc.property(
        coefficient,
        coefficient,
        coefficient,
        gradient,
        gradient,
        cellSize,
        cellSize,
        (a, b, c, d, e, dx, dy) => {
          fc.pre(Math.hypot(d, e) > 0.01);

          const grid = gridAround(
            0,
            0,
            dx,
            dy,
            (x, y) => 100 + a * x * x + b * x * y + c * y * y + d * x + e * y
          );
          const k = curvatureAt(grid, 1, 1);
          const expected = quadratic(a, b, c, d, e);

          close(k.profile, expected.profile, 1e-9);
          close(k.planform, expected.planform, 1e-9);
        }
      )
    );
  });

  test('is 0 on any plane', () => {
    fc.assert(
      fc.property(gradient, gradient, cellSize, cellSize, (d, e, dx, dy) => {
        const k = curvatureAt(
          gridAround(0, 0, dx, dy, (x, y) => 100 + d * x + e * y),
          1,
          1
        );

        close(k.profile, 0, 1e-12);
        close(k.planform, 0, 1e-12);
      })
    );
  });

  test('is 1/R both ways on a dome of radius R, and −1/R in a bowl', () => {
    const R = 1000;
    const dome = (x: number, y: number) => Math.sqrt(R ** 2 - x ** 2 - y ** 2);

    // Off the top, where the ground slopes about 30°
    for (const [x0, y0] of [
      [300, 400],
      [-500, 0],
      [0, 200],
      [-150, -350]
    ]) {
      const convex = curvatureAt(gridAround(x0!, y0!, 1, 1, dome), 1, 1);
      const concave = curvatureAt(
        gridAround(x0!, y0!, 1, 1, (x, y) => -dome(x, y)),
        1,
        1
      );

      close(convex.profile, 1 / R, 1e-8);
      close(convex.planform, 1 / R, 1e-8);
      close(concave.profile, -1 / R, 1e-8);
      close(concave.planform, -1 / R, 1e-8);
    }
  });

  test('bends one way only on a cylinder', () => {
    const R = 200;
    // Axis north–south, sloping east–west: curved along the slope only
    const across = (x: number) => Math.sqrt(R ** 2 - x ** 2);
    const k = curvatureAt(gridAround(100, 0, 0.5, 0.5, across), 1, 1);

    close(k.profile, 1 / R, 1e-8);
    assert.equal(k.planform, 0);

    // A ridge and a gully running down a 1 in 10 slope to the north: curved
    // across the slope only
    for (const sign of [1, -1]) {
      const channel = curvatureAt(
        gridAround(0, 0, 5, 5, (x, y) => (-sign * x ** 2) / (2 * R) - 0.1 * y),
        1,
        1
      );

      close(channel.profile, 0);
      close(channel.planform, sign / R / Math.sqrt(1.01));
    }
  });

  test("doesn't depend on which way the terrain faces", () => {
    fc.assert(
      fc.property(
        coefficient,
        coefficient,
        coefficient,
        gradient,
        gradient,
        fc.double({ min: 0, max: 2 * Math.PI, noNaN: true }),
        cellSize,
        (a, b, c, d, e, theta, size) => {
          fc.pre(Math.hypot(d, e) > 0.01);

          const z = (x: number, y: number) =>
            a * x * x + b * x * y + c * y * y + d * x + e * y;
          const [cos, sin] = [Math.cos(theta), Math.sin(theta)];
          const turned = gridAround(0, 0, size, size, (x, y) =>
            z(x * cos + y * sin, -x * sin + y * cos)
          );
          const k = curvatureAt(turned, 1, 1);
          const expected = quadratic(a, b, c, d, e);

          close(k.profile, expected.profile, 1e-9);
          close(k.planform, expected.planform, 1e-9);
        }
      )
    );
  });

  test('scales as one over length', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.001, max: 1000, noNaN: true }),
        (scale) => {
          const z = (x: number, y: number) =>
            0.01 * x * x - 0.02 * x * y + 0.3 * x - 0.2 * y;
          const metres = curvatureAt(gridAround(0, 0, 4, 3, z), 1, 1);
          const scaled = curvatureAt(
            gridAround(
              0,
              0,
              4 * scale,
              3 * scale,
              (x, y) => scale * z(x / scale, y / scale)
            ),
            1,
            1
          );

          close(scaled.profile * scale, metres.profile, 1e-9);
          close(scaled.planform * scale, metres.planform, 1e-9);
        }
      )
    );
  });

  test('is 0 on level ground and NaN on a level top or bottom', () => {
    assert.deepEqual(
      curvatureAt(
        gridAround(0, 0, 2, 2, () => 7),
        1,
        1
      ),
      { profile: 0, planform: 0 }
    );

    for (const sign of [1, -1]) {
      const { profile, planform } = curvatureAt(
        gridAround(0, 0, 2, 2, (x, y) => sign * (x ** 2 + y ** 2)),
        1,
        1
      );

      assert.ok(Number.isNaN(profile) && Number.isNaN(planform));
    }
  });

  test('is NaN on the edge and next to a missing cell', () => {
    // A plane, with the cell in row 3, column 3 missing
    const grid = createGrid({
      rows: 5,
      columns: 5,
      values: Array.from({ length: 25 }, (_, k) =>
        k === 18 ? NaN : Math.floor(k / 5) + (k % 5)
      ),
      cellSize: { x: 1, y: 1 }
    });

    for (const [row, column] of [
      [0, 1],
      [4, 2],
      [1, 0],
      [2, 4],
      [2, 2],
      [2, 3],
      [3, 2],
      [3, 3]
    ]) {
      const { profile, planform } = curvatureAt(grid, row!, column!);

      assert.ok(
        Number.isNaN(profile) && Number.isNaN(planform),
        `${row}, ${column}`
      );
    }

    close(curvatureAt(grid, 1, 1).profile, 0);
  });

  test('throws outside the grid', () => {
    const grid = gridAround(0, 0, 1, 1, () => 0);

    assert.throws(() => curvatureAt(grid, 3, 1), RangeError);
    assert.throws(() => curvatureAt(grid, 1, 0.5), RangeError);
  });
});

describe('curvatureGrid', () => {
  test('matches curvatureAt cell by cell', () => {
    const grid = createGrid({
      rows: 5,
      columns: 6,
      values: Array.from(
        { length: 30 },
        (_, k) => Math.sin(k) * 3 + (k % 6) * 0.5 - Math.floor(k / 6) * 0.2
      ),
      cellSize: { x: 2, y: 3 }
    });
    const { profile, planform } = curvatureGrid(grid);

    for (const result of [profile, planform]) {
      assert.equal(result.rows, 5);
      assert.equal(result.columns, 6);
      assert.deepEqual(result.cellSize, { x: 2, y: 3 });
    }

    assert.notEqual(profile.values, planform.values);

    for (let row = 0; row < 5; row++)
      for (let column = 0; column < 6; column++) {
        const k = curvatureAt(grid, row, column);

        assert.ok(Object.is(gridValueAt(profile, row, column), k.profile));
        assert.ok(Object.is(gridValueAt(planform, row, column), k.planform));
      }
  });

  test('throws on a grid whose parts do not fit together', () => {
    assert.throws(
      () =>
        curvatureGrid({
          rows: 2,
          columns: 2,
          values: [1, 2, 3],
          cellSize: { x: 1, y: 1 }
        }),
      RangeError
    );
  });
});
