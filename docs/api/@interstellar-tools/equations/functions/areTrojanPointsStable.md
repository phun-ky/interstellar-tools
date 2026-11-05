[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / areTrojanPointsStable

# Function: areTrojanPointsStable()

```ts
function areTrojanPointsStable(m1: number, m2: number): boolean;
```

Defined in:
[three-body/lagrange-points.ts:188](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/three-body/lagrange-points.ts#L188)

Whether the **Trojan points** L4 and L5 of two bodies are stable: whether a
small body there, nudged, circles the point rather than drifting off. It's why
Jupiter has thousands of Trojan asteroids.

$$
\mu < \mu_R = \frac{1}{2}\left(1 - \sqrt{\frac{23}{27}}\right) \approx 0.03852
$$

Where:

- $\mu = m_2 / (m_1 + m_2)$ is the mass ratio, from
  [cr3bpMassRatio](cr3bpMassRatio.md)
- $\mu_R$ is Routh's critical mass ratio

**Units**

- Inputs: `m1` and `m2` in the same unit, kg or gravitational parameters in
  m³/s².
- Output: `true` if L4 and L5 are stable.

::: info Notes

- Every planet with the Sun, and the Moon with Earth ($\mu \approx 0.012$), is
  below the limit: the larger body must outweigh the smaller about 25 times.
  Pluto and Charon ($\mu \approx 0.11$) are above it.
- L1, L2 and L3 are unstable for every mass ratio.
- Linear stability in the circular problem: the Sun's pull makes Earth-Moon L4
  and L5 hold dust clouds at most, not a body.

:::

## Parameters

| Parameter | Type     | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `m1`      | `number` | Mass (or gravitational parameter) of the larger body (finite, > 0).           |
| `m2`      | `number` | Mass (or gravitational parameter) of the smaller body (finite, > 0, <= `m1`). |

## Returns

`boolean`

`true` if L4 and L5 are linearly stable.

## Throws

If any input is not a finite number.

## Throws

If `m1 <= 0`, `m2 <= 0` or `m2 > m1`.

## Example

```ts
areTrojanPointsStable(1.32712440041e20, 1.26686534e17); // true: Sun and Jupiter
areTrojanPointsStable(8.69e11, 1.06e11); // false: Pluto and Charon
```

## See

[lagrangePoints](lagrangePoints.md)
