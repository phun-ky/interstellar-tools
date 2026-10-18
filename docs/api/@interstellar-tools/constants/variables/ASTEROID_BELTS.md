[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / ASTEROID_BELTS

# Variable: ASTEROID_BELTS

```ts
const ASTEROID_BELTS: AsteroidBeltsType;
```

Defined in:
[bodies/asteroid-belts.ts:30](https://github.com/phun-ky/interstellar-tools/blob/2ea6b45c51014fcd4fd3a03de0d657fe18112efa/packages/constants/src/bodies/asteroid-belts.ts#L30)

Predefined asteroid belts in the solar system visualization.

::: info

- Radii are in astronomical units (au).

- `opacity` is a visual alpha in the range \[0..1].

- `density` is a relative visual density for rendering, not physical.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of asteroid belts in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id                 | name               | parent | innerRadius | outerRadius | color   | opacity | density |
| ------------------ | ------------------ | ------ | ----------- | ----------- | ------- | ------- | ------- |
| main-asteroid-belt | Main Asteroid Belt | sun    | 2.1         | 3.3         | #C4C4C4 | 0.3     | 0.8     |
| kuiper-belt        | Kuiper Belt        | sun    | 30          | 50          | #88CCEE | 0.2     | 0.5     |

</div>

**Example item in dataset:**

```ts
{
  id: 'main-asteroid-belt',
  name: 'Main Asteroid Belt',
  parent: 'sun',
  innerRadius: 2.1,
  outerRadius: 3.3,
  color: '#C4C4C4', // Light gray (rocky bodies)
  opacity: 0.3,
  density: 0.8
},
```

## Example

```ts
console.log(ASTEROID_BELTS[0].name); // "Main Asteroid Belt"
```

## See

- [AsteroidBeltsType](../../types/type-aliases/AsteroidBeltsType.md).
- https://en.wikipedia.org/wiki/Asteroid_belt
- https://en.wikipedia.org/wiki/Kuiper_belt
