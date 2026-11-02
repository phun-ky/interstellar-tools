import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { burnTime } from '../burn-time.js';
import { initialMassForDeltaV } from '../initial-mass-for-delta-v.js';
import { massFlowRate } from '../mass-flow-rate.js';
import { rocketDeltaVFromIsp } from '../rocket-delta-v-from-isp.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('burnTime', () => {
  test('equals the propellant used divided by the mass flow rate', () => {
    const m0 = 1200;
    const dv = 500;
    const F = 400;
    const Isp = 320;
    const mf = m0 * Math.exp(-dv / (Isp * 9.80665));

    relClose(burnTime(m0, dv, F, Isp), (m0 - mf) / massFlowRate(F, Isp));
  });

  test('matches the documented example (≈ 1387 s)', () => {
    assert.equal(Math.round(burnTime(1200, 500, 400, 320)), 1387);
  });

  test('round-trips with rocketDeltaVFromIsp through the final mass', () => {
    const m0 = 5000;
    const F = 15_000;
    const Isp = 310;
    const mf = 3000;
    const dv = rocketDeltaVFromIsp(Isp, m0, mf);

    relClose(burnTime(m0, dv, F, Isp), (m0 - mf) / massFlowRate(F, Isp));
    relClose(initialMassForDeltaV(mf, dv, Isp), m0);
  });

  test('is 0 for dv = 0 and accurate for tiny burns', () => {
    assert.equal(burnTime(1000, 0, 100, 300), 0);

    // For dv ≪ ve, t ≈ m0 * dv / F
    relClose(burnTime(1000, 1e-6, 100, 300), (1000 * 1e-6) / 100, 1e-9);
  });

  test('uses provided g0 when passed', () => {
    const t = burnTime(1000, 300, 500, 300, 10);

    relClose(t, ((1000 * 3000) / 500) * (1 - Math.exp(-300 / 3000)));
  });

  test('throws TypeError when any input is not finite', () => {
    for (const [args, name, value] of [
      [[Number.NaN, 1, 1, 1], 'm0', 'NaN'],
      [[1, Number.NaN, 1, 1], 'dv', 'NaN'],
      [[1, 1, Number.POSITIVE_INFINITY, 1], 'F', 'Infinity'],
      [[1, 1, 1, Number.NaN], 'Isp', 'NaN']
    ] as const) {
      assert.throws(
        () => burnTime(...(args as [number, number, number, number])),
        (err) =>
          err instanceof TypeError &&
          err.message === `${name} must be a finite number. Received: ${value}`
      );
    }
    assert.throws(
      () => burnTime(1, 1, 1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g0 must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError for out-of-domain inputs', () => {
    assert.throws(
      () => burnTime(0, 1, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm0 must be > 0. Received: 0'
    );
    assert.throws(
      () => burnTime(1, -1, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'dv must be >= 0. Received: -1'
    );
    assert.throws(
      () => burnTime(1, 1, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'F must be > 0. Received: 0'
    );
    assert.throws(
      () => burnTime(1, 1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Isp must be > 0. Received: 0'
    );
    assert.throws(
      () => burnTime(1, 1, 1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'g0 must be > 0. Received: 0'
    );
  });
});
