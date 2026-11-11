import { J2000_UTC, MOONS, PLANETS } from '@interstellar-tools/constants';
import type {
  DegreesType,
  IauRotationModelInterface,
  Matrix3x3Type,
  OrbitInterface
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { stateAt } from '../../orbits/state-at.js';
import { axialTilt } from '../axial-tilt.js';
import { bodyOrientation } from '../body-orientation.js';
import { subsolarPoint } from '../subsolar-point.js';
import { sunPosition } from '../sun-position.js';

const body = (id: string) =>
  [...PLANETS, ...MOONS].find((candidate) => candidate.id === id)!;
const iau = (id: string) => body(id).rotation!.iau!;
// A TDB moment as a UTC Date: TT − UTC is 69.184 s from 2017, and TDB − TT
// under 2 ms
const tdb = (iso: string) => new Date(Date.parse(iso) - 69_184);
const close = (actual: number, expected: number, tolerance: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${expected} ± ${tolerance}, got ${actual}`
  );
const closeMatrix = (
  actual: Matrix3x3Type,
  expected: number[][],
  tolerance: number
) =>
  actual.forEach((row, i) =>
    row.forEach((value, j) => close(value, expected[i]![j]!, tolerance))
  );
const SPIN: IauRotationModelInterface = {
  pole: 'north',
  rightAscension: 0 as DegreesType,
  rightAscensionRate: 0,
  declination: 90 as DegreesType,
  declinationRate: 0,
  primeMeridian: 0 as DegreesType,
  primeMeridianRate: 360
};

describe('bodyOrientation', () => {
  // NASA NAIF's SPICE, pxform('J2000', 'IAU_<body>') with pck00011.tpc
  test('turns the ICRF into Mars’s frame as SPICE does, periodic terms and all', () => {
    const atJ2000 = bodyOrientation(iau('mars'), J2000_UTC);

    close(atJ2000.pole.rightAscension, 317.6808544073, 1e-7);
    close(atJ2000.pole.declination, 52.8864392751, 1e-7);
    close(atJ2000.primeMeridian, 176.6320597319, 1e-5);
    closeMatrix(
      atJ2000.matrix,
      [
        [-0.706736446427, -0.706588294654, 0.035448231956],
        [0.549061990716, -0.579396132794, -0.602354589635],
        [0.446155270777, -0.406242665362, 0.797441139644]
      ],
      1e-7
    );

    const solstice = bodyOrientation(iau('mars'), tdb('2026-06-21T00:00:00Z'));

    close(solstice.pole.rightAscension, 317.6520522143, 1e-7);
    close(solstice.pole.declination, 52.8699669858, 1e-7);
    close(solstice.primeMeridian, 144.8722055131, 1e-5);
    closeMatrix(
      solstice.matrix,
      [
        [-0.889990105624, -0.295433787535, 0.347327639375],
        [0.094308975412, -0.864510256985, -0.49368799127],
        [0.446120419896, -0.406621313694, 0.797267632732]
      ],
      1e-7
    );
  });

  test('turns the ICRF into Earth’s frame as SPICE does', () => {
    closeMatrix(
      bodyOrientation(iau('earth'), J2000_UTC).matrix,
      [
        [0.176174259633, -0.984358994596, 0],
        [0.984358994596, 0.176174259633, 0],
        [0, 0, 1]
      ],
      1e-7
    );
    closeMatrix(
      bodyOrientation(iau('earth'), tdb('2026-06-21T00:00:00Z')).matrix,
      [
        [-0.026307284847, -0.999653901685, 0.000060074422],
        [0.999650591956, -0.026307352336, -0.002572394918],
        [0.002573085015, -0.000007619294, 0.999996689582]
      ],
      1e-7
    );
  });

  test('puts the pole on the body’s z axis, and turns W at the model’s rate', () => {
    const venus = iau('venus');
    const date = new Date('2026-11-11T00:00:00Z');
    const { pole, primeMeridian, matrix } = bodyOrientation(venus, date);
    const a = (pole.rightAscension * Math.PI) / 180;
    const d = (pole.declination * Math.PI) / 180;

    closeMatrix(
      [matrix[2]] as unknown as Matrix3x3Type,
      [[Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)]],
      1e-12
    );

    // Venus turns backwards: 1.4813688° a day less, a day later
    const later = bodyOrientation(venus, new Date(+date + 86_400_000));

    close(
      (primeMeridian - later.primeMeridian + 360) % 360,
      -venus.primeMeridianRate,
      1e-6
    );
  });

  test('keeps its angles from 0° up to 360°', () => {
    const { pole, primeMeridian } = bodyOrientation(
      {
        ...SPIN,
        rightAscension: -10 as DegreesType,
        primeMeridian: -45 as DegreesType,
        primeMeridianRate: 0
      },
      J2000_UTC
    );

    close(pole.rightAscension, 350, 1e-9);
    close(primeMeridian, 315, 1e-9);
  });

  test('throws for angles that aren’t finite, and dates before 1972', () => {
    assert.throws(
      () =>
        bodyOrientation({ ...SPIN, primeMeridianRate: Number.NaN }, J2000_UTC),
      RangeError
    );
    assert.throws(
      () =>
        bodyOrientation(
          {
            ...SPIN,
            declinationTerms: [
              { amplitude: 1, phase: Infinity as DegreesType, rate: 0 }
            ]
          },
          J2000_UTC
        ),
      RangeError
    );
    assert.throws(
      () => bodyOrientation(SPIN, new Date('1970-01-01T00:00:00Z')),
      RangeError
    );
    assert.throws(() => bodyOrientation(SPIN, new Date('nope')), TypeError);
  });
});

describe('axialTilt', () => {
  test('tilts the planets and Pluto as the datasets give it, to 0.01°', () => {
    for (const { name, orbit, rotation } of PLANETS) {
      if (rotation?.obliquity === undefined) continue;

      const tilt = axialTilt(rotation.iau!, orbit!);

      assert.ok(
        Math.abs(tilt - rotation.obliquity) < 0.01,
        `${name}: ${tilt}° against ${rotation.obliquity}°`
      );
    }
  });

  test('gives Earth 23.44°, Mars 25.19° and Uranus 97.77°, and Mars 23.92° without its periodic terms', () => {
    close(axialTilt(iau('earth'), body('earth').orbit!), 23.4393, 1e-4);
    close(axialTilt(iau('mars'), body('mars').orbit!), 25.1916, 1e-4);
    close(axialTilt(iau('uranus'), body('uranus').orbit!), 97.77, 1e-3);

    // Without Mars's periodic terms, its pole is 1.6° off
    const {
      rightAscensionTerms: _a,
      declinationTerms: _d,
      ...linear
    } = iau('mars');

    close(axialTilt(linear, body('mars').orbit!), 23.9162, 1e-3);
  });

  test('ignores which of the two poles the model uses', () => {
    const uranus = iau('uranus');
    // The other pole: turned around, with W counted the other way
    const flipped: IauRotationModelInterface = {
      ...uranus,
      pole: 'positive',
      rightAscension: (uranus.rightAscension + 180) as DegreesType,
      declination: -uranus.declination as DegreesType,
      primeMeridian: (180 - uranus.primeMeridian) as DegreesType,
      primeMeridianRate: -uranus.primeMeridianRate
    };

    close(
      axialTilt(flipped, body('uranus').orbit!),
      axialTilt(uranus, body('uranus').orbit!),
      1e-9
    );
  });

  test('works in a moon’s Laplace plane, and on a flat orbit', () => {
    // Titan's spin axis and Laplace pole are a fraction of a degree apart
    assert.ok(axialTilt(iau('titan'), body('titan').orbit!) < 1);

    const flat: OrbitInterface = {
      a: { value: 1, unit: 'au' },
      e: 0,
      period: { value: 365.25, unit: 'd' },
      angle: 0 as never,
      frame: { plane: 'equator' }
    };

    close(axialTilt(SPIN, flat), 0, 1e-9);
    close(axialTilt(SPIN, { ...flat, retrograde: true }), 180, 1e-9);
    close(
      axialTilt(SPIN, {
        ...flat,
        i: 30 as DegreesType,
        om: 120 as DegreesType
      }),
      30,
      1e-9
    );
  });

  test('takes the pole at another date', () => {
    const later = axialTilt(
      iau('earth'),
      body('earth').orbit!,
      new Date('2100-01-01T00:00:00Z')
    );

    // The pole precesses about the fixed J2000 orbit's pole
    assert.ok(Math.abs(later - 23.4393) < 0.05);
  });

  test('throws for a body that doesn’t turn, or an orbit it can’t place', () => {
    const { orbit } = body('mars');

    for (const primeMeridianRate of [0, Number.NaN])
      assert.throws(
        () => axialTilt({ ...SPIN, primeMeridianRate }, orbit!),
        RangeError
      );

    assert.throws(
      () => axialTilt(SPIN, { ...orbit!, frame: undefined }),
      RangeError
    );
    assert.throws(
      () => axialTilt(SPIN, { ...orbit!, frame: { plane: 'sky' } }),
      RangeError
    );
  });
});

describe('subsolarPoint', () => {
  test('matches Mars24’s worked examples, with the Sun direction from Mars’s orbit', () => {
    // NASA GISS Mars24, Examples 1 and 2, and SPICE's planetocentric
    // latitudes of the Sun's direction in IAU_MARS: 174.72962° and 4.70590° west
    const { orbit } = body('mars');
    const examples = [
      ['2000-01-06T00:00:00Z', -24.98006, 360 - 174.72962],
      ['2004-01-03T13:46:31Z', -13.28592, 360 - 4.7059]
    ] as const;

    for (const [iso, latitude, longitude] of examples) {
      const date = new Date(iso);
      const { r } = stateAt(orbit!, date);
      const point = subsolarPoint(iau('mars'), [-r[0], -r[1], -r[2]], date);

      // Mars's dataset orbit is a fixed J2000 ellipse
      close(point.latitude, latitude, 0.02);
      close(point.longitude, longitude, 0.02);
    }
  });

  test('puts the Sun over the tropics at Earth’s 2026 solstices', () => {
    // SPICE's IAU_EARTH gives ±23.4358°, the model's pole a little off the true one
    for (const [iso, latitude] of [
      ['2026-06-21T08:24:30Z', 23.435796],
      ['2026-12-21T20:50:14Z', -23.435552]
    ] as const) {
      const date = new Date(iso);

      close(
        subsolarPoint(iau('earth'), sunPosition(date).r, date).latitude,
        latitude,
        0.01
      );
    }
  });

  test('reads latitude and east longitude off the body-fixed frame', () => {
    // The node at right ascension α + 90° = 0°, and W = 0: the body's frame
    // is the ICRF's
    const fixed = {
      ...SPIN,
      rightAscension: -90 as DegreesType,
      primeMeridianRate: 0
    };

    assert.deepEqual(subsolarPoint(fixed, [0, 2, 0], J2000_UTC), {
      latitude: 0,
      longitude: 90
    });
    close(subsolarPoint(fixed, [0, -1, 0], J2000_UTC).longitude, 270, 1e-9);
    close(subsolarPoint(fixed, [1, 0, 1], J2000_UTC).latitude, 45, 1e-9);
  });

  test('throws for a direction that is zero or not finite', () => {
    for (const direction of [
      [0, 0, 0],
      [Number.NaN, 0, 1],
      [Infinity, 0, 0]
    ] as const)
      assert.throws(
        () => subsolarPoint(SPIN, [...direction], J2000_UTC),
        RangeError
      );
  });
});
