import {
  ASTEROID_BELTS,
  ASTEROIDS,
  COMETS,
  GALAXIES,
  MOONS,
  PLANETS,
  STARS,
  SYSTEMS
} from '@interstellar-tools/constants';
import {
  McpServer,
  ResourceTemplate
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { PURE_TOOL, result } from './tools/shared.js';

export const DATASETS = {
  planets: {
    description: 'Planets and dwarf planets of the Solar System.',
    data: PLANETS
  },
  moons: { description: 'Natural satellites.', data: MOONS },
  stars: { description: 'Stars.', data: STARS },
  comets: { description: 'Comets.', data: COMETS },
  asteroids: { description: 'Asteroids.', data: ASTEROIDS },
  'asteroid-belts': { description: 'Asteroid belts.', data: ASTEROID_BELTS },
  galaxies: { description: 'Galaxies.', data: GALAXIES },
  systems: {
    description:
      'Systems: the barycenters that stars and planets orbit, nested for multiple stars.',
    data: SYSTEMS
  }
} as const;

export type DatasetNameType = keyof typeof DATASETS;

const DATASET_NAMES = Object.keys(DATASETS) as [
  DatasetNameType,
  ...DatasetNameType[]
];
const uriFor = (name: DatasetNameType) => `interstellar://datasets/${name}`;
const UNITS_NOTE =
  'Each body has a stable `id` and names the body, system or galaxy it is bound to in `parent`; `orbit` holds its elements around that parent. Values carry their own units ({ value, unit }); `orbit.a` is usually in au, `orbit.period` in days (always positive; `orbit.retrograde: true` marks a retrograde orbit), `radius` in km, `orbit.angle` in radians at J2000.';

export const registerBodies = (server: McpServer) => {
  server.registerResource(
    'dataset',
    new ResourceTemplate('interstellar://datasets/{name}', {
      list: () => ({
        resources: DATASET_NAMES.map((name) => ({
          name,
          uri: uriFor(name),
          description: DATASETS[name].description,
          mimeType: 'application/json'
        }))
      }),
      complete: {
        name: (value) => DATASET_NAMES.filter((name) => name.startsWith(value))
      }
    }),
    {
      title: 'Celestial body dataset',
      description: `Celestial body datasets from @interstellar-tools/constants. ${UNITS_NOTE}`,
      mimeType: 'application/json'
    },
    (uri, { name }) => {
      const dataset = DATASETS[String(name) as DatasetNameType];

      if (!dataset) throw new Error(`Unknown dataset: ${String(name)}`);

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(dataset.data, null, 2)
          }
        ]
      };
    }
  );

  server.registerTool(
    'find_body',
    {
      title: 'Find celestial body',
      description: `Look up celestial bodies by name or id (case-insensitive substring) across the bundled datasets. ${UNITS_NOTE} The Sun, planets and larger moons carry \`mu\` (G·M in m³/s²), ready for the orbit tools; stars also carry \`mass\` in solar masses.`,
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe(
            'Name, id or part of one, e.g. "mars" or "alpha-centauri".'
          ),
        dataset: z
          .enum(DATASET_NAMES)
          .optional()
          .describe('Restrict the search to one dataset.')
      },
      annotations: PURE_TOOL
    },
    ({ query, dataset }) => {
      const needle = query.trim().toLowerCase();
      const names = dataset ? [dataset] : DATASET_NAMES;
      const matches = names.flatMap((name) =>
        (DATASETS[name].data as readonly { id: string; name: string }[])
          .filter(
            (body) =>
              body.name.toLowerCase().includes(needle) ||
              body.id.includes(needle)
          )
          .map((body) => ({ dataset: name, body }))
      );

      return result({ count: matches.length, matches });
    }
  );
};
