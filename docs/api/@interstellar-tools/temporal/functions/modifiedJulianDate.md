[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ modifiedJulianDate

# Function: modifiedJulianDate()

```ts
function modifiedJulianDate(date: Date, scale?: TimeScaleType): number;
```

Defined in:
[time-scales.ts:165](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/time-scales.ts#L165)

The **modified Julian date** of a moment, in a time scale: the Julian date minus
2 400 000.5, so days start at midnight and MJD 0 is 1858-11-17.

$$
\mathrm{MJD} = \mathrm{JD} - 2\,400\,000.5
$$

## Parameters

| Parameter | Type                                                                                      | Default value | Description                                                          |
| --------- | ----------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------- |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `undefined`   | The moment, as a UTC `Date` (on or after 1972-01-01 for TAI and TT). |
| `scale?`  | [`TimeScaleType`](../../types/type-aliases/TimeScaleType.md)                              | `'UTC'`       | The time scale to count in. Defaults to `UTC`.                       |

## Returns

`number`

The modified Julian date in **days**.

## Throws

If `date` is not a valid `Date`.

## Throws

If `scale` is not a [TimeScaleType](../../types/type-aliases/TimeScaleType.md),
or `date` is before 1972-01-01 for TAI and TT.

## See

[julianDate](julianDate.md)

## Example

```ts
modifiedJulianDate(new Date('2000-01-01T00:00:00Z')); // 51544
```
