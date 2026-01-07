import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { flatteningOblateSpheroid } from '../flattening-oblate-spheroid';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('flatteningOblateSpheroid', () => {
  test('computes f = (a - c) / a for typical Earth-like radii (WGS84-ish)', () => {
    const a = 6378137.0; // m (equatorial)
    const c = 6356752.314245; // m (polar)

    const f = flatteningOblateSpheroid(a, c);

    const expected = (a - c) / a;
    relClose(f, expected);

    // sanity: Earth flattening is ~1/298.257... ≈ 0.0033528 (ballpark)
    assert.ok(f > 0 && f < 0.01, `unexpected flattening magnitude: ${f}`);
  });

  test('returns 0 for a perfect sphere (a === c)', () => {
    const a = 10;
    const c = 10;

    const f = flatteningOblateSpheroid(a, c);

    // exactly 0 with identical numbers; tolerant check is fine
    relClose(f, 0);
  });

  test('increases as c decreases for fixed a (more flattened => larger f)', () => {
    const a = 10;

    const fLessFlat = flatteningOblateSpheroid(a, 9.9);
    const fMoreFlat = flatteningOblateSpheroid(a, 9.0);

    assert.ok(
      fMoreFlat > fLessFlat,
      `expected f to increase with flattening: ${fLessFlat} -> ${fMoreFlat}`
    );
  });

  test('is dimensionless and within [0, 1) for physically valid oblate spheroids (a >= c > 0)', () => {
    const a = 10;
    const c = 7;

    const f = flatteningOblateSpheroid(a, c);

    assert.ok(f >= 0, `expected f >= 0, got ${f}`);
    assert.ok(f < 1, `expected f < 1, got ${f}`);
  });

  test('throws TypeError when a is not finite (NaN)', () => {
    assert.throws(
      () => flatteningOblateSpheroid(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be finite. Received: NaN'
    );
  });

  test('throws TypeError when c is not finite (Infinity)', () => {
    assert.throws(
      () => flatteningOblateSpheroid(1, Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'c must be finite. Received: Infinity'
    );
  });

  test('throws RangeError when a <= 0', () => {
    assert.throws(
      () => flatteningOblateSpheroid(0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });

  test('throws RangeError when c <= 0', () => {
    assert.throws(
      () => flatteningOblateSpheroid(1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'c must be > 0. Received: 0'
    );
  });

  test('for prolate inputs (c > a), flattening becomes negative (still computed)', () => {
    // The function intentionally doesn't enforce a >= c; it only enforces positivity.
    // This test documents that behavior.
    const a = 10;
    const c = 11;

    const f = flatteningOblateSpheroid(a, c);

    assert.ok(f < 0, `expected f < 0 for c > a, got ${f}`);
  });
});
