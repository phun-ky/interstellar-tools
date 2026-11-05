import { WGS84 } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { SATELLITES } from '../satellites/dataset.js';
import { globeView, orbitPath3D } from '../satellites/globe.js';
import { groundTrack } from '../satellites/ground-track.js';
import { parseOmm } from '../satellites/omm.js';

// Every number in the tracking guide (docs/guide/usage/tracking.md), so the
// page can't drift from the code.

const satellite = (id: string) =>
  parseOmm(SATELLITES.find((entry) => entry.id === id)!.omm);
const iss = satellite('iss');
const goes19 = satellite('goes-19');
const R = WGS84.equatorialRadius.value;
const from = new Date('2026-11-05T00:00:00Z');
const to = new Date('2026-11-06T00:00:00Z');
const rounded = (point: readonly number[]) =>
  point.map((value) => Number(value.toFixed(3)) || 0);

describe('Tracking guide: satellites on a globe', () => {
  test('GOES-19 holds still Earth-fixed, and circles inertial', () => {
    const fixed = orbitPath3D(goes19, from, to, { step: 21_600, unit: R });
    const inertial = orbitPath3D(goes19, from, to, {
      step: 21_600,
      unit: R,
      frame: 'inertial'
    });

    assert.deepEqual(rounded(fixed[0]!), [1.688, -6.391, -0.001]);
    assert.deepEqual(rounded(fixed[1]!), [1.688, -6.392, 0]);
    assert.deepEqual(rounded(inertial[0]!), [5.668, -3.401, -0.001]);
    assert.deepEqual(rounded(inertial[1]!), [3.377, 5.684, 0]);
    // Above 75.2° W
    assert.equal(
      ((Math.atan2(fixed[0]![1], fixed[0]![0]) * 180) / Math.PI).toFixed(1),
      '-75.2'
    );
  });

  test('one ISS orbit on a globe centred on Oslo', () => {
    const later = new Date(from.getTime() + 92.95 * 60_000);
    const track = groundTrack(iss, from, later).flat();
    const view = globeView(track, 200, {
      phi0: 1.0456 as Radians,
      lambda0: 0.1876 as Radians
    });

    assert.equal(view.length, 94);
    assert.equal(view.filter(({ visible }) => visible).length, 48);
  });
});
