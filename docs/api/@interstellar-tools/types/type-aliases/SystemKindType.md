[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SystemKindType

# Type Alias: SystemKindType

```ts
type SystemKindType = 'planetary' | 'binary' | 'multiple' | 'cluster';
```

Defined in:
[celestial-bodies/systems.ts:14](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/types/src/celestial-bodies/systems.ts#L14)

Kind of system a barycenter holds together.

- `'planetary'`: one star with planets, like the Solar System.
- `'binary'`: two stars orbiting a shared barycenter.
- `'multiple'`: three or more stars, nested as pairs (Alpha Centauri).
- `'cluster'`: a loosely bound group whose members have a parent but no orbit.
