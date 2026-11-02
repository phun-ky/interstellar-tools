import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cr3bpMassRatio } from '../cr3bp-mass-ratio.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('cr3bpMassRatio', () => {
  test('gives about 0.01215 for Earth and Moon', () => {
    assert.equal(
      cr3bpMassRatio(3.986004418e14, 4.902800118e12).toFixed(5),
      '0.01215'
    );
  });

  test('is 0.5 for equal masses, and the same from masses or GM', () => {
    assert.equal(cr3bpMassRatio(2, 2), 0.5);
    relClose(
      cr3bpMassRatio(5.9722e24, 7.342e22),
      cr3bpMassRatio(5.9722e24 * 6.674e-11, 7.342e22 * 6.674e-11)
    );
  });

  test('throws for non-finite, non-positive, or swapped masses', () => {
    assert.throws(
      () => cr3bpMassRatio(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm1 must be a finite number. Received: NaN'
    );
    assert.throws(
      () => cr3bpMassRatio(1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm2 must be > 0. Received: 0'
    );
    assert.throws(
      () => cr3bpMassRatio(1, 2),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          'm2 must be the smaller body: m2 <= m1. Received: m1 = 1, m2 = 2'
    );
  });
});
