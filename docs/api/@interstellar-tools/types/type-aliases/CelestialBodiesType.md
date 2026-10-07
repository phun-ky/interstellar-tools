[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CelestialBodiesType

# Type Alias: CelestialBodiesType

```ts
type CelestialBodiesType =
  StarsType | PlanetsType | MoonsType | CometsType | AsteroidsType;
```

Defined in:
[celestial-bodies/celestial-bodies.ts:27](https://github.com/phun-ky/interstellar-tools/blob/ca19b3ee4d96f8365482f3870f73960191b1923c/packages/types/src/celestial-bodies/celestial-bodies.ts#L27)

Type alias representing a collection of celestial bodies.

Includes:

- **Stars** (`StarsType`)
- **Planets** (`PlanetsType`)
- **Moons** (`MoonsType`)
- **Comets** (`CometsType`)

## Example

```ts
const celestialObjects: CelestialBodiesType = [
  { name: 'Sun', type: 'star', mass: 1.989e30 },
  { name: 'Earth', type: 'planet', mass: 5.972e24 }
];
```
