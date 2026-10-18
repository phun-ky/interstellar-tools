import type {
  AsteroidInterface,
  CometInterface,
  MoonInterface,
  OrbitInterface,
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
type OrbitingType = {
  id: string;
  name: string;
  parent?: string;
  orbit?: OrbitInterface;
  mass?: number;
};
type BodyType =
  | PlanetInterface
  | MoonInterface
  | StarInterface
  | CometInterface
  | AsteroidInterface;

// Hex (#rrggbb) or a single-word CSS named color such as 'blue'
const COLOR = /^(#[0-9a-f]{6}|[a-z]+)$/i;
// Lowercase kebab-case, e.g. 'alpha-centauri-ab' or '67p-churyumov-gerasimenko'
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TWO_PI = 2 * Math.PI;

const ORBITING: Record<
  string,
  { bodies: BodyType[]; units: Record<string, string> }
> = {
  PLANETS: {
    bodies: PLANETS,
    units: { a: 'au', period: 'd', radius: 'km', x: 'au', y: 'au', z: 'au' }
  },
  MOONS: { bodies: MOONS, units: { a: 'au', period: 'd', radius: 'km' } },
  STARS: { bodies: STARS, units: { radius: 'km' } },
  COMETS: { bodies: COMETS, units: { a: 'au', period: 'd', radius: 'km' } },
  ASTEROIDS: {
    bodies: ASTEROIDS,
    units: { a: 'au', period: 'd', radius: 'km' }
  }
};

const GALAXY_IDS = new Set(GALAXIES.map((galaxy) => galaxy.id));
const SYSTEM_IDS = new Set(SYSTEMS.map((system) => system.id));
const STAR_IDS = new Set(STARS.map((star) => star.id));
const PLANET_IDS = new Set(PLANETS.map((planet) => planet.id));
const NODES: OrbitingType[] = [...SYSTEMS, ...STARS, ...PLANETS, ...MOONS];
const NODE_BY_ID = new Map(NODES.map((node) => [node.id, node]));

// Orbit fields live in `orbit`; everything else on the body itself
const measure = (body: BodyType, field: string) =>
  field === 'a' || field === 'period'
    ? (body.orbit as unknown as Record<string, MeasureType>)[field]
    : (body as unknown as Record<string, MeasureType>)[field];

const assertUnique = (label: string, values: string[]) => {
  const duplicates = values.filter((value, i) => values.indexOf(value) !== i);

  assert.deepEqual(duplicates, [], `${label} has duplicates`);
};

const assertValidOrbit = (name: string, orbit: OrbitInterface) => {
  assert.ok(orbit.e >= 0 && orbit.e < 1, `${name}.orbit.e = ${orbit.e}`);
  assert.ok(orbit.a.value > 0, `${name}.orbit.a`);
  assert.notEqual(orbit.period.value, 0, `${name}.orbit.period`);
  assert.ok(
    orbit.angle >= 0 && orbit.angle < TWO_PI,
    `${name}.orbit.angle = ${orbit.angle}`
  );
};

// Total mass of a star or system in M☉, summing a system's members
const massOf = (node: OrbitingType): number =>
  node.mass ??
  NODES.filter((child) => child.parent === node.id).reduce(
    (sum, child) => sum + massOf(child),
    0
  );

const toUnit = (value: number, unit: string, units: Record<string, number>) =>
  value * units[unit];

for (const [label, { bodies, units }] of Object.entries(ORBITING)) {
  describe(label, () => {
    test('is non-empty with unique, non-empty names and ids', () => {
      assert.ok(bodies.length > 0);

      for (const body of bodies) {
        assert.ok(body.name.trim().length > 0);
        assert.match(body.id, ID, `${body.name}.id`);
      }

      assertUnique(
        label,
        bodies.map((body) => body.name)
      );
      assertUnique(
        label,
        bodies.map((body) => body.id)
      );
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
        if (body.orbit) assertValidOrbit(body.name, body.orbit);

        assert.ok(measure(body, 'radius').value > 0, `${body.name}.radius`);
      }
    });

    test('has a valid color', () => {
      for (const body of bodies) {
        assert.match(body.color, COLOR, `${body.name}.color`);
      }
    });
  });
}

describe('ids', () => {
  test('are unique across all datasets', () => {
    assertUnique('ids', [
      ...GALAXIES.map((galaxy) => galaxy.id),
      ...ASTEROID_BELTS.map((belt) => belt.id),
      ...NODES.map((node) => node.id),
      ...COMETS.map((comet) => comet.id),
      ...ASTEROIDS.map((asteroid) => asteroid.id)
    ]);
  });
});

describe('parents', () => {
  const assertParentIn = (
    bodies: { name: string; parent?: string }[],
    ids: Set<string>,
    kind: string
  ) => {
    for (const body of bodies) {
      assert.ok(
        body.parent !== undefined && ids.has(body.parent),
        `${body.name}: parent ${body.parent} is not a ${kind}`
      );
    }
  };

  test('moons orbit a planet', () => {
    assertParentIn(MOONS, PLANET_IDS, 'planet in PLANETS');
  });

  test('planets, comets, asteroids and belts orbit a star', () => {
    assertParentIn(
      [...PLANETS, ...COMETS, ...ASTEROIDS, ...ASTEROID_BELTS],
      STAR_IDS,
      'star in STARS'
    );
  });

  test('stars and systems are bound to a system or a galaxy', () => {
    assertParentIn(
      [...STARS, ...SYSTEMS],
      new Set([...SYSTEM_IDS, ...GALAXY_IDS]),
      'system or galaxy'
    );
  });

  test('every chain of parents ends at a galaxy, without cycles', () => {
    for (const node of NODES) {
      const seen = new Set<string>();
      let id = node.id;

      while (!GALAXY_IDS.has(id)) {
        assert.ok(!seen.has(id), `${node.name}: cycle at ${id}`);
        seen.add(id);

        const parent = NODE_BY_ID.get(id)?.parent;

        assert.ok(parent, `${node.name}: ${id} has no parent`);
        id = parent;
      }
    }
  });
});

describe('heliocentric orbits', () => {
  const heliocentric = [...PLANETS, ...COMETS, ...ASTEROIDS].filter(
    (body) => body.parent === 'sun'
  );

  // Kepler's third law around the Sun: P [d] ≈ 365.25 × a [au]^1.5
  test('period matches the semi-major axis (Kepler III, within 2 %)', () => {
    for (const body of heliocentric) {
      const a = body.orbit!.a.value;
      const period = Math.abs(body.orbit!.period.value);
      const expected = 365.25 * a ** 1.5;

      assert.ok(
        Math.abs(period / expected - 1) < 0.02,
        `${body.name}: |period| ${period} d, expected ≈ ${expected.toFixed(0)} d from a = ${a} au`
      );
    }
  });

  test('perihelion distance matches q = a(1 − e) (within 3 %)', () => {
    for (const { name, orbit } of [...COMETS, ...ASTEROIDS]) {
      const expected = orbit.a.value * (1 - orbit.e);

      assert.ok(
        Math.abs(orbit.q / expected - 1) < 0.03,
        `${name}: q = ${orbit.q} au, a(1 − e) = ${expected.toFixed(4)} au`
      );
    }
  });

  // Negative period = counter-clockwise (prograde), positive = retrograde
  test('period sign matches orbit direction (i > 90° is retrograde)', () => {
    for (const { name, orbit } of [...COMETS, ...ASTEROIDS]) {
      assert.equal(
        orbit.period.value > 0,
        orbit.i > 90,
        `${name}: i = ${orbit.i}°, period = ${orbit.period.value}`
      );
    }
  });
});

describe('planet positions at J2000', () => {
  // r = a(1 − e²) / (1 + e cos ν): the position and the angle describe the same
  // point on the same orbit
  test('x, y, z lie on the orbit at orbit.angle (conic equation, within 0.1 %)', () => {
    for (const { name, orbit, x, y, z } of PLANETS) {
      const { a, e, angle } = orbit!;
      const expected = (a.value * (1 - e ** 2)) / (1 + e * Math.cos(angle));
      const r = Math.hypot(x.value, y.value, z.value);

      assert.ok(
        Math.abs(r / expected - 1) < 0.001,
        `${name}: |x, y, z| = ${r.toFixed(4)} au, orbit at ν = ${angle} gives ${expected.toFixed(4)} au`
      );
    }
  });

  test('Earth is 0.983 au from the Sun, 2.5 days before perihelion', () => {
    const { orbit, x, y, z } = PLANETS.find((planet) => planet.id === 'earth')!;
    const { e, angle, period } = orbit!;
    // True to mean anomaly, in closed form
    const E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(angle / 2));
    const M = (E - e * Math.sin(E) + 2 * Math.PI) % (2 * Math.PI);
    const daysToPerihelion =
      ((2 * Math.PI - M) / (2 * Math.PI)) * Math.abs(period.value);

    assert.equal(Math.hypot(x.value, y.value, z.value).toFixed(3), '0.983');
    assert.equal(daysToPerihelion.toFixed(1), '2.5');
  });
});

describe('comet positions at J2000', () => {
  // Perihelion passages nearest J2000 (JD 2451545.0), from the osculating
  // elements at J2000 in JPL Horizons: days before J2000, or after if negative
  const PERIHELION_DAYS_BEFORE_J2000: Record<string, number> = {
    '1p-halley': 5068.81, // 1986-02-14
    'c-1995-o1-hale-bopp': 1005.5, // 1997-04-01
    '67p-churyumov-gerasimenko': -959.63, // 2002-08-18
    '2p-encke': -252.14 // 2000-09-09
  };

  test('orbit.angle puts each comet at its perihelion time (within 2 % of its period)', () => {
    for (const { id, name, orbit } of COMETS) {
      const { e, angle, period } = orbit;
      const P = Math.abs(period.value);
      // True to mean anomaly, in closed form, then mean anomaly to time
      const E =
        2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(angle / 2));
      const M = (E - e * Math.sin(E) + 2 * Math.PI) % (2 * Math.PI);
      const since = (M / (2 * Math.PI)) * P;
      const expected = PERIHELION_DAYS_BEFORE_J2000[id];

      assert.ok(expected !== undefined, `${name}: no reference perihelion`);

      // A perihelion after J2000 is the next one: P minus the time since the last
      const actual = expected >= 0 ? since : since - P;

      assert.ok(
        Math.abs(actual - expected) < 0.02 * P,
        `${name}: orbit.angle gives a perihelion ${actual.toFixed(0)} days before J2000, expected ${expected}`
      );
    }
  });
});

describe('moons', () => {
  test('retrograde moons have a positive period, regular moons a negative one', () => {
    for (const moon of MOONS) {
      if (moon.category === 'retrograde satellite') {
        assert.ok(moon.orbit.period.value > 0, `${moon.name} is retrograde`);
      }

      if (moon.category === 'natural satellite') {
        assert.ok(moon.orbit.period.value < 0, `${moon.name} is prograde`);
      }
    }
  });
});

describe('stars', () => {
  test('orbiting the galaxy use ly and Myr, with a galactic position', () => {
    for (const star of STARS.filter((s) => GALAXY_IDS.has(s.parent ?? ''))) {
      assert.equal(star.orbit?.a.unit, 'ly', `${star.name}.orbit.a`);
      assert.equal(star.orbit?.period.unit, 'Myr', `${star.name}.orbit.period`);

      for (const axis of ['x', 'y', 'z'] as const) {
        assert.equal(star[axis]?.unit, 'ly', `${star.name}.${axis}`);
      }
    }
  });

  test('orbiting within a system use au and yr or kyr', () => {
    for (const star of STARS.filter((s) => SYSTEM_IDS.has(s.parent ?? ''))) {
      if (!star.orbit) continue;

      assert.equal(star.orbit.a.unit, 'au', `${star.name}.orbit.a`);
      assert.ok(
        ['yr', 'kyr'].includes(star.orbit.period.unit),
        `${star.name}.orbit.period`
      );
    }
  });
});

describe('SYSTEMS', () => {
  test('have unique names, members and valid orbits', () => {
    assertUnique(
      'SYSTEMS',
      SYSTEMS.map((system) => system.name)
    );

    for (const system of SYSTEMS) {
      assert.match(system.id, ID, `${system.name}.id`);
      assert.ok(
        NODES.some((node) => node.parent === system.id),
        `${system.name} has no members`
      );

      if (system.orbit) assertValidOrbit(system.name, system.orbit);
      if (system.distance) {
        assert.equal(system.distance.unit, 'ly', `${system.name}.distance`);
        assert.ok(system.distance.value >= 0, `${system.name}.distance`);
      }
    }
  });

  // Members of a binary or multiple system orbit its barycenter in pairs
  const pairs = SYSTEMS.filter(
    (system) => system.kind === 'binary' || system.kind === 'multiple'
  ).map((system) => ({
    system,
    members: NODES.filter((node) => node.parent === system.id && node.orbit)
  }));

  test('binary and multiple systems hold exactly two orbiting members', () => {
    for (const { system, members } of pairs) {
      assert.equal(members.length, 2, `${system.name} members`);
    }
  });

  test('pair members share e, period and angle', () => {
    for (const { system, members } of pairs) {
      const [one, two] = members.map((member) => member.orbit!);

      assert.equal(one.e, two.e, `${system.name}: e`);
      assert.deepEqual(one.period, two.period, `${system.name}: period`);
      assert.equal(one.angle, two.angle, `${system.name}: angle`);
    }
  });

  test('pair members split their separation by mass ratio (a₁m₁ = a₂m₂, within 0.5 %)', () => {
    for (const { system, members } of pairs) {
      const [one, two] = members;
      const lhs = one.orbit!.a.value * massOf(one);
      const rhs = two.orbit!.a.value * massOf(two);

      assert.equal(one.orbit!.a.unit, two.orbit!.a.unit);
      assert.ok(
        Math.abs(lhs / rhs - 1) < 0.005,
        `${system.name}: ${one.name} ${lhs.toFixed(2)} vs ${two.name} ${rhs.toFixed(2)}`
      );
    }
  });

  // P² = (a₁ + a₂)³ / (m₁ + m₂) in years, au and solar masses
  test('pair periods match Kepler III (within 3 %)', () => {
    const AU: Record<string, number> = { au: 1 };
    const YEARS: Record<string, number> = { yr: 1, kyr: 1e3, Myr: 1e6 };

    for (const { system, members } of pairs) {
      const [one, two] = members;
      const separation =
        toUnit(one.orbit!.a.value, one.orbit!.a.unit, AU) +
        toUnit(two.orbit!.a.value, two.orbit!.a.unit, AU);
      const mass = massOf(one) + massOf(two);
      const period = Math.abs(
        toUnit(one.orbit!.period.value, one.orbit!.period.unit, YEARS)
      );
      const expected = Math.sqrt(separation ** 3 / mass);

      assert.ok(
        Math.abs(period / expected - 1) < 0.03,
        `${system.name}: |period| ${period} yr, expected ≈ ${expected.toFixed(1)} yr`
      );
    }
  });
});

describe('GALAXIES', () => {
  test('have unique names and ids, and valid sizes', () => {
    assertUnique(
      'GALAXIES',
      GALAXIES.map((galaxy) => galaxy.name)
    );
    assertUnique(
      'GALAXIES',
      GALAXIES.map((galaxy) => galaxy.id)
    );

    for (const galaxy of GALAXIES) {
      assert.ok(galaxy.diameter.value > 0, `${galaxy.name}.diameter`);
      assert.ok(galaxy.distance.value >= 0, `${galaxy.name}.distance`);
      assert.ok(galaxy.blackHole.mass > 0, `${galaxy.name}.blackHole.mass`);
      assert.ok(
        galaxy.blackHole.radius.value > 0,
        `${galaxy.name}.blackHole.radius`
      );
    }
  });
});

describe('ASTEROID_BELTS', () => {
  test('have unique names, ordered radii and valid opacity', () => {
    assertUnique(
      'ASTEROID_BELTS',
      ASTEROID_BELTS.map((belt) => belt.name)
    );

    for (const belt of ASTEROID_BELTS) {
      assert.ok(belt.innerRadius > 0, `${belt.name}.innerRadius`);
      assert.ok(belt.innerRadius < belt.outerRadius, `${belt.name} radii`);
      assert.ok(belt.opacity >= 0 && belt.opacity <= 1, `${belt.name}.opacity`);
      assert.ok(belt.density >= 0, `${belt.name}.density`);
      assert.match(belt.color, COLOR, `${belt.name}.color`);
    }
  });
});
