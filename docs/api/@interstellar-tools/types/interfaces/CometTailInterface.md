[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometTailInterface

# Interface: CometTailInterface

Defined in:
[celestial-bodies/body-observations.ts:313](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L313)

One observed **comet tail**.

## Properties

### kind

```ts
kind: 'dust' | 'ion' | 'sodium' | 'anti-tail';
```

Defined in:
[celestial-bodies/body-observations.ts:315](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L315)

What kind.

---

### length?

```ts
length?: ObservedType<
  | DistanceInterface
| AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:317](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L317)

How long, in space or on the sky.
