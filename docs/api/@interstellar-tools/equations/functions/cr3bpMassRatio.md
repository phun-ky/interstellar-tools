[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cr3bpMassRatio

# Function: cr3bpMassRatio()

```ts
function cr3bpMassRatio(m1: number, m2: number): number;
```

Defined in:
[three-body/cr3bp-mass-ratio.ts:39](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/three-body/cr3bp-mass-ratio.ts#L39)

Compute the **mass ratio** $\mu$ of the circular restricted three-body problem.

$$
\mu = \frac{m_2}{m_1 + m_2}
$$

Where:

- $m_1$ is the larger body's mass, $m_2$ the smaller's

**Units**

- Inputs: `m1` and `m2` in the same unit: kg, or gravitational parameters in
  m³/s² (the ratio is the same).
- Output: $\mu$, dimensionless, in (0, 0.5].

::: info Notes

- In the normalised rotating frame, the larger body sits at $x = -\mu$ and the
  smaller at $x = 1 - \mu$; their centre of mass is the origin.
- Earth–Moon: $\mu \approx 0.01215$. Sun–Earth: $\mu \approx 3.0 \times
  10^{-6}$. Sun–Jupiter: $\mu \approx 9.5 \times 10^{-4}$.
- The Lagrange points L4 and L5 are stable for $\mu < 0.0385$.

:::

## Parameters

| Parameter | Type     | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `m1`      | `number` | Mass (or gravitational parameter) of the larger body (finite, > 0).           |
| `m2`      | `number` | Mass (or gravitational parameter) of the smaller body (finite, > 0, <= `m1`). |

## Returns

`number`

The mass ratio $\mu$.

## Throws

If any input is not a finite number.

## Throws

If `m1 <= 0`, `m2 <= 0` or `m2 > m1`.

## Example

```ts
// Earth and Moon, from their gravitational parameters
cr3bpMassRatio(3.986004418e14, 4.902800118e12); // ≈ 0.012151
```

## See

- [cr3bpUnits](cr3bpUnits.md)
- [cr3bpDerivatives](cr3bpDerivatives.md)
