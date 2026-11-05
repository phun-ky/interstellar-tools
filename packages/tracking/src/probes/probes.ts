import type {
  EphemerisInterface,
  ProbeRecordInterface
} from '@interstellar-tools/types';

import { PROBE_SAMPLES } from './probes-data.js';

// A probe's ephemeris from its samples, in m and m/s
const ephemeris = (
  id: string,
  objectName: string,
  objectId: string
): EphemerisInterface => ({
  objectName,
  objectId,
  center: 'Sun',
  frame: 'ICRF',
  timeScale: 'TDB',
  samples: PROBE_SAMPLES[id]!.map(([epoch, x, y, z, vx, vy, vz]) => ({
    epoch: new Date(epoch),
    r: [x * 1000, y * 1000, z * 1000],
    v: [vx * 1000, vy * 1000, vz * 1000]
  }))
});
const probe = (
  record: Omit<ProbeRecordInterface, 'ephemeris'>
): ProbeRecordInterface => ({
  ...record,
  ephemeris: ephemeris(record.id, record.name, record.horizonsId)
});

/**
 * **Notable space probes**, with a dated ephemeris for each from JPL Horizons:
 * where Voyager 1 is, how far New Horizons has gone, where JWST sits. With
 * {@link stateAt}, they answer "where is it now" without the network, from
 * 1 November 2026 to 31 December 2027.
 *
 * | Probe | Near | On its way to |
 * | --- | --- | --- |
 * | Voyager 1 and 2, Pioneer 10, New Horizons | leaving the Solar System | |
 * | James Webb Space Telescope | Sun-Earth L2 | |
 * | Parker Solar Probe, Solar Orbiter | the Sun, close in | |
 * | Europa Clipper | | Europa |
 * | JUICE | | Ganymede |
 * | Psyche | | 16 Psyche |
 * | Lucy | | the Trojan asteroids, at Sun-Jupiter L4 |
 *
 * ::: info Notes
 *
 * - **Positions are from the Sun's centre**, in the ICRF, as Horizons gives
 *   them: `r` in m and `v` in m/s. Subtract Earth's position for one from
 *   Earth.
 * - **Within 1 000 km.** The samples are spaced to keep {@link stateAt} within
 *   1 000 km of Horizons: months apart for the probes leaving the Solar System,
 *   hours apart through flybys and Parker Solar Probe's perihelia.
 * - **Predictions.** Past the date the ephemerides were fetched, 5 November
 *   2026, Horizons' positions are the missions' planned trajectories: a
 *   manoeuvre that's changed or added moves the probe off them.
 * - The span runs from 1 November 2026 to 31 December 2027 at 00:00 TDB,
 *   69 s before midnight UTC. Outside it, {@link stateAt} throws: fetch an
 *   ephemeris from Horizons with `horizonsId`, and read it with
 *   {@link parseHorizonsVectors}.
 *
 * :::
 *
 * @group Probes
 *
 * @example
 * ```ts
 * const voyager1 = PROBES.find(({ id }) => id === 'voyager-1')!;
 * const { r } = stateAt(voyager1.ephemeris, new Date('2027-01-01T00:00:00Z'));
 *
 * Math.hypot(...r) / AU_METERS; // ≈ 172.8: au from the Sun
 * ```
 *
 * @see {@link stateAt}
 * @see https://ssd.jpl.nasa.gov/horizons/ JPL Horizons
 */
export const PROBES: readonly ProbeRecordInterface[] = [
  probe({
    id: 'voyager-1',
    name: 'Voyager 1',
    agencies: ['NASA'],
    launch: '1977-09-05',
    status: 'active',
    near: 'sun',
    horizonsId: '-31'
  }),
  probe({
    id: 'voyager-2',
    name: 'Voyager 2',
    agencies: ['NASA'],
    launch: '1977-08-20',
    status: 'active',
    near: 'sun',
    horizonsId: '-32'
  }),
  probe({
    id: 'new-horizons',
    name: 'New Horizons',
    agencies: ['NASA'],
    launch: '2006-01-19',
    status: 'active',
    near: 'sun',
    horizonsId: '-98'
  }),
  probe({
    id: 'pioneer-10',
    name: 'Pioneer 10',
    agencies: ['NASA'],
    launch: '1972-03-03',
    status: 'ended',
    near: 'sun',
    horizonsId: '-23'
  }),
  probe({
    id: 'jwst',
    name: 'James Webb Space Telescope',
    agencies: ['NASA', 'ESA', 'CSA'],
    launch: '2021-12-25',
    status: 'active',
    near: 'sun-earth-l2',
    horizonsId: '-170'
  }),
  probe({
    id: 'parker-solar-probe',
    name: 'Parker Solar Probe',
    agencies: ['NASA'],
    launch: '2018-08-12',
    status: 'active',
    near: 'sun',
    horizonsId: '-96'
  }),
  probe({
    id: 'solar-orbiter',
    name: 'Solar Orbiter',
    agencies: ['ESA', 'NASA'],
    launch: '2020-02-10',
    status: 'active',
    near: 'sun',
    horizonsId: '-144'
  }),
  probe({
    id: 'europa-clipper',
    name: 'Europa Clipper',
    agencies: ['NASA'],
    launch: '2024-10-14',
    status: 'active',
    near: 'sun',
    destination: 'europa',
    horizonsId: '-159'
  }),
  probe({
    id: 'juice',
    name: 'JUICE',
    agencies: ['ESA'],
    launch: '2023-04-14',
    status: 'active',
    near: 'sun',
    destination: 'ganymede',
    horizonsId: '-28'
  }),
  probe({
    id: 'psyche',
    name: 'Psyche',
    agencies: ['NASA'],
    launch: '2023-10-13',
    status: 'active',
    near: 'sun',
    destination: '16-psyche',
    horizonsId: '-255'
  }),
  probe({
    id: 'lucy',
    name: 'Lucy',
    agencies: ['NASA'],
    launch: '2021-10-16',
    status: 'active',
    near: 'sun',
    destination: 'sun-jupiter-l4',
    horizonsId: '-49'
  })
];
