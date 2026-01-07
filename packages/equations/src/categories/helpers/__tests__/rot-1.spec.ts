import type {
  Matrix3x3Type,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { rot1 } from '../rot-1';
import {
  absClose,
  matRelClose
} from 'packages/equations/src/__tests__/helpers';
import { applyMatrix3 } from '../apply-matrix-3';
import { matMul3 } from '../mat-mul3';
import { transpose3 } from '../transpose-3';
import { det3 } from '../det-3';

const I3: Matrix3x3Type = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

describe('rot1', () => {
  test('returns identity at theta = 0', () => {
    const R = rot1(0 as Radians);
    matRelClose(R, I3, 1e-12);
  });

  test('rotates Y to +Z by +90° about +X (right-handed active rotation)', () => {
    const R = rot1((Math.PI / 2) as Radians);

    const yAxis: Vector3DTupleType = [0, 1, 0];
    const out = applyMatrix3(R, yAxis);

    // Expect [0, 0, 1]
    absClose(out[0], 0, 1e-12);
    absClose(out[1], 0, 1e-12);
    absClose(out[2], 1, 1e-12);
  });

  test('rotates Z to -Y by +90° about +X', () => {
    const R = rot1((Math.PI / 2) as Radians);

    const zAxis: Vector3DTupleType = [0, 0, 1];
    const out = applyMatrix3(R, zAxis);

    // Expect [0, -1, 0]
    absClose(out[0], 0, 1e-12);
    absClose(out[1], -1, 1e-12);
    absClose(out[2], 0, 1e-12);
  });

  test('is orthonormal: RᵀR ≈ I', () => {
    const R = rot1(1.234 as Radians);
    const RtR = matMul3(transpose3(R), R);
    matRelClose(RtR, I3, 1e-12);
  });

  test('has determinant +1 (proper rotation)', () => {
    const R = rot1(0.789 as Radians);
    absClose(det3(R), 1, 1e-12, `det(R) expected ~1`);
  });

  test('inverse equals rotation by -theta: R(theta) * R(-theta) ≈ I', () => {
    const theta = 0.456 as Radians;
    const R = rot1(theta);
    const Rinv = rot1(-0.456 as Radians);

    matRelClose(matMul3(R, Rinv), I3, 1e-12);
  });

  test('throws TypeError when theta is not finite', () => {
    assert.throws(
      () => rot1(Number.NaN as Radians),
      (err) =>
        err instanceof TypeError &&
        err.message === 'theta must be finite. Received: NaN'
    );

    assert.throws(
      () => rot1(Number.POSITIVE_INFINITY as Radians),
      (err) =>
        err instanceof TypeError &&
        err.message === 'theta must be finite. Received: Infinity'
    );
  });
});
