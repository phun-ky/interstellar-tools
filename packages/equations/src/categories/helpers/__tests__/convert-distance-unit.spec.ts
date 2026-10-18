import {
  AU_METERS,
  KM_PER_AU,
  LY_PER_PC,
  METERS_PER_LY,
  METERS_PER_PC
} from '@interstellar-tools/constants';
import type { DistanceUnitType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { relClose } from '../../../__tests__/helpers/index.js';
import { convertDistanceUnit, METERS_PER } from '../convert-distance-unit.js';

const UNITS = Object.keys(METERS_PER) as DistanceUnitType[];

describe('METERS_PER', () => {
  test('uses the distance constants', () => {
    assert.equal(METERS_PER.m, 1);
    assert.equal(METERS_PER.km, 1000);
    assert.equal(METERS_PER.au, AU_METERS);
    assert.equal(METERS_PER.ly, METERS_PER_LY);
    assert.equal(METERS_PER.pc, METERS_PER_PC);
    assert.equal(METERS_PER.kpc, METERS_PER_PC * 1e3);
    assert.equal(METERS_PER.Gly, METERS_PER_LY * 1e9);
  });

  test('is frozen', () => {
    assert.ok(Object.isFrozen(METERS_PER));
  });
});

describe('convertDistanceUnit', () => {
  test('1 au is exactly 149 597 870.7 km', () => {
    assert.deepEqual(convertDistanceUnit({ value: 1, unit: 'au' }, 'km'), {
      value: KM_PER_AU,
      unit: 'km'
    });
  });

  test('1 pc in light-years matches LY_PER_PC', () => {
    const { value } = convertDistanceUnit({ value: 1, unit: 'pc' }, 'ly');

    relClose(value, LY_PER_PC, 1e-15);
  });

  test('prefixed units are powers of ten', () => {
    relClose(
      convertDistanceUnit({ value: 1, unit: 'Mpc' }, 'kpc').value,
      1000,
      1e-15
    );
    relClose(
      convertDistanceUnit({ value: 1, unit: 'Gly' }, 'ly').value,
      1e9,
      1e-15
    );
  });

  test('accepts an alias as the target unit, and returns the canonical unit', () => {
    assert.deepEqual(
      convertDistanceUnit({ value: 2000, unit: 'm' }, 'kilometres'),
      {
        value: 2,
        unit: 'km'
      }
    );
    assert.equal(
      convertDistanceUnit({ value: 1, unit: 'km' }, 'AU').unit,
      'au'
    );
  });

  test('converting to the same unit returns the same value', () => {
    for (const unit of UNITS) {
      assert.equal(convertDistanceUnit({ value: 4.2, unit }, unit).value, 4.2);
    }
  });

  test('throws a RangeError for an unknown target unit', () => {
    assert.throws(
      () =>
        convertDistanceUnit(
          { value: 1, unit: 'km' },
          'mile' as DistanceUnitType
        ),
      RangeError
    );
  });

  test('does not change the input', () => {
    const input = { value: 1, unit: 'au' as const };

    convertDistanceUnit(input, 'km');
    assert.deepEqual(input, { value: 1, unit: 'au' });
  });

  const unit = fc.constantFrom(...UNITS);
  const value = fc.double({ min: -1e12, max: 1e12, noNaN: true });

  test('converting there and back returns the original value', () => {
    fc.assert(
      fc.property(value, unit, unit, (x, from, to) => {
        const there = convertDistanceUnit({ value: x, unit: from }, to);
        const back = convertDistanceUnit(there, from);

        relClose(back.value, x, 1e-12);
      })
    );
  });

  test('converting through any intermediate unit gives the same result', () => {
    fc.assert(
      fc.property(value, unit, unit, unit, (x, from, via, to) => {
        const direct = convertDistanceUnit({ value: x, unit: from }, to);
        const stepped = convertDistanceUnit(
          convertDistanceUnit({ value: x, unit: from }, via),
          to
        );

        relClose(stepped.value, direct.value, 1e-12);
      })
    );
  });
});
