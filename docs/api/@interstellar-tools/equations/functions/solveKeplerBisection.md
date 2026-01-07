[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKeplerBisection

# Function: solveKeplerBisection()

```ts
function solveKeplerBisection(
  M: Radians,
  e: number,
  maxIter: number,
  tolerance: number
): Radians;
```

Defined in:
[kepler/solve-kepler-bisection.ts:35](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/kepler/solve-kepler-bisection.ts#L35)

Solve **Kepler's equation** for the **eccentric anomaly** ($E$) via
**bisection** (elliptic case: ($0 \le e < 1$)).

**Equation**

$$
M = E - e\sin E,\qquad F(E)=E-e\sin E - M
$$

**Bracketing & normalization**

- Normalize ($M$) to ($[0,2\pi)$).
- Use the bracket ($[0,2\pi]$). Then ($F(0)=-M\le 0$) and
  ($F(2\pi)=2\pi-M\ge 0$).
- For ($0\le e<1$), ($F'(E)=1-e\cos E \ge 1-e > 0$) ⇒ **strictly increasing** ⇒
  unique root.

**Stopping criteria (either)**

- **Residual**: ($|F(E)| < \text{tolerance}$)
- **Bracket width**:
  ($\tfrac{1}{2}(E_{\text{high}}-E_{\text{low}}) < \text{tolerance}$)

## Parameters

| Parameter   | Type                                             | Description                                                                       |
| ----------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `M`         | [`Radians`](../../types/type-aliases/Radians.md) | Mean anomaly (radians). Can be any real; will be normalized to ($[0,2\pi)$).      |
| `e`         | `number`                                         | Eccentricity, must satisfy ($0 \le e < 1$) (elliptic).                            |
| `maxIter`   | `number`                                         | Maximum iterations (must be > 0).                                                 |
| `tolerance` | `number`                                         | Convergence tolerance for both residual and half-interval (must be > 0, radians). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Eccentric anomaly ($E$) in **radians**, normalized to ($[0,2\pi)$).

## Throws

If inputs are non-finite or out of domain.

## Example

```ts
const E = solveKeplerBisection((Math.PI / 3) as Radians, 0.5, 100, 1e-12);
```
