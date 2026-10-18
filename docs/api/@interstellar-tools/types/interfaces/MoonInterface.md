[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonInterface

# Interface: MoonInterface

Defined in:
[celestial-bodies/moons.ts:36](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L36)

Represents a **moon** (natural satellite) orbiting a planet.

A moon always has a `parent` (its planet) and an `orbit` around it; see
[OrbitInterface](OrbitInterface.md).

**Visualization Properties:**

- **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
- **Color (`color`)**: Visual representation.
- **Size (`radius`)**: Actual moon radius in **kilometers (km)**.

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
  color: '#a6a6a6'
};
```

## Properties

### category

```ts
category: 'natural satellite' | 'irregular satellite' | 'retrograde satellite';
```

Defined in:
[celestial-bodies/moons.ts:43](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L43)

Classification of the moon.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/moons.ts:56](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L56)

Visual representation color.

---

### focus_x?

```ts
optional focus_x?: number;
```

Defined in:
[celestial-bodies/moons.ts:52](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L52)

X-offset for the ellipse focus (accounts for eccentricity).

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/moons.ts:38](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L38)

Stable identifier, used by `parent` references. Never translated.

---

### miA?

```ts
optional miA?: number;
```

Defined in:
[celestial-bodies/moons.ts:50](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L50)

Semi-minor axis converted to pixels (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/moons.ts:40](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L40)

Name of the moon (e.g., "Io", "Europa", "Titan").

---

### orbit

```ts
orbit: OrbitInterface;
```

Defined in:
[celestial-bodies/moons.ts:48](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L48)

Orbit around the parent planet.

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/moons.ts:64](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L64)

Precomputed orbital path points for visualization (optional).

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/moons.ts:46](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L46)

Id of the planet the moon orbits (e.g., `'jupiter'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:54](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L54)

Physical radius of the moon in kilometres.

---

### type?

```ts
optional type?: undefined;
```

Defined in:
[celestial-bodies/moons.ts:41](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L41)

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:58](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L58)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:60](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L60)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:62](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/moons.ts#L62)

Z-coordinate in a distance-based system (optional).
