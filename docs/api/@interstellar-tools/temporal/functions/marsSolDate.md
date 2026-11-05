[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ marsSolDate

# Function: marsSolDate()

```ts
function marsSolDate(date: Date): number;
```

Defined in:
[mars-time.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/mars-time.ts#L54)

The **Mars Sol Date** of a moment: a continuous count of sols, Mars's mean solar
days, like the Julian date for Earth.

$$
\mathrm{MSD} = \frac{\mathrm{JD_{TT}} - 2\,451\,549.5}{1.0274912517} + 44\,796.0 - 0.0009626
$$

Where:

- $\mathrm{JD_{TT}}$ is the Julian date in Terrestrial Time (days)
- $1.0274912517$ is the sol in Earth days,
  [MARS_SOL_DAYS](../../constants/variables/MARS_SOL_DAYS.md)

::: info Notes

- The count starts on 29 December 1873, at about noon in Greenwich.
- Each new sol begins at mean midnight at Airy-0, when
  [coordinatedMarsTime](coordinatedMarsTime.md) wraps to 0.
- From NASA GISS's Mars24 algorithm, refined from Allison & McEwen (2000).

:::

## Parameters

| Parameter | Type                                                                                      | Description                                           |
| --------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a UTC `Date` (on or after 1972-01-01). |

## Returns

`number`

The Mars Sol Date in **sols**.

## Throws

If `date` is not a valid `Date`.

## Throws

If `date` is before 1972-01-01, where TT isn't defined from the leap seconds.

## Example

```ts
marsSolDate(new Date('2000-01-06T00:00:00Z')); // ≈ 44 795.99976
```

## See

- [coordinatedMarsTime](coordinatedMarsTime.md)
- https://www.giss.nasa.gov/tools/mars24/help/algorithm.html Mars24 algorithm
