import {
  GALAXIES,
  SUN_GALACTOCENTRIC_DISTANCE,
  SUN_HEIGHT_ABOVE_GALACTIC_PLANE
} from '@interstellar-tools/constants';
import type { DegreesType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { equatorialToGalactic } from '../categories/galactic/equatorial-to-galactic.js';
import { galacticToEquatorial } from '../categories/galactic/galactic-to-equatorial.js';
import { galactocentricPosition } from '../categories/galactic/galactocentric-position.js';
import { galactocentricToGalactic } from '../categories/galactic/galactocentric-to-galactic.js';
import { convertDistanceUnit } from '../categories/helpers/convert-distance-unit.js';

// Every number in the galaxies-in-3D guide
// (docs/guide/usage/equations/galaxies-in-3d.md), so the page can't drift from
// the code.

const PAGE = readFileSync(
  new URL(
    '../../../../docs/guide/usage/equations/galaxies-in-3d.md',
    import.meta.url
  ),
  'utf8'
);
const onPage = (text: string) =>
  assert.ok(PAGE.includes(text), `the page should have: ${text}`);
const here = { l: 0 as DegreesType, b: 0 as DegreesType };
// The page writes minus signs as −
const fixed = (value: number) => value.toFixed(2).replace('-', '−');
const NAMES: Record<string, string> = {
  'milky-way': 'Milky Way (the Sun)',
  andromeda: 'Andromeda',
  triangulum: 'Triangulum',
  'large-magellanic-cloud': 'Large Magellanic Cloud',
  'small-magellanic-cloud': 'Small Magellanic Cloud',
  'sagittarius-dwarf': 'Sagittarius dwarf',
  m87: 'M87',
  'centaurus-a': 'Centaurus A'
};

describe('Galaxies in 3D guide', () => {
  test('where Andromeda is', () => {
    const andromeda = GALAXIES.find(({ id }) => id === 'andromeda')!;
    const { x, y, z } = galactocentricPosition(
      andromeda.direction!,
      andromeda.distance,
      { unit: 'kpc' }
    );
    const position = [x.value, y.value, z.value];

    assert.deepEqual(
      position.map((value) => value.toFixed(2)),
      ['-375.31', '605.50', '-278.87']
    );
    onPage('[-375.31, 605.50, -278.87] kpc');
    onPage(`${Math.hypot(...position).toFixed(2)} kpc`);
    onPage(
      `Andromeda is ${convertDistanceUnit(andromeda.distance, 'kpc').value.toFixed(2)} kpc from the Sun, and ${Math.hypot(...position).toFixed(2)} kpc`
    );
  });

  test('the Sun’s place, and the tilt of the plane', () => {
    const sun = galactocentricPosition(here, { value: 0, unit: 'pc' });
    const tilt =
      (Math.asin(
        SUN_HEIGHT_ABOVE_GALACTIC_PLANE.value /
          SUN_GALACTOCENTRIC_DISTANCE.value
      ) *
        180) /
      Math.PI;

    onPage(
      `[${[sun.x, sun.y, sun.z].map(({ value }) => value.toFixed(2)).join(', ')}] pc`
    );
    onPage(`${SUN_GALACTOCENTRIC_DISTANCE.value} pc from the centre`);
    onPage(`${SUN_HEIGHT_ABOVE_GALACTIC_PLANE.value} pc above the plane`);
    onPage(`${tilt.toFixed(3)}°`);
  });

  test('Sagittarius A* is 10.5 pc from the origin', () => {
    // Sagittarius A*: l 359.9443°, b −0.0462° (Reid & Brunthaler 2004)
    const { x, y, z } = galactocentricPosition(
      { l: 359.9443 as DegreesType, b: -0.0462 as DegreesType },
      SUN_GALACTOCENTRIC_DISTANCE
    );

    assert.equal(Math.hypot(x.value, y.value, z.value).toFixed(1), '10.5');
    onPage('10.5 pc from the origin');
  });

  test('from a catalogue, and back to the sky', () => {
    const andromeda = equatorialToGalactic({
      rightAscension: 10.68479292 as DegreesType,
      declination: 41.269065 as DegreesType
    });
    const stored = GALAXIES.find(({ id }) => id === 'andromeda')!.direction!;
    const centre = galacticToEquatorial(here);

    assert.equal(andromeda.l.toFixed(4), stored.l.toFixed(4));
    assert.equal(andromeda.b.toFixed(4), stored.b.toFixed(4));
    onPage(`[${andromeda.l.toFixed(4)}, ${andromeda.b.toFixed(4)}]`);
    onPage(
      `[${centre.rightAscension.toFixed(4)}, ${centre.declination.toFixed(4)}]`
    );
  });

  test('back from a position', () => {
    const { direction, distance } = galactocentricToGalactic({
      frame: 'galactocentric',
      x: { value: 0, unit: 'pc' },
      y: { value: 0, unit: 'pc' },
      z: { value: 0, unit: 'pc' }
    });

    onPage(`[${direction.l}, ${direction.b}, ${distance.value}] pc`);
  });

  test('every galaxy’s row in the table', () => {
    const rows = PAGE.split('\n').filter((line) => line.startsWith('| '));

    for (const { id, direction, distance } of GALAXIES) {
      const { x, y, z } = galactocentricPosition(
        direction ?? here,
        direction ? distance : { value: 0, unit: 'ly' },
        { unit: 'kpc' }
      );
      const cells = [
        x.value,
        y.value,
        z.value,
        convertDistanceUnit(distance, 'kpc').value,
        Math.hypot(x.value, y.value, z.value)
      ].map(fixed);
      const row = rows.find((line) => line.startsWith(`| ${NAMES[id]} `));

      assert.ok(row, `a row for ${id}`);
      assert.deepEqual(
        row
          .split('|')
          .slice(2, -1)
          .map((cell) => cell.trim()),
        cells,
        id
      );
    }
  });
});
