[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OdeRightHandSideType

# Type Alias: OdeRightHandSideType

```ts
type OdeRightHandSideType = (
  t: number,
  y: readonly number[]
) => readonly number[];
```

Defined in:
[math.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/math.ts#L63)

The right-hand side of a system of first-order ODEs, $\dot{\mathbf y} = f(t,
\mathbf y)$.

Takes the time and the state, and returns the state's time derivative, with the
same length. Used by the integrators in `@interstellar-tools/equations`
(`rk4Step`, `rk4Integrate`).

## Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `t`       | `number`             |
| `y`       | readonly `number`\[] |

## Returns

readonly `number`\[]

## Example

```ts
// A harmonic oscillator: y = [x, v]
const f: OdeRightHandSideType = (_t, [x, v]) => [v, -x];
```
