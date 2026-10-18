[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SystemKindType

# Type Alias: SystemKindType

```ts
type SystemKindType = 'planetary' | 'binary' | 'multiple' | 'cluster';
```

Defined in:
[celestial-bodies/systems.ts:14](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/types/src/celestial-bodies/systems.ts#L14)

Kind of system a barycenter holds together.

- `'planetary'`: one star with planets, like the Solar System.
- `'binary'`: two stars orbiting a shared barycenter.
- `'multiple'`: three or more stars, nested as pairs (Alpha Centauri).
- `'cluster'`: a loosely bound group whose members have a parent but no orbit.
