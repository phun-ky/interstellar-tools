[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / residual

# Function: residual()

```ts
function residual(E: number, e: number, M: number): number;
```

Defined in:
[helpers/misc.ts:137](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/equations/src/categories/helpers/misc.ts#L137)

Compute the **Kepler equation residual** for an elliptical orbit:

$$
E - e\sin(E) = M
$$

This function returns:

$$
r(E) = E - e\sin(E) - \mathrm{wrap}_{2\pi}(M)
$$

where `wrap_{2π}` normalizes `M` into `[0, 2π)` to keep the residual
well-behaved.

Common usage: root-finding / iteration (Newton–Raphson, Halley, etc.) to solve
for eccentric anomaly `E` given eccentricity `e` and mean anomaly `M`.

## Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `E`       | `number` | Eccentric anomaly `E` (radians).  |
| `e`       | `number` | Eccentricity `e` (dimensionless). |
| `M`       | `number` | Mean anomaly `M` (radians).       |

## Returns

`number`

Residual value `E - e*sin(E) - M_wrapped`.

## Example

```ts
// If E solves Kepler's equation, residual(E,e,M) ≈ 0
const r = residual(1.0, 0.1, 0.9);
```
