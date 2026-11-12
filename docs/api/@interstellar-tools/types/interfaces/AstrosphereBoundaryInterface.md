[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AstrosphereBoundaryInterface

# Interface: AstrosphereBoundaryInterface

Defined in:
[celestial-bodies/body-observations.ts:541](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L541)

A **boundary of an astrosphere**, by how far it lies from the star in three
directions. The bubble is blunt on the side the interstellar wind blows from and
drawn out behind, so one radius doesn't describe it.

## Properties

### flank?

```ts
flank?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:545](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L545)

How far it is on the flanks, at right angles to the wind.

---

### nose?

```ts
nose?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:543](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L543)

How far it is towards the nose, upwind.

---

### tail?

```ts
tail?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:547](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L547)

How far it is down the tail, downwind.
