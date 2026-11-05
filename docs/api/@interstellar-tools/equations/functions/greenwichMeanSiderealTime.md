[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / greenwichMeanSiderealTime

# Function: greenwichMeanSiderealTime()

```ts
function greenwichMeanSiderealTime(date: Date): Radians;
```

Defined in:
[cartography/earth-rotation.ts:116](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/earth-rotation.ts#L116)

Compute **Greenwich mean sidereal time** (GMST) with the IAU 1982 model: the
angle from the mean equinox of date to the Greenwich meridian, as the 1982
standard defines it.

$$
\theta_{\mathrm{GMST}} = 24\,110.54841 + 8\,640\,184.812866\,T + 0.093104\,T^2 - 6.2\times10^{-6}\,T^3\ \text{s} + \mathrm{UT1}
$$

Where:

- $T$ is the number of Julian centuries of UT1 since J2000.0
- $\mathrm{UT1}$ is the time of day in UT1 (s); a day of time is 2π

**Units**

- Input: a `Date`.
- Output: $\theta_{\mathrm{GMST}}$ in **radians**, in \[0, 2π).

::: info Notes

- **This is the angle SGP4's TEME frame uses.** To rotate an SGP4 position into
  Earth-fixed coordinates, turn it by GMST about the z axis (Vallado et al.
  2006). Newer IAU 2000 work uses [earthRotationAngle](earthRotationAngle.md)
  instead.
- **UT1 is taken as UTC**, as in [earthRotationAngle](earthRotationAngle.md).

:::

## Parameters

| Parameter | Type                                                                                      | Description              |
| --------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Greenwich mean sidereal time $\theta_{\mathrm{GMST}}$ in **radians**, in \[0,
2π).

## Throws

If `date` is not a valid `Date`.

## Example

```ts
// Vallado, Example 3-5: 1992-08-20 12:14 UT1
greenwichMeanSiderealTime(new Date('1992-08-20T12:14:00Z')); // ≈ 2.663 rad, 152.58°
```

## See

- [earthRotationAngle](earthRotationAngle.md)
- [localSiderealTime](localSiderealTime.md)
- https://celestrak.org/publications/AIAA/2006-6753/ Vallado et al. (2006),
  Revisiting Spacetrack Report
  [#3](https://github.com/phun-ky/interstellar-tools/issues/3)
