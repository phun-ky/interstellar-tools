import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { parseHorizonsVectors } from '../horizons.js';

const fixture = (name: string) =>
  readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8');
const voyager1 = fixture('horizons-voyager1.txt');
const csv = fixture('horizons-voyager1-csv-au.txt');
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const rejects = (text: string, message: string) =>
  assert.throws(
    () => parseHorizonsVectors(text),
    (err) => err instanceof RangeError && err.message === message
  );

describe('parseHorizonsVectors', () => {
  test('reads Voyager 1 from the Sun, in m and m/s', () => {
    const ephemeris = parseHorizonsVectors(voyager1);
    const [first] = ephemeris.samples;

    assert.equal(ephemeris.objectName, 'Voyager 1 (spacecraft)');
    assert.equal(ephemeris.objectId, '-31');
    assert.equal(ephemeris.center, 'Sun');
    assert.equal(ephemeris.frame, 'ICRF');
    assert.equal(ephemeris.timeScale, 'TDB');
    assert.equal(ephemeris.samples.length, 11);
    // 2026-01-01 00:00 TDB
    assert.equal(first!.epoch.toISOString(), '2025-12-31T23:58:50.816Z');
    assert.deepEqual(
      first!.r,
      [-4.762659739242758e12, -2.42836855810249e13, 5.360366524995458e12]
    );
    assert.deepEqual(
      first!.v,
      [-2072.816913981589, -16399.96880555899, 3608.955582432917]
    );
  });

  test('reads the CSV form in au and au/day the same', () => {
    const text = parseHorizonsVectors(voyager1).samples;
    const fromCsv = parseHorizonsVectors(csv).samples;

    assert.equal(fromCsv.length, 3);

    fromCsv.forEach((sample, k) => {
      assert.equal(sample.epoch.getTime(), text[k]!.epoch.getTime());

      for (const axis of [0, 1, 2]) {
        close(sample.r[axis]!, text[k]!.r[axis]!, 0.01);
        close(sample.v[axis]!, text[k]!.v[axis]!, 1e-9);
      }
    });
  });

  test('reads km per day, and TT and UT times', () => {
    const [kmPerDay] = parseHorizonsVectors(
      voyager1.replace('Output units    : KM-S', 'Output units    : KM-D')
    ).samples;
    const tt = parseHorizonsVectors(voyager1.replace('JDTDB', 'JDTT'));
    const ut = parseHorizonsVectors(voyager1.replace('JDTDB', 'JDUT'));

    close(kmPerDay!.v[1], -16399.96880555899 / 86_400, 1e-12);
    assert.equal(tt.timeScale, 'TT');
    assert.equal(
      tt.samples[0]!.epoch.toISOString(),
      '2025-12-31T23:58:50.816Z'
    );
    assert.equal(ut.timeScale, 'UTC');
    assert.equal(
      ut.samples[0]!.epoch.toISOString(),
      '2026-01-01T00:00:00.000Z'
    );
  });

  test('leaves out the id of a target without one', () => {
    const ephemeris = parseHorizonsVectors(
      voyager1.replace(/Target body name: [^\n{]*/, 'Target body name: Probe ')
    );

    assert.equal(ephemeris.objectName, 'Probe');
    assert.equal('objectId' in ephemeris, false);
  });

  test('rejects anything but a Horizons vector table', () => {
    assert.throws(
      () => parseHorizonsVectors(undefined as unknown as string),
      (err) =>
        err instanceof TypeError &&
        err.message === 'text must be a string. Received: undefined'
    );
    rejects(
      'Target body name: Voyager 1',
      'Horizons vectors must have a table between $$SOE and $$EOE: pass the whole output.'
    );
    rejects(
      voyager1.replace(/Center body name[^\n]*\n/, ''),
      'Horizons vectors must have a "Center body name" line.'
    );
    rejects(
      voyager1.replace('Output units    : KM-S', 'Output units    : AU-S'),
      'Horizons units must be KM-S, KM-D or AU-D. Received: "AU-S"'
    );
    rejects(
      voyager1.replace(/^JDTDB\n/m, ''),
      'Horizons times must be TDB, TT or UT. Received: ""'
    );
    rejects(
      voyager1.replace('JDTDB', 'JDCT'),
      'Horizons times must be TDB, TT or UT. Received: "JDCT"'
    );
    rejects(
      voyager1.replace(/\$\$SOE[\s\S]*\$\$EOE/, () => '$$SOE\n$$EOE'),
      'Horizons vectors must have at least one record.'
    );
  });

  test('rejects records without velocities, or out of order', () => {
    const noVelocity =
      'Horizons vectors must have velocities: ask for VEC_TABLE=2 or 3.';

    rejects(voyager1.replace(/^ VX=.*\n/m, ''), noVelocity);
    // Cut off after the last date, or after its position
    rejects(
      voyager1.replace(/(2461051\.5[^\n]*\n)[\s\S]*?(\$\$EOE)/, '$1$2'),
      'Horizons vectors must give X, Y and Z after each date. Received: ""'
    );
    rejects(
      voyager1.replace(/(2461051\.5[^\n]*\n[^\n]*\n)[\s\S]*?(\$\$EOE)/, '$1$2'),
      noVelocity
    );
    rejects(
      csv.replace(/(\$\$SOE\n[^\n]*?)(?:,[^,\n]*){4}\n/, '$1,\n'),
      noVelocity
    );
    rejects(
      voyager1.replace(/^ X =.*\n/m, ''),
      'Horizons vectors must give X, Y and Z after each date. Received: "VX=-2.072816913981589E+00 VY=-1.639996880555899E+01 VZ= 3.608955582432917E+00"'
    );
    rejects(
      csv.replace(/^2461042\.5[^,]*,/m, '2461041.500000000,'),
      'Horizons times must increase. Received: JD 2461041.5'
    );
    rejects(
      csv.replace(/^(2461042\.5[^,]*,[^,]*,)\s*\S+?,/m, '$1 x,'),
      'Horizons values must be numbers. Received: "2461042.500000000, A.D. 2026-Jan-02 00:00:00.0000, x, -1.623358836899575E+02,  3.583392138704099E+01, -1.197147363265748E-03, -9.471773091827545E-03,  2.084340575784121E-03,"'
    );
  });
});
