[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyInterface

# Interface: GalaxyInterface

Defined in:
[celestial-bodies/galaxies.ts:144](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L144)

Represents a **galaxy** in the universe simulation.

**Galaxy Properties:**

- **Name (`name`)**: The galaxy's official designation.
- **Type (`type`)**: The morphological classification (e.g., Spiral,
  Elliptical).
- **Diameter (`diameter`)**: Measured in **light-years**.
- **Distance (`distance`)**: The distance from the Sun, also in **light-years**:
  0 for the Milky Way itself. Like `direction`, it's measured from the Sun,
  where every observation is made from.
- **Black Hole (`blackHole`)**: The central supermassive black hole, where one
  is detected. Triangulum (M33) has none: observations only limit its mass to a
  few thousand $M_\odot$.
- **Direction (`direction`)**: Where it is on the sky, in galactic coordinates
  from the Sun. With `distance`, it places the galaxy from the Sun; to draw it
  around the Milky Way's centre instead, shift it by the Sun's place there, as
  `galactocentricPosition` in `@interstellar-tools/equations` does.
- **Disk (`disk`)**: How its disk is turned on the sky, where it has a disk
  that's measured. Elliptical and disrupted galaxies have none.
- **Motion (`motion`)**: Its velocity along the line of sight and, where
  measured, across the sky, from the Sun.

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
[celestial-bodies/galaxies.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L156)

Central supermassive black hole of the galaxy. Omitted where none is detected.

---

### diameter

```ts
diameter: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:152](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L152)

Diameter of the galaxy in light-years.

---

### direction?

```ts
direction?: GalacticDirectionInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:158](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L158)

Direction from the Sun, in galactic coordinates. Omitted for the Milky Way
itself.

---

### disk?

```ts
disk?: GalaxyDiskInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:160](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L160)

How its disk is turned on the sky. Omitted where it has no measured disk.

---

### distance

```ts
distance: DistanceInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L154)

Distance from the Sun in light-years: 0 for the Milky Way itself.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/galaxies.ts:146](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L146)

Stable identifier, used by `parent` references. Never translated.

---

### motion?

```ts
motion?: ObservedMotionInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:162](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L162)

Its motion seen from the Sun. Omitted for the Milky Way itself.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/galaxies.ts:148](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L148)

Name of the galaxy.

---

### observations?

```ts
observations?: GalaxyObservationsInterface;
```

Defined in:
[celestial-bodies/galaxies.ts:167](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L167)

What is measured about it, with uncertainties and sources, apart from the values
the equations use.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/galaxies.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L150)

Morphological classification of the galaxy.
