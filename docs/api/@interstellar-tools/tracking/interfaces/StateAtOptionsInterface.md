[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ StateAtOptionsInterface

# Interface: StateAtOptionsInterface

Defined in:
[probes/interpolate.ts:8](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/probes/interpolate.ts#L8)

Options for [stateAt](../functions/stateAt.md).

## Properties

### points?

```ts
points?: number;
```

Defined in:
[probes/interpolate.ts:10](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/probes/interpolate.ts#L10)

How many samples around the date to interpolate through, from 2 to 8: 4 by
default, a polynomial of degree 7.
