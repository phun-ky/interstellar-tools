[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
Cr3bpState

# Type Alias: Cr3bpState

```ts
type Cr3bpState = readonly [
  x: number,
  y: number,
  z: number,
  xDot: number,
  yDot: number,
  zDot: number
];
```

Defined in:
[three-body.ts:18](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L18)

A state in the **circular restricted three-body problem** (CR3BP), in the
rotating, normalised frame.

The two large bodies sit on the x axis, the larger at $x = -\mu$ and the smaller
at $x = 1 - \mu$, and the frame turns with them. Lengths are in units of their
separation, times in units of $1/n$ (so one revolution is $2\pi$), and speeds in
units of the separation times $n$.

## Example

```ts
// At rest at the Earth–Moon L4 point
const l4: Cr3bpState = [0.5 - 0.01215, Math.sqrt(3) / 2, 0, 0, 0, 0];
```
