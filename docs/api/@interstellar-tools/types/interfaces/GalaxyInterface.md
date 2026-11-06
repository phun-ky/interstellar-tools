[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyInterface

# Interface: GalaxyInterface

Defined in:
[celestial-bodies/galaxies.ts:60](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L60)

Represents a **galaxy** in the universe simulation.

**Galaxy Properties:**

- **Name (`name`)**: The galaxy's official designation.
- **Type (`type`)**: The morphological classification (e.g., Spiral,
  Elliptical).
- **Diameter (`diameter`)**: Measured in **light-years**.
- **Distance (`distance`)**: The distance from the Sun, also in **light-years**:
  0 for the Milky Way itself.
- **Black Hole (`blackHole`)**: The central supermassive black hole, where one
  is detected. Triangulum (M33) has none: observations only limit its mass to a
  few thousand $M_\odot$.

## Example

```ts
const milkyWay: GalaxyInterface = {
  id: 'milky-way',
  name: 'Milky Way',
  type: 'SBbc',
  diameter: { value: 87410, unit: 'ly' },
  distance: { value: 0, unit: 'ly' },
  blackHole: sagittariusA
};
```

## Properties

### blackHole?

```ts
blackHole?: BlackHoleInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L72)

Central supermassive black hole of the galaxy. Omitted where none is detected.

---

### diameter

```ts
diameter: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L68)

Diameter of the galaxy in light-years.

---

### distance

```ts
distance: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L70)

Distance from the Sun in light-years: 0 for the Milky Way itself.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/galaxies.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L62)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L64)

Name of the galaxy.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/galaxies.ts:66](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L66)

Morphological classification of the galaxy.
