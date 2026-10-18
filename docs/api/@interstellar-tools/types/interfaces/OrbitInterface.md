[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitInterface

# Interface: OrbitInterface

Defined in:
[orbits.ts:127](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L127)

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
- **Direction**: `period` is always a positive duration. A retrograde orbit,
  moving against its parent's rotation, has `retrograde: true`; a renderer can
  use `retrograde ? -1 : 1` as the direction of travel.
- `i`, `w`, `om` and `q` are only given where the dataset has them (comets and
  asteroids). Where `i` is given, `retrograde` is set exactly when `i > 90°`.

:::

## Example

```ts
const earthOrbit: OrbitInterface = {
  a: { value: 1.0, unit: 'au' },
  e: 0.0167,
  period: { value: 365.256, unit: 'd' },
  angle: 1.753 as Radians
};
```

## Extended by

- [`FullOrbitInterface`](FullOrbitInterface.md)

## Properties

### a

```ts
a: DistanceInterface;
```

Defined in:
[orbits.ts:129](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L129)

Semi-major axis of this body's orbit around the parent's centre of mass.

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L137)

Current orbital position at J2000 in radians (true anomaly).

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L131)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### i?

```ts
optional i?: DegreesType;
```

Defined in:
[orbits.ts:139](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L139)

Orbital inclination in degrees, as catalogues give it.

---

### om?

```ts
optional om?: DegreesType;
```

Defined in:
[orbits.ts:143](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L143)

Longitude of the ascending node in degrees.

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L133)

Orbital period, always positive. See `retrograde` for the direction.

---

### q?

```ts
optional q?: DistanceInterface;
```

Defined in:
[orbits.ts:145](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L145)

Periapsis distance $q = a(1 - e)$.

---

### retrograde?

```ts
optional retrograde?: boolean;
```

Defined in:
[orbits.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L135)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

---

### w?

```ts
optional w?: DegreesType;
```

Defined in:
[orbits.ts:141](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L141)

Argument of periapsis in degrees.
