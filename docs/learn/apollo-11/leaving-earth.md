# I. Leaving Earth

At 13:32 UTC on 16 July 1969, a 2 938-tonne Saturn V lifted off Pad 39A. Less
than 12 minutes later, less than 5% of it was in orbit; less than three hours
later, the S-IVB third stage lit again and sent Apollo 11 towards the Moon. In
this chapter you'll fly that climb: where the pad is, what the three stages
gave, the parking orbit and trans-lunar injection.

- **You'll use:** `geodeticToBodyFixed`, `surfaceRotationSpeed`,
  `thrustToWeight`, `rocketDeltaVFromIsp`, `keplerPeriod`, `circularSpeed`,
  `inclinationFromLaunchAzimuth`, `launchAzimuthForInclination`,
  `rotatingLaunchAzimuth`, `burnTime`
- **Time:** about 15 minutes

<ApolloMissionMap :start="0" />

## 1. On the pad

::: info GET 000:00:00 · Liftoff

:::

Pad 39A is at 28.608422° N, 80.604133° W. Those are **geodetic** coordinates,
the ones on maps: the latitude is the angle of the ground's normal, and on an
oblate Earth the normal doesn't point at the centre. The orbit formulas need the
**geocentric** latitude, the angle seen from the centre, and the distance from
it:

```ts
import {
  geodeticToBodyFixed,
  surfaceRotationSpeed
} from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

const A = 6_378_137; // m, WGS 84 equatorial radius
const E2 = 0.00669437999014; // WGS 84 eccentricity squared
const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const [x, y, z] = geodeticToBodyFixed(
  toRad(28.608422),
  toRad(-80.604133),
  0,
  A,
  E2
);
const R = Math.hypot(x, y, z); // 6 373 266 m from the centre
const lat = Math.atan2(z, Math.hypot(x, y)) as Radians; // 28.447° geocentric

surfaceRotationSpeed(lat, R, 7.292115e-5); // 408.6 m/s eastward
```

Before the engines lit, the pad was already carrying the rocket east at 408.6
m/s, 5% of the speed it needed for orbit.

<ApolloLatitudePlot />

## 2. Liftoff

The Saturn V weighed 2 899 t when the hold-down arms let go, and its five F-1
engines were rated at 7 610 000 lbf together:

```ts
import { thrustToWeight } from '@interstellar-tools/equations';

thrustToWeight(7_610_000 * 4.448222, 2_899_008, 9.80665); // 1.19
```

A thrust-to-weight ratio of 1.19 is a slow start: the rocket accelerated at only
0.19 g at first. It grew quickly as the propellant burned. The rocket went
supersonic at 66.3 s, 7.8 km up, and met the heaviest air load, the **maximum
dynamic pressure** of 35.2 kPa (735 lbf/ft²), at 83.0 s and 13.6 km.

## 3. Three stages

The rocket equation gives what each stage could add, from its mass at ignition
and cutoff in the flight evaluation report and its specific impulse:

```ts
import { rocketDeltaVFromIsp } from '@interstellar-tools/equations';

const sIC = rocketDeltaVFromIsp(264, 2_899_008, 827_292); // 3 246 m/s
const sII = rocketDeltaVFromIsp(423.2, 658_363, 213_888); // 4 666 m/s
const sIVB = rocketDeltaVFromIsp(428.7, 166_571, 135_182); // 878 m/s
```

| Stage             | Burn      | Rocket equation | Gained in flight |
| ----------------- | --------- | --------------- | ---------------- |
| S-IC              | 0–162 s   | 3 246 m/s       | about 2 355 m/s  |
| S-II              | 166–548 s | 4 666 m/s       | 4 152 m/s        |
| S-IVB, first burn | 552–699 s | 878 m/s         | 875 m/s          |
| **Total**         |           | **8 790 m/s**   | **7 383 m/s**    |

The gains are the space-fixed speeds at each cutoff: 2 764.1, 6 916.1 and 7
791.2 m/s, starting from the pad's 408.6 m/s. That's rough for the first stage,
because the pad moved due east and the rocket flew 18° north of that.

About 1.4 km/s went missing, nearly all of it in the first two stages, which
spent minutes climbing against gravity, through the air. The S-IVB burned almost
horizontally, above the atmosphere, and lost almost nothing. Of the 2 899 t at
liftoff, 135 t reached orbit: the S-IVB and the spacecraft.

## 4. Parking orbit

::: info GET 000:11:49 · Earth orbit insertion

:::

At insertion, Apollo 11 was 191.1 km up, at 32.672° N geodetic, moving at 7
793.1 m/s, heading 88.848°: almost due east, near the northernmost point of its
track. That's a nearly circular orbit, 186.0 × 183.2 km:

```ts
import { circularSpeed, keplerPeriod } from '@interstellar-tools/equations';

const MU_EARTH = 3.986004418e14; // m³/s²
const [xi, yi, zi] = geodeticToBodyFixed(
  toRad(32.672),
  toRad(-52.694),
  191_100,
  A,
  E2
);
const r = Math.hypot(xi, yi, zi); // 6 563 041 m
const insertion = Math.atan2(zi, Math.hypot(xi, yi)) as Radians; // 32.502°
const period = keplerPeriod(6_378_165 + 184_600, MU_EARTH) / 60; // 88.18 min

circularSpeed(r, MU_EARTH); // 7 793.2 m/s
```

The circular speed at that distance is 7 793.2 m/s, 0.1 m/s from the flown
value, and the period matches the flown 88.18 minutes. Measured from a spherical
Earth of 6 378.165 km, as the report does, the insertion point was 184.9 km up,
inside the 183.2 to 186.0 km the orbit spanned.

The latitude at insertion also fixes the orbit's tilt. Heading almost due east
from 32.502° geocentric, an orbit can't be inclined less than that:

```ts
import { inclinationFromLaunchAzimuth } from '@interstellar-tools/equations';

inclinationFromLaunchAzimuth(insertion, toRad(88.848)); // 32.521°
```

::: practice Apollo 11, entering Earth orbit

**32.521°**

_From 32.502° geocentric and a heading of 88.848°_

The flown parking orbit was inclined 32.521°. With the geodetic latitude,
32.672°, the formula would give 32.69°; with the geocentric latitude of the
point on the surface below, 32.497°, it gives 32.516°. The height matters.

:::

The plane is the same one the rocket aimed for from the pad. At 28.447°
geocentric, an orbit inclined 32.521° needs an inertial azimuth of 73.53°, and
over the moving ground that's 72.6°:

```ts
import {
  launchAzimuthForInclination,
  rotatingLaunchAzimuth
} from '@interstellar-tools/equations';

const { northbound } = launchAzimuthForInclination(lat, toRad(32.521)); // 73.53°

rotatingLaunchAzimuth(northbound, 7793.1, 408.6); // 72.6° over the ground
```

The roll programme turned the Saturn V to a flight azimuth of 72.058° in its
first half-minute. The guidance kept steering all the way to orbit, so a flat,
local estimate within 0.6° of it is as close as you can expect.

## 5. Trans-lunar injection

::: info GET 002:44:16 · Trans-lunar injection

:::

After one and three-quarter orbits of checks, the S-IVB lit for the second time.
It weighed 134 046 kg at ignition and 63 189 kg at cutoff:

```ts
import { burnTime } from '@interstellar-tools/equations';

const tli = rocketDeltaVFromIsp(428.7, 134_046, 63_189); // 3 162 m/s
const F = 894_400; // N, the J-2's thrust on this burn

burnTime(134_046, tli, F, 428.7); // 333 s
```

The Mission Report gives 3 182 m/s in 347.3 s. The rocket equation is less than
1% short and the burn time 4% short: the thrust here is the value at one moment
of the burn, not its average. Ten seconds after cutoff, Apollo 11 was 334.4 km
up at 10 834.3 m/s, on the long ellipse that
[chapter II](/learn/apollo-11/coasting-to-the-moon) follows to the Moon.

## 6. Try it yourself

- Launch from Kourou, at 5.236° N geodetic, into the same 32.521° orbit. How
  much more help does Earth's rotation give, and what does the azimuth become?
- Pad 39A at 28.608° geodetic is 0.161° from its geocentric latitude. Where on
  Earth is the difference largest, and how big is it?
- The flight evaluation report gives the S-II's engines specific impulses of
  423.9 to 425.3 s, a little above the stage's 423.2 s. Use 425 s: how much does
  the stage's Δv change, and is that enough to explain its losses?

Next: [II. Coasting to the Moon](/learn/apollo-11/coasting-to-the-moon).
