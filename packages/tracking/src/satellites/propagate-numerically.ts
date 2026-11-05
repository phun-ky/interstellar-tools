import { EGM2008, MOONS, STARS } from '@interstellar-tools/constants';
import {
  bodyFixedToGeodetic,
  exponentialAtmosphereDensity,
  moonPosition,
  rk45Integrate,
  rk4Integrate,
  solarRadiationPressureAcceleration,
  sunPosition,
  thirdBodyAcceleration,
  zonalHarmonicsAcceleration
} from '@interstellar-tools/equations';
import type {
  EphemerisInterface,
  GeodeticCoordinatesInterface,
  EphemerisSampleInterface,
  OdeRightHandSideType,
  StateVectorInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { temeToEarthFixed } from './earth-fixed.js';
import { earthShadow } from './shadow.js';
import { assertDate, assertVector } from './validate.js';
import { A, E_SQUARED } from './wgs84.js';

/** An impulsive manoeuvre for {@link propagateNumerically}: a change of velocity at a moment. */
export interface ManoeuvreInterface {
  /** The moment of the burn. */
  epoch: Date;
  /** The change of velocity in **m/s**, on the axes `frame` names. */
  deltaV: Vector3DTupleType;
  /** `'inertial'`, the axes of the state, or `'rtn'`: radial (out from Earth), along-track (forward, in the orbit plane) and normal (along the angular momentum). Defaults to `'inertial'`. */
  frame?: 'inertial' | 'rtn';
}

/** The forces for {@link propagateNumerically}, on top of Earth's central pull. */
export interface NumericalForcesInterface {
  /** Earth's zonal harmonics: `true` for EGM2008's J2 to J6, `false` for none, or your own J2, J3, … for EGM2008's reference radius. Defaults to `true`. */
  zonal?: boolean | readonly number[];
  /** The Sun's tidal pull. Defaults to `true`. */
  sun?: boolean;
  /** The Moon's tidal pull. Defaults to `true`. */
  moon?: boolean;
  /** Air drag: the ballistic coefficient $ m/(C_D A) $ in **kg/m²**, and the density in **kg/m³** at a point above the WGS 84 ellipsoid and a moment, from the exponential model by default. Off unless given. */
  drag?: {
    ballisticCoefficient: number;
    density?: (point: GeodeticCoordinatesInterface, date: Date) => number;
  };
  /** Sunlight's push: the reflectivity coefficient $ C_R $ and the area facing the Sun per unit mass in **m²/kg**. Off unless given. */
  solarRadiationPressure?: { Cr: number; areaToMass: number };
}

/** Options for {@link propagateNumerically}. */
export interface PropagateNumericallyOptionsInterface {
  /** The time between the samples returned, in **s**. Defaults to 60. */
  step?: number;
  /** The forces to model. */
  forces?: NumericalForcesInterface;
  /** `'rk45'`, adaptive steps within a relative `tolerance` (default 1e-10), or `'rk4'`, fixed steps of `step` **s** (default 10). Defaults to `'rk45'`. */
  integrator?: { method?: 'rk45' | 'rk4'; tolerance?: number; step?: number };
  /** Impulsive burns along the way. */
  manoeuvres?: readonly ManoeuvreInterface[];
}

// Earth's rotation, which carries the air around with it, in rad/s
const OMEGA_EARTH = 7.292115e-5;
// The height at which the propagation ends, in m: the satellite is coming
// down within minutes
const REENTRY_HEIGHT = 100_000;
const MU_SUN = STARS.find(({ id }) => id === 'sun')!.mu!;
const MU_MOON = MOONS.find(({ id }) => id === 'moon')!.mu!;
const add = (a: number[], b: readonly number[]) => {
  a[0]! += b[0]!;
  a[1]! += b[1]!;
  a[2]! += b[2]!;
};
const heightOf = (r: readonly number[]) =>
  bodyFixedToGeodetic(r[0]!, r[1]!, r[2]!, A, E_SQUARED).h;

/**
 * **Propagate a satellite numerically** with a force model: Cowell's method,
 * stepping the equations of motion with the forces you choose, for the "what
 * if" questions SGP4 can't answer: a different mass or drag area, higher
 * solar activity, or a manoeuvre.
 *
 * $$
 * \ddot{\mathbf r} = -\frac{\mu}{r^3}\mathbf r
 * + \mathbf a_{J_2 \ldots J_6}
 * + \mathbf a_{\odot} + \mathbf a_{☾}
 * - \frac{\rho\,v_{\text{rel}}}{2\beta}\,\mathbf v_{\text{rel}}
 * + \mathbf a_{\text{SRP}}
 * $$
 *
 * Where:
 * - $ \mu $ is Earth's gravitational parameter and $ J_2 \ldots J_6 $ its zonal harmonics, from EGM2008
 * - $ \mathbf a_\odot, \mathbf a_☾ $ are the Sun's and the Moon's tidal pulls, from {@link sunPosition} and {@link moonPosition} in `@interstellar-tools/equations`
 * - $ \rho $ is the air density, $ \beta $ the ballistic coefficient, and $ \mathbf v_{\text{rel}} = \mathbf v - \boldsymbol\omega_\oplus \times \mathbf r $ the velocity through the air, which turns with Earth
 * - $ \mathbf a_{\text{SRP}} $ is sunlight's push, off in Earth's shadow and halved in its penumbra
 *
 * **Units**
 * - Inputs: `r` in **m** and `v` in **m/s**, on Earth-centred inertial axes with z along Earth's axis, such as TEME.
 * - Output: an ephemeris of samples in **m** and **m/s**, on the same axes.
 *
 * ::: info Notes
 *
 * - **It isn't a high-fidelity tool** such as GMAT or Orekit: no full
 *   gravity field, no Earth orientation data, and low-precision Sun and Moon.
 *   It answers how forces change an orbit over days to months, to within the
 *   uncertainty of the air density, which is usually the largest.
 * - **The axes are treated as inertial**: TEME, the frame SGP4 works in, or
 *   another Earth-centred frame of the date. Over months, the slow turning of
 *   Earth's axis, precession, adds up to arcminutes.
 * - **It ends at re-entry**, 100 km up, where the satellite is minutes from
 *   coming down: the last sample is there.
 * - The samples come every `step` seconds, from `from` to `to`; interpolate
 *   between them with {@link stateAt}, or fit SGP4 elements to them with
 *   {@link fitElements}.
 * - A manoeuvre at the moment of a sample shows in that sample.
 * - **The air density** is the exponential model's average by default. For
 *   solar activity, pass `nrlmsise00` from `@interstellar-tools/equations`
 *   with forecast space weather, as in the example: it gets the point under
 *   the satellite, on the WGS 84 ellipsoid, and the moment.
 *
 * :::
 *
 * @param state - The position `r` in **m** and velocity `v` in **m/s** at `from`, Earth-centred and inertial.
 * @param from - The moment of the state, as a `Date`.
 * @param to - The moment to propagate to, as a `Date` after `from`.
 * @param options - `step`, the time between samples in **s**; `forces`; `integrator`; and `manoeuvres`.
 * @returns An ephemeris centred on `'EARTH'`, in the frame `'TEME'` and the time scale `'UTC'`, with a sample every `step` seconds.
 * @throws {TypeError} If `r` or `v` is not three finite numbers, a date is not a valid `Date`, or an option is not a finite number or a function where it should be.
 * @throws {RangeError} If `to` isn't after `from`, a step, coefficient or tolerance is not > 0, or a manoeuvre is outside the span.
 * @group Satellites
 *
 * @example
 * ```ts
 * // A 1U CubeSat 400 km up, a week with drag, and a boost on day 3
 * const from = new Date('2026-11-05T00:00:00Z');
 * const ephemeris = propagateNumerically(
 *   propagate(cubesat, from),
 *   from,
 *   new Date('2026-11-12T00:00:00Z'),
 *   {
 *     step: 600,
 *     forces: { drag: { ballisticCoefficient: 60 } },
 *     manoeuvres: [
 *       { epoch: new Date('2026-11-08T00:00:00Z'), deltaV: [0, 1, 0], frame: 'rtn' }
 *     ]
 *   }
 * );
 *
 * stateAt(ephemeris, new Date('2026-11-10T12:00:00Z')); // { r, v }
 * ```
 *
 * @example
 * ```ts
 * // The air at solar minimum, from NRLMSISE-00, instead of the average
 * const quiet = { f107: 70, f107a: 70, ap: 4 };
 * const density = ({ phi, lambda, h }, date) =>
 *   nrlmsise00(date, h, phi, lambda, quiet).effectiveDensity;
 *
 * propagateNumerically(state, from, to, {
 *   forces: { drag: { ballisticCoefficient: 60, density } }
 * });
 * ```
 *
 * @see {@link propagate}
 * @see {@link fitElements}
 * @see {@link stateAt}
 */
export const propagateNumerically = (
  state: StateVectorInterface,
  from: Date,
  to: Date,
  options: PropagateNumericallyOptionsInterface = {}
): EphemerisInterface => {
  assertVector('r', state?.r);
  assertVector('v', state?.v);

  const start = assertDate('from', from);
  const end = assertDate('to', to);

  if (end <= start)
    throw new RangeError(
      `to must be after from. Received: ${to.toISOString()}, from ${from.toISOString()}`
    );

  const { step = 60, forces = {}, integrator = {}, manoeuvres = [] } = options;
  const {
    zonal = true,
    sun = true,
    moon = true,
    drag,
    solarRadiationPressure: srp
  } = forces;
  const {
    method = 'rk45',
    tolerance = 1e-10,
    step: fixedStep = 10
  } = integrator;
  const J = zonal === true ? EGM2008.J : zonal === false ? [] : zonal;

  for (const [name, x] of [
    ['step', step],
    ['integrator.tolerance', tolerance],
    ['integrator.step', fixedStep],
    ...(drag
      ? [['forces.drag.ballisticCoefficient', drag.ballisticCoefficient]]
      : []),
    ...(srp
      ? [
          ['forces.solarRadiationPressure.Cr', srp.Cr],
          ['forces.solarRadiationPressure.areaToMass', srp.areaToMass]
        ]
      : [])
  ] as [string, number][]) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

    if (x <= 0 && !name.startsWith('forces.solarRadiationPressure'))
      throw new RangeError(`${name} must be > 0. Received: ${x}`);

    if (x < 0) throw new RangeError(`${name} must be >= 0. Received: ${x}`);
  }

  if (method !== 'rk45' && method !== 'rk4')
    throw new RangeError(
      `integrator.method must be 'rk45' or 'rk4'. Received: ${String(method)}`
    );

  if (drag?.density !== undefined && typeof drag.density !== 'function')
    throw new TypeError(
      'forces.drag.density must be a function of a point and a moment.'
    );

  // Seconds from `from`
  const burns = manoeuvres
    .map((burn, k) => {
      const at = assertDate(`manoeuvres[${k}].epoch`, burn?.epoch);

      assertVector(`manoeuvres[${k}].deltaV`, burn.deltaV);

      if (at < start || at > end)
        throw new RangeError(
          `manoeuvres[${k}].epoch must be within from and to. Received: ${burn.epoch.toISOString()}`
        );

      if (
        burn.frame !== undefined &&
        burn.frame !== 'inertial' &&
        burn.frame !== 'rtn'
      )
        throw new RangeError(
          `manoeuvres[${k}].frame must be 'inertial' or 'rtn'. Received: ${String(burn.frame)}`
        );

      return { t: (at - start) / 1000, burn };
    })
    .sort((a, b) => a.t - b.t);
  const density =
    drag?.density ??
    ((point: GeodeticCoordinatesInterface) =>
      exponentialAtmosphereDensity(point.h));
  const f: OdeRightHandSideType = (t, y) => {
    const r = [y[0]!, y[1]!, y[2]!] as Vector3DTupleType;
    const v = [y[3]!, y[4]!, y[5]!];
    const distance = Math.hypot(...r);
    const a = r.map((x) => (-EGM2008.mu * x) / distance ** 3);
    const date = new Date(start + t * 1000);

    if (J.length > 0)
      add(a, zonalHarmonicsAcceleration(r, EGM2008.mu, EGM2008.radius, J));

    const sunAt = sun || srp ? sunPosition(date).r : undefined;

    if (sun) add(a, thirdBodyAcceleration(r, sunAt!, MU_SUN));

    if (moon) add(a, thirdBodyAcceleration(r, moonPosition(date).r, MU_MOON));

    if (drag) {
      const relative = [
        v[0]! + OMEGA_EARTH * r[1],
        v[1]! - OMEGA_EARTH * r[0],
        v[2]!
      ];
      const speed = Math.hypot(...relative);
      const fixed = temeToEarthFixed({ r, v: [0, 0, 0] }, date).r;
      const point = bodyFixedToGeodetic(
        fixed[0],
        fixed[1],
        fixed[2],
        A,
        E_SQUARED
      );
      const rho = density(point, date);

      if (!(Number.isFinite(rho) && rho >= 0))
        throw new RangeError(
          `forces.drag.density must give a finite number >= 0. Received: ${rho} at ${point.h} m`
        );

      const scale = (-rho * speed) / (2 * drag.ballisticCoefficient);

      add(
        a,
        relative.map((x) => scale * x)
      );
    }

    if (srp) {
      const shadow = earthShadow(r, sunAt!);
      const light = shadow === 'sunlit' ? 1 : shadow === 'penumbra' ? 0.5 : 0;

      add(
        a,
        solarRadiationPressureAcceleration(
          r,
          sunAt!,
          srp.Cr,
          srp.areaToMass,
          light
        )
      );
    }

    return [v[0]!, v[1]!, v[2]!, a[0]!, a[1]!, a[2]!];
  };
  const fallen = (_t: number, y: readonly number[]) =>
    heightOf(y) < REENTRY_HEIGHT;
  const total = (end - start) / 1000;
  const outputs: number[] = [];

  for (let t = 0; t < total; t += step) outputs.push(t);

  outputs.push(total);

  const samples: EphemerisSampleInterface[] = [];
  const sample = (t: number, y: readonly number[]) =>
    samples.push({
      epoch: new Date(start + t * 1000),
      r: [y[0]!, y[1]!, y[2]!],
      v: [y[3]!, y[4]!, y[5]!]
    });

  let y = [...state.r, ...state.v];
  let time = 0;
  let next = 0;
  let lastStep = Math.min(step, 60);

  const burnAt = (t: number) => {
    for (const { t: when, burn } of burns)
      if (when === t) {
        let dv = burn.deltaV as readonly number[];

        if (burn.frame === 'rtn') {
          const r = y.slice(0, 3);
          const v = y.slice(3);
          const radial = r.map((x) => x / Math.hypot(...r));
          const h = [
            r[1]! * v[2]! - r[2]! * v[1]!,
            r[2]! * v[0]! - r[0]! * v[2]!,
            r[0]! * v[1]! - r[1]! * v[0]!
          ];
          const normal = h.map((x) => x / Math.hypot(...h));
          const along = [
            normal[1]! * radial[2]! - normal[2]! * radial[1]!,
            normal[2]! * radial[0]! - normal[0]! * radial[2]!,
            normal[0]! * radial[1]! - normal[1]! * radial[0]!
          ];

          dv = [0, 1, 2].map(
            (k) =>
              dv[0]! * radial[k]! + dv[1]! * along[k]! + dv[2]! * normal[k]!
          );
        }

        y = [...y.slice(0, 3), y[3]! + dv[0]!, y[4]! + dv[1]!, y[5]! + dv[2]!];
      }
  };
  // Integrate from event to event: the samples and the burns
  const events = [...new Set([...outputs, ...burns.map(({ t }) => t)])].sort(
    (a, b) => a - b
  );

  for (const t of events) {
    if (t > time) {
      let solution;

      if (method === 'rk45') {
        solution = rk45Integrate(f, y, time, t, {
          tolerance,
          absoluteTolerance: tolerance * 1e4,
          initialStep: Math.min(lastStep, t - time),
          stop: fallen
        });

        const { t: times } = solution;

        if (times.length > 2)
          lastStep = times[times.length - 2]! - times[times.length - 3]!;
      } else
        solution = rk4Integrate(
          f,
          y,
          time,
          t,
          Math.max(1, Math.ceil((t - time) / fixedStep)),
          { stop: fallen }
        );

      const at = solution.t[solution.t.length - 1]!;

      y = solution.y[solution.y.length - 1]!;
      time = at;

      if (at < t) {
        sample(at, y);

        break;
      }
    }

    burnAt(t);

    if (outputs[next] === t) {
      sample(t, y);
      next++;
    }
  }

  return { center: 'EARTH', frame: 'TEME', timeScale: 'UTC', samples };
};
