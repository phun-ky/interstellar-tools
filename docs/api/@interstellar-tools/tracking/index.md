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

For a globe, `orbitPath3D` gives the orbit in 3D, Earth-fixed or inertial, and
`globeView` projects tracks and footprints onto a 2D globe, flagging the far
side. The
[tracking guide](https://phun-ky.net/interstellar-tools/guide/usage/tracking)
explains which frame to choose.

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

Or use `PROBES`: thirteen notable probes, from Voyager 1 to JWST and Parker
Solar Probe, with ephemerides from Horizons from November 2026 to the end of
2027:

```ts
import { PROBES, stateAt } from '@interstellar-tools/tracking';

const { near, ephemeris } = PROBES.find(({ id }) => id === 'jwst')!; // near: 'sun-earth-l2'
const { r, v } = stateAt(ephemeris, new Date()); // from the Sun, in m and m/s
```

A team flying its own satellite can fit mean elements to its GPS fixes or orbit
predictions, and publish them as a TLE or OMM:

```ts
import {
  earthFixedToTeme,
  fitElements,
  formatTle
} from '@interstellar-tools/tracking';

// GPS fixes are Earth-fixed: turn them into TEME, the frame SGP4 works in
const states = fixes.map(({ date, r, v }) => ({
  epoch: date,
  ...earthFixedToTeme({ r, v }, date)
}));
const fit = fitElements(states, states[states.length - 1].epoch);
const { position } = fit.rms; // how far SGP4 is from the fixes, in m

formatTle({ ...fit.elements, catalogNumber: 99_999 }); // [line1, line2]
```

For "what if" questions, propagate numerically with the forces you choose:
Earth's zonal harmonics, drag, the Sun and the Moon, sunlight and manoeuvres:

```ts
import { propagateNumerically } from '@interstellar-tools/tracking';

const ephemeris = propagateNumerically(state, from, to, {
  forces: { drag: { ballisticCoefficient: 60 } },
  manoeuvres: [{ epoch: burn, deltaV: [0, 1, 0], frame: 'rtn' }]
});
```

## What's planned

The
[Satellite tracking milestone](https://github.com/phun-ky/interstellar-tools/milestone/3)
tracks the work:

- **satellites**: anything in Earth orbit with public orbital elements, crewed
  vehicles like the ISS included: TLE and OMM parsing, SGP4 and SDP4, ground
  tracks, look angles, passes and eclipses, fitting elements to a team's own
  positions, and numerical propagation with a force model
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

| Interface                                                                                  | Description                                                                                                             |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| [ElementFitInterface](interfaces/ElementFitInterface.md)                                   | The result of [fitElements](functions/fitElements.md).                                                                  |
| [ElementFitResidualInterface](interfaces/ElementFitResidualInterface.md)                   | How far a fitted element set is from one of the states it was fitted to.                                                |
| [FitElementsOptionsInterface](interfaces/FitElementsOptionsInterface.md)                   | Options for [fitElements](functions/fitElements.md).                                                                    |
| [GlobeViewOptionsInterface](interfaces/GlobeViewOptionsInterface.md)                       | Options for [globeView](functions/globeView.md).                                                                        |
| [IsVisiblePassOptionsInterface](interfaces/IsVisiblePassOptionsInterface.md)               | Options for [isVisiblePass](functions/isVisiblePass.md).                                                                |
| [ManoeuvreInterface](interfaces/ManoeuvreInterface.md)                                     | An impulsive manoeuvre for [propagateNumerically](functions/propagateNumerically.md): a change of velocity at a moment. |
| [NumericalForcesInterface](interfaces/NumericalForcesInterface.md)                         | The forces for [propagateNumerically](functions/propagateNumerically.md), on top of Earth's central pull.               |
| [OrbitPath3DOptionsInterface](interfaces/OrbitPath3DOptionsInterface.md)                   | Options for [orbitPath3D](functions/orbitPath3D.md).                                                                    |
| [PredictPassesOptionsInterface](interfaces/PredictPassesOptionsInterface.md)               | Options for [predictPasses](functions/predictPasses.md).                                                                |
| [PropagateNumericallyOptionsInterface](interfaces/PropagateNumericallyOptionsInterface.md) | Options for [propagateNumerically](functions/propagateNumerically.md).                                                  |
| [StateAtOptionsInterface](interfaces/StateAtOptionsInterface.md)                           | Options for [stateAt](functions/stateAt.md).                                                                            |

## Probes

| Name                                                      | Description                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PROBES](variables/PROBES.md)                             | **Notable space probes**, with a dated ephemeris for each from JPL Horizons: where Voyager 1 is, how far New Horizons has gone, where JWST sits. With [stateAt](functions/stateAt.md), they answer "where is it now" without the network, from 1 November 2026 to 31 December 2027. |
| [parseHorizonsVectors](functions/parseHorizonsVectors.md) | Parse a **JPL Horizons vector table**: the positions and velocities Horizons gives for a spacecraft, planet or small body, as text or CSV. It's the easiest way to an ephemeris of a deep-space probe, such as Voyager 1 or Parker Solar Probe.                                     |
| [parseOem](functions/parseOem.md)                         | Parse a CCSDS **Orbit Ephemeris Message** (OEM) in its key-value (KVN) form: the standard space agencies exchange spacecraft ephemerides in, a table of positions and velocities over time.                                                                                         |
| [stateAt](functions/stateAt.md)                           | The **state of a spacecraft at any moment** of an ephemeris: its position and velocity, interpolated between the samples.                                                                                                                                                           |

## Satellites

| Name                                                              | Description                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SATELLITES](variables/SATELLITES.md)                             | A small **snapshot of well-known satellites**, with their elements as OMM records from CelesTrak, dated 4 November 2026. Examples, tests and demos work with it without the network.                                                                                                      |
| [coverageFootprint](functions/coverageFootprint.md)               | The **coverage footprint** of a satellite: the circle on the ground from which it's above a minimum elevation, as a polygon of latitudes and longitudes, ready to draw on a map.                                                                                                          |
| [dopplerShift](functions/dopplerShift.md)                         | The **Doppler shift** of a radio signal from a satellite: how far the received frequency is from the transmitted one, as the satellite approaches or leaves.                                                                                                                              |
| [earthFixedToTeme](functions/earthFixedToTeme.md)                 | Turn an **Earth-fixed** position and velocity, such as a GPS receiver's fix, into **TEME**, the frame SGP4 works in: the reverse of [temeToEarthFixed](functions/temeToEarthFixed.md). It's the first step in fitting elements to GPS fixes with [fitElements](functions/fitElements.md). |
| [earthShadow](functions/earthShadow.md)                           | Where a satellite is relative to **Earth's shadow**: in sunlight, in the penumbra where Earth covers part of the Sun, or in the umbra where it covers all of it.                                                                                                                          |
| [fitElements](functions/fitElements.md)                           | **Fit SGP4 mean elements** to a satellite's positions and velocities: turn a team's own orbit predictions, or the GPS fixes from on board, into a TLE or OMM that standard tools and ground station networks can use.                                                                     |
| [footprintRadius](functions/footprintRadius.md)                   | The **angular radius of a satellite's footprint**: how far from the point below it, as an angle at Earth's centre, the satellite is above the minimum elevation.                                                                                                                          |
| [formatOmm](functions/formatOmm.md)                               | Write mean elements as an **Orbit Mean-elements Message** (OMM) record, in the JSON form CelesTrak publishes: the reverse of [parseOmm](functions/parseOmm.md). Unlike a TLE, it keeps every digit, and has room for any catalogue number.                                                |
| [formatTle](functions/formatTle.md)                               | Write mean elements as a **two-line element set** (TLE), with checksums: the reverse of [parseTle](functions/parseTle.md), for tools and ground station networks that take TLEs, such as SatNOGS.                                                                                         |
| [globeView](functions/globeView.md)                               | Points on a **globe view**: the orthographic projection, a globe seen from far away, with the points on the far side marked hidden. It draws ground tracks and footprints on a 2D globe, without WebGL.                                                                                   |
| [groundTrack](functions/groundTrack.md)                           | The **ground track** of a satellite: the points on the ground directly below it over time, ready to draw on a flat map.                                                                                                                                                                   |
| [isInEarthShadow](functions/isInEarthShadow.md)                   | Whether a satellite is in **Earth's shadow**, taking the shadow as a cylinder as wide as Earth, straight back from the Sun. It's the usual quick test for whether a satellite is lit.                                                                                                     |
| [isVisiblePass](functions/isVisiblePass.md)                       | Whether a pass is a **visible pass**: the satellite lit by the Sun while the sky is dark for the observer, so it can be seen with the eye, a bright star moving steadily across the sky.                                                                                                  |
| [lookAngles](functions/lookAngles.md)                             | The **look angles** to a satellite from a ground observer at a moment: where to point an antenna or a camera (azimuth and elevation), how far away the satellite is (range), and how fast that changes (range rate, for the Doppler shift).                                               |
| [lookAnglesFromEarthFixed](functions/lookAnglesFromEarthFixed.md) | The **look angles** to a satellite from an observer, given the satellite's Earth-fixed position and velocity: azimuth, elevation, range and range rate. [lookAngles](functions/lookAngles.md) does the same from orbital elements.                                                        |
| [orbitPath3D](functions/orbitPath3D.md)                           | The **path of a satellite in 3D**, for drawing its orbit around a globe: positions from Earth's centre over time, in the frame and unit a renderer wants.                                                                                                                                 |
| [parseOmm](functions/parseOmm.md)                                 | Parse an **Orbit Mean-elements Message** (OMM) in JSON: the CCSDS format CelesTrak and Space-Track publish SGP4 elements in, next to TLEs. Unlike a TLE, it has room for catalogue numbers above 339 999.                                                                                 |
| [parseTle](functions/parseTle.md)                                 | Parse a **two-line element set** (TLE): the format NORAD has published satellite orbits in since the 1960s, for SGP4.                                                                                                                                                                     |
| [predictPasses](functions/predictPasses.md)                       | **Predict the passes** of a satellite over a ground observer between two moments: when it rises above the horizon, when it's highest, and when it sets. It's the first question a tracking app answers.                                                                                   |
| [propagate](functions/propagate.md)                               | Propagate a satellite's mean elements with **SGP4** to a moment: its position and velocity in the TEME frame. See [propagateMinutes](functions/propagateMinutes.md).                                                                                                                      |
| [propagateMinutes](functions/propagateMinutes.md)                 | Propagate a satellite's mean elements with **SGP4** to a number of minutes from their epoch: its position and velocity in the TEME frame.                                                                                                                                                 |
| [propagateNumerically](functions/propagateNumerically.md)         | **Propagate a satellite numerically** with a force model: Cowell's method, stepping the equations of motion with the forces you choose, for the "what if" questions SGP4 can't answer: a different mass or drag area, higher solar activity, or a manoeuvre.                              |
| [subSatellitePoint](functions/subSatellitePoint.md)               | Find the point on Earth **under a satellite** at a moment: the geodetic latitude, longitude and height on the WGS 84 ellipsoid.                                                                                                                                                           |
| [temeToEarthFixed](functions/temeToEarthFixed.md)                 | Turn a position and velocity in **TEME**, the frame SGP4 works in, into **Earth-fixed** coordinates, by turning them with Earth through Greenwich mean sidereal time.                                                                                                                     |
| [tleChecksum](functions/tleChecksum.md)                           | The **checksum** of a TLE line: the sum of its digits, with 1 for each minus sign, modulo 10. It's the last column of each line, and catches most typos.                                                                                                                                  |
