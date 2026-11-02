[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rocketThrust

# Function: rocketThrust()

```ts
function rocketThrust(
  mDot: number,
  ve: number,
  pe: number,
  pa: number,
  Ae: number
): number;
```

Defined in:
[manoeuvres/rocket-thrust.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/rocket-thrust.ts#L47)

Compute the **thrust** of a rocket engine from its exhaust, including the
pressure term.

$$
F = \dot m\, v_e + (p_e - p_a)\, A_e
$$

Where:

- $\dot m$ is the mass flow rate (kg/s)
- $v_e$ is the exhaust velocity at the nozzle exit (m/s)
- $p_e$ is the pressure at the nozzle exit (Pa)
- $p_a$ is the ambient pressure (Pa), 0 in vacuum
- $A_e$ is the nozzle exit area (m²)

**Units**

- Inputs: `mDot` in **kg/s**, `ve` in **m/s**, `pe` and `pa` in **Pa**, `Ae` in
  **m²**.
- Output: $F$ in **N**.

::: info Notes

- The same engine gives more thrust in vacuum than at sea level: $p_a$ pushes
  back on the nozzle exit.
- A nozzle with $p_e < p_a$ is over-expanded, and the pressure term reduces the
  thrust.
- With $p_e = p_a$ the thrust is $\dot m\, v_e$, and $v_e$ equals $I_{sp}\,
  g_0$.

:::

## Parameters

| Parameter | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `mDot`    | `number` | Mass flow rate $\dot m$ in **kg/s** (finite, >= 0).  |
| `ve`      | `number` | Exhaust velocity $v_e$ in **m/s** (finite, >= 0).    |
| `pe`      | `number` | Nozzle exit pressure $p_e$ in **Pa** (finite, >= 0). |
| `pa`      | `number` | Ambient pressure $p_a$ in **Pa** (finite, >= 0).     |
| `Ae`      | `number` | Nozzle exit area $A_e$ in **m²** (finite, >= 0).     |

## Returns

`number`

Thrust $F$ in **N**. Can be negative for a badly over-expanded nozzle with
little flow.

## Throws

If any input is not a finite number.

## Throws

If any input is negative.

## Example

```ts
// 250 kg/s at 3000 m/s, exit at 70 kPa through a 1.2 m² nozzle
const vacuum = rocketThrust(250, 3000, 70_000, 0, 1.2); // 834 000 N
const seaLevel = rocketThrust(250, 3000, 70_000, 101_325, 1.2); // ≈ 712 410 N
```

## See

- [massFlowRate](massFlowRate.md)
- https://en.wikipedia.org/wiki/Rocket_engine_nozzle Rocket engine nozzle
  (thrust equation)
