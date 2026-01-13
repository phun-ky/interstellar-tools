[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / atmosphericDragAcceleration

# Function: atmosphericDragAcceleration()

```ts
function atmosphericDragAcceleration(
  Cd: number,
  A: number,
  m: number,
  rho: number,
  v: number
): number;
```

Defined in:
[orbits/atmospheric-drag-acceleration.ts:39](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/equations/src/categories/orbits/atmospheric-drag-acceleration.ts#L39)

Compute **atmospheric drag acceleration magnitude**.

Equation:

$$
a_D=\frac{1}{2}\,\frac{C_D A}{m}\,\rho\,v^2
$$

Where:

- $C_D$ is the drag coefficient (dimensionless)
- $A$ is reference area normal to the flow (m²)
- $m$ is spacecraft mass (kg)
- $\rho$ is atmospheric density (kg/m³)
- $v$ is speed relative to the atmosphere (m/s)

Units:

- Returns acceleration magnitude in **m/s²**.

Note:

- This returns the **magnitude** of drag acceleration. The drag acceleration
  vector points opposite the velocity direction (i.e., along $-\hat{v}$).

## Parameters

| Parameter | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| `Cd`      | `number` | Drag coefficient $C_D$ (finite, >= 0).                       |
| `A`       | `number` | Reference area $A$ (finite, >= 0), in m².                    |
| `m`       | `number` | Mass $m$ (finite, > 0), in kg.                               |
| `rho`     | `number` | Atmospheric density $\rho$ (finite, >= 0), in kg/m³.         |
| `v`       | `number` | Speed relative to the atmosphere $v$ (finite, >= 0), in m/s. |

## Returns

`number`

Drag acceleration magnitude $a_D$ in m/s².

## Throws

If any input is not finite.

## Throws

If `m <= 0` or any of `Cd, A, rho, v` is negative.

## Example

```ts
// Example (rough LEO order-of-magnitude):
const aD = atmosphericDragAcceleration(2.2, 2.0, 500, 1e-12, 7700);
```
