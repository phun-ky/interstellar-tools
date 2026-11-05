import { AU_METERS } from '@interstellar-tools/constants';
import { lagrangePoints, sunPosition } from '@interstellar-tools/equations';
import type {
  GeodeticCoordinatesInterface,
  Radians
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { stateAt } from '../probes/interpolate.js';
import { PROBES } from '../probes/probes.js';
import { SATELLITES } from '../satellites/dataset.js';
import {
  subSatellitePoint,
  temeToEarthFixed
} from '../satellites/earth-fixed.js';
import { groundTrack } from '../satellites/ground-track.js';
import {
  lookAngles,
  lookAnglesFromEarthFixed
} from '../satellites/look-angles.js';
import { parseOmm } from '../satellites/omm.js';
import { isVisiblePass, predictPasses } from '../satellites/passes.js';
import { propagate } from '../satellites/propagate.js';
import { earthShadow } from '../satellites/shadow.js';

// The numbers in docs/learn/where-is-the-iss.md, and the equator crossings its
// <IssGroundTrack> widget labels. The snapshot's fixed epoch keeps them from
// going stale.

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const time = (date: Date) => date.toISOString().slice(11, 19);
const iss = parseOmm(SATELLITES.find(({ id }) => id === 'iss')!.omm);
const period = ((2 * Math.PI) / iss.meanMotion) * 1000;
const later = new Date(iss.epoch.getTime() + 3 * 86_400_000);
const nairobi: GeodeticCoordinatesInterface = {
  phi: toRad(-1.2864),
  lambda: toRad(36.8172),
  h: 1795
};
const sunElevation = (date: Date) =>
  lookAnglesFromEarthFixed(
    temeToEarthFixed({ r: sunPosition(date).r, v: [0, 0, 0] }, date),
    nairobi
  ).elevation;

describe('Where is the ISS? (tutorial)', () => {
  test('1. the elements and their date', () => {
    assert.equal(iss.epoch.toISOString(), '2026-11-04T21:15:15.205Z');
  });

  test('2. where it is at the epoch', () => {
    const { v } = propagate(iss, iss.epoch);
    const below = subSatellitePoint(iss, iss.epoch);
    const speed = Math.hypot(...v);

    assert.equal(group(Math.round(speed / 10) * 10), '7 670');
    assert.equal(group(Math.round((speed * 3.6) / 100) * 100), '27 600');
    assert.equal(Math.abs(toDeg(below.phi)).toFixed(2), '0.00');
    assert.equal(toDeg(below.lambda).toFixed(2), '-39.10');
    assert.equal((below.h / 1000).toFixed(1), '415.1');
    // Crossing the equator heading north
    assert.ok(
      subSatellitePoint(iss, new Date(iss.epoch.getTime() + 60_000)).phi > 0
    );
  });

  test('3. each orbit crosses the equator 23.6° west of the one before', () => {
    // As the widget finds them: northbound, between 30 s steps
    const step = 30_000;
    const times: Date[] = [];

    let t = iss.epoch.getTime() - step;
    let before = subSatellitePoint(iss, new Date(t)).phi;

    while (times.length < 4) {
      const after = subSatellitePoint(iss, new Date(t + step)).phi;

      if (before < 0 && after >= 0)
        times.push(new Date(t + (step * -before) / (after - before)));

      t += step;
      before = after;
    }

    const crossings = times.map((date) => subSatellitePoint(iss, date));
    const labels = crossings
      .slice(0, 3)
      .map(({ lambda }) => `${Math.abs(toDeg(lambda)).toFixed(1)}° W`);

    assert.equal((period / 60_000).toFixed(2), '92.95');
    assert.deepEqual(labels, ['39.1° W', '62.7° W', '86.3° W']);

    for (let k = 1; k < 4; k++) {
      assert.ok(Math.abs(toDeg(crossings[k]!.phi)) < 0.01);
      assert.equal(
        toDeg(crossings[k - 1]!.lambda - crossings[k]!.lambda).toFixed(1),
        '23.6'
      );
    }

    // Earth turns 23.3° in an orbit, and the orbit 0.3° west
    assert.equal(((360.9856 * period) / 86_400_000).toFixed(1), '23.3');
    assert.ok(groundTrack(iss, times[0]!, times[1]!, 30).length >= 1);
  });

  test('4. three of eight passes over Nairobi can be seen', () => {
    const passes = predictPasses(iss, nairobi, iss.epoch, later, {
      minElevation: toRad(10)
    });
    const visible = passes.filter((pass) => isVisiblePass(iss, nairobi, pass));
    const best = visible[0]!;

    assert.equal(passes.length, 8);
    assert.equal(visible.length, 3);
    assert.equal(best.rise.toISOString(), '2026-11-05T15:46:12.996Z');
    assert.equal(time(best.rise), '15:46:12');
    assert.equal(Math.round(toDeg(best.riseAzimuth)), 216); // south-west
    assert.equal(best.maxElevation.toFixed(3), '1.550');
    assert.equal(toDeg(best.maxElevation).toFixed(1), '88.8');
    assert.equal(time(best.culmination).slice(0, 5), '15:49'); // 18:49 local
    assert.equal(time(best.set), '15:52:50');
    assert.equal(Math.round(toDeg(best.setAzimuth)), 35); // north-east
    assert.equal(
      Math.round(lookAngles(iss, nairobi, best.culmination).range / 1000),
      413
    );
    // Six and a half minutes from rise to set
    close(best.set.getTime() - best.rise.getTime(), 6.5 * 60_000, 15_000);
    // The other two are low: before dawn and in the evening of 7 November
    assert.equal(toDeg(visible[1]!.maxElevation).toFixed(1), '18.6');
    assert.equal(toDeg(visible[2]!.maxElevation).toFixed(1), '15.5');
    assert.equal(visible[1]!.rise.toISOString().slice(0, 13), '2026-11-07T02');
    assert.equal(visible[2]!.rise.toISOString().slice(0, 13), '2026-11-07T15');
  });

  test('4. the Sun has set, and the ISS is still in sunlight', () => {
    const passes = predictPasses(iss, nairobi, iss.epoch, later, {
      minElevation: toRad(10)
    });
    const best = passes.find((pass) => isVisiblePass(iss, nairobi, pass))!;

    assert.equal(toDeg(sunElevation(best.culmination)).toFixed(1), '-7.6');

    // Sunset at 15:22 UTC, 18:22 in Nairobi: the Sun's upper edge, refracted
    let sunset = Date.parse('2026-11-05T15:00:00Z');

    while (toDeg(sunElevation(new Date(sunset))) > -0.833) sunset += 60_000;

    assert.equal(new Date(sunset).toISOString().slice(11, 16), '15:22');

    for (let t = best.rise.getTime(); t <= best.set.getTime(); t += 10_000) {
      const date = new Date(t);

      assert.notEqual(
        earthShadow(propagate(iss, date).r, sunPosition(date).r),
        'umbra'
      );
    }
  });

  test('6. Houston has three visible passes, all before dawn', () => {
    const houston = { phi: toRad(29.76), lambda: toRad(-95.37), h: 15 };
    const visible = predictPasses(iss, houston, iss.epoch, later, {
      minElevation: toRad(10)
    }).filter((pass) => isVisiblePass(iss, houston, pass));

    assert.equal(visible.length, 3);

    for (const { rise } of visible)
      // Central time, UTC − 6: between 04:00 and 06:00
      assert.ok(rise.getUTCHours() >= 10 && rise.getUTCHours() < 12);
  });

  test('5. JWST, 1.4 million km beyond Earth, near L2', () => {
    const jwst = PROBES.find(({ id }) => id === 'jwst')!;
    const { r } = stateAt(jwst.ephemeris, iss.epoch);
    const beyond = Math.hypot(...r) - sunPosition(iss.epoch).distance;
    const GM_SUN = 1.32712440041e20;
    const GM_EARTH_MOON = 4.0350323e14;
    const { L2 } = lagrangePoints(GM_SUN, GM_EARTH_MOON, AU_METERS);
    const mu = GM_EARTH_MOON / (GM_SUN + GM_EARTH_MOON);

    assert.equal(group(beyond / 1000), '1 424 580');
    assert.equal(group((L2[0] - (1 - mu) * AU_METERS) / 1000), '1 507 683');
  });
});

function close(actual: number, expected: number, tol: number) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
}
