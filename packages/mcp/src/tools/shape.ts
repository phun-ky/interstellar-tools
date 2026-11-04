import { WGS84 } from '@interstellar-tools/constants';
import { convertDistanceUnit } from '@interstellar-tools/equations';
import type {
  DistanceInterface,
  EllipsoidInterface
} from '@interstellar-tools/types';
import { z } from 'zod';

import { DATASETS } from '../bodies.js';

// The shape of a body, from the datasets or given in metres, for the geodesy
// and map tools

const describeBody = (extra: string) =>
  z
    .string()
    .min(1)
    .optional()
    .describe(
      `Body id from find_body, such as "earth", "mars" or "moon"${extra}. Give this or the radius in metres, not both.`
    );

/** A body or a radius in metres: the sphere tools take one of them. */
export const sphereInput = {
  body: describeBody(''),
  radius_m: z
    .number()
    .positive()
    .optional()
    .describe(
      'Radius of the sphere, in metres. Earth’s mean radius is 6371008.4.'
    )
};

/** A body or two radii in metres: the ellipsoid tools take one of them. */
export const ellipsoidInput = {
  body: describeBody(', or "wgs84" for the ellipsoid GPS uses'),
  equatorial_radius_m: z
    .number()
    .positive()
    .optional()
    .describe('Equatorial radius a of the ellipsoid, in metres.'),
  polar_radius_m: z
    .number()
    .positive()
    .optional()
    .describe(
      'Polar radius c of the ellipsoid, in metres, no larger than the equatorial radius.'
    )
};

type BodyType = {
  id: string;
  radius?: DistanceInterface;
  ellipsoid?: EllipsoidInterface;
};

const metres = (distance: DistanceInterface) =>
  convertDistanceUnit(distance, 'm').value;
const findBody = (id: string) => {
  const needle = id.trim().toLowerCase();

  for (const { data } of Object.values(DATASETS))
    for (const body of data as readonly BodyType[])
      if (body.id === needle) return body;

  throw new Error(
    `Unknown body: ${id}. Use the id that find_body returns, such as "mars".`
  );
};

/** The radius of a sphere, from a body's mean radius or a given radius. */
export const resolveSphere = ({
  body,
  radius_m
}: {
  body?: string;
  radius_m?: number;
}): number => {
  if ((body === undefined) === (radius_m === undefined))
    throw new Error('Give either body or radius_m.');

  if (radius_m !== undefined) return radius_m;

  const found = findBody(body!);

  if (!found.radius)
    throw new Error(
      `${found.id} has no radius in the datasets: give radius_m.`
    );

  return metres(found.radius);
};

/** The radii of an oblate ellipsoid, from a body or given radii. */
export const resolveEllipsoid = ({
  body,
  equatorial_radius_m,
  polar_radius_m
}: {
  body?: string;
  equatorial_radius_m?: number;
  polar_radius_m?: number;
}): { a: number; c: number } => {
  const radii = [equatorial_radius_m, polar_radius_m].filter(
    (r) => r !== undefined
  ).length;

  if (body !== undefined && radii > 0)
    throw new Error(
      'Give either body or equatorial_radius_m and polar_radius_m, not both.'
    );

  if (body === undefined) {
    if (radii < 2)
      throw new Error(
        'Give either body, or both equatorial_radius_m and polar_radius_m.'
      );

    if (polar_radius_m! > equatorial_radius_m!)
      throw new Error(
        'polar_radius_m must be no larger than equatorial_radius_m: the tools take an oblate ellipsoid.'
      );

    return { a: equatorial_radius_m!, c: polar_radius_m! };
  }

  const found =
    body.trim().toLowerCase() === 'wgs84'
      ? { id: 'wgs84', ellipsoid: WGS84 }
      : findBody(body);

  if (found.ellipsoid?.alongOrbitRadius)
    throw new Error(
      `${found.id} is a triaxial ellipsoid, and geodetic coordinates need an oblate one. To approximate it, give equatorial_radius_m and polar_radius_m.`
    );

  if (found.ellipsoid)
    return {
      a: metres(found.ellipsoid.equatorialRadius),
      c: metres(found.ellipsoid.polarRadius)
    };

  // No measured shape: a sphere of the mean radius
  const r = resolveSphere({ body });

  return { a: r, c: r };
};
