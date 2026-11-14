[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / withObservations

# Function: withObservations()

```ts
function withObservations<
  B extends {
    id: string;
    observations?: object;
  }
>(
  bodies: readonly B[],
  ...groups: Readonly<Record<string, Partial<NonNullable<B['observations']>>>>[]
): B[];
```

Defined in:
[bodies/with-observations.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/with-observations.ts#L58)

The bodies, with **observations kept apart** put on them: each body's entry in
each group is merged into its `observations`.

The datasets export what is measured about the bodies apart from them, keyed by
id, so an app loads only the groups it imports: `STAR_PARAMETERS`,
`STAR_ASTROMETRY`, `HELIOSPHERE`, `PLANET_RINGS`, `MOON_RING_ROLES`,
`INTERSTELLAR_OBJECT_OBSERVATIONS` and `DISCOVERIES`. This puts them on the
bodies, for an app that wants everything in one object.

::: info Notes

- The bodies aren't changed: the ones with an entry are copied, the rest are
  returned as they are.
- Later groups win where two give the same field.

:::

## Type Parameters

| Type Parameter                                                                             |
| ------------------------------------------------------------------------------------------ |
| <a id="type-parameter-b"></a> `B` _extends_ { `id`: `string`; `observations?`: `object`; } |

## Parameters

| Parameter   | Type                                                                                                                                                                                                                                                                                                                                                                                                                     | Description                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `bodies`    | readonly `B`\[]                                                                                                                                                                                                                                                                                                                                                                                                          | The bodies, such as `STARS`.                                        |
| ...`groups` | [`Readonly`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<[`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<`string`, [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)<[`NonNullable`](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)<`B`\[`"observations"`]>>>>\[] | Groups keyed by body id, each a part of the bodies' `observations`. |

## Returns

`B`\[]

The bodies, with their `observations` filled in.

## Example

```ts
const stars = withObservations(STARS, STAR_PARAMETERS, STAR_ASTROMETRY);

stars.find(({ id }) => id === 'vega')?.observations?.luminosity?.value; // 40.12
```

## See

withDisplay
