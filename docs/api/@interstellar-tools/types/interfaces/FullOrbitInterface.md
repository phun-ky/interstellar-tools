[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
FullOrbitInterface

# Interface: FullOrbitInterface

Defined in:
[orbits.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L154)

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
[orbits.ts:129](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L129)

Semi-major axis of this body's orbit around the parent's centre of mass.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`a`](OrbitInterface.md#a)

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L137)

Current orbital position at J2000 in radians (true anomaly).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`angle`](OrbitInterface.md#angle)

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L131)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`e`](OrbitInterface.md#e)

---

### i

```ts
i: DegreesType;
```

Defined in:
[orbits.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L156)

Orbital inclination in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`i`](OrbitInterface.md#i)

---

### om

```ts
om: DegreesType;
```

Defined in:
[orbits.ts:160](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L160)

Longitude of the ascending node in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`om`](OrbitInterface.md#om)

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L133)

Orbital period, always positive. See `retrograde` for the direction.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`period`](OrbitInterface.md#period)

---

### q

```ts
q: DistanceInterface;
```

Defined in:
[orbits.ts:162](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L162)

Periapsis distance $q = a(1 - e)$.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`q`](OrbitInterface.md#q)

---

### retrograde?

```ts
optional retrograde?: boolean;
```

Defined in:
[orbits.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L135)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`retrograde`](OrbitInterface.md#retrograde)

---

### w

```ts
w: DegreesType;
```

Defined in:
[orbits.ts:158](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L158)

Argument of periapsis in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`w`](OrbitInterface.md#w)
