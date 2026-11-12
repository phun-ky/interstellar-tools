[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservationCatalogType

# Type Alias: ObservationCatalogType

```ts
type ObservationCatalogType =
  | 'JPL SSD'
  | 'JPL SBDB'
  | 'JPL Horizons'
  | 'MPC'
  | 'IAU WGCCRE'
  | 'NASA Exoplanet Archive'
  | 'Gaia DR3'
  | 'Hipparcos'
  | 'SIMBAD'
  | 'NED'
  | 'HyperLEDA'
  | 'PDS'
  | (string & {});
```

Defined in:
[observations.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L62)

The **catalogues** the datasets in `@interstellar-tools/constants` draw on. Any
other name is accepted too.
