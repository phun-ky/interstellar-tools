[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidInterface

# Interface: AsteroidInterface

Defined in:
[celestial-bodies/asteroids.ts:120](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L120)

Canonical shape for an **asteroid record**: identity, dynamics, and optional
visualization aides.

::: info

**Orbital elements (angles & distances)**, all in `orbit`:

- Semi-major axis `a` should be in **astronomical units (au)**.
- Eccentricity `e` for bound ellipses typically satisfies (0 \le e < 1).
- Inclination `i`, argument of perihelion `w` (ω), and longitude of ascending
  node `om` (Ω) are given in **degrees**.
- True anomaly `angle` (ν) is in **radians**.
- Perihelion distance (q) should satisfy:

$$
q \;=\; a\,(1 - e)
$$

**Period convention:** `period` is a positive duration (e.g., in **days**). A
retrograde orbit (`i > 90°`) has `retrograde: true`.

**Coordinates:** Optional `x,y,z` are distances in a chosen reference frame
(e.g., ecliptic J2000). Always document the frame you use in calling code.

:::

## Properties

### category

```ts
category: AsteroidCategory;
```

Defined in:
[celestial-bodies/asteroids.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L131)

Specific family/group classification (e.g., Apollo group, Plutino).

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:173](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L173)

How to draw the asteroid: its colour and drawn size, and state a renderer
computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroids.ts:122](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L122)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/asteroids.ts:170](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L170)

Standard gravitational parameter $\mu = G M$ of the asteroid alone, in m³/s², as
the orbit equations take it. Given where a moon or a spacecraft has weighed it,
like Ida by Dactyl, or Didymos by Dimorphos.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroids.ts:125](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L125)

Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`).

---

### orbit

```ts
orbit: FullOrbitInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:140](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L140)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroids.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L137)

Id of the star the asteroid orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:163](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L163)

Mean/characteristic **radius** (e.g., in **km**) as a distance value.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:146](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L146)

How the asteroid spins: its sidereal rotation period and direction, from the IAU
or its light curve. Given where one is published.

---

### spectralType

```ts
spectralType: AsteroidSpectralType;
```

Defined in:
[celestial-bodies/asteroids.ts:134](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L134)

Spectral/taxonomic class (composition & albedo proxy).

---

### type

```ts
type: AsteroidType;
```

Defined in:
[celestial-bodies/asteroids.ts:128](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L128)

General dynamical region (e.g., main-belt, NEO, Trojan).

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L156)

Optional **Cartesian coordinates** (distance values) in a specified frame. :::
info

Provide the reference frame (e.g., ecliptic J2000) in calling code.

:::

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:158](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L158)

See [x](#x).

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:160](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L160)

See [x](#x).
