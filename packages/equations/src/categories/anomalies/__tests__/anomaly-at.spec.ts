import { J2000_UTC, PLANETS } from '@interstellar-tools/constants';
import type { OrbitInterface, Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { norm2pi } from '../../helpers/misc.js';
import { meanAnomalyAt, trueAnomalyAt } from '../anomaly-at.js';
import { trueToMeanAnomaly } from '../true-to-mean-anomaly.js';

const deg = (r: number) => (r * 180) / Math.PI;
const earth = PLANETS.find((planet) => planet.id === 'earth')!.orbit!;
const DAY = 86_400_000;

describe('meanAnomalyAt', () => {
  test('is the mean anomaly at J2000 at J2000 itself', () => {
    assert.ok(
      Math.abs(
        meanAnomalyAt(earth, J2000_UTC) -
          norm2pi(trueToMeanAnomaly(earth.angle, earth.e))
      ) < 1e-12
    );
  });

  test('finds Earth on 17 October 2026 at 282.7°, as the tutorial does', () => {
    const M = meanAnomalyAt(earth, new Date('2026-10-17T12:00:00Z'));

    assert.equal(deg(M).toFixed(1), '282.7');
  });

  test('advances by one orbit per period, forwards and back from J2000', () => {
    const orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'> = {
      e: 0.1,
      angle: 1 as Radians,
      period: { value: 10, unit: 'd' }
    };
    const start = meanAnomalyAt(orbit, J2000_UTC);

    for (const days of [10, 100, -10, -1000]) {
      const later = meanAnomalyAt(
        orbit,
        new Date(J2000_UTC.getTime() + days * DAY)
      );

      assert.ok(Math.abs(later - start) < 1e-9, `${days} days`);
    }
  });

  test('rejects an invalid date', () => {
    assert.throws(
      () => meanAnomalyAt(earth, new Date('not a date')),
      TypeError
    );
    assert.throws(
      () => meanAnomalyAt(earth, '2026-10-17' as unknown as Date),
      TypeError
    );
  });
});

describe('trueAnomalyAt', () => {
  test('finds Earth on 17 October 2026 at 280.8°, 0.9966 au from the Sun', () => {
    const nu = trueAnomalyAt(earth, new Date('2026-10-17T12:00:00Z'));
    const r = (1 - earth.e ** 2) / (1 + earth.e * Math.cos(nu));

    assert.equal(deg(nu).toFixed(1), '280.8');
    assert.equal(r.toFixed(4), '0.9966');
  });

  test('puts Earth at perihelion in early January', () => {
    // Earth's perihelion: 2026-01-03; the true anomaly is near 0 (or 2π)
    const nu = trueAnomalyAt(earth, new Date('2026-01-03T12:00:00Z'));
    const fromPerihelion = Math.min(nu, 2 * Math.PI - nu);

    assert.ok(deg(fromPerihelion) < 3, `${deg(nu).toFixed(2)}°`);
  });

  test('is in [0, 2π)', () => {
    for (const year of [1900, 2000, 2026, 2100]) {
      const nu = trueAnomalyAt(earth, new Date(`${year}-06-01T00:00:00Z`));

      assert.ok(nu >= 0 && nu < 2 * Math.PI, `${year}: ${nu}`);
    }
  });
});
