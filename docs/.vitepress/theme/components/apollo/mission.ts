/**
 * Apollo 11 as flown, for the Learn tutorial's widgets. Every value comes from
 * a NASA source, in its original unit, converted here:
 *
 * - ABN: Apollo by the Numbers, NASA SP-2000-4029 (Orloff), for event times
 * - MR: Apollo 11 Mission Report, MSC-00171, Tables 7-III, 7-V and 7-VI, for
 *   burn Δv and durations
 * - LVFE: Saturn V Launch Vehicle Flight Evaluation Report AS-506
 * - MDSR: Mission Director's Summary Report, M-932-69-11
 * - AFJ: Apollo Flight Journal, day 7 (leaving the lunar sphere of influence)
 *
 * Times are ground elapsed time (GET) from range zero, 13:32:00 UTC on
 * 16 July 1969. Where the sources disagree, times follow ABN and burns follow
 * the MR tables; the hub page lists the sources.
 */

const FT = 0.3048; // m per foot
const NMI = 1852; // m per nautical mile

/** Where the spacecraft is drawn on the mission map, and how far along. */
export type MapLeg = 'pad' | 'park' | 'out' | 'moon' | 'surface' | 'ret';

/**
 * How far along a leg: a fraction of its drawn length, or, on the way out or
 * back, the point where the path is a given distance from the Moon.
 */
export type MapAt = number | { moonKm: number };

export interface MissionEventInterface {
  get: string;
  title: string;
  where: readonly [leg: MapLeg, at?: MapAt];
  position: string;
  figure: string;
  text: string;
}

export interface EngineInterface {
  id: 'sivb' | 'csm' | 'dps' | 'lm';
  name: string;
}

export interface BurnInterface {
  id: string;
  engine: EngineInterface['id'];
  get: string;
  name: string;
  /** Velocity change, m/s */
  dv: number;
  /** Burn duration, s */
  duration: number;
  note: string;
}

const km = (m: number) =>
  Math.round(m / 1000)
    .toLocaleString('en-US')
    .replace(/,/g, ' ');

/**
 * The free return the mission map draws: from Apollo 11's TLI point (ABN:
 * 180.581 n mi up, 7.367° above the horizontal), in the Earth–Moon plane with
 * the Moon at its mean distance. The angle from the Earth–Moon line and the
 * speed were solved for a 61.5 n mi pericynthion (MR Table 7-III) and a
 * 38.5 km return perigee, the vacuum perigee of the flown entry; the speed is
 * 3.7 m/s above the flown 35 545.6 ft/s. Checked in in-practice.spec.ts.
 */
export const FREE_RETURN = {
  /** Angle of the TLI point from the Earth–Moon line, counterclockwise, deg */
  angle: 242.26601,
  /** Height above the 6 378 137 m equator, m */
  altitude: 334_400,
  /** Inertial speed, m/s */
  speed: 10_837.9617,
  /** Flight-path angle, deg */
  fpa: 7.367,
  /** Time to integrate, in units of 1/n: just past the return perigee */
  duration: 1.32
} as const;

export const EVENTS: readonly MissionEventInterface[] = [
  {
    get: '000:00:00',
    title: 'Liftoff',
    where: ['pad'],
    position: 'Pad 39A, 28.61° N',
    figure: '2 938 t at ignition',
    text: 'The Saturn V leaves Pad 39A at 13:32 UTC on 16 July 1969, rolling onto a flight azimuth of 72°.'
  },
  {
    get: '000:11:49',
    title: 'Earth orbit',
    where: ['park', 0.3],
    position: `${km(98.9 * NMI)}–${km(100.4 * NMI)} km up, 32.5°`,
    figure: `${((25_567.9 * FT) / 1000).toFixed(2)} km/s`,
    text: 'The S-IVB shuts down in a near-circular parking orbit, one revolution every 88 minutes, while the crew checks the spacecraft.'
  },
  {
    get: '002:50:13',
    title: 'Trans-lunar injection',
    where: ['out', 0],
    position: `${km(180.581 * NMI)} km up`,
    figure: `${((35_545.6 * FT) / 1000).toFixed(2)} km/s`,
    text: 'After a second S-IVB burn of almost six minutes, Apollo 11 is on a long ellipse that reaches out to the Moon.'
  },
  {
    get: '061:39:55',
    title: 'Into the Moon’s sphere',
    where: ['out', { moonKm: (33_823 * NMI) / 1000 }],
    position: `${km(33_823 * NMI)} km from the Moon`,
    figure: `${((3775 * FT) / 1000).toFixed(2)} km/s from the Moon`,
    text: 'Earth’s gravity has slowed the spacecraft to 0.91 km/s. From here on, the Moon’s gravity dominates, and the spacecraft falls towards it.'
  },
  {
    get: '075:49:50',
    title: 'Lunar orbit insertion',
    where: ['moon', 0],
    position: `${km(60 * NMI)} × ${km(169.7 * NMI)} km`,
    figure: `Δv ${(2917.5 * FT).toFixed(0)} m/s`,
    text: 'Behind the Moon, out of contact with Earth, the service module’s engine burns for six minutes to slow into lunar orbit.'
  },
  {
    get: '102:45:40',
    title: 'Landing',
    where: ['surface'],
    position: '0.674° N, 23.473° E',
    figure: '45 s of hover time left',
    text: 'After 12½ minutes of powered descent, Eagle lands in the Sea of Tranquility, about 7 km west of the centre of its landing ellipse.'
  },
  {
    get: '128:03:00',
    title: 'Docking',
    where: ['moon', 0.5],
    position: 'Lunar orbit',
    figure: `Δv ${((51.5 + 19.9 + 25.3 + 31.4) * FT).toFixed(0)} m/s in 4 burns`,
    text: 'The ascent stage climbs to orbit and catches up with Columbia in four small burns: lunar orbit rendezvous.'
  },
  {
    get: '135:23:42',
    title: 'Trans-Earth injection',
    where: ['ret', 0],
    position: `${km(58.1 * NMI)} km up`,
    figure: `${((8589 * FT) / 1000).toFixed(2)} km/s from the Moon`,
    text: 'Behind the Moon again, the service module’s engine adds 1 km/s: enough to escape the Moon and fall back to Earth.'
  },
  {
    get: '148:07:23',
    title: 'Leaving the Moon’s sphere',
    where: ['ret', { moonKm: (33_800 * NMI) / 1000 }],
    position: `About ${km(33_800 * NMI)} km from the Moon`,
    figure: `About ${km(174_000 * NMI)} km from Earth`,
    text: 'Earth’s gravity takes over again. From here the spacecraft speeds up all the way home.'
  },
  {
    get: '195:03:06',
    title: 'Entry',
    where: ['ret', 0.97],
    position: `${km(400_000 * FT)} km up`,
    figure: `${((36_194.4 * FT) / 1000).toFixed(2)} km/s at −6.48°`,
    text: 'The command module meets the atmosphere at 11 km/s, in a narrow corridor: steeper would mean too much deceleration, shallower a skip back out.'
  },
  {
    get: '195:18:35',
    title: 'Splashdown',
    where: ['ret', 1],
    position: '13.30° N, 169.15° W',
    figure: '6.56 g at the peak',
    text: 'Fifteen minutes after entry, 8 days, 3 hours and 18 minutes after liftoff, Columbia lands in the Pacific.'
  }
];

export const ENGINES: readonly EngineInterface[] = [
  { id: 'sivb', name: 'S-IVB' },
  { id: 'csm', name: 'CSM · SPS and RCS' },
  { id: 'dps', name: 'LM · descent engine' },
  { id: 'lm', name: 'LM · ascent engine and RCS' }
];

export const BURNS: readonly BurnInterface[] = [
  {
    id: 'tli',
    engine: 'sivb',
    get: '002:44:16',
    name: 'Trans-lunar injection',
    dv: 10_441 * FT,
    duration: 347.3,
    note: 'The S-IVB’s second burn, from a near-circular orbit onto a long ellipse that reaches the Moon. The biggest single burn of the mission.'
  },
  {
    id: 'mcc',
    engine: 'csm',
    get: '026:44:58',
    name: 'Midcourse correction',
    dv: 20.9 * FT,
    duration: 3.1,
    note: 'The only correction on the way out. It brings the closest approach to the Moon to 114 km.'
  },
  {
    id: 'loi1',
    engine: 'csm',
    get: '075:49:50',
    name: 'Lunar orbit insertion 1',
    dv: 2917.5 * FT,
    duration: 357.5,
    note: 'Slows the spacecraft from a hyperbola around the Moon into a 111 × 314 km orbit.'
  },
  {
    id: 'loi2',
    engine: 'csm',
    get: '080:11:36',
    name: 'Lunar orbit insertion 2',
    dv: 158.8 * FT,
    duration: 16.8,
    note: 'Rounds the orbit off to 101 × 122 km.'
  },
  {
    id: 'tei',
    engine: 'csm',
    get: '135:23:42',
    name: 'Trans-Earth injection',
    dv: 3279 * FT,
    duration: 151.4,
    note: 'Escapes the Moon on a hyperbola that falls back to Earth.'
  },
  {
    id: 'mcc5',
    engine: 'csm',
    get: '150:29:57',
    name: 'Midcourse correction 5',
    dv: 4.8 * FT,
    duration: 11.2,
    note: 'The only correction on the way home, setting the entry flight-path angle to −6.46°.'
  },
  {
    id: 'doi',
    engine: 'dps',
    get: '101:36:14',
    name: 'Descent orbit insertion',
    dv: 76.4 * FT,
    duration: 30,
    note: 'Lowers the LM’s orbit to 14 × 108 km, so that powered descent starts low.'
  },
  {
    id: 'pdi',
    engine: 'dps',
    get: '102:33:05',
    name: 'Powered descent',
    dv: 6930 * FT,
    duration: 756.3,
    note: 'From orbit to standing still on the surface. The Mission Report’s text gives about 6775 ft/s (2.07 km/s); this is its table value.'
  },
  {
    id: 'ascent',
    engine: 'lm',
    get: '124:22:00',
    name: 'Lunar ascent',
    dv: 6070.1 * FT,
    duration: 434.9,
    note: 'From the surface into a 17 × 89 km orbit, below the CSM.'
  },
  {
    id: 'csi',
    engine: 'lm',
    get: '125:19:35',
    name: 'Coelliptic sequence initiation',
    dv: 51.5 * FT,
    duration: 47,
    note: 'Raises the LM’s low point from 17 to 85 km.'
  },
  {
    id: 'cdh',
    engine: 'lm',
    get: '126:17:50',
    name: 'Constant delta height',
    dv: 19.9 * FT,
    duration: 17.8,
    note: 'Makes the LM’s orbit coelliptic with the CSM’s: a constant height below it.'
  },
  {
    id: 'tpi',
    engine: 'lm',
    get: '127:03:52',
    name: 'Terminal phase initiation',
    dv: 25.3 * FT,
    duration: 22.7,
    note: 'Starts the final climb to the CSM.'
  },
  {
    id: 'tpf',
    engine: 'lm',
    get: '127:46:10',
    name: 'Terminal phase finalisation',
    dv: 31.4 * FT,
    duration: 28.4,
    note: 'Brakes the LM to a stop next to the CSM, ready to dock.'
  }
];
