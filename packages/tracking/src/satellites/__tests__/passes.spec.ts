import type {
  GeodeticCoordinatesInterface,
  MeanElementsInterface,
  Radians
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { lookAngles } from '../look-angles.js';
import { predictPasses } from '../passes.js';
import { parseTle } from '../tle.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const MINUTE = 60_000;
const oslo: GeodeticCoordinatesInterface = {
  phi: rad(59.91),
  lambda: rad(10.75),
  h: 20
};
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);
// From Vallado's verification set: XM-3, geostationary at 85.15° W, and a
// sun-synchronous satellite, inclined 98.4°
const xm3 = parseTle(
  '1 28626U 05008A   06176.46683397 -.00000205  00000-0  10000-3 0  2190',
  '2 28626   0.0019 286.9433 0000335  13.7918  55.6504  1.00270176  4891'
);
const sunSynchronous = parseTle(
  '1 28057U 03049A   06177.78615833  .00000060  00000-0  35940-4 0  1836',
  '2 28057  98.4283 247.6961 0000884  88.1964 271.9322 14.35478080140550'
);
const day = (elements: MeanElementsInterface) => {
  const from = new Date(elements.epoch.getTime());

  return [from, new Date(from.getTime() + 1440 * MINUTE)] as const;
};
const elevation = (
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  date: Date
) => lookAngles(elements, observer, date).elevation;

describe('predictPasses', () => {
  const [from, to] = day(iss);
  const passes = predictPasses(iss, oslo, from, to);

  test('finds the passes of the ISS over Oslo in a day, in order', () => {
    assert.ok(passes.length >= 3 && passes.length <= 8, `${passes.length}`);

    for (const [k, pass] of passes.entries()) {
      assert.ok(pass.rise < pass.culmination && pass.culmination < pass.set);
      // A low orbit: under a quarter of an hour above the horizon
      assert.ok(pass.set.getTime() - pass.rise.getTime() < 15 * MINUTE);

      if (k > 0) assert.ok(passes[k - 1]!.set < pass.rise);
    }
  });

  test('times rise and set to the millisecond the elevation crosses 0', () => {
    for (const { rise, set } of passes) {
      assert.ok(elevation(iss, oslo, new Date(rise.getTime() - 1)) <= 0);
      assert.ok(elevation(iss, oslo, rise) > 0);
      assert.ok(elevation(iss, oslo, set) > 0);
      assert.ok(elevation(iss, oslo, new Date(set.getTime() + 1)) <= 0);
    }
  });

  test('puts the culmination at the highest point of the pass', () => {
    for (const pass of passes) {
      for (const offset of [-60_000, -1000, 1000, 60_000]) {
        const t = pass.culmination.getTime() + offset;

        if (t > pass.rise.getTime() && t < pass.set.getTime())
          assert.ok(
            elevation(iss, oslo, new Date(t)) <= pass.maxElevation + 1e-12
          );
      }

      assert.equal(pass.maxElevation, elevation(iss, oslo, pass.culmination));
    }
  });

  test('gives the azimuths at rise, culmination and set', () => {
    for (const pass of passes) {
      assert.equal(pass.riseAzimuth, lookAngles(iss, oslo, pass.rise).azimuth);
      assert.equal(pass.setAzimuth, lookAngles(iss, oslo, pass.set).azimuth);
      assert.equal(
        pass.culminationAzimuth,
        lookAngles(iss, oslo, pass.culmination).azimuth
      );
    }
  });

  test('keeps only the high passes, timed at the minimum elevation', () => {
    const minElevation = rad(10);
    const high = predictPasses(iss, oslo, from, to, { minElevation });

    assert.ok(high.length < passes.length);

    for (const pass of high) {
      assert.ok(pass.maxElevation > minElevation);
      assert.ok(
        elevation(iss, oslo, new Date(pass.rise.getTime() - 1)) <= minElevation
      );
      assert.ok(elevation(iss, oslo, pass.rise) > minElevation);

      // The same pass, seen from the horizon, starts earlier
      const whole = passes.find((p) => p.rise < pass.rise && p.set > pass.set);

      assert.ok(whole);
      assert.equal(whole.culmination.getTime(), pass.culmination.getTime());
    }
  });

  test('takes the same passes with a finer step', () => {
    const fine = predictPasses(iss, oslo, from, to, { step: 5 });

    assert.equal(fine.length, passes.length);
    fine.forEach((pass, k) => {
      assert.equal(pass.rise.getTime(), passes[k]!.rise.getTime());
      assert.equal(pass.set.getTime(), passes[k]!.set.getTime());
      assert.ok(
        Math.abs(
          pass.culmination.getTime() - passes[k]!.culmination.getTime()
        ) <= 1
      );
    });
  });

  test('leaves out a pass in progress at the start or end of the window', () => {
    const first = passes[0]!;
    const middle = new Date((first.rise.getTime() + first.set.getTime()) / 2);
    const after = predictPasses(iss, oslo, middle, to);
    const before = predictPasses(iss, oslo, from, middle);

    assert.equal(after.length, passes.length - 1);
    assert.equal(after[0]!.rise.getTime(), passes[1]!.rise.getTime());
    assert.equal(before.length, 0);
  });

  test('gives a geostationary satellite no passes, seen or not', () => {
    const [start, end] = day(xm3);
    const washington = { phi: rad(38.9), lambda: rad(-77.04), h: 0 };

    // Always up from Washington, never from Oslo
    assert.ok(elevation(xm3, washington, start) > rad(30));
    assert.deepEqual(predictPasses(xm3, washington, start, end), []);
    assert.ok(elevation(xm3, oslo, start) < 0);
    assert.deepEqual(predictPasses(xm3, oslo, start, end), []);
  });

  test('sees a polar orbit from a polar station on most orbits', () => {
    const [start, end] = day(sunSynchronous);
    const svalbard = { phi: rad(78.23), lambda: rad(15.41), h: 450 };
    const polar = predictPasses(sunSynchronous, svalbard, start, end);

    // 14.35 orbits a day; near the pole, most of them are seen
    assert.ok(polar.length >= 10, `${polar.length}`);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => predictPasses(iss, oslo, new Date('nope'), to),
      (err) =>
        err instanceof TypeError &&
        /^from must be a valid Date/.test(err.message)
    );
    assert.throws(
      () => predictPasses(iss, oslo, from, new Date(Number.NaN)),
      (err) =>
        err instanceof TypeError && /^to must be a valid Date/.test(err.message)
    );
    assert.throws(
      () => predictPasses(iss, oslo, to, from),
      (err) =>
        err instanceof RangeError && /^to must be after from/.test(err.message)
    );
    assert.throws(
      () =>
        predictPasses(iss, oslo, from, to, {
          minElevation: Number.NaN as Radians
        }),
      (err) =>
        err instanceof TypeError &&
        err.message === 'minElevation must be a finite number. Received: NaN'
    );
    assert.throws(
      () => predictPasses(iss, oslo, from, to, { minElevation: rad(90) }),
      (err) =>
        err instanceof RangeError &&
        /^minElevation must be in/.test(err.message)
    );
    assert.throws(
      () => predictPasses(iss, oslo, from, to, { step: 0 }),
      (err) =>
        err instanceof RangeError &&
        err.message === 'step must be > 0. Received: 0'
    );
    assert.throws(
      () => predictPasses({ ...iss, meanMotion: Number.NaN }, oslo, from, to),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'elements.meanMotion must be a finite number. Received: NaN'
    );
  });
});
