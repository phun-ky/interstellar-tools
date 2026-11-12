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

`PROBES` holds thirteen notable probes, with an ephemeris for each from JPL
Horizons, from 1 November 2026 to 31 December 2027: where Voyager 1 is, how far
New Horizons has gone, where JWST sits.

<DocPhoto
  src="probes/voyager.webp"
  alt="A Voyager spacecraft in flight against the stars: a large white dish antenna on a gold-wrapped body, a boom of instruments above it, and a long thin boom reaching away to the right"
  :width="1600"
  :height="1323"
  credit="NASA/JPL"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:Voyager_spacecraft.jpg">

Voyager, in an artist's concept. The twin probes, launched sixteen days apart in
1977, are the same: a 3.7 m dish to talk to Earth, a boom of science
instruments, and a 13 m boom that holds the magnetometer away from the
spacecraft. Both are still sending data, from beyond the heliopause.

</DocPhoto>

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

## Out of the Sun's bubble

The solar wind blows a bubble into the gas between the stars: the heliosphere.
Where the wind slows below the speed of sound is the termination shock, and
where it meets the interstellar gas is the heliopause. The Voyagers have crossed
both, and the Sun's entry in `STARS` keeps where and when:

```ts
import { STARS } from '@interstellar-tools/constants';

const sun = STARS.find(({ id }) => id === 'sun')!;
const { astropause, crossings } = sun.observations!.astrosphere!;
const nose = astropause!.nose!.value; // 115: au to the heliopause, upwind
const crossed = crossings!.map(({ probeId, boundary, distance }) =>
  [probeId, boundary, distance.value].join(' ')
);
// ['voyager-1 termination shock 94.01', 'voyager-2 termination shock 83.7',
//  'voyager-1 astropause 121.6', 'voyager-2 astropause 119']
```

<HeliosphereSideView>

The heliosphere side on, the interstellar wind from the left. The heliopause is
drawn as a blunt body in a steady flow, sized by its 115 au to the nose: that
puts its flanks at 181 au, where IBEX measured 170 ± 15 au, and Voyager 1's
crossing at 120 au, where it crossed at 121.6 au. Voyager 2 crossed 14 au inside
it, where the bubble is pushed in on the south. The termination shock is drawn
only where the Voyagers crossed it. The paths are from JPL Horizons, from launch
to 2027, seen in the plane through the nose and ecliptic north.

</HeliosphereSideView>

Pioneer 10 is heading the other way, down the tail, where the heliopause is at
least 350 au out. Only the Voyagers are still sending, and Voyager 1's signal
takes almost a day to reach us:

<ProbeDistanceScale>

The planets, the Kuiper belt, the heliosphere's boundaries and five probes on 5
November 2026, each step of the scale ten times farther than the last, with how
long each probe's signal takes to reach us. The planets and the belt are from
`PLANETS` and `ASTEROID_BELTS`, the boundaries from the Voyagers' crossings, and
the probes from `PROBES` with `stateAt`.

</ProbeDistanceScale>

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
