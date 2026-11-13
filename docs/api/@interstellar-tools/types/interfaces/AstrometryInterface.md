[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AstrometryInterface

# Interface: AstrometryInterface

Defined in:
[observations.ts:296](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L296)

Where a body outside the Solar System is **on the sky**, and how it moves.

## Properties

### direction

```ts
direction: CelestialDirectionInterface;
```

Defined in:
[observations.ts:298](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L298)

The ICRS position.

---

### distance?

```ts
distance?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:310](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L310)

The distance from the Sun.

---

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:300](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L300)

The epoch of `direction`, such as J2016.0 for Gaia DR3.

---

### galactic?

```ts
galactic?: GalacticDirectionInterface;
```

Defined in:
[observations.ts:302](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L302)

The same position in galactic coordinates.

---

### parallax?

```ts
parallax?: ObservedType<AngleInterface>;
```

Defined in:
[observations.ts:304](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L304)

The trigonometric parallax.

---

### properMotion?

```ts
properMotion?: ObservedProperMotionInterface;
```

Defined in:
[observations.ts:306](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L306)

The proper motion, μα\* and μδ.

---

### radialVelocity?

```ts
radialVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[observations.ts:308](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L308)

The velocity along the line of sight, positive moving away.
