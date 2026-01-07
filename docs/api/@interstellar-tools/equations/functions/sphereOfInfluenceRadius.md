[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / sphereOfInfluenceRadius

# Function: sphereOfInfluenceRadius()

```ts
function sphereOfInfluenceRadius(a: number, m: number, M: number): number;
```

Defined in:
[orbits/sphere-of-influence-radius.ts:35](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/orbits/sphere-of-influence-radius.ts#L35)

Compute **sphere of influence** radius (patched conics approximation).

Equation:

$$
r_{\text{SOI}} \approx a \left(\frac{m}{M}\right)^{2/5}
$$

Where:

- `a` is the semi-major axis of the secondary body's orbit about the primary (m
  or km)
- `m` is the mass of the secondary body (e.g., planet) (kg)
- `M` is the mass of the primary body (e.g., Sun) (kg)

Units:

- Output `rSOI` has the same distance unit as `a` (since the mass ratio is
  dimensionless).

## Parameters

| Parameter | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| `a`       | `number` | Semi-major axis `a` of the secondary around the primary (finite, > 0). |
| `m`       | `number` | Mass of the secondary body `m` (finite, > 0).                          |
| `M`       | `number` | Mass of the primary body `M` (finite, > 0).                            |

## Returns

`number`

Sphere of influence radius `rSOI` in the same distance units as `a`.

## Throws

If any input is not finite.

## Throws

If `a <= 0`, `m <= 0`, or `M <= 0`.

## Example

```ts
// Example (Earth around Sun; km-based a):
const aKm = 149_597_870.7; // km
const mEarth = 5.972e24; // kg
const mSun = 1.9885e30; // kg

const rSoiKm = sphereOfInfluenceRadius(aKm, mEarth, mSun);
```
