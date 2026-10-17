[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:54](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/asteroid-belts.ts#L54)

Type alias for a collection of asteroid belts.

## Example

```ts
const asteroidBelts: AsteroidBeltsType = [
  {
    id: 'main-asteroid-belt',
    name: 'Main Belt',
    parent: 'sun',
    innerRadius: 2.1,
    outerRadius: 3.3,
    color: '#888888',
    opacity: 0.5,
    density: 100
  }
];
```
