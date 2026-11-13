import type { ByBodyIdType } from '@interstellar-tools/types';

// The bodies with each group's entry for them merged into `key`
const attach = <B extends { id: string }>(
  bodies: readonly B[],
  key: 'observations' | 'display',
  groups: readonly ByBodyIdType<object>[]
): B[] =>
  bodies.map((body) => {
    const parts = groups.flatMap((group) =>
      Object.prototype.hasOwnProperty.call(group, body.id)
        ? [group[body.id]!]
        : []
    );

    if (parts.length === 0) return body;

    return {
      ...body,
      [key]: Object.assign(
        {},
        (body as Record<string, unknown>)[key],
        ...parts
      ) as unknown
    };
  });

/**
 * The bodies, with **observations kept apart** put back on them: each body's
 * entry in each group is merged into its `observations`.
 *
 * The datasets export what is measured about the bodies apart from them, keyed
 * by id, so an app loads only the groups it imports: `STAR_PARAMETERS`,
 * `STAR_ASTROMETRY`, `HELIOSPHERE`, `PLANET_RINGS`, `MOON_RING_ROLES`,
 * `INTERSTELLAR_OBJECT_OBSERVATIONS` and `DISCOVERIES`. This puts them back
 * together, for an app that wants everything on the body.
 *
 * ::: info Notes
 *
 * - The bodies aren't changed: the ones with an entry are copied, the rest are
 *   returned as they are.
 * - Later groups win where two give the same field.
 *
 * :::
 *
 * @param bodies - The bodies, such as `STARS`.
 * @param groups - Groups keyed by body id, each a part of the bodies' `observations`.
 * @returns The bodies, with their `observations` filled in.
 * @group Observations
 * @example
 * ```ts
 * const stars = withObservations(STARS, STAR_PARAMETERS, STAR_ASTROMETRY);
 *
 * stars.find(({ id }) => id === 'vega')?.observations?.luminosity?.value; // 40.12
 * ```
 * @see withDisplay
 */
export const withObservations = <
  B extends { id: string; observations?: object }
>(
  bodies: readonly B[],
  ...groups: ByBodyIdType<Partial<NonNullable<B['observations']>>>[]
): B[] => attach(bodies, 'observations', groups);

/**
 * The bodies, with **drawing groups kept apart** put back on them: each
 * body's entry in each group is merged into its `display`, beside its colour.
 *
 * @param bodies - The bodies, such as `PLANETS`.
 * @param groups - Groups keyed by body id, each a part of the bodies' `display`, such as `RING_DISPLAY`.
 * @returns The bodies, with their `display` filled in.
 * @group Observations
 * @example
 * ```ts
 * const planets = withDisplay(PLANETS, RING_DISPLAY);
 *
 * planets.find(({ id }) => id === 'saturn')?.display?.rings?.color; // '#cabcba'
 * ```
 * @see withObservations
 */
export const withDisplay = <B extends { id: string; display?: object }>(
  bodies: readonly B[],
  ...groups: ByBodyIdType<Partial<NonNullable<B['display']>>>[]
): B[] => attach(bodies, 'display', groups);
