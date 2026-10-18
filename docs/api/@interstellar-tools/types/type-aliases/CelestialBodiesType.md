[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CelestialBodiesType

# Type Alias: CelestialBodiesType

```ts
type CelestialBodiesType = CelestialBodyType[];
```

Defined in:
[celestial-bodies/celestial-bodies.ts:20](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/celestial-bodies.ts#L20)

A list of celestial bodies of any kind: stars, planets, moons, comets and
asteroids, mixed.

## Example

```ts
import { MOONS, PLANETS, STARS } from '@interstellar-tools/constants';

const solarSystem: CelestialBodiesType = [...STARS, ...PLANETS, ...MOONS];
const earth = solarSystem.find((body) => body.id === 'earth');
```
