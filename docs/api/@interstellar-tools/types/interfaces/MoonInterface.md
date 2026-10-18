[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonInterface

# Interface: MoonInterface

Defined in:
[celestial-bodies/moons.ts:35](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L35)

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
    period: { value: -3.551, unit: 'd' },
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
[celestial-bodies/moons.ts:42](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L42)

Classification of the moon.

---

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/moons.ts:57](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L57)

How to draw the moon: its colour, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/moons.ts:37](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L37)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/moons.ts:39](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L39)

Name of the moon (e.g., "Io", "Europa", "Titan").

---

### orbit

```ts
orbit: OrbitInterface;
```

Defined in:
[celestial-bodies/moons.ts:47](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L47)

Orbit around the parent planet.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/moons.ts:45](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L45)

Id of the planet the moon orbits (e.g., `'jupiter'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:49](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L49)

Physical radius of the moon in kilometres.

---

### type?

```ts
optional type?: undefined;
```

Defined in:
[celestial-bodies/moons.ts:40](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L40)

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:51](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L51)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:53](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L53)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:55](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/moons.ts#L55)

Z-coordinate in a distance-based system (optional).
