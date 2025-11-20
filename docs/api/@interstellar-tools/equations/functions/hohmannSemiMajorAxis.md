[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hohmannSemiMajorAxis

# Function: hohmannSemiMajorAxis()

```ts
function hohmannSemiMajorAxis(r1: number, r2: number): number;
```

Defined in:
[manoeuvres/hohmann-transfer.ts:121](https://github.com/phun-ky/interstellar-tools/blob/8e4fe75a07b42cadc88954820349dccaa19bbbc8/packages/equations/src/categories/manoeuvres/hohmann-transfer.ts#L121)

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
