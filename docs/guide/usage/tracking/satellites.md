---
title: Satellites
description:
  Track satellites with @interstellar-tools/tracking, from orbital elements and
  SGP4 to look angles, passes, maps and globes.
---

# Satellites <Badge type="warning" text="0.x" />

Anything in Earth orbit with public orbital elements, from the ISS to a
geostationary weather satellite: where it is, when it passes over, and how to
draw it. The examples use `SATELLITES`, a snapshot of twelve satellites dated 4
November 2026.

```ts
import { WGS84 } from '@interstellar-tools/constants';
import { parseOmm, SATELLITES } from '@interstellar-tools/tracking';

const satellite = (id: string) =>
  parseOmm(SATELLITES.find((entry) => entry.id === id)!.omm);
const iss = satellite('iss');
const goes19 = satellite('goes-19');
const toRad = (deg: number) => (deg * Math.PI) / 180;
const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
const date = new Date('2026-11-05T00:00:00Z');
```

## Orbital elements

A satellite's orbit is published as **mean elements**: an orbit fitted to its
tracking, at an epoch. [CelesTrak](https://celestrak.org/) publishes them for
every satellite in the US Space Force's public catalogue, in two formats:

- **OMM** (Orbit Mean-elements Message), the CCSDS standard, in JSON. Use it:
  it's easy to read, and has room for every catalogue number.
- **TLE** (two-line element set), the format since the 1960s, in fixed columns.
  Five-digit catalogue numbers ran out in July 2026: newer objects have six
  digits, which TLEs can't hold.

```ts
import { parseOmm, parseTle } from '@interstellar-tools/tracking';

const response = await fetch(
  'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=json'
);
const [fresh] = (await response.json()).map(parseOmm);
```

Both give the same `MeanElementsInterface`, in radians and rad/s. CelesTrak
updates its data every 2 hours, and asks that you fetch no more often than that.

### SGP4, not Kepler

Mean elements aren't the satellite's orbit at the epoch, but the averaged orbit
SGP4 was fitted with: they only give correct positions through SGP4, which
models Earth's flattening, the drag of the upper atmosphere, and the pulls of
the Sun and the Moon.

```ts
import { propagate } from '@interstellar-tools/tracking';

const { r, v } = propagate(iss, date); // m and m/s, in the TEME frame
```

Run Kepler's equations on the same elements, as if they were an ordinary orbit,
and the ISS is 11.7 km off at the epoch, 15.1 km off an hour later, and 469 km
off a day later.

### Accuracy and staleness

SGP4 is good to about a kilometre at the epoch, and the error grows by a few
kilometres a day, more for low orbits and when the Sun is active. A manoeuvre or
a reboost changes the orbit outright. Two ISS element sets published 12 hours
apart, on 4 November 2026, agree to 0.21 km at the later epoch, and drift apart
by 0.50 km in a day and 1.46 km in three.

Fetch fresh elements for anything that matters, and treat a snapshot, like
`SATELLITES`, as a few days' worth of examples.

## Where it is

`subSatellitePoint` gives the point on the ground directly below a satellite,
and its height above the WGS 84 ellipsoid:

```ts
import { subSatellitePoint } from '@interstellar-tools/tracking';

subSatellitePoint(iss, date); // 51.01° S, 157.48° W, 434 959 m up
```

### Look angles and passes

From the ground, `lookAngles` says where to point: the azimuth, clockwise from
north, and the elevation above the horizon, with the range and how fast it
changes. `predictPasses` finds when a satellite rises and sets.

```ts
import {
  dopplerShift,
  isVisiblePass,
  lookAngles,
  predictPasses
} from '@interstellar-tools/tracking';

const later = new Date('2026-11-06T00:00:00Z');
const passes = predictPasses(iss, oslo, date, later, {
  minElevation: toRad(10)
});
// Two above 10°: 00:43 UTC, up to 18.6° in the south, and 22:20 UTC, 17.4°
const atRise = lookAngles(iss, oslo, passes[0]!.rise);
// 1 508 km away, closing at 4.91 km/s
// The ISS's amateur radio downlink, 145.800 MHz, arrives 2 389 Hz higher
const shift = dopplerShift(145_800_000, atRise.rangeRate);
// [false, false]: in Earth's shadow both times
const visible = passes.map((pass) => isVisiblePass(iss, oslo, pass));
```

Neither pass can be seen with the eye: the ISS is in Earth's shadow both times.
`isVisiblePass` looks for the satellite in sunlight while the observer's Sun is
below −6°, so a satellite is easiest to see shortly after dusk or before dawn.
Low orbits are in Earth's shadow for over a third of each orbit, the ISS for 36%
of this day: `earthShadow` and `isInEarthShadow` tell, given the Sun's position
from `sunPosition`.

## On a map

`groundTrack` gives the track below a satellite over time, split where it
crosses the antimeridian, so a renderer never draws a line across the whole map.
`coverageFootprint` gives the circle on the ground from which the satellite is
above a minimum elevation.

```ts
import {
  coverageFootprint,
  footprintRadius,
  groundTrack
} from '@interstellar-tools/tracking';

const segments = groundTrack(iss, date, later); // lines of { phi, lambda, h }
const below = subSatellitePoint(iss, date);
const footprint = coverageFootprint(below, toRad(10)); // 72 points, every 5°

footprintRadius(below.h); // ≈ 0.3593 rad, 20.58°: 2 291 km to the horizon
footprintRadius(below.h, toRad(10)); // ≈ 0.2232 rad, 12.79°: above 10°
```

<figure class="guide-figure">
<svg viewBox="0 0 640 320" role="img" aria-labelledby="fp-title fp-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="fp-title">A satellite's footprint</title>
  <desc id="fp-desc">A satellite at height h above Earth. At the edge of its footprint, the satellite stands at the minimum elevation epsilon above the horizon. The footprint's radius is the angle lambda zero at Earth's centre, between the point below the satellite and the edge.</desc>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M20 300 A180 180 0 0 1 380 300" />
    <path d="M200 300 V60" stroke-dasharray="4 4" stroke-opacity="0.6" />
    <path d="M200 300 L276.1 136.9" stroke-dasharray="4 4" stroke-opacity="0.6" />
    <path d="M212.7 107.4 L339.5 166.5" stroke-opacity="0.45" />
  </g>
  <g fill="none" stroke-width="2">
    <path class="accent" d="M200 60 L276.1 136.9" />
    <path class="accent-2" d="M200 120 A180 180 0 0 1 276.1 136.9" />
    <path class="accent-2" d="M200 260 A40 40 0 0 1 216.9 263.7" />
  </g>
  <circle class="accent-fill" cx="200" cy="60" r="5" />
  <circle cx="276.1" cy="136.9" r="3" fill="currentColor" />
  <g font-family="var(--vp-font-family-mono)" font-size="13" fill="currentColor">
    <text x="184" y="94">h</text>
    <text x="236" y="122">ε</text>
    <text x="206" y="250" class="accent-2-text">λ₀</text>
    <text x="214" y="56">satellite</text>
    <text x="284" y="132">edge</text>
  </g>
  <g font-family="var(--vp-font-family-base)" font-size="13" fill="currentColor">
    <text x="410" y="120" class="accent-2-text">λ₀ = arccos(R cos ε / (R + h)) − ε</text>
    <text x="410" y="138">the footprint's radius,</text>
    <text x="410" y="156">as an angle at Earth's centre</text>
    <text x="410" y="190" class="accent-text">at the edge, the satellite</text>
    <text x="410" y="208">stands ε above the horizon</text>
  </g>
</svg>
<figcaption>The footprint shrinks as the minimum elevation rises, and grows with height, toward 90° − ε.</figcaption>
</figure>

The points are in radians, ready for the projections in
[`@interstellar-tools/maps`](/guide/usage/maps). A footprint across the
antimeridian or over a pole wraps: split it, or draw it on an azimuthal
projection, before filling it.

## On a globe

`orbitPath3D` gives a satellite's positions from Earth's centre over time, for
drawing its orbit around a 3D globe. Pass `unit` to choose the unit: Earth's
radius gives a globe of radius 1.

### Earth-fixed or inertial

The same orbit looks different depending on what holds still. Take GOES-19, a
geostationary weather satellite, over a day:

```ts
import { orbitPath3D } from '@interstellar-tools/tracking';

const R = WGS84.equatorialRadius.value;

orbitPath3D(goes19, date, later, { step: 21_600, unit: R });
// [1.688, -6.391, -0.001], [1.688, -6.392, 0.000], ... : still

orbitPath3D(goes19, date, later, { step: 21_600, unit: R, frame: 'inertial' });
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
import { globeView } from '@interstellar-tools/tracking';

const orbit = new Date(date.getTime() + 92.95 * 60_000); // one orbit
const track = groundTrack(iss, date, orbit).flat();
const view = globeView(track, 200, { phi0: oslo.phi, lambda0: oslo.lambda });
const near = view.filter(({ visible }) => visible); // 48 of the 94 points
```

Every point gets `x` and `y`, the hidden ones mirrored onto the disc, so a
renderer can draw the far side faintly, or break the line where it goes behind.
Footprints from `coverageFootprint` project the same way.

## Your own elements

A team flying its own satellite has better positions than anyone: GPS fixes from
on board, or its own orbit predictions. `fitElements` turns them into mean
elements, by least squares, the way published element sets are made, and
`formatTle` and `formatOmm` write them for the tools and ground station
networks, such as [SatNOGS](https://satnogs.org/), that take TLEs and OMMs.

```ts
import {
  earthFixedToTeme,
  fitElements,
  formatOmm,
  formatTle
} from '@interstellar-tools/tracking';

// GPS fixes from on board: Earth-fixed, in m and m/s, time-tagged in UTC
const states = fixes.map(({ date, r, v }) => ({
  epoch: date,
  ...earthFixedToTeme({ r, v }, date)
}));
// Put the epoch at the end, where the next passes are
const fit = fitElements(states, states[states.length - 1].epoch);
const elements = { ...fit.elements, catalogNumber: 99_999, name: 'CUBESAT' };

formatTle(elements); // [line1, line2]
formatOmm(elements); // one OMM record, for JSON.stringify
```

Check `fit.converged` and the residuals, `fit.rms`: they tell how well SGP4
matches the states. Fitted to two days of the ISS's positions, every 5 minutes,
with 10 m of noise in each direction, the residuals come out at 18 m, the
noise's size, and the fitted orbit stays within 6 m of the true one, a day past
the last state too.

Give it a day or more of states, so drag has time to show: from a shorter arc,
B*, SGP4's drag term, is poorly determined, and it's better to pass the last
published one as `bstar`.

## Next

- [Probes](/guide/usage/tracking/probes): deep-space spacecraft, which have no
  TLEs, from their ephemerides.
- The [tracking reference](/api/@interstellar-tools/tracking/) has every
  function, with its formula and limits.

<style>
.guide-figure { margin: 24px 0; }
.guide-figure svg { width: 100%; height: auto; color: var(--vp-c-text-1); }
.guide-figure .accent { stroke: var(--vp-c-brand-1); }
.guide-figure .accent-2 { stroke: var(--vp-c-warning-1); }
.guide-figure .accent-fill { fill: var(--vp-c-brand-1); }
.guide-figure .accent-text { fill: var(--vp-c-brand-1); }
.guide-figure .accent-2-text { fill: var(--vp-c-warning-1); }
.guide-figure figcaption { font-size: 14px; color: var(--vp-c-text-2); margin-top: 8px; }
</style>
