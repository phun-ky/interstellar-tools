[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AstrometryInterface

# Interface: AstrometryInterface

Defined in:
[observations.ts:293](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L293)

Where a body outside the Solar System is **on the sky**, and how it moves.

## Properties

### direction

```ts
direction: CelestialDirectionInterface;
```

Defined in:
[observations.ts:295](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L295)

The ICRS position.

---

### distance?

```ts
distance?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:307](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L307)

The distance from the Sun.

---

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:297](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L297)

The epoch of `direction`, such as J2016.0 for Gaia DR3.

---

### galactic?

```ts
galactic?: GalacticDirectionInterface;
```

Defined in:
[observations.ts:299](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L299)

The same position in galactic coordinates.

---

### parallax?

```ts
parallax?: ObservedType<AngleInterface>;
```

Defined in:
[observations.ts:301](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L301)

The trigonometric parallax.

---

### properMotion?

```ts
properMotion?: ObservedProperMotionInterface;
```

Defined in:
[observations.ts:303](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L303)

The proper motion, μα\* and μδ.

---

### radialVelocity?

```ts
radialVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[observations.ts:305](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L305)

The velocity along the line of sight, positive moving away.
