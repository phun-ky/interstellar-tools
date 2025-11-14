import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, dot, norm, relClose } from './helpers';
import { specificAngularMomentum } from '../categories/orbits/specific-angular-momentum';
import { Vector3DTupleType } from '@interstellar-tools/types';

describe('specificAngularMomentum', () => {
  test('orthogonal state: r ⟂ v → h = r * v', () => {
    const r: Vector3DTupleType = [6778e3, 0, 0]; // m
    const v: Vector3DTupleType = [0, 7.67e3, 0]; // m/s
    const h = specificAngularMomentum(r, v);
    const expected = norm(r) * norm(v); // r*v_perp (since perp)
    relClose(h, expected, 1e-14);
  });

  test('manual cross vs function: ||r×v|| matches', () => {
    const r: Vector3DTupleType = [1.2e7, -3.4e6, 5.6e6];
    const v: Vector3DTupleType = [-7.8e3, 9.1e3, 2.3e3];

    const hx = r[1] * v[2] - r[2] * v[1];
    const hy = r[2] * v[0] - r[0] * v[2];
    const hz = r[0] * v[1] - r[1] * v[0];
    const expected = Math.hypot(hx, hy, hz);

    const h = specificAngularMomentum(r, v);
    relClose(h, expected, 1e-15);
  });

  test('scalar identity: h = |r| |v| sin(theta)', () => {
    const r: Vector3DTupleType = [7e6, 2e6, -1e6];
    const v: Vector3DTupleType = [1e3, -7e3, 4e3];
    const rr = norm(r);
    const vv = norm(v);
    const cosT = dot(r, v) / (rr * vv);
    const sinT = Math.sqrt(Math.max(0, 1 - cosT * cosT));
    const expected = rr * vv * sinT;

    const h = specificAngularMomentum(r, v);
    relClose(h, expected, 1e-12);
  });

  test('parallel vectors (purely radial) → h = 0', () => {
    const r: Vector3DTupleType = [8e6, -2e6, 4e6];
    const k = 3.5e-3; // arbitrary scale to mimic m/s
    const v: Vector3DTupleType = [k * r[0], k * r[1], k * r[2]];
    const h = specificAngularMomentum(r, v);
    absClose(h, 0, 1e-12);
  });

  test('zero velocity → h = 0', () => {
    const r: Vector3DTupleType = [7e6, 0, 0];
    const v: Vector3DTupleType = [0, 0, 0];
    const h = specificAngularMomentum(r, v);
    absClose(h, 0, 1e-12);
  });

  test('rotation invariance of magnitude (rotate 90° about z)', () => {
    const r: Vector3DTupleType = [5e6, 2e6, 0];
    const v: Vector3DTupleType = [1e3, 3e3, 0];

    const h1 = specificAngularMomentum(r, v);

    // 90° rotation about z: (x,y) -> (-y, x)
    const r2: Vector3DTupleType = [-r[1], r[0], 0];
    const v2: Vector3DTupleType = [-v[1], v[0], 0];

    const h2 = specificAngularMomentum(r2, v2);
    relClose(h2, h1, 1e-15);
  });

  test('units sanity (circular identity): h ≈ sqrt(mu * r) with v_c = sqrt(mu/r)', () => {
    const mu = 3.986004418e14; // Earth GM
    const r: Vector3DTupleType = [6778e3, 0, 0];
    const v: Vector3DTupleType = [0, Math.sqrt(mu / r[0]), 0];
    const h = specificAngularMomentum(r, v);
    const expected = Math.sqrt(mu * r[0]);
    relClose(h, expected, 1e-12);
  });

  test('input validation: non-finite components throw', () => {
    const rOK: Vector3DTupleType = [7e6, 0, 0];
    const vOK: Vector3DTupleType = [0, 7.5e3, 0];

    assert.throws(
      () =>
        specificAngularMomentum([Number.NaN, 0, 0] as Vector3DTupleType, vOK),
      /finite/
    );
    assert.throws(
      () =>
        specificAngularMomentum(
          [Infinity, 0, 0] as unknown as Vector3DTupleType,
          vOK
        ),
      /finite/
    );
    assert.throws(
      () =>
        specificAngularMomentum(rOK, [0, Number.NaN, 0] as Vector3DTupleType),
      /finite/
    );
  });

  test('input validation: zero-length position vector throws', () => {
    const rZero: Vector3DTupleType = [0, 0, 0];
    const v: Vector3DTupleType = [1e3, 2e3, 3e3];
    assert.throws(() => specificAngularMomentum(rZero, v), /non-zero/);
  });

  test('numerical stability: very large magnitudes still finite', () => {
    const r: Vector3DTupleType = [1e9, 1e9, 1e9];
    const v: Vector3DTupleType = [1e5, -2e5, 3e5];
    const h = specificAngularMomentum(r, v);
    assert.ok(Number.isFinite(h) && h >= 0);
  });
});
