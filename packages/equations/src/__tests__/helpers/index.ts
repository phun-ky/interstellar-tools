import { Vector3DTupleType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';

export const relClose = (a: number, b: number, eps = 1e-12, msg?: string) => {
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

export const norm = (v: Vector3DTupleType) => {
  return Math.hypot(v[0], v[1], v[2]);
};

export const scale = (v: Vector3DTupleType, s: number): Vector3DTupleType => {
  return [v[0] * s, v[1] * s, v[2] * s];
};

export const sub = (
  a: Vector3DTupleType,
  b: Vector3DTupleType
): Vector3DTupleType => {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
};

export const absClose = (a: number, b: number, eps = 1e-12, msg?: string) => {
  assert.ok(Math.abs(a - b) <= eps, msg ?? `|${a} - ${b}| > ${eps}`);
};

export const dot = (a: Vector3DTupleType, b: Vector3DTupleType) => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
