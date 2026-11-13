[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / RING_DISPLAY

# Variable: RING_DISPLAY

```ts
const RING_DISPLAY: ByBodyIdType<RingDisplayType>;
```

Defined in:
[bodies/ring-display.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/ring-display.ts#L17)

How to **draw the giant planets' rings**, keyed by planet id: each as opaque as
its densest ring, with Saturn's colour measured from Cassini's images and the
others' assumed. `derivation` says which.

Kept apart from [PLANETS](PLANETS.md);
[withDisplay](../functions/withDisplay.md) puts them back, as the planets'
`display.rings`.

## Example

```ts
RING_DISPLAY.saturn.rings?.opacity; // 0.93
```
