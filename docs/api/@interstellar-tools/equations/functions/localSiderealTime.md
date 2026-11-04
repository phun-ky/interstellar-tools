[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / localSiderealTime

# Function: localSiderealTime()

```ts
function localSiderealTime(date: Date, longitude: Radians): Radians;
```

Defined in:
[cartography/earth-rotation.ts:165](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/earth-rotation.ts#L165)

Compute **local mean sidereal time**: Greenwich mean sidereal time turned by a
longitude, the angle from the mean equinox to the local meridian.

$$
\theta_{\mathrm{LST}} = \theta_{\mathrm{GMST}} + \lambda
$$

Where:

- $\theta_{\mathrm{GMST}}$ is
  [greenwichMeanSiderealTime](greenwichMeanSiderealTime.md) (rad)
- $\lambda$ is the longitude, east positive (rad)

**Units**

- Inputs: a `Date`, and the longitude in **radians**.
- Output: $\theta_{\mathrm{LST}}$ in **radians**, in \[0, 2π).

::: info Notes

- A star is on the local meridian when its right ascension equals the local
  sidereal time.

:::

## Parameters

| Parameter   | Type                                                                                      | Description                                                 |
| ----------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `date`      | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`.                                    |
| `longitude` | [`Radians`](../../types/type-aliases/Radians.md)                                          | Longitude $\lambda$ in **radians**, east positive (finite). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Local mean sidereal time $\theta_{\mathrm{LST}}$ in **radians**, in \[0, 2π).

## Throws

If `date` is not a valid `Date`, or `longitude` is not a finite number.

## Example

```ts
// Vallado, Example 3-5: 104° W, 1992-08-20 12:14 UT1
localSiderealTime(new Date('1992-08-20T12:14:00Z'), toRad(-104)); // ≈ 0.848 rad, 48.58°
```

## See

[greenwichMeanSiderealTime](greenwichMeanSiderealTime.md)
