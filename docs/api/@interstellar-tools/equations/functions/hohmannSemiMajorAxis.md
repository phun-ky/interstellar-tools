[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hohmannSemiMajorAxis

# Function: hohmannSemiMajorAxis()

```ts
function hohmannSemiMajorAxis(r1: number, r2: number): number;
```

Defined in:
[manoeuvres/hohmann-transfer.ts:121](https://github.com/phun-ky/interstellar-tools/blob/c901577e81132c0c53936a1caf881c7dc55a9832/packages/equations/src/categories/manoeuvres/hohmann-transfer.ts#L121)

Convenience: compute only the **semi-major axis** ($a_t$) (m) of the Hohmann
transfer.

$a_t=\frac{r_1+r_2}{2}$

## Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `r1`      | `number` | Initial circular-orbit radius (m). |
| `r2`      | `number` | Target circular-orbit radius (m).  |

## Returns

`number`

($a_t$) (m).

## Throws

On invalid inputs.
