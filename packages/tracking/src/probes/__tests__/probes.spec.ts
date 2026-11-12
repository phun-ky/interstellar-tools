import {
  ASTEROIDS,
  AU_METERS,
  COMETS,
  MOONS,
  PLANETS,
  STARS
} from '@interstellar-tools/constants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { parseHorizonsVectors } from '../horizons.js';
import { stateAt } from '../interpolate.js';
import { PROBES } from '../probes.js';

const BODIES = new Set(
  [...STARS, ...PLANETS, ...MOONS, ...ASTEROIDS, ...COMETS].map(({ id }) => id)
);
// A body id, or a Lagrange point of two bodies, like 'sun-earth-l2'
const resolves = (reference: string) =>
  BODIES.has(reference) ||
  [...BODIES].some((primary) =>
    [...BODIES].some(
      (secondary) =>
        /^l[1-5]$/.test(reference.slice(`${primary}-${secondary}-`.length)) &&
        reference.startsWith(`${primary}-${secondary}-`)
    )
  );
const START = new Date('2026-11-01T00:00:00Z');
const END = new Date('2027-12-30T23:00:00Z');

describe('PROBES', () => {
  test('has unique kebab-case ids, and agencies, launch dates and Horizons ids', () => {
    const ids = PROBES.map(({ id }) => id);

    assert.ok(PROBES.length >= 10);
    assert.equal(new Set(ids).size, ids.length);

    for (const probe of PROBES) {
      assert.match(probe.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(probe.agencies.length > 0, probe.id);
      assert.match(probe.launch, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(new Date(`${probe.launch}T00:00:00Z`) < START, probe.id);
      assert.match(probe.horizonsId, /^-\d+$/);
    }
  });

  test('resolves every near and destination to a body or a Lagrange point', () => {
    assert.ok(resolves('sun-earth-l2'));
    assert.ok(!resolves('sun-earth-l6'));
    assert.ok(!resolves('vulcan'));

    for (const { id, near, destination } of PROBES) {
      assert.ok(resolves(near), `${id}: ${near}`);

      if (destination)
        assert.ok(resolves(destination), `${id}: ${destination}`);
    }
  });

  test('gives every probe an ephemeris from the Sun, from November 2026 through 2027', () => {
    for (const { id, horizonsId, ephemeris } of PROBES) {
      const { samples } = ephemeris;

      assert.equal(ephemeris.objectId, horizonsId, id);
      assert.equal(ephemeris.center, 'Sun');
      assert.equal(ephemeris.frame, 'ICRF');
      assert.equal(ephemeris.timeScale, 'TDB');
      assert.ok(samples[0]!.epoch <= START, id);
      assert.ok(samples[samples.length - 1]!.epoch >= END, id);
      samples.forEach((sample, k) =>
        assert.ok(k === 0 || sample.epoch > samples[k - 1]!.epoch, id)
      );
    }
  });

  test('matches Horizons every 30 days: exactly at its samples, within 1 000 km between', () => {
    for (const { id, ephemeris } of PROBES) {
      const horizons = parseHorizonsVectors(
        readFileSync(
          new URL(`fixtures/horizons-${id}-30d.txt`, import.meta.url),
          'utf8'
        )
      );

      assert.equal(horizons.objectId, ephemeris.objectId);

      for (const truth of horizons.samples) {
        const { r, v } = stateAt(ephemeris, truth.epoch);
        const off = Math.hypot(
          r[0] - truth.r[0],
          r[1] - truth.r[1],
          r[2] - truth.r[2]
        );
        const bundled = ephemeris.samples.some(
          ({ epoch }) => epoch.getTime() === truth.epoch.getTime()
        );

        // Stored to the metre and the micrometre per second
        assert.ok(off < (bundled ? 1 : 1_000_000), `${id}: ${off} m`);

        if (bundled)
          assert.ok(
            Math.hypot(
              v[0] - truth.v[0],
              v[1] - truth.v[1],
              v[2] - truth.v[2]
            ) < 1e-5,
            id
          );
      }
    }
  });

  test('follows Juno past Jupiter’s cloud tops within 1 000 km, every 10 minutes', () => {
    const juno = PROBES.find(({ id }) => id === 'juno')!;
    // Its perijove of 17 January 2027, 58 km/s from Jupiter
    const horizons = parseHorizonsVectors(
      readFileSync(
        new URL('fixtures/horizons-juno-perijove.txt', import.meta.url),
        'utf8'
      )
    );

    assert.equal(horizons.samples.length, 37);

    for (const truth of horizons.samples) {
      const { r } = stateAt(juno.ephemeris, truth.epoch);

      assert.ok(
        Math.hypot(r[0] - truth.r[0], r[1] - truth.r[1], r[2] - truth.r[2]) <
          1_000_000,
        truth.epoch.toISOString()
      );
    }
  });

  test('puts Voyager 1 172 au out, leaving at 17 km/s, and JWST beyond Earth', () => {
    const at = (id: string) =>
      stateAt(PROBES.find((probe) => probe.id === id)!.ephemeris, START);
    const voyager1 = at('voyager-1');

    assert.ok(Math.abs(Math.hypot(...voyager1.r) / AU_METERS - 172.2) < 0.1);
    assert.ok(Math.abs(Math.hypot(...voyager1.v) - 16_920) < 10);
    // Earth is 0.992 au from the Sun on 1 November, and JWST 0.01 au beyond
    assert.ok(
      Math.abs(Math.hypot(...at('jwst').r) / AU_METERS - 1.002) < 0.001
    );
  });
});
