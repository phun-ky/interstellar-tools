[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / SYSTEMS

# Variable: SYSTEMS

```ts
const SYSTEMS: SystemsType;
```

Defined in:
[bodies/systems.ts:28](https://github.com/phun-ky/interstellar-tools/blob/c06f57d3cfb336eb6c129ce131fb20c7e37474f0/packages/constants/src/bodies/systems.ts#L28)

Predefined star systems in the galaxy.

::: info

- `distance` is in light-years (ly).

- `stars` lists the primary named stars in the system (referenced by name).

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
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
- https://en.wikipedia.org/wiki/Alpha_Centauri
