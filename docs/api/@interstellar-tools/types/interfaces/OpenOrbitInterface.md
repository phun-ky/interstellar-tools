[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OpenOrbitInterface

# Interface: OpenOrbitInterface

Defined in:
[orbits.ts:314](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L314)

An **open orbit**: a hyperbola, $e > 1$, that passes its parent once and never
comes back, as an interstellar object's does around the Sun.

It has no period, so it's a type of its own, not an
[OrbitInterface](OrbitInterface.md): functions that read an orbit's `period`
don't take it.

::: info

- `a` is negative, and the periapsis distance $q = a(1 - e)$ is still positive.
- `angle` is the true anomaly at J2000, as for every other orbit. On a hyperbola
  it lies between $-\nu_\infty$ and $\nu_\infty$, the directions of its
  asymptotes, $\nu_\infty = \arccos(-1/e)$: negative before periapsis, on the
  way in.
- `periapsisTime` and `excessSpeed` describe the pass better than `a` and
  `angle` do: when it's closest, and how fast it comes in, far away. On an ideal
  two-body hyperbola $v_\infty = \sqrt{-\mu / a}$; a real object's speed is
  better taken from its orbit around the Solar System's barycentre, before the
  planets and its own outgassing pulled on it.
- `retrograde` is set exactly when `i > 90°`, as for a closed orbit.

:::

## Example

```ts
// 2I/Borisov, from JPL Horizons' elements osculating at its perihelion
const borisov: OpenOrbitInterface = {
  a: { value: -0.8515, unit: 'au' },
  e: 3.3565,
  q: { value: 2.0065, unit: 'au' },
  i: 44.053 as DegreesType,
  w: 209.124 as DegreesType,
  om: 308.148 as DegreesType,
  angle: -1.8537 as Radians,
  periapsisTime: new Date('2019-12-08T13:16:04Z'),
  excessSpeed: { value: 32.28, unit: 'km/s' },
  frame: { plane: 'ecliptic' }
};
```

## Properties

### a

```ts
a: DistanceInterface;
```

Defined in:
[orbits.ts:316](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L316)

Semi-major axis, negative.

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:324](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L324)

True anomaly at J2000 in radians, between $-\nu_\infty$ and $\nu_\infty$.

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:318](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L318)

Orbital eccentricity, above 1.

---

### excessSpeed

```ts
excessSpeed: SpeedInterface;
```

Defined in:
[orbits.ts:334](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L334)

Hyperbolic excess speed $v_\infty$: its speed far from its parent, coming in.

---

### frame?

```ts
frame?: OrbitFrameInterface;
```

Defined in:
[orbits.ts:336](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L336)

The plane `i`, `om` and `w` are measured from.

---

### i

```ts
i: DegreesType;
```

Defined in:
[orbits.ts:326](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L326)

Orbital inclination in degrees.

---

### om

```ts
om: DegreesType;
```

Defined in:
[orbits.ts:330](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L330)

Longitude of the ascending node in degrees.

---

### periapsisTime

```ts
periapsisTime: Date;
```

Defined in:
[orbits.ts:332](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L332)

When it passes periapsis, in UTC.

---

### q

```ts
q: DistanceInterface;
```

Defined in:
[orbits.ts:320](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L320)

Periapsis distance $q = a(1 - e)$, positive.

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[orbits.ts:322](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L322)

`true` for a retrograde orbit, `i > 90°`. Omitted for prograde ones.

---

### w

```ts
w: DegreesType;
```

Defined in:
[orbits.ts:328](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L328)

Argument of periapsis in degrees.
