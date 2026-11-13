import type { DisplayInterface } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import {
  DISCOVERIES,
  HELIOSPHERE,
  HELIOSPHERE_DISPLAY,
  INTERSTELLAR_OBJECT_OBSERVATIONS,
  INTERSTELLAR_OBJECTS,
  MOON_RING_ROLES,
  MOONS,
  PLANET_RINGS,
  PLANETS,
  RING_DISPLAY,
  STAR_ASTROMETRY,
  STAR_PARAMETERS,
  STARS,
  withDisplay,
  withObservations
} from '../../index.js';

const ids = (bodies: readonly { id: string }[]) =>
  new Set(bodies.map(({ id }) => id));
const find = <B extends { id: string }>(bodies: readonly B[], id: string) =>
  bodies.find((body) => body.id === id)!;

describe('observation groups', () => {
  test('key each group by the ids of its dataset’s bodies', () => {
    for (const [group, bodies] of [
      [STAR_PARAMETERS, STARS],
      [STAR_ASTROMETRY, STARS],
      [PLANET_RINGS, PLANETS],
      [RING_DISPLAY, PLANETS],
      [MOON_RING_ROLES, MOONS],
      [INTERSTELLAR_OBJECT_OBSERVATIONS, INTERSTELLAR_OBJECTS],
      [DISCOVERIES, INTERSTELLAR_OBJECTS]
    ] as const) {
      const known = ids(bodies);

      for (const id of Object.keys(group)) assert.ok(known.has(id), id);
    }
  });

  test('go back on the bodies, value for value, with withObservations and withDisplay', () => {
    const stars = withDisplay(
      withObservations(STARS, STAR_PARAMETERS, STAR_ASTROMETRY, {
        sun: { astrosphere: HELIOSPHERE }
      }),
      { sun: { astrosphere: HELIOSPHERE_DISPLAY } }
    );
    const planets = withDisplay(
      withObservations(PLANETS, PLANET_RINGS),
      RING_DISPLAY
    );
    const moons = withObservations(MOONS, MOON_RING_ROLES);
    const objects = withObservations(
      INTERSTELLAR_OBJECTS,
      INTERSTELLAR_OBJECT_OBSERVATIONS,
      DISCOVERIES
    );

    for (const [id, parameters] of Object.entries(STAR_PARAMETERS))
      for (const [field, value] of Object.entries(parameters))
        assert.equal(
          (find(stars, id).observations as Record<string, unknown>)[field],
          value,
          `${id}.${field}`
        );

    for (const [id, astrometry] of Object.entries(STAR_ASTROMETRY))
      for (const [field, value] of Object.entries(astrometry))
        assert.equal(
          (find(stars, id).observations as Record<string, unknown>)[field],
          value,
          `${id}.${field}`
        );

    for (const [id, { rings }] of Object.entries(PLANET_RINGS))
      assert.equal(find(planets, id).observations?.rings, rings, id);

    for (const [id, { rings }] of Object.entries(RING_DISPLAY))
      assert.equal(find(planets, id).display?.rings, rings, id);

    for (const [id, { ringInteraction }] of Object.entries(MOON_RING_ROLES))
      assert.equal(
        find(moons, id).observations?.ringInteraction,
        ringInteraction,
        id
      );

    for (const [id, { discovery }] of Object.entries(DISCOVERIES))
      assert.equal(find(objects, id).observations?.discovery, discovery, id);

    const sun = find(stars, 'sun');

    assert.equal(sun.observations?.astrosphere, HELIOSPHERE);
    assert.equal(sun.display?.astrosphere, HELIOSPHERE_DISPLAY);
  });

  test('split the interstellar objects’ discoveries from the rest', () => {
    for (const [id, observations] of Object.entries(
      INTERSTELLAR_OBJECT_OBSERVATIONS
    )) {
      assert.ok(!('discovery' in observations), id);
      assert.ok(DISCOVERIES[id]?.discovery.date instanceof Date, id);
    }
  });
});

describe('each group’s module', () => {
  // An app that imports one group loads only that module: it may lean on the
  // shared source helpers, but never on a dataset or another group
  test('imports no dataset and no other group', () => {
    for (const file of [
      'star-parameters',
      'star-astrometry',
      'heliosphere',
      'rings',
      'ring-display',
      'moon-ring-roles',
      'interstellar-observations',
      'discoveries'
    ]) {
      const source = readFileSync(
        new URL(`../${file}.ts`, import.meta.url),
        'utf8'
      );
      const local = [...source.matchAll(/from '(\.[^']+)'/g)].map(
        ([, path]) => path
      );

      assert.deepEqual(
        local.filter((path) => path !== './sources.js'),
        [],
        file
      );
    }
  });
});

describe('withObservations and withDisplay', () => {
  const bodies = [
    { id: 'a', observations: { kept: 1 } },
    { id: 'b' },
    { id: 'toString' }
  ];

  test('merge each body’s entries into a copy, and leave the rest as they are', () => {
    const merged = withObservations(
      bodies as { id: string; observations?: Record<string, number> }[],
      { a: { added: 2 } },
      { a: { added: 3, more: 4 } }
    );

    // Later groups win, and the body's own observations stay
    assert.deepEqual(merged[0], {
      id: 'a',
      observations: { kept: 1, added: 3, more: 4 }
    });
    assert.deepEqual(bodies[0], { id: 'a', observations: { kept: 1 } });
    assert.equal(merged[1], bodies[1]);
    // An id that names an inherited property isn't looked up on the prototype
    assert.equal(merged[2], bodies[2]);
  });

  test('put a drawing group beside a body’s colour', () => {
    const [saturn] = withDisplay(
      [{ id: 'saturn', display: { color: '#D2B48C' } }] as {
        id: string;
        display: DisplayInterface;
      }[],
      RING_DISPLAY
    );

    assert.equal(saturn!.display.color, '#D2B48C');
    assert.equal(saturn!.display.rings, RING_DISPLAY.saturn!.rings);
  });
});
