[Documentation](../../index.md) /
[**@interstellar-tools/tracking**](https://github.com/interstellar-tools/tracking)

# [**@interstellar-tools/tracking**](https://github.com/interstellar-tools/tracking)

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
Report [#3](https://github.com/phun-ky/interstellar-tools/issues/3)_, to a
millimetre. For orbits of 225 minutes or more it runs as SDP4, with the pull of
the Moon and Sun.

And find the point on Earth under the satellite, on the WGS 84 ellipsoid:

```ts
import { subSatellitePoint } from '@interstellar-tools/tracking';

const { phi, lambda, h } = subSatellitePoint(iss, new Date());
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

## Interfaces

| Interface                                                                    | Description                                              |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| [IsVisiblePassOptionsInterface](interfaces/IsVisiblePassOptionsInterface.md) | Options for [isVisiblePass](functions/isVisiblePass.md). |
| [PredictPassesOptionsInterface](interfaces/PredictPassesOptionsInterface.md) | Options for [predictPasses](functions/predictPasses.md). |

## Satellites

| Name                                                              | Description                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SATELLITES](variables/SATELLITES.md)                             | A small **snapshot of well-known satellites**, with their elements as OMM records from CelesTrak, dated 4 November 2026. Examples, tests and demos work with it without the network.                                                        |
| [dopplerShift](functions/dopplerShift.md)                         | The **Doppler shift** of a radio signal from a satellite: how far the received frequency is from the transmitted one, as the satellite approaches or leaves.                                                                                |
| [earthShadow](functions/earthShadow.md)                           | Where a satellite is relative to **Earth's shadow**: in sunlight, in the penumbra where Earth covers part of the Sun, or in the umbra where it covers all of it.                                                                            |
| [isInEarthShadow](functions/isInEarthShadow.md)                   | Whether a satellite is in **Earth's shadow**, taking the shadow as a cylinder as wide as Earth, straight back from the Sun. It's the usual quick test for whether a satellite is lit.                                                       |
| [isVisiblePass](functions/isVisiblePass.md)                       | Whether a pass is a **visible pass**: the satellite lit by the Sun while the sky is dark for the observer, so it can be seen with the eye, a bright star moving steadily across the sky.                                                    |
| [lookAngles](functions/lookAngles.md)                             | The **look angles** to a satellite from a ground observer at a moment: where to point an antenna or a camera (azimuth and elevation), how far away the satellite is (range), and how fast that changes (range rate, for the Doppler shift). |
| [lookAnglesFromEarthFixed](functions/lookAnglesFromEarthFixed.md) | The **look angles** to a satellite from an observer, given the satellite's Earth-fixed position and velocity: azimuth, elevation, range and range rate. [lookAngles](functions/lookAngles.md) does the same from orbital elements.          |
| [parseOmm](functions/parseOmm.md)                                 | Parse an **Orbit Mean-elements Message** (OMM) in JSON: the CCSDS format CelesTrak and Space-Track publish SGP4 elements in, next to TLEs. Unlike a TLE, it has room for catalogue numbers above 339 999.                                   |
| [parseTle](functions/parseTle.md)                                 | Parse a **two-line element set** (TLE): the format NORAD has published satellite orbits in since the 1960s, for SGP4.                                                                                                                       |
| [predictPasses](functions/predictPasses.md)                       | **Predict the passes** of a satellite over a ground observer between two moments: when it rises above the horizon, when it's highest, and when it sets. It's the first question a tracking app answers.                                     |
| [propagate](functions/propagate.md)                               | Propagate a satellite's mean elements with **SGP4** to a moment: its position and velocity in the TEME frame. See [propagateMinutes](functions/propagateMinutes.md).                                                                        |
| [propagateMinutes](functions/propagateMinutes.md)                 | Propagate a satellite's mean elements with **SGP4** to a number of minutes from their epoch: its position and velocity in the TEME frame.                                                                                                   |
| [subSatellitePoint](functions/subSatellitePoint.md)               | Find the point on Earth **under a satellite** at a moment: the geodetic latitude, longitude and height on the WGS 84 ellipsoid.                                                                                                             |
| [temeToEarthFixed](functions/temeToEarthFixed.md)                 | Turn a position and velocity in **TEME**, the frame SGP4 works in, into **Earth-fixed** coordinates, by turning them with Earth through Greenwich mean sidereal time.                                                                       |
| [tleChecksum](functions/tleChecksum.md)                           | The **checksum** of a TLE line: the sum of its digits, with 1 for each minus sign, modulo 10. It's the last column of each line, and catches most typos.                                                                                    |
