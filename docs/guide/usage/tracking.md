---
title: Tracking
description:
  Draw satellites on a globe with @interstellar-tools/tracking, and choose
  between the Earth-fixed and the inertial frame.
---

# Tracking <Badge type="warning" text="0.x" />

Satellites and deep-space probes, from their orbital elements and ephemerides.
These functions are in `@interstellar-tools/tracking`, which is still 0.x: its
API may change in a minor release.

```shell
npm i @interstellar-tools/tracking
```

The examples use the snapshot of well-known satellites the package ships with,
and every number on this page is checked by a test. Angles are in **radians**
and lengths in **metres**, unless a function is asked for another unit.

```ts
import { WGS84 } from '@interstellar-tools/constants';
import { parseOmm, SATELLITES } from '@interstellar-tools/tracking';

const satellite = (id: string) =>
  parseOmm(SATELLITES.find((entry) => entry.id === id)!.omm);
const iss = satellite('iss');
const goes19 = satellite('goes-19');
const R = WGS84.equatorialRadius.value; // Earth radii, for a globe of radius 1
```

## Satellites on a globe

`orbitPath3D` gives a satellite's positions from Earth's centre over time, for
drawing its orbit around a 3D globe. Pass `unit: R` to get them in Earth radii,
ready for a globe of radius 1.

### Earth-fixed or inertial

The same orbit looks different depending on what holds still. Take GOES-19, a
geostationary weather satellite, over a day:

```ts
import { orbitPath3D } from '@interstellar-tools/tracking';

const from = new Date('2026-11-05T00:00:00Z');
const to = new Date('2026-11-06T00:00:00Z');

orbitPath3D(goes19, from, to, { step: 21_600, unit: R });
// [1.688, -6.391, -0.001], [1.688, -6.392, 0.000], ... : still

orbitPath3D(goes19, from, to, { step: 21_600, unit: R, frame: 'inertial' });
// [5.668, -3.401, -0.001], [3.377, 5.684, 0.000], ... : once round a circle
```

- **Earth-fixed**, the default, turns with Earth. The ground stays still under
  the orbit: a geostationary satellite is a point above 75.2° W, and a low
  orbit's path is its ground track lifted to its height, shifting west with each
  orbit. Use it to draw satellites over a globe that doesn't turn, or to see
  what they're above.
- **Inertial** is SGP4's own frame, TEME, fixed to the stars. The orbit stays
  still, a near-perfect ellipse, while Earth turns inside it. Use it to show an
  orbit's shape, or several satellites' orbits against each other. Draw the
  globe turned by `greenwichMeanSiderealTime(date)` about its axis, so the
  ground is in the right place under them.

In both, x points to 0° longitude (Earth-fixed) or the vernal equinox
(inertial), and z to the North Pole. Many 3D engines put y up instead: swap the
axes to suit.

### A globe without WebGL

For a flat picture of a globe, `globeView` projects points on the ground
orthographically, as a globe seen from far away, and flags those on the far
side. Here is one orbit of the ISS on a globe of radius 200 px, centred on Oslo:

```ts
import { globeView, groundTrack } from '@interstellar-tools/tracking';

const later = new Date(from.getTime() + 92.95 * 60_000); // one orbit
const track = groundTrack(iss, from, later).flat();
const view = globeView(track, 200, { phi0: 1.0456, lambda0: 0.1876 });
const near = view.filter(({ visible }) => visible); // 48 of the 94 points
```

Every point gets `x` and `y`, the hidden ones mirrored onto the disc, so a
renderer can draw the far side faintly, or break the line where it goes behind.
Footprints from `coverageFootprint` project the same way.
