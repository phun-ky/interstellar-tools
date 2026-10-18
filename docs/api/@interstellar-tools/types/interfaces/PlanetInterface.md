[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetInterface

# Interface: PlanetInterface

Defined in:
[celestial-bodies/planets.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L42)

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
[celestial-bodies/planets.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L68)

Defines whether the object is a planet or a planetoid.

---

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/planets.ts:87](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L87)

How to draw the planet: its colour, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/planets.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L44)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
optional mu?: number;
```

Defined in:
[celestial-bodies/planets.ts:79](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L79)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/planets.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L46)

Name of the planet (e.g., "Earth", "Mars").

---

### orbit?

```ts
optional orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/planets.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L72)

Orbit around the parent.

---

### parent?

```ts
optional parent?: string;
```

Defined in:
[celestial-bodies/planets.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L70)

Id of the star, system or galaxy the planet is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L74)

Physical radius of the planet in kilometres.

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
[celestial-bodies/planets.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L48)

Type classification of the planet.

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L81)

X-coordinate in the parent's frame. Optional: a rogue planet or an exoplanet may
have no known position.

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:83](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L83)

Y-coordinate in the parent's frame.

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:85](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L85)

Z-coordinate in the parent's frame.
