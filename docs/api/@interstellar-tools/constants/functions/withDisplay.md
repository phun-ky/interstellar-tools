[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / withDisplay

# Function: withDisplay()

```ts
function withDisplay<
  B extends {
    display?: object;
    id: string;
  }
>(
  bodies: readonly B[],
  ...groups: Readonly<Record<string, Partial<NonNullable<B['display']>>>>[]
): B[];
```

Defined in:
[bodies/with-observations.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/with-observations.ts#L81)

The bodies, with **drawing groups kept apart** put back on them: each body's
entry in each group is merged into its `display`, beside its colour.

## Type Parameters

| Type Parameter                                                                        |
| ------------------------------------------------------------------------------------- |
| <a id="type-parameter-b"></a> `B` _extends_ { `display?`: `object`; `id`: `string`; } |

## Parameters

| Parameter   | Type                                                                                                                                                                                                                                                                                                                                                                                                                | Description                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `bodies`    | readonly `B`\[]                                                                                                                                                                                                                                                                                                                                                                                                     | The bodies, such as `PLANETS`.                                                         |
| ...`groups` | [`Readonly`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<[`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<`string`, [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)<[`NonNullable`](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)<`B`\[`"display"`]>>>>\[] | Groups keyed by body id, each a part of the bodies' `display`, such as `RING_DISPLAY`. |

## Returns

`B`\[]

The bodies, with their `display` filled in.

## Example

```ts
const planets = withDisplay(PLANETS, RING_DISPLAY);

planets.find(({ id }) => id === 'saturn')?.display?.rings?.color; // '#cabcba'
```

## See

withObservations
