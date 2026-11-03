import { SECONDS_PER_DAY } from '@interstellar-tools/constants';
import {
  characteristicEnergyC3,
  circularSpeed,
  hohmannTransfer,
  hyperbolicEccentricity,
  hyperbolicPeriapsisSpeed,
  planeChangeDeltaV,
  rocketDeltaVFromIsp,
  solveLambert
} from '@interstellar-tools/equations';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  angleSchema,
  muSchema,
  PURE_TOOL,
  result,
  toRadians,
  vectorOutputSchema,
  vectorSchema
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

  server.registerTool(
    'solve_lambert',
    {
      title: 'Lambert’s problem',
      description:
        'Find the orbit from position r1 to position r2 in time dt (Lambert’s problem), single revolution, for ellipses and hyperbolas alike. Returns the velocities at both ends. Positions are in an inertial frame centred on the body. For the burns, subtract the velocity of the orbit you leave from v1, and v2 from the velocity of the orbit you join. Positions 0° or 180° apart are an error: the transfer plane is undefined. Feed v1 to state_to_elements for the transfer orbit.',
      inputSchema: {
        r1_m: vectorSchema('Start position [x, y, z], in metres.'),
        r2_m: vectorSchema('End position [x, y, z], in metres.'),
        dt_s: z.number().positive().describe('Time of flight, in seconds.'),
        mu_m3_s2: muSchema,
        prograde: z
          .boolean()
          .default(true)
          .describe(
            'true (default): fly counterclockwise seen from +z. false: clockwise.'
          )
      },
      outputSchema: {
        v1_m_s: vectorOutputSchema,
        v2_m_s: vectorOutputSchema,
        speed1_m_s: z.number(),
        speed2_m_s: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ r1_m, r2_m, dt_s, mu_m3_s2, prograde }) => {
      const { v1, v2 } = solveLambert(r1_m, r2_m, dt_s, mu_m3_s2, {
        prograde
      });

      return result({
        v1_m_s: v1,
        v2_m_s: v2,
        speed1_m_s: Math.hypot(...v1),
        speed2_m_s: Math.hypot(...v2)
      });
    }
  );

  server.registerTool(
    'hyperbolic_departure',
    {
      title: 'Hyperbolic departure or capture',
      description:
        'The burn from a circular parking orbit of radius rp onto the hyperbola that leaves the body with excess speed v∞, made at periapsis. The same Δv captures an arriving v∞ into that circular orbit. Also returns C3 = v∞², the launch-energy figure, and the hyperbola’s eccentricity. For an interplanetary transfer, v∞ is the difference between the planet’s velocity and the transfer orbit’s (from solve_lambert).',
      inputSchema: {
        v_inf_m_s: z
          .number()
          .positive()
          .describe('Hyperbolic excess speed v∞, in m/s.'),
        rp_m: z
          .number()
          .positive()
          .describe(
            'Periapsis radius, the parking orbit’s radius from the body’s centre, in metres.'
          ),
        mu_m3_s2: muSchema
      },
      outputSchema: {
        vp_m_s: z.number(),
        v_circular_m_s: z.number(),
        dv_m_s: z.number(),
        c3_m2_s2: z.number(),
        e: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ v_inf_m_s, rp_m, mu_m3_s2 }) => {
      const vp = hyperbolicPeriapsisSpeed(v_inf_m_s, rp_m, mu_m3_s2);
      const vc = circularSpeed(rp_m, mu_m3_s2);

      return result({
        vp_m_s: vp,
        v_circular_m_s: vc,
        dv_m_s: vp - vc,
        c3_m2_s2: characteristicEnergyC3(v_inf_m_s),
        e: hyperbolicEccentricity(v_inf_m_s, rp_m, mu_m3_s2)
      });
    }
  );
};
