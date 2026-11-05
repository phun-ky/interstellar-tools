import { EGM2008 } from '@interstellar-tools/constants';
import {
  decayRate,
  elementsToState,
  exponentialAtmosphereDensity,
  j2NodalPrecessionRate,
  nrlmsise00,
  solarRadiationPressureAcceleration,
  stateToElements,
  sunPosition
} from '@interstellar-tools/equations';
import type {
  EphemerisInterface,
  EphemerisSampleInterface,
  Radians,
  StateVectorInterface
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { stateAt } from '../../probes/interpolate.js';
import { fitElements } from '../fit.js';
import { propagate } from '../propagate.js';
import { propagateNumerically } from '../propagate-numerically.js';
import { parseTle } from '../tle.js';

const MU = EGM2008.mu;
const R = EGM2008.radius;
const DEG = Math.PI / 180;
const DAY = 86_400_000;
const FROM = new Date('2026-11-05T00:00:00Z');
const after = (ms: number) => new Date(FROM.getTime() + ms);
// Earth's pull alone
const POINT_MASS = { zonal: false, sun: false, moon: false } as const;
const circular = (height: number, inclination: number): StateVectorInterface =>
  elementsToState(
    {
      a: R + height,
      e: 0,
      i: (inclination * DEG) as Radians,
      raan: 0 as Radians,
      argp: 0 as Radians,
      nu: 0 as Radians
    },
    MU
  );
const last = (ephemeris: EphemerisInterface) =>
  ephemeris.samples[ephemeris.samples.length - 1]!;
const elements = ({ r, v }: StateVectorInterface) => stateToElements(r, v, MU);
const energy = ({ r, v }: StateVectorInterface) =>
  Math.hypot(...v) ** 2 / 2 - MU / Math.hypot(...r);
const momentum = ({ r, v }: StateVectorInterface) =>
  Math.hypot(
    r[1] * v[2] - r[2] * v[1],
    r[2] * v[0] - r[0] * v[2],
    r[0] * v[1] - r[1] * v[0]
  );
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof type);
    assert.equal(err.message, message);

    return true;
  });

describe('propagateNumerically', () => {
  test("keeps energy and angular momentum under Earth's pull alone", () => {
    const start = circular(420_000, 51.6);
    const ephemeris = propagateNumerically(start, FROM, after(10 * DAY), {
      step: 3600,
      forces: POINT_MASS
    });

    assert.ok(Math.abs(energy(last(ephemeris)) / energy(start) - 1) < 1e-7);
    assert.ok(Math.abs(momentum(last(ephemeris)) / momentum(start) - 1) < 1e-7);
  });

  test('returns an ephemeris with a sample every step, from the start to the end', () => {
    const ephemeris = propagateNumerically(
      circular(420_000, 51.6),
      FROM,
      after(3_650_000),
      { step: 600, forces: POINT_MASS }
    );
    const epochs = ephemeris.samples.map(({ epoch }) => epoch.getTime());

    assert.equal(ephemeris.center, 'EARTH');
    assert.equal(ephemeris.frame, 'TEME');
    assert.equal(ephemeris.timeScale, 'UTC');
    assert.deepEqual(
      epochs,
      [
        0, 600_000, 1_200_000, 1_800_000, 2_400_000, 3_000_000, 3_600_000,
        3_650_000
      ].map((ms) => FROM.getTime() + ms)
    );
    assert.deepEqual(ephemeris.samples[0]!.r, circular(420_000, 51.6).r);
  });

  test('turns the orbit plane at the J2 rate', () => {
    const height = 700_000;
    const inclination = 98;
    const start = circular(height, inclination);
    const ephemeris = propagateNumerically(start, FROM, after(10 * DAY), {
      step: 3600,
      forces: { zonal: [EGM2008.J[0]!], sun: false, moon: false }
    });
    const a = R + height;
    const rate = j2NodalPrecessionRate(
      EGM2008.J[0]!,
      Math.sqrt(MU / a ** 3),
      R,
      a,
      (inclination * DEG) as Radians,
      0
    );
    const turned = elements(last(ephemeris)).raan - elements(start).raan;

    // Eastward, about a degree a day: sun-synchronous
    assert.ok(Math.abs(turned / (10 * 86_400) / rate - 1) < 0.01);
    assert.ok(Math.abs(turned / 10 / DEG - 0.9856) < 0.02);
  });

  test('lowers the orbit by drag as decayRate predicts, in air that turns with Earth', () => {
    const beta = 60.45;
    const height = 400_000;
    const a = R + height;
    const ephemeris = propagateNumerically(
      circular(height, 0),
      FROM,
      after(DAY),
      {
        step: 60,
        forces: { ...POINT_MASS, drag: { ballisticCoefficient: beta } }
      }
    );
    const period = Math.round((2 * Math.PI * Math.sqrt(a ** 3 / MU)) / 60);
    const mean = (samples: readonly EphemerisSampleInterface[]) =>
      samples.reduce((sum, sample) => sum + elements(sample).a, 0) /
      samples.length;
    const orbits = (ephemeris.samples.length - period) / period;
    const perOrbit =
      (mean(ephemeris.samples.slice(-period)) -
        mean(ephemeris.samples.slice(0, period))) /
      orbits;
    // Flying east, through air that moves east at ω a
    const v = Math.sqrt(MU / a);
    const relative = (v - 7.292115e-5 * a) / v;

    assert.ok(
      Math.abs(
        perOrbit /
          (decayRate(a, beta, exponentialAtmosphereDensity(height)) *
            relative ** 2) -
          1
      ) < 0.02,
      `${perOrbit} m an orbit`
    );
  });

  test('takes the density from a model, given the point and moment', () => {
    const points: { phi: number; h: number }[] = [];
    const quiet = { f107: 70, f107a: 70, ap: 4 };
    const ephemeris = propagateNumerically(
      circular(400_000, 51.6),
      FROM,
      after(3_600_000),
      {
        step: 600,
        forces: {
          ...POINT_MASS,
          drag: {
            ballisticCoefficient: 60,
            density: (point, date) => {
              points.push(point);

              return nrlmsise00(date, point.h, point.phi, point.lambda, quiet)
                .effectiveDensity;
            }
          }
        }
      }
    );

    assert.equal(ephemeris.samples.length, 7);
    assert.ok(points.every(({ h }) => h > 380_000 && h < 430_000));
    assert.ok(Math.max(...points.map(({ phi }) => phi)) > 50 * DEG);
  });

  test("tilts a geostationary orbit by the Sun's and the Moon's pulls, under a degree a year", () => {
    const ephemeris = propagateNumerically(
      circular(42_164_170 - R, 0.0001),
      FROM,
      after(365 * DAY),
      { step: DAY }
    );
    const tilt = elements(last(ephemeris)).i / DEG;

    // 0.75° to 0.95° a year over the Moon's 18.6-year cycle
    assert.ok(tilt > 0.75 && tilt < 0.95, `${tilt}°`);
  });

  test("grows a geostationary orbit's eccentricity by sunlight", () => {
    const a = 42_164_170;
    const srp = { Cr: 1.5, areaToMass: 0.02 };
    const ephemeris = propagateNumerically(
      circular(a - R, 0.0001),
      FROM,
      after(30 * DAY),
      {
        step: DAY,
        forces: { ...POINT_MASS, solarRadiationPressure: srp }
      }
    );
    const push = Math.hypot(
      ...solarRadiationPressureAcceleration(
        [a, 0, 0],
        sunPosition(FROM).r,
        srp.Cr,
        srp.areaToMass
      )
    );
    // de/dt = 3F / (2 n a), while the Sun moves 30° along its path
    const expected = (1.5 * push * 30 * 86_400) / (Math.sqrt(MU / a ** 3) * a);

    assert.ok(Math.abs(elements(last(ephemeris)).e / expected - 1) < 0.1);
  });

  test("switches sunlight off in Earth's shadow", () => {
    const sun = sunPosition(FROM).r;
    const toward = sun.map((x) => x / Math.hypot(...sun));
    const r = R + 420_000;
    // Sideways to the Sun, at circular speed
    const side = [toward[1]!, -toward[0]!, 0].map(
      (x) => x / Math.hypot(toward[0]!, toward[1]!)
    );
    const speed = Math.sqrt(MU / r);
    const at = (sign: number): StateVectorInterface => ({
      r: toward.map((x) => sign * r * x) as [number, number, number],
      v: side.map((x) => speed * x) as [number, number, number]
    });
    // How far a minute of sunlight moves the satellite
    const pushed = (start: StateVectorInterface) => {
      const run = (Cr: number) =>
        last(
          propagateNumerically(start, FROM, after(60_000), {
            forces: {
              ...POINT_MASS,
              solarRadiationPressure: { Cr, areaToMass: 0.02 }
            }
          })
        ).r;
      const lit = run(1);
      const dark = run(0);

      return Math.hypot(...lit.map((x, k) => x - dark[k]!));
    };
    // ½ a t², with a = P A/m at 1 au, about 9e-8 m/s²
    const expected = 0.5 * (1361 / 299_792_458) * 0.02 * 60 ** 2;

    assert.ok(Math.abs(pushed(at(1)) / expected - 1) < 0.05);
    // Behind Earth, in its shadow: no push at all
    assert.equal(pushed(at(-1)), 0);
  });

  test('raises the orbit by an along-track burn, as vis-viva says', () => {
    const height = 500_000;
    const a = R + height;
    const burn = after(3_600_000);
    const ephemeris = propagateNumerically(
      circular(height, 30),
      FROM,
      after(7_200_000),
      {
        step: 60,
        forces: POINT_MASS,
        manoeuvres: [{ epoch: burn, deltaV: [0, 10, 0], frame: 'rtn' }]
      }
    );
    const v = Math.sqrt(MU / a) + 10;
    const raised = 1 / (2 / a - v ** 2 / MU);
    const at = ephemeris.samples.find(
      ({ epoch }) => epoch.getTime() === burn.getTime()
    )!;

    assert.ok(Math.abs(elements(last(ephemeris)).a - raised) < 1);
    // The sample at the burn has the new speed
    assert.ok(Math.abs(Math.hypot(...at.v) - v) < 1e-3);
  });

  test('flies a Hohmann transfer: two burns, in any order', () => {
    const r1 = R + 500_000;
    const r2 = R + 800_000;
    const transfer = (r1 + r2) / 2;
    const dv1 = Math.sqrt(MU / r1) * (Math.sqrt(r2 / transfer) - 1);
    const dv2 = Math.sqrt(MU / r2) * (1 - Math.sqrt(r1 / transfer));
    // Half the transfer orbit, to the millisecond
    const half = Math.round(Math.PI * Math.sqrt(transfer ** 3 / MU) * 1000);
    const ephemeris = propagateNumerically(
      circular(500_000, 30),
      FROM,
      after(half + 3_600_000),
      {
        step: 600,
        forces: POINT_MASS,
        manoeuvres: [
          { epoch: after(half), deltaV: [0, dv2, 0], frame: 'rtn' },
          { epoch: FROM, deltaV: [0, dv1, 0], frame: 'rtn' }
        ]
      }
    );
    const { a, e } = elements(last(ephemeris));

    assert.ok(Math.abs(a - r2) < 50, `${a - r2} m`);
    assert.ok(e < 1e-5, `e = ${e}`);
  });

  test('takes a burn on the inertial axes too', () => {
    const start = circular(500_000, 30);
    const speed = Math.hypot(...start.v);
    const along = start.v.map((x) => (10 * x) / speed) as [
      number,
      number,
      number
    ];
    const rtn = propagateNumerically(start, FROM, after(600_000), {
      forces: POINT_MASS,
      manoeuvres: [{ epoch: FROM, deltaV: [0, 10, 0], frame: 'rtn' }]
    });
    const inertial = propagateNumerically(start, FROM, after(600_000), {
      forces: POINT_MASS,
      manoeuvres: [{ epoch: FROM, deltaV: along }]
    });

    assert.ok(
      Math.hypot(...last(rtn).r.map((x, k) => x - last(inertial).r[k]!)) < 1e-3
    );
  });

  test('ends at re-entry, 100 km up', () => {
    const ephemeris = propagateNumerically(
      circular(200_000, 51.6),
      FROM,
      after(5 * DAY),
      {
        step: 600,
        forces: { drag: { ballisticCoefficient: 60 } }
      }
    );
    const end = last(ephemeris);

    assert.ok(end.epoch.getTime() < after(5 * DAY).getTime());
    assert.ok(Math.hypot(...end.r) - 6_378_137 < 100_000);
  });

  test('agrees between the integrators', () => {
    const start = circular(420_000, 51.6);
    const options = { step: 600, forces: { moon: true } } as const;
    const rk45 = propagateNumerically(start, FROM, after(DAY / 4), options);
    const rk4 = propagateNumerically(start, FROM, after(DAY / 4), {
      ...options,
      integrator: { method: 'rk4', step: 5 }
    });

    assert.ok(
      Math.hypot(...last(rk45).r.map((x, k) => x - last(rk4).r[k]!)) < 0.1
    );
  });

  test("works with stateAt and fitElements: a TLE from one's own model", () => {
    const iss = parseTle(
      '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
      '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
    );
    const ephemeris = propagateNumerically(
      propagate(iss, iss.epoch),
      iss.epoch,
      new Date(iss.epoch.getTime() + DAY),
      { step: 300, forces: { drag: { ballisticCoefficient: 100 } } }
    );
    const middle = new Date(iss.epoch.getTime() + DAY / 2 + 150_000);
    const between = stateAt(ephemeris, middle);
    const fit = fitElements(ephemeris.samples, last(ephemeris).epoch);

    assert.ok(Math.hypot(...between.r) > 6.7e6);
    assert.equal(fit.converged, true);
    // SGP4 can't follow every force, but stays close
    assert.ok(fit.rms.position < 2000, `${fit.rms.position} m`);
  });

  describe('rejects', () => {
    const start = circular(420_000, 51.6);

    test('an invalid state or dates', () => {
      throwsWith(
        () =>
          propagateNumerically(
            { r: [1, 2, Number.NaN], v: [0, 0, 0] },
            FROM,
            after(DAY)
          ),
        TypeError,
        'r must be three finite numbers. Received: 1,2,NaN'
      );
      throwsWith(
        () => propagateNumerically(start, new Date('nope'), after(DAY)),
        TypeError,
        'from must be a valid Date. Received: Invalid Date'
      );
      throwsWith(
        () => propagateNumerically(start, FROM, FROM),
        RangeError,
        'to must be after from. Received: 2026-11-05T00:00:00.000Z, from 2026-11-05T00:00:00.000Z'
      );
    });

    test('invalid options, naming them', () => {
      throwsWith(
        () => propagateNumerically(start, FROM, after(DAY), { step: 0 }),
        RangeError,
        'step must be > 0. Received: 0'
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            integrator: { tolerance: Number.NaN }
          }),
        TypeError,
        'integrator.tolerance must be a finite number. Received: NaN'
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            integrator: { method: 'euler' as 'rk4' }
          }),
        RangeError,
        "integrator.method must be 'rk45' or 'rk4'. Received: euler"
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            forces: { drag: { ballisticCoefficient: -1 } }
          }),
        RangeError,
        'forces.drag.ballisticCoefficient must be > 0. Received: -1'
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            forces: {
              drag: {
                ballisticCoefficient: 60,
                density: 1e-12 as unknown as () => number
              }
            }
          }),
        TypeError,
        'forces.drag.density must be a function of a point and a moment.'
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            forces: { solarRadiationPressure: { Cr: -1, areaToMass: 0.01 } }
          }),
        RangeError,
        'forces.solarRadiationPressure.Cr must be >= 0. Received: -1'
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            forces: {
              ...POINT_MASS,
              drag: { ballisticCoefficient: 60, density: () => -1 }
            }
          }),
        RangeError,
        'forces.drag.density must give a finite number >= 0. Received: -1 at 419999.2999999998 m'
      );
    });

    test('a manoeuvre outside the span, or on unknown axes', () => {
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            manoeuvres: [{ epoch: after(2 * DAY), deltaV: [0, 1, 0] }]
          }),
        RangeError,
        'manoeuvres[0].epoch must be within from and to. Received: 2026-11-07T00:00:00.000Z'
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            manoeuvres: [
              { epoch: FROM, deltaV: [0, 1, 0], frame: 'vnb' as 'rtn' }
            ]
          }),
        RangeError,
        "manoeuvres[0].frame must be 'inertial' or 'rtn'. Received: vnb"
      );
      throwsWith(
        () =>
          propagateNumerically(start, FROM, after(DAY), {
            manoeuvres: [
              { epoch: FROM, deltaV: [0, 1] as unknown as [0, 0, 0] }
            ]
          }),
        TypeError,
        'manoeuvres[0].deltaV must be three finite numbers. Received: 0,1'
      );
    });
  });
});
