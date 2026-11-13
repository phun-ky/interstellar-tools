[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitSolutionInterface

# Interface: OrbitSolutionInterface

Defined in:
[observations.ts:620](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L620)

The **orbit determination** behind `orbit`: how well its elements are known.

## Properties

### conditionCode?

```ts
conditionCode?: number;
```

Defined in:
[observations.ts:624](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L624)

JPL's condition code, 0 (best) to 9, or the MPC's U parameter.

---

### earthMoid?

```ts
earthMoid?: DistanceInterface;
```

Defined in:
[observations.ts:638](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L638)

The minimum orbit intersection distance with Earth.

---

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:622](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L622)

The catalogue solution's osculating epoch.

---

### firstObservation?

```ts
firstObservation?: Date;
```

Defined in:
[observations.ts:630](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L630)

The first observation used.

---

### jupiterMoid?

```ts
jupiterMoid?: DistanceInterface;
```

Defined in:
[observations.ts:640](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L640)

The minimum orbit intersection distance with Jupiter.

---

### lastObservation?

```ts
lastObservation?: Date;
```

Defined in:
[observations.ts:632](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L632)

The last observation used.

---

### nonGravitational?

```ts
nonGravitational?: NonGravitationalInterface;
```

Defined in:
[observations.ts:644](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L644)

The non-gravitational parameters fitted with the orbit.

---

### observationArc?

```ts
observationArc?: TemporalInterface;
```

Defined in:
[observations.ts:626](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L626)

The time from the first observation used to the last.

---

### observationCount?

```ts
observationCount?: number;
```

Defined in:
[observations.ts:628](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L628)

How many observations were used.

---

### sigma?

```ts
sigma?: Partial<Record<"i" | "a" | "e" | "w" | "om" | "q" | "period", number>>;
```

Defined in:
[observations.ts:634](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L634)

The elements' 1σ uncertainties, in the units `orbit` gives them in.

---

### source?

```ts
source?: ObservationSourceInterface;
```

Defined in:
[observations.ts:646](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L646)

Where the solution came from.

---

### tisserandJupiter?

```ts
tisserandJupiter?: number;
```

Defined in:
[observations.ts:642](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L642)

The Tisserand parameter with respect to Jupiter.
