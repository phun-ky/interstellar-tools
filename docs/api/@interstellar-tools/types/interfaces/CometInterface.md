[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometInterface

# Interface: CometInterface

Defined in:
[celestial-bodies/comets.ts:25](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L25)

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
- **Angle (`angle`)**: For comets this is the **mean anomaly** at J2000, as in
  the source data.

**Visualization Parameters:**

- **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
- **Color (`color`)**: Used for visual representation.
- **Size (`size`)**: Scaled size for display (not the actual physical size).

## Properties

### category

```ts
category: 'halley-type comet' | 'long-period comet' | 'jupiter-family comet';
```

Defined in:
[celestial-bodies/comets.ts:33](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L33)

Category classification of the comet.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/comets.ts:53](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L53)

Visual representation color.

---

### focus_x?

```ts
optional focus_x?: number;
```

Defined in:
[celestial-bodies/comets.ts:47](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L47)

X-offset for the ellipse focus (accounts for eccentricity).

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/comets.ts:27](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L27)

Stable identifier, used by `parent` references. Never translated.

---

### miA?

```ts
optional miA?: number;
```

Defined in:
[celestial-bodies/comets.ts:45](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L45)

Semi-minor axis converted to pixels (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/comets.ts:29](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L29)

Name of the comet (e.g., "Halley", "Hale-Bopp").

---

### orbit

```ts
orbit: Required<OrbitInterface>;
```

Defined in:
[celestial-bodies/comets.ts:37](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L37)

Orbit around the parent, with all elements including `i`, `w`, `om` and `q`.

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/comets.ts:51](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L51)

Precomputed orbital path points for visualization (optional).

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/comets.ts:35](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L35)

Id of the star the comet orbits (e.g., `'sun'`).

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:49](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L49)

Radius of the comet (for visualization purposes).

---

### size

```ts
size: number;
```

Defined in:
[celestial-bodies/comets.ts:55](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L55)

Scaled size for visualization (not actual physical size).

---

### type

```ts
type: 'periodic comet' | 'oort cloud comet' | 'short-period comet';
```

Defined in:
[celestial-bodies/comets.ts:31](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L31)

Type of comet based on its orbital characteristics.

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:39](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L39)

X-coordinate in a distance-based system (optional).

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:41](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L41)

Y-coordinate in a distance-based system (optional).

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/comets.ts:43](https://github.com/phun-ky/interstellar-tools/blob/0290b9e8ce2ddb639c74b17d30dc4a1129945c5f/packages/types/src/celestial-bodies/comets.ts#L43)

Z-coordinate in a distance-based system (optional).
