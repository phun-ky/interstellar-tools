import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { massFlowRate } from '../mass-flow-rate.js';
import { rocketThrust } from '../rocket-thrust.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('rocketThrust', () => {
  test('adds the pressure term to the momentum thrust', () => {
    assert.equal(rocketThrust(250, 3000, 70_000, 0, 1.2), 834_000);
    relClose(rocketThrust(250, 3000, 70_000, 101_325, 1.2), 712_410);
  });

  test('is mDot * ve with a matched nozzle (pe = pa)', () => {
    assert.equal(rocketThrust(250, 3000, 50_000, 50_000, 1.2), 750_000);
  });

  test('gives more thrust in vacuum than at sea level', () => {
    assert.ok(
      rocketThrust(250, 3000, 70_000, 0, 1.2) >
        rocketThrust(250, 3000, 70_000, 101_325, 1.2)
    );
  });

  test('round-trips with massFlowRate when ve = Isp * g0 and pe = pa', () => {
    const F = 15_000;
    const Isp = 310;

    relClose(rocketThrust(massFlowRate(F, Isp), Isp * 9.80665, 0, 0, 1), F);
  });

  test('throws TypeError when any input is not finite', () => {
    for (const [i, name] of ['mDot', 've', 'pe', 'pa', 'Ae'].entries()) {
      const args = [1, 1, 1, 1, 1];

      args[i] = Number.NaN;
      assert.throws(
        () =>
          rocketThrust(...(args as [number, number, number, number, number])),
        (err) =>
          err instanceof TypeError &&
          err.message === `${name} must be a finite number. Received: NaN`
      );
    }
  });

  test('throws RangeError for negative inputs', () => {
    for (const [i, name] of ['mDot', 've', 'pe', 'pa', 'Ae'].entries()) {
      const args = [1, 1, 1, 1, 1];

      args[i] = -1;
      assert.throws(
        () =>
          rocketThrust(...(args as [number, number, number, number, number])),
        (err) =>
          err instanceof RangeError &&
          err.message === `${name} must be >= 0. Received: -1`
      );
    }
  });
});
