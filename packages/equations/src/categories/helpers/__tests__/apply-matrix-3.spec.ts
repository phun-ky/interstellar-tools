import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import type {
  Matrix3x3Type,
  Vector3DTupleType
} from '@interstellar-tools/types';
import { applyMatrix3 } from '../apply-matrix-3';
import { vecRelClose } from 'packages/equations/src/__tests__/helpers';

describe('applyMatrix3', () => {
  test('applies identity matrix (returns same vector)', () => {
    const I: Matrix3x3Type = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

    const v: Vector3DTupleType = [1, 2, 3];

    const out = applyMatrix3(I, v);
    assert.deepEqual(out, v);
  });

  test('matches the documented example', () => {
    const M: Matrix3x3Type = [
      [1, 0, 0],
      [0, 0, -1],
      [0, 1, 0]
    ];

    const v: Vector3DTupleType = [1, 2, 3];

    const out = applyMatrix3(M, v);
    assert.deepEqual(out, [1, -3, 2]);
  });

  test('handles a general matrix-vector multiplication', () => {
    const M: Matrix3x3Type = [
      [2, 3, 5],
      [7, 11, 13],
      [17, 19, 23]
    ];
    const v: Vector3DTupleType = [29, 31, 37];

    const out = applyMatrix3(M, v);

    const expected: Vector3DTupleType = [
      2 * 29 + 3 * 31 + 5 * 37,
      7 * 29 + 11 * 31 + 13 * 37,
      17 * 29 + 19 * 31 + 23 * 37
    ];

    assert.deepEqual(out, expected);
  });

  test('is linear: M*(u+v) = M*u + M*v', () => {
    const M: Matrix3x3Type = [
      [1.5, -2, 0.25],
      [0, 3, 4],
      [-1, 0.5, 2]
    ];

    const u: Vector3DTupleType = [1, 2, 3];
    const v: Vector3DTupleType = [-4, 5, -6];

    const uPlusV: Vector3DTupleType = [u[0] + v[0], u[1] + v[1], u[2] + v[2]];

    const left = applyMatrix3(M, uPlusV);
    const rightU = applyMatrix3(M, u);
    const rightV = applyMatrix3(M, v);
    const right: Vector3DTupleType = [
      rightU[0] + rightV[0],
      rightU[1] + rightV[1],
      rightU[2] + rightV[2]
    ];

    vecRelClose(left, right);
  });

  test('is homogeneous: M*(k*v) = k*(M*v)', () => {
    const M: Matrix3x3Type = [
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6],
      [0.7, 0.8, 0.9]
    ];

    const v: Vector3DTupleType = [1.1, -2.2, 3.3];
    const k = -7.5;

    const kv: Vector3DTupleType = [k * v[0], k * v[1], k * v[2]];

    const left = applyMatrix3(M, kv);
    const right0 = applyMatrix3(M, v);
    const right: Vector3DTupleType = [
      k * right0[0],
      k * right0[1],
      k * right0[2]
    ];

    vecRelClose(left, right);
  });
});
