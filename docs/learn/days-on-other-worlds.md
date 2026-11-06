# How long is a day on Mars?

A day on Earth is 24 hours, but Earth turns once in 23 hours and 56 minutes. The
missing 4 minutes are the start of a story that ends with a different day on
every world: two years long on Mercury, backwards on Venus, two weeks of night
on the Moon, and 40 minutes longer than ours on Mars, where rovers keep their
own clocks. In this tutorial you'll work out each of them, and what time it is
on Mars right now.

- **You'll use:** `PLANETS`, `MOONS`, `solarDayLength`, `marsSolDate`,
  `coordinatedMarsTime`, `marsLocalMeanSolarTime`, `missionSol`
- **Time:** about 10 minutes

## 1. Two kinds of day

Earth turns once against the stars in 23 h 56 m 4 s. That's its **sidereal
day**, and `PLANETS` gives it, as for every planet:

```ts
import { PLANETS } from '@interstellar-tools/constants';

const earth = PLANETS.find(({ id }) => id === 'earth')!;
// { value: 0.9972696632, unit: 'd' }: 23 h 56 m 4.1 s
const turn = earth.rotation!.period;
```

But noon to noon takes 24 hours, the **solar day**. While Earth turns, it also
moves about a degree along its orbit, so after one turn the Sun isn't quite
where it was in the sky. Earth has to turn about a degree more, 4 minutes, to
bring the Sun back:

<SolarDayFigure>

One turn against the stars brings the planet back to facing the same way, but it
has moved along its orbit, so it has to turn a little more to face the Sun
again. The step along the orbit is exaggerated: Earth's is about a degree a day.

</SolarDayFigure>

In a year, Earth turns one more time against the stars than there are days. The
rates subtract, and `solarDayLength` does it:

$$
\frac{1}{S} = \left\lvert \frac{1}{P} - \frac{1}{T} \right\rvert
$$

where $P$ is the sidereal day and $T$ the orbital period:

```ts
import { solarDayLength } from '@interstellar-tools/equations';

// 1.0000 days: 24 h
const day = solarDayLength(turn.value, earth.orbit!.period.value);
```

## 2. A day on every world

The same subtraction, with each world's turn and year, gives a day on each of
them. A world that spins backwards, against its orbit, takes a negative $P$:

```ts
// Each world's solar day, in days
const days = PLANETS.map(({ name, rotation, orbit }) => {
  const sign = rotation!.retrograde ? -1 : 1;
  const P = sign * rotation!.period.value;

  return { name, day: solarDayLength(P, orbit!.period.value) };
});
```

| World   | Turns in (sidereal day)   | Year         | Solar day      |
| ------- | ------------------------- | ------------ | -------------- |
| Mercury | 58.65 days                | 87.97 days   | 175.94 days    |
| Venus   | 243.02 days, backwards    | 224.70 days  | 116.75 days    |
| Earth   | 23 h 56 m 4 s             | 365.26 days  | 24 h 0 m 0 s   |
| Moon    | 27.32 days                | 365.26 days  | 29.53 days     |
| Mars    | 24 h 37 m 23 s            | 686.98 days  | 24 h 39 m 35 s |
| Jupiter | 9 h 55 m 30 s             | 11.86 years  | 9 h 55 m 33 s  |
| Saturn  | 10 h 39 m 22 s            | 29.46 years  | 10 h 39 m 24 s |
| Uranus  | 17 h 14 m 24 s, backwards | 84.02 years  | 17 h 14 m 23 s |
| Neptune | 15 h 57 m 59 s            | 164.79 years | 15 h 57 m 59 s |

- **Mercury** turns three times for every two of its years, and the subtraction
  leaves a day exactly two years long: 176 Earth days from sunrise to sunrise.
  Close to perihelion its orbit outruns its spin, and the Sun stops in the sky
  and goes back for a few days before carrying on.
- **Venus** spins backwards, so the rates add, and its day, 117 Earth days, is
  shorter than its turn of 243. The Sun rises in the west, and a Venus year has
  fewer than two of its days.
- **The Moon** keeps one face to Earth, so it turns once a month. Its "year" is
  Earth's, and the subtraction gives the 29.5-day **lunar day**: two weeks of
  sunlight, then two weeks of night. Landers there have to survive the nights,
  down to about −190 °C: China's Chang'e 3 and 4 landers sleep through them,
  kept warm by the heat of radioactive decay.
- **The giant planets** turn so fast, and orbit so slowly, that their days and
  turns differ by seconds. They have no surface to watch turning: Jupiter's and
  Uranus's turns are measured from the radio signals of their magnetic fields,
  and Neptune's from long-lived features in its clouds. Saturn's magnetic field
  is lined up with its axis and hides its spin: its radio signals give a turn of
  10 h 39 m, and the waves in its rings one of 10 h 34 m.

## 3. The Martian sol

A day on Mars is called a **sol**, and it's 24 h 39 m 35.244 s: close enough to
ours that people can live by it, and far enough that they notice. For the first
months of a mission, a rover's team works on Mars time, starting 40 minutes
later every Earth day, so their day matches the rover's.

```ts
import { MARS_SOL_SECONDS, MARS_SOL_DAYS } from '@interstellar-tools/constants';

const sol = MARS_SOL_SECONDS; // 88 775.244 s
const inDays = MARS_SOL_DAYS; // 1.0274912517 Earth days
// A Mars hour: 3 699 s, 1 h 1 m 39 s
const hour = MARS_SOL_SECONDS / 24;
```

Mars's clocks keep a 24-hour sol, so its hours, minutes and seconds are all 2.7%
longer than ours.

## 4. What time is it on Mars?

**The Mars Sol Date** counts sols, like the Julian date counts days on Earth. It
started on 29 December 1873, and its fraction is the time of sol at Mars's prime
meridian, the small crater Airy-0. That time is **Coordinated Mars Time**,
Mars's UTC:

```ts
import { coordinatedMarsTime, marsSolDate } from '@interstellar-tools/temporal';

const date = new Date('2026-11-24T12:00:00Z');
const msd = marsSolDate(date); // 54 352.772
// 18.53 Mars hours: 18:31 at Airy-0
const mtc = coordinatedMarsTime(date);
```

Further east it's later, an hour for every 15° of longitude, like time zones on
Earth. Curiosity is in Gale crater at 137.4° E, and Perseverance in Jezero
crater at 77.4° E:

```ts
import { marsLocalMeanSolarTime } from '@interstellar-tools/temporal';
import type { Radians } from '@interstellar-tools/types';

const DEG = Math.PI / 180;
const GALE = (137.42 * DEG) as Radians;
const JEZERO = (77.43 * DEG) as Radians;
// 3.69 Mars hours: 03:41 in Gale crater
const gale = marsLocalMeanSolarTime(date, GALE);
// 23.69 Mars hours: 23:41 in Jezero crater
const jezero = marsLocalMeanSolarTime(date, JEZERO);
```

This is **mean** solar time, kept by a Sun that crosses the sky evenly. The real
Sun runs up to about 50 minutes ahead of it or behind it through the Martian
year, more than on Earth, because Mars's orbit is more eccentric.

## 5. Counting sols

Rovers count their sols from landing, and each new sol starts at local midnight.
Curiosity and Perseverance call their landing sol 0; Spirit and Opportunity, in
2004, called theirs sol 1. `missionSol` counts them:

```ts
import { missionSol } from '@interstellar-tools/temporal';

const CURIOSITY_LANDED = new Date('2012-08-06T05:17:57Z');
const PERSEVERANCE_LANDED = new Date('2021-02-18T20:43:48.818Z');
// Sol 5 084 for Curiosity, and sol 2 048 for Perseverance
const curiosity = missionSol(date, CURIOSITY_LANDED, GALE);
const perseverance = missionSol(date, PERSEVERANCE_LANDED, JEZERO);
```

It agrees with the sols NASA has dated: Curiosity's sol 1 000 fell on 30 May
2015, and Opportunity's last contact, on 10 June 2018, came on its sol 5 111,
more than 14 years into a mission planned for 90 sols.

And here is the time on Mars now, from the same functions:

<MarsClock>

The time now at Mars's prime meridian, and at the two working rovers, each on
its own mission's sol count. It ticks in your browser.

</MarsClock>

## What you've learned

- A planet's **sidereal day**, one turn against the stars, isn't its **solar
  day**, sunrise to sunrise: the orbit adds a little, and `solarDayLength` works
  it out. A backwards spin, like Venus's, takes a little away.
- The difference is a few minutes on Earth and Mars, seconds on the giant
  planets, and everything on Mercury, Venus and the Moon.
- Mars runs on **sols** of 24 h 39 m 35 s, with its own date, the Mars Sol Date,
  and its own UTC, Coordinated Mars Time at Airy-0.
- Rovers count sols from landing, each starting at local midnight.

To go further, the
[`PLANETS`](/api/@interstellar-tools/constants/variables/PLANETS) and
[`MOONS`](/api/@interstellar-tools/constants/variables/MOONS) datasets have the
rotation of every planet and most moons, and the
[Mars landing site tutorial](/learn/choose-a-landing-site-on-mars) picks a spot
in Jezero crater, where Perseverance landed.
