[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ PredictPassesOptionsInterface

# Interface: PredictPassesOptionsInterface

Defined in:
[passes.ts:15](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L15)

Options for [predictPasses](../functions/predictPasses.md).

## Properties

### minElevation?

```ts
minElevation?: Radians;
```

Defined in:
[passes.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L17)

The elevation that counts as rising and setting, in **radians**: 0 by default,
the horizon.

---

### step?

```ts
step?: number;
```

Defined in:
[passes.ts:19](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L19)

The coarse step in **s**: a 180th of the orbital period by default, 31 s for the
ISS.
