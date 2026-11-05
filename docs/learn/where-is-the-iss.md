# Where is the ISS, and when can I see it?

The International Space Station circles Earth every 93 minutes, 400 km up. On
the right evening it crosses the sky as one of the brightest things in it, a
steady light moving faster than any plane. In this tutorial you'll find where it
is, draw its track on a map, and work out when it can be seen from Nairobi.

- **You'll use:** `SATELLITES`, `parseOmm`, `propagate`, `subSatellitePoint`,
  `groundTrack`, `predictPasses`, `isVisiblePass`, `PROBES`, `stateAt`,
  `lagrangePoints`
- **Time:** about 15 minutes

<DocPhoto
  src="geodesy/earth-limb-iss.webp"
  alt="Earth's curved horizon from orbit, with the thin blue band of the atmosphere above clouds and ocean"
  :width="1600"
  :height="1067"
  credit="NASA Johnson Space Center"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:Iss064e006316_(Nov_21,_2020)_---_Earth%27s_limb,_or_horizon,_is_pictured_from_the_International_Space_Station_as_it_orbited_above_the_Pacific_Ocean_off_the_coast_of_Chile.jpg">

The view from the ISS: Earth's horizon over the Pacific off Chile.

</DocPhoto>

## 1. The elements, and their date

A satellite's orbit is published as **orbital elements**: an orbit fitted to its
tracking at a moment, the epoch. `@interstellar-tools/tracking` ships with a
snapshot of a dozen satellites, the ISS among them:

```ts
import { parseOmm, SATELLITES } from '@interstellar-tools/tracking';

const iss = parseOmm(SATELLITES.find(({ id }) => id === 'iss')!.omm);

iss.epoch.toISOString(); // '2026-11-04T21:15:15.205Z'
```

That date matters. The elements describe the orbit as it was at the epoch, and
the real ISS drifts away from them by a few kilometres a day as the thin upper
atmosphere drags on it. Every few weeks it fires its engines to climb back up,
and then old elements are of no use at all.

So this tutorial stays within three days of the epoch, where the elements are
good to a few kilometres. For where the ISS is today, fetch fresh elements from
CelesTrak, as the
[satellites guide](/guide/usage/tracking/satellites#orbital-elements) shows, and
run the same code.

## 2. Where it is

The elements go through **SGP4**, the model they were fitted for: it allows for
Earth's flattening, the drag, and the pulls of the Sun and the Moon. `propagate`
gives the position and velocity at any moment, and `subSatellitePoint` the point
on the ground directly below:

```ts
import { propagate, subSatellitePoint } from '@interstellar-tools/tracking';

const { r, v } = propagate(iss, iss.epoch); // m and m/s
const speed = Math.hypot(...v); // ≈ 7 670 m/s: 27 600 km/h
const below = subSatellitePoint(iss, iss.epoch); // 0.00° N, 39.10° W, 415.1 km up
```

At the epoch, the ISS is crossing the equator heading north, over the Atlantic
off the north coast of Brazil. Element sets are often dated at such a crossing.

## 3. Its track on a map

Step `subSatellitePoint` through an orbit and you have the ISS's **ground
track**. `groundTrack` does it, and splits the track where it crosses the
antimeridian, so a map never draws a line across the whole world:

```ts
import { groundTrack } from '@interstellar-tools/tracking';

const period = ((2 * Math.PI) / iss.meanMotion) * 1000; // 92.95 minutes, in ms
const orbit = new Date(iss.epoch.getTime() + period);
const segments = groundTrack(iss, iss.epoch, orbit); // lines of { phi, lambda }
```

Draw three orbits, and the tracks don't line up:

<IssGroundTrack>

Three orbits of the ISS from the epoch. Each crosses the equator heading north
23.6° west of the one before. The orbit stays put in space; Earth turns under
it.

</IssGroundTrack>

In the 92.95 minutes of an orbit, Earth turns 23.3° east under the ISS, so the
next track lies that far west. Earth's equatorial bulge also turns the orbit
itself 0.3° west each time, which adds up to the 23.6° on the map. After about
15.5 orbits, a day, the tracks cover every longitude between 51.6° N and S, the
orbit's inclination.

## 4. When it can be seen

Seeing the ISS takes three things at once: it must be above the horizon, the sky
must be dark, and the ISS itself must be in sunlight, high enough to catch the
Sun after it has set on the ground. `predictPasses` finds when it's above the
horizon, and `isVisiblePass` checks the rest:

```ts
import { isVisiblePass, predictPasses } from '@interstellar-tools/tracking';

const toRad = (deg: number) => (deg * Math.PI) / 180;
const nairobi = { phi: toRad(-1.2864), lambda: toRad(36.8172), h: 1795 };
const later = new Date(iss.epoch.getTime() + 3 * 86_400_000);
const passes = predictPasses(iss, nairobi, iss.epoch, later, {
  minElevation: toRad(10) // above trees and buildings
}); // 8 passes in three days
const visible = passes.filter((pass) => isVisiblePass(iss, nairobi, pass)); // 3
```

Of eight passes over Nairobi in three days, three can be seen. The best is the
first:

```ts
const { rise, maxElevation, set } = visible[0]!;
// rise: 15:46:13 UTC, 18:46 in Nairobi, in the south-west
// maxElevation: ≈ 1.550 rad, 88.8°, almost straight overhead
// set: 15:52:50 UTC, in the north-east
```

::: practice The ISS over Nairobi, 5 November 2026

**88.8°**

_Its highest, at 18:49 local time, 413 km overhead_

The Sun set at 18:22, nearly half an hour before, and is 7.6° below the horizon:
the sky is darkening, but the ISS, 400 km up, is still in full sunlight. It
rises in the south-west, passes almost straight overhead, and sets in the
north-east six and a half minutes later.

:::

The other two are low: 18.6° before dawn on 7 November, and 15.5° that evening.

## 5. Bonus: why JWST sits at L2

The James Webb Space Telescope is much farther out. It's in the `PROBES`
snapshot, with an ephemeris from JPL Horizons:

```ts
import { sunPosition } from '@interstellar-tools/equations';
import { PROBES, stateAt } from '@interstellar-tools/tracking';

const jwst = PROBES.find(({ id }) => id === 'jwst')!;
const { r } = stateAt(jwst.ephemeris, iss.epoch); // from the Sun
// Farther from the Sun than Earth: ≈ 1 424 580 km
const beyond = Math.hypot(...r) - sunPosition(iss.epoch).distance;
```

That puts it near the Sun-Earth **L2** point, 1.5 million km beyond Earth, on
the far side from the Sun:

```ts
import { AU_METERS } from '@interstellar-tools/constants';
import { lagrangePoints } from '@interstellar-tools/equations';

// The Sun, and Earth and the Moon together, 1 au apart
const { L2 } = lagrangePoints(1.32712440041e20, 4.0350323e14, AU_METERS);
// 1 507 683 km beyond Earth
```

So far out, a body would normally circle the Sun more slowly than Earth, and
fall behind. At L2, Earth's pull adds to the Sun's just enough that it keeps
pace with Earth instead, a year to the orbit. JWST circles L2 in a halo orbit,
which is why it's not exactly on the point, and keeps the Sun, Earth and the
Moon all on one side, behind its sunshield, while it looks out at the cold, dark
rest of the sky.

## 6. Try it yourself

- Houston, at 29.76° N, 95.37° W, has three visible passes in the same three
  days, all before dawn. Which is highest?
- Lower `minElevation` to 0. How many more passes are there, and can any of them
  be seen?
- Propagate the snapshot a month on and compare it with fresh elements from
  CelesTrak. How far apart are they?

To go further, the [tracking guide](/guide/usage/tracking) covers look angles,
the Doppler shift, footprints, 3D globes and deep-space probes.
