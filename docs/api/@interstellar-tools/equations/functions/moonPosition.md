[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / moonPosition

# Function: moonPosition()

```ts
function moonPosition(date: Date): MoonPositionInterface;
```

Defined in:
[cartography/moon-position.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/moon-position.ts#L65)

Compute the **Moon's position** seen from Earth's centre at a moment: right
ascension, declination and distance, from the short series of Montenbruck and
Gill, the largest terms of the lunar theory.

$$
\begin{aligned}
\lambda &= L_0 + 22\,640'' \sin l + 769'' \sin 2l - 4\,586'' \sin(l - 2D) + 2\,370'' \sin 2D - 668'' \sin l' - \ldots \\
\beta &= 18\,520'' \sin\big(F + \lambda - L_0 + 412'' \sin 2F + 541'' \sin l'\big) - 526'' \sin(F - 2D) + \ldots \\
r &= 385\,000 - 20\,905 \cos l - 3\,699 \cos(2D - l) - 2\,956 \cos 2D - \ldots\ \text{km}
\end{aligned}
$$

with 14 terms in longitude, 8 in latitude and 9 in distance, then turned from
the ecliptic to the equator by the obliquity $\varepsilon$.

Where:

- $L_0$ is the Moon's mean longitude, $l$ its mean anomaly, $F$ its mean
  argument of latitude and $D$ its mean elongation from the Sun
- $l'$ is the Sun's mean anomaly
- $\lambda, \beta$ are the Moon's ecliptic longitude and latitude, and $r$ its
  distance

**Units**

- Input: a `Date`.
- Output: `rightAscension` and `declination` in **radians**, `distance` in
  **m**, and `r` in **m**: see
  [MoonPositionInterface](../../types/interfaces/MoonPositionInterface.md).

::: info Notes

- **Good to several arcminutes, and a few hundred kilometres in distance**, in
  the decades around 2000: for the Moon's pull on a satellite, where that's an
  error of a fraction of a percent, or to find the Moon in the sky. Not for
  eclipses or occultations.
- The position is geocentric. From Earth's surface the Moon appears up to a
  degree lower, its parallax, which matters for observing it.
- The axes are the mean equator and equinox of the date, like
  [sunPosition](sunPosition.md): close enough to SGP4's TEME frame.

:::

## Parameters

| Parameter | Type                                                                                      | Description              |
| --------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`. |

## Returns

[`MoonPositionInterface`](../../types/interfaces/MoonPositionInterface.md)

The right ascension, declination, distance and position: see
[MoonPositionInterface](../../types/interfaces/MoonPositionInterface.md).

## Throws

If `date` is not a valid `Date`.

## Example

```ts
const moon = moonPosition(new Date('2026-11-24T12:00:00Z'));

moon.distance / 1000; // ≈ 361 300 km; JPL Horizons gives 361 050 km
```

## See

- [sunPosition](sunPosition.md)
- [thirdBodyAcceleration](thirdBodyAcceleration.md)
- Montenbruck & Gill, _Satellite Orbits_ (2000), section 3.3.2
