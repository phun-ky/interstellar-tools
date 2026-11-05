import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { SATELLITES } from '../dataset.js';
import { parseOmm } from '../omm.js';
import { propagate } from '../propagate.js';

const MINUTE = 60_000;

describe('SATELLITES', () => {
  test('has about a dozen satellites, with unique kebab-case ids and catalogue numbers', () => {
    const ids = SATELLITES.map(({ id }) => id);
    const catalogNumbers = SATELLITES.map(({ omm }) => omm.NORAD_CAT_ID);

    assert.ok(SATELLITES.length >= 10 && SATELLITES.length <= 15);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(catalogNumbers).size, catalogNumbers.length);

    for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  test('parses every entry and propagates it at its epoch and a day later', () => {
    for (const { id, omm } of SATELLITES) {
      const elements = parseOmm(omm);

      assert.equal(elements.catalogNumber, omm.NORAD_CAT_ID, id);

      for (const minutes of [0, 1440]) {
        const { r, v } = propagate(
          elements,
          new Date(elements.epoch.getTime() + minutes * MINUTE)
        );
        const radius = Math.hypot(...r);

        // Above the atmosphere, and well inside the Moon's orbit
        assert.ok(
          radius > 6_500_000 && radius < 50_000_000,
          `${id}: ${radius}`
        );
        assert.ok(Math.hypot(...v) > 1000, id);
      }
    }
  });

  test('puts each satellite in the orbit regime it is listed in', () => {
    for (const { id, regime, omm } of SATELLITES) {
      const minutes = 1440 / omm.MEAN_MOTION;
      const e = omm.ECCENTRICITY;
      const actual =
        e > 0.25
          ? 'HEO'
          : minutes < 128
            ? 'LEO'
            : Math.abs(minutes - 1436) < 10 && e < 0.01 && omm.INCLINATION < 15
              ? 'GEO'
              : 'MEO';

      assert.equal(regime, actual, id);
    }
  });

  test('covers every regime, so SGP4 and SDP4 are both exercised', () => {
    assert.deepEqual(
      [...new Set(SATELLITES.map(({ regime }) => regime))].sort(),
      ['GEO', 'HEO', 'LEO', 'MEO']
    );
    // SDP4 takes over from 225 minutes
    assert.ok(SATELLITES.some(({ omm }) => 1440 / omm.MEAN_MOTION < 225));
    assert.ok(SATELLITES.some(({ omm }) => 1440 / omm.MEAN_MOTION >= 225));
  });

  test('dates every entry in the snapshot', () => {
    for (const { id, omm } of SATELLITES)
      assert.ok(
        omm.EPOCH >= '2026-11-01' && omm.EPOCH < '2026-11-06',
        `${id}: ${omm.EPOCH}`
      );
  });
});
