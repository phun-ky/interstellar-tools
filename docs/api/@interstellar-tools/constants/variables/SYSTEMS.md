[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / SYSTEMS

# Variable: SYSTEMS

```ts
const SYSTEMS: SystemsType;
```

Defined in:
[bodies/systems.ts:27](https://github.com/phun-ky/interstellar-tools/blob/e0d1c79e960d3afdb9582e7e5268537167cd33ae/packages/constants/src/bodies/systems.ts#L27)

Predefined star systems in the galaxy.

::: info

- `distance` is in light-years (ly).
- `stars` lists the primary named stars in the system (referenced by name).

:::

## Full list of systems in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| name           | stars                                                                                                                            | distance |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Solar System   | <ul class="ph"><li class="ph">Sun</li></ul>                                                                                      | 0        |
| Alpha Centauri | <ul class="ph"><li class="ph">Alpha Centauri A</li><li class="ph">Alpha Centauri B</li><li class="ph">Proxima Centauri</li></ul> | 4.37     |

</div>

**Example item in dataset:**

```ts
{
  name: 'Alpha Centauri',
  stars: ['Alpha Centauri A', 'Alpha Centauri B', 'Proxima Centauri'],
  distance: 4.37
}
```

## Example

```ts
console.log(SYSTEMS[0].name); // "Solar System"
```

## See

- [SystemsType](../../types/type-aliases/SystemsType.md)
- https://en.wikipedia.org/wiki/Alpha\_Centauri
