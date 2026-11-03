# V. Coming home

On 22 July 1969, behind the Moon and out of contact with Earth, Columbia's
engine fired for two and a half minutes. Sixty hours later the command module
met the atmosphere at 11 km/s and splashed down in the Pacific, 3 km from its
target. In this chapter you'll fly that trip home: escaping the Moon, the long
fall back to Earth, and the last fifteen minutes through the air.

- **You'll use:** `burnTime`, `stateToElements`, `hyperbolicTimeOfFlight`,
  `trueToMeanAnomaly`, `ballisticPeakDeceleration`,
  `ballisticPeakDecelerationAltitude`, `stagnationHeatFlux`, `terminalVelocity`
- **Time:** about 15 minutes

<ApolloMissionMap :start="7" />

## 1. Leaving lunar orbit

::: info GET 135:23:42 · Trans-Earth injection (TEI)

:::

The command and service module weighed 16 767 kg at ignition and 12 153 kg at
cutoff, and the burn added 999 m/s. The Mission Report doesn't give the service
propulsion system's specific impulse, but the rocket equation does:

```ts
import { burnTime } from '@interstellar-tools/equations';

const g0 = 9.80665; // m/s²
const m0 = 16_767; // kg, at TEI ignition
const mf = 12_153; // kg, at cutoff
const dv = 999.4; // m/s, 3279 ft/s
const Isp = dv / (g0 * Math.log(m0 / mf)); // 316.7 s
const F = 91_189; // N, 20 500 lbf

burnTime(m0, dv, F, Isp); // 157 s
```

The flown burn took 151.4 s, 4% less: not bad for an engine’s rated thrust and a
specific impulse backed out of the masses.

## 2. Escaping the Moon

At cutoff, Columbia was 107.6 km up, moving at 2 617.9 m/s, 5.13° above the
horizontal. Write that as a state vector, with the Moon at the origin, and
`stateToElements` gives the orbit:

```ts
import {
  hyperbolicTimeOfFlight,
  stateToElements
} from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

const MU_MOON = 4.902800118e12; // m³/s²
const R_MOON = 1_737_400; // m
const r = R_MOON + 107_600; // m, 58.1 n mi up
const v = 2617.9; // m/s, 8589 ft/s
const fpa = (5.13 * Math.PI) / 180;
const tei = stateToElements(
  [r, 0, 0],
  [v * Math.sin(fpa), v * Math.cos(fpa), 0],
  MU_MOON
);
// tei.a ≈ -3 186 km, tei.e ≈ 1.58: a hyperbola
```

A negative semi-major axis and an eccentricity above 1: Columbia was on a
hyperbola, leaving the Moon for good with 1.24 km/s to spare. The burn ended
8.4° past the hyperbola's low point, 95.5 km up.

How long until the Moon lets go? The Moon's sphere of influence reaches about 62
600 km from its centre, where the Earth's pull takes over. Solve the orbit
equation for the true anomaly there and time the flight:

```ts
const p = tei.a * (1 - tei.e ** 2);
const soi = 62_600_000; // m
const nuSoi = Math.acos((p / soi - 1) / tei.e) as Radians;
const toSoi = hyperbolicTimeOfFlight(tei.nu, nuSoi, tei.e, tei.a, MU_MOON); // 12.3 h
```

The flown crossing came 12.7 h after cutoff. A two-body hyperbola leaves out the
Earth, which pulls on Columbia all the way out, so expect it to be a few percent
off.

## 3. Falling home

::: info GET 150:29:57 · Midcourse correction 5

:::

From the edge of the Moon's sphere, Earth's gravity pulled Columbia home for two
days. The only correction on the way was a 1.46 m/s nudge with the thrusters.
Then the command module separated from the service module and met the
atmosphere, 121.9 km up, at 11 032 m/s and 6.48° below the horizontal.

That's 99.6% of the escape speed there. The command module had fallen from about
the Moon's distance, and the orbit says so:

```ts
import { meanMotion, trueToMeanAnomaly } from '@interstellar-tools/equations';

const MU_EARTH = 3.986004418e14; // m³/s²
const R_EARTH = 6_378_166; // m
const rEI = R_EARTH + 121_920; // m, 400 000 ft
const vEI = 11_032; // m/s, 36 194.4 ft/s
const gamma = (-6.48 * Math.PI) / 180;
const home = stateToElements(
  [rEI, 0, 0],
  [vEI * Math.sin(gamma), vEI * Math.cos(gamma), 0],
  MU_EARTH
);
// home.a ≈ 424 204 km, home.e ≈ 0.9849
const perigee = home.a * (1 - home.e) - R_EARTH; // 38.5 km up
```

Without the atmosphere, the orbit's low point would have been 38.5 km up: the
air had to catch the command module, or it would have swung round Earth and back
out. Run the same orbit backwards to the edge of the Moon's sphere, about 322
000 km from Earth, and time the fall:

```ts
const pHome = home.a * (1 - home.e ** 2);
const rEdge = 322_000_000; // m
const nuEdge = (2 * Math.PI -
  Math.acos((pHome / rEdge - 1) / home.e)) as Radians; // inbound
const fall =
  (trueToMeanAnomaly(home.nu, home.e) - trueToMeanAnomaly(nuEdge, home.e)) /
  meanMotion(home.a, MU_EARTH); // 44.8 h
```

Apollo 11 took 46.9 h. This time the Moon is the body the two-body orbit leaves
out: it was behind Columbia, pulling it back, through the first part of the
fall. The orbit gives 1.24 km/s at the crossing; 14 minutes later, the public
affairs commentary gave 1.22 km/s.

## 4. Through the atmosphere

::: info GET 195:03:06 · Entry interface

:::

How hard would the air have braked a command module that just fell through it,
with no lift? Allen and Eggers worked it out for ballistic missiles in the
1950s: the peak depends only on the entry speed, the angle and the atmosphere's
scale height.

```ts
import {
  ballisticCoefficient,
  ballisticPeakDeceleration,
  ballisticPeakDecelerationAltitude
} from '@interstellar-tools/equations';

const H = 7200; // m, Earth's atmosphere as one exponential
const rho0 = 1.225; // kg/m³
const peak = ballisticPeakDeceleration(vEI, gamma, H) / g0; // 35.8 g
const beta = ballisticCoefficient(5486.4, 1.2891, 12.017); // 354 kg/m²
const where = ballisticPeakDecelerationAltitude(gamma, beta, rho0, H); // 38.9 km
```

The command module weighed 5 486 kg at entry, and at hypersonic speed its drag
coefficient was 1.2891 on a 12.02 m² reference area. That sets where the peak
comes, 38.9 km up, but not how hard it is.

::: practice Apollo 11, the deceleration

**35.8 g**

_A ballistic entry at 11.03 km/s and −6.48°_

The crew felt 6.56 g. The command module flew with lift: it trimmed its blunt
heat shield at an angle, which gave it a lift-to-drag ratio of 0.30, and it
rolled to point that lift up or down. Lift held it in the thin upper air for
longer, so it slowed down more gradually.

:::

Lift also steered. Bad weather moved the landing point, and the command module
flew 1 497 n mi (2 772 km) from entry interface to splashdown instead of the
planned 1 285 n mi, in 15½ minutes.

Change the angle to see how quickly the peak grows, and the ballistic
coefficient to see it move up and down without changing size:

<ApolloEntryPlot />

The plot also gives the heating at the stagnation point, where the air comes to
rest against the shield, with the Sutton–Graves relation and the shield's 4.661
m radius (183.5 in). That counts only the heat the hot gas conducts into the
shield. _Apollo by the Numbers_ gives 286 BTU/ft²/s (3.25 MW/m²) for the flown
peak, without saying where on the shield or what it includes, so don't compare
the two too closely.

## 5. Splashdown

::: info GET 195:18:35 · Splashdown

:::

Two 16.5 ft drogue parachutes opened at 195:12:06.9, about 24 000 ft up by
design, to steady the command module. At about 10 000 ft, again by design, three
83.5 ft ringsail mains took over. At terminal speed, drag balances weight:

```ts
import { terminalVelocity } from '@interstellar-tools/equations';

const FT = 0.3048; // m per foot
const landing = 4931.9; // kg, 10 873 lb
const canopy = (Math.PI / 4) * (83.5 * FT) ** 2; // 509 m² each
const Cd = (4200 * FT * FT) / canopy; // 0.77, from the 4200 ft² drag area
const three = terminalVelocity(landing, g0, 1.225, Cd, 3 * canopy); // 8.2 m/s
```

The design figure was 32 ft/s (9.75 m/s) on three parachutes. Adding up three
canopies' drag is optimistic: in a cluster they crowd each other. And the
parachutes were sized when the command module was expected to weigh up to 13 000
lb.

::: practice Apollo 11, under three parachutes

**8.2 m/s**

_The 4 932 kg command module at sea level, 30 km/h_

Columbia splashed down at 13.30° N, 169.15° W, 3.1 km from its target, 8 days, 3
hours and 18 minutes after liftoff.

:::

## 6. Try it yourself

- Enter at −5.5° instead of −6.48°. Where is the orbit's low point now, and
  would the atmosphere still catch the command module?
- One main parachute failed on Apollo 15. Work out the splashdown speed on two,
  and compare it with the design's 36 ft/s.
- Work out the entry angle that would give a ballistic body Apollo 11's 6.56 g.
  What would happen to an entry that shallow?

That's the trip home, and the whole mission. Back to the
[mission overview](/learn/apollo-11/).
