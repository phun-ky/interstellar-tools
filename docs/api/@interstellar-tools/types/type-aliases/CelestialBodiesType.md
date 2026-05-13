[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CelestialBodiesType

# Type Alias: CelestialBodiesType

```ts
type CelestialBodiesType =
  | StarsType
  | PlanetsType
  | MoonsType
  | CometsType
  | AsteroidsType;
```

Defined in:
[celestial-bodies/celestial-bodies.ts:27](https://github.com/phun-ky/interstellar-tools/blob/35f800ffc1b22e0603f50ab5a1f6c25642ba9a3e/packages/types/src/celestial-bodies/celestial-bodies.ts#L27)

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
