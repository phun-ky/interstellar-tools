[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitInterface

# Interface: OrbitInterface

Defined in:
[orbits.ts:205](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L205)

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
- `i`, `w`, `om` and `q` are only given where the dataset has them. `frame` says
  which plane they're measured from: without it, an orbit can only be drawn
  flat, in its own plane.
- Where `i` is given against the ecliptic, for a body around the Sun, or against
  its parent's equator or Laplace plane, `retrograde` is set exactly when
  `i > 90°`. On the sky, `i > 90°` only means the orbit turns clockwise as we
  see it.

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
[orbits.ts:207](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L207)

Semi-major axis of this body's orbit around the parent's centre of mass.

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:215](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L215)

Current orbital position at J2000 in radians (true anomaly).

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:209](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L209)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

---

### frame?

```ts
frame?: OrbitFrameInterface;
```

Defined in:
[orbits.ts:225](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L225)

The plane `i`, `om` and `w` are measured from. Given with them.

---

### i?

```ts
i?: DegreesType;
```

Defined in:
[orbits.ts:217](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L217)

Orbital inclination in degrees, as catalogues give it.

---

### om?

```ts
om?: DegreesType;
```

Defined in:
[orbits.ts:221](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L221)

Longitude of the ascending node in degrees.

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:211](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L211)

Orbital period, always positive. See `retrograde` for the direction.

---

### q?

```ts
q?: DistanceInterface;
```

Defined in:
[orbits.ts:223](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L223)

Periapsis distance $q = a(1 - e)$.

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[orbits.ts:213](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L213)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

---

### w?

```ts
w?: DegreesType;
```

Defined in:
[orbits.ts:219](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L219)

Argument of periapsis in degrees.
