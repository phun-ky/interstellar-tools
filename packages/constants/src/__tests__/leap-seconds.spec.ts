import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { LEAP_SECONDS } from '../date.js';

describe('LEAP_SECONDS', () => {
  test('starts at 10 s on 1972-01-01 and reaches 37 s on 2017-01-01', () => {
    assert.deepEqual(LEAP_SECONDS[0], { date: '1972-01-01', taiMinusUtc: 10 });
    assert.deepEqual(LEAP_SECONDS[LEAP_SECONDS.length - 1], {
      date: '2017-01-01',
      taiMinusUtc: 37
    });
    assert.equal(LEAP_SECONDS.length, 28);
  });

  test('is sorted, one second a step, on the first of January or July', () => {
    for (const [i, { date, taiMinusUtc }] of LEAP_SECONDS.entries()) {
      assert.match(date, /^\d{4}-(01|07)-01$/);

      if (i === 0) continue;

      const previous = LEAP_SECONDS[i - 1]!;

      assert.ok(date > previous.date, `${date} after ${previous.date}`);
      assert.equal(taiMinusUtc, previous.taiMinusUtc + 1);
    }
  });

  test('is frozen', () => {
    assert.ok(Object.isFrozen(LEAP_SECONDS));
    assert.ok(LEAP_SECONDS.every((step) => Object.isFrozen(step)));
  });
});
