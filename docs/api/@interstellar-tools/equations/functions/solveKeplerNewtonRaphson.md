[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKeplerNewtonRaphson

# Function: solveKeplerNewtonRaphson()

```ts
function solveKeplerNewtonRaphson(
  M: number,
  e: number,
  maxIter: number,
  tolerance: number
): number;
```

Defined in:
[solve-kepler-newton-raphson.ts:87](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/equations/src/solve-kepler-newton-raphson.ts#L87)

Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the
**Newton-Raphson method** with Householder acceleration for fast convergence.

---

**Mathematical Explanation:**

Kepler's equation relates the **mean anomaly** ($M$), the **eccentric anomaly**
($E$), and the **orbital eccentricity** ($e$) as:

$$
M = E - e \sin(E)
$$

Since this equation **cannot be solved algebraically**, iterative numerical
methods are required.

---

**Solving Strategy:**

1. **Handle Special Cases:**
   - If the orbit is **circular** ($e = 0$), then $E = M$ directly.
   - If the orbit is **nearly parabolic** ($e \geq 0.97$), a special
     approximation is used.
   - If **eccentricity is out of range** ($e < 0$ or $e \geq 1$), a `RangeError`
     is thrown.

2. **Initial Approximation:**
   - **For small eccentricities ($e < 0.8$):** $E_0 = M$.
   - **For moderate eccentricities ($0.8 \leq e < 0.97$):**
     $E_0 = M + e \sin(M) (1 + e \cos(M))$.
   - **For nearly parabolic orbits ($e \geq 0.97$):** $E_0 = \frac{6M}{e}$.

3. **Newton-Raphson Iteration with Householder Acceleration:**
   - The **Newton-Raphson method** iterates using:

     $$
     E_{n+1} = E_n - \frac{f(E_n)}{f'(E_n)}
     $$

     where:
     - $f(E) = E - e \sin(E) - M$
     - $f'(E) = 1 - e \cos(E)$

   - **Householder acceleration** refines the correction:
     $$
     \Delta E = \frac{f(E)}{f'(E)} \left( 1 - \frac{1}{2} \frac{f''(E)}{f'(E)} \Delta E \right)^{-1}
     $$

4. **Convergence Check:**
   - The iteration stops when:
     $$
     |E_{n+1} - E_n| < \text{tolerance}
     $$
     (default tolerance is **1e-9**).

5. **Failure Handling:**
   - If the method **does not converge**, `NaN` is returned, signaling that a
     fallback method should be used.

---

**Performance Considerations:**

- **Typically converges in 4-5 iterations for most eccentricities.**
- **Time complexity:** $O(1)$ for Newton-Raphson.

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

The **eccentric anomaly** ($E$) in **radians** (or `NaN` if the method fails).

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the **eccentricity ($e$) is invalid** ($e < 0$ or $e \geq 1$).

---

## Example

```ts
const M = Math.PI / 4; // 45 degrees in radians
const e = 0.1; // Orbital eccentricity
console.log(solveKeplerNewtonRaphson(M, e, 50, 1e-9)); // Output: Eccentric anomaly in radians
```

---

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [Newton-Raphson Method (Wikipedia)](https://en.wikipedia.org/wiki/Newton%27s_method)
- [Eccentric Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly#Eccentric_anomaly)
