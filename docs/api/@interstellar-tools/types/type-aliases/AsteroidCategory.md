[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidCategory

# Type Alias: AsteroidCategory

```ts
type AsteroidCategory =
  | 'dwarf planet'
  | 'large asteroid'
  | 'small asteroid'
  | 'amor group'
  | 'apollo group'
  | 'aten group'
  | 'atira group'
  | 'cybele group'
  | 'hilda group'
  | 'jupiter trojan'
  | 'plutino'
  | 'cubewano'
  | 'scattered disk object';
```

Defined in:
[celestial-bodies/asteroids.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroids.ts#L46)

More specific **group/category** for dynamical families or special bodies.

::: info

Main-belt asteroids are _large_ or _small_, about 100 km across telling them
apart. Common near-Earth subgroups: Amor / Apollo / Aten / Atira. Outer
main-belt families: Cybele / Hilda. TNOs: Plutinos (2:3 resonance), "classical"
Kuiper belt objects (_cubewanos_), and _scattered disk_ objects.

:::
