import {
  elementsToState,
  stateToElements
} from '@interstellar-tools/equations';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  angleOutput,
  angleOutputSchema,
  angleSchema,
  muSchema,
  PURE_TOOL,
  result,
  toRadians,
  vectorOutputSchema,
  vectorSchema
} from './shared.js';

export const registerStateVectorTools = (server: McpServer) => {
  server.registerTool(
    'state_to_elements',
    {
      title: 'State vector to orbital elements',
      description:
        'Classical orbital elements (a, e, i, Ω, ω, ν) from a position and velocity in an inertial frame centred on the body. Works for ellipses, parabolas and hyperbolas; a_m is left out for a parabola. For a circular orbit ω is 0 and ν is measured from the node; for an equatorial one Ω is 0. Returns the periapsis radius, the specific energy, and the period if the orbit is elliptic.',
      inputSchema: {
        r_m: vectorSchema('Position [x, y, z], in metres.'),
        v_m_s: vectorSchema('Velocity [vx, vy, vz], in m/s.'),
        mu_m3_s2: muSchema
      },
      outputSchema: {
        a_m: z.number().optional(),
        e: z.number(),
        i: angleOutputSchema,
        raan: angleOutputSchema,
        argp: angleOutputSchema,
        nu: angleOutputSchema,
        rp_m: z.number(),
        energy_m2_s2: z.number(),
        T_s: z.number().optional()
      },
      annotations: PURE_TOOL
    },
    ({ r_m, v_m_s, mu_m3_s2 }) => {
      const { a, e, p, i, raan, argp, nu } = stateToElements(
        r_m,
        v_m_s,
        mu_m3_s2
      );

      return result({
        // A parabola has no finite a, and JSON can't carry Infinity
        ...(Number.isFinite(a) && { a_m: a }),
        e,
        i: angleOutput(i),
        raan: angleOutput(raan),
        argp: angleOutput(argp),
        nu: angleOutput(nu),
        rp_m: p! / (1 + e),
        energy_m2_s2: -mu_m3_s2 / (2 * a),
        ...(e < 1 && { T_s: 2 * Math.PI * Math.sqrt(a ** 3 / mu_m3_s2) })
      });
    }
  );

  server.registerTool(
    'elements_to_state',
    {
      title: 'Orbital elements to state vector',
      description:
        'Position and velocity in an inertial frame centred on the body, from classical orbital elements. Give the size as either a_m (a > 0 with e < 1 for an ellipse, a < 0 with e > 1 for a hyperbola) or rp_m, the periapsis radius, which a parabola (e = 1) needs.',
      inputSchema: {
        a_m: z
          .number()
          .finite()
          .refine((a) => a !== 0, 'a must be non-zero')
          .optional()
          .describe(
            'Semi-major axis, in metres. Positive for elliptic, negative for hyperbolic. Give this or rp_m.'
          ),
        rp_m: z
          .number()
          .positive()
          .finite()
          .optional()
          .describe(
            'Periapsis radius, in metres. Give this or a_m; a parabola needs it.'
          ),
        e: z.number().nonnegative().describe('Eccentricity, e ≥ 0.'),
        i: angleSchema.describe('Inclination, in [0°, 180°].'),
        raan: angleSchema.describe('Right ascension of the ascending node Ω.'),
        argp: angleSchema.describe('Argument of periapsis ω.'),
        nu: angleSchema.describe('True anomaly ν.'),
        mu_m3_s2: muSchema
      },
      outputSchema: {
        r_m: vectorOutputSchema,
        v_m_s: vectorOutputSchema
      },
      annotations: PURE_TOOL
    },
    ({ a_m, rp_m, e, i, raan, argp, nu, mu_m3_s2 }) => {
      if ((a_m === undefined) === (rp_m === undefined))
        throw new Error('Give exactly one of a_m and rp_m.');

      const { r, v } = elementsToState(
        {
          // With p given, elementsToState ignores a
          a: a_m ?? Infinity,
          ...(rp_m !== undefined && { p: rp_m * (1 + e) }),
          e,
          i: toRadians(i),
          raan: toRadians(raan),
          argp: toRadians(argp),
          nu: toRadians(nu)
        },
        mu_m3_s2
      );

      return result({ r_m: r, v_m_s: v });
    }
  );
};
