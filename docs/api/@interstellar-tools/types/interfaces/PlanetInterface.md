[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetInterface

# Interface: PlanetInterface

Defined in:
[celestial-bodies/planets.ts:45](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L45)

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
[celestial-bodies/planets.ts:71](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L71)

Defines whether the object is a planet or a planetoid.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/planets.ts:101](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L101)

How to draw the planet: its colour, and state a renderer computes.

---

### ellipsoid?

```ts
ellipsoid?: EllipsoidInterface;
```

Defined in:
[celestial-bodies/planets.ts:88](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L88)

Reference ellipsoid, from the IAU Working Group on Cartographic Coordinates and
Rotational Elements, where it gives one. `radius` is the mean radius.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/planets.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L47)

Stable identifier, used by `parent` references. Never translated.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/planets.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L93)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/planets.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L49)

Name of the planet (e.g., "Earth", "Mars").

---

### observations?

```ts
observations?: PlanetObservationsInterface;
```

Defined in:
[celestial-bodies/planets.ts:106](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L106)

What is measured about it, with uncertainties and sources, apart from the values
the equations use.

---

### orbit?

```ts
orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/planets.ts:75](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L75)

Orbit around the parent.

---

### parent?

```ts
parent?: string;
```

Defined in:
[celestial-bodies/planets.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L73)

Id of the star, system or galaxy the planet is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:82](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L82)

Mean radius of the planet in kilometres; the IAU's, where it gives one.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/planets.ts:80](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L80)

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
[celestial-bodies/planets.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L51)

Type classification of the planet.

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L95)

X-coordinate in the parent's frame. Optional: a rogue planet or an exoplanet may
have no known position.

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:97](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L97)

Y-coordinate in the parent's frame.

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:99](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/planets.ts#L99)

Z-coordinate in the parent's frame.
