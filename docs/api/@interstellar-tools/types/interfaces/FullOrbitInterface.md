[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
FullOrbitInterface

# Interface: FullOrbitInterface

Defined in:
[orbits.ts:234](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L234)

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
[orbits.ts:207](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L207)

Semi-major axis of this body's orbit around the parent's centre of mass.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`a`](OrbitInterface.md#a)

---

### angle

```ts
angle: Radians;
```

Defined in:
[orbits.ts:215](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L215)

Current orbital position at J2000 in radians (true anomaly).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`angle`](OrbitInterface.md#angle)

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:209](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L209)

Orbital eccentricity (0 = circular, closer to 1 = highly elliptical).

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`e`](OrbitInterface.md#e)

---

### frame?

```ts
frame?: OrbitFrameInterface;
```

Defined in:
[orbits.ts:225](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L225)

The plane `i`, `om` and `w` are measured from. Given with them.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`frame`](OrbitInterface.md#frame)

---

### i

```ts
i: DegreesType;
```

Defined in:
[orbits.ts:236](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L236)

Orbital inclination in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`i`](OrbitInterface.md#i)

---

### om

```ts
om: DegreesType;
```

Defined in:
[orbits.ts:240](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L240)

Longitude of the ascending node in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`om`](OrbitInterface.md#om)

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[orbits.ts:211](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L211)

Orbital period, always positive. See `retrograde` for the direction.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`period`](OrbitInterface.md#period)

---

### q

```ts
q: DistanceInterface;
```

Defined in:
[orbits.ts:242](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L242)

Periapsis distance $q = a(1 - e)$.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`q`](OrbitInterface.md#q)

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[orbits.ts:213](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L213)

`true` for a retrograde orbit. Omitted for the usual prograde orbits.

#### Inherited from

[`OrbitInterface`](OrbitInterface.md).[`retrograde`](OrbitInterface.md#retrograde)

---

### w

```ts
w: DegreesType;
```

Defined in:
[orbits.ts:238](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L238)

Argument of periapsis in degrees.

#### Overrides

[`OrbitInterface`](OrbitInterface.md).[`w`](OrbitInterface.md#w)
