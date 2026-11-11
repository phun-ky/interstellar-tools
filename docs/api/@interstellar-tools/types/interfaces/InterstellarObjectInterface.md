[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
InterstellarObjectInterface

# Interface: InterstellarObjectInterface

Defined in:
[celestial-bodies/interstellar-objects.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L51)

An **interstellar object**: a body from another star's system, passing through
the Solar System once, on an open orbit around the Sun. The IAU's Minor Planet
Center designates them with an `I`: 1I/ʻOumuamua, 2I/Borisov, 3I/ATLAS.

::: info

- **Orbit**: an [OpenOrbitInterface](OpenOrbitInterface.md), a hyperbola with no
  period. That is why these objects aren't in
  [CelestialBodyType](../type-aliases/CelestialBodyType.md): code that reads any
  body's `orbit.period` would break on them.
- **Type**: `'interstellar comet'` for one with a coma, as Borisov's and
  3I/ATLAS's, and `'interstellar object'` for ʻOumuamua, which showed no coma
  but was pushed by more than gravity, so is neither a clear comet nor a clear
  asteroid.

:::

## Example

```ts
const borisov: InterstellarObjectInterface = {
  id: '2i-borisov',
  name: 'Borisov',
  designation: '2I/2019 Q4',
  type: 'interstellar comet',
  category: 'interstellar object',
  parent: 'sun',
  orbit: {
    a: { value: -0.8515, unit: 'au' },
    e: 3.3565,
    q: { value: 2.0065, unit: 'au' },
    i: 44.053 as DegreesType,
    w: 209.124 as DegreesType,
    om: 308.148 as DegreesType,
    angle: -1.8537 as Radians,
    periapsisTime: new Date('2019-12-08T13:16:04Z'),
    excessSpeed: 32.28,
    frame: { plane: 'ecliptic' }
  },
  radius: { value: 0.4, unit: 'km' }
};
```

## Properties

### category

```ts
category: 'interstellar object';
```

Defined in:
[celestial-bodies/interstellar-objects.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L61)

Category classification: every one is an interstellar object.

---

### designation

```ts
designation: string;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L57)

The Minor Planet Center's designation, e.g. `'1I/2017 U1'`.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:71](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L71)

How to draw it: its colour and drawn size, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:53](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L53)

Stable identifier. Never translated.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:55](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L55)

Name (e.g., "ʻOumuamua", "Borisov").

---

### orbit

```ts
orbit: OpenOrbitInterface;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L65)

Its open orbit around the parent.

---

### parent

```ts
parent: string;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L63)

Id of the star it passes, `'sun'`.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:69](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L69)

Radius of its nucleus or body, or an effective one for an elongated body.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/interstellar-objects.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L67)

How it spins, where that's measured.

---

### type

```ts
type: 'interstellar comet' | 'interstellar object';
```

Defined in:
[celestial-bodies/interstellar-objects.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/interstellar-objects.ts#L59)

`'interstellar comet'` with a coma, `'interstellar object'` without.
