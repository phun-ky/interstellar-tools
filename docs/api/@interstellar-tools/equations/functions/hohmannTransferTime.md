[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hohmannTransferTime

# Function: hohmannTransferTime()

```ts
function hohmannTransferTime(r1: number, r2: number, mu: number): number;
```

Defined in:
[manoeuvres/hohmann-transfer.ts:138](https://github.com/phun-ky/interstellar-tools/blob/c21341f00384c8b187db92798727ddf5a9178d70/packages/equations/src/categories/manoeuvres/hohmann-transfer.ts#L138)

Convenience: compute only the **transfer time** ($t_t$) (s).

$t_t=\pi \sqrt{\frac{a_t^3}{\mu}}$

## Parameters

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `r1`      | `number` | Initial radius (m).              |
| `r2`      | `number` | Target radius (m).               |
| `mu`      | `number` | Gravitational parameter (m³/s²). |

## Returns

`number`

Transfer time ($t_t$) (s).

## Throws

On invalid inputs.
