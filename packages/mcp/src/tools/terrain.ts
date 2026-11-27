import {
  aspectAt,
  aspectGrid,
  createGrid,
  curvatureAt,
  curvatureGrid,
  flowAccumulation,
  flowDirections,
  gradientAt,
  gridValueAt,
  hillshadeAt,
  hillshadeGrid,
  safeLandingGrid,
  slopeAt,
  slopeGrid,
  terrainRoughnessIndexAt,
  terrainRoughnessIndexGrid,
  topographicWetnessIndex,
  type GridInterface
} from '@interstellar-tools/maps';
import type { Radians } from '@interstellar-tools/types';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  angleOutput,
  angleOutputSchema,
  angleSchema,
  landerInput,
  landingAngle,
  PURE_TOOL,
  result,
  toRadians
} from './shared.js';

// Grids go in and out as JSON: 32 × 32 keeps a whole layer small enough for
// an agent's context
const MAX_SIDE = 32;
// Far beyond any relief (Olympus Mons is about 22 km), and small enough that
// gradients, areas and their sums can't overflow
const MAX_LENGTH_M = 1e6;
// Finer than any DEM, and large enough that the maths can't underflow
const MIN_CELL_M = 1e-3;
const gridInput = {
  elevation_m: z
    .array(z.array(z.number().finite().nullable()).min(3).max(MAX_SIDE))
    .min(3)
    .max(MAX_SIDE)
    .refine(
      (rows) => rows.every((row) => row.length === rows[0]!.length),
      'Every row of elevation_m must have the same number of columns.'
    )
    .describe(
      `Elevation grid (a DEM), heights in metres: an array of rows, row 0 the northernmost, each row west to east. 3 to ${MAX_SIDE} rows and columns. Heights within ±${MAX_LENGTH_M} m. null marks a missing cell.`
    ),
  cell_size_m: z
    .number()
    .min(MIN_CELL_M)
    .max(MAX_LENGTH_M)
    .describe(
      'Size of a cell east–west, in metres; also north–south unless cell_size_y_m is given. The grid must be projected: cells of constant size in metres, not degrees.'
    ),
  cell_size_y_m: z
    .number()
    .min(MIN_CELL_M)
    .max(MAX_LENGTH_M)
    .optional()
    .describe('Size of a cell north–south, in metres, if not square.'),
  no_data: z
    .number()
    .finite()
    .optional()
    .describe(
      'A height that marks a missing cell, as well as null: such as -9999, or -3.4028235e38 from a float GeoTIFF. It may lie outside the ±1e6 m limit on heights.'
    )
};
const sunInput = {
  sun_azimuth: angleSchema
    .optional()
    .describe('Sun’s azimuth, clockwise from north, for hillshade.'),
  sun_elevation: angleSchema
    .optional()
    .describe(
      'Sun’s elevation above the horizon, in [-90°, 90°], for hillshade.'
    )
};
const toGrid = ({
  elevation_m,
  cell_size_m,
  cell_size_y_m = cell_size_m,
  no_data
}: {
  elevation_m: (number | null)[][];
  cell_size_m: number;
  cell_size_y_m?: number;
  no_data?: number;
}) => {
  const values = elevation_m.flat().map((z) => z ?? NaN);
  // Checked here, not in zod: a no_data marker such as -3.4e38 is allowed
  const tooHigh = values.find(
    (z) => z !== no_data && Math.abs(z) > MAX_LENGTH_M
  );

  if (tooHigh !== undefined)
    throw new RangeError(
      `elevation_m heights must be within ±${MAX_LENGTH_M} m, or no_data. Received: ${tooHigh}`
    );

  return createGrid({
    rows: elevation_m.length,
    columns: elevation_m[0]!.length,
    values,
    cellSize: { x: cell_size_m, y: cell_size_y_m },
    ...(no_data !== undefined && { noData: no_data })
  });
};
/** The Sun's angles, if both or neither are given. */
const sunAngles = ({
  sun_azimuth,
  sun_elevation
}: {
  sun_azimuth?: z.infer<typeof angleSchema>;
  sun_elevation?: z.infer<typeof angleSchema>;
}) => {
  if ((sun_azimuth === undefined) !== (sun_elevation === undefined))
    throw new Error('Give both sun_azimuth and sun_elevation, or neither.');

  return sun_azimuth && sun_elevation
    ? { azimuth: toRadians(sun_azimuth), elevation: toRadians(sun_elevation) }
    : undefined;
};
// JSON has no NaN or Infinity: a value the terrain functions can't compute is
// null
const orNull = (x: number) => (Number.isFinite(x) ? x : null);
const angleOrNull = (x: number) => (Number.isFinite(x) ? angleOutput(x) : null);
const DEG = 180 / Math.PI;

type SunType = { azimuth: Radians; elevation: Radians };
type LayerType = {
  unit: string;
  scale: number;
  compute: (grid: GridInterface, sun?: SunType) => GridInterface;
  /** Whether min, max and mean mean anything. Defaults to true. */
  summary?: boolean;
};

const LAYERS = {
  slope: { unit: 'deg', scale: DEG, compute: slopeGrid },
  // Aspect wraps at 360° and flow directions are codes: an arithmetic mean,
  // min or max of either means nothing
  aspect: { unit: 'deg', scale: DEG, compute: aspectGrid, summary: false },
  hillshade: {
    unit: '',
    scale: 1,
    compute: (grid, sun) => hillshadeGrid(grid, sun!.azimuth, sun!.elevation)
  },
  profile_curvature: {
    unit: '1/m',
    scale: 1,
    compute: (grid) => curvatureGrid(grid).profile
  },
  planform_curvature: {
    unit: '1/m',
    scale: 1,
    compute: (grid) => curvatureGrid(grid).planform
  },
  roughness: { unit: 'm', scale: 1, compute: terrainRoughnessIndexGrid },
  flow_direction: {
    unit: '',
    scale: 1,
    compute: flowDirections,
    summary: false
  },
  flow_accumulation: { unit: 'm²', scale: 1, compute: flowAccumulation },
  wetness_index: {
    unit: '',
    scale: 1,
    compute: (grid) => topographicWetnessIndex(grid)
  }
} satisfies Record<string, LayerType>;

type LayerNameType = keyof typeof LAYERS;

/**
 * {@link result} without the indentation, which would put every grid value on
 * a line of its own: a 32 × 32 layer's text is about 30% smaller.
 */
const gridResult = <T extends Record<string, unknown>>(data: T) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data) }],
  structuredContent: data
});
const cellOutput = z.object({ row: z.number(), column: z.number() }).nullable();
/** A grid's values as rows, NaN as null, and where its extremes are. */
const layerOutput = (
  { rows, columns, values }: GridInterface,
  scale = 1,
  summary = true
) => {
  let min: number | null = null;
  let max: number | null = null;
  let minIndex = 0;
  let maxIndex = 0;
  let sum = 0;
  let valid = 0;

  values.forEach((v, i) => {
    if (!Number.isFinite(v)) return;

    valid++;
    sum += v;

    if (min === null || v < min) [min, minIndex] = [v, i];

    if (max === null || v > max) [max, maxIndex] = [v, i];
  });

  const cell = (i: number) =>
    valid ? { row: Math.floor(i / columns), column: i % columns } : null;
  const scaled = (v: number | null) => (v === null ? null : v * scale);

  return {
    values: Array.from({ length: rows }, (_, row) =>
      Array.from(values.slice(row * columns, (row + 1) * columns), (v) =>
        orNull(v * scale)
      )
    ),
    valid_cells: valid,
    ...(summary
      ? {
          min: scaled(min),
          max: scaled(max),
          mean: valid ? orNull((sum / valid) * scale) : null,
          min_cell: cell(minIndex),
          max_cell: cell(maxIndex)
        }
      : { min: null, max: null, mean: null, min_cell: null, max_cell: null })
  };
};

export const registerTerrainTools = (server: McpServer) => {
  server.registerTool(
    'terrain_at_cell',
    {
      title: 'Terrain at one cell of an elevation grid',
      description: `Everything about one cell of an elevation grid (DEM, up to ${MAX_SIDE} × ${MAX_SIDE}): its height; the gradient (rise per metre east and north, Horn’s method); the slope and the aspect (the compass direction downhill, clockwise from north); profile curvature (along the slope: positive convex, like a hill’s shoulder) and planform curvature (across it: positive a ridge, negative a gully) in 1/m; the terrain roughness index in metres (root-mean-square height difference to the eight neighbours; gdaldem’s default TRI is √8 times larger); and, given the Sun’s azimuth and elevation, the hillshade from 0 to 1. Values need the cell’s whole 3 × 3 neighbourhood: on the grid’s edge or next to a missing cell they are null. The aspect is also null on level ground, and both curvatures at a summit, pit or saddle, where the cell is level but its neighbourhood isn’t. For a whole map of one quantity use terrain_layer.`,
      inputSchema: {
        ...gridInput,
        row: z
          .number()
          .int()
          .min(0)
          .max(MAX_SIDE - 1)
          .describe('Row of the cell, 0 at the north edge.'),
        column: z
          .number()
          .int()
          .min(0)
          .max(MAX_SIDE - 1)
          .describe('Column of the cell, 0 at the west edge.'),
        ...sunInput
      },
      outputSchema: {
        elevation_m: z.number().nullable(),
        dz_dx: z.number().nullable(),
        dz_dy: z.number().nullable(),
        slope: angleOutputSchema.nullable(),
        aspect: angleOutputSchema.nullable(),
        profile_curvature_per_m: z.number().nullable(),
        planform_curvature_per_m: z.number().nullable(),
        roughness_m: z.number().nullable(),
        hillshade: z.number().nullable().optional()
      },
      annotations: PURE_TOOL
    },
    ({ row, column, sun_azimuth, sun_elevation, ...input }) => {
      const sun = sunAngles({ sun_azimuth, sun_elevation });
      const grid = toGrid(input);
      const { dzdx, dzdy } = gradientAt(grid, row, column);
      const slope = slopeAt(grid, row, column);
      const aspect = aspectAt(grid, row, column);
      const { profile, planform } = curvatureAt(grid, row, column);

      return result({
        elevation_m: orNull(gridValueAt(grid, row, column)),
        dz_dx: orNull(dzdx),
        dz_dy: orNull(dzdy),
        slope: angleOrNull(slope),
        aspect: angleOrNull(aspect),
        profile_curvature_per_m: orNull(profile),
        planform_curvature_per_m: orNull(planform),
        roughness_m: orNull(terrainRoughnessIndexAt(grid, row, column)),
        ...(sun && {
          hillshade: orNull(
            hillshadeAt(slope, aspect, sun.azimuth, sun.elevation)
          )
        })
      });
    }
  );

  server.registerTool(
    'terrain_layer',
    {
      title: 'A terrain map from an elevation grid',
      description: `One quantity for every cell of an elevation grid (DEM, up to ${MAX_SIDE} × ${MAX_SIDE}), as rows in the same layout, with its minimum, maximum, mean and the cells where the extremes are; these are null for aspect, which wraps at 360°, and flow_direction, whose values are codes. Layers: slope (deg); aspect (deg, the compass direction downhill, clockwise from north); hillshade (0 to 1, needs sun_azimuth and sun_elevation); profile_curvature and planform_curvature (1/m); roughness (terrain roughness index, m); flow_direction (D8: all flow to the steepest lower neighbour, 0 north, 1 north-east, … 7 north-west; null where it can’t drain); flow_accumulation (area draining through each cell, m²: the largest values trace channels); wetness_index (topographic wetness index ln(a / tan slope), higher is wetter). Cells on the grid’s edge or next to a missing one are null, except in the flow layers; so is the aspect of level ground, and the curvatures at a summit, pit or saddle. For one cell use terrain_at_cell.`,
      inputSchema: {
        ...gridInput,
        layer: z
          .enum(Object.keys(LAYERS) as [LayerNameType, ...LayerNameType[]])
          .describe('The quantity to map.'),
        ...sunInput
      },
      outputSchema: {
        layer: z.string(),
        unit: z.string(),
        values: z.array(z.array(z.number().nullable())),
        valid_cells: z.number(),
        min: z.number().nullable(),
        max: z.number().nullable(),
        mean: z.number().nullable(),
        min_cell: cellOutput,
        max_cell: cellOutput
      },
      annotations: PURE_TOOL
    },
    ({ layer, sun_azimuth, sun_elevation, ...input }) => {
      const sun = sunAngles({ sun_azimuth, sun_elevation });

      if ((layer === 'hillshade') !== (sun !== undefined))
        throw new Error(
          'hillshade needs sun_azimuth and sun_elevation, and only hillshade takes them.'
        );

      const { unit, scale, compute, summary }: LayerType = LAYERS[layer];

      return gridResult({
        layer,
        unit,
        ...layerOutput(compute(toGrid(input), sun), scale, summary)
      });
    }
  );

  server.registerTool(
    'safe_landing_map',
    {
      title: 'Where a lander can touch down on an elevation grid',
      description: `Screens every cell of an elevation grid (DEM, up to ${MAX_SIDE} × ${MAX_SIDE}) for a lander: 1 where it’s safe (the cell’s slope plus rock-up stays below the tip-over angle atan(r_footprint / h_com), and its terrain roughness index is at most max_roughness_m), 0 where it isn’t, null where it can’t tell (the grid’s edge and next to a missing cell). Assumes the lander faces its weakest direction downhill. Pick a cell size about the lander’s footprint: boulders smaller than a cell don’t show. The roughness index also counts the slope itself, about 0.87 × cell size × tan(slope) on a smooth plane, so allow for it in max_roughness_m. A first screen, not a landing decision. For one slope use landing_stability.`,
      inputSchema: {
        ...gridInput,
        ...landerInput,
        max_roughness_m: z
          .number()
          .min(0)
          .describe(
            'Largest terrain roughness index the lander can take, in metres: its clearance under the body, for example. A smooth slope has a roughness of its own, about 0.87 × cell size × tan(slope): add that for the steepest slope you accept, or smooth slopes fail as rough.'
          )
      },
      outputSchema: {
        values: z.array(z.array(z.number().nullable())),
        safe_cells: z.number(),
        unsafe_cells: z.number(),
        unknown_cells: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ r_footprint_m, h_com_m, dynamic_tilt, max_roughness_m, ...input }) => {
      const grid = toGrid(input);
      const safe = safeLandingGrid(grid, {
        rFootprint: r_footprint_m,
        hCoM: h_com_m,
        maxRoughness: max_roughness_m,
        dynamicTilt: landingAngle('dynamic_tilt', dynamic_tilt)
      });
      const { values, valid_cells } = layerOutput(safe);
      const safe_cells = values.flat().filter((v) => v === 1).length;

      return gridResult({
        values,
        safe_cells,
        unsafe_cells: valid_cells - safe_cells,
        unknown_cells: safe.values.length - valid_cells
      });
    }
  );
};
