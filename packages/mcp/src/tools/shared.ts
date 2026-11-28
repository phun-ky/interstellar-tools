import { toRad } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/** Standard gravitational parameter input, shared by most orbit tools. */
export const muSchema = z
  .number()
  .positive()
  .describe(
    'Standard gravitational parameter μ = G·M of the central body, in m³/s². Take it from the `mu` of the body (find_body); Earth ≈ 3.986004355e14, Sun ≈ 1.32712440041e20.'
  );

/** Angle input that accepts either degrees or radians. */
export const angleSchema = z
  .object({
    value: z.number().finite(),
    unit: z.enum(['deg', 'rad'])
  })
  .describe('Angle with explicit unit, e.g. { "value": 28.5, "unit": "deg" }.');

export type AngleInputType = z.infer<typeof angleSchema>;

/** A 3D vector input, such as a position or a velocity. */
export const vectorSchema = (description: string) =>
  z
    .tuple([z.number().finite(), z.number().finite(), z.number().finite()])
    .describe(description);

/** A 3D vector output. */
export const vectorOutputSchema = z.tuple([z.number(), z.number(), z.number()]);

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
// The first value that isn't a finite number, with its path, if any
const nonFinite = (
  value: unknown,
  path: string
): [string, number] | undefined => {
  if (typeof value === 'number')
    return Number.isFinite(value) ? undefined : [path, value];

  if (value && typeof value === 'object')
    for (const [key, item] of Object.entries(value)) {
      const found = nonFinite(item, path ? `${path}.${key}` : key);

      if (found) return found;
    }

  return undefined;
};

export const result = <T extends Record<string, unknown>>(
  data: T
): CallToolResult & { structuredContent: T } => {
  // JSON and the output schemas have no NaN or Infinity: say which value
  // overflowed, rather than fail the output check
  const found = nonFinite(data, '');

  if (found)
    throw new RangeError(
      `${found[0]} came out as ${found[1]}: the inputs are too large or too small for a finite result.`
    );

  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    structuredContent: data
  };
};

/** Tool annotations shared by every calculation tool: pure, offline, deterministic. */
export const PURE_TOOL = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
} as const;

/** The lander's geometry: shared by landing_stability and safe_landing_map. */
export const landerInput = {
  r_footprint_m: z
    .number()
    .positive()
    .describe(
      'Horizontal distance from the centre of mass to the edge the lander would tip over, in metres. For n legs on a circle of radius R it is R·cos(180°/n): R/√2 for four legs, R/2 for three.'
    ),
  h_com_m: z
    .number()
    .positive()
    .describe('Height of the centre of mass above the ground, in metres.'),
  dynamic_tilt: angleSchema
    .optional()
    .describe(
      'Extra tilt from the touchdown itself, as the legs take the load (the rock-up), at least 0. Defaults to 0.'
    )
};

/**
 * A landing angle in radians, 0 if not given: throws in the caller's own unit,
 * which the maps functions can't, if it is negative or, for a slope, past
 * vertical.
 */
export const landingAngle = (
  name: string,
  angle: AngleInputType | undefined,
  upToVertical = false
): Radians => {
  if (angle === undefined) return 0 as Radians;

  const rad = toRadians(angle);

  if (rad < 0 || (upToVertical && rad > Math.PI / 2))
    throw new RangeError(
      `${name} must be ${upToVertical ? 'in [0°, 90°]' : 'at least 0'}. Received: ${angle.value} ${angle.unit}`
    );

  return rad;
};
