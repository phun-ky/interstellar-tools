import { SECONDS_PER_DAY } from '@interstellar-tools/constants';
import {
  hohmannTransfer,
  planeChangeDeltaV,
  rocketDeltaVFromIsp
} from '@interstellar-tools/equations';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  angleSchema,
  muSchema,
  PURE_TOOL,
  result,
  toRadians
} from './shared.js';

const directionSchema = z.enum(['prograde', 'retrograde', 'none']);

export const registerManoeuvreTools = (server: McpServer) => {
  server.registerTool(
    'hohmann_transfer',
    {
      title: 'Hohmann transfer',
      description:
        'Two-impulse Hohmann transfer between coplanar circular orbits of radius r1 and r2 around the same body. Returns both burns, total Δv and transfer time.',
      inputSchema: {
        r1_m: z
          .number()
          .positive()
          .describe(
            'Initial circular orbit radius from body centre, in metres.'
          ),
        r2_m: z
          .number()
          .positive()
          .describe(
            'Target circular orbit radius from body centre, in metres.'
          ),
        mu_m3_s2: muSchema
      },
      outputSchema: {
        a_transfer_m: z.number(),
        dv1_m_s: z.number(),
        dv2_m_s: z.number(),
        dv_total_m_s: z.number(),
        t_transfer_s: z.number(),
        t_transfer_d: z.number(),
        burn1_direction: directionSchema,
        burn2_direction: directionSchema
      },
      annotations: PURE_TOOL
    },
    ({ r1_m, r2_m, mu_m3_s2 }) => {
      const { at, dv1, dv2, dvTotal, tTransfer, dir1, dir2 } = hohmannTransfer(
        r1_m,
        r2_m,
        mu_m3_s2
      );

      return result({
        a_transfer_m: at,
        dv1_m_s: dv1,
        dv2_m_s: dv2,
        dv_total_m_s: dvTotal,
        t_transfer_s: tTransfer,
        t_transfer_d: tTransfer / SECONDS_PER_DAY,
        burn1_direction: dir1,
        burn2_direction: dir2
      });
    }
  );

  server.registerTool(
    'rocket_delta_v',
    {
      title: 'Rocket equation Δv',
      description:
        'Tsiolkovsky rocket equation from specific impulse: Δv = g0·Isp·ln(m0/mf).',
      inputSchema: {
        isp_s: z.number().positive().describe('Specific impulse, in seconds.'),
        m0_kg: z.number().positive().describe('Initial (wet) mass, in kg.'),
        mf_kg: z
          .number()
          .positive()
          .describe('Final (dry) mass, in kg. Must be less than m0_kg.')
      },
      outputSchema: { dv_m_s: z.number() },
      annotations: PURE_TOOL
    },
    ({ isp_s, m0_kg, mf_kg }) =>
      result({ dv_m_s: rocketDeltaVFromIsp(isp_s, m0_kg, mf_kg) })
  );

  server.registerTool(
    'plane_change_delta_v',
    {
      title: 'Plane change Δv',
      description:
        'Δv for a pure inclination change at constant speed: Δv = 2v·sin(Δi/2). Δi must be within [0°, 180°].',
      inputSchema: {
        v_m_s: z
          .number()
          .nonnegative()
          .describe('Orbital speed at the burn point, in m/s.'),
        delta_i: angleSchema
      },
      outputSchema: { dv_m_s: z.number() },
      annotations: PURE_TOOL
    },
    ({ v_m_s, delta_i }) =>
      result({ dv_m_s: planeChangeDeltaV(v_m_s, toRadians(delta_i)) })
  );
};
