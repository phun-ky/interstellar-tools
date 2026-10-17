# Upgrading

Only the latest release of each package is supported (see the
[security policy](https://github.com/phun-ky/interstellar-tools/blob/main/SECURITY.md)),
so upgrading is the way to get fixes. This page explains how versions work and
walks through each upgrade that needs changes in your code.

## How versions work

- Every package follows [Semantic Versioning](https://semver.org/) and has its
  own version.
- While a package is below 1.0, a **breaking change bumps the minor version**
  (0.60.x to 0.61.0), and fixes and features bump the patch version.
- Each package's `CHANGELOG.md` lists every release. Breaking changes are listed
  under **⚠ BREAKING CHANGES**, with what changed and what replaces it.
- Upgrade the packages together. They depend on each other, and their version
  ranges are kept in sync at release.

## 0.60 to 0.61: the orbit tree

Affects `@interstellar-tools/types`, `constants` and `equations` 0.61.0, and
`@interstellar-tools/mcp` 0.2.0.

Celestial bodies changed from flat orbital fields to a tree: every body has an
`id`, names what it's bound to in `parent`, and keeps its orbital elements in
`orbit`.

### 1. Read orbital elements from `orbit`

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

### 2. Replace `system` with `parent`

`system` held a name, or on stars a `{ name, type }` object. `parent` holds the
`id` of what the body is bound to.

```ts
// 0.60
const moons = MOONS.filter((moon) => moon.system === 'Jupiter');
// 0.61
const moons = MOONS.filter((moon) => moon.parent === 'jupiter');
```

### 3. Look things up by `id`, not by name

Every body, system, galaxy and asteroid belt has a stable `id` that never
changes, even if names are translated. Asteroids and comets use their official
designations, such as `4-vesta` and `1p-halley`.

```ts
const earth = PLANETS.find((planet) => planet.id === 'earth');
```

### 4. Systems are barycenters

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

### 5. Pass the orbit to the anomaly functions

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

### 6. MCP datasets

The MCP server's dataset resources use the new shape, and `find_body` matches
ids as well as names. Clients that read `system`, `a` or `period` from a body
should read `parent` and `orbit` instead.

## constants 0.61.1: planet positions

No code changes are needed, but values changed. `PLANETS` held other orbital
elements in `orbit.angle` and placeholder `x`, `y`, `z`. Both are now real: the
true anomaly at J2000 and the heliocentric position at J2000 in the J2000
ecliptic frame. If you stored or compared these values, expect different
numbers.

## mcp 0.2.1: host check over HTTP

Bound to loopback, the HTTP server now rejects requests addressed to any host
name other than `localhost`, `127.0.0.1` or `[::1]` with `403`, which protects
it from DNS rebinding.

- **Behind a tunnel:** make the tunnel send `localhost` as the host, with
  `cloudflared tunnel --url http://localhost:3000 --http-host-header localhost:3000`
  or `ngrok http 3000 --host-header=rewrite`.
- **On another interface or host name:** pass your public host name with
  `--allowed-hosts`, or `allowedHosts` in `startHttpServer`.
