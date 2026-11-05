import type {
  EphemerisSampleInterface,
  MeanElementsInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { fitElements } from '../fit.js';
import { propagate } from '../propagate.js';
import { formatTle, parseTle } from '../tle.js';

const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483',
  'ISS (ZARYA)'
);
// From Vallado et al.'s verification set: a Molniya orbit, a decaying
// transfer orbit with heavy drag, an orbit SGP4 can't start from its
// osculating elements, and a geostationary satellite at 0.002°
const molniya = parseTle(
  '1 08195U 75081A   06176.33215444  .00000099  00000-0  11873-3 0   813',
  '2 08195  64.1586 279.0717 6877146 264.7651  20.2257  2.00491383225656'
);
const transfer = parseTle(
  '1 11801U          80230.29629788  .01431103  00000-0  14311-1      13',
  '2 11801  46.7916 230.4354 7318036  47.4722  10.4117  2.28537848    13'
);
const eccentric = parseTle(
  '1 23333U 94071A   94305.49999999 -.00172956  26967-3  10000-3 0    15',
  '2 23333  28.7490   2.3720 9728298  30.4360   1.3500  0.07309491    70'
);
const xm3 = parseTle(
  '1 28626U 05008A   06176.46683397 -.00000205  00000-0  10000-3 0  2190',
  '2 28626   0.0019 286.9433 0000335  13.7918  55.6504  1.00270176  4891'
);
const MINUTE = 60_000;
// States from SGP4 every `step` minutes for `minutes`, from the epoch
const statesOf = (
  elements: MeanElementsInterface,
  minutes: number,
  step: number
): EphemerisSampleInterface[] => {
  const states: EphemerisSampleInterface[] = [];

  for (let m = 0; m <= minutes; m += step) {
    const epoch = new Date(elements.epoch.getTime() + m * MINUTE);

    states.push({ epoch, ...propagate(elements, epoch) });
  }

  return states;
};
const distance = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(...a.map((x, k) => x - b[k]!));
// The largest distance between two element sets' positions over a span
const farthest = (
  a: MeanElementsInterface,
  b: MeanElementsInterface,
  from: Date,
  minutes: number
) => {
  let max = 0;

  for (let m = 0; m <= minutes; m += 5) {
    const date = new Date(from.getTime() + m * MINUTE);

    max = Math.max(max, distance(propagate(a, date).r, propagate(b, date).r));
  }

  return max;
};
// Normally distributed noise, from a fixed seed
const noise = (seed: number) => {
  let state = seed;
  const uniform = () => {
    state = (state * 16_807) % 2_147_483_647;

    return state / 2_147_483_647;
  };

  return () =>
    Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
};
const ISS_STATES = statesOf(iss, 2 * 24 * 60, 10);
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

describe('fitElements', () => {
  test("recovers the ISS's elements from two days of SGP4 states", () => {
    const fit = fitElements(ISS_STATES, iss.epoch);
    const { elements } = fit;

    assert.equal(fit.converged, true);
    assert.ok(fit.rms.position < 1e-3, `${fit.rms.position} m`);
    assert.ok(fit.rms.velocity < 1e-6, `${fit.rms.velocity} m/s`);
    assert.ok(Math.abs(elements.meanMotion / iss.meanMotion - 1) < 1e-12);
    assert.ok(Math.abs(elements.e - iss.e) < 1e-10);

    for (const key of ['i', 'raan', 'argp'] as const)
      assert.ok(Math.abs(elements[key] - iss[key]) < 1e-10, key);

    // The epoch Date is the TLE's to the millisecond, 96 µs earlier (to the
    // 40 µs a Julian date holds), so the mean anomaly is that far behind
    const early =
      (iss.epochJulianDate - 2440587.5) * 86_400 - iss.epoch.getTime() / 1000;

    assert.ok(Math.abs(early - 96e-6) < 40e-6);
    assert.ok(
      Math.abs(
        elements.meanAnomaly - (iss.meanAnomaly - iss.meanMotion * early)
      ) < 1e-10
    );

    assert.ok(Math.abs(elements.bstar / iss.bstar - 1) < 1e-6);
    assert.deepEqual(elements.epoch, iss.epoch);
    assert.equal(elements.meanMotionDot, 0);
    assert.equal(elements.meanMotionDdot, 0);
    assert.equal(fit.residuals.length, ISS_STATES.length);
    assert.ok(fit.iterations > 0);
  });

  test('fits deep-space orbits: Molniya, and a transfer orbit with heavy drag', () => {
    for (const elements of [molniya, transfer]) {
      const fit = fitElements(statesOf(elements, 24 * 60, 20), elements.epoch);

      assert.equal(fit.converged, true);
      assert.ok(fit.rms.position < 1e-3, `${fit.rms.position} m`);
      assert.ok(Math.abs(fit.elements.bstar / elements.bstar - 1) < 1e-4);
    }
  });

  test('fits noisy states to their noise, and stays close to the true orbit', () => {
    const gauss = noise(1);
    const states = statesOf(iss, 2 * 24 * 60, 5).map(
      ({ epoch, r, v }): EphemerisSampleInterface => ({
        epoch,
        r: [r[0] + 10 * gauss(), r[1] + 10 * gauss(), r[2] + 10 * gauss()],
        v: [v[0] + 0.01 * gauss(), v[1] + 0.01 * gauss(), v[2] + 0.01 * gauss()]
      })
    );
    const fit = fitElements(states, iss.epoch);

    // 10 m on each axis is √3 × 10 m in all
    assert.ok(
      Math.abs(fit.rms.position - 10 * Math.sqrt(3)) < 2,
      `${fit.rms.position} m`
    );
    assert.ok(Math.abs(fit.rms.velocity - 0.01 * Math.sqrt(3)) < 0.002);
    // The noise averages out: a few metres from the truth, a day past the arc
    // too
    assert.ok(farthest(fit.elements, iss, iss.epoch, 3 * 24 * 60) < 10);
  });

  test('fits B* poorly from a short arc, so it can be held fixed', () => {
    const gauss = noise(2);
    const states = statesOf(iss, 2 * 60, 1).map(
      ({ epoch, r, v }): EphemerisSampleInterface => ({
        epoch,
        r: [r[0] + 10 * gauss(), r[1] + 10 * gauss(), r[2] + 10 * gauss()],
        v: [v[0] + 0.01 * gauss(), v[1] + 0.01 * gauss(), v[2] + 0.01 * gauss()]
      })
    );
    const free = fitElements(states, iss.epoch);
    const fixed = fitElements(states, iss.epoch, { bstar: iss.bstar });
    const dayAfter = new Date(iss.epoch.getTime() + 26 * 60 * MINUTE);

    // Tens of percent off, and hundreds of metres a day later
    assert.ok(Math.abs(free.elements.bstar / iss.bstar - 1) > 0.1);
    assert.ok(farthest(free.elements, iss, dayAfter, 0) > 100);
    assert.equal(fixed.elements.bstar, iss.bstar);
    assert.ok(farthest(fixed.elements, iss, dayAfter, 0) < 100);
  });

  test('starts from initial elements and keeps their identity, at another epoch', () => {
    const end = ISS_STATES[ISS_STATES.length - 1]!.epoch;
    const fit = fitElements(ISS_STATES, end, { initial: iss });

    assert.equal(fit.converged, true);
    assert.ok(fit.rms.position < 1, `${fit.rms.position} m`);
    assert.deepEqual(fit.elements.epoch, end);
    assert.equal(fit.elements.name, 'ISS (ZARYA)');
    assert.equal(fit.elements.objectId, '1998-067A');
    assert.equal(fit.elements.catalogNumber, 25_544);
    assert.equal(fit.elements.elementSetNumber, 999);
  });

  test('fits states sparser than an orbit apart', () => {
    // Every 4 hours, about 2.6 orbits: the first stage has too few states
    const fit = fitElements(statesOf(iss, 2 * 24 * 60, 240), iss.epoch);

    assert.equal(fit.converged, true);
    assert.ok(fit.rms.position < 1e-2, `${fit.rms.position} m`);
  });

  test('gives anonymous elements without initial ones', () => {
    const { elements } = fitElements(ISS_STATES.slice(0, 20), iss.epoch);

    assert.equal(elements.catalogNumber, 0);
    assert.equal(elements.classification, 'U');
    assert.equal(elements.elementSetNumber, 0);
    assert.equal(elements.revolutionNumber, 0);
    assert.equal('name' in elements, false);
  });

  test('exports a TLE that parses, and stays within metres of the states', () => {
    const fit = fitElements(ISS_STATES, iss.epoch);
    const [line1, line2] = formatTle({
      ...fit.elements,
      catalogNumber: 99_999,
      objectId: '2026-123A'
    });
    const exported = parseTle(line1, line2);

    assert.equal(exported.catalogNumber, 99_999);
    // Rounded to the TLE's digits
    assert.ok(farthest(exported, iss, iss.epoch, 2 * 24 * 60) < 10);
  });

  test('reports the residuals in time order, however the states come', () => {
    const states = [...ISS_STATES.slice(0, 30)].reverse();
    const { residuals, rms } = fitElements(states, iss.epoch);

    assert.deepEqual(
      residuals.map(({ epoch }) => epoch),
      ISS_STATES.slice(0, 30).map(({ epoch }) => epoch)
    );
    assert.ok(
      Math.abs(
        rms.position -
          Math.sqrt(
            residuals.reduce((sum, { position }) => sum + position ** 2, 0) /
              residuals.length
          )
      ) < 1e-15
    );
  });

  test('returns the best fit, not converged, for a nearly equatorial orbit', () => {
    const fit = fitElements(statesOf(xm3, 24 * 60, 120), xm3.epoch);

    assert.equal(fit.converged, false);
    assert.ok(fit.rms.position < 1000, `${fit.rms.position} m`);
  });

  describe('rejects', () => {
    test('too few states, or states that are not states', () => {
      throwsWith(
        () => fitElements(ISS_STATES.slice(0, 1), iss.epoch),
        RangeError,
        'states must hold at least 2 states. Received: 1'
      );
      throwsWith(
        () =>
          fitElements(
            'states' as unknown as EphemerisSampleInterface[],
            iss.epoch
          ),
        TypeError,
        'states must be an array of states. Received: states'
      );
      throwsWith(
        () =>
          fitElements(
            [ISS_STATES[0]!, { ...ISS_STATES[1]!, epoch: new Date('nope') }],
            iss.epoch
          ),
        TypeError,
        'states[1].epoch must be a valid Date. Received: Invalid Date'
      );
      throwsWith(
        () =>
          fitElements(
            [{ ...ISS_STATES[0]!, r: [1, 2, Number.NaN] }, ISS_STATES[1]!],
            iss.epoch
          ),
        TypeError,
        'states[0].r must be three finite numbers. Received: 1,2,NaN'
      );
      throwsWith(
        () =>
          fitElements(
            [
              ISS_STATES[0]!,
              {
                ...ISS_STATES[1]!,
                v: [1, 2] as unknown as Vector3DTupleType
              }
            ],
            iss.epoch
          ),
        TypeError,
        'states[1].v must be three finite numbers. Received: 1,2'
      );
      throwsWith(
        () =>
          fitElements(
            [ISS_STATES[0]!, null as unknown as EphemerisSampleInterface],
            iss.epoch
          ),
        TypeError,
        'states[1].epoch must be a valid Date. Received: undefined'
      );
    });

    test('an invalid epoch, B* or initial elements', () => {
      throwsWith(
        () => fitElements(ISS_STATES, new Date('nope')),
        TypeError,
        'epoch must be a valid Date. Received: Invalid Date'
      );
      throwsWith(
        () => fitElements(ISS_STATES, iss.epoch, { bstar: Number.NaN }),
        TypeError,
        'bstar must be a finite number. Received: NaN'
      );
      assert.throws(
        () =>
          fitElements(ISS_STATES, iss.epoch, {
            initial: { ...iss, e: 1.5 }
          }),
        RangeError
      );
    });

    test('states of an open orbit', () => {
      const date = new Date('2026-11-04T12:00:00Z');

      throwsWith(
        () =>
          fitElements(
            [
              { epoch: date, r: [7e6, 0, 0], v: [0, 11_000, 0] },
              {
                epoch: new Date(date.getTime() + MINUTE),
                r: [7e6, 660_000, 0],
                v: [0, 11_000, 0]
              }
            ],
            date
          ),
        RangeError,
        'states must be of a closed orbit around Earth. Received: e = 1.12493301568888 at 2026-11-04T12:00:00.000Z'
      );
    });

    test('states SGP4 cannot follow from their osculating elements', () => {
      throwsWith(
        () => fitElements(statesOf(eccentric, 24 * 60, 60), eccentric.epoch),
        RangeError,
        'SGP4 fails on the first guess: give initial elements closer to the orbit.'
      );
    });
  });
});
