[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltInterface

# Interface: AsteroidBeltInterface

Defined in:
[celestial-bodies/asteroid-belts.ts:15](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L15)

Represents an asteroid belt within the solar system simulation.

**Asteroid Belt Properties:**

- **Inner and Outer Radius**: The belt's boundaries, as distances from the
  parent.
- **Drawing (`display`)**: colour, opacity, and density (how many asteroids to
  draw); see [DisplayInterface](DisplayInterface.md).

## Properties

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L27)

How to draw the belt: colour, opacity and density, and state a renderer
computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L17)

Stable identifier. Never translated.

---

### innerRadius

```ts
innerRadius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:23](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L23)

Inner radius of the belt, from the parent.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:19](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L19)

Name of the asteroid belt.

---

### outerRadius

```ts
outerRadius: DistanceInterface;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:25](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L25)

Outer radius of the belt, from the parent.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:21](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L21)

Id of the star the belt orbits (e.g., `'sun'`).
