[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetInterface

# Interface: PlanetInterface

Defined in:
[celestial-bodies/planets.ts:57](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L57)

Represents a **planet** or **planetoid**.

A planet is bound to one `parent`: usually a star, a binary system for a
circumbinary planet, or the galaxy for a rogue planet. Its `orbit` describes the
motion around that parent; see [OrbitInterface](OrbitInterface.md).

**Classification & Visualization:**

- **Type (`type`)**: Scientific classification of the planet (e.g.,
  **terrestrial, gas giant, ice planet**).
- **Category (`category`)**: Defines whether the object is a **planet** or a
  **planetoid**.
- **Color (`color`)**: Used for visual representation in simulations.
- **Size (`radius`)**: Physical planet radius in **kilometers (km)**.

## Example

```ts
const earth: PlanetInterface = {
  id: 'earth',
  name: 'Earth',
  type: 'terrestrial planet',
  category: 'planet',
  color: '#4287f5',
  parent: 'sun',
  orbit: {
    a: { value: 1.0, unit: 'au' },
    e: 0.0167,
    period: { value: -365.256, unit: 'd' },
    angle: 1.753 as Radians
  },
  radius: { value: 6371, unit: 'km' },
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
[celestial-bodies/planets.ts:83](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L83)

Defines whether the object is a planet or a planetoid.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/planets.ts:85](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L85)

Visual representation color.

---

### focus_x?

```ts
optional focus_x?: number;
```

Defined in:
[celestial-bodies/planets.ts:95](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L95)

X-offset for the ellipse focus (accounts for eccentricity).

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/planets.ts:59](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L59)

Stable identifier, used by `parent` references. Never translated.

---

### miA?

```ts
optional miA?: number;
```

Defined in:
[celestial-bodies/planets.ts:93](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L93)

Semi-minor axis of the orbit (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/planets.ts:61](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L61)

Name of the planet (e.g., "Earth", "Mars").

---

### orbit?

```ts
optional orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/planets.ts:89](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L89)

Orbit around the parent.

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/planets.ts:103](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L103)

Precomputed orbital path points for visualization (optional).

---

### parent?

```ts
optional parent?: string;
```

Defined in:
[celestial-bodies/planets.ts:87](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L87)

Id of the star, system or galaxy the planet is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:91](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L91)

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
[celestial-bodies/planets.ts:63](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L63)

Type classification of the planet.

---

### x

```ts
x: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:97](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L97)

X-coordinate in the parent's frame.

---

### y

```ts
y: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:99](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L99)

Y-coordinate in the parent's frame.

---

### z

```ts
z: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:101](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/planets.ts#L101)

Z-coordinate in the parent's frame.
