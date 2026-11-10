---
title: Orbits in 3D
description:
  Place planets, moons, asteroids and comets in 3D on any date with
  @interstellar-tools/equations, from the orbits in the datasets.
---

# Orbits in 3D

Every orbit in the datasets says where its body was at J2000 and how its ellipse
is tilted. From those, `stateAt` in `@interstellar-tools/equations` gives the
body's position and velocity on any date, in 3D. The examples follow Mars and
Titan into 2027, and every number on this page is checked by a test.

[[toc]]

## What an orbit carries

An orbit's size and shape are `a` and `e`, and `angle` is where the body was on
it at J2000, its true anomaly. Three angles turn the ellipse into place, in
degrees:

- `i`, the inclination: how far the orbit is tilted from its reference plane.
- `om`, the longitude of the ascending node: where it crosses the plane going
  north.
- `w`, the argument of periapsis: where its closest point is, from that node.

They mean nothing without the plane they're measured from, so each orbit with an
`i` names it in `frame`:

| `frame.plane`      | The plane                                              | Used for                                                     |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| `'ecliptic'`       | Earth's orbit at J2000, `om` from the J2000 equinox    | Planets, asteroids, comets, the Moon and the irregular moons |
| `'equator'`        | Earth's equator at J2000, the ICRF                     | Dysnomia                                                     |
| `'laplace'`        | The plane a moon's orbit precesses around, with `pole` | The regular moons of Mars, Jupiter and Saturn                |
| `'parent-equator'` | Its planet's equator, with `pole`                      | The moons of Uranus, Neptune and Pluto, and Dimorphos        |
| `'sky'`            | The plane of the sky, as a binary star is seen         | Binary stars, the S-stars and TRAPPIST-1's planets           |
| `'galactic'`       | The galaxy's disk                                      | None yet                                                     |

## Where Mars is on a date

`stateAt` takes an orbit and a date, and gives the position `r` in metres and
the velocity `v` in metres per second, from the orbit's parent: the Sun, for
Mars. With `frame: 'reference'` they're in the orbit's own reference plane, the
ecliptic for Mars:

```ts
import { AU_METERS, PLANETS } from '@interstellar-tools/constants';
import { stateAt } from '@interstellar-tools/equations';

const mars = PLANETS.find(({ id }) => id === 'mars')!;
const date = new Date('2027-01-01T00:00:00Z');
const { r, v } = stateAt(mars.orbit!, date, { frame: 'reference' });
const position = r.map((m) => m / AU_METERS); // [-1.0241, 1.2889, 0.0522] au
const distance = Math.hypot(...r) / AU_METERS; // 1.6471 au from the Sun
const speed = Math.hypot(...v) / 1000; // 22.26 km/s
```

Mars's orbit is tilted 1.85° from the ecliptic, so it's 0.05 au above it.

## In the ICRF

Without `frame`, `stateAt` gives the state in the **ICRF**: Earth's equator and
equinox at J2000, the frame star catalogues and spacecraft use. It turns the
orbit's plane into it with `orbitFrameToIcrf`, by the tilt of the ecliptic,
23.44°, for Mars:

```ts
stateAt(mars.orbit!, date).r.map((m) => m / AU_METERS); // [-1.0241, 1.1618, 0.5606] au
```

Positions in one frame add up. Earth's position from the Sun, taken from Mars's,
gives Mars as Earth sees it, and its right ascension and declination on the sky:

```ts
const earth = PLANETS.find(({ id }) => id === 'earth')!;
const fromSun = stateAt(mars.orbit!, date).r;
const earthFromSun = stateAt(earth.orbit!, date).r;
const seen = fromSun.map((m, k) => m - earthFromSun[k]!);
const metres = Math.hypot(...seen);
const fromEarth = metres / AU_METERS; // 0.9136 au
const ra = ((Math.atan2(seen[1]!, seen[0]!) * 180) / Math.PI + 360) % 360; // 162.26°, 10 h 49 min
const dec = (Math.asin(seen[2]! / metres) * 180) / Math.PI; // +11.06°, in Leo
```

Mars is heading for opposition, on 19 February 2027, when it's closest. Earth's
orbit here is the Earth–Moon barycenter's, 4700 km from Earth's centre, which is
far too little to move Mars on the sky.

## A moon around its planet

A moon's state is from its planet. Add the planet's state to place it around the
Sun. Titan's orbit is on Saturn's Laplace plane, close to Saturn's equator, so
`orbitFrameToIcrf` tips it up by that plane's pole:

```ts
import { MOONS } from '@interstellar-tools/constants';
import { applyMatrix3, orbitFrameToIcrf } from '@interstellar-tools/equations';

const saturn = PLANETS.find(({ id }) => id === 'saturn')!;
const titan = MOONS.find(({ id }) => id === 'titan')!;
const titanFromSaturn = stateAt(titan.orbit, date).r;
const saturnFromSun = stateAt(saturn.orbit!, date).r;
const titanFromSun = titanFromSaturn.map((m, k) => m + saturnFromSun[k]!);
const km = Math.hypot(...titanFromSaturn) / 1000; // 1 191 000 km from Saturn
const au = Math.hypot(...titanFromSun) / AU_METERS; // 9.4088 au from the Sun
const pole = applyMatrix3(orbitFrameToIcrf(titan.orbit.frame!), [0, 0, 1]); // [0.084, 0.062, 0.995], the pole
```

## Limits

- **The ellipse is fixed.** `stateAt` moves the body along its J2000 orbit, and
  real orbits precess. That's good for years around J2000 for the planets, and
  less for moons, whose planes and periapses turn in years or decades.
- **The sky can't be placed yet.** A binary star's orbit is measured on the sky,
  so placing it needs the direction to the star, which the datasets don't give
  yet ([#373](https://github.com/phun-ky/interstellar-tools/issues/373)).
  `stateAt` gives it in its own plane with `frame: 'reference'`, and throws
  without.
- **An orbit without `i` is flat.** The galactic orbits of stars and systems,
  and Proxima Centauri's, have no tilt. With `frame: 'reference'`, `stateAt`
  draws them in their own plane, with `x` to the periapsis.
- **Planets are the planets'.** The Sun's planets reproduce their J2000 position
  in the dataset to 0.02 %, from JPL's
  [approximate planet positions](https://ssd.jpl.nasa.gov/planets/approx_pos.html),
  which over 1800–2050 are good to seconds of arc for the inner planets, and to
  10 minutes of arc for Saturn. For a spacecraft, use an ephemeris.
