[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / terminalVelocity

# Function: terminalVelocity()

```ts
function terminalVelocity(
  m: number,
  g: number,
  rho: number,
  Cd: number,
  A: number
): number;
```

Defined in:
[entry/terminal-velocity.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/entry/terminal-velocity.ts#L49)

Compute the **terminal speed** of a falling body: where drag balances its
weight.

$$
v_t = \sqrt{\frac{2\,m\,g}{\rho\, C_D\, A}}
$$

Where:

- $m$ is the mass (kg)
- $g$ is the local gravitational acceleration (m/s²)
- $\rho$ is the air density (kg/m³)
- $C_D$ is the drag coefficient (dimensionless)
- $A$ is the reference area (m²)

**Units**

- Inputs: `m` in **kg**, `g` in **m/s²**, `rho` in **kg/m³**, `Cd`
  dimensionless, `A` in **m²**.
- Output: $v_t$ in **m/s**.

::: info Notes

- For a parachute, $C_D$ and $A$ are the canopy's. For a cluster, $A$ is the
  total canopy area, and real clusters lose a little drag to interference
  between the canopies.
- The density rises as the body descends, so the terminal speed falls: evaluate
  it at the altitude you care about, e.g. sea level for splashdown.
- At $v_t$, `atmosphericDragAcceleration` equals $g$.

:::

## Parameters

| Parameter | Type     | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| `m`       | `number` | Mass $m$ in **kg** (finite, > 0).                         |
| `g`       | `number` | Gravitational acceleration $g$ in **m/s²** (finite, > 0). |
| `rho`     | `number` | Air density $\rho$ in **kg/m³** (finite, > 0).            |
| `Cd`      | `number` | Drag coefficient $C_D$ (finite, > 0).                     |
| `A`       | `number` | Reference area $A$ in **m²** (finite, > 0).               |

## Returns

`number`

Terminal speed $v_t$ in **m/s**.

## Throws

If any input is not a finite number.

## Throws

If any input is `<= 0`.

## Example

```ts
// A 4.9 t capsule under three 25.5 m canopies (Cd ≈ 0.8) at sea level
const v = terminalVelocity(4932, 9.80665, 1.225, 0.8, 3 * Math.PI * 12.75 ** 2);
// v ≈ 8.0 m/s
```

## See

- [ballisticCoefficient](ballisticCoefficient.md)
- https://en.wikipedia.org/wiki/Terminal_velocity Terminal velocity
