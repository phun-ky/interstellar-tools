[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SystemKindType

# Type Alias: SystemKindType

```ts
type SystemKindType = 'planetary' | 'binary' | 'multiple' | 'cluster';
```

Defined in:
[celestial-bodies/systems.ts:14](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/systems.ts#L14)

Kind of system a barycenter holds together.

- `'planetary'`: one star with planets, like the Solar System.
- `'binary'`: two stars orbiting a shared barycenter.
- `'multiple'`: three or more stars, nested as pairs (Alpha Centauri).
- `'cluster'`: a loosely bound group whose members have a parent but no orbit.
