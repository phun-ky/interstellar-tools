[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / MOON_RING_ROLES

# Variable: MOON_RING_ROLES

```ts
const MOON_RING_ROLES: ByBodyIdType<
  Pick<MoonObservationsInterface, 'ringInteraction'>
>;
```

Defined in:
[bodies/moon-ring-roles.ts:16](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/moon-ring-roles.ts#L16)

The moons whose dust **feeds a ring**, keyed by moon id: Metis, Amalthea and
Thebe for Jupiter's (Burns et al. 1999), Enceladus for Saturn's E ring and
Phoebe for its Phoebe ring.

Kept apart from [MOONS](MOONS.md);
[withObservations](../functions/withObservations.md) puts them back, as the
moons' `observations.ringInteraction`.
