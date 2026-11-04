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
