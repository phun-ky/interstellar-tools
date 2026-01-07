import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { eccentricitySquaredOblateSpheroid } from '../eccentricity-squared-oblate-spheroid';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('eccentricitySquaredOblateSpheroid', () => {
  test('computes e² = 1 - (c²/a²) for typical Earth-like radii (WGS84-ish)', () => {
    const a = 6378137.0; // m (equatorial)
    const c = 6356752.314245; // m (polar)

    const e2 = eccentricitySquaredOblateSpheroid(a, c);

    const expected = 1 - (c * c) / (a * a);
    relClose(e2, expected);

    // sanity: Earth e² is ~0.00669438 (ballpark)
    assert.ok(e2 > 0 && e2 < 0.01, `unexpected e2 magnitude: ${e2}`);
  });

  test('returns 0 for a perfect sphere (a === c)', () => {
    const a = 10;
    const c = 10;

    const e2 = eccentricitySquaredOblateSpheroid(a, c);

    // This should be exactly 0 for identical inputs, but keep it tolerant anyway.
    relClose(e2, 0);
  });

  test('increases as c decreases for fixed a (more flattened => larger e²)', () => {
    const a = 10;

    const e2LessFlat = eccentricitySquaredOblateSpheroid(a, 9.9);
    const e2MoreFlat = eccentricitySquaredOblateSpheroid(a, 9.0);

    assert.ok(
      e2MoreFlat > e2LessFlat,
      `expected e2 to increase with flattening: ${e2LessFlat} -> ${e2MoreFlat}`
    );
  });

  test('is dimensionless and within [0, 1) for physically valid oblate spheroids (a >= c > 0)', () => {
    const a = 10;
    const c = 7;

    const e2 = eccentricitySquaredOblateSpheroid(a, c);

    assert.ok(e2 >= 0, `expected e2 >= 0, got ${e2}`);
    assert.ok(e2 < 1, `expected e2 < 1, got ${e2}`);
  });

  test('throws TypeError when a is not finite (NaN)', () => {
    assert.throws(
      () => eccentricitySquaredOblateSpheroid(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be finite. Received: NaN'
    );
  });

  test('throws TypeError when c is not finite (Infinity)', () => {
    assert.throws(
      () => eccentricitySquaredOblateSpheroid(1, Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'c must be finite. Received: Infinity'
    );
  });

  test('throws RangeError when a <= 0', () => {
    assert.throws(
      () => eccentricitySquaredOblateSpheroid(0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });

  test('throws RangeError when c <= 0', () => {
    assert.throws(
      () => eccentricitySquaredOblateSpheroid(1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'c must be > 0. Received: 0'
    );
  });

  test('for prolate inputs (c > a), e² becomes negative (still computed)', () => {
    // The function intentionally doesn't enforce a >= c; it only enforces positivity.
    // This test documents that behavior.
    const a = 10;
    const c = 11;

    const e2 = eccentricitySquaredOblateSpheroid(a, c);

    assert.ok(e2 < 0, `expected e2 < 0 for c > a, got ${e2}`);
  });
});
