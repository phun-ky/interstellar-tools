[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ stateAt

# Function: stateAt()

```ts
function stateAt(
  ephemeris: EphemerisInterface,
  date: Date,
  options?: StateAtOptionsInterface
): StateVectorInterface;
```

Defined in:
[probes/interpolate.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/probes/interpolate.ts#L68)

The **state of a spacecraft at any moment** of an ephemeris: its position and
velocity, interpolated between the samples.

Fits the Hermite polynomial through the positions and velocities of the `points`
samples around the date, a polynomial of degree $2n - 1$ for $n$ samples, and
evaluates it and its derivative:

$$
\mathbf{r}(t) = \sum_{k=0}^{2n-1} c_k \prod_{j<k} (t - z_j), \qquad
\mathbf{v}(t) = \dot{\mathbf{r}}(t)
$$

Where:

- $z_0 = z_1 = t_0,\ z_2 = z_3 = t_1, \dots$ are the sample times, each twice
- $c_k$ are the divided differences of the positions, with the velocities as the
  first differences at each sample

**Units**

- Inputs: the ephemeris from [parseOem](parseOem.md) or
  [parseHorizonsVectors](parseHorizonsVectors.md), and a `Date`.
- Output: `r` in **m** and `v` in **m/s**, from the ephemeris's centre, on its
  frame's axes.

::: info Notes

- **Using the velocities** matches the slope as well as the position at each
  sample: the default 4 samples interpolate to degree 7, as the OEM standard's
  own example recommends, and follow a sharp perihelion that linear
  interpolation cuts across.
- At a sample's epoch, the sample is returned exactly.
- Only within the ephemeris: outside the first and last samples, it throws
  rather than extrapolate. Near either end, the samples are taken from the one
  side.
- The samples should be close enough to follow the motion: for a probe in
  cruise, a day apart; near a planet or the Sun, hours or minutes.

:::

## Parameters

| Parameter   | Type                                                                                      | Description                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `ephemeris` | [`EphemerisInterface`](../../types/interfaces/EphemerisInterface.md)                      | The ephemeris, from [parseOem](parseOem.md) or [parseHorizonsVectors](parseHorizonsVectors.md). |
| `date`      | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`, within the ephemeris.                                                  |
| `options?`  | [`StateAtOptionsInterface`](../interfaces/StateAtOptionsInterface.md)                     | `points`, the number of samples to interpolate through (an integer from 2 to 8, default 4).     |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in **m** and velocity `v` in **m/s**: see
[StateVectorInterface](../../types/interfaces/StateVectorInterface.md).

## Throws

If `date` is not a valid `Date`, the ephemeris has no samples, or `points` is
not an integer.

## Throws

If `date` is outside the ephemeris, or `points` is outside 2 to 8.

## Example

```ts
const voyager1 = parseHorizonsVectors(text);
const { r, v } = stateAt(voyager1, new Date('2026-01-05T06:00:00Z'));

Math.hypot(...r) / AU_METERS; // ≈ 169: au from the Sun
```

## See

- [parseOem](parseOem.md)
- [parseHorizonsVectors](parseHorizonsVectors.md)
