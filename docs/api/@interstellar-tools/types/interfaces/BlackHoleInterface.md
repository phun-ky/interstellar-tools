[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
BlackHoleInterface

# Interface: BlackHoleInterface

Defined in:
[celestial-bodies/galaxies.ts:23](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/types/src/celestial-bodies/galaxies.ts#L23)

Represents a **black hole** at the center of a galaxy.

**Black Hole Properties:**

- **Mass (`mass`)**: Measured in **solar masses** ($M_\odot$).
- **Schwarzschild radius (`radius`)**: Defined in **Astronomical Units (AU)**.
- **Position (`x`, `y`)**: Coordinates relative to the galaxy center in **AU**.

## Example

```ts
const sagittariusA: BlackHoleInterface = {
  name: 'Sagittarius A*',
  mass: 4.154e6,
  radius: { value: 0.08, unit: 'au' },
  x: { value: 0, unit: 'au' },
  y: { value: 0, unit: 'au' }
};
```

## Properties

### mass

```ts
mass: number;
```

Defined in:
[celestial-bodies/galaxies.ts:27](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/types/src/celestial-bodies/galaxies.ts#L27)

Mass of the black hole in solar masses.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:25](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/types/src/celestial-bodies/galaxies.ts#L25)

Name of the central black hole.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:29](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/types/src/celestial-bodies/galaxies.ts#L29)

Schwarzschild radius of the black hole in AU.

---

### x

```ts
x: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:31](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/types/src/celestial-bodies/galaxies.ts#L31)

X-coordinate relative to the galaxy center in AU.

---

### y

```ts
y: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:33](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/types/src/celestial-bodies/galaxies.ts#L33)

Y-coordinate relative to the galaxy center in AU.
