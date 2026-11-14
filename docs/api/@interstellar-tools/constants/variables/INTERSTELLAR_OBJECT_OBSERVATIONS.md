[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / INTERSTELLAR_OBJECT_OBSERVATIONS

# Variable: INTERSTELLAR_OBJECT_OBSERVATIONS

```ts
const INTERSTELLAR_OBJECT_OBSERVATIONS: ByBodyIdType<
  Omit<InterstellarObjectObservationsInterface, 'discovery'>
>;
```

Defined in:
[bodies/interstellar-observations.ts:39](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/interstellar-observations.ts#L39)

What is **measured about the interstellar objects**, keyed by id: their
catalogue identifiers, JPL's orbit solutions with the fitted non-gravitational
accelerations, the radiants they came from, their magnitudes and, for ʻOumuamua,
its push in m/s².

Kept apart from [INTERSTELLAR_OBJECTS](INTERSTELLAR_OBJECTS.md), so an app loads
these only when it shows them; their discoveries are in
[DISCOVERIES](DISCOVERIES.md).
[withObservations](../functions/withObservations.md) puts both on the objects.

## Example

```ts
INTERSTELLAR_OBJECT_OBSERVATIONS['1i-oumuamua'].anomalousAcceleration?.value; // 5.59155e-6, in m/s²
```
