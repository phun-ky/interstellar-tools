[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometInterface

# Interface: CometInterface

Defined in:
[celestial-bodies/comets.ts:25](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L25)

Represents a **comet** in the solar system simulation.

**Cometary Orbital Parameters:**

- **Semi-major axis (`a`)**: Defines the **size** of the comet’s orbit in
  **Astronomical Units (AU)**.
- **Orbital eccentricity (`e`)**: Determines how **elliptical** the orbit is
  ($0 = $ circular, closer to $1$ = highly elliptical).
- **Inclination (`i`)**: The tilt of the orbit relative to the **ecliptic
  plane**, measured in **degrees**.
- **Argument of perihelion (`w`)**: The angle from the **ascending node** to the
  **perihelion**.
- **Longitude of the ascending node (`om`)**: Defines where the orbit crosses
  the ecliptic.
- **Perihelion distance (`q`)**: The closest approach to the Sun in **AU**.

**Visualization Parameters:**

- **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
- **Color (`color`)**: Used for visual representation.
- **Size (`size`)**: Scaled size for display (not the actual physical size).

## Properties

### a

```ts
a: MeasureInterface;
```

Defined in:
[celestial-bodies/comets.ts:35](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L35)

Semi-major axis of the orbit in AU.

---

### angle

```ts
angle: Radians;
```

Defined in:
[celestial-bodies/comets.ts:45](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L45)

Mean anomaly at epoch in radians.

---

### category

```ts
category: 'halley-type comet' | 'long-period comet' | 'jupiter-family comet';
```

Defined in:
[celestial-bodies/comets.ts:31](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L31)

Category classification of the comet.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/comets.ts:65](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L65)

Visual representation color.

---

### e

```ts
e: number;
```

Defined in:
[celestial-bodies/comets.ts:37](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L37)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### focus_x?

```ts
optional focus_x: number;
```

Defined in:
[celestial-bodies/comets.ts:59](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L59)

X-offset for the ellipse focus (accounts for eccentricity).

---

### i

```ts
i: number;
```

Defined in:
[celestial-bodies/comets.ts:39](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L39)

Orbital inclination in degrees.

---

### miA?

```ts
optional miA: number;
```

Defined in:
[celestial-bodies/comets.ts:57](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L57)

Semi-minor axis converted to pixels (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/comets.ts:27](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L27)

Name of the comet (e.g., "Halley", "Hale-Bopp").

---

### om

```ts
om: number;
```

Defined in:
[celestial-bodies/comets.ts:43](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L43)

Longitude of the ascending node in degrees.

---

### orbitPath?

```ts
optional orbitPath: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/comets.ts:63](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L63)

Precomputed orbital path points for visualization (optional).

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/comets.ts:47](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L47)

Orbital period in Earth days. Negative values indicate counter clockwise orbit

---

### q

```ts
q: number;
```

Defined in:
[celestial-bodies/comets.ts:49](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L49)

Perihelion distance in AU.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:61](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L61)

Radius of the comet (for visualization purposes).

---

### size

```ts
size: number;
```

Defined in:
[celestial-bodies/comets.ts:67](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L67)

Scaled size for visualization (not actual physical size).

---

### system

```ts
system: string;
```

Defined in:
[celestial-bodies/comets.ts:33](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L33)

The star system where the comet is located.

---

### type

```ts
type: 'periodic comet' | 'oort cloud comet' | 'short-period comet';
```

Defined in:
[celestial-bodies/comets.ts:29](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L29)

Type of comet based on its orbital characteristics.

---

### w

```ts
w: number;
```

Defined in:
[celestial-bodies/comets.ts:41](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L41)

Argument of perihelion in degrees.

---

### x?

```ts
optional x: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:51](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L51)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
optional y: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:53](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L53)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
optional z: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:55](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/types/src/celestial-bodies/comets.ts#L55)

Z-coordinate in a distance-based system (optional).
