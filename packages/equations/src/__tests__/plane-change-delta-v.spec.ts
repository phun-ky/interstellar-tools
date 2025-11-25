import { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { planeChangeDeltaV } from '../categories/manoeuvres/plane-change-delta-v';
import { absClose, relClose } from './helpers';

const PI = Math.PI;
const toRad = (deg: number) => ((deg * PI) / 180) as Radians;

describe('planeChangeDeltaV', () => {
  test('Δi = 0 → Δv = 0', () => {
    const v = 7600; // m/s
    const dv = planeChangeDeltaV(v, 0 as Radians);
    absClose(dv, 0);
  });

  test('Δi = π (180°) → Δv = 2v', () => {
    const v = 7600;
    const dv = planeChangeDeltaV(v, PI as Radians);
    absClose(dv, 2 * v);
  });

  test('Δi = 90° → Δv = 2 v sin(45°) = √2 v', () => {
    const v = 7600;
    const dv = planeChangeDeltaV(v, toRad(90));
    relClose(dv, Math.SQRT2 * v, 1e-12);
  });

  test('correctness for several angles (equality with formula)', () => {
    const v = 7500;
    const angles: Radians[] = [
      toRad(5),
      toRad(10),
      toRad(30),
      toRad(60),
      toRad(120)
    ];
    for (const di of angles) {
      const expected = 2 * v * Math.sin((di as number) / 2);
      const dv = planeChangeDeltaV(v, di);
      absClose(dv, expected, 1e-12, `mismatch for Δi=${di}`);
    }
  });

  test('monotonicity: Δv increases with Δi on [0, π]', () => {
    const v = 8000;
    const seq: Radians[] = [
      toRad(0),
      toRad(10),
      toRad(30),
      toRad(60),
      toRad(120),
      toRad(180)
    ];
    let last = -1;
    for (const di of seq) {
      const dv = planeChangeDeltaV(v, di);
      assert.ok(
        dv >= last - 1e-12,
        `not monotone at Δi=${di}: ${dv} < ${last}`
      );
      last = dv;
    }
  });

  test('scales linearly with speed v', () => {
    const di = toRad(25);
    const v1 = 6000;
    const v2 = 9000;
    const dv1 = planeChangeDeltaV(v1, di);
    const dv2 = planeChangeDeltaV(v2, di);
    absClose(dv2 / dv1, v2 / v1, 1e-12);
  });

  test('input validation: TypeError for non-number v', () => {
    assert.throws(() => planeChangeDeltaV('7600' as any, toRad(10)), TypeError);
  });

  test('input validation: RangeError for v non-finite or negative', () => {
    assert.throws(() => planeChangeDeltaV(NaN, toRad(10)), RangeError);
    assert.throws(() => planeChangeDeltaV(Infinity, toRad(10)), RangeError);
    assert.throws(() => planeChangeDeltaV(-1, toRad(10)), RangeError);
  });

  test('input validation: TypeError for non-number deltaI', () => {
    assert.throws(() => planeChangeDeltaV(7600, '0.1' as any), TypeError);
  });

  test('input validation: RangeError for deltaI non-finite', () => {
    assert.throws(
      () => planeChangeDeltaV(7600, NaN as unknown as Radians),
      RangeError
    );
    assert.throws(
      () => planeChangeDeltaV(7600, Infinity as unknown as Radians),
      RangeError
    );
  });

  test('input validation: RangeError for deltaI out of [0, π]', () => {
    assert.throws(() => planeChangeDeltaV(7600, -1e-6 as Radians), RangeError);
    assert.throws(
      () => planeChangeDeltaV(7600, (PI + 1e-6) as Radians),
      RangeError
    );
  });

  test('edge tolerances: very small Δi returns ≈ 2 v * (Δi/2) = v*Δi', () => {
    const v = 7800;
    const di = 1e-9 as Radians;
    const dv = planeChangeDeltaV(v, di);
    const smallAngleApprox = v * (di as number);
    absClose(dv, smallAngleApprox, 1e-12);
  });
});
