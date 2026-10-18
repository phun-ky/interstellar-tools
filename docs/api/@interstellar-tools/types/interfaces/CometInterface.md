[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometInterface

# Interface: CometInterface

Defined in:
[celestial-bodies/comets.ts:23](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L23)

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
- **Perihelion distance (`q`)**: The closest approach to the Sun in **AU**.
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
[celestial-bodies/comets.ts:31](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L31)

Category classification of the comet.

---

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/comets.ts:45](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L45)

How to draw the comet: its colour and drawn size, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/comets.ts:25](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L25)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/comets.ts:27](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L27)

Name of the comet (e.g., "Halley", "Hale-Bopp").

---

### orbit

```ts
orbit: Required<OrbitInterface>;
```

Defined in:
[celestial-bodies/comets.ts:35](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L35)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/comets.ts:33](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L33)

Id of the star the comet orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:43](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L43)

Radius of the comet (for visualization purposes).

---

### type

```ts
type: 'periodic comet' | 'oort cloud comet' | 'short-period comet';
```

Defined in:
[celestial-bodies/comets.ts:29](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L29)

Type of comet based on its orbital characteristics.

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:37](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L37)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:39](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L39)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:41](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/comets.ts#L41)

Z-coordinate in a distance-based system (optional).
