[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometTailInterface

# Interface: CometTailInterface

Defined in:
[celestial-bodies/body-observations.ts:316](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L316)

One observed **comet tail**.

## Properties

### kind

```ts
kind: 'dust' | 'ion' | 'sodium' | 'anti-tail';
```

Defined in:
[celestial-bodies/body-observations.ts:318](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L318)

What kind.

---

### length?

```ts
length?: ObservedType<
  | DistanceInterface
| AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:320](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L320)

How long, in space or on the sky.
