import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { computeAngle } from '../compute-angle';
import { wrapAngle } from '../wrap-angle';
import {
  CelestialBodyType,
  TimeStepInterface
} from '@interstellar-tools/types';

describe('computeAngle', () => {
  // Test cases
  const testCases = [
    {
      celestialBody: {
        e: 0.0167,
        angle: 0,
        period: { value: 365.25, unit: 'd' }
      },
      timeStep: { value: 1, unit: 'd' }
    },
    {
      celestialBody: {
        e: 0.1,
        angle: Math.PI / 3,
        period: { value: 687, unit: 'd' }
      },
      timeStep: { value: 1, unit: 'd' }
    },
    // Retrograde motion test cases
    {
      celestialBody: {
        e: 0.05,
        angle: Math.PI / 2,
        period: { value: -365.25, unit: 'd' } // Retrograde motion
      },
      timeStep: { value: 1, unit: 'd' }
    },
    {
      celestialBody: {
        e: 0.2,
        angle: -Math.PI / 4,
        period: { value: -4332.59, unit: 'd' } // Retrograde motion
      },
      timeStep: { value: 10, unit: 'd' }
    }
  ];

  test('computes correct true anomaly', () => {
    testCases.forEach(({ celestialBody, timeStep }) => {
      const expected = wrapAngle(
        computeAngle(
          celestialBody as CelestialBodyType,
          timeStep as TimeStepInterface
        )
      );
      const result = wrapAngle(
        computeAngle(
          celestialBody as CelestialBodyType,
          timeStep as TimeStepInterface
        )
      );

      assert.ok(
        Math.abs(result - expected) < 1e-4,
        `Expected angle ≈ ${expected} for body=${JSON.stringify(celestialBody)}, timeStep=${timeStep.value}, but got ${result}`
      );
    });
  });

  test('correctly adjusts for comets', () => {
    const comet = {
      e: 0.8,
      q: 1.2,
      angle: Math.PI / 4,
      period: { value: 2000, unit: 'd' }
    }; // Adding 'q' property to classify as comet
    const timeStep = { value: 5, unit: 'd' };
    const expected = wrapAngle(
      computeAngle(comet as CelestialBodyType, timeStep as TimeStepInterface)
    );
    const result = wrapAngle(
      computeAngle(comet as CelestialBodyType, timeStep as TimeStepInterface)
    );

    assert.ok(
      Math.abs(result - expected) < 1e-4,
      `Expected comet angle ≈ ${expected}, but got ${result}`
    );
  });
});
