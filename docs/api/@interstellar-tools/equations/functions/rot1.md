[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rot1

# Function: rot1()

```ts
function rot1(theta: Radians): Matrix3x3Type;
```

Defined in:
[helpers/rot-1.ts:38](https://github.com/phun-ky/interstellar-tools/blob/0d7df195ae500c345b1c6ecb00826679455e45ef/packages/equations/src/categories/helpers/rot-1.ts#L38)

Construct a **right-handed rotation matrix about the x-axis** (often written
**R₁**).

This returns the 3×3 direction cosine matrix (DCM) for an active rotation by
angle `theta` around the **+X** axis, using the common aerospace convention:

$$
\mathbf{R}_1(\theta)=
\begin{bmatrix}
1 & 0 & 0 \\
0 & \cos\theta & -\sin\theta \\
0 & \sin\theta & \cos\theta
\end{bmatrix}
$$

::: info Notes:

- `theta` is in **radians**.
- Matrix layout is **row-major**: `M[row][col]`.
- Useful for composing 3-1-3 / 3-2-1 sequences (e.g., IAU body orientation) and
  for general 3D frame transforms in mapping pipelines.

:::

## Parameters

| Parameter | Type                                             | Description                                        |
| --------- | ------------------------------------------------ | -------------------------------------------------- |
| `theta`   | [`Radians`](../../types/type-aliases/Radians.md) | Rotation angle ($\theta$) in **radians** (finite). |

## Returns

[`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)

3×3 rotation matrix ($\mathbf{R}_1(\theta)$) (row-major).

## Throws

If `theta` is not a finite number.

## Example

```ts
// Rotate a vector about +X by 90°:
const R = rot1(Math.PI / 2);
```
