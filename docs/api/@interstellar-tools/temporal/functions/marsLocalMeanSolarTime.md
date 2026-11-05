[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ marsLocalMeanSolarTime

# Function: marsLocalMeanSolarTime()

```ts
function marsLocalMeanSolarTime(date: Date, longitude: Radians): number;
```

Defined in:
[mars-time.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/mars-time.ts#L133)

The **local mean solar time on Mars** at a longitude, in hours: Coordinated Mars
Time plus the east longitude in hours, 15° to the hour.

$$
\mathrm{LMST} = \left( \mathrm{MTC} + \lambda \, \frac{24\ \mathrm{h}}{2\pi} \right) \bmod 24\ \mathrm{h}
$$

Where:

- $\lambda$ is the planetocentric east longitude (rad)

::: info Notes

- **East longitude**, as the IAU gives it for Mars. Mars24 counts west
  longitude, so 184.702° W there is 175.298° E here.
- It's mean time, by a Sun that moves evenly. The real Sun can be up to about 50
  minutes ahead of or behind it.

:::

## Parameters

| Parameter   | Type                                                                                      | Description                                           |
| ----------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `date`      | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a UTC `Date` (on or after 1972-01-01). |
| `longitude` | [`Radians`](../../types/type-aliases/Radians.md)                                          | The east longitude in **radians** (finite; any turn). |

## Returns

`number`

The local mean solar time in **Mars hours**, from 0 up to 24.

## Throws

If `date` is not a valid `Date`, or `longitude` is not a finite number.

## Throws

If `date` is before 1972-01-01.

## Example

```ts
const DEG = Math.PI / 180;

// Spirit's site, at local midnight on Earth's clock: 00:51 mean time
marsLocalMeanSolarTime(
  new Date('2004-01-03T13:46:31Z'),
  (175.298 * DEG) as Radians
); // ≈ 0.8519 h
```

## See

- [coordinatedMarsTime](coordinatedMarsTime.md)
- [missionSol](missionSol.md)
