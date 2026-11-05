import type { Radians, SpaceWeatherInterface } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { gtd7, type Gtd7Input, type Gtd7Output } from '../nrlmsise00-gtd7.js';
import { nrlmsise00 } from '../nrlmsise00.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// A UTC moment from the day of the year and the seconds of the day
const at = (day: number, sec: number) =>
  new Date(Date.UTC(2026, 0, day, 0, 0, sec));
// Within half a unit in the last printed digit: `digits` significant
// figures, or `decimals` places for the temperatures
const printed = (
  actual: number,
  expected: number,
  { digits, decimals }: { digits?: number; decimals?: number },
  what: string
) => {
  if (expected === 0) {
    assert.ok(Math.abs(actual) < 1e-30, `${what}: expected 0, got ${actual}`);

    return;
  }

  const unit =
    decimals === undefined
      ? 10 ** (Math.floor(Math.log10(Math.abs(expected))) - (digits! - 1))
      : 10 ** -decimals;

  assert.ok(
    Math.abs(actual - expected) <= unit / 2,
    `${what}: expected ${expected} ± ${unit / 2}, got ${actual}`
  );
};
// NRL's driver, nrlmsise00_driver.for: case 1, and what each case changes
const BASE: Gtd7Input = {
  day: 172,
  sec: 29000,
  alt: 400,
  lat: 60,
  lon: -70,
  stl: 16,
  f107a: 150,
  f107: 150,
  ap: 4
};
const APH = [100, 100, 100, 100, 100, 100, 100];
const KEYS = [
  'tinf',
  't',
  'he',
  'o',
  'n2',
  'o2',
  'ar',
  'h',
  'n',
  'anomalousO',
  'rho'
] as const;
// nrlmsise00_output.txt, in cgs: TINF, TG, HE, O, N2, O2, AR, H, N, ANM O,
// RHO. Cases 1 to 15 from its tables (temperatures to 2 decimals, the rest
// to 4 significant figures); 16 and 17, with SW(9) = -1 and the Ap history
// APH, from its first block (temperatures to 4 significant figures, the
// rest to 3)
const CASES: readonly (readonly [Partial<Gtd7Input>, readonly number[]])[] = [
  [
    {},
    [
      1250.54, 1241.42, 6.665e5, 1.139e8, 1.998e7, 4.023e5, 3.557e3, 3.475e4,
      4.096e6, 2.667e4, 4.075e-15
    ]
  ],
  [
    { day: 81 },
    [
      1166.75, 1161.71, 3.407e6, 1.586e8, 1.391e7, 3.263e5, 1.56e3, 4.854e4,
      4.381e6, 6.957e3, 5.002e-15
    ]
  ],
  [
    { sec: 75000, alt: 1000 },
    [
      1239.89, 1239.89, 1.124e5, 6.934e4, 4.247e1, 1.323e-1, 2.619e-5, 2.017e4,
      5.741e3, 2.374e4, 2.757e-18
    ]
  ],
  [
    { alt: 100 },
    [
      1027.32, 206.89, 5.412e7, 1.919e11, 6.116e12, 1.225e12, 6.023e10, 1.06e7,
      2.616e5, 0, 3.584e-10
    ]
  ],
  [
    { lat: 0 },
    [
      1212.4, 1208.14, 1.851e6, 1.477e8, 1.579e7, 2.634e5, 1.589e3, 5.816e4,
      5.479e6, 1.264e3, 4.81e-15
    ]
  ],
  [
    { lon: 0 },
    [
      1220.15, 1212.71, 8.673e5, 1.279e8, 1.823e7, 2.922e5, 2.403e3, 3.686e4,
      3.897e6, 2.667e4, 4.356e-15
    ]
  ],
  [
    { stl: 4 },
    [
      1116.39, 1113.0, 5.776e5, 6.979e7, 1.237e7, 2.493e5, 1.406e3, 5.292e4,
      1.07e6, 2.667e4, 2.471e-15
    ]
  ],
  [
    { f107a: 70 },
    [
      1031.25, 1024.85, 3.74e5, 4.783e7, 5.24e6, 1.76e5, 5.502e2, 8.897e4,
      1.98e6, 9.122e3, 1.572e-15
    ]
  ],
  [
    { f107: 180 },
    [
      1306.05, 1293.37, 6.748e5, 1.245e8, 2.369e7, 4.912e5, 4.579e3, 3.245e4,
      5.371e6, 2.667e4, 4.564e-15
    ]
  ],
  [
    { ap: 40 },
    [
      1361.87, 1347.39, 5.529e5, 1.198e8, 3.496e7, 9.34e5, 1.096e4, 2.686e4,
      4.89e6, 2.805e4, 4.975e-15
    ]
  ],
  [
    { alt: 0 },
    [
      1027.32, 281.46, 1.375e14, 0, 2.05e19, 5.499e18, 2.452e17, 0, 0, 0,
      1.261e-3
    ]
  ],
  [
    { alt: 10 },
    [
      1027.32, 227.42, 4.427e13, 0, 6.598e18, 1.77e18, 7.892e16, 0, 0, 0,
      4.059e-4
    ]
  ],
  [
    { alt: 30 },
    [
      1027.32, 237.44, 2.128e12, 0, 3.171e17, 8.506e16, 3.793e15, 0, 0, 0,
      1.951e-5
    ]
  ],
  [
    { alt: 50 },
    [
      1027.32, 279.56, 1.412e11, 0, 2.104e16, 5.645e15, 2.517e14, 0, 0, 0,
      1.295e-6
    ]
  ],
  [
    { alt: 70 },
    [
      1027.32, 219.07, 1.255e10, 0, 1.875e15, 4.923e14, 2.24e13, 0, 0, 0,
      1.148e-7
    ]
  ],
  [
    { ap: APH },
    [
      1.426e3, 1.409e3, 5.2e5, 1.27e8, 4.85e7, 1.72e6, 2.35e4, 2.5e4, 6.28e6,
      2.67e4, 5.88e-15
    ]
  ],
  [
    { alt: 100, ap: APH },
    [
      1.027e3, 1.934e2, 4.26e7, 1.24e11, 4.93e12, 1.05e12, 4.99e10, 8.83e6,
      2.25e5, 0, 2.91e-10
    ]
  ]
];
const MODERATE: SpaceWeatherInterface = { f107: 150, f107a: 150, ap: 4 };
const NOON = new Date('2026-06-21T12:00:00Z');
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) => assert.throws(fn, (err) => err instanceof type && err.message === message);

describe('gtd7', () => {
  CASES.forEach(([change, expected], i) => {
    test(`matches NRL's reference case ${i + 1}`, () => {
      const out = gtd7({ ...BASE, ...change });
      const raw = i >= 15;

      KEYS.forEach((key, k) => {
        const precision =
          k < 2
            ? raw
              ? { digits: 4 }
              : { decimals: 2 }
            : { digits: raw ? 3 : 4 };

        printed(out[key], expected[k], precision, `case ${i + 1} ${key}`);
      });
    });
  });

  test('adds anomalous oxygen to the effective density only', () => {
    const out = gtd7({ ...BASE, alt: 800 });
    const sum =
      1.66e-24 *
      (4 * out.he +
        16 * out.o +
        28 * out.n2 +
        32 * out.o2 +
        40 * out.ar +
        out.h +
        14 * out.n);

    assert.ok(Math.abs(out.rho - sum) <= 1e-12 * sum);
    assert.ok(
      Math.abs(out.rhoEffective - (sum + 1.66e-24 * 16 * out.anomalousO)) <=
        1e-12 * sum
    );
  });

  test('is continuous where the lower atmosphere joins the thermosphere', () => {
    const below = gtd7({ ...BASE, alt: 72.5 - 1e-9 });
    const above = gtd7({ ...BASE, alt: 72.5 });

    for (const key of ['he', 'n2', 'o2', 'ar', 'rho', 't'] as const)
      assert.ok(
        Math.abs(below[key] - above[key]) <= 1e-6 * above[key],
        `${key}: ${below[key]} and ${above[key]}`
      );
  });

  test('is continuous where full mixing starts and at the stratosphere', () => {
    for (const z of [62.5, 32.5]) {
      const below = gtd7({ ...BASE, alt: z - 1e-9 });
      const above = gtd7({ ...BASE, alt: z });

      assert.ok(Math.abs(below.rho - above.rho) <= 1e-6 * above.rho);
      assert.ok(Math.abs(below.t - above.t) <= 1e-6 * above.t);
    }
  });

  test('gives finite, positive densities across heights and activity', () => {
    const heights = [
      0, 20, 32.5, 40, 62.5, 65, 72.5, 80, 95, 105, 115, 123, 130, 155, 165,
      200, 245, 280, 310, 350, 500, 1500
    ];

    for (const ap of [0, 4, 15, 50, [4, 4, 4, 4, 4, 4, 4], APH])
      for (const alt of heights) {
        const out = gtd7({ ...BASE, alt, ap, lat: -35, stl: 2 });

        for (const key of KEYS)
          assert.ok(
            Number.isFinite(out[key]) && out[key] >= 0,
            `${key} at ${alt} km: ${out[key]}`
          );
      }
  });
});

describe('nrlmsise00', () => {
  test('passes the day, UT, local solar time and degrees to gtd7', () => {
    CASES.forEach(([change]) => {
      const input = { ...BASE, ...change };
      const { day, sec, alt, lat, lon, f107a, f107, ap } = input;
      const weather: SpaceWeatherInterface =
        typeof ap === 'number'
          ? { f107, f107a, ap }
          : {
              f107,
              f107a,
              ap: 4,
              apHistory: ap as SpaceWeatherInterface['apHistory']
            };
      const air = nrlmsise00(
        at(day, sec),
        alt * 1000,
        rad(lat),
        rad(lon),
        weather
      );
      const stl = (sec / 3600 + lon / 15 + 24) % 24;
      const core: Gtd7Output = gtd7({ ...input, stl });
      const close = (a: number, b: number) =>
        assert.ok(Math.abs(a - b) <= 1e-9 * Math.abs(b), `${a} and ${b}`);

      close(air.density, core.rho * 1e3);
      close(air.effectiveDensity, core.rhoEffective * 1e3);
      close(air.temperature, core.t);
      close(air.exosphericTemperature, core.tinf);
      close(air.numberDensities.He, core.he * 1e6);
      close(air.numberDensities.O, core.o * 1e6);
      close(air.numberDensities.N2, core.n2 * 1e6);
      close(air.numberDensities.O2, core.o2 * 1e6);
      close(air.numberDensities.Ar, core.ar * 1e6);
      close(air.numberDensities.H, core.h * 1e6);
      close(air.numberDensities.N, core.n * 1e6);
      close(air.numberDensities.anomalousO, core.anomalousO * 1e6);
    });
  });

  test('counts days from 1 January and wraps longitude and local time', () => {
    // 31 December of a leap year is day 366; 270° east is 90° west
    const air = nrlmsise00(
      new Date('2028-12-31T23:30:00Z'),
      300_000,
      rad(20),
      rad(270),
      MODERATE
    );
    const core = gtd7({
      ...BASE,
      day: 366,
      sec: 84_600,
      alt: 300,
      lat: 20,
      lon: -90,
      stl: 23.5 - 6
    });

    assert.ok(Math.abs(air.density - core.rho * 1e3) <= 1e-9 * air.density);

    // 20:00 UT at 170° east is 07:20 local time the next day
    const east = nrlmsise00(
      new Date('2026-06-21T20:00:00Z'),
      300_000,
      rad(20),
      rad(170),
      MODERATE
    );
    const coreEast = gtd7({
      ...BASE,
      sec: 72_000,
      alt: 300,
      lat: 20,
      lon: 170,
      stl: 20 + 170 / 15 - 24
    });

    assert.ok(
      Math.abs(east.density - coreEast.rho * 1e3) <= 1e-9 * east.density
    );
  });

  test('falls in density with height', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1_000_000, noNaN: true }),
        fc.double({ min: 0, max: 1_000_000, noNaN: true }),
        (h1, h2) => {
          // A metre apart, so the densities differ in double precision
          fc.pre(h2 - h1 >= 1);

          const low = nrlmsise00(NOON, h1, rad(45), rad(10), MODERATE);
          const high = nrlmsise00(NOON, h2, rad(45), rad(10), MODERATE);

          assert.ok(high.density < low.density);
        }
      )
    );
  });

  test('is denser at 400 km when the Sun is more active', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 65, max: 250, noNaN: true }),
        fc.double({ min: 1, max: 50, noNaN: true }),
        (f, df) => {
          const quiet = nrlmsise00(NOON, 400_000, rad(45), rad(10), {
            f107: f,
            f107a: f,
            ap: 4
          });
          const active = nrlmsise00(NOON, 400_000, rad(45), rad(10), {
            f107: f + df,
            f107a: f + df,
            ap: 4
          });

          assert.ok(active.density > quiet.density);
          assert.ok(active.exosphericTemperature > quiet.exosphericTemperature);
        }
      )
    );
  });

  test('has an effective density at least the density', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1_000_000, noNaN: true }),
        fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true }),
        fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
        (h, phi, lambda) => {
          const air = nrlmsise00(
            NOON,
            h,
            phi as Radians,
            lambda as Radians,
            MODERATE
          );

          assert.ok(air.effectiveDensity >= air.density);
        }
      )
    );
  });

  test('has no atomic O, H or N below 72.5 km', () => {
    const air = nrlmsise00(NOON, 50_000, rad(45), rad(10), MODERATE);

    assert.equal(air.numberDensities.O, 0);
    assert.equal(air.numberDensities.H, 0);
    assert.equal(air.numberDensities.N, 0);
    assert.equal(air.numberDensities.anomalousO, 0);
    assert.equal(air.effectiveDensity, air.density);
  });

  test('uses the Ap history instead of the daily Ap', () => {
    const history: SpaceWeatherInterface['apHistory'] = [4, 4, 4, 4, 4, 4, 4];
    const daily = nrlmsise00(NOON, 400_000, rad(45), rad(10), MODERATE);
    const stormy = nrlmsise00(NOON, 400_000, rad(45), rad(10), {
      ...MODERATE,
      apHistory: [100, 100, 100, 100, 100, 100, 100]
    });
    const quiet = nrlmsise00(NOON, 400_000, rad(45), rad(10), {
      ...MODERATE,
      ap: 100,
      apHistory: history
    });

    // With every 3-hour Ap at 4, as with a daily Ap of 4, the magnetic
    // terms vanish: the daily Ap, here 100, is ignored
    assert.ok(stormy.density > daily.density);
    assert.ok(Math.abs(quiet.density - daily.density) <= 1e-12 * daily.density);
  });

  test('throws TypeError for an invalid date or a non-finite number', () => {
    throwsWith(
      () => nrlmsise00(new Date(Number.NaN), 1, rad(45), rad(10), MODERATE),
      TypeError,
      'date must be a valid Date. Received: Invalid Date'
    );
    throwsWith(
      () =>
        nrlmsise00(
          '2026-06-21' as unknown as Date,
          1,
          rad(45),
          rad(10),
          MODERATE
        ),
      TypeError,
      'date must be a valid Date. Received: 2026-06-21'
    );
    throwsWith(
      () => nrlmsise00(NOON, Number.NaN, rad(45), rad(10), MODERATE),
      TypeError,
      'h must be a finite number. Received: NaN'
    );
    throwsWith(
      () => nrlmsise00(NOON, 1, Infinity as Radians, rad(10), MODERATE),
      TypeError,
      'phi must be a finite number. Received: Infinity'
    );
    throwsWith(
      () => nrlmsise00(NOON, 1, rad(45), -Infinity as Radians, MODERATE),
      TypeError,
      'lambda must be a finite number. Received: -Infinity'
    );
    throwsWith(
      () =>
        nrlmsise00(NOON, 1, rad(45), rad(10), {
          ...MODERATE,
          f107: Number.NaN
        }),
      TypeError,
      'weather.f107 must be a finite number. Received: NaN'
    );
    throwsWith(
      () =>
        nrlmsise00(NOON, 1, rad(45), rad(10), {
          ...MODERATE,
          f107a: Infinity
        }),
      TypeError,
      'weather.f107a must be a finite number. Received: Infinity'
    );
    throwsWith(
      () =>
        nrlmsise00(NOON, 1, rad(45), rad(10), { ...MODERATE, ap: Number.NaN }),
      TypeError,
      'weather.ap must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError for inputs out of range', () => {
    throwsWith(
      () => nrlmsise00(NOON, -1, rad(45), rad(10), MODERATE),
      RangeError,
      'h must be >= 0. Received: -1'
    );
    throwsWith(
      () => nrlmsise00(NOON, 1, 2 as Radians, rad(10), MODERATE),
      RangeError,
      'phi must be in [-π/2, π/2]. Received: 2'
    );
    throwsWith(
      () => nrlmsise00(NOON, 1, rad(45), rad(10), { ...MODERATE, f107: 0 }),
      RangeError,
      'weather.f107 must be > 0. Received: 0'
    );
    throwsWith(
      () => nrlmsise00(NOON, 1, rad(45), rad(10), { ...MODERATE, f107a: -5 }),
      RangeError,
      'weather.f107a must be > 0. Received: -5'
    );
    throwsWith(
      () => nrlmsise00(NOON, 1, rad(45), rad(10), { ...MODERATE, ap: -1 }),
      RangeError,
      'weather.ap must be >= 0. Received: -1'
    );

    const history = (apHistory: unknown) => () =>
      nrlmsise00(NOON, 1, rad(45), rad(10), {
        ...MODERATE,
        apHistory: apHistory as SpaceWeatherInterface['apHistory']
      });

    throwsWith(
      history('4,4,4,4,4,4,4'),
      RangeError,
      'weather.apHistory must be 7 finite numbers >= 0. Received: 4,4,4,4,4,4,4'
    );
    throwsWith(
      history([4, 4, 4]),
      RangeError,
      'weather.apHistory must be 7 finite numbers >= 0. Received: 4,4,4'
    );
    throwsWith(
      history([4, 4, 4, Number.NaN, 4, 4, 4]),
      RangeError,
      'weather.apHistory must be 7 finite numbers >= 0. Received: 4,4,4,NaN,4,4,4'
    );
    throwsWith(
      history([4, 4, 4, 4, 4, -1, 4]),
      RangeError,
      'weather.apHistory must be 7 finite numbers >= 0. Received: 4,4,4,4,4,-1,4'
    );
  });

  test('throws where an extreme storm breaks the model, rather than return nonsense', () => {
    const storm = (day: number, lat: number, ap: number, km: number) => () =>
      nrlmsise00(
        new Date(Date.UTC(2026, 0, day, 12)),
        km * 1000,
        rad(lat),
        rad(0),
        { f107: 250, f107a: 250, ap }
      );
    const broken = (err: unknown) =>
      err instanceof RangeError &&
      err.message.startsWith('NRLMSISE-00 has no physical result at h = ');

    // A negative temperature near the south pole at Ap 300
    assert.throws(storm(1, -90, 300, 111), broken);
    // A positive temperature, but negative anomalous oxygen, at Ap 400
    assert.throws(storm(350, 90, 400, 116), broken);
    // The same storm is fine higher up
    assert.ok(
      nrlmsise00(
        new Date(Date.UTC(2026, 0, 1, 12)),
        400_000,
        rad(-90),
        rad(0),
        { f107: 250, f107a: 250, ap: 300 }
      ).density > 0
    );
  });
});
