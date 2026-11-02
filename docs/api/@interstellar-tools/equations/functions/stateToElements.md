[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / stateToElements

# Function: stateToElements()

```ts
function stateToElements(
  r: Vector3DTupleType,
  v: Vector3DTupleType,
  mu: number,
  tolerance?: number
): ClassicalElementsInterface;
```

Defined in:
[orbits/state-to-elements.ts:88](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/state-to-elements.ts#L88)

Convert a **state vector** (position and velocity) to the six **classical
orbital elements**.

$$
\mathbf h = \mathbf r \times \mathbf v, \quad
\mathbf e = \frac{\mathbf v \times \mathbf h}{\mu} - \frac{\mathbf r}{r}, \quad
\mathbf n = \hat{\mathbf k} \times \mathbf h, \quad
a = -\frac{\mu}{2\varepsilon}, \quad
\varepsilon = \frac{v^2}{2} - \frac{\mu}{r}
$$

$$
i = \arccos\frac{h_z}{h}, \quad
\Omega = \operatorname{atan2}(n_y, n_x), \quad
\omega = \angle(\mathbf n, \mathbf e), \quad
\nu = \angle(\mathbf e, \mathbf r)
$$

where each angle $\angle$ is measured in the direction of motion, about $\mathbf
h$.

**Units**

- Inputs: `r` in **m**, `v` in **m/s**, `mu` in **m³/s²**.
- Output: `a` in **m**, `e` dimensionless, angles in **radians**.

::: info Notes

- Works for elliptic and hyperbolic orbits. A hyperbolic orbit has a negative
  `a`, and `nu` in \[0, 2π) like the others: the incoming branch is just below
  2π.
- Some angles are undefined for special orbits. Below `tolerance`, the function
  uses these conventions, which [elementsToState](elementsToState.md) reverses:
  - **circular** ($e \approx 0$): `argp = 0`, and `nu` is measured from the
    ascending node (the argument of latitude);
  - **equatorial** ($i \approx 0$ or $\pi$): `raan = 0`, and `argp` is measured
    from the x axis (the longitude of periapsis);
  - **circular and equatorial**: `raan = argp = 0`, and `nu` is measured from
    the x axis (the true longitude).
- The frame is whatever inertial frame `r` and `v` are given in, centred on the
  body with parameter `mu`; the reference plane is its xy plane.

:::

::: practice Apollo 11, leaving for the Moon

**e = 0.977**

_From the flown state at trans-lunar injection: 6 712.6 km from Earth's centre,
10 834.3 m/s, 7.367° above the horizontal_

The AS-506 flight evaluation report gives 0.97696; the inputs here are rounded.
An orbit that stretched reaches far beyond the Moon, but the Moon's gravity
takes over long before.

```ts
const r = 6_712_602; // m
const v = 10_834.3; // m/s
const gamma = toRad(7.367);
stateToElements(
  [r, 0, 0],
  [v * Math.sin(gamma), v * Math.cos(gamma), 0],
  3.986004418e14
).e; // ≈ 0.97715
```

:::

## Parameters

| Parameter    | Type                                                                 | Default value | Description                                                                         |
| ------------ | -------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| `r`          | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Position vector in **m** (finite components, not zero).                             |
| `v`          | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | Velocity vector in **m/s** (finite components).                                     |
| `mu`         | `number`                                                             | `undefined`   | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0).                           |
| `tolerance?` | `number`                                                             | `1e-10`       | Below this, `e` counts as circular and $\sin i$ as equatorial. Defaults to `1e-10`. |

## Returns

[`ClassicalElementsInterface`](../../types/interfaces/ClassicalElementsInterface.md)

The classical orbital elements.

## Throws

If any input is not a finite number.

## Throws

If `mu <= 0`, `tolerance < 0`, `r` is zero, or the motion is straight up or down
(no angular momentum).

## Example

```ts
// Curtis, Orbital Mechanics for Engineering Students, in km and km/s
const { a, e, i, raan, argp, nu } = stateToElements(
  [-6045e3, -3490e3, 2500e3],
  [-3.457e3, 6.618e3, 2.533e3],
  398_600e9
);
// e ≈ 0.1712, i ≈ 153.2°, raan ≈ 255.3°, argp ≈ 20.07°, nu ≈ 28.45°
```

## See

- [elementsToState](elementsToState.md)
- https://en.wikipedia.org/wiki/Orbital_elements Orbital elements
