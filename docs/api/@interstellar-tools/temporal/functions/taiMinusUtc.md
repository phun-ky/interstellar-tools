[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ taiMinusUtc

# Function: taiMinusUtc()

```ts
function taiMinusUtc(date: Date): number;
```

Defined in:
[time-scales.ts:89](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/time-scales.ts#L89)

**TAI − UTC**, in **s**, at a moment: the number of leap seconds so far, plus
the 10 s UTC started with in 1972.

$$
\mathrm{TAI} = \mathrm{UTC} + \Delta_{\mathrm{AT}},
\qquad
\mathrm{TT} = \mathrm{TAI} + 32.184\ \mathrm{s}
$$

Where:

- $\Delta_{\mathrm{AT}}$ is TAI − UTC, from the leap second table `LEAP_SECONDS`
  (s)

::: info Notes

- The table in `@interstellar-tools/constants` holds the leap seconds the IERS
  has announced. A moment after a leap second that isn't in it yet gets an
  offset 1 s short: keep the package up to date.
- A JavaScript `Date` can't hold 23:59:60, the leap second itself: it goes from
  23:59:59.999 to 00:00:00 of the next day, where the new offset starts.

:::

## Parameters

| Parameter | Type                                                                                      | Description                                           |
| --------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a UTC `Date` (on or after 1972-01-01). |

## Returns

`number`

TAI − UTC in **s**: a whole number, 37 since 2017.

## Throws

If `date` is not a valid `Date`.

## Throws

If `date` is before 1972-01-01.

## Example

```ts
taiMinusUtc(new Date('2016-12-31T23:59:59Z')); // 36
taiMinusUtc(new Date('2017-01-01T00:00:00Z')); // 37
```
