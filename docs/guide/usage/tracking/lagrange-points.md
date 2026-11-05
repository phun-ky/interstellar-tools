---
title: Lagrange points
description:
  The five Lagrange points of two bodies with @interstellar-tools/equations,
  where JWST, SOHO and the Trojan asteroids are parked.
---

# Lagrange points

Two bodies circling each other, such as the Sun and Earth, have five points
where a third, small body can keep its place relative to both: where the two
pulls and the turning of the frame balance. JWST and Gaia orbit Sun-Earth L2,
SOHO sits at L1, and thousands of Trojan asteroids gather at Sun-Jupiter L4 and
L5. The functions are in `@interstellar-tools/equations`.

<figure class="guide-figure">
<svg viewBox="0 0 640 360" role="img" aria-labelledby="lp-title lp-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="lp-title">The five Lagrange points</title>
  <desc id="lp-desc">A large body and a smaller one circling it. L1 lies between them, L2 beyond the smaller body, and L3 on the far side of the large body, all on the line through them. L4 and L5 lie on the smaller body's orbit, 60 degrees ahead and behind, each at the corner of an equilateral triangle with the two bodies.</desc>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="240" cy="190" r="160" stroke-dasharray="4 4" stroke-opacity="0.45" />
    <path d="M60 190 H460" stroke-opacity="0.35" />
  </g>
  <g fill="none" stroke-width="1.5" class="accent-2" stroke-dasharray="3 4">
    <path class="accent-2" d="M240 190 L320 51.4 L400 190 L320 328.6 Z" />
  </g>
  <circle cx="240" cy="190" r="22" fill="currentColor" fill-opacity="0.85" />
  <circle cx="400" cy="190" r="8" fill="currentColor" fill-opacity="0.85" />
  <g class="accent-fill">
    <circle cx="352" cy="190" r="5" />
    <circle cx="448" cy="190" r="5" />
    <circle cx="80" cy="190" r="5" />
    <circle cx="320" cy="51.4" r="5" />
    <circle cx="320" cy="328.6" r="5" />
  </g>
  <g font-family="var(--vp-font-family-mono)" font-size="13" fill="currentColor">
    <text x="352" y="178" text-anchor="middle" class="accent-text">L1</text>
    <text x="448" y="178" text-anchor="middle" class="accent-text">L2</text>
    <text x="80" y="178" text-anchor="middle" class="accent-text">L3</text>
    <text x="320" y="40" text-anchor="middle" class="accent-text">L4</text>
    <text x="320" y="350" text-anchor="middle" class="accent-text">L5</text>
    <text x="240" y="232" text-anchor="middle">Sun</text>
    <text x="400" y="214" text-anchor="middle">Earth</text>
  </g>
  <g font-family="var(--vp-font-family-base)" font-size="13" fill="currentColor">
    <text x="480" y="110" class="accent-text">L1, L2, L3</text>
    <text x="480" y="128">on the line through</text>
    <text x="480" y="146">the bodies: unstable</text>
    <text x="480" y="196" class="accent-2-text">L4, L5</text>
    <text x="480" y="214">60° ahead and behind,</text>
    <text x="480" y="232">equilateral triangles</text>
    <text x="480" y="250">with them: stable</text>
  </g>
</svg>
<figcaption>Not to scale: Sun-Earth L1 and L2 are 1.5 million km from Earth, a hundredth of the way to the Sun.</figcaption>
</figure>

## Where they are

`lagrangePoints` takes the two bodies' masses, or their gravitational
parameters, and the distance between them, and returns the five points in
metres, in the frame turning with the bodies, from their barycentre: x points
from the larger body to the smaller.

```ts
import { AU_METERS } from '@interstellar-tools/constants';
import { lagrangePoints } from '@interstellar-tools/equations';

const GM_SUN = 1.32712440041e20; // m³/s²
const GM_EARTH_MOON = 4.0350323e14; // Earth and the Moon together
const { L1, L2 } = lagrangePoints(GM_SUN, GM_EARTH_MOON, AU_METERS);
// Earth at (1 − μ) au: L1 1 497 621 km sunward of it, L2 1 507 683 km beyond
```

L4 and L5 sit at the corners of equilateral triangles with the two bodies. L1,
L2 and L3 lie on the line through them, where a quintic equation in the mass
ratio $\mu = m_2 / (m_1 + m_2)$ balances; `lagrangePoints` solves it with
Newton's method. For Earth and the Moon, 384 400 km apart, L1 is 326 381 km from
Earth and L2 448 915 km.

## Which ones hold

L1, L2 and L3 are **unstable**: a spacecraft parked there drifts off unless it
corrects its course every few weeks. JWST and SOHO don't sit on the points
themselves, but fly halo orbits around them, hundreds of thousands of kilometres
across.

L4 and L5 are **stable** if the larger body outweighs the smaller about 25 times
or more: Routh's criterion, $\mu < 0.03852$. A body nudged there circles the
point rather than drifting off, which is why Jupiter's Trojans have stayed for
billions of years. For the Sun and Jupiter, $\mu \approx 0.000954$; for Pluto
and Charon, $\mu \approx 0.11$.

```ts
import { areTrojanPointsStable } from '@interstellar-tools/equations';

areTrojanPointsStable(GM_SUN, 1.26686534e17); // true: Sun-Jupiter
areTrojanPointsStable(8.69e11, 1.06e11); // false: Pluto-Charon
```

## Hill spheres

A body's **Hill sphere** is how far its gravity can hold a moon against the pull
of the body it orbits. It reaches about as far as its L1 and L2.

```ts
import { hillSphereRadius } from '@interstellar-tools/equations';

// Earth's, against the Sun: ≈ 1 471 566 km
hillSphereRadius(AU_METERS, 0.0167, 3.986004418e14, GM_SUN);
```

The Moon is a quarter of the way out. Stable orbits stay within about a half to
a third of it.

## The Jacobi constant

In the frame turning with the two bodies, a small body's energy, the **Jacobi
constant** $C_J$, stays constant. It decides where the body can go at all: only
where $2U \ge C_J$, inside walls called zero-velocity curves. The walls first
open at L1, then L2, then L3, and last of all L4 and L5.

```ts
import { jacobiConstant } from '@interstellar-tools/equations';

// Earth and the Moon, in normalised units: L1 at rest
jacobiConstant([0.83692, 0, 0, 0, 0, 0], 0.012150584); // ≈ 3.1883
```

A spacecraft near Earth with $C_J$ above 3.1883 can never reach the Moon; at
3.1722, the way past L2 opens too, and at 2.988, the walls are gone.

## Next

- [Satellites](/guide/usage/tracking/satellites) and
  [probes](/guide/usage/tracking/probes): where the spacecraft at these points
  are.
- The [three-body reference](/api/@interstellar-tools/equations/) has the
  functions, with their formulas, and the equations of motion in the rotating
  frame.

<style>
.guide-figure { margin: 24px 0; }
.guide-figure svg { width: 100%; height: auto; color: var(--vp-c-text-1); }
.guide-figure .accent { stroke: var(--vp-c-brand-1); }
.guide-figure .accent-2 { stroke: var(--vp-c-warning-1); }
.guide-figure .accent-fill { fill: var(--vp-c-brand-1); }
.guide-figure .accent-text { fill: var(--vp-c-brand-1); }
.guide-figure .accent-2-text { fill: var(--vp-c-warning-1); }
.guide-figure figcaption { font-size: 14px; color: var(--vp-c-text-2); margin-top: 8px; }
</style>
