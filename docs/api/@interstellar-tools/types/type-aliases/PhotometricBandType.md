[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PhotometricBandType

# Type Alias: PhotometricBandType

```ts
type PhotometricBandType =
  | 'U'
  | 'B'
  | 'V'
  | 'R'
  | 'I'
  | 'J'
  | 'H'
  | 'K'
  | 'Ks'
  | 'G'
  | 'BP'
  | 'RP'
  | 'u'
  | 'g'
  | 'r'
  | 'i'
  | 'z'
  | 'W1'
  | 'W2'
  | 'W3'
  | 'W4'
  | 'FUV'
  | 'NUV'
  | (string & {});
```

Defined in:
[observations.ts:242](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L242)

**Photometric bands**: Johnson–Cousins, 2MASS, Gaia, SDSS, WISE and GALEX. Any
other band is accepted too.
