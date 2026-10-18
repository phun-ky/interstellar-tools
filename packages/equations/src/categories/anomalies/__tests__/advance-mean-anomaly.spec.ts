import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { advanceMeanAnomaly } from '../advance-mean-anomaly.js';

import { OrbitInterface, TemporalInterface } from '@interstellar-tools/types';
import { TWO_PI } from '@interstellar-tools/constants';
import { trueToMeanAnomaly } from '../true-to-mean-anomaly.js';
import { wrapAngle } from '../../angle/wrap-angle.js';
import { norm2pi } from '../../helpers/misc.js';

const EPSILON = 1e-10; // Increased tolerance for floating-point comparisons

/* node:coverage disable */
const assertApproxEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `Expected ~${expected}, got ${actual}`
  );
};
/* node:coverage enable */

describe('advanceMeanAnomaly', () => {
  test('Circular Orbit (e=0)', () => {
    const body: OrbitInterface = {
      e: 0,
      angle: Math.PI / 2,
      period: { value: 365, unit: 'd' }
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 100, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    /* node:coverage disable */
    const expectedM = wrapAngle(Math.PI / 2 + meanMotion * 100);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Elliptical Orbit (e > 0)', () => {
    const body: OrbitInterface = {
      e: 0.5,
      angle: Math.PI / 2,
      period: { value: 200, unit: 'd' }
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 50, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 =
      body.e === 0 ? body.angle : trueToMeanAnomaly(body.angle, body.e);
    /* node:coverage disable */
    const expectedM = wrapAngle(M0 + meanMotion * 50);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Long Time Steps Are Not Capped', () => {
    const body: OrbitInterface = {
      e: 0.1,
      angle: 1.0,
      period: { value: 100, unit: 'd' }
    } as OrbitInterface;
    // 20.5 orbits: the old 10-orbit cap would have returned the start instead
    const timeStep: TemporalInterface = { value: 2050, unit: 'd' };
    const meanMotion = TWO_PI / body.period.value;
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    const expectedM = norm2pi(M0 + meanMotion * 2050);
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
    assertApproxEqual(result, norm2pi(M0 + Math.PI));
  });

  test('Negative Time Steps Go Back in Time', () => {
    const body: OrbitInterface = {
      e: 0.3,
      angle: 2.0,
      period: { value: 400, unit: 'd' }
    } as OrbitInterface;
    const meanMotion = TWO_PI / body.period.value;
    const M0 = trueToMeanAnomaly(body.angle, body.e);

    assertApproxEqual(
      advanceMeanAnomaly(body, { value: -10, unit: 'd' }),
      norm2pi(M0 - meanMotion * 10)
    );
    // One orbit back is where it started
    assertApproxEqual(
      advanceMeanAnomaly(body, { value: -400, unit: 'd' }),
      norm2pi(M0)
    );
  });

  test('Whole Orbits Return to the Start, Forwards or Back', () => {
    const body: OrbitInterface = {
      e: 0.2,
      angle: 0.7,
      period: { value: -365.25, unit: 'd' }
    } as OrbitInterface;
    const M0 = norm2pi(trueToMeanAnomaly(body.angle, body.e));

    for (const orbits of [1, 7, 1000, -3]) {
      const result = advanceMeanAnomaly(body, {
        value: orbits * 365.25,
        unit: 'd'
      });

      assert.ok(
        Math.abs(result - M0) < 1e-9 ||
          Math.abs(Math.abs(result - M0) - TWO_PI) < 1e-9,
        `${orbits} orbits: ${result} vs ${M0}`
      );
    }
  });

  test('Eccentricity Out of Bounds Throws Error', () => {
    const invalidBodies: OrbitInterface[] = [
      { e: -0.1, angle: 0, period: { value: 365, unit: 'd' } },
      { e: 1.1, angle: 0, period: { value: 365, unit: 'd' } }
    ] as OrbitInterface[];
    const timeStep: TemporalInterface = { value: 10, unit: 'd' };

    for (const body of invalidBodies) {
      assert.throws(() => advanceMeanAnomaly(body, timeStep), RangeError);
    }
  });

  test('Time Step Units Are Converted to Days', () => {
    const body: OrbitInterface = {
      e: 0.3,
      angle: 2.0,
      period: { value: 400, unit: 'd' }
    } as OrbitInterface;
    const oneDay = advanceMeanAnomaly(body, { value: 1, unit: 'd' });

    assertApproxEqual(
      advanceMeanAnomaly(body, { value: 24, unit: 'h' }),
      oneDay
    );
    assertApproxEqual(
      advanceMeanAnomaly(body, { value: 86_400, unit: 's' }),
      oneDay
    );
  });

  test('Years and Days Agree', () => {
    const body: OrbitInterface = {
      e: 0.3,
      angle: 2.0,
      period: { value: 400, unit: 'd' }
    } as OrbitInterface;

    assertApproxEqual(
      advanceMeanAnomaly(body, { value: 1, unit: 'yr' }),
      advanceMeanAnomaly(body, { value: 365.25, unit: 'd' })
    );
  });

  test('Zero Time Step Returns Initial Mean Anomaly', () => {
    const body: OrbitInterface = {
      e: 0.3,
      angle: 2.0,
      period: { value: 400, unit: 'd' }
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 0, unit: 'd' };
    const M0 =
      body.e === 0 ? body.angle : trueToMeanAnomaly(body.angle, body.e);
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, M0);
  });

  test('High Eccentricity Orbit (e ~ 1)', () => {
    const body: OrbitInterface = {
      e: 0.9951,
      angle: -2.1196,
      period: { value: 365.25, unit: 'd' }
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 0.25, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    /* node:coverage disable */
    const expectedM = wrapAngle(M0 + meanMotion * 0.25);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Results Are Wrapped to [0, 2π)', () => {
    const body: OrbitInterface = {
      e: 0.5,
      angle: 3 * Math.PI,
      period: { value: 365, unit: 'd' }
    } as OrbitInterface;
    const meanMotion = TWO_PI / Math.abs(body.period.value);
    const M0 = trueToMeanAnomaly(body.angle, body.e);

    for (const days of [10, -10, 1e6, -1e6]) {
      const result = advanceMeanAnomaly(body, { value: days, unit: 'd' });

      assertApproxEqual(result, norm2pi(M0 + meanMotion * days));
      assert.ok(result >= 0 && result < TWO_PI, `${days} d: ${result}`);
    }
  });

  test('Tiny Time Steps Are Not Rounded Up', () => {
    const body: OrbitInterface = {
      e: 0.5,
      angle: Math.PI / 2,
      period: { value: 365, unit: 'd' }
    } as OrbitInterface;
    const meanMotion = TWO_PI / Math.abs(body.period.value);
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    // One millisecond, far below the old 1e-5 day minimum
    const step = 1 / 86_400_000;

    assertApproxEqual(
      advanceMeanAnomaly(body, { value: step, unit: 'd' }),
      norm2pi(M0 + meanMotion * step)
    );
  });

  test("Halley's Comet", () => {
    const body: OrbitInterface = {
      e: 0.96714,
      angle: (38.38 * Math.PI) / 180, // Convert degrees to radians
      period: { value: 27576, unit: 'd' }
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 100, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    /* node:coverage disable */
    const expectedM = wrapAngle(M0 + meanMotion * 100);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Comet Hale-Bopp', () => {
    const body: OrbitInterface = {
      e: 0.9951,
      angle: (180 * Math.PI) / 180, // Convert degrees to radians
      period: { value: -253533, unit: 'd' } // Positive period for testing
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 0.25, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    /* node:coverage disable */
    const expectedM = wrapAngle(M0 + meanMotion * 0.25);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Comet 67P/Churyumov–Gerasimenko', () => {
    const body: OrbitInterface = {
      e: 0.641,
      angle: 0, // Initial angle in radians
      period: { value: -2484, unit: 'd' } // Positive period for testing
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 10, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    /* node:coverage disable */
    const expectedM = wrapAngle(M0 + meanMotion * 10);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Comet Encke', () => {
    const body: OrbitInterface = {
      e: 0.85,
      angle: (160 * Math.PI) / 180, // Convert degrees to radians
      period: { value: -1204, unit: 'd' } // Positive period for testing
    } as OrbitInterface;
    const timeStep: TemporalInterface = { value: 5, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueToMeanAnomaly(body.angle, body.e);
    /* node:coverage disable */
    const expectedM = wrapAngle(M0 + meanMotion * 5);
    /* node:coverage enable */
    const result = advanceMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });
});
