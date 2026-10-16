import {
  eccentricToTrueAnomaly,
  norm2pi,
  solveKepler,
  trueToMeanAnomaly
} from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  angleOutput,
  angleOutputSchema,
  angleSchema,
  PURE_TOOL,
  result,
  toRadians
} from './shared.js';

const ANOMALIES = ['mean', 'eccentric', 'true'] as const;

type AnomalyType = (typeof ANOMALIES)[number];

const eccentricitySchema = z
  .number()
  .min(0)
  .lt(1)
  .describe('Eccentricity of an elliptic orbit, 0 ≤ e < 1.');
// Every conversion goes through the library: mean → eccentric via Kepler’s
// equation, eccentric → true directly, and true → mean directly.
const toMean = (kind: AnomalyType, x: Radians, e: number): Radians => {
  if (kind === 'mean') return x;

  const nu = kind === 'true' ? x : eccentricToTrueAnomaly(x, e);

  return trueToMeanAnomaly(nu, e);
};
const fromMean = (kind: AnomalyType, M: Radians, e: number): Radians => {
  if (kind === 'mean') return M;

  const E = solveKepler(M, e);

  return kind === 'eccentric' ? E : eccentricToTrueAnomaly(E, e);
};

export const registerAnomalyTools = (server: McpServer) => {
  server.registerTool(
    'solve_kepler',
    {
      title: 'Solve Kepler’s equation',
      description:
        'Solve Kepler’s equation M = E − e·sin(E) for the eccentric anomaly E, given mean anomaly M and eccentricity e (elliptic orbits). Robust up to e → 1.',
      inputSchema: { M: angleSchema, e: eccentricitySchema },
      outputSchema: { E: angleOutputSchema },
      annotations: PURE_TOOL
    },
    ({ M, e }) => result({ E: angleOutput(solveKepler(toRadians(M), e)) })
  );

  server.registerTool(
    'convert_anomaly',
    {
      title: 'Convert orbital anomaly',
      description:
        'Convert between mean, eccentric and true anomaly for an elliptic orbit. Results are normalised to [0, 2π).',
      inputSchema: {
        from: z.enum(ANOMALIES).describe('Kind of the input anomaly.'),
        to: z.enum(ANOMALIES).describe('Kind of anomaly to return.'),
        angle: angleSchema,
        e: eccentricitySchema
      },
      outputSchema: { kind: z.enum(ANOMALIES), angle: angleOutputSchema },
      annotations: PURE_TOOL
    },
    ({ from, to, angle, e }) => {
      const M = toMean(from, toRadians(angle), e);

      return result({
        kind: to,
        angle: angleOutput(norm2pi(fromMean(to, M, e)))
      });
    }
  );
};
