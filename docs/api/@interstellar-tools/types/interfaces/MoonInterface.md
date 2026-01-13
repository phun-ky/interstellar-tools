[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonInterface

# Interface: MoonInterface

Defined in:
[celestial-bodies/moons.ts:37](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L37)

Represents a **moon** (natural satellite) orbiting a planet.

**Orbital Properties:**

- **Semi-major axis (`a`)**: Defines the moon’s orbit size in **Astronomical
  Units (AU)**.
- **Orbital eccentricity (`e`)**: Determines how elliptical the orbit is ($0 =$
  circular, closer to $1 =$ highly elliptical).
- **Orbital period (`period`)**: Time taken for one full orbit in **Earth
  days**. Negative values indicate counter clockwise direction.
- **True anomaly (`angle`)**: The moon’s current position in its orbit (in
  **radians**).

**Visualization Properties:**

- **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
- **Color (`color`)**: Visual representation.
- **Size (`radius`)**: Actual moon radius in **kilometers (km)**.

## Example

```ts
const europa: MoonInterface = {
  name: 'Europa',
  category: 'natural satellite',
  system: 'Jupiter',
  a: { value: 0.00448, unit: 'au' },
  e: 0.009,
  period: { value: 3.55, unit: 'd' },
  radius: { value: 1560.8, unit: 'km' },
  color: '#a6a6a6',
  angle: 0
};
```

## Properties

### a

```ts
a: MeasureInterface;
```

Defined in:
[celestial-bodies/moons.ts:49](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L49)

Semi-major axis of the orbit in AU.

---

### angle

```ts
angle: Radians;
```

Defined in:
[celestial-bodies/moons.ts:63](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L63)

Current orbital position in radians (True Anomaly).

---

### category

```ts
category: 'natural satellite' | 'irregular satellite' | 'retrograde satellite';
```

Defined in:
[celestial-bodies/moons.ts:42](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L42)

Classification of the moon.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/moons.ts:61](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L61)

Visual representation color.

---

### e

```ts
e: number;
```

Defined in:
[celestial-bodies/moons.ts:51](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L51)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### focus_x?

```ts
optional focus_x: number;
```

Defined in:
[celestial-bodies/moons.ts:55](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L55)

X-offset for the ellipse focus (accounts for eccentricity).

---

### miA?

```ts
optional miA: number;
```

Defined in:
[celestial-bodies/moons.ts:53](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L53)

Semi-minor axis converted to pixels (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/moons.ts:39](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L39)

Name of the moon (e.g., "Io", "Europa", "Titan").

---

### orbitPath?

```ts
optional orbitPath: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/moons.ts:71](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L71)

Precomputed orbital path points for visualization (optional).

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/moons.ts:57](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L57)

Orbital period in Earth days. Negative values indicate counter clockwise orbit

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:59](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L59)

Physical radius of the moon in kilometres.

---

### system

```ts
system: string;
```

Defined in:
[celestial-bodies/moons.ts:47](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L47)

The planetary system where the moon is located (e.g., "Jupiter").

---

### type?

```ts
optional type: undefined;
```

Defined in:
[celestial-bodies/moons.ts:40](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L40)

---

### x?

```ts
optional x: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:65](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L65)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
optional y: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:67](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L67)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
optional z: DistanceInterface;
```

Defined in:
[celestial-bodies/moons.ts:69](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/moons.ts#L69)

Z-coordinate in a distance-based system (optional).
