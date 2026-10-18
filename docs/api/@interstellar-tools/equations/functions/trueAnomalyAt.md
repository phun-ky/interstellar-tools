[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / trueAnomalyAt

# Function: trueAnomalyAt()

```ts
function trueAnomalyAt(
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  date: Date
): Radians;
```

Defined in:
[anomalies/anomaly-at.ts:86](https://github.com/phun-ky/interstellar-tools/blob/c937a42cf99d9a589645c5e215479f165095d9c2/packages/equations/src/categories/anomalies/anomaly-at.ts#L86)

The **true anomaly** ($\nu$) of an orbit at a given date: where the body is.

Takes the mean anomaly at `date` from [meanAnomalyAt](meanAnomalyAt.md), solves
Kepler's equation with [solveKepler](solveKepler.md), and converts the result
with [eccentricToTrueAnomaly](eccentricToTrueAnomaly.md).

## Parameters

| Parameter | Type                                                                                                                                                        | Description                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `orbit`   | [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[`OrbitInterface`](../../types/interfaces/OrbitInterface.md), `"e"` | `"angle"`                     | `"period"`> | An orbit whose `angle` is the true anomaly at J2000, for example `body.orbit` from a dataset. |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)                                                                   | The date to find the body at. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The true anomaly at `date`, in $[0, 2\pi)$.

## Throws

If `date` is not a valid `Date`.

## Throws

If the orbit's eccentricity is outside $0 \leq e < 1$.

## Example

```ts
import { PLANETS } from '@interstellar-tools/constants';
import { trueAnomalyAt } from '@interstellar-tools/equations';

const earth = PLANETS.find((planet) => planet.id === 'earth')!;

trueAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z')); // ≈ 4.901 rad (280.8°)
```
