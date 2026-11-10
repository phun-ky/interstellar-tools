[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / stateAt

# Function: stateAt()

```ts
function stateAt(
  orbit: OrbitInterface,
  date: Date,
  options?: StateAtOptionsInterface
): StateVectorInterface;
```

Defined in:
[orbits/state-at.ts:84](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/state-at.ts#L84)

The **position and velocity** of a body on its orbit at a given date, in 3D,
from a dataset orbit: its `a`, `e`, `period`, its true anomaly `angle` at J2000,
and its orientation `i`, `om` and `w` in its `frame`.

::: info

- The true anomaly at `date` comes from [trueAnomalyAt](trueAnomalyAt.md): the
  orbit's `angle` at J2000, moved on by its `period`.
- The state comes from [elementsToState](elementsToState.md), with the
  gravitational parameter the orbit's own `a` and `period` imply, $\mu = 4\pi^2
  a^3 / P^2$, so the speed agrees with the period. It's the parent's $\mu$ (and
  the body's, for a pair), for a body around its parent.
- It's relative to the orbit's parent: add the parent's own state to place a
  moon around the Sun, for example.
- A missing `om` or `w` counts as 0. An orbit without `i` is flat: in its
  reference plane, `retrograde: true` turns it backwards, as $i = 180°$.
- The orbit is a fixed ellipse: it doesn't precess. Good near J2000; the further
  from it, the more the real body has drifted.

:::

## Parameters

| Parameter  | Type                                                                                      | Description                                          |
| ---------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `orbit`    | [`OrbitInterface`](../../types/interfaces/OrbitInterface.md)                              | An orbit, for example `body.orbit` from a dataset.   |
| `date`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date to find the body at.                        |
| `options?` | [`StateAtOptionsInterface`](../interfaces/StateAtOptionsInterface.md)                     | The frame to give the state in, `'icrf'` by default. |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in metres and velocity `v` in metres per second, relative to
the orbit's parent.

## Throws

If `date` is not a valid `Date`.

## Throws

If the orbit's eccentricity is outside $0 \leq e < 1$.

## Throws

If `frame` is `'icrf'` and the orbit has no `frame`, or one that can't be placed
in the ICRF yet ([orbitFrameToIcrf](orbitFrameToIcrf.md)).

## Example

```ts
import { AU_METERS, PLANETS } from '@interstellar-tools/constants';
import { stateAt } from '@interstellar-tools/equations';

const mars = PLANETS.find((planet) => planet.id === 'mars')!;
const { r } = stateAt(mars.orbit!, new Date('2026-11-10T00:00:00Z'));

r.map((m) => m / AU_METERS); // Mars from the Sun, in au, in the ICRF
```

## See

[orbitFrameToIcrf](orbitFrameToIcrf.md) for the rotation to the ICRF.
