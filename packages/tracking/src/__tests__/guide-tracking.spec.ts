import {
  AU_METERS,
  SPEED_OF_LIGHT_M_PER_S,
  WGS84
} from '@interstellar-tools/constants';
import {
  areTrojanPointsStable,
  eccentricToTrueAnomaly,
  elementsToState,
  greenwichMeanSiderealTime,
  hillSphereRadius,
  jacobiConstant,
  lagrangePoints,
  solveKepler,
  sunPosition
} from '@interstellar-tools/equations';
import { julianDate, taiMinusUtc } from '@interstellar-tools/temporal';
import type {
  Cr3bpState,
  EphemerisSampleInterface,
  GeodeticCoordinatesInterface,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { parseHorizonsVectors } from '../probes/horizons.js';
import { stateAt } from '../probes/interpolate.js';
import { parseOem } from '../probes/oem.js';
import { PROBES } from '../probes/probes.js';
import { SATELLITES } from '../satellites/dataset.js';
import { subSatellitePoint } from '../satellites/earth-fixed.js';
import { fitElements } from '../satellites/fit.js';
import { globeView, orbitPath3D } from '../satellites/globe.js';
import {
  coverageFootprint,
  footprintRadius,
  groundTrack
} from '../satellites/ground-track.js';
import { dopplerShift, lookAngles } from '../satellites/look-angles.js';
import { isVisiblePass, predictPasses } from '../satellites/passes.js';
import { parseOmm } from '../satellites/omm.js';
import { propagate } from '../satellites/propagate.js';
import { earthShadow } from '../satellites/shadow.js';
import { parseTle } from '../satellites/tle.js';

// Every number in the tracking guide (docs/guide/usage/tracking.md and the
// pages under docs/guide/usage/tracking/), so the pages can't drift from the
// code.

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const distance = (a: Vector3DTupleType, b: Vector3DTupleType) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const satellite = (id: string) =>
  parseOmm(SATELLITES.find((entry) => entry.id === id)!.omm);
const iss = satellite('iss');
const goes19 = satellite('goes-19');
const oslo: GeodeticCoordinatesInterface = {
  phi: toRad(59.91),
  lambda: toRad(10.75),
  h: 20
};
const date = new Date('2026-11-05T00:00:00Z');
const later = new Date('2026-11-06T00:00:00Z');
const R = WGS84.equatorialRadius.value;
const after = (from: Date, hours: number) =>
  new Date(from.getTime() + hours * 3_600_000);

describe('Tracking guide: time scales and sidereal time', () => {
  test('the clocks on 5 November 2026', () => {
    const utc = julianDate(date);

    assert.equal(utc, 2461349.5);
    assert.equal(taiMinusUtc(date), 37);
    assert.equal(
      ((julianDate(date, 'TT') - utc) * 86_400).toFixed(3),
      '69.184'
    );
    assert.equal(
      ((julianDate(date, 'TDB') - julianDate(date, 'TT')) * 86_400_000).toFixed(
        1
      ),
      '-1.4'
    );
    assert.equal(greenwichMeanSiderealTime(date).toFixed(4), '0.7721');
    assert.equal(toDeg(greenwichMeanSiderealTime(date)).toFixed(2), '44.24');
  });
});

describe('Tracking guide: satellites', () => {
  test('Kepler on mean elements is kilometres off SGP4', () => {
    const mu = 3.986004418e14;
    const a = Math.cbrt(mu / iss.meanMotion ** 2);
    const kepler = (hours: number) => {
      const M =
        (iss.meanAnomaly + iss.meanMotion * hours * 3600) % (2 * Math.PI);
      const nu = eccentricToTrueAnomaly(
        solveKepler(M as Radians, iss.e) as Radians,
        iss.e
      );

      return elementsToState(
        { a, e: iss.e, i: iss.i, raan: iss.raan, argp: iss.argp, nu },
        mu
      ).r;
    };
    const off = (hours: number) =>
      distance(kepler(hours), propagate(iss, after(iss.epoch, hours)).r) / 1000;

    assert.equal(off(0).toFixed(1), '11.7');
    assert.equal(off(1).toFixed(1), '15.1');
    assert.equal(Math.round(off(24)), 469);
  });

  test('two element sets 12 hours apart drift apart', () => {
    const older = parseTle(
      '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
      '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
    );
    const apart = (hours: number) => {
      const at = after(iss.epoch, hours);

      return distance(propagate(older, at).r, propagate(iss, at).r) / 1000;
    };

    assert.equal(
      Math.round((iss.epoch.getTime() - older.epoch.getTime()) / 3_600_000),
      12
    );
    assert.equal(apart(0).toFixed(2), '0.21');
    assert.equal(apart(24).toFixed(2), '0.50');
    assert.equal(apart(72).toFixed(2), '1.46');
  });

  test('where the ISS is', () => {
    const below = subSatellitePoint(iss, date);

    assert.equal(toDeg(below.phi).toFixed(2), '-51.01');
    assert.equal(toDeg(below.lambda).toFixed(2), '-157.48');
    assert.equal(group(below.h), '434 959');
  });

  test('passes over Oslo, look angles and the Doppler shift', () => {
    const passes = predictPasses(iss, oslo, date, later, {
      minElevation: toRad(10)
    });
    const atRise = lookAngles(iss, oslo, passes[0]!.rise);

    assert.equal(passes.length, 2);
    assert.equal(passes[0]!.rise.toISOString().slice(11, 16), '00:43');
    assert.equal(toDeg(passes[0]!.maxElevation).toFixed(1), '18.6');
    // In the south
    assert.equal(Math.round(toDeg(passes[0]!.culminationAzimuth)), 191);
    assert.equal(passes[1]!.rise.toISOString().slice(11, 16), '22:20');
    assert.equal(toDeg(passes[1]!.maxElevation).toFixed(1), '17.4');
    assert.equal(group(atRise.range / 1000), '1 508');
    assert.equal((atRise.rangeRate / 1000).toFixed(2), '-4.91');
    assert.equal(group(dopplerShift(145_800_000, atRise.rangeRate)), '2 389');
    assert.deepEqual(
      passes.map((pass) => isVisiblePass(iss, oslo, pass)),
      [false, false]
    );
  });

  test("the ISS in Earth's shadow for 36% of the day", () => {
    let umbra = 0;

    for (let s = 0; s < 86_400; s += 30) {
      const at = new Date(date.getTime() + s * 1000);

      if (earthShadow(propagate(iss, at).r, sunPosition(at).r) === 'umbra')
        umbra++;
    }

    assert.equal(Math.round((100 * umbra) / 2880), 36);
  });

  test('ground track and footprint', () => {
    const below = subSatellitePoint(iss, date);
    const horizon = footprintRadius(below.h);
    const tenDegrees = footprintRadius(below.h, toRad(10));

    assert.ok(groundTrack(iss, date, later).length > 1);
    assert.equal(coverageFootprint(below, toRad(10)).length, 72);
    assert.equal(horizon.toFixed(4), '0.3593');
    assert.equal(toDeg(horizon).toFixed(2), '20.58');
    assert.equal(group((horizon * R) / 1000), '2 291');
    assert.equal(tenDegrees.toFixed(4), '0.2232');
    assert.equal(toDeg(tenDegrees).toFixed(2), '12.79');
  });

  test('GOES-19 holds still Earth-fixed, and circles inertial', () => {
    const rounded = (point: readonly number[]) =>
      point.map((value) => Number(value.toFixed(3)) || 0);
    const fixed = orbitPath3D(goes19, date, later, { step: 21_600, unit: R });
    const inertial = orbitPath3D(goes19, date, later, {
      step: 21_600,
      unit: R,
      frame: 'inertial'
    });

    assert.deepEqual(rounded(fixed[0]!), [1.688, -6.391, -0.001]);
    assert.deepEqual(rounded(fixed[1]!), [1.688, -6.392, 0]);
    assert.deepEqual(rounded(inertial[0]!), [5.668, -3.401, -0.001]);
    assert.deepEqual(rounded(inertial[1]!), [3.377, 5.684, 0]);
    assert.equal(
      toDeg(Math.atan2(fixed[0]![1], fixed[0]![0])).toFixed(1),
      '-75.2'
    );
  });

  test('one ISS orbit on a globe centred on Oslo', () => {
    const orbit = new Date(date.getTime() + 92.95 * 60_000);
    const track = groundTrack(iss, date, orbit).flat();
    const view = globeView(track, 200, {
      phi0: oslo.phi,
      lambda0: oslo.lambda
    });

    assert.equal(view.length, 94);
    assert.equal(view.filter(({ visible }) => visible).length, 48);
  });

  test('fits elements to noisy positions to their noise, metres from the truth', () => {
    // Normally distributed noise, from a fixed seed
    let seed = 1;
    const uniform = () => {
      seed = (seed * 16_807) % 2_147_483_647;

      return seed / 2_147_483_647;
    };
    const gauss = () =>
      Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
    const states = Array.from(
      { length: (2 * 24 * 60) / 5 + 1 },
      (_, k): EphemerisSampleInterface => {
        const epoch = after(iss.epoch, k / 12);
        const { r, v } = propagate(iss, epoch);

        return {
          epoch,
          r: [r[0] + 10 * gauss(), r[1] + 10 * gauss(), r[2] + 10 * gauss()],
          v: [
            v[0] + 0.01 * gauss(),
            v[1] + 0.01 * gauss(),
            v[2] + 0.01 * gauss()
          ]
        };
      }
    );
    const fit = fitElements(states, states[states.length - 1]!.epoch);
    let farthest = 0;

    // Over the two days and the day after
    for (let hours = 0; hours <= 72; hours += 0.25) {
      const date = after(iss.epoch, hours);

      farthest = Math.max(
        farthest,
        distance(propagate(fit.elements, date).r, propagate(iss, date).r)
      );
    }

    assert.equal(fit.converged, true);
    assert.equal(fit.rms.position.toFixed(0), '18');
    assert.equal(Math.ceil(farthest), 6);
  });
});

describe('Tracking guide: probes', () => {
  const probe = (id: string) =>
    stateAt(PROBES.find((entry) => entry.id === id)!.ephemeris, date);

  test('where Voyager 1, New Horizons and JWST are', () => {
    const { r, v } = probe('voyager-1');

    assert.equal((Math.hypot(...r) / AU_METERS).toFixed(2), '172.26');
    assert.equal(
      (Math.hypot(...r) / SPEED_OF_LIGHT_M_PER_S / 3600).toFixed(2),
      '23.88'
    );
    assert.equal(group(Math.round(Math.hypot(...v) / 10) * 10), '16 920');
    assert.equal(
      (Math.hypot(...probe('new-horizons').r) / AU_METERS).toFixed(2),
      '65.99'
    );
    assert.equal(
      (Math.hypot(...probe('jwst').r) / AU_METERS).toFixed(2),
      '1.00'
    );
  });

  test('the OEM on the page, as one segment', () => {
    const [segment, ...rest] = parseOem(
      [
        'CCSDS_OEM_VERS = 3.0',
        'CREATION_DATE = 1996-11-04T17:22:31',
        'ORIGINATOR = NASA/JPL',
        '',
        'META_START',
        'OBJECT_NAME = MARS GLOBAL SURVEYOR',
        'OBJECT_ID = 1996-062A',
        'CENTER_NAME = MARS BARYCENTER',
        'REF_FRAME = EME2000',
        'TIME_SYSTEM = UTC',
        'START_TIME = 2019-12-18T12:00:00.331',
        'STOP_TIME = 2019-12-28T21:28:00.331',
        'META_STOP',
        '',
        '2019-12-18T12:00:00.331 2789.619 -280.045 -1746.755 4.73372 -2.49586 -1.04195',
        '2019-12-18T12:01:00.331 2783.419 -308.143 -1877.071 5.18604 -2.42124 -1.99608'
      ].join('\n')
    );

    assert.equal(rest.length, 0);
    assert.equal(segment!.objectName, 'MARS GLOBAL SURVEYOR');
    assert.equal(segment!.samples.length, 2);
  });

  test('Parker Solar Probe through perihelion, 137 km against 162 000 km', () => {
    const fixture = (name: string) =>
      parseHorizonsVectors(
        readFileSync(
          new URL(`../probes/__tests__/fixtures/${name}`, import.meta.url),
          'utf8'
        )
      );
    const coarse = fixture('horizons-psp-6h.txt');
    const truth = fixture('horizons-psp-1h.txt');

    let hermite = 0;
    let linear = 0;
    let closest = Infinity;

    for (const sample of truth.samples) {
      const t = sample.epoch.getTime();
      const next = coarse.samples.findIndex(
        ({ epoch }) => epoch.getTime() >= t
      );
      const a = coarse.samples[Math.max(next - 1, 0)]!;
      const b = coarse.samples[next]!;
      const f =
        a === b
          ? 0
          : (t - a.epoch.getTime()) / (b.epoch.getTime() - a.epoch.getTime());

      hermite = Math.max(
        hermite,
        distance(stateAt(coarse, sample.epoch).r, sample.r)
      );
      const straight: Vector3DTupleType = [
        a.r[0] + f * (b.r[0] - a.r[0]),
        a.r[1] + f * (b.r[1] - a.r[1]),
        a.r[2] + f * (b.r[2] - a.r[2])
      ];

      linear = Math.max(linear, distance(straight, sample.r));
      closest = Math.min(closest, Math.hypot(...sample.r));
    }

    assert.equal(Math.round(hermite / 1000), 137);
    assert.equal(group(Math.round(linear / 1e6) * 1000), '162 000');
    assert.equal(Math.round(closest / 1e9), 7);
  });
});

describe('Tracking guide: Lagrange points', () => {
  const GM_SUN = 1.32712440041e20;
  const GM_EARTH = 3.986004418e14;
  const GM_MOON = 4.9028e12;
  const GM_EARTH_MOON = 4.0350323e14;

  test('Sun-Earth L1 and L2, 1.5 million km from Earth', () => {
    const { L1, L2 } = lagrangePoints(GM_SUN, GM_EARTH_MOON, AU_METERS);
    const mu = GM_EARTH_MOON / (GM_SUN + GM_EARTH_MOON);
    const earth = (1 - mu) * AU_METERS;

    assert.equal(group((earth - L1[0]) / 1000), '1 497 621');
    assert.equal(group((L2[0] - earth) / 1000), '1 507 683');
  });

  test('Earth-Moon L1 and L2', () => {
    const { L1, L2 } = lagrangePoints(GM_EARTH, GM_MOON, 384_400_000);
    const earth = (-GM_MOON / (GM_EARTH + GM_MOON)) * 384_400_000;

    assert.equal(group((L1[0] - earth) / 1000), '326 381');
    assert.equal(group((L2[0] - earth) / 1000), '448 915');
  });

  test('Trojan points: stable for the Sun and Jupiter, not Pluto and Charon', () => {
    assert.equal(areTrojanPointsStable(GM_SUN, 1.26686534e17), true);
    assert.equal(
      (1.26686534e17 / (GM_SUN + 1.26686534e17)).toFixed(6),
      '0.000954'
    );
    assert.equal(areTrojanPointsStable(8.69e11, 1.06e11), false);
    assert.equal((1.06e11 / (8.69e11 + 1.06e11)).toFixed(2), '0.11');
  });

  test("Earth's Hill sphere, with the Moon a quarter of the way out", () => {
    const hill = hillSphereRadius(AU_METERS, 0.0167, GM_EARTH, GM_SUN);

    assert.equal(group(hill / 1000), '1 471 566');
    assert.equal(Math.round((4 * 384_400_000) / hill), 1);
  });

  test('the Jacobi constant at L1, L2 and L4 of Earth and the Moon', () => {
    const mu = 0.012150584;
    const { L1, L2, L4 } = lagrangePoints(1 - mu, mu, 1);
    const at = (x: number, y = 0) =>
      jacobiConstant([x, y, 0, 0, 0, 0] as unknown as Cr3bpState, mu);

    assert.equal(L1[0].toFixed(5), '0.83692');
    assert.equal(at(0.83692).toFixed(4), '3.1883');
    assert.equal(at(L2[0]).toFixed(4), '3.1722');
    assert.equal(at(L4[0], L4[1]).toFixed(3), '2.988');
  });
});
