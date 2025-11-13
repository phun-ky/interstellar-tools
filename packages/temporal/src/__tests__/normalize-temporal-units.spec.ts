import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { normalizeTemporalUnit } from '../normalize-temporal-unit';

const canonical = [
  's',
  'ms',
  'μs',
  'ns',
  'ps',
  'fs',
  'as',
  'zs',
  'ys',
  'min',
  'h',
  'd',
  'yr',
  'kyr',
  'Myr',
  'Gyr'
];

const aliasPairs = [
  // seconds & submultiples
  ['second', 's'],
  ['seconds', 's'],
  ['millisecond', 'ms'],
  ['milliseconds', 'ms'],
  ['microsecond', 'μs'],
  ['microseconds', 'μs'],
  ['us', 'μs'],

  // clock units
  ['minute', 'min'],
  ['minutes', 'min'],
  ['hour', 'h'],
  ['hours', 'h'],
  ['day', 'd'],
  ['days', 'd'],

  // years & multiples (Julian-year-based)
  ['year', 'yr'],
  ['years', 'yr'],
  ['yr', 'yr'],
  ['yrs', 'yr'],
  ['kiloyear', 'kyr'],
  ['kiloyears', 'kyr'],
  ['kyr', 'kyr'],

  // million years (geology/astro spellings)
  ['megayear', 'Myr'],
  ['megayears', 'Myr'],
  ['megaannum', 'Myr'],
  ['megaannums', 'Myr'],
  ['Myr', 'Myr'],
  ['Ma', 'Myr'],

  // billion years
  ['gigayear', 'Gyr'],
  ['gigayears', 'Gyr'],
  ['gigaannum', 'Gyr'],
  ['gigaannums', 'Gyr'],
  ['Gyr', 'Gyr'],
  ['Ga', 'Gyr']
];

describe('normalizeTemporalUnit', () => {
  test('canonical units map to themselves', () => {
    for (const u of canonical) {
      assert.equal(normalizeTemporalUnit(u), u, `expected '${u}' → '${u}'`);
    }
  });

  test('aliases map to canonical symbols', () => {
    for (const [input, expected] of aliasPairs) {
      assert.equal(
        normalizeTemporalUnit(input),
        expected,
        `expected '${input}' → '${expected}'`
      );
    }
  });

  test('trims surrounding whitespace', () => {
    assert.equal(normalizeTemporalUnit(' seconds '), 's');
    assert.equal(normalizeTemporalUnit('\tus\n'), 'μs');
  });

  test('case-sensitive matching', () => {
    assert.throws(
      () => normalizeTemporalUnit('Seconds'),
      /Unsupported unit: Seconds/,
      'capitalized alias should be rejected'
    );
    assert.throws(
      () => normalizeTemporalUnit('US'),
      /Unsupported unit: US/,
      'uppercase "US" should not be treated as microseconds'
    );
  });

  test('rejects unknown or empty inputs', () => {
    assert.throws(() => normalizeTemporalUnit(''), /Unsupported unit:/);
    assert.throws(() => normalizeTemporalUnit('   '), /Unsupported unit:\s+/);
    assert.throws(
      () => normalizeTemporalUnit('lightyear'),
      /Unsupported unit:/
    );
  });
});
