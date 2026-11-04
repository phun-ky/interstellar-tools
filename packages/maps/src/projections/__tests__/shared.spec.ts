import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { wrapLongitude } from '../shared.js';

describe('wrapLongitude', () => {
  test('wraps to (-π, π], keeping the meridian', () => {
    fc.assert(
      fc.property(fc.double({ min: -1e6, max: 1e6, noNaN: true }), (lambda) => {
        const wrapped = wrapLongitude(lambda);

        assert.ok(wrapped > -Math.PI && wrapped <= Math.PI, `${wrapped}`);
        // Same meridian, up to the rounding of a whole turn
        assert.ok(
          Math.abs(Math.sin(wrapped) - Math.sin(lambda)) <= 1e-9 &&
            Math.abs(Math.cos(wrapped) - Math.cos(lambda)) <= 1e-9
        );
      })
    );
  });

  test('keeps longitudes already in range, and sends -π to π', () => {
    for (const lambda of [0, 1, -1, Math.PI, 3.1415926535897927])
      assert.equal(wrapLongitude(lambda), lambda);

    assert.equal(wrapLongitude(-Math.PI), Math.PI);
    assert.equal(wrapLongitude(3 * Math.PI), Math.PI);
  });

  test('stays in range one ulp above -π', () => {
    // λ − π rounds to −2π here, which once wrapped it past π
    assert.equal(wrapLongitude(-3.1415926535897927), -3.1415926535897927);
  });
});
