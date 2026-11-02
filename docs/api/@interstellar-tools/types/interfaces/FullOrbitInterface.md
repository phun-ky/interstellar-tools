[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
FullOrbitInterface

# Interface: FullOrbitInterface

Defined in:
[orbits.ts:155](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L155)

An [OrbitInterface](OrbitInterface.md) with every orientation element given:
`i`, `w`, `om` and `q`. Comets and asteroids carry these.

## Extends

- [`OrbitInterface`](OrbitInterface.md)

## Properties

### a

```ts
a: DistanceInterface;
```

Defined in:
[orbits.ts:130](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L130)

Semi-major axis of this body's orbit around the parent's centre of mass.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`a`](OrbitInterface.md#a)

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:138](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L138)

Current orbital position at J2000 in radians (true anomaly).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`angle`](OrbitInterface.md#angle)

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:132](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L132)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`e`](OrbitInterface.md#e)

---

### i

```ts
i: DegreesType;
```

Defined in:
[orbits.ts:157](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L157)

Orbital inclination in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`i`](OrbitInterface.md#i)

---

### om

```ts
om: DegreesType;
```

Defined in:
[orbits.ts:161](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L161)

Longitude of the ascending node in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`om`](OrbitInterface.md#om)

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:134](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L134)

Orbital period, always positive. See `retrograde` for the direction.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`period`](OrbitInterface.md#period)

---

### q

```ts
q: DistanceInterface;
```

Defined in:
[orbits.ts:163](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L163)

Periapsis distance $q = a(1 - e)$.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`q`](OrbitInterface.md#q)

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[orbits.ts:136](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L136)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`retrograde`](OrbitInterface.md#retrograde)

---

### w

```ts
w: DegreesType;
```

Defined in:
[orbits.ts:159](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L159)

Argument of periapsis in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`w`](OrbitInterface.md#w)
