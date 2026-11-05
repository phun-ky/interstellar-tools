[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / lagrangePoints

# Function: lagrangePoints()

```ts
function lagrangePoints(
  m1: number,
  m2: number,
  separation: number
): LagrangePointsInterface;
```

Defined in:
[three-body/lagrange-points.ts:107](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/three-body/lagrange-points.ts#L107)

The five **Lagrange points** of two bodies circling each other: where a third,
small body can stay put relative to them. JWST, Gaia and SOHO are parked at
Sun-Earth L1 and L2, and the Trojan asteroids gather at Sun-Jupiter L4 and L5.

L4 and L5 sit at the corners of equilateral triangles with the two bodies. L1,
L2 and L3 lie on the line through them, at distances $\gamma$ that solve the
quintics of the collinear equilibrium, in the mass ratio $\mu = m_2 / (m_1 +
m_2)$:

$$
\begin{aligned}
\text{L1:}\quad & \gamma^5 - (3-\mu)\gamma^4 + (3-2\mu)\gamma^3 - \mu\gamma^2 + 2\mu\gamma - \mu = 0 \\
\text{L2:}\quad & \gamma^5 + (3-\mu)\gamma^4 + (3-2\mu)\gamma^3 - \mu\gamma^2 - 2\mu\gamma - \mu = 0 \\
\text{L3:}\quad & \gamma^5 + (2+\mu)\gamma^4 + (1+2\mu)\gamma^3 - (1-\mu)\gamma^2 - 2(1-\mu)\gamma - (1-\mu) = 0
\end{aligned}
$$

solved with Newton's method from the Hill approximation $\gamma \approx
\sqrt[3]{\mu/3}$ for L1 and L2, and $\gamma \approx 1 - 7\mu/12$ for L3.

Where:

- $\gamma$ is the distance, in units of the separation, of L1 and L2 from the
  smaller body, and of L3 from the larger
- $m_1$, $m_2$ are the larger and the smaller body's masses

**Units**

- Inputs: `m1` and `m2` in the same unit, kg or gravitational parameters in
  m³/s²; `separation` in **m**.
- Output: positions in **m**, in the frame turning with the bodies, from their
  barycentre: see
  [LagrangePointsInterface](../../types/interfaces/LagrangePointsInterface.md).

::: info Notes

- The larger body is at $x = -\mu a$ and the smaller at $x = (1 - \mu) a$, as in
  [cr3bpDerivatives](cr3bpDerivatives.md) scaled by the separation $a$.
- L1, L2 and L3 are unstable: a spacecraft there needs small manoeuvres every
  few weeks to stay. L4 and L5 are stable when the mass ratio is small enough:
  see [areTrojanPointsStable](areTrojanPointsStable.md).
- Spacecraft "at" L1 or L2, such as JWST, fly halo orbits around them, hundreds
  of thousands of kilometres across.

:::

::: practice Sun-Earth L2, where JWST orbits

**1.5 million km**

_From Earth, straight away from the Sun_

Four times the Moon's distance, where Earth's pull and the Sun's let a
spacecraft keep pace with Earth around the Sun, in Earth's shadow side.

```ts
const { L2 } = lagrangePoints(1.32712440041e20, 4.0350323e14, 1.495978707e11);

L2[0] - (1 - 3.04e-6) * 1.495978707e11; // ≈ 1.5e9 m beyond Earth
```

:::

## Parameters

| Parameter    | Type     | Description                                                                   |
| ------------ | -------- | ----------------------------------------------------------------------------- |
| `m1`         | `number` | Mass (or gravitational parameter) of the larger body (finite, > 0).           |
| `m2`         | `number` | Mass (or gravitational parameter) of the smaller body (finite, > 0, <= `m1`). |
| `separation` | `number` | Distance between the two bodies in **m** (finite, > 0).                       |

## Returns

[`LagrangePointsInterface`](../../types/interfaces/LagrangePointsInterface.md)

L1 to L5 in **m**: see
[LagrangePointsInterface](../../types/interfaces/LagrangePointsInterface.md).

## Throws

If any input is not a finite number.

## Throws

If `m1 <= 0`, `m2 <= 0`, `m2 > m1` or `separation <= 0`.

## Example

```ts
// Earth and the Moon, 384 400 km apart
const { L1 } = lagrangePoints(3.986004418e14, 4.9028e12, 384_400_000);

L1[0]; // ≈ 321 710 km from the barycentre: 326 381 km from Earth
```

## See

- [areTrojanPointsStable](areTrojanPointsStable.md)
- [cr3bpMassRatio](cr3bpMassRatio.md)
- [jacobiConstant](jacobiConstant.md)
