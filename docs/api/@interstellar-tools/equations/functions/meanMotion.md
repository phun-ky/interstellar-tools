[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / meanMotion

# Function: meanMotion()

```ts
function meanMotion(mu: number, a: number): number;
```

Defined in:
[orbits/mean-motion.ts:36](https://github.com/phun-ky/interstellar-tools/blob/079e297432574505029c4778a38f2852dffc7694/packages/equations/src/categories/orbits/mean-motion.ts#L36)

Compute **mean motion** for a (near-)circular reference orbit.

Mean motion is the angular rate of the reference orbit:

$$
n=\sqrt{\frac{\mu}{a^3}}
$$

Where:

- $\mu$ is the standard gravitational parameter of the central body
- $a$ is the (circular) orbit radius / semi-major axis

**Unit consistency**

- If $\mu$ is in **m³/s²**, then $a$ must be in **m** and the result is in
  **rad/s**.
- If $\mu$ is in **km³/s²**, then $a$ must be in **km** and the result is in
  **rad/s**.

Common usage: reference rate for relative motion models (e.g.,
Clohessy–Wiltshire / Hill), orbital period estimates, and circular-orbit
dynamics.

## Parameters

| Parameter | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `mu`      | `number` | Standard gravitational parameter $\mu$ (finite, > 0). |
| `a`       | `number` | Semi-major axis $a$ (finite, > 0).                    |

## Returns

`number`

Mean motion $n$ in **rad/s**.

## Throws

If `mu` or `a` is not a finite number.

## Throws

If `mu <= 0` or `a <= 0`.

## Example

```ts
// Earth example (km-based):
const mu = 398600.4418; // km³/s²
const a = 7000; // km
const n = meanMotion(mu, a); // rad/s
```
