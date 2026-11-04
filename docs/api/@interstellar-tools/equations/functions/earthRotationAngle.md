[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / earthRotationAngle

# Function: earthRotationAngle()

```ts
function earthRotationAngle(date: Date): Radians;
```

Defined in:
[cartography/earth-rotation.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/earth-rotation.ts#L67)

Compute the **Earth rotation angle** (ERA): how far Earth has turned about its
axis at a moment, measured from the Celestial Intermediate Origin. It's the IAU
2000 measure of Earth's rotation, linear in UT1.

$$
\theta_{\mathrm{ERA}} = 2\pi\,(0.7790572732640 + 1.00273781191135448\,D_U)
$$

Where:

- $D_U$ is the number of days of UT1 since J2000.0, 2000-01-01T12:00:00 UT1 (d)

**Units**

- Input: a `Date`.
- Output: $\theta_{\mathrm{ERA}}$ in **radians**, in \[0, 2π).

::: info Notes

- **UT1 is taken as UTC.** They differ by up to 0.9 s, which turns Earth by up
  to 13″: 400 m at the equator. The exact difference is published by the IERS,
  and the library fetches nothing.
- Earth turns once every 0.99727 days, a sidereal day, which is why the
  coefficient of $D_U$ is a little over 1.
- SGP4's TEME frame uses the older Greenwich mean sidereal time instead:
  [greenwichMeanSiderealTime](greenwichMeanSiderealTime.md).

:::

## Parameters

| Parameter | Type                                                                                      | Description              |
| --------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The Earth rotation angle $\theta_{\mathrm{ERA}}$ in **radians**, in \[0, 2π).

## Throws

If `date` is not a valid `Date`.

## Example

```ts
// At J2000.0, ERA is 280.46° (2π × 0.7790572732640)
earthRotationAngle(new Date('2000-01-01T12:00:00Z')); // ≈ 4.894961 rad
```

## See

- [greenwichMeanSiderealTime](greenwichMeanSiderealTime.md)
- https://iers-conventions.obspm.fr/content/tn36.pdf IERS Conventions (2010),
  section 5.5.3
