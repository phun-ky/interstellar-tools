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

/**
 * The Alpha Centauri entries in `STARS` currently carry the Sun's galactic
 * orbit instead of the binary + Proxima system, so they are held back until
 * that model lands.
 */
const isTrusted = (body: { system?: unknown }) =>
  !(
    typeof body.system === 'object' &&
    body.system !== null &&
    'name' in body.system &&
    body.system.name === 'Alpha Centauri'
  );

export const DATASETS = {
  planets: {
    description: 'Planets and dwarf planets of the Solar System.',
    data: PLANETS
  },
  moons: { description: 'Natural satellites.', data: MOONS },
  stars: {
    description: 'Stars (Alpha Centauri entries omitted pending a fix).',
    data: STARS.filter(isTrusted)
  },
  comets: { description: 'Comets.', data: COMETS },
  asteroids: { description: 'Asteroids.', data: ASTEROIDS },
  'asteroid-belts': { description: 'Asteroid belts.', data: ASTEROID_BELTS },
  galaxies: { description: 'Galaxies.', data: GALAXIES },
  systems: { description: 'Planetary and stellar systems.', data: SYSTEMS }
} as const;

export type DatasetNameType = keyof typeof DATASETS;

const DATASET_NAMES = Object.keys(DATASETS) as [
  DatasetNameType,
  ...DatasetNameType[]
];
const uriFor = (name: DatasetNameType) => `interstellar://datasets/${name}`;
const UNITS_NOTE =
  'Values carry their own units ({ value, unit }); `a` is usually in au, `period` in days (negative = integration direction), `radius` in km, `angle` in radians at J2000.';

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
      description: `Look up celestial bodies by name (case-insensitive substring) across the bundled datasets. ${UNITS_NOTE} Bodies do not carry masses; use known μ values with the orbit tools.`,
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe('Name or part of a name, e.g. "mars".'),
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
        (DATASETS[name].data as readonly { name: string }[])
          .filter((body) => body.name.toLowerCase().includes(needle))
          .map((body) => ({ dataset: name, body }))
      );

      return result({ count: matches.length, matches });
    }
  );
};
