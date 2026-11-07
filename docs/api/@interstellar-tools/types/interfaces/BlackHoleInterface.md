[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
BlackHoleInterface

# Interface: BlackHoleInterface

Defined in:
[celestial-bodies/galaxies.ts:32](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L32)

Represents a **black hole** at the center of a galaxy.

**Black Hole Properties:**

- **Mass (`mass`)**: Measured in **solar masses** ($M_\odot$).
- **Schwarzschild radius (`radius`)**: $r_s = 2GM/c^2$, from its mass, in
  **Astronomical Units (AU)**.
- **Position (`x`, `y`)**: Coordinates relative to the galaxy center in **AU**.
- **Id (`id`)**: given where stars orbit it, so they can name it as their
  `parent`, like the S-stars around Sagittarius A\*. Their orbits take its `mu`.
- **Ring (`ringDiameter`)**: the angular diameter of the bright ring around its
  shadow, where the Event Horizon Telescope has imaged it.

## Example

```ts
const sagittariusA: BlackHoleInterface = {
  id: 'sagittarius-a-star',
  name: 'Sagittarius A*',
  mass: 4.2996e6,
  mu: 5.706e26,
  radius: { value: 0.08488, unit: 'au' },
  distance: { value: 26992, unit: 'ly' },
  ringDiameter: 2.511e-10 as Radians, // 51.8 μas
  x: { value: 0, unit: 'au' },
  y: { value: 0, unit: 'au' }
};
```

## Properties

### distance?

```ts
distance?: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:45](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L45)

Distance from the Sun, where it's measured apart from its galaxy's.

---

### id?

```ts
id?: string;
```

Defined in:
[celestial-bodies/galaxies.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L34)

Stable identifier, used by `parent` references. Given where something orbits it.

---

### mass

```ts
mass: number;
```

Defined in:
[celestial-bodies/galaxies.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L38)

Mass of the black hole in solar masses.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/galaxies.ts:43](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L43)

Standard gravitational parameter $\mu = G M$, in m³/s², as the orbit equations
take it. Given where something orbits it.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:36](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L36)

Name of the central black hole.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L49)

Schwarzschild radius of the black hole in AU.

---

### ringDiameter?

```ts
ringDiameter?: Radians;
```

Defined in:
[celestial-bodies/galaxies.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L47)

Angular diameter of the ring the Event Horizon Telescope imaged around its
shadow.

---

### x

```ts
x: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L51)

X-coordinate relative to the galaxy center in AU.

---

### y

```ts
y: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:53](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L53)

Y-coordinate relative to the galaxy center in AU.
