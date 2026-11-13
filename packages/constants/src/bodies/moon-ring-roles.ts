import type {
  ByBodyIdType,
  MoonObservationsInterface
} from '@interstellar-tools/types';

/**
 * The moons whose dust **feeds a ring**, keyed by moon id: Metis, Amalthea
 * and Thebe for Jupiter's (Burns et al. 1999), Enceladus for Saturn's E ring
 * and Phoebe for its Phoebe ring.
 *
 * Kept apart from {@link MOONS}; {@link withObservations} puts them on, as
 * the moons' `observations.ringInteraction`.
 *
 * @group Observations
 */
export const MOON_RING_ROLES: ByBodyIdType<
  Pick<MoonObservationsInterface, 'ringInteraction'>
> = {
  amalthea: { ringInteraction: 'source' },
  metis: { ringInteraction: 'source' },
  thebe: { ringInteraction: 'source' },
  enceladus: { ringInteraction: 'source' },
  phoebe: { ringInteraction: 'source' }
};
