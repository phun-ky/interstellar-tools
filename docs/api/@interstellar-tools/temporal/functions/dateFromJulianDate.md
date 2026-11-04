[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ dateFromJulianDate

# Function: dateFromJulianDate()

```ts
function dateFromJulianDate(jd: number, scale?: TimeScaleType): Date;
```

Defined in:
[time-scales.ts:204](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/time-scales.ts#L204)

The **UTC `Date`** of a Julian date in a time scale: the inverse of
[julianDate](julianDate.md).

::: info Notes

- The result is rounded to the millisecond, the precision of a `Date`.
- A TAI or TT Julian date that falls inside a leap second, 23:59:60 UTC, has no
  `Date`: it becomes 00:00:00 of the next day.

:::

## Parameters

| Parameter | Type                                                         | Default value | Description                                                  |
| --------- | ------------------------------------------------------------ | ------------- | ------------------------------------------------------------ |
| `jd`      | `number`                                                     | `undefined`   | The Julian date in **days** (finite).                        |
| `scale?`  | [`TimeScaleType`](../../types/type-aliases/TimeScaleType.md) | `'UTC'`       | The time scale the Julian date counts in. Defaults to `UTC`. |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

The moment as a `Date`.

## Throws

If `jd` is not a finite number.

## Throws

If `scale` is not a [TimeScaleType](../../types/type-aliases/TimeScaleType.md),
the moment is before 1972-01-01 for TAI and TT, or it's outside the range of a
`Date`.

## Example

```ts
dateFromJulianDate(2451545, 'TT').toISOString(); // '2000-01-01T11:58:55.816Z'
```
