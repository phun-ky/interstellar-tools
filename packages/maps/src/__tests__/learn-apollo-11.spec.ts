import type { Radians, Vector3DTupleType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { illuminationAngles } from '../imaging/illumination-angles.js';
import { isStableLanding } from '../landing/is-stable-landing.js';
import { tipOverAngle } from '../landing/tip-over-angle.js';

// The numbers in chapter III of the Apollo 11 tutorial
// (docs/learn/apollo-11/down-to-the-surface.md) that use this package. The rest
// of the chapter is checked in the equations package's learn-apollo-11.spec.ts.

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const towards = (deg: number): Vector3DTupleType => [
  Math.cos(toRad(deg)),
  0,
  Math.sin(toRad(deg))
];

describe('III. Down to the surface (tutorial)', () => {
  test('7. lights the landing point at incidence 79.2°, emission 74.0°, phase 5.2°', () => {
    const { incidence, emission, phase } = illuminationAngles(
      [0, 0, 1],
      towards(10.8),
      towards(16)
    );

    assert.equal(toDeg(incidence).toFixed(1), '79.2');
    assert.equal(toDeg(emission).toFixed(1), '74.0');
    assert.equal(toDeg(phase).toFixed(1), '5.2');
    assert.equal((1 / Math.tan(toRad(10.8))).toFixed(1), '5.2');
  });

  test('8. tips over at 40.1°, so 4.5° plus 2° of rock-up leaves 33.6° to spare', () => {
    const edge = 4.256 * Math.cos(Math.PI / 4);
    const limit = toDeg(tipOverAngle(edge, 3.573));

    assert.equal(edge.toFixed(3), '3.009');
    assert.equal(limit.toFixed(1), '40.1');
    assert.equal(4.5 + 2, 6.5);
    assert.equal((limit - 6.5).toFixed(1), '33.6');
    assert.equal(isStableLanding(toRad(4.5), toRad(2), edge, 3.573), true);
  });
});
