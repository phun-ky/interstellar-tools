import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { rocketDeltaVFromVe } from '../rocket-delta-v-from-ve';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('rocketDeltaVFromVe', () => {
  test('computes Δv = ve * ln(m0/mf) for typical inputs', () => {
    const ve = 3100; // m/s
    const m0 = 1200; // kg
    const mf = 800; // kg

    const dv = rocketDeltaVFromVe(ve, m0, mf);

    const expected = ve * Math.log(m0 / mf);
    relClose(dv, expected);
    assert.ok(dv > 0);
  });

  test('returns 0 when m0 === mf (but function disallows this, so we test a near-limit case)', () => {
    const ve = 3000;
    const m0 = 1000;
    const mf = 999.999;

    const dv = rocketDeltaVFromVe(ve, m0, mf);

    // ln(1 + tiny) ~ tiny
    assert.ok(dv >= 0);
    assert.ok(dv < 10, `expected small dv, got ${dv}`);
  });

  test('scales linearly with ve (doubling ve doubles Δv)', () => {
    const m0 = 1200;
    const mf = 800;

    const dv1 = rocketDeltaVFromVe(1000, m0, mf);
    const dv2 = rocketDeltaVFromVe(2000, m0, mf);

    relClose(dv2 / dv1, 2);
  });

  test('increases as mf decreases (more propellant -> higher Δv)', () => {
    const ve = 3000;
    const m0 = 1000;

    const dvLessProp = rocketDeltaVFromVe(ve, m0, 900);
    const dvMoreProp = rocketDeltaVFromVe(ve, m0, 500);

    assert.ok(
      dvMoreProp > dvLessProp,
      `${dvMoreProp} should be > ${dvLessProp}`
    );
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => rocketDeltaVFromVe(Number.NaN, 1, 0.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 've must be a finite number. Received: NaN'
    );

    assert.throws(
      () => rocketDeltaVFromVe(1, Number.POSITIVE_INFINITY, 0.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm0 must be a finite number. Received: Infinity'
    );

    assert.throws(
      () => rocketDeltaVFromVe(1, 1, Number.NEGATIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mf must be a finite number. Received: -Infinity'
    );
  });

  test('throws RangeError when ve <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromVe(0, 10, 5),
      (err) =>
        err instanceof RangeError &&
        err.message === 've must be > 0. Received: 0'
    );
  });

  test('throws RangeError when m0 <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromVe(1, 0, 0.5),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm0 must be > 0. Received: 0'
    );
  });

  test('throws RangeError when mf <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromVe(1, 10, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be > 0. Received: 0'
    );
  });

  test('throws RangeError when mf >= m0', () => {
    assert.throws(
      () => rocketDeltaVFromVe(1, 10, 10),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be < m0. Received: mf=10, m0=10'
    );

    assert.throws(
      () => rocketDeltaVFromVe(1, 10, 11),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be < m0. Received: mf=11, m0=10'
    );
  });
});
