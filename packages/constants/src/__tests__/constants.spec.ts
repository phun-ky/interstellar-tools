import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  AU_METERS,
  AU_PER_LY,
  EPOCH_2000_UTC_MIDNIGHT,
  EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE,
  G_SI,
  J2000_EPOCH_TIME_SCALE,
  J2000_TT,
  J2000_UTC,
  J2000_UTC_TIME_SCALE,
  JULIAN_YEAR_DAYS,
  JULIAN_YEAR_SECONDS,
  KM_PER_AU,
  LY_PER_AU,
  LY_PER_PC,
  METERS_PER_LY,
  METERS_PER_PC,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_SECOND,
  PC_PER_LY,
  RADIANS_PER_ARCSECOND,
  SECONDS_PER_DAY,
  SOLAR_RADIUS_NOMINAL_KM,
  SOLAR_RADIUS_PHOTOSPHERIC_KM,
  SOLAR_RADIUS_PICARD_SODISM_535_7_NM_KM,
  SOLAR_RADIUS_PICARD_SODISM_535_7_NM_UNC_KM,
  SOLAR_RADIUS_PICARD_SODISM_607_1_NM_KM,
  SOLAR_RADIUS_PICARD_SODISM_607_1_NM_UNC_KM,
  SOLAR_RADIUS_PICARD_SODISM_782_2_NM_KM,
  SOLAR_RADIUS_PICARD_SODISM_782_2_NM_UNC_KM,
  SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_KM,
  SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_UNC_KM,
  SPEED_OF_LIGHT_M_PER_S,
  TIME_SCALE_TT,
  TIME_SCALE_UTC,
  TT_MINUS_UTC_AT_J2000_MS,
  TT_MINUS_UTC_AT_J2000_SECONDS,
  TWO_PI
} from '../index.js';

const relClose = (actual: number, expected: number, eps = 1e-15) => {
  const scale = Math.max(1, Math.abs(expected));

  assert.ok(
    Math.abs(actual - expected) <= eps * scale,
    `${actual} is not within ${eps} (relative) of ${expected}`
  );
};

describe('defined constants', () => {
  test('astronomical unit is the IAU 2012 B2 value', () => {
    assert.equal(AU_METERS, 149_597_870_700);
  });

  test('speed of light is the SI defining value', () => {
    assert.equal(SPEED_OF_LIGHT_M_PER_S, 299_792_458);
  });

  test('gravitational constant is the CODATA value', () => {
    assert.equal(G_SI, 6.6743e-11);
  });

  test('time units', () => {
    assert.equal(SECONDS_PER_DAY, 86_400);
    assert.equal(MILLISECONDS_PER_SECOND, 1_000);
    assert.equal(JULIAN_YEAR_DAYS, 365.25);
  });

  test('J2000 epoch is JD 2451545.0 in TT', () => {
    assert.equal(J2000_TT, 2_451_545);
    assert.equal(J2000_EPOCH_TIME_SCALE, TIME_SCALE_TT);
  });

  test('TT − UTC at J2000 is 32.184 s + 32 leap seconds', () => {
    assert.equal(TT_MINUS_UTC_AT_J2000_SECONDS, 64.184);
  });

  test('time scale labels', () => {
    assert.equal(TIME_SCALE_TT, 'TT');
    assert.equal(TIME_SCALE_UTC, 'UTC');
    assert.equal(J2000_UTC_TIME_SCALE, TIME_SCALE_UTC);
    assert.equal(EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE, TIME_SCALE_UTC);
  });

  test('nominal solar radius is the IAU 2015 B3 value', () => {
    assert.equal(SOLAR_RADIUS_NOMINAL_KM, 695_700);
  });

  test('measured solar radii are close to nominal, with positive uncertainties', () => {
    const measurements = [
      [SOLAR_RADIUS_PHOTOSPHERIC_KM, 0],
      [
        SOLAR_RADIUS_PICARD_SODISM_535_7_NM_KM,
        SOLAR_RADIUS_PICARD_SODISM_535_7_NM_UNC_KM
      ],
      [
        SOLAR_RADIUS_PICARD_SODISM_607_1_NM_KM,
        SOLAR_RADIUS_PICARD_SODISM_607_1_NM_UNC_KM
      ],
      [
        SOLAR_RADIUS_PICARD_SODISM_782_2_NM_KM,
        SOLAR_RADIUS_PICARD_SODISM_782_2_NM_UNC_KM
      ],
      [
        SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_KM,
        SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_UNC_KM
      ]
    ];

    for (const [radius, uncertainty] of measurements) {
      // Within 0.1 % of nominal
      assert.ok(Math.abs(radius - SOLAR_RADIUS_NOMINAL_KM) < 696, `${radius}`);
      assert.ok(uncertainty >= 0 && uncertainty < radius, `${uncertainty}`);
    }
  });
});

describe('derived constants match their definitions', () => {
  test('KM_PER_AU = AU_METERS / 1000', () => {
    relClose(KM_PER_AU, AU_METERS / 1_000);
  });

  test('JULIAN_YEAR_SECONDS = 365.25 d', () => {
    assert.equal(JULIAN_YEAR_SECONDS, JULIAN_YEAR_DAYS * SECONDS_PER_DAY);
  });

  test('MILLISECONDS_PER_DAY = 86 400 000', () => {
    assert.equal(
      MILLISECONDS_PER_DAY,
      SECONDS_PER_DAY * MILLISECONDS_PER_SECOND
    );
  });

  test('METERS_PER_LY = c × Julian year (IAU)', () => {
    assert.equal(METERS_PER_LY, SPEED_OF_LIGHT_M_PER_S * JULIAN_YEAR_SECONDS);
  });

  test('METERS_PER_PC = (648000 / π) au (IAU 2015 B2)', () => {
    relClose(METERS_PER_PC, (AU_METERS * 648_000) / Math.PI);
    relClose(METERS_PER_PC, 3.085_677_581_491_367_3e16, 1e-15);
  });

  test('distance ratios are consistent and reciprocal', () => {
    relClose(AU_PER_LY, METERS_PER_LY / AU_METERS);
    relClose(LY_PER_AU * AU_PER_LY, 1);
    relClose(LY_PER_PC, METERS_PER_PC / METERS_PER_LY);
    relClose(PC_PER_LY * LY_PER_PC, 1);
  });

  test('RADIANS_PER_ARCSECOND = π / 648000', () => {
    relClose(RADIANS_PER_ARCSECOND, Math.PI / 648_000);
  });

  test('TWO_PI = 2π', () => {
    assert.equal(TWO_PI, 2 * Math.PI);
  });

  test('TT − UTC in ms matches seconds', () => {
    assert.equal(TT_MINUS_UTC_AT_J2000_MS, TT_MINUS_UTC_AT_J2000_SECONDS * 1_000);
  });

  test('J2000_UTC is 2000-01-01 12:00 TT expressed in UTC', () => {
    assert.ok(J2000_UTC instanceof Date);
    assert.equal(
      J2000_UTC.getTime(),
      Date.UTC(2000, 0, 1, 12) - TT_MINUS_UTC_AT_J2000_MS
    );
    assert.equal(J2000_UTC.toISOString(), '2000-01-01T11:58:55.816Z');
  });

  test('EPOCH_2000_UTC_MIDNIGHT is 2000-01-01 00:00 UTC', () => {
    assert.ok(EPOCH_2000_UTC_MIDNIGHT instanceof Date);
    assert.equal(EPOCH_2000_UTC_MIDNIGHT.getTime(), Date.UTC(2000, 0, 1));
  });
});
