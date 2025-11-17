[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / ASTEROID_BELTS

# Variable: ASTEROID_BELTS

```ts
const ASTEROID_BELTS: AsteroidBeltsType;
```

Defined in:
[bodies/asteroid-belts.ts:29](https://github.com/phun-ky/interstellar-tools/blob/1d94921ca8ba590fe5cb7f1f00da780f689f64aa/packages/constants/src/bodies/asteroid-belts.ts#L29)

Predefined asteroid belts in the solar system visualization.

::: info

- Radii are in astronomical units (au).
- `opacity` is a visual alpha in the range \[0..1].
- `density` is a relative visual density for rendering, not physical.

:::

## Full list of asteroid belts in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name               | innerRadius | outerRadius | color   | opacity | density |
| ------------------ | ----------- | ----------- | ------- | ------- | ------- |
| Main Asteroid Belt | 2.1         | 3.3         | #C4C4C4 | 0.3     | 0.8     |
| Kuiper Belt        | 30          | 50          | #88CCEE | 0.2     | 0.5     |

</div>

**Example item in dataset:**

```ts
{
  name: 'Main Asteroid Belt',
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
- https://en.wikipedia.org/wiki/Asteroid\_belt
- https://en.wikipedia.org/wiki/Kuiper\_belt
