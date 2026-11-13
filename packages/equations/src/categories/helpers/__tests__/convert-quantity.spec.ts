import { G_SI, PLANETS, STARS } from '@interstellar-tools/constants';
import type {
  MassInterface,
  ObservedType,
  PressureInterface
} from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { relClose } from '../../../__tests__/helpers/index.js';
import { convertQuantity, type QuantityType } from '../convert-quantity.js';

// Every unit with its kind, to convert between
const KINDS: Record<string, QuantityType['unit'][]> = {
  mass: ['kg', 'M_earth', 'M_jup', 'M_sun'],
  density: ['kg/m3', 'g/cm3'],
  speed: ['m/s', 'km/s'],
  acceleration: ['m/s2', 'cm/s2', 'au/d2'],
  gm: ['m3/s2', 'km3/s2'],
  temperature: ['K'],
  pressure: ['Pa', 'hPa', 'bar', 'mbar', 'μbar', 'nbar'],
  angle: ['rad', 'deg', 'arcmin', 'arcsec', 'mas', 'μas'],
  magnitude: ['mag'],
  luminosity: ['W', 'erg/s', 'L_sun'],
  energy: ['J', 'erg'],
  irradiance: ['W/m2', 'S_earth'],
  flux: ['Jy', 'mJy', 'μJy'],
  massRate: ['kg/s', 'M_sun/yr'],
  production: ['molecules/s'],
  events: ['1/h', '1/d', '1/yr'],
  dex: ['dex'],
  fraction: ['fraction', '%', 'ppm', 'ppb'],
  field: ['T', 'nT', 'G'],
  moment: ['A m2'],
  inertia: ['TIU'],
  inverse: ['1/au'],
  spin: ['rad/d2', 'deg/d2'],
  period: ['s/yr', 'ms/yr']
};
const convert = (value: number, from: string, to: string) =>
  convertQuantity({ value, unit: from } as QuantityType, to as never).value;

describe('convertQuantity', () => {
  test('converts the nominal masses through the IAU’s GM over G', () => {
    relClose(convert(1, 'M_sun', 'kg'), 1.3271244e20 / G_SI, 1e-15);
    relClose(convert(1, 'M_jup', 'M_earth'), 1.2668653e17 / 3.986004e14, 1e-15);
    // About 317.83 Earth masses to Jupiter, and 1047.6 Jupiters to the Sun
    assert.equal(convert(1, 'M_jup', 'M_earth').toFixed(2), '317.83');
    assert.equal(convert(1, 'M_sun', 'M_jup').toFixed(1), '1047.6');
  });

  test('agrees with the datasets’ GM for the Sun, Earth and Jupiter', () => {
    const mu = (id: string) =>
      [...STARS, ...PLANETS].find((body) => body.id === id)!.mu!;

    for (const [id, unit] of [
      ['sun', 'M_sun'],
      ['earth', 'M_earth'],
      ['jupiter', 'M_jup']
    ] as const)
      relClose(convert(mu(id) / G_SI, 'kg', unit), 1, 1e-7);
  });

  test('converts the units the observations use', () => {
    assert.equal(convert(92, 'bar', 'Pa'), 9.2e6);
    assert.equal(convert(10, 'μbar', 'Pa'), 1);
    assert.equal(convert(0.687, 'g/cm3', 'kg/m3'), 687);
    assert.equal(convert(11.186, 'km/s', 'm/s'), 11_186);
    // 1 au/d² is 20.04 m/s²: ʻOumuamua's A1 is 5.59e-6 m/s²
    relClose(convert(2.79e-7, 'au/d2', 'm/s2'), 5.591e-6, 1e-3);
    // Proxima Centauri's parallax, 768.07 mas
    relClose(convert(768.07, 'mas', 'arcsec'), 0.76807, 1e-12);
    relClose(convert(180, 'deg', 'rad'), Math.PI, 1e-15);
    relClose(convert(1, 'L_sun', 'erg/s'), 3.828e33, 1e-15);
    assert.equal(convert(1, 'S_earth', 'W/m2'), 1361);
    assert.equal(convert(1, 'G', 'T'), 1e-4);
    relClose(convert(250, 'ppm', '%'), 0.025, 1e-15);
    relClose(convert(1, '1/d', '1/h'), 1 / 24, 1e-15);
    relClose(convert(1, 'M_sun/yr', 'kg/s'), 6.3e22, 2e-3);
    assert.equal(convert(1500, 'ms/yr', 's/yr'), 1.5);
    relClose(convert(1, 'deg/d2', 'rad/d2'), Math.PI / 180, 1e-15);
  });

  test('round-trips between any two units of a kind', () => {
    for (const units of Object.values(KINDS))
      fc.assert(
        fc.property(
          fc.double({ min: -1e6, max: 1e6, noNaN: true }),
          fc.constantFrom(...units),
          fc.constantFrom(...units),
          (value, from, to) => {
            const back = convert(convert(value, from, to), to, from);

            return (
              Math.abs(back - value) <= 1e-12 * Math.max(1, Math.abs(value))
            );
          }
        )
      );
  });

  test('keeps the rest of an observation, and converts its uncertainty', () => {
    const pressure: ObservedType<PressureInterface> = {
      value: 92,
      unit: 'bar',
      uncertainty: { plus: 2, minus: 1, sigma: 2 },
      provenance: 'measured',
      source: { catalog: 'NASA' }
    };

    assert.deepEqual(convertQuantity(pressure, 'Pa'), {
      value: 9.2e6,
      unit: 'Pa',
      uncertainty: { plus: 2e5, minus: 1e5, sigma: 2 },
      provenance: 'measured',
      source: { catalog: 'NASA' }
    });
    // The input is left as it was
    assert.equal(pressure.unit, 'bar');

    const mass: MassInterface = { value: 1, unit: 'kg' };

    assert.deepEqual(convertQuantity(mass, 'kg'), mass);
    assert.ok(!('uncertainty' in convertQuantity(mass, 'M_sun')));
  });

  test('converts single-unit kinds to themselves', () => {
    for (const unit of [
      'K',
      'mag',
      'dex',
      'TIU',
      '1/au',
      'A m2',
      'molecules/s'
    ])
      assert.equal(convert(42, unit, unit), 42);
  });

  test('throws for another kind or an unknown unit', () => {
    assert.throws(() => convert(1, 'kg', 'km/s'), RangeError);
    assert.throws(() => convert(1, 'bar', 'K'), RangeError);
    assert.throws(() => convert(1, 'kg', 'stone'), RangeError);
    assert.throws(() => convert(1, 'furlongs', 'm/s'), RangeError);
    // The micro sign, U+00B5, isn't the Greek mu the units use
    assert.throws(() => convert(1, 'µas', 'mas'), RangeError);

    // @ts-expect-error A mass can't be converted to a speed
    assert.throws(() => convertQuantity({ value: 1, unit: 'kg' }, 'km/s'));
  });
});
