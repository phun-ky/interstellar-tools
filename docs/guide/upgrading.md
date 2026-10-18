# Upgrading

Each major is supported as a whole: fixes come as new releases within it, so
upgrading within your major is the way to get them, and never breaks your code
(see the
[security policy](https://github.com/phun-ky/interstellar-tools/blob/main/SECURITY.md#supported-versions)).
This page explains how versions work and how to migrate your code.

**Every major release has a migration guide** here, covering every breaking
change since the previous major, with before-and-after code. The guide from 0.x
to 1.0 is below. For the story behind the changes, and whether to upgrade now,
read the [release notes](./releases/index.md).

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

### Deprecations

A deprecated API keeps working for **one full major** before it can be removed,
so you always see the warning on a release you can upgrade to without breaking
anything:

| Deprecated in        | Still works in | Removed in, at the earliest |
| -------------------- | -------------- | --------------------------- |
| any 1.x release, 2.0 | all of 2.x     | 3.0                         |
| any 2.x release, 3.0 | all of 3.x     | 4.0                         |

- **Marked in the code:** `@deprecated` in its documentation, naming what to use
  instead and the major it will be removed in. Editors strike it through, and
  the API reference shows it.
- **Announced:** in the changelog of the release that deprecates it, and in a
  **Deprecated** section of the next major's
  [release notes](./releases/index.md), with the major it goes in. That's the
  earliest one by the table above, or a later one if the notes name it.
- **Removed only in a major,** and listed in that major's release notes and
  migration guide. A major never deprecates and removes the same API.
- **No runtime warnings.** The functions are pure, and a library that writes to
  the console is noise.
- **Security comes first.** Deprecated APIs get security fixes like everything
  else. If a vulnerability can't be fixed without breaking one, the fix may
  change or remove it before its grace period ends, as the
  [security policy](https://github.com/phun-ky/interstellar-tools/blob/main/SECURITY.md#supported-versions)
  describes.

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
- [ ] Read the direction of an orbit from `orbit.retrograde`, not from the sign
      of `orbit.period`, which is now always positive.
- [ ] Brand `i`, `w` and `om` as `DegreesType`, write `q` as a distance, and
      check `x`, `y`, `z` on planets before using them.
- [ ] Read belt radii as distances (`belt.innerRadius.value`), and look Spica's
      stars up as `spica-a` and `spica-b`.
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

### types and constants 0.63: the orbit tree, final shape

The last changes to the orbit tree before 1.0 freezes it.

**`period` is always positive, and `retrograde` gives the direction.** In 0.x, a
negative `period` meant a prograde orbit and a positive one a retrograde orbit.
Now `period` is a plain duration, and the five retrograde orbits in the datasets
(Halley's comet, Triton, Phoebe, Pasiphae and Halimede) have `retrograde: true`:

```ts
// 0.62
const direction = Math.sign(-orbit.period.value);
// 0.63
const direction = orbit.retrograde ? -1 : 1;
```

The anomaly functions read `period` as its absolute value, so a negative period
from your own 0.x data still works there.

**Element types are explicit.**

| Field       | 0.62                       | 0.63                 |
| ----------- | -------------------------- | -------------------- |
| `orbit.a`   | `MeasureInterface`         | `DistanceInterface`  |
| `orbit.i`   | `number` (degrees)         | `DegreesType`        |
| `orbit.w`   | `number` (degrees)         | `DegreesType`        |
| `orbit.om`  | `number` (degrees)         | `DegreesType`        |
| `orbit.q`   | `number` (in `a`'s unit)   | `DistanceInterface`  |
| comet orbit | `Required<OrbitInterface>` | `FullOrbitInterface` |

The values don't change, so `orbit.i` is still `162.26` for Halley's comet.
Write your own data as `i: 162.26 as DegreesType` and
`q: { value: 0.586, unit: 'au' }`. `MeasureInterface` is identical to
`DistanceInterface`, and stays as a deprecated alias through 1.x; it can be
removed in 2.0 at the earliest (see [deprecations](#deprecations)).

**Planet positions are optional.** `x`, `y` and `z` on a planet are optional, as
they already were on every other body, so a rogue planet or an exoplanet can
leave them out. Every planet in `PLANETS` still has them.

```ts
// 0.62
const r = Math.hypot(planet.x.value, planet.y.value, planet.z.value);
// 0.63
const { x, y, z } = planet;
const r = x && y && z ? Math.hypot(x.value, y.value, z.value) : undefined;
```

### types and constants 0.64: the datasets for 1.0

**Belt radii are distances**, like every other length:

```ts
// 0.63
const inner = belt.innerRadius; // 2.1, in au
// 0.64
const { value: inner } = belt.innerRadius; // { value: 2.1, unit: 'au' }
```

**`CelestialBodiesType` is a list of any bodies**, `CelestialBodyType[]`, so a
mixed list such as `[...STARS, ...PLANETS]` type-checks. Before, it was a list
of one kind only. Code that relied on the old union, for example to tell from
the type alone that every entry is a planet, should use `PlanetsType` instead.

**Spica is a binary.** The id `spica` now names the system (in `SYSTEMS`), and
its stars are `spica-a` and `spica-b` (in `STARS`), the way Alpha Centauri's
are. Code that looked up `spica` in `STARS` gets nothing back; look up
`spica-a`, or the system in `SYSTEMS`.

Added without breaking anything, but with new values to expect:

- **`mu`** (G·M in m³/s²) on the Sun, the planets and the larger moons.
- **Moon orbits** now match JPL: 14 semi-major axes changed, some by a factor of
  two (Rhea, Metis, Amalthea), Himalia's, Hyperion's and Halimede's
  eccentricities changed, and every moon has a real `orbit.angle` at J2000
  instead of 0.
- **Masses** for Vega, Altair and Deneb, and **orientation** (`i`, `w`, `om`)
  for Alpha Centauri A and B and the Spica pair.

### For renderers: drawing with the library

A renderer that draws orbits typically computes each orbit's shape once and
keeps it on the body, then places the body on it every frame. With the library,
that looks like this:

```ts
import { PLANETS } from '@interstellar-tools/constants';
import {
  convertDistanceUnit,
  trueAnomalyAt
} from '@interstellar-tools/equations';

// Work on a copy: the datasets are shared by everything that imports them
const bodies = structuredClone(PLANETS);

for (const body of bodies) {
  if (!body.orbit) continue;

  const a = convertDistanceUnit(body.orbit.a, 'au').value;
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
const { orbit } = bodies[2];
const nu = trueAnomalyAt(orbit!, new Date());
// Retrograde bodies travel the other way round the path
const angleOnPath = orbit!.retrograde ? -nu : nu;
```

The distances are in whatever unit the renderer chooses for `orbit.a` (au here),
with the parent body at the origin and periapsis along +x. Scale them to pixels
when drawing.
