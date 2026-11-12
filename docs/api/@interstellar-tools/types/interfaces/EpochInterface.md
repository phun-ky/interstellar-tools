[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
EpochInterface

# Interface: EpochInterface

Defined in:
[observations.ts:114](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L114)

A moment as a **Julian date on a named time scale**, as catalogues give
osculating epochs and transit times.

## Example

```ts
// J2000, as JPL gives element epochs
const epoch: EpochInterface = { jd: 2451545, timeScale: 'TDB' };
```

## Properties

### jd

```ts
jd: number;
```

Defined in:
[observations.ts:116](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L116)

The Julian date.

---

### timeScale

```ts
timeScale: TimeScaleType;
```

Defined in:
[observations.ts:118](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L118)

The time scale it counts in, `'TDB'` for JPL's elements.
