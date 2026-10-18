[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltInterface

# Interface: AsteroidBeltInterface

Defined in:
[celestial-bodies/asteroid-belts.ts:14](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L14)

Represents an asteroid belt within the solar system simulation.

**Asteroid Belt Properties:**

- **Inner and Outer Radius**: Defines the spatial boundaries of the belt in
  **Astronomical Units (AU)**.
- **Density**: Determines the number of simulated asteroids within the belt.
- **Color and Opacity**: Used for visualization.
- **Orbit Path (Optional)**: Stores a precomputed path for asteroid positioning.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:26](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L26)

Belt color for visualization.

---

### density

```ts
density: number;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:30](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L30)

Density factor affecting how many asteroids are simulated.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:16](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L16)

Stable identifier. Never translated.

---

### innerRadius

```ts
innerRadius: number;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:22](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L22)

Inner radius of the belt in Astronomical Units (AU).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:18](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L18)

Name of the asteroid belt.

---

### opacity

```ts
opacity: number;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:28](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L28)

Transparency level (0 = fully transparent, 1 = solid).

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:32](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L32)

Optional: Orbit path for finer asteroid positioning.

---

### outerRadius

```ts
outerRadius: number;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:24](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L24)

Outer radius of the belt in Astronomical Units (AU).

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:20](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/asteroid-belts.ts#L20)

Id of the star the belt orbits (e.g., `'sun'`).
