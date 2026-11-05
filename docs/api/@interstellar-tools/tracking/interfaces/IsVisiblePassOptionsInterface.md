[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ IsVisiblePassOptionsInterface

# Interface: IsVisiblePassOptionsInterface

Defined in:
[satellites/passes.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L27)

Options for [isVisiblePass](../functions/isVisiblePass.md).

## Properties

### sunElevation?

```ts
sunElevation?: Radians;
```

Defined in:
[satellites/passes.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L29)

The highest the Sun may be for the observer, in **radians**: -6° by default, the
end of civil twilight.
