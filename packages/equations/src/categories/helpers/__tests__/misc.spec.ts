import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';
import { dot, norm, norm2pi, residual, scale, sub } from '../misc';
import { TWO_PI } from '@interstellar-tools/constants';
import type { Vector3DTupleType } from '@interstellar-tools/types';

describe('misc', () => {
  /* ----------------------------- vector helpers ----------------------------- */

  test('norm computes Euclidean length (matches 3-4-12 triangle)', () => {
    const v: Vector3DTupleType = [3, 4, 12];
    assert.equal(norm(v), 13);
  });

  test('norm is homogeneous: norm(k*v) = |k| * norm(v)', () => {
    const v: Vector3DTupleType = [1.2, -3.4, 5.6];
    const k = -7.5;

    const kv = scale(v, k);
    relClose(norm(kv), Math.abs(k) * norm(v));
  });

  test('scale multiplies each component by s', () => {
    const v: Vector3DTupleType = [1, -2, 3];
    assert.deepEqual(scale(v, 10), [10, -20, 30]);
  });

  test('sub computes a - b component-wise', () => {
    const a: Vector3DTupleType = [3, 2, 1];
    const b: Vector3DTupleType = [1, 1, 1];
    assert.deepEqual(sub(a, b), [2, 1, 0]);
  });

  test('dot matches known value', () => {
    assert.equal(dot([1, 2, 3], [4, 5, 6]), 32);
  });

  test('dot is symmetric: a·b = b·a', () => {
    const a: Vector3DTupleType = [1.2, -3.4, 5.6];
    const b: Vector3DTupleType = [-7.8, 9.1, -2.3];
    relClose(dot(a, b), dot(b, a));
  });

  test('dot relates to norm: dot(v,v) = norm(v)^2', () => {
    const v: Vector3DTupleType = [1.2, -3.4, 5.6];
    relClose(dot(v, v), Math.pow(norm(v), 2));
  });

  /* ----------------------------- angle helpers ----------------------------- */

  test('norm2pi returns values in [0, 2π)', () => {
    const samples = [
      -10 * TWO_PI - 0.1,
      -TWO_PI,
      -Math.PI,
      -0.1,
      0,
      0.1,
      Math.PI,
      TWO_PI,
      10 * TWO_PI + 0.1
    ];

    for (const x of samples) {
      const y = norm2pi(x);
      assert.ok(y >= 0, `expected >= 0, got ${y} for x=${x}`);
      assert.ok(y < TWO_PI, `expected < 2π, got ${y} for x=${x}`);
    }
  });

  test('norm2pi is periodic: norm2pi(x + 2πk) = norm2pi(x)', () => {
    const x = 1.2345;
    const k = 7;

    const y1 = norm2pi(x);
    const y2 = norm2pi(x + k * TWO_PI);

    relClose(y2, y1);
  });

  test('norm2pi maps -π/2 to 3π/2', () => {
    relClose(norm2pi(-Math.PI / 2), (3 * Math.PI) / 2);
  });

  /* ----------------------------- kepler residual ---------------------------- */

  test('residual matches definition: E - e*sin(E) - norm2pi(M)', () => {
    const E = 1.0;
    const e = 0.1;
    const M = 0.9;

    const r = residual(E, e, M);
    const expected = E - e * Math.sin(E) - norm2pi(M);

    relClose(r, expected);
  });

  test('residual(E,e,M) is invariant under adding 2π to M (because M is wrapped)', () => {
    const E = 2.0;
    const e = 0.3;
    const M = 1.5;

    const r1 = residual(E, e, M);
    const r2 = residual(E, e, M + TWO_PI);

    absClose(r1, r2, 1e-12);
  });

  test('when e = 0, residual reduces to E - norm2pi(M)', () => {
    const E = 1.234;
    const e = 0;
    const M = -0.5;

    const r = residual(E, e, M);
    relClose(r, E - norm2pi(M));
  });

  test("for an exact solution of Kepler's equation, residual is ~0", () => {
    // Choose E and e, then define M = E - e*sin(E) (within [0,2π)).
    const E = 1.7;
    const e = 0.2;

    const M = norm2pi(E - e * Math.sin(E));
    const r = residual(E, e, M);

    absClose(r, 0, 1e-12);
  });
});
