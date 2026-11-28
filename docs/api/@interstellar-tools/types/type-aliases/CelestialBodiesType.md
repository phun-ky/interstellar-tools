[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CelestialBodiesType

# Type Alias: CelestialBodiesType

```ts
type CelestialBodiesType = CelestialBodyType[];
```

Defined in:
[celestial-bodies/celestial-bodies.ts:21](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/celestial-bodies.ts#L21)

A list of celestial bodies of any kind: stars, planets, moons, comets and
asteroids, mixed. Interstellar objects aren't included: their open orbits have
their own type, `InterstellarObjectInterface`.

## Example

```ts
import { MOONS, PLANETS, STARS } from '@interstellar-tools/constants';

const solarSystem: CelestialBodiesType = [...STARS, ...PLANETS, ...MOONS];
const earth = solarSystem.find((body) => body.id === 'earth');
```
