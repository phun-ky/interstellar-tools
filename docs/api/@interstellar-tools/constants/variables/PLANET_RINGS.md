[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / PLANET_RINGS

# Variable: PLANET_RINGS

```ts
const PLANET_RINGS: ByBodyIdType<Pick<PlanetObservationsInterface, 'rings'>>;
```

Defined in:
[bodies/rings.ts:315](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/rings.ts#L315)

The **rings** of Jupiter, Saturn, Uranus and Neptune, keyed by planet id: each
ring's edges and optical depth, and Saturn's named gaps, from the PDS Ring-Moon
Systems Node and NASA NSSDCA.

Kept apart from [PLANETS](PLANETS.md), so an app loads them only when it shows
them. [withObservations](../functions/withObservations.md) puts them on the
planets, as their `observations.rings`; see `PLANETS` for how they were chosen.

## Example

```ts
PLANET_RINGS.saturn.rings?.rings.length; // 9
```
