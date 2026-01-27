[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rot3

# Function: rot3()

```ts
function rot3(theta: Radians): Matrix3x3Type;
```

Defined in:
[helpers/rot-3.ts:38](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/helpers/rot-3.ts#L38)

Construct a **right-handed rotation matrix about the z-axis** (often written
**R₃**).

This returns the 3×3 direction cosine matrix (DCM) for an active rotation by
angle `theta` around the **+Z** axis:

$$
\mathbf{R}_3(\theta)=
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta  & 0 \\
0          & 0           & 1
\end{bmatrix}
$$

::: info Notes:

- `theta` is in **radians**.
- Matrix layout is **row-major**: `M[row][col]`.
- Common in 3-1-3 / 3-2-1 rotation sequences (e.g., IAU pole + prime meridian
  rotations) and general 3D coordinate transforms.

:::

## Parameters

| Parameter | Type                                             | Description                                        |
| --------- | ------------------------------------------------ | -------------------------------------------------- |
| `theta`   | [`Radians`](../../types/type-aliases/Radians.md) | Rotation angle ($\theta$) in **radians** (finite). |

## Returns

[`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)

3×3 rotation matrix ($\mathbf{R}_3(\theta)$) (row-major).

## Throws

If `theta` is not a finite number.

## Example

```ts
// Rotate about +Z by 90°:
const R = rot3(Math.PI / 2);
```
