import assert from 'node:assert';
import { describe, test } from 'node:test';

import { wrapAngle } from '../wrap-angle';

const EPSILON = 1e-10; // Small tolerance for floating-point comparisons
const assertApproxEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `Expected ~${expected}, got ${actual}`
  );
};

describe('wrapAngle', () => {
  test('angles already in range [-2π, 2π]', () => {
    assert.equal(wrapAngle(0), 0);
    assert.equal(wrapAngle(Math.PI), Math.PI);
    assert.equal(wrapAngle(-Math.PI), -Math.PI);
    assert.equal(wrapAngle(1.5 * Math.PI), 1.5 * Math.PI);
    assert.equal(wrapAngle(-1.5 * Math.PI), -1.5 * Math.PI);
  });

  test('negative and retrograde angles', () => {
    assertApproxEqual(wrapAngle(-2 * Math.PI), 0);
    assertApproxEqual(wrapAngle(-3 * Math.PI), -Math.PI);
    assertApproxEqual(wrapAngle(-4 * Math.PI), 0);
    assertApproxEqual(wrapAngle(-5 * Math.PI), -Math.PI);
    assertApproxEqual(wrapAngle(-6 * Math.PI), 0);
  });

  test('angles greater than 2π', () => {
    assertApproxEqual(wrapAngle(2 * Math.PI), 0);
    assertApproxEqual(wrapAngle(3 * Math.PI), Math.PI);
    assertApproxEqual(wrapAngle(4 * Math.PI), 0);
    assertApproxEqual(wrapAngle(5 * Math.PI), Math.PI);
    assertApproxEqual(wrapAngle(6 * Math.PI), 0);
  });

  test('extreme values', () => {
    assertApproxEqual(wrapAngle(100 * Math.PI), 0);
    assertApproxEqual(wrapAngle(-100 * Math.PI), 0);
    assertApproxEqual(wrapAngle(1000), wrapAngle(1000 % (2 * Math.PI)));
    assertApproxEqual(wrapAngle(-1000), wrapAngle(-1000 % (2 * Math.PI)));
  });

  test('boundary values', () => {
    assertApproxEqual(wrapAngle(2 * Math.PI), 0);
    assertApproxEqual(wrapAngle(-2 * Math.PI), 0);
    assertApproxEqual(wrapAngle(2 * Math.PI + EPSILON), EPSILON);
    assertApproxEqual(wrapAngle(-2 * Math.PI - EPSILON), -EPSILON);
  });

  test('floating-point drift prevention', () => {
    assertApproxEqual(wrapAngle(Math.PI + EPSILON / 2), Math.PI + EPSILON / 2);
    assertApproxEqual(
      wrapAngle(-Math.PI - EPSILON / 2),
      -Math.PI - EPSILON / 2
    );
    assertApproxEqual(wrapAngle(2 * Math.PI - EPSILON / 2), -EPSILON / 2);
    assertApproxEqual(wrapAngle(-2 * Math.PI + EPSILON / 2), EPSILON / 2);
  });

  test('large positive and negative angles', () => {
    assertApproxEqual(wrapAngle(1e6 * Math.PI), 0);
    assertApproxEqual(wrapAngle(-1e6 * Math.PI), 0);
    assertApproxEqual(wrapAngle(1e9), wrapAngle(1e9 % (2 * Math.PI)));
    assertApproxEqual(wrapAngle(-1e9), wrapAngle(-1e9 % (2 * Math.PI)));
  });

  test('angles near zero', () => {
    assertApproxEqual(wrapAngle(EPSILON), EPSILON);
    assertApproxEqual(wrapAngle(-EPSILON), -EPSILON);
    assertApproxEqual(wrapAngle(0), 0);
  });
});
