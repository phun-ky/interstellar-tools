import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { computeMeanAnomaly } from '../compute-mean-anomaly';
import { trueAnomalyToMeanAnomaly } from '../true-anomaly-to-mean-anomaly';
import { wrapAngle } from '../wrap-angle';
import {
  CelestialBodyType,
  TemporalInterface
} from '@interstellar-tools/types';
import { TWO_PI } from '@interstellar-tools/constants';

const EPSILON = 1e-10; // Increased tolerance for floating-point comparisons
const assertApproxEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `Expected ~${expected}, got ${actual}`
  );
};

describe('computeMeanAnomaly', () => {
  test('Circular Orbit (e=0)', () => {
    const body: CelestialBodyType = {
      e: 0,
      angle: Math.PI / 2,
      period: { value: 365, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 100, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const expectedM = wrapAngle(Math.PI / 2 + meanMotion * 100);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Elliptical Orbit (e > 0)', () => {
    const body: CelestialBodyType = {
      e: 0.5,
      angle: Math.PI / 2,
      period: { value: 200, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 50, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 =
      body.e === 0 ? body.angle : trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 50);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Large Time Step Clamping (Max 10 Orbits)', () => {
    const body: CelestialBodyType = {
      e: 0.1,
      angle: 1.0,
      period: { value: 100, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 2000, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const maxAllowedTimeStep = 10 * periodInDays;
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * maxAllowedTimeStep);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Eccentricity Out of Bounds Throws Error', () => {
    const invalidBodies: CelestialBodyType[] = [
      { e: -0.1, angle: 0, period: { value: 365, unit: 'd' } },
      { e: 1.1, angle: 0, period: { value: 365, unit: 'd' } }
    ] as CelestialBodyType[];
    const timeStep: TemporalInterface = { value: 10, unit: 'd' };

    for (const body of invalidBodies) {
      assert.throws(() => computeMeanAnomaly(body, timeStep), RangeError);
    }
  });

  test('Zero Time Step Returns Initial Mean Anomaly', () => {
    const body: CelestialBodyType = {
      e: 0.3,
      angle: 2.0,
      period: { value: 400, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 0, unit: 'd' };
    const M0 =
      body.e === 0 ? body.angle : trueAnomalyToMeanAnomaly(body.angle, body.e);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, M0);
  });

  test('High Eccentricity Orbit (e ~ 1)', () => {
    const body: CelestialBodyType = {
      e: 0.9951,
      angle: -2.1196,
      period: { value: 365.25, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 0.25, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 0.25);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Angle Wrapping within [-2π, 2π]', () => {
    const body: CelestialBodyType = {
      e: 0.5,
      angle: 3 * Math.PI,
      period: { value: 365, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 10, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 10);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
    assert(result <= 2 * Math.PI && result >= -2 * Math.PI);
  });

  test('Minimum Time Step Clamping', () => {
    const body: CelestialBodyType = {
      e: 0.5,
      angle: Math.PI / 2,
      period: { value: 365, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 1e-6, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 1e-5); // Minimum time step
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test("Halley's Comet", () => {
    const body: CelestialBodyType = {
      e: 0.96714,
      angle: (38.38 * Math.PI) / 180, // Convert degrees to radians
      period: { value: 27576, unit: 'd' }
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 100, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 100);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Comet Hale-Bopp', () => {
    const body: CelestialBodyType = {
      e: 0.9951,
      angle: (180 * Math.PI) / 180, // Convert degrees to radians
      period: { value: -253533, unit: 'd' } // Positive period for testing
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 0.25, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 0.25);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Comet 67P/Churyumov–Gerasimenko', () => {
    const body: CelestialBodyType = {
      e: 0.641,
      angle: 0, // Initial angle in radians
      period: { value: -2484, unit: 'd' } // Positive period for testing
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 10, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 10);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });

  test('Comet Encke', () => {
    const body: CelestialBodyType = {
      e: 0.85,
      angle: (160 * Math.PI) / 180, // Convert degrees to radians
      period: { value: -1204, unit: 'd' } // Positive period for testing
    } as CelestialBodyType;
    const timeStep: TemporalInterface = { value: 5, unit: 'd' };
    const periodInDays = body.period.value;
    const meanMotion = TWO_PI / Math.abs(periodInDays);
    const M0 = trueAnomalyToMeanAnomaly(body.angle, body.e);
    const expectedM = wrapAngle(M0 + meanMotion * 5);
    const result = computeMeanAnomaly(body, timeStep);

    assertApproxEqual(result, expectedM);
  });
});
