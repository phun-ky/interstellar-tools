[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / HELIOSPHERE

# Variable: HELIOSPHERE

```ts
const HELIOSPHERE: AstrosphereInterface;
```

Defined in:
[bodies/heliosphere.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/heliosphere.ts#L34)

The Sun's **heliosphere**, the bubble the solar wind blows into the interstellar
medium: the heliopause's distance towards the nose, on the flanks and down the
tail, the interstellar wind's direction and speed, and the Voyagers' crossings
of its boundaries.

Kept apart from [STARS](STARS.md), so an app loads it only when it draws it. It
is also the Sun's `observations.astrosphere`; see `STARS` for its sources.

## Example

```ts
HELIOSPHERE.astropause?.nose?.value; // 115, in au
HELIOSPHERE.crossings?.length; // 4
```
