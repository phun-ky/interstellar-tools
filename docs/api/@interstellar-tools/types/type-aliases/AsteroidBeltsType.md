[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:48](https://github.com/phun-ky/interstellar-tools/blob/e65544aea271229b4c0d436323be6ad724504019/packages/types/src/celestial-bodies/asteroid-belts.ts#L48)

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
