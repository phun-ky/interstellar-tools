---
title: Galaxies in 3D
description:
  Draw the galaxies in the datasets around the Milky Way's centre, in 3D, with
  galactocentricPosition from @interstellar-tools/equations.
---

# Galaxies in 3D

`GALAXIES` in `@interstellar-tools/constants` gives each galaxy's distance and
direction as they're measured: from the Sun. To draw them around the Milky Way's
centre, `galactocentricPosition` in `@interstellar-tools/equations` moves them
there, `galactocentricVelocity` sets them moving, and `galaxyDiskAxis` turns
their disks. Every number on this page is checked by a test.

[[toc]]

## What a galaxy carries

- `distance`, from the Sun, in light-years.
- `direction`, from the Sun, in galactic coordinates, in degrees: the longitude
  `l` along the Milky Way's plane, from 0° towards its centre, and the latitude
  `b` above it. The Milky Way has none, since the Sun is in it.
- `motion`, from the Sun: the velocity along the line of sight in km/s, positive
  moving away, and for the Local Group, the proper motion across the sky in
  mas/yr.
- `disk`, for the disk galaxies: how the disk is turned on the sky.

Both stay measured from the Sun, because that's where every observation is made
from. The Sun's own place in the Milky Way is in two constants:

- `SUN_GALACTOCENTRIC_DISTANCE`, $R_0$: 8275.9 pc from the centre (GRAVITY
  Collaboration 2024), the same as Sagittarius A\*'s distance.
- `SUN_HEIGHT_ABOVE_GALACTIC_PLANE`, $z_\odot$: 20.8 pc above the plane (Bennett
  & Bovy 2019).
- `SUN_GALACTOCENTRIC_VELOCITY`: (12.9, 251.51, 8.56) km/s, from the motion of
  Sagittarius A\* across the sky (Reid & Brunthaler 2020), which is the Sun's,
  reflected.

## Where Andromeda is

`galactocentricPosition` takes a direction and a distance, and gives a position
in the `'galactocentric'` frame, in the distance's unit or the one you ask for:

```ts
import { GALAXIES } from '@interstellar-tools/constants';
import { galactocentricPosition } from '@interstellar-tools/equations';

const andromeda = GALAXIES.find(({ id }) => id === 'andromeda')!;
const { x, y, z } = galactocentricPosition(
  andromeda.direction!,
  andromeda.distance,
  { unit: 'kpc' }
);
const position = [x.value, y.value, z.value]; // [-375.31, 605.50, -278.87] kpc
const fromCentre = Math.hypot(...position); // 765.02 kpc
```

Andromeda is 761.00 kpc from the Sun, and 765.02 kpc from the Milky Way's
centre.

## The frame

The frame is Astropy's `Galactocentric`:

- The origin is the Milky Way's centre, $R_0$ from the Sun towards galactic
  longitude and latitude 0°.
- `x` points from the Sun towards the centre.
- `y` points the way the Sun moves around it, towards galactic longitude 90°.
- `z` points to the galaxy's north pole, out of its disk.

The galactic equator runs through the Sun, which is $z_\odot$ above the plane.
So the plane is tilted from the equator by $\arcsin(z_\odot / R_0)$, 0.144°. The
positions match Astropy's to a few parts in a million of the distance.

## Where the Sun is

The Sun is at distance 0. Any direction will do:

```ts
import { galactocentricPosition } from '@interstellar-tools/equations';
import type { DegreesType } from '@interstellar-tools/types';

const here = { l: 0 as DegreesType, b: 0 as DegreesType };
const sun = galactocentricPosition(here, { value: 0, unit: 'pc' });
const position = [sun.x.value, sun.y.value, sun.z.value]; // [-8275.87, 0.00, 20.80] pc
```

The origin isn't Sagittarius A\* itself. It's the IAU's galactic centre, 4.3′
away on the sky, which puts Sagittarius A\* 10.5 pc from the origin.

## Every galaxy

In kpc, from the Milky Way's centre:

| Galaxy                 |       x |        y |        z | From the Sun | From the centre |
| ---------------------- | ------: | -------: | -------: | -----------: | --------------: |
| Milky Way (the Sun)    |   −8.28 |     0.00 |     0.02 |         0.00 |            8.28 |
| Andromeda              | −375.31 |   605.50 |  −278.87 |       761.00 |          765.02 |
| Triangulum             | −504.27 |   519.52 |  −435.51 |       840.00 |          844.90 |
| Large Magellanic Cloud |   −0.78 |   −40.95 |   −26.93 |        49.59 |           49.01 |
| Small Magellanic Cloud |   15.82 |   −37.56 |   −43.65 |        62.44 |           59.72 |
| Sagittarius dwarf      |   17.28 |     2.49 |    −6.53 |        26.50 |           18.64 |
| M87                    | 1102.22 | −4362.84 | 16185.58 |     16800.00 |        16799.48 |
| Centaurus A            | 2275.28 | −2764.77 |  1257.58 |      3800.00 |         3795.04 |

The Sagittarius dwarf, at positive `x`, is on the far side of the centre from
the Sun, and below the plane.

## From a catalogue

Catalogues such as NED give a galaxy's right ascension and declination.
`equatorialToGalactic` turns them into its galactic direction, with the IAU's
definition of galactic coordinates, and `galacticToEquatorial` turns them back:

```ts
import {
  equatorialToGalactic,
  galacticToEquatorial
} from '@interstellar-tools/equations';
import type { DegreesType } from '@interstellar-tools/types';

// Andromeda's position in NED
const andromeda = equatorialToGalactic({
  rightAscension: 10.68479292 as DegreesType,
  declination: 41.269065 as DegreesType
});
const direction = [andromeda.l, andromeda.b]; // [121.1744, -21.5730]
const centre = galacticToEquatorial({
  l: 0 as DegreesType,
  b: 0 as DegreesType
});
const sky = [centre.rightAscension, centre.declination]; // [266.4050, -28.9362]
```

That's the direction `GALAXIES` gives Andromeda. The galactic centre, at
longitude and latitude 0°, is in Sagittarius.

## Back from a position

`galactocentricToGalactic` is the inverse of `galactocentricPosition`: from a
position around the centre, it gives the direction and distance from the Sun.
The centre itself is $R_0$ away, towards longitude and latitude 0°:

```ts
import { galactocentricToGalactic } from '@interstellar-tools/equations';

const { direction, distance } = galactocentricToGalactic({
  frame: 'galactocentric',
  x: { value: 0, unit: 'pc' },
  y: { value: 0, unit: 'pc' },
  z: { value: 0, unit: 'pc' }
});
const seen = [direction.l, direction.b, distance.value]; // [0, 0, 8275.9] pc
```

## How they move

`galactocentricVelocity` adds a galaxy's motion to its direction and distance,
and the Sun's own velocity, for its velocity around the centre in km/s:

```ts
import { GALAXIES } from '@interstellar-tools/constants';
import {
  galactocentricPosition,
  galactocentricVelocity
} from '@interstellar-tools/equations';

const andromeda = GALAXIES.find(({ id }) => id === 'andromeda')!;
const { x, y, z } = galactocentricVelocity(
  andromeda.direction!,
  andromeda.distance,
  andromeda.motion!
);
const velocity = [x, y, z]; // [37.11, -119.81, -10.86] km/s
const at = galactocentricPosition(andromeda.direction!, andromeda.distance);
const out = [at.x.value, at.y.value, at.z.value];
const towardsCentre =
  (out[0]! * x + out[1]! * y + out[2]! * z) / Math.hypot(...out); // -109.07 km/s
```

Andromeda comes towards us at 300 km/s, but most of that is the Sun's own orbit:
it comes towards the Milky Way's centre at 109.07 km/s. Its sideways speed is
uncertain by about 40 km/s. For M87 and Centaurus A, only the motion along the
line of sight is measured, so the motion across the sky is taken as 0.

## Turning their disks

`galaxyDiskAxis` gives the axis a galaxy's disk spins around, as a unit vector
in the same frame. Draw the disk at right angles to it:

```ts
import { GALAXIES } from '@interstellar-tools/constants';
import { galaxyDiskAxis } from '@interstellar-tools/equations';

const andromeda = GALAXIES.find(({ id }) => id === 'andromeda')!;
const axis = galaxyDiskAxis(andromeda.direction!, andromeda.disk!); // [-0.4186, -0.7544, -0.5056]
```

It needs the disk's `nearSide`, so that it tilts the right way: Andromeda and
the Large Magellanic Cloud have one. Seen from the Sun, Andromeda turns
counter-clockwise, and the Large Magellanic Cloud clockwise.

## Supergalactic coordinates

Beyond the Local Group, the galaxies gather around a plane, the Local
Supercluster's. `galacticToSupergalactic` gives a direction's longitude and
latitude from it, and `supergalacticToGalactic` turns them back:

```ts
import { GALAXIES } from '@interstellar-tools/constants';
import { galacticToSupergalactic } from '@interstellar-tools/equations';

const m87 = GALAXIES.find(({ id }) => id === 'm87')!;
const { sgl, sgb } = galacticToSupergalactic(m87.direction!);
const sky = [sgl, sgb]; // [102.8805, -2.3479]
```

M87, at the heart of the Virgo Cluster, lies almost in the plane.

## No centre to the universe

The frames here are centred on the Milky Way, or on the Sun. That's a choice:
the universe has no centre to measure from. The cosmic microwave background
gives a frame to measure motion against, the Sun moving at about 370 km/s
through it, but not a place.

## Drawing them

The distances from the centre span nearly three powers of ten, from the
Sagittarius dwarf to M87. On a linear scale, the Milky Way's neighbours fall
into one point. Draw them on a log scale of distance from the centre, keeping
each direction, or in two views: the Local Group, and the galaxies further out.
