[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidType

# Type Alias: AsteroidType

```ts
type AsteroidType =
  | 'main-belt asteroid'
  | 'near-earth asteroid'
  | 'trojan asteroid'
  | 'centaur'
  | 'trans-neptunian object';
```

Defined in:
[celestial-bodies/asteroids.ts:23](https://github.com/phun-ky/interstellar-tools/blob/67f4eb8ba20d421a65a56d0a4b194110e4445a49/packages/types/src/celestial-bodies/asteroids.ts#L23)

High-level **orbital class** of an asteroid (by dynamical region).

::: info

These labels group objects by where they reside or co-orbit:

- _Main-belt_ (between Mars and Jupiter)
- _Near-Earth_ (perihelion near Earth’s orbit)
- _Trojan_ (co-orbital with a planet at L4/L5)
- _Centaur_ (between Jupiter and Neptune)
- _Trans-Neptunian Object_ (beyond Neptune)

:::
