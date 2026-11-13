[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
LimbDarkeningInterface

# Interface: LimbDarkeningInterface

Defined in:
[celestial-bodies/body-observations.ts:503](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L503)

A fitted **limb-darkening** law, in one band.

## Properties

### band

```ts
band: PhotometricBandType;
```

Defined in:
[celestial-bodies/body-observations.ts:507](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L507)

The band they were fitted in.

---

### coefficients

```ts
coefficients: ObservedType[];
```

Defined in:
[celestial-bodies/body-observations.ts:509](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L509)

The coefficients, in the law's order.

---

### law

```ts
law: 'linear' | 'quadratic' | 'square-root' | 'nonlinear' | 'power-2';
```

Defined in:
[celestial-bodies/body-observations.ts:505](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L505)

The law the coefficients belong to.
