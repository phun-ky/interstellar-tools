# Upgrading

Only the latest release of each package is supported (see the
[security policy](https://github.com/phun-ky/interstellar-tools/blob/main/SECURITY.md)),
so upgrading is the way to get fixes. This page explains how versions work and
how to migrate your code.

**Every major release has a migration guide** here, covering every breaking
change since the previous major, with before-and-after code. Until 1.0, that's
the guide from 0.x to 1.0 below, which grows with each breaking change.

## How versions work

- Every package follows [Semantic Versioning](https://semver.org/) and has its
  own version.
- A **breaking change bumps the major version** from 1.0 on (1.x to 2.0.0), and
  the minor version while a package is below 1.0 (0.60.x to 0.61.0). Features
  bump the minor version, and fixes the patch version.
- Each package's `CHANGELOG.md` lists every release. Breaking changes are listed
  under **⚠ BREAKING CHANGES**, with what changed and what replaces it.
- Upgrade the packages together. They depend on each other, and their version
  ranges are kept in sync at release.

## Migrating from 0.x to 1.0

All five current packages go to 1.0 together. The changes below are in release
order; skip the ones older than the version you're on.

### Checklist

- [ ] Read orbital elements from `orbit` (`body.orbit.a`, not `body.a`).
- [ ] Replace `system` with `parent`, and look bodies up by `id`.
- [ ] Treat systems as barycenters; members point to them with `parent`.
- [ ] Pass `body.orbit` to `computeAngle` and `advanceMeanAnomaly` (was
      `meanToEccentricAnomaly`).
- [ ] Swap the arguments of `meanMotion(a, mu)` and
      `hyperbolicPeriapsisSpeed(vInfinity, rp, mu)`.
- [ ] Read drawing values from `display` (`body.display.color`, not
      `body.color`), and keep renderer state there too.
- [ ] Rename `NORMALIZE_UNIT` to `NORMALIZE_TEMPORAL_UNIT`, and catch
      `RangeError` from the unit functions.
- [ ] Expect new values for planet and comet positions, which are now real J2000
      data.
- [ ] Behind a tunnel or on a public host, configure the MCP server's
      `--allowed-hosts`.

### 0.60 to 0.61: the orbit tree

Affects `@interstellar-tools/types`, `constants` and `equations` 0.61.0, and
`@interstellar-tools/mcp` 0.2.0.

Celestial bodies changed from flat orbital fields to a tree: every body has an
`id`, names what it's bound to in `parent`, and keeps its orbital elements in
`orbit`.

#### 1. Read orbital elements from `orbit`

`a`, `e`, `period` and `angle` moved into `orbit`. On comets and asteroids, `i`,
`w`, `om` and `q` moved too.

```ts
// 0.60
const { a, e, period, angle } = planet;
// 0.61
const { a, e, period, angle } = planet.orbit!;
```

`orbit` is optional on stars, planets and systems (a body without one is bound
but not on a Kepler orbit, like the Sun around the Solar System barycenter), and
required on moons, comets and asteroids.

#### 2. Replace `system` with `parent`

`system` held a name, or on stars a `{ name, type }` object. `parent` holds the
`id` of what the body is bound to.

```ts
// 0.60
const moons = MOONS.filter((moon) => moon.system === 'Jupiter');
// 0.61
const moons = MOONS.filter((moon) => moon.parent === 'jupiter');
```

#### 3. Look things up by `id`, not by name

Every body, system, galaxy and asteroid belt has a stable `id` that never
changes, even if names are translated. Asteroids and comets use their official
designations, such as `4-vesta` and `1p-halley`.

```ts
const earth = PLANETS.find((planet) => planet.id === 'earth');
```

#### 4. Systems are barycenters

`StarSystemInterface` is removed. `SystemInterface` no longer lists its `stars`;
members point to it with `parent` instead, and systems can nest.

```ts
// 0.60
const names = SYSTEMS.find((s) => s.name === 'Alpha Centauri')!.stars;
// 0.61: the members of a system, including nested systems
const members = [...STARS, ...SYSTEMS].filter(
  (node) => node.parent === 'alpha-centauri'
);
```

`distance` changed from a number of light-years to a `DistanceInterface`
(`{ value, unit: 'ly' }`). Stars lost their constellation `system` names, and
gained an optional `mass` in solar masses.

#### 5. Pass the orbit to the anomaly functions

`computeAngle` takes an orbit instead of a whole body, and
`meanToEccentricAnomaly` is renamed to `advanceMeanAnomaly`, since it returns
the mean anomaly.

```ts
// 0.60
computeAngle(planet, { value: 1, unit: 'd' });
meanToEccentricAnomaly(planet, { value: 1, unit: 'd' });

// 0.61
computeAngle(planet.orbit!, { value: 1, unit: 'd' });
advanceMeanAnomaly(planet.orbit!, { value: 1, unit: 'd' });
```

To convert a mean anomaly to an eccentric anomaly, use `solveKepler(M, e)`.

#### 6. MCP datasets

The MCP server's dataset resources use the new shape, and `find_body` matches
ids as well as names. Clients that read `system`, `a` or `period` from a body
should read `parent` and `orbit` instead.

### constants 0.61.1: planet positions

No code changes are needed, but values changed. `PLANETS` held other orbital
elements in `orbit.angle` and placeholder `x`, `y`, `z`. Both are now real: the
true anomaly at J2000 and the heliocentric position at J2000 in the J2000
ecliptic frame. If you stored or compared these values, expect different
numbers.

### mcp 0.2.1: host check over HTTP

Bound to loopback, the HTTP server now rejects requests addressed to any host
name other than `localhost`, `127.0.0.1` or `[::1]` with `403`, which protects
it from DNS rebinding.

- **Behind a tunnel:** make the tunnel send `localhost` as the host, with
  `cloudflared tunnel --url http://localhost:3000 --http-host-header localhost:3000`
  or `ngrok http 3000 --host-header=rewrite`.
- **On another interface or host name:** pass your public host name with
  `--allowed-hosts`, or `allowedHosts` in `startHttpServer`.

### equations 0.62: `mu` last

Every equation now takes the gravitational parameter `mu` as its last argument.
Two didn't, and their arguments are reordered:

```ts
// 0.61
meanMotion(mu, a);
hyperbolicPeriapsisSpeed(vInfinity, mu, rp);
// 0.62
meanMotion(a, mu);
hyperbolicPeriapsisSpeed(vInfinity, rp, mu);
```

All arguments are plain numbers, so TypeScript won't catch an old call: search
your code for both functions and swap the arguments.

### equations 0.63: positions at any time

`advanceMeanAnomaly` no longer caps or rounds the time step, so results change
for steps it used to clamp:

- **Longer than 10 orbital periods** (1 when $e \geq 0.9$): the body used to
  stop at the cap. It now moves the whole step, so positions over years or
  centuries are right.
- **Negative:** a negative step used to become a tiny step forward. It now goes
  back in time.
- **Shorter than 0.00001 days:** these used to be rounded up. They now move
  exactly as far as the step.

Results are now always in $[0, 2\pi)$. `computeAngle` follows, since it uses
`advanceMeanAnomaly`.

Two new functions find a body at a date, measured from J2000, the epoch of every
`orbit.angle`:

```ts
import { meanAnomalyAt, trueAnomalyAt } from '@interstellar-tools/equations';

meanAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z')); // 282.7°
trueAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z')); // 280.8°
```

### types and constants 0.62: `display`

Everything about drawing moves into an optional `display` object on every body
(`DisplayInterface`), the way orbital elements live in `orbit`:

```ts
// 0.61
const { color } = planet;
const { size } = comet;
const { opacity, density } = belt;
// 0.62
const { color } = planet.display ?? {};
const { size } = comet.display ?? {};
const { opacity, density } = belt.display ?? {};
```

The renderer state fields move there too, with clearer names:

| 0.61             | 0.62                         |
| ---------------- | ---------------------------- |
| `body.miA`       | `body.display.semiMinorAxis` |
| `body.focus_x`   | `body.display.focusOffsetX`  |
| `body.orbitPath` | `body.display.orbitPath`     |

`CartesianCoordinatesInterface` is unchanged, and is now defined with
`DisplayInterface`. The datasets only set `color`, `size`, `opacity` and
`density`; the rest is for a renderer to compute.

### temporal 0.61: frozen unit tables

The alias table is renamed, so it can't be mixed up with the distance one:

| 0.60             | 0.61                      |
| ---------------- | ------------------------- |
| `NORMALIZE_UNIT` | `NORMALIZE_TEMPORAL_UNIT` |

- `NORMALIZE_TEMPORAL_UNIT` and `SECONDS_PER` are frozen. Code that changed them
  at runtime now fails; build your own table instead.
- `normalizeTemporalUnit` and `convertTemporalUnit` throw a `RangeError` for an
  unknown unit. It is still an `Error`, so existing `catch` blocks keep working.
- Keys from `Object.prototype` such as `'toString'` are no longer accepted as
  units.
- `convertTemporalUnit` now also accepts an alias as the target unit, such as
  `'days'`.

### For renderers: drawing with the library

A renderer that draws orbits typically computes each orbit's shape once and
keeps it on the body, then places the body on it every frame. With the library,
that looks like this:

```ts
import { PLANETS } from '@interstellar-tools/constants';
import { trueAnomalyAt } from '@interstellar-tools/equations';

import { convertDistance } from './your-app'; // a renderer's own unit helper

// Work on a copy: the datasets are shared by everything that imports them
const bodies = structuredClone(PLANETS);

for (const body of bodies) {
  if (!body.orbit) continue;

  const a = convertDistance(body.orbit.a, 'au').value;
  const { e } = body.orbit;
  const semiMinorAxis = a * Math.sqrt(1 - e ** 2);
  const focusOffsetX = a * e;
  const orbitPath = Array.from({ length: 361 }, (_, i) => {
    const theta = (i / 360) * 2 * Math.PI;

    return {
      x: a * Math.cos(theta) - focusOffsetX,
      y: semiMinorAxis * Math.sin(theta)
    };
  });

  body.display = { ...body.display, semiMinorAxis, focusOffsetX, orbitPath };
}

// Each frame: where is the body now?
const nu = trueAnomalyAt(bodies[2].orbit!, new Date());
```

The distances are in whatever unit the renderer chooses for `orbit.a` (au here),
with the parent body at the origin and periapsis along +x. Scale them to pixels
when drawing.
