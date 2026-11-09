[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
FullOrbitInterface

# Interface: FullOrbitInterface

Defined in:
[orbits.ts:237](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L237)

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
[orbits.ts:210](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L210)

Semi-major axis of this body's orbit around the parent's centre of mass.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`a`](OrbitInterface.md#a)

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:218](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L218)

Current orbital position at J2000 in radians (true anomaly).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`angle`](OrbitInterface.md#angle)

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:212](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L212)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`e`](OrbitInterface.md#e)

---

### frame?

```ts
frame?: OrbitFrameInterface;
```

Defined in:
[orbits.ts:228](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L228)

The plane `i`, `om` and `w` are measured from. Given with them.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`frame`](OrbitInterface.md#frame)

---

### i

```ts
i: DegreesType;
```

Defined in:
[orbits.ts:239](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L239)

Orbital inclination in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`i`](OrbitInterface.md#i)

---

### om

```ts
om: DegreesType;
```

Defined in:
[orbits.ts:243](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L243)

Longitude of the ascending node in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`om`](OrbitInterface.md#om)

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:214](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L214)

Orbital period, always positive. See `retrograde` for the direction.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`period`](OrbitInterface.md#period)

---

### q

```ts
q: DistanceInterface;
```

Defined in:
[orbits.ts:245](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L245)

Periapsis distance $q = a(1 - e)$.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`q`](OrbitInterface.md#q)

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[orbits.ts:216](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L216)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`retrograde`](OrbitInterface.md#retrograde)

---

### w

```ts
w: DegreesType;
```

Defined in:
[orbits.ts:241](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L241)

Argument of periapsis in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`w`](OrbitInterface.md#w)
