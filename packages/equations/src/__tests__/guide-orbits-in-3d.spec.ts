import { AU_METERS, MOONS, PLANETS } from '@interstellar-tools/constants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { applyMatrix3 } from '../categories/helpers/apply-matrix-3.js';
import { orbitFrameToIcrf } from '../categories/orbits/orbit-frame-to-icrf.js';
import { stateAt } from '../categories/orbits/state-at.js';

// Every number in the orbits-in-3D guide
// (docs/guide/usage/equations/orbits-in-3d.md), so the page can't drift from
// the code.

const PAGE = readFileSync(
  new URL(
    '../../../../docs/guide/usage/equations/orbits-in-3d.md',
    import.meta.url
  ),
  'utf8'
);
const body = <T extends { id: string }>(bodies: readonly T[], id: string) =>
  bodies.find((entry) => entry.id === id)!;
const au = (r: readonly number[]) => r.map((m) => (m / AU_METERS).toFixed(4));
const mars = body(PLANETS, 'mars');
const earth = body(PLANETS, 'earth');
const date = new Date('2027-01-01T00:00:00Z');
// The page shows each value as it prints, in a code comment or the text
const onPage = (text: string) =>
  assert.ok(PAGE.includes(text), `the page should have: ${text}`);

describe('Orbits in 3D guide', () => {
  test('where Mars is on 1 January 2027, in the ecliptic', () => {
    const { r, v } = stateAt(mars.orbit!, date, { frame: 'reference' });

    assert.deepEqual(au(r), ['-1.0241', '1.2889', '0.0522']);
    assert.equal((Math.hypot(...r) / AU_METERS).toFixed(4), '1.6471');
    assert.equal((Math.hypot(...v) / 1000).toFixed(2), '22.26');
    assert.equal(mars.orbit!.i!.toFixed(2), '1.85');
    onPage('[-1.0241, 1.2889, 0.0522] au');
    onPage('1.6471 au from the Sun');
    onPage('22.26 km/s');
    onPage('tilted 1.85° from the ecliptic');
  });

  test('in the ICRF, and as Earth sees it', () => {
    const fromSun = stateAt(mars.orbit!, date).r;
    const earthFromSun = stateAt(earth.orbit!, date).r;
    const seen = fromSun.map((m, k) => m - earthFromSun[k]!);
    const distance = Math.hypot(...seen);
    const ra = ((Math.atan2(seen[1]!, seen[0]!) * 180) / Math.PI + 360) % 360;
    const dec = (Math.asin(seen[2]! / distance) * 180) / Math.PI;

    assert.deepEqual(au(fromSun), ['-1.0241', '1.1618', '0.5606']);
    assert.equal((distance / AU_METERS).toFixed(4), '0.9136');
    assert.equal(ra.toFixed(2), '162.26');
    assert.equal(
      `${Math.floor(ra / 15)} h ${Math.floor(((ra / 15) % 1) * 60)} min`,
      '10 h 49 min'
    );
    assert.equal(dec.toFixed(2), '11.06');
    onPage('[-1.0241, 1.1618, 0.5606] au');
    onPage('0.9136 au');
    onPage('162.26°, 10 h 49 min');
    onPage('+11.06°');
  });

  test('Titan around Saturn, and around the Sun', () => {
    const titan = body(MOONS, 'titan');
    const titanFromSaturn = stateAt(titan.orbit, date).r;
    const saturnFromSun = stateAt(body(PLANETS, 'saturn').orbit!, date).r;
    const titanFromSun = titanFromSaturn.map((m, k) => m + saturnFromSun[k]!);
    const pole = applyMatrix3(orbitFrameToIcrf(titan.orbit.frame!), [0, 0, 1]);

    assert.equal(
      (Math.round(Math.hypot(...titanFromSaturn) / 1e6) * 1000).toLocaleString(
        'en-US'
      ),
      '1,191,000'
    );
    assert.equal(
      (Math.hypot(...titanFromSun) / AU_METERS).toFixed(4),
      '9.4088'
    );
    assert.deepEqual(
      pole.map((x) => x.toFixed(3)),
      ['0.084', '0.062', '0.995']
    );
    onPage('1 191 000 km from Saturn');
    onPage('9.4088 au from the Sun');
    onPage('[0.084, 0.062, 0.995], the pole');
  });
});
