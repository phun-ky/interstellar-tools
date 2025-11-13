[Documentation](../../index.md) / [@interstellar-tools/types](../types.md) /
AsteroidBeltInterface

# Interface: AsteroidBeltInterface

Defined in: celestial-bodies/asteroid-belts.ts:14

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

Defined in: celestial-bodies/asteroid-belts.ts:22

Belt color for visualization.

---

### density

```ts
density: number;
```

Defined in: celestial-bodies/asteroid-belts.ts:26

Density factor affecting how many asteroids are simulated.

---

### innerRadius

```ts
innerRadius: number;
```

Defined in: celestial-bodies/asteroid-belts.ts:18

Inner radius of the belt in Astronomical Units (AU).

---

### name

```ts
name: string;
```

Defined in: celestial-bodies/asteroid-belts.ts:16

Name of the asteroid belt.

---

### opacity

```ts
opacity: number;
```

Defined in: celestial-bodies/asteroid-belts.ts:24

Transparency level (0 = fully transparent, 1 = solid).

---

### orbitPath?

```ts
optional orbitPath: CartesianCoordinatesInterface[];
```

Defined in: celestial-bodies/asteroid-belts.ts:28

Optional: Orbit path for finer asteroid positioning.

---

### outerRadius

```ts
outerRadius: number;
```

Defined in: celestial-bodies/asteroid-belts.ts:20

Outer radius of the belt in Astronomical Units (AU).
