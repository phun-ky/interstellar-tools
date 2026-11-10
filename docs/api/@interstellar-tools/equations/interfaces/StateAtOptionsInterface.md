[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / StateAtOptionsInterface

# Interface: StateAtOptionsInterface

Defined in:
[orbits/state-at.ts:22](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/state-at.ts#L22)

Options for [stateAt](../functions/stateAt.md).

## Properties

### frame?

```ts
frame?: "icrf" | "reference";
```

Defined in:
[orbits/state-at.ts:33](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/state-at.ts#L33)

The frame to give the state in:

- `'icrf'` (the default): the ICRF, the J2000 equator and equinox, through
  [orbitFrameToIcrf](../functions/orbitFrameToIcrf.md). The orbit needs a
  `frame` that can be placed there.
- `'reference'`: the coordinates of the orbit's own reference plane, `x` to
  where its `om` is counted from and `z` to its pole. An orbit without `i` is
  drawn flat in it, with `x` to its periapsis.
