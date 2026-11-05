---
title: Probes
description:
  Position deep-space probes with @interstellar-tools/tracking, from JPL
  Horizons and CCSDS ephemerides, interpolated to any moment.
---

# Probes <Badge type="warning" text="0.x" />

Deep-space probes, such as Voyager 1, New Horizons and JWST, have no TLEs: SGP4
is for Earth orbit. Their positions are published as **ephemerides**, tables of
positions and velocities over time, computed by the missions' navigation teams
and published by JPL Horizons, or exchanged between agencies as CCSDS Orbit
Ephemeris Messages.

## The probes snapshot

`PROBES` holds eleven notable probes, with an ephemeris for each from JPL
Horizons, from 1 November 2026 to 31 December 2027: where Voyager 1 is, how far
New Horizons has gone, where JWST sits.

```ts
import {
  AU_METERS,
  SPEED_OF_LIGHT_M_PER_S
} from '@interstellar-tools/constants';
import { PROBES, stateAt } from '@interstellar-tools/tracking';

const date = new Date('2026-11-05T00:00:00Z');
const voyager1 = PROBES.find(({ id }) => id === 'voyager-1')!;
const { r, v } = stateAt(voyager1.ephemeris, date); // from the Sun, m and m/s
const au = Math.hypot(...r) / AU_METERS; // ≈ 172.26
const hours = Math.hypot(...r) / SPEED_OF_LIGHT_M_PER_S / 3600; // ≈ 23.88
const speed = Math.hypot(...v); // ≈ 16 920 m/s, leaving the Solar System
```

Light from the Sun takes almost a day to reach it. Each probe also has its
agencies, launch date, status, what it's near (`'sun'`, or `'sun-earth-l2'` for
JWST) and where it's headed, as ids from the body datasets in
`@interstellar-tools/constants`. New Horizons is 65.99 au out; JWST, at
Sun-Earth L2, is 1.00 au from the Sun, just beyond Earth.

Positions are from the Sun's centre, in the ICRF. For one from Earth, subtract
Earth's position: from Horizons, or roughly from `sunPosition` in
`@interstellar-tools/equations`, which gives the Sun from Earth.

## From JPL Horizons

[JPL Horizons](https://ssd.jpl.nasa.gov/horizons/), the Solar System Dynamics
group's ephemeris service, has nearly every spacecraft, planet and small body.
Ask its API for vectors with velocities, `VEC_TABLE=2`, on the ICRF's equatorial
axes, `REF_PLANE=FRAME`, and parse the text it returns:

```ts
import { parseHorizonsVectors } from '@interstellar-tools/tracking';

const query = new URLSearchParams({
  format: 'text',
  COMMAND: '-31', // Voyager 1
  EPHEM_TYPE: 'VECTORS',
  VEC_TABLE: '2', // positions and velocities
  REF_PLANE: 'FRAME', // the ICRF's equatorial axes
  CENTER: '500@10', // the Sun's centre
  START_TIME: '2026-01-01',
  STOP_TIME: '2026-01-11',
  STEP_SIZE: '1d'
});
const response = await fetch(
  `https://ssd.jpl.nasa.gov/api/horizons.api?${query}`
);
const ephemeris = parseHorizonsVectors(await response.text());
```

Each probe in `PROBES` has its Horizons id in `horizonsId`, for `COMMAND`. The
parser reads the target, centre, frame, units and time scale from the header,
and returns positions in m and velocities in m/s, with UTC `Date`s converted
from Horizons' TDB.

## From a CCSDS message

Space agencies exchange ephemerides as CCSDS **Orbit Ephemeris Messages**. In
their key-value form, they start with metadata, then a line per sample:

```text
CCSDS_OEM_VERS = 3.0
CREATION_DATE = 1996-11-04T17:22:31
ORIGINATOR = NASA/JPL

META_START
OBJECT_NAME = MARS GLOBAL SURVEYOR
OBJECT_ID = 1996-062A
CENTER_NAME = MARS BARYCENTER
REF_FRAME = EME2000
TIME_SYSTEM = UTC
START_TIME = 2019-12-18T12:00:00.331
STOP_TIME = 2019-12-28T21:28:00.331
META_STOP

2019-12-18T12:00:00.331 2789.619 -280.045 -1746.755 4.73372 -2.49586 -1.04195
2019-12-18T12:01:00.331 2783.419 -308.143 -1877.071 5.18604 -2.42124 -1.99608
```

`parseOem` returns one ephemeris per segment. A new `META_START` starts a new
segment, often at a manoeuvre, and the standard forbids interpolating across
them: pick the segment that covers the moment you want.

```ts
import { parseOem } from '@interstellar-tools/tracking';

const segments = parseOem(text); // one, MARS GLOBAL SURVEYOR
```

## Between the samples

`stateAt` interpolates an ephemeris to any moment within it. It fits a Hermite
polynomial through the positions **and** velocities of the four samples around
the date, so the path bends as the probe's does, and returns a sample exactly at
its own epoch.

```ts
const { r, v } = stateAt(ephemeris, new Date('2026-01-05T06:00:00Z'));
```

Through Parker Solar Probe's perihelion in June 2025, 7 million km from the
Sun's centre at 190 km/s, samples six hours apart interpolate to within 137 km
of Horizons' hourly positions; a straight line between them is 162 000 km off.
Space the samples to suit the motion: a day for a probe in cruise, minutes
through a flyby. Outside the ephemeris, `stateAt` throws rather than guess.

## Next

- [Lagrange points](/guide/usage/tracking/lagrange-points): where JWST is
  parked, and why it can stay.
- The [tracking reference](/api/@interstellar-tools/tracking/) has every
  function, with its formula and limits.
