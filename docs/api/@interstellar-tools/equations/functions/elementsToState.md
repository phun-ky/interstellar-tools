[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / elementsToState

# Function: elementsToState()

```ts
function elementsToState(
  elements: ClassicalElementsInterface,
  mu: number
): StateVectorInterface;
```

Defined in:
[orbits/elements-to-state.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/elements-to-state.ts#L72)

Convert the six **classical orbital elements** to a **state vector** (position
and velocity).

In the perifocal frame, with the semi-latus rectum $p = a(1 - e^2)$ (or
`elements.p` when given):

$$
\mathbf r_{PQW} = \frac{p}{1 + e\cos\nu}\begin{pmatrix}\cos\nu \\ \sin\nu \\ 0\end{pmatrix}, \quad
\mathbf v_{PQW} = \sqrt{\frac{\mu}{p}}\begin{pmatrix}-\sin\nu \\ e + \cos\nu \\ 0\end{pmatrix}
$$

then rotated into the inertial frame:

$$
\mathbf r = R_3(\Omega)\,R_1(i)\,R_3(\omega)\,\mathbf r_{PQW}, \quad
\mathbf v = R_3(\Omega)\,R_1(i)\,R_3(\omega)\,\mathbf v_{PQW}
$$

**Units**

- Inputs: `a` and `p` in **m**, `e` dimensionless, angles in **radians**, `mu`
  in **m³/s²**.
- Output: `r` in **m**, `v` in **m/s**.

::: info Notes

- The inverse of [stateToElements](stateToElements.md), including its
  conventions for circular and equatorial orbits.
- Elliptic orbits need $a > 0$ and hyperbolic ones $a < 0$. A parabolic orbit
  ($e = 1$) has no finite $a$: it needs `p`, twice its periapsis radius.
- When `p` is given it's used in place of $a(1 - e^2)$, which loses precision
  near $e = 1$. [stateToElements](stateToElements.md) returns it.
- If `a` is finite too, `p` is only used while the two agree, to within
  $10^{-9}$, as they do straight from [stateToElements](stateToElements.md).
  Change `a` or `e` and they no longer agree: then `a` and `e` decide the orbit,
  and `p` is ignored. To change the size of an orbit near $e = 1$, change `p`
  and drop `a`, or give `a` as `Infinity`.
- On a hyperbola or a parabola, only true anomalies with $1 + e\cos\nu > 0$
  exist: the body never reaches the asymptotes, or $\nu = \pi$.

:::

## Parameters

| Parameter  | Type                                                                                 | Description                                               |
| ---------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `elements` | [`ClassicalElementsInterface`](../../types/interfaces/ClassicalElementsInterface.md) | The classical orbital elements.                           |
| `mu`       | `number`                                                                             | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0). |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in **m** and velocity `v` in **m/s**.

## Throws

- If any input is not a finite number.
- If `mu <= 0`, `e < 0`, `e = 1` without `p`, `p <= 0`, `i` is outside \[0, π],
  `a` has the wrong sign for `e`, or `nu` is beyond a hyperbola's asymptotes or
  a parabola's end.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// A circular, equatorial orbit at 7000 km, a quarter of the way round
const { r, v } = elementsToState(
  {
    a: 7_000_000,
    e: 0,
    i: 0 as Radians,
    raan: 0 as Radians,
    argp: 0 as Radians,
    nu: (Math.PI / 2) as Radians
  },
  3.986004418e14
);
// r ≈ [0, 7 000 000, 0] m, v ≈ [-7546, 0, 0] m/s
```

## See

- [stateToElements](stateToElements.md)
- https://en.wikipedia.org/wiki/Perifocal_coordinate_system Perifocal coordinate
  system
