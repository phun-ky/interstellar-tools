[Documentation](../../index.md) / [@interstellar-tools/types](../types.md) /
StarInterface

# Interface: StarInterface

Defined in: celestial-bodies/stars.ts:62

Represents a **star** in a planetary or stellar system.

**Orbital & Physical Properties:**

- **Semi-major axis (`a`)**: Defines the star’s orbit size (AU or light-years).
- **Orbital eccentricity (`e`)**: Determines how elliptical the orbit is.
- **Orbital period (`period`)**: Time taken for one full orbit. Negative values
  indicates counter clockwise direction.
- **True anomaly (`angle`)**: The star’s current position in its orbit (in
  **radians**).
- **Radius (`radius`)**: Physical size of the star.

**Classification & Visualization:**

- **Type (`type`)**: Classification of the star (e.g., **main-sequence star,
  white dwarf**).
- **Category (`category`)**: Defined as `'star'`.
- **Color (`color`)**: Used for visual representation.

## Example

```ts
const sun: StarInterface = {
  name: 'Sun',
  type: 'G-type main-sequence',
  category: 'star',
  system: solarSystem,
  radius: { value: 695700, unit: 'km' },
  color: '#ffcc00',
  a: { value: 0, unit: 'au' },
  e: 0,
  period: { value: 0, unit: 'years' },
  angle: 0,
  x: { value: 0, unit: 'au' },
  y: { value: 0, unit: 'au' },
  z: { value: 0, unit: 'au' }
};
```

## Properties

### a

```ts
a: MeasureInterface;
```

Defined in: celestial-bodies/stars.ts:76

Semi-major axis of the orbit (AU or light-years).

---

### angle

```ts
angle: number;
```

Defined in: celestial-bodies/stars.ts:84

Current orbital position in radians (True Anomaly).

---

### category

```ts
category: 'star';
```

Defined in: celestial-bodies/stars.ts:68

Defines the category as a star.

---

### color

```ts
color: string;
```

Defined in: celestial-bodies/stars.ts:74

Visual representation color.

---

### e

```ts
e: number;
```

Defined in: celestial-bodies/stars.ts:78

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### focus_x?

```ts
optional focus_x: number;
```

Defined in: celestial-bodies/stars.ts:82

X-offset for the ellipse focus (accounts for eccentricity).

---

### miA?

```ts
optional miA: number;
```

Defined in: celestial-bodies/stars.ts:80

Semi-minor axis of the orbit (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in: celestial-bodies/stars.ts:64

Name of the star.

---

### orbitPath?

```ts
optional orbitPath: CartesianCoordinatesInterface[];
```

Defined in: celestial-bodies/stars.ts:94

Precomputed orbital path points for visualization (optional).

---

### period

```ts
period: TemporalInterface;
```

Defined in: celestial-bodies/stars.ts:92

Orbital period of the star. Negative values indicate counter clockwise
direction.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in: celestial-bodies/stars.ts:72

Physical radius of the star.

---

### system

```ts
system: StarSystemInterface;
```

Defined in: celestial-bodies/stars.ts:70

The system in which the star exists.

---

### type

```ts
type: string;
```

Defined in: celestial-bodies/stars.ts:66

Classification of the star (e.g., main-sequence, red giant, white dwarf).

---

### x

```ts
x: DistanceInterface;
```

Defined in: celestial-bodies/stars.ts:86

X-coordinate in a distance-based system.

---

### y

```ts
y: DistanceInterface;
```

Defined in: celestial-bodies/stars.ts:88

Y-coordinate in a distance-based system.

---

### z

```ts
z: DistanceInterface;
```

Defined in: celestial-bodies/stars.ts:90

Z-coordinate in a distance-based system.
