import { SECONDS_PER_DAY } from '@interstellar-tools/constants';
import {
  circularSpeed,
  escapeSpeed,
  gravitationalParameter,
  keplerPeriod,
  periApoapsisRadii,
  sphereOfInfluenceRadius,
  visVivaSpeed
} from '@interstellar-tools/equations';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { muSchema, PURE_TOOL, result } from './shared.js';

const radiusSchema = z
  .number()
  .positive()
  .describe('Distance from the centre of the central body, in metres (m).');

export const registerOrbitTools = (server: McpServer) => {
  server.registerTool(
    'gravitational_parameter',
    {
      title: 'Gravitational parameter',
      description:
        'Compute the standard gravitational parameter μ = G·(M + m) from masses. Use this to get μ for the other orbit tools.',
      inputSchema: {
        M_kg: z.number().nonnegative().describe('Primary mass, in kg.'),
        m_kg: z
          .number()
          .nonnegative()
          .default(0)
          .describe('Secondary mass, in kg. Omit for a test particle.')
      },
      outputSchema: { mu_m3_s2: z.number() },
      annotations: PURE_TOOL
    },
    ({ M_kg, m_kg }) => result({ mu_m3_s2: gravitationalParameter(M_kg, m_kg) })
  );

  server.registerTool(
    'circular_speed',
    {
      title: 'Circular orbit speed',
      description: 'Speed of a circular orbit at radius r: v = √(μ/r).',
      inputSchema: { r_m: radiusSchema, mu_m3_s2: muSchema },
      outputSchema: { v_m_s: z.number() },
      annotations: PURE_TOOL
    },
    ({ r_m, mu_m3_s2 }) => result({ v_m_s: circularSpeed(r_m, mu_m3_s2) })
  );

  server.registerTool(
    'escape_speed',
    {
      title: 'Escape speed',
      description: 'Escape speed at radius r: v = √(2μ/r).',
      inputSchema: { r_m: radiusSchema, mu_m3_s2: muSchema },
      outputSchema: { v_m_s: z.number() },
      annotations: PURE_TOOL
    },
    ({ r_m, mu_m3_s2 }) => result({ v_m_s: escapeSpeed(r_m, mu_m3_s2) })
  );

  server.registerTool(
    'vis_viva_speed',
    {
      title: 'Vis-viva speed',
      description:
        'Orbital speed at radius r on an orbit with semi-major axis a: v = √(μ(2/r − 1/a)). Use a > 0 for elliptic orbits and a < 0 for hyperbolic orbits.',
      inputSchema: {
        r_m: radiusSchema,
        a_m: z
          .number()
          .finite()
          .refine((a) => a !== 0, 'a must be non-zero')
          .describe(
            'Semi-major axis, in metres. Positive for elliptic, negative for hyperbolic.'
          ),
        mu_m3_s2: muSchema
      },
      outputSchema: { v_m_s: z.number() },
      annotations: PURE_TOOL
    },
    ({ r_m, a_m, mu_m3_s2 }) =>
      result({ v_m_s: visVivaSpeed(r_m, a_m, mu_m3_s2) })
  );

  server.registerTool(
    'kepler_period',
    {
      title: 'Orbital period',
      description:
        'Orbital period of an elliptic orbit from Kepler’s third law: T = 2π√(a³/μ).',
      inputSchema: {
        a_m: z.number().positive().describe('Semi-major axis, in metres.'),
        mu_m3_s2: muSchema
      },
      outputSchema: { T_s: z.number(), T_d: z.number() },
      annotations: PURE_TOOL
    },
    ({ a_m, mu_m3_s2 }) => {
      const T_s = keplerPeriod(a_m, mu_m3_s2);

      return result({ T_s, T_d: T_s / SECONDS_PER_DAY });
    }
  );

  server.registerTool(
    'peri_apoapsis_radii',
    {
      title: 'Periapsis and apoapsis radii',
      description:
        'Periapsis rp = a(1 − e) and apoapsis ra = a(1 + e). For hyperbolic orbits (a < 0, e > 1) ra is null.',
      inputSchema: {
        a_m: z
          .number()
          .finite()
          .describe(
            'Semi-major axis, in metres. Negative for hyperbolic orbits.'
          ),
        e: z.number().nonnegative().describe('Eccentricity (dimensionless).')
      },
      outputSchema: { rp_m: z.number(), ra_m: z.number().nullable() },
      annotations: PURE_TOOL
    },
    ({ a_m, e }) => {
      const { rp, ra } = periApoapsisRadii(a_m, e);

      return result({ rp_m: rp, ra_m: ra });
    }
  );

  server.registerTool(
    'sphere_of_influence_radius',
    {
      title: 'Sphere of influence',
      description:
        'Laplace sphere-of-influence radius of a secondary body orbiting a primary: r_SOI = a·(m/M)^(2/5).',
      inputSchema: {
        a_m: z
          .number()
          .positive()
          .describe(
            'Semi-major axis of the secondary around the primary, in metres.'
          ),
        m_kg: z
          .number()
          .positive()
          .describe('Secondary (smaller) mass, in kg.'),
        M_kg: z.number().positive().describe('Primary (larger) mass, in kg.')
      },
      outputSchema: { r_soi_m: z.number() },
      annotations: PURE_TOOL
    },
    ({ a_m, m_kg, M_kg }) =>
      result({ r_soi_m: sphereOfInfluenceRadius(a_m, m_kg, M_kg) })
  );
};
