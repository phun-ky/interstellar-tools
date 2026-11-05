[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SpaceWeatherInterface

# Interface: SpaceWeatherInterface

Defined in:
[atmosphere.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L27)

The **space weather** an atmosphere model needs: how strongly the Sun heats the
upper atmosphere, and how stirred up Earth's magnetic field is. Above about 200
km they change the air density tenfold.

Taken by `nrlmsise00` in `@interstellar-tools/equations`.

::: info

- **F10.7** is the Sun's radio flux at 10.7 cm, in solar flux units (10⁻²²
  W/m²/Hz), a measure of its ultraviolet output: about 70 at solar minimum and
  200 or more at maximum.
- **Ap** measures geomagnetic activity: 4 on a quiet day, 40 or more in a storm.
- The library fetches nothing: NOAA's Space Weather Prediction Center and
  CelesTrak publish both, observed and forecast.

:::

## Example

```ts
// Moderate solar activity, a quiet day
const weather: SpaceWeatherInterface = { f107: 150, f107a: 150, ap: 4 };
```

## Properties

### ap

```ts
ap: number;
```

Defined in:
[atmosphere.ts:33](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L33)

Daily Ap index.

---

### apHistory?

```ts
apHistory?: readonly [number, number, number, number, number, number, number];
```

Defined in:
[atmosphere.ts:39](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L39)

The 3-hour Ap history, for storms: daily Ap; the 3-hour Ap now, 3, 6 and 9 hours
before; and the averages of the eight 3-hour values 12 to 33 and 36 to 57 hours
before. When given, it's used instead of `ap`.

---

### f107

```ts
f107: number;
```

Defined in:
[atmosphere.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L29)

Daily F10.7 for the previous day, in solar flux units, at Earth's distance from
the Sun.

---

### f107a

```ts
f107a: number;
```

Defined in:
[atmosphere.ts:31](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L31)

81-day average of F10.7, centred on the day, in solar flux units.
