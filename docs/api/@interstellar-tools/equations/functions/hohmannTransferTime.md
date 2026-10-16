[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hohmannTransferTime

# Function: hohmannTransferTime()

```ts
function hohmannTransferTime(r1: number, r2: number, mu: number): number;
```

Defined in:
[manoeuvres/hohmann-transfer.ts:138](https://github.com/phun-ky/interstellar-tools/blob/e281a6e583ee6da6973d3556f5004f2598cacd49/packages/equations/src/categories/manoeuvres/hohmann-transfer.ts#L138)

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
