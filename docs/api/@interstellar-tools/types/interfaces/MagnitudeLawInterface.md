[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MagnitudeLawInterface

# Interface: MagnitudeLawInterface

Defined in:
[celestial-bodies/body-observations.ts:287](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L287)

A comet's **magnitude law**: $m = M + 5\log_{10}\Delta + K\log_{10} r$.

## Properties

### absolute

```ts
absolute: ObservedType<MagnitudeInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:289](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L289)

M1 (total) or M2 (nuclear).

---

### slope

```ts
slope: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:291](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L291)

K1 (total) or K2 (nuclear).
