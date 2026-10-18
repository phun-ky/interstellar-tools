[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarInterface

# Interface: StarInterface

Defined in:
[celestial-bodies/stars.ts:39](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L39)

Represents a **star**.

A star is bound to one `parent`: a galaxy for a single star like Vega, or a
system barycenter for a star in a planetary, binary or multiple system. Its
`orbit` describes the motion around that parent. A star without a `parent` is
unbound, like a hypervelocity star leaving its galaxy.

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
    period: { value: -480, unit: 'Myr' },
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
[celestial-bodies/stars.ts:47](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L47)

Defines the category as a star.

---

### display?

```ts
optional display?: DisplayInterface;
```

Defined in:
[celestial-bodies/stars.ts:63](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L63)

How to draw the star: its colour, and state a renderer computes.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/stars.ts:41](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L41)

Stable identifier, used by `parent` references. Never translated.

---

### mass?

```ts
optional mass?: number;
```

Defined in:
[celestial-bodies/stars.ts:53](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L53)

Mass in solar masses ($M_\odot$).

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/stars.ts:43](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L43)

Name of the star.

---

### orbit?

```ts
optional orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/stars.ts:51](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L51)

Orbit around the parent.

---

### parent?

```ts
optional parent?: string;
```

Defined in:
[celestial-bodies/stars.ts:49](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L49)

Id of the galaxy or system the star is bound to.

---

### radius

```ts
radius: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:55](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L55)

Physical radius of the star.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/stars.ts:45](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L45)

Spectral classification of the star (e.g., `'G2V'`).

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:57](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L57)

X-coordinate in the parent's frame.

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:59](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L59)

Y-coordinate in the parent's frame.

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/stars.ts:61](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/celestial-bodies/stars.ts#L61)

Z-coordinate in the parent's frame.
