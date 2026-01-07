[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidInterface

# Interface: AsteroidInterface

Defined in:
[celestial-bodies/asteroids.ts:119](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L119)

Canonical shape for an **asteroid record**: identity, dynamics, and optional
visualization aides.

::: info

**Orbital elements (angles & distances):**

- Semi-major axis `a` should be in **astronomical units (au)** via
  [MeasureInterface](MeasureInterface.md).
- Eccentricity `e` for bound ellipses typically satisfies (0 \le e < 1).
- Inclination `i`, argument of perihelion `w` (ω), and longitude of ascending
  node `om` (Ω) are given in **degrees**.
- True anomaly `angle` (ν) is in **radians**.
- Perihelion distance (q) should satisfy:

$$
q \;=\; a\,(1 - e)
$$

**Period convention:** `period` is a duration (e.g., in **days**) using
[TemporalInterface](TemporalInterface.md). If you encode direction, a **negative
value** indicates **counter-clockwise** in your display convention
(visualization-specific; not a physical requirement).

**Coordinates:** Optional `x,y,z` are distances in a chosen reference frame
(e.g., ecliptic J2000). Always document the frame you use in calling code.

:::

## Properties

### a

```ts
a: MeasureInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:143](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L143)

**Semi-major axis** (typically in **au**).

#### Example

```ts
a: { value: 2.77, unit: 'au' }
```

---

### angle

```ts
angle: Radians;
```

Defined in:
[celestial-bodies/asteroids.ts:165](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L165)

**True anomaly** ( \nu ) (current orbital position) in **radians**.

---

### category

```ts
category: AsteroidCategory;
```

Defined in:
[celestial-bodies/asteroids.ts:127](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L127)

Specific family/group classification (e.g., Apollo group, Plutino).

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/asteroids.ts:234](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L234)

Display color (hex string, e.g., `#AABBCC`).

---

### e

```ts
e: number;
```

Defined in:
[celestial-bodies/asteroids.ts:153](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L153)

**Eccentricity** of the orbit. ::: info

Elliptical orbits: (0 \le e < 1). Parabolic: (e=1). Hyperbolic: (e>1).

:::

---

### focus_x?

```ts
optional focus_x: number;
```

Defined in:
[celestial-bodies/asteroids.ts:218](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L218)

Optional **focus offset** along X for ellipse rendering (pixels).

::: info

Visualization aid only; not a physical quantity.

:::

---

### i

```ts
i: number;
```

Defined in:
[celestial-bodies/asteroids.ts:156](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L156)

**Inclination** (i) in **degrees**.

---

### miA?

```ts
optional miA: number;
```

Defined in:
[celestial-bodies/asteroids.ts:207](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L207)

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
[celestial-bodies/asteroids.ts:121](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L121)

Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`).

---

### om

```ts
om: number;
```

Defined in:
[celestial-bodies/asteroids.ts:162](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L162)

**Longitude of ascending node** ( \Omega ) in **degrees**.

---

### orbitPath?

```ts
optional orbitPath: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/asteroids.ts:231](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L231)

Optional precomputed **orbit path** for plotting. ::: info

Commonly a list of points in your rendering coordinate system.

:::

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:175](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L175)

**Orbital period** as a duration (e.g., in **days**). ::: info

A **negative** value may be used to flag **counter-clockwise** drawing direction
in UIs.

:::

---

### q

```ts
q: number;
```

Defined in:
[celestial-bodies/asteroids.ts:182](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L182)

**Perihelion distance** ( q = a(1-e) ) (typically in **au**).

#### See

- a
- e

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:221](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L221)

Mean/characteristic **radius** (e.g., in **km**) as a distance value.

---

### size

```ts
size: number;
```

Defined in:
[celestial-bodies/asteroids.ts:237](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L237)

Visual **scale factor** (UI only; not physical size).

---

### spectralType

```ts
spectralType: AsteroidSpectralType;
```

Defined in:
[celestial-bodies/asteroids.ts:130](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L130)

Spectral/taxonomic class (composition & albedo proxy).

---

### system

```ts
system: string;
```

Defined in:
[celestial-bodies/asteroids.ts:133](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L133)

Star system identifier (e.g., `"Solar System"`).

---

### type

```ts
type: AsteroidType;
```

Defined in:
[celestial-bodies/asteroids.ts:124](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L124)

General dynamical region (e.g., main-belt, NEO, Trojan).

---

### w

```ts
w: number;
```

Defined in:
[celestial-bodies/asteroids.ts:159](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L159)

**Argument of perihelion** ( \omega ) in **degrees**.

---

### x?

```ts
optional x: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:192](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L192)

Optional **Cartesian coordinates** (distance values) in a specified frame. :::
info

Provide the reference frame (e.g., ecliptic J2000) in calling code.

:::

---

### y?

```ts
optional y: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:194](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L194)

See [x](#x).

---

### z?

```ts
optional z: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroids.ts:196](https://github.com/phun-ky/interstellar-tools/blob/c2a564e3effec210630bedeca7ce384ba17c27ca/packages/types/src/celestial-bodies/asteroids.ts#L196)

See [x](#x).
