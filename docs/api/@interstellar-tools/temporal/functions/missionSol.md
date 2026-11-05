[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ missionSol

# Function: missionSol()

```ts
function missionSol(
  date: Date,
  landingDate: Date,
  longitude: Radians,
  firstSol?: number
): number;
```

Defined in:
[mars-time.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/mars-time.ts#L189)

The **mission sol** at a landing site: the number of the sol a rover is on,
counted from its landing.

$$
\text{sol} = s_0 + \lfloor \mathrm{MSD} + \lambda / 2\pi \rfloor - \lfloor \mathrm{MSD_{landing}} + \lambda / 2\pi \rfloor
$$

Where:

- $s_0$ is the number of the landing sol
- $\lambda$ is the east longitude of the mission's clock (rad)

::: info Notes

- A new sol begins at local mean midnight at the site.
- **Sol 0 or sol 1?** Curiosity and Perseverance call their landing sol 0.
  Spirit and Opportunity called it sol 1.
- Before landing, the count goes below the landing sol.
- Spirit and Opportunity ran on a hybrid of true solar time, a few minutes off
  mean time: close to their midnights, their count can differ by one.

:::

## Parameters

| Parameter     | Type                                                                                      | Default value | Description                                                        |
| ------------- | ----------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------ |
| `date`        | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `undefined`   | The moment, as a UTC `Date` (on or after 1972-01-01).              |
| `landingDate` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `undefined`   | The moment of landing, as a UTC `Date` (on or after 1972-01-01).   |
| `longitude`   | [`Radians`](../../types/type-aliases/Radians.md)                                          | `undefined`   | The east longitude of the mission's clock in **radians** (finite). |
| `firstSol?`   | `number`                                                                                  | `0`           | The number of the landing sol: 0 or 1 (an integer). Defaults to 0. |

## Returns

`number`

The sol number, an integer.

## Throws

If a date is not a valid `Date`, `longitude` is not a finite number, or
`firstSol` is not an integer.

## Throws

If a date is before 1972-01-01.

## Example

```ts
const DEG = Math.PI / 180;

// Curiosity landed in Gale crater, its clock at 137.42° E
missionSol(
  new Date('2015-05-30T12:00:00Z'),
  new Date('2012-08-06T05:17:57Z'),
  (137.42 * DEG) as Radians
); // 1000
```

## See

- [marsLocalMeanSolarTime](marsLocalMeanSolarTime.md)
- https://www.giss.nasa.gov/tools/mars24/help/notes.html Mars24 technical notes,
  on mission sols
