[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MagnitudeLawInterface

# Interface: MagnitudeLawInterface

Defined in:
[celestial-bodies/body-observations.ts:290](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L290)

A comet's **magnitude law**: $m = M + 5\log_{10}\Delta + K\log_{10} r$.

## Properties

### absolute

```ts
absolute: ObservedType<MagnitudeInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:292](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L292)

M1 (total) or M2 (nuclear).

---

### slope

```ts
slope: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:294](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L294)

K1 (total) or K2 (nuclear).
