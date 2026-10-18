[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyInterface

# Interface: GalaxyInterface

Defined in:
[celestial-bodies/galaxies.ts:59](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L59)

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
  id: 'milky-way',
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
[celestial-bodies/galaxies.ts:71](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L71)

Central black hole of the galaxy.

---

### diameter

```ts
diameter: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:67](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L67)

Diameter of the galaxy in light-years.

---

### distance

```ts
distance: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:69](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L69)

Distance from the Milky Way in light-years.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/galaxies.ts:61](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L61)

Stable identifier, used by `parent` references. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:63](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L63)

Name of the galaxy.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/galaxies.ts:65](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/types/src/celestial-bodies/galaxies.ts#L65)

Morphological classification of the galaxy.
