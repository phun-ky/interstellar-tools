[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AstrosphereBoundaryType

# Type Alias: AstrosphereBoundaryType

```ts
type AstrosphereBoundaryType = 'termination shock' | 'astropause' | 'bow shock';
```

Defined in:
[celestial-bodies/body-observations.ts:562](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L562)

The boundaries of an **astrosphere**:

- `'termination shock'`: where the stellar wind slows below the speed of sound.
- `'astropause'`: where the stellar wind meets the interstellar medium; the
  Sun's is the heliopause.
- `'bow shock'`: where the interstellar medium, if it flows faster than its own
  speed of sound, is shocked ahead of the bubble.
