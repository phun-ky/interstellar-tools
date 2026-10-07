import type {
  AsteroidInterface,
  CometInterface,
  MoonInterface,
  PlanetInterface,
  StarInterface
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  ASTEROID_BELTS,
  ASTEROIDS,
  COMETS,
  GALAXIES,
  MOONS,
  PLANETS,
  STARS,
  SYSTEMS
} from '../../index.js';

type MeasureType = { value: number; unit: string };
type BodyType =
  | PlanetInterface
  | MoonInterface
  | StarInterface
  | CometInterface
  | AsteroidInterface;

// Hex (#rrggbb) or a single-word CSS named color such as 'blue'
const COLOR = /^(#[0-9a-f]{6}|[a-z]+)$/i;

const ORBITING: Record<string, { bodies: BodyType[]; units: Record<string, string> }> = {
  PLANETS: {
    bodies: PLANETS,
    units: { a: 'au', radius: 'km', period: 'd', x: 'au', y: 'au', z: 'au' }
  },
  MOONS: { bodies: MOONS, units: { a: 'au', radius: 'km', period: 'd' } },
  STARS: {
    bodies: STARS,
    units: { a: 'ly', radius: 'km', period: 'Myr', x: 'ly', y: 'ly', z: 'ly' }
  },
  COMETS: { bodies: COMETS, units: { a: 'au', radius: 'km', period: 'd' } },
  ASTEROIDS: { bodies: ASTEROIDS, units: { a: 'au', radius: 'km', period: 'd' } }
};

const measure = (body: BodyType, field: string) =>
  (body as unknown as Record<string, MeasureType>)[field];

const assertUniqueNames = (label: string, names: string[]) => {
  const duplicates = names.filter((name, i) => names.indexOf(name) !== i);

  assert.deepEqual(duplicates, [], `${label} has duplicate names`);
};

for (const [label, { bodies, units }] of Object.entries(ORBITING)) {
  describe(label, () => {
    test('is non-empty with unique, non-empty names', () => {
      assert.ok(bodies.length > 0);

      for (const body of bodies) assert.ok(body.name.trim().length > 0);

      assertUniqueNames(label, bodies.map((body) => body.name));
    });

    test('uses the documented unit for every measured field', () => {
      for (const body of bodies) {
        for (const [field, unit] of Object.entries(units)) {
          const { value, unit: actual } = measure(body, field);

          assert.equal(actual, unit, `${body.name}.${field}`);
          assert.ok(Number.isFinite(value), `${body.name}.${field} = ${value}`);
        }
      }
    });

    test('has physically valid orbital and size values', () => {
      for (const body of bodies) {
        assert.ok(body.e >= 0 && body.e < 1, `${body.name}.e = ${body.e}`);
        assert.ok(measure(body, 'a').value > 0, `${body.name}.a`);
        assert.ok(measure(body, 'radius').value > 0, `${body.name}.radius`);
        assert.notEqual(measure(body, 'period').value, 0, `${body.name}.period`);

        if (body.angle !== undefined) {
          assert.ok(
            body.angle >= 0 && body.angle < 2 * Math.PI,
            `${body.name}.angle = ${body.angle}`
          );
        }
      }
    });

    test('has a valid color', () => {
      for (const body of bodies) {
        assert.match(body.color, COLOR, `${body.name}.color`);
      }
    });
  });
}

describe('heliocentric orbits', () => {
  // Kepler's third law around the Sun: P [d] ≈ 365.25 × a [au]^1.5
  test('period matches the semi-major axis (Kepler III, within 2 %)', () => {
    for (const body of [...PLANETS, ...COMETS, ...ASTEROIDS]) {
      const a = body.a.value;
      const period = Math.abs(body.period.value);
      const expected = 365.25 * a ** 1.5;

      assert.ok(
        Math.abs(period / expected - 1) < 0.02,
        `${body.name}: |period| ${period} d, expected ≈ ${expected.toFixed(0)} d from a = ${a} au`
      );
    }
  });

  test('perihelion distance matches q = a(1 − e) (within 3 %)', () => {
    for (const body of [...COMETS, ...ASTEROIDS]) {
      const expected = body.a.value * (1 - body.e);

      assert.ok(
        Math.abs(body.q / expected - 1) < 0.03,
        `${body.name}: q = ${body.q} au, a(1 − e) = ${expected.toFixed(4)} au`
      );
    }
  });

  // Negative period = counter-clockwise (prograde), positive = retrograde
  test('period sign matches orbit direction (i > 90° is retrograde)', () => {
    for (const body of [...COMETS, ...ASTEROIDS]) {
      assert.equal(
        body.period.value > 0,
        body.i > 90,
        `${body.name}: i = ${body.i}°, period = ${body.period.value}`
      );
    }
  });
});

describe('moons', () => {
  test('orbit a planet in PLANETS', () => {
    const planets = new Set(PLANETS.map((planet) => planet.name));

    for (const moon of MOONS) {
      assert.ok(planets.has(moon.system), `${moon.name} orbits ${moon.system}`);
    }
  });

  test('retrograde moons have a positive period, regular moons a negative one', () => {
    for (const moon of MOONS) {
      if (moon.category === 'retrograde satellite') {
        assert.ok(moon.period.value > 0, `${moon.name} is retrograde`);
      }

      if (moon.category === 'natural satellite') {
        assert.ok(moon.period.value < 0, `${moon.name} is prograde`);
      }
    }
  });
});

describe('planets', () => {
  test('orbit a star in STARS', () => {
    const stars = new Set(STARS.map((star) => star.name));

    for (const planet of PLANETS) {
      assert.ok(stars.has(planet.system), `${planet.name} orbits ${planet.system}`);
    }
  });
});

describe('SYSTEMS', () => {
  test('have unique names and non-negative distances', () => {
    assertUniqueNames('SYSTEMS', SYSTEMS.map((system) => system.name));

    for (const system of SYSTEMS) {
      assert.ok(system.distance >= 0, `${system.name}.distance`);
      assert.ok(system.stars.length > 0, `${system.name}.stars`);
    }
  });

  test('list stars that exist in STARS and belong to the system', () => {
    for (const system of SYSTEMS) {
      for (const name of system.stars) {
        const star = STARS.find((candidate) => candidate.name === name);

        assert.ok(star, `${system.name}: ${name} is missing from STARS`);
        assert.equal(star.system.name, system.name, `${name}.system`);
      }
    }
  });
});

describe('GALAXIES', () => {
  test('have unique names and valid sizes', () => {
    assertUniqueNames('GALAXIES', GALAXIES.map((galaxy) => galaxy.name));

    for (const galaxy of GALAXIES) {
      assert.ok(galaxy.diameter.value > 0, `${galaxy.name}.diameter`);
      assert.ok(galaxy.distance.value >= 0, `${galaxy.name}.distance`);
      assert.ok(galaxy.blackHole.mass > 0, `${galaxy.name}.blackHole.mass`);
      assert.ok(galaxy.blackHole.radius.value > 0, `${galaxy.name}.blackHole.radius`);
    }
  });
});

describe('ASTEROID_BELTS', () => {
  test('have unique names, ordered radii and valid opacity', () => {
    assertUniqueNames('ASTEROID_BELTS', ASTEROID_BELTS.map((belt) => belt.name));

    for (const belt of ASTEROID_BELTS) {
      assert.ok(belt.innerRadius > 0, `${belt.name}.innerRadius`);
      assert.ok(belt.innerRadius < belt.outerRadius, `${belt.name} radii`);
      assert.ok(belt.opacity >= 0 && belt.opacity <= 1, `${belt.name}.opacity`);
      assert.ok(belt.density >= 0, `${belt.name}.density`);
      assert.match(belt.color, COLOR, `${belt.name}.color`);
    }
  });
});
