[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
Cr3bpUnitsInterface

# Interface: Cr3bpUnitsInterface

Defined in:
[three-body.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L57)

The units of the normalised CR3BP frame for a pair of bodies, in SI.

Multiply a normalised length by `length`, a time by `time` and a speed by
`speed` to get metres, seconds and metres per second.

## Properties

### length

```ts
length: number;
```

Defined in:
[three-body.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L61)

Length unit: the separation of the two bodies, in m.

---

### mu

```ts
mu: number;
```

Defined in:
[three-body.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L59)

Mass ratio $\mu = m_2 / (m_1 + m_2)$ of the smaller body.

---

### speed

```ts
speed: number;
```

Defined in:
[three-body.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L65)

Speed unit: `length / time`, in m/s.

---

### time

```ts
time: number;
```

Defined in:
[three-body.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L63)

Time unit: $1/n$, in s. One revolution takes $2\pi$ of these.
