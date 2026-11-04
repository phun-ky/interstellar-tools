import {
  bodyFixedToGeodetic,
  centralAngle,
  eccentricitySquaredOblateSpheroid,
  geodeticToBodyFixed,
  horizonDistance,
  horizonSurfaceDistance
} from '@interstellar-tools/equations';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  ellipsoidInput,
  resolveEllipsoid,
  resolveSphere,
  sphereInput
} from './shape.js';
import {
  angleOutput,
  angleOutputSchema,
  angleSchema,
  PURE_TOOL,
  result,
  toRadians,
  vectorOutputSchema,
  vectorSchema
} from './shared.js';

const latitudeSchema = (which: string) =>
  angleSchema.describe(
    `Latitude${which}, north positive, in [-90°, 90°], e.g. { "value": 18.44, "unit": "deg" }.`
  );
const longitudeSchema = (which: string) =>
  angleSchema.describe(
    `Longitude${which}, east positive, e.g. { "value": 77.45, "unit": "deg" }.`
  );
const ellipsoidOutput = {
  equatorial_radius_m: z.number(),
  polar_radius_m: z.number()
};

export const registerGeodesyTools = (server: McpServer) => {
  server.registerTool(
    'great_circle_distance',
    {
      title: 'Great-circle distance',
      description:
        'Shortest distance between two points along the surface of a sphere, and the central angle between them, from their latitudes and longitudes. Uses the body’s mean radius; on an oblate body like Earth the error is up to about 0.5%.',
      inputSchema: {
        from_latitude: latitudeSchema(' of the first point'),
        from_longitude: longitudeSchema(' of the first point'),
        to_latitude: latitudeSchema(' of the second point'),
        to_longitude: longitudeSchema(' of the second point'),
        ...sphereInput
      },
      outputSchema: {
        distance_m: z.number(),
        central_angle: angleOutputSchema,
        radius_m: z.number()
      },
      annotations: PURE_TOOL
    },
    ({
      from_latitude,
      from_longitude,
      to_latitude,
      to_longitude,
      ...shape
    }) => {
      const radius_m = resolveSphere(shape);
      const angle = centralAngle(
        toRadians(from_latitude),
        toRadians(from_longitude),
        toRadians(to_latitude),
        toRadians(to_longitude)
      );

      return result({
        distance_m: radius_m * angle,
        central_angle: angleOutput(angle),
        radius_m
      });
    }
  );

  server.registerTool(
    'horizon_distance',
    {
      title: 'Distance to the horizon',
      description:
        'How far an observer at a height above a sphere can see: the straight-line distance to the horizon, and the distance along the surface to it. No atmospheric refraction.',
      inputSchema: {
        height_m: z
          .number()
          .nonnegative()
          .describe('Height of the observer above the surface, in metres.'),
        ...sphereInput
      },
      outputSchema: {
        distance_m: z.number(),
        surface_distance_m: z.number(),
        radius_m: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ height_m, ...shape }) => {
      const radius_m = resolveSphere(shape);

      return result({
        distance_m: horizonDistance(height_m, radius_m),
        surface_distance_m: horizonSurfaceDistance(height_m, radius_m),
        radius_m
      });
    }
  );

  server.registerTool(
    'geodetic_to_body_fixed',
    {
      title: 'Geodetic to body-fixed coordinates',
      description:
        'Body-fixed Cartesian position [x, y, z] of a point given by geodetic latitude, longitude and height above an oblate ellipsoid. x points to latitude 0, longitude 0; z to the north pole. On Earth, use body "wgs84" for GPS coordinates.',
      inputSchema: {
        latitude: latitudeSchema(' (geodetic)'),
        longitude: longitudeSchema(''),
        height_m: z
          .number()
          .finite()
          .describe('Height above the ellipsoid, in metres.'),
        ...ellipsoidInput
      },
      outputSchema: { r_m: vectorOutputSchema, ...ellipsoidOutput },
      annotations: PURE_TOOL
    },
    ({ latitude, longitude, height_m, ...shape }) => {
      const { a, c } = resolveEllipsoid(shape);

      return result({
        r_m: geodeticToBodyFixed(
          toRadians(latitude),
          toRadians(longitude),
          height_m,
          a,
          eccentricitySquaredOblateSpheroid(a, c)
        ),
        equatorial_radius_m: a,
        polar_radius_m: c
      });
    }
  );

  server.registerTool(
    'body_fixed_to_geodetic',
    {
      title: 'Body-fixed to geodetic coordinates',
      description:
        'Geodetic latitude, longitude and height above an oblate ellipsoid, from a body-fixed Cartesian position [x, y, z]. The inverse of geodetic_to_body_fixed. On Earth, use body "wgs84" for GPS coordinates.',
      inputSchema: {
        r_m: vectorSchema('Body-fixed position [x, y, z], in metres.'),
        ...ellipsoidInput
      },
      outputSchema: {
        latitude: angleOutputSchema,
        longitude: angleOutputSchema,
        height_m: z.number(),
        ...ellipsoidOutput
      },
      annotations: PURE_TOOL
    },
    ({ r_m, ...shape }) => {
      const { a, c } = resolveEllipsoid(shape);
      const { phi, lambda, h } = bodyFixedToGeodetic(
        ...r_m,
        a,
        eccentricitySquaredOblateSpheroid(a, c)
      );

      return result({
        latitude: angleOutput(phi),
        longitude: angleOutput(lambda),
        height_m: h,
        equatorial_radius_m: a,
        polar_radius_m: c
      });
    }
  );
};
