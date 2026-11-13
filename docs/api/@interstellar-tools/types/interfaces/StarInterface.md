[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarInterface

# Interface: StarInterface

Defined in:
[celestial-bodies/stars.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L42)

Represents a **star**.

A star is bound to one `parent`: a galaxy for a single star like Vega, or a
system barycenter for a star in a planetary, binary or multiple system, or a
galaxy's central black hole for a star that orbits it, like S2 around
Sagittarius A\*. Its `orbit` describes the motion around that parent. A star
without a `parent` is unbound, like a hypervelocity star leaving its galaxy.

**Classification & Visualization:**

- **Type (`type`)**: Spectral classification of the star (e.g., `'G2V'`).
- **Category (`category`)**: Defined as `'star'`.
- **Drawing (`display`)**: colour, and state a renderer computes; see
  [DisplayInterface](DisplayInterface.md).

## Example

```ts
const vega: StarInterface = {
  id: 'vega',
  name: 'Vega',
  type: 'A0V',
  category: 'star',
  parent: 'milky-way',
  orbit: {
    a: { value: 27230, unit: 'ly' },
    e: 0.005,
    period: { value: 480, unit: 'Myr' },
    angle: 1.5699 as Radians
  },
  radius: { value: 2600000, unit: 'km' },
  display: { color: 'blue' }
};
```

## Properties

### category

```ts
category: 'star';
```

Defined in:
[celestial-bodies/stars.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L50)

Defines the category as a star.

---

### display?

```ts
display?: DisplayInterface;
```

Defined in:
[celestial-bodies/stars.ts:76](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L76)

How to draw the star: its colour, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/stars.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L44)

Stable identifier, used by `parent` references. Never translated.

---

### mass?

```ts
mass?: number;
```

Defined in:
[celestial-bodies/stars.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L56)

Mass in solar masses ($M_\odot$).

---

### mu?

```ts
mu?: number;
```

Defined in:
[celestial-bodies/stars.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L61)

Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s², as the
orbit equations take it. Given where JPL publishes one.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/stars.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L46)

Name of the star.

---

### observations?

```ts
observations?: StarObservationsInterface;
```

Defined in:
[celestial-bodies/stars.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L81)

What is measured about it, with uncertainties and sources, apart from the values
the equations use.

---

### orbit?

```ts
orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/stars.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L54)

Orbit around the parent.

---

### parent?

```ts
parent?: string;
```

Defined in:
[celestial-bodies/stars.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L52)

Id of the galaxy, system or black hole the star is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L68)

Physical radius of the star.

---

### rotation?

```ts
rotation?: RotationInterface;
```

Defined in:
[celestial-bodies/stars.ts:66](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L66)

How the star spins: its sidereal rotation period, from interferometry or
spectroscopy. Given where one is published.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/stars.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L48)

Spectral classification of the star (e.g., `'G2V'`).

---

### x?

```ts
x?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L70)

X-coordinate in the parent's frame.

---

### y?

```ts
y?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L72)

Y-coordinate in the parent's frame.

---

### z?

```ts
z?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/stars.ts#L74)

Z-coordinate in the parent's frame.
