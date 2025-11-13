[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetInterface

# Interface: PlanetInterface

Defined in:
[celestial-bodies/planets.ts:57](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L57)

Represents a **planet** in the solar system simulation.

**Orbital Properties:**

- **Semi-major axis (`a`)**: Defines the planet’s orbit size in **Astronomical
  Units (AU)**.
- **Orbital eccentricity (`e`)**: Determines how elliptical the orbit is ($0 =$
  circular, closer to $1 =$ highly elliptical).
- **Orbital period (`period`)**: Time taken for one full orbit in **Earth
  days**.
- **True anomaly (`angle`)**: The planet’s current position in its orbit (in
  **radians**).

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
  name: 'Earth',
  type: 'terrestrial planet',
  category: 'planet',
  color: '#4287f5',
  system: 'Sun',
  radius: { value: 6371, unit: 'km' },
  a: { value: 1.0, unit: 'au' },
  e: 0.0167,
  period: { value: 365.25, unit: 'd' },
  angle: 0,
  x: { value: 0, unit: 'au' },
  y: { value: 1, unit: 'au' },
  z: { value: 0, unit: 'au' }
};
```

## Properties

### a

```ts
a: MeasureInterface;
```

Defined in:
[celestial-bodies/planets.ts:89](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L89)

Semi-major axis of the orbit in AU.

---

### angle

```ts
angle: number;
```

Defined in:
[celestial-bodies/planets.ts:97](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L97)

Current orbital position in radians (True Anomaly).

---

### category

```ts
category: 'planet' | 'planetoid';
```

Defined in:
[celestial-bodies/planets.ts:81](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L81)

Defines whether the object is a planet or a planetoid.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/planets.ts:83](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L83)

Visual representation color.

---

### e

```ts
e: number;
```

Defined in:
[celestial-bodies/planets.ts:91](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L91)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### focus_x?

```ts
optional focus_x: number;
```

Defined in:
[celestial-bodies/planets.ts:95](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L95)

X-offset for the ellipse focus (accounts for eccentricity).

---

### miA?

```ts
optional miA: number;
```

Defined in:
[celestial-bodies/planets.ts:93](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L93)

Semi-minor axis of the orbit (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/planets.ts:59](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L59)

Name of the planet (e.g., "Earth", "Mars").

---

### orbitPath?

```ts
optional orbitPath: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/planets.ts:107](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L107)

Precomputed orbital path points for visualization (optional).

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/planets.ts:105](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L105)

Orbital period in Earth days. Negative values indicate counter clockwise orbit

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:87](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L87)

Physical radius of the planet in kilometres.

---

### system

```ts
system: string;
```

Defined in:
[celestial-bodies/planets.ts:85](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L85)

The planetary system in which the planet exists.

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
[celestial-bodies/planets.ts:61](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L61)

Type classification of the planet.

---

### x

```ts
x: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:99](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L99)

X-coordinate in a distance-based system.

---

### y

```ts
y: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:101](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L101)

Y-coordinate in a distance-based system.

---

### z

```ts
z: DistanceInterface;
```

Defined in:
[celestial-bodies/planets.ts:103](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/types/src/celestial-bodies/planets.ts#L103)

Z-coordinate in a distance-based system.
