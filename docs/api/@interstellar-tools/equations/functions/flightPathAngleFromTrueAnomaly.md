[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / flightPathAngleFromTrueAnomaly

# Function: flightPathAngleFromTrueAnomaly()

```ts
function flightPathAngleFromTrueAnomaly(nu: Radians, e: number): Radians;
```

Defined in:
[orbits/flight-path-angle-from-true-anomaly.ts:30](https://github.com/phun-ky/interstellar-tools/blob/73b7706b7604f8f7bea1ab1f3bacb7598cdd6254/packages/equations/src/categories/orbits/flight-path-angle-from-true-anomaly.ts#L30)

**Flight-path angle** ($\gamma$) from **true anomaly** ($\nu$) and eccentricity
($e$).

**Definition**

$$
\tan\gamma=\frac{e\sin\nu}{1+e\cos\nu}
$$

::: info Domain notes

- **Elliptic / circular** ($0\le e<1$): since $1+e\cos\nu \ge 1-e > 0$ for all
  $\nu$, we have $\gamma\in(-\tfrac{\pi}{2},\tfrac{\pi}{2})$.
- **Parabolic** ($e=1$): at $\nu=\pi$ the ratio is $0/0$; by continuity
  $\gamma\to 0$ (this function returns $0$ in that limit).
- **Hyperbolic** ($ e>1$ ): only $\nu$ with $1+e\cos\nu>0$ are physical; when
  $1+e\cos\nu=0$ the angle tends to $\pm\tfrac{\pi}{2}$.

:::

**Conventions**

- Returns ($\gamma$) in **radians** (positive outbound $0<\nu<\pi$, negative
  inbound).
- Uses `atan2(e sin ν, 1 + e cos ν)` for correct quadrant handling and robust
  behavior near asymptotes.

## Parameters

| Parameter | Type                                             | Description                                                    |
| --------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `nu`      | [`Radians`](../../types/type-aliases/Radians.md) | True anomaly ($\nu$) in **radians**; must be finite.           |
| `e`       | `number`                                         | Eccentricity ($e$), dimensionless, must be finite and **≥ 0**. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Flight-path angle ($\gamma$) in **radians**.

## Throws

If inputs are non-finite or ($e<0$). Note: at the parabolic limit
($e=1,\ \nu=\pi$) this function returns $0$; at hyperbolic asymptotes
($1+e\cos\nu=0$) it tends to $\pm\pi/2$.
