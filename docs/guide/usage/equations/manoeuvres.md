# Manoeuvres

[[toc]]

## Combine non-collinear burns (vector law / law of cosines for velocities)

Example usage of `combineBurnsDeltaV`.

```ts
import { combineBurnsDeltaV } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

// Helper: degrees → branded radians
const toRadians = (deg: number): Radians => ((deg * Math.PI) / 180) as Radians;
// Two burns (magnitudes in m/s)
const v1 = 500; // first impulse
const v2 = 300; // second impulse
// 1) Same direction (Δθ = 0°) → Δv = |v1 - v2|
const dv_same = combineBurnsDeltaV(v1, v2, toRadians(0));

console.log('Δθ = 0°   → Δv =', dv_same.toFixed(3), 'm/s');

// 2) Opposite directions (Δθ = 180°) → Δv = v1 + v2
const dv_opp = combineBurnsDeltaV(v1, v2, toRadians(180));

console.log('Δθ = 180° → Δv =', dv_opp.toFixed(3), 'm/s');

// 3) General non-collinear case (e.g., Δθ = 60°)
const dv_60 = combineBurnsDeltaV(v1, v2, toRadians(60));

console.log('Δθ = 60°  → Δv =', dv_60.toFixed(3), 'm/s');

// 4) Another example (Δθ = 25°)
const dv_25 = combineBurnsDeltaV(1200, 800, toRadians(25));

console.log('Δθ = 25°  → Δv =', dv_25.toFixed(3), 'm/s');
```

### Use cases

- **Combine tangential + normal at a node** When a manoeuvres requires changing
  **speed** (tangential) and doing a small **plane change** (normal) in the same
  burn, set `v1` and `v2` to those component magnitudes, and ($\Delta\theta$)
  (`deltaTheta`) to the angle between their directions. `combineBurnsDeltaV`
  returns the single-impulse equivalent $\Delta v$ for budgeting and comparison.

- **Hohmann + plane change at apogee/perigee** During a Hohmann transfer you
  often circularize (tangential) and trim inclination (normal) at the same
  point. Use this to compute the **combined** burn magnitude instead of summing
  scalars. Tip: at apogee (lower speed) the plane-change component costs less;
  reflect that in `v1`, `v2`.

- **Rendezvous cleanup: along-track + cross-track trim** Proximity ops
  frequently need a small **in-plane** correction and a tiny **out-of-plane**
  correction. Treat them as two non-collinear components to get the single
  $\Delta v$ you'll command to guidance.

- **Dogleg + insertion** If ascent/insertion includes a **heading change**
  (dogleg) and a **circularization** impulse, the thrust axes are not aligned.
  Use the mutual angle to compute the net $\Delta v$ penalty of doing both
  together.

- **Mid-course correction vectoring** Interplanetary MCCs are often specified as
  components (R/T/N). If you execute two components in one firing with a known
  separation angle, get the **resultant** $\Delta v$ to validate the manoeuvres
  plan.

- **Thruster gimbal limits / split burns** If attitude or gimbal constraints
  force two impulses separated by a known ($\Delta\theta$), compute the
  $\Delta v$ impact vs. the ideal pointing case.

- **Bounds & sanity checks** Quickly verify plans against the vector-law bounds:
  ($\lvert v_1 - v_2\rvert \le \Delta v \le v_1 + v_2$), with extremes at
  ($\Delta\theta = 0$) and ($\Delta\theta = \pi$). Useful in reviews and
  automated validation.

- **What-if sweeps** Fix `v1` (e.g., circularization) and vary `v2` and
  $\Delta\theta$ (e.g., plane-change size and placement) to find
  **cost-efficient compositions**. This helps decide where to perform a plane
  change (apogee vs. perigee) or how much to defer.

::: tip Guidance:

- Use radians for `deltaTheta` ($0 \ldots \pi$).
- If your "burns" are orthogonal components you plan to fire **simultaneously**,
  $\Delta\theta \approx 90^\circ$.
- If you fire **back-to-back** in the **same** direction,
  $\Delta\theta = 0^\circ$ ($\Delta v$ reduces to $\lvert v_1 - v_2\rvert$ if
  one partly cancels the other).
- If they oppose, $\Delta\theta = 180^\circ$ (Δv sums to $v_1 + v_2$).

:::

## Hohmann

Example usage of: `hohmannTransfer`, `hohmannSemiMajorAxis`,
`hohmannTransferTime`.

### Essentials

```typescript
import {
  hohmannTransfer,
  hohmannSemiMajorAxis,
  hohmannTransferTime
} from '@interstellar-tools/equations';

// Earth's standard gravitational parameter (μ), m^3/s^2
const muEarth = 3.986004418e14;
```

### LEO → GEO Hohmann transfer (raise)

```typescript
const rLEO = 6378e3 + 400e3; // Earth radius + 400 km (m)
const rGEO = 42164e3; // GEO radius (m)
const raise = hohmannTransfer(rLEO, rGEO, muEarth);

console.log('LEO → GEO');
console.log('at (m)        :', raise.at.toFixed(0));
console.log('Δv1 (m/s)     :', raise.dv1.toFixed(2), raise.dir1); // prograde
console.log('Δv2 (m/s)     :', raise.dv2.toFixed(2), raise.dir2); // prograde
console.log('ΔvTotal (m/s) :', raise.dvTotal.toFixed(2));
console.log('tTransfer (h) :', (raise.tTransfer / 3600).toFixed(2));

// Optionally via convenience helpers:
const at = hohmannSemiMajorAxis(rLEO, rGEO);
const tTransfer = hohmannTransferTime(rLEO, rGEO, muEarth);

console.log('at (from helper)       :', at.toFixed(0));
console.log('tTransfer (from helper):', (tTransfer / 3600).toFixed(2));
```

### Higher → Lower circular orbit (retrograde burns)

```typescript
const rHigh = 12000e3; // m
const rLow = 7000e3; // m
const lower = hohmannTransfer(rHigh, rLow, muEarth);

console.log('\nHigh → Low');
console.log('Δv1 (m/s) :', lower.dv1.toFixed(2), lower.dir1); // retrograde
console.log('Δv2 (m/s) :', lower.dv2.toFixed(2), lower.dir2); // retrograde
console.log('ΔvTotal   :', lower.dvTotal.toFixed(2));
```

### Degenerate case (no change): r1 == r2

```typescript
const rSame = rLEO;
const noop = hohmannTransfer(rSame, rSame, muEarth);

console.log('\nNo-op (same orbit)');
console.log('Δv1, Δv2, ΔvTotal:', noop.dv1, noop.dv2, noop.dvTotal); // all ~0
console.log('dirs:', noop.dir1, noop.dir2); // both 'none'
console.log(
  'tTransfer (half period):',
  (noop.tTransfer / 60).toFixed(2),
  'min'
);
```

### Use cases

- **Raise LEO → GEO (classic design case)** Compute the budget for a coplanar
  circular raise from ($r_1$) (e.g., LEO) to ($r_2$) (GEO):
  - Transfer semi-major axis: ($a_t=\tfrac{r_1+r_2}{2}$)
  - Burns:
    ($\Delta v_1=\sqrt{\tfrac{\mu}{r_1}}\!\left(\sqrt{\tfrac{2r_2}{r_1+r_2}}-1\right),\quad
       \Delta v_2=\sqrt{\tfrac{\mu}{r_2}}\!\left(1-\sqrt{\tfrac{2r_1}{r_1+r_2}}\right)$)
  - Total: ($\Delta v_{\text{total}}=\Delta v_1+\Delta v_2$)
  - Time of flight: ($t_t=\pi\sqrt{\tfrac{a_t^3}{\mu}}$) (half the transfer
    ellipse period) Use the returned `dir1`/`dir2` to label burns as
    **prograde**/**retrograde** for ops planning.

- **Lowering orbit (deorbit preparation or constellation altitude change)** For
  ($r_2<r_1$), the same formulas apply; the API returns magnitudes
  ($\Delta v_1,\Delta v_2$) with directions:
  - First burn is **retrograde** at ($r_1$) (speed decrease),
  - Second burn is **retrograde** at ($r_2$) to circularize. This is useful for
    controlled **perigee lowering** or moving satellites to a new operational
    shell.

- **Time-constrained transfers** When you must meet a **window**, use
  ($t_t=\pi\sqrt{\tfrac{a_t^3}{\mu}}$) to check feasibility against
  ground-station coverage, lighting constraints, or rendezvous timing. If
  ($t_t$) is too long, you may need a higher-energy (non-Hohmann) profile.

- **Budgeting & trades against bi-elliptic** For large radius ratios, a
  **bi-elliptic** transfer can beat Hohmann in total ($\Delta v$). Hohmann is
  often optimal up to about ($\tfrac{r_2}{r_1}\approx 11.94$) (rule of thumb).
  Use this function to:
  - Rapidly compute the Hohmann baseline ($\Delta v_{\text{total}}$),
  - Compare with a bi-elliptic design if ($\tfrac{r_2}{r_1}$) is very large.

- **"No-op" sanity check** If ($r_1=r_2$), then ($a_t=r_1$) and the function
  returns ($\Delta v_1=\Delta v_2=0$) with ($t_t=\pi\sqrt{\tfrac{r_1^3}{\mu}}$)
  (half the circular period). This is handy in tests and CI to validate inputs
  and units.

- **Combining with plane change at apogee** Hohmann is **coplanar**. If a small
  inclination change is needed, perform it where the speed is **lowest**
  (typically at apogee). After computing the tangential circularization
  ($v$)-change at ($r_2$), combine it with a normal component using your
  plane-change tools, e.g.
  ($\Delta v_{\text{combined}}=\sqrt{v_t^2+v_n^2-2 v_t v_n\cos\Delta\theta}$).
  This gives a more realistic single-burn magnitude for the apogee manoeuvre.

- **Constellation shell changes and station-keeping resets** Use
  ($\Delta v_{\text{total}}$) and ($t_t$) to estimate fuel and downtime when
  migrating satellites between shells (e.g.,
  ($550\ \text{km} \to 600\ \text{km}$)), or when re-baselining after long
  station-keeping campaigns.

::: tip Guidance

- Inputs: ($r_1,r_2$) in meters, ($\mu$) in m($^3$)/s($^2$).
- Outputs: ($\Delta v_1,\Delta v_2,\Delta v_{\text{total}}$) in m/s; ($t_t$) in
  seconds.
- Works for both **raise** ($(r_2>r_1)$) and **lower** ($(r_2<r_1)$).
- Use returned `dir1`/`dir2` to map to **prograde/retrograde/none** for burn
  scripting.

:::

## Oberth effect (specific energy gain near periapsis)

Example usage of `oberthEnergyGain`.

```ts
import { oberthEnergyGain, circularSpeed } from '@interstellar-tools/equations';

// Earth’s GM (μ) in m^3/s^2
const muEarth = 3.986004418e14;
// Example: small prograde burn at LEO periapsis (~400 km altitude)
const rLEO = 6378e3 + 400e3; // m
const vLEO = circularSpeed(rLEO, muEarth); // m/s ≈ 7670
// Suppose guidance commands a small impulsive burn Δv = 50 m/s at periapsis
const dv = 50; // m/s
// Oberth approximation: Δε ≈ v · Δv  (specific energy gain, J/kg ≡ m^2/s^2)
const deltaEps = oberthEnergyGain(vLEO, dv);
// For intuition, translate Δε to an approximate change in semi-major axis (elliptic case):
// ε = -μ/(2a)  ⇒  Δa ≈ (a^2 / μ) · Δε (valid for small changes around circular LEO)
const aLEO = rLEO; // circular → a = r
const deltaA = ((aLEO * aLEO) / muEarth) * deltaEps; // meters

console.log(`LEO speed v ≈ ${vLEO.toFixed(1)} m/s`);
console.log(`Prograde Δv  = ${dv.toFixed(1)} m/s`);
console.log(`Specific energy gain Δε ≈ ${deltaEps.toFixed(0)} J/kg`);
console.log(`Approx. semi-major axis change Δa ≈ ${deltaA.toFixed(0)} m`);

// Tip: If the burn is not perfectly prograde by angle φ (in radians),
// scale by cos φ: Δε ≈ v · Δv · cos φ  (small-angle approximation).
```

### Use cases

- **Maximize energy gain at periapsis (departure burn)** When planning an escape
  or high-energy transfer, compute the specific energy increment from a
  **periapsis** burn where orbital speed ($v$) is highest:
  ($\Delta \varepsilon
  \approx v\_{\text{peri}}\,\Delta v
 $). Use this to show
  why concentrating ($\Delta
  v$) near periapsis is more effective than the same
  ($\Delta v$) elsewhere.

- **Compare burn placement: periapsis vs. apoapsis** For the same impulsive
  ($\Delta v$), evaluate the energy benefit at different true anomalies:
  ($
  \Delta \varepsilon*{\text{peri}} \approx v*{\text{peri}} \Delta v$) vs.
  ($
  \Delta \varepsilon*{\text{apo}} \approx v*{\text{apo}} \Delta v$) with
  ($
  v*{\text{peri}} \gg v*{\text{apo}}$). Use this to justify performing plane
  changes or trims at **apoapsis** (cheap angle change) but **energy-raising
  burns** at **periapsis**.

- **Interplanetary departure staging (parking → hyperbolic)** Budget the
  **hyperbolic excess** energy by applying the Oberth estimate at LEO/LEO-like
  periapsis: ($\Delta \varepsilon \approx v\_{\text{LEO}}\,\Delta v$). Helps
  compare "all at LEO" vs. "split between LEO and deep-space" strategies.

- **Powered gravity assist (periapsis burn during flyby)** During a close
  planetary flyby, add a small **prograde** burn near pericenter to leverage the
  high ($v$) for a large energy increase:
  ($\Delta \varepsilon \approx
  v\_{\text{p}} \Delta v$). Useful to illustrate
  the payoff of **perijove/periapsis burns** in Jovian assists.

- **Mission design trade: deep-space manoeuvre vs. low-periapsis burn** For a
  fixed ($\Delta v$) capability, compare:
  ($\Delta \varepsilon*{\text{DSM}}
  \approx v*{\text{DSM}} \Delta v$) vs.
  ($\Delta \varepsilon*{\text{peri}}
  \approx v*{\text{peri}} \Delta v
 $). Shows
  why moving thrust "down the gravity well" can reduce total ($\Delta
  v$) to
  reach a target energy.

- **Angle-off-velocity corrections (non-prograde burn)** If the burn is not
  perfectly aligned with velocity by angle ($\phi$), use the small-angle form to
  estimate the effective energy gain:
  ($\Delta \varepsilon \approx v\,\Delta v
  \cos \phi$). Demonstrates pointing
  sensitivity and why guidance strives for **prograde alignment** during
  energy-critical burns.

- **Back-of-the-envelope fuel/energy checks** Quickly convert available
  ($\Delta v$) into expected **specific energy** change at a known speed ($v$):
  ($\Delta \varepsilon \approx v\,\Delta v$). Handy for sanity checks in **ops
  consoles**, **design docs**, and **CI tests** without invoking full orbit
  propagation.

::: info Notes

- Valid for **small**, **impulsive**, **prograde** burns; higher-order term
  ($
  \tfrac{1}{2}(\Delta v)^2$) is neglected.
- Use with care when ($\Delta v$) is large or burn duration is non-negligible.

:::
