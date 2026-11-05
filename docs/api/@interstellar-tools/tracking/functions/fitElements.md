[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ fitElements

# Function: fitElements()

```ts
function fitElements(
  states: readonly EphemerisSampleInterface[],
  epoch: Date,
  options?: FitElementsOptionsInterface
): ElementFitInterface;
```

Defined in:
[satellites/fit.ts:250](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L250)

**Fit SGP4 mean elements** to a satellite's positions and velocities: turn a
team's own orbit predictions, or the GPS fixes from on board, into a TLE or OMM
that standard tools and ground station networks can use.

It's a **differential correction**, the way element sets are made: start from a
guess, propagate it with SGP4 to each state, and adjust the elements by least
squares until SGP4's positions and velocities match the states best.

$$
\min_{\mathbf x} \sum_k \lVert \mathbf r_{\text{SGP4}}(t_k; \mathbf x) - \mathbf r_k \rVert^2
+ \frac{1}{n^2}\,\lVert \mathbf v_{\text{SGP4}}(t_k; \mathbf x) - \mathbf v_k \rVert^2
$$

Where:

- $\mathbf x$ are the elements: mean motion, eccentricity, inclination, node,
  argument of perigee, mean anomaly and B\*
- $\mathbf r_k, \mathbf v_k$ is the state at time $t_k$
- $1/n$, the inverse of the mean motion, weighs a velocity error like the
  position error it grows into over a radian of orbit

**Units**

- Inputs: `r` in **m** and `v` in **m/s**, in the **TEME** frame.
- Output: mean elements in radians and rad/s; residuals in **m** and **m/s**.

::: info Notes

- **The states must be in TEME**, the frame SGP4 works in. Turn Earth-fixed GPS
  fixes into it with [earthFixedToTeme](earthFixedToTeme.md) first.
- **Use a day or more of states** to fit B\*, the drag term: over a shorter arc,
  drag hasn't had time to show. Fitted to two hours of the ISS with 10 m of
  noise, B\* comes out tens of percent off, and the position a day later
  hundreds of metres to kilometres; fitted to two days, a few metres. Pass a
  fixed `bstar`, such as the last published one, for a short arc.
- **Cover at least a whole orbit**: from part of one, the period and
  eccentricity are hard to tell apart.
- **The residuals show the quality**. States from SGP4 itself fit to
  micrometres, and noisy ones to their noise. States from a more accurate model
  leave residuals, as SGP4 is an approximation: typically a few hundred metres
  to a few kilometres over days. Much larger residuals mean bad states, or an
  orbit SGP4 can't follow, such as one with a manoeuvre in it.
- **Put the epoch at the end of the arc** to predict ahead: the elements are
  best near their epoch, and that's where the next passes are.
- The fit starts on the states within an orbit of the epoch, and widens the arc
  fourfold at a time, so a rough first guess still converges.
- **Check `converged`**: a fit that doesn't settle within 50 steps returns the
  best elements it found. That happens for nearly equatorial orbits, below about
  0.01°, where SGP4 flips the node as the inclination crosses zero.
- The derivatives of the mean motion are set to 0: SGP4 doesn't use them.
- Without `initial`, the catalogue number and bookkeeping are 0 and the
  classification `U`: set your own before exporting, as in the example.

:::

## Parameters

| Parameter  | Type                                                                                         | Description                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `states`   | readonly [`EphemerisSampleInterface`](../../types/interfaces/EphemerisSampleInterface.md)\[] | The positions `r` in **m** and velocities `v` in **m/s** in TEME, with their `epoch`s: at least 2, of one satellite. |
| `epoch`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)    | The epoch of the fitted elements, as a `Date`.                                                                       |
| `options?` | [`FitElementsOptionsInterface`](../interfaces/FitElementsOptionsInterface.md)                | `initial`, elements to start from; `bstar`, a fixed B\* in **1/R⊕**.                                                 |

## Returns

[`ElementFitInterface`](../interfaces/ElementFitInterface.md)

The fitted `elements`, the `rms` and per-state `residuals`, the number of
`iterations`, and whether the fit `converged`.

## Throws

If `states` is not an array of states with a valid `Date` and three finite
numbers each, `epoch` is not a valid `Date`, or `bstar` is not a finite number.

## Throws

If there are fewer than 2 states, they aren't of a closed orbit, or SGP4 fails
on the first guess: give `initial` elements then.

## Example

```ts
// Two days of the team's own predictions, every minute, in TEME
const fit = fitElements(states, new Date('2026-11-06T00:00:00Z'));

fit.converged; // true
fit.rms.position; // in m: how far SGP4 is from the states
formatTle({ ...fit.elements, catalogNumber: 99_999, objectId: '2026-123A' });
```

## See

- [propagate](propagate.md)
- [formatTle](formatTle.md)
- [formatOmm](formatOmm.md)
- https://celestrak.org/publications/AIAA/2008-6770/ Vallado & Crawford (2008),
  SGP4 Orbit Determination
