[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitSolutionInterface

# Interface: OrbitSolutionInterface

Defined in:
[observations.ts:619](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L619)

The **orbit determination** behind `orbit`: how well its elements are known.

## Properties

### conditionCode?

```ts
conditionCode?: number;
```

Defined in:
[observations.ts:623](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L623)

JPL's condition code, 0 (best) to 9, or the MPC's U parameter.

---

### earthMoid?

```ts
earthMoid?: DistanceInterface;
```

Defined in:
[observations.ts:637](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L637)

The minimum orbit intersection distance with Earth.

---

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:621](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L621)

The catalogue solution's osculating epoch.

---

### firstObservation?

```ts
firstObservation?: Date;
```

Defined in:
[observations.ts:629](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L629)

The first observation used.

---

### jupiterMoid?

```ts
jupiterMoid?: DistanceInterface;
```

Defined in:
[observations.ts:639](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L639)

The minimum orbit intersection distance with Jupiter.

---

### lastObservation?

```ts
lastObservation?: Date;
```

Defined in:
[observations.ts:631](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L631)

The last observation used.

---

### nonGravitational?

```ts
nonGravitational?: NonGravitationalInterface;
```

Defined in:
[observations.ts:643](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L643)

The non-gravitational parameters fitted with the orbit.

---

### observationArc?

```ts
observationArc?: TemporalInterface;
```

Defined in:
[observations.ts:625](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L625)

The time from the first observation used to the last.

---

### observationCount?

```ts
observationCount?: number;
```

Defined in:
[observations.ts:627](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L627)

How many observations were used.

---

### sigma?

```ts
sigma?: Partial<Record<"i" | "a" | "e" | "w" | "om" | "q" | "period", number>>;
```

Defined in:
[observations.ts:633](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L633)

The elements' 1σ uncertainties, in the units `orbit` gives them in.

---

### source?

```ts
source?: ObservationSourceInterface;
```

Defined in:
[observations.ts:645](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L645)

Where the solution came from.

---

### tisserandJupiter?

```ts
tisserandJupiter?: number;
```

Defined in:
[observations.ts:641](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L641)

The Tisserand parameter with respect to Jupiter.
