[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKeplerBisection

# Function: solveKeplerBisection()

```ts
function solveKeplerBisection(
  M: number,
  e: number,
  maxIter: number,
  tolerance: number
): number;
```

Defined in:
[kepler/solve-kepler-bisection.ts:75](https://github.com/phun-ky/interstellar-tools/blob/d29bdadfcfcf03c02ad5f61f28e4e281438ba3ee/packages/equations/src/categories/kepler/solve-kepler-bisection.ts#L75)

Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the
**bisection method** when Newton-Raphson or other iterative solvers fail to
converge.

---

**Mathematical Explanation:**

Kepler's equation for eccentric anomaly ($E$) is:

$$
M = E - e \sin(E)
$$

This equation cannot be solved analytically, and numerical methods must be used.
When standard iterative solvers like **Newton-Raphson** fail due to poor
convergence, the **bisection method** provides a robust alternative by
performing a bracketed search.

---

**Solving Strategy:**

1. **Initialize Bounds:**
   - The valid range for $E$ is **$[0, \pi]$** (as $E$ is symmetric around 0).
   - The midpoint $E_0$ is chosen as:
     $$
     E = \frac{E_{low} + E_{high}}{2}
     $$

2. **Bisection Iteration:**
   - Compute the function residual:
     $$
     F(E) = E - e \sin(E) - M
     $$
   - If $F(E)$ is sufficiently small (within tolerance), $E$ is returned as the
     solution.
   - Otherwise, the interval is **halved** by updating either:
     - The lower bound ($E_{low}$) if $F(E) < 0$
     - The upper bound ($E_{high}$) if $F(E) > 0$

3. **Convergence Check:**
   - The iteration stops when:
     $$
     |E_{n+1} - E_n| < \text{tolerance}
     $$
     (default tolerance is **1e-9**).

---

**Performance Considerations:**

- **Always converges**, unlike Newton-Raphson, which can fail for some initial
  guesses.
- **Time complexity:** $O(\log N)$ due to the **logarithmic convergence** of
  bisection.

---

## Parameters

| Parameter   | Type     | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `M`         | `number` | Mean anomaly ($M$) in **radians**.                |
| `e`         | `number` | Orbital eccentricity ($0 \leq e < 1$).            |
| `maxIter`   | `number` | Maximum number of **iterations** before failure.  |
| `tolerance` | `number` | Convergence criterion for stopping the iteration. |

## Returns

`number`

The **eccentric anomaly** ($E$) in **radians** (best approximation).

---

## Example

```ts
const M = Math.PI / 3; // 60 degrees in radians
const e = 0.5; // Orbital eccentricity
console.log(solveKeplerBisection(M, e, 50, 1e-9)); // Output: Eccentric anomaly in radians
```

---

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [Bisection Method (Wikipedia)](https://en.wikipedia.org/wiki/Bisection_method)
