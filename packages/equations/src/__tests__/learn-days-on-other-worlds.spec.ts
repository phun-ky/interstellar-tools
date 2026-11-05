import {
  MARS_SOL_DAYS,
  MARS_SOL_SECONDS,
  MOONS,
  PLANETS
} from '@interstellar-tools/constants';
import {
  coordinatedMarsTime,
  marsLocalMeanSolarTime,
  marsSolDate,
  missionSol
} from '@interstellar-tools/temporal';
import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { solarDayLength } from '../categories/orbits/solar-day-length.js';

// Every number in docs/learn/days-on-other-worlds.md, so the page can't drift
// from the code

const PAGE = readFileSync(
  new URL('../../../../docs/learn/days-on-other-worlds.md', import.meta.url),
  'utf8'
);
const DAY = 86_400;
const DEG = Math.PI / 180;
const GALE = (137.42 * DEG) as Radians;
const JEZERO = (77.43 * DEG) as Radians;
const DATE = new Date('2026-11-24T12:00:00Z');
const planet = (id: string) => PLANETS.find((body) => body.id === id)!;
// A duration in days as the table prints it: days, years, or h m s
const hms = (days: number) => {
  const seconds = Math.round(days * DAY);

  return `${Math.floor(seconds / 3600)} h ${Math.floor((seconds % 3600) / 60)} m ${seconds % 60} s`;
};
const inDays = (days: number) => `${days.toFixed(2)} days`;
const inYears = (days: number) => `${(days / 365.25).toFixed(2)} years`;
const clock = (hours: number) =>
  `${String(Math.floor(hours)).padStart(2, '0')}:${String(Math.floor((hours % 1) * 60)).padStart(2, '0')}`;
const has = (text: string) =>
  assert.ok(PAGE.includes(text), `the page should say "${text}"`);

describe('Learn: How long is a day on Mars?', () => {
  test('1. Earth turns in 23 h 56 m 4.1 s, and its day is 24 h', () => {
    const earth = planet('earth');
    const turn = earth.rotation!.period;
    const day = solarDayLength(turn.value, earth.orbit!.period.value);

    has(`{ value: ${turn.value}, unit: 'd' }`);
    assert.equal(hms(turn.value), '23 h 56 m 4 s');
    assert.equal(((turn.value * DAY) % 60).toFixed(1), '4.1');
    assert.equal(day.toFixed(4), '1.0000');
    // About a degree along the orbit a day, and 4 minutes more to turn
    assert.equal(Math.round(360 / earth.orbit!.period.value), 1);
    assert.equal(Math.round((day - turn.value) * 24 * 60), 4);
  });

  test('2. the table of worlds', () => {
    const rows: [string, string, string, string][] = [];

    for (const id of [
      'mercury',
      'venus',
      'earth',
      'mars',
      'jupiter',
      'saturn',
      'uranus',
      'neptune'
    ]) {
      const { name, rotation, orbit } = planet(id);
      const turn = rotation!.period.value;
      const year = orbit!.period.value;
      const day = solarDayLength(rotation!.retrograde ? -turn : turn, year);
      const short = turn < 2;
      const backwards = rotation!.retrograde ? ', backwards' : '';

      rows.push([
        name,
        (short ? hms(turn) : inDays(turn)) + backwards,
        year > 1000 ? inYears(year) : inDays(year),
        short ? hms(day) : inDays(day)
      ]);
    }

    const moon = MOONS.find(({ id }) => id === 'moon')!;
    const earthYear = planet('earth').orbit!.period.value;

    rows.push([
      'Moon',
      inDays(moon.rotation!.period.value),
      inDays(earthYear),
      inDays(solarDayLength(moon.rotation!.period.value, earthYear))
    ]);

    for (const cells of rows) {
      const row = new RegExp(
        `\\| ${cells.map((cell) => cell.replace(/[.()]/g, '\\$&')).join(' +\\| ')} +\\|`
      );

      assert.ok(row.test(PAGE), `the table should have: ${cells.join(' | ')}`);
    }
  });

  test('2. Mercury: three turns in two years, a day two years long', () => {
    const { rotation, orbit } = planet('mercury');
    const day = solarDayLength(rotation!.period.value, orbit!.period.value);

    assert.equal(
      ((2 * orbit!.period.value) / rotation!.period.value).toFixed(2),
      '3.00'
    );
    assert.equal(Math.round(day / orbit!.period.value), 2);
    assert.equal(Math.round(day), 176);
  });

  test('2. Venus: 117 days, fewer than two a year', () => {
    const { rotation, orbit } = planet('venus');
    const day = solarDayLength(-rotation!.period.value, orbit!.period.value);

    assert.equal(Math.round(day), 117);
    assert.equal(Math.round(rotation!.period.value), 243);
    assert.ok(orbit!.period.value / day < 2);
  });

  test('2. the Moon: a 29.5-day lunar day, two weeks of night', () => {
    const moon = MOONS.find(({ id }) => id === 'moon')!;
    const day = solarDayLength(
      moon.rotation!.period.value,
      planet('earth').orbit!.period.value
    );

    assert.equal(day.toFixed(1), '29.5');
    assert.equal(Math.round(day / 2 / 7), 2);
  });

  test('2. Saturn: 10 h 39 m by its radio period, 10 h 34 m by its rings', () => {
    assert.equal(
      hms(planet('saturn').rotation!.period.value).slice(0, 8),
      '10 h 39 '
    );
    // Mankovich et al. (2019): 10 h 33 m 38 s
    assert.equal(Math.round(33 + 38 / 60), 34);
  });

  test('3. the sol: 24 h 39 m 35.244 s, 40 minutes longer, Mars hours 2.7% longer', () => {
    assert.equal(MARS_SOL_SECONDS, 88_775.244);
    assert.equal(MARS_SOL_DAYS, 1.0274912517);
    assert.equal(Math.round(MARS_SOL_SECONDS / 24), 3699);
    assert.equal(hms(MARS_SOL_SECONDS / 24 / DAY), '1 h 1 m 39 s');
    assert.equal(Math.round((MARS_SOL_SECONDS - DAY) / 60), 40);
    assert.equal(((MARS_SOL_DAYS - 1) * 100).toFixed(1), '2.7');
  });

  test('4. on 24 November 2026: MSD 54 352.772, 18:31 at Airy-0, 03:41 in Gale, 23:41 in Jezero', () => {
    const mtc = coordinatedMarsTime(DATE);
    const gale = marsLocalMeanSolarTime(DATE, GALE);
    const jezero = marsLocalMeanSolarTime(DATE, JEZERO);

    assert.equal(marsSolDate(DATE).toFixed(3), '54352.772');
    assert.equal(mtc.toFixed(2), '18.53');
    assert.equal(clock(mtc), '18:31');
    assert.equal(gale.toFixed(2), '3.69');
    assert.equal(clock(gale), '03:41');
    assert.equal(jezero.toFixed(2), '23.69');
    assert.equal(clock(jezero), '23:41');
  });

  test('5. Curiosity on sol 5 084, Perseverance on sol 2 048, and the sols NASA dated', () => {
    const curiosity = new Date('2012-08-06T05:17:57Z');

    assert.equal(missionSol(DATE, curiosity, GALE), 5084);
    assert.equal(
      missionSol(DATE, new Date('2021-02-18T20:43:48.818Z'), JEZERO),
      2048
    );
    assert.equal(
      missionSol(new Date('2015-05-30T12:00:00Z'), curiosity, GALE),
      1000
    );
    assert.equal(
      missionSol(
        new Date('2018-06-10T12:00:00Z'),
        new Date('2004-01-25T04:55:00Z'),
        (354.47417 * DEG) as Radians,
        1
      ),
      5111
    );
    // More than 14 years after landing
    const years =
      (Date.parse('2018-06-10T12:00:00Z') -
        Date.parse('2004-01-25T04:55:00Z')) /
      (365.25 * DAY * 1000);

    assert.equal(Math.floor(years), 14);
  });
});
