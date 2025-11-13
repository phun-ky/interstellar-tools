[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / trueAnomalyToMeanAnomaly

# Function: trueAnomalyToMeanAnomaly()

```ts
function trueAnomalyToMeanAnomaly(V: number, e: number): number;
```

Defined in:
[true-anomaly-to-mean-anomaly.ts:75](https://github.com/phun-ky/interstellar-tools/blob/f613425043c94828d8fadf35a707105a661f469f/packages/equations/src/true-anomaly-to-mean-anomaly.ts#L75)

Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's
equation.

---

**Mathematical Explanation:**

In orbital mechanics, the **true anomaly** ($\nu$), the **eccentric anomaly**
($E$), and the **mean anomaly** ($M$) are related through Kepler's equation.

**Step 1: Convert True Anomaly ($\nu$) to Eccentric Anomaly ($E$)**

$$
E = 2 \tan^{-1} \left( \sqrt{\frac{1 - e}{1 + e}} \tan\left(\frac{\nu}{2}\right) \right)
$$

This transformation ensures that $E$ is computed correctly **across all
quadrants**, using `atan2(y, x)` instead of `atan(x)` to avoid ambiguity in
angle computation.

**Step 2: Convert Eccentric Anomaly ($E$) to Mean Anomaly ($M$)**

Kepler’s equation states:

$$
M = E - e \sin(E)
$$

Since anomalies are periodic over **one full orbit** ($0 \leq M < 2\pi$), we
apply `wrapAngle(M)` to ensure that the computed **mean anomaly remains within
this range**.

---

**Why Use `wrapAngle`?**

- Ensures that the mean anomaly **is always wrapped within** $[0, 2\pi]$.
- Corrects floating-point precision issues that may cause values slightly
  greater than $2\pi$.
- Prevents negative anomalies by shifting them into the valid range.

---

## Parameters

| Parameter | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `V`       | `number` | **True anomaly** ($\nu$) in radians.            |
| `e`       | `number` | **Eccentricity** of the orbit ($0 \leq e < 1$). |

## Returns

`number`

The **mean anomaly** ($M$) in radians, wrapped to the range $[0, 2\pi]$.

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the **eccentricity** ($e$) is outside the valid range $0 \leq e < 1$.

---

## Examples

```ts
import { trueAnomalyToMeanAnomaly } from './true-anomaly-to-mean-anomaly';

// Example 1: Standard elliptical orbit
const V = Math.PI / 3; // 60 degrees in radians
const e = 0.1; // Eccentricity
console.log(trueAnomalyToMeanAnomaly(V, e)); // Output: Mean anomaly in radians
```

```ts
// Example 2: Retrograde motion handling
const V_retrograde = -Math.PI / 2; // -90 degrees
const e_retrograde = 0.2;
console.log(trueAnomalyToMeanAnomaly(V_retrograde, e_retrograde));
```

---

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
- [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
- [Orbital Eccentricity (Wikipedia)](https://en.wikipedia.org/wiki/Orbital_eccentricity)
