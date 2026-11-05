# @interstellar-tools/tracking

Track satellites and deep-space probes: orbital elements (TLE and OMM), SGP4
propagation, the point under a satellite, look angles and passes for a ground
observer, and positions of probes from ephemeris files.

> [!NOTE]
>
> **0.x: the API can still change.** This package is new and versioned 0.x until
> its API settles; a minor release may change it.

**No I/O.** Like the other libraries, `tracking` never fetches anything: you
pass in the orbital elements or ephemerides, and the documentation says where to
get them.

## Usage

Read a satellite's orbital elements from a two-line element set (TLE), or from
an Orbit Mean-elements Message (OMM) in JSON. Both give the same elements, in
radians and rad/s:

```ts
import { parseOmm, parseTle } from '@interstellar-tools/tracking';

const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483',
  'ISS (ZARYA)'
);

iss.epoch.toISOString(); // '2026-11-04T08:52:07.404Z'

// CelesTrak and Space-Track return OMMs as an array of records
const response = await fetch(
  'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=JSON'
);
const [sameIss] = (await response.json()).map(parseOmm);
```

A malformed TLE throws a `RangeError` naming the line, columns and field, and a
wrong checksum is caught. Alpha-5 catalogue numbers, such as `A0001`, are read.

To try things out without the network, `SATELLITES` holds a snapshot of twelve
well-known satellites, from the ISS to a Molniya orbit, dated 4 November 2026:

```ts
import { parseOmm, SATELLITES } from '@interstellar-tools/tracking';

const hubble = parseOmm(SATELLITES.find(({ id }) => id === 'hubble')!.omm);
```

> [!WARNING]
>
> **Orbital elements go stale within days.** The snapshot is for examples and
> tests; for tracking, fetch fresh elements from
> [CelesTrak](https://celestrak.org/), at most once every 2 hours.

Then propagate the elements with SGP4, the model they were fitted for, to get
the satellite's position and velocity in the TEME frame, in m and m/s:

```ts
import { propagate } from '@interstellar-tools/tracking';

const { r, v } = propagate(iss, new Date('2026-11-04T12:00:00Z'));
```

It matches the verification set of Vallado et al. (2006), _Revisiting Spacetrack
Report #3_, to a millimetre. For orbits of 225 minutes or more it runs as SDP4,
with the pull of the Moon and Sun.

And find the point on Earth under the satellite, on the WGS 84 ellipsoid:

```ts
import { subSatellitePoint } from '@interstellar-tools/tracking';

const { phi, lambda, h } = subSatellitePoint(iss, new Date());
```

Draw it on a flat map: its ground track, split where it crosses the
antimeridian, and the footprint it can be seen from:

```ts
import {
  coverageFootprint,
  groundTrack,
  subSatellitePoint
} from '@interstellar-tools/tracking';

const later = new Date(Date.now() + 92 * 60_000); // one ISS orbit
const segments = groundTrack(iss, new Date(), later); // lines of { phi, lambda, h }
const footprint = coverageFootprint(subSatellitePoint(iss, new Date()), 0.1745); // above 10°
```

Or see it from the ground: where to point an antenna, and how far to retune the
radio for the Doppler shift:

```ts
import { dopplerShift, lookAngles } from '@interstellar-tools/tracking';

const oslo = { phi: 1.0456, lambda: 0.1876, h: 20 }; // radians, m
const { azimuth, elevation, rangeRate } = lookAngles(iss, oslo, new Date());
const shift = dopplerShift(145_800_000, rangeRate); // Hz
```

And predict when it passes over, here for the next day, above 10°:

```ts
import { predictPasses } from '@interstellar-tools/tracking';

const from = new Date();
const to = new Date(from.getTime() + 86_400_000);

for (const pass of predictPasses(iss, oslo, from, to, { minElevation: 0.1745 }))
  console.log(pass.rise, pass.maxElevation, pass.set);
```

Keep the passes you can see with the eye, the satellite in sunlight while the
sky is dark, or check whether it's in Earth's shadow:

```ts
import { sunPosition } from '@interstellar-tools/equations';

import {
  earthShadow,
  isVisiblePass,
  propagate,
  predictPasses
} from '@interstellar-tools/tracking';

const visible = predictPasses(iss, oslo, from, to).filter((pass) =>
  isVisiblePass(iss, oslo, pass)
);
const now = new Date();
const shadow = earthShadow(propagate(iss, now).r, sunPosition(now).r); // 'sunlit', 'penumbra' or 'umbra'
```

Deep-space probes have no TLEs: their positions come as ephemerides, tables of
positions and velocities over time. Read one from JPL Horizons, or a CCSDS Orbit
Ephemeris Message (OEM), and interpolate it to any moment:

```ts
import {
  parseHorizonsVectors,
  parseOem,
  stateAt
} from '@interstellar-tools/tracking';

// Voyager 1 from the Sun, daily, on the ICRF's equatorial axes
const horizons = await fetch(
  'https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=-31&EPHEM_TYPE=VECTORS&VEC_TABLE=2&REF_PLANE=FRAME&CENTER=500@10&START_TIME=2026-01-01&STOP_TIME=2026-01-11&STEP_SIZE=1d'
);
const voyager1 = parseHorizonsVectors(await horizons.text());
const { r, v } = stateAt(voyager1, new Date('2026-01-05T06:00:00Z')); // m and m/s
// One ephemeris per OEM segment: don't interpolate across them
const [segment] = parseOem(oemText);
```

## What's planned

The
[Satellite tracking milestone](https://github.com/phun-ky/interstellar-tools/milestone/3)
tracks the work:

- **satellites**: anything in Earth orbit with public orbital elements, crewed
  vehicles like the ISS included: TLE and OMM parsing, SGP4 and SDP4, ground
  tracks, look angles, passes and eclipses
- **probes**: deep-space spacecraft without TLEs, such as Voyager, New Horizons
  and JWST, positioned from ephemeris files
- Lagrange points, atmospheric density and orbit decay, and orbit design helpers

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Getting started](https://phun-ky.net/interstellar-tools/guide/introduction/):
  installation, unit conventions and recommended practices
- [API reference for `@interstellar-tools/tracking`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/tracking/):
  every export, with formulas, parameters and examples

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher

```shell [npm]
npm i --save @interstellar-tools/tracking
```
