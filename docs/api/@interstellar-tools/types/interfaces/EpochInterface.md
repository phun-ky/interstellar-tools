[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
EpochInterface

# Interface: EpochInterface

Defined in:
[observations.ts:111](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L111)

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
[observations.ts:113](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L113)

The Julian date.

---

### timeScale

```ts
timeScale: TimeScaleType;
```

Defined in:
[observations.ts:115](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L115)

The time scale it counts in, `'TDB'` for JPL's elements.
