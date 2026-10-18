[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltInterface

# Interface: AsteroidBeltInterface

Defined in:
[celestial-bodies/asteroid-belts.ts:13](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L13)

Represents an asteroid belt within the solar system simulation.

**Asteroid Belt Properties:**

- **Inner and Outer Radius**: Defines the spatial boundaries of the belt in
  **Astronomical Units (AU)**.
- **Drawing (`display`)**: colour, opacity, and density (how many asteroids to
  draw); see [DisplayInterface](DisplayInterface.md).

## Properties

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:25](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L25)

How to draw the belt: colour, opacity and density, and state a renderer
computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:15](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L15)

Stable identifier. Never translated.

---

### innerRadius

```ts
innerRadius: number;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:21](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L21)

Inner radius of the belt in Astronomical Units (AU).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:17](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L17)

Name of the asteroid belt.

---

### outerRadius

```ts
outerRadius: number;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:23](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L23)

Outer radius of the belt in Astronomical Units (AU).

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/asteroid-belts.ts:19](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/celestial-bodies/asteroid-belts.ts#L19)

Id of the star the belt orbits (e.g., `'sun'`).
