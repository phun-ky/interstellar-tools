import type {
  ByBodyIdType,
  DiscoveryInterface
} from '@interstellar-tools/types';

/**
 * How and when bodies were **discovered**, keyed by body id: the date, the
 * people credited and the observatory, from the Minor Planet Center's
 * circulars. For the interstellar objects so far.
 *
 * Small and apart, so an app that shows a discovery date loads only this.
 * {@link withObservations} puts it back, as a body's
 * `observations.discovery`.
 *
 * @group Observations
 * @example
 * ```ts
 * DISCOVERIES['2i-borisov'].discovery.date; // 2019-08-30
 * ```
 */
export const DISCOVERIES: ByBodyIdType<{ discovery: DiscoveryInterface }> = {
  '1i-oumuamua': {
    discovery: {
      date: new Date('2017-10-19'),
      discoverers: ['R. Weryk'],
      facility: 'Pan-STARRS 1, Haleakala (F51)'
    }
  },
  '2i-borisov': {
    discovery: {
      date: new Date('2019-08-30'),
      discoverers: ['G. Borisov'],
      facility: 'MARGO, Nauchnij (L51)'
    }
  },
  '3i-atlas': {
    discovery: {
      date: new Date('2025-07-01'),
      facility: 'ATLAS Chile, Rio Hurtado (W68)'
    }
  }
};
