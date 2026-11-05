[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetInterface

# Interface: PlanetInterface

Defined in:
[celestial-bodies/planets.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L44)

Represents a **planet** or **planetoid**.

A planet is bound to one `parent`: usually a star, a binary system for a
circumbinary planet, or the galaxy for a rogue planet. Its `orbit` describes the
motion around that parent; see [OrbitInterface](OrbitInterface.md).

**Classification & Visualization:**

- **Type (`type`)**: Scientific classification of the planet (e.g.,
  **terrestrial, gas giant, ice planet**).
- **Category (`category`)**: Defines whether the object is a **planet** or a
  **planetoid**.
- **Drawing (`display`)**: colour, and state a renderer computes; see
  [DisplayInterface](DisplayInterface.md).
- **Size (`radius`)**: Physical planet radius in **kilometers (km)**.

## Example

```ts
const earth: PlanetInterface = {
  id: 'earth',
  name: 'Earth',
  type: 'terrestrial planet',
  category: 'planet',
  parent: 'sun',
  orbit: {
    a: { value: 1.0, unit: 'au' },
    e: 0.0167,
    period: { value: 365.256, unit: 'd' },
    angle: 1.753 as Radians
  },
  radius: { value: 6371, unit: 'km' },
  display: { color: '#4287f5' },
  x: { value: 0, unit: 'au' },
  y: { value: 1, unit: 'au' },
  z: { value: 0, unit: 'au' }
};
```

## Properties

### category

```ts
category: 'planet' | 'planetoid';
```

Defined in:
[celestial-bodies/planets.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L70)

Defines whether the object is a planet or a planetoid.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/planets.ts:100](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L100)

How to draw the planet: its colour, and state a renderer computes.

---

### ellipsoid?

```ts
ellipsoid?: EllipsoidInterface;
```

Defined in:
[celestial-bodies/planets.ts:87](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L87)

Reference ellipsoid, from the IAU Working Group on Cartographic Coordinates and
Rotational Elements, where it gives one. `radius` is the mean radius.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/planets.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L46)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/planets.ts:92](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L92)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/planets.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L48)

Name of the planet (e.g., "Earth", "Mars").

---

### orbit?

```ts
orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/planets.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L74)

Orbit around the parent.

---

### parent?

```ts
parent?: string;
```

Defined in:
[celestial-bodies/planets.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L72)

Id of the star, system or galaxy the planet is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L81)

Mean radius of the planet in kilometres; the IAU's, where it gives one.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/planets.ts:79](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L79)

How the planet spins: its sidereal rotation period and direction. Given where
the IAU, or a measurement, publishes one.

---

### type

```ts
type:
  | "chthonian planet"
  | "carbon planet"
  | "coreless planet"
  | "desert planet"
  | "gas dwarf"
  | "gas giant"
  | "helium planet"
  | "hycean planet"
  | "ice giant"
  | "ice planet"
  | "iron planet"
  | "lava planet"
  | "ocean planet"
  | "proto planet"
  | "puffy planet"
  | "super-puff"
  | "silicate planet"
  | "terrestrial planet";
```

Defined in:
[celestial-bodies/planets.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L50)

Type classification of the planet.

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:94](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L94)

X-coordinate in the parent's frame. Optional: a rogue planet or an exoplanet may
have no known position.

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:96](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L96)

Y-coordinate in the parent's frame.

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:98](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L98)

Z-coordinate in the parent's frame.
