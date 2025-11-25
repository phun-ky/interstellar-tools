[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / accelerationOn1By2

# Function: accelerationOn1By2()

```ts
function accelerationOn1By2(
  m2: number,
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  G?: number
): Vector3DTupleType;
```

Defined in:
[gravity/acceleration-on1-by2.ts:69](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/equations/src/categories/gravity/acceleration-on1-by2.ts#L69)

Gravitational **acceleration** of body 1 due to body 2 (vector, m/s²).

**Definitions**

$$
\mathbf r=\mathbf r_2-\mathbf r_1,\quad
r=\lVert\mathbf r\rVert,\quad
\hat{\mathbf r}=\frac{\mathbf r}{r}
$$

**Acceleration field**

$$
\mathbf a_{1\leftarrow2}
= \frac{\mathbf F_{1\leftarrow2}}{m_1}
= G\,\frac{m_2}{r^2}\,\hat{\mathbf r}
$$

**Units**

- Inputs: masses in **kg**, positions in **m**, ($G$) in **m³·kg⁻¹·s⁻²**.
- Output: acceleration in **m/s²**.

::: info

- Implemented via `gravitationalForce(1, m2, r1, r2, G)`, so the returned vector
  equals the force on a **1 kg** test mass (i.e., the acceleration).
- Direction points **from body 1 toward body 2**: ($ \hat{\mathbf r} $).

:::

**Invariants (within FP tolerance)**

- `||a|| = G*m2/r^2`
- `a = ||a|| * r̂`

## Parameters

| Parameter | Type                                                                 | Default value | Description                               |
| --------- | -------------------------------------------------------------------- | ------------- | ----------------------------------------- |
| `m2`      | `number`                                                             | `undefined`   | Mass of body 2 (kg).                      |
| `r1`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position of body 1 `[x, y, z]` in meters. |
| `r2`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position of body 2 `[x, y, z]` in meters. |
| `G?`      | `number`                                                             | `G_SI`        | Gravitational constant.                   |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

Acceleration of body 1 due to body 2 (m/s²).

## Examples

```ts
// Acceleration of a satellite due to Earth at ~7000 km from Earth's center
const mSat = 500; // kg (any value; a is independent of mSat)
const mEarth = 5.972e24; // kg
const rSat: [number, number, number] = [7.0e6, 0, 0]; // m
const rEarth: [number, number, number] = [0, 0, 0];

const a = accelerationOn1By2(mSat, mEarth, rSat, rEarth);
// ≈ [-8.14, 0, 0] m/s² (toward Earth)
```

```ts
// Derive force from acceleration (F = m1 * a)
const m1 = 1200; // kg spacecraft
const a = accelerationOn1By2(m1, mEarth, rSat, rEarth);
const F: [number, number, number] = [a[0] * m1, a[1] * m1, a[2] * m1]; // newtons
```

## See

https://en.wikipedia.org/wiki/Newton%27s\_law\_of\_universal\_gravitation
