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

Then propagate the elements with SGP4, the model they were fitted for, to get
the satellite's position and velocity in the TEME frame, in m and m/s:

```ts
import { propagate } from '@interstellar-tools/tracking';

const { r, v } = propagate(iss, new Date('2026-11-04T12:00:00Z'));
```

It matches the verification set of Vallado et al. (2006), _Revisiting Spacetrack
Report #3_, to a millimetre. For orbits of 225 minutes or more it runs as SDP4,
with the pull of the Moon and Sun.

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
