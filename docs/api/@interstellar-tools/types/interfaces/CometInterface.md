[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometInterface

# Interface: CometInterface

Defined in:
[celestial-bodies/comets.ts:26](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L26)

Represents a **comet** in the solar system simulation.

**Cometary Orbital Parameters**, all in `orbit`:

- **Semi-major axis (`a`)**: Defines the **size** of the comet’s orbit in
  **Astronomical Units (AU)**.
- **Orbital eccentricity (`e`)**: Determines how **elliptical** the orbit is ($0
  = $ circular, closer to $1$ = highly elliptical).
- **Inclination (`i`)**: The tilt of the orbit relative to the **ecliptic
  plane**, measured in **degrees**.
- **Argument of perihelion (`w`)**: The angle from the **ascending node** to the
  **perihelion**.
- **Longitude of the ascending node (`om`)**: Defines where the orbit crosses
  the ecliptic.
- **Perihelion distance (`q`)**: The closest approach to the Sun, as a distance.
- **Direction (`retrograde`)**: `true` when `i > 90°`, like Halley's comet.
- **Angle (`angle`)**: The **true anomaly** at J2000, as for every other body.

**Drawing (`display`)**: colour and a scaled drawing size (not the physical
`radius`), and state a renderer computes; see
[DisplayInterface](DisplayInterface.md).

## Properties

### category

```ts
category: 'halley-type comet' | 'long-period comet' | 'jupiter-family comet';
```

Defined in:
[celestial-bodies/comets.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L34)

Category classification of the comet.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/comets.ts:53](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L53)

How to draw the comet: its colour and drawn size, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/comets.ts:28](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L28)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/comets.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L30)

Name of the comet (e.g., "Halley", "Hale-Bopp").

---

### observations?

```ts
observations?: CometObservationsInterface;
```

Defined in:
[celestial-bodies/comets.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L58)

What is measured about it, with uncertainties and sources, apart from the values
the equations use.

---

### orbit

```ts
orbit: FullOrbitInterface;
```

Defined in:
[celestial-bodies/comets.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L38)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/comets.ts:36](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L36)

Id of the star the comet orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L51)

Radius of the comet (for visualization purposes).

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/comets.ts:43](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L43)

How the nucleus spins: its sidereal rotation period and direction, at the time
it was measured. Given where one is published.

---

### type

```ts
type: 'periodic comet' | 'oort cloud comet' | 'short-period comet';
```

Defined in:
[celestial-bodies/comets.ts:32](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L32)

Type of comet based on its orbital characteristics.

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:45](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L45)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L47)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L49)

Z-coordinate in a distance-based system (optional).
