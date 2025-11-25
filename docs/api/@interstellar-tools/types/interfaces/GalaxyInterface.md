[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyInterface

# Interface: GalaxyInterface

Defined in:
[celestial-bodies/galaxies.ts:58](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/celestial-bodies/galaxies.ts#L58)

Represents a **galaxy** in the universe simulation.

**Galaxy Properties:**

- **Name (`name`)**: The galaxy's official designation.
- **Type (`type`)**: The morphological classification (e.g., Spiral,
  Elliptical).
- **Diameter (`diameter`)**: Measured in **light-years**.
- **Distance (`distance`)**: The distance from the **Milky Way**, also in
  **light-years**.
- **Black Hole (`blackHole`)**: The central supermassive black hole.

## Example

```ts
const milkyWay: GalaxyInterface = {
  name: 'Milky Way',
  type: 'Spiral',
  diameter: { value: 105700, unit: 'lightyears' },
  distance: { value: 0, unit: 'lightyears' },
  blackHole: sagittariusA
};
```

## Properties

### blackHole

```ts
blackHole: BlackHoleInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:68](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/celestial-bodies/galaxies.ts#L68)

Central black hole of the galaxy.

---

### diameter

```ts
diameter: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:64](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/celestial-bodies/galaxies.ts#L64)

Diameter of the galaxy in light-years.

---

### distance

```ts
distance: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:66](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/celestial-bodies/galaxies.ts#L66)

Distance from the Milky Way in light-years.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:60](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/celestial-bodies/galaxies.ts#L60)

Name of the galaxy.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/galaxies.ts:62](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/celestial-bodies/galaxies.ts#L62)

Morphological classification of the galaxy.
