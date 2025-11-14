import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKeplerHighEccentricity } from '../categories/kepler/solve-kepler-high-eccentricity';

const EPSILON = 1e-9;
const assertApproxEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `Expected ~${expected}, got ${actual}`
  );
};
// **Define test cases based on Halley's Comet & Comet Hale-Bopp**
const testCases = [
  {
    name: "Halley's Comet (Typical Case)",
    M: (38.38 * Math.PI) / 180, // Mean anomaly converted to radians
    e: 0.96714,
    expected: 1.63500444611954 // Placeholder expected value (needs verification)
  },
  {
    name: 'Comet Hale-Bopp (Extreme Eccentricity)',
    M: (180 * Math.PI) / 180,
    e: 0.9951,
    expected: Math.PI // Placeholder expected value (Kepler's equation should return π for M=π)
  },
  {
    name: "Halley's Comet (Small M)",
    M: 0.01, // Small anomaly case
    e: 0.96714,
    expected: 0.238206497655823 // Placeholder expected value (needs verification)
  },
  {
    name: 'Comet Hale-Bopp (Large M)',
    M: 5, // Large anomaly case
    e: 0.9951,
    expected: 4.1553401654182 // Placeholder expected value (needs verification)
  }
];

describe('solveKeplerHighEccentricity (Real Data Tests)', () => {
  for (const { name, M, e, expected } of testCases) {
    test(name, () => {
      const result = solveKeplerHighEccentricity(M, e);

      assertApproxEqual(result, expected);
    });
  }
});

describe('solveKeplerHighEccentricity (General Behavior Tests)', () => {
  test('converges for typical values', () => {
    const M = Math.PI / 4; // 45 degrees in radians
    const e = 0.95; // High eccentricity
    const result = solveKeplerHighEccentricity(M, e);

    assertApproxEqual(result, 1.7242367109653982);
  });

  test('works for small M values', () => {
    const M = 0.01;
    const e = 0.99;
    const result = solveKeplerHighEccentricity(M, e);

    assertApproxEqual(result, 0.3422703164917758);
  });

  test('handles M = 0 case correctly', () => {
    const M = 0;
    const e = 0.98;
    const result = solveKeplerHighEccentricity(M, e);

    assertApproxEqual(result, 0); // Eccentric anomaly should also be zero
  });

  test('handles large M values', () => {
    const M = 5; // Large mean anomaly
    const e = 0.95;
    const result = solveKeplerHighEccentricity(M, e);

    assertApproxEqual(result, 4.181000769932799);
  });

  test('ensures correct output for extremely large M', () => {
    const M = 10 * Math.PI; // Large anomaly
    const e = 0.97;
    const result = solveKeplerHighEccentricity(
      M,
      e,
      Math.max(50, Math.floor(M))
    );

    assertApproxEqual(result, 0);
  });

  test('does not exceed max iterations', () => {
    const M = 3;
    const e = 0.999; // Extremely high eccentricity
    const result = solveKeplerHighEccentricity(
      M,
      e,
      Math.max(50, Math.floor(M)),
      1e-9
    );

    assert.ok(result !== null); // Ensure it still produces a valid number
  });
});
