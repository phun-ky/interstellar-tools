import { TWO_PI } from '@interstellar-tools/constants';
import type {
  Matrix3x3Type,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { norm2pi } from '../../categories/helpers/misc';

export const relClose = (
  a: number | null,
  b: number,
  eps = 1e-12,
  msg?: string
) => {
  if (a === null) {
    assert.fail();
  }
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  assert.ok(
    Math.abs(a - b) <= eps * scale,
    msg ?? `|${a} - ${b}| > ${eps} * ${scale}`
  );
};

export const vecRelClose = (
  a: Vector3DTupleType,
  b: Vector3DTupleType,
  eps = 1e-12,
  msg?: string
) => {
  assert.equal(a.length, 3);
  assert.equal(b.length, 3);
  for (let i = 0; i < 3; i++) {
    relClose(a[i], b[i], eps, msg);
  }
};

export const absClose = (a: number, b: number, eps = 1e-12, msg?: string) => {
  assert.ok(Math.abs(a - b) <= eps, msg ?? `|${a} - ${b}| > ${eps}`);
};

export const angleClose = (a: number, b: number, eps = 1e-12) => {
  const da = Math.abs(norm2pi(a) - norm2pi(b));
  const d = Math.min(da, TWO_PI - da);
  assert.ok(d <= eps, `angles not close: |Δ|=${d} > ${eps}`);
};

export const relCloseTuple = (
  a: readonly number[],
  b: readonly number[],
  eps = 1e-12
) => {
  assert.equal(a.length, b.length);
  for (let i = 0; i < a.length; i++) relClose(a[i], b[i], eps);
};

export const matAbsClose = (
  A: Matrix3x3Type,
  B: Matrix3x3Type,
  eps = 1e-12
) => {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      absClose(A[r][c], B[r][c], eps, `mismatch at [${r}][${c}]`);
    }
  }
};

export const matRelClose = (
  A: Matrix3x3Type,
  B: Matrix3x3Type,
  eps = 1e-12
) => {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      relClose(A[r][c], B[r][c], eps, `mismatch at [${r}][${c}]`);
    }
  }
};
