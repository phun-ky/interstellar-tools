[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitInterface

# Interface: OrbitInterface

Defined in:
[orbits.ts:128](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L128)

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
[orbits.ts:130](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L130)

Semi-major axis of this body's orbit around the parent's centre of mass.

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:138](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L138)

Current orbital position at J2000 in radians (true anomaly).

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:132](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L132)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### i?

```ts
i?: DegreesType;
```

Defined in:
[orbits.ts:140](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L140)

Orbital inclination in degrees, as catalogues give it.

---

### om?

```ts
om?: DegreesType;
```

Defined in:
[orbits.ts:144](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L144)

Longitude of the ascending node in degrees.

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:134](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L134)

Orbital period, always positive. See `retrograde` for the direction.

---

### q?

```ts
q?: DistanceInterface;
```

Defined in:
[orbits.ts:146](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L146)

Periapsis distance $q = a(1 - e)$.

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[orbits.ts:136](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L136)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

---

### w?

```ts
w?: DegreesType;
```

Defined in:
[orbits.ts:142](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L142)

Argument of periapsis in degrees.
