[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GlobePointInterface

# Interface: GlobePointInterface

Defined in:
[tracking.ts:480](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L480)

A point on an **orthographic globe view**: where it falls on the disc, and
whether it's on the side facing the viewer.

Returned by `globeView` in `@interstellar-tools/tracking`.

::: info

- `x` and `y` are given for every point, so a renderer can fade the far side
  rather than leave it out; points with `visible` false sit behind the globe.
- Points on the edge of the disc, the horizon seen from the viewer, are visible.

:::

## Example

```ts
// The point at the centre of the view, on a globe of radius 1
const centre: GlobePointInterface = { x: 0, y: 0, visible: true };
```

## Properties

### visible

```ts
visible: boolean;
```

Defined in:
[tracking.ts:486](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L486)

Whether the point is on the near side of the globe.

---

### x

```ts
x: number;
```

Defined in:
[tracking.ts:482](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L482)

Distance right of the disc's centre, in the unit of the globe's radius.

---

### y

```ts
y: number;
```

Defined in:
[tracking.ts:484](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L484)

Distance up from the disc's centre, in the unit of the globe's radius.
