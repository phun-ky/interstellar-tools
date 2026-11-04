# III. Down to the surface

On 19 July 1969, behind the Moon and out of contact with Earth, Apollo 11 fired
its main engine for six minutes and became the Moon's satellite. A day later,
Armstrong and Aldrin took Eagle down to the Sea of Tranquility, landing with
less than a minute of propellant left. In this chapter you'll fly that descent:
braking into lunar orbit, lowering Eagle's orbit, the twelve and a half minutes
of powered descent, and the landing site: where it was, how it was lit, and how
steadily Eagle stood on it.

- **You'll use:** `escapeSpeed`, `hyperbolicEccentricity`,
  `hyperbolicPeriapsisSpeed`, `visVivaSpeed`, `burnTime`, `keplerPeriod`,
  `hohmannTransfer`, `thrustToWeight`, `greatCircleDistance`,
  `horizonSurfaceDistance`, and from `@interstellar-tools/maps`:
  `illuminationAngles`, `tipOverAngle`, `isStableLanding`
- **Time:** about 15 minutes

<ApolloMissionMap :start="4" />

## 1. Arriving fast

After the midcourse correction in chapter II, Apollo 11 was aimed to pass 61.5 n
mi (113.9 km) above the Moon at 8 334 ft/s (2 540 m/s). That's faster than the
Moon's escape speed at that height, so without a burn the spacecraft would have
swung round the Moon and left again:

```ts
import {
  escapeSpeed,
  hyperbolicEccentricity
} from '@interstellar-tools/equations';

const MU_MOON = 4.902800118e12; // m³/s²
const R_MOON = 1_737_400; // m
const NM = 1852; // m per nautical mile
const FT = 0.3048; // m per foot
const rp = R_MOON + 61.5 * NM; // m, the closest approach
const vp = 8334 * FT; // 2 540 m/s there
const vEsc = escapeSpeed(rp, MU_MOON); // 2 301 m/s
const vInf = Math.sqrt(vp ** 2 - vEsc ** 2); // 1 075 m/s

hyperbolicEccentricity(vInf, rp, MU_MOON); // 1.44
```

The speed left over far from the Moon, $v_\infty$, is 1 075 m/s: the hyperbolic
excess speed from chapter II. To stay, the spacecraft had to lose more than the
239 m/s by which it beat the escape speed.

## 2. Braking into orbit

::: info GET 075:49:50 · Lunar orbit insertion 1 (LOI-1)

:::

The service module's engine fired against the direction of motion for 357.5 s
and left Apollo 11 in a 60.0 × 169.7 n mi orbit. For an instant burn at the
orbit's low point, the hyperbola and the new ellipse give the cost:

```ts
import {
  burnTime,
  hyperbolicPeriapsisSpeed,
  keplerPeriod,
  visVivaSpeed
} from '@interstellar-tools/equations';

const low = R_MOON + 60.0 * NM; // m
const high = R_MOON + 169.7 * NM; // m
const a = (low + high) / 2;
const loi1 =
  hyperbolicPeriapsisSpeed(vInf, low, MU_MOON) - visVivaSpeed(low, a, MU_MOON); // 871 m/s
const period = keplerPeriod(a, MU_MOON) / 60; // 128.8 min
```

The flown burn was 2 917.5 ft/s (889 m/s), 2% more. A six-minute burn isn't made
at the low point: it's spread along the orbit on either side of it, and part of
the thrust goes into turning the velocity instead of slowing it.

How long should it take? The docked spacecraft weighed 43 573 kg at ignition.
The engine is the one from chapter V, with its rated 20 500 lbf of thrust and
the 316.7 s specific impulse backed out there:

```ts
const m0 = 43_573; // kg, 96 061.6 lb
const F = 91_189; // N, 20 500 lbf
const Isp = 316.7; // s

burnTime(m0, 889.3, F, Isp); // 370 s
```

The flown burn took 357.5 s. NASA's own prediction was 4.5 s longer than that,
and the Mission Report puts the difference down to an engine that pushed harder
than predicted. The spacecraft was 10 897 kg lighter at cutoff: a quarter of its
mass, burnt in six minutes.

## 3. Rounding the orbit

::: info GET 080:11:36 · Lunar orbit insertion 2 (LOI-2)

:::

Two revolutions later, a 16.8 s burn of 48.4 m/s lowered the high point. The new
orbit was about 54 × 66 n mi (100 × 122 km), one revolution every two hours:

```ts
const lunarOrbit = R_MOON + ((53.8 + 65.7) / 2) * NM;
const rev = keplerPeriod(lunarOrbit, MU_MOON) / 60; // 118.8 min
```

Why not a circle? The Moon's gravity is lumpy, with dense masses under some of
its plains, and it changes an orbit as low as this one revolution after
revolution. The planners aimed for 53.7 × 65.7 n mi because their gravity model
predicted that the orbit would settle into a 60 n mi circle by the time Eagle
came back to rendezvous, saving the ascent stage propellant. It didn't quite:
the model predicted 59.3 × 59.9 n mi at 126 hours, and the orbit was 56.6 × 62.4
n mi.

## 4. Lowering Eagle's orbit

::: info GET 101:36:14 · Descent orbit insertion (DOI)

:::

On the 13th revolution, Eagle undocked from Columbia. Half a revolution later,
its descent engine fired for 30 s, 76.4 ft/s (23.3 m/s), and lowered its orbit's
low point from 60 n mi to 50 000 ft (15.2 km). That's the first half of a
Hohmann transfer, the cheapest way between two circular orbits:

```ts
import { hohmannTransfer } from '@interstellar-tools/equations';

const columbia = R_MOON + 60 * NM; // m
const pdi = R_MOON + 50_000 * FT; // m
const doi = hohmannTransfer(columbia, pdi, MU_MOON);
// doi.dv1 ≈ 21.8 m/s, doi.tTransfer ≈ 57.1 min
```

Half an orbit later, Eagle reached the low point, 15 km above the surface, and
started its descent there. Powered descent began 56 min 51 s after DOI, 17 s
short of the transfer's 57.1 minutes.

## 5. Powered descent

::: info GET 102:33:05 · Powered descent initiation (PDI)

:::

The best estimate puts Eagle 49 376 ft (15.05 km) up at ignition. Vis-viva, on
the transfer orbit, gives the speed it had to cancel:

```ts
import { thrustToWeight } from '@interstellar-tools/equations';

const rPdi = R_MOON + 49_376 * FT; // m
const vPdi = visVivaSpeed(rPdi, doi.at, MU_MOON); // 1 695 m/s
const gMoon = MU_MOON / R_MOON ** 2; // 1.62 m/s²
const m = 15_151; // kg, Eagle at PDI, 33 401.6 lb
const full = 0.925 * 46_706; // N, 92.5% of the rated 10 500 lbf

thrustToWeight(full, m, gMoon); // 1.76
thrustToWeight(full, m, 9.80665); // 0.29 on Earth
```

At full thrust the engine pushed with 1.76 times Eagle's lunar weight, so it
could slow down and hold Eagle up at the same time. Both took propellant: the
Mission Report gives 6 930 ft/s (2 112 m/s) for the descent, 417 m/s more than
the speed it cancelled. The difference went into holding Eagle up against the
Moon's gravity, the gravity loss, and into the last minutes of flying.

Those last minutes needed a gentle engine. When Eagle landed, it weighed 7 327
kg, 11.9 kN on the Moon: a quarter of the engine's rated thrust. The descent
engine could throttle down to a tenth of it. Thrust between 65% and 92.5% was
off limits, so the engine ran at a fixed full-thrust setting, 92.5%, until it
was time to throttle back.

::: info GET 102:45:40 · Landing

:::

Armstrong took over by hand to fly past a large crater, which used more
propellant than planned. The low-level light came on at 102:44:30.4, with about
116 s of firing left. Eagle touched down 69.5 s later, with about 46 s left; the
Mission Report gives 45. The go/no-go point for landing came 20 s before the
tanks would run dry: by then Eagle had to be landing, or the crew would abort.

## 6. Where they landed

Eagle landed several kilometres from its target. The Mission Report gives both
points in the same coordinate system: the target at 0.691° N, 23.72° E, and the
landing point at 0.647° N, 23.505° E.

```ts
import { greatCircleDistance } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const miss = greatCircleDistance(
  toRad(0.691),
  toRad(23.72),
  toRad(0.647),
  toRad(23.505),
  R_MOON
); // 6.65 km
```

::: practice Apollo 11, at Tranquility Base

**6.65 km**

_From the target, mostly west, along the surface_

_Apollo by the Numbers_ gives 22 500 ft (6.9 km) west of the target. The Mission
Report puts the miss down to errors in the onboard state vector before powered
descent: undocking and station keeping nudged Eagle, and the descent orbit
insertion didn't correct for it.

:::

Columbia couldn't see Eagle for most of each orbit. From 60 n mi up, the horizon
is about 605 km away along the surface, so Columbia had Eagle in view for at
most 13 minutes of every two hours:

```ts
import { horizonSurfaceDistance } from '@interstellar-tools/equations';

const s = horizonSurfaceDistance(60 * NM, R_MOON); // 605 km
const T = keplerPeriod(columbia, MU_MOON); // 118.9 min
const inView = ((2 * s) / R_MOON / (2 * Math.PI)) * T; // 13.2 min
```

Collins searched for Eagle through the sextant on several passes, with
coordinates from the ground, and never found it. He reported that he could scan
only one grid square in a pass.

<DocPhoto
  src="apollo-11/landing-site-lro.webp"
  alt="An orbital photo of the Apollo 11 landing site, with Eagle's descent stage and the astronauts' dark tracks"
  :width="1400"
  :height="1400"
  credit="NASA Goddard Space Flight Center"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:LRO_Gets_Additional_View_of_Apollo_11_Landing_Site_(4092985062).jpg">

Tranquility Base from the Lunar Reconnaissance Orbiter in 2009: Eagle's descent
stage is still there, with the crew's footpaths around it.

</DocPhoto>

## 7. Landing in the morning

The Sun was 10.8° above the eastern horizon when Eagle landed. That was by
design. Eagle came down from the east, from 39° E at ignition to 23.5° E, with
the Sun behind it. The planners wanted the Sun between 5° and 14° high, so that
craters cast shadows the crew could recognise them by. The Sun climbs about half
a degree an hour on the Moon, so the window at each landing site was open for
less than a day a month.

The angles between the ground, the Sun and the crew decide what they saw. Put
the Sun 10.8° up in the east, and Armstrong looking down at the landing point
from the east, along the descent's mean angle of 16°:

```ts
import { illuminationAngles } from '@interstellar-tools/maps';

const sun = toRad(10.8);
const look = toRad(16);
const lighting = illuminationAngles(
  [0, 0, 1], // the ground's normal: straight up
  [Math.cos(sun), 0, Math.sin(sun)], // towards the Sun, east is +x
  [Math.cos(look), 0, Math.sin(look)] // towards Eagle
);
// incidence 79.2°, emission 74.0°, phase 5.2°
const shadow = 1 / Math.tan(sun); // 5.2 m of shadow per metre of height
```

The **phase angle**, between the Sun and the viewer seen from the ground, was
only 5.2°. With the Sun almost directly behind you, every boulder hides its own
shadow, and the ground loses its contrast. The planners called it washout, and
it's why the Sun had to stay well below the descent angle.

Drag the Sun to see the shadows grow and shrink, and the phase angle close as
the Sun climbs towards the line of sight:

<ApolloSunPlot />

## 8. Standing on the Moon

Eagle came to rest tilted 4.5°, and a postflight simulation put its rock-up, the
extra tilt just after touchdown, at about 2°. How far could it have tilted
before falling over? Its footpads sat 167.57 in (4.256 m) from its axis, and its
centre of mass was 140.7 in (3.573 m) above the footpads at touchdown. Between
two of its four legs, the tipping edge is $R\cos 45°$ from the centre:

```ts
import { isStableLanding, tipOverAngle } from '@interstellar-tools/maps';

const R = 4.256; // m, footpad centre from the axis
const h = 3.573; // m, centre of mass above the footpads
const edge = R * Math.cos(Math.PI / 4); // 3.009 m
const limit = tipOverAngle(edge, h); // 40.1°
const stood = isStableLanding(toRad(4.5), toRad(2), edge, h); // true
```

::: practice Apollo 11, standing on the Moon

**33.6°**

_To spare: 6.5° of tilt and rock-up against a 40.1° limit_

The gear was designed for an effective slope of up to 12°. Eagle touched down at
2.1 ft/s sideways and 1.7 ft/s down, and its struts used about a tenth of the
energy their first stage could absorb.

:::

## 9. Try it yourself

- Brake straight into a 60 n mi circular orbit with one burn. How much does that
  cost, against LOI-1 and LOI-2 together?
- How far away is the horizon for an astronaut whose eyes are 1.7 m above the
  Moon? And on Earth?
- In the plot, find the Sun elevation where the phase angle is zero. Where are
  the shadows then?
- Apollo 15's lunar module came to rest tilted 11°. With Eagle's geometry, how
  much rock-up could it have survived?

Next: [IV. Lunar orbit rendezvous](/learn/apollo-11/lunar-orbit-rendezvous).
