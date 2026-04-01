[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hohmannSemiMajorAxis

# Function: hohmannSemiMajorAxis()

```ts
function hohmannSemiMajorAxis(r1: number, r2: number): number;
```

Defined in:
[manoeuvres/hohmann-transfer.ts:114](https://github.com/phun-ky/interstellar-tools/blob/82b9a076d3f1445cb0f7f98afc19d9495e58d415/packages/equations/src/categories/manoeuvres/hohmann-transfer.ts#L114)

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
