[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitInterface

# Interface: OrbitInterface

Defined in:
[orbits.ts:125](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L125)

Kepler **orbital elements** of one body around its parent.

The parent is whatever the body is gravitationally bound to: a star, a planet, a
barycenter or a galaxy. It is named by the `parent` id on the body or system
that carries this orbit, and the elements always describe the motion **around
that parent**, never around anything further up.

::: info

- **Pairs**: when two bodies orbit a shared barycenter (Alpha Centauri A and B),
  each carries its own orbit. Both share `e`, `period` and `angle`, their
  periapses point in opposite directions, and their semi-major axes split by
  mass ratio: $a_1 = a \, m_2 / (m_1 + m_2)$, where $a$ is their separation.
- **Direction**: a negative `period` indicates a counter-clockwise orbit.
- `i`, `w`, `om` and `q` are only given where the dataset has them (comets and
  asteroids).

:::

## Example

```ts
const earthOrbit: OrbitInterface = {
  a: { value: 1.0, unit: 'au' },
  e: 0.0167,
  period: { value: -365.256, unit: 'd' },
  angle: 1.753 as Radians
};
```

## Properties

### a

```ts
a: MeasureInterface;
```

Defined in:
[orbits.ts:127](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L127)

Semi-major axis of this body's orbit around the parent's centre of mass.

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:133](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L133)

Current orbital position at J2000 in radians (true anomaly).

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:129](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L129)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### i?

```ts
optional i?: number;
```

Defined in:
[orbits.ts:135](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L135)

Orbital inclination in degrees.

---

### om?

```ts
optional om?: number;
```

Defined in:
[orbits.ts:139](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L139)

Longitude of the ascending node in degrees.

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:131](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L131)

Orbital period. Negative values indicate counter clockwise direction.

---

### q?

```ts
optional q?: number;
```

Defined in:
[orbits.ts:141](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L141)

Periapsis distance $q = a(1 - e)$ in the unit of `a`.

---

### w?

```ts
optional w?: number;
```

Defined in:
[orbits.ts:137](https://github.com/phun-ky/interstellar-tools/blob/24cba573df6c9c683343df049f6882ef45133bb0/packages/types/src/orbits.ts#L137)

Argument of periapsis in degrees.
