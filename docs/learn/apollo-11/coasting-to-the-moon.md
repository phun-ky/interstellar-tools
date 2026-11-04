# II. Coasting to the Moon

At 2 hours 50 minutes into the mission, the S-IVB shut down for the last time,
and Apollo 11 was on its way: three days of coasting, with one small correction,
to a point 114 km above the far side of the Moon. In this chapter you'll follow
that coast: the long ellipse out, the docking with the lunar module, the aim,
and the moment the Moon took over.

- **You'll use:** `stateToElements`, `trueToMeanAnomaly`, `meanMotion`,
  `solveKepler`, `eccentricToTrueAnomaly`, `hyperbolicSemiMajorAxis`,
  `hyperbolicEccentricity`, `sphereOfInfluenceRadius`, `hyperbolicTimeOfFlight`
- **Time:** about 15 minutes

<ApolloMissionMap :start="2" />

## 1. On a long ellipse

::: info GET 002:50:13 · Trans-lunar injection

:::

Ten seconds after the S-IVB shut down, Apollo 11 was 334.4 km up, moving at 10
834.3 m/s, 7.367° above the horizontal. As in chapter V, write that as a state
vector and let `stateToElements` find the orbit:

```ts
import { stateToElements } from '@interstellar-tools/equations';

const MU_EARTH = 3.986004418e14; // m³/s²
const R_EARTH = 6_378_166; // m
const r = 6_712_602; // m, 180.581 n mi up
const v = 10_834.3; // m/s, 35 545.6 ft/s
const fpa = (7.367 * Math.PI) / 180;
const tli = stateToElements(
  [r, 0, 0],
  [v * Math.sin(fpa), v * Math.cos(fpa), 0],
  MU_EARTH
);
// tli.a ≈ 288 889 km, tli.e ≈ 0.977
const apogee = tli.a * (1 + tli.e); // 571 177 km
```

An ellipse with an eccentricity of 0.977, reaching 571 000 km out, half as far
again as the Moon. Left alone, Apollo 11 would have come back to Earth after
17.9 days. The Moon would be in the way long before that.

## 2. Turning round

::: info GET 003:24:04 · Docking

:::

The lunar module rode to orbit inside the adapter below the command and service
module. To fetch it, the CSM separated at 003:15:23, turned round and docked
with it, nose to nose, 8 minutes and 41 seconds later. Where was it by then?
Kepler's equation turns a time into a place on the ellipse:

```ts
import {
  eccentricToTrueAnomaly,
  meanMotion,
  solveKepler,
  trueToMeanAnomaly
} from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

const n = meanMotion(tli.a, MU_EARTH); // rad/s
const M0 = trueToMeanAnomaly(tli.nu, tli.e);
const t0 = 2 * 3600 + 50 * 60 + 13.03; // s, TLI
const docking = 3 * 3600 + 24 * 60 + 3.7; // s
const M = (M0 + n * (docking - t0)) as Radians;
const nu = eccentricToTrueAnomaly(solveKepler(M, tli.e), tli.e);
const p = tli.a * (1 - tli.e ** 2);
const rDocking = p / (1 + tli.e * Math.cos(nu)); // 16 231 km from Earth's centre
```

Docking came 9 850 km up, at 6.91 km/s, slowing all the time. The crew pulled
the lunar module free at 004:17:03, and the S-IVB was sent off on a path of its
own.

<DocPhoto
  src="apollo-11/eagle-in-lunar-orbit.webp"
  alt="The lunar module Eagle, legs extended, flying above the cratered Moon"
  :width="1600"
  :height="1594"
  credit="NASA / Michael Collins"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:Eagle_In_Lunar_Orbit_-_GPN-2000-001210.jpg">

Eagle in lunar orbit on 20 July, photographed by Michael Collins from Columbia.
It rode out from Earth docked to Columbia's nose, as above.

</DocPhoto>

## 3. Slowing down

Everything after TLI was a climb against Earth's gravity. By the midcourse
correction, a day later, Kepler's equation puts it 210 000 km out and down to
1.55 km/s. By the time it reached the Moon's sphere of influence, 345 279 km
from Earth, it was moving at only 911 m/s.

The two-body ellipse gets there 55.6 h after TLI, at 964 m/s:

```ts
const rSoi = 345_279_000; // m, 186 436 n mi
const nuSoi = Math.acos((p / rSoi - 1) / tli.e) as Radians;
const toSoi = (trueToMeanAnomaly(nuSoi, tli.e) - M0) / n; // 55.6 h
const vSoi = Math.sqrt(v ** 2 + 2 * MU_EARTH * (1 / rSoi - 1 / r)); // 964 m/s
```

Apollo 11 took 58.8 h. Over two and a half days the Moon's and the Sun's pull
add up, and an ellipse around Earth alone can't do better than a few percent.

## 4. Aiming

::: info GET 026:44:59 · Midcourse correction

:::

The Moon's gravity bends every path in. Arriving at 1.08 km/s, a spacecraft
aimed 4 358 km from the Moon's centre, the distance between the Moon and the
straight line it would have flown without the Moon, swings in to pass 114 km
above the surface:

```ts
import {
  hyperbolicEccentricity,
  hyperbolicSemiMajorAxis
} from '@interstellar-tools/equations';

const MU_MOON = 4.902800118e12; // m³/s²
const R_MOON = 1_737_400; // m
const vInf = 1080; // m/s
const a = hyperbolicSemiMajorAxis(vInf, MU_MOON); // -4 203 km
const aim = (rp: number) => {
  const e = hyperbolicEccentricity(vInf, rp, MU_MOON);

  return -a * Math.sqrt(e ** 2 - 1);
};

aim(R_MOON + 113_900); // 4 358 km, 61.5 n mi up
aim(R_MOON); // 4 198 km: anything closer hits the Moon
```

So the safe corridor was 160 km wide, aimed at from more than 200 000 km away.
After the evasive manoeuvre that took it clear of the S-IVB, Apollo 11 was on
course to pass 335 km up, an aim of 4 660 km. One burn of 6.37 m/s at 026:44:59,
49 hours before lunar orbit insertion, moved the aim 302 km closer.

::: practice Apollo 11, aiming for the Moon

**4 358 km**

_The aim for a 114 km closest approach at 1.08 km/s_

The Moon's gravity widens the target to 2.4 times its radius: aim anywhere
within 4 198 km of its centre and you hit it. That's why the midcourse
corrections could be so small.

:::

Move the aim and watch the path bend:

<ApolloAimPlot />

## 5. Into the Moon's sphere

::: info GET 061:39:55 · Into the Moon's sphere of influence

:::

Somewhere between Earth and the Moon, the Moon's pull starts to matter more than
Earth's on the spacecraft's path. Laplace's sphere of influence gives the
distance:

```ts
import { sphereOfInfluenceRadius } from '@interstellar-tools/equations';

sphereOfInfluenceRadius(384_400_000, 7.342e22, 5.9722e24); // 66 169 km
```

The Mission Director's report put the crossing at 62 640 km from the Moon. Both
are conventions, a place to switch from one two-body problem to the next; this
is how **patched conics** work.

At the switch, the velocity changes frame. Relative to Earth, Apollo 11 was
moving at 911 m/s; relative to the Moon, at 1 151 m/s. The Moon itself moves
round Earth at about 1.02 km/s, and the three fit together if the spacecraft's
and the Moon's velocities were 73° apart:

```ts
import { circularSpeed } from '@interstellar-tools/equations';

const vMoon = circularSpeed(384_400_000, MU_EARTH); // 1 018 m/s
const vEarth = 911.4; // m/s, 2990 ft/s
const vRel = 1150.6; // m/s, 3775 ft/s
const angle =
  (Math.acos((vEarth ** 2 + vMoon ** 2 - vRel ** 2) / (2 * vEarth * vMoon)) *
    180) /
  Math.PI; // 73°
```

From here on, the Moon's gravity pulls Apollo 11 in. The hyperbola from 62 640
km takes 13.8 h to its closest approach, and the service module's engine fired
for lunar orbit insertion 14 h 10 min after the crossing.

## 6. Try it yourself

- Without the midcourse correction, Apollo 11 would have passed 335 km up. Work
  out how fast it would have been moving at closest approach, and how much
  slower lunar orbit insertion would then have had to make it.
- TLI added 3 182 m/s to a parking orbit about 185 km up. Add that to the
  circular speed there and compare it with the 10 834.3 m/s above. Why don't
  they match?
- In the plot, find the aim that just grazes the surface. Why does it get closer
  to the Moon's radius at a higher arrival speed?

Next: [III. Down to the surface](/learn/apollo-11/down-to-the-surface).
