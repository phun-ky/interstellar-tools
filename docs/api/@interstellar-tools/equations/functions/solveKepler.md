[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKepler

# Function: solveKepler()

```ts
function solveKepler(
  M: Radians,
  e: number,
  maxIter?: number,
  tolerance?: number
): Radians;
```

Defined in:
[kepler/solve-kepler.ts:95](https://github.com/phun-ky/interstellar-tools/blob/872dfe8d0f65b144fea4ef4c2742791eeb710c94/packages/equations/src/categories/kepler/solve-kepler.ts#L95)

Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an
adaptive approach:

- **Newton-Raphson method** for fast convergence.
- **High-eccentricity solver** for extreme orbits ($e > 0.9$).
- **Bisection fallback** if the selected solver doesn't return a root.

---

**Mathematical Explanation:**

Kepler's equation relates the **mean anomaly** ($M$), the **eccentric anomaly**
($E$), and the **orbital eccentricity** ($e$) as:

$$
M = E - e \sin(E)
$$

Since this equation **cannot be solved algebraically**, numerical methods are
required.

---

**Solving Strategy:**

1. **Handle Special Cases:**
   - If the orbit is **circular** ($e = 0$), then $E = M$ directly.
   - If the orbit is **parabolic** ($e = 1$), an exception is thrown.
   - If **eccentricity is out of range** ($e < 0$ or $e \geq 1$), a `RangeError`
     is thrown.

2. **Select the Best Solver:**
   - **For high eccentricities ($e > 0.9$)** → Uses
     `solveKeplerHighEccentricity()`.
   - **For moderate eccentricities ($e \leq 0.9$)** → Uses
     `solveKeplerNewtonRaphson()`.
   - **The result is verified** against Kepler's equation ($|E - e\sin E - M|
     \leq$ `tolerance`, modulo $2\pi$). If the solver didn't converge (`NaN`),
     stopped at `maxIter`, or settled away from the root, it falls back to
     `solveKeplerBisection()`, which always brackets the root.

3. **Normalization:**
   - Kepler's equation is $2\pi$-periodic ($M + 2\pi k \mapsto E + 2\pi k$), so
     $M$ is first reduced to $[0, 2\pi)$ with `norm2pi()`. This keeps the
     solvers in their stable range for any finite $M$, including negative values
     and many revolutions.
   - The solution is normalized to $[0, 2\pi)$ with `norm2pi()`.

---

**Performance Considerations:**

- **Newton-Raphson typically converges in 4-5 iterations.**
- **Bisection fallback ensures robustness for extreme cases.**
- **High-eccentricity solver prevents instability for $e \approx 1$.**

---

## Parameters

| Parameter    | Type                                             | Default value | Description                                       |
| ------------ | ------------------------------------------------ | ------------- | ------------------------------------------------- |
| `M`          | [`Radians`](../../types/type-aliases/Radians.md) | `undefined`   | Mean anomaly ($M$) in **radians**.                |
| `e`          | `number`                                         | `undefined`   | Orbital eccentricity ($0 \leq e < 1$).            |
| `maxIter?`   | `number`                                         | `50`          | Maximum number of **iterations** before fallback. |
| `tolerance?` | `number`                                         | `1e-9`        | Convergence criterion for stopping the iteration. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The **eccentric anomaly** ($E$) in **radians** (normalized to $[0, 2\pi)$).

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the **eccentricity ($e$) is invalid** ($e < 0$ or $e \geq 1$).

---

## Examples

```ts
import { solveKepler } from '@interstellar-tools/equations';

// Example 1: Moderate eccentricity
const M = Math.PI / 4; // 45 degrees in radians
const e = 0.1; // Orbital eccentricity
const result = solveKepler(M, e);
console.log(result); // Output: Eccentric anomaly in radians
```

```ts
// Example 2: High-eccentricity orbit (e > 0.9)
const M_high = 1.5; // Mean anomaly in radians
const e_high = 0.95; // High eccentricity
console.log(solveKepler(M_high, e_high)); // Uses high-eccentricity solver
```

---

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [Newton-Raphson Method (Wikipedia)](https://en.wikipedia.org/wiki/Newton%27s_method)
- [Eccentric Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly#Eccentric_anomaly)
- [RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
