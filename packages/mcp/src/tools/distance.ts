import {
  convertDistanceUnit,
  normalizeDistanceUnit
} from '@interstellar-tools/equations';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { PURE_TOOL, result } from './shared.js';

const unitSchema = z
  .string()
  .min(1)
  .describe(
    'Distance unit: m, km, au, ly, kly, Mly, Gly, pc, kpc, Mpc, Gpc, or a long form such as "kilometres", "AU" or "light-years". Light-years use the Julian year.'
  );

export const registerDistanceTools = (server: McpServer) => {
  server.registerTool(
    'convert_distance',
    {
      title: 'Convert distance unit',
      description:
        'Convert a distance between units, from metres to gigaparsecs. Datasets give orbit.a in au and radius in km, while the orbit tools take metres: convert with this tool first.',
      inputSchema: {
        value: z.number().finite().describe('Distance in the `from` unit.'),
        from: unitSchema,
        to: unitSchema
      },
      outputSchema: { value: z.number(), unit: z.string() },
      annotations: PURE_TOOL
    },
    ({ value, from, to }) => {
      const { value: converted, unit } = convertDistanceUnit(
        { value, unit: normalizeDistanceUnit(from) },
        normalizeDistanceUnit(to)
      );

      return result({ value: converted, unit });
    }
  );
};
