[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKepler

# Function: solveKepler()

```ts
function solveKepler(
  M: number,
  e: number,
  maxIter?: number,
  tolerance?: number
): number;
```

Defined in:
[solve-kepler.ts:87](https://github.com/phun-ky/interstellar-tools/blob/1a287c92090172f88a61ae54fc794fe57d83ca58/packages/equations/src/solve-kepler.ts#L87)

Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an
adaptive approach:

- **Newton-Raphson method** for fast convergence.
- **Bisection fallback** if Newton’s method fails.
- **High-eccentricity solver** for extreme orbits ($e > 0.9$).

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
   - **If Newton-Raphson fails**, falls back to `solveKeplerBisection()`.

3. **Final Wrapping:**
   - Ensures the solution is correctly wrapped using `wrapAngle()`.

---

**Performance Considerations:**

- **Newton-Raphson typically converges in 4-5 iterations.**
- **Bisection fallback ensures robustness for extreme cases.**
- **High-eccentricity solver prevents instability for $e \approx 1$.**

---

## Parameters

| Parameter    | Type     | Default value | Description                                       |
| ------------ | -------- | ------------- | ------------------------------------------------- |
| `M`          | `number` | `undefined`   | Mean anomaly ($M$) in **radians**.                |
| `e`          | `number` | `undefined`   | Orbital eccentricity ($0 \leq e < 1$).            |
| `maxIter?`   | `number` | `50`          | Maximum number of **iterations** before fallback. |
| `tolerance?` | `number` | `1e-9`        | Convergence criterion for stopping the iteration. |

## Returns

`number`

The **eccentric anomaly** ($E$) in **radians** (wrapped to $[0, 2\pi]$).

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the **eccentricity ($e$) is invalid** ($e < 0$ or $e \geq 1$).

---

## Examples

```ts
import { solveKepler } from './solve-kepler';

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
