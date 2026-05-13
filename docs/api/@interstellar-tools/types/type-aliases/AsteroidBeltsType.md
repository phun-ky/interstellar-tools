[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:48](https://github.com/phun-ky/interstellar-tools/blob/9a590e359f41c61543553d20e0721a387d85095b/packages/types/src/celestial-bodies/asteroid-belts.ts#L48)

Type alias for a collection of asteroid belts.

## Example

```ts
const asteroidBelt: AsteroidBeltInterface = [
  {
    name: 'Main Belt',
    innerRadius: 2.1,
    outerRadius: 3.3,
    color: '#888888',
    opacity: 0.5,
    density: 100
  }
];
```
