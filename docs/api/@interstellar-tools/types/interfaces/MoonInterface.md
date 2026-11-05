[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonInterface

# Interface: MoonInterface

Defined in:
[celestial-bodies/moons.ts:37](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L37)

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
[celestial-bodies/moons.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L44)

Classification of the moon.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/moons.ts:75](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L75)

How to draw the moon: its colour, and state a renderer computes.

---

### ellipsoid?

```ts
ellipsoid?: EllipsoidInterface;
```

Defined in:
[celestial-bodies/moons.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L62)

Reference ellipsoid, from the IAU Working Group on Cartographic Coordinates and
Rotational Elements, where it gives one. `radius` is the mean radius.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/moons.ts:39](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L39)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/moons.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L67)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/moons.ts:41](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L41)

Name of the moon (e.g., "Io", "Europa", "Titan").

---

### orbit

```ts
orbit: OrbitInterface;
```

Defined in:
[celestial-bodies/moons.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L49)

Orbit around the parent planet.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/moons.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L47)

Id of the planet the moon orbits (e.g., `'jupiter'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L56)

Mean radius of the moon in kilometres; the IAU's, where it gives one.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/moons.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L54)

How the moon spins: its sidereal rotation period and direction. Given where the
IAU, or a measurement, publishes one.

---

### type?

```ts
type?: undefined;
```

Defined in:
[celestial-bodies/moons.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L42)

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:69](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L69)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:71](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L71)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L73)

Z-coordinate in a distance-based system (optional).
