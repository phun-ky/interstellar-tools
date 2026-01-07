[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / forceOn1By2

# Function: forceOn1By2()

```ts
function forceOn1By2(
  m1: number,
  m2: number,
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  G?: number
): Vector3DTupleType;
```

Defined in:
[gravity/force-on1-by2.ts:90](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/gravity/force-on1-by2.ts#L90)

Gravitational **force vector** on body 1 due to body 2 (newtons, N).

**Definitions**

$$
\mathbf r=\mathbf r_2-\mathbf r_1,\quad
r=\lVert\mathbf r\rVert,\quad
\hat{\mathbf r}=\frac{\mathbf r}{r}
$$

**Newton's law (vector form)**

$$
\mathbf F_{1\leftarrow2}
= G\,\frac{m_1 m_2}{r^2}\,\hat{\mathbf r}
$$

**Magnitude & Components**

$$
\lVert\mathbf F\rVert=G\,\frac{m_1 m_2}{r^2},\qquad
\mathbf F=\langle F_x,F_y,F_z\rangle=\lVert\mathbf F\rVert\,\hat{\mathbf r}
$$

$$
F_x=\lVert\mathbf F\rVert\,\hat r_x,\quad
F_y=\lVert\mathbf F\rVert\,\hat r_y,\quad
F_z=\lVert\mathbf F\rVert\,\hat r_z
$$

**Newton's 3rd law (context)**

$$
\mathbf F_{1\leftarrow2}=-\,\mathbf F_{2\leftarrow1}
$$

**Units**

- Inputs: masses in **kg**, positions in **m**, ($G$) in **m³·kg⁻¹·s⁻²**.
- Output: force vector in **newtons (N)**.

::: info

- The returned vector points **from body 1 toward body 2** (i.e., along ($
  \hat{\mathbf r} $)).
- Internally delegates to `gravitationalForce(m1, m2, r1, r2, G)` and returns
  its direction-scaled magnitude as a 3-tuple.
- For acceleration instead of force, use `accelerationOn1By2` or compute ($
  \mathbf a=\mathbf F/m_1 $).

:::

**Invariants (within FP tolerance)**

- `||F|| = G*m1*m2/r²`
- `F = ||F|| * r̂`

## Parameters

| Parameter | Type                                                                 | Default value | Description                               |
| --------- | -------------------------------------------------------------------- | ------------- | ----------------------------------------- |
| `m1`      | `number`                                                             | `undefined`   | Mass of body 1 (kg).                      |
| `m2`      | `number`                                                             | `undefined`   | Mass of body 2 (kg).                      |
| `r1`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position of body 1 `[x, y, z]` in meters. |
| `r2`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position of body 2 `[x, y, z]` in meters. |
| `G?`      | `number`                                                             | `G_SI`        | Gravitational constant.                   |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

Force on body 1 due to body 2, in newtons `[Fx, Fy, Fz]`.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
Propagated from `gravitationalForce` if inputs are invalid (non-finite/negative
masses, coincident positions ($r=0$), or non-positive ($G$)).

## Examples

```ts
// Earth–Sun at ~1 AU (force on Earth due to Sun)
const mEarth = 5.972e24; // kg
const mSun = 1.9885e30; // kg
const rEarth: [number, number, number] = [0, 0, 0];
const rSun: [number, number, number] = [1.495978707e11, 0, 0]; // m

const F = forceOn1By2(mEarth, mSun, rEarth, rSun); // N
const Fmag = Math.hypot(F[0], F[1], F[2]); // ≈ 3.54e22 N
```

```ts
// Derive acceleration from the returned force: a = F / m1
const a: [number, number, number] = [
  F[0] / mEarth,
  F[1] / mEarth,
  F[2] / mEarth
]; // m/s²
```

## See

https://en.wikipedia.org/wiki/Newton%27s\_law\_of\_universal\_gravitation
