[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidInterface

# Interface: AsteroidInterface

Defined in:
[celestial-bodies/asteroids.ts:117](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L117)

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
[celestial-bodies/asteroids.ts:128](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L128)

Specific family/group classification (e.g., Apollo group, Plutino).

---

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:157](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L157)

How to draw the asteroid: its colour and drawn size, and state a renderer
computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroids.ts:119](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L119)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroids.ts:122](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L122)

Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`).

---

### orbit

```ts
orbit: FullOrbitInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L137)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroids.ts:134](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L134)

Id of the star the asteroid orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L154)

Mean/characteristic **radius** (e.g., in **km**) as a distance value.

---

### spectralType

```ts
spectralType: AsteroidSpectralType;
```

Defined in:
[celestial-bodies/asteroids.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L131)

Spectral/taxonomic class (composition & albedo proxy).

---

### type

```ts
type: AsteroidType;
```

Defined in:
[celestial-bodies/asteroids.ts:125](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L125)

General dynamical region (e.g., main-belt, NEO, Trojan).

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:147](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L147)

Optional **Cartesian coordinates** (distance values) in a specified frame. :::
info

Provide the reference frame (e.g., ecliptic J2000) in calling code.

:::

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:149](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L149)

See [x](#x).

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:151](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L151)

See [x](#x).
