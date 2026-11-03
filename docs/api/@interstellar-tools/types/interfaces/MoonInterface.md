[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonInterface

# Interface: MoonInterface

Defined in:
[celestial-bodies/moons.ts:36](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L36)

Represents a **moon** (natural satellite) orbiting a planet.

A moon always has a `parent` (its planet) and an `orbit` around it; see
[OrbitInterface](OrbitInterface.md).

**Physical and drawing properties:**

- **Size (`radius`)**: Actual moon radius in **kilometers (km)**.
- **Drawing (`display`)**: colour, and state a renderer computes; see
  [DisplayInterface](DisplayInterface.md).

## Example

```ts
const europa: MoonInterface = {
  id: 'europa',
  name: 'Europa',
  category: 'natural satellite',
  parent: 'jupiter',
  orbit: {
    a: { value: 0.00448, unit: 'au' },
    e: 0.009,
    period: { value: 3.551, unit: 'd' },
    angle: 0 as Radians
  },
  radius: { value: 1560.8, unit: 'km' },
  display: { color: '#a6a6a6' }
};
```

## Properties

### category

```ts
category: 'natural satellite' | 'irregular satellite' | 'retrograde satellite';
```

Defined in:
[celestial-bodies/moons.ts:43](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L43)

Classification of the moon.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/moons.ts:69](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L69)

How to draw the moon: its colour, and state a renderer computes.

---

### ellipsoid?

```ts
ellipsoid?: EllipsoidInterface;
```

Defined in:
[celestial-bodies/moons.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L56)

Reference ellipsoid, from the IAU Working Group on Cartographic Coordinates and
Rotational Elements, where it gives one. `radius` is the mean radius.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/moons.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L38)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/moons.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L61)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/moons.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L40)

Name of the moon (e.g., "Io", "Europa", "Titan").

---

### orbit

```ts
orbit: OrbitInterface;
```

Defined in:
[celestial-bodies/moons.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L48)

Orbit around the parent planet.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/moons.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L46)

Id of the planet the moon orbits (e.g., `'jupiter'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L50)

Mean radius of the moon in kilometres; the IAU's, where it gives one.

---

### type?

```ts
type?: undefined;
```

Defined in:
[celestial-bodies/moons.ts:41](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L41)

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L63)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L65)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L67)

Z-coordinate in a distance-based system (optional).
