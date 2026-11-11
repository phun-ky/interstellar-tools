[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservedMotionInterface

# Interface: ObservedMotionInterface

Defined in:
[positions.ts:162](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L162)

The **motion of something as seen from the Sun**, as it's measured: its velocity
along the line of sight, and where measured, its proper motion across the sky.

::: info

- `radialVelocity` is heliocentric, in km/s, positive moving away.
- With the direction and distance, they give the 3D velocity.

:::

## Example

```ts
// Andromeda, coming towards us
const andromeda: ObservedMotionInterface = {
  radialVelocity: -300,
  properMotion: { rightAscension: 0.0489, declination: -0.0369 }
};
```

## Properties

### properMotion?

```ts
properMotion?: ProperMotionInterface;
```

Defined in:
[positions.ts:166](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L166)

Motion across the sky. Omitted where it isn't measured.

---

### radialVelocity

```ts
radialVelocity: number;
```

Defined in:
[positions.ts:164](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L164)

Velocity along the line of sight from the Sun, in km/s, positive moving away.
