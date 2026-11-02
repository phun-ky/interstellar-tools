import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { synodicPeriod } from '../synodic-period.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('synodicPeriod', () => {
  test('gives about 780 days for Earth and Mars', () => {
    const day = 86_400;
    const t = synodicPeriod(
      (2 * Math.PI) / (365.256 * day),
      (2 * Math.PI) / (686.98 * day)
    );

    assert.equal(Math.round(t / day), 780);
  });

  test('is symmetric in its arguments', () => {
    relClose(synodicPeriod(1e-3, 2e-3), synodicPeriod(2e-3, 1e-3));
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => synodicPeriod(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'n1 must be a finite number. Received: NaN'
    );
    assert.throws(
      () => synodicPeriod(1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'n2 must be > 0. Received: 0'
    );
    assert.throws(
      () => synodicPeriod(1e-3, 1e-3),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('n1 and n2 must differ')
    );
  });
});
