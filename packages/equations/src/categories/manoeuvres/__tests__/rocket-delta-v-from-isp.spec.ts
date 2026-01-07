import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { rocketDeltaVFromIsp } from '../rocket-delta-v-from-isp';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('rocketDeltaVFromIsp', () => {
  test('computes Δv = g0 * Isp * ln(m0/mf) for typical inputs (default g0)', () => {
    const Isp = 320; // s
    const m0 = 1200; // kg
    const mf = 800; // kg

    const dv = rocketDeltaVFromIsp(Isp, m0, mf);

    const expected = 9.80665 * Isp * Math.log(m0 / mf);
    relClose(dv, expected);
    assert.ok(dv > 0);
  });

  test('uses provided g0 when passed', () => {
    const Isp = 300;
    const m0 = 1000;
    const mf = 500;
    const g0 = 9.81;

    const dv = rocketDeltaVFromIsp(Isp, m0, mf, g0);

    const expected = g0 * Isp * Math.log(m0 / mf);
    relClose(dv, expected);
  });

  test('scales linearly with Isp (doubling Isp doubles Δv)', () => {
    const m0 = 1200;
    const mf = 800;

    const dv1 = rocketDeltaVFromIsp(200, m0, mf);
    const dv2 = rocketDeltaVFromIsp(400, m0, mf);

    relClose(dv2 / dv1, 2);
  });

  test('scales linearly with g0 (doubling g0 doubles Δv)', () => {
    const Isp = 300;
    const m0 = 1200;
    const mf = 800;

    const dv1 = rocketDeltaVFromIsp(Isp, m0, mf, 9.80665);
    const dv2 = rocketDeltaVFromIsp(Isp, m0, mf, 2 * 9.80665);

    relClose(dv2 / dv1, 2);
  });

  test('increases as mf decreases (more propellant -> higher Δv)', () => {
    const Isp = 320;
    const m0 = 1000;

    const dvLessProp = rocketDeltaVFromIsp(Isp, m0, 900);
    const dvMoreProp = rocketDeltaVFromIsp(Isp, m0, 500);

    assert.ok(
      dvMoreProp > dvLessProp,
      `${dvMoreProp} should be > ${dvLessProp}`
    );
  });

  test('near-limit case (mf close to m0) yields a small Δv', () => {
    const dv = rocketDeltaVFromIsp(300, 1000, 999.999);
    assert.ok(dv >= 0);
    assert.ok(dv < 10, `expected small dv, got ${dv}`);
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => rocketDeltaVFromIsp(Number.NaN, 1, 0.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Isp must be a finite number. Received: NaN'
    );

    assert.throws(
      () => rocketDeltaVFromIsp(300, Number.POSITIVE_INFINITY, 0.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm0 must be a finite number. Received: Infinity'
    );

    assert.throws(
      () => rocketDeltaVFromIsp(300, 1, Number.NEGATIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mf must be a finite number. Received: -Infinity'
    );

    assert.throws(
      () => rocketDeltaVFromIsp(300, 1, 0.5, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g0 must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError when Isp <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromIsp(0, 10, 5),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Isp must be > 0. Received: 0'
    );
  });

  test('throws RangeError when g0 <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromIsp(300, 10, 5, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'g0 must be > 0. Received: 0'
    );
  });

  test('throws RangeError when m0 <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromIsp(300, 0, 0.5),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm0 must be > 0. Received: 0'
    );
  });

  test('throws RangeError when mf <= 0', () => {
    assert.throws(
      () => rocketDeltaVFromIsp(300, 10, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be > 0. Received: 0'
    );
  });

  test('throws RangeError when mf >= m0', () => {
    assert.throws(
      () => rocketDeltaVFromIsp(300, 10, 10),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be < m0. Received: mf=10, m0=10'
    );

    assert.throws(
      () => rocketDeltaVFromIsp(300, 10, 11),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be < m0. Received: mf=11, m0=10'
    );
  });
});
