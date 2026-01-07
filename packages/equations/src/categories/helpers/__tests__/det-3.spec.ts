import type { Matrix3x3Type } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';
import { det3 } from '../det-3';

describe('det3', () => {
  test('returns 1 for the identity matrix', () => {
    const I: Matrix3x3Type = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

    assert.equal(det3(I), 1);
  });

  test('matches the documented example (det = 1)', () => {
    const A: Matrix3x3Type = [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0]
    ];

    assert.equal(det3(A), 1);
  });

  test('returns 0 for a singular matrix (dependent rows)', () => {
    const A: Matrix3x3Type = [
      [1, 2, 3],
      [2, 4, 6], // 2x row0
      [7, 8, 9]
    ];

    assert.equal(det3(A), 0);
  });

  test('changes sign when two rows are swapped', () => {
    const A: Matrix3x3Type = [
      [2, 3, 5],
      [7, 11, 13],
      [17, 19, 23]
    ];

    const B: Matrix3x3Type = [
      [7, 11, 13], // swap row0 and row1
      [2, 3, 5],
      [17, 19, 23]
    ];

    const detA = det3(A);
    const detB = det3(B);

    relClose(detB, -detA);
  });

  test('scales by k^3 when the entire matrix is scaled by k', () => {
    const A: Matrix3x3Type = [
      [1.5, -2, 0.25],
      [0, 3, 4],
      [-1, 0.5, 2]
    ];

    const k = -3.5;

    const kA: Matrix3x3Type = [
      [k * A[0][0], k * A[0][1], k * A[0][2]],
      [k * A[1][0], k * A[1][1], k * A[1][2]],
      [k * A[2][0], k * A[2][1], k * A[2][2]]
    ];

    const detA = det3(A);
    const detKA = det3(kA);

    relClose(detKA, detA * k * k * k);
  });

  test('returns +1 for a simple rotation matrix about X by 90°', () => {
    // R1(π/2)
    const c = Math.cos(Math.PI / 2);
    const s = Math.sin(Math.PI / 2);

    const R: Matrix3x3Type = [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c]
    ];

    absClose(det3(R), 1, 1e-12);
  });
});
