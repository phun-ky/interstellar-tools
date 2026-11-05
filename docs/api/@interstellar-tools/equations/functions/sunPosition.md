[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / sunPosition

# Function: sunPosition()

```ts
function sunPosition(date: Date): SunPositionInterface;
```

Defined in:
[cartography/sun-position.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/sun-position.ts#L74)

Compute the **Sun's position** seen from Earth's centre at a moment: right
ascension, declination and distance, with the low-precision formulas of the
Astronomical Almanac.

$$
\begin{aligned}
L &= 280.460^\circ + 0.9856474^\circ\,n \\
g &= 357.528^\circ + 0.9856003^\circ\,n \\
\lambda &= L + 1.915^\circ \sin g + 0.020^\circ \sin 2g \\
\varepsilon &= 23.439^\circ - 0.0000004^\circ\,n \\
R &= 1.00014 - 0.01671 \cos g - 0.00014 \cos 2g\ \text{au}
\end{aligned}
$$

and then

$$
\alpha = \operatorname{atan2}(\cos\varepsilon \sin\lambda, \cos\lambda), \qquad
\delta = \arcsin(\sin\varepsilon \sin\lambda)
$$

Where:

- $n$ is the number of days since J2000.0, 2000-01-01T12:00:00 (d)
- $L$ is the Sun's mean longitude, corrected for aberration
- $g$ is the Sun's mean anomaly
- $\lambda$ is the Sun's ecliptic longitude; its ecliptic latitude is 0
- $\varepsilon$ is the obliquity of the ecliptic
- $R$ is the distance from Earth to the Sun

**Units**

- Input: a `Date`.
- Output: `rightAscension` and `declination` in **radians**, `distance` in
  **m**, and `r` in **m**: see
  [SunPositionInterface](../../types/interfaces/SunPositionInterface.md).

::: info Notes

- **Good to about 0.01° between 1950 and 2050**, and slowly worse outside it:
  enough to light a hillside or to tell whether a satellite is in Earth's
  shadow, not enough to point a solar telescope.
- The position is geocentric. From Earth's surface the Sun appears up to 8.8″
  lower, its parallax, which is well below the formula's accuracy.
- The axes are the mean equator and equinox of the date, close enough to SGP4's
  TEME frame to compare with a satellite's position.

:::

## Parameters

| Parameter | Type                                                                                      | Description              |
| --------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`. |

## Returns

[`SunPositionInterface`](../../types/interfaces/SunPositionInterface.md)

The right ascension, declination, distance and position: see
[SunPositionInterface](../../types/interfaces/SunPositionInterface.md).

## Throws

If `date` is not a valid `Date`.

## Example

```ts
// The June solstice of 2026: the Sun at its farthest north
const { declination, distance } = sunPosition(new Date('2026-06-21T08:24:00Z'));

declination; // ≈ 0.4091 rad, 23.44°
distance; // ≈ 1.5203e11 m, 1.0163 au
```

## See

- [greenwichMeanSiderealTime](greenwichMeanSiderealTime.md)
- https://aa.usno.navy.mil/faq/sun_approx The Astronomical Almanac's approximate
  solar coordinates
