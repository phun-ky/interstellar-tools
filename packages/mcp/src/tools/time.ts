import {
  convertTemporalUnit,
  normalizeTemporalUnit
} from '@interstellar-tools/temporal';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { PURE_TOOL, result } from './shared.js';

const unitSchema = z
  .string()
  .min(1)
  .describe(
    'Time unit: s, ms, μs (or us), ns, ps, fs, as, zs, ys, min, h, d, yr, kyr, Myr, Gyr, or a long form such as "days" or "megayears". Years are Julian years (365.25 d).'
  );

export const registerTimeTools = (server: McpServer) => {
  server.registerTool(
    'convert_time',
    {
      title: 'Convert time unit',
      description:
        'Convert a duration between time units, from attoseconds to gigayears.',
      inputSchema: {
        value: z.number().finite().describe('Duration in the `from` unit.'),
        from: unitSchema,
        to: unitSchema
      },
      outputSchema: { value: z.number(), unit: z.string() },
      annotations: PURE_TOOL
    },
    ({ value, from, to }) => {
      const { value: converted, unit } = convertTemporalUnit(
        { value, unit: normalizeTemporalUnit(from) },
        normalizeTemporalUnit(to)
      );

      return result({ value: converted, unit });
    }
  );
};
