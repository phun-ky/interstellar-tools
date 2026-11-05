[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ PredictPassesOptionsInterface

# Interface: PredictPassesOptionsInterface

Defined in:
[satellites/passes.ts:19](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L19)

Options for [predictPasses](../functions/predictPasses.md).

## Properties

### minElevation?

```ts
minElevation?: Radians;
```

Defined in:
[satellites/passes.ts:21](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L21)

The elevation that counts as rising and setting, in **radians**: 0 by default,
the horizon.

---

### step?

```ts
step?: number;
```

Defined in:
[satellites/passes.ts:23](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L23)

The coarse step in **s**: a 180th of the orbital period by default, 31 s for the
ISS.
