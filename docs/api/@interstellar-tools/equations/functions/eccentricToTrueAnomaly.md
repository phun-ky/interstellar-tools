[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / eccentricToTrueAnomaly

# Function: eccentricToTrueAnomaly()

```ts
function eccentricToTrueAnomaly(E: Radians, e: number): Radians;
```

Defined in:
[anomalies/eccentric-to-true-anomaly.ts:43](https://github.com/phun-ky/interstellar-tools/blob/1d94921ca8ba590fe5cb7f1f00da780f689f64aa/packages/equations/src/categories/anomalies/eccentric-to-true-anomaly.ts#L43)

Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.

**Mathematical Explanation:**

The **eccentric anomaly** ($E$) and the **true anomaly** ($V$) are related
through:

$$
\tan \frac{V}{2} = \sqrt{\frac{1+e}{1-e}} \tan \frac{E}{2}
$$

where:

- $E$ is the **eccentric anomaly** (in radians).
- $V$ is the **true anomaly** (in radians).
- $e$ is the **orbital eccentricity** ($0 \leq e < 1$ for elliptical orbits).

This function handles:

- **Circular orbits** ($e = 0$): True anomaly is equal to eccentric anomaly.
- **Parabolic orbits** ($e = 1$): Uses the special case:
  $$
  V = 2 \tan^{-1} \left(\frac{E}{2}\right)
  $$
- **Elliptical orbits** ($0 < e < 1$): Uses the standard conversion equation.

Additionally, numerical stability is ensured when $E \approx \pi$.

## Parameters

| Parameter | Type                                             | Description                            |
| --------- | ------------------------------------------------ | -------------------------------------- |
| `E`       | [`Radians`](../../types/type-aliases/Radians.md) | Eccentric anomaly ($E$) in radians.    |
| `e`       | `number`                                         | Orbital eccentricity ($0 \leq e < 1$). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

True anomaly ($V$) in radians.

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If **eccentricity** is out of the range $0 \leq e \leq 1$.

## Example

```ts
console.log(eccentricToTrueAnomaly(1.0, 0.5)); // Output: True anomaly in radians
console.log(eccentricToTrueAnomaly(Math.PI, 0)); // Output: Math.PI (circular orbit)
console.log(eccentricToTrueAnomaly(0, 1)); // Output: 0 (parabolic orbit)
```

## See

[True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
