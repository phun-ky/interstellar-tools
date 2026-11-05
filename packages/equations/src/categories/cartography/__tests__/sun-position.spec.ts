import { AU_METERS } from '@interstellar-tools/constants';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { sunPosition } from '../sun-position.js';

const toDeg = (rad: number) => (rad * 180) / Math.PI;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const moment = fc.date({
  min: new Date('1950-01-01T00:00:00Z'),
  max: new Date('2050-01-01T00:00:00Z'),
  noInvalidDate: true
});

describe('sunPosition', () => {
  test('puts the Sun on the equator at the equinoxes and on the tropics at the solstices', () => {
    // The equinoxes and solstices of 2026, to the minute
    const seasons = [
      ['2026-03-20T14:46:00Z', 0, 0],
      ['2026-06-21T08:24:00Z', 90, 23.436],
      ['2026-09-23T00:05:00Z', 180, 0],
      ['2026-12-21T20:50:00Z', 270, -23.436]
    ] as const;

    for (const [date, rightAscension, declination] of seasons) {
      const sun = sunPosition(new Date(date));

      close(toDeg(sun.rightAscension), rightAscension, 0.01);
      close(toDeg(sun.declination), declination, 0.01);
    }
  });

  test('matches Meeus, Example 25.a (1992-10-13) to 0.01°', () => {
    const sun = sunPosition(new Date('1992-10-13T00:00:00Z'));

    close(toDeg(sun.rightAscension), 198.38083, 0.01);
    close(toDeg(sun.declination), -7.78507, 0.01);
    close(sun.distance / AU_METERS, 0.99766, 1e-4);
  });

  test('is closest at perihelion in January and farthest at aphelion in July', () => {
    close(
      sunPosition(new Date('2026-01-03T17:00:00Z')).distance / AU_METERS,
      0.98329,
      2e-4
    );
    close(
      sunPosition(new Date('2026-07-06T17:00:00Z')).distance / AU_METERS,
      1.01664,
      2e-4
    );
  });

  test('points r along the right ascension and declination, at the distance', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const { rightAscension, declination, distance, r } = sunPosition(date);

        assert.ok(rightAscension >= 0 && rightAscension < 2 * Math.PI);
        // Never past the tropics, 23.44°
        assert.ok(Math.abs(declination) < 0.41);
        close(Math.hypot(...r), distance, 1e-6 * distance);
        close(Math.atan2(r[2], Math.hypot(r[0], r[1])), declination, 1e-12);
        close(
          Math.cos(rightAscension) * r[1] - Math.sin(rightAscension) * r[0],
          0,
          1e-9 * distance
        );
        assert.ok(
          Math.cos(rightAscension) * r[0] + Math.sin(rightAscension) * r[1] >= 0
        );
      })
    );
  });

  test('moves about 0.9856° a day along the ecliptic', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const today = sunPosition(date).r;
        const tomorrow = sunPosition(new Date(date.getTime() + 86_400_000)).r;
        const cos =
          (today[0] * tomorrow[0] +
            today[1] * tomorrow[1] +
            today[2] * tomorrow[2]) /
          (Math.hypot(...today) * Math.hypot(...tomorrow));

        // Faster at perihelion (1.019°) than at aphelion (0.953°)
        const degrees = toDeg(Math.acos(Math.min(1, cos)));

        assert.ok(degrees > 0.95 && degrees < 1.02, `${degrees}°`);
      })
    );
  });

  test('rejects an invalid date', () => {
    assert.throws(
      () => sunPosition(new Date(Number.NaN)),
      (err) =>
        err instanceof TypeError &&
        err.message === 'date must be a valid Date. Received: Invalid Date'
    );
  });
});
