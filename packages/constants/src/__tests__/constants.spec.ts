import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  AU_METERS,
  EGM2008,
  AU_PER_LY,
  EARTH_EQUATORIAL_RADIUS_NOMINAL_KM,
  EARTH_GM_NOMINAL_M3_PER_S2,
  EARTH_POLAR_RADIUS_NOMINAL_KM,
  EARTH_SIDEREAL_DAY_SECONDS,
  EPOCH_2000_UTC_MIDNIGHT,
  EPOCH_2000_UTC_MIDNIGHT_TIME_SCALE,
  G_SI,
  J2000_EPOCH_TIME_SCALE,
  J2000_TT,
  J2000_UTC,
  J2000_UTC_TIME_SCALE,
  JULIAN_YEAR_DAYS,
  JULIAN_YEAR_SECONDS,
  JUPITER_EQUATORIAL_RADIUS_NOMINAL_KM,
  JUPITER_GM_NOMINAL_M3_PER_S2,
  JUPITER_POLAR_RADIUS_NOMINAL_KM,
  KM_PER_AU,
  MARS_SIDEREAL_DAY_SECONDS,
  MARS_SOL_DAYS,
  MARS_SOL_SECONDS,
  LY_PER_AU,
  LY_PER_PC,
  METERS_PER_LY,
  METERS_PER_PC,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_SECOND,
  PC_PER_LY,
  PLANETS,
  RADIANS_PER_ARCSECOND,
  SECONDS_PER_DAY,
  SOLAR_EFFECTIVE_TEMPERATURE_NOMINAL_K,
  SOLAR_GM_NOMINAL_M3_PER_S2,
  SOLAR_IRRADIANCE_NOMINAL_W_PER_M2,
  SOLAR_LUMINOSITY_NOMINAL_W,
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
  STARS,
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

  test('nominal values are the IAU 2015 B3 ones', () => {
    assert.equal(SOLAR_IRRADIANCE_NOMINAL_W_PER_M2, 1361);
    assert.equal(SOLAR_LUMINOSITY_NOMINAL_W, 3.828e26);
    assert.equal(SOLAR_EFFECTIVE_TEMPERATURE_NOMINAL_K, 5772);
    assert.equal(SOLAR_GM_NOMINAL_M3_PER_S2, 1.3271244e20);
    assert.equal(EARTH_EQUATORIAL_RADIUS_NOMINAL_KM, 6378.1);
    assert.equal(EARTH_POLAR_RADIUS_NOMINAL_KM, 6356.8);
    assert.equal(EARTH_GM_NOMINAL_M3_PER_S2, 3.986004e14);
    assert.equal(JUPITER_EQUATORIAL_RADIUS_NOMINAL_KM, 71_492);
    assert.equal(JUPITER_POLAR_RADIUS_NOMINAL_KM, 66_854);
    assert.equal(JUPITER_GM_NOMINAL_M3_PER_S2, 1.2668653e17);
  });

  test('nominal solar values agree with each other, the au and the datasets', () => {
    // Stefan–Boltzmann, CODATA 2018 (exact)
    const sigma = 5.670374419e-8;
    const radius = SOLAR_RADIUS_NOMINAL_KM * 1000;

    // L = 4πR²σT⁴, to 0.1 %
    assert.ok(
      Math.abs(
        (4 *
          Math.PI *
          radius ** 2 *
          sigma *
          SOLAR_EFFECTIVE_TEMPERATURE_NOMINAL_K ** 4) /
          SOLAR_LUMINOSITY_NOMINAL_W -
          1
      ) < 1e-3
    );
    // S = L / 4π(1 au)², to 0.1 %
    assert.ok(
      Math.abs(
        SOLAR_LUMINOSITY_NOMINAL_W /
          (4 * Math.PI * AU_METERS ** 2) /
          SOLAR_IRRADIANCE_NOMINAL_W_PER_M2 -
          1
      ) < 1e-3
    );

    // The datasets' measured GM, to 1e-7
    const gm = (id: string) =>
      [...STARS, ...PLANETS].find((body) => body.id === id)!.mu!;

    for (const [id, nominal] of [
      ['sun', SOLAR_GM_NOMINAL_M3_PER_S2],
      ['earth', EARTH_GM_NOMINAL_M3_PER_S2],
      ['jupiter', JUPITER_GM_NOMINAL_M3_PER_S2]
    ] as const)
      assert.ok(Math.abs(gm(id) / nominal - 1) < 1e-7, id);
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
    assert.equal(
      TT_MINUS_UTC_AT_J2000_MS,
      TT_MINUS_UTC_AT_J2000_SECONDS * 1_000
    );
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

describe('EGM2008', () => {
  test('holds J2 to J6 from the normalised coefficients', () => {
    // −√(2n + 1) C̄(n,0), from the coefficient file's tide-free values
    const expected = [
      1.0826261738522226e-3, -2.5324105185677223e-6, -1.619897599916973e-6,
      -2.2775359073083618e-7, 5.4066657628381321e-7
    ];

    assert.equal(EGM2008.J.length, 5);
    EGM2008.J.forEach((J, k) =>
      assert.ok(Math.abs(J - expected[k]!) <= 1e-15 * Math.abs(expected[k]!))
    );
    assert.equal(EGM2008.mu, 3.986004415e14);
    assert.equal(EGM2008.radius, 6_378_136.3);
  });

  test('is frozen', () => {
    assert.ok(Object.isFrozen(EGM2008));
    assert.ok(Object.isFrozen(EGM2008.J));
  });
});

describe('days on Earth and Mars', () => {
  // The sun comes back a little later each turn: 1/S = 1/P − 1/T
  const solarDay = (P: number, T: number) => 1 / (1 / P - 1 / T);

  test('EARTH_SIDEREAL_DAY_SECONDS is 23 h 56 m 4.0905 s, the rate of sidereal time', () => {
    // Mean sidereal time gains 1.002737909350795 turns a solar day (IAU 1982)
    assert.ok(
      Math.abs(
        EARTH_SIDEREAL_DAY_SECONDS - SECONDS_PER_DAY / 1.002_737_909_350_795
      ) < 1e-4
    );
    // With the tropical year, it gives the solar day
    assert.ok(
      Math.abs(
        solarDay(EARTH_SIDEREAL_DAY_SECONDS, 365.242_19 * SECONDS_PER_DAY) -
          SECONDS_PER_DAY
      ) < 1e-3
    );
  });

  test('MARS_SOL_SECONDS is 24 h 39 m 35.244 s, and MARS_SOL_DAYS days', () => {
    assert.equal(MARS_SOL_SECONDS, 24 * 3600 + 39 * 60 + 35.244);
    assert.ok(
      Math.abs(MARS_SOL_SECONDS / SECONDS_PER_DAY / MARS_SOL_DAYS - 1) < 2e-9
    );
  });

  test('MARS_SIDEREAL_DAY_SECONDS is 24 h 37 m 22.663 s, the IAU rate to a millisecond', () => {
    assert.ok(
      Math.abs(MARS_SIDEREAL_DAY_SECONDS - (24 * 3600 + 37 * 60 + 22.663)) <
        1e-9
    );
    assert.ok(
      Math.abs(
        MARS_SIDEREAL_DAY_SECONDS - (360 / 350.891982443297) * SECONDS_PER_DAY
      ) < 1e-3
    );
  });

  test('a turn of Mars and its 686.971-day year give the sol', () => {
    assert.ok(
      Math.abs(
        solarDay(MARS_SIDEREAL_DAY_SECONDS, 686.971 * SECONDS_PER_DAY) -
          MARS_SOL_SECONDS
      ) < 1e-2
    );
  });
});
