[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ coordinatedMarsTime

# Function: coordinatedMarsTime()

```ts
function coordinatedMarsTime(date: Date): number;
```

Defined in:
[mars-time.ts:89](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/mars-time.ts#L89)

**Coordinated Mars Time** (MTC): the mean solar time at Mars's prime meridian,
Airy-0, in hours, like UTC is at Greenwich.

$$
\mathrm{MTC} = 24 \times (\mathrm{MSD} \bmod 1)
$$

::: info Notes

- A Mars hour is a 24th of a sol: 1 h 1 m 39 s of Earth time.
- It's mean time: the real Sun can be up to about 50 minutes ahead of or behind
  it, because of Mars's eccentric orbit and tilt, the equation of time.

:::

## Parameters

| Parameter | Type                                                                                      | Description                                           |
| --------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a UTC `Date` (on or after 1972-01-01). |

## Returns

`number`

The time at Airy-0 in **Mars hours**, from 0 up to 24.

## Throws

If `date` is not a valid `Date`.

## Throws

If `date` is before 1972-01-01.

## Example

```ts
// Mars24's first worked example: 23:59:39 at Airy-0
coordinatedMarsTime(new Date('2000-01-06T00:00:00Z')); // ≈ 23.99425 h
```

## See

- [marsSolDate](marsSolDate.md)
- [marsLocalMeanSolarTime](marsLocalMeanSolarTime.md)
