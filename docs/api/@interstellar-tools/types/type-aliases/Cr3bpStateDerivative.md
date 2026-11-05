[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
Cr3bpStateDerivative

# Type Alias: Cr3bpStateDerivative

```ts
type Cr3bpStateDerivative = readonly [
  xDot: number,
  yDot: number,
  zDot: number,
  xDDot: number,
  yDDot: number,
  zDDot: number
];
```

Defined in:
[three-body.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L40)

The time derivative of a [Cr3bpState](Cr3bpState.md): velocities, then
accelerations.
