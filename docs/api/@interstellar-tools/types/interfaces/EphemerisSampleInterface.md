[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
EphemerisSampleInterface

# Interface: EphemerisSampleInterface

Defined in:
[tracking.ts:337](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L337)

One **sample of an ephemeris**: a spacecraft's position and velocity at a
moment.

## Example

```ts
// Voyager 1 from the Sun, 169 au away, at 2026-01-01 00:00 TDB (JPL Horizons)
const sample: EphemerisSampleInterface = {
  epoch: new Date('2025-12-31T23:58:50.816Z'),
  r: [-4.7627e12, -2.4284e13, 5.3604e12],
  v: [-2072.8, -16400.0, 3609.0]
};
```

## Properties

### epoch

```ts
epoch: Date;
```

Defined in:
[tracking.ts:339](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L339)

The moment, as a UTC `Date`.

---

### r

```ts
r: Vector3DTupleType;
```

Defined in:
[tracking.ts:341](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L341)

Position in m, from the ephemeris's centre, on its frame's axes.

---

### v

```ts
v: Vector3DTupleType;
```

Defined in:
[tracking.ts:343](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L343)

Velocity in m/s.
