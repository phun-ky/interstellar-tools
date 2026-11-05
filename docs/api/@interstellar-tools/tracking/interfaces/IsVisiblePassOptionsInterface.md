[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ IsVisiblePassOptionsInterface

# Interface: IsVisiblePassOptionsInterface

Defined in:
[satellites/passes.ts:28](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L28)

Options for [isVisiblePass](../functions/isVisiblePass.md).

## Properties

### sunElevation?

```ts
sunElevation?: Radians;
```

Defined in:
[satellites/passes.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L30)

The highest the Sun may be for the observer, in **radians**: -6° by default, the
end of civil twilight.
