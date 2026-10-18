[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidInterface

# Interface: AsteroidInterface

Defined in:
[celestial-bodies/asteroids.ts:118](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L118)

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

**Period convention:** `period` is a duration (e.g., in **days**). If you encode
direction, a **negative value** indicates **counter-clockwise** in your display
convention (visualization-specific; not a physical requirement).

**Coordinates:** Optional `x,y,z` are distances in a chosen reference frame
(e.g., ecliptic J2000). Always document the frame you use in calling code.

:::

## Properties

### category

```ts
category: AsteroidCategory;
```

Defined in:
[celestial-bodies/asteroids.ts:129](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L129)

Specific family/group classification (e.g., Apollo group, Plutino).

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/asteroids.ts:190](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L190)

Display color (hex string, e.g., `#AABBCC`).

---

### focus_x?

```ts
optional focus_x?: number;
```

Defined in:
[celestial-bodies/asteroids.ts:174](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L174)

Optional **focus offset** along X for ellipse rendering (pixels).

::: info

Visualization aid only; not a physical quantity.

:::

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroids.ts:120](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L120)

Stable identifier, used by `parent` references. Never translated.

---

### miA?

```ts
optional miA?: number;
```

Defined in:
[celestial-bodies/asteroids.ts:163](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L163)

Optional **semi-minor axis** in **pixels** (for 2D ellipse rendering).

::: info

Visualization aid only; not a physical quantity.

:::

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroids.ts:123](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L123)

Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`).

---

### orbit

```ts
orbit: Required<OrbitInterface>;
```

Defined in:
[celestial-bodies/asteroids.ts:138](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L138)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/asteroids.ts:187](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L187)

Optional precomputed **orbit path** for plotting. ::: info

Commonly a list of points in your rendering coordinate system.

:::

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroids.ts:135](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L135)

Id of the star the asteroid orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:177](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L177)

Mean/characteristic **radius** (e.g., in **km**) as a distance value.

---

### size

```ts
size: number;
```

Defined in:
[celestial-bodies/asteroids.ts:193](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L193)

Visual **scale factor** (UI only; not physical size).

---

### spectralType

```ts
spectralType: AsteroidSpectralType;
```

Defined in:
[celestial-bodies/asteroids.ts:132](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L132)

Spectral/taxonomic class (composition & albedo proxy).

---

### type

```ts
type: AsteroidType;
```

Defined in:
[celestial-bodies/asteroids.ts:126](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L126)

General dynamical region (e.g., main-belt, NEO, Trojan).

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:148](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L148)

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
[celestial-bodies/asteroids.ts:150](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L150)

See [x](#x).

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:152](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroids.ts#L152)

See [x](#x).
