import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import {
  NORMALIZE_DISTANCE_UNIT,
  normalizeDistanceUnit
} from '../normalize-distance-unit.js';

const canonical = [
  'm',
  'km',
  'au',
  'ly',
  'kly',
  'Mly',
  'Gly',
  'pc',
  'kpc',
  'Mpc',
  'Gpc'
];

const aliasPairs = [
  ['meters', 'm'],
  ['metres', 'm'],
  ['kilometers', 'km'],
  ['kilometres', 'km'],
  ['AU', 'au'],
  ['Au', 'au'],
  ['astronomical units', 'au'],
  ['astronomical-unit', 'au'],
  ['lightyear', 'ly'],
  ['light-years', 'ly'],
  ['kilolightyears', 'kly'],
  ['megalightyear', 'Mly'],
  ['gigalightyears', 'Gly'],
  ['parsecs', 'pc'],
  ['kiloparsec', 'kpc'],
  ['megaparsecs', 'Mpc'],
  ['gigaparsec', 'Gpc']
];

describe('normalizeDistanceUnit', () => {
  test('canonical units map to themselves', () => {
    for (const u of canonical) assert.equal(normalizeDistanceUnit(u), u);
  });

  test('aliases map to canonical symbols', () => {
    for (const [input, expected] of aliasPairs) {
      assert.equal(normalizeDistanceUnit(input), expected, input);
    }
  });

  test('every table entry maps to a canonical unit', () => {
    for (const v of Object.values(NORMALIZE_DISTANCE_UNIT)) {
      assert.ok(canonical.includes(v), v);
    }
  });

  test('trims surrounding whitespace', () => {
    assert.equal(normalizeDistanceUnit(' light-years '), 'ly');
    assert.equal(normalizeDistanceUnit('\tAU\n'), 'au');
  });

  test('is case-sensitive', () => {
    assert.throws(() => normalizeDistanceUnit('aU'), RangeError);
    assert.throws(() => normalizeDistanceUnit('Parsecs'), RangeError);
    assert.throws(() => normalizeDistanceUnit('MPC'), RangeError);
  });

  test('rejects unknown or empty input with a RangeError', () => {
    for (const u of ['', '   ', 'mile', 'seconds']) {
      assert.throws(() => normalizeDistanceUnit(u), {
        name: 'RangeError',
        message: `Unsupported unit: ${u}`
      });
    }
  });

  test('ignores keys inherited from Object.prototype', () => {
    for (const key of ['toString', 'constructor', '__proto__', 'valueOf']) {
      assert.throws(() => normalizeDistanceUnit(key), RangeError, key);
    }
  });

  test('the table is frozen', () => {
    assert.ok(Object.isFrozen(NORMALIZE_DISTANCE_UNIT));
  });
});
