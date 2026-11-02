import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cr3bpUnits } from '../cr3bp-units.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('cr3bpUnits', () => {
  test('gives 4.342 days and 1 024.5 m/s for Earth and Moon', () => {
    const { mu, length, time, speed } = cr3bpUnits(
      3.986004418e14,
      4.902800118e12,
      384_400_000
    );

    assert.equal(mu.toFixed(6), '0.012151');
    assert.equal(length, 384_400_000);
    assert.equal((time / 86_400).toFixed(3), '4.342');
    assert.equal(((2 * Math.PI * time) / 86_400).toFixed(2), '27.28');
    assert.equal(speed.toFixed(1), '1024.5');
    relClose(speed * time, length);
  });

  test('makes 2π time units a year for Sun and Earth', () => {
    const { time } = cr3bpUnits(
      1.32712440018e20,
      3.986004418e14,
      1.495978707e11
    );

    assert.equal(((2 * Math.PI * time) / 86_400).toFixed(2), '365.26');
  });

  test('throws for a bad separation, and passes the mass checks on', () => {
    assert.throws(
      () => cr3bpUnits(1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'separation must be a finite number. Received: NaN'
    );
    assert.throws(
      () => cr3bpUnits(1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'separation must be > 0. Received: 0'
    );
    assert.throws(() => cr3bpUnits(1, 2, 1), RangeError);
  });
});
