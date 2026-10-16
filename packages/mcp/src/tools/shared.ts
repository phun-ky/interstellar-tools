import { toRad } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/** Standard gravitational parameter input, shared by most orbit tools. */
export const muSchema = z
  .number()
  .positive()
  .describe(
    'Standard gravitational parameter μ = G·M of the central body, in m³/s². Earth ≈ 3.986004418e14, Sun ≈ 1.32712440018e20.'
  );

/** Angle input that accepts either degrees or radians. */
export const angleSchema = z
  .object({
    value: z.number().finite(),
    unit: z.enum(['deg', 'rad'])
  })
  .describe('Angle with explicit unit, e.g. { "value": 28.5, "unit": "deg" }.');

export type AngleInputType = z.infer<typeof angleSchema>;

/** Angle output carrying both radians and degrees. */
export const angleOutputSchema = z.object({
  rad: z.number(),
  deg: z.number()
});

export const toRadians = ({ value, unit }: AngleInputType): Radians =>
  unit === 'deg' ? toRad(value) : (value as Radians);

export const angleOutput = (rad: number) => ({
  rad,
  deg: (rad * 180) / Math.PI
});

/**
 * Wraps a structured result so clients get both machine-readable
 * `structuredContent` and a JSON text block for models that only read text.
 */
export const result = <T extends Record<string, unknown>>(
  data: T
): CallToolResult & { structuredContent: T } => ({
  content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  structuredContent: data
});

/** Tool annotations shared by every calculation tool: pure, offline, deterministic. */
export const PURE_TOOL = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
} as const;
