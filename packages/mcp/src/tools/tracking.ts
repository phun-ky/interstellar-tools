import {
  AU_METERS,
  MOONS,
  PLANETS,
  SPEED_OF_LIGHT_M_PER_S,
  STARS
} from '@interstellar-tools/constants';
import {
  areTrojanPointsStable,
  convertDistanceUnit,
  hillSphereRadius,
  lagrangePoints,
  sunPosition
} from '@interstellar-tools/equations';
import {
  dopplerShift,
  earthShadow,
  isVisiblePass,
  lookAngles,
  parseOmm,
  parseTle,
  predictPasses,
  PROBES,
  propagate,
  SATELLITES,
  stateAt,
  subSatellitePoint
} from '@interstellar-tools/tracking';
import type {
  DistanceInterface,
  GeodeticCoordinatesInterface,
  MeanElementsInterface
} from '@interstellar-tools/types';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  angleOutput,
  angleOutputSchema,
  angleSchema,
  PURE_TOOL,
  result,
  toRadians,
  vectorOutputSchema
} from './shared.js';

const DAY_MS = 86_400_000;
// The longest window satellite_passes searches: a few days of elements is
// all that's accurate anyway
const MAX_WINDOW_DAYS = 14;
const SATELLITE_IDS = SATELLITES.map(({ id }) => id);
const PROBE_IDS = PROBES.map(({ id }) => id) as [string, ...string[]];
const elementsInput = {
  satellite: z
    .string()
    .min(1)
    .optional()
    .describe(
      `Id of a satellite in the bundled snapshot, dated 2026-11-04: ${SATELLITE_IDS.join(', ')}. Snapshot elements go stale within days: prefer fresh elements from CelesTrak, passed as tle or omm.`
    ),
  tle: z
    .tuple([z.string(), z.string()])
    .optional()
    .describe('A two-line element set: [line 1, line 2].'),
  omm: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional()
    .describe(
      'One Orbit Mean-elements Message record, as CelesTrak returns it with FORMAT=json, or its JSON text.'
    )
};
const observerSchema = z
  .object({
    latitude: angleSchema.describe(
      'Geodetic latitude, north positive, e.g. { "value": -1.2864, "unit": "deg" }.'
    ),
    longitude: angleSchema.describe(
      'Longitude, east positive, e.g. { "value": 36.8172, "unit": "deg" }.'
    ),
    height_m: z
      .number()
      .finite()
      .default(0)
      .describe('Height above the WGS 84 ellipsoid, in metres.')
  })
  .describe('The observer on the ground.');
const timeSchema = (what: string) =>
  z
    .string()
    .min(1)
    .describe(`${what}, an ISO 8601 time in UTC, e.g. "2026-11-05T15:49:00Z".`);
const resolveElements = ({
  satellite,
  tle,
  omm
}: {
  satellite?: string;
  tle?: [string, string];
  omm?: string | Record<string, unknown>;
}): MeanElementsInterface => {
  const given = [satellite, tle, omm].filter((x) => x !== undefined).length;

  if (given !== 1)
    throw new Error(
      'Give the elements exactly one way: satellite (a snapshot id), tle or omm.'
    );

  if (tle) return parseTle(tle[0], tle[1]);

  if (omm) return parseOmm(omm);

  const entry = SATELLITES.find(({ id }) => id === satellite!.trim());

  if (!entry)
    throw new Error(
      `Unknown satellite: ${satellite}. The snapshot has ${SATELLITE_IDS.join(', ')}.`
    );

  return parseOmm(entry.omm);
};
const parseTime = (name: string, text: string): Date => {
  const date = new Date(text);

  if (!Number.isFinite(date.getTime()))
    throw new Error(
      `${name} must be an ISO 8601 time, like "2026-11-05T15:49:00Z". Received: ${text}`
    );

  return date;
};
const toObserver = ({
  latitude,
  longitude,
  height_m
}: z.infer<typeof observerSchema>): GeodeticCoordinatesInterface => ({
  phi: toRadians(latitude),
  lambda: toRadians(longitude),
  h: height_m
});
// Days from the elements' epoch to a moment
const ageDays = (elements: MeanElementsInterface, date: Date) =>
  (date.getTime() - elements.epoch.getTime()) / DAY_MS;

type BodyType = {
  id: string;
  parent?: string;
  mu?: number;
  orbit?: { a: DistanceInterface; e: number };
};

const findBody = (id: string): BodyType => {
  const needle = id.trim().toLowerCase();
  const body = ([...STARS, ...PLANETS, ...MOONS] as readonly BodyType[]).find(
    (entry) => entry.id === needle
  );

  if (!body)
    throw new Error(
      `Unknown body: ${id}. Use an id from find_body with a mu, such as "sun", "earth" or "moon".`
    );

  if (body.mu === undefined)
    throw new Error(
      `${body.id} has no mu in the datasets: give its mu instead.`
    );

  return body;
};
// A body's μ, from its id or as given
const resolveMu = (
  which: string,
  id: string | undefined,
  mu: number | undefined
): { mu: number; body?: BodyType } => {
  if ((id === undefined) === (mu === undefined))
    throw new Error(
      `Give the ${which} body as an id or as its mu in m³/s², not both.`
    );

  if (mu !== undefined) return { mu };

  const body = findBody(id!);

  return { mu: body.mu!, body };
};

export const registerTrackingTools = (server: McpServer) => {
  server.registerTool(
    'satellite_position',
    {
      title: 'Satellite position',
      description:
        'Where a satellite is at a moment: the point on the ground below it, its height, its position and velocity in the TEME frame, and whether it is in Earth’s shadow. Propagates the elements with SGP4. Accurate to about a kilometre near the elements’ epoch, growing by a few kilometres a day: elements_age_d says how old they are.',
      inputSchema: {
        ...elementsInput,
        time: timeSchema('The moment')
      },
      outputSchema: {
        name: z.string().optional(),
        epoch_utc: z.string(),
        elements_age_d: z.number(),
        latitude: angleOutputSchema,
        longitude: angleOutputSchema,
        height_m: z.number(),
        speed_m_s: z.number(),
        position_teme_m: vectorOutputSchema,
        velocity_teme_m_s: vectorOutputSchema,
        shadow: z.enum(['sunlit', 'penumbra', 'umbra'])
      },
      annotations: PURE_TOOL
    },
    ({ time, ...elementsGiven }) => {
      const elements = resolveElements(elementsGiven);
      const date = parseTime('time', time);
      const { r, v } = propagate(elements, date);
      const below = subSatellitePoint(elements, date);

      return result({
        ...(elements.name ? { name: elements.name } : {}),
        epoch_utc: elements.epoch.toISOString(),
        elements_age_d: ageDays(elements, date),
        latitude: angleOutput(below.phi),
        longitude: angleOutput(below.lambda),
        height_m: below.h,
        speed_m_s: Math.hypot(...v),
        position_teme_m: r,
        velocity_teme_m_s: v,
        shadow: earthShadow(r, sunPosition(date).r)
      });
    }
  );

  server.registerTool(
    'look_angles',
    {
      title: 'Look angles to a satellite',
      description:
        'Where to point an antenna or a camera at a satellite from the ground at a moment: azimuth clockwise from north, elevation above the horizon, range, and range rate (negative while it approaches). Give frequency_hz for the Doppler shift of its signal. The elevation is geometric, without refraction.',
      inputSchema: {
        ...elementsInput,
        observer: observerSchema,
        time: timeSchema('The moment'),
        frequency_hz: z
          .number()
          .positive()
          .optional()
          .describe('Transmitted frequency, in Hz, for the Doppler shift.')
      },
      outputSchema: {
        azimuth: angleOutputSchema,
        elevation: angleOutputSchema,
        above_horizon: z.boolean(),
        range_m: z.number(),
        range_rate_m_s: z.number(),
        doppler_shift_hz: z.number().optional(),
        elements_age_d: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ observer, time, frequency_hz, ...elementsGiven }) => {
      const elements = resolveElements(elementsGiven);
      const date = parseTime('time', time);
      const angles = lookAngles(elements, toObserver(observer), date);

      return result({
        azimuth: angleOutput(angles.azimuth),
        elevation: angleOutput(angles.elevation),
        above_horizon: angles.elevation > 0,
        range_m: angles.range,
        range_rate_m_s: angles.rangeRate,
        ...(frequency_hz === undefined
          ? {}
          : { doppler_shift_hz: dopplerShift(frequency_hz, angles.rangeRate) }),
        elements_age_d: ageDays(elements, date)
      });
    }
  );

  server.registerTool(
    'satellite_passes',
    {
      title: 'Satellite passes',
      description: `When a satellite passes over an observer between two times: rise, highest point and set, with azimuths, and whether each pass can be seen with the eye (the satellite sunlit while the Sun is below -6° for the observer). Searches at most ${MAX_WINDOW_DAYS} days. Only whole passes are returned.`,
      inputSchema: {
        ...elementsInput,
        observer: observerSchema,
        from: timeSchema('Start of the window'),
        to: timeSchema('End of the window'),
        min_elevation: angleSchema
          .optional()
          .describe(
            'The elevation that counts as rising and setting: 0 by default, the horizon. 10° skips passes low behind trees and buildings.'
          )
      },
      outputSchema: {
        count: z.number(),
        visible_count: z.number(),
        elements_age_d: z.number(),
        passes: z.array(
          z.object({
            rise_utc: z.string(),
            rise_azimuth: angleOutputSchema,
            culmination_utc: z.string(),
            culmination_azimuth: angleOutputSchema,
            max_elevation: angleOutputSchema,
            set_utc: z.string(),
            set_azimuth: angleOutputSchema,
            visible: z.boolean()
          })
        )
      },
      annotations: PURE_TOOL
    },
    ({ observer, from, to, min_elevation, ...elementsGiven }) => {
      const elements = resolveElements(elementsGiven);
      const start = parseTime('from', from);
      const end = parseTime('to', to);
      const site = toObserver(observer);

      if (end.getTime() - start.getTime() > MAX_WINDOW_DAYS * DAY_MS)
        throw new Error(
          `The window must be at most ${MAX_WINDOW_DAYS} days: elements are only accurate for a few days around their epoch.`
        );

      const passes = predictPasses(elements, site, start, end, {
        ...(min_elevation ? { minElevation: toRadians(min_elevation) } : {})
      }).map((pass) => ({
        rise_utc: pass.rise.toISOString(),
        rise_azimuth: angleOutput(pass.riseAzimuth),
        culmination_utc: pass.culmination.toISOString(),
        culmination_azimuth: angleOutput(pass.culminationAzimuth),
        max_elevation: angleOutput(pass.maxElevation),
        set_utc: pass.set.toISOString(),
        set_azimuth: angleOutput(pass.setAzimuth),
        visible: isVisiblePass(elements, site, pass)
      }));

      return result({
        count: passes.length,
        visible_count: passes.filter(({ visible }) => visible).length,
        elements_age_d: ageDays(elements, start),
        passes
      });
    }
  );

  server.registerTool(
    'probe_position',
    {
      title: 'Space probe position',
      description:
        'Where a deep-space probe is at a moment, from the bundled JPL Horizons ephemerides (1 November 2026 to 31 December 2027): its distance from the Sun, the light time, and its position and velocity from the Sun’s centre in the ICRF. Outside that span, fetch an ephemeris from JPL Horizons with horizons_id.',
      inputSchema: {
        probe: z
          .enum(PROBE_IDS)
          .describe('Id of the probe, e.g. "voyager-1" or "jwst".'),
        time: timeSchema('The moment')
      },
      outputSchema: {
        name: z.string(),
        agencies: z.array(z.string()),
        launch: z.string(),
        status: z.enum(['active', 'ended']),
        near: z.string(),
        destination: z.string().optional(),
        horizons_id: z.string(),
        distance_au: z.number(),
        distance_m: z.number(),
        light_time_s: z.number(),
        speed_m_s: z.number(),
        position_m: vectorOutputSchema,
        velocity_m_s: vectorOutputSchema
      },
      annotations: PURE_TOOL
    },
    ({ probe, time }) => {
      const entry = PROBES.find(({ id }) => id === probe)!;
      const { r, v } = stateAt(entry.ephemeris, parseTime('time', time));
      const distance = Math.hypot(...r);

      return result({
        name: entry.name,
        agencies: [...entry.agencies],
        launch: entry.launch,
        status: entry.status,
        near: entry.near,
        ...(entry.destination ? { destination: entry.destination } : {}),
        horizons_id: entry.horizonsId,
        distance_au: distance / AU_METERS,
        distance_m: distance,
        light_time_s: distance / SPEED_OF_LIGHT_M_PER_S,
        speed_m_s: Math.hypot(...v),
        position_m: r,
        velocity_m_s: v
      });
    }
  );

  server.registerTool(
    'lagrange_points',
    {
      title: 'Lagrange points',
      description:
        'The five Lagrange points of two bodies circling each other, such as Sun-Earth (JWST at L2) or Sun-Jupiter (the Trojans at L4 and L5): positions in the frame turning with the bodies, from their barycentre, x from the larger body toward the smaller. Also whether L4 and L5 are stable, and the smaller body’s Hill sphere. Give each body as an id from find_body or as its mu.',
      inputSchema: {
        primary: z
          .string()
          .min(1)
          .optional()
          .describe('The larger body’s id, e.g. "sun".'),
        primary_mu_m3_s2: z
          .number()
          .positive()
          .optional()
          .describe('The larger body’s mu, in m³/s², instead of its id.'),
        secondary: z
          .string()
          .min(1)
          .optional()
          .describe('The smaller body’s id, e.g. "earth".'),
        secondary_mu_m3_s2: z
          .number()
          .positive()
          .optional()
          .describe('The smaller body’s mu, in m³/s², instead of its id.'),
        separation_m: z
          .number()
          .positive()
          .optional()
          .describe(
            'Distance between the bodies, in metres. Defaults to the smaller body’s semi-major axis, when the datasets give it around the larger.'
          )
      },
      outputSchema: {
        mass_ratio: z.number(),
        separation_m: z.number(),
        l1_m: vectorOutputSchema,
        l2_m: vectorOutputSchema,
        l3_m: vectorOutputSchema,
        l4_m: vectorOutputSchema,
        l5_m: vectorOutputSchema,
        l1_from_secondary_m: z.number(),
        l2_from_secondary_m: z.number(),
        trojan_points_stable: z.boolean(),
        hill_sphere_radius_m: z.number()
      },
      annotations: PURE_TOOL
    },
    ({
      primary,
      primary_mu_m3_s2,
      secondary,
      secondary_mu_m3_s2,
      separation_m
    }) => {
      const larger = resolveMu('larger', primary, primary_mu_m3_s2);
      const smaller = resolveMu('smaller', secondary, secondary_mu_m3_s2);
      const orbit =
        smaller.body && larger.body && smaller.body.parent === larger.body.id
          ? smaller.body.orbit
          : undefined;
      const a =
        separation_m ??
        (orbit ? convertDistanceUnit(orbit.a, 'm').value : undefined);

      if (a === undefined)
        throw new Error(
          'Give separation_m: the datasets only give it for a body that orbits the other, such as earth around sun.'
        );

      const mu = smaller.mu / (larger.mu + smaller.mu);
      const points = lagrangePoints(larger.mu, smaller.mu, a);
      const at = (1 - mu) * a;

      return result({
        mass_ratio: mu,
        separation_m: a,
        l1_m: points.L1,
        l2_m: points.L2,
        l3_m: points.L3,
        l4_m: points.L4,
        l5_m: points.L5,
        l1_from_secondary_m: at - points.L1[0],
        l2_from_secondary_m: points.L2[0] - at,
        trojan_points_stable: areTrojanPointsStable(larger.mu, smaller.mu),
        hill_sphere_radius_m: hillSphereRadius(
          a,
          orbit?.e ?? 0,
          smaller.mu,
          larger.mu
        )
      });
    }
  );

  server.registerResource(
    'satellites',
    'interstellar://tracking/satellites',
    {
      title: 'Satellite snapshot',
      description:
        'Orbital elements of twelve well-known satellites, as OMM records from CelesTrak dated 4 November 2026: for examples, not for tracking. Each has an id for the satellite field of the tracking tools.',
      mimeType: 'application/json'
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(SATELLITES, null, 2)
        }
      ]
    })
  );

  server.registerResource(
    'probes',
    'interstellar://tracking/probes',
    {
      title: 'Space probes',
      description:
        'Eleven notable space probes: agencies, launch dates, status, what each is near and heading for, and the span of its bundled ephemeris. probe_position gives their positions.',
      mimeType: 'application/json'
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(
            PROBES.map(({ ephemeris, ...probe }) => ({
              ...probe,
              ephemeris_from_utc: ephemeris.samples[0]!.epoch.toISOString(),
              ephemeris_to_utc:
                ephemeris.samples[
                  ephemeris.samples.length - 1
                ]!.epoch.toISOString()
            })),
            null,
            2
          )
        }
      ]
    })
  );
};
