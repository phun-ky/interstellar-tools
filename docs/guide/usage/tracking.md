---
title: Tracking
description:
  Track satellites and deep-space probes with @interstellar-tools/tracking, from
  their elements and ephemerides, and the time scales they're given in.
---

# Tracking <Badge type="warning" text="0.x" />

Satellites and deep-space probes, from their orbital elements and ephemerides:
where they are, when they pass over, and how to draw them on a map or a globe.
These functions are in `@interstellar-tools/tracking`, which is still 0.x: its
API may change in a minor release.

```shell
npm i @interstellar-tools/tracking
```

Like the rest of Interstellar Tools, `tracking` fetches nothing: you pass it the
elements or ephemerides, and these pages say where to get them. The examples use
the snapshots of satellites and probes the package ships with, and every number
on these pages is checked by a test. Angles are in **radians** and lengths in
**metres**, unless a function is asked for another unit.

- **[Satellites](/guide/usage/tracking/satellites)**: orbital elements from
  CelesTrak, SGP4, look angles and passes, and drawing satellites on maps and
  globes.
- **[Probes](/guide/usage/tracking/probes)**: ephemerides from JPL Horizons and
  CCSDS messages, interpolated to any moment.
- **[Lagrange points](/guide/usage/tracking/lagrange-points)**: the five points
  where JWST, SOHO and the Trojan asteroids are parked.

## Time scales and sidereal time

A `Date` holds UTC, the civil clock, which steps by a leap second now and then.
Orbital work counts time on steadier clocks, and the libraries convert for you:
TLEs and OMMs give their epochs in UTC, and JPL Horizons gives its in TDB.

```ts
import { julianDate, taiMinusUtc } from '@interstellar-tools/temporal';

const date = new Date('2026-11-05T00:00:00Z');

julianDate(date); // 2461349.5, on the UTC clock
taiMinusUtc(date); // 37 leap seconds, counting the 10 UTC started with
julianDate(date, 'TT'); // 69.184 s later: TT = TAI + 32.184 s
julianDate(date, 'TDB'); // 1.4 ms behind TT this time of year
```

| Scale | What it is                                          | Where you'll meet it        |
| ----- | --------------------------------------------------- | --------------------------- |
| UTC   | Civil time, with leap seconds: what a `Date` holds  | TLE and OMM epochs          |
| TAI   | Atomic time, steady: 37 s ahead of UTC since 2017   | Behind the others           |
| TT    | TAI + 32.184 s, the time of most astronomy formulas | J2000, the Sun's position   |
| TDB   | Within 1.7 ms of TT, the time of the ephemerides    | JPL Horizons                |
| GPS   | TAI − 19 s, without leap seconds since 1980         | GPS receivers, some OEMs    |
| UT1   | Earth's actual rotation, within 0.9 s of UTC        | Taken as UTC: it's measured |

Earth's rotation is measured by **sidereal time**: the angle from the vernal
equinox to the Greenwich meridian. It turns a position in space, fixed to the
stars, into a point on the turning ground. SGP4's frame, TEME, is turned by
Greenwich mean sidereal time:

```ts
import { greenwichMeanSiderealTime } from '@interstellar-tools/equations';

greenwichMeanSiderealTime(date); // ≈ 0.7721 rad, 44.24°
```

The satellite functions make this turn themselves: `temeToEarthFixed`,
`subSatellitePoint` and `lookAngles` take a `Date` and work out the rest.
