[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
BlackHoleInterface

# Interface: BlackHoleInterface

Defined in:
[celestial-bodies/galaxies.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L42)

Represents a **black hole** at the center of a galaxy.

**Black Hole Properties:**

- **Mass (`mass`)**: Measured in **solar masses** ($M_\odot$).
- **Schwarzschild radius (`radius`)**: $r_s = 2GM/c^2$, from its mass, in
  **Astronomical Units (AU)**.
- **Position (`x`, `y`, `z`)**: Coordinates relative to the galaxy center in
  **AU**, `z` out of its disk.
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
  y: { value: 0, unit: 'au' },
  z: { value: 0, unit: 'au' }
};
```

## Properties

### distance?

```ts
distance?: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:55](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L55)

Distance from the Sun, where it's measured apart from its galaxy's.

---

### id?

```ts
id?: string;
```

Defined in:
[celestial-bodies/galaxies.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L44)

Stable identifier, used by `parent` references. Given where something orbits it.

---

### mass

```ts
mass: number;
```

Defined in:
[celestial-bodies/galaxies.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L48)

Mass of the black hole in solar masses.

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/galaxies.ts:53](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L53)

Standard gravitational parameter $\mu = G M$, in m³/s², as the orbit equations
take it. Given where something orbits it.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L46)

Name of the central black hole.

---

### observations?

```ts
observations?: BlackHoleObservationsInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L70)

What is measured about it, with uncertainties and sources, apart from the values
the equations use.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L59)

Schwarzschild radius of the black hole in AU.

---

### ringDiameter?

```ts
ringDiameter?: Radians;
```

Defined in:
[celestial-bodies/galaxies.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L57)

Angular diameter of the ring the Event Horizon Telescope imaged around its
shadow.

---

### x

```ts
x: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L61)

X-coordinate relative to the galaxy center in AU.

---

### y

```ts
y: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L63)

Y-coordinate relative to the galaxy center in AU.

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L65)

Z-coordinate relative to the galaxy center in AU, out of its disk.
