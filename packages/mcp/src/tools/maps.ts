import {
  equirectangular,
  lambertAzimuthalEqualArea,
  mercator,
  mollweide,
  orthographic,
  sinusoidal,
  stereographic
} from '@interstellar-tools/maps';
import type { Radians } from '@interstellar-tools/types';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { resolveSphere, sphereInput } from './shape.js';
import { angleSchema, PURE_TOOL, result, toRadians } from './shared.js';

const PROJECTIONS = {
  equirectangular,
  mercator,
  sinusoidal,
  mollweide,
  lambert_azimuthal_equal_area: lambertAzimuthalEqualArea,
  stereographic,
  orthographic
} as const;

type ProjectionNameType = keyof typeof PROJECTIONS;

const PROJECTION_NAMES = Object.keys(PROJECTIONS) as [
  ProjectionNameType,
  ...ProjectionNameType[]
];
// The projections that take a centre latitude, and the one with a standard
// parallel
const CENTRED = new Set<ProjectionNameType>([
  'equirectangular',
  'lambert_azimuthal_equal_area',
  'stereographic',
  'orthographic'
]);

export const registerMapTools = (server: McpServer) => {
  server.registerTool(
    'project_point',
    {
      title: 'Project a point onto a map',
      description:
        'Map coordinates x (east) and y (north), in metres on a sphere, of a latitude and longitude in one of seven projections. equirectangular: plain latitude–longitude grid, as most planetary maps use. mercator: keeps angles, for navigation and web maps; no poles. sinusoidal and mollweide: keep areas, whole-world maps. lambert_azimuthal_equal_area: keeps areas around a centre point. stereographic: keeps angles around a centre point, for polar maps. orthographic: the globe as seen from far away; only the near hemisphere.',
      inputSchema: {
        projection: z.enum(PROJECTION_NAMES).describe('The map projection.'),
        latitude: angleSchema.describe(
          'Latitude of the point, north positive, in [-90°, 90°].'
        ),
        longitude: angleSchema.describe(
          'Longitude of the point, east positive.'
        ),
        ...sphereInput,
        center_longitude: angleSchema
          .optional()
          .describe(
            'Longitude of the map’s centre (the central meridian). Defaults to 0.'
          ),
        center_latitude: angleSchema
          .optional()
          .describe(
            'Latitude of the map’s centre, for equirectangular and the azimuthal projections (lambert_azimuthal_equal_area, stereographic, orthographic); 90° gives a north polar map. Defaults to 0.'
          ),
        standard_parallel: angleSchema
          .optional()
          .describe(
            'For equirectangular only: the latitude where the map is true to scale east–west, often the latitude of the area mapped. Defaults to 0, the equator.'
          )
      },
      outputSchema: { x_m: z.number(), y_m: z.number(), radius_m: z.number() },
      annotations: PURE_TOOL
    },
    ({
      projection,
      latitude,
      longitude,
      center_longitude,
      center_latitude,
      standard_parallel,
      ...shape
    }) => {
      if (center_latitude && !CENTRED.has(projection))
        throw new Error(
          `${projection} has no center_latitude: it is centred on the equator.`
        );

      if (standard_parallel && projection !== 'equirectangular')
        throw new Error('Only equirectangular takes a standard_parallel.');

      const radius_m = resolveSphere(shape);
      const options: { lambda0?: Radians; phi0?: Radians; phi1?: Radians } = {};

      if (center_longitude) options.lambda0 = toRadians(center_longitude);

      if (center_latitude) options.phi0 = toRadians(center_latitude);

      if (standard_parallel) options.phi1 = toRadians(standard_parallel);

      const { x, y } = PROJECTIONS[projection](
        toRadians(latitude),
        toRadians(longitude),
        radius_m,
        options
      );

      return result({ x_m: x, y_m: y, radius_m });
    }
  );
};
