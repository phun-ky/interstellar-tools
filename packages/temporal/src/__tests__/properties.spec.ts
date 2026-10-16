import type { TemporalUnitType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { convertTemporalUnit, SECONDS_PER } from '../convert-temporal-unit.js';

/**
 * Property-based tests: unit conversions must agree with each other for any
 * value and any pair of units, not just the examples in the unit tests.
 */

const UNITS = Object.keys(SECONDS_PER) as TemporalUnitType[];
const unit = fc.constantFrom(...UNITS);
const value = fc.double({ min: -1e12, max: 1e12, noNaN: true });
const relClose = (a: number, b: number, eps = 1e-12) => {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));

  assert.ok(Math.abs(a - b) <= eps * scale, `|${a} − ${b}| > ${eps}·${scale}`);
};

describe('convertTemporalUnit', () => {
  test('converting there and back returns the original value', () => {
    fc.assert(
      fc.property(value, unit, unit, (x, from, to) => {
        const there = convertTemporalUnit({ value: x, unit: from }, to);
        const back = convertTemporalUnit(there, from);

        assert.equal(back.unit, from);
        relClose(back.value, x);
      })
    );
  });

  test('converting through any intermediate unit gives the same result', () => {
    fc.assert(
      fc.property(value, unit, unit, unit, (x, from, via, to) => {
        const direct = convertTemporalUnit({ value: x, unit: from }, to);
        const stepped = convertTemporalUnit(
          convertTemporalUnit({ value: x, unit: from }, via),
          to
        );

        relClose(stepped.value, direct.value);
      })
    );
  });
});
