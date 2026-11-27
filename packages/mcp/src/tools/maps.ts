import {
  equirectangular,
  fromQuadkey,
  groundSampleDistance,
  illuminationAngles,
  instantaneousFieldOfView,
  inverseEquirectangular,
  inverseLambertAzimuthalEqualArea,
  inverseMercator,
  inverseMollweide,
  inverseOrthographic,
  inverseSinusoidal,
  inverseStereographic,
  isStableLanding,
  lambertAzimuthalEqualArea,
  lambertReflectance,
  lommelSeeligerReflectance,
  mercator,
  mollweide,
  orthographic,
  quadkey,
  sinusoidal,
  stereographic,
  swathWidth,
  tileAt,
  tileBounds,
  tipOverAngle
} from '@interstellar-tools/maps';
import type { Radians } from '@interstellar-tools/types';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { resolveSphere, sphereInput } from './shape.js';
import {
  angleOutput,
  angleOutputSchema,
  angleSchema,
  landerInput,
  landingAngle,
  PURE_TOOL,
  result,
  toRadians,
  vectorSchema
} from './shared.js';

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

const INVERSE_PROJECTIONS = {
  equirectangular: inverseEquirectangular,
  mercator: inverseMercator,
  sinusoidal: inverseSinusoidal,
  mollweide: inverseMollweide,
  lambert_azimuthal_equal_area: inverseLambertAzimuthalEqualArea,
  stereographic: inverseStereographic,
  orthographic: inverseOrthographic
} as const satisfies Record<ProjectionNameType, unknown>;
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
/** Where the map is centred: shared by project_point and unproject_point. */
const mapInput = {
  projection: z.enum(PROJECTION_NAMES).describe('The map projection.'),
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
};

// Inferred, so an option added to mapInput can't be missed by mapOptions
type MapInputType = Omit<
  z.infer<z.ZodObject<typeof mapInput>>,
  keyof typeof sphereInput
>;

// 0 is every option's default, so any projection accepts it
const nonZero = (angle?: z.infer<typeof angleSchema>) =>
  angle !== undefined && angle.value !== 0;
const mapOptions = ({
  projection,
  center_longitude,
  center_latitude,
  standard_parallel
}: MapInputType) => {
  if (nonZero(center_latitude) && !CENTRED.has(projection))
    throw new Error(
      `${projection} has no center_latitude: it is centred on the equator.`
    );

  if (nonZero(standard_parallel) && projection !== 'equirectangular')
    throw new Error('Only equirectangular takes a standard_parallel.');

  const options: { lambda0?: Radians; phi0?: Radians; phi1?: Radians } = {};

  if (center_longitude) options.lambda0 = toRadians(center_longitude);

  if (center_latitude) options.phi0 = toRadians(center_latitude);

  if (standard_parallel) options.phi1 = toRadians(standard_parallel);

  return options;
};
// MAX_ZOOM in @interstellar-tools/maps, which it doesn't export
const MAX_ZOOM = 30;
const tileOutput = {
  x: z.number(),
  y: z.number(),
  z: z.number(),
  quadkey: z.string()
};

export const registerMapTools = (server: McpServer) => {
  server.registerTool(
    'project_point',
    {
      title: 'Project a point onto a map',
      description:
        'Map coordinates x (east) and y (north), in metres on a sphere, of a latitude and longitude in one of seven projections. equirectangular: plain latitude–longitude grid, as most planetary maps use. mercator: keeps angles, for navigation and web maps; no poles. sinusoidal and mollweide: keep areas, whole-world maps. lambert_azimuthal_equal_area: keeps areas around a centre point. stereographic: keeps angles around a centre point, for polar maps. orthographic: the globe as seen from far away; only the near hemisphere.',
      inputSchema: {
        latitude: angleSchema.describe(
          'Latitude of the point, north positive, in [-90°, 90°].'
        ),
        longitude: angleSchema.describe(
          'Longitude of the point, east positive.'
        ),
        ...mapInput
      },
      outputSchema: { x_m: z.number(), y_m: z.number(), radius_m: z.number() },
      annotations: PURE_TOOL
    },
    ({ latitude, longitude, body, radius_m: radius, ...map }) => {
      const options = mapOptions(map);
      const radius_m = resolveSphere({ body, radius_m: radius });
      const { x, y } = PROJECTIONS[map.projection](
        toRadians(latitude),
        toRadians(longitude),
        radius_m,
        options
      );

      return result({ x_m: x, y_m: y, radius_m });
    }
  );

  server.registerTool(
    'unproject_point',
    {
      title: 'Find the latitude and longitude of a point on a map',
      description:
        'The reverse of project_point: the latitude and longitude of a point at map coordinates x (east) and y (north), in metres, in one of the same seven projections. Give the same projection, body or radius, and centre that the map was made with. Not every projection checks that the point is on the map. An error: sinusoidal and mollweide beyond the edge meridians or past a pole, equirectangular past a pole, lambert_azimuthal_equal_area beyond 2R from the centre, orthographic beyond R (the far hemisphere). No error: equirectangular and mercator wrap an x beyond the edge meridians round to the other side, mercator turns any y into a latitude, nearer the pole the larger it is, and stereographic maps any point, far ones near the centre’s antipode. So check those yourself if x or y may lie outside the map.',
      inputSchema: {
        x_m: z
          .number()
          .finite()
          .describe('Distance east of the map’s origin, in metres.'),
        y_m: z
          .number()
          .finite()
          .describe('Distance north of the map’s origin, in metres.'),
        ...mapInput
      },
      outputSchema: {
        latitude: angleOutputSchema,
        longitude: angleOutputSchema,
        radius_m: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ x_m, y_m, body, radius_m: radius, ...map }) => {
      const options = mapOptions(map);
      const radius_m = resolveSphere({ body, radius_m: radius });
      const { phi, lambda } = INVERSE_PROJECTIONS[map.projection](
        x_m,
        y_m,
        radius_m,
        options
      );

      return result({
        latitude: angleOutput(phi),
        longitude: angleOutput(lambda),
        radius_m
      });
    }
  );

  server.registerTool(
    'tile_for_point',
    {
      title: 'Find the web map tile of a point',
      description:
        'The web map tile (XYZ scheme of OpenStreetMap and most web maps, spherical Mercator) that holds a latitude and longitude at a zoom level, and its quadkey (Bing Maps naming). x counts columns east from 180° W, y counts rows south from the top edge at about 85.05° N; both run from 0 to 2^zoom − 1. Latitudes beyond ±85.05° go to the top or bottom row. Works for any body: the scheme depends only on angles. For TMS, which counts rows from the bottom, use 2^zoom − 1 − y.',
      inputSchema: {
        latitude: angleSchema.describe(
          'Latitude of the point, north positive, in [-90°, 90°].'
        ),
        longitude: angleSchema.describe(
          'Longitude of the point, east positive.'
        ),
        zoom: z
          .number()
          .int()
          .min(0)
          .max(MAX_ZOOM)
          .describe(
            `Zoom level, an integer in [0, ${MAX_ZOOM}]: 2^zoom × 2^zoom tiles cover the map.`
          )
      },
      outputSchema: tileOutput,
      annotations: PURE_TOOL
    },
    ({ latitude, longitude, zoom }) => {
      const { x, y, z } = tileAt(
        toRadians(latitude),
        toRadians(longitude),
        zoom
      );

      return result({ x, y, z, quadkey: quadkey(x, y, z) });
    }
  );

  server.registerTool(
    'tile_info',
    {
      title: 'Describe a web map tile',
      description:
        'The edges of a web map tile (XYZ scheme, spherical Mercator) as north and south latitudes and west and east longitudes, with both its x, y, zoom and its quadkey. Give the tile as x, y and z, or as a quadkey, not both. Use it to convert between XYZ and quadkey, or to find the area a tile covers.',
      inputSchema: {
        x: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe('Column, east from 180° W, in [0, 2^z).'),
        y: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe('Row, south from the top edge of the map, in [0, 2^z).'),
        z: z
          .number()
          .int()
          .min(0)
          .max(MAX_ZOOM)
          .optional()
          .describe(`Zoom level, an integer in [0, ${MAX_ZOOM}].`),
        quadkey: z
          .string()
          .regex(new RegExp(`^[0-3]{0,${MAX_ZOOM}}$`))
          .optional()
          .describe(
            `Quadkey: one digit 0–3 per zoom level, at most ${MAX_ZOOM}. The empty string is the single tile at zoom 0.`
          )
      },
      outputSchema: {
        ...tileOutput,
        north: angleOutputSchema,
        south: angleOutputSchema,
        west: angleOutputSchema,
        east: angleOutputSchema
      },
      annotations: PURE_TOOL
    },
    ({ x, y, z, quadkey: key }) => {
      const xyz = [x, y, z].filter((v) => v !== undefined).length;

      if ((key === undefined) === (xyz === 0) || (xyz > 0 && xyz < 3))
        throw new Error('Give either x, y and z, or quadkey.');

      const tile =
        key === undefined ? { x: x!, y: y!, z: z! } : fromQuadkey(key);
      const { north, south, west, east } = tileBounds(tile.x, tile.y, tile.z);

      return result({
        ...tile,
        quadkey: quadkey(tile.x, tile.y, tile.z),
        north: angleOutput(north),
        south: angleOutput(south),
        west: angleOutput(west),
        east: angleOutput(east)
      });
    }
  );

  server.registerTool(
    'camera_ground_resolution',
    {
      title: 'Ground resolution and swath of a camera',
      description:
        'What a camera sees of the ground from a distance: the instantaneous field of view (IFOV) of one pixel, the ground sample distance (GSD, the ground one pixel covers, in metres) and, given the number of pixels across track, the field of view and swath width in metres. Flat ground seen straight down: looking off to the side stretches pixels by about 1/cos of the emission angle. The smallest object a camera can recognise is a few pixels across, not one.',
      inputSchema: {
        pixel_pitch_m: z
          .number()
          .positive()
          .describe(
            'Spacing of the detector’s pixels, in metres; 7 µm is 7e-6.'
          ),
        focal_length_m: z
          .number()
          .positive()
          .describe('Effective focal length of the camera, in metres.'),
        distance_m: z
          .number()
          .positive()
          .describe(
            'Distance to the ground along the line of sight, in metres: the altitude when looking straight down.'
          ),
        pixels_across: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(
            'Number of pixels across track, for the field of view and swath width.'
          )
      },
      outputSchema: {
        ifov: angleOutputSchema,
        gsd_m: z.number(),
        field_of_view: angleOutputSchema.optional(),
        swath_m: z.number().optional()
      },
      annotations: PURE_TOOL
    },
    ({ pixel_pitch_m, focal_length_m, distance_m, pixels_across }) => {
      const ifov = instantaneousFieldOfView(pixel_pitch_m, focal_length_m);
      const gsd_m = groundSampleDistance(distance_m, ifov);

      if (pixels_across === undefined)
        return result({ ifov: angleOutput(ifov), gsd_m });

      // The whole detector is one wide pixel: same exact formula
      const fov = instantaneousFieldOfView(
        pixels_across * pixel_pitch_m,
        focal_length_m
      );

      return result({
        ifov: angleOutput(ifov),
        gsd_m,
        field_of_view: angleOutput(fov),
        swath_m: swathWidth(distance_m, fov)
      });
    }
  );

  server.registerTool(
    'illumination_geometry',
    {
      title: 'Sun and viewing angles on a surface',
      description:
        'Photometric angles at a point on a surface from three directions, in any one frame (their lengths don’t matter): incidence (Sun from the surface normal; above 90° the point is in shadow), emission (observer from the normal; above 90° it can’t be seen) and phase (between Sun and observer, seen from the point; low phase hides the shadows that show relief). Also the relative brightness, 0 to 1, of a Lambertian surface (cos i, like snow or matte paint) and a Lommel–Seeliger one (dark, dusty surfaces like the Moon’s).',
      inputSchema: {
        normal: vectorSchema(
          'Surface normal, pointing out of the ground, [x, y, z]; not zero.'
        ),
        to_sun: vectorSchema(
          'Direction from the point to the Sun, [x, y, z]; not zero.'
        ),
        to_observer: vectorSchema(
          'Direction from the point to the observer or camera, [x, y, z]; not zero.'
        )
      },
      outputSchema: {
        incidence: angleOutputSchema,
        emission: angleOutputSchema,
        phase: angleOutputSchema,
        lambert_reflectance: z.number(),
        lommel_seeliger_reflectance: z.number()
      },
      annotations: PURE_TOOL
    },
    ({ normal, to_sun, to_observer }) => {
      const { incidence, emission, phase } = illuminationAngles(
        normal,
        to_sun,
        to_observer
      );

      return result({
        incidence: angleOutput(incidence),
        emission: angleOutput(emission),
        phase: angleOutput(phase),
        lambert_reflectance: lambertReflectance(incidence),
        lommel_seeliger_reflectance: lommelSeeligerReflectance(
          incidence,
          emission
        )
      });
    }
  );

  server.registerTool(
    'landing_stability',
    {
      title: 'Will a lander tip over',
      description:
        'Static tip-over check for a lander on a slope: the tip-over angle atan(r_footprint / h_com), the total tilt (slope plus touchdown rock-up), the margin left, and whether it stays up. The slope is in [0°, 90°]. Pass the slope and footprint in the direction the lander is most likely to tip. A first screen only: touchdown speed, leg stroke, friction and sliding footpads change the real limit. For a whole elevation grid use safe_landing_map.',
      inputSchema: {
        slope: angleSchema.describe(
          'Slope of the ground under the lander, in [0°, 90°].'
        ),
        ...landerInput
      },
      outputSchema: {
        tip_over_angle: angleOutputSchema,
        total_tilt: angleOutputSchema,
        margin: angleOutputSchema,
        stable: z.boolean()
      },
      annotations: PURE_TOOL
    },
    ({ slope, dynamic_tilt, r_footprint_m, h_com_m }) => {
      const theta = landingAngle('slope', slope, true);
      const tilt = landingAngle('dynamic_tilt', dynamic_tilt);
      const stable = isStableLanding(theta, tilt, r_footprint_m, h_com_m);
      const tip = tipOverAngle(r_footprint_m, h_com_m);

      return result({
        tip_over_angle: angleOutput(tip),
        total_tilt: angleOutput(theta + tilt),
        margin: angleOutput(tip - theta - tilt),
        stable
      });
    }
  );
};
