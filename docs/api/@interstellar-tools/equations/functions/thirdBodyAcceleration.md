[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / thirdBodyAcceleration

# Function: thirdBodyAcceleration()

```ts
function thirdBodyAcceleration(
  r: Vector3DTupleType,
  rBody: Vector3DTupleType,
  muBody: number
): Vector3DTupleType;
```

Defined in:
[gravity/third-body-acceleration.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/gravity/third-body-acceleration.ts#L57)

The **tidal pull of a third body**, such as the Moon or the Sun, on a satellite:
how much more, or less, it pulls the satellite than the planet the satellite
orbits. Only that difference changes the orbit, as both fall toward the third
body together.

$$
\mathbf a = \mu_b\left(\frac{\mathbf s - \mathbf r}{\lVert\mathbf s - \mathbf r\rVert^3} - \frac{\mathbf s}{s^3}\right)
$$

computed in Battin's form, which doesn't lose digits to the near-cancelling
terms when the body is far away:

$$
\mathbf a = -\frac{\mu_b}{\lVert\mathbf s - \mathbf r\rVert^3}\big(\mathbf r + f(q)\,\mathbf s\big), \qquad
q = \frac{\mathbf r \cdot (\mathbf r - 2\mathbf s)}{s^2}, \qquad
f(q) = q\,\frac{3 + 3q + q^2}{1 + (1 + q)^{3/2}}
$$

Where:

- $\mathbf r$ is the satellite's position from the planet's centre (m)
- $\mathbf s$ is the third body's position from the planet's centre (m)
- $\mu_b$ is the third body's gravitational parameter (m³/s²)

**Units**

- Inputs: positions in **m**, `muBody` in **m³/s²**.
- Output: the acceleration in **m/s²**, on the axes of the positions.

::: info Notes

- The Moon's tidal pull on a satellite in low Earth orbit is at most about 1.2 ×
  10⁻⁶ m/s², and the Sun's under half that. In geostationary orbit they're 7 ×
  10⁻⁶ and 3 × 10⁻⁶ m/s², and tilt the orbit plane by about 0.8° a year.
- Use positions on the same axes: [sunPosition](sunPosition.md) and
  [moonPosition](moonPosition.md) give them in Earth's mean equator and equinox
  of the date.

:::

## Parameters

| Parameter | Type                                                                 | Description                                                                                              |
| --------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `r`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | The satellite's position $\mathbf r$ in **m**, from the planet's centre (finite).                        |
| `rBody`   | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | The third body's position $\mathbf s$ in **m**, from the planet's centre (finite, not zero, not at `r`). |
| `muBody`  | `number`                                                             | The third body's gravitational parameter $\mu_b$ in **m³/s²** (finite, >= 0).                            |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

The acceleration in **m/s²**.

## Throws

If a position is not three finite numbers, or `muBody` is not finite.

## Throws

If `rBody` is zero or at `r`, or `muBody < 0`.

## Example

```ts
// The Moon straight overhead of a satellite 400 km up
thirdBodyAcceleration([6_778_137, 0, 0], [3.844e8, 0, 0], 4.9028e12);
// ≈ [1.2e-6, 0, 0]: toward the Moon, a stretching tide
```

## See

- [moonPosition](moonPosition.md)
- [sunPosition](sunPosition.md)
- Battin, _An Introduction to the Mathematics and Methods of Astrodynamics_,
  revised ed. (1999)
