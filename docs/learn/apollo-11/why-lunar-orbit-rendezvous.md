# Why lunar orbit rendezvous?

In 1961 NASA had three ways to put people on the Moon. **Direct ascent** would
fly one big spacecraft from Earth to the lunar surface and straight back.
**Earth orbit rendezvous** would assemble that same spacecraft in Earth orbit
from several launches. **Lunar orbit rendezvous** (LOR), argued for by John
Houbolt, would leave the return spacecraft in lunar orbit and send only a small
lander down. NASA chose LOR in 1962. In this prologue you'll see why, using the
mass Apollo 11 actually flew and one equation: the rocket equation.

- **You'll use:** `initialMassForDeltaV`, `rocketDeltaVFromIsp`
- **Time:** about 10 minutes

## 1. The price of a burn

The rocket equation says how much Δv a rocket gets from burning its mass from
$m_0$ down to $m_f$, with an engine of specific impulse $I_{sp}$:

$$
\Delta v = I_{sp}\, g_0 \ln\frac{m_0}{m_f}
\quad\Longleftrightarrow\quad
m_0 = m_f\, e^{\Delta v / (I_{sp} g_0)}
$$

Read the right-hand form as a price: every kilogram left after a burn costs
$e^{\Delta v / (I_{sp} g_0)}$ kilograms before it. Landing and lifting off again
means paying that price twice, and the payload of the second burn is in the
first burn's payload. Apollo 11's two lunar module burns were:

| Burn            | Δv          | Engine         | $I_{sp}$ | Price per kg |
| --------------- | ----------- | -------------- | -------- | ------------ |
| Powered descent | 2 112.3 m/s | Descent engine | 305 s    | 2.026        |
| Lunar ascent    | 1 850.2 m/s | Ascent engine  | 309 s    | 1.841        |

Together, every kilogram that must come back up to lunar orbit costs $2.026
\times 1.841 = 3.73$ kilograms in lunar orbit before the landing. The engine
figures are the design value for the descent engine and the pre-flight
prediction for the ascent engine, since NASA didn't publish measured ones.

## 2. Landing the whole spacecraft

With direct ascent, whatever lifts off from the Moon has to bring the crew all
the way home. On Apollo 11 that was the command and service module, the CSM: 16
767 kg as it fired its engine to leave lunar orbit. In a direct ascent, the same
spacecraft would have had to land, and lift off again:

```ts
import {
  initialMassForDeltaV,
  rocketDeltaVFromIsp
} from '@interstellar-tools/equations';

const DESCENT = { dv: 2112.3, Isp: 305 }; // m/s, s
const ASCENT = { dv: 1850.2, Isp: 309 };
const csm = 16_767; // kg, CSM at trans-Earth injection
const atLiftoff = initialMassForDeltaV(csm, ASCENT.dv, ASCENT.Isp); // 30 876 kg
const direct = initialMassForDeltaV(atLiftoff, DESCENT.dv, DESCENT.Isp); // 62 565 kg

// The rocket equation, forwards, gives the descent's Δv back
rocketDeltaVFromIsp(DESCENT.Isp, direct, atLiftoff); // 2112.3 m/s
```

## 3. Landing only a cabin

<DocPhoto
  src="apollo-11/houbolt.webp"
  alt="John Houbolt at a blackboard covered in sketches of the spacecraft and orbits for lunar orbit rendezvous"
  :width="1600"
  :height="1280"
  credit="NASA Langley / Bob Nye"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:John_C._Houbolt_-_GPN-2000-001274.jpg">

John Houbolt explains lunar orbit rendezvous at NASA Langley in 1962. His case
for landing only a small cabin, worked out below, won NASA over that year.

</DocPhoto>

With LOR, the CSM waits in lunar orbit and only the lunar module's ascent stage
has to come back up: 4 888 kg at liftoff, propellant included. It pays the
descent price once, and the CSM pays nothing:

```ts
const ascentStage = 4888; // kg, at lunar liftoff
const lm = initialMassForDeltaV(ascentStage, DESCENT.dv, DESCENT.Isp); // 9 905 kg
const lor = csm + lm; // 26 672 kg
```

::: practice Apollo 11, in lunar orbit before the landing

**26 672 kg vs 62 565 kg**

_Lunar orbit rendezvous against direct ascent, propellant only_

Direct ascent needs 2.35 times as much mass in lunar orbit. Every one of those
kilograms would also have had to be braked into lunar orbit and launched from
Earth, which is why direct ascent needed a rocket far bigger than the Saturn V.

:::

## 4. What the model leaves out

The sums count propellant, not the tanks and engines that hold and burn it. The
real Apollo 11 lunar module weighed 15 279 kg when it undocked, not 9 905 kg:
the difference is mostly the descent stage's own structure, engine and legs. A
direct-ascent spacecraft would need even more of that, because its descent stage
would have to carry 62 tonnes instead of 15. Adding structure makes LOR's
advantage bigger, not smaller.

## 5. Try it yourself

- Give both lunar module engines the 428.7 s of the S-IVB's J-2 engine. How much
  does direct ascent need now? Why couldn't the lunar module use a J-2?
- In section 2, the CSM's 16 767 kg already includes the propellant for the trip
  home. Which other burn would a direct-ascent spacecraft skip, and would that
  change the answer much?

Next: [I. Leaving Earth](/learn/apollo-11/leaving-earth).
