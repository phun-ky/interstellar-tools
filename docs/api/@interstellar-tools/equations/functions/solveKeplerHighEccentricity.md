[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKeplerHighEccentricity

# Function: solveKeplerHighEccentricity()

```ts
function solveKeplerHighEccentricity(
  M: Radians,
  e: number,
  maxIter?: number,
  tolerance?: number
): Radians;
```

Defined in:
[kepler/solve-kepler-high-eccentricity.ts:97](https://github.com/phun-ky/interstellar-tools/blob/73b7706b7604f8f7bea1ab1f3bacb7598cdd6254/packages/equations/src/categories/kepler/solve-kepler-high-eccentricity.ts#L97)

Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) in highly
eccentric orbits ($e > 0.9$) using an iterative numerical approach.

**Mathematical Explanation:**

Kepler's equation for eccentric anomaly ($E$) is:

![solve-kelper-high-eccentricity-elliptical-orbit](https://raw.githubusercontent.com/phun-ky/interstellar/b607daf8e014128a6dceb3cf8d522676f06bc233/public/solve-kelper-high-eccentricity-elliptical-orbit.svg)

$$
M = E - e \sin(E) \quad \text{(for elliptical orbits, } 0 < e < 1\text{)}
$$

![solve-kepler-high-eccentricity-hyperbolic-orbit](https://raw.githubusercontent.com/phun-ky/interstellar/b607daf8e014128a6dceb3cf8d522676f06bc233/public/solve-kepler-high-eccentricity-hyperbolic-orbit.svg)

$$
M = e \sinh(E) - E \quad \text{(for hyperbolic orbits, } e > 1\text{)}
$$

For orbits with **high eccentricity** ($e \approx 1$), standard Newton-Raphson
solvers struggle due to extreme changes in orbital velocity near perihelion.
Instead, we apply a **fixed-point iteration** method that is more stable for
these cases.

---

**Solving Strategy:**

1. **Initial Guess:**
   - The solver starts with $E_0 = M$ and refines using:

$$
E_0 = M \pm \frac{e \sin(M)}{1 - e \cos(M)}
$$

2. **Iterative Refinement:**
   - The method updates $E$ using:

$$
\Delta E = \frac{E - e \sin(E) - M}{1 - e \cos(E)}
$$

for elliptical orbits.

$$
\Delta E = \frac{e \sinh(E) - E - M}{e \cosh(E) - 1}
$$

for hyperbolic orbits.

- Iteration stops when:

$$
|E_{n+1} - E_n| < \text{tolerance}
$$

(default tolerance is **1e-9**).

3. **Angle Wrapping (Elliptical Only):**
   - The result is wrapped using `wrapAngle()` for consistency.

**Performance Considerations:**

- **Typically converges in fewer than 10 iterations for $e > 0.9$.**
- **Time complexity:** $O(1)$ for standard convergence.

## Parameters

| Parameter    | Type                                             | Default value | Description                                                    |
| ------------ | ------------------------------------------------ | ------------- | -------------------------------------------------------------- |
| `M`          | [`Radians`](../../types/type-aliases/Radians.md) | `undefined`   | Mean anomaly ($M$) in **radians**.                             |
| `e`          | `number`                                         | `undefined`   | Orbital eccentricity ($e > 0.9$ for high-eccentricity orbits). |
| `maxIter?`   | `number`                                         | `...`         | Maximum number of **iterations** before failure.               |
| `tolerance?` | `number`                                         | `1e-9`        | Convergence criterion for stopping the iteration.              |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The **eccentric anomaly** ($E$) in **radians** (wrapped to $[-\pi, \pi]$ for
elliptical orbits).

## Examples

```ts
import { solveKeplerHighEccentricity } from './solve-kepler';

const M = Math.PI / 4; // 45 degrees in radians
const e = 0.95; // High orbital eccentricity
const result = solveKeplerHighEccentricity(M, e);
console.log(result); // Output: Eccentric anomaly in radians
```

```ts
// Hyperbolic orbit example (e > 1)
const M_hyperbolic = 2.0; // Mean anomaly for hyperbolic orbit
const e_hyperbolic = 1.2; // Hyperbolic eccentricity
console.log(solveKeplerHighEccentricity(M_hyperbolic, e_hyperbolic));
```

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [Hyperbolic Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Hyperbolic_trajectory#Hyperbolic_anomaly)
