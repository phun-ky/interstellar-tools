[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarInterface

# Interface: StarInterface

Defined in:
[celestial-bodies/stars.ts:39](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L39)

Represents a **star**.

A star is bound to one `parent`: a galaxy for a single star like Vega, or a
system barycenter for a star in a planetary, binary or multiple system. Its
`orbit` describes the motion around that parent. A star without a `parent` is
unbound, like a hypervelocity star leaving its galaxy.

**Classification & Visualization:**

- **Type (`type`)**: Spectral classification of the star (e.g., `'G2V'`).
- **Category (`category`)**: Defined as `'star'`.
- **Color (`color`)**: Used for visual representation.

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
    period: { value: -480, unit: 'Myr' },
    angle: 1.5699 as Radians
  },
  radius: { value: 2600000, unit: 'km' },
  color: 'blue'
};
```

## Properties

### category

```ts
category: 'star';
```

Defined in:
[celestial-bodies/stars.ts:47](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L47)

Defines the category as a star.

---

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/stars.ts:57](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L57)

Visual representation color.

---

### focus_x?

```ts
optional focus_x?: number;
```

Defined in:
[celestial-bodies/stars.ts:61](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L61)

X-offset for the ellipse focus (accounts for eccentricity).

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/stars.ts:41](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L41)

Stable identifier, used by `parent` references. Never translated.

---

### mass?

```ts
optional mass?: number;
```

Defined in:
[celestial-bodies/stars.ts:53](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L53)

Mass in solar masses ($M_\odot$).

---

### miA?

```ts
optional miA?: number;
```

Defined in:
[celestial-bodies/stars.ts:59](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L59)

Semi-minor axis of the orbit (calculated from `a` and `e`).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/stars.ts:43](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L43)

Name of the star.

---

### orbit?

```ts
optional orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/stars.ts:51](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L51)

Orbit around the parent.

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/stars.ts:69](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L69)

Precomputed orbital path points for visualization (optional).

---

### parent?

```ts
optional parent?: string;
```

Defined in:
[celestial-bodies/stars.ts:49](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L49)

Id of the galaxy or system the star is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:55](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L55)

Physical radius of the star.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/stars.ts:45](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L45)

Spectral classification of the star (e.g., `'G2V'`).

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:63](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L63)

X-coordinate in the parent's frame.

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:65](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L65)

Y-coordinate in the parent's frame.

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:67](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/stars.ts#L67)

Z-coordinate in the parent's frame.
