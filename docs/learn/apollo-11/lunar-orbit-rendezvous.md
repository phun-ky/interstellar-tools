# IV. Lunar orbit rendezvous

On 21 July 1969, after 21 hours and 36 minutes on the Moon, Eagle's ascent stage
lifted off and left its descent stage behind as a launch pad. Less than four
hours later it was docked to Columbia again, about 110 km up. In this chapter
you'll fly that climb and the chase that followed, the part of the mission the
whole Apollo plan depended on.

- **You'll use:** `thrustToWeight`, `burnTime`, `massFlowRate`,
  `surfaceRotationSpeed`, `visVivaSpeed`, `keplerPeriod`, `synodicPeriod`,
  `cwTwoImpulseTransfer`
- **Time:** about 15 minutes

<ApolloMissionMap :start="6" />

## 1. Leaving the surface

::: info GET 124:22:00 · Lunar liftoff

:::

The ascent stage weighed 4 888 kg at liftoff, propellant included, and its
engine gave about 15 400 N. In the Moon's weak gravity that's plenty; on Earth
it wouldn't have lifted the stage off the ground:

```ts
import {
  burnTime,
  massFlowRate,
  thrustToWeight
} from '@interstellar-tools/equations';

const MU_MOON = 4.902800118e12; // m³/s²
const R_MOON = 1_737_400; // m
const m0 = 4888; // kg, ascent stage at liftoff
const F = 15_409; // N, 3464 lbf
const Isp = 309; // s
const gMoon = MU_MOON / R_MOON ** 2; // 1.62 m/s²

thrustToWeight(F, m0, gMoon); // 1.94
thrustToWeight(F, m0, 9.80665); // 0.32 on Earth
massFlowRate(F, Isp); // 5.09 kg/s
burnTime(m0, 1850.2, F, Isp); // 439 s
```

The flown burn took 434.9 s, 1% less: the thrust and specific impulse here are
the pre-flight predictions. The Moon gave little help on the way up. It turns
once a month, so the launch site moved east at only 4.6 m/s, against the 409 m/s
Apollo 11 got from Earth's rotation at Pad 39A:

```ts
import { surfaceRotationSpeed } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

const omega = (2 * Math.PI) / (27.322 * 86_400); // rad/s, one turn a sidereal month
const tranquility = ((0.674 * Math.PI) / 180) as Radians;

surfaceRotationSpeed(tranquility, R_MOON, omega); // 4.6 m/s
```

## 2. Into orbit

Seven minutes later, the ascent stage was in a 17 × 89 km orbit. At the low
point of that orbit, vis-viva gives its speed:

```ts
import { visVivaSpeed } from '@interstellar-tools/equations';

const NM = 1852; // m per nautical mile
const low = R_MOON + 9.4 * NM; // 17.4 km up
const high = R_MOON + 48.0 * NM; // 88.9 km up
const a = (low + high) / 2;

visVivaSpeed(low, a, MU_MOON); // 1 688 m/s
```

The burn delivered 1 850 m/s, 162 m/s more than the orbit needed. That
difference went into climbing 17 km and into holding the stage up against the
Moon's gravity on the way: the gravity loss.

## 3. Catching up

Columbia was in a higher orbit, 104 × 115 km (56 × 62 n mi). A lower orbit is a
faster one, so the LM gained on it every lap, but slowly:

```ts
import {
  keplerPeriod,
  meanMotion,
  synodicPeriod
} from '@interstellar-tools/equations';

const aCSM = R_MOON + 59 * NM;
const lm = keplerPeriod(a, MU_MOON) / 60; // 113.3 min
const csm = keplerPeriod(aCSM, MU_MOON) / 60; // 118.7 min
const lap =
  synodicPeriod(meanMotion(a, MU_MOON), meanMotion(aCSM, MU_MOON)) / 3600; // 41.8 h
```

At about 16° an orbit, the LM would have needed 42 hours to lap the CSM. So the
moment of liftoff mattered more than the LM's speed: it decided where the LM
started the chase, and three small burns then closed the gap. They're the
**coelliptic sequence**.

## 4. Raising the low point

::: info GET 125:19:35 · Coelliptic sequence initiation (CSI)

:::

About half an orbit after insertion, near the high point of its orbit, the LM
fired its thrusters to speed up. That raised the low point from 17 km to 85 km,
into a 85 × 91 km orbit. Assuming the burn was exactly at the high point,
vis-viva gives its size:

```ts
const after = R_MOON + ((49.3 + 45.7) / 2) * NM; // 45.7 × 49.3 n mi
const csi = visVivaSpeed(high, after, MU_MOON) - visVivaSpeed(high, a, MU_MOON); // 16.0 m/s
```

The flown burn was 15.7 m/s.

## 5. Matching the orbits

::: info GET 126:17:50 · Constant delta height (CDH)

:::

The second burn made the LM's orbit coelliptic with the CSM's: the same shape, a
constant height below it. The Mission Report gives the LM 42.1 × 47.4 n mi after
it, about 26.4 km below the CSM. With a circular CSM orbit, this burn would have
been zero; Columbia's slightly elliptic orbit made it 6.1 m/s.

From the CSM, a coelliptic LM 26.4 km below drifts forward at a steady speed.
For a circular reference orbit with mean motion $n$, the Clohessy–Wiltshire
equations give it as $\tfrac{3}{2} n \Delta h$:

```ts
const n = meanMotion(aCSM, MU_MOON); // rad/s
const dh = (59 - (47.4 + 42.1) / 2) * NM; // 26.4 km
const drift = 1.5 * n * dh; // 34.9 m/s
```

In the 46 minutes until the next burn, that's 96 km closer.

## 6. The final approach

::: info GET 127:03:52 · Terminal phase initiation (TPI)

:::

Now the LM aimed straight for the CSM. The transfer took 42 minutes, until the
braking burn at **terminal phase finalisation** (TPF), 127:46:10. In the CSM's
frame, `cwTwoImpulseTransfer` gives both burns. The sources don't say how far
behind the LM was at TPI, so find out from the flown TPI burn of 7.71 m/s: about
46.5 km behind.

```ts
import { cwTwoImpulseTransfer } from '@interstellar-tools/equations';
import type { CwState } from '@interstellar-tools/types';

const atTpi: CwState = [-dh, -46_500, 0, 0, drift, 0];
const rendezvous: CwState = [0, 0, 0, 0, 0, 0];
const { dv1, dv2 } = cwTwoImpulseTransfer(atTpi, rendezvous, n, 2538);

Math.hypot(...dv1); // 7.72 m/s at TPI
Math.hypot(...dv2); // 8.56 m/s at TPF
```

That's a test: the separation came from the first burn, so the second is a
prediction.

::: practice Apollo 11, braking next to Columbia

**8.56 m/s**

_The TPF burn predicted from the TPI geometry_

The flown TPF burn was 9.57 m/s. The difference is about what you'd expect:
Clohessy–Wiltshire assumes a circular orbit for the CSM, Columbia's wasn't
quite, and the crew made two small corrections on the way.

:::

Drag the time to fly the approach, and change the separation at TPI. The first
burn is cheapest, 6.99 m/s, with the LM 55 km behind; a little further back, the
TPI burn is the same as Apollo 11's, but braking costs 13 m/s.

<ApolloRendezvousPlot />

::: info GET 128:03:00 · Docking

:::

After 17 minutes of station keeping, Eagle and Columbia docked. Armstrong and
Aldrin moved back into the command module with their samples, and the ascent
stage was cast off.

## 7. Try it yourself

- Lift off one minute late. How many degrees further behind does the LM start,
  and how many orbits of catching up does that cost?
- Plan the coelliptic sequence for a CSM in a circular 111 km orbit. What does
  CDH cost then?
- In the plot, find the separation where TPI and TPF cost the same. Why would
  planners prefer a cheap braking burn over a cheap first burn?

Next: [V. Coming home](/learn/apollo-11/coming-home).
