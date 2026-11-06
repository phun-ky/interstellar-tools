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
  AU_METERS,
  COMETS,
  G_SI,
  GALAXIES,
  LY_PER_PC,
  MOONS,
  PLANETS,
  SPEED_OF_LIGHT_M_PER_S,
  STARS,
  SYSTEMS,
  WGS84
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
  assert.ok(orbit.period.value > 0, `${name}.orbit.period must be positive`);
  assert.ok(
    orbit.retrograde === undefined || orbit.retrograde === true,
    `${name}.orbit.retrograde is true or left out`
  );
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

    test('has a valid display colour, and no renderer state', () => {
      for (const body of bodies) {
        const display = body.display ?? {};

        assert.match(display.color ?? '', COLOR, `${body.name}.display.color`);

        // Computed by a renderer, never shipped in the data
        for (const field of [
          'semiMinorAxis',
          'focusOffsetX',
          'orbitPath'
        ] as const) {
          assert.equal(
            display[field],
            undefined,
            `${body.name}.display.${field}`
          );
        }
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

      assert.equal(orbit.q.unit, orbit.a.unit, `${name}: q and a share a unit`);
      assert.ok(
        Math.abs(orbit.q.value / expected - 1) < 0.03,
        `${name}: q = ${orbit.q.value} au, a(1 − e) = ${expected.toFixed(4)} au`
      );
    }
  });

  test('retrograde is set exactly when i > 90°', () => {
    for (const { name, orbit } of [...COMETS, ...ASTEROIDS]) {
      assert.equal(
        orbit.retrograde === true,
        orbit.i > 90,
        `${name}: i = ${orbit.i}°, retrograde = ${orbit.retrograde}`
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
      const r = Math.hypot(x!.value, y!.value, z!.value);

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

    assert.equal(Math.hypot(x!.value, y!.value, z!.value).toFixed(3), '0.983');
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

describe('display sizes', () => {
  test('comets and asteroids have a positive drawing size', () => {
    for (const { name, display } of [...COMETS, ...ASTEROIDS]) {
      assert.ok((display?.size ?? 0) > 0, `${name}.display.size`);
    }
  });
});

describe('moons', () => {
  test('retrograde satellites are flagged retrograde, regular moons are not', () => {
    for (const moon of MOONS) {
      if (moon.category === 'retrograde satellite') {
        assert.equal(moon.orbit.retrograde, true, `${moon.name} is retrograde`);
      }

      if (moon.category === 'natural satellite') {
        assert.equal(
          moon.orbit.retrograde,
          undefined,
          `${moon.name} is prograde`
        );
      }
    }
  });
});

// Sidereal rotation rates in degrees a day, the prime meridian's Ẇ from the
// IAU (Archinal et al. 2018; the Moon from the 2009 report, Archinal et al.
// 2011), and light-curve periods in hours where it gives none
const IAU_ROTATION_RATE: Record<string, number> = {
  mercury: 6.1385108,
  venus: -1.4813688,
  mars: 350.891982443297,
  jupiter: 870.536,
  saturn: 810.7939024,
  uranus: -501.1600928,
  neptune: 541.1397757,
  ceres: 952.1532,
  pluto: 56.3625225,
  moon: 13.17635815,
  phobos: 1128.84475928,
  deimos: 285.16188899,
  io: 203.4889538,
  europa: 101.3747235,
  ganymede: 50.3176081,
  callisto: 21.5710715,
  amalthea: 722.631456,
  metis: 1221.2547301,
  thebe: 533.70041,
  titan: 22.5769768,
  enceladus: 262.7318996,
  rhea: 79.6900478,
  iapetus: 4.5379572,
  phoebe: 931.639,
  titania: -41.3514316,
  oberon: -26.7394932,
  miranda: -254.6906892,
  ariel: -142.8356681,
  umbriel: -86.8688923,
  triton: -61.2572637,
  proteus: 320.7654228
};
const LIGHT_CURVE_HOURS: Record<string, number> = {
  himalia: 7.7819,
  nereid: 11.594
};
const SPINNING = [...PLANETS, ...MOONS];

describe('rotation', () => {
  test('every period is 360° over the IAU rate, or the light curve’s', () => {
    for (const { id, name, rotation } of SPINNING) {
      const rate = IAU_ROTATION_RATE[id];
      const hours = LIGHT_CURVE_HOURS[id];

      if (id === 'earth' || !rotation) continue;

      assert.equal(rotation.period.unit, 'd', `${name}.rotation.period.unit`);

      const expected = rate === undefined ? hours! / 24 : 360 / Math.abs(rate);

      assert.ok(
        Math.abs(rotation.period.value / expected - 1) <
          (rate === undefined ? 1e-5 : 1e-9),
        `${name}: ${rotation.period.value} d against ${expected} d`
      );
    }
  });

  test('Earth turns once in 23 h 56 m 4.0989 s, by the Earth rotation angle', () => {
    const { rotation } = PLANETS.find(({ id }) => id === 'earth')!;

    // The IERS: 1.00273781191135448 turns a day of UT1
    assert.ok(
      Math.abs(rotation!.period.value - 1 / 1.002_737_811_911_354_48) < 1e-10
    );
    assert.equal((rotation!.period.value * 86_400).toFixed(4), '86164.0989');
  });

  test('gives every planet, and every moon the IAU or a light curve covers, a rotation', () => {
    const covered = new Set([
      'earth',
      ...Object.keys(IAU_ROTATION_RATE),
      ...Object.keys(LIGHT_CURVE_HOURS)
    ]);

    for (const { id, name, rotation } of SPINNING)
      assert.equal(rotation !== undefined, covered.has(id), name);
  });

  test('spins backwards for Venus, Uranus, Pluto and Triton only', () => {
    const backwards = SPINNING.filter(({ rotation }) => rotation?.retrograde)
      .map(({ id }) => id)
      .sort();

    assert.deepEqual(backwards, ['pluto', 'triton', 'uranus', 'venus']);
  });

  test('keeps a synchronous moon’s rotation equal to its orbit, in period and direction', () => {
    for (const { name, orbit, rotation } of MOONS) {
      if (!rotation?.synchronous) continue;

      // The orbital periods are rounded, to 0.3 % at most (Miranda's 1.41 d)
      assert.equal(orbit.period.unit, 'd');
      assert.ok(
        Math.abs(rotation.period.value / orbit.period.value - 1) < 3e-3,
        `${name}: ${rotation.period.value} d against ${orbit.period.value} d`
      );
      assert.equal(rotation.retrograde, orbit.retrograde, name);
    }
  });

  test('marks every moon that turns once an orbit as synchronous, and no other', () => {
    for (const { name, orbit, rotation } of MOONS) {
      if (!rotation) continue;

      const once =
        Math.abs(rotation.period.value / orbit.period.value - 1) < 0.01;

      assert.equal(rotation.synchronous === true, once, name);
    }
  });
});

// Sidereal rotation of the Sun, stars, asteroids and comets, in hours: 24 ×
// 360° over the IAU rate (Archinal et al. 2018) where it gives one, else the
// paper's period
const SMALL_BODY_IAU_RATE: Record<string, number> = {
  sun: 14.1844,
  '4-vesta': 1617.3329428,
  '433-eros': 1639.38864745,
  '2-pallas': 1105.8036,
  '511-davida': 1684.4193549,
  '52-europa': 1534.6472187,
  '67p-churyumov-gerasimenko': 696.543884683
};
const SMALL_BODY_HOURS: Record<string, number> = {
  vega: 0.71 * 24,
  altair: 7 + 46 / 60,
  'spica-a': (4.0145 / 2) * 24,
  'spica-b': (4.0145 / 1.5) * 24,
  'alpha-centauri-a': 28.8 * 24,
  'alpha-centauri-b': 36.2 * 24,
  'proxima-centauri': 83 * 24,
  '10-hygiea': 13.82559,
  '704-interamnia': 8.71234,
  '31-euphrosyne': 5.529595,
  '16-psyche': 4.195948,
  '3-juno': 7.20953091,
  '15-eunomia': 6.082753,
  '1p-halley': 7.4 * 24,
  'c-1995-o1-hale-bopp': 11.34,
  '2p-encke': 11.083
};
const HOURS_IN: Record<string, number> = { h: 1, d: 24 };
const SMALL_BODIES: (StarInterface | AsteroidInterface | CometInterface)[] = [
  ...STARS,
  ...ASTEROIDS,
  ...COMETS
];

describe('rotation of the Sun, stars, asteroids and comets', () => {
  test('every period is the IAU rate’s, or the paper’s', () => {
    for (const { id, name, rotation } of SMALL_BODIES) {
      const rate = SMALL_BODY_IAU_RATE[id];
      const expected =
        rate === undefined ? SMALL_BODY_HOURS[id] : (360 / rate) * 24;

      assert.equal(rotation !== undefined, expected !== undefined, name);

      if (!rotation || expected === undefined) continue;

      const hours = rotation.period.value * HOURS_IN[rotation.period.unit]!;

      // The stars' periods are rounded to their sources' 3 or 4 digits
      assert.ok(
        Math.abs(hours / expected - 1) < 2e-4,
        `${name}: ${hours} h against ${expected} h`
      );
    }
  });

  test('turns the Sun faster at its equator than at its poles, by Snodgrass & Ulrich', () => {
    const { rotation } = STARS.find(({ id }) => id === 'sun')!;
    const { period, equatorialPeriod, polarPeriod } = rotation!;
    // 14.71 − 2.39 sin²φ − 1.78 sin⁴φ degrees a day
    const equator = 360 / 14.71;
    const pole = 360 / (14.71 - 2.39 - 1.78);

    assert.ok(Math.abs(equatorialPeriod!.value - equator) < 5e-3);
    assert.ok(Math.abs(polarPeriod!.value - pole) < 5e-3);
    assert.ok(equatorialPeriod!.value < period.value);
    assert.ok(period.value < polarPeriod!.value);
  });

  test('spins every asteroid slower than the 2.2 h spin barrier', () => {
    for (const { name, rotation } of ASTEROIDS) {
      assert.equal(rotation?.period.unit, 'h', name);
      assert.ok(rotation!.period.value > 2.2, name);
    }
  });

  test('spins backwards against the Sun for Pallas, Hygiea, Psyche and Eunomia only', () => {
    const backwards = SMALL_BODIES.filter(
      ({ rotation }) => rotation?.retrograde
    )
      .map(({ id }) => id)
      .sort();

    assert.deepEqual(backwards, [
      '10-hygiea',
      '15-eunomia',
      '16-psyche',
      '2-pallas'
    ]);
  });

  test('tumbles for Halley’s comet only', () => {
    const tumbling = SMALL_BODIES.filter(({ rotation }) => rotation?.tumbling);

    assert.deepEqual(
      tumbling.map(({ id }) => id),
      ['1p-halley']
    );
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

  // Days for close binaries such as Spica, years for wide ones
  test('orbiting within a system use au and d, yr or kyr', () => {
    for (const star of STARS.filter((s) => SYSTEM_IDS.has(s.parent ?? ''))) {
      if (!star.orbit) continue;

      assert.equal(star.orbit.a.unit, 'au', `${star.name}.orbit.a`);
      assert.ok(
        ['d', 'yr', 'kyr'].includes(star.orbit.period.unit),
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
    const YEARS: Record<string, number> = {
      d: 1 / 365.25,
      yr: 1,
      kyr: 1e3,
      Myr: 1e6
    };

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

describe('pair orientation', () => {
  // Where a pair gives its orientation, both members share the plane (i, om), and their
  // periapses point opposite ways
  const oriented = SYSTEMS.map((system) =>
    NODES.filter(
      (node) => node.parent === system.id && node.orbit?.w !== undefined
    )
  ).filter((members) => members.length > 0);

  test('both members carry w, 180° apart, with the same i and om', () => {
    assert.ok(oriented.length > 0, 'at least one oriented pair');

    for (const members of oriented) {
      const [one, two] = members.map((member) => member.orbit!);
      const label = members.map((member) => member.id).join(' and ');

      assert.equal(members.length, 2, label);
      assert.equal(one.i, two.i, `${label}: i`);
      assert.equal(one.om, two.om, `${label}: om`);
      assert.ok(
        Math.abs(((one.w! - two.w! + 360) % 360) - 180) < 1e-9,
        `${label}: w ${one.w} and ${two.w}`
      );
    }
  });
});

describe('mu', () => {
  const withMu = [...STARS, ...PLANETS, ...MOONS].filter(
    (body) => body.mu !== undefined
  );
  const MU_BY_ID = new Map(withMu.map((body) => [body.id, body.mu!]));

  test('is positive and finite where given', () => {
    assert.ok(withMu.length > 30);

    for (const { name, mu } of withMu) {
      assert.ok(Number.isFinite(mu) && mu! > 0, `${name}.mu = ${mu}`);
    }
  });

  test("the Sun's mu matches its mass, through G (within 0.1 %)", () => {
    const sun = STARS.find((star) => star.id === 'sun')!;
    const SOLAR_MASS_KG = 1.98841e30;

    assert.ok(Math.abs(sun.mu! / (G_SI * SOLAR_MASS_KG) - 1) < 0.001);
  });

  // T = 2π √(a³ / μ) with the parent's μ: catches a wrong a or period
  test('moon periods match Kepler III around their planet (within 2 %)', () => {
    for (const { name, parent, orbit } of MOONS) {
      const mu = MU_BY_ID.get(parent);

      assert.ok(mu, `${name}: parent ${parent} has a mu`);

      const a = orbit.a.value * AU_METERS;
      const expected = (2 * Math.PI * Math.sqrt(a ** 3 / mu!)) / 86_400;

      assert.ok(
        Math.abs(orbit.period.value / expected - 1) < 0.02,
        `${name}: period ${orbit.period.value} d, Kepler III gives ${expected.toFixed(3)} d`
      );
    }
  });

  test('planet periods match Kepler III around the Sun (within 1 %)', () => {
    const muSun = MU_BY_ID.get('sun')!;

    for (const { name, orbit } of PLANETS) {
      const a = orbit!.a.value * AU_METERS;
      const expected = (2 * Math.PI * Math.sqrt(a ** 3 / muSun)) / 86_400;

      assert.ok(
        Math.abs(orbit!.period.value / expected - 1) < 0.01,
        `${name}: period ${orbit!.period.value} d, Kepler III gives ${expected.toFixed(1)} d`
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
      assert.equal(galaxy.diameter.unit, 'ly', `${galaxy.name}.diameter`);
      assert.equal(galaxy.distance.unit, 'ly', `${galaxy.name}.distance`);
      assert.ok(galaxy.diameter.value > 0, `${galaxy.name}.diameter`);
      assert.ok(galaxy.distance.value >= 0, `${galaxy.name}.distance`);
    }
  });

  test('are at their Cepheid distances, in kpc', () => {
    // Li et al. 2021 for Andromeda, Breuval et al. 2023 for Triangulum
    const kpc: Record<string, number> = {
      'milky-way': 0,
      andromeda: 761,
      triangulum: 840
    };

    for (const { id, name, distance } of GALAXIES)
      assert.ok(
        Math.abs(distance.value - kpc[id]! * 1000 * LY_PER_PC) < 1,
        `${name}: ${distance.value} ly`
      );
  });

  test('have their D25 diameters, from RC3 and their distances', () => {
    // log D25 in 0.1′ (RC3): 3.28 for Andromeda, 2.85 for Triangulum
    const logD25: Record<string, number> = {
      andromeda: 3.28,
      triangulum: 2.85
    };

    for (const { id, name, diameter, distance } of GALAXIES) {
      const log = logD25[id];

      if (log === undefined) continue;

      const radians = (10 ** log / 10 / 60) * (Math.PI / 180);

      assert.ok(
        Math.abs(diameter.value / (distance.value * radians) - 1) < 1e-3,
        `${name}: ${diameter.value} ly`
      );
    }

    // The Milky Way's, 26.8 kpc, from a model of its disk (Goodwin et al. 1998)
    const milkyWay = GALAXIES.find(({ id }) => id === 'milky-way')!;

    assert.ok(
      Math.abs(milkyWay.diameter.value - 26_800 * LY_PER_PC) < 10,
      `Milky Way: ${milkyWay.diameter.value} ly`
    );
  });

  test('have a black hole of their measured mass, its radius 2GM/c², at the centre', () => {
    // GRAVITY Collaboration 2024 for Sagittarius A*, Bender et al. 2005 for M31*
    const masses: Record<string, number> = {
      'milky-way': 4.2996e6,
      andromeda: 1.4e8
    };
    const GM_SUN = STARS.find(({ id }) => id === 'sun')!.mu!;

    for (const { id, name, blackHole } of GALAXIES) {
      assert.equal(blackHole?.mass, masses[id], name);

      if (!blackHole) continue;

      const radius =
        (2 * GM_SUN * blackHole.mass) / SPEED_OF_LIGHT_M_PER_S ** 2 / AU_METERS;

      assert.equal(blackHole.radius.unit, 'au', name);
      assert.ok(
        Math.abs(blackHole.radius.value / radius - 1) < 1e-3,
        `${name}: ${blackHole.radius.value} au against ${radius} au`
      );
      assert.deepEqual(
        [blackHole.x, blackHole.y],
        [
          { value: 0, unit: 'au' },
          { value: 0, unit: 'au' }
        ],
        name
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
      const { innerRadius, outerRadius } = belt;

      assert.equal(innerRadius.unit, 'au', `${belt.name}.innerRadius`);
      assert.equal(outerRadius.unit, innerRadius.unit, `${belt.name} radii`);
      assert.ok(innerRadius.value > 0, `${belt.name}.innerRadius`);
      assert.ok(innerRadius.value < outerRadius.value, `${belt.name} radii`);
      const { color = '', opacity = -1, density = -1 } = belt.display ?? {};

      assert.ok(opacity >= 0 && opacity <= 1, `${belt.name}.display.opacity`);
      assert.ok(density >= 0, `${belt.name}.display.density`);
      assert.match(color, COLOR, `${belt.name}.display.color`);
    }
  });
});

// IAU WGCCRE 2015 (Archinal et al. 2018), Tables 4 and 5
describe('reference ellipsoids', () => {
  const withEllipsoid = [...PLANETS, ...MOONS].filter((body) => body.ellipsoid);

  test('cover the planets, Pluto and the IAU’s large moons', () => {
    assert.deepEqual(withEllipsoid.map((body) => body.id).sort(), [
      'callisto',
      'deimos',
      'earth',
      'enceladus',
      'europa',
      'ganymede',
      'io',
      'jupiter',
      'mars',
      'mercury',
      'moon',
      'neptune',
      'phobos',
      'pluto',
      'saturn',
      'titan',
      'uranus',
      'venus'
    ]);
  });

  test('order the axes a >= b >= c > 0, in km', () => {
    for (const { name, ellipsoid } of withEllipsoid) {
      const a = ellipsoid!.equatorialRadius;
      const b = ellipsoid!.alongOrbitRadius ?? a;
      const c = ellipsoid!.polarRadius;

      for (const r of [a, b, c]) assert.equal(r.unit, 'km', name);

      assert.ok(a.value >= b.value && b.value >= c.value && c.value > 0, name);
    }
  });

  test('put the mean radius between the polar and equatorial radii', () => {
    for (const { name, radius, ellipsoid } of withEllipsoid) {
      const a = ellipsoid!.equatorialRadius.value;
      const c = ellipsoid!.polarRadius.value;

      assert.ok(
        radius.value >= c && radius.value <= a,
        `${name}: ${radius.value} km outside ${c}–${a} km`
      );
    }
  });

  test('use the IAU mean radii', () => {
    const iau: Record<string, number> = {
      mercury: 2439.4,
      venus: 6051.8,
      earth: 6371.0084,
      mars: 3389.5,
      jupiter: 69_911,
      saturn: 58_232,
      uranus: 25_362,
      neptune: 24_622,
      pluto: 1188.3,
      moon: 1737.4,
      phobos: 11.08,
      deimos: 6.2,
      io: 1821.49,
      europa: 1560.8,
      ganymede: 2631.2,
      callisto: 2410.3,
      enceladus: 252.1,
      titan: 2575,
      triton: 1352.6
    };

    for (const body of [...PLANETS, ...MOONS])
      if (body.id in iau)
        assert.equal(body.radius.value, iau[body.id], body.name);

    assert.equal(
      [...PLANETS, ...MOONS].filter((body) => body.id in iau).length,
      Object.keys(iau).length
    );
  });

  test('give WGS 84 its defined radius and flattening', () => {
    assert.equal(WGS84.equatorialRadius.value, 6_378_137);
    assert.equal(WGS84.equatorialRadius.unit, 'm');
    assert.equal(WGS84.inverseFlattening, 298.257223563);
    assert.equal(WGS84.polarRadius.value.toFixed(6), '6356752.314245');
    assert.ok(Object.isFrozen(WGS84) && Object.isFrozen(WGS84.polarRadius));
  });

  test('agree with WGS 84 for Earth to within a metre', () => {
    const earth = PLANETS.find((planet) => planet.id === 'earth')!.ellipsoid!;

    assert.ok(
      Math.abs(
        earth.equatorialRadius.value * 1000 - WGS84.equatorialRadius.value
      ) < 1
    );
    assert.ok(
      Math.abs(earth.polarRadius.value * 1000 - WGS84.polarRadius.value) < 1
    );
  });
});
