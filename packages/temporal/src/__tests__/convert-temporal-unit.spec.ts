import { TemporalInterface, TemporalUnitType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { convertTemporalUnit } from '../convert-temporal-unit';
import {
  JULIAN_YEAR_SECONDS,
  SECONDS_PER_DAY
} from '@interstellar-tools/constants';

// Helpers
const EPS_ABS = 1e-9;
const EPS_REL = 1e-12;
const approxEqual = (a: number, b: number, msg?: string) => {
  const diff = Math.abs(a - b);
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  assert.ok(
    diff <= Math.max(EPS_ABS, EPS_REL * scale),
    msg ?? `expected ~${b}, got ${a}`
  );
};
const conv = (
  value: number,
  unit: TemporalUnitType,
  target: TemporalUnitType
) => {
  return convertTemporalUnit({ value, unit } as TemporalInterface, target);
};

const CANONICAL: TemporalUnitType[] = [
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

const roundTo3 = (v: number) => Math.round(v * 1000) / 1000;

describe('convert-temporal-unit', () => {
  test('identity: all canonical units map to themselves', () => {
    for (const u of CANONICAL) {
      const out = conv(123.456, u, u);
      assert.equal(out.unit, u);
      assert.equal(roundTo3(out.value), 123.456);
    }
  });

  test('SI submultiples: seconds ↔ ms/μs/ns', () => {
    assert.equal(conv(2, 's', 'ms').value, 2000);
    assert.equal(conv(2, 's', 'μs').value, 2_000_000);
    approxEqual(conv(2, 's', 'ns').value, 2_000_000_000);
    approxEqual(conv(500, 'ms', 's').value, 0.5);
    approxEqual(conv(250_000, 'μs', 's').value, 0.25);
  });

  test('minutes/hours/days basics', () => {
    assert.equal(conv(90, 'min', 'h').value, 1.5);
    assert.equal(conv(2, 'h', 'min').value, 120);
    assert.equal(conv(1, 'd', 'h').value, 24);
    assert.equal(conv(0.5, 'd', 's').value, SECONDS_PER_DAY / 2);
  });

  test('Julian year family: yr ↔ d, kyr/Myr/Gyr scaling', () => {
    // 1 yr = 365.25 d
    approxEqual(conv(1, 'yr', 'd').value, 365.25);
    approxEqual(conv(365.25, 'd', 'yr').value, 1);
    // Scaling
    assert.equal(conv(3, 'Myr', 'kyr').value, 3000);
    assert.equal(conv(2, 'Gyr', 'yr').value, 2_000_000_000);
    // Seconds linkage
    approxEqual(conv(1, 'Myr', 's').value, JULIAN_YEAR_SECONDS * 1e6);
    approxEqual(conv(1e3, 'yr', 's').value, JULIAN_YEAR_SECONDS * 1e3);
  });

  test('extremes: yoctoseconds ↔ seconds round-trip', () => {
    const s = conv(1, 'ys', 's').value;
    approxEqual(s, 1e-24);
    const back = conv(s, 's', 'ys').value;
    approxEqual(back, 1);
  });

  test('round-trip property across units', () => {
    const pairs: [TemporalUnitType, TemporalUnitType, number][] = [
      ['h', 's', 2.75],
      ['d', 'min', 0.125],
      ['yr', 'd', 3.5],
      ['kyr', 'yr', 1.234],
      ['Myr', 'kyr', 0.00042],
      ['Gyr', 'yr', 0.009]
    ];
    for (const [from, mid, val] of pairs) {
      const midVal = conv(val, from, mid).value;
      const back = conv(midVal, mid, from).value;
      approxEqual(back, val, `round-trip failed for ${from}↔${mid}`);
    }
  });

  test('unit labels in output are canonical', () => {
    const out = conv(42, 'h', 'min');
    assert.equal(out.unit, 'min');
  });
});
