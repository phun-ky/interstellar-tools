[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / meanAnomalyAt

# Function: meanAnomalyAt()

```ts
function meanAnomalyAt(
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  date: Date
): Radians;
```

Defined in:
[anomalies/anomaly-at.ts:53](https://github.com/phun-ky/interstellar-tools/blob/404e170095de0a5bb1c3b66d63adb9df680b908e/packages/equations/src/categories/anomalies/anomaly-at.ts#L53)

The **mean anomaly** ($M$) of an orbit at a given date.

Every `orbit.angle` in the datasets is the true anomaly at **J2000** (2000-01-01
12:00 TT), so this advances the orbit from J2000 to `date` with
[advanceMeanAnomaly](advanceMeanAnomaly.md). Dates before J2000 work too.

$M = M_0 + \frac{2\pi}{|P|} \, (t - t_{J2000})$

The time is measured in UTC, as JavaScript dates are, against
[J2000_UTC](../../constants/variables/J2000_UTC.md). Leap seconds since 2000 are
ignored, which moves a body by a few seconds of its orbit at most.

## Parameters

| Parameter | Type                                                                                                                                                        | Description                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `orbit`   | [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[`OrbitInterface`](../../types/interfaces/OrbitInterface.md), `"e"` | `"angle"`                     | `"period"`> | An orbit whose `angle` is the true anomaly at J2000, for example `body.orbit` from a dataset. |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)                                                                   | The date to find the body at. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The mean anomaly at `date`, in $[0, 2\pi)$.

## Throws

If `date` is not a valid `Date`.

## Throws

If the orbit's eccentricity is outside $0 \leq e < 1$.

## Example

```ts
import { PLANETS } from '@interstellar-tools/constants';
import { meanAnomalyAt } from '@interstellar-tools/equations';

const earth = PLANETS.find((planet) => planet.id === 'earth')!;

meanAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z')); // ≈ 4.934 rad (282.7°)
```

## See

[trueAnomalyAt](trueAnomalyAt.md) for where the body actually is.
