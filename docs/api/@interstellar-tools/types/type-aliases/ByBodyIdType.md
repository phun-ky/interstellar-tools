[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ByBodyIdType

# Type Alias: ByBodyIdType\<T>

```ts
type ByBodyIdType<T> = Readonly<Record<string, T>>;
```

Defined in:
[celestial-bodies/observation-groups.ts:20](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/observation-groups.ts#L20)

Observations and drawing groups **apart from the bodies**, keyed by body id, as
`@interstellar-tools/constants` exports them: `STAR_PARAMETERS`, `PLANET_RINGS`
and the like.

Kept apart, an app loads only the groups it imports: a bundler leaves the rest
out.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Example

```ts
const luminosities: ByBodyIdType<number> = { sun: 1, vega: 40.12 };

luminosities.vega; // 40.12
```
