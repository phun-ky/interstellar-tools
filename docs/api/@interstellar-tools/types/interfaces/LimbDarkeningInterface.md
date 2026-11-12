[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
LimbDarkeningInterface

# Interface: LimbDarkeningInterface

Defined in:
[celestial-bodies/body-observations.ts:500](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L500)

A fitted **limb-darkening** law, in one band.

## Properties

### band

```ts
band: PhotometricBandType;
```

Defined in:
[celestial-bodies/body-observations.ts:504](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L504)

The band they were fitted in.

---

### coefficients

```ts
coefficients: ObservedType[];
```

Defined in:
[celestial-bodies/body-observations.ts:506](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L506)

The coefficients, in the law's order.

---

### law

```ts
law: 'linear' | 'quadratic' | 'square-root' | 'nonlinear' | 'power-2';
```

Defined in:
[celestial-bodies/body-observations.ts:502](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L502)

The law the coefficients belong to.
