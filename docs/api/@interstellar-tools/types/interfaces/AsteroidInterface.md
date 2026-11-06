[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidInterface

# Interface: AsteroidInterface

Defined in:
[celestial-bodies/asteroids.ts:118](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L118)

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
[celestial-bodies/asteroids.ts:129](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L129)

Specific family/group classification (e.g., Apollo group, Plutino).

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:164](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L164)

How to draw the asteroid: its colour and drawn size, and state a renderer
computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroids.ts:120](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L120)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroids.ts:123](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L123)

Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`).

---

### orbit

```ts
orbit: FullOrbitInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:138](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L138)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroids.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L135)

Id of the star the asteroid orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:161](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L161)

Mean/characteristic **radius** (e.g., in **km**) as a distance value.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:144](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L144)

How the asteroid spins: its sidereal rotation period and direction, from the IAU
or its light curve. Given where one is published.

---

### spectralType

```ts
spectralType: AsteroidSpectralType;
```

Defined in:
[celestial-bodies/asteroids.ts:132](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L132)

Spectral/taxonomic class (composition & albedo proxy).

---

### type

```ts
type: AsteroidType;
```

Defined in:
[celestial-bodies/asteroids.ts:126](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L126)

General dynamical region (e.g., main-belt, NEO, Trojan).

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L154)

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
[celestial-bodies/asteroids.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L156)

See [x](#x).

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:158](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L158)

See [x](#x).
