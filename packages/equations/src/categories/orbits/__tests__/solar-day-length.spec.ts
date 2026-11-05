import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { solarDayLength } from '../solar-day-length.js';

const DAY = 86_400;
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof type);
    assert.equal(err.message, message);

    return true;
  });
const period = fc.double({ min: 1e-3, max: 1e6, noNaN: true });

describe('solarDayLength', () => {
  test('gives Earth its 86 400 s day, from a turn against the stars and the sidereal year', () => {
    assert.ok(
      Math.abs(solarDayLength(86_164.0989, 365.256_363 * DAY) - DAY) < 1
    );
    // The sidereal day, against the moving equinox, goes with the tropical year
    assert.ok(
      Math.abs(solarDayLength(86_164.0905, 365.242_19 * DAY) - DAY) < 1e-3
    );
  });

  test('gives the Martian sol, 88 775.244 s', () => {
    assert.equal(
      solarDayLength(88_642.663, 686.971 * DAY).toFixed(3),
      '88775.244'
    );
  });

  test('gives Mercury a day of two of its years, 175.94 days', () => {
    const day = solarDayLength(58.6462, 87.969);

    assert.equal(day.toFixed(2), '175.94');
    assert.equal((day / 87.969).toFixed(4), '2.0000');
  });

  test('gives Venus, spinning backwards, a day shorter than its turn: 116.75 days', () => {
    assert.equal(solarDayLength(-243.0226, 224.701).toFixed(2), '116.75');
  });

  test('gives the synodic month, 29.5306 days, from the Moon’s orbit and Earth’s', () => {
    assert.equal(solarDayLength(27.321_661, 365.256_363).toFixed(4), '29.5306');
  });

  test('is longer than the turn for a forward spin, and shorter for a backward one', () => {
    fc.assert(
      fc.property(period, period, (P, T) => {
        fc.pre(P !== T);

        const forward = solarDayLength(P, T);
        const backward = solarDayLength(-P, T);

        assert.ok(forward > 0 && backward > 0);
        assert.ok(backward < P);

        if (P < T) assert.ok(forward > P);
      })
    );
  });

  test('is the same in any unit', () => {
    fc.assert(
      fc.property(period, period, (P, T) => {
        fc.pre(Math.abs(P - T) > 1e-6 * T);

        const days = solarDayLength(P, T);
        const seconds = solarDayLength(P * DAY, T * DAY);

        assert.ok(Math.abs(seconds / DAY / days - 1) < 1e-9);
      })
    );
  });

  test('rejects invalid input', () => {
    throwsWith(
      () => solarDayLength(Number.NaN, 1),
      TypeError,
      'P must be a finite number. Received: NaN'
    );
    throwsWith(
      () => solarDayLength(1, Infinity),
      TypeError,
      'T must be a finite number. Received: Infinity'
    );
    throwsWith(() => solarDayLength(0, 1), RangeError, 'P must not be 0.');
    throwsWith(
      () => solarDayLength(1, -1),
      RangeError,
      'T must be > 0. Received: -1'
    );
    throwsWith(
      () => solarDayLength(27.321_661, 27.321_661),
      RangeError,
      'P and T must differ: a body that turns once an orbit keeps one face to the Sun and has no solar day. Received: 27.321661'
    );
  });
});
