[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / gravitationalForce

# Function: gravitationalForce()

```ts
function gravitationalForce(
  m1: number,
  m2: number,
  r1: Vector3DTupleType,
  r2: Vector3DTupleType,
  G?: number
): ForceResultInterface;
```

Defined in:
[gravity/gravitational-force.ts:98](https://github.com/phun-ky/interstellar-tools/blob/be1b8ef8587533bce30fa71e6c16201f0119225c/packages/equations/src/categories/gravity/gravitational-force.ts#L98)

Compute the Newtonian **gravitational force** on body 1 due to body 2.

**Definitions**

$$
\mathbf r=\mathbf r_2-\mathbf r_1,\quad
r=\lVert\mathbf r\rVert,\quad
\hat{\mathbf r}=\frac{\mathbf r}{r}
$$

**Law & Decomposition**

$$
\mathbf F_{1\leftarrow2}
= G\,\frac{m_1 m_2}{r^2}\,\hat{\mathbf r}
$$

$$
\lVert\mathbf F\rVert
= G\,\frac{m_1 m_2}{r^2},\qquad
\mathbf F=\langle F_x,F_y,F_z\rangle
= \lVert\mathbf F\rVert\,\hat{\mathbf r}
$$

$$
F_x=\lVert\mathbf F\rVert\,\hat r_x,\quad
F_y=\lVert\mathbf F\rVert\,\hat r_y,\quad
F_z=\lVert\mathbf F\rVert\,\hat r_z
$$

**Newton's 3rd law, for context**

$$
\mathbf F_{1\leftarrow2}=-\,\mathbf F_{2\leftarrow1}
$$

**Conventions & units**

- Input masses in **kilograms (kg)**; positions in **meters (m)**.
- Output force in **newtons (N)**.
- Returned `vector` and `direction` point **from body 1 toward body 2**; i.e.,
  `direction = \hat{\mathbf r}`.

**Invariants (within numerical tolerance)**

- `vector = magnitude * direction`
- `magnitude = sqrt(Fx² + Fy² + Fz²)`
- `||direction|| = 1`

## Parameters

| Parameter | Type                                                                 | Default value | Description                                               |
| --------- | -------------------------------------------------------------------- | ------------- | --------------------------------------------------------- |
| `m1`      | `number`                                                             | `undefined`   | Mass of body 1 (kg).                                      |
| `m2`      | `number`                                                             | `undefined`   | Mass of body 2 (kg).                                      |
| `r1`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position of body 1 as a 3-tuple `[x, y, z]` in meters.    |
| `r2`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position of body 2 as a 3-tuple `[x, y, z]` in meters.    |
| `G?`      | `number`                                                             | `G_SI`        | Gravitational constant (defaults to `G_SI`, m³·kg⁻¹·s⁻²). |

## Returns

[`ForceResultInterface`](../../types/interfaces/ForceResultInterface.md)

`{ vector, magnitude, direction }`.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `m1` or `m2` are non-finite or negative.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If positions coincide (`r = 0`).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `G` is non-finite or not positive.

## Example

```ts
import { gravitationalForce } from '@interstellar-tools/equations';
import { G_SI } from '@interstellar-tools/constants';

// Earth–Sun at ~1 AU
const mEarth = 5.972e24; // kg
const mSun = 1.9885e30; // kg
const rEarth: [number, number, number] = [0, 0, 0];
const rSun: [number, number, number] = [1.495978707e11, 0, 0]; // m

const F = gravitationalForce(mEarth, mSun, rEarth, rSun, G_SI);
console.log(F.magnitude.toExponential(3)); // ≈ "3.542e+22" N
console.log(F.vector); // Points from Earth toward Sun (−x here)
```

**Get F directly (recommended)**

```ts
import { gravitationalForce } from '@interstellar-tools/equations';
import type {
  Vector3DTupleType,
  ForceResultInterface
} from '@interstellar-tools/types';

const m1 = 5.972e24; // kg
const m2 = 1.9885e30; // kg
const r1: Vector3DTupleType = [0, 0, 0]; // m
const r2: Vector3DTupleType = [1.495978707e11, 0, 0]; // m

const {
  vector: F,
  magnitude,
  direction
}: ForceResultInterface = gravitationalForce(m1, m2, r1, r2);
```

## See

https://en.wikipedia.org/wiki/Newton%27s\_law\_of\_universal\_gravitation
