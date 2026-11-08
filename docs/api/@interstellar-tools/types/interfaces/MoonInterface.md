[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonInterface

# Interface: MoonInterface

Defined in:
[celestial-bodies/moons.ts:39](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L39)

Represents a **moon** (natural satellite) orbiting a planet, a dwarf planet or
an asteroid.

A moon always has a `parent` (its planet, or an asteroid like Dimorphos's
Didymos) and an `orbit` around it; see [OrbitInterface](OrbitInterface.md).

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
[celestial-bodies/moons.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L46)

Classification of the moon.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/moons.ts:77](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L77)

How to draw the moon: its colour, and state a renderer computes.

---

### ellipsoid?

```ts
ellipsoid?: EllipsoidInterface;
```

Defined in:
[celestial-bodies/moons.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L64)

Reference ellipsoid, from the IAU Working Group on Cartographic Coordinates and
Rotational Elements, where it gives one. `radius` is the mean radius.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/moons.ts:41](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L41)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/moons.ts:69](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L69)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/moons.ts:43](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L43)

Name of the moon (e.g., "Io", "Europa", "Titan").

---

### orbit

```ts
orbit: OrbitInterface;
```

Defined in:
[celestial-bodies/moons.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L51)

Orbit around the parent.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/moons.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L49)

Id of the planet, or asteroid, the moon orbits (e.g., `'jupiter'`,
`'65803-didymos'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L58)

Mean radius of the moon in kilometres; the IAU's, where it gives one.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/moons.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L56)

How the moon spins: its sidereal rotation period and direction. Given where the
IAU, or a measurement, publishes one.

---

### type?

```ts
type?: undefined;
```

Defined in:
[celestial-bodies/moons.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L44)

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:71](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L71)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L73)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:75](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/moons.ts#L75)

Z-coordinate in a distance-based system (optional).
