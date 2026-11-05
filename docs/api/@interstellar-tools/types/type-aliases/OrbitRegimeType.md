[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitRegimeType

# Type Alias: OrbitRegimeType

```ts
type OrbitRegimeType = 'LEO' | 'MEO' | 'GEO' | 'HEO';
```

Defined in:
[tracking.ts:285](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L285)

The **orbit regime** a satellite flies in.

- `'LEO'`: low Earth orbit, below about 2 000 km, an orbit in under about 2
  hours: the ISS, Starlink, Earth observation.
- `'MEO'`: medium Earth orbit, between LEO and geostationary: navigation
  satellites such as GPS and Galileo.
- `'GEO'`: geostationary orbit, 35 786 km above the equator, turning with Earth:
  weather and communications satellites.
- `'HEO'`: highly elliptical orbit, such as Molniya, lingering high over one
  hemisphere.

## Example

```ts
const regime: OrbitRegimeType = 'MEO'; // a GPS satellite
```
