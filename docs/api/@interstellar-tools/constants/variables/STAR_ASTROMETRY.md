[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / STAR_ASTROMETRY

# Variable: STAR_ASTROMETRY

```ts
const STAR_ASTROMETRY: ByBodyIdType<StarAstrometryType>;
```

Defined in:
[bodies/star-astrometry.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/star-astrometry.ts#L47)

Where each star **is on the sky**, keyed by star id: its catalogue identifiers,
its ICRS position at J2000, parallax, proper motion and radial velocity, its V
magnitude, and its letter within its system. Given for every star but the Sun
and the S-stars, from SIMBAD, Hipparcos and Gaia DR3.

Kept apart from [STARS](STARS.md), so an app loads these only when it needs
them. [withObservations](../functions/withObservations.md) puts them back on the
stars.

## Example

```ts
STAR_ASTROMETRY['proxima-centauri'].astrometry?.parallax?.value; // 768.0665, in mas
```
