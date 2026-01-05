[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CwStateDerivative

# Type Alias: CwStateDerivative

```ts
type CwStateDerivative = readonly [
  number,
  number,
  number,
  number,
  number,
  number
];
```

Defined in:
[orbits.ts:75](https://github.com/phun-ky/interstellar-tools/blob/eba42da13df2a93d9bf5de153f401b02d475cf3b/packages/types/src/orbits.ts#L75)

Time derivative of [CwState](CwState.md) for CW/Hill dynamics.

Ordered as:

- Position derivatives: `[xDot, yDot, zDot]`
- Acceleration terms: `[xDDot, yDDot, zDDot]`

Units:

- First three components: velocity (m/s or km/s).
- Last three components: acceleration (m/s² or km/s²).

Useful as the return type for an ODE RHS function, e.g.
`cwHillDerivatives(state, n)`.

## Example

```ts
const ds: CwStateDerivative = [
  0, // xDot (m/s)
  0.01, // yDot (m/s)
  0, // zDot (m/s)
  0.0002, // xDDot (m/s²)
  0, // yDDot (m/s²)
  0 // zDDot (m/s²)
];
```
