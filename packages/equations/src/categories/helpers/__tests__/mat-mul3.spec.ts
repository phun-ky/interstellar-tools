import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { matRelClose } from 'packages/equations/src/__tests__/helpers';
import { matMul3 } from '../mat-mul3';
import { Matrix3x3Type } from '@interstellar-tools/types';

const I3: Matrix3x3Type = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

describe('matMul3', () => {
  test('identity is neutral: I*A = A and A*I = A', () => {
    const A: Matrix3x3Type = [
      [2, 3, 5],
      [7, 11, 13],
      [17, 19, 23]
    ];

    matRelClose(matMul3(I3, A), A);
    matRelClose(matMul3(A, I3), A);
  });

  test('matches a known product (example matrices)', () => {
    const A: Matrix3x3Type = [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0]
    ];

    const B: Matrix3x3Type = [
      [-2, 1, 0],
      [3, 0, 0],
      [4, 5, 1]
    ];

    const C = matMul3(A, B);

    // Computed by hand / verified:
    const expected: Matrix3x3Type = [
      [16, 16, 3],
      [19, 20, 4],
      [8, 5, 0]
    ];

    assert.deepEqual(C, expected);
  });

  test('is associative: (A*B)*C = A*(B*C)', () => {
    const A: Matrix3x3Type = [
      [1.5, -2, 0.25],
      [0, 3, 4],
      [-1, 0.5, 2]
    ];
    const B: Matrix3x3Type = [
      [2, 0, 1],
      [-1, 3, 0],
      [4, -2, 0.5]
    ];
    const C: Matrix3x3Type = [
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6],
      [0.7, 0.8, 0.9]
    ];

    const left = matMul3(matMul3(A, B), C);
    const right = matMul3(A, matMul3(B, C));

    matRelClose(left, right, 1e-12);
  });

  test('distributes over addition: A*(B+C) = A*B + A*C', () => {
    const A: Matrix3x3Type = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const B: Matrix3x3Type = [
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1]
    ];
    const C: Matrix3x3Type = [
      [1, 0, 1],
      [0, 1, 0],
      [2, 0, 2]
    ];

    const add = (X: Matrix3x3Type, Y: Matrix3x3Type): Matrix3x3Type =>
      [
        [X[0][0] + Y[0][0], X[0][1] + Y[0][1], X[0][2] + Y[0][2]],
        [X[1][0] + Y[1][0], X[1][1] + Y[1][1], X[1][2] + Y[1][2]],
        [X[2][0] + Y[2][0], X[2][1] + Y[2][1], X[2][2] + Y[2][2]]
      ] as const;

    const left = matMul3(A, add(B, C));
    const right = add(matMul3(A, B), matMul3(A, C));

    matRelClose(left, right, 1e-12);
  });
});
