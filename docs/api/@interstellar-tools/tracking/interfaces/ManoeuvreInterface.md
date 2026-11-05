[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ ManoeuvreInterface

# Interface: ManoeuvreInterface

Defined in:
[satellites/propagate-numerically.ts:28](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L28)

An impulsive manoeuvre for
[propagateNumerically](../functions/propagateNumerically.md): a change of
velocity at a moment.

## Properties

### deltaV

```ts
deltaV: Vector3DTupleType;
```

Defined in:
[satellites/propagate-numerically.ts:32](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L32)

The change of velocity in **m/s**, on the axes `frame` names.

---

### epoch

```ts
epoch: Date;
```

Defined in:
[satellites/propagate-numerically.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L30)

The moment of the burn.

---

### frame?

```ts
frame?: "inertial" | "rtn";
```

Defined in:
[satellites/propagate-numerically.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L34)

`'inertial'`, the axes of the state, or `'rtn'`: radial (out from Earth),
along-track (forward, in the orbit plane) and normal (along the angular
momentum). Defaults to `'inertial'`.
